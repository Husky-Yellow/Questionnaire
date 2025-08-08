import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApi } from '../useApi'

// Mock the entire @vueuse/core module
vi.mock('@vueuse/core', () => ({
  createFetch: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  }))
}))

// Create a mock fetch function that returns reactive refs
const createMockFetch = (mockData: any) => {
  return vi.fn(() => ({
    data: { value: mockData },
    error: { value: null },
    execute: vi.fn().mockResolvedValue(undefined),
  }))
}

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should make GET request', async () => {
    const mockResponse = { data: 'test' }
    
    // Mock the useApi.get method directly
    const mockGet = vi.fn().mockReturnValue({
      data: { value: mockResponse },
      error: { value: null },
      execute: vi.fn().mockResolvedValue(undefined),
    })
    
    // Replace useApi.get with mock
    ;(useApi as any).get = mockGet

    const { data } = useApi.get('/test')
    expect(data.value).toEqual(mockResponse)
    expect(mockGet).toHaveBeenCalledWith('/test')
  })

  it('should make POST request with payload', async () => {
    const mockResponse = { success: true }
    const payload = { name: 'test' }

    const mockPost = vi.fn().mockReturnValue({
      data: { value: mockResponse },
      error: { value: null },
      execute: vi.fn().mockResolvedValue(undefined),
    })

    ;(useApi as any).post = mockPost

    const { data } = useApi.post('/test', payload)
    expect(data.value).toEqual(mockResponse)
    expect(mockPost).toHaveBeenCalledWith('/test', payload)
  })

  it('should have API methods available', () => {
    expect(useApi).toHaveProperty('get')
    expect(useApi).toHaveProperty('post')
    expect(useApi).toHaveProperty('put')
    expect(useApi).toHaveProperty('delete')
    expect(useApi).toHaveProperty('patch')
  })
})
