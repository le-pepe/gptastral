<script setup lang="ts">

import {themeGPT} from "~/lib/theme";

const {isSignedIn} = useAuth()

const url = ref(`/chat/`)
if (isSignedIn.value) {
  navigateTo(url.value)
}


</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-br from-background to-secondary">
    <SignIn :fallbackRedirectUrl="url" :appearance="themeGPT"/>
  </div>
</template>

<style scoped>

</style>
