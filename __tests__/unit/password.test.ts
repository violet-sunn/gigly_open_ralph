import { describe, it, expect } from 'vitest'
import { validatePassword } from '@/lib/password'

describe('Password Validation', () => {
  describe('Valid passwords', () => {
    it('accepts password with all requirements', () => {
      const result = validatePassword('SecurePass123')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('accepts password with special characters', () => {
      const result = validatePassword('Secure@Pass123!')
      expect(result.valid).toBe(true)
    })

    it('accepts password with spaces', () => {
      const result = validatePassword('My Secure Pass 123')
      expect(result.valid).toBe(true)
    })

    it('accepts exactly 8 characters with all requirements', () => {
      const result = validatePassword('Abcd1234')
      expect(result.valid).toBe(true)
    })

    it('accepts exactly 72 characters with all requirements', () => {
      const password = 'A' + 'a'.repeat(70) + '1' // 72 chars total
      const result = validatePassword(password)
      expect(result.valid).toBe(true)
    })
  })

  describe('Invalid passwords', () => {
    it('rejects password with invalid characters (Cyrillic)', () => {
      const result = validatePassword('Пароль123')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password can only contain Latin letters, numbers, and special characters.')
    })

    it('checks character whitelist before other validations', () => {
      const result = validatePassword('Пароль') // Cyrillic, also too short and missing number
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password can only contain Latin letters, numbers, and special characters.')
    })

    it('rejects password that is too long (> 72 chars)', () => {
      const password = 'A' + 'a'.repeat(71) + '1' // 73 chars total
      const result = validatePassword(password)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must not exceed 72 characters.')
    })

    it('rejects password that is too short', () => {
      const result = validatePassword('Abc1')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must be at least 8 characters long.')
    })

    it('rejects password missing uppercase letter', () => {
      const result = validatePassword('lowercase123')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must contain at least one uppercase letter.')
    })

    it('rejects password missing lowercase letter', () => {
      const result = validatePassword('UPPERCASE123')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must contain at least one lowercase letter.')
    })

    it('rejects password missing number', () => {
      const result = validatePassword('NoNumbers')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must contain at least one number.')
    })

    it('returns first error for multiple violations', () => {
      const result = validatePassword('abc')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must be at least 8 characters long.')
    })
  })

  describe('Edge cases', () => {
    it('rejects empty string', () => {
      const result = validatePassword('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must be at least 8 characters long.')
    })
  })
})
