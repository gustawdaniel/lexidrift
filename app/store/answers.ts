import type {Language, User} from "~/types/authTypes";
import {$fetch} from "ofetch";
import {useUserStore} from "~/store/user";

const lexifyUrl = 'https://lexify.lexidrift.com';

export interface WrongTextAnswerTranslation {
    "distance": number,
    "id": string,
    "rank": number,
    "word": string
}

interface FeedbackFilter {
    questionLang: Language,
    answerLang: Language,
    question: string,
    answer: string
}

type SuccessCorrectnessCheckResponse = {
    success: true,
    correctness: {
        correct: boolean,
        feedback: string
    }
}
type ErrorCorrectnessCheckResponse = {
    success: false,
    error: string
}

type CorrectnessCheckResponse = SuccessCorrectnessCheckResponse | ErrorCorrectnessCheckResponse

export const useAnswersStore = defineStore('answers', () => {
    const userStore = useUserStore();

    const definedFeedbackAfterWrongTextAnswerLoading = ref<boolean>(false);
    const newFeedbackAfterWrongTextAnswerLoading = ref<boolean>(false);
    const checkIfMyAnswerWasCorrectLoading = ref<boolean>(false);


    async function getDefinedFeedbackAfterWrongTextAnswer(filter: FeedbackFilter): Promise<WrongTextAnswerTranslation[]> {
        try {
            definedFeedbackAfterWrongTextAnswerLoading.value = true;

            return await $fetch<WrongTextAnswerTranslation[]>(`/defined-feedback-after-wrong-text-answer`, {
                method: 'POST',
                body: JSON.stringify(filter),
                baseURL: import.meta.env.VITE_API_URL,
                headers: new Headers(userStore.token ? {Authorization: userStore.token} : {}),
            });
        } finally {
            definedFeedbackAfterWrongTextAnswerLoading.value = false;
        }
    }

    async function getNewFeedbackAfterWrongTextAnswer(filter: FeedbackFilter): Promise<WrongTextAnswerTranslation[]> {
        try {
            newFeedbackAfterWrongTextAnswerLoading.value = true;

            return await $fetch<WrongTextAnswerTranslation[]>(`/new-feedback-after-wrong-text-answer`, {
                method: 'POST',
                body: JSON.stringify(filter),
                baseURL: import.meta.env.VITE_API_URL,
                headers: new Headers(userStore.token ? {Authorization: userStore.token} : {}),
            });
        } finally {
            newFeedbackAfterWrongTextAnswerLoading.value = false;
        }
    }

    async function checkIfMyAnswerWasCorrect(filter: FeedbackFilter): Promise<CorrectnessCheckResponse> {
        try {
            checkIfMyAnswerWasCorrectLoading.value = true;

            return await $fetch<CorrectnessCheckResponse>(`/check-if-my-answer-was-correct`, {
                method: 'POST',
                body: JSON.stringify(filter),
                baseURL: import.meta.env.VITE_LEXIFY_URL,
                headers: new Headers(userStore.token ? {Authorization: userStore.token} : {}),
            });
        } finally {
            checkIfMyAnswerWasCorrectLoading.value = false;
        }
    }

    return {
        definedFeedbackAfterWrongTextAnswerLoading,
        newFeedbackAfterWrongTextAnswerLoading,
        checkIfMyAnswerWasCorrectLoading,

        getDefinedFeedbackAfterWrongTextAnswer,
        getNewFeedbackAfterWrongTextAnswer,
        checkIfMyAnswerWasCorrect
    }
});