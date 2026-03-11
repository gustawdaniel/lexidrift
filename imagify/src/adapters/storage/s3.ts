import {StorageAdapter, StorageResponse} from "../../ports/storage.port";
import {GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {config} from "../../core/config";
import {fileExistsS3} from "./helpers/fileExists.s3";

type ContentType = "image/jpeg";

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html
export class S3Adapter implements StorageAdapter {
    private readonly s3Client: S3Client;
    private readonly base: string;
    private readonly dir: string;

    constructor() {
        this.s3Client = new S3Client({
            region: config.s3.region,
            credentials: {
                accessKeyId: config.s3.accessKeyId,
                secretAccessKey: config.s3.secretAccessKey,
            },
            endpoint: new URL(`https://${config.s3.endpoint}`).toString(),
        });

        this.base = `https://${config.s3.bucket}.${config.s3.endpoint.replace(/^https?:\/\//, "")}`;
        this.dir = config.s3.dir
    }

    private s3Key(key: string): string {
        return `${this.dir}/${key}`;
    }

    async get(appKey: string): Promise<StorageResponse | undefined> {
        const key = this.s3Key(appKey);

        const exists = await fileExistsS3(
            this.s3Client,
            config.s3.bucket,
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
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            default:
                throw new Error(`Invalid file type: "${key}"`);
        }
    }

    async set(appKey: string, value: Uint8Array): Promise<StorageResponse> {
        const key = this.s3Key(appKey);

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: config.s3.bucket,
                Key: key,
                Body: value,
                ACL: "public-read",
                ContentType: this.getContentType(key),
            }),
        );

        return Promise.resolve({location: `${this.base}/${key}`});
    }


}