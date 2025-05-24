<script setup lang="ts">

const {t} = useI18n()

useHead({
  title: t('meta.title'),
  meta: [
    {name: 'description', content: t('meta.description')},
    {name: 'keywords', content: t('meta.keywords')},
  ],
  link: [
    {rel: 'icon', href: '/logo.svg'}
  ]
})

</script>

<template>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
</template>
