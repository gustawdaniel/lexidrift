import {Language, Style} from "../core/types";
import {DefinitionRecord} from "./definition.port";

export interface CheckCorrectnessSelector {
    word: string;
    lang: Language;
}

export interface CheckAnswerCorrectnessSelector {
    questionLang: Language,
    answerLang: Language,
    question: string,
    answer: string
}

export interface DefinitionSelector extends CheckCorrectnessSelector {
    style: Style;
}

export interface SuccessDefinitionResponse {
    success: true;
    definition: DefinitionRecord;
}

export interface WordRecord {
    word: string;
    lang: Language;
    rank: number;
}

export interface CorrectWordRecord extends WordRecord {
    correctness: true;
}

export interface IncorrectWordRecord extends WordRecord {
    correctness: false;
}

export type WordWithCorrectnessChecked = CorrectWordRecord | IncorrectWordRecord;

export interface SuccessCorrectnessResponse {
    success: true;
    correctness: WordWithCorrectnessChecked;
}

export interface AnswerCorrectness {
    correct: boolean,
    feedback: string
}

export interface SuccessAnswerCorrectnessResponse {
    success: true;
    correctness: AnswerCorrectness;
}

export interface ErrorResponse {
    success: false;
    error: string;
}

export type DefinitionResponse = SuccessDefinitionResponse | ErrorResponse;
export type CorrectnessResponse = SuccessCorrectnessResponse | ErrorResponse;
export type AnswerCorrectnessResponse = SuccessAnswerCorrectnessResponse | ErrorResponse;

// Input port interface
export interface InputAdapter {
    defineWord(request: DefinitionSelector): Promise<DefinitionResponse>;
    checkWordCorrectness(request: CheckCorrectnessSelector): Promise<CorrectnessResponse>;
}