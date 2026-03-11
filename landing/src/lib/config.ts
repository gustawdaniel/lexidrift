import z from "zod";
import { getDbName } from "./getDbName.ts";

const envVars = {
    ...import.meta.env,
    ...((globalThis as any).process?.env || {}),
};

// Define the configuration schema
const configSchema = z.object({
    MONGO_URI: z.string({
        required_error: "FATAL ERROR: MONGO_URI is missing! Please provide it via environment variables (e.g., in Cloudflare Pages settings).",
    }).min(1, "FATAL ERROR: MONGO_URI is empty!"),
    MONGO_DB_NAME: z.string().default("lexi_drift"),
    NODE_ENV: z.enum(['test', 'e2e', 'development', 'production']).default('production'),
});

const result = configSchema.safeParse(envVars);

if (!result.success) {
    const error = result.error.format();
    if (error.MONGO_URI) {
        throw new Error(`\n\n❌ ${error.MONGO_URI._errors.join(", ")}\n`);
    }
    throw new Error(`Configuration error: ${JSON.stringify(error, null, 2)}`);
}

const env = result.data;

export const config = {
    mongo: {
        uri: env.MONGO_URI,
        dbName: getDbName(env.MONGO_URI),
    },
}