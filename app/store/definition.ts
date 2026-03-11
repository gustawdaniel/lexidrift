import {defineStore} from 'pinia';

export interface Definition {
    // TODO: fix and set id instead of _id
    // id: string;
    _id: string;
    word: string;
    translation: {
        en: string;
        pl: string;
        de: string;
        ru: string;
        es: string;
    };
    definition: {
        en: string;
        pl: string;
        de: string;
        ru: string;
        es: string;
    };
    examples: {
        part_of_speech: string;
        image_prompt: string;
        en: string;
        pl: string;
        de: string;
        ru: string;
        es: string;
    }[];
}

export const useDefinitionStore = defineStore('defineStore', (): {
    getDefinition: (lang: string, word: string) => Promise<Definition | null>
} => {

    async function getDefinition(lang: string, word: string): Promise<Definition | null> {
        const res = await $fetch<{success: boolean, definition: Definition}>('/define', {
            method: 'POST',
            baseURL: import.meta.env.VITE_LEXIFY_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({lang, word, "style": "wordup"})
        });

        if (res.success) {
            return res.definition;
        } else {
            return null;
        }
    }

    return {
        getDefinition
    };
});