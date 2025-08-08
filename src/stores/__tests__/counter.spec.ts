import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '../counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default values', () => {
    const counter = useCounterStore()
    expect(counter.count).toBe(0)
    expect(counter.doubleCount).toBe(0)
  })

  it('should increment count', () => {
    const counter = useCounterStore()
    counter.increment()
    expect(counter.count).toBe(1)
    expect(counter.doubleCount).toBe(2)
  })

  it('should decrement count', () => {
    const counter = useCounterStore()
    counter.increment()
    counter.decrement()
    expect(counter.count).toBe(0)
    expect(counter.doubleCount).toBe(0)
  })

  it('should reset count', () => {
    const counter = useCounterStore()
    counter.increment()
    counter.increment()
    counter.reset()
    expect(counter.count).toBe(0)
    expect(counter.doubleCount).toBe(0)
  })
})
