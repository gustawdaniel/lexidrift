<script setup lang="ts">

import {CheckCircleIcon} from "@heroicons/vue/20/solid";
</script>

<template>
  <div class="bg-white px-6 py-32 lg:px-8">
    <div class="mx-auto max-w-3xl text-base/7 text-gray-700">
      <p class="text-base/7 font-semibold text-indigo-600">Payment confirmation</p>
      <h1 class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">You are now a PRO user</h1>
      <p class="mt-6">It's unbelievable but you are the first one who clicked this button. So as reward you getting access for free.</p>
      <div class="mt-10 max-w-2xl">
        <ul role="list" class="mt-8 max-w-xl space-y-8 text-gray-600">
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 size-5 flex-none text-indigo-600" aria-hidden="true"/>
            <span><strong class="font-semibold text-gray-900">Keep it secret</strong> do not tell nobody about this promotion, it will be closed soon.</span>
          </li>
        </ul>

        <p class="mt-6">Now you can open account on free plan and <a class="text-indigo-500 hover:text-blue-700" href="https://calendly.com/gustaw-daniel">schedule a call</a> with app creator to enable <span class=" inline-block font-bold bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent transition-transform duration-300 hover:scale-102">special privileges</span>.</p>

        <p class="mt-6">
          <a href="https://calendly.com/gustaw-daniel"
             class="px-6 py-3 text-white bg-gradient-to-r from-blue-500
              to-indigo-600 rounded-md shadow-lg hover:from-blue-600
               hover:to-indigo-700 transition duration-300">
            Schedule a Call
          </a>
        </p>

        <p class="mt-8">It is amazing that you decided to support us financially on such initial phase of product development.
          <span class="font-bold">We do everything to satisfy your requirements!!!</span></p>

      </div>
    </div>
  </div>
</template>
