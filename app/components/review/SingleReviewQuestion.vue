<script setup lang="ts">

import {useUserStore} from "~/store/user";
import {buildQueryToMarkText} from "~/helpers/buildQueryToMarkText";
import {useCourseStore} from "~/store/course";
import type {QuestionWithDefinition} from "~/types/question";
import SentenceWithMarkedText from "~/components/discovery/SentenceWithMarkedText.vue";
import {SpeakerWaveIcon} from "@heroicons/vue/24/solid";
import type {Language} from "~/types/authTypes";
import {useVocalizationStore} from "~/store/vocalization";
import ImageLoading from "~/components/discovery/ImageLoading.vue";
import {useImagifyStore} from "~/store/imagify";
import CorrectInRowProgressBar from "~/components/review/CorrectInRowProgressBar.vue";
import CorrectInFrameProgressBar from "~/components/review/CorrectInFrameProgressBar.vue";
import {useSettingsStore} from "~/store/settings";
import {useAnswersStore, type WrongTextAnswerTranslation} from "~/store/answers";
import AnswerVerificationDialog from "~/components/review/dialogs/AnswerVerificationDialog.vue";
import {openModal} from "~/composables/modal";

const props = defineProps<{ question: QuestionWithDefinition }>();

const userStore = useUserStore();
const vocalizationStore = useVocalizationStore();


const userAnswer = ref('');
const feedback = ref('');
const feedbackAfterWrongTextAnswer = ref<Array<WrongTextAnswerTranslation>>([]);
const disablePropsWatcher = ref<boolean>(false);

const firstCheckedAnswer = ref<string | null>(null);
const questionAt = ref<Date>(new Date());
const hintLevel = ref<number>(0); // 0-1 (0 no hint, 0.25 sentence, 0.5 img, 0.75 definition, 1 translation)
const imagifyStore = useImagifyStore();
const answerStore = useAnswersStore();

const courseStore = useCourseStore();

function setDefaultState() {
  userAnswer.value = '';
  firstCheckedAnswer.value = null;
  hintLevel.value = 0;
  questionAt.value = new Date();
  feedback.value = '';
  feedbackAfterWrongTextAnswer.value = [];

  courseStore.locked = false;
  courseStore.correctFirst = null;
}

onMounted(async () => {
  console.log("mounted")

  if (settingsStore.readWords)
    playAudio(props.question.definition.lang, props.question.definition.word).catch(console.error);

  image.value = await imagifyStore.imagify(props.question.definition.examples[0].image_prompt);
});

const settingsStore = useSettingsStore();

watch(props, async () => {
  console.log("props changed")
  if(disablePropsWatcher.value) return;

  if (settingsStore.readWords)
    playAudio(props.question.definition.lang, props.question.definition.word).catch(console.error);

  image.value = await imagifyStore.imagify(props.question.definition.examples[0].image_prompt);
});

