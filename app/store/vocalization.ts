export const useVocalizationStore = defineStore("vocalizationStore", () => {
    const vocalizeUrl = 'https://vocalize.lexidrift.com';

    async function getAudioUrl(lang: string, text: string): Promise<string> {
        const link = await $fetch<{location: string}>(`${vocalizeUrl}/speak`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({lang, text, style: 'gtts'}),
                baseURL:vocalizeUrl,
            });

        return link.location;
    }

    async function vocalize(lang: string, text: string): Promise<void> {
        const link = await getAudioUrl(lang, text);

        const audioBlob = await fetch(link).then(res => res.blob());
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        const audioPromise = new Promise<void>((resolve, reject) => {
            audio.addEventListener('error', (e) => {
                reject(e);
            });
            audio.addEventListener('ended', () => {
                resolve();
            });

        });

        await audio.play();

        return audioPromise;
    }

    return {vocalize, getAudioUrl};
});