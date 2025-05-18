<script setup lang="ts">
import {Button} from "~/components/ui/button"
import TarotIcon from "~/components/icons/TarotIcon.vue";
import RuneIcon from "~/components/icons/RuneIcon.vue";
import AstralIcon from "~/components/icons/AstralIcon.vue";
// Assuming you might want icons for the features, add imports if you have them
// import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

const newChat = async () => {
  await navigateTo('/chat')
}

const goToInteractive = async () => {
  await navigateTo('/interactive')
}
</script>

<template>
  <div class="min-h-dvh flex flex-col justify-between bg-background text-foreground">
    <NavBar/>

    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
      <section class="text-center py-16 md:py-24">
        <h1 class="text-5xl md:text-6xl font-extrabold mb-6 text-primary tracking-tight">{{ $t('hero.title') }}</h1>
        <p class="mb-10 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
          {{ $t('hero.description') }}
        </p>
      </section>

      <section class="py-16 md:py-24 bg-card text-card-foreground rounded-xl shadow-lg">
        <div class="max-w-5xl mx-auto text-center px-4">
          <h2 class="text-3xl md:text-4xl font-bold mb-4 text-primary">
            {{ $t('interactive.options.title') || 'Explore Our Readings' }}</h2>
          <p class="mb-12 text-lg text-muted-foreground max-w-2xl mx-auto">{{
              $t('interactive.options.description') || 'Delve into ancient wisdom and cosmic insights with our specialized readings.'
            }}</p>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="p-6 bg-background rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div class="text-5xl mb-4">
                <TarotIcon class="mx-auto"/>
              </div>
              <h3 class="text-2xl font-semibold mb-2 text-primary">{{ $t('interactive.options.tarot') }}</h3>
              <p class="text-muted-foreground">{{
                  $t('interactive.options.tarotDescription') || 'Gain clarity on your path with insightful Tarot card readings.'
                }}</p>
            </div>
            <div class="p-6 bg-background rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div class="text-5xl mb-4">
                <RuneIcon class="mx-auto"/>
              </div>
              <h3 class="text-2xl font-semibold mb-2 text-primary">{{ $t('interactive.options.runes') }}</h3>
              <p class="text-muted-foreground">{{
                  $t('interactive.options.runesDescription') || 'Unlock ancient secrets and guidance with Rune interpretations.'
                }}</p>
            </div>
            <div class="p-6 bg-background rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div class="text-5xl mb-4 text-center">
                <AstralIcon class="mx-auto"/>
              </div>
              <h3 class="text-2xl font-semibold mb-2 text-primary">{{ $t('interactive.options.astral') }}</h3>
              <p class="text-muted-foreground">{{
                  $t('interactive.options.astralDescription') || 'Discover your cosmic blueprint with a personalized Birth Chart analysis.'
                }}</p>
            </div>
          </div>
          <div class="mt-12">
            <Button @click="goToInteractive" variant="outline" size="lg"
                    class="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              {{ $t('callToAction.interactive.title') }}
            </Button>
          </div>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-4 text-primary">{{ $t('callToAction.chat.title') }}</h2>
          <p class="mb-8 text-lg text-muted-foreground">{{ $t('callToAction.chat.description') }}</p>
          <Button @click="newChat" size="lg"
                  class="text-lg px-10 py-6 bg-primary text-primary-foreground hover:bg-opacity-90">
            Let's Talk
          </Button>
        </div>
      </section>

    </main>

    <footer class="shadow-inner py-6 bg-card text-card-foreground mt-16">
      <div class="container mx-auto text-center text-sm text-muted-foreground">
        {{ $t('footer.copyright') }}
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* You can add additional page-specific styles here if needed, beyond Tailwind classes */
/* Example: Enhance hover effects or add subtle animations */
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(var(--primary-oklch), 0.1), 0 10px 10px -5px rgba(var(--primary-oklch), 0.04);
}

/* Convert oklch primary to rgb for box-shadow if not directly supported by browser or for better control */
/* For --primary: oklch(0.75 0.18 345) this would be roughly rgb(255, 138, 201) but it's better to use the CSS var if possible or generate actual RGB values */
</style>
