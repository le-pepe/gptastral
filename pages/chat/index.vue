<script setup lang="ts">
import {Button} from "~/components/ui/button";
import {Textarea} from "~/components/ui/textarea";

definePageMeta({
  layout: 'chat',
})

const message = ref("")

const selectedModel = ref('deepseek')

const nuxtApp = useNuxtApp();

nuxtApp.hook('model:selected', (m) => {
  selectedModel.value = m
})

const handleSubmit = (e: KeyboardEvent) => {
  if (e.key.toLowerCase() === 'enter' && !e.shiftKey) {
    e.preventDefault()
    handleSendButtonClick()
  }
}

const disableSendButton = computed(() => {
  return message.value.trim().length == 0
})

const handleSendButtonClick = async () => {
  if (message.value.trim().length == 0) return
  if (disableSendButton.value) return
  const res = await $fetch('/api/chat/new', { method: 'POST', model: selectedModel.value })
  const nuxtApp = useNuxtApp();



  if (res.success) {
    navigateTo(`/chat/${res.data.uuid}`).then(async (a) => {

      await nuxtApp.callHook('chat:add:message', {
        message: message.value
      })
    })
    return
  }
}

const sendMessage = () => {
  if (message.value.trim().length == 0) return

}

</script>

<template>
  <div class="flex-1 flex flex-col p-4 justify-center items-center h-full gap-4">
    <h1 class="text-2xl">{{ $t("chat.title") }}</h1>
    <div class="relative rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-full max-w-3xl">
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
        <Icon name="mdi:send" class="h-4 w-4"/>
      </Button>
    </div>
    <footer class="py-4">
      <div class="container mx-auto text-center text-sm text-gray-500">
        {{ $t('footer.copyright') }}
      </div>
    </footer>
  </div>

</template>

<style scoped>

</style>