async function checkAnswer() {
  console.log("checkAnswer")
  if (courseStore.locked) {
    return;
  }

  const user = userStore.user;

  if (!user) {
    throw new Error('No user')
  }

  if (firstCheckedAnswer.value === null) {
    firstCheckedAnswer.value = userAnswer.value;
  }

  // language that user using natively
  const correctAnswers = buildQueryToMarkText(props.question.definition.translation[user.language].toLowerCase());
  courseStore.correctFirst = correctAnswers.includes(firstCheckedAnswer.value.trim().toLowerCase());
  const correctNow = correctAnswers.includes(userAnswer.value.trim().toLowerCase());

  console.log('correct', courseStore.correctFirst, correctNow);

  if (courseStore.correctFirst) {
    const questionAtCopy = questionAt.value;
    const answerCopy = userAnswer.value;
    const hintLevelCopy = hintLevel.value;
    const answerAt = new Date();

    courseStore.locked = true;
    const time = new Date().getTime();

    const timeTakenMs = answerAt.getTime() - questionAtCopy.getTime();
    const correctness = (Number(1) - hintLevelCopy) * (1 / (1 + 0.01 * (timeTakenMs / 1000) ** 0.8));
    console.log('correctness', answerCopy, correctness);

    if (settingsStore.readIncorrectSentence) {
      hintLevel.value = 1;
      await playAudio(props.question.definition.lang, props.question.definition.examples[0][props.question.definition.lang]);
    }

    setDefaultState();

    courseStore.markFirstQuestionAsCorrect({
      answerAt,
      questionAt: questionAtCopy,
      answer: answerCopy,
      hintLevel: hintLevelCopy
    }).catch(console.error);
    return;
  }

  // not correct first, to it is incorrect but corrected after feedback
  if (correctNow) {
    const questionAtCopy = questionAt.value;
    const firstCheckedAnswerCopy = firstCheckedAnswer.value;
    const hintLevelCopy = hintLevel.value;
    const answerAt = new Date();

    if (settingsStore.readIncorrectSentence) {
      hintLevel.value = 1;
      await playAudio(props.question.definition.lang, props.question.definition.examples[0][props.question.definition.lang]);
    }

    setDefaultState();
    courseStore.markFirstQuestionAsIncorrect({
      answerAt,
      questionAt: questionAtCopy,
      answer: firstCheckedAnswerCopy,
      hintLevel: hintLevelCopy
    });
    return;
  }

  feedback.value = correctAnswers.includes(userAnswer.value.trim().toLowerCase())
      ? '✅ Correct!'
      : `❌ Incorrect! The correct answer is: "${correctAnswers.join(', ')}"`;

  answerStore.getDefinedFeedbackAfterWrongTextAnswer({
    questionLang: props.question.definition.lang,
    question: props.question.definition.word,
    answer: userAnswer.value,
    answerLang: user.language,
  }).then((feedback) => {
    const allWords = [...feedbackAfterWrongTextAnswer.value, ...feedback];
    const uniqueWords = Array.from(new Map(allWords.map(word => [word.word, word])).values());
    feedbackAfterWrongTextAnswer.value = uniqueWords.sort((a, b) => a.distance - b.distance); // Sort by the distance
  });

  answerStore.getNewFeedbackAfterWrongTextAnswer({
    questionLang: props.question.definition.lang,
    question: props.question.definition.word,
    answer: userAnswer.value,
    answerLang: user.language,
  }).then((feedback) => {
    const allWords = [...feedbackAfterWrongTextAnswer.value, ...feedback];
    const uniqueWords = Array.from(new Map(allWords.map(word => [word.word, word])).values());
    feedbackAfterWrongTextAnswer.value = uniqueWords.sort((a, b) => a.distance - b.distance); // Sort by the distance
  });
};

async function incrementHint() {
  if (hintLevel.value === 1) {
    const questionAtCopy = questionAt.value;
    const answerCopy = userAnswer.value;
    const answerAt = new Date();
    setDefaultState();
    courseStore.markFirstQuestionAsIncorrect({
      answerAt,
      questionAt: questionAtCopy,
      answer: answerCopy,
      hintLevel: 1
    });
  }

  if (hintLevel.value === 0) {
    hintLevel.value = 0.25;
  } else if (hintLevel.value === 0.25) {
    hintLevel.value = 0.5;
  } else if (hintLevel.value === 0.5) {
    hintLevel.value = 1;
  }
  // TODO: maybe add hint level 0.75 (definition)

  // if (hintLevel.value === 0.25) {
  //   image.value = await imagifyStore.imagify(props.question.definition.examples[0].image_prompt);
  // }
}

async function playAudio(lang: Language, word: string): Promise<void> {
  try {
    await vocalizationStore.vocalize(lang, word);
  } catch (e) {
    console.log('vocalization failed', e);
  }
}

const image = ref<string | null>(null);
const modal = useModal()

