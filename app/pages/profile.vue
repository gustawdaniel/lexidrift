<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useUserStore } from "~/store/user";
import { useSettingsStore } from "~/store/settings";
import { availableLanguagesMap, type Language } from "~/types/authTypes";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useToast } from "~/components/ui/toast/use-toast";
import { Switch } from "~/components/ui/switch";

const userStore = useUserStore();
const settingsStore = useSettingsStore();

const language = ref<Language>(userStore.user?.language || "en");
const defaultLanguageToLearn = ref<Language>(userStore.user?.defaultLanguageToLearn || "es");

const user = computed(() => userStore.user);
const { toast } = useToast();

watch(language, async (next, prev) => {
  await userStore.updateUser({
    language: next
  })

  toast({
    title: "Changes saved",
    description: `Native Language changed from ${availableLanguagesMap[prev]} to ${availableLanguagesMap[next]}`,
    variant: "default",
  });
});

watch(defaultLanguageToLearn, async (next, prev) => {
  await userStore.updateUser({
    defaultLanguageToLearn: next
  })

  toast({
    title: "Changes saved",
    description: `Learned Language changed from ${availableLanguagesMap[prev]} to ${availableLanguagesMap[next]}`,
    variant: "default",
  });
});

import type { LayoutProps } from "~/types/layout";

definePageMeta({
  layout: "default",
  layoutProps: {
    title: "Profile",
    description: "Your profile details and preferences",
  } satisfies LayoutProps,
});
</script>

<template>
  <div v-if="user" class="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
    <!-- Profile Header -->
    <div class="flex items-center gap-4">
      <Avatar class="w-16 h-16">
        <AvatarImage :src="user.avatar" alt="@shadcn" />
        <AvatarFallback>{{ user.fullName.split(" ").map(s => s[0]).join("") }}</AvatarFallback>
      </Avatar>
      <div>
        <h2 class="text-xl font-semibold text-gray-900">{{ user.fullName }}</h2>
        <p class="text-gray-500 text-sm">{{ user.email }}</p>
      </div>
    </div>

    <!-- User Info -->
    <div class="mt-6">
      <h3 class="text-lg font-medium text-gray-800">Profile Details</h3>
      <div class="mt-2 space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Joined:</span>
          <span class="font-medium">{{ new Date(user.createdAt).toISOString().slice(0, 10) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Role:</span>
          <span class="font-medium capitalize">{{ user.roles.join(", ") || "User" }}</span>
        </div>
      </div>
    </div>

    <!-- Language Preferences -->
    <div class="mt-6">
      <h3 class="text-lg font-medium text-gray-800">Preferences</h3>
      <div class="mt-3 space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Native Lang:</span>
          <select v-model="language" class="border border-gray-300 rounded px-3 py-1 focus:ring focus:ring-blue-300">
            <option v-for="[code, name] of Object.entries(availableLanguagesMap)" :key="code" :value="code">{{ name }}</option>
          </select>
        </div>

        <div class="flex justify-between items-center">
          <span class="text-gray-600">Learned Lang:</span>
          <select v-model="defaultLanguageToLearn" class="border border-gray-300 rounded px-3 py-1 focus:ring focus:ring-blue-300">
            <option v-for="[code, name] of Object.entries(availableLanguagesMap)" :key="code" :value="code">{{ name }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Reading Settings -->
    <div class="mt-6">
      <h3 class="text-lg font-medium text-gray-800">Reading Settings</h3>
      <div class="mt-3 space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Read Words:</span>
          <Switch v-model="settingsStore.readWords" />
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Read Correct Sentences:</span>
          <Switch v-model="settingsStore.readCorrectSentence" />
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Read Incorrect Sentences:</span>
          <Switch v-model="settingsStore.readIncorrectSentence" />
        </div>

      </div>
    </div>
  </div>
</template>
