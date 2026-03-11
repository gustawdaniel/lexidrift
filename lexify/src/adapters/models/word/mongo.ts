import {WordAdapter, } from "../../../ports/word.port";
import {getDb} from "../../db/mongo";
import {CheckCorrectnessSelector, WordRecord, WordWithCorrectnessChecked} from "../../../ports/io.port";

export async function initWordMongoStorage(): Promise<WordAdapter> {
    const db = await getDb();
    const collection = db.collection<WordRecord |  WordWithCorrectnessChecked>("words");

    return {
        update: async (selector: CheckCorrectnessSelector, update: Partial<WordWithCorrectnessChecked>): Promise<void> => {
            await collection.updateOne(selector, {$set: update});
        },
        find: async (request: CheckCorrectnessSelector): Promise<WordRecord | WordWithCorrectnessChecked| null> => {
            return await collection.findOne(request);
        },
    };
}