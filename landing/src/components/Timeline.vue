<template>
  <div class="py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden
      lg:mx-0 lg:max-w-none lg:grid-cols-4">

<!--        TODO, removet this hidden block when we will add more time content here-->
        <div class="hidden lg:block"></div>

        <div v-for="item in timeline" :key="item.name">
          <time :datetime="item.dateTime" class="flex items-center text-sm/6 font-semibold text-indigo-600">
            <svg viewBox="0 0 4 4" class="mr-4 size-1 flex-none" aria-hidden="true">
              <circle cx="2" cy="2" r="2" fill="currentColor" />
            </svg>
            {{ item.date }}
            <div class="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0" aria-hidden="true" />
          </time>
          <p class="mt-6 text-lg/8 font-semibold tracking-tight text-gray-900">{{ item.name }}</p>
          <p class="mt-1 text-base/7 text-gray-600">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const timeline = [
  {
    name: 'Project Started',
    description:
        'Basic proof of concept was developed on twitch streams. We gathered first 6 users and that made 1200 words reviews.',
    date: 'Mar 2025',
    dateTime: '2025-03',
  },
  {
    name: 'Better knowledge testing',
    description:
        'We are going to build different types of tests to improve the quality of reviews and supprot higer levels of learning.',
    date: 'April 2025',
    dateTime: '2025-04',
  },
]
</script>