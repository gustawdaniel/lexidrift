import {Db, MongoClient} from "mongodb";
import {config} from "../../core/config";

let client: MongoClient | undefined;

export async function closeMongoStorage(): Promise<void> {
    if (client) {
        await client.close();
        client = undefined;
    }
}

export async function getDb(mongoUri?: string, dbName?: string): Promise<Db> {
    mongoUri = mongoUri ?? config.mongo.uri;
    dbName = dbName ?? config.mongo.dbName;

    if(!client) {
        client = new MongoClient(mongoUri);
        await client.connect();
    }

    return client.db(dbName);
}