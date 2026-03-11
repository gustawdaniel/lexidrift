import z from "zod";
import { getDbName } from "./getDbName.ts";

// Define the configuration schema
const configSchema = z.object({
    MONGO_URI: z.string(),
    MONGO_DB_NAME: z.string().default("lexi_drift"),
    NODE_ENV: z.enum(['test', 'e2e', 'development', 'production']).default('production'),
});

const envVars = {
    ...import.meta.env,
    ...((globalThis as any).process?.env || {}),
};

const env = configSchema.parse(envVars)

export const config = {
    mongo: {
        uri: env.MONGO_URI,
        dbName: getDbName(env.MONGO_URI),
    },
}