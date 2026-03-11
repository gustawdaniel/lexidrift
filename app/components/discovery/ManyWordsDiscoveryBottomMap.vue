<script setup lang="ts">
import {ref} from 'vue';
import {useWordsStore} from "~/store/words";
import {type KnowledgeListItem, useKnowledgeStore} from "~/store/knowledge";
import {useUserStore} from "~/store/user";

const knowledgeStore = useKnowledgeStore();

function colorizeKnowledge(knowledge: KnowledgeListItem) {
  if(knowledge.correctness === false) {
    // Tailwind's bg-red-300
    return {backgroundColor: "#ffacb2"};
  }

  if (knowledge.knowledge === undefined) {
    if(knowledge.correctness === true) {
      // Tailwind's bg-red-300
      return {backgroundColor: "#acffc1"};
    }

    return {backgroundColor: "#D1D5DB"}; // Tailwind's bg-gray-300
  }

  const k = 1 - Math.max(0, Math.min(1, knowledge.knowledge)); // Ensure it's between 0 and 1

  // Interpolating between #6366F1 (Indigo) and #8B5CF6 (Purple)
  const r = Math.round(99 + (139 - 99) * k);
  const g = Math.round(102 + (92 - 102) * k);
  const b = Math.round(241 + (246 - 241) * k);

  return {backgroundColor: `rgb(${r}, ${g}, ${b})`};
}


const rowCount = 4;
const colCount = 100 / rowCount;

const rows = computed<KnowledgeListItem[][]>(() => {

  const mergedList: KnowledgeListItem[] = knowledgeStore.knowledgeList.map((item, index) => {
    return {
      ...item,
      correctness: index < wordsStore.words.length ? wordsStore.words[index].correctness : undefined,
      words: index < wordsStore.words.length ? wordsStore.words[index].word : '',
    };
  });

  const colsPerRow = Math.ceil(mergedList.length / rowCount);
  return Array.from({length: rowCount}, (_, rowIndex) =>
      mergedList.slice(rowIndex * colsPerRow, (rowIndex + 1) * colsPerRow)
  );
});

const wordsStore = useWordsStore();
const userStore = useUserStore();

async function fetchKnowledge() {
  if (!userStore.user) {
    return;
  }

  const lang = userStore.user.defaultLanguageToLearn;

  await Promise.all([
    wordsStore.fetchWords({
      lang,
      limit: 100,
      offset: wordsStore.selectedWordOffset,
    }),
    knowledgeStore.getKnowledgeList(lang, {
      limit: 100,
      offset: wordsStore.selectedWordOffset,
    })
  ]);
};

onMounted(async () => {
  await fetchKnowledge();
});

async function previous(step = 1) {
  console.log('Previous');
  if (wordsStore.selectedWordOffset <= 0) return;
  wordsStore.selectedWordOffset = Math.max(wordsStore.selectedWordOffset - (100 * step), 0);

  await fetchKnowledge()
};

async function next(step = 1) {
  console.log('Next');
  wordsStore.selectedWordOffset += (100 * step);
  await fetchKnowledge()
};

const setSelectedWordIndex = (index: number, knowledge: Pick<KnowledgeListItem, 'correctness'>) => {
  if(knowledge.correctness === false) {
    return
  }

  wordsStore.selectedWordIndex = index;
};

import {Icon} from "@iconify/vue";

</script>

<template>
  <div class="max-w-md mx-auto mt-2">
    <!--    <pre>{{ knowledgeStore.knowledgeList }}</pre>-->


    <div class="border bg-white shadow-lg rounded-2xl  px-4 pb-4">
      <p class="text-center text-xs py-1">word
        {{ wordsStore.selectedWordOffset + (wordsStore.selectedWordIndex ?? 0) + 1 }} from
        {{ wordsStore.selectedWordOffset + 1 }} - {{ wordsStore.selectedWordOffset + 100 }}</p>

      <div class="flex items-center justify-center">
        <!-- Left Arrow -->
        <div>
          <span title="Previous hundred">
          <Icon icon="lsicon:arrow-left-outline"
                class="w-6 h-6 flex-shrink-0 text-gray-500 hover:text-gray-700 700 cursor-pointer "
                @click="previous(1)"

          ></Icon>
</span>
          <span title="Previous 5 hundreds">
          <Icon icon="lsicon:double-arrow-left-outline"
                class="w-6 h-6 flex-shrink-0 text-gray-500 hover:text-gray-700 700 cursor-pointer"
                @click="previous(5)"

          ></Icon>
            </span>
        </div>

        <!-- Grid -->
        <div class="border flex flex-col mx-4 gap-0.5" :key="wordsStore.selectedWordOffset">
          <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="flex gap-0.5">
            <div v-for="(knowledge, index) in row"

                 :key="index"
                 class="w-3 h-3 rounded"
                 :style="colorizeKnowledge(knowledge)"
                 @click="setSelectedWordIndex(rowIndex * colCount + index, knowledge)">
              <div
                  :title="knowledge.word"
                  v-if="rowIndex === Math.floor((wordsStore.selectedWordIndex ?? 0) / colCount) && index === ((wordsStore.selectedWordIndex ?? 0) % colCount)"
                  class="m-auto w-1 h-1 mt-1 bg-black rounded-full"></div>
            </div>
          </div>

<!--          <pre>{{ rows[0][0] }}</pre>-->
        </div>

        <!-- Right Arrow -->


        <div>
          <span title="Next hundred">
          <Icon icon="lsicon:arrow-right-outline"
                class="w-6 h-6 flex-shrink-0 text-gray-500 hover:text-gray-700 700 cursor-pointer"
                @click="next(1)"


          ></Icon>
</span>
          <span title="Next 5 hundreds">
          <Icon icon="lsicon:double-arrow-right-outline"
                class="w-6 h-6 flex-shrink-0 text-gray-500 hover:text-gray-700 700 cursor-pointer"
                @click="next(5)"
          ></Icon>
            </span>
        </div>
      </div>


    </div>
  </div>
</template>