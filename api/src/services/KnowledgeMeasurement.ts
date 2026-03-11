import {prisma} from "../db";
import {Language, KnowledgeMeasurementState} from "@prisma/client";
import {z} from "zod";
import dayjs from "dayjs";
import {retrievability} from "../helpers/fsrs";

function getDayOfEpoch(): number {
    return Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24);
}

interface MeasurementCondition {
    lang: Language;
    userId: string;
    dayOfEpoch?: number;
}

const conditionSchema = z.object({
    lang: z.nativeEnum(Language),
    userId: z.string(),
    dayOfEpoch: z.number().optional(),
});

// Math.min(to.valueOf(), dayjs().valueOf())

export async function computeRetrievability(to: Date, condition: MeasurementCondition): Promise<number> {
    const knowledgeUnits = await prisma.user_knowledge.findMany({
        where: {
            userId: condition.userId,
            lang: condition.lang,
            fsrs: {
                isNot: null,
            }
        },
        select: {
            fsrs: true,
        }
    })

    console.log('knowledgeUnits', knowledgeUnits);

    return knowledgeUnits.reduce((sum: number, knowledge) => {
        const interval = knowledge.fsrs ? dayjs(to)
            .diff(knowledge.fsrs.lastQuestionAt, 'second') / 60 / 60 / 24 : 0;

        if(knowledge.fsrs) {
            console.log('interval', interval, knowledge.fsrs.stability, retrievability(interval, knowledge.fsrs.stability));
        } else {
            console.log('interval', interval);
        }

        return sum + (knowledge.fsrs ? retrievability(interval, knowledge.fsrs.stability) : 0)}, 0);
}

export class KnowledgeMeasurement {
    static async doMeasurement(inputCondition: MeasurementCondition) {
        const condition = conditionSchema.parse(inputCondition);
        const dayOfEpoch = condition.dayOfEpoch ?? getDayOfEpoch();

        const existingMeasurement = await prisma.user_knowledge_measurements.findFirst({
            where: {
                lang: condition.lang,
                userId: condition.userId,
                dayOfEpoch,
            }
        });

        const from = dayjs(dayOfEpoch * 60 * 60 * 24 * 1000).toDate();
        const to = dayjs(dayOfEpoch * 60 * 60 * 24 * 1000).add(1, 'day').toDate();

        const state: KnowledgeMeasurementState = to.valueOf() > dayjs().valueOf() ? 'current' : 'frozen';


        const totalKnowledgesCount = await prisma.user_knowledge.count({
            where: {
                userId: condition.userId,
                lang: condition.lang,
                // knowledge: {
                //     gt: 0,
                // },
            }
        })


        const newKnowledgeCount = await prisma.user_knowledge.count({
            where: {
                userId: condition.userId,
                lang: condition.lang,
                // knowledge: {
                //     gt: 0,
                // },
                createdAt: {
                    gte: from,
                    lt: to,
                }
            }
        });

        const retrievabilitySum = await computeRetrievability(to, condition);

        const newCorrectAnswers = await prisma.user_knowledge.count({
            where: {
                userId: condition.userId,
                lang: condition.lang,
                knowledge: {
                    gt: 0,
                },
                createdAt: {
                    gte: from,
                    lt: to,
                }
            }
        });

        if (existingMeasurement) {
            return prisma.user_knowledge_measurements.update({
                where: {
                    id: existingMeasurement.id,
                },
                data: {
                    totalKnowledgesCount,
                    newKnowledgeCount,
                    retrievabilitySum,
                    newCorrectAnswers,
                    state
                }
            });
        } else {
            return prisma.user_knowledge_measurements.create({
                data: {
                    lang: condition.lang,
                    userId: condition.userId,
                    dayOfEpoch,
                    totalKnowledgesCount,
                    newKnowledgeCount,
                    retrievabilitySum,
                    newCorrectAnswers,
                    state,
                }
            });
        }
    }
}