import { Db } from "mongodb";
import { MigrationInterface } from "mongo-migrate-ts";

const languages = ["pl", "en", "de", "ru", "es"];

export class AddRank_1740773239378 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    console.log(11);

    for (const lang of languages) {
      const definitions = await db
        .collection("definitions")
        .find({ lang })
        .toArray();

      console.log('definitions', lang, definitions);

      for (const definition of definitions) {
        const word = await db
          .collection("words")
          .findOne({ word: definition.word, lang });

        console.log('definition', definition, word);

        if (!word) {
          throw new Error(
            `Word ${definition.word} not found in words collection for lang ${lang}`,
          );
        }

        await db
          .collection("definitions")
          .updateOne({ _id: definition._id }, { $set: { rank: word.rank } });

        await db
          .collection("users_knowledge")
          .updateMany(
            { definitionId: definition._id },
            { $set: { rank: word.rank } },
          );
      }
    }
  }

  public async down(db: Db): Promise<void | never> {
    for (const lang of languages) {
      await db
        .collection("definitions")
        .updateMany({ lang }, { $unset: { rank: "" } });

      await db
        .collection("users_knowledge")
        .updateMany({ lang }, { $unset: { rank: "" } });
    }
  }
}
