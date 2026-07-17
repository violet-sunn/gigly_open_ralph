import { describe, it, expect } from 'vitest'
import { validatePassword } from '@/lib/password'

const CHARSET_ERROR = 'Пароль может содержать только латинские буквы, цифры и спецсимволы — без пробелов.'

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

    it('accepts the full printable-ASCII punctuation range, including ` and ~', () => {
      const result = validatePassword('Secure`Pass~123')
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
      expect(result.error).toBe(CHARSET_ERROR)
    })

    it('checks character whitelist before other validations', () => {
      const result = validatePassword('Пароль') // Cyrillic, also too short and missing number
      expect(result.valid).toBe(false)
      expect(result.error).toBe(CHARSET_ERROR)
    })

    // Whitespace is rejected wholesale. The regression these guard: the class used to be `\s`, which matches far more
    // than the space bar — including non-ASCII blanks that are invisible on screen and break the 1-char-per-byte
    // assumption the 72 limit rests on.
    it.each([
      ['a plain space', 'My Secure Pass 123'],
      ['a leading space (classic copy-paste artefact)', ' SecurePass123'],
      ['a trailing space', 'SecurePass123 '],
      ['a TAB', 'SecurePass123\t'],
      ['a newline', 'SecurePass123\n'],
      ['a carriage return', 'SecurePass123\r'],
      ['U+00A0 NON-BREAKING SPACE (non-ASCII)', 'SecurePass123 '],
      ['U+3000 IDEOGRAPHIC SPACE (non-ASCII)', 'SecurePass123　'],
      ['U+FEFF ZERO-WIDTH NBSP (invisible!)', 'SecurePass123﻿'],
    ])('rejects a password containing %s', (_label, password) => {
      const result = validatePassword(password)
      expect(result.valid).toBe(false)
      expect(result.error).toBe(CHARSET_ERROR)
    })

    it('rejects emoji', () => {
      const result = validatePassword('SecurePass123\u{1f600}')
      expect(result.valid).toBe(false)
      expect(result.error).toBe(CHARSET_ERROR)
    })

    // The whitelist is what lets the 72 check count CHARACTERS while bcrypt truncates at 72 BYTES. Without ASCII-only
    // this password is 72 chars but 210 bytes — silently truncated by bcrypt.
    it('rejects the 72-char / 210-byte password that the old `\\s` class let through', () => {
      const password = 'Aa1' + '　'.repeat(69) // 72 chars, 210 bytes
      expect(password.length).toBe(72)
      expect(Buffer.byteLength(password, 'utf8')).toBe(210)

      const result = validatePassword(password)
      expect(result.valid).toBe(false)
      expect(result.error).toBe(CHARSET_ERROR)
    })

    it('a password at the 72-char limit is also at the 72-byte bcrypt limit', () => {
      const password = 'A' + 'a'.repeat(70) + '1'
      expect(validatePassword(password).valid).toBe(true)
      expect(Buffer.byteLength(password, 'utf8')).toBe(72) // never truncated by bcrypt
    })

    it('rejects password that is too long (> 72 chars)', () => {
      const password = 'A' + 'a'.repeat(71) + '1' // 73 chars total
      const result = validatePassword(password)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Пароль не должен превышать 72 символа.')
    })

    it('rejects password that is too short', () => {
      const result = validatePassword('Abc1')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Пароль должен быть не короче 8 символов.')
    })

    it('rejects password missing uppercase letter', () => {
      const result = validatePassword('lowercase123')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Пароль должен содержать хотя бы одну заглавную букву.')
    })

    it('rejects password missing lowercase letter', () => {
      const result = validatePassword('UPPERCASE123')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Пароль должен содержать хотя бы одну строчную букву.')
    })

    it('rejects password missing number', () => {
      const result = validatePassword('NoNumbers')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Пароль должен содержать хотя бы одну цифру.')
    })

    it('returns first error for multiple violations', () => {
      const result = validatePassword('abc')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Пароль должен быть не короче 8 символов.')
    })
  })

  describe('Edge cases', () => {
    it('rejects empty string', () => {
      const result = validatePassword('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Пароль должен быть не короче 8 символов.')
    })
  })
})
