import {prisma} from "../../db";
import {FastifyReply, FastifyRequest, RouteGenericInterface} from "fastify";
import {z} from "zod";
import {Language} from "@prisma/client";

interface ListVideosRouteGeneric extends RouteGenericInterface {
    Querystring: {
        learningLanguage: Language,
        nativeLanguage: Language,
    },
    Headers: {
        authorization: string
    }
}

const listVideosQueryModel = z.object({
    learningLanguage: z.nativeEnum(Language),
    nativeLanguage: z.nativeEnum(Language),
});

export async function listVideos(req: FastifyRequest<ListVideosRouteGeneric>, reply: FastifyReply) {
    const user = req.user;

    if (!user) {
        return reply.unauthorized('Unauthorized');
    }

    console.log("listVideos req.params", req.params);

    const query = listVideosQueryModel.parse(req.query);

    const videos = await prisma.generated_videos.findMany({
        where: {
            userId: user.id,
            learningLanguage: query.learningLanguage,
            nativeLanguage: query.nativeLanguage,
        },
        select: {
            id: true,
            segmentsSha1: true,
            url: true,
            segments: true,
            status: true,
        }
    });

    return videos.map(video => {
        const words = video.segments.filter((_, index) => index % 4 === 0).map(segment => segment.text);

        return {
            id: video.id,
            url: video.url,
            segmentsSha1: video.segmentsSha1,
            words,
            status: video.status,
        }
    });
}