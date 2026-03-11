import {LogActionType} from "./logger.port";

export interface LLMAdapter {
    generateText(prompt: string, actionType: LogActionType): Promise<string>;
}