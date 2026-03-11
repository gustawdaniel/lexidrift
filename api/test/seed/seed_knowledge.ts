import dayjs from "dayjs";
import {prisma} from "../../src/db";
import {Language, Prisma} from "@prisma/client";
import assert from "node:assert";

export async function seedKnowledge() {
    const user = await prisma.users.findFirst();
    assert.ok(user);

    const definitions = await prisma.definitions.findMany();
    assert.ok(definitions.length === 3);

    // ['new', 'old', 'known']

    for (const definition of definitions) {
        let fsrs: Prisma.FsrsCreateInput | null = null;

        if(definition.word === 'old') {
            fsrs = {
                nextQuestionAt: dayjs().subtract(1, 'day').toDate(),
                stability: 1,
                difficulty: 1,
                lastQuestionAt: dayjs().toDate()
            };
        } else if(definition.word === 'known') {
            fsrs = {
                nextQuestionAt: dayjs().add(2, 'day').toDate(),
                stability: 1,
                difficulty: 1,
                lastQuestionAt: dayjs().toDate()
            };
        }

        await prisma.user_knowledge.create({
            data: {
                userId: user.id,
                definitionId: definition.id,
                knowledge: 0,
                rank: definition.rank,
                lang: Language.en,
                fsrs
            }
        });
    }
}