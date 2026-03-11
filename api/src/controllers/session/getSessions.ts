import {FastifyReply, FastifyRequest, RouteGenericInterface} from "fastify";
import {prisma} from "../../db";
import {z} from "zod";

interface GetSessionsRouteGeneric extends RouteGenericInterface {
    Headers: {
        authorization: string
    }
    Querystring: {
        from: string,
        to: string,
    }
}

const getSessionsQueryModel = z.object({
    from: z.coerce.string().datetime(),
    to: z.coerce.string().datetime(),
});

export async function getSessions(req: FastifyRequest<GetSessionsRouteGeneric>, reply: FastifyReply) {
    if(!req.user) {
        return reply.unauthorized('Unauthorized');
    }

    const query = getSessionsQueryModel.parse(req.query);

    const sessions = await prisma.sessions.findMany({
        where: {
            userId: req.user.id,
            createdAt: {
                gte: query.from,
                lte: query.to,
            }
        },
        select: {
            id: true,
            createdAt: true,
            endedAt: true,
        }
    });

    return sessions;
}