import fs from "fs";
import { Collection } from "mongodb";
import { Language, Word } from "./types";

export async function processWordsFileBulk(
  filePath: string,
  lang: Language,
  collection: Collection<Word>,
) {
  const fileContent = fs.readFileSync(filePath, { encoding: "utf8" });
  const lines = fileContent.split("\n");

  const bulkOps = [];
  let counter = 0;

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

      if (bulkOps.length >= 1000) {
        await collection.bulkWrite(bulkOps);
        bulkOps.length = 0; // Clear the batch
        console.log(`Processed ${counter}/${lines.length} lines in ${lang}`);
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
