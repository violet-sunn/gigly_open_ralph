import { describe, it, expect, beforeEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'

describe('Gig Pagination', () => {
  beforeEach(async () => {
    const testPrisma = getTestPrismaClient()
    await testPrisma.message.deleteMany()
    await testPrisma.application.deleteMany()
    await testPrisma.gig.deleteMany()
    await testPrisma.specialistProfile.deleteMany()
    await testPrisma.clientProfile.deleteMany()
    await testPrisma.user.deleteMany()
  })

  it('should return first 25 gigs when no page parameter is provided', async () => {
    const testPrisma = getTestPrismaClient()

    // Create a test client
    const client = await testPrisma.user.create({
      data: {
        email: 'client@test.com',
        password: 'hashedpassword',
        role: 'CLIENT',
      },
    })

    // Create 30 gigs
    const gigs = []
    for (let i = 1; i <= 30; i++) {
      gigs.push({
        title: `Gig ${i}`,
        description: 'Test description',
        acceptanceCriteria: 'Test acceptance criteria that is long enough to pass validation',
        budget: 10000000, // 100,000 roubles in kopecks
        serviceFee: 1000000, // 10% fee
        totalAmount: 11000000,
        status: 'OPEN' as const,
        clientId: client.id,
        tags: 'React',
      })
    }
    await testPrisma.gig.createMany({ data: gigs })

    // Query first page (default)
    const PAGE_SIZE = 25
    const page = 1
    const where = { status: 'OPEN' }

    const [fetchedGigs, totalCount] = await Promise.all([
      testPrisma.gig.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: { createdAt: 'desc' },
      }),
      testPrisma.gig.count({ where }),
    ])

    expect(fetchedGigs).toHaveLength(25)
    expect(totalCount).toBe(30)
    expect((page - 1) * PAGE_SIZE).toBe(0) // skip value
  })

  it('should return gigs 26-30 on page 2', async () => {
    const testPrisma = getTestPrismaClient()

    // Create a test client
    const client = await testPrisma.user.create({
      data: {
        email: 'client@test.com',
        password: 'hashedpassword',
        role: 'CLIENT',
      },
    })

    // Create 30 gigs
    const gigs = []
    for (let i = 1; i <= 30; i++) {
      gigs.push({
        title: `Gig ${i}`,
        description: 'Test description',
        acceptanceCriteria: 'Test acceptance criteria that is long enough to pass validation',
        budget: 10000000,
        serviceFee: 1000000,
        totalAmount: 11000000,
        status: 'OPEN' as const,
        clientId: client.id,
        tags: 'React',
      })
    }
    await testPrisma.gig.createMany({ data: gigs })

    // Query second page
    const PAGE_SIZE = 25
    const page = 2
    const where = { status: 'OPEN' }

    const [fetchedGigs, totalCount] = await Promise.all([
      testPrisma.gig.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: { createdAt: 'desc' },
      }),
      testPrisma.gig.count({ where }),
    ])

    expect(fetchedGigs).toHaveLength(5) // Only 5 gigs on page 2
    expect(totalCount).toBe(30)
    expect((page - 1) * PAGE_SIZE).toBe(25) // skip value
  })

  it('should default to page 1 for invalid page numbers (0, negative, non-numeric)', async () => {
    const invalidPages = ['0', '-1', 'abc', '']

    invalidPages.forEach((pageParam) => {
      const page = Math.max(1, parseInt(pageParam, 10) || 1)
      expect(page).toBe(1)
    })
  })

  it('should calculate total pages correctly', async () => {
    const testCases = [
      { totalCount: 0, expectedPages: 0 },
      { totalCount: 1, expectedPages: 1 },
      { totalCount: 25, expectedPages: 1 },
      { totalCount: 26, expectedPages: 2 },
      { totalCount: 50, expectedPages: 2 },
      { totalCount: 51, expectedPages: 3 },
      { totalCount: 100, expectedPages: 4 },
    ]

    const PAGE_SIZE = 25

    testCases.forEach(({ totalCount, expectedPages }) => {
      const totalPages = Math.ceil(totalCount / PAGE_SIZE)
      expect(totalPages).toBe(expectedPages)
    })
  })

  it('should apply filters before pagination', async () => {
    const testPrisma = getTestPrismaClient()

    // Create a test client
    const client = await testPrisma.user.create({
      data: {
        email: 'client@test.com',
        password: 'hashedpassword',
        role: 'CLIENT',
      },
    })

    // Create 30 React gigs and 20 Python gigs
    const reactGigs = []
    for (let i = 1; i <= 30; i++) {
      reactGigs.push({
        title: `React Gig ${i}`,
        description: 'React description',
        acceptanceCriteria: 'Test acceptance criteria that is long enough to pass validation',
        budget: 10000000,
        serviceFee: 1000000,
        totalAmount: 11000000,
        status: 'OPEN' as const,
        clientId: client.id,
        tags: 'React',
      })
    }
    await testPrisma.gig.createMany({ data: reactGigs })

    const pythonGigs = []
    for (let i = 1; i <= 20; i++) {
      pythonGigs.push({
        title: `Python Gig ${i}`,
        description: 'Python description',
        acceptanceCriteria: 'Test acceptance criteria that is long enough to pass validation',
        budget: 10000000,
        serviceFee: 1000000,
        totalAmount: 11000000,
        status: 'OPEN' as const,
        clientId: client.id,
        tags: 'Python',
      })
    }
    await testPrisma.gig.createMany({ data: pythonGigs })

    // Query with filter for React gigs
    const PAGE_SIZE = 25
    const page = 1
    const where = {
      AND: [
        { status: 'OPEN' },
        { OR: [{ tags: { contains: 'React' } }] },
      ],
    }

    const [fetchedGigs, totalCount] = await Promise.all([
      testPrisma.gig.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: { createdAt: 'desc' },
      }),
      testPrisma.gig.count({ where }),
    ])

    expect(fetchedGigs).toHaveLength(25) // First 25 of 30 React gigs
    expect(totalCount).toBe(30) // Total React gigs
    expect(fetchedGigs.every((gig) => gig.tags?.includes('React'))).toBe(true)
  })

  it('should return correct count for filtered results', async () => {
    const testPrisma = getTestPrismaClient()

    // Create a test client
    const client = await testPrisma.user.create({
      data: {
        email: 'client@test.com',
        password: 'hashedpassword',
        role: 'CLIENT',
      },
    })

    // Create gigs with different budgets
    await testPrisma.gig.createMany({
      data: [
        {
          title: 'Low Budget Gig',
          description: 'Test',
          acceptanceCriteria: 'Test acceptance criteria that is long enough to pass validation',
          budget: 5000000, // 50,000 roubles
          serviceFee: 500000,
          totalAmount: 5500000,
          status: 'OPEN' as const,
          clientId: client.id,
          tags: 'React',
        },
        {
          title: 'High Budget Gig',
          description: 'Test',
          acceptanceCriteria: 'Test acceptance criteria that is long enough to pass validation',
          budget: 20000000, // 200,000 roubles
          serviceFee: 2000000,
          totalAmount: 22000000,
          status: 'OPEN' as const,
          clientId: client.id,
          tags: 'React',
        },
      ],
    })

    // Query with budget filter (min 100,000 roubles = 10,000,000 kopecks)
    const where = {
      AND: [{ status: 'OPEN' }, { budget: { gte: 10000000 } }],
    }

    const totalCount = await testPrisma.gig.count({ where })

    expect(totalCount).toBe(1) // Only high budget gig
  })

  it('should return partial page on last page', async () => {
    const testPrisma = getTestPrismaClient()

    // Create a test client
    const client = await testPrisma.user.create({
      data: {
        email: 'client@test.com',
        password: 'hashedpassword',
        role: 'CLIENT',
      },
    })

    // Create 27 gigs (1 full page + 2 on last page)
    const gigs = []
    for (let i = 1; i <= 27; i++) {
      gigs.push({
        title: `Gig ${i}`,
        description: 'Test description',
        acceptanceCriteria: 'Test acceptance criteria that is long enough to pass validation',
        budget: 10000000,
        serviceFee: 1000000,
        totalAmount: 11000000,
        status: 'OPEN' as const,
        clientId: client.id,
        tags: 'React',
      })
    }
    await testPrisma.gig.createMany({ data: gigs })

    // Query last page
    const PAGE_SIZE = 25
    const page = 2
    const where = { status: 'OPEN' }

    const [fetchedGigs, totalCount] = await Promise.all([
      testPrisma.gig.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: { createdAt: 'desc' },
      }),
      testPrisma.gig.count({ where }),
    ])

    expect(fetchedGigs).toHaveLength(2) // Only 2 gigs on last page
    expect(totalCount).toBe(27)
  })
})
