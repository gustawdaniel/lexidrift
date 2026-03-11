import {
    FastifyReply,
    FastifyRequest,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault, RouteGenericInterface
} from "fastify";
import {config} from "../../config";
import {prisma} from "../../db";
import {GeneratedVideoStatus} from "@prisma/client";
import {videoInsertEmitter} from "./videoInsertEmitter";
import {LongPoolingForVideosToGenerateReply} from "./types";

interface LongPoolingForVideosToGenerateRequest extends RouteGenericInterface {
    Headers: {
        authorization: string
    }
    Reply: LongPoolingForVideosToGenerateReply
}

export async function longPoolingForVideosToGenerate(
    req: FastifyRequest<LongPoolingForVideosToGenerateRequest>,
    reply: FastifyReply,
) {
    if (!req.headers.authorization?.endsWith(config.VIDEO_GENERATOR_API_KEY)) return reply.unauthorized()
    // await ioredis.set('video_convert_requested_at', dayjs().unix())

    const video = await prisma.generated_videos.findFirst({
        where: {
            status: {
                in: [
                    GeneratedVideoStatus.pending,
                    GeneratedVideoStatus.processing
                ]
            }
        },
        orderBy: {
            id: 'desc',
        },
    })

    if (video) {
        await prisma.generated_videos.update({
            where: {id: video.id},
            data: {
                status: GeneratedVideoStatus.processing,
            }
        });

        return reply.send({
            id: video.id,
            segments: video.segments,
        })
    }

    return new Promise<
        FastifyReply
    >((resolve): void => {
        const timeout = setTimeout(() => {
            videoInsertEmitter.off('insert', replyOnListener)
            resolve(reply.code(404).send())
        }, config.VIDEO_CONVERTER_LONG_POOLING_SEC * 1000) // 10 seconds timeout

        // Listen for an event to trigger a response
        videoInsertEmitter.once('insert', replyOnListener)

        async function replyOnListener(data: LongPoolingForVideosToGenerateReply) {
            clearTimeout(timeout)

            await prisma.generated_videos.update({
                where: {id: data.id},
                data: {
                    status: GeneratedVideoStatus.processing,
                }
            });

            resolve(reply.send(data))
        }
    })
}
