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
    }
})
