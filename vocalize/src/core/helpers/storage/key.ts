import {isSpekaStyle, SpeakStyle} from "../../../ports/io.port";
import {isLanguage} from "../../lib/languages";
import {Language} from "../../types";

// https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
export class Key {
    static compose(style: string, lang: string, text: string): string {
        const encodedText = Buffer.from(text, 'utf-8')
            .toString('base64') // Standard Base64
            .replaceAll('+', '-') // Zamiana + na - (bezpieczne w URL)
            .replaceAll('/', '_') // Zamiana / na _ (bezpieczne w URL)
            .replaceAll('=', ''); // Usunięcie = (niepotrzebne w Base64url)

        return `${style}/${lang}/${encodedText}.wav`;
    }

    static decompose(
        key: string,
    ): { lang: Language; text: string; style: SpeakStyle } {
        const [style, lang, encodedText] = key.replace(/\.wav$/, '').split("/");

        if (!isSpekaStyle(style)) throw new Error(`Not supported voice adapter for ${style}`);
        if (!isLanguage(lang)) throw new Error(`Not supported language: ${lang}`);

        const text = Buffer.from(
            encodedText.replaceAll('-', '+').replaceAll('_', '/'), // Odtwarzamy Base64
            'base64'
        ).toString('utf-8');

        return { lang, style, text };
    }
}
