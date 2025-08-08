// 性能监控工具
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // 标记性能测量开始
  mark(name: string): void {
    if (performance.mark) {
      performance.mark(`${name}-start`)
    }
    this.metrics.set(`${name}-start`, performance.now())
  }

  // 标记性能测量结束并计算耗时
  measure(name: string): number {
    const startTime = this.metrics.get(`${name}-start`)
    if (!startTime) return 0

    const endTime = performance.now()
    const duration = endTime - startTime

    if (performance.mark && performance.measure) {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
    }

    this.metrics.set(name, duration)
    return duration
  }

  // 获取性能指标
  getMetric(name: string): number {
    return this.metrics.get(name) || 0
  }

  // 获取所有指标
  getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics.entries())
  }

  // 清除指标
  clear(): void {
    this.metrics.clear()
    if (performance.clearMarks) {
      performance.clearMarks()
    }
    if (performance.clearMeasures) {
      performance.clearMeasures()
    }
  }

  // 记录核心网络指标
  recordWebVitals(): void {
    if (!('PerformanceObserver' in window)) return

    // FCP (First Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.set('FCP', entry.startTime)
        }
      })
    }).observe({ entryTypes: ['paint'] })

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.metrics.set('LCP', lastEntry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // CLS (Cumulative Layout Shift)
    new PerformanceObserver((list) => {
      let clsValue = 0
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      this.metrics.set('CLS', clsValue)
    }).observe({ entryTypes: ['layout-shift'] })

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        this.metrics.set('FID', entry.processingStart - entry.startTime)
      })
    }).observe({ entryTypes: ['first-input'] })
  }
}

// 便捷的性能监控装饰器
export function measurePerformance(name?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value
    const measureName = name || `${target.constructor.name}.${propertyName}`

    descriptor.value = async function (...args: any[]) {
      const monitor = PerformanceMonitor.getInstance()
      monitor.mark(measureName)
      
      try {
        const result = await method.apply(this, args)
        const duration = monitor.measure(measureName)
        
        if (import.meta.env.DEV) {
          console.log(`[Performance] ${measureName}: ${duration.toFixed(2)}ms`)
        }
        
        return result
      } catch (error) {
        monitor.measure(measureName)
        throw error
      }
    }
  }
}

// 内存使用监控
export function getMemoryUsage(): Record<string, number> {
  if (!('memory' in performance)) {
    return {}
  }

  const memory = (performance as any).memory
  return {
    usedJSMemorySize: memory.usedJSMemorySize,
    totalJSMemorySize: memory.totalJSMemorySize,
    jsMemoryLimit: memory.jsMemoryLimit,
  }
}

// 网络连接监控
export function getNetworkInfo(): Record<string, any> {
  if (!('connection' in navigator)) {
    return {}
  }

  const connection = (navigator as any).connection
  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
  }
}

// 设备信息
export function getDeviceInfo(): Record<string, any> {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory,
  }
}