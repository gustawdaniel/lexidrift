import { mongoMigrateCli } from "mongo-migrate-ts";
import { config } from "./src/config";

mongoMigrateCli({
  uri: config.mongo.uri,
  database: config.mongo.dbName,
  migrationsDir: "migrations",
  migrationsCollection: "migrations_collection",
});
