<script setup lang="ts">
import { ref, onMounted } from "vue";
import {type KnowledgeListItem, useKnowledgeStore} from "~/store/knowledge";
import { useUserStore } from "~/store/user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'; // Assuming you're using Shadcn's dropdown components
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const knowledgeStore = useKnowledgeStore();
const userStore = useUserStore();

const selectedRows = ref<Set<string>>(new Set()); // For multi-selection
const filters = ref({
  difficulty: { min: 0, max: 10 },
  stability: { min: 0, max: 10 },
  knowledge: { min: 0, max: 1 },
  search: '',
});

onMounted(async () => {
  if (!userStore.user) {
    throw new Error("No user");
  }

  await knowledgeStore.getKnowledgeList(userStore.user.defaultLanguageToLearn, {
    limit: 1000,
    offset: 0,
    withDefinition: true,
  });
});

// Format date for readability
function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString();
}

// Calculate time left until next review
function timeUntil(isoString: string) {
  if (!isoString) return "";
  const now = new Date();
  const target = new Date(isoString);
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return "Now";

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return days > 0 ? `${days}d ${remainingHours}h` : `${remainingHours}h`;
}

// Filters
function applyFilters(item: KnowledgeListItem) {
  const { difficulty, stability, knowledge, search } = filters.value;

  // Ensure fsrs is available
  const passesDifficulty = item.fsrs && (item.fsrs.difficulty >= difficulty.min && item.fsrs.difficulty <= difficulty.max);
  const passesStability = item.fsrs && (item.fsrs.stability >= stability.min && item.fsrs.stability <= stability.max);
  const passesKnowledge = item.knowledge && (item.knowledge >= knowledge.min && item.knowledge <= knowledge.max);
  const passesSearch = item.definition && item.definition.word.toLowerCase().includes(search.toLowerCase());

  return passesDifficulty && passesStability && passesKnowledge && passesSearch;
}
// Sorting
const sortColumn = ref<'rank'>("rank");
const sortDirection = ref<'asc' | 'desc'>("asc");

function sortData(a: KnowledgeListItem, b: KnowledgeListItem) {
  const isAsc = sortDirection.value === "asc";
  const comparison = (a[sortColumn.value] > b[sortColumn.value] ? 1 : -1);
  return isAsc ? comparison : -comparison;
}

// Group action - Request video/audio for selected words
function requestMediaForSelected() {
  const selectedItems = Array.from(selectedRows.value).map(id => knowledgeStore.knowledgeList.find(item => item.id === id));
  console.log('Requesting media for: ', selectedItems);
  // Implement API call for video/audio request here
}

import { Icon } from "@iconify/vue";

import type { LayoutProps } from '~/types/layout';
import DataTable from "~/components/knowledge/DataTable.vue";

definePageMeta({
  layout: 'default',
  layoutProps: {
    title: 'Knowledge',
    description: 'Browse and manage your knowledge of words',
  } satisfies LayoutProps
});


import {columns} from '~/components/knowledge/columns';

</script>

<template>
  <div class="overflow-x-auto" v-if="userStore.user">

    <DataTable :columns="columns({
      learningLanguage: userStore.user.defaultLanguageToLearn,
      nativeLanguage: userStore.user.language,
    })" :data="knowledgeStore.knowledgeList.filter(knowledge => knowledge.definitionId)"/>

  </div>
</template>
