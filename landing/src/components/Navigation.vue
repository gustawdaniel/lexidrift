<template>
  <div class="bg-white">
    <header class="absolute inset-x-0 top-0 z-50">
      <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div class="flex lg:flex-1">
          <a :href="logoRedirectionUrl"
             :data-umami-event="logoRedirectionUrl.startsWith('https') ? 'App' : 'Logo'"
             data-umami-event-place="navigation/desktop/logo"
             class="-m-1.5 p-1.5">
            <span class="sr-only">Lexi Drift</span>
            <img class="h-8 w-auto" src="/logo.jpg" alt="" />
          </a>
        </div>
        <div class="flex lg:hidden">
          <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
            <span class="sr-only">Open main menu</span>
            <Bars3Icon class="size-6" aria-hidden="true" />
          </button>
        </div>
        <div class="hidden lg:flex lg:gap-x-12">
          <a v-for="item in navigation" :key="item.name" :href="item.href"
             :data-umami-event="item.eventName"
             data-umami-event-place="navigation/desktop"
             class="text-sm/6 font-semibold text-gray-900">{{ item.name }}</a>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end">
          <a :href="logoRedirectionUrl"
             :data-umami-event="logoRedirectionUrl.startsWith('https') ? 'App' : 'Logo'"
             data-umami-event-place="navigation/desktop/logo"
             class="text-sm/6 font-semibold text-gray-900">Log in <span aria-hidden="true">&rarr;</span></a>
        </div>
      </nav>
      <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
        <div class="fixed inset-0 z-50" />
        <DialogPanel class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div class="flex items-center justify-between">
            <a href="https://app.lexidrift.com"
               data-umami-event="Logo"
               data-umami-event-place="navigation/mobile"
               class="-m-1.5 p-1.5">
              <span class="sr-only">Lexi Drift</span>
              <img class="h-8 w-auto" src="/logo.jpg" alt="" />
            </a>
            <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
              <span class="sr-only">Close menu</span>
              <XMarkIcon class="size-6" aria-hidden="true" />
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10">
              <div class="space-y-2 py-6">
                <a v-for="item in navigation" :key="item.name" :href="item.href"
                   :data-umami-event="item.eventName"
                   data-umami-event-place="navigation/mobile"
                   class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">{{ item.name }}</a>
              </div>
              <div class="py-6">
                <a href="https://app.lexidrift.com/"
                   data-umami-event="App"
                   data-umami-event-place="navigation/mobile"
                   class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Log in</a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'

const logoRedirectionUrl = ref('https://app.lexidrift.com');

onMounted(() => {
  if(location.pathname !== '/') {
    logoRedirectionUrl.value = '/'
  }
})

const navigation = [
  { name: 'Roadmap', href: 'https://lexidrift.canny.io', eventName: 'Canny' },
  { name: 'Docs', href: 'https://docs.lexidrift.com', eventName: 'Docs' },
  { name: 'Github', href: 'https://github.com/gustawdaniel/lexidrift-docs', eventName: 'SM:Github' },
  { name: 'Blog', href: 'https://gustawdaniel.com', eventName: 'Blog' },
]

const mobileMenuOpen = ref(false)
</script>