async function verifyAnswerCorrectness() {
  const user = userStore.user;

  if (!user) {
    throw new Error('No user')
  }

  if(!userAnswer.value) {
    throw new Error('No user answer');
  }

  answerStore.checkIfMyAnswerWasCorrect({
    questionLang: props.question.definition.lang,
    question: props.question.definition.word,
    answer: userAnswer.value,
    answerLang: user.language,
  }).then(async (answerCorrectness) => {
    console.log('answerCorrectness', answerCorrectness);

    if(answerCorrectness.success) {
      await openModal(AnswerVerificationDialog, {
        answerCorrectness
      })

      if(answerCorrectness.correctness.correct) {
        feedback.value = '✅ Correct! Your translation will be added to the dictionary.';

        if(!courseStore.course) {
          console.error('No course');
          return;
        }

        if(!courseStore.course.questions[0]) {
          console.error('No question');
          return;
        }

        if(!userStore.user) {
          console.error('No user');
          return;
        }

        disablePropsWatcher.value = true;

        const existingRecord = courseStore.course.questions[0].definition;
        const existingTranslations = (existingRecord.translation[userStore.user.language] || '').split(/[,\/]/).filter(Boolean)

        courseStore.course.questions[0].definition.translation[userStore.user.language]
            = [...existingTranslations, userAnswer.value].join('/');

        setTimeout(() => {
          disablePropsWatcher.value = false;

          firstCheckedAnswer.value = null;
          checkAnswer()
        }, 10);
      }
    }
    else {
      feedback.value = answerCorrectness.error;
    }
  }).catch(console.error);
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
      <CorrectInRowProgressBar
          :correctInRow="question.correctInRow + Number(courseStore.locked) * Number(courseStore.correctFirst)"
          :correctFirst="courseStore.correctFirst"
          class="mb-4"/>

      <h2 class="text-xl font-semibold text-gray-800">Translate this word</h2>

      <div class="flex justify-between items-center mt-2">
        <div class="flex items-center gap-2">
          <p class="text-3xl font-bold text-blue-600">{{ question.definition.word }}</p>
          <SpeakerWaveIcon
              class="w-6 h-6 cursor-pointer"
              @click="playAudio(question.definition.lang,question.definition.word)"
          />
        </div>

        <button class="mt-4 text-gray-500 p-2 rounded-lg hover:bg-gray-50 transition" @click="incrementHint">
          <span v-if="hintLevel === 0">Hint</span>
          <span v-else-if="hintLevel === 0.25">Img</span>
          <span v-else-if="hintLevel === 0.5">Answer</span>
          <span v-else-if="hintLevel === 1">Next</span>
        </button>
      </div>


      <div v-if="hintLevel >= 0.25" class="mt-2 flex items-center gap-2 text-gray-600">
        <SpeakerWaveIcon class="w-6 h-6 cursor-pointer"
                         @click="playAudio(question.definition.lang, question.definition.examples[0][question.definition.lang])"/>
        <!--      <p>{{ definition.examples[0][question.definition.lang] }}</p>-->
        <SentenceWithMarkedText
            :sentence="question.definition.examples[0][question.definition.lang]"
            :markedText="question.definition.word"/>
      </div>

      <div v-if="hintLevel >= 0.5" class="mt-2">

        <img v-if="image" :src="image" alt="" class="rounded-md mb-4 aspect-[4/3]"/>
        <ImageLoading v-else/>
      </div>

      <div v-if="hintLevel >= 1 && userStore.user" class="mt-1 flex items-center gap-2 text-gray-600">
        <SpeakerWaveIcon class="w-6 h-6 cursor-pointer"
                         @click="playAudio(userStore.user.language, question.definition.examples[0][userStore.user.language])"/>
        <!--      <p>{{ definition.examples[0][userStore.user.language] }}</p>-->
        <SentenceWithMarkedText
            :sentence="question.definition.examples[0][userStore.user.language]"
            :markedText="question.definition.translation[userStore.user.language]"/>
      </div>

      <input
          autofocus
          @keyup.enter="checkAnswer"
          v-model="userAnswer"
          type="text"
          class="mt-4 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter translation..."
      />


      <button
          v-if="!courseStore.locked"
          @click="checkAnswer"
          class="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Check Answer
      </button>

      <button
          v-if="courseStore.locked"
          :disabled="courseStore.locked"
          class="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        Great!
      </button>

      <p v-if="feedback" class="mt-4 text-lg font-semibold"
         :class="feedback.includes('✅') ? 'text-green-600' : 'text-red-600'">
        {{ feedback }}
      </p>

      <!--      <div v-if="feedbackAfterWrongTextAnswer.length > 0" class="mt-4">-->
      <!--        <h3 class="text-lg font-semibold">Your answer match to:</h3>-->
      <!--        <ul class="list-disc pl-5">-->
      <!--          <li v-for="(feedback, index) in feedbackAfterWrongTextAnswer" :key="index">-->
      <!--            {{ feedback.word }}-->
      <!--          </li>-->
      <!--        </ul>-->
      <!--      </div>-->

      <div v-if="feedbackAfterWrongTextAnswer.length > 0" class="mt-4">
        <span class="text">Do you mean:</span>
        <span class="text-gray-700">
        <span v-for="(feedback, index) in feedbackAfterWrongTextAnswer" :key="index">
            <span
                :title="`Distance: ${feedback.distance}, Rank: ${feedback.rank}`"
                :class="{
                    'font-bold': feedback.distance < 2, // Far match (red)
                    'ml-2': true
                }"
            >
                {{ feedback.word }}
            </span>
            <span v-if="index < feedbackAfterWrongTextAnswer.length - 1">,</span> <!-- Add commas between words -->
        </span>
        </span>
      </div>

      <div class="mt-4" v-if="feedback">
        <button
            :disabled="answerStore.checkIfMyAnswerWasCorrectLoading"
            @click="verifyAnswerCorrectness"
            title="Your answer will be checked again"
            class="w-full text-sm text-violet-600 py-1 rounded-lg hover:text-violet-700 transition"
        >{{ answerStore.checkIfMyAnswerWasCorrectLoading ? 'Loading...' : 'Verify if my answer is correct!'}}</button>
      </div>

    </div>
  </div>
</template>