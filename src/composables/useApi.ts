import { createFetch } from '@vueuse/core'
import type { UseFetchOptions } from '@vueuse/core'

// 统一 baseUrl：开发环境走空前缀以便命中 vite-plugin-mock；生产使用环境变量
const BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL as string) || ''

// 请求配置
const REQUEST_CONFIG = {
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  retries: 3,
  retryDelay: 1000,
}

// 创建基础 fetch 实例（保留给特殊需求）
const useBaseFetch = createFetch({
  baseUrl: BASE_URL,
  options: {
    timeout: REQUEST_CONFIG.timeout,
  },
  fetchOptions: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
})

// Token 管理
const tokenManager = {
  get(): string | null {
    return localStorage.getItem('token')
  },
  set(token: string): void {
    localStorage.setItem('token', token)
  },
  remove(): void {
    localStorage.removeItem('token')
  },
  isValid(token: string | null): boolean {
    if (!token) return false
    try {
      // 简单的token格式验证
      return token.split('.').length === 3
    } catch {
      return false
    }
  }
}

// 错误处理器
const errorHandler = {
  handleAuthError(): void {
    tokenManager.remove()
    // 使用router进行导航而不是直接修改location
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  },
  
  getErrorMessage(error: Error): string {
    if (error.message.includes('timeout')) {
      return '请求超时，请检查网络连接'
    }
    if (error.message.includes('Failed to fetch')) {
      return '网络连接失败，请稍后重试'
    }
    return error.message || '请求失败'
  }
}

// 请求拦截器
const useApiRequest = createFetch({
  baseUrl: BASE_URL,
  options: {
    timeout: REQUEST_CONFIG.timeout,
    beforeFetch({ options, url }) {
      // 添加认证 token
      const token = tokenManager.get()
      if (tokenManager.isValid(token)) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }

      // 添加请求时间戳防止缓存
      if (options.method === 'GET' || !options.method) {
        const urlObj = new URL(url, BASE_URL || window.location.origin)
        urlObj.searchParams.set('_t', Date.now().toString())
        return { options, url: urlObj.toString() }
      }

      return { options, url }
    },
    afterFetch({ data, response }) {
      // 处理响应数据
      if (response.status === 401) {
        errorHandler.handleAuthError()
      }

      // 统一处理API响应格式
      if (data && typeof data === 'object' && 'code' in data) {
        if (data.code !== 0 && data.code !== 200) {
          throw new Error(data.message || '请求失败')
        }
        return { data: data.data || data }
      }

      return { data }
    },
    onFetchError({ error, data }) {
      const errorMessage = errorHandler.getErrorMessage(error)
      console.error('API Error:', errorMessage, error)

      // 返回格式化的错误
      return { 
        error: new Error(errorMessage), 
        data 
      }
    },
  },
  fetchOptions: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
})

// 封装常用的 HTTP 方法（基于 @vueuse/core useFetch）
export const useApi = {
  get: <T = unknown>(url: string, options?: UseFetchOptions) =>
    useApiRequest<T>(url, { ...options }).get(),

  post: <T = unknown>(url: string, payload?: unknown, options?: UseFetchOptions) =>
    useApiRequest<T>(url, { ...options }).post(payload ? JSON.stringify(payload) : undefined),

  put: <T = unknown>(url: string, payload?: unknown, options?: UseFetchOptions) =>
    useApiRequest<T>(url, { ...options }).put(payload ? JSON.stringify(payload) : undefined),

  delete: <T = unknown>(url: string, options?: UseFetchOptions) =>
    useApiRequest<T>(url, { ...options }).delete(),

  patch: <T = unknown>(url: string, payload?: unknown, options?: UseFetchOptions) =>
    useApiRequest<T>(url, { ...options }).patch(payload ? JSON.stringify(payload) : undefined),
}

// 导出基础 fetch 和 token 管理器供特殊需求使用
export { useBaseFetch, tokenManager }
