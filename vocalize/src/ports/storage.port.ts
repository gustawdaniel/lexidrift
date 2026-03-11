export interface StorageResponse {
    location: string;
}

export abstract class StorageAdapter {
    abstract get(key: string): Promise<StorageResponse | undefined>;
    abstract set(key: string, value: Uint8Array): Promise<StorageResponse>;
}
