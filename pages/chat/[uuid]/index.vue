<script setup lang="ts">
import Loading from "@/components/Loading.vue";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";

definePageMeta({
  layout: 'chat'
})

const { userId } = useAuth()

if (!userId.value) {
   navigateTo('/')
}

interface Message {
  role: 'user' | 'assistant'
  content: string,
  id?: string
}

const message = ref('')
const messages = ref<Message[]>([])
const chatContainer = ref<HTMLElement>()
const waitingResponse = ref(false)

const route = useRoute()
const uuid = route.params.uuid

onMounted(() => {
  if (route.params.uuid) {
    getChat()
  }
})

const getChat = async () => {
  const res = await $fetch('/api/chat', {
    method: 'POST',
    body: {
      uuid: uuid
    }
  })
  if (res.success) {
    messages.value = res.data.messages.map((c: any) => ({
      content: c.message!,
      id: c.id,
      role: c.role
    }))
    scrollToBottom()
  }
}

const pushMessage = async (role: 'user' | 'assistant') => {
  const trimmedMessage = message.value.trim()
  if (!trimmedMessage) return
  await sendMessage(role, trimmedMessage)
}

const sendMessage = async (role: 'user' | 'assistant', content: string) => {
  messages.value.push({ role, content, id: Math.random().toString() })
  message.value = ''
  scrollToBottom()

  try {
    waitingResponse.value = true
    const res = await $fetch('/api/chat/read', {
      method: 'POST',
      body: { message: content, uuid }
    })
    if (res.success) {
      messages.value.push({
        role: 'assistant',
        content: '',
        id: Math.random().toString()
      })
      for (const c of res.data) {
        setTimeout(() => {
          messages.value[messages.value.length - 1].content += c
        }, 1000)
      }
      scrollToBottom()
    }
  } catch (err) {
    console.error('An error occurred:', err)
  } finally {
    waitingResponse.value = false
  }
}

const scrollToBottom = () => {
  nextTick(() => chatContainer.value?.scrollTo({
    top: chatContainer.value.scrollHeight,
    behavior: 'smooth'
  }))
}

watch(messages, scrollToBottom, { deep: true })

const handleSubmit = (e: KeyboardEvent) => {
  if (e.key.toLowerCase() === 'enter' && !e.shiftKey) {
    e.preventDefault()
    pushMessage('user')
  }
}

const handleSendButtonClick = () => pushMessage('user')

const disableSendButton = computed(() => message.value.trim().length === 0)
</script>

<template>


      <!-- Contenedor principal de mensajes -->
      <div
          ref="chatContainer"
          class="flex-1 w-full overflow-y-auto pb-32 pt-2 px-4"
      >
        <div class="mx-auto max-w-3xl w-full space-y-3">
          <div
              v-for="m in messages"
              :key="m.id"
              class="flex"
              :class="{'justify-end': m.role === 'user', 'justify-start': m.role === 'assistant'}"
          >
            <div v-if="m.role === 'user'"
                class="rounded-3xl px-4 py-3 text-sm"
                :class="{
                'bg-muted max-w-[75%]': m.role === 'user',
              }"
            >
              <div class="text-pretty whitespace-pre-wrap">{{ m.content }}</div>
            </div>
            <div v-else>
              <div v-html="parseMarkdown(m.content)" />
            </div>
          </div>
          <Loading v-if="waitingResponse" />
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0">
        <div class="mx-auto max-w-3xl w-full py-3">
          <div class="relative rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Textarea
                :placeholder="$t('chat.textarea.placeholder')"
                class="w-full pr-12 max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                @keydown="handleSubmit"
                v-model="message"
                rows="1"
            />
            <Button
                class="absolute right-2 bottom-1.5 h-8 w-8"
                size="icon"
                variant="ghost"
                @click="handleSendButtonClick"
                :disabled="disableSendButton"
            >
              <Icon name="mdi:send" class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
</template>

<style>
/* Estilo para el scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
