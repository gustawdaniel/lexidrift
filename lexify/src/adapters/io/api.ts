import {
    AnswerCorrectness,
    AnswerCorrectnessResponse,
    CheckAnswerCorrectnessSelector,
    CheckCorrectnessSelector,
    CorrectnessResponse,
    DefinitionResponse,
    DefinitionSelector,
    InputAdapter
} from '../../ports/io.port';
import {lexify} from '../../core/lexify';
import {FastifyRequest, FastifyReply} from 'fastify';
import {DefinitionAdapter} from "../../ports/definition.port";
import {LLMAdapter} from "../../ports/llm.port";
import {LoggerAdapter} from "../../ports/logger.port";
import {WordAdapter} from "../../ports/word.port";
import {checkCorrectness} from "../../core/checkCorrectness";
import {checkAnswerCorrectness} from "../../core/checkAnswerCorrectness";
import cors from '@fastify/cors'
import Fastify from 'fastify'

function getMessage(error: any): string {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error) ?? 'Unknown error';
}

export class ApiAdapter implements InputAdapter {
    private readonly definitionStorage: DefinitionAdapter;
    private readonly wordStorage: WordAdapter;
    private readonly llmClient: LLMAdapter;
    private readonly logger: LoggerAdapter;

    constructor(options: {
        definitionStorage: DefinitionAdapter,
        wordStorage: WordAdapter,
        llmClient: LLMAdapter, logger: LoggerAdapter
    }) {
        this.definitionStorage = options.definitionStorage;
        this.wordStorage = options.wordStorage;
        this.llmClient = options.llmClient;
        this.logger = options.logger;
    }

    async defineWord(request: DefinitionSelector): Promise<DefinitionResponse> {
        const startTime = Date.now();

        try {
            const definition = await lexify(request.word, request.lang, request.style, {
                wordStorage: this.wordStorage,
                definitionStorage: this.definitionStorage,
                llmClient: this.llmClient,
                logger: this.logger,
            });
            return {success: true, definition};
        } catch (error) {
            const message = getMessage(error);
            this.logger.logError(request.word, {message, status: 400}, request.word, Date.now() - startTime);
            return {success: false, error: message};
        }
    }

    async checkWordCorrectness(request: CheckCorrectnessSelector): Promise<CorrectnessResponse> {
        try {
            const correct = await checkCorrectness(request.word, request.lang, {
                wordStorage: this.wordStorage,
                llmClient: this.llmClient,
                logger: this.logger,
            });

            return {success: true, correctness: correct};
        } catch (error) {
            return {success: false, error: getMessage(error)};
        }
    }

    async checkIfMyAnswerWasCorrect(request: CheckAnswerCorrectnessSelector): Promise<AnswerCorrectnessResponse> {
        try {
            const correct: AnswerCorrectness = await checkAnswerCorrectness(request, {
                definitionStorage: this.definitionStorage,
                llmClient: this.llmClient,
                logger: this.logger,
            });

            console.log('api.correct', correct);

            return {success: true, correctness: correct};
        } catch (error) {
            console.log('api.correct.error', error);

            return {success: false, error: getMessage(error)};
        }
    }

    async startServer(port: number) {
        const fastify = Fastify({logger: true});
        await fastify.register(cors, {});

        // Define the /define route with types
        fastify.post('/define', async (req: FastifyRequest<{ Body: DefinitionSelector }>, reply: FastifyReply) => {
            const response = await this.defineWord(req.body);
            reply.status(response.success ? 200 : 400).send(response);
        });

        fastify.post('/check', async (req: FastifyRequest<{ Body: CheckCorrectnessSelector }>, reply: FastifyReply) => {
            const response = await this.checkWordCorrectness(req.body);
            reply.status(response.success ? 200 : 400).send(response);
        });

        fastify.post('/check-if-my-answer-was-correct', async (req: FastifyRequest<{ Body: CheckAnswerCorrectnessSelector }>, reply: FastifyReply) => {
            const response = await this.checkIfMyAnswerWasCorrect(req.body);
            reply.status(response.success ? 200 : 400).send(response);
        });

        fastify.get('/', async (_req: FastifyRequest, reply: FastifyReply) => {
            reply.status(200).send('Lexify API 0.0.3');
        });

        // Start the Fastify server
        fastify.listen({host: '0.0.0.0', port}, (err: Error| null, address: string) => {
            if (err) {
                fastify.log.error(err);
                process.exit(1);
            }
            fastify.log.info(`API server running at ${address}`);
        });
    }
}

export async function startApiServer(options: {
    wordStorage: WordAdapter,
    definitionStorage: DefinitionAdapter,
    llmClient: LLMAdapter,
    logger: LoggerAdapter
}) {
    const adapter = new ApiAdapter(options);
    adapter.startServer(3000);
}