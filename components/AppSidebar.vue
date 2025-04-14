<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar'
import {SidebarGroupLabel, SidebarMenu, SidebarMenuItem} from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";

const chats = ref<any[]>([])
const {t} = useI18n()

const getChats = async () => {
  const res = await $fetch('/api/chat/list', {
    method: 'POST',
  })
  if (res.success) {
    chats.value = res.data
  }
}
const interval = ref()

onMounted(() => {
  getChats();
  interval.value = setInterval(getChats, 5000)
})

onBeforeUnmount(() => {
  clearInterval(interval.value)
})

</script>

<template>
  <Sidebar>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <NuxtLink to="/" class="font-bold m-4">GPTASTRAL</NuxtLink>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <template v-for="(item, index) in chats" :key="index">
        <SidebarGroup v-if="item.length > 0">
          <SidebarGroupLabel>{{ t(index) }}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem v-for="chat in item" :key="chat.uuid" >
              <Button variant="secondary" as-child class="w-full">
                <NuxtLink :to="`/chat/${chat.uuid}`">
                  {{ chat.title ?? 'Untitled' }}
                </NuxtLink>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </template>
    </SidebarContent>
    <SidebarFooter />
  </Sidebar>
</template>
