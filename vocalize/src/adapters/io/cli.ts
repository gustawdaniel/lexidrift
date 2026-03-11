import {InputAdapter, SpeakResponse, SpeakSelector, SpeakStyle} from "../../ports/io.port";
import {Language} from "../../core/types";
import {speak} from "../../core/speak";
import {StorageAdapter} from "../../ports/storage.port";
import {LoggerAdapter} from "../../ports/logger.port";
import {getErrorMessage} from "../../core/lib/error";

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

function getSpeakStyle(input: string | undefined): SpeakStyle {
    switch (input) {
        case 'gtts':
            return 'gtts';
        default:
            throw new Error(`Unknown speak style: ${input}`);
    }
}

type Command = 'speak';

function getCommand(input: string | undefined): Command {
    switch (input) {
        case 'speak':
            return 'speak';
        default:
            throw new Error(`Unknown command: ${input}`);
    }
}

export class CliAdapter implements InputAdapter {
    private readonly storage: StorageAdapter;
    private readonly logger: LoggerAdapter;

    constructor(options: {storage: StorageAdapter, logger: LoggerAdapter}) {
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
}

export async function startCliInterface(options: {storage: StorageAdapter, logger: LoggerAdapter}) {
    const adapter = new CliAdapter(options);
    const command = getCommand(process.argv[3]);
    if (command === 'speak') {
        const response = await adapter.speak({
            lang: getLanguage(process.argv[4] ?? "en"),
            text: process.argv[5] ?? "test",
            style: getSpeakStyle(process.argv[6] ?? "gtts")
        });

        console.log(JSON.stringify(response, null, 2));
    }
}