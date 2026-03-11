import {Language, LanguageVocative, Style} from "./types";
import {Definition, DefinitionAdapter, DefinitionRecord, DefinitionSelector} from "../ports/definition.port";
import {LLMAdapter} from "../ports/llm.port";
import z from "zod";
import {normalizeLLMToJson} from "./helpers/llm/normalizeLLMToJson";
import {LoggerAdapter} from "../ports/logger.port";
import {WordAdapter} from "../ports/word.port";
import {checkCorrectness} from "./checkCorrectness";
import { getLanguageVocative } from "./helpers/llm/getLanguageVocative";

function renderPrompt(selector: DefinitionSelector): string {
    // todo: specify that image prompt should emphasise word in the example
    // The photo will be used to determine the meaning of the word by someone who is not familiar with it.
    return `using ${selector.style} style define ${getLanguageVocative(selector.lang).toLocaleLowerCase()} word "${selector.word}", next to definition and example add prompt that ilustrate example in flux model, you can give one ore more examples, respond in json, print only json, nothing more, structure:

{
  "word": "",
  "translation": {
    "en": "",
    "de": "",
    "es": "",
    "pl": "",
    "ru": "",
  },
  "definition": {
    "en": "",
    "de": "",
    "es": "",
    "pl": "",
    "ru": "",
  },
  "examples": [{
    "part_of_speech": "",
    "en": "",
    "de": "",
    "es": "",
    "pl": "",
    "ru": "",
    "image_prompt": ""
  }]
}`;
}

const definitionValidator = z.object({
    word: z.string(),
    translation: z.object({
        en: z.string(),
        de: z.string(),
        es: z.string(),
        pl: z.string(),
        ru: z.string(),
    }),
    definition: z.object({
        en: z.string(),
        de: z.string(),
        es: z.string(),
        pl: z.string(),
        ru: z.string(),
    }),
    examples: z.array(z.object({
        part_of_speech: z.string(),
        en: z.string(),
        de: z.string(),
        es: z.string(),
        pl: z.string(),
        ru: z.string(),
        image_prompt: z.string(),
    })),
    rank: z.number(),
});

export async function lexify(word: string, lang: Language, style: Style, options: {
    wordStorage: WordAdapter,
    definitionStorage: DefinitionAdapter,
    llmClient: LLMAdapter,
    logger: LoggerAdapter
}): Promise<DefinitionRecord> {
    const startTime = Date.now();
    const selector: DefinitionSelector = {word, lang, style};

    const checkedWord = await checkCorrectness(word, lang, {wordStorage: options.wordStorage, llmClient: options.llmClient, logger: options.logger});

    if(!checkedWord.correctness) {
        throw new Error(`Word ${word} is incorrect in ${lang}.`);
    }

    const existingDefinitionRecord = await options.definitionStorage.find(selector);
    console.log('definitionRecord',existingDefinitionRecord);

    if (existingDefinitionRecord) {
        options.logger.logCacheHit(JSON.stringify(selector), 'define.mongo', 'dev', Date.now() - startTime);
        return existingDefinitionRecord;
    }

    const llmResponse = await options.llmClient.generateText(
        renderPrompt(selector), 'define'
    );
    const cleanedLlmResponse = normalizeLLMToJson(llmResponse);
    const uncheckedDefinition = {...JSON.parse(cleanedLlmResponse), rank: checkedWord.rank};

    const definition: Definition = definitionValidator.parse(uncheckedDefinition);
    const newDefinitionRecord: DefinitionRecord = {...definition, ...selector};

    await options.definitionStorage.save(newDefinitionRecord);

    return newDefinitionRecord;
}