<script setup lang="ts">

import NavBar from "~/components/NavBar.vue";
</script>

<template>
  <div class="flex flex-col h-screen w-full relative">
    <NavBar :show-sidebar-toggle="false"/>
    <slot/>
  </div>
</template>

<style scoped>

</style>
