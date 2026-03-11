import {courses, Prisma} from "@prisma/client";
import {prisma} from "../db";
import dayjs from "dayjs";
import assert from 'node:assert/strict'

interface QueryFilter {
    courseId: string;
}

export class QueryOrchestrator {
    async prepareQueries(filter: QueryFilter): Promise<courses> {
        const now = dayjs().toDate();

        const course = await prisma.courses.findUnique({
            where: {
                id: filter.courseId,
            }
        });

        assert.ok(course, 'Course not found');

        const queue = await prisma.user_knowledge.findMany({
            where: {
                userId: course.userId,
                lang: course.lang,
                OR: [
                    {
                        fsrs: {
                            is: null,
                        }
                    }, {
                        fsrs: {
                            is: {
                                nextQuestionAt: {
                                    lt: now,
                                }
                            }
                        }
                    }]
            }
        });

        const existingIds: string[] = course.questions.map(q => q.definitionId);
        const newQuestions: Prisma.user_questionCreateInput[] =
            queue.filter(knowledge => !existingIds.includes(knowledge.definitionId)).map(knowledge => ({
                definitionId: knowledge.definitionId,
                lang: course.lang,
                correctInRow: 0,
                fsrs: knowledge.fsrs,
            }));

        return prisma.courses.update({
            where: {
                id: filter.courseId,
            },
            data: {
                questions: {
                    push: newQuestions
                }
            }
        })
    }
}