import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'
import { mockLog } from './_utils'

const PASSCODES = ['DEMO-2025', 'SURVEY-A', 'SURVEY-B']

const questionnaireMeta = {
  id: 'q_1001',
  title: '员工问卷（演示）',
  logoUrl: '/favicon.ico',
  active: true,
  startAt: new Date(Date.now() - 86400e3).toISOString(),
  endAt: new Date(Date.now() + 86400e3 * 30).toISOString(),
  timeLimitSeconds: 300,
}

const questions = [
  {
    id: 'q1',
    type: 'single',
    title: '您最常使用的设备是？',
    options: [
      { id: 'q1_a', text: '手机' },
      { id: 'q1_b', text: '平板' },
      { id: 'q1_c', text: '电脑' },
      { id: 'q1_d', text: '其他' },
    ],
  },
  {
    id: 'q2',
    type: 'single',
    title: '您对当前系统满意吗？',
    options: [
      { id: 'q2_a', text: '非常满意' },
      { id: 'q2_b', text: '一般' },
      { id: 'q2_c', text: '不满意' },
    ],
    jumpRules: [{ optionId: 'q2_c', end: true }],
  },
  {
    id: 'q3',
    type: 'single',
    title: '您最关注哪方面的体验？',
    options: [
      { id: 'q3_a', text: '性能' },
      { id: 'q3_b', text: '外观' },
      { id: 'q3_c', text: '功能' },
      { id: 'q3_d', text: '稳定性' },
    ],
  },
  {
    id: 'q4',
    type: 'single',
    title: '您使用的频率是？',
    options: [
      { id: 'q4_a', text: '每天' },
      { id: 'q4_b', text: '每周' },
      { id: 'q4_c', text: '偶尔' },
    ],
  },
  {
    id: 'q5',
    type: 'single',
    title: '您是否愿意推荐给他人？',
    options: [
      { id: 'q5_a', text: '愿意' },
      { id: 'q5_b', text: '不一定' },
    ],
  },
]

const sessions = new Map<string, { phone?: string; idCard?: string }>()

export default [
  {
    url: '/questionnaire/passcodes',
    method: 'get',
    response: () => {
      mockLog('GET /questionnaire/passcodes')
      return PASSCODES
    },
  },
  {
    url: '/questionnaire/validate',
    method: 'post',
    response: () => {
      mockLog('POST /questionnaire/validate')
      return { valid: true, questionnaire: questionnaireMeta }
    },
  },
  {
    url: '/questionnaire/start',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      mockLog('POST /questionnaire/start')
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      const phone = typeof body?.phone === 'string' ? (body.phone as string) : undefined
      const idCard = typeof body?.idCard === 'string' ? (body.idCard as string) : undefined
      sessions.set(sessionId, { phone, idCard })
      return {
        sessionId,
        questionnaireId: questionnaireMeta.id,
        remainingSeconds: questionnaireMeta.timeLimitSeconds,
        payload: { meta: questionnaireMeta, questions },
      }
    },
  },
  {
    url: '/questionnaire/save',
    method: 'post',
    response: () => {
      mockLog('POST /questionnaire/save')
      return { savedAt: Mock.mock('@now') }
    },
  },
  {
    url: '/questionnaire/submit',
    method: 'post',
    response: () => {
      mockLog('POST /questionnaire/submit')
      return { success: true }
    },
  },
] as MockMethod[]


