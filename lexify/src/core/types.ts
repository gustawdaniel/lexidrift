// Shared enums and types
export type Language = "en" | "de" | "es" | "pl" | "ru";
export type LanguageVocative = "English" | "German" | "Spanish" | "Polish" | "Russian";

export type Style =
    'wordup'
    | 'wolfram'
    | 'diki'
    | 'oxford'
    | 'cambridge'
    | 'merriam_webster'
    | 'urban'
    | 'etymological'
    | 'learners'
    | 'scientific'
    | 'literary';

export interface AppError {
    message: string;
    status: number;
}
