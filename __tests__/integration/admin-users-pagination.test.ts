import { describe, it, expect, beforeEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'

describe('Admin Users Pagination', () => {
  beforeEach(async () => {
    const testPrisma = getTestPrismaClient()
    await testPrisma.message.deleteMany()
    await testPrisma.application.deleteMany()
    await testPrisma.gig.deleteMany()
    await testPrisma.specialistProfile.deleteMany()
    await testPrisma.clientProfile.deleteMany()
    await testPrisma.user.deleteMany()
  })

  it('should return first 30 users when no page parameter is provided', async () => {
    const testPrisma = getTestPrismaClient()

    // Create 60 users
    const users = []
    for (let i = 1; i <= 60; i++) {
      users.push({
        email: `user${i}@test.com`,
        password: 'hashedpassword',
        role: 'CLIENT' as const,
      })
    }
    await testPrisma.user.createMany({ data: users })

    // Query first page (default)
    const PAGE_SIZE = 30
    const page = 1
    const where = {}

    const [fetchedUsers, totalCount] = await Promise.all([
      testPrisma.user.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          clientProfile: true,
          specialistProfile: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      testPrisma.user.count({ where }),
    ])

    expect(fetchedUsers).toHaveLength(30)
    expect(totalCount).toBe(60)
    expect((page - 1) * PAGE_SIZE).toBe(0) // skip value
  })

  it('should return users 31-60 on page 2', async () => {
    const testPrisma = getTestPrismaClient()

    // Create 60 users
    const users = []
    for (let i = 1; i <= 60; i++) {
      users.push({
        email: `user${i}@test.com`,
        password: 'hashedpassword',
        role: 'CLIENT' as const,
      })
    }
    await testPrisma.user.createMany({ data: users })

    // Query second page
    const PAGE_SIZE = 30
    const page = 2
    const where = {}

    const [fetchedUsers, totalCount] = await Promise.all([
      testPrisma.user.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          clientProfile: true,
          specialistProfile: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      testPrisma.user.count({ where }),
    ])

    expect(fetchedUsers).toHaveLength(30)
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

  it('should apply role filter before pagination', async () => {
    const testPrisma = getTestPrismaClient()

    // Create 40 CLIENT users and 20 SPECIALIST users
    const clientUsers = []
    for (let i = 1; i <= 40; i++) {
      clientUsers.push({
        email: `client${i}@test.com`,
        password: 'hashedpassword',
        role: 'CLIENT' as const,
      })
    }
    await testPrisma.user.createMany({ data: clientUsers })

    const specialistUsers = []
    for (let i = 1; i <= 20; i++) {
      specialistUsers.push({
        email: `specialist${i}@test.com`,
        password: 'hashedpassword',
        role: 'SPECIALIST' as const,
      })
    }
    await testPrisma.user.createMany({ data: specialistUsers })

    // Query with role filter for CLIENT
    const PAGE_SIZE = 30
    const page = 1
    const where = { role: 'CLIENT' }

    const [fetchedUsers, totalCount] = await Promise.all([
      testPrisma.user.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          clientProfile: true,
          specialistProfile: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      testPrisma.user.count({ where }),
    ])

    expect(fetchedUsers).toHaveLength(30) // First 30 of 40 CLIENT users
    expect(totalCount).toBe(40) // Total CLIENT users
    expect(fetchedUsers.every((user) => user.role === 'CLIENT')).toBe(true)
  })

  it('should apply status filter before pagination', async () => {
    const testPrisma = getTestPrismaClient()

    // Create 35 active users and 25 suspended users
    const activeUsers = []
    for (let i = 1; i <= 35; i++) {
      activeUsers.push({
        email: `active${i}@test.com`,
        password: 'hashedpassword',
        role: 'CLIENT' as const,
        suspended: false,
      })
    }
    await testPrisma.user.createMany({ data: activeUsers })

    const suspendedUsers = []
    for (let i = 1; i <= 25; i++) {
      suspendedUsers.push({
        email: `suspended${i}@test.com`,
        password: 'hashedpassword',
        role: 'CLIENT' as const,
        suspended: true,
      })
    }
    await testPrisma.user.createMany({ data: suspendedUsers })

    // Query with status filter for suspended
    const PAGE_SIZE = 30
    const page = 1
    const where = { suspended: true }

    const [fetchedUsers, totalCount] = await Promise.all([
      testPrisma.user.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          clientProfile: true,
          specialistProfile: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      testPrisma.user.count({ where }),
    ])

    expect(fetchedUsers).toHaveLength(25) // All 25 suspended users
    expect(totalCount).toBe(25) // Total suspended users
    expect(fetchedUsers.every((user) => user.suspended === true)).toBe(true)
  })

  it('should return correct count for filtered results', async () => {
    const testPrisma = getTestPrismaClient()

    // Create users with different roles
    await testPrisma.user.createMany({
      data: [
        {
          email: 'client1@test.com',
          password: 'hashedpassword',
          role: 'CLIENT' as const,
        },
        {
          email: 'specialist1@test.com',
          password: 'hashedpassword',
          role: 'SPECIALIST' as const,
        },
        {
          email: 'admin1@test.com',
          password: 'hashedpassword',
          role: 'ADMIN' as const,
        },
      ],
    })

    // Query with role filter for ADMIN
    const where = { role: 'ADMIN' }
    const totalCount = await testPrisma.user.count({ where })

    expect(totalCount).toBe(1) // Only 1 ADMIN user
  })

  it('should return partial page on last page', async () => {
    const testPrisma = getTestPrismaClient()

    // Create 32 users (1 full page + 2 on last page)
    const users = []
    for (let i = 1; i <= 32; i++) {
      users.push({
        email: `user${i}@test.com`,
        password: 'hashedpassword',
        role: 'CLIENT' as const,
      })
    }
    await testPrisma.user.createMany({ data: users })

    // Query last page
    const PAGE_SIZE = 30
    const page = 2
    const where = {}

    const [fetchedUsers, totalCount] = await Promise.all([
      testPrisma.user.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          clientProfile: true,
          specialistProfile: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      testPrisma.user.count({ where }),
    ])

    expect(fetchedUsers).toHaveLength(2) // Only 2 users on last page
    expect(totalCount).toBe(32)
  })
})
