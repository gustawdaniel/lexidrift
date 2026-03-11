import { createHash } from 'crypto';

function sha1FromStringSync(input: string): string {
    // Create a SHA-1 hash instance and update it with the input string
    return createHash('sha1').update(input).digest('hex');
}

// https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
export class Key {
    static compose(model: string, styledPrompt: string): string {
        return `${model}/${sha1FromStringSync(styledPrompt)}.jpg`;
    }
}
