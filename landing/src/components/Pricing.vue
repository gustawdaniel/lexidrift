<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-4xl text-center">
        <h2 class="text-base/7 font-semibold text-indigo-600">Pricing</h2>
        <p class="mt-2 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">Overpriced? No problem!</p>
      </div>
      <p class="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-600 sm:text-xl/8">You can get it for free with your teeth, but for a few cents, at least you can learn something.</p>
      <div class="mt-16 flex justify-center">
        <fieldset aria-label="Payment frequency">
          <RadioGroup v-model="frequency" class="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs/5 font-semibold ring-1 ring-gray-200 ring-inset">
            <RadioGroupOption
                as="template" v-for="option in frequencies" :key="option.value" :value="option" v-slot="{ checked }">
              <div :class="[checked ? 'bg-indigo-600 text-white' : 'text-gray-500', 'cursor-pointer rounded-full px-2.5 py-1']">{{ option.label }}</div>
            </RadioGroupOption>
          </RadioGroup>
        </fieldset>
      </div>
      <div class="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div v-for="tier in tiers" :key="tier.id" :class="[tier.mostPopular ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-200', 'rounded-3xl p-8 xl:p-10']">
          <div class="flex items-center justify-between gap-x-4">
            <h3 :id="tier.id" :class="[tier.mostPopular ? 'text-indigo-600' : 'text-gray-900', 'text-lg/8 font-semibold']">{{ tier.name }}</h3>
            <p v-if="tier.mostPopular" class="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs/5 font-semibold text-indigo-600">Most popular</p>
          </div>
          <p class="mt-4 text-sm/6 text-gray-600">{{ tier.description }}</p>
          <p class="mt-6 flex items-baseline gap-x-1">
            <span class="text-4xl font-semibold tracking-tight text-gray-900">{{ tier.price[frequency.value] }}</span>
            <span class="text-sm/6 font-semibold text-gray-600">{{ frequency.priceSuffix }}</span>
          </p>
          <a :href="addPricingPlainToUrl(tier.href, frequency.value)"
             data-umami-event="Payment Button"
             :data-umami-event-plan="tier.id"
             :data-umami-event-period="frequency.value"
             :aria-describedby="tier.id" :class="[tier.mostPopular ? 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-500' : 'text-indigo-600 ring-1 ring-indigo-200 ring-inset hover:ring-indigo-300', 'mt-6 block rounded-md px-3 py-2 text-center text-sm/6 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600']">Buy plan</a>
          <ul role="list" class="mt-8 space-y-3 text-sm/6 text-gray-600 xl:mt-10">
            <li v-for="feature in tier.features" :key="feature" class="flex gap-x-3">
              <CheckIcon class="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
              {{ feature }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/20/solid'

const frequencies = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'lifetime', label: 'Lifetime', priceSuffix: '/life' },
]
const tiers = [
  {
    name: 'Student',
    id: 'tier-free',
    href: 'https://app.lexidrift.com',
    price: { monthly: '$0', lifetime: '$0' },
    description: 'Adaptive learning with shared AI-generated materials.',
    features: [
      'Repetitions adjusted to your knowledge',
      'Words with definitions, sentences, images',
      'Personalised audio/video with your words',
    ],
    mostPopular: false,
  },
  {
    name: 'Pioneer',
    id: 'tier-pioneer',
    href: '/confirm-payment?plan=pioneer',
    price: { monthly: '$50', lifetime: '$500' },
    description: 'Your private customised sentences / images / definitions.',
    features: [
      'Your topics of sentences',
      'Your customized definitions',
      'Your style of images',
      'Realtime support from project founder',
      'Priority voting for new features',
    ],
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '/confirm-payment?plan=enterprise',
    price: { monthly: '$1000', lifetime: '$10000' },
    description: 'Customised integrations and subaccounts for your students.',
    features: [
      'Monitor progress of your students',
      'Custom integrations with your systems',
      'Both On-premises and Cloud',
      'Weekly meetings to monitor satisfaction and discuss improvements',
    ],
    mostPopular: false,
  },
]

const frequency = ref(frequencies[0]);

function addPricingPlainToUrl(url, frequency) {
  if(url.startsWith('https://')) {
    return url;
  }

  return url + '&period=' + frequency;
}
</script>