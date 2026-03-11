import { MongoClient } from "mongodb";
import type {Language} from "./types.ts";
import {config} from "./config.ts";

const uri = config.mongo.uri; //"mongodb://127.0.0.1:27017";
const dbName = config.mongo.dbName; // "lexi_drift";
const collectionName = "words";
const client = new MongoClient(uri);

interface Word {
    word: string;
    count: number;
    lang: Language;
}

const WORDS_LIMIT = 20000;

export async function getWords(filter: {lang: Language}): Promise<Word[]> {
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