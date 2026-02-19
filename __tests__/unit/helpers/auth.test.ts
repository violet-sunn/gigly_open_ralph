import { describe, it, expect, vi, beforeEach } from 'vitest'
import { jwtVerify } from 'jose'
import {
  createTestSession,
  withAuthContext,
  makeAuthenticatedRequest,
  expectUnauthorized,
  createAuthenticatedClient,
  createAuthenticatedSpecialist,
  createAuthenticatedAdmin,
  getTestSessionToken,
  setTestSessionToken
} from '../../helpers/auth'
import { withTestTransaction } from '../../helpers/db'
import { getSession } from '@/lib/session'

// Mock next/headers to use our shared store
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

describe('Auth Helpers', () => {
  beforeEach(() => {
    // Clear session store before each test
    setTestSessionToken(undefined)
  })

  describe('createTestSession', () => {
    it('creates a valid JWT token for a user', async () => {
      const user = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'CLIENT'
      }

      const token = await createTestSession(user)

      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })

    it('token contains correct user data', async () => {
      const user = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'CLIENT'
      }

      const token = await createTestSession(user)
      const secret = new TextEncoder().encode(process.env.SESSION_SECRET)
      const { payload } = await jwtVerify(token, secret)

      expect(payload.userId).toBe(user.id)
      expect(payload.email).toBe(user.email)
      expect(payload.role).toBe(user.role)
    })

    it('creates sessions for all three roles', async () => {
      const roles = ['CLIENT', 'SPECIALIST', 'ADMIN'] as const

      for (const role of roles) {
        const user = {
          id: `test-${role.toLowerCase()}-id`,
          email: `${role.toLowerCase()}@example.com`,
          role
        }

        const token = await createTestSession(user)
        const secret = new TextEncoder().encode(process.env.SESSION_SECRET)
        const { payload } = await jwtVerify(token, secret)

        expect(payload.role).toBe(role)
      }
    })

    it('token has 7-day expiration', async () => {
      const user = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'CLIENT'
      }

      const token = await createTestSession(user)
      const secret = new TextEncoder().encode(process.env.SESSION_SECRET)
      const { payload } = await jwtVerify(token, secret)

      const now = Math.floor(Date.now() / 1000)
      const sevenDays = 7 * 24 * 60 * 60
      const exp = payload.exp as number

      // Check expiration is approximately 7 days from now (within 10 seconds tolerance)
      expect(exp).toBeGreaterThan(now + sevenDays - 10)
      expect(exp).toBeLessThan(now + sevenDays + 10)
    })
  })

  describe('withAuthContext', () => {
    it('provides authenticated context to callback', async () => {
      const user = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'CLIENT'
      }

      const result = await withAuthContext(user, async () => {
        const session = await getSession()
        return session
      })

      expect(result).not.toBeNull()
      expect(result?.userId).toBe(user.id)
      expect(result?.email).toBe(user.email)
      expect(result?.role).toBe(user.role)
    })

    it('cleans up context after callback completes', async () => {
      const user = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'CLIENT'
      }

      await withAuthContext(user, async () => {
        // Do nothing
      })

      // Context should be cleaned up
      const session = await getSession()
      expect(session).toBeNull()
    })

    it('supports nested contexts', async () => {
      const userA = {
        id: 'user-a-id',
        email: 'usera@example.com',
        role: 'CLIENT'
      }

      const userB = {
        id: 'user-b-id',
        email: 'userb@example.com',
        role: 'SPECIALIST'
      }

      await withAuthContext(userA, async () => {
        const outerSession = await getSession()
        expect(outerSession?.userId).toBe(userA.id)

        await withAuthContext(userB, async () => {
          const innerSession = await getSession()
          expect(innerSession?.userId).toBe(userB.id)
        })

        // After inner context, should see outer user again
        const outerSessionAgain = await getSession()
        expect(outerSessionAgain?.userId).toBe(userA.id)
      })
    })

    it('cleans up context even if callback throws', async () => {
      const user = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'CLIENT'
      }

      try {
        await withAuthContext(user, async () => {
          throw new Error('Test error')
        })
      } catch (error: any) {
        expect(error.message).toBe('Test error')
      }

      // Context should still be cleaned up
      const session = await getSession()
      expect(session).toBeNull()
    })
  })

  describe('makeAuthenticatedRequest', () => {
    it('calls action with authenticated context', async () => {
      const user = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'CLIENT'
      }

      const mockAction = vi.fn(async () => {
        const session = await getSession()
        return session?.userId
      })

      const result = await makeAuthenticatedRequest(user, mockAction)

      expect(mockAction).toHaveBeenCalled()
      expect(result).toBe(user.id)
    })

    it('passes arguments to action', async () => {
      const user = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'CLIENT'
      }

      const mockAction = vi.fn(async (arg1: string, arg2: number) => {
        return `${arg1}-${arg2}`
      })

      const result = await makeAuthenticatedRequest(user, mockAction, 'test', 42)

      expect(mockAction).toHaveBeenCalledWith('test', 42)
      expect(result).toBe('test-42')
    })

    it('propagates errors from action', async () => {
      const user = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'CLIENT'
      }

      const mockAction = vi.fn(async () => {
        throw new Error('Action error')
      })

      await expect(makeAuthenticatedRequest(user, mockAction)).rejects.toThrow('Action error')
    })
  })

  describe('expectUnauthorized', () => {
    it('passes when callback throws authorization error', async () => {
      await expectUnauthorized(async () => {
        throw new Error('Unauthorized access')
      })

      // Test passes if no error is thrown
    })

    it('passes for various authorization error messages', async () => {
      const authErrors = [
        'Unauthorized',
        'Forbidden',
        'Not allowed',
        'Permission denied',
        'Not authorized',
        'Access denied'
      ]

      for (const message of authErrors) {
        await expectUnauthorized(async () => {
          throw new Error(message)
        })
      }
    })

    it('fails when callback succeeds', async () => {
      await expect(
        expectUnauthorized(async () => {
          return 'success'
        })
      ).rejects.toThrow('Expected operation to fail with authorization error, but it succeeded')
    })

    it('fails when callback throws non-authorization error', async () => {
      await expect(
        expectUnauthorized(async () => {
          throw new Error('Database error')
        })
      ).rejects.toThrow('Expected authorization error, but got: Database error')
    })
  })

  describe('Role-specific helpers', () => {
    describe('createAuthenticatedClient', () => {
      it('creates CLIENT user with session', async () => {
        await withTestTransaction(async (tx) => {
          const { user, session } = await createAuthenticatedClient(tx)

          expect(user.role).toBe('CLIENT')
          expect(user.clientProfile).toBeDefined()
          expect(typeof session).toBe('string')

          // Verify session contains correct user data
          const secret = new TextEncoder().encode(process.env.SESSION_SECRET)
          const { payload } = await jwtVerify(session, secret)
          expect(payload.userId).toBe(user.id)
          expect(payload.role).toBe('CLIENT')
        })
      })

      it('applies overrides', async () => {
        await withTestTransaction(async (tx) => {
          const { user } = await createAuthenticatedClient(tx, {
            email: 'custom@example.com',
            companyName: 'Custom Company'
          })

          expect(user.email).toBe('custom@example.com')
          expect(user.clientProfile?.companyName).toBe('Custom Company')
        })
      })
    })

    describe('createAuthenticatedSpecialist', () => {
      it('creates SPECIALIST user with session', async () => {
        await withTestTransaction(async (tx) => {
          const { user, session } = await createAuthenticatedSpecialist(tx)

          expect(user.role).toBe('SPECIALIST')
          expect(user.specialistProfile).toBeDefined()
          expect(typeof session).toBe('string')

          // Verify session contains correct user data
          const secret = new TextEncoder().encode(process.env.SESSION_SECRET)
          const { payload } = await jwtVerify(session, secret)
          expect(payload.userId).toBe(user.id)
          expect(payload.role).toBe('SPECIALIST')
        })
      })

      it('applies overrides', async () => {
        await withTestTransaction(async (tx) => {
          const { user } = await createAuthenticatedSpecialist(tx, {
            email: 'specialist@example.com',
            techStack: 'Python, Django'
          })

          expect(user.email).toBe('specialist@example.com')
          expect(user.specialistProfile?.techStack).toBe('Python, Django')
        })
      })
    })

    describe('createAuthenticatedAdmin', () => {
      it('creates ADMIN user with session', async () => {
        await withTestTransaction(async (tx) => {
          const { user, session } = await createAuthenticatedAdmin(tx)

          expect(user.role).toBe('ADMIN')
          expect(typeof session).toBe('string')

          // Verify session contains correct user data
          const secret = new TextEncoder().encode(process.env.SESSION_SECRET)
          const { payload } = await jwtVerify(session, secret)
          expect(payload.userId).toBe(user.id)
          expect(payload.role).toBe('ADMIN')
        })
      })

      it('applies overrides', async () => {
        await withTestTransaction(async (tx) => {
          const { user } = await createAuthenticatedAdmin(tx, {
            email: 'admin@example.com'
          })

          expect(user.email).toBe('admin@example.com')
        })
      })
    })
  })
})
