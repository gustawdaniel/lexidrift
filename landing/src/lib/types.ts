// TODO: Move to shared lib
export type Language = "en" | "de" | "es" | "pl" | "ru";

export interface Word {
    word: string;
    count: number;
    lang: Language;
    correctness?: boolean;
}