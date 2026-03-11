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

const result = configSchema.safeParse(envVars);

if (!result.success) {
    console.warn("⚠️ Configuration validation issues detected:");
    console.warn(JSON.stringify(result.error.format(), null, 2));
    console.info("Available env keys (non-sensitive):", Object.keys(envVars).filter(k =>
        !/AUTH|SECRET|TOKEN|KEY|PASS/i.test(k)
    ));
}

// Use a fallback for build time if MONGO_URI is missing to avoid hard crash during static generation.
// This allows the build to finish even if the database variables are not exposed to the build environment.
const MONGO_URI = envVars.MONGO_URI as string || "mongodb://missing_uri_placeholder:27017/lexi_drift";

export const config = {
    mongo: {
        uri: MONGO_URI,
        dbName: MONGO_URI !== "mongodb://missing_uri_placeholder:27017/lexi_drift" ? getDbName(MONGO_URI) : "lexi_drift",
    },
}