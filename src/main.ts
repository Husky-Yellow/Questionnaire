import './assets/main.css'
import 'uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAppStore } from './stores/app'
import { useUserStore } from './stores/user'

const app = createApp(App)
const pinia = createPinia()

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
