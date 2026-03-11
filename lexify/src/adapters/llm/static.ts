import {LLMAdapter} from "../../ports/llm.port";
import {LogActionType} from "../../ports/logger.port";

export function createLlmStaticClient(): LLMAdapter {
    return {
        generateText: async (_prompt: string, _actionType: LogActionType): Promise<string> => {
            return `{
  "word": "the",
  "translation": {
    "en": "the",
    "de": "der/die/das",
    "es": "el/la",
    "pl": "ten/tam",
    "ru": "тот/та"
  },
  "definition": {
    "en": "A definite article used to specify a noun as something known or previously mentioned.",
    "de": "Ein bestimmter Artikel, der verwendet wird, um ein Substantiv als etwas Bekanntes oder bereits Erwähntes zu kennzeichnen.",
    "es": "Un artículo definido utilizado para especificar un sustantivo como algo conocido o previamente mencionado.",
    "pl": "Artykuł określony, który służy do wskazania rzeczownika jako czegoś znanego lub wcześniej wspomnianego.",
    "ru": "Определённый артикль, который используется для указания на существительное как на что-то известное или ранее упомянутое."
  },
  "examples": [{
    "part_of_speech": "article",
    "en": "The cat is sleeping on the mat.",
    "de": "Die Katze schläft auf der Matte.",
    "es": "El gato está durmiendo en la alfombra.",
    "pl": "Kot śpi na macie.",
    "ru": "Кошка спит на коврике.",
    "image_prompt": "A cat peacefully sleeping on a mat in a cozy room."
  }]
}`;
        }
    };
}