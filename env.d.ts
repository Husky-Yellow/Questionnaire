/// <reference types="vite/client" />

// 环境变量类型定义
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_ENABLE_PWA: string
  readonly VITE_ENABLE_MOCK: string
  readonly VITE_APP_ENV: 'development' | 'production' | 'test'
}

// 全局类型声明
declare global {
  // 构建时注入的全局变量
  const __APP_VERSION__: string
  const __BUILD_TIME__: string
  
  // PWA 相关
  interface Navigator {
    standalone?: boolean
  }
  
  // 浏览器兼容性
  interface Window {
    // iOS Safari 兼容性
    DeviceMotionEvent: {
      requestPermission?: () => Promise<'granted' | 'denied'>
    }
    DeviceOrientationEvent: {
      requestPermission?: () => Promise<'granted' | 'denied'>
    }
  }
}

// Vue 组件类型增强
declare module '@vue/runtime-core' {
  interface GlobalProperties {
    // 可以在这里添加全局属性的类型定义
    $api: typeof import('./src/composables/useApi').useApi
  }
}

// 确保这个文件被当作模块处理
export {}
