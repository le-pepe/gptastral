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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";

import { Edit, Trash2 } from "lucide-vue-next";

const chats = ref<any[]>([])
const loading = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)
const LIMIT = 30
const {t} = useI18n()

const getChats = async (page = 1) => {
  if (loading.value || !hasMore.value) return

  loading.value = true
  try {
    const res = await $fetch('/api/chat/list', {
      method: 'POST',
      body: {
        limit: LIMIT,
        page
      }
    })
    if (res.success) {
      // Si es la primera página, reemplaza
      if (page === 1) {
        chats.value = res.data
      } else {
        // Haz merge entre chats viejos y nuevos
        Object.keys(res.data).forEach(key => {
          if (!chats.value[key]) {
            chats.value[key] = []
          }
          chats.value[key].push(...res.data[key])
        })
      }
      hasMore.value = res.pagination.hasMore
      currentPage.value = page
    }
  } finally {
    loading.value = false
  }
}

const handleScroll = async (e: Event) => {
  const target = e.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = target

  if (
    scrollHeight - scrollTop - clientHeight < 100 &&
    hasMore.value &&
    !loading.value
  ) {
    // Pedir la siguiente página, no sumando el LIMIT sino incrementando la página
    await getChats(currentPage.value + 1)
  }
}

onMounted(() => {
  getChats();
})

const chatLink = (uuid: string) => {
  return `/chat/${uuid}`
}


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
    <SidebarContent @scroll="handleScroll">
      <template v-for="(item, index) in chats" :key="index">
        <SidebarGroup v-if="item.length > 0">
          <SidebarGroupLabel>{{ t(index) }}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem v-for="chat in item" :key="chat.uuid" class="w-full flex items-center justify-between gap-1">
              <Button variant="secondary" as-child class="justify-start truncate">
                <NuxtLink :to="chatLink(chat.uuid)" class="w-[80%]" :title="chat.title">
                  <span class="flex-1 truncate">{{ chat.title ?? 'Untitled' }}</span>
                </NuxtLink>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost">
                    <Icon name="mdi:dots-horizontal" class="cursor-pointer" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem class="cursor-pointer">
                      <Edit />
                      <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem class="cursor-pointer text-destructive">
                      <Trash2 class="text-destructive" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </template>
      <div v-if="loading" class="flex justify-center p-4">
        <span class="loading-spinner">Loading...</span>
      </div>
    </SidebarContent>
    <SidebarFooter />
  </Sidebar>
</template>
