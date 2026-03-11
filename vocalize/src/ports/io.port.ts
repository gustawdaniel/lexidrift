import {Language} from "../core/types";

export type SpeakStyle = 'gtts';

export function isSpekaStyle(style: string | undefined): style is SpeakStyle {
    return typeof style === 'string' && ['gtts'].includes(style);
}

export interface SpeakSelector {
    lang: Language
    text: string
    style: SpeakStyle
}

interface SuccessSpeakResponse {
    success: true;
    location: string;
}

export interface ErrorResponse {
    success: false;
    error: string;
}

export type SpeakResponse = SuccessSpeakResponse | ErrorResponse;

export interface InputAdapter {
    speak(request: SpeakSelector): Promise<SpeakResponse>
}