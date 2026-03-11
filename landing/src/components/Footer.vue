<template>
  <footer class="">
    <div class="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
      <nav class="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6" aria-label="Footer">

        <a
            v-for="item in navigation.main"
            :data-umami-event="item.eventName"
            data-umami-event-place="footer"
            :key="item.name"
            :href="item.href"
            class="text-gray-600 hover:text-gray-900">{{
            item.name
          }}</a>
      </nav>
      <div class="mt-16 flex justify-center gap-x-10">

        <a v-for="item in navigation.social"
           :data-umami-event="item.eventName"
           data-umami-event-place="footer"
           :key="item.name" :href="item.href"
           class="text-gray-600 hover:text-gray-800">
          <span class="sr-only">{{ item.name }}</span>
          <component :is="item.icon" class="size-6" aria-hidden="true"/>
        </a>
      </div>
      <p class="mt-10 text-center text-sm/6 text-gray-600">&copy; {{ new Date().getFullYear() }} Lexidrift. All rights
        reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import {defineComponent, h} from 'vue'
import {Icon} from "@iconify/vue";


// Roadmap
// Docs
// Github
// Blog
// Log in →

const navigation = {
  main: [
    {name: 'Roadmap', href: 'https://lexidrift.canny.io', eventName: 'Canny'},
    {name: 'Docs', href: 'https://docs.lexidrift.com', eventName: 'Docs'},
    {name: 'Github', href: 'https://github.com/gustawdaniel/lexidrift-docs', eventName: 'SM:Github'},
    {name: 'Blog', href: 'https://gustawdaniel.com', eventName: 'Blog'},
    {name: 'Partners', href: '/partners', eventName: 'Partners'},
    {name: 'Legal & Policies', href: '/legal', eventName: 'Legal'},
  ],
  social: [
    {
      name: 'Instagram',
      eventName: 'SM:Instagram',
      href: 'https://www.instagram.com/gustaw.daniel/',
      icon: defineComponent({
        render: () => h(Icon, {icon: 'simple-icons:instagram', width: '24', height: '24'})
      }),
    },
    {
      name: 'X',
      eventName: 'SM:X',
      href: 'https://x.com/_GustawDaniel',
      icon: defineComponent({
        render: () => h(Icon, {icon: 'simple-icons:x', width: '24', height: '24'})
      }),
    },
    {
      name: 'GitHub',
      eventName: 'SM:GitHub',
      href: 'https://github.com/gustawdaniel/lexidrift-docs',
      icon: defineComponent({
        render: () => h(Icon, {icon: 'simple-icons:github', width: '24', height: '24'})
      }),
    },
    {
      name: 'YouTube',
      eventName: 'SM:YouTube',
      href: 'https://www.youtube.com/@gustawdaniel',
      icon: defineComponent({
        render: () => h(Icon, {icon: 'simple-icons:youtube', width: '24', height: '24'})
      }),
    },
    {
      name: 'Twitch',
      eventName: 'SM:Twitch',
      href: 'https://www.twitch.tv/gustawdaniel',
      icon: defineComponent({
        render: () => h(Icon, {icon: 'simple-icons:twitch', width: '24', height: '24'}),
      }),
    },
  ],
}
</script>