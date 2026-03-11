<script setup lang="ts">
import type { LayoutProps } from '~/types/layout';

definePageMeta({
  layout: 'default',
  layoutProps: {
    title: 'Review',
    description: 'Check your memory and review words you have learned',
  } satisfies LayoutProps
});
</script>

<template>
  <ReviewFrame/>
</template>

<style scoped>

</style>