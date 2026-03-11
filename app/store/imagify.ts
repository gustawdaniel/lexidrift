interface ImagifyImage {
    image: string;
}

export const useImagifyStore = defineStore("imagifyStore", () => {
    const config = useRuntimeConfig();

    const style = 'cyberpunk magenta';
    const imagifyUrl = 'https://imagify.lexidrift.com';

    async function imagify(prompt: string): Promise<string> {
        const link = await $fetch<ImagifyImage>(`/imagine`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({prompt, style}),
                baseURL:imagifyUrl,
            });

        return link.image;
    }

    return {imagify};
});