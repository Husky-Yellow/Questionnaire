import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import type { UserInfo, LoginCredentials, LoginResponse } from '@/types'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)
  const token = ref<string>('')
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  // 登录
  async function login(credentials: LoginCredentials) {
    const { data, error } = await useApi.post<LoginResponse>('/auth/login', credentials)

    if (!error.value && data.value) {
      token.value = data.value.token
      userInfo.value = data.value.user
      localStorage.setItem('token', token.value)
      return { success: true }
    }

    return { success: false, error: error.value }
  }

  // 登出
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  // 获取用户信息
  async function fetchUserInfo() {
    if (!token.value) return

    const { data, error } = await useApi.get<UserInfo>('/user/profile')

    if (!error.value && data.value) {
      userInfo.value = data.value
    }
  }

  // 初始化（从本地存储恢复状态）
  function initialize() {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
      fetchUserInfo()
    }
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    login,
    logout,
    fetchUserInfo,
    initialize,
  }
})
