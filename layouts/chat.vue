<script setup lang="ts">

import {SidebarProvider} from "~/components/ui/sidebar";
import AppSidebar from "~/components/AppSidebar.vue";
import NavBar from "~/components/NavBar.vue";
</script>

<template>
    <SidebarProvider>
      <AppSidebar />
      <div class="flex flex-col h-dvh w-full relative">
        <NavBar :show-sidebar-toggle="true"/>
        <slot/>
      </div>
    </SidebarProvider>
  <footer class="py-4">
    <div class="container mx-auto text-center text-sm text-gray-500">
      {{ $t('footer.copyright') }}
    </div>
  </footer>
</template>

<style scoped>

</style>
