import {useVocalizationStore} from "~/store/vocalization";
import type {KnowledgeListItem} from "~/store/knowledge";
import {useUserStore} from "~/store/user";
import dayjs from "dayjs";

export const useAudioStore = defineStore('audio', () => {
    const vocalizationStore = useVocalizationStore();
    const userStore = useUserStore();

    async function prepareWavUrls(knowledgeList: KnowledgeListItem[]): Promise<string[]> {
        return Promise.all(knowledgeList
            .filter(knowledge => knowledge.definition)
            .map(knowledge => {
                if (!knowledge.definition) return [];
                if (!userStore.user) return [];

                console.log('knowledge', !knowledge.fsrs || !knowledge.fsrs.nextQuestionAt || knowledge.fsrs.nextQuestionAt);

                const wordToLearn = knowledge.definition.word;
                const wordTranslation = knowledge.definition.translation[userStore.user.language];

                const sentenceToLearn = knowledge.definition.examples[0][userStore.user.defaultLanguageToLearn];
                const sentenceTranslation = knowledge.definition.examples[0][userStore.user.language];

                const imagePrompt = knowledge.definition.examples[0].image_prompt;


                return [
                    vocalizationStore.getAudioUrl(userStore.user.defaultLanguageToLearn, wordToLearn),
                    vocalizationStore.getAudioUrl(userStore.user.language, wordTranslation),
                    vocalizationStore.getAudioUrl(userStore.user.defaultLanguageToLearn, sentenceToLearn),
                    vocalizationStore.getAudioUrl(userStore.user.language, sentenceTranslation),
                ]
            }).flat());
    }

    async function mergeWavFilesFromUrls(urls: readonly string[]): Promise<void> {
        // @ts-expect-error
        const audioContext: AudioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Fetch and decode all WAV files
        const buffers: AudioBuffer[] = await Promise.all(
            urls.map(async (url): Promise<AudioBuffer> => {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                return await audioContext.decodeAudioData(arrayBuffer);
            })
        );

        // Calculate total duration and create a new buffer
        const totalLength = buffers.reduce((sum, buf) => sum + buf.length, 0);
        const sampleRate = buffers[0].sampleRate;
        const mergedBuffer = audioContext.createBuffer(1, totalLength, sampleRate);

        // Copy each buffer into the new buffer
        let offset = 0;
        buffers.forEach((buf) => {
            mergedBuffer.getChannelData(0).set(buf.getChannelData(0), offset);
            offset += buf.length;
        });

        // Convert AudioBuffer to WAV and download
        const wavBlob = bufferToWav(mergedBuffer);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(wavBlob);
        link.download = "merged.wav";
        link.click();
    }

// Converts AudioBuffer to WAV
    function bufferToWav(audioBuffer: AudioBuffer): Blob {
        const numOfChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const format = 1; // PCM
        const bitDepth = 16;
        const samples = new Int16Array(audioBuffer.getChannelData(0).map(n => Math.max(-1, Math.min(1, n)) * 32767));

        const buffer = new ArrayBuffer(44 + samples.length * 2);
        const view = new DataView(buffer);

        // RIFF chunk descriptor
        writeString(view, 0, "RIFF");
        view.setUint32(4, 36 + samples.length * 2, true);
        writeString(view, 8, "WAVE");

        // fmt subchunk
        writeString(view, 12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, format, true);
        view.setUint16(22, numOfChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numOfChannels * (bitDepth / 8), true);
        view.setUint16(32, numOfChannels * (bitDepth / 8), true);
        view.setUint16(34, bitDepth, true);

        // data subchunk
        writeString(view, 36, "data");
        view.setUint32(40, samples.length * 2, true);

        // Write PCM samples
        for (let i = 0; i < samples.length; i++) {
            view.setInt16(44 + i * 2, samples[i], true);
        }

        return new Blob([buffer], {type: "audio/wav"});
    }

// Writes a string into the DataView
    function writeString(view: DataView, offset: number, string: string): void {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    return {
        prepareWavUrls,
        mergeWavFilesFromUrls
    }
})