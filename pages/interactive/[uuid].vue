<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next';
import {Skeleton} from "~/components/ui/skeleton";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {Label} from "reka-ui";

definePageMeta({
  layout: 'interactive',
})

const { t } = useI18n()
const { params } = useRoute()
const uuid = params.uuid as string
const loading = ref(false)
const isOpen = ref(true)

const flippedItems = ref<Record<string, boolean>>({})

const flipItem = (id: string) => {
  flippedItems.value[id] = !flippedItems.value[id]
}

const data = ref({
  input: {
    reading_type: '',
    query: '',
    spread_type: ''
  },
  output: {
    reading: '',
    spread: '',
    runes: [],
    cards: [],
    result: {}
  }
})

const isTarot = computed(() => data.value.input?.reading_type === 'tarot')
const isRunes = computed(() => data.value.input?.reading_type === 'runes')
const isAstral = computed(() => data.value.input?.reading_type === 'astral')

const readingTitle = computed(() => {
  return isTarot.value ? t('interactive.readingResults.tarot') :
      isRunes.value ? t('interactive.readingResults.runes') :
          t('interactive.readingResults.astral')
})

const titleClass = computed(() => ({
  'font-tarot': isTarot.value,
  'font-runes': isRunes.value,
  'font-astral': isAstral.value
}))

// Mapeo de símbolos y nombres de runas
const runeSymbols = {
  fehu: "ᚠ",
  uruz: "ᚢ",
  thurisaz: "ᚦ",
  ansuz: "ᚨ",
  raido: "ᚱ",
  raidho: "ᚱ",
  kaunan: "ᚲ",
  kenaz: "ᚲ",
  gebo: "ᚷ",
  gebu: "ᚷ",
  wunjo: "ᚹ",
  hagalaz: "ᚺ",
  naudiz: "ᚾ",
  isa: "ᛁ",
  jera: "ᛃ",
  eihwaz: "ᛇ",
  perth: "ᛈ",
  algiz: "ᛉ",
  sowilo: "ᛋ",
  tiwaz: "ᛏ",
  berkana: "ᛒ",
  berkano: "ᛒ",
  ehwaz: "ᛖ",
  mannaz: "ᛗ",
  laguz: "ᛚ",
  ingwaz: "ᛜ",
  dagaz: "ᛞ",
  othala: "ᛟ"
}

const runeNames = Object.fromEntries(
    Object.keys(runeSymbols).map(key => [key, key.charAt(0).toUpperCase() + key.slice(1)])
)

// Tipos de tiradas
const spreadTypes = {
  tarot: {
    single_card: "Single Card",
    past_present_future: "Past, Present and Future",
    simple_cross: "Simple Cross",
    life_purpose: "Life Purpose",
    soul_path: "Soul Path",
    personal_shadow: "Personal Shadow",
    inner_mirror: "Inner Mirror",
    heros_journey: "Hero's Journey",
    undefined: "Select a spread"
  },
  runes: {
    single_rune: "Single Rune",
    three_runes: "Three Runes",
    simple_cross: "Simple Cross",
    odin_runes: "Odin's Runes",
    circle_casting: "Circle Casting",
    nine_worlds: "Nine Worlds Spread",
    past_present_future: "Past, Present and Future",
    shadow_work: "Shadow Work Spread"
  }
}

// Cargar datos desde la API
const loadData = async () => {
  loading.value = true
  try {
    const res = await $fetch(`/api/interactive/get`, {
      method: 'POST',
      body: { uuid }
    })

    if (res.success) {
      const input = JSON.parse(res.data.input)
      const output = JSON.parse(res.data.output)

      // No necesitamos reordenar el objeto result, solo asegurar la iteración en el orden correcto
      data.value = { input, output }

      // Inicializar estado de volteo basado en cards/runes
      flippedItems.value = {}
      if (output.cards) {
        output.cards.forEach(card => {
          flippedItems.value[`card-${card}`] = false
        })
      }
      if (output.runes) {
        output.runes.forEach(rune => {
          flippedItems.value[`rune-${rune}`] = false
        })
      }
    }
  } catch (error) {
    console.error('Error loading reading:', error)
  } finally {
    loading.value = false
  }
}

// Formatear tipo de tirada para mostrar
const formatSpreadType = (type) => {
  const readingType = data.value.input?.reading_type
  if (readingType && spreadTypes[readingType]) {
    return t(`spreads.${readingType}.${type}`) || type
  }
  return type
}

// Posicionar runas en círculo
const getRunePosition = (index, total) => {
  const angle = (index * (360 / total)) - 90
  const radius = 120
  return {
    left: `calc(50% + ${radius * Math.cos(angle * Math.PI / 180)}px)`,
    top: `calc(50% + ${radius * Math.sin(angle * Math.PI / 180)}px)`,
    transform: 'translate(-50%, -50%)'
  }
}

