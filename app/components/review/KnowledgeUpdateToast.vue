<script setup lang="ts">
import { computed } from "vue";

// Props: Previous & current values
const props = defineProps<{
  correctness: number;
  prevStability?: number;
  stability: number;
  prevDifficulty?: number;
  difficulty: number;
  nextReview: string;
}>();

// Function to determine text color and change indicator
const getColor = (prev: number | undefined, current: number) => {
  if (prev === undefined) return "text-gray-400"; // First time learning
  return current > prev ? "text-green-400" : current < prev ? "text-red-400" : "text-gray-700";
};

const getChange = (prev: number | undefined, current: number) => {
  if (prev === undefined) return ""; // No previous value
  const diff = current - prev;
  return diff === 0 ? "(↔)" : diff > 0 ? `(+${diff.toFixed(1)})` : `(${diff.toFixed(1)})`;
};
</script>

<template>
  <div class="bg-white p-5 rounded-2xl shadow-xl max-w-md mx-auto border border-gray-200">
    <h3 class="text-xl font-bold text-center mb-4 text-violet-700">📚 Knowledge Update</h3>

    <div class="space-y-4">
      <!-- Correctness as progress bar -->
      <div>
        <span class="text-gray-700">Correctness</span>
        <div class="w-full bg-gray-300 rounded-full h-3 mt-1">
          <div
              class="h-3 bg-violet-500 rounded-full transition-all"
              :style="{ width: `${100 * correctness}%` }"
          ></div>
        </div>
      </div>

      <!-- Stability -->
      <div class="flex justify-between items-center">
        <span class="text-gray-700">Stability</span>
        <span :class="getColor(prevStability, stability)">
          <template v-if="prevStability !== undefined">
            {{ (prevStability).toFixed(2) }} →
          </template>
          <strong>{{ (stability).toFixed(2) }}</strong>
          <span class="text-sm ml-1">{{ getChange(prevStability, stability) }}</span>
        </span>
      </div>

      <!-- Difficulty -->
      <div class="flex justify-between items-center">
        <span class="text-gray-700">Difficulty</span>
        <span :class="getColor(prevDifficulty, difficulty)">
          <template v-if="prevDifficulty !== undefined">
            {{ (prevDifficulty).toFixed(2) }} →
          </template>
          <strong>{{ (difficulty).toFixed(2) }}</strong>
          <span class="text-sm ml-1">{{ getChange(prevDifficulty, difficulty) }}</span>
        </span>
      </div>

      <!-- Next Review Time -->
      <div class="flex justify-between items-center">
        <span class="text-gray-700">Next Review</span>
        <span class="text-indigo-500 font-semibold">
          <strong>{{ nextReview }}</strong>
        </span>
      </div>
    </div>
  </div>
</template>
