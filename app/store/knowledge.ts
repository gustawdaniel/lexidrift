import type {Language} from "~/types/authTypes";
import {useUserStore} from "~/store/user";
import type {Definition} from "~/store/definition";

interface KnowledgeListFilter {
    limit?: number;
    offset?: number;
    withDefinition?: boolean;
}

export interface KnowledgeListItem {
    id?: string;
    definitionId?: string;
    knowledge?: number;
    lang: Language;
    rank: number;
    fsrs?: Fsrs
    definition?: Pick<Definition, 'word' | 'translation' | 'examples'>;
    correctness?: boolean;
    word?: string;
}

export interface Fsrs {
    stability: number,
    difficulty: number,
    nextQuestionAt: string
    lastQuestionAt: string
}

export interface FullKnowledge {
    createdAt: string
    definitionId: string
    id: string
    knowledge: number
    lang: Language
    rank: number
    fsrs: Fsrs
    updatedAt: string
    userId: string
}

export const useKnowledgeStore = defineStore('knowledgeStore', () => {
    const userStore = useUserStore();

    const knowledgeList = ref<Array<KnowledgeListItem>>([]);


    const getKnowledgeList = async (lang: Language, filter?: KnowledgeListFilter) => {
        const offset = filter?.offset ?? 0;
        const limit = filter?.limit ?? 100;
        const withDefinition = filter?.withDefinition ?? false;

        const response = await $fetch<Array<KnowledgeListItem>>(`/knowledge/${lang}`, {
            method: 'GET',
            query: {
                limit,
                offset,
                withDefinition: withDefinition ? '1' : '0',
            },
            baseURL: import.meta.env.VITE_API_URL,
            headers: new Headers(userStore.token ? {Authorization: userStore.token} : {}),
        });


        knowledgeList.value = new Array(limit).fill(null).map((_, index): KnowledgeListItem => {
            const rank = offset + index + 1;


            const knowledge = response.find((item) => item.rank === rank) ?? null;
            if (knowledge) {
                return knowledge;
            }

            return {
                id: undefined,
                definitionId: undefined,
                knowledge: undefined,
                lang,
                rank,
            };
        });
    };

    async function setKnowledge(knowledge: KnowledgeListItem, definition: Definition, knowledgeValue: number) {
        const response = await $fetch<KnowledgeListItem>(
            ['/knowledge', knowledge.id].filter(Boolean).join('/'),
            {
                method: 'PUT',
                body: {
                    // TODO: fix and set id instead of _id
                    // @ts-ignore
                    definitionId: definition._id ?? definition.id,
                    knowledge: knowledgeValue,
                    lang: knowledge.lang,
                    rank: knowledge.rank,
                },
                baseURL: import.meta.env.VITE_API_URL,
                headers: new Headers(userStore.token ? {Authorization: userStore.token} : {}),
            }
        );

        const index = knowledgeList.value.findIndex((item) => item.rank === knowledge.rank);
        knowledgeList.value[index] = response;
    }

    return {
        knowledgeList,
        getKnowledgeList,
        setKnowledge,
    };
});