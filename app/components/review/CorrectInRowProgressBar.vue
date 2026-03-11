<script setup lang="ts">
defineProps<{
  correctInRow: number
  correctFirst: boolean | null
}>();
</script>

<template>
  <div class="flex items-center space-x-2" :title="`Correct in row: ${correctInRow}`">
    <div v-for="index of [1,2,3,4,5]" :key="index" class="w-full h-2">
      <div class="h-2 rounded-full"
           :class="{
          'bg-gray-200': correctInRow < index,
          'bg-green-500': correctInRow >= index && (correctFirst === null || correctFirst),
          'bg-red-500': correctInRow >= index && correctFirst === false
        }"
      ></div>
    </div>
  </div>
</template>