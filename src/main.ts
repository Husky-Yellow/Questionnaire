import './assets/main.css'
import 'uno.css'

import { createApp } from 'vue'
import { pinia } from '@/stores/pinia'

import App from './App.vue'
import router from './router'
import { useAppStore } from './stores/app'
import { useUserStore } from './stores/user'
// 使用 vite-plugin-mock，移除自定义 fetch mock

const app = createApp(App)
app.use(pinia)
app.use(router)

// 初始化应用状态
router.isReady().then(() => {
  const appStore = useAppStore()
  const userStore = useUserStore()

  appStore.initializeDevice()
  appStore.setupNetworkListener()
  userStore.initialize()
})

app.mount('#app')
