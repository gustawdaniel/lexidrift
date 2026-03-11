import { PrismaClient } from '@prisma/client';
import { config } from './config';

export const prisma = new PrismaClient({
    datasourceUrl: config.MONGO_URI,
});

import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
let db: Db;

function getDbName(): string {
    const url = new URL(config.MONGO_URI);
    return url.pathname.replace(/^\//, ''); // remove leading slash
}

export async function getDb(): Promise<Db> {
    if (db) return db;

    if (!client) {
        client = new MongoClient(config.MONGO_URI);
        await client.connect();
        console.log('✅ Connected to MongoDB');
    }

    db = client.db(getDbName());
    return db;
}

export async function closeDb(): Promise<void> {
    if (client) {
        await client.close();
        console.log('✅ MongoDB connection closed');
    }
}
