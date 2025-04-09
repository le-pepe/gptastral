<script setup lang="ts">
import {Button} from "~/components/ui/button";

const { isSignedIn } = useAuth()

const newChat = async () => {
  if (!isSignedIn.value) {
    return navigateTo('/login')
  }
  const {data, error} = await useFetch('/api/chat/new', {
    method: 'POST'
  })

  if (error.value) {
    console.error(error.value)
    return
  }
  if (data.value) {
    if (data.value.success) {
      navigateTo(`/chat/${data.value.data.uuid}`)
    }
    return
  }
}

</script>

<template>
  <div class="min-h-screen flex flex-col justify-between">
    <!-- Header -->
    <header class="shadow">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold">GPTASTRAL</h1>
          </div>
          <nav>
            <DarkMode />
            <Button variant="secondary" @click="navigateTo('/login')">Login</Button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center py-20">
        <h2 class="text-4xl font-extrabold mb-4">Unveil the Mysteries with GPTASTRAL</h2>
        <p class="mb-8">
          Engage with the cosmos like never before. Ask our AI about your life's journey and receive insights through tarot readings, rune interpretations, and personalized astrological charts. Transform your questions into cosmic guidance.
        </p>
        <Button @click="navigateTo('/login')">Start Your Journey</Button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="shadow py-4">
      <div class="container mx-auto text-center">
        © 2025 GPTASTRAL. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<style scoped>

</style>
