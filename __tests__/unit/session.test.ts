import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSession, getSession, destroySession } from '@/lib/session'
import { jwtVerify } from 'jose'
import { getTestSessionToken, setTestSessionToken } from '../helpers/auth'

// Mock next/headers for cookie management
vi.mock('next/headers', () => ({
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

describe('Session Management Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  it('createSession generates valid JWT with correct payload', async () => {
    const userId = 'test-user-123'
    const email = 'test@example.com'
    const role = 'CLIENT'

    await createSession(userId, email, role)

    // Verify session token was set
    const token = getTestSessionToken()
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')

    // Verify JWT structure and payload
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET)
    const { payload } = await jwtVerify(token!, secret)

    expect(payload.userId).toBe(userId)
    expect(payload.email).toBe(email)
    expect(payload.role).toBe(role)

    // Verify expiration is set (7 days from now)
    expect(payload.exp).toBeDefined()
    const expirationDate = new Date((payload.exp as number) * 1000)
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    // Allow 1 minute tolerance for test execution time
    const timeDiff = Math.abs(expirationDate.getTime() - sevenDaysFromNow.getTime())
    expect(timeDiff).toBeLessThan(60 * 1000)
  })

  it('getSession reads valid session correctly', async () => {
    const userId = 'test-user-456'
    const email = 'user@example.com'
    const role = 'SPECIALIST'

    // Create session
    await createSession(userId, email, role)

    // Read session
    const session = await getSession()

    expect(session).toBeDefined()
    expect(session?.userId).toBe(userId)
    expect(session?.email).toBe(email)
    expect(session?.role).toBe(role)
  })

  it('getSession returns null for invalid token', async () => {
    // Set an invalid token
    setTestSessionToken('invalid-token-xyz')

    const session = await getSession()

    expect(session).toBeNull()
  })

  it('getSession returns null for expired token', async () => {
    // Create an expired JWT (expired 1 day ago)
    const { SignJWT } = await import('jose')
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET)

    const expiredToken = await new SignJWT({
      userId: 'expired-user',
      email: 'expired@example.com',
      role: 'CLIENT'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('-1d') // Expired 1 day ago
      .setIssuedAt()
      .sign(secret)

    setTestSessionToken(expiredToken)

    const session = await getSession()

    expect(session).toBeNull()
  })

  it('destroySession clears cookie', async () => {
    // Create session first
    await createSession('user-789', 'destroy@example.com', 'CLIENT')

    // Verify session exists
    let session = await getSession()
    expect(session).toBeDefined()

    // Destroy session
    await destroySession()

    // Verify session is cleared
    const token = getTestSessionToken()
    expect(token).toBeUndefined()

    // Verify getSession returns null
    session = await getSession()
    expect(session).toBeNull()
  })

  it('createSession with ADMIN role', async () => {
    const userId = 'admin-user-123'
    const email = 'admin@example.com'
    const role = 'ADMIN'

    await createSession(userId, email, role)

    const session = await getSession()

    expect(session).toBeDefined()
    expect(session?.role).toBe('ADMIN')
  })
})
