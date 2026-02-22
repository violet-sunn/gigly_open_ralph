import { describe, it, expect, beforeEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'

describe('Admin Gigs Pagination', () => {
  beforeEach(async () => {
    const testPrisma = getTestPrismaClient()
    await testPrisma.message.deleteMany()
    await testPrisma.application.deleteMany()
    await testPrisma.gig.deleteMany()
    await testPrisma.specialistProfile.deleteMany()
    await testPrisma.clientProfile.deleteMany()
    await testPrisma.user.deleteMany()
  })

  it('should return first 30 gigs when no page parameter is provided', async () => {
    const testPrisma = getTestPrismaClient()

    // Create a test client
    const client = await testPrisma.user.create({
      data: {
        email: 'client@test.com',
        password: 'hashedpassword',
        role: 'CLIENT',
      },
    })

    // Create 60 gigs
    const gigs = []
    for (let i = 1; i <= 60; i++) {
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

    // Query first page (default)
    const PAGE_SIZE = 30
    const page = 1
    const where = {}

    const [fetchedGigs, totalCount] = await Promise.all([
      testPrisma.gig.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          client: {
            include: {
              clientProfile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      testPrisma.gig.count({ where }),
    ])

    expect(fetchedGigs).toHaveLength(30)
    expect(totalCount).toBe(60)
    expect((page - 1) * PAGE_SIZE).toBe(0) // skip value
  })

  it('should return gigs 31-60 on page 2', async () => {
    const testPrisma = getTestPrismaClient()

    // Create a test client
    const client = await testPrisma.user.create({
      data: {
        email: 'client@test.com',
        password: 'hashedpassword',
        role: 'CLIENT',
      },
    })

    // Create 60 gigs
    const gigs = []
    for (let i = 1; i <= 60; i++) {
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
    const PAGE_SIZE = 30
    const page = 2
    const where = {}

    const [fetchedGigs, totalCount] = await Promise.all([
      testPrisma.gig.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          client: {
            include: {
              clientProfile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      testPrisma.gig.count({ where }),
    ])

    expect(fetchedGigs).toHaveLength(30)
    expect(totalCount).toBe(60)
    expect((page - 1) * PAGE_SIZE).toBe(30) // skip value
  })

  it('should default to page 1 for invalid page numbers (0, negative, non-numeric)', async () => {
    const invalidPages = ['0', '-1', 'abc', '']

    invalidPages.forEach((pageParam) => {
      const parsedPage = parseInt(pageParam, 10)
      const page = Math.max(1, parsedPage || 1)
      expect(page).toBe(1)
    })
  })

  it('should calculate total pages correctly', async () => {
    const testCases = [
      { totalCount: 0, expectedPages: 0 },
      { totalCount: 1, expectedPages: 1 },
      { totalCount: 30, expectedPages: 1 },
      { totalCount: 31, expectedPages: 2 },
      { totalCount: 60, expectedPages: 2 },
      { totalCount: 61, expectedPages: 3 },
      { totalCount: 100, expectedPages: 4 },
    ]

    const PAGE_SIZE = 30

    testCases.forEach(({ totalCount, expectedPages }) => {
      const totalPages = Math.ceil(totalCount / PAGE_SIZE)
      expect(totalPages).toBe(expectedPages)
    })
  })

  it('should apply status filter before pagination', async () => {
    const testPrisma = getTestPrismaClient()

    // Create a test client
    const client = await testPrisma.user.create({
      data: {
        email: 'client@test.com',
        password: 'hashedpassword',
        role: 'CLIENT',
      },
    })

    // Create 40 OPEN gigs and 20 COMPLETED gigs
    const openGigs = []
    for (let i = 1; i <= 40; i++) {
      openGigs.push({
        title: `Open Gig ${i}`,
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
    await testPrisma.gig.createMany({ data: openGigs })

    const completedGigs = []
    for (let i = 1; i <= 20; i++) {
      completedGigs.push({
        title: `Completed Gig ${i}`,
        description: 'Test description',
        acceptanceCriteria: 'Test acceptance criteria that is long enough to pass validation',
        budget: 10000000,
        serviceFee: 1000000,
        totalAmount: 11000000,
        status: 'COMPLETED' as const,
        clientId: client.id,
        tags: 'React',
      })
    }
    await testPrisma.gig.createMany({ data: completedGigs })

    // Query with status filter for OPEN
    const PAGE_SIZE = 30
    const page = 1
    const where = { status: 'OPEN' }

    const [fetchedGigs, totalCount] = await Promise.all([
      testPrisma.gig.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          client: {
            include: {
              clientProfile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      testPrisma.gig.count({ where }),
    ])

    expect(fetchedGigs).toHaveLength(30) // First 30 of 40 OPEN gigs
    expect(totalCount).toBe(40) // Total OPEN gigs
    expect(fetchedGigs.every((gig) => gig.status === 'OPEN')).toBe(true)
  })

  it('should apply closed filter before pagination', async () => {
    const testPrisma = getTestPrismaClient()

    // Create a test client
    const client = await testPrisma.user.create({
      data: {
        email: 'client@test.com',
        password: 'hashedpassword',
        role: 'CLIENT',
      },
    })

    // Create 35 open gigs and 25 closed gigs
    const openGigs = []
    for (let i = 1; i <= 35; i++) {
      openGigs.push({
        title: `Open Gig ${i}`,
        description: 'Test description',
        acceptanceCriteria: 'Test acceptance criteria that is long enough to pass validation',
        budget: 10000000,
        serviceFee: 1000000,
        totalAmount: 11000000,
        status: 'OPEN' as const,
        clientId: client.id,
        tags: 'React',
        closedByAdmin: false,
      })
    }
    await testPrisma.gig.createMany({ data: openGigs })

    const closedGigs = []
    for (let i = 1; i <= 25; i++) {
      closedGigs.push({
        title: `Closed Gig ${i}`,
        description: 'Test description',
        acceptanceCriteria: 'Test acceptance criteria that is long enough to pass validation',
        budget: 10000000,
        serviceFee: 1000000,
        totalAmount: 11000000,
        status: 'OPEN' as const,
        clientId: client.id,
        tags: 'React',
        closedByAdmin: true,
      })
    }
    await testPrisma.gig.createMany({ data: closedGigs })

    // Query with closed filter for true
    const PAGE_SIZE = 30
    const page = 1
    const where = { closedByAdmin: true }

    const [fetchedGigs, totalCount] = await Promise.all([
      testPrisma.gig.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          client: {
            include: {
              clientProfile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      testPrisma.gig.count({ where }),
    ])

    expect(fetchedGigs).toHaveLength(25) // All 25 closed gigs
    expect(totalCount).toBe(25) // Total closed gigs
    expect(fetchedGigs.every((gig) => gig.closedByAdmin === true)).toBe(true)
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

    // Create gigs with different statuses
    await testPrisma.gig.createMany({
      data: [
        {
          title: 'Open Gig',
          description: 'Test',
          acceptanceCriteria: 'Test acceptance criteria that is long enough to pass validation',
          budget: 10000000,
          serviceFee: 1000000,
          totalAmount: 11000000,
          status: 'OPEN' as const,
          clientId: client.id,
          tags: 'React',
        },
        {
          title: 'In Progress Gig',
          description: 'Test',
          acceptanceCriteria: 'Test acceptance criteria that is long enough to pass validation',
          budget: 10000000,
          serviceFee: 1000000,
          totalAmount: 11000000,
          status: 'IN_PROGRESS' as const,
          clientId: client.id,
          tags: 'React',
        },
        {
          title: 'Completed Gig',
          description: 'Test',
          acceptanceCriteria: 'Test acceptance criteria that is long enough to pass validation',
          budget: 10000000,
          serviceFee: 1000000,
          totalAmount: 11000000,
          status: 'COMPLETED' as const,
          clientId: client.id,
          tags: 'React',
        },
      ],
    })

    // Query with status filter for COMPLETED
    const where = { status: 'COMPLETED' }
    const totalCount = await testPrisma.gig.count({ where })

    expect(totalCount).toBe(1) // Only 1 COMPLETED gig
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

    // Create 32 gigs (1 full page + 2 on last page)
    const gigs = []
    for (let i = 1; i <= 32; i++) {
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
    const PAGE_SIZE = 30
    const page = 2
    const where = {}

    const [fetchedGigs, totalCount] = await Promise.all([
      testPrisma.gig.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          client: {
            include: {
              clientProfile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      testPrisma.gig.count({ where }),
    ])

    expect(fetchedGigs).toHaveLength(2) // Only 2 gigs on last page
    expect(totalCount).toBe(32)
  })
})
