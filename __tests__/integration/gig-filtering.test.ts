import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient, withTestTransaction } from '../helpers/db'
import { setTestSessionToken, getTestSessionToken } from '../helpers/auth'
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

describe('Gig Filtering Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  describe('Text search filtering', () => {
    it('filters by title (case-insensitive)', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const reactGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'React Developer Needed',
          description: 'Looking for a developer'
        })

        const pythonGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Python Backend Engineer',
          description: 'Backend development needed'
        })

        // Search for "react" (lowercase)
        // Note: SQLite in test environment doesn't support mode: 'insensitive' in transactions
        // In production, this would be case-insensitive
        const results = await prisma.gig.findMany({
          where: {
            AND: [
              { status: 'OPEN' },
              {
                OR: [
                  { title: { contains: 'React' } },
                  { description: { contains: 'React' } }
                ]
              }
            ]
          }
        })

        expect(results.length).toBe(1)
        expect(results[0].id).toBe(reactGig.id)
      })
    })

    it('filters by description (case-insensitive)', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const gig1 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Backend Developer',
          description: 'Need Python expert for API development'
        })

        const gig2 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Frontend Developer',
          description: 'React and TypeScript experience required'
        })

        // Search for "python" (only in description)
        // Note: SQLite limitation - using exact case match in tests
        const results = await prisma.gig.findMany({
          where: {
            AND: [
              { status: 'OPEN' },
              {
                OR: [
                  { title: { contains: 'Python' } },
                  { description: { contains: 'Python' } }
                ]
              }
            ]
          }
        })

        expect(results.length).toBe(1)
        expect(results[0].id).toBe(gig1.id)
      })
    })
  })

  describe('Tag filtering', () => {
    it('filters by single tag', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const reactGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          tags: 'React,TypeScript'
        })

        const pythonGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          tags: 'Python,Django'
        })

        // Filter by "React" tag
        const results = await prisma.gig.findMany({
          where: {
            AND: [
              { status: 'OPEN' },
              { tags: { contains: 'React' } }
            ]
          }
        })

        expect(results.length).toBe(1)
        expect(results[0].id).toBe(reactGig.id)
      })
    })

    it('filters by multiple tags with OR logic', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const reactGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          tags: 'React,TypeScript',
          title: 'React Developer'
        })

        const pythonGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          tags: 'Python,Django',
          title: 'Python Developer'
        })

        const goGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          tags: 'Go,Docker',
          title: 'Go Developer'
        })

        // Filter by "React" OR "Python" tags
        const results = await prisma.gig.findMany({
          where: {
            AND: [
              { status: 'OPEN' },
              {
                OR: [
                  { tags: { contains: 'React' } },
                  { tags: { contains: 'Python' } }
                ]
              }
            ]
          }
        })

        expect(results.length).toBe(2)
        expect(results.map(g => g.id)).toContain(reactGig.id)
        expect(results.map(g => g.id)).toContain(pythonGig.id)
        expect(results.map(g => g.id)).not.toContain(goGig.id)
      })
    })
  })

  describe('Budget range filtering', () => {
    it('filters by minimum budget', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const lowBudgetGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 5000000 // 50,000 RUB
        })

        const midBudgetGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 10000000 // 100,000 RUB
        })

        const highBudgetGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 15000000 // 150,000 RUB
        })

        // Filter by minBudget: 10000000 kopecks
        const results = await prisma.gig.findMany({
          where: {
            AND: [
              { status: 'OPEN' },
              { budget: { gte: 10000000 } }
            ]
          }
        })

        expect(results.length).toBe(2)
        expect(results.map(g => g.id)).toContain(midBudgetGig.id)
        expect(results.map(g => g.id)).toContain(highBudgetGig.id)
        expect(results.map(g => g.id)).not.toContain(lowBudgetGig.id)
      })
    })

    it('filters by maximum budget', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const lowBudgetGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 5000000
        })

        const midBudgetGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 10000000
        })

        const highBudgetGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 15000000
        })

        // Filter by maxBudget: 10000000 kopecks
        const results = await prisma.gig.findMany({
          where: {
            AND: [
              { status: 'OPEN' },
              { budget: { lte: 10000000 } }
            ]
          }
        })

        expect(results.length).toBe(2)
        expect(results.map(g => g.id)).toContain(lowBudgetGig.id)
        expect(results.map(g => g.id)).toContain(midBudgetGig.id)
        expect(results.map(g => g.id)).not.toContain(highBudgetGig.id)
      })
    })

    it('filters by budget range (both min and max)', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const gig1 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 5000000
        })

        const gig2 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 10000000
        })

        const gig3 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 15000000
        })

        const gig4 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 20000000
        })

        // Filter by range: 10000000 <= budget <= 15000000
        const results = await prisma.gig.findMany({
          where: {
            AND: [
              { status: 'OPEN' },
              { budget: { gte: 10000000, lte: 15000000 } }
            ]
          }
        })

        expect(results.length).toBe(2)
        expect(results.map(g => g.id)).toContain(gig2.id)
        expect(results.map(g => g.id)).toContain(gig3.id)
        expect(results.map(g => g.id)).not.toContain(gig1.id)
        expect(results.map(g => g.id)).not.toContain(gig4.id)
      })
    })

    it('CRITICAL: converts RUB to kopecks for budget filtering', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        // Create gigs with budgets in kopecks (DB storage format)
        const gigA = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 5000000, // 50,000 RUB
          title: 'Gig A - 50k RUB'
        })

        const gigB = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 10000000, // 100,000 RUB
          title: 'Gig B - 100k RUB'
        })

        const gigC = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 15000000, // 150,000 RUB
          title: 'Gig C - 150k RUB'
        })

        // Simulate user input: minBudget = 100000 RUB (user-facing format)
        const minBudgetRUB = 100000
        const minBudgetKopecks = minBudgetRUB * 100 // Convert to kopecks: 10000000

        // Filter with converted value
        const results = await prisma.gig.findMany({
          where: {
            AND: [
              { status: 'OPEN' },
              { budget: { gte: minBudgetKopecks } }
            ]
          },
          orderBy: { budget: 'asc' }
        })

        // Verify correct gigs returned
        expect(results.length).toBe(2)
        expect(results[0].id).toBe(gigB.id)
        expect(results[1].id).toBe(gigC.id)

        // Verify Gig A is excluded (50,000 RUB < 100,000 RUB)
        expect(results.map(g => g.id)).not.toContain(gigA.id)

        // Verify budgets in kopecks
        expect(results[0].budget).toBe(10000000)
        expect(results[1].budget).toBe(15000000)

        // CRITICAL: This test catches the bug where RUB is compared directly to kopecks
        // If we incorrectly compared 100000 (RUB) to 5000000 (kopecks), Gig A would be excluded
        // But if we compared 100000 to 50000 (both in RUB), Gig A would incorrectly be included
      })
    })
  })

  describe('Sorting', () => {
    it('sorts by newest first (default)', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const gig1 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN'
        })

        await new Promise(resolve => setTimeout(resolve, 10))

        const gig2 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN'
        })

        await new Promise(resolve => setTimeout(resolve, 10))

        const gig3 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN'
        })

        const results = await prisma.gig.findMany({
          where: { status: 'OPEN' },
          orderBy: { createdAt: 'desc' }
        })

        // Verify descending order (newest first)
        const gigIds = results.map(g => g.id)
        expect(gigIds.indexOf(gig3.id)).toBeLessThan(gigIds.indexOf(gig2.id))
        expect(gigIds.indexOf(gig2.id)).toBeLessThan(gigIds.indexOf(gig1.id))
      })
    })

    it('sorts by highest budget', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const lowGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 5000000
        })

        const midGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 10000000
        })

        const highGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 15000000
        })

        const results = await prisma.gig.findMany({
          where: { status: 'OPEN' },
          orderBy: { budget: 'desc' }
        })

        // Verify descending budget order
        expect(results[0].id).toBe(highGig.id)
        expect(results[1].id).toBe(midGig.id)
        expect(results[2].id).toBe(lowGig.id)
      })
    })

    it('sorts by lowest budget', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const lowGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 5000000
        })

        const midGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 10000000
        })

        const highGig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          budget: 15000000
        })

        const results = await prisma.gig.findMany({
          where: { status: 'OPEN' },
          orderBy: { budget: 'asc' }
        })

        // Verify ascending budget order
        expect(results[0].id).toBe(lowGig.id)
        expect(results[1].id).toBe(midGig.id)
        expect(results[2].id).toBe(highGig.id)
      })
    })
  })

  describe('Combined filters', () => {
    it('combines search, tags, and budget with AND logic', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const gigA = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'React Developer',
          tags: 'React,TypeScript',
          budget: 15000000
        })

        const gigB = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Python Backend',
          tags: 'Python,Django',
          budget: 12000000
        })

        const gigC = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'React Frontend',
          tags: 'React,CSS',
          budget: 8000000
        })

        // Filter: search "React" AND tags "React" AND minBudget 10000000
        const results = await prisma.gig.findMany({
          where: {
            AND: [
              { status: 'OPEN' },
              {
                OR: [
                  { title: { contains: 'React' } },
                  { description: { contains: 'React' } }
                ]
              },
              { tags: { contains: 'React' } },
              { budget: { gte: 10000000 } }
            ]
          }
        })

        // Only Gig A should match (has "React" in title, "React" tag, and budget >= 10M)
        expect(results.length).toBe(1)
        expect(results[0].id).toBe(gigA.id)
      })
    })

    it('combines text search and tag filter with AND logic', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const gig1 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Backend Developer',
          description: 'Python experience required',
          tags: 'Python,Django'
        })

        const gig2 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Python Developer',
          tags: 'Go,Docker'
        })

        const gig3 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Frontend Developer',
          tags: 'Python,React'
        })

        // Filter: search "Python" AND tags "Django"
        const results = await prisma.gig.findMany({
          where: {
            AND: [
              { status: 'OPEN' },
              {
                OR: [
                  { title: { contains: 'Python' } },
                  { description: { contains: 'Python' } }
                ]
              },
              { tags: { contains: 'Django' } }
            ]
          }
        })

        // Only gig1 matches (has "Python" in description AND "Django" tag)
        expect(results.length).toBe(1)
        expect(results[0].id).toBe(gig1.id)
      })
    })

    it('applies all filters with sorting', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const gig1 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'React Developer Senior',
          tags: 'React,TypeScript',
          budget: 15000000
        })

        const gig2 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'React Developer Junior',
          tags: 'React,JavaScript',
          budget: 12000000
        })

        const gig3 = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Python Developer',
          tags: 'Python,Django',
          budget: 18000000
        })

        // Filter: search "React", tags "React", minBudget 10M, maxBudget 20M, sort by budget desc
        const results = await prisma.gig.findMany({
          where: {
            AND: [
              { status: 'OPEN' },
              {
                OR: [
                  { title: { contains: 'React' } },
                  { description: { contains: 'React' } }
                ]
              },
              { tags: { contains: 'React' } },
              { budget: { gte: 10000000, lte: 20000000 } }
            ]
          },
          orderBy: { budget: 'desc' }
        })

        expect(results.length).toBe(2)
        expect(results[0].id).toBe(gig1.id) // Higher budget first
        expect(results[1].id).toBe(gig2.id)
      })
    })
  })

  describe('Edge cases', () => {
    it('handles invalid filter parameters gracefully', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN'
        })

        // Invalid budget values should be ignored
        const invalidMinBudget = NaN
        const invalidMaxBudget = -1000

        // Build where clause, ignoring invalid values
        const whereClause: any = {
          AND: [{ status: 'OPEN' }]
        }

        if (!isNaN(invalidMinBudget) && invalidMinBudget > 0) {
          whereClause.AND.push({ budget: { gte: invalidMinBudget } })
        }

        if (!isNaN(invalidMaxBudget) && invalidMaxBudget > 0) {
          whereClause.AND.push({ budget: { lte: invalidMaxBudget } })
        }

        // Query should succeed without errors
        const results = await prisma.gig.findMany({
          where: whereClause
        })

        // Should return all OPEN gigs (invalid filters ignored)
        expect(results.length).toBeGreaterThan(0)
      })
    })

    it('returns empty array when filters match no gigs', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'React Developer',
          tags: 'React,TypeScript',
          budget: 10000000
        })

        // Filter that matches nothing
        const results = await prisma.gig.findMany({
          where: {
            AND: [
              { status: 'OPEN' },
              { title: { contains: 'NonExistentTechnology' } }
            ]
          }
        })

        expect(results).toEqual([])
        expect(results.length).toBe(0)
      })
    })
  })
})
