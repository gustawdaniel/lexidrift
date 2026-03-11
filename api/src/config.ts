import { z } from 'zod';

export const serverVariables = z.object({
    MONGO_URI: z.string(),
    JWT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    VIDEO_GENERATOR_API_KEY: z.string(),
    VIDEO_CONVERTER_LONG_POOLING_SEC: z.coerce.number().default(25),

    NODE_ENV: z
        .enum(['development', 'production', 'test', 'e2e'])
        .default('development'),

    PORT: z.coerce.number().int().default(4747),

    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_REGION: z.string().default('fra1'),
    S3_ENDPOINT_URL: z.string().default('fra1.digitaloceanspaces.com'),
    S3_BUCKET_NAME: z.string(),
    S3_DIR: z.string(),
    APP_URL: z.string(),
});

export const config = serverVariables.parse(process.env);
