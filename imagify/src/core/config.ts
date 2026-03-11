import z from "zod";

// Define the configuration schema
const configSchema = z.object({
    NODE_ENV: z.enum(['test', 'e2e', 'development', 'production']),
    INFLUX_ORG_ID: z.string().default(''),
    INFLUX_URL: z.string().default(''),
    INFLUX_BUCKET: z.string().default(''),
    INFLUX_TOKEN: z.string().default(''),
    S3_ACCESS_KEY_ID: z.string().default(''),
    S3_SECRET_ACCESS_KEY: z.string().default(''),
    S3_REGION: z.string().default('fra1'),
    S3_ENDPOINT_URL: z.string().default('fra1.digitaloceanspaces.com'),
    S3_BUCKET_NAME: z.string().default(''),
    S3_DIR: z.string().default(''),
    TOGETHER_API_KEY: z.string().default(''),
    JWT_SECRET: z.string(),
});

const env = configSchema.parse(process.env)

export const config = {
    env: env.NODE_ENV,
    influx: {
        org: env.INFLUX_ORG_ID,
        url: env.INFLUX_URL,
        bucket: env.INFLUX_BUCKET,
        token: env.INFLUX_TOKEN,
    },
    s3: {
        region: env.S3_REGION,
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        bucket: env.S3_BUCKET_NAME,
        endpoint: env.S3_ENDPOINT_URL,
        dir: env.S3_DIR,
    },
    together: {
        apiKey: env.TOGETHER_API_KEY,
    },
    jwtSecret: env.JWT_SECRET,
}