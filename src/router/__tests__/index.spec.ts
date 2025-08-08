import { describe, it, expect, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import router from '../index'

describe('Router', () => {
  beforeEach(() => {
    // 重置路由状态
    router.push('/')
  })

  it('should navigate to home route', async () => {
    await router.push('/')
    expect(router.currentRoute.value.name).toBe('home')
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('should navigate to about route', async () => {
    await router.push('/about')
    expect(router.currentRoute.value.name).toBe('about')
    expect(router.currentRoute.value.path).toBe('/about')
  })

  it('should handle 404 routes', async () => {
    await router.push('/non-existent-route')
    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it('should have correct meta information', async () => {
    await router.push('/')
    expect(router.currentRoute.value.meta?.title).toBe('首页')
    expect(router.currentRoute.value.meta?.requiresAuth).toBe(false)
  })
})
