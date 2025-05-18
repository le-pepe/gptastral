<script setup lang="ts">
import {NavigationMenu, NavigationMenuItem, NavigationMenuList,} from '@/components/ui/navigation-menu'

import {Button} from "~/components/ui/button";

import {SidebarTrigger} from "~/components/ui/sidebar";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";

const props = defineProps({
  showSidebarToggle: {
    type: Boolean,
    default: true,
  },
});

const nuxtApp = useNuxtApp();
const route = useRoute();

const models = ref([
  { name: 'Deepseek', code: 'deepseek' },
  { name: 'OpenAI', code: 'openai' },
]);

const selectedModel = ref(models.value[0]); // Inicializa con el primer modelo

const isChatPage = computed(() => route.path.startsWith('/chat'));
const isInteractivePage = computed(() => route.path.startsWith('/interactive'));
const isUuidPage = computed(() => !!route.params.uuid);
const isHomePage = computed(() => route.path === '/');
const isModelSelectVisible = computed(() => !isHomePage.value && !isUuidPage.value);
const isSidebarToggleVisible = computed(() => !isHomePage.value && props.showSidebarToggle);

watch(selectedModel, (newModel) => {
  nuxtApp.callHook('model:selected', newModel.code);
});
</script>

<template>
  <header
      class="w-full px-4 py-2 border-grid sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <SidebarTrigger v-if="isSidebarToggleVisible" class="mr-4" />
        <NuxtLink to="/" class="font-bold m-0 mr-4" v-if="isHomePage || isInteractivePage">GPTASTRAL</NuxtLink>
        <Select v-model="selectedModel" v-if="isModelSelectVisible">
          <SelectTrigger>
            <SelectValue :placeholder="selectedModel.name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="model in models" :key="model.code" :value="model">
              {{ model.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        </div>

      <NavigationMenu>
        <NavigationMenuList class="flex items-center gap-2">
          <NavigationMenuItem>
            <LanguageSwitcher />
          </NavigationMenuItem>
          <NavigationMenuItem v-if="false">
            <DarkMode />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <SignedOut>
              <SignInButton>
                <Button variant="ghost">{{ $t('login.title') }}</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton show-name />
            </SignedIn>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  </header>
</template>
