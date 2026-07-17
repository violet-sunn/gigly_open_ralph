import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import bcrypt from 'bcryptjs'
import { getTestSessionToken, setTestSessionToken } from '../helpers/auth'

// Mock @/lib/prisma to use test database (lazy getter to avoid initialization issues)
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  }
}))

// Mock next/headers for session cookie management
vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'x-forwarded-for') return '127.0.0.1'
      if (name === 'x-real-ip') return '127.0.0.1'
      return null
    }
  })),
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

// Mock next/navigation redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  })
}))

// Import after mocks are set up
import { registerUser } from '@/app/actions/auth'

describe('User Registration Tests', () => {
  const testEmails: string[] = []

  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(async () => {
    // Clean up test users
    const prisma = getTestPrismaClient()
    for (const email of testEmails) {
      try {
        await prisma.user.delete({ where: { email } })
      } catch (error) {
        // User might not exist, ignore
      }
    }
    testEmails.length = 0
  })

  it('registers CLIENT user successfully', async () => {
    const email = `client-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'TestPass123!')
    formData.append('role', 'CLIENT')

    // Two-phase onboarding: step-2 registration creates the account + session and returns { ok: true } (no redirect);
    // profile setup happens later at step 3 via updateProfile.
    const result = await registerUser(null, formData)
    expect(result).toEqual({ ok: true })

    // Verify user was created in database
    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({
      where: { email }
    })

    expect(user).toBeDefined()
    expect(user?.role).toBe('CLIENT')
    expect(user?.password).toMatch(/^\$2[ab]\$/)
    // No profile is created by registerUser — that's step-3's updateProfile.
    const clientProfile = await prisma.clientProfile.findUnique({ where: { userId: user!.id } })
    expect(clientProfile).toBeNull()

    // Verify password was hashed correctly
    const passwordValid = await bcrypt.compare('TestPass123!', user!.password)
    expect(passwordValid).toBe(true)
  })

  it('registers SPECIALIST user successfully', async () => {
    const email = `specialist-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'TestPass123!')
    formData.append('role', 'SPECIALIST')

    // Step-2 registration returns { ok: true } (account + session created, no redirect).
    const result = await registerUser(null, formData)
    expect(result).toEqual({ ok: true })

    // Verify user was created in database
    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({
      where: { email }
    })

    expect(user).toBeDefined()
    expect(user?.role).toBe('SPECIALIST')

    // Verify password was hashed correctly
    const passwordValid = await bcrypt.compare('TestPass123!', user!.password)
    expect(passwordValid).toBe(true)
  })

  it('rejects ADMIN role (mass assignment protection)', async () => {
    const email = `admin-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'TestPass123!')
    formData.append('role', 'ADMIN')

    const result = await registerUser(null, formData)

    // Should return error
    expect(result).toEqual({ error: 'Выберите, кто вы — компания или специалист.' })

    // Verify no user was created
    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({
      where: { email }
    })
    expect(user).toBeNull()
  })

  it('rejects invalid role', async () => {
    const email = `hacker-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'TestPass123!')
    formData.append('role', 'HACKER')

    const result = await registerUser(null, formData)

    // Should return error
    expect(result).toEqual({ error: 'Выберите, кто вы — компания или специалист.' })

    // Verify no user was created
    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({
      where: { email }
    })
    expect(user).toBeNull()
  })

  it('prevents duplicate email registration', async () => {
    const email = `duplicate-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    // Create first user
    const formData1 = new FormData()
    formData1.append('email', email)
    formData1.append('password', 'TestPass123!')
    formData1.append('role', 'CLIENT')

    try {
      await registerUser(null, formData1)
    } catch (error: any) {
      // Ignore redirect
    }

    // Try to create second user with same email
    const formData2 = new FormData()
    formData2.append('email', email)
    formData2.append('password', 'DifferentPass456!')
    formData2.append('role', 'SPECIALIST')

    const result = await registerUser(null, formData2)

    // Should return error
    expect(result).toEqual({ error: 'Аккаунт с таким email уже существует. Попробуйте войти.' })

    // Verify only one user exists
    const prisma = getTestPrismaClient()
    const users = await prisma.user.findMany({
      where: { email }
    })
    expect(users).toHaveLength(1)
    expect(users[0].role).toBe('CLIENT') // First user's role
  })

  it('ignores additional privileged fields in payload', async () => {
    const email = `test-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'TestPass123!')
    formData.append('role', 'CLIENT')
    // Attempt to inject privileged fields
    formData.append('suspended', 'false')
    formData.append('isAdmin', 'true')

    try {
      await registerUser(null, formData)
    } catch (error: any) {
      // Ignore redirect
    }

    // Verify user was created with default values (not injected values)
    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({
      where: { email }
    })

    expect(user).toBeDefined()
    expect(user?.role).toBe('CLIENT') // Not ADMIN
    expect(user?.suspended).toBe(false) // Default value, not from payload
  })
})

describe('Password Strength Requirements', () => {
  const testEmails: string[] = []

  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(async () => {
    const prisma = getTestPrismaClient()
    for (const email of testEmails) {
      try {
        await prisma.user.delete({ where: { email } })
      } catch (error) {
        // User might not exist, ignore
      }
    }
    testEmails.length = 0
  })

  it('allows registration with strong password', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'SecurePass123')
    formData.append('role', 'CLIENT')

    const result = await registerUser(null, formData)
    expect(result).toEqual({ ok: true })

    // Verify user was created
    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeDefined()
  })

  it('rejects registration with invalid characters (Cyrillic)', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'Пароль123') // Cyrillic characters
    formData.append('role', 'CLIENT')

    const result = await registerUser(null, formData)

    expect(result).toEqual({ error: 'Пароль может содержать только латинские буквы, цифры и спецсимволы — без пробелов.' })

    // Verify no user was created
    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })

  // The whitelist is enforced server-side, before hashing — so a password carrying an invisible U+FEFF never reaches
  // bcrypt and never creates an account the user would be unable to log back into.
  it('rejects registration with an invisible zero-width space in the password', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'SecurePass123﻿') // looks identical to a valid password on screen
    formData.append('role', 'CLIENT')

    const result = await registerUser(null, formData)

    expect(result).toEqual({ error: 'Пароль может содержать только латинские буквы, цифры и спецсимволы — без пробелов.' })

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })

  it('rejects registration with too-short password', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'Abc1')
    formData.append('role', 'CLIENT')

    const result = await registerUser(null, formData)

    expect(result).toEqual({ error: 'Пароль должен быть не короче 8 символов.' })

    // Verify no user was created
    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })

  it('rejects registration with too-long password', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'A' + 'a'.repeat(71) + '1') // 73 chars
    formData.append('role', 'CLIENT')

    const result = await registerUser(null, formData)

    expect(result).toEqual({ error: 'Пароль не должен превышать 72 символа.' })

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })

  it('rejects registration with missing uppercase', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'lowercase123')
    formData.append('role', 'CLIENT')

    const result = await registerUser(null, formData)

    expect(result).toEqual({ error: 'Пароль должен содержать хотя бы одну заглавную букву.' })

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })

  it('rejects registration with missing lowercase', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'UPPERCASE123')
    formData.append('role', 'CLIENT')

    const result = await registerUser(null, formData)

    expect(result).toEqual({ error: 'Пароль должен содержать хотя бы одну строчную букву.' })

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })

  it('rejects registration with missing number', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'NoNumbers')
    formData.append('role', 'CLIENT')

    const result = await registerUser(null, formData)

    expect(result).toEqual({ error: 'Пароль должен содержать хотя бы одну цифру.' })

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })
})
