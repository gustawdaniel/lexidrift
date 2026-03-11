import {DefinitionAdapter, DefinitionRecord, DefinitionSelector} from "../../../ports/definition.port";
import {getDb} from "../../db/mongo";

export async function initDefinitionMongoStorage(): Promise<DefinitionAdapter> {
    const db = await getDb();
    const collection = db.collection<DefinitionRecord>("definitions");

    return {
        save: async (request: DefinitionRecord): Promise<void> => {
            await collection.insertOne(request);
        },
        find: async (request: DefinitionSelector): Promise<DefinitionRecord | null> => {
            return await collection.findOne(request);
        },
        addTranslation: async (selector: DefinitionSelector, translation: DefinitionRecord): Promise<void> => {
            const existingRecords = await collection.find(selector).toArray();
            if (existingRecords.length === 0) {
                return;
            }

            for (const existingRecord of existingRecords) {
                const existingTranslations = (existingRecord.translation?.[translation.lang] || '').split(/[,\/]/).filter(Boolean);

                if (!existingTranslations.includes(translation.word)) {
                    const updatedTranslation = [...existingTranslations, translation.word].join('/');
                    await collection.updateOne(
                        { _id: existingRecord._id },
                        { $set: { ['translation.' + translation.lang]: updatedTranslation } }
                    );
                }
            }
        }
    };
}

//