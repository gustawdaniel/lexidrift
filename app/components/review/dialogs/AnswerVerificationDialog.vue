<script setup lang="ts">
import {DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog'

interface AnswerCorrectness {
  success: boolean,
  correctness: {
    correct: boolean,
    feedback: string
  }
}

defineProps<{ answerCorrectness: AnswerCorrectness }>()
</script>

<template>
  <!--  <Dialog :open="isOpen" @update:open="(v) => (isOpen = v)">-->
  <DialogContent>
    <DialogHeader>
      <DialogTitle
          :class="{'text-green-700': answerCorrectness.correctness.correct, 'text-red-700': !answerCorrectness.correctness.correct}"
      >{{ answerCorrectness.correctness.correct ? 'My answer is correct!' : 'My answer is incorrect!' }}
      </DialogTitle>
    </DialogHeader>
    <p

    >{{ answerCorrectness.correctness.feedback }}</p>

    <p class="text-gray-700" v-if="answerCorrectness.correctness.correct">
      Your translation will be added to the dictionary. Thank you! Your answer was marked as correct.
    </p>
  </DialogContent>
  <!--  </Dialog>-->
</template>
