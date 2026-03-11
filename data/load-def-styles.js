const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; // Modify if needed
const dbName = "lexi_drift"; // Database name
const collectionName = "definition_styles"; // Collection name

async function saveStyles() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.insertMany([
      {
        codeName: "wordup",
        style: "WordUp Style",
        description:
          "Simple, user-friendly, and concise, with a focus on clarity and engagement.",
      },
      {
        codeName: "wolfram",
        style: "Wolfram Alpha",
        description:
          "Precise, factual, and somewhat technical, often providing linguistic details such as the word type and usage.",
      },
      {
        codeName: "diki",
        style: "Diki",
        description: "Clear and simple, with a practical, real-world approach.",
      },
      {
        codeName: "oxford",
        style: "Oxford",
        description: "Formal, authoritative, comprehensive.",
      },
      {
        codeName: "cambridge",
        style: "Cambridge",
        description: "Clear, learner-friendly, with examples.",
      },
      {
        codeName: "merriam_webster",
        style: "Merriam-Webster",
        description: "Formal, with multiple definitions and phonetic details.",
      },
      {
        codeName: "urban",
        style: "Urban Dictionary",
        description: "Informal, humorous, slang-heavy.",
      },
      {
        codeName: "etymological",
        style: "Etymological",
        description: "Focus on the word's historical development.",
      },
      {
        codeName: "learners",
        style: "Learner's",
        description: "Simplified for non-native speakers, easy to understand.",
      },
      {
        codeName: "scientific",
        style: "Scientific/Technical",
        description:
          "Precise and specialized for fields like medicine or technology.",
      },
      {
        codeName: "literary",
        style: "Literary",
        description:
          "Descriptive and expressive, focused on connotation and artistic use.",
      },
    ]);
  } catch (error) {
    console.error("Error processing files:", error);
  } finally {
    await client.close();
  }
}

saveStyles();
