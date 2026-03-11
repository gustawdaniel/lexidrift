import {useUserStore} from "~/store/user";
import type {Language} from "~/types/authTypes";

export interface Measurement {
    totalKnowledgesCount: number;
    newKnowledgeCount: number;
    retrievabilitySum: number;
    newCorrectAnswers: number;
    state: 'current' | 'frozen';
}

export const useMeasurementStore = defineStore('measurementStore', () => {
    const userStore = useUserStore();

    async function doMeasurement(lang: Language, dayOfEpoch?: number) {
        if (!userStore.user) {
            throw new Error('No user');
        }

        const res = await $fetch<Measurement>(`/measurement`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${userStore.token}`,
            },
            baseURL: import.meta.env.VITE_API_URL,
            params: {
                lang,
                dayOfEpoch,
            }
        });

        return res;
    }

    return {
        doMeasurement,
    };
});