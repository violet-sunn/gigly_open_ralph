import { describe, it, expect } from 'vitest'
import { getRateLimitError } from '@/lib/ratelimit'

describe('Rate Limiting Utility', () => {
  describe('getRateLimitError', () => {
    it('formats error message with minutes when > 60 seconds', () => {
      const reset = Date.now() + 120000 // 2 minutes from now
      const error = getRateLimitError(reset, 'login attempts')
      expect(error).toContain('2 minutes')
      expect(error).toContain('login attempts')
      expect(error).toContain('Too many')
    })

    it('formats error message with seconds when < 60 seconds', () => {
      const reset = Date.now() + 30000 // 30 seconds from now
      const error = getRateLimitError(reset, 'messages')
      expect(error).toContain('30 seconds')
      expect(error).toContain('messages')
      expect(error).toContain('Too many')
    })

    it('includes action name in error message', () => {
      const reset = Date.now() + 60000
      const error = getRateLimitError(reset, 'registration attempts')
      expect(error).toContain('registration attempts')
    })

    it('formats exactly 60 seconds as minutes', () => {
      const reset = Date.now() + 60000 // exactly 60 seconds
      const error = getRateLimitError(reset, 'applications')
      expect(error).toContain('1 minutes')
      expect(error).toContain('applications')
    })

    it('formats 1 second correctly', () => {
      const reset = Date.now() + 1000 // 1 second
      const error = getRateLimitError(reset, 'login attempts')
      expect(error).toContain('1 seconds')
      expect(error).toContain('login attempts')
    })

    it('formats large time values correctly', () => {
      const reset = Date.now() + 600000 // 10 minutes
      const error = getRateLimitError(reset, 'messages')
      expect(error).toContain('10 minutes')
      expect(error).toContain('messages')
    })
  })
})
