import {Language, LanguageVocative} from "../../types";

export function getLanguageVocative(language: Language): LanguageVocative {
    switch (language) {
        case 'en':
            return 'English';
        case 'de':
            return 'German';
        case 'es':
            return 'Spanish';
        case 'pl':
            return 'Polish';
        case 'ru':
            return 'Russian';
        default:
            throw new Error(`Unknown language: ${language}`);
    }
}
