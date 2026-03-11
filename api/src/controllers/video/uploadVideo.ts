import {FastifyReply, FastifyRequest, RouteGenericInterface} from "fastify";
import { prisma } from "../../db";
import { z } from "zod";
import {config} from "../../config";
import {S3Adapter} from "../../helpers/storage/s3";
import {GeneratedVideoStatus} from "@prisma/client";

interface UploadVideoRouteGeneric extends RouteGenericInterface {
    Params: {
        id: string
    },
    Headers: {
        authorization: string
    },
    Body: Uint8Array
}

const uploadVideoParamsModel = z.object({
    id: z.string(),
});

export async function uploadVideo(req: FastifyRequest<UploadVideoRouteGeneric>, reply: FastifyReply) {
    if (!req.headers.authorization?.endsWith(config.VIDEO_GENERATOR_API_KEY)) return reply.unauthorized()

    const params = uploadVideoParamsModel.parse(req.params);

    const video = await prisma.generated_videos.findUnique({ where: { id: params.id } })

    if(!video) {
        return reply.notFound();
    }

    const key = `video/${video.segmentsSha1}.mp4`;

    const s3 = new S3Adapter();
    await s3.set(key, req.body);

    const url = (await s3.get(key))?.location;

    if(!url) {
        return reply.internalServerError();
    }

    const updatedVideo = await prisma.generated_videos.update({
        where: { id: params.id },
        data: {
            url: url,
            status: GeneratedVideoStatus.done,
        }
    });

    console.log("video",updatedVideo);

    return updatedVideo;
}