// Obtener símbolo de runa
const getRuneSymbol = (rune) => runeSymbols[rune] || rune

// Obtener nombre formateado de runa
const getRuneName = (rune) => runeNames[rune] || rune

// Capitalizar primera letra
const capitalizeFirstLetter = (str) => str?.charAt(0).toUpperCase() + str?.slice(1) || ''
const getCardImage = (cardNumber) => {
  // Asume que tus imágenes están en /public/tarot/
  // con formato como tarot-0.jpg, tarot-1.jpg, etc.
  return `https://ik.imagekit.io/kz03bh6qk/tarot/${cardNumber}.png`
}

const cardNames = {
  0: t('cards.0'),
  1: t('cards.1'),
  2: t('cards.2'),
  3: t('cards.3'),
  4: t('cards.4'),
  5: t('cards.5'),
  6: t('cards.6'),
  7: t('cards.7'),
  8: t('cards.8'),
  9: t('cards.9'),
  10: t('cards.10'),
  11: t('cards.11'),
  12: t('cards.12'),
  13: t('cards.13'),
  14: t('cards.14'),
  15: t('cards.15'),
  16: t('cards.16'),
  17: t('cards.17'),
  18: t('cards.18'),
  19: t('cards.19'),
  20: t('cards.20'),
  21: t('cards.21')
}

const getCardName = (cardNumber) => {
  return cardNames[cardNumber] || `Carta ${cardNumber}`
}

// Función para posicionar cartas en círculo (similar a runas)
const getCardPosition = (index, total) => {
  const angle = (index * (360 / total)) - 90
  const radius = total > 3 ? 140 : 100 // Ajusta radio según cantidad
  return {
    left: `calc(50% + ${radius * Math.cos(angle * Math.PI / 180)}px)`,
    top: `calc(50% + ${radius * Math.sin(angle * Math.PI / 180)}px)`,
    transform: 'translate(-50%, -50%)'
  }
}
// Cargar datos al montar el componente
onMounted(async () => {
  await loadData()
})

</script>

