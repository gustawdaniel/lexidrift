import {FastifyReply, FastifyRequest, RouteGenericInterface} from "fastify";
import {Language} from "@prisma/client";
import {z} from "zod";
import {prisma} from "../../db";

export interface KnowledgeListRouteGeneric extends RouteGenericInterface {
    Querystring: {
        limit?: number,
        offset?: number,
        withDefinition?: string,
    },
    Params: {
        lang: Language,
    },
}

const knowledgeQuerySelectorModel = z.object({
    limit: z.coerce.number().default(100),
    offset: z.coerce.number().default(0),
    withDefinition: z.coerce.boolean().default(false),
});

const knowledgeParamsSelectorModel = z.object({
lang: z.nativeEnum(Language),
});


export async function getKnowledgeList(req: FastifyRequest<KnowledgeListRouteGeneric>, reply: FastifyReply) {
    if(!req.user) {
        return reply.unauthorized('Unauthorized');
    }

    const params = knowledgeParamsSelectorModel.parse(req.params);
    const query = knowledgeQuerySelectorModel.parse(req.query);

    const knowledge = await prisma.user_knowledge.findMany({
        where: {
            ...params,
            userId: req.user.id,
            rank: {
                gte: query.offset + 1,
                lt: query.offset + query.limit + 1,
            }
        },
        // take: query.limit,
        // skip: query.offset,
        select: {
            id: true,
            definitionId: true,
            knowledge: true,
            lang: true,
            rank: true,
            fsrs: true,
            definition: query.withDefinition ? {
                select: {
                    id: true,
                    word: true,
                    translation: true,
                    examples: true,
                }
            } : false
        }
    });

    if (!knowledge.length) {
        return [];
    }

    return knowledge;
}
