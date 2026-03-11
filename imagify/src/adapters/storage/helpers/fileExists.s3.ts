import {HeadObjectCommand, HeadObjectCommandInput, HeadObjectCommandOutput, S3Client} from "@aws-sdk/client-s3";

export async function fileExistsS3(
    client: S3Client,
    bucket: string,
    key: string,
): Promise<boolean> {
    try {
        const bucketParams: HeadObjectCommandInput = {
            Bucket: bucket,
            Key: key,
        };
        const cmd = new HeadObjectCommand(bucketParams);
        const data: HeadObjectCommandOutput = await client.send(cmd);

        // I always get 200 for my testing if the object exists
        return data.$metadata.httpStatusCode === 200;
    } catch (error: any) {
        if (error.$metadata?.httpStatusCode === 404) {
            // doesn't exist and permission policy includes s3:ListBucket
            return false;
        } else if (error.$metadata?.httpStatusCode === 403) {
            // doesn't exist, permission policy WITHOUT s3:ListBucket
            return false;
        } else {
            // some other error
        console.error(error);
        throw error;
                }
    }
}