<template>
  <div class="py-8">
    <!-- Skeleton Loader -->
    <div v-if="loading" class="space-y-8 max-w-4xl mx-auto">
      <div class="space-y-4">
        <Skeleton class="h-8 w-1/2" />
        <Skeleton class="h-6 w-full" />
        <Skeleton class="h-6 w-3/4" />
      </div>
      <div class="grid gap-6">
        <Skeleton v-for="i in 3" :key="i" class="h-32 w-full rounded-lg" />
      </div>
    </div>

    <!-- Loaded Content -->
    <div v-else class="max-w-4xl mx-auto space-y-8">
      <!-- Input Section - Collapsible -->
      <Card>
        <Collapsible v-model:open="isOpen" class="w-full space-y-2">

        <CardHeader class="pb-0">
            <div class="flex items-center justify-between space-x-4">
              <CardTitle class="text-lg">
                {{ t('interactive.readingDetails.title') }}
              </CardTitle>
              <CollapsibleTrigger as-child>
                <Button variant="ghost" size="sm" class="w-9 p-0">
                  <ChevronDownIcon class="h-4 w-4" />
                  <span class="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
        </CardHeader>

            <CollapsibleContent class="space-y-4 pt-4">
              <CardContent class="pt-0">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label class="block mb-1">{{ t('interactive.readingDetails.readingType') }}</Label>
                    <div class="px-3 py-2 rounded-md border">
                      {{ capitalizeFirstLetter(data.input.reading_type) }}
                    </div>
                  </div>
                  <div v-if="!isAstral">
                    <Label class="block mb-1">{{ t('interactive.readingDetails.spreadType') }}</Label>
                    <div class="px-3 py-2 rounded-md border">
                      {{ formatSpreadType(data.input.spread_type) }}
                    </div>
                  </div>
                  <div class="md:col-span-2">
                    <Label class="block mb-1">{{ t('interactive.readingDetails.yourQuestion') }}</Label>
                    <div class="px-3 py-2 rounded-md border italic">
                      "{{ data.input.query }}"
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>


        </Collapsible>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-xl font-runes">
            {{ readingTitle }}
          </CardTitle>
          <CardDescription v-if="!isAstral">
            {{ formatSpreadType(data.input.spread_type) }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Para Tarot -->
          <div v-if="isTarot" class="flex flex-col items-center mb-8 gap-8">
            <!-- Cartas -->
            <div class="flex flex-wrap justify-center gap-4 w-full">
              <div v-for="card in data.output.cards" :key="card"
                   class="w-24 h-40 perspective-1000 cursor-pointer"
                   @click="flipItem(`card-${card}`)">
                <div class="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d"
                     :class="{'rotate-y-180': flippedItems[`card-${card}`]}">
                  <!-- Parte trasera -->
                  <div class="absolute w-full h-full backface-hidden bg-card rounded-lg shadow-md border-2 border-primary flex items-center justify-center">
                    <div class="text-primary text-4xl">🜁</div>
                  </div>
                  <!-- Parte frontal -->
                  <div class="absolute w-full h-full backface-hidden rotate-y-180 bg-card rounded-lg overflow-hidden">
                    <img
                        :src="getCardImage(card)"
                        :alt="`Carta ${card}`"
                        class="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Interpretaciones -->
            <div class="w-full space-y-4">
              <div v-for="card in data.output.cards" :key="`interpretation-${card}`"
                   class="transition-all duration-300 overflow-hidden"
                   :class="{
           'max-h-0 opacity-0': !flippedItems[`card-${card}`],
           'max-h-96 opacity-100 p-4 border rounded-lg': flippedItems[`card-${card}`]
         }">
                <div class="flex items-start gap-4">
                  <div class="w-16 h-24 flex-shrink-0">
                    <img
                        :src="getCardImage(card)"
                        :alt="`Carta ${card}`"
                        class="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 class="text-lg font-medium mb-2">
                      {{ getCardName(card) }}
                    </h3>
                    <div class="prose prose-invert" v-html="parseMarkdown(data.output.result[card.toString()])"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Para Runas -->
          <div v-else-if="isRunes" class="flex flex-col items-center mb-12 py-6 gap-8">
            <!-- Runas en círculo -->
            <div class="relative w-full max-w-md" :class="{ 'h-80': data.output.runes.length > 1 }">
              <div class="absolute inset-0 flex items-center justify-center" v-if="data.output.runes.length > 1">
                <div class="w-48 h-48 rounded-full border-2 border-primary/30 animate-pulse-slow"></div>
              </div>
              <div v-for="(rune, index) in data.output.runes" :key="rune"
                   class="w-16 h-16 perspective-1000 cursor-pointer"
                   :class="{'absolute': data.output.runes.length > 1, 'mx-auto': data.output.runes.length == 1}"
                   :style="data.output.runes.length == 1 ? '' : getRunePosition(index, data.output.runes.length)"
                   @click="flipItem(`rune-${rune}`)">
                <div class="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d"
                     :class="{'rotate-y-180': flippedItems[`rune-${rune}`]}">
                  <!-- Parte trasera -->
                  <div class="absolute w-full h-full backface-hidden bg-card border-2 border-primary rounded-lg flex items-center justify-center">
                    <div class="text-primary text-xl">?</div>
                  </div>
                  <!-- Parte frontal -->
                  <div class="absolute w-full h-full backface-hidden rotate-y-180 bg-card border-2 border-primary rounded-lg flex items-center justify-center text-3xl font-runes">
                    {{ getRuneSymbol(rune) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Interpretaciones -->
            <div class="w-full space-y-4">
              <div v-for="rune in data.output.runes" :key="`interpretation-${rune}`"
                   class="transition-all duration-300 overflow-hidden"
                   :class="{
           'max-h-0 opacity-0': !flippedItems[`rune-${rune}`],
           'max-h-96 opacity-100 p-4 border rounded-lg': flippedItems[`rune-${rune}`]
         }">
                <div class="flex items-start gap-4">
                  <div class="text-4xl font-runes mt-1 text-primary">
                    {{ getRuneSymbol(rune) }}
                  </div>
                  <div>
                    <h3 class="text-lg font-medium mb-2">
                      {{ getRuneName(rune) }}
                    </h3>
                    <div class="prose prose-invert" v-html="parseMarkdown(data.output.result[rune])"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resultado para carta astral -->
          <div v-if="isAstral" class="prose prose-invert max-w-none">
            <div class="p-6 rounded-lg bg-card/50 border">
              <div v-html="parseMarkdown(data.output.result)"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <footer class="py-4">
      <div class="container mx-auto text-center text-sm text-gray-500">
        {{ $t('footer.copyright') }}
      </div>
      <div class="container mx-auto text-center text-sm text-gray-500" v-if="isTarot">
        All card images made by
        <a
            href="https://www.freepik.com/author/pikisuperstar"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary hover:underline"
        >
          pikisuperstar
        </a>
        on Freepik
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Estilos para los diferentes tipos de lectura */
.font-tarot {
  font-family: 'Cinzel', serif;
}

.font-runes {
  font-family: 'Segoe UI Historic', 'Noto Sans Runic', sans-serif;
}

.font-astral {
  font-family: 'Alegreya', serif;
}

/* Animación para runas */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.animate-pulse-slow {
  animation: pulse-slow 6s ease-in-out infinite;
}

/* Estilos para el texto */
.prose-invert strong {
  color: var(--primary);
}

/* Espaciado para carta astral */
.bg-card\/50 {
  background-color: var(--card);
  opacity: 0.9;
}
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}
.transition-all {
  transition-property: all;
}
</style>
