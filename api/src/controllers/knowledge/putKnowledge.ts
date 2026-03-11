import {FastifyReply, FastifyRequest, RouteGenericInterface} from "fastify";
import {prisma} from "../../db";
import {z} from "zod";

export interface SetKnowledgeRouteGeneric extends RouteGenericInterface {
    Params: {
        id?: string,
    },
    Body: {
        knowledge: number,
        definitionId: string,
    }
}

const knowledgeParamsSelectorModel = z.object({
    id: z.string().optional(),
});

const knowledgeBodySelectorModel = z.object({
    knowledge: z.number(),
    definitionId: z.string(),
});


export async function putKnowledge(req: FastifyRequest<SetKnowledgeRouteGeneric>, reply: FastifyReply) {
    if (!req.user) {
        return reply.unauthorized();
    }

    const userId = req.user.id;

    console.log("user", req.user)
    console.log("userId", userId)

    const params = knowledgeParamsSelectorModel.parse(req.params);
    const body = knowledgeBodySelectorModel.parse(req.body);

    const knowledge = params.id ? await prisma.user_knowledge.findUnique({
        where: {
            id: params.id,
        }
    }) : null;

    if (knowledge) {
        return prisma.user_knowledge.update({
            where: {
                id: params.id,
            },
            data: {
                knowledge: Number(body.knowledge),
            },
        });
    } else {
        const definition = await prisma.definitions.findUnique({
            where: {
                id: body.definitionId,
            },
        });

        if (!definition) {
            return reply.notFound('Definition not found');
        }

        return prisma.user_knowledge.create({
            data: {
                knowledge: Number(body.knowledge),
                userId,
                definitionId: body.definitionId,
                lang: definition.lang,
                rank: definition.rank,
                fsrs: null,
            },
        });
    }
}