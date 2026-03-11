import fs from "fs";
import { Collection } from "mongodb";
import { Language, Word } from "./types";

export async function processWordsFile(
  filePath: string,
  lang: Language,
  collection: Collection<Word>,
) {
  let counter = 0;
  const fileContent = fs.readFileSync(filePath, { encoding: "utf8" });

  const lines = fileContent.split("\n");

  console.log("lines", lang, lines.length);

  // Parse each line and insert into MongoDB
  for (const line of lines) {
    const [word, count] = line.trim().split(/\s+/);

    // Skip lines that don't have both a word and a valid count
    if (word && count && !isNaN(Number(count))) {
      const wordData = {
        word: word,
        count: parseInt(count),
        lang: lang, // Store the language instead of the filename
      };

      const existingWord = await collection.findOne({ word: word, lang: lang });

      if (!existingWord) {
        if (counter % 100 === 0) {
          console.log(`Inserting word: ${word}`);
        }
        await collection.insertOne(wordData);
      }
      // await collection.insertOne(wordData);
    }

    if (counter % 1000 === 0) {
      console.log(`Processed ${counter}/${lines.length} lines in ${lang}`);
    }

    counter++;
  }
}
