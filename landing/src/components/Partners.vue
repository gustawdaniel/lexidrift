<template xmlns="http://www.w3.org/1999/html">
  <div class="bg-white px-6 py-32 lg:px-8">
    <div class="mx-auto max-w-3xl text-base/7 text-gray-700">
      <p class="text-base/7 font-semibold text-indigo-600">Partners & Collaboration</p>
      <h1 class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Let's learn on public</h1>
      <p class="mt-6">Use our app in social media or your events and get paid fro this.</p>
      <div class="mt-10 max-w-2xl">
        <ul role="list" class="mt-8 max-w-xl space-y-8 text-gray-600">
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 size-5 flex-none text-indigo-600" aria-hidden="true"/>
            <span><strong class="font-semibold text-gray-900">Synergy</strong> learn language, build community and get paid.</span>
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 size-5 flex-none text-indigo-600" aria-hidden="true"/>
            <span><strong class="font-semibold text-gray-900">Challenge</strong> set your goals about vocabulary to acquire publicly.</span>
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 size-5 flex-none text-indigo-600" aria-hidden="true"/>
            <span><strong class="font-semibold text-gray-900">Adventure</strong> be promoted on our social media among other creators.</span>
          </li>
        </ul>

        <p class="mt-6">When you just learning in silence or alone. You spending time improve your knowledge. <span class="font-bold">Ant it is great deal</span>.</p>

        <p class="mt-8">But showing other how you learning you can simultaneously
          <span class=" inline-block font-bold bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent transition-transform duration-300 hover:scale-102"> extend your skills </span> ,
          <span class=" inline-block font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-lg transition-transform duration-300 hover:scale-102"> build engaged audience </span> and <span class="inline-block font-bold bg-gradient-to-r from-pink-500 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-lg transition-transform duration-300 hover:scale-102"> get paid </span> .

          <span class="font-bold">It is greatest deal ever invented!!!</span></p>

      </div>

      <div class="mt-10 max-w-2xl">
        <p class="mt-6">To make this deal and make learning great again send me email: <span class="font-bold">{{ email }}</span>.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import {CheckCircleIcon, InformationCircleIcon} from '@heroicons/vue/20/solid'
import {ref, onMounted} from "vue";

const email = ref('');

onMounted(() => {
  email.value = 'gustaw.daniel@gmail.com'
})


</script>