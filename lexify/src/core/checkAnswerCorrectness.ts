import {Language} from "./types";
import {
    AnswerCorrectness,
    AnswerCorrectnessResponse,
    CheckAnswerCorrectnessSelector,
    CheckCorrectnessSelector
} from "../ports/io.port";
import {WordAdapter} from "../ports/word.port";
import {LLMAdapter} from "../ports/llm.port";
import {LoggerAdapter} from "../ports/logger.port";
import {getLanguageVocative} from "./helpers/llm/getLanguageVocative";
import {DefinitionAdapter} from "../ports/definition.port";
import z from "zod";
import {normalizeLLMToJson} from "./helpers/llm/normalizeLLMToJson";

function renderPrompt(selector: CheckAnswerCorrectnessSelector): string {
    return `Is the ${getLanguageVocative(selector.answerLang)} word "${selector.answer}" a correct translation of the ${getLanguageVocative(selector.questionLang)} word "${selector.question}"? Respond in JSON format:

{
  "correct": true | false,
  "feedback": "Brief explanation of why the translation is correct or incorrect."
}`
}

const answerCorrectnessValidator = z.object({
    correct: z.boolean(),
    feedback: z.string(),
});


export async function checkAnswerCorrectness(selector: CheckAnswerCorrectnessSelector, options: {
    definitionStorage: DefinitionAdapter,
    llmClient: LLMAdapter,
    logger: LoggerAdapter,
}): Promise<AnswerCorrectness> {
    if(!selector.question) {
        return {
            correct: false,
            feedback: 'No question'
        };
    }
    if(!selector.answer) {
        return {
            correct: false,
            feedback: 'No answer'
        };
    }
    if(!selector.questionLang) {
        return {
            correct: false,
            feedback: 'No question language'
        };
    }
    if(!selector.answerLang) {
        return {
            correct: false,
            feedback: 'No answer language'
        };
    }

    const llmResponse = await options.llmClient.generateText(
        renderPrompt(selector), 'answer.check'
    );
    const cleanedLlmResponse = normalizeLLMToJson(llmResponse);

    console.log('cleanedLlmResponse', cleanedLlmResponse);

    const uncheckedAnswerCorrectness = JSON.parse(cleanedLlmResponse);

    const answerCorrectness = answerCorrectnessValidator.parse(uncheckedAnswerCorrectness)

    console.log('answerCorrectness', answerCorrectness);

    if (answerCorrectness.correct) {
        await options.definitionStorage.addTranslation({
            word: selector.question,
            lang: selector.questionLang,
        }, {
            word: selector.answer,
            lang: selector.answerLang,
        });
    }

    return answerCorrectness;
}