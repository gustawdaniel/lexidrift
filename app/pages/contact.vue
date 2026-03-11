<script setup lang="ts">
import type { LayoutProps } from '~/types/layout';

definePageMeta({
  layout: 'default',
  layoutProps: {
    title: 'Contact',
    description: 'Contact me on Discord, Twitch, Email or give feedback on Canny',
  } satisfies LayoutProps
});
</script>

<template>
  <div class="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-4">📬 Contact Me</h2>

    <div class="space-y-4">
      <!-- Discord -->
      <a href="https://discord.com/channels/711848867636969543/1349401991671189636"
         target="_blank"
         class="flex items-center p-3 rounded-xl bg-blue-100 hover:bg-blue-200 transition">
        <span class="text-2xl">💬</span>
        <span class="ml-3 font-medium text-gray-700">Join me on <span class="text-blue-600 font-bold">Discord</span></span>
      </a>

      <!-- Twitch -->
      <a href="https://dashboard.twitch.tv/u/gustawdaniel/"
         target="_blank"
         class="flex items-center p-3 rounded-xl bg-purple-100 hover:bg-purple-200 transition">
        <span class="text-2xl">🎮</span>
        <span class="ml-3 font-medium text-gray-700">Watch on <span class="text-purple-600 font-bold">Twitch</span></span>
      </a>

      <!-- Email -->
      <a href="mailto:gustaw.daniel@gmail.com"
         class="flex items-center p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
        <span class="text-2xl">📧</span>
        <span class="ml-3 font-medium text-gray-700">Email: <span class="text-gray-800 font-bold">gustaw.daniel@gmail.com</span></span>
      </a>

      <!-- Canny Feedback -->
      <a href="http://lexidrift.canny.io/"
         target="_blank"
         class="flex items-center p-3 rounded-xl bg-green-100 hover:bg-green-200 transition">
        <span class="text-2xl">💡</span>
        <span class="ml-3 font-medium text-gray-700">Give Feedback on <span class="text-green-600 font-bold">Canny</span></span>
      </a>
    </div>
  </div>
</template>

<style scoped>

</style>