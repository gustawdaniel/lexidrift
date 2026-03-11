import {FastifyInstance, FastifyPluginOptions, RouteShorthandOptions} from "fastify";

import {version} from "./controllers/app/version";
import {googleVerify} from "./controllers/auth/googleVerify";
import {wordsList} from "./controllers/word/wordsList";
// import {getDefinition} from "./controllers/definition/getDefinition";
import {putKnowledge} from "./controllers/knowledge/putKnowledge";
import {getKnowledgeList} from "./controllers/knowledge/getKnowledgeList";
import {getCourse} from "./controllers/course/getCourse";
import {saveAnswer} from "./controllers/course/saveAnswer";
import {updateMe} from "./controllers/auth/updateMe";
import {registerSSE} from "./controllers/session/sse";
import {requestVideoGeneration} from "./controllers/video/requestVideoGeneration";
import {uploadVideo } from "./controllers/video/uploadVideo";
import { longPoolingForVideosToGenerate } from "./controllers/video/longPoolingForVideosToGenerate";
import {listVideos} from "./controllers/video/listVideos";
import {getSessions} from "./controllers/session/getSessions";
import {doMeasurement} from "./controllers/measurement/doMeasurement";
import {
    generateAuthenticationOptions,
    generateRegistrationOptions,
    verifyAuthentication,
    verifyRegistration
} from "./controllers/auth/webauthn";
import {
    definedFeedbackAfterWrongTextAnswer,
    newFeedbackAfterWrongTextAnswer
} from "./controllers/answers/feedbackAfterWrongTextAnswer";

const PROTECTED: RouteShorthandOptions = { config: { isProtected: true } };
const PUBLIC: RouteShorthandOptions = { config: { isProtected: false } };

export function router(
    server: FastifyInstance,
    _options: FastifyPluginOptions,
    next: () => void,
) {
    server.get('/', PUBLIC, version);
    server.post('/google-verify', PUBLIC, googleVerify)
    server.put('/me', PROTECTED, updateMe);

    server.get('/generate-registration-options', PUBLIC, generateRegistrationOptions)
    server.post('/verify-registration', PUBLIC, verifyRegistration)
    server.get('/generate-authentication-options', PUBLIC, generateAuthenticationOptions)
    server.post('/verify-authentication', PUBLIC, verifyAuthentication)

    server.get('/words', PROTECTED, wordsList);

    // server.get('/definition/:lang/:word', PROTECTED, getDefinition);

    server.put('/knowledge/:id?', PROTECTED, putKnowledge);
    server.get('/knowledge/:lang', PROTECTED, getKnowledgeList);

    server.get('/course/:lang', PROTECTED, getCourse);
    server.post('/course/:lang/answer', PROTECTED, saveAnswer);
    
    server.post('/video/request', PROTECTED, requestVideoGeneration);
    server.put('/video/upload/:id', PUBLIC, uploadVideo);
    server.get('/video/to-generate', PUBLIC, longPoolingForVideosToGenerate);
    server.get('/videos', PROTECTED, listVideos);

    server.get('/sse', PROTECTED, registerSSE);
    server.get('/sessions', PROTECTED, getSessions);

    server.get('/measurement', PROTECTED, doMeasurement);


    server.post('/defined-feedback-after-wrong-text-answer', PROTECTED, definedFeedbackAfterWrongTextAnswer);
    server.post('/new-feedback-after-wrong-text-answer', PROTECTED, newFeedbackAfterWrongTextAnswer);

    next();
}