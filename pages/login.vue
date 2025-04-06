<script setup lang="ts">

import {randomUUID} from "uncrypto";

const {isSignedIn} = useAuth()

const uuid = randomUUID()
const url = ref(`/chat/${uuid}`)
if (isSignedIn.value) {
  navigateTo(url.value)
}


</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen w-full">
    <SignIn :fallbackRedirectUrl="url"/>
  </div>
</template>

<style scoped>

</style>
