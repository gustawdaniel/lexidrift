import {prisma} from "../../src/db";

export async function seedUser() {
    await prisma.users.create({
        data: {
            email: 'test@test.com',
            fullName: 'Test User',
            avatar: 'https://avatars.dicebear.com/api/initials/test@test.com.svg',
            roles: ['admin'],
        }
    });
}