import { vi } from 'vitest'
import { getTestSessionToken } from './auth'

/**
 * Mock setup for next/headers
 * This must be called at the top of test files that need authenticated context
 *
 * Usage:
 * import { setupAuthMocks } from '../helpers/auth-mocks'
 * setupAuthMocks()
 */
export function setupAuthMocks() {
  vi.mock('next/headers', () => ({
    cookies: vi.fn(() => ({
      get: (name: string) => {
        if (name === 'session') {
          const token = getTestSessionToken()
          return token ? { value: token } : undefined
        }
        return undefined
      },
      set: vi.fn(),
      delete: vi.fn()
    }))
  }))
}
