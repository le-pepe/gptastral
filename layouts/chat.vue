<script setup lang="ts">

import {SidebarProvider} from "~/components/ui/sidebar";
import AppSidebar from "~/components/AppSidebar.vue";
import NavBar from "~/components/NavBar.vue";

const {isSignedIn} = useAuth()

if (!isSignedIn.value) {
  navigateTo('/login')
}

</script>

<template>
    <SidebarProvider>
      <AppSidebar />
      <div class="flex flex-col h-dvh w-full relative">
        <NavBar :show-sidebar-toggle="true"/>
        <slot/>
      </div>
    </SidebarProvider>
</template>

<style scoped>

</style>
