import {FastifyReply, FastifyRequest, RouteGenericInterface} from "fastify";
import {Language, VideorGenerationSegment} from '@prisma/client';
import {prisma} from "../../db";
import {sha1} from "../../helpers/sha1";
import {clients} from "../session/sse";
import {z} from "zod";
import {videoInsertEmitter} from "./videoInsertEmitter";
import {LongPoolingForVideosToGenerateReply} from "./types";

export interface RequestVideoGenerationRouteGeneric extends RouteGenericInterface {
    Body: {
        segments: VideorGenerationSegment,
    }
}

const requestVideoGenerationBodySchema = z.object({
    segments: z.array(z.object({
        audioUrl: z.string(),
        imageUrl: z.string(),
        text: z.string(),
        highlight: z.string(),
    })),
    learningLanguage: z.nativeEnum(Language),
    nativeLanguage: z.nativeEnum(Language),
});

export async function requestVideoGeneration(req: FastifyRequest<RequestVideoGenerationRouteGeneric>, reply: FastifyReply) {
    if (!req.user) {
        return reply.unauthorized('Unauthorized');
    }

    const body = requestVideoGenerationBodySchema.parse(req.body);

    // Sha1 hash from segments array
    const segmentsSha1 = await sha1(body.segments);

    const potentiallyExistingVideo = await prisma.generated_videos.findFirst({
        where: {
            segmentsSha1,
        }
    });

    if(potentiallyExistingVideo) {
        const video = await prisma.generated_videos.create({
            data: {
                userId: req.user.id,
                segments: body.segments,
                segmentsSha1,
                url: potentiallyExistingVideo.url,
                learningLanguage: body.learningLanguage,
                nativeLanguage: body.nativeLanguage,
            }
        });

        clients.get(req.user.id)?.forEach(client => client.send(`data: ${JSON.stringify(video)}\n\n`));

        return video;
    }

    // call video generation service
    // return response
    const video = await prisma.generated_videos.create({
        data: {
            userId: req.user.id,
            segments: body.segments,
            segmentsSha1,
            learningLanguage: body.learningLanguage,
            nativeLanguage: body.nativeLanguage,
        }
    });

    videoInsertEmitter.emit('insert', {
        id: video.id,
        segments: body.segments,
    } satisfies LongPoolingForVideosToGenerateReply);

    return video;
}