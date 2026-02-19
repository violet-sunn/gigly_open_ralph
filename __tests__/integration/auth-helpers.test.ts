import { describe, it, expect, vi } from 'vitest'
import { withTestTransaction } from '../helpers/db'
import {
  createAuthenticatedClient,
  createAuthenticatedSpecialist,
  createAuthenticatedAdmin,
  withAuthContext,
  expectUnauthorized,
  getTestSessionToken
} from '../helpers/auth'
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

describe('Auth Helpers - Integration Tests', () => {
  describe('Role-specific helper convenience', () => {
    it('creates CLIENT user with session in one call', async () => {
      await withTestTransaction(async (tx) => {
        const { user, session } = await createAuthenticatedClient(tx, {
          companyName: 'Acme Corp',
          inn: '1234567890'
        })

        // Verify user was created with correct role and profile
        expect(user.role).toBe('CLIENT')
        expect(user.clientProfile?.companyName).toBe('Acme Corp')
        expect(user.clientProfile?.inn).toBe('1234567890')

        // Verify session is valid
        expect(typeof session).toBe('string')
        expect(session.length).toBeGreaterThan(0)
      })
    })

    it('creates SPECIALIST user with session in one call', async () => {
      await withTestTransaction(async (tx) => {
        const { user, session } = await createAuthenticatedSpecialist(tx, {
          techStack: 'React, Node.js, PostgreSQL',
          experienceLevel: 'SENIOR'
        })

        // Verify user was created with correct role and profile
        expect(user.role).toBe('SPECIALIST')
        expect(user.specialistProfile?.techStack).toBe('React, Node.js, PostgreSQL')
        expect(user.specialistProfile?.experienceLevel).toBe('SENIOR')

        // Verify session is valid
        expect(typeof session).toBe('string')
        expect(session.length).toBeGreaterThan(0)
      })
    })

    it('creates ADMIN user with session in one call', async () => {
      await withTestTransaction(async (tx) => {
        const { user, session } = await createAuthenticatedAdmin(tx, {
          email: 'admin@gigly.com'
        })

        // Verify user was created with correct role
        expect(user.role).toBe('ADMIN')
        expect(user.email).toBe('admin@gigly.com')

        // Verify session is valid
        expect(typeof session).toBe('string')
        expect(session.length).toBeGreaterThan(0)
      })
    })
  })

  describe('withAuthContext usage patterns', () => {
    it('provides authenticated context for operations', async () => {
      await withTestTransaction(async (tx) => {
        const { user: client } = await createAuthenticatedClient(tx)

        // Simulate an operation that needs authentication
        const result = await withAuthContext(client, async () => {
          const session = await getSession()

          // Operation can access session data
          expect(session).not.toBeNull()
          expect(session?.userId).toBe(client.id)
          expect(session?.role).toBe('CLIENT')

          return { success: true, userId: session?.userId }
        })

        expect(result.success).toBe(true)
        expect(result.userId).toBe(client.id)
      })
    })

    it('supports multiple users in sequence', async () => {
      await withTestTransaction(async (tx) => {
        const { user: client } = await createAuthenticatedClient(tx)
        const { user: specialist } = await createAuthenticatedSpecialist(tx)

        // First operation as client
        await withAuthContext(client, async () => {
          const session = await getSession()
          expect(session?.role).toBe('CLIENT')
        })

        // Second operation as specialist
        await withAuthContext(specialist, async () => {
          const session = await getSession()
          expect(session?.role).toBe('SPECIALIST')
        })

        // Context is properly cleaned up
        const session = await getSession()
        expect(session).toBeNull()
      })
    })

    it('handles errors gracefully', async () => {
      await withTestTransaction(async (tx) => {
        const { user: client } = await createAuthenticatedClient(tx)

        try {
          await withAuthContext(client, async () => {
            throw new Error('Operation failed')
          })
          fail('Should have thrown error')
        } catch (error: any) {
          expect(error.message).toBe('Operation failed')
        }

        // Context is cleaned up even after error
        const session = await getSession()
        expect(session).toBeNull()
      })
    })
  })

  describe('expectUnauthorized usage patterns', () => {
    it('verifies authorization errors are thrown', async () => {
      // Test that expectUnauthorized passes when authorization fails
      await expectUnauthorized(async () => {
        throw new Error('Unauthorized: Only clients can create gigs')
      })

      // Test passes if no error is thrown by expectUnauthorized
    })

    it('detects when operations incorrectly succeed', async () => {
      // Test that expectUnauthorized fails when operation succeeds
      try {
        await expectUnauthorized(async () => {
          return { success: true }
        })
        fail('Should have thrown error')
      } catch (error: any) {
        expect(error.message).toContain('Expected operation to fail with authorization error')
      }
    })

    it('detects non-authorization errors', async () => {
      // Test that expectUnauthorized fails for non-auth errors
      try {
        await expectUnauthorized(async () => {
          throw new Error('Database connection failed')
        })
        fail('Should have thrown error')
      } catch (error: any) {
        expect(error.message).toContain('Expected authorization error')
        expect(error.message).toContain('Database connection failed')
      }
    })
  })

  describe('Real-world usage examples', () => {
    it('demonstrates clean test setup for CLIENT operations', async () => {
      await withTestTransaction(async (tx) => {
        // Create authenticated client in one line
        const { user: client } = await createAuthenticatedClient(tx, {
          companyName: 'Tech Startup Inc'
        })

        // Perform operation with authenticated context
        await withAuthContext(client, async () => {
          const session = await getSession()

          // Verify client can access their own data
          expect(session?.role).toBe('CLIENT')
          expect(session?.userId).toBe(client.id)

          // In real tests, this would call server actions or business logic
          // that requires CLIENT role
        })
      })
    })

    it('demonstrates clean test setup for SPECIALIST operations', async () => {
      await withTestTransaction(async (tx) => {
        // Create authenticated specialist in one line
        const { user: specialist } = await createAuthenticatedSpecialist(tx, {
          techStack: 'Python, Django, PostgreSQL'
        })

        // Perform operation with authenticated context
        await withAuthContext(specialist, async () => {
          const session = await getSession()

          // Verify specialist can access their own data
          expect(session?.role).toBe('SPECIALIST')
          expect(session?.userId).toBe(specialist.id)

          // In real tests, this would call server actions or business logic
          // that requires SPECIALIST role
        })
      })
    })

    it('demonstrates testing role-based authorization', async () => {
      await withTestTransaction(async (tx) => {
        const { user: client } = await createAuthenticatedClient(tx)
        const { user: admin } = await createAuthenticatedAdmin(tx)

        // Simulate admin-only operation
        const adminOnlyOperation = async () => {
          const session = await getSession()
          if (session?.role !== 'ADMIN') {
            throw new Error('Forbidden: Admin access required')
          }
          return { success: true }
        }

        // Admin can perform operation
        await withAuthContext(admin, async () => {
          const result = await adminOnlyOperation()
          expect(result.success).toBe(true)
        })

        // Client cannot perform operation
        await expectUnauthorized(async () => {
          await withAuthContext(client, async () => {
            await adminOnlyOperation()
          })
        })
      })
    })

    it('demonstrates testing ownership-based authorization', async () => {
      await withTestTransaction(async (tx) => {
        const { user: owner } = await createAuthenticatedClient(tx)
        const { user: otherUser } = await createAuthenticatedClient(tx)

        const resourceOwnerId = owner.id

        // Simulate ownership check
        const ownerOnlyOperation = async () => {
          const session = await getSession()
          if (session?.userId !== resourceOwnerId) {
            throw new Error('Forbidden: You do not own this resource')
          }
          return { success: true }
        }

        // Owner can perform operation
        await withAuthContext(owner, async () => {
          const result = await ownerOnlyOperation()
          expect(result.success).toBe(true)
        })

        // Other user cannot perform operation
        await expectUnauthorized(async () => {
          await withAuthContext(otherUser, async () => {
            await ownerOnlyOperation()
          })
        })
      })
    })
  })
})
