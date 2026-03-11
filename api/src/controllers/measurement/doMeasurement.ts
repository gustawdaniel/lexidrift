import {KnowledgeMeasurement} from "../../services/KnowledgeMeasurement";
import {FastifyReply, FastifyRequest, RouteGenericInterface} from "fastify";
import {Language} from "@prisma/client";
import { z } from "zod";

interface DoMeasurementRouteGeneric extends RouteGenericInterface {
    Headers: {
        authorization: string
    }
    Querystring: {
        lang: Language,
        dayOfEpoch?: number,
    }
}

const doMeasurementQueryModel = z.object({
    lang: z.nativeEnum(Language),
    dayOfEpoch: z.number().optional(),
});

export async function doMeasurement(req: FastifyRequest, reply: FastifyReply) {
    if(!req.user) {
        return reply.unauthorized('Unauthorized');
    }

    const query = doMeasurementQueryModel.parse(req.query);

    const measurement = await KnowledgeMeasurement.doMeasurement({
        lang: query.lang,
        userId: req.user.id,
        ...(query.dayOfEpoch ? {dayOfEpoch: query.dayOfEpoch} : {}),
    });

    return measurement;
}