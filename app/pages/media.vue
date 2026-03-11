<script setup lang="ts">
import { onMounted } from "vue";
import { useKnowledgeStore } from "~/store/knowledge";
import { useUserStore } from "~/store/user";
import {useVideoStore, type Video} from "~/store/video";

const knowledgeStore = useKnowledgeStore();
const userStore = useUserStore();

const videoStore = useVideoStore();

const videos = ref<Video[]>([]);

onMounted(async () => {
  if (!userStore.user) {
    throw new Error("No user");
  }

  await knowledgeStore.getKnowledgeList(userStore.user.defaultLanguageToLearn, {
    limit: 100,
    offset: 0,
    withDefinition: true,
  });

  videos.value = await videoStore.getVideos();
});

import type { LayoutProps } from '~/types/layout';

definePageMeta({
  layout: 'default',
  layoutProps: {
    title: 'Videos',
    description: 'Watch videos and memorize words that you selected in knowledge page',
  } satisfies LayoutProps
});
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
    <div v-for="video in videos" :key="video.id" class="bg-white shadow-lg rounded-lg p-4 border">
      <video :src="video.url" controls class="w-full rounded-lg"></video>
      <div class="mt-2">
        <p class="text-sm text-gray-600">{{video.words.length}} words: {{ video.words.join(", ") }}</p>
      </div>



      <a v-if="video.status === 'done'"
          :href="video.url"
          download
          class="mt-2 block text-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
      >
        Download
      </a>


      <p v-else-if="video.status === 'pending'"
         class="mt-2 block text-center bg-red-500 text-white py-2 px-4 rounded-lg opacity-70">
        Queued
      </p>

      <p v-else-if="video.status === 'processing'"
         class="mt-2 block text-center bg-yellow-500 text-white py-2 px-4 rounded-lg opacity-70">
        Processing
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>