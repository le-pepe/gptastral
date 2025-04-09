<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
const { locale, locales, setLocale } = useI18n()

const selected = computed({
  get: () => locale.value,
  set: (val: 'en' | 'es') => setLocale(val)
})
</script>

<template>
  <Select v-model="selected">
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="locale in locales" :key="locale.code" :value="locale.code">
        {{ locale.name }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
