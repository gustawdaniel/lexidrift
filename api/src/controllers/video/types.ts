import {VideorGenerationSegment} from "@prisma/client";

export interface LongPoolingForVideosToGenerateReply {
    id: string,
    segments: VideorGenerationSegment[],
}