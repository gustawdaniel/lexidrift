import { processWordsFileBulk } from "./src/lib/processWordsFile-bulk";

import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { languages } from "./src/lib/languages";
import { Word } from "./src/lib/types";

// MongoDB connection URI and database/collection names
const uri = "mongodb://localhost:27017"; // Modify if needed
const dbName = "lexi_drift"; // Database name
const collectionName = "words"; // Collection name

// Path to the 'words/' directory
const directoryPath = path.join(__dirname, "words");
// Function to process each file and insert data into MongoDB

// Main function to process all files in the directory
async function processFiles() {
  const client = new MongoClient(uri);

  try {
    // Ensure the MongoDB client connects before proceeding
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection<Word>(collectionName);

    // Read all files in the 'words/' directory
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);

      if (fs.lstatSync(filePath).isFile() && filePath.endsWith(".txt")) {
        // Extract language from the filename (e.g., 'en.txt' => 'en')
        const lang = path.basename(file, ".txt"); // Get 'en' from 'en.txt'

        if (
          lang === "en" ||
          lang === "es" ||
          lang === "de" ||
          lang === "pl" ||
          lang === "ru"
        ) {
          await processWordsFileBulk(filePath, lang, collection);
          console.log(`Processed ${file}`);
        }
      }
    }

    console.log("All files processed successfully");
  } catch (error) {
    console.error("Error processing files:", error);
  } finally {
    await client.close();
  }
}

// Run the script
processFiles();
