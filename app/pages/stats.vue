<script setup lang="ts">
import { onMounted } from "vue";
import { useUserStore } from "~/store/user";
import {type Session, useSessionStore} from "~/store/session";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {useMeasurementStore} from "~/store/measurement";

dayjs.extend(duration);

const sessions = ref<Session[]>([]);
const sessionStore = useSessionStore();
const userStore = useUserStore();
const loading = ref<boolean>(false);

onMounted(async () => {
  if (!userStore.user) {
    throw new Error("No user");
  }

  loading.value = true;
  sessions.value = await sessionStore.getSessions();

  loading.value = false;
});

// Generate an array of the last 7 days
const days = computed(() => {
  const now = dayjs();
  return Array.from({ length: 7 }, (_, i) => now.subtract(i, "day").format("YYYY-MM-DD")).reverse();
});

// Format sessions into a structure for easy rendering
const formattedSessions = computed(() => {
  return days.value.map((day) => ({
    date: day,
    sessions: sessions.value
        .filter((session) => dayjs(session.createdAt).format("YYYY-MM-DD") === day)
        .map((session) => ({
          start: dayjs(session.createdAt),
          end: session.endedAt ? dayjs(session.endedAt) : null,
        })),
  }));
});

const measurementStore = useMeasurementStore();

function doMeasurement() {
  if (!userStore.user) return;
  measurementStore.doMeasurement(userStore.user.defaultLanguageToLearn);
}

import type { LayoutProps } from '~/types/layout';

definePageMeta({
  layout: 'default',
  layoutProps: {
    title: 'Stats',
    description: 'See graphs and stats of your learning progress',
  } satisfies LayoutProps
});
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div class="p-6" v-else>
    <h2 class="text-xl font-semibold mb-4">User Sessions</h2>

    <div class="relative grid grid-cols-7 border-t border-l border-gray-300">
      <!-- Day columns -->
      <div v-for="day in formattedSessions" :key="day.date" class="border-r border-gray-300 relative">
        <!-- Date header -->
        <div class="text-center font-medium p-2 bg-gray-100">{{ day.date }}</div>

        <div class="relative h-96 border-b border-gray-300">
          <!-- Hour guide lines -->
          <div
              v-for="hour in 24"
              :key="hour"
              class="absolute w-full border-t border-gray-200 text-xs text-gray-500"
              :style="{ top: `${(hour / 24) * 100}%`, transform: 'translateY(-50%)' }"
          >
            <span v-if="day.date === days[0]" class="absolute left-0 -translate-y-1/2 bg-white px-1">
              {{ String(hour).padStart(2, '0') }}:00
            </span>
          </div>

          <!-- Sessions -->
          <div
              v-for="session in day.sessions"
              :key="session.start.toISOString()"
              class="absolute left-1/2 transform -translate-x-1/2 bg-blue-500"
              :style="{
              top: `${(session.start.hour() * 60 + session.start.minute()) / (24 * 60) * 100}%`,
              height: session.end ? `${(session.end.diff(session.start, 'minute')) / (24 * 60) * 100}%` : '0px',
              width: '90%',
              minHeight: '0px'
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>

  <button @click="doMeasurement">Measure</button>
</template>