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
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import {Input} from "~/components/ui/input";

const chats = ref<any[]>([])
const loading = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)
const LIMIT = 30
const {t} = useI18n()
const nuxtApp = useNuxtApp()
const shouldGetChats = ref(false)
const openDeleteModal = ref(false)
const openEditModal = ref(false)
const chatToDelete = ref<string>()
const chatToEdit = ref({
  uuid: '',
  title: ''
})

const loadingChatDelete = ref(false)
const loadingChatEdit = ref(false)

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

const deleteModal = (uuid: string) => {
  openDeleteModal.value = true
  chatToDelete.value = uuid
}

const editModal = (uuid: string, title: string) => {
  chatToEdit.value.uuid = uuid
  chatToEdit.value.title = title
  openEditModal.value = true
}

const deleteChatOk = async () => {
  loadingChatDelete.value = true
  const res = await $fetch('/api/chat/delete', {
    method: 'POST',
    body: {
      uuid: chatToDelete.value
    }
  })
  loadingChatDelete.value = false
  openDeleteModal.value = false
  hasMore.value = true
  await getChats()
  const route = useRoute()
  const { uuid } = route.params
  if (uuid == chatToDelete.value) {
    await navigateTo('/chat')
    return
  }
  chatToDelete.value = ''
}

const editChatOk = async () => {
  loadingChatEdit.value = true
  const res = $fetch('/api/chat/edit', {
    method: 'POST',
    body: chatToEdit.value
  })
  loadingChatEdit.value = false
  openEditModal.value = false
  chatToEdit.value = {
    uuid: '',
    title: ''
  }
  hasMore.value = true
  setTimeout(async() => {
    await getChats()
  }, 500)
}


nuxtApp.hook('chat:created', () => {
  shouldGetChats.value = true
})

watch(shouldGetChats, () => {
  if (shouldGetChats.value) {
    hasMore.value = true
    getChats()
    shouldGetChats.value = false
  }
})


</script>

<template>
  <Sidebar>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem class="flex items-center">
          <NuxtLink to="/" class="font-bold m-2">GPTASTRAL</NuxtLink>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent @scroll="handleScroll" v-auto-animate>
      <template v-for="(item, index) in chats" :key="index">
        <SidebarGroup v-if="item.length > 0">
          <SidebarGroupLabel>{{ t(index) }}</SidebarGroupLabel>
          <SidebarMenu v-auto-animate>
            <SidebarMenuItem v-for="chat in item" :key="chat.uuid" class="w-full flex items-center justify-between gap-1">
              <Button variant="secondary" as-child class="justify-start truncate">
                <NuxtLink :to="chatLink(chat.uuid)" class="w-[80%]" :title="chat.title">
                  <span class="flex-1 truncate">{{ chat.title ?? 'Untitled' }}</span>
                </NuxtLink>
              </Button>
                <DropdownMenu :modal="false">
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost">
                      <Icon name="mdi:dots-horizontal" class="cursor-pointer" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem class="cursor-pointer" @click="editModal(chat.uuid, chat.title)">
                        <Edit />
                        <span>{{$t("sidebar.actions.rename")}}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem class="cursor-pointer text-destructive" @click="deleteModal(chat.uuid)">
                        <Trash2 class="text-destructive" />
                        <span>{{$t("sidebar.actions.delete")}}</span>
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
      <Dialog v-model:open="openDeleteModal">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{{$t("sidebar.modal.delete.title")}}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {{ $t("sidebar.modal.delete.description")}}
          </DialogDescription>
          <DialogFooter>
            <DialogClose as-child>
              <Button variant="secondary">
                {{$t("sidebar.modal.delete.cancelButton")}}
              </Button>
            </DialogClose>
            <Button variant="destructive" @click="deleteChatOk" :disabled="loadingChatDelete">
              <Icon name="svg-spinners:90-ring-with-bg" v-show="loadingChatDelete" />
              {{loadingChatDelete ? $t("sidebar.modal.delete.loadingOk") : $t("sidebar.modal.delete.okButton")}}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog v-model:open="openEditModal">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{{$t("sidebar.modal.rename.title")}}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Input v-model="chatToEdit.title" :placeholder="$t('sidebar.modal.rename.placeholder')" @keydown.enter="editChatOk"/>
          </DialogDescription>
          <DialogFooter>
            <DialogClose as-child>
              <Button variant="secondary">
                {{$t("sidebar.modal.rename.cancelButton")}}
              </Button>
            </DialogClose>
            <Button @click="editChatOk" :disabled="!chatToEdit.title || loadingChatEdit">
              <Icon name="svg-spinners:90-ring-with-bg" v-show="loadingChatEdit" />
              {{$t(loadingChatEdit ? "sidebar.modal.rename.loadingOk":"sidebar.modal.rename.okButton")}}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarContent>
    <SidebarFooter />
  </Sidebar>
</template>
