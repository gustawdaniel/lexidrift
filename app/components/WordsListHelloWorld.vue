<script setup lang="ts">
import { ref } from 'vue';

export interface Word {
  id: string;
  word: string;
  count: number;
  lang: string;
  status: 'unchecked' | 'approved' | 'rejected';
}

import {useWordsStore} from "~/store/words";
import {useUserStore} from "~/store/user";

const wordsStore = useWordsStore();
const userStore = useUserStore();

onMounted(async () => {
  if(!userStore.user) {
    return;
  }

  await wordsStore.fetchWords({
    lang: userStore.user.defaultLanguageToLearn,
    limit: 100,
    offset: wordsStore.selectedWordOffset,
  });
  words.value = wordsStore.words.map((word) => ({...word, status: 'unchecked'}));
});

const words = ref<Word[]>([]);

const updateStatus = (wordId: string, newStatus: 'approved' | 'rejected') => {
  const word = words.value.find(w => w.id === wordId);
  if (word) {
    word.status = newStatus;
  }
};
</script>

<template>
  <div class="space-y-4 p-4">
    <div v-for="word in words" :key="word.id" class="flex items-center space-x-4 p-2 border rounded-lg shadow">
      <div
          class="w-6 h-6 rounded"
          :class="{
          'bg-gray-300': word.status === 'unchecked',
          'bg-green-500': word.status === 'approved',
          'bg-red-500': word.status === 'rejected',
        }"
      ></div>
      <span :title="`Count: ${ word.count }`" class="flex-1 text-lg font-medium">{{ word.word }}</span>
      <button @click="updateStatus(word.id, 'approved')" class="text-green-500 hover:text-green-700">✔</button>
      <button @click="updateStatus(word.id, 'rejected')" class="text-red-500 hover:text-red-700">✖</button>
    </div>
  </div>
</template>
