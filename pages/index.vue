<script setup lang="ts">
import { Button } from "~/components/ui/button"

const { isSignedIn } = useAuth()

const newChat = async () => {
  if (!isSignedIn.value) {
    await navigateTo('/login')
    return
  }
  const res = await $fetch('/api/chat/new', { method: 'POST' })

  if (res.success) {
    await navigateTo(`/chat/${res.data.uuid}`)
  } else {
    console.error(res)
  }
}

const goToInteractive = async () => {
  if (!isSignedIn.value) {
    await navigateTo('/login')
    return
  }
  await navigateTo('/interactive')
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between">
    <!-- Header -->
    <NavBar />

    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center py-20">
        <h2 class="text-4xl font-extrabold mb-4">{{ $t('hero.title') }}</h2>
        <p class="mb-8 max-w-3xl mx-auto">
          {{ $t('hero.description') }}
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button @click="newChat">
            {{ $t('callToAction.chat.title') }}
          </Button>
          <Button @click="goToInteractive" variant="secondary">
            {{ $t('callToAction.interactive.title') }}
          </Button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="shadow py-4">
      <div class="container mx-auto text-center text-sm text-gray-500">
        {{ $t('footer.copyright') }}
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Puedes agregar estilos si quieres customizar más */
</style>
