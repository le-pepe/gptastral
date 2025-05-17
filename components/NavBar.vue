<script setup lang="ts">
import {NavigationMenu, NavigationMenuItem, NavigationMenuList,} from '@/components/ui/navigation-menu'
import {Button} from "~/components/ui/button";
import {SidebarTrigger} from "~/components/ui/sidebar";

const props = defineProps({
  showSidebarToggle: {
    type: Boolean,
    default: true,
  }
})

const route = useRoute()


const isChat = computed(() => {
  return route.path.startsWith('/chat')
})

</script>

<template>
  <header
      class="w-full px-4 py-2 border-grid sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="flex justify-between">

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <SidebarTrigger v-if="isChat && showSidebarToggle"/>
            <NuxtLink to="/" class="font-bold m-4" v-else-if="!isChat">GPTASTRAL</NuxtLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu>
        <NavigationMenuList class="flex-grow gap-2">
          <NavigationMenuItem>
            <LanguageSwitcher/>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <DarkMode/>
          </NavigationMenuItem>
          <NavigationMenuItem>
              <SignedOut>
                <SignInButton>
                  <Button variant="ghost">{{ $t('login.title') }}</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton/>
              </SignedIn>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  </header>
</template>
