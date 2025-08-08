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
export interface ApiResponse<T = unknown> {
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

// 问卷与答题类型
export interface QuestionnaireMeta {
  id: string
  title: string
  logoUrl?: string
  active: boolean
  startAt?: string
  endAt?: string
  timeLimitSeconds?: number
}

export interface OptionItem {
  id: string
  text: string
  imageUrl?: string
}

export type QuestionType = 'single'

export interface JumpRule {
  // 当选中该选项时跳转
  optionId: string
  // 跳转到指定题目 ID；若为 'END' 则直接结束
  targetQuestionId?: string
  end?: boolean
}

export interface QuestionItem {
  id: string
  type: QuestionType
  title: string
  description?: string
  imageUrl?: string
  order?: number
  options: OptionItem[]
  jumpRules?: JumpRule[]
}

export interface QuestionnairePayload {
  meta: QuestionnaireMeta
  questions: QuestionItem[]
}

export interface IdentityPayload {
  phone: string
  name: string
  idCard: string
}

export interface QuestionnaireSession {
  sessionId: string
  questionnaireId: string
  alreadyAnswered?: boolean
  remainingSeconds?: number
}

export type AnswerMap = Record<string, string | undefined>

export interface SaveProgressResponse {
  savedAt: string
}

export interface ValidatePasscodeResponse {
  valid: boolean
  questionnaire: QuestionnaireMeta | null
}

export interface StartSessionResponse extends QuestionnaireSession {
  payload?: QuestionnairePayload
}
