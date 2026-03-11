<script setup lang="ts">
import {useWordsStore} from "~/store/words";
import {type Definition, useDefinitionStore} from "~/store/definition";
import {useUserStore} from "~/store/user";
import {useImagifyStore} from "~/store/imagify";

const wordsStore = useWordsStore();
const definitionStore = useDefinitionStore()
const imagifyStore = useImagifyStore();
const vocalizationStore = useVocalizationStore();
import {SpeakerWaveIcon, ArrowLeftIcon, ArrowRightIcon} from '@heroicons/vue/24/solid';

import ImageLoading from "~/components/discovery/ImageLoading.vue";
import SentenceWithMarkedText from "~/components/discovery/SentenceWithMarkedText.vue";

import {useVocalizationStore} from "~/store/vocalization";
import type {Language} from "~/types/authTypes";
import {useKnowledgeStore} from "~/store/knowledge";
import {Icon} from "@iconify/vue";

const userStore = useUserStore()

const definition = ref<Definition | null>(null);
const image = ref<string | null>(null);

watch(wordsStore, async () => {
  if (!userStore.user) {
    return
  }

  if (!wordsStore.selectedWord) {
    return
  }

  image.value = null;
  definition.value = null;

  console.log('selected word', wordsStore.selectedWord.word);
  try {
    const receivedDefinition = await definitionStore.getDefinition(userStore.user.defaultLanguageToLearn, wordsStore.selectedWord.word);

    if (receivedDefinition?.word !== wordsStore.selectedWord.word) {
      return;
    }
    definition.value = receivedDefinition;

    if (!definition.value) return;

    if (!definition.value.examples.length) return;
    image.value = await imagifyStore.imagify(definition.value.examples[0].image_prompt);
  } catch (error) {
    console.error(error);
    // TODO: better alert + automation
    alert('Error fetching definition, please contact support: gustaw.daniel@gmail.com');
  }
});

function setPrevWord() {
  if (wordsStore.selectedWordIndex !== null) {
    if (wordsStore.selectedWordIndex === 0) {
      return;
    }

    wordsStore.selectedWordIndex -= 1;
  }
}

function setNextWord() {
  if (wordsStore.selectedWordIndex !== null) {
    if (wordsStore.selectedWordIndex === wordsStore.words.length - 1) {
      return;
    }

    wordsStore.selectedWordIndex += 1;
  }
}

function playAudio(lang: Language, word: string) {
  vocalizationStore.vocalize(lang, word);
}

const knowledgeStore = useKnowledgeStore();

const markAsLearning = () => {
  console.log('Marked as learning');
  if (wordsStore.selectedWordIndex === null) return;

  if (!definition.value) return;

  knowledgeStore.knowledgeList[wordsStore.selectedWordIndex].knowledge = 0

  knowledgeStore.setKnowledge(knowledgeStore.knowledgeList[wordsStore.selectedWordIndex], definition.value, 0);

  setNextWord();
};

const markAsKnown = () => {
  console.log('Marked as known');

  if (wordsStore.selectedWordIndex === null) return;

  if (!definition.value) return;

  knowledgeStore.knowledgeList[wordsStore.selectedWordIndex].knowledge = 1;

  knowledgeStore.setKnowledge(knowledgeStore.knowledgeList[wordsStore.selectedWordIndex], definition.value, 1);

  setNextWord();
};
</script>

<template>
  <div class="max-w-md bg-white shadow-lg rounded-2xl p-4 mx-auto ">
    <img v-if="image" :src="image" alt="" class="rounded-md mb-4 aspect-[4/3]"/>
    <ImageLoading v-else/>


    <div class="flex items-center justify-between" v-if="wordsStore.selectedWord">
      <h2 class="text-xl font-bold">{{ wordsStore.selectedWord.word }}</h2>
      <SpeakerWaveIcon
          class="w-6 h-6 cursor-pointer"
          @click="playAudio(wordsStore.selectedWord.lang,wordsStore.selectedWord.word)"
      />
    </div>

    <div class="text-gray-500 flex justify-between text-sm">
      <span v-if="definition && userStore.user">{{ definition.translation[userStore.user.language] }}</span>
      <div v-else class="w-20 h-5 bg-gray-100 rounded-md mb-4 animate-pulse"></div>

      <span v-if="wordsStore.selectedWord">{{ wordsStore.selectedWord.count }}</span>
    </div>

    <div v-if="definition && userStore.user" class="mt-3 mb-2 flex items-start gap-2 text-gray-700">
      <SpeakerWaveIcon
          class="w-6 h-6 cursor-pointer flex-shrink-0"
          @click="playAudio(userStore.user.language, definition.definition[userStore.user.language])"/>

      <p>{{ definition.definition[userStore.user.language] }}</p>
    </div>
    <div v-else class="w-full h-6 bg-gray-100 rounded-md mb-4 animate-pulse"></div>


    <div v-if="definition && wordsStore.selectedWord" class="mt-3 flex items-center gap-2 text-gray-600">
      <SpeakerWaveIcon class="w-6 h-6 cursor-pointer"
                       @click="playAudio(wordsStore.selectedWord.lang, definition.examples[0][wordsStore.selectedWord.lang])"/>
      <!--      <p>{{ definition.examples[0][wordsStore.selectedWord.lang] }}</p>-->
      <SentenceWithMarkedText
          :sentence="definition.examples[0][wordsStore.selectedWord.lang]"
          :markedText="wordsStore.selectedWord.word"/>
    </div>
    <div v-else class="w-full h-6 bg-gray-100 rounded-md mb-4 animate-pulse"></div>

    <div v-if="definition && userStore.user" class="mt-3 flex items-center gap-2 text-gray-600">
      <SpeakerWaveIcon class="w-6 h-6 cursor-pointer"
                       @click="playAudio(userStore.user.language, definition.examples[0][userStore.user.language])"/>
      <!--      <p>{{ definition.examples[0][userStore.user.language] }}</p>-->
      <SentenceWithMarkedText
          :sentence="definition.examples[0][userStore.user.language]"
          :markedText="definition.translation[userStore.user.language]"/>
    </div>
    <div v-else class="w-full h-6 bg-gray-100 rounded-md mb-4 animate-pulse"></div>

    <!-- Footer with navigation and actions -->
    <div class="mt-4 flex items-center justify-between border-t pt-4">
      <span title="Previous Word">
        <Icon icon="lsicon:arrow-left-outline"
              class="w-6 h-6 flex-shrink-0 text-gray-500 hover:text-gray-700 700 cursor-pointer"
              @click="setPrevWord"
        />
      </span>

      <div class="flex gap-2">
        <button class="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600"
                @click="markAsLearning">
          Should Learn
        </button>
        <button class="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600"
                @click="markAsKnown">
          Already Know
        </button>
      </div>

      <span title="Next Word">
        <Icon icon="lsicon:arrow-right-outline"
              class="w-6 h-6 flex-shrink-0 text-gray-500 hover:text-gray-700 cursor-pointer"
              @click="setNextWord"
        />
      </span>


    </div>
  </div>

  <!--  <pre>{{ wordsStore.selectedWord }}</pre>-->
  <!--  <pre>{{ wordsStore.selectedWordIndex }}</pre>-->

  <!--    <pre>{{definition}}</pre>-->

  <!--  <pre>{{image}}</pre>-->

  <!--  <img v-if="image" :src="image" alt="">-->

  <!--  <button @click="setPrevWord">prev</button>-->
  <!--  <button @click="setNextWord">next</button>-->
</template>

<style scoped>

</style>