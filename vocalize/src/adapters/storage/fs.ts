import {fileExistsFs} from "./helpers/fileExists.fs";
import {StorageAdapter, StorageResponse} from "../../ports/storage.port";
import {writeFile} from "node:fs/promises";

export class FileSystemAdapter extends StorageAdapter {
    async get(key: string): Promise<StorageResponse | undefined> {
        const path = `./static/voice/${key}`;
        if (await fileExistsFs(path)) {
            return { location: `/static/voice/${key}` };
        }
    }

    async set(key: string, value: Uint8Array): Promise<StorageResponse> {
        const path = `./static/voice/${key}`;
        await writeFile(path, value);
        return { location: `/static/voice/${key}` };
    }
}
