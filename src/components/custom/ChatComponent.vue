<template>
  <!-- 由于您已经有了聊天界面，这里不再包含任何模板内容 -->
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';

// 注入DialogueManager
const dialogueManager = inject('dialogueManager');

// 用户输入和消息历史记录
const userInput = ref('');
const messages = ref([]);

// 发送消息
const sendMessage = () => {
  if (userInput.value.trim()) {
    messages.value.push({ id: Date.now(), type: 'user', content: userInput.value });
    const aiResponse = dialogueManager.getNextDialogue(userInput.value);
    messages.value.push({ id: Date.now() + 1, type: 'ai', content: aiResponse });
    userInput.value = '';
  }
};
</script>

<!-- 由于您已经有了聊天界面，这里不再包含任何样式 -->
<style scoped>
</style>