import z from "zod";
import { getDbName } from "./lib/getDbName";

// Define the configuration schema
const configSchema = z.object({
  MONGO_URI: z.string(),
  NODE_ENV: z.enum(["test", "e2e", "development", "production"]),
});

const env = configSchema.parse(process.env);

export const config = {
  mongo: {
    uri: env.MONGO_URI,
    dbName: getDbName(env.MONGO_URI),
  },
};
