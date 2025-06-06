<script setup lang="ts">
import {ToggleGroup, ToggleGroupItem} from "~/components/ui/toggle-group";
import {Button} from "~/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import AstralIcon from "~/components/icons/AstralIcon.vue";
import RuneIcon from "~/components/icons/RuneIcon.vue";
import TarotIcon from "~/components/icons/TarotIcon.vue";
import {Textarea} from "~/components/ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from '~/components/ui/popover'
import {cn} from "~/lib/utils";
import {Calendar as CalendarIcon} from 'lucide-vue-next'
import {DateFormatter, type DateValue, getLocalTimeZone, today,} from '@internationalized/date'
import CalendarSelector from "~/components/ui/calendar/CalendarSelector.vue";
import {Input} from "~/components/ui/input";

definePageMeta({
  layout: 'interactive'
})

const nuxtApp = useNuxtApp();
const selectedModel = ref('deepseek')

nuxtApp.hook('model:selected', (m: string) => {
  selectedModel.value = m
})

const selectedTarotSpread = ref()
const selectedRuneSpread = ref()
const astralData = ref({
  date: '',
  place: ''
})

const selectedRead = ref()
const query = ref('')

const asking = ref(false)

const df = computed(() => {
  const locale = useI18n().locale.value
  return new DateFormatter(locale, {
    dateStyle: 'long'
  })
})

const tarotSpreads = [
  "single_card",
  "past_present_future",
  "simple_cross",
  "life_purpose",
  "soul_path",
  "personal_shadow",
  "inner_mirror",
  "heros_journey"
];

const runeSpreads = [
  "single_rune",
  "three_runes",
  "simple_cross",
  "odin_runes",
  "circle_casting",
  "nine_worlds",
  "past_present_future",
  "shadow_work"
];


watch(selectedRead, () => {
  if (selectedRead.value !== 'tarot') {
    selectedTarotSpread.value = undefined
  }
  if (selectedRead.value !== 'runes') {
    //todo: reset selectedRuneSpread
    selectedRuneSpread.value = undefined
  }
  if (selectedRead.value !== 'astral') {
    astralData.value = {
      date: '',
      place: ''
    }
  }
})

const step2IsCompleted = computed(() => {
  return (selectedRead.value === 'tarot' && selectedTarotSpread.value !== undefined)
      || (selectedRead.value === 'runes' && selectedRuneSpread.value !== undefined)
      || (selectedRead.value === 'astral' && astralData.value.date && astralData.value.place !== '');
})

const date = ref<DateValue>(today(getLocalTimeZone()))

watch(date, () => {
  astralData.value.date = date.value.toString()
})

const send = async () => {
  if (!step2IsCompleted.value) return
  if (asking.value) return
  asking.value = true
  const data: any = {
    reading: selectedRead.value,
    query: query.value,
    model: selectedModel.value,
  }
  if (["tarot", "runes"].includes(selectedRead.value)) {
    data.data = selectedRead.value === "tarot" ? selectedTarotSpread.value : selectedRuneSpread.value
  } else {
    data.data = {
      birth_place: astralData.value.place,
      birth_date: astralData.value.date
    }
  }

  const res = await $fetch("/api/interactive", {
    method: 'POST',
    body: data
  })

  if (res.success) {
    await navigateTo("/interactive/" + res.data.uuid)
  }

}

</script>

<template>
  <div class="flex flex-col min-w-xl mx-auto p-8 gap-8" v-auto-animate>
    <section class="mx-auto flex flex-col gap-4 w-full">
      <h1 class="font-bold text-2xl">{{ $t("interactive.steps.1") }}</h1>
      <ToggleGroup type="single" variant="outline" v-model="selectedRead" class="bg-card w-full">
        <ToggleGroupItem value="tarot" class="size-36 aspect-square flex flex-col">
          {{ $t('interactive.options.tarot') }}
          <TarotIcon/>
        </ToggleGroupItem>
        <ToggleGroupItem value="runes" class="size-36 aspect-square flex flex-col">
          {{ $t('interactive.options.runes') }}
          <RuneIcon/>
        </ToggleGroupItem>
        <ToggleGroupItem value="astral" class="size-36 aspect-square flex flex-col">
          {{ $t('interactive.options.astral') }}
          <AstralIcon/>
        </ToggleGroupItem>
      </ToggleGroup>
    </section>

    <section v-if="selectedRead === 'tarot'" class="w-full flex flex-col gap-4">
      <h1 class="font-bold text-2xl">{{ $t('interactive.steps.2.' + selectedRead) }}</h1>
      <Select class="bg-card" v-model="selectedTarotSpread">
        <SelectTrigger class="w-full bg-card">
          <SelectValue :placeholder="$t('spreads.tarot.' + selectedTarotSpread)"/>
        </SelectTrigger>
        <SelectContent class="w-full bg-card">
          <SelectItem :value="item" :key="item" v-for="item in tarotSpreads" class="w-full">
            {{ $t('spreads.tarot.' + item) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </section>

    <section class="w-full flex flex-col gap-4" v-if="selectedRead === 'runes'">
      <h1 class="font-bold text-2xl">{{ $t('interactive.steps.2.' + selectedRead) }}</h1>
      <Select class="bg-card" v-model="selectedRuneSpread">
        <SelectTrigger class="w-full bg-card">
          <SelectValue :placeholder="$t('spreads.tarot.' + selectedRuneSpread)"/>
        </SelectTrigger>
        <SelectContent class="w-full bg-card">
          <SelectItem :value="item" :key="item" v-for="item in runeSpreads" class="w-full">
            {{ $t('spreads.runes.' + item) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </section>

    <section class="w-full flex flex-col gap-4" v-if="selectedRead === 'astral'">
      <h1 class="font-bold text-2xl">{{ $t('interactive.steps.2.' + selectedRead) }}</h1>
      <div class="flex flex-row">
        <Popover>
          <PopoverTrigger as-child>
            <Button
                variant="outline"
                :class="cn(
          'w-full justify-start text-left font-normal bg-card',
          !date && 'text-muted-foreground',
        )"
            >
              <CalendarIcon class="mr-2 h-4 w-4"/>
              {{ date ? df.format(date.toDate(getLocalTimeZone())) : $t("interactive.pickDate") }}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <CalendarSelector v-model="date"/>
          </PopoverContent>
        </Popover>
      </div>
      <Input :placeholder="$t('interactive.placeBirthPlaceholder')" v-model="astralData.place"/>
    </section>

    <section class="w-full flex flex-col gap-4" v-if="step2IsCompleted">
      <h1 class="font-bold text-2xl">{{ $t('interactive.steps.3') }}</h1>
      <Textarea :placeholder="$t('chat.textarea.placeholder')" class="bg-card" v-model="query"/>
      <Button @click="send" :disabled="asking">
        <Icon name="svg-spinners:90-ring-with-bg" v-if="asking"/>
        {{ $t(asking ? "interactive.asking" :"interactive.sendButton") }}
      </Button>
    </section>
  </div>
</template>

<style scoped>

</style>
