import { VoiceAdapter } from "../../ports/voice.port";
import gtts from "@ilawy/gtts";
import { stringToLanguage, languages } from "../../core/lib/languages";

export class GttsAdapter extends VoiceAdapter {
    constructor() {
        super("gtts");
    }

    async speak(langString: string, sentence: string) {
        const lang = stringToLanguage(langString);

        const buffer: Uint8Array = await gtts(sentence, {
            language: lang,
        });

        return buffer;

        // const res = await fetch(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(sentence)}&tl=${lang}&client=tw-ob`);
        //
        // if(res.status === 200) {
        //     return new Uint8Array(await res.arrayBuffer());
        // } else {
        //     throw new Error(`[${res.status}] Failed to fetch audio from Google TTS: ${res.statusText}`);
        // }
    }
}
