import {defineStore} from 'pinia';
import {useUserStore} from "~/store/user";
import type {Language} from "~/types/authTypes";

export interface Word {
    id: string;
    word: string;
    count: number;
    lang: Language;
    rank: number;
    correctness?: boolean;
}

export interface WordsFilter {
    lang?: string;
    limit?: number;
    offset?: number;
}

export interface SearchWordsFilter {
    lang: string;
    search: string;
}

function sanitizeFilter(filter?: WordsFilter | SearchWordsFilter): Record<string, string> {
    if (!filter) return {};

    return {
        ...{...filter.lang ? {lang: filter.lang} : {}},
        ...{...'search' in filter && filter.search ? {search: filter.search} : {}},
        ...{...'limit' in filter && filter.limit && filter.limit > 0 ? {limit: String(filter.limit)} : {}},
        ...{...'offset' in filter && filter.offset && filter.offset > 0 ? {offset: String(filter.offset)} : {}},
    };
}

export const useWordsStore = defineStore('wordsStore', (): {
    words: Ref<Word[]>;
    fetchWords: (filter?: WordsFilter) => Promise<void>;
    searchWords: (filter: SearchWordsFilter) => Promise<Word[]>;
    selectedWordIndex: Ref<number | null>; // 0 - 99
    selectedWordOffset: Ref<number>; // 0, 100, 200, 300, 400, 500
    selectedWord: ComputedRef<Word | null>;
} => {
    const words = ref<Word[]>([]);
    const selectedWordIndex = ref<number | null>(null);
    const selectedWordOffset = ref<number>(0);

    const selectedWord = computed(() => selectedWordIndex.value !== null ? words.value[selectedWordIndex.value] : null);

    const userStore = useUserStore();

    async function fetchWords(filter?: WordsFilter) {
        words.value = await $fetch<Word[]>(
            ['/words', wordFilterToQuery(filter)].filter(Boolean).join('?'),
            {
                baseURL: import.meta.env.VITE_API_URL,
                headers: new Headers(userStore.token ? {Authorization: userStore.token} : {}),
            }
        );
        if (words.value.length > 0) {
            selectedWordIndex.value = 0;
        }
    }

    async function searchWords(filter?: SearchWordsFilter) {
        console.log('searchWords', filter);
        console.log('sanitized', wordFilterToQuery(filter));

        return $fetch<Word[]>(
            ['/words', wordFilterToQuery(filter)].filter(Boolean).join('?'),
            {
                baseURL: import.meta.env.VITE_API_URL,
                headers: new Headers(userStore.token ? {Authorization: userStore.token} : {}),
            }
        );
    }

    function wordFilterToQuery(filter?: WordsFilter | SearchWordsFilter): string {
        return new URLSearchParams(sanitizeFilter(filter)).toString()
    }

    return {
        words,
        selectedWordIndex,
        selectedWordOffset,
        selectedWord,

        fetchWords,
        searchWords,
    };
});