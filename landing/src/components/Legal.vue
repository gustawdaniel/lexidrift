<template>
  <div class="bg-white px-6 py-32 lg:px-8">
    <div class="mx-auto max-w-3xl text-base/7 text-gray-700">
      <p class="text-base/7 font-semibold text-indigo-600">Legal and Policies</p>
      <h1 class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Privacy Policy</h1>
      <p class="mt-6">We collecting some your data:</p>
      <div class="mt-10 max-w-2xl">
        <ul role="list" class="mt-8 max-w-xl space-y-8 text-gray-600">
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 size-5 flex-none text-indigo-600" aria-hidden="true"/>
            <span><strong class="font-semibold text-gray-900">Email</strong> requred to authorize in app and be identified as user.</span>
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 size-5 flex-none text-indigo-600" aria-hidden="true"/>
            <span><strong class="font-semibold text-gray-900">Name, Surname, Profile</strong> optionally for communication with you and nice UI.</span>
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 size-5 flex-none text-indigo-600" aria-hidden="true"/>
            <span><strong class="font-semibold text-gray-900">Language prefereces.</strong> required to learn you language.</span>
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 size-5 flex-none text-indigo-600" aria-hidden="true"/>
            <span><strong class="font-semibold text-gray-900">Usage metrics / answers.</strong> to build statiscics that support your motivation.</span>
          </li>
        </ul>

        <p class="mt-6">You can request to stop process your data sending email on address <span
            class="font-bold">{{ email }}</span>.</p>

        <p class="mt-8">Your data are store in database located in Frankfurt (Europe).</p>

      </div>

      <h1 class="mt-16 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
        Payments processing
      </h1>

      <div class="mt-10 max-w-2xl">
        <p class="mt-6">Payment invoices are issued by company:
          <span class="font-bold">Individual Entrepreneur DANIEL KAMIL GUSTAW</span>
          registered at <span class="font-bold">23/03/2022</span> in <span class="font-bold">Georgia</span> under
          address
          <span class="font-bold">Tbilisi, 0179, Vake district, Zakaria Paliashvili street, N 41, entrance 1, basement floor</span>
          with
          tax identification number <span class="font-bold">305517072</span>.
        </p>
        <p class="mt-6">We guarantee full (100%) return if you are not satisfied with the product or service in 30 days
          from payment.</p>
        <p class="mt-6">To get return please contact on email address <span class="font-bold">{{ email }}</span>.</p>
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