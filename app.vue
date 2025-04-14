<script setup lang="ts">

const {t} = useI18n()

useHead({
  title: t('meta.title'),
  meta: [
    {name: 'description', content: t('meta.description')},
    {name: 'keywords', content: t('meta.keywords')},
  ],
})

</script>

<template>
  <NuxtLoadingIndicator/>
  <NuxtPage/>
</template>
