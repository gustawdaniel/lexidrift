import fs from "fs";
import { Collection } from "mongodb";
import { Language, Word } from "./types";

export async function processWordsFile (
    filePath: string,
    lang: Language,
    collection: Collection<Word>
) {
    const fileContent = fs.readFileSync(filePath, { encoding: "utf8" });
    const lines = fileContent.split("\n");
    const bulkOps = [];
    let counter = 0;
    let startDate = Date.now();

    for (const line of lines) {
        const [word, count] = line.trim().split(/\s+/);

        if (word && count && !isNaN(Number(count))) {
            const wordData = {
                word: word,
                count: parseInt(count, 10),
                lang: lang,
            };

            bulkOps.push({
                updateOne: {
                    filter: { word: word, lang: lang },
                    update: { $set: wordData },
                    upsert: true,
                },
            });

            if (bulkOps.length >= 5000) {
                await collection.bulkWrite(bulkOps);
                bulkOps.length = 0; // Clear the batch
                let endDate = Date.now();
                console.log(`Processed ${counter}/${lines.length} lines in ${lang} [${endDate - startDate}ms]`);
                startDate = Date.now();
            }
        }

        counter++;
    }

    // Process remaining operations
    if (bulkOps.length > 0) {
        await collection.bulkWrite(bulkOps);
    }

    console.log(`Completed processing ${lines.length} lines in ${lang}`);
}