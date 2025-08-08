import { createFetch } from '@vueuse/core'
import type { UseFetchOptions } from '@vueuse/core'

// 创建基础 fetch 实例
const useBaseFetch = createFetch({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  options: {
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },
  fetchOptions: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
})

// 请求拦截器
const useApiRequest = createFetch({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  options: {
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
    beforeFetch({ options }) {
      // 添加认证 token
      const token = localStorage.getItem('token')
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }

      return { options }
    },
    afterFetch({ data, response }) {
      // 处理响应数据
      if (response.status === 401) {
        // 处理未授权
        localStorage.removeItem('token')
        window.location.href = '/login'
      }

      return { data }
    },
    onFetchError({ error, data }) {
      // 统一错误处理
      console.error('API Error:', error)

      // 可以在这里添加全局错误提示
      if (error.message.includes('timeout')) {
        console.error('请求超时，请检查网络连接')
      }

      return { error, data }
    },
  },
  fetchOptions: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
})

// 封装常用的 HTTP 方法
export const useApi = {
  get: <T = any>(url: string, options?: UseFetchOptions) =>
    useApiRequest<T>(url, { method: 'GET', ...options }),

  post: <T = any>(url: string, payload?: any, options?: UseFetchOptions) => {
    const instance = useApiRequest<T>(url, { method: 'POST', ...options })
    if (payload) {
      // Set the body for POST requests
      return useApiRequest<T>(url, { 
        method: 'POST', 
        body: JSON.stringify(payload),
        ...options 
      })
    }
    return instance
  },

  put: <T = any>(url: string, payload?: any, options?: UseFetchOptions) => {
    const instance = useApiRequest<T>(url, { method: 'PUT', ...options })
    if (payload) {
      return useApiRequest<T>(url, { 
        method: 'PUT', 
        body: JSON.stringify(payload),
        ...options 
      })
    }
    return instance
  },

  delete: <T = any>(url: string, options?: UseFetchOptions) =>
    useApiRequest<T>(url, { method: 'DELETE', ...options }),

  patch: <T = any>(url: string, payload?: any, options?: UseFetchOptions) => {
    const instance = useApiRequest<T>(url, { method: 'PATCH', ...options })
    if (payload) {
      return useApiRequest<T>(url, { 
        method: 'PATCH', 
        body: JSON.stringify(payload),
        ...options 
      })
    }
    return instance
  },
}

// 导出基础 fetch 供特殊需求使用
export { useBaseFetch }
