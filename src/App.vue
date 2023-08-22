<template>
  <NConfigProvider
    class="h-full"
    :theme="theme"
    :theme-overrides="themeOverrides"
    :locale="language"
  >
    <NaiveProvider>
      <ChatComponent />
      <RouterView />
    </NaiveProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { NaiveProvider } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'
import ChatComponent from "@/components/custom/ChatComponent.vue"; // 请确保替换为实际的路径

const { theme, themeOverrides } = useTheme()
const { language } = useLanguage()
</script>