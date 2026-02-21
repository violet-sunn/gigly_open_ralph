import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser } from '../helpers/seed'
import bcrypt from 'bcryptjs'
import { getTestSessionToken, setTestSessionToken } from '../helpers/auth'

// Mock @/lib/prisma to use test database (lazy getter)
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
    set: vi.fn((name: string, value: string) => {
      if (name === 'session') {
        setTestSessionToken(value)
      }
    }),
    delete: vi.fn((name: string) => {
      if (name === 'session') {
        setTestSessionToken(undefined)
      }
    })
  }))
}))

// Mock next/navigation redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  })
}))

// Import after mocks are set up
import { loginUser } from '@/app/actions/auth'

describe('Login and Session Tests', () => {
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

  it('login with correct credentials creates session', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)
    const password = 'TestPass123!'

    // Create test user
    const prisma = getTestPrismaClient()
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    // Attempt login
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    // Expect redirect on success
    try {
      await loginUser(null, formData)
      throw new Error('Expected redirect but got none')
    } catch (error: any) {
      expect(error.message).toContain('NEXT_REDIRECT:/dashboard')
    }

    // Verify session was created (token should be set)
    const sessionToken = getTestSessionToken()
    expect(sessionToken).toBeDefined()
  })

  it('login with incorrect password fails', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)
    const correctPassword = 'TestPass123!'
    const wrongPassword = 'WrongPass456!'

    // Create test user
    const prisma = getTestPrismaClient()
    const hashedPassword = await bcrypt.hash(correctPassword, 10)
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    // Attempt login with wrong password
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', wrongPassword)

    const result = await loginUser(null, formData)

    // Should return error
    expect(result).toEqual({ error: 'Invalid email or password.' })

    // Verify no session was created
    const sessionToken = getTestSessionToken()
    expect(sessionToken).toBeUndefined()
  })

  it('login with non-existent email fails', async () => {
    const email = `ghost-${Date.now()}-${Math.random()}@example.com`

    // Attempt login with non-existent email
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'AnyPassword123!')

    const result = await loginUser(null, formData)

    // Should return error (same message as wrong password - don't reveal if email exists)
    expect(result).toEqual({ error: 'Invalid email or password.' })

    // Verify no session was created
    const sessionToken = getTestSessionToken()
    expect(sessionToken).toBeUndefined()
  })

  it('suspended user cannot login', async () => {
    const email = `suspended-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)
    const password = 'TestPass123!'

    // Create suspended test user
    const prisma = getTestPrismaClient()
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'CLIENT',
        suspended: true
      }
    })

    // Attempt login with correct credentials
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    const result = await loginUser(null, formData)

    // Should return suspended error
    expect(result).toEqual({ error: 'Your account has been suspended. Please contact support.' })

    // Verify no session was created
    const sessionToken = getTestSessionToken()
    expect(sessionToken).toBeUndefined()
  })

  it('allows existing users with weak passwords to login', async () => {
    const email = `olduser-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    // Create user with weak password directly in database (simulating old user)
    const prisma = getTestPrismaClient()
    const hashedPassword = await bcrypt.hash('weak', 10)
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    // Attempt login with weak password
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'weak')

    try {
      await loginUser(null, formData)
      throw new Error('Expected redirect but got none')
    } catch (error: any) {
      expect(error.message).toContain('NEXT_REDIRECT:/dashboard')
    }

    // Verify session was created
    const sessionToken = getTestSessionToken()
    expect(sessionToken).toBeDefined()
  })
})
