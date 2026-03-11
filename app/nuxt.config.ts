import z from "zod";

const configSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  VITE_API_URL: z.string(),
});

const env = configSchema.parse(process.env)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt"
  ],

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },

  runtimeConfig: {
    public: {
      googleClientId: env.GOOGLE_CLIENT_ID,
    }
  },

  piniaPluginPersistedstate: {
    storage: "cookies",
    cookieOptions: {
      sameSite: "lax",
    },
    debug: true,
  },

  app: {
    head: {
      meta: [{
        name: "google-signin-client_id",
        content: env.GOOGLE_CLIENT_ID
      }],
      script: [
        {
          src: "https://cloud.umami.is/script.js",
          defer: true,
          "data-website-id": "53ff3896-9435-43dc-a567-1de575f68c49",
        },
      ],
    }
  },

  devServer: {
    port: 7000
  },
})