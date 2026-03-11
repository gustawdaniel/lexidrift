<template>
  <div class="bg-white">
    <div class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
      <div class="mx-auto max-w-4xl">
        <h2 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Frequently asked questions</h2>
        <dl class="mt-16 divide-y divide-gray-900/10">
          <Disclosure as="div" v-for="faq in faqs" :key="faq.question" class="py-6 first:pt-0 last:pb-0" v-slot="{ open }">
            <dt>
              <DisclosureButton class="flex w-full items-start justify-between text-left text-gray-900">
                <span class="text-base/7 font-semibold">{{ faq.question }}</span>
                <span class="ml-6 flex h-7 items-center">
                  <PlusSmallIcon v-if="!open" class="size-6" aria-hidden="true" />
                  <MinusSmallIcon v-else class="size-6" aria-hidden="true" />
                </span>
              </DisclosureButton>
            </dt>
            <DisclosurePanel as="dd" class="mt-2 pr-12">
              <p class="text-base/7 text-gray-600">{{ faq.answer }}</p>
            </DisclosurePanel>
          </Disclosure>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/vue/24/outline'

const faqs = [
  {
    question: "How does FSRS improve learning?",
    answer:
        "Free Spaced Repetition Scheduler (FSRS) algorithm ensures optimal word retention by predicting the best time for reviews. It uses a combination of machine learning and human expertise to create a personalized schedule for each user.",
  },
  {
    question: "Can I use this app offline?",
    answer: "No. You need to be connected to the internet. There are no plans to make it offline mode in foreseeable future.",
  },
  {
    question: "What languages are supported?",
    answer: "Currently, we support English, Spanish, German, Russian, Polish.",
  },
  {
    question: "To which levels can I learn?",
    answer: "Currently we support beginner level, where only vocabulary in important and we relay on translations during knowledge testing.",
  }
  // More questions...
]
</script>