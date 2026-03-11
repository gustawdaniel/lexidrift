import {FastifyReply, FastifyRequest, RouteGenericInterface} from "fastify";
import {z} from "zod";
import {Language} from "@prisma/client";
import {prisma} from "../../db";

interface UpdateMeRouteGeneric extends RouteGenericInterface {
    Body: { language: string, defaultLanguageToLearn: string }
}

const updateMeBodyModel = z.object({
    language: z.nativeEnum(Language).optional(),
    defaultLanguageToLearn: z.nativeEnum(Language).optional(),
});

export async function updateMe(req: FastifyRequest<UpdateMeRouteGeneric>, reply: FastifyReply) {
    if (!req.user) {
        return reply.unauthorized();
    }

    const updateMeBody = updateMeBodyModel.parse(req.body);

    const user = await prisma.users.update({
        where: {id: req.user.id},
        data: {
            language: updateMeBody.language,
            defaultLanguageToLearn: updateMeBody.defaultLanguageToLearn,
        }
    });

    return reply.send(user);
}

