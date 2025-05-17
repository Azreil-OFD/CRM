import Nora from "@primeuix/themes/nora";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/ui",
    "@nuxt/content",
    "@primevue/nuxt-module",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "nuxt-directus",
  ],
  primevue: {
    options: {
      theme: {
        preset: Nora,
      },
    },
  },
  runtimeConfig: {
    public: {
      directus: {
        url: "http://192.168.1.134:8055"
      }
    }
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
});
