import {Language} from "./types";
import {SpeakStyle} from "../ports/io.port";
import {validateInput} from "./validators/validateInput";
import {StorageAdapter} from "../ports/storage.port";
import {LoggerAdapter} from "../ports/logger.port";
import {VoiceAdapter} from "../ports/voice.port";
import {GttsAdapter} from "../adapters/voice/gtts";
import {Key} from "./helpers/storage/key";
import {getErrorMessage} from "./lib/error";

function getVoice(style: SpeakStyle): VoiceAdapter {
    if(style === 'gtts') return new GttsAdapter()
    throw new Error(`Not supported voice adapter for ${style}`);
}

export async function speak(lang: Language, text: string, style: SpeakStyle, options: {storage: StorageAdapter, logger: LoggerAdapter}): Promise<string> {
    const validationError = validateInput(lang, text);
    if (validationError) {
        throw new Error(validationError);
    }

    const voice = getVoice(style);

    const start = Date.now();
    const key = Key.compose(voice.code, lang, text); ///`${speaker.code}/${lang}/${sentence}.wav`;
    const exists = await options.storage.get(key);

    if (exists) {
        options.logger.logCacheHit(key, 'speak.s3', 'dev', Date.now() - start);
        return exists.location;
    }

    try {
        const res = await voice.speak(lang, text);
        options.logger.logAction(key, 'speak.gtts', 'dev', Date.now() - start);
        return (await options.storage.set(key, res)).location;
    } catch (error) {
        options.logger.logError(key, {
            message: getErrorMessage(error),
            status: 500
        }, 'dev', Date.now() - start)
        throw error;
    }
}