<script setup lang="ts">

import {toast} from "vue-sonner";
import {Button} from "~/components/ui/button";
import KnowledgeUpdateToast from "~/components/review/KnowledgeUpdateToast.vue";

const rawToastComponent = markRaw(KnowledgeUpdateToast);
</script>

<template>
  <Button
      variant="outline" @click="() => {
      toast('',{
        component: rawToastComponent,
        componentProps: {
          correctness: 0.8,
          prevStability: 2,
          stability: 3,
          prevDifficulty: 2,
          difficulty: 3,
          nextReview: '2022-12-12'
        }
      })
    }"
  >
    Add to calendar
  </Button>
</template>

<style scoped>

</style>