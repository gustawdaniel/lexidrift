import type {Language} from "~/types/authTypes";

interface Example {
    part_of_speech: string;
    pl: string;
    en: string;
    de: string;
    ru: string;
    es: string;
    image_prompt: string;
}

interface Translation {
    pl: string;
    en: string;
    de: string;
    ru: string;
    es: string;
}

interface Definition {
    pl: string;
    en: string;
    de: string;
    ru: string;
    es: string;
}

interface WordDefinition {
    translation: Translation;
    definition: Definition;
    examples: Example[];
    id: string;
    word: string;
    lang: Language;
    style: string;
    rank: number;
}

export interface AnswersLog {
    questionAt: Date;
    answerAt: Date;
    timeTakenMs: number;
    hintLevel: number; // 0-1 (0 no hint, 0.25 sentence, 0.5 img, 0.75 definition, 1 translation)
    answer: string;
    correct: boolean;
    correctness: number;
}

interface Fsrs {
    stability: number;
    difficulty: number;
    nextQuestionAt: Date; // TODO check if this is string
    lastQuestionAt: Date;
}

export interface QuestionWithDefinition {
    definitionId: string;
    lang: Language;
    correctInRow: number;
    logs: AnswersLog[];
    definition: WordDefinition;
    fsrs: Fsrs | null;
}