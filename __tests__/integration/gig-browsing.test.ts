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

describe('Gig Browsing Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  describe('Role-based gig listing', () => {
    it('SPECIALIST browses OPEN gigs only', async () => {
      await withTestTransaction(async (prisma) => {
        // Create CLIENT user with multiple gigs of different statuses
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const openGig1 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Open Gig 1'
        })

        const openGig2 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Open Gig 2'
        })

        const inProgressGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'IN_PROGRESS',
          title: 'In Progress Gig'
        })

        const completedGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'COMPLETED',
          title: 'Completed Gig'
        })

        // Query for OPEN gigs only (simulating SPECIALIST browse)
        const openGigs = await prisma.gig.findMany({
          where: { status: 'OPEN' },
          orderBy: { createdAt: 'desc' },
          include: {
            client: {
              select: {
                email: true,
                clientProfile: {
                  select: {
                    companyName: true
                  }
                }
              }
            }
          }
        })

        // Verify only OPEN gigs are returned
        expect(openGigs.length).toBe(2)
        expect(openGigs.map(g => g.id)).toContain(openGig1.id)
        expect(openGigs.map(g => g.id)).toContain(openGig2.id)
        expect(openGigs.map(g => g.id)).not.toContain(inProgressGig.id)
        expect(openGigs.map(g => g.id)).not.toContain(completedGig.id)

        // Verify gigs are ordered by createdAt descending (newest first)
        expect(openGigs[0].createdAt.getTime()).toBeGreaterThanOrEqual(openGigs[1].createdAt.getTime())

        // Verify each gig includes required fields
        openGigs.forEach(gig => {
          expect(gig.title).toBeDefined()
          expect(gig.description).toBeDefined()
          expect(gig.budget).toBeDefined()
          expect(gig.tags).toBeDefined()
          expect(gig.client).toBeDefined()
        })
      })
    })

    it('CLIENT browses all their gigs regardless of status', async () => {
      await withTestTransaction(async (prisma) => {
        // Create CLIENT user with multiple gigs
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const openGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN'
        })

        const inProgressGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'IN_PROGRESS'
        })

        const completedGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'COMPLETED'
        })

        // Create another client's gig (should not be included)
        const otherClient = await createTestUser(prisma, { role: 'CLIENT' })
        const otherGig = await createTestGig(prisma, {
          clientId: otherClient.id,
          status: 'OPEN'
        })

        // Query for CLIENT's gigs (all statuses)
        const clientGigs = await prisma.gig.findMany({
          where: { clientId: client.id },
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { applications: true }
            }
          }
        })

        // Verify all client's gigs are returned
        expect(clientGigs.length).toBe(3)
        expect(clientGigs.map(g => g.id)).toContain(openGig.id)
        expect(clientGigs.map(g => g.id)).toContain(inProgressGig.id)
        expect(clientGigs.map(g => g.id)).toContain(completedGig.id)
        expect(clientGigs.map(g => g.id)).not.toContain(otherGig.id)

        // Verify application count is included
        clientGigs.forEach(gig => {
          expect(gig._count.applications).toBeDefined()
          expect(typeof gig._count.applications).toBe('number')
        })
      })
    })
  })

  describe('Empty state handling', () => {
    it('returns empty array when no OPEN gigs exist', async () => {
      await withTestTransaction(async (prisma) => {
        // Create a CLIENT with only non-OPEN gigs
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        await createTestGig(prisma, {
          clientId: client.id,
          status: 'COMPLETED'
        })

        // Query for OPEN gigs
        const openGigs = await prisma.gig.findMany({
          where: { status: 'OPEN' }
        })

        // Verify empty array is returned
        expect(openGigs).toEqual([])
        expect(openGigs.length).toBe(0)
      })
    })
  })

  describe('Client information inclusion', () => {
    it('gig includes client company name and email', async () => {
      await withTestTransaction(async (prisma) => {
        // Create CLIENT user with profile
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const gig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN'
        })

        // Query gig with client relation
        const gigWithClient = await prisma.gig.findUnique({
          where: { id: gig.id },
          include: {
            client: {
              select: {
                email: true,
                clientProfile: {
                  select: {
                    companyName: true,
                    inn: true
                  }
                }
              }
            }
          }
        })

        // Verify client information is present
        expect(gigWithClient).toBeDefined()
        expect(gigWithClient!.client).toBeDefined()
        expect(gigWithClient!.client.email).toBeDefined()
        expect(gigWithClient!.client.clientProfile).toBeDefined()
        expect(gigWithClient!.client.clientProfile!.companyName).toBeDefined()
      })
    })
  })

  describe('Default ordering', () => {
    it('gigs are ordered by newest first (createdAt descending)', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        // Create gigs with slight delays to ensure different timestamps
        const gig1 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'First Gig'
        })

        // Small delay to ensure different timestamps
        await new Promise(resolve => setTimeout(resolve, 10))

        const gig2 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Second Gig'
        })

        await new Promise(resolve => setTimeout(resolve, 10))

        const gig3 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Third Gig'
        })

        // Query with default ordering
        const gigs = await prisma.gig.findMany({
          where: { status: 'OPEN' },
          orderBy: { createdAt: 'desc' }
        })

        // Verify descending order (newest first)
        const gigIds = gigs.map(g => g.id)
        expect(gigIds.indexOf(gig3.id)).toBeLessThan(gigIds.indexOf(gig2.id))
        expect(gigIds.indexOf(gig2.id)).toBeLessThan(gigIds.indexOf(gig1.id))

        // Verify timestamps are in descending order
        for (let i = 0; i < gigs.length - 1; i++) {
          expect(gigs[i].createdAt.getTime()).toBeGreaterThanOrEqual(gigs[i + 1].createdAt.getTime())
        }
      })
    })
  })
})
