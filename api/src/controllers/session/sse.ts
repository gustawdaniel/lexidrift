import {FastifyReply, FastifyRequest} from "fastify";
import {prisma} from "../../db";
import dayjs from "dayjs";

export const clients = new Map<string, Set<FastifyReply>>();

export async function registerSSE(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user) {
        return reply.unauthorized('Not authorized');
    }

    // Set SSE headers
    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache");
    reply.raw.setHeader("Connection", "keep-alive");
    reply.raw.setHeader("Access-Control-Allow-Origin", "*");

    reply.raw.flushHeaders();

    const userId = req.user.id;
    // Add or initialize the client set for the user
    if (!clients.has(userId)) {
        clients.set(userId, new Set());
    }
    const userClients = clients.get(userId)!;
    userClients.add(reply);

    const existingSession = await prisma.sessions.findFirst({
        where: {
            userId,
            OR: [
                {
                    endedAt: null
                },
                {
                    endedAt: {
                        gt: dayjs().subtract(1, 'minute').toDate()
                    }
                }
            ]
        }
    });

    if (existingSession) {
        await prisma.sessions.updateMany({
            where: {
                id: existingSession.id
            },
            data: {
                endedAt: null
            }
        })
    }

    const session = existingSession ? existingSession : await prisma.sessions.create({
        data: {
            userId,
            endedAt: null,
            createdAt: new Date(),
        }
    });

    // Handle client disconnect
    req.raw.on("close", async () => {
        userClients.delete(reply);
        if (userClients.size === 0) {
            clients.delete(userId); // Clean up if no more clients for this user
        }

        await prisma.sessions.updateMany({
            where: {
                id: session.id
            },
            data: {
                endedAt: new Date()
            }
        });
    });
}