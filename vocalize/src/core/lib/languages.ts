import type {Language} from "../types";

export const languages: Language[] = ["en", "de", "es", "pl", "ru"];

export function isLanguage(lang: string): lang is Language {
    return Boolean(languages.find((l) => l === lang));
}

export function stringToLanguage(lang: string): Language {
    const found = languages.find((l) => l === lang);
    if (!found) {
        throw new Error(
            `Language not supported, get one of: ${
                languages.join(", ")
            }.`,
        );
    }

    return found;
}