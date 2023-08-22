import xiaotongConfig from './xiaotong.json';
import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'
import DialogueManager from '@/utils/managers/dialogueManager'; // 调整了这里的路径

async function bootstrap() {
  const app = createApp(App)
  
  const dialogueManager = new DialogueManager();
  app.provide('dialogueManager', dialogueManager);

  setupAssets()

  setupScrollbarStyle()

  setupStore(app)

  setupI18n(app)

  await setupRouter(app)

  app.mount('#app')
}

bootstrap()

console.log(xiaotongConfig);