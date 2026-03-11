import { languages } from "../lib/languages";

export function validateInput(lang: string, text: string): string | undefined {
    if (languages.find((l) => l === lang) === undefined) {
        return `Language not supported, get one of: ${
            languages.join(", ")
        }.`;
    }

    if (text.length > 1000) {
        return `Text too long, max 1000 characters.`;
    }
}
