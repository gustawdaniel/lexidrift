import {GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { config } from "../../config";
import {fileExistsS3} from "./fileExistsS3";

export interface StorageResponse {
    location: string;
}

export abstract class StorageAdapter {
    abstract get(key: string): Promise<StorageResponse | undefined>;
    abstract set(key: string, value: Uint8Array): Promise<StorageResponse>;
}

const s3config = {
    region: config.S3_REGION,
    accessKeyId: config.S3_ACCESS_KEY_ID,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
    bucket: config.S3_BUCKET_NAME,
    endpoint: config.S3_ENDPOINT_URL,
    dir: config.S3_DIR,
}

type ContentType = "video/mp4";

export class S3Adapter implements StorageAdapter {
    private readonly s3Client: S3Client;
    private readonly base: string;
    private readonly dir: string;

    constructor() {
        this.s3Client = new S3Client({
            region: s3config.region,
            credentials: {
                accessKeyId: s3config.accessKeyId,
                secretAccessKey: s3config.secretAccessKey,
            },
            endpoint: new URL(`https://${s3config.endpoint}`).toString(),
        });

        this.base = `https://${s3config.bucket}.${s3config.endpoint.replace(/^https?:\/\//, "")}`;
        this.dir = s3config.dir
    }

    private s3Key(key: string): string {
        return `${this.dir}/${key}`;
    }

    async get(appKey: string): Promise<StorageResponse | undefined> {
        const key = this.s3Key(appKey);

        const exists = await fileExistsS3(
            this.s3Client,
            s3config.bucket,
            key,
        );

        if(exists) {
            return Promise.resolve({location: `${this.base}/${key}`});
        } else {
            return undefined
        }
    }

    private getContentType(key: string): ContentType {
        switch (key.split('.').pop()) {
            case 'mp4':
                return 'video/mp4';
            default:
                throw new Error(`Invalid file type: "${key}"`);
        }
    }

    async set(appKey: string, value: Uint8Array): Promise<StorageResponse> {
        const key = this.s3Key(appKey);

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: s3config.bucket,
                Key: key,
                Body: value,
                ACL: "public-read",
                ContentType: this.getContentType(key),
            }),
        );

        return Promise.resolve({location: `${this.base}/${key}`});
    }


}