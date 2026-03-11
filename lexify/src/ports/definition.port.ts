import {Language, Style} from "../core/types";

export interface DefinitionExample extends Record<Language, string> {
    "part_of_speech": string,
    "image_prompt": string
}

export interface Definition {
    "word": string,
    "translation": Record<Language, string>,
    "definition": Record<Language, string>,
    "examples": DefinitionExample[],
    rank: number
}

export interface DefinitionRecord  extends Definition {
    "lang": Language,
    "style": Style
}

export interface PlainDefinitionSelector {
    "word": string,
    "lang": Language,
}

export interface SingleLanguageTranslation {
    "word": string,
    "lang": Language,
}

export interface DefinitionSelector {
    "word": string,
    "lang": Language,
    "style": Style,
}

export interface DefinitionAdapter {
    save(request: DefinitionRecord): Promise<void>;
    addTranslation(selector: PlainDefinitionSelector, translation: SingleLanguageTranslation): Promise<void>
    find(request: DefinitionSelector): Promise<DefinitionRecord | null>;
}