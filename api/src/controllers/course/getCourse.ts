import {FastifyReply, FastifyRequest, RouteGenericInterface} from "fastify";
import {prisma} from "../../db";
import { z } from "zod";
import {Language} from "@prisma/client";
import {QueryOrchestrator} from "../../services/QueryOrchestrator";

interface GetCourseRouteGeneric extends RouteGenericInterface {
    Params: {
        lang: string,
    },
}

const getCourseParamsSchema = z.object({
    lang: z.nativeEnum(Language),
});

export async function getCourse(req: FastifyRequest<GetCourseRouteGeneric>, reply: FastifyReply) {
    if(!req.user) {
        return reply.unauthorized('Unauthorized');
    }

    const userId = req.user.id;

    const params = getCourseParamsSchema.parse(req.params);
    const lang = params.lang;

    let course = await prisma.courses.findFirst({
        where: {
            lang: lang,
            userId,
        },
    });

    if(!course) {
        course = await prisma.courses.create({
            data: {
                lang: lang,
                userId,
                questions: [],
            },
        });
    }

    const orchestrator = new QueryOrchestrator();
    const courseWithDefinitionIds = await orchestrator.prepareQueries({
        courseId: course.id,
    });

    console.log('courseWithDefinitionIds', courseWithDefinitionIds);

    const definitions = await prisma.definitions.findMany({
        where: {
            id: {
                in: courseWithDefinitionIds.questions.map(q => q.definitionId),
            }
        },
    });

    return {
        ...courseWithDefinitionIds,
        questions: courseWithDefinitionIds.questions.map(q => {
            const definition = definitions.find(d => d.id === q.definitionId);
            if (!definition) {
                throw new Error(`Definition not found: ${q.definitionId}`);
            }
            return {
                ...q,
                logs: [],
                definition,
            };
        }),
    };
}