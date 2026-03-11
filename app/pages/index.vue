<script setup lang="ts">
import type { LayoutProps } from '~/types/layout';

definePageMeta({
  layout: 'default',
  layoutProps: {
    title: 'Discover Words',
    description: 'Find new words in the dictionary and learn their meanings',
  } satisfies LayoutProps
});


import WordsDiscovery from "~/components/discovery/WordsDiscovery.vue";
</script>

<template>
    <WordsDiscovery/>
</template>