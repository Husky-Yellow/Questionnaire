import { ref, onMounted } from 'vue'

export function usePWA() {
  const isInstallable = ref(false)
  const isInstalled = ref(false)
  const deferredPrompt = ref<any>(null)

  // 检查是否已安装
  function checkInstallation() {
    // 检查是否在 PWA 模式下运行
    isInstalled.value =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
  }

  // 安装 PWA
  async function install() {
    if (!deferredPrompt.value) return false

    try {
      deferredPrompt.value.prompt()
      const { outcome } = await deferredPrompt.value.userChoice

      if (outcome === 'accepted') {
        isInstalled.value = true
        isInstallable.value = false
        deferredPrompt.value = null
        return true
      }
    } catch (error) {
      console.error('PWA installation failed:', error)
    }

    return false
  }

  // 监听安装事件
  function setupInstallListener() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e
      isInstallable.value = true
    })

    window.addEventListener('appinstalled', () => {
      isInstalled.value = true
      isInstallable.value = false
      deferredPrompt.value = null
    })
  }

  onMounted(() => {
    checkInstallation()
    setupInstallListener()
  })

  return {
    isInstallable,
    isInstalled,
    install,
  }
}
