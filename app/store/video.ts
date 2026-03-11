import type {VideoGenerationSegment} from "~/types/video";
import {useUserStore} from "~/store/user";
import dayjs from "dayjs";

type GeneratedVideoStatus = 'pending' | 'processing' | 'done';

export interface Video {
    id: string;
    url: string;
    segmentsSha1: string;
    words: string[];
    status: GeneratedVideoStatus;
}

import type {KnowledgeListItem} from "~/store/knowledge";
import {useImagifyStore} from "~/store/imagify";
import {useVocalizationStore} from "~/store/vocalization";


export const useVideoStore = defineStore('video', () => {
    const userStore = useUserStore()

    async function prepareVideoSegments(knowledgeList: KnowledgeListItem[]): Promise<VideoGenerationSegment[]> {
        const segments: VideoGenerationSegment[] = [];

        const vocalizationStore = useVocalizationStore();
        const imagifyStore = useImagifyStore();

        const urls = await Promise.all(knowledgeList
            .filter(knowledge => knowledge.definition)
            .map(knowledge => {
                if (!knowledge.definition) return [];
                if (!userStore.user) return [];

                const wordToLearn = knowledge.definition.word;
                const wordTranslation = knowledge.definition.translation[userStore.user.language];

                const sentenceToLearn = knowledge.definition.examples[0][userStore.user.defaultLanguageToLearn];
                const sentenceTranslation = knowledge.definition.examples[0][userStore.user.language];

                const imagePrompt = knowledge.definition.examples[0].image_prompt;

                segments.push(...[{
                    audioUrl: '',
                    imageUrl: '',
                    text: wordToLearn,
                    highlight: wordToLearn
                },{
                    audioUrl: '',
                    imageUrl: '',
                    text: wordTranslation,
                    highlight: wordTranslation
                },{
                    audioUrl: '',
                    imageUrl: '',
                    text: sentenceToLearn,
                    highlight: wordToLearn
                },{
                    audioUrl: '',
                    imageUrl: '',
                    text: sentenceTranslation,
                    highlight: wordTranslation
                }])

                return [
                    vocalizationStore.getAudioUrl(userStore.user.defaultLanguageToLearn, wordToLearn),
                    vocalizationStore.getAudioUrl(userStore.user.language, wordTranslation),
                    vocalizationStore.getAudioUrl(userStore.user.defaultLanguageToLearn, sentenceToLearn),
                    vocalizationStore.getAudioUrl(userStore.user.language, sentenceTranslation),
                    imagifyStore.imagify(imagePrompt),
                ]
            }).flat());

        const images: string[] = []
        const audios: string[] = []

        for (let i = 0; i < urls.length; i++) {
            if (i % 5 === 4) {
                images.push(...new Array(4).fill(urls[i]));
            } else {
                audios.push(urls[i]);
            }
        }

        for(let i = 0; i < audios.length; i++) {
            const audioUrl = audios[i];
            const imageUrl = images[i];
            segments[i] = {
                audioUrl,
                imageUrl,
                text: segments[i].text,
                highlight: segments[i].highlight
            }
        }

        return segments;
    }

    async function requestVideoGeneration(segments: VideoGenerationSegment[]) {
        if (!userStore.user) throw new Error('No user');

        await $fetch('/video/request', {
            method: 'POST',
            body: JSON.stringify({
                learningLanguage: userStore.user.defaultLanguageToLearn,
                nativeLanguage: userStore.user.language,
                segments
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userStore.token}`
            },
            baseURL: import.meta.env.VITE_API_URL
        })
    }

    async function getVideos() {
        if (!userStore.user) return [];

        return $fetch<Video[]>('/videos', {
            params: {
                learningLanguage: userStore.user.defaultLanguageToLearn,
                nativeLanguage: userStore.user.language,
            },
            headers: {
                'Authorization': `Bearer ${userStore.token}`
            },
            baseURL: import.meta.env.VITE_API_URL
        })
    }

    return {
        prepareVideoSegments,
        requestVideoGeneration,
        getVideos
    }
})
