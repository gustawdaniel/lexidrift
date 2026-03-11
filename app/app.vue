<script setup lang="ts">
import {useSessionStore} from "~/store/session";

const sessionStore = useSessionStore();

onMounted(async () => {
  await sessionStore.startSession();
});

onUnmounted(async () => {
  await sessionStore.stopSession();
});

</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
