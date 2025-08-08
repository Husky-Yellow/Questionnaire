import { useApi } from '@/composables/useApi'
import type {
  ValidatePasscodeResponse,
  StartSessionResponse,
  IdentityPayload,
  SaveProgressResponse,
} from '@/types'

// 问卷 API（返回值可直接 await 后解构 { data, error }）
export const getPasscodes = () => useApi.get<string[]>('/questionnaire/passcodes').json()

export const validatePasscode = (passcode: string) =>
  useApi.post<ValidatePasscodeResponse>('/questionnaire/validate', { passcode }).json()

export const startSession = (identity: IdentityPayload) =>
  useApi.post<StartSessionResponse>('/questionnaire/start', identity).json()

export const saveProgress = (payload: {
  sessionId: string
  answers: Record<string, string | undefined>
  currentIndex: number
}) =>
  useApi.post<SaveProgressResponse>('/questionnaire/save', payload).json()

export const submitAnswers = (payload: {
  sessionId: string
  answers: Record<string, string | undefined>
}) =>
  useApi.post('/questionnaire/submit', payload).json()


