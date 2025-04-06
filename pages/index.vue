<script setup lang="ts">
import {Button} from "~/components/ui/button";

const { isSignedIn } = useAuth()

const newChat = async () => {
  if (!isSignedIn.value) {
    return navigateTo('/login')
  }
  const {data, error} = await useFetch('/api/chat/new', {
    method: 'POST'
  })

  if (error.value) {
    console.error(error.value)
    return
  }
  if (data.value) {
    if (data.value.success) {
      navigateTo(`/chat/${data.value.data.uuid}`)
    }
    return
  }
}

</script>

<template>
  <Button @click="newChat">new chat</Button>
</template>

<style scoped>

</style>
