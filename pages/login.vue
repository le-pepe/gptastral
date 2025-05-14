<script setup lang="ts">

const {isSignedIn} = useAuth()

const url = ref(`/chat/`)
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
