<script setup lang="ts">
import {useWordsStore, type Word} from "~/store/words";

const search = ref('');

import {useDebounceFn} from '@vueuse/core'
import {shallowRef} from 'vue'
import {useUserStore} from "~/store/user";
import {useKnowledgeStore} from "~/store/knowledge";

const words = ref<Word[]>([]);

const wordsStore = useWordsStore();
const userStore = useUserStore();
const knowledgeStore = useKnowledgeStore();

const debouncedFn = useDebounceFn(async () => {
  // request

  if (!userStore.user) {
    return
  }

  if (!search.value) {
    return;
  }

  words.value = await wordsStore.searchWords({
    lang: userStore.user.defaultLanguageToLearn,
    search: search.value,
  })
}, 500, {maxWait: 5000})

watch(search, () => {
  console.log('search', search.value);
  debouncedFn()
});

async function setCardToWord(word: Word) {

  if (!userStore.user) {
    return
  }

  const lang = userStore.user.defaultLanguageToLearn;
  const changChanged = wordsStore.selectedWordOffset !== 100 * Math.floor((word.rank -1 )/ 100);

  if(changChanged) {
    wordsStore.selectedWordOffset =100 * Math.floor((word.rank - 1) / 100);
    await wordsStore.fetchWords({
      lang,
      limit: 100,
      offset: wordsStore.selectedWordOffset,
    });
  }


  wordsStore.selectedWordIndex = Math.max((word.rank - 1 ) % 100 , 0);

  if(changChanged) {
    await knowledgeStore.getKnowledgeList(lang, {
      limit: 100,
      offset: wordsStore.selectedWordOffset,
    });
  }
}

</script>

<template>
  <div class="max-w-md bg-white rounded-2xl p-4 mx-auto mb-4">

    <input type="text" placeholder="Search..."
           v-model="search"
           class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

    <div v-if="words.length > 0 && search" class="my-2  bg-white rounded-md border px-4 py-3 font-mono text-sm">

      <!--      <pre>{{words}}</pre>-->

      <div v-for="word in words" :key="word.id"
           :title="`Frequency: ${ word.count }. Rank: ${ word.rank }`"
           @click="setCardToWord(word)"
           class="rounded-md cursor-pointer hover:bg-gray-50 px-4 py-3 font-mono text-sm">
        {{ word.word }}
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>