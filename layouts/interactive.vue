<script setup lang="ts">

import NavBar from "~/components/NavBar.vue";

const {isSignedIn} = useAuth()

if (!isSignedIn.value) {
  navigateTo('/login')
}

</script>

<template>
  <div class="flex flex-col h-dvh w-full relative">
    <NavBar :show-sidebar-toggle="false"/>
    <slot/>
  </div>
</template>

<style scoped>

</style>
