import {prisma} from "../../src/db";

export async function reset() {
    await prisma.user_knowledge.deleteMany({});
    await prisma.courses.deleteMany({});
    await prisma.definitions.deleteMany({});
    await prisma.users.deleteMany({});
}