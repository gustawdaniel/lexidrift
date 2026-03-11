import {prisma} from "../../src/db";
import {seedUser} from "./seed_user";
import {seedDefinition} from "./seed_definition";
import {seedKnowledge} from "./seed_knowledge";
import {seedCourse} from "./seed_course";

export async function seed() {
    const usersCount = await prisma.users.count();

    if (usersCount === 0) {
        await seedUser()
    }

    const definitionsCount = await prisma.definitions.count();

    if (definitionsCount === 0) {
        await seedDefinition()
    }

    const knowledgeCount = await prisma.user_knowledge.count();

    if (knowledgeCount === 0) {
        await seedKnowledge()
    }

    const coursesCount = await prisma.courses.count();

    if (coursesCount === 0) {
        await seedCourse()
    }

}