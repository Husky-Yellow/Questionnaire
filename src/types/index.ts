// 用户相关类型
export interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: UserInfo
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 路由 meta 类型
export interface RouteMeta {
  title?: string
  requiresAuth?: boolean
  keepAlive?: boolean
  showInMenu?: boolean
}

// 设备信息类型
export interface DeviceInfo {
  isIOS: boolean
  isAndroid: boolean
  isMobile: boolean
  userAgent: string
}

// 安全区域类型
export interface SafeAreaInsets {
  top: number
  bottom: number
  left: number
  right: number
}

// 主题类型
export type Theme = 'light' | 'dark'

// 网络状态类型
export type NetworkStatus = 'online' | 'offline'
