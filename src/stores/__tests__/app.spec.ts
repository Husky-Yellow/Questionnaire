import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '../app'

// Mock DOM APIs
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    onLine: true,
  },
  writable: true,
})

Object.defineProperty(window, 'addEventListener', {
  value: vi.fn(),
  writable: true,
})

// Mock CSS.supports
Object.defineProperty(window, 'CSS', {
  value: {
    supports: vi.fn(() => false), // Return false to skip safe area logic
  },
  writable: true,
})

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: vi.fn(() => ({
    getPropertyValue: vi.fn(() => '0'),
  })),
  writable: true,
})

// Mock document.documentElement
Object.defineProperty(document, 'documentElement', {
  value: {
    classList: {
      toggle: vi.fn(),
    },
  },
  writable: true,
})

describe('App Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const app = useAppStore()
    expect(app.loading).toBe(false)
    expect(app.networkStatus).toBe('online')
    expect(app.theme).toBe('light')
    expect(app.isDark).toBe(false)
    expect(app.isOnline).toBe(true)
  })

  it('should set loading state', () => {
    const app = useAppStore()
    app.setLoading(true)
    expect(app.loading).toBe(true)
  })

  it('should toggle theme', () => {
    const app = useAppStore()
    expect(app.theme).toBe('light')
    app.toggleTheme()
    expect(app.theme).toBe('dark')
    expect(app.isDark).toBe(true)
  })

  it('should set network status', () => {
    const app = useAppStore()
    app.setNetworkStatus('offline')
    expect(app.networkStatus).toBe('offline')
    expect(app.isOnline).toBe(false)
  })

  it('should detect device information', () => {
    const app = useAppStore()
    app.initializeDevice()
    expect(app.isIOS).toBe(true)
    expect(app.isMobile).toBe(true) // The user agent contains 'Mobile' so this should be true
    expect(app.isAndroid).toBe(false)
  })
})
