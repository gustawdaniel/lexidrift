import type {Language} from "~/types/authTypes";
import {useUserStore} from "~/store/user";
import type {AnswersLog, QuestionWithDefinition} from "~/types/question";
import {toast} from "vue-sonner";
import type {FullKnowledge, KnowledgeListItem} from "~/store/knowledge";
import KnowledgeUpdateToast from "~/components/review/KnowledgeUpdateToast.vue";

interface Course {
    id: string;
    lang: string;
    questions: QuestionWithDefinition[];
}

interface AnswerParams {
    questionAt: Date;
    answerAt: Date;
    hintLevel: number; // 0 - no hint, 0.25 - sentence, 0.5 - img, 0.75 - definition, 1 - translation
    answer: string;
}

interface SaveAnswerParams {
    definitionId: string;
    logs: AnswersLog[];
    correctness: number;
}

const rawToastComponent = markRaw(KnowledgeUpdateToast);

export const useCourseStore = defineStore("courseStore", () => {
    const course = ref<Course | null>(null);
    const locked = ref<boolean>(false);
    const correctFirst = ref<boolean | null>(null);
    const userStore = useUserStore();

    async function getCourse(lang: Language): Promise<Course> {
        const res = await $fetch<Course>(`/course/${lang}`, {
            headers: {
                Authorization: `${userStore.token}`,
            },
            baseURL: import.meta.env.VITE_API_URL,
        });

        course.value = res;

       return res;
    }

    async function saveUserAnswer(params: SaveAnswerParams): Promise<FullKnowledge> {
        if(!course.value) {
            throw new Error('No course');
        }

        console.log("saveUserAnswer", params);
        console.log("string saveUserAnswer", JSON.stringify(params));
        const newKnowledge = await $fetch<FullKnowledge>(`/course/${course.value.lang}/answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${userStore.token}`,
            },
            body: JSON.stringify(params),
            baseURL: import.meta.env.VITE_API_URL,
        });

        console.log('newKnowledge', newKnowledge)

        return newKnowledge;
    }

    async function markFirstQuestionAsCorrect(params: AnswerParams) {
        if(!course.value) {
            throw new Error('No course');
        }
        // get first element removing it from questions
        const firstQuestion = course.value.questions.shift();

        if(!firstQuestion) {
            throw new Error('No first question');
        }

        const timeTakenMs = params.answerAt.getTime() - params.questionAt.getTime();
        const correctness = (Number(1) - params.hintLevel) * (1 / (1 + 0.01 * (timeTakenMs/1000)**0.8));

        firstQuestion.logs.push({
            questionAt: params.questionAt,
            answerAt: params.answerAt,
            timeTakenMs,
            hintLevel: params.hintLevel,
            answer: params.answer,
            correct: true,
            correctness
        });
        firstQuestion.correctInRow++;

        let nextQuestionIndex = 0;
        if(firstQuestion.correctInRow === 1) {
            nextQuestionIndex = 2 - 1;
        }
        if(firstQuestion.correctInRow === 2) {
            nextQuestionIndex = 4 - 1;
        }
        if(firstQuestion.correctInRow === 3) {
            nextQuestionIndex = 8 - 1;
        }
        if(firstQuestion.correctInRow === 4) {
            nextQuestionIndex = 16 - 1;
        }
        if(firstQuestion.correctInRow >= 5 || (
            firstQuestion.fsrs &&
            firstQuestion.logs.every(log => log.correct)) &&
            params.hintLevel === 0
        ) {
            console.log('course.value.questions', course.value.questions)

            const firstLog = firstQuestion.logs[0];
            if(!firstLog) {
                throw new Error('No first log');
            }

            const correctness = Math.min(...firstQuestion.logs.map(l => l.correctness));

            console.log('final correctness', correctness);

            const currentKnowledge = await saveUserAnswer({
                definitionId: firstQuestion.definitionId,
                logs: firstQuestion.logs,
                correctness
            });

            toast('',{
                component: rawToastComponent,
                componentProps: {
                    correctness,
                    prevStability: firstQuestion.fsrs?.stability,
                    stability: currentKnowledge.fsrs.stability,
                    prevDifficulty: firstQuestion.fsrs?.difficulty,
                    difficulty: currentKnowledge.fsrs.difficulty,
                    nextReview: currentKnowledge.fsrs.nextQuestionAt.split('T')[0],
                }
            })

            return;
        }

        console.log('firstQuestion', firstQuestion);
        console.log('last log', firstQuestion.logs[firstQuestion.logs.length - 1]);
        console.log('last log correctness', firstQuestion.logs[firstQuestion.logs.length - 1].correctness);

        course.value.questions.splice(nextQuestionIndex, 0, firstQuestion);
    }

    function markFirstQuestionAsIncorrect(params: AnswerParams) {
        if(!course.value) {
            throw new Error('No course');
        }
        // get first element removing it from questions
        const firstQuestion = course.value.questions.shift();

        if(!firstQuestion) {
            throw new Error('No first question');
        }

        const timeTakenMs = params.answerAt.getTime() - params.questionAt.getTime();
        const correctness = 0;

        firstQuestion.logs.push({
            questionAt: params.questionAt,
            answerAt: params.answerAt,
            timeTakenMs,
            hintLevel: params.hintLevel,
            answer: params.answer,
            correct: false,
            correctness,
        });
        firstQuestion.correctInRow = 0;

        let nextQuestionIndex = 1;
        course.value.questions.splice(nextQuestionIndex, 0, firstQuestion);
    }

    return {
        course,
        locked,
        correctFirst,
        getCourse,
        markFirstQuestionAsCorrect,
        markFirstQuestionAsIncorrect,
    };
});