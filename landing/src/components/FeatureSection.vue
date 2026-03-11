<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Key Features</h2>
        <p class="mt-6 text-lg/8 text-gray-600">Unlock a smarter way to learn languages - without disrupting your daily routine. Our app combines AI-powered scheduling, multisensory learning, and passive recall techniques to help you retain words effortlessly.</p>
      </div>
      <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          <div v-for="feature in features" :key="feature.name" class="flex flex-col">
            <dt class="text-base/7 font-semibold text-gray-900">
              <div class="mb-6 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                <component :is="feature.icon" class="size-6 text-white" aria-hidden="true" />
              </div>
              {{ feature.name }}
            </dt>
            <dd class="mt-1 flex flex-auto flex-col text-base/7 text-gray-600">
              <p class="flex-auto">{{ feature.description }}</p>
              <p class="mt-6">
                <a :href="feature.href"
                   data-umami-event="Docs"
                   data-umami-event-place="features"
                   :data-umami-event-name="feature.name"
                   class="text-sm/6 font-semibold text-indigo-600">Learn more <span aria-hidden="true">→</span></a>
              </p>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup>
import { InboxIcon, TrashIcon, UsersIcon } from '@heroicons/vue/24/outline'
// import {CloudArrowUpIcon, LockClosedIcon, ServerIcon} from "@heroicons/vue/20/solid/index.js";

// {
//   name: 'Better algorithm than Anki.',
//       description:
//   'We using Free Spaced Repetition Scheduler algorithm that beats anki in predicting recallability of word.',
//       icon: CloudArrowUpIcon,
// },
// {
//   name: 'Self hosted, open source.',
//       description: 'If there is a feature you always looking for, we can add it together.',
//     icon: LockClosedIcon,
// },
// {
//   name: 'Audio with words to memorize.',
//       description: 'You do not have to look at screen to learn. Instead use audio with your most important words during shopping or training.',
//     icon: ServerIcon,
// },

import {Icon} from "@iconify/vue";
import {defineComponent, h} from "vue";


const features = [
  {
    name: 'AI-Generated Word Lists',
    description: 'Learn the most useful words in multiple languages (PL, ES, EN, DE, RU).',
    href: 'https://docs.lexidrift.com/user-guide/words.html',
    icon: defineComponent({
      render: () => h(Icon, {icon: 'material-symbols:translate', width: '24', height: '24'})
    }),
  },
  {
    name: 'Example Sentences & Images',
    description: 'Reinforce learning with visual and contextual memory aids.',
    href: 'https://docs.lexidrift.com/user-guide/words.html',
    icon: defineComponent({
      render: () => h(Icon, {icon: 'simple-icons:unsplash', width: '24', height: '24'})
    }),
  },
  {
    name: 'Audio Pronunciations',
    description: 'Listen to words and sentences to improve pronunciation.',
    href: 'https://docs.lexidrift.com/user-guide/media.html',
    icon: defineComponent({
      render: () => h(Icon, {icon: 'material-symbols:volume-up-rounded', width: '24', height: '24'})
    }),
  },
  {
    name: 'Smart Repetition Algorithm',
    description: 'Uses FSRS to optimize review timing.',
    href: 'https://docs.lexidrift.com/user-guide/repetition.html',
    icon: defineComponent({
      render: () => h(Icon, {icon: 'tabler:timeline-event', width: '24', height: '24'})
    }),
  },
  {
    name: 'Custom Playlists for Passive Learning',
    description: 'Generate MP3/MP4 files of difficult words to listen to while working out, commuting, or relaxing.',
    href: 'https://docs.lexidrift.com/user-guide/media.html',
    icon: defineComponent({
      render: () => h(Icon, {icon: 'tabler:playlist', width: '24', height: '24'})
    }),
  },
]
</script>
