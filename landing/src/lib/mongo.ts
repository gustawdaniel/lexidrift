import { MongoClient } from "mongodb";
import type { Language } from "./types.ts";
import { config } from "./config.ts";

const uri = config.mongo.uri;
const dbName = config.mongo.dbName;
const collectionName = "words";
const client = new MongoClient(uri);

interface Word {
    word: string;
    count: number;
    lang: Language;
}

const WORDS_LIMIT = 20000;

export async function getWords(filter: { lang: Language }): Promise<Word[]> {
    if (config.mongo.uri.includes("missing_uri_placeholder")) {
        console.warn("⚠️ getWords called without a valid MONGO_URI. Skipping database fetch.");
        return [];
    }
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const words = await collection.find<Word>(filter).limit(WORDS_LIMIT).toArray();
        return words;
    } finally {
        await client.close();
    }
}