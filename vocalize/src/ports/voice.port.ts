import {SpeakStyle} from "./io.port";

export abstract class VoiceAdapter {
    public code: SpeakStyle;

    protected constructor(code: SpeakStyle) {
        this.code = code;
    }

    abstract speak(lang: string, sentence: string): Promise<Uint8Array>;
}
