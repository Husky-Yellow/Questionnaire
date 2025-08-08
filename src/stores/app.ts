import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Theme, NetworkStatus, SafeAreaInsets } from '@/types'

export const useAppStore = defineStore('app', () => {
  // 应用状态
  const loading = ref(false)
  const networkStatus = ref<NetworkStatus>('online')
  const theme = ref<Theme>('light')

  // 移动端相关状态
  const isIOS = ref(false)
  const isAndroid = ref(false)
  const isMobile = ref(false)
  const safeAreaInsets = ref<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  })

  // 计算属性
  const isDark = computed(() => theme.value === 'dark')
  const isOnline = computed(() => networkStatus.value === 'online')

  // 设置加载状态
  function setLoading(status: boolean) {
    loading.value = status
  }

  // 切换主题
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  // 设置网络状态
  function setNetworkStatus(status: NetworkStatus) {
    networkStatus.value = status
  }

  // 初始化设备信息
  function initializeDevice() {
    const ua = navigator.userAgent
    isIOS.value = /iPad|iPhone|iPod/.test(ua)
    isAndroid.value = /Android/.test(ua)
    isMobile.value = /Mobi|Android/i.test(ua)

    // 获取安全区域
    if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
      const computedStyle = getComputedStyle(document.documentElement)
      safeAreaInsets.value = {
        top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
      }
    }
  }

  // 监听网络状态
  function setupNetworkListener() {
    window.addEventListener('online', () => setNetworkStatus('online'))
    window.addEventListener('offline', () => setNetworkStatus('offline'))
    setNetworkStatus(navigator.onLine ? 'online' : 'offline')
  }

  return {
    loading,
    networkStatus,
    theme,
    isIOS,
    isAndroid,
    isMobile,
    safeAreaInsets,
    isDark,
    isOnline,
    setLoading,
    toggleTheme,
    setNetworkStatus,
    initializeDevice,
    setupNetworkListener,
  }
})
