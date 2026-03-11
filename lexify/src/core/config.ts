import 'dotenv/config'
import z from "zod";
import {getDbName} from "../adapters/db/helpers/getDbName";

// Define the configuration schema
const configSchema = z.object({
    OPENAI_API_KEY: z.string().optional(),
    MONGO_URI: z.string(),
    TURSO_DATABASE_URL: z.string().optional(),
    TURSO_AUTH_TOKEN: z.string().optional(),
    NODE_ENV: z.enum(['test', 'e2e', 'development', 'production']),
    INFLUX_ORG_ID: z.string().default(''),
    INFLUX_URL: z.string().default(''),
    INFLUX_BUCKET: z.string().default(''),
    INFLUX_TOKEN: z.string().default(''),
});

const env = configSchema.parse(process.env)

export const config = {
    openaiApiKey: env.OPENAI_API_KEY,
    mongo: {
        uri: env.MONGO_URI,
        dbName: getDbName(env.MONGO_URI),
    },
    // mongoUri: composeMongoUri(env),
    // mongoDbName: env.MONGO_DB_NAME,
    env: env.NODE_ENV,
    turso: {
        url: env.TURSO_DATABASE_URL,
        authToken: env.TURSO_AUTH_TOKEN,
    },
    influx: {
        org: env.INFLUX_ORG_ID,
        url: env.INFLUX_URL,
        bucket: env.INFLUX_BUCKET,
        token: env.INFLUX_TOKEN,
    }
}