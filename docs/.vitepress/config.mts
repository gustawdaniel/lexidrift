import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Lexi Drift Docs",
  description: "Effortless Language Learning",
  themeConfig: {
    search: {
      provider: 'local'
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'User Guide', link: '/user-guide' },
      { text: 'Hacker Docs', link: '/hacker-docs' },
      { text: 'Landing', link: 'https://lexidrift.com'  },
      { text: 'App', link: 'https://app.lexidrift.com'  }
    ],

    sidebar: [
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Markdown Examples', link: '/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/api-examples' }
      //   ]
      // },
      {
        items: [
          { text: 'User Guide', link: '/user-guide/'},
          { text: 'Words Definitions', link: '/user-guide/words' },
          { text: 'Repetition Algorithm', link: '/user-guide/repetition' },
          { text: 'Media Generation', link: '/user-guide/media' },
          { text: 'Features / Bugs', link: '/user-guide/features' },
          { text: 'FAQ', link: '/user-guide/faq' },
          { text: 'Authorization', link: '/user-guide/authorization' },
        ]
      },
      {
        items: [
          {text: 'Hacker Docs', link: '/hacker-docs/'},
          { text: 'Architecture', link: '/hacker-docs/architecture' },
          { text: 'Data Model', link: '/hacker-docs/data-model' },
          { text: 'Processes', link: '/hacker-docs/processes' },
          { text: 'Views', link: '/hacker-docs/views' },
          { text: 'Self Hosting', link: '/hacker-docs/self-hosting' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gustawdaniel/lexidrift-docs' },
      { icon: 'twitch', link: 'https://www.twitch.tv/gustawdaniel' },
      { icon: 'youtube', link: 'https://www.youtube.com/@gustawdaniel' },
      { icon: 'x', link: 'https://x.com/_GustawDaniel' },
      { icon: 'instagram', link: 'https://www.instagram.com/gustaw.daniel/' },
    ]
  }
})
