<script setup lang="ts">
import {randomUUID} from "uncrypto";

const {isSignedIn} = useAuth()

if (isSignedIn.value) {
  const uuid = randomUUID
  navigateTo('/chat/' + uuid)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen w-full">
    <SignUp/>
  </div>
</template>

<style scoped>

</style>
