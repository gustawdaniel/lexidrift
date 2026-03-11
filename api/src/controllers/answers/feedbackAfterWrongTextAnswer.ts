import {FastifyReply, FastifyRequest, RouteGenericInterface} from "fastify";
import {Language} from "@prisma/client";
import {getDb, prisma} from "../../db";
import {MongoClient} from "mongodb";
import {z} from "zod";

// Function to calculate Levenshtein distance
function levenshtein(a: string, b: string): number {
    const tmp: number[] = [];
    let i: number, j: number;
    const alen = a.length;
    const blen = b.length;

    if (alen === 0) {
        return blen;
    }
    if (blen === 0) {
        return alen;
    }

    for (i = 0; i <= blen; i++) {
        tmp[i] = i;
    }

    for (i = 1; i <= alen; i++) {
        let pre = tmp[0];
        tmp[0] = i;

        for (j = 1; j <= blen; j++) {
            const val = a[i - 1] === b[j - 1] ? 0 : 1;
            const cost = Math.min(tmp[j] + 1, tmp[j - 1] + 1, pre + val);
            pre = tmp[j];
            tmp[j] = cost;
        }
    }

    return tmp[blen];
}

export interface FeedbackAfterWrongTextAnswerRouteGeneric extends RouteGenericInterface {
    Body: {
        questionLang: Language;
        question: string;
        answer: string;
        answerLang: Language;
    };
}

const feedbackAfterWrongTextAnswerBodyModel = z.object({
    questionLang: z.nativeEnum(Language),
    question: z.string(),
    answer: z.string(),
    answerLang: z.nativeEnum(Language),
});

export async function definedFeedbackAfterWrongTextAnswer(
    req: FastifyRequest<FeedbackAfterWrongTextAnswerRouteGeneric>,
    reply: FastifyReply,
) {
    const {
        questionLang,
        question,
        answer,
        answerLang,
    } = feedbackAfterWrongTextAnswerBodyModel.parse(req.body);

    const db = await getDb();

    const regex = new RegExp(`(^|, |\\/)${answer}(, |\\/|\$)`, 'i');

    // Use Promise.all to run both MongoDB query and HTTP request in parallel
    const definedWordsResponse = await db.collection("definitions")
        .find({
            [`translation.${answerLang}`]: regex,
            lang: questionLang
        })
        .project({
            _id: 0,
            id: '$_id',
            word: 1,
            rank: 1
        })
        .toArray();

    // Merge both lists and remove duplicates based on the word field
    const allWords = [...definedWordsResponse];

    // Remove duplicates by word
    const uniqueWords = Array.from(new Map(allWords.map(word => [word.word, word])).values());

    // Sort words by Levenshtein distance to the question
    const sortedWords = uniqueWords.map(word => ({
        ...word,
        distance: levenshtein(question, word.word), // Add the Levenshtein distance
    })).sort((a, b) => a.distance - b.distance); // Sort by the distance

    return sortedWords;
}

export async function newFeedbackAfterWrongTextAnswer(
    req: FastifyRequest<FeedbackAfterWrongTextAnswerRouteGeneric>,
    reply: FastifyReply,
) {
    const {
        questionLang,
        question,
        answer,
        answerLang,
    } = feedbackAfterWrongTextAnswerBodyModel.parse(req.body);

    const db = await getDb();

    const regex = new RegExp(`(^|, |\\/)${answer}(, |\\/|\$)`, 'i');

    // Use Promise.all to run both MongoDB query and HTTP request in parallel
    let translatedWords = [];

    try {
        const response = await fetch(`https://lexify.lexidrift.com/define`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "lang": answerLang,
                "word": answer,
                "style": "wordup"
            }),
        });
        const lexifyResponse = await response.json();

        if(!lexifyResponse.definition) return [];

        const wordsStrings = lexifyResponse.definition.translation[questionLang].split(/[,\/]/);

        const prismaWords = await prisma.words.findMany({
            where: {
                word: {
                    in: wordsStrings,
                },
                lang: questionLang,
            },
            select: {
                id: true,
                word: true,
                rank: true,
            }
        });

        const proposedWord: string = lexifyResponse.definition.translation[questionLang];

        const proposedWords: string[] = proposedWord.split(/[,\/]/)

        translatedWords = prismaWords.concat([
            ...proposedWords.map(word => ({
                id: '',
                word,
                rank: 0,
            }))
        ]);

    } catch (error) {
        console.error("Error fetching translated words:", error);
        return [];
    }


    // Merge both lists and remove duplicates based on the word field
    const allWords = [...translatedWords];

    // Remove duplicates by word
    const uniqueWords = Array.from(new Map(allWords.map(word => [word.word, word])).values());

    // Sort words by Levenshtein distance to the question
    const sortedWords = uniqueWords.map(word => ({
        ...word,
        distance: levenshtein(question, word.word), // Add the Levenshtein distance
    })).sort((a, b) => a.distance - b.distance); // Sort by the distance

    return sortedWords;
}