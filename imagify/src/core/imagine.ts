import {StorageAdapter} from "../ports/storage.port";
import {ImageResponse} from "../ports/io.port";
import Together from "together-ai";
import {config} from "./config";
import {Key} from "./helpers/storage/key";
import {LoggerAdapter} from "../ports/logger.port";

function getErrorMessage(e: unknown): string {
    if (e instanceof Error) {
        return e.message;
    } else if (typeof e === "string") {
        return e;
    } else {
        return "Unknown error";
    }
}

export async function imaginePicture(unStyledPrompt: string, style: string, options: {
    storage: StorageAdapter
    logger: LoggerAdapter
}): Promise<ImageResponse> {
    const startTime = Date.now();
    const prompt = `${unStyledPrompt}${style ? `${style} style` : ""}`;
    const model = "black-forest-labs/FLUX.1-schnell";

    const key = Key.compose(model, prompt);
    const exists = await options.storage.get(key);

    if (exists) {
        options.logger.logCacheHit('imagify.s3', 'imagify.s3', key, Date.now() - startTime);
        return {success: true, image: exists.location};
    }

    let clientOptions: ConstructorParameters<typeof Together>[0] = {};

    const client = new Together(clientOptions);
    client.apiKey = config.together.apiKey;

    let response: Together.Images.ImageFile;
    try {
        response = await client.images.create({
            prompt,
            model,
            width: 1024,
            height: 768,
            seed: undefined,
            steps: 3,
            // response_format: "url",
            response_format: "base64",
        });
    } catch (e: unknown) {
        return {success: false, error: getErrorMessage(e)}
    }

    console.log(response.data[0]);

    const base64String = response.data[0].b64_json;
    if (!base64String) {
        return {success: false, error: "No base64 image returned"};
    }
    const buffer = Buffer.from(base64String, 'base64');  // Decode Base64 to Buffer


    // const url = response.data[0].url;
    // if (!url) {
    //     return {success: false, error: "No image URL returned"};
    // }

    const savedImage = await options.storage.set(key, buffer);

    options.logger.logAction(key, 'imagify', 'dev', Date.now() - startTime);

    return {
        success: true,
        image: savedImage.location,
    }
}