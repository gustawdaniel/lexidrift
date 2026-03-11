import {
    CheckCorrectnessSelector, CorrectnessResponse,
    DefinitionResponse,
    DefinitionSelector,
    InputAdapter,
} from "../../ports/io.port";
import {DefinitionAdapter} from "../../ports/definition.port";
import {LLMAdapter} from "../../ports/llm.port";
import {lexify} from "../../core/lexify";
import {Language, Style} from "../../core/types";
import {LoggerAdapter} from "../../ports/logger.port";
import {WordAdapter} from "../../ports/word.port";
import {checkCorrectness} from "../../core/checkCorrectness";

function getMessage(error: any): string {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error) ?? 'Unknown error';
}

export class CliAdapter implements InputAdapter {
    private readonly definitionStorage: DefinitionAdapter;
    private readonly wordStorage: WordAdapter;
    private readonly llmClient: LLMAdapter;
    private readonly logger: LoggerAdapter;

    constructor(options: {
        wordStorage: WordAdapter,
        definitionStorage: DefinitionAdapter,
        llmClient: LLMAdapter,
        logger: LoggerAdapter
    }) {
        this.definitionStorage = options.definitionStorage;
        this.wordStorage = options.wordStorage;
        this.llmClient = options.llmClient;
        this.logger = options.logger;
    }

    async defineWord(request: DefinitionSelector): Promise<DefinitionResponse> {
        try {
            const definition = await lexify(request.word, request.lang, request.style, {
                wordStorage: this.wordStorage,
                definitionStorage: this.definitionStorage,
                llmClient: this.llmClient,
                logger: this.logger,
            });
            return {success: true, definition};
        } catch (error) {
            return {success: false, error: getMessage(error)};
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
}

function getLanguage(input: string | undefined): Language {
    switch (input) {
        case 'en':
            return 'en';
        case 'de':
            return 'de';
        case 'es':
            return 'es';
        case 'pl':
            return 'pl';
        case 'ru':
            return 'ru';
        default:
            throw new Error(`Unknown language: ${input}`);
    }
}

function getStyle(input: string | undefined): Style {
    switch (input) {
        case 'wordup':
            return 'wordup';
        case 'wolfram':
            return 'wolfram';
        case 'diki':
            return 'diki';
        case 'oxford':
            return 'oxford';
        case 'cambridge':
            return 'cambridge';
        case 'merriam_webster':
            return 'merriam_webster';
        case 'urban':
            return 'urban';
        case 'etymological':
            return 'etymological';
        case 'learners':
            return 'learners';
        case 'scientific':
            return 'scientific';
        case 'literary':
            return 'literary';
        default:
            throw new Error(`Unknown style: ${input}`);
    }
}

type Command = 'define' | 'check';

function getCommand(input: string | undefined): Command {
    switch (input) {
        case 'define':
            return 'define';
        case 'check':
            return 'check';
        default:
            throw new Error(`Unknown command: ${input}`);
    }
}

export async function startCliInterface(
    options: {
        wordStorage: WordAdapter,
        definitionStorage: DefinitionAdapter,
        llmClient: LLMAdapter,
        logger: LoggerAdapter
    }) {
    const adapter = new CliAdapter(options);
    const command = getCommand(process.argv[3]);
    if (command === 'define') {
        const response = await adapter.defineWord({
            lang: getLanguage(process.argv[4] ?? "en"),
            word: process.argv[5] ?? "test",
            style: getStyle(process.argv[6] ?? "wordup")
        });

        console.log(JSON.stringify(response, null, 2));
    } else if (command === 'check') {
        const response = await adapter.checkWordCorrectness({
            lang: getLanguage(process.argv[4] ?? "en"),
            word: process.argv[5] ?? "test",
        });

        console.log(JSON.stringify(response, null, 2));
    }
}