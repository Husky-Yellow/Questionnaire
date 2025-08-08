import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { validatePasscode as apiValidate, startSession as apiStart, saveProgress as apiSave, submitAnswers as apiSubmit } from '@/api'
import type {
  QuestionnaireMeta,
  QuestionItem,
  AnswerMap,
  IdentityPayload,
} from '@/types'

interface ProgressItem {
  questionId: string
  answered: boolean
}

// 优化的稳定洗牌算法
function shuffleStable<T>(items: T[], seed: string): T[] {
  let s = 0
  for (let i = 0; i < seed.length; i++) {
    s = (s * 31 + seed.charCodeAt(i)) >>> 0
  }
  
  const arr = [...items] // 使用扩展运算符替代slice()
  for (let i = arr.length - 1; i > 0; i--) {
    s = (1103515245 * s + 12345) >>> 0
    const j = s % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// 本地存储管理
const LOCAL_STORAGE_KEY = 'qn-progress'
const storageManager = {
  save(data: Record<string, unknown>): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  },
  
  load(): Record<string, unknown> | null {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
      return raw ? JSON.parse(raw) as Record<string, unknown> : null
    } catch (error) {
      console.warn('Failed to load from localStorage:', error)
      return null
    }
  },
  
  remove(): void {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
    }
  }
}

export const useQuestionnaireStore = defineStore('questionnaire', () => {
  // 基础状态
  const questionnaire = ref<QuestionnaireMeta | null>(null)
  const questions = ref<QuestionItem[]>([])
  const orderedQuestionIds = ref<string[]>([])
  const answers = ref<AnswerMap>({})
  const sessionId = ref<string>('')
  const identityKey = ref<string>('')
  const remainingSeconds = ref<number | null>(null)
  const startedAt = ref<number | null>(null)

  // 导航状态
  const currentIndex = ref<number>(0)
  const submitting = ref(false)
  const saving = ref(false)

  // 计算属性（优化性能）
  const total = computed(() => orderedQuestionIds.value.length)
  
  const currentQuestion = computed(() => {
    const id = orderedQuestionIds.value[currentIndex.value]
    if (!id) return null
    
    // 使用Map可能会更快，但考虑到数据量不大，这里保持简单
    return questions.value.find(q => q.id === id) || null
  })
  
  const progress = computed<ProgressItem[]>(() =>
    orderedQuestionIds.value.map(id => ({ 
      questionId: id, 
      answered: Boolean(answers.value[id])
    }))
  )
  
  const allAnswered = computed(() => {
    const progressList = progress.value
    return progressList.length > 0 && progressList.every(p => p.answered)
  })

  // 重置状态
  function reset(): void {
    questionnaire.value = null
    questions.value = []
    orderedQuestionIds.value = []
    answers.value = {}
    sessionId.value = ''
    identityKey.value = ''
    remainingSeconds.value = null
    startedAt.value = null
    currentIndex.value = 0
    submitting.value = false
    saving.value = false
  }

  // API 方法
  async function validatePasscode(passcode: string) {
    try {
      const { data, error } = await apiValidate(passcode)
      if (error.value) {
        return { success: false, message: error.value.message }
      }
      
      if (!data.value?.valid || !data.value.questionnaire?.active) {
        return { success: false, message: '问卷未生效或已截止，无法进入下一步。' }
      }
      
      questionnaire.value = data.value.questionnaire
      return { success: true }
    } catch {
      return { success: false, message: '验证失败，请稍后重试' }
    }
  }

  async function startSession(identity: IdentityPayload) {
    try {
      const { data, error } = await apiStart(identity)
      if (error.value) {
        return { success: false, message: error.value.message }
      }
      
      const payload = data.value
      if (!payload) {
        return { success: false, message: '服务异常' }
      }
      
      if (payload.alreadyAnswered) {
        return { success: false, message: '该用户已答题' }
      }

      // 设置会话状态
      sessionId.value = payload.sessionId
      identityKey.value = identity.phone || payload.sessionId
      
      if (payload.remainingSeconds) {
        remainingSeconds.value = payload.remainingSeconds
      }
      
      if (payload.payload) {
        questionnaire.value = payload.payload.meta
        questions.value = payload.payload.questions
      }

      // 生成随机顺序
      orderedQuestionIds.value = shuffleStable(questions.value, identityKey.value).map(q => q.id)
      startedAt.value = Date.now()
      
      return { success: true }
    } catch {
      return { success: false, message: '启动会话失败，请稍后重试' }
    }
  }

  // 导航逻辑
  function getNextIndexByJump(selectedOptionId: string | undefined): number | 'END' {
    const q = currentQuestion.value
    if (!q || !q.jumpRules || !selectedOptionId) {
      return currentIndex.value + 1
    }
    
    const rule = q.jumpRules.find(r => r.optionId === selectedOptionId)
    if (!rule) {
      return currentIndex.value + 1
    }
    
    if (rule.end) {
      return 'END'
    }
    
    if (rule.targetQuestionId) {
      const idx = orderedQuestionIds.value.indexOf(rule.targetQuestionId)
      return idx >= 0 ? idx : currentIndex.value + 1
    }
    
    return currentIndex.value + 1
  }

  function answerCurrent(optionId: string): void {
    const q = currentQuestion.value
    if (!q) return
    
    answers.value[q.id] = optionId
  }

  function goPrev(): void {
    if (currentIndex.value > 0) {
      currentIndex.value -= 1
    }
  }

  function goNext(): void {
    const q = currentQuestion.value
    const selected = q ? answers.value[q.id] : undefined
    const next = getNextIndexByJump(selected)
    
    if (next === 'END') {
      currentIndex.value = total.value - 1
      return
    }
    
    if (next < total.value) {
      currentIndex.value = next
    }
  }

  function goToIndex(index: number): void {
    if (index >= 0 && index < total.value) {
      currentIndex.value = index
    }
  }

  // 本地存储方法（使用优化的存储管理器）
  function saveLocal(): void {
    const data = {
      questionnaire: questionnaire.value,
      orderedQuestionIds: orderedQuestionIds.value,
      answers: answers.value,
      sessionId: sessionId.value,
      remainingSeconds: remainingSeconds.value,
      currentIndex: currentIndex.value,
      startedAt: startedAt.value,
    }
    storageManager.save(data)
  }

  function restoreLocal(): void {
    const data = storageManager.load()
    if (!data) return
    
    try {
      questionnaire.value = (data.questionnaire as QuestionnaireMeta) || null
      orderedQuestionIds.value = (data.orderedQuestionIds as string[]) || []
      answers.value = (data.answers as AnswerMap) || {}
      sessionId.value = (data.sessionId as string) || ''
      remainingSeconds.value = (data.remainingSeconds as number | null) || null
      currentIndex.value = (data.currentIndex as number) || 0
      startedAt.value = (data.startedAt as number | null) || null
    } catch (error) {
      console.warn('Failed to restore local data:', error)
    }
  }

  // 远程保存（带错误处理）
  async function saveRemote(): Promise<void> {
    if (!sessionId.value || saving.value) return
    
    saving.value = true
    try {
      const { error } = await apiSave({
        sessionId: sessionId.value,
        answers: answers.value,
        currentIndex: currentIndex.value,
      })
      
      if (error.value) {
        console.warn('Failed to save remote progress:', error.value.message)
      }
    } catch {
      console.warn('Save remote error')
    } finally {
      saving.value = false
    }
  }

  // 提交答案
  async function submit() {
    if (!sessionId.value || submitting.value) {
      return { success: false, message: '会话无效' }
    }
    
    submitting.value = true
    try {
      const { error } = await apiSubmit({
        sessionId: sessionId.value,
        answers: answers.value,
      })
      
      if (error.value) {
        return { success: false, message: '提交失败，请稍后重试' }
      }
      
      // 提交成功后清理本地数据
      storageManager.remove()
      return { success: true }
    } catch {
      return { success: false, message: '提交失败，请稍后重试' }
    } finally {
      submitting.value = false
    }
  }

  // 返回所有公共方法和状态
  return {
    // 状态
    questionnaire,
    questions,
    orderedQuestionIds,
    answers,
    sessionId,
    identityKey,
    remainingSeconds,
    startedAt,
    currentIndex,
    submitting,
    saving,
    
    // 计算属性
    total,
    currentQuestion,
    progress,
    allAnswered,
    
    // 方法
    reset,
    validatePasscode,
    startSession,
    answerCurrent,
    goPrev,
    goNext,
    goToIndex,
    saveLocal,
    restoreLocal,
    saveRemote,
    submit,
  }
})


