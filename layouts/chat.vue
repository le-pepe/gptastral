<script setup lang="ts">

import {SidebarProvider} from "~/components/ui/sidebar";
import AppSidebar from "~/components/AppSidebar.vue";
import NavBar from "~/components/NavBar.vue";
</script>

<template>
    <SidebarProvider>
      <AppSidebar />
      <div class="flex flex-col h-screen w-full relative">
        <NavBar :show-sidebar-toggle="false"/>
        <slot/>
      </div>
    </SidebarProvider>
</template>

<style scoped>

</style>
