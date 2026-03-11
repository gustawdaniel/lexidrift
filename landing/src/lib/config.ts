import z from "zod";
import {getDbName} from "./getDbName.ts";

// Define the configuration schema
const configSchema = z.object({
    MONGO_URI: z.string(),
    MONGO_DB_NAME: z.string().default("lexi_drift"),
    NODE_ENV: z.enum(['test', 'e2e', 'development', 'production']),
});

const env = configSchema.parse(import.meta.env)

export const config = {
    mongo: {
        uri: env.MONGO_URI,
        dbName: getDbName(env.MONGO_URI),
    },
}