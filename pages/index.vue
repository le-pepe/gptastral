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
    <NavBar />

    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center py-20">
        <h2 class="text-4xl font-extrabold mb-4">{{ $t('hero.title') }}</h2>
        <p class="mb-8 max-w-3xl mx-auto">
          {{ $t('hero.description') }}
        </p>
        <Button @click="navigateTo('/login')">{{ $t('callToAction.title') }}</Button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="shadow py-4">
      <div class="container mx-auto text-center">
        {{ $t('footer.copyright')}}
      </div>
    </footer>
  </div>
</template>

<style scoped>

</style>
