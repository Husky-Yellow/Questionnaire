import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useQuestionnaireStore } from '@/stores/questionnaire'
import { pinia } from '@/stores/pinia'

// 定义路由类型
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: '首页',
      requiresAuth: false,
    },
  },
  {
    path: '/passcode',
    name: 'passcode',
    component: () => import('../views/PasscodeView.vue'),
    meta: { title: '问卷入口', requiresAuth: false },
  },
  {
    path: '/identity',
    name: 'identity',
    component: () => import('../views/IdentityView.vue'),
    meta: { title: '身份校验', requiresAuth: false },
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: () => import('../views/QuizView.vue'),
    meta: { title: '问卷答题', requiresAuth: false },
  },
  {
    path: '/result',
    name: 'result',
    component: () => import('../views/ResultView.vue'),
    meta: { title: '已答完', requiresAuth: false },
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue'),
    meta: {
      title: '关于',
      requiresAuth: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: '页面未找到',
      requiresAuth: false,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - H5 Project`
  }

  // 这里可以添加认证逻辑
  // if (to.meta?.requiresAuth) {
  //   // 检查用户是否已登录
  // }

  // 问卷流程路由守卫
  // 确保与 main.ts 同一个 pinia 实例
  const qn = useQuestionnaireStore(pinia)
  const needSession = ['identity', 'quiz', 'result']
  if (needSession.includes(to.name as string)) {
    // 防止绕过首页
    if (!qn.questionnaire) {
      return next({ name: 'passcode' })
    }
  }
  if (to.name === 'quiz' && !qn.sessionId) {
    return next({ name: 'identity' })
  }

  next()
})

export default router
