import crypto from "crypto";

export async function sha1(input: unknown): Promise<string> {
    return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex')
}