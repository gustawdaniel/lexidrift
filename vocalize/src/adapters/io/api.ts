import {InputAdapter, SpeakResponse, SpeakSelector} from "../../ports/io.port";
import {FastifyRequest, FastifyReply} from 'fastify';
import Fastify from 'fastify'
import cors from '@fastify/cors'
import {speak} from "../../core/speak";
import {StorageAdapter} from "../../ports/storage.port";
import {LoggerAdapter} from "../../ports/logger.port";
import {getErrorMessage} from "../../core/lib/error";

export class ApiAdapter implements InputAdapter {
    private readonly storage: StorageAdapter;
    private readonly logger: LoggerAdapter;

    constructor(options: {storage: StorageAdapter, logger: LoggerAdapter}){
        this.storage = options.storage;
        this.logger = options.logger;
    }

    async speak(request: SpeakSelector): Promise<SpeakResponse> {
        try {
            const location = await speak(request.lang, request.text, request.style, {logger: this.logger, storage: this.storage});
            return {
                success: true,
                location
            }
        } catch (error) {
            return {success: false, error: getErrorMessage(error)};
        }
    }

    async startServer(port: number) {
        const fastify = Fastify({logger: true});
        await fastify.register(cors, {});

        fastify.post('/speak', async (req: FastifyRequest<{ Body: SpeakSelector }>, reply: FastifyReply) => {
            const response = await this.speak(req.body);
            // reply.status(response.success ? 200 : 400).send(response);
            if (response.success) {
                // todo, improve s3 encoding problem
                // reply.redirect(encodeURI(response.location).replaceAll('?','%3F'))
                reply.status(200).header('content-type', 'application/json').send(response);
            } else {
                reply.status(400).send(response);
            }
        });

        fastify.get('/', async (_req: FastifyRequest, reply: FastifyReply) => {
            reply.status(200).send('Vocalize API 0.0.1');
        });

        // Start the Fastify server
        fastify.listen({host: '0.0.0.0', port}, (err: Error | null, address: string) => {
            if (err) {
                fastify.log.error(err);
                process.exit(1);
            }
            fastify.log.info(`API server running at ${address}`);
        });
    }
}

export async function startApiServer(options: {storage: StorageAdapter, logger: LoggerAdapter}) {
    const adapter = new ApiAdapter(options);
    await adapter.startServer(4000);
}