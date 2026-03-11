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

    console.log("--- 🕵️ EXHAUSTIVE ENV DIAGNOSTIC ---");
    console.log("🔍 import.meta.env keys:", Object.keys(import.meta.env));
    const processEnv = (globalThis as any).process?.env || {};
    console.log("🔍 process.env keys:", Object.keys(processEnv));

    // Check for Cloudflare specific markers
    console.log("🔍 CF_PAGES:", processEnv.CF_PAGES);
    console.log("🔍 NODE_VERSION:", processEnv.NODE_VERSION);

    // Check if maybe it's prefixed?
    const possibleMatches = Object.keys(processEnv).filter(k => k.includes("MONGO"));
    if (possibleMatches.length > 0) {
        console.log("🔍 Found similar keys:", possibleMatches);
    } else {
        console.log("❌ No key containing 'MONGO' found in process.env");
    }
    console.log("-----------------------------------");

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