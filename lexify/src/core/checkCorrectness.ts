import {Language, LanguageVocative} from "./types";
import {WordAdapter} from "../ports/word.port";
import {LLMAdapter} from "../ports/llm.port";
import {LoggerAdapter} from "../ports/logger.port";
import {CheckCorrectnessSelector, WordWithCorrectnessChecked} from "../ports/io.port";
import {normalizeLLYesBoToBoolean} from "./helpers/llm/normalizeLLYesBoToBoolean";
import { getLanguageVocative } from "./helpers/llm/getLanguageVocative";


function renderPrompt(selector: CheckCorrectnessSelector): string {
    return `Is word "${selector.word}" correct word in ${getLanguageVocative(selector.lang).toLocaleLowerCase()} language?

Answer only yes or no.`;
}

export async function checkCorrectness(word: string, language: Language, options: {
    wordStorage: WordAdapter, llmClient: LLMAdapter, logger: LoggerAdapter
}): Promise<WordWithCorrectnessChecked> {
    const startTime = Date.now();
    const selector: CheckCorrectnessSelector = {word, lang: language};

    const existingWordRecord = await options.wordStorage.find(selector);
    console.log('existingWordRecord', existingWordRecord);

    if (!existingWordRecord) {
        throw new Error(`Word ${word} does not exist in ${language}.`);
    }

    if ('correctness' in existingWordRecord) {
        options.logger.logCacheHit(JSON.stringify(selector), 'check.mongo', 'dev', Date.now() - startTime);
        return existingWordRecord;
    }

    const llmResponse = await options.llmClient.generateText(
        renderPrompt(selector), 'check'
    );
    const cleanedLlmResponse: boolean = normalizeLLYesBoToBoolean(llmResponse);

    await options.wordStorage.update(selector, {correctness: cleanedLlmResponse});

    return {
        ...existingWordRecord,
        correctness: cleanedLlmResponse
    };
}