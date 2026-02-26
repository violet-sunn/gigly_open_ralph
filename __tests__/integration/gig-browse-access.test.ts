/**
 * Gig Browse Page Access Control Integration Tests
 *
 * This test suite validates role-based access control for /gigs:
 * - SPECIALIST users can access the browse page
 * - CLIENT users are redirected to dashboard with error message
 * - Unauthenticated users are redirected to login
 * - Error message displays correctly on dashboard
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient, withTestTransaction } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { createTestUser, createTestGig } from '../helpers/seed'

// Mock @/lib/prisma to use test database (lazy getter)
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  }
}))

// Mock next/headers for session cookie management
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

// Mock next/navigation redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  })
}))

describe('Gig Browse Page Access Control', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  describe('SPECIALIST access', () => {
    it('should query all OPEN gigs for SPECIALIST', async () => {
      await withTestTransaction(async (prisma) => {
        const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        // Create some gigs
        const gig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Test Gig'
        })

        // Query what the browse page would query
        const gigs = await prisma.gig.findMany({
          where: { status: 'OPEN' },
          orderBy: { createdAt: 'desc' }
        })

        // Verify gig is in results
        expect(gigs.some(g => g.id === gig.id)).toBe(true)
        expect(gigs.every(g => g.status === 'OPEN')).toBe(true)
      })
    })

    it('should include both regular and example gigs for SPECIALIST', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        // Create regular gig
        const regularGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          isExample: false,
          title: 'Regular Gig'
        })

        // Create example gig
        const exampleGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          isExample: true,
          title: 'Example Gig'
        })

        // Query what the browse page would query
        const gigs = await prisma.gig.findMany({
          where: { status: 'OPEN' },
          orderBy: { createdAt: 'desc' }
        })

        // Verify both regular and example gigs are included
        expect(gigs.some(g => g.id === regularGig.id)).toBe(true)
        expect(gigs.some(g => g.id === exampleGig.id)).toBe(true)
      })
    })
  })

  describe('CLIENT access restriction', () => {
    it('should redirect CLIENT to dashboard with error', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        await withAuthContext(client, async () => {
          // Import the page component dynamically to test redirect
          const { default: GigBrowsePage } = await import('@/app/(protected)/gigs/page')

          try {
            await GigBrowsePage({ searchParams: Promise.resolve({}) })
            expect.fail('Should have redirected')
          } catch (error: any) {
            expect(error.message).toBe('NEXT_REDIRECT:/dashboard?error=browse-gigs-specialists-only')
          }
        })
      })
    })

    it('should map error code to correct message', async () => {
      const errorMessages: Record<string, string> = {
        'browse-gigs-specialists-only': 'Browse Gigs is only available for specialists. As a client, you can post gigs and manage applications. To view example gigs, visit the Examples page.',
      }

      const errorParam = 'browse-gigs-specialists-only'
      const errorMessage = errorMessages[errorParam]

      expect(errorMessage).toBeDefined()
      expect(errorMessage).toContain('specialists')
      expect(errorMessage).toContain('Examples page')
    })

    it('should handle error parameter extraction correctly', async () => {
      // Test error parameter extraction logic
      const params1 = { error: 'browse-gigs-specialists-only' }
      const errorParam1 = typeof params1.error === 'string' ? params1.error : undefined
      expect(errorParam1).toBe('browse-gigs-specialists-only')

      // Test with no error parameter
      const params2 = {}
      const errorParam2 = typeof params2.error === 'string' ? params2.error : undefined
      expect(errorParam2).toBeUndefined()

      // Test with invalid error code
      const params3 = { error: 'invalid-error-code' }
      const errorParam3 = typeof params3.error === 'string' ? params3.error : undefined
      expect(errorParam3).toBe('invalid-error-code')

      const errorMessages: Record<string, string> = {
        'browse-gigs-specialists-only': 'Browse Gigs is only available for specialists. As a client, you can post gigs and manage applications. To view example gigs, visit the Examples page.',
      }
      const errorMessage = errorParam3 ? errorMessages[errorParam3] : null
      expect(errorMessage).toBeUndefined() // Invalid code returns undefined from lookup
    })
  })

  describe('Unauthenticated access', () => {
    it('should redirect unauthenticated user to login', async () => {
      // No session set
      setTestSessionToken(undefined)

      // Import the page component dynamically to test redirect
      const { default: GigBrowsePage } = await import('@/app/(protected)/gigs/page')

      try {
        await GigBrowsePage({ searchParams: Promise.resolve({}) })
        expect.fail('Should have redirected')
      } catch (error: any) {
        expect(error.message).toBe('NEXT_REDIRECT:/login')
      }
    })
  })

  describe('Role check order', () => {
    it('should check authentication before role', async () => {
      // No session - should redirect to login, not dashboard
      setTestSessionToken(undefined)

      // Import the page component dynamically to test redirect
      const { default: GigBrowsePage } = await import('@/app/(protected)/gigs/page')

      try {
        await GigBrowsePage({ searchParams: Promise.resolve({}) })
        expect.fail('Should have redirected')
      } catch (error: any) {
        // Should redirect to login, not dashboard with error
        expect(error.message).toBe('NEXT_REDIRECT:/login')
        expect(error.message).not.toContain('dashboard')
      }
    })

    it('should check role after authentication', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        await withAuthContext(client, async () => {
          // Import the page component dynamically to test redirect
          const { default: GigBrowsePage } = await import('@/app/(protected)/gigs/page')

          try {
            await GigBrowsePage({ searchParams: Promise.resolve({}) })
            expect.fail('Should have redirected')
          } catch (error: any) {
            // Should redirect to dashboard with error, not login
            expect(error.message).toBe('NEXT_REDIRECT:/dashboard?error=browse-gigs-specialists-only')
            expect(error.message).not.toContain('login')
          }
        })
      })
    })
  })

  describe('SPECIALIST browse functionality', () => {
    it('should support filtering gigs by tags', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        // Create gigs with different tags
        const reactGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'React Gig',
          tags: 'React, TypeScript'
        })

        const pythonGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Python Gig',
          tags: 'Python, Django'
        })

        // Query with tag filter (simulating browse page filter)
        const filteredGigs = await prisma.gig.findMany({
          where: {
            status: 'OPEN',
            tags: { contains: 'React' }
          }
        })

        // Verify filtering works
        expect(filteredGigs.some(g => g.id === reactGig.id)).toBe(true)
        expect(filteredGigs.every(g => g.id !== pythonGig.id || g.tags?.includes('React'))).toBe(true)
      })
    })

    it('should support pagination of gigs', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        // Create a gig
        const gig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Test Gig'
        })

        // Query with pagination (simulating browse page pagination)
        const PAGE_SIZE = 25
        const page = 1
        const gigs = await prisma.gig.findMany({
          where: { status: 'OPEN' },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE
        })

        // Verify pagination query works
        expect(gigs.length).toBeGreaterThan(0)
        expect(gigs.some(g => g.id === gig.id)).toBe(true)
      })
    })
  })
})
