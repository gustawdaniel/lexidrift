import assert from "node:assert";
import {prisma} from "../../src/db";

export async function seedCourse() {
    const user = await prisma.users.findFirst();
    assert.ok(user);

    await prisma.courses.create({
        data: {
            userId: user.id,
            lang: user.defaultLanguageToLearn,
            questions: [],
        }
    })
}