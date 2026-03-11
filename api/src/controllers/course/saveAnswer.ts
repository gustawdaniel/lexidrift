import {FastifyReply, FastifyRequest, RouteGenericInterface} from "fastify";
import {z} from "zod";
import {Language, Prisma} from "@prisma/client";
import {prisma} from "../../db";
import assert from "node:assert";
import {nextStep, Step} from "../../helpers/fsrs";
import dayjs from "dayjs";

export interface AnswersLog {
    questionAt: string; // Date
    answerAt: string; // Date
    timeTakenMs: number;
    hintLevel: number; // 0-1 (0 no hint, 0.25 sentence, 0.5 img, 0.75 definition, 1 translation)
    answer: string;
    correct: boolean;
}

interface SaveAnswerRouteGeneric extends RouteGenericInterface {
    Params: {
        lang: string,
    },
    Body: {
        definitionId: string;
        logs: AnswersLog[];
        correctness: number;
    }
}

const saveAnswerParamsSchema = z.object({
    lang: z.nativeEnum(Language),
});

const saveAnswerBodySchema = z.object({
    definitionId: z.string(),
    logs: z.array(z.object({
        questionAt: z.string(),
        answerAt: z.string(),
        timeTakenMs: z.number(),
        hintLevel: z.number(),
        answer: z.string(),
        correct: z.boolean(),
    })),
    correctness: z.number(),
});


export async function saveAnswer(req: FastifyRequest<SaveAnswerRouteGeneric>, reply: FastifyReply) {
    if (!req.user) {
        return reply.unauthorized('Unauthorized');
    }

    const params = saveAnswerParamsSchema.parse(req.params);
    const body = saveAnswerBodySchema.parse(req.body);

    // remove question from course
    await prisma.courses.update({
        where: {
            userId_lang: {
                lang: params.lang,
                userId: req.user.id
            }
        },
        data: {
            questions: {
                deleteMany: {
                    where: {
                        definitionId: body.definitionId,
                    }
                }
            }
        },
    });

    const firstLog = body.logs[0];
    assert.ok(firstLog, 'No first log');
    // update

    // save answer
    await prisma.user_answers.create({
        data: {
            userId: req.user.id,
            definitionId: body.definitionId,
            logs: body.logs,
            createdAt: new Date(),
            correctness: body.correctness,
        },
    });

    const knowledge = await prisma.user_knowledge.findUnique({
        where: {
            userId_definitionId: {
                definitionId: body.definitionId,
                userId: req.user.id,
            },
        }
    });

    if (!knowledge) {
        throw new Error('Knowledge not found');
    }

    const previousStep: Step | undefined = knowledge.fsrs ? {
        t: knowledge.fsrs.lastQuestionAt.getTime(),
        s: knowledge.fsrs.stability,
        d: knowledge.fsrs.difficulty,
        i: dayjs().diff(knowledge.fsrs.lastQuestionAt, 's') / 24 / 3600,
    } : undefined;

    const step = nextStep(body.correctness, previousStep)

    console.log('body.correctness', body.correctness)
    console.log('previousStep / nextStep', previousStep, step)

    const stability = step.s;
    const difficulty = step.d;
    const lastQuestionAt = dayjs(body.logs[body.logs.length - 1].questionAt).toDate();
    const nextQuestionAt = dayjs(lastQuestionAt).add(step.i * 24 * 3600, 'seconds').toDate();

    console.log('lastQuestionAt', lastQuestionAt)
    console.log('nextQuestionAt', nextQuestionAt)

    const fsrs: Prisma.FsrsCreateInput = {
        stability,
        difficulty,
        nextQuestionAt,
        lastQuestionAt,
    }

    // update knowledge
    return prisma.user_knowledge.update({
        where: {
            userId_definitionId: {
                definitionId: body.definitionId,
                userId: req.user.id,
            },
        },
        data: {
            knowledge: body.correctness,
            fsrs
        },
    });
}