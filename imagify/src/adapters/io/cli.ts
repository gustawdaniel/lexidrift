import { imaginePicture } from "../../core/imagine";
import {ImageResponse, ImageSelector, ImageStyle, InputAdapter} from "../../ports/io.port";
import {StorageAdapter} from "../../ports/storage.port";
import {LoggerAdapter} from "../../ports/logger.port";

export class CliAdapter implements InputAdapter {
    private readonly storage: StorageAdapter;
    private readonly logger: LoggerAdapter;

    constructor(options: {
        storage: StorageAdapter,
        logger: LoggerAdapter
    }) {
        this.storage = options.storage;
        this.logger = options.logger;
    }

    async imaginePicture(request: ImageSelector): Promise<ImageResponse> {
       return await imaginePicture(request.prompt, getImageStyle(request.style), {storage: this.storage, logger: this.logger});
    }
}

export function getImageStyle(style: string): ImageStyle {
    switch (style) {
        case "cartoon":
        case "realistic":
        case "abstract":
        case "cyberpunk magenta":
            return style;
        default:
            throw new Error(`Invalid style: "${style}"`);
    }
}

function getPromptArg() {
    const indexOffset = process.argv[3] === '--' ? 1 : 0;
    return process.argv[3 + indexOffset] ?? "a cat";
}

function getStyleArg() {
    const indexOffset = process.argv[3] === '--' ? 1 : 0;
    return process.argv[4 + indexOffset] ?? "cartoon";
}

export async function startCliInterface(options: {
    storage: StorageAdapter,
    logger: LoggerAdapter
}) {
    const adapter = new CliAdapter(options);

    console.log(process.argv);

    const response = await adapter.imaginePicture({
        prompt: getPromptArg() ?? "a cat",
        style: getImageStyle(getStyleArg() ?? "cartoon")
    });

    console.log(JSON.stringify(response, null, 2));
}