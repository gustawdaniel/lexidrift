import { Db, Collection } from "mongodb";
import { MigrationInterface } from "mongo-migrate-ts";
import path from "path";
import * as fs from "node:fs";
import { processWordsFile } from "../src/lib/processWordsFile";
import { Word } from "../src/lib/types";

async function ensureWordIndex(collection: Collection<Word>) {
  // Get the list of existing indexes
  const existingIndexes = await collection.indexes();

  // Check if the compound index on { word: 1, lang: 1 } already exists
  const indexExists = existingIndexes.some(
    (index) => index.key.word === 1 && index.key.lang === 1,
  );

  // If the index does not exist, create it
  if (!indexExists) {
    await collection.createIndex({ word: 1, lang: 1 }, { unique: true });
    console.log("Index created: { word: 1, lang: 1 }");
  } else {
    console.log("Index already exists: { word: 1, lang: 1 }");
  }
}

export class Words_1733813180243 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const wordsCollection = db.collection<Word>("words");
    await ensureWordIndex(wordsCollection);
    const directoryPath = path.join(__dirname, "..", "words");

    // Read all files in the 'words/' directory
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);

      if (fs.lstatSync(filePath).isFile() && filePath.endsWith(".txt")) {
        const lang = path.basename(file, ".txt");
        if (
          lang === "en" ||
          lang === "es" ||
          lang === "de" ||
          lang === "pl" ||
          lang === "ru"
        ) {
          await processWordsFile(filePath, lang, wordsCollection);
        }
      }
    }

    return Promise.resolve();
  }

  public async down(db: Db): Promise<void | never> {
    await db.collection("words").deleteMany({});
    return Promise.resolve();
  }
}
