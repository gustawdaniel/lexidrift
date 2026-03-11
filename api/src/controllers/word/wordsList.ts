import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { Language } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../db";

export interface WordsListRouteGeneric extends RouteGenericInterface {
    Querystring: {
        lang?: string;
        search?: string;
        limit?: number;
        offset?: number;
    };
    Reply: Array<{
        id: string;
        word: string;
        count: number;
        lang: string;
    }>;
}

const wordSelectorMode = z.object({
    limit: z.coerce.number().optional(),
    search: z.string().optional(),
    offset: z.coerce.number().optional(),
    lang: z.nativeEnum(Language).optional(),
});

export async function wordsList(req: FastifyRequest<WordsListRouteGeneric>, reply: FastifyReply) {
    const whereQuery = wordSelectorMode.parse(req.query);

    const limit = whereQuery.limit && whereQuery.limit > 0 ? whereQuery.limit : 10;
    const offset = whereQuery.offset && whereQuery.offset > 0 ? whereQuery.offset : 0;
    const langFilter = whereQuery.lang ? { lang: whereQuery.lang } : {};

    if (whereQuery.search) {
        // Using aggregateRaw() to perform a full-text search with text score ranking
        const words:  Array<{
            id: string;
            word: string;
            count: number;
            lang: string;
            correctness?: boolean;
        }> = await prisma.words.aggregateRaw({
            pipeline: [
                {
                    $match: {
                        $or: [
                            { $text: { $search: whereQuery.search } }, // Full-text search
                            { word: { $regex: whereQuery.search, $options: "i" } }, // Partial match (case insensitive)
                        ],
                        ...(whereQuery.lang ? { lang: whereQuery.lang } : {}),
                    },
                },
                {
                    $addFields: { score: { $meta: "textScore" } },
                },
                {
                    $sort: { score: -1 }, // Sort by text relevance score
                },
                {
                    $skip: offset,
                },
                {
                    $limit: limit,
                },
                {
                    $project: {
                        _id: 0,
                        id: { $toString: "$_id" }, // Convert MongoDB _id to id
                        word: 1,
                        count: 1,
                        lang: 1,
                        rank: 1,
                        correctness: 1,
                    },
                },
            ],
        }) as unknown as  Array<{
            id: string;
            word: string;
            count: number;
            lang: string;
        }>;

        return words;
    }

    // Fallback to Prisma's findMany() if no search phrase
    const words:  Array<{
        id: string;
        word: string;
        count: number;
        lang: string;
    }> = await prisma.words.findMany({
        where: langFilter,
        select: {
            id: true,
            word: true,
            count: true,
            lang: true,
            rank: true,
            correctness: true,
        },
        take: limit,
        skip: offset,
    });

    return words;
}
