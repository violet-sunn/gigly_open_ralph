import { describe, it, expect } from 'vitest'
import { withTestTransaction } from '../helpers/db'
import { createTestUser, createTestGig } from '../helpers/seed'

describe('Specialist Active Gigs Query', () => {
  it('returns empty array when specialist has no active gigs', async () => {
    await withTestTransaction(async (tx) => {
      // Create specialist user
      const specialist = await createTestUser(tx, {
        email: 'specialist@test.com',
        role: 'SPECIALIST',
        techStack: 'React, Node.js',
        experienceLevel: 'SENIOR'
      })

      // Query active gigs
      const activeGigs = await tx.gig.findMany({
        where: {
          assignedSpecialistId: specialist.id,
          status: { in: ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] }
        },
        include: {
          client: {
            select: {
              email: true,
              clientProfile: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })

      expect(activeGigs).toEqual([])
    })
  })

  it('returns IN_PROGRESS gig assigned to specialist', async () => {
    await withTestTransaction(async (tx) => {
      // Create specialist and client
      const specialist = await createTestUser(tx, {
        email: 'specialist@test.com',
        role: 'SPECIALIST',
        techStack: 'React, Node.js',
        experienceLevel: 'SENIOR'
      })

      const client = await createTestUser(tx, {
        email: 'client@test.com',
        role: 'CLIENT',
        companyName: 'Test Company',
        inn: '1234567890'
      })

      // Create gig with assignedSpecialistId = specialist.id, status = IN_PROGRESS
      const gig = await createTestGig(tx, {
        title: 'Test Gig',
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      // Query active gigs
      const activeGigs = await tx.gig.findMany({
        where: {
          assignedSpecialistId: specialist.id,
          status: { in: ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] }
        },
        include: {
          client: {
            select: {
              email: true,
              clientProfile: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })

      expect(activeGigs).toHaveLength(1)
      expect(activeGigs[0].id).toBe(gig.id)
      expect(activeGigs[0].status).toBe('IN_PROGRESS')
    })
  })

  it('excludes OPEN gigs even if specialist applied', async () => {
    await withTestTransaction(async (tx) => {
      // Create specialist and client
      const specialist = await createTestUser(tx, {
        email: 'specialist@test.com',
        role: 'SPECIALIST',
        techStack: 'React, Node.js',
        experienceLevel: 'SENIOR'
      })

      const client = await createTestUser(tx, {
        email: 'client@test.com',
        role: 'CLIENT',
        companyName: 'Test Company',
        inn: '1234567890'
      })

      // Create OPEN gig
      const gig = await createTestGig(tx, {
        title: 'Test Gig',
        clientId: client.id,
        status: 'OPEN'
      })

      // Create application from specialist
      await tx.application.create({
        data: {
          gigId: gig.id,
          specialistId: specialist.id,
          approach: 'Test approach that is long enough to meet the minimum character requirement for validation',
          questions: 'Test questions that meet the minimum character requirement',
          status: 'PENDING',
        },
      })

      // Query active gigs
      const activeGigs = await tx.gig.findMany({
        where: {
          assignedSpecialistId: specialist.id,
          status: { in: ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] }
        },
        include: {
          client: {
            select: {
              email: true,
              clientProfile: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })

      expect(activeGigs).toEqual([])
    })
  })

  it('excludes gigs assigned to other specialists', async () => {
    await withTestTransaction(async (tx) => {
      // Create two specialists
      const specialistA = await createTestUser(tx, {
        email: 'specialistA@test.com',
        role: 'SPECIALIST',
        techStack: 'React, Node.js',
        experienceLevel: 'SENIOR'
      })

      const specialistB = await createTestUser(tx, {
        email: 'specialistB@test.com',
        role: 'SPECIALIST',
        techStack: 'Python, Django',
        experienceLevel: 'MIDDLE'
      })

      const client = await createTestUser(tx, {
        email: 'client@test.com',
        role: 'CLIENT',
        companyName: 'Test Company',
        inn: '1234567890'
      })

      // Create gig assigned to specialist A
      await createTestGig(tx, {
        title: 'Test Gig',
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialistA.id
      })

      // Query active gigs for specialist B
      const activeGigs = await tx.gig.findMany({
        where: {
          assignedSpecialistId: specialistB.id,
          status: { in: ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] }
        },
        include: {
          client: {
            select: {
              email: true,
              clientProfile: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })

      expect(activeGigs).toEqual([])
    })
  })

  it('returns gigs in all active statuses', async () => {
    await withTestTransaction(async (tx) => {
      // Create specialist and client
      const specialist = await createTestUser(tx, {
        email: 'specialist@test.com',
        role: 'SPECIALIST',
        techStack: 'React, Node.js',
        experienceLevel: 'SENIOR'
      })

      const client = await createTestUser(tx, {
        email: 'client@test.com',
        role: 'CLIENT',
        companyName: 'Test Company',
        inn: '1234567890'
      })

      // Create gigs with statuses: IN_PROGRESS, REVIEW, COMPLETED, PAID
      const gigInProgress = await createTestGig(tx, {
        title: 'In Progress Gig',
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      const gigReview = await createTestGig(tx, {
        title: 'Review Gig',
        clientId: client.id,
        status: 'REVIEW',
        assignedSpecialistId: specialist.id
      })

      const gigCompleted = await createTestGig(tx, {
        title: 'Completed Gig',
        clientId: client.id,
        status: 'COMPLETED',
        assignedSpecialistId: specialist.id
      })

      const gigPaid = await createTestGig(tx, {
        title: 'Paid Gig',
        clientId: client.id,
        status: 'PAID',
        assignedSpecialistId: specialist.id,
        paidAt: new Date()
      })

      // Query active gigs
      const activeGigs = await tx.gig.findMany({
        where: {
          assignedSpecialistId: specialist.id,
          status: { in: ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] }
        },
        include: {
          client: {
            select: {
              email: true,
              clientProfile: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })

      expect(activeGigs).toHaveLength(4)
      const gigIds = activeGigs.map(g => g.id)
      expect(gigIds).toContain(gigInProgress.id)
      expect(gigIds).toContain(gigReview.id)
      expect(gigIds).toContain(gigCompleted.id)
      expect(gigIds).toContain(gigPaid.id)
    })
  })

  it('orders gigs by updatedAt DESC', async () => {
    await withTestTransaction(async (tx) => {
      // Create specialist and client
      const specialist = await createTestUser(tx, {
        email: 'specialist@test.com',
        role: 'SPECIALIST',
        techStack: 'React, Node.js',
        experienceLevel: 'SENIOR'
      })

      const client = await createTestUser(tx, {
        email: 'client@test.com',
        role: 'CLIENT',
        companyName: 'Test Company',
        inn: '1234567890'
      })

      // Create 3 gigs with different updatedAt timestamps
      const oldDate = new Date('2024-01-01')
      const midDate = new Date('2024-06-01')
      const newDate = new Date('2024-12-01')

      const gigOld = await tx.gig.create({
        data: {
          title: 'Old Gig',
          description: 'Test description',
          acceptanceCriteria: 'Test criteria that is long enough to pass validation',
          budget: 10000000,
          serviceFee: 1000000,
          totalAmount: 11000000,
          status: 'IN_PROGRESS',
          clientId: client.id,
          assignedSpecialistId: specialist.id,
          createdAt: oldDate,
          updatedAt: oldDate,
        },
      })

      const gigMid = await tx.gig.create({
        data: {
          title: 'Mid Gig',
          description: 'Test description',
          acceptanceCriteria: 'Test criteria that is long enough to pass validation',
          budget: 10000000,
          serviceFee: 1000000,
          totalAmount: 11000000,
          status: 'IN_PROGRESS',
          clientId: client.id,
          assignedSpecialistId: specialist.id,
          createdAt: midDate,
          updatedAt: midDate,
        },
      })

      const gigNew = await tx.gig.create({
        data: {
          title: 'New Gig',
          description: 'Test description',
          acceptanceCriteria: 'Test criteria that is long enough to pass validation',
          budget: 10000000,
          serviceFee: 1000000,
          totalAmount: 11000000,
          status: 'IN_PROGRESS',
          clientId: client.id,
          assignedSpecialistId: specialist.id,
          createdAt: newDate,
          updatedAt: newDate,
        },
      })

      // Query active gigs
      const activeGigs = await tx.gig.findMany({
        where: {
          assignedSpecialistId: specialist.id,
          status: { in: ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] }
        },
        include: {
          client: {
            select: {
              email: true,
              clientProfile: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })

      expect(activeGigs).toHaveLength(3)
      expect(activeGigs[0].id).toBe(gigNew.id)
      expect(activeGigs[1].id).toBe(gigMid.id)
      expect(activeGigs[2].id).toBe(gigOld.id)
    })
  })

  it('includes client and clientProfile relations', async () => {
    await withTestTransaction(async (tx) => {
      // Create specialist, client with profile
      const specialist = await createTestUser(tx, {
        email: 'specialist@test.com',
        role: 'SPECIALIST',
        techStack: 'React, Node.js',
        experienceLevel: 'SENIOR'
      })

      const client = await createTestUser(tx, {
        email: 'client@test.com',
        role: 'CLIENT',
        companyName: 'Test Company',
        inn: '1234567890'
      })

      // Create gig assigned to specialist
      await createTestGig(tx, {
        title: 'Test Gig',
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      // Query active gigs
      const activeGigs = await tx.gig.findMany({
        where: {
          assignedSpecialistId: specialist.id,
          status: { in: ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] }
        },
        include: {
          client: {
            select: {
              email: true,
              clientProfile: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })

      expect(activeGigs).toHaveLength(1)
      expect(activeGigs[0].client).toBeDefined()
      expect(activeGigs[0].client.email).toBe('client@test.com')
      expect(activeGigs[0].client.clientProfile).toBeDefined()
      expect(activeGigs[0].client.clientProfile?.companyName).toBe('Test Company')
      // Verify password is not included
      expect(activeGigs[0].client).not.toHaveProperty('password')
    })
  })
})
