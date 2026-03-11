import {Language} from "@prisma/client";
import {prisma} from "../../src/db";

export async function seedDefinition() {
    const words = ['new', 'old', 'known'];
    let index = 0;

    for (const word of words) {
        await prisma.definitions.create({
            data: {
                word: word,
                lang: Language.en,
                translation: {
                    en: 'en' + word,
                    pl: 'pl' + word,
                    de: 'de' + word,
                    ru: 'ru' + word,
                    es: 'es' + word,
                },
                style: 'wordup',
                rank: index + 1,
                definition: {
                    en: 'en' + word,
                    pl: 'pl' + word,
                    de: 'de' + word,
                    ru: 'ru' + word,
                    es: 'es' + word,
                },
                examples: [
                    {
                        part_of_speech: 'noun',
                        pl: 'pl' + word,
                        en: 'en' + word,
                        de: 'de' + word,
                        ru: 'ru' + word,
                        es: 'es' + word,
                        image_prompt: word,
                    }
                ],
            }
        });
        index++;
    }
}