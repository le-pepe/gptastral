<script setup lang="ts">
import {Button} from "~/components/ui/button";
import {Textarea} from "~/components/ui/textarea";

definePageMeta({
  layout: 'chat',
})

const message = ref("")

const handleSubmit = (e: KeyboardEvent) => {
  if (e.key.toLowerCase() === 'enter' && !e.shiftKey) {
    e.preventDefault()
  }
}

const disableSendButton = computed(() => {
  return message.value.trim().length == 0
})

const handleSendButtonClick = () => {

}

</script>

<template>
  <div class="flex-1 flex flex-col p-4 justify-center items-center h-full gap-4">
    <h1 class="text-2xl">{{ $t("chat.title") }}</h1>
    <div class="relative rounded-lg shadow-sm border border-primary w-full max-w-3xl">
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
  </div>

</template>

<style scoped>

</style>
