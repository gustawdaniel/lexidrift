<script setup lang="ts">
defineProps<{
  initialLength: number
  questions: Array<{correctInRow: number}>
  correctFirst: boolean | null
  locked: boolean
}>();

// const initialLength = 10;
// const questions = [
//     {correctInRow: 2},
//   {correctInRow: 1},
//   {correctInRow: 2},
//   {correctInRow: 3},
//   {correctInRow: 0},
//   {correctInRow: 1},
//   {correctInRow: 1}
// ];
// const correctFirst = ref<boolean | null>(false);
</script>

<template>
  <div class="flex items-center justify-center space-x-2">

    <div v-for="row of new Array(Math.max(0, initialLength - questions.length))" :key="row" class="space-y-1">
      <div v-for="index of [1,2,3,4,5]" :key="index" class="w-2 ">
        <div class="h-2 rounded-full bg-green-500"></div>
      </div>
    </div>

    <div v-for="(question,rowIndex) of questions.toReversed()" :key="rowIndex" class="space-y-1">
      <div v-for="index of [1,2,3,4,5]" :key="index" class="w-2 ">
      <div class="h-2 rounded-full"
           :class="{
          'bg-gray-200': question.correctInRow < index,
          'bg-green-500': (question.correctInRow + Number(locked && correctFirst && (rowIndex === questions.length - 1)) >= index),
          'bg-red-500': (question.correctInRow >= index) && correctFirst === false && rowIndex === questions.length - 1
        }"
      ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>