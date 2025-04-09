// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    modules: [
      '@nuxt/icon',
      'shadcn-nuxt',
      '@nuxtjs/color-mode',
      '@clerk/nuxt',
      '@nuxtjs/i18n'
    ],
    css: ['~/assets/css/tailwind.css'],
    vite: {
        plugins: [
            tailwindcss()
        ]
    },
    colorMode: {
        classSuffix: ''
    },
    icon: {
        mode: 'svg',
    },
    runtimeConfig: {
        deepseekApiKey: '',
        openaiApiKey: ''
    },
    clerk: {
        skipServerMiddleware: true,
    },
    i18n: {
        strategy: 'no_prefix',
        defaultLocale: 'en',
        locales: [
            {
                code: 'en',
                name: 'English',
                file: 'en.json',
            },
            {
                code: 'es',
                name: 'Español',
                file: 'es.json',
            },
        ],
    }
})
