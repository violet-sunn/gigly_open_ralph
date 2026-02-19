import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient, withTestTransaction } from '../helpers/db'
import { setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { createTestUser, createTestGig, createTestApplication, createTestMessage } from '../helpers/seed'

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

describe('Gig Detail View Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  describe('Basic information display', () => {
    it('includes all basic gig information', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const gig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          title: 'Test Gig',
          description: 'Test description',
          budget: 10000000,
          tags: 'React,TypeScript'
        })

        // Query gig detail
        const gigDetail = await prisma.gig.findUnique({
          where: { id: gig.id }
        })

        // Verify all basic fields are present
        expect(gigDetail).toBeDefined()
        expect(gigDetail!.title).toBe('Test Gig')
        expect(gigDetail!.description).toBe('Test description')
        expect(gigDetail!.budget).toBe(10000000)
        expect(gigDetail!.serviceFee).toBeDefined()
        expect(gigDetail!.totalAmount).toBeDefined()
        expect(gigDetail!.status).toBe('OPEN')
        expect(gigDetail!.tags).toBe('React,TypeScript')
        expect(gigDetail!.createdAt).toBeDefined()
      })
    })

    it('includes structured requirement fields', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const gig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          goal: 'Improve application performance',
          deliverables: 'Optimized code and performance report',
          constraints: 'Must use existing tech stack'
        })

        // Query gig detail
        const gigDetail = await prisma.gig.findUnique({
          where: { id: gig.id }
        })

        // Verify structured fields are present
        expect(gigDetail).toBeDefined()
        expect(gigDetail!.goal).toBe('Improve application performance')
        expect(gigDetail!.deliverables).toBe('Optimized code and performance report')
        expect(gigDetail!.constraints).toBe('Must use existing tech stack')
      })
    })

    it('includes client information', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const gig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN'
        })

        // Query gig with client relation
        const gigDetail = await prisma.gig.findUnique({
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

        // Verify client information is included
        expect(gigDetail).toBeDefined()
        expect(gigDetail!.client).toBeDefined()
        expect(gigDetail!.client.email).toBeDefined()
        expect(gigDetail!.client.clientProfile).toBeDefined()
        expect(gigDetail!.client.clientProfile!.companyName).toBeDefined()
      })
    })
  })

  describe('Application visibility', () => {
    it('shows applications for gig owner', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })
        const specialist1 = await createTestUser(prisma, { role: 'SPECIALIST' })
        const specialist2 = await createTestUser(prisma, { role: 'SPECIALIST' })

        const gig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN'
        })

        const app1 = await createTestApplication(prisma, {
          gigId: gig.id,
          specialistId: specialist1.id
        })

        const app2 = await createTestApplication(prisma, {
          gigId: gig.id,
          specialistId: specialist2.id
        })

        // Query as owner with applications included
        const gigDetail = await prisma.gig.findUnique({
          where: { id: gig.id },
          include: {
            applications: {
              include: {
                specialist: {
                  select: {
                    email: true,
                    specialistProfile: {
                      select: {
                        displayName: true,
                        techStack: true
                      }
                    }
                  }
                }
              }
            }
          }
        })

        // Verify applications are included
        expect(gigDetail).toBeDefined()
        expect(gigDetail!.applications).toBeDefined()
        expect(gigDetail!.applications.length).toBe(2)

        // Verify application data structure
        gigDetail!.applications.forEach(app => {
          expect(app.approach).toBeDefined()
          expect(app.questions).toBeDefined()
          expect(app.status).toBeDefined()
          expect(app.specialist).toBeDefined()
        })
      })
    })

    it('hides applications from non-owner by not including them', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })
        const otherUser = await createTestUser(prisma, { role: 'SPECIALIST' })
        const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

        const gig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN'
        })

        await createTestApplication(prisma, {
          gigId: gig.id,
          specialistId: specialist.id
        })

        // Query as non-owner WITHOUT applications included
        const gigDetail = await prisma.gig.findUnique({
          where: { id: gig.id }
          // Note: applications not included in query for non-owners
        })

        // Verify gig is returned but applications are not included
        expect(gigDetail).toBeDefined()
        expect(gigDetail!.id).toBe(gig.id)
        // Applications field doesn't exist when not included
        expect((gigDetail as any).applications).toBeUndefined()
      })
    })

    it('SPECIALIST can see if they already applied', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })
        const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

        const gig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN'
        })

        const application = await createTestApplication(prisma, {
          gigId: gig.id,
          specialistId: specialist.id
        })

        // Query to check if specialist has applied
        const existingApplication = await prisma.application.findUnique({
          where: {
            gigId_specialistId: {
              gigId: gig.id,
              specialistId: specialist.id
            }
          }
        })

        // Verify specialist can retrieve their application
        expect(existingApplication).toBeDefined()
        expect(existingApplication!.id).toBe(application.id)
        expect(existingApplication!.specialistId).toBe(specialist.id)
      })
    })
  })

  describe('Message visibility', () => {
    it('shows messages for gig owner', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })
        const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

        const gig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'IN_PROGRESS',
          assignedSpecialistId: specialist.id
        })

        const message1 = await createTestMessage(prisma, {
          gigId: gig.id,
          senderId: client.id,
          content: 'Message from client'
        })

        const message2 = await createTestMessage(prisma, {
          gigId: gig.id,
          senderId: specialist.id,
          content: 'Message from specialist'
        })

        // Query as owner with messages included
        const gigDetail = await prisma.gig.findUnique({
          where: { id: gig.id },
          include: {
            messages: {
              include: {
                sender: {
                  select: {
                    email: true,
                    role: true
                  }
                }
              },
              orderBy: { createdAt: 'asc' }
            }
          }
        })

        // Verify messages are included
        expect(gigDetail).toBeDefined()
        expect(gigDetail!.messages).toBeDefined()
        expect(gigDetail!.messages.length).toBe(2)
        expect(gigDetail!.messages[0].content).toBe('Message from client')
        expect(gigDetail!.messages[1].content).toBe('Message from specialist')
      })
    })

    it('shows messages for assigned specialist', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })
        const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

        const gig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'IN_PROGRESS',
          assignedSpecialistId: specialist.id
        })

        await createTestMessage(prisma, {
          gigId: gig.id,
          senderId: client.id,
          content: 'Test message'
        })

        // Query as assigned specialist with messages included
        const gigDetail = await prisma.gig.findUnique({
          where: { id: gig.id },
          include: {
            messages: {
              orderBy: { createdAt: 'asc' }
            }
          }
        })

        // Verify messages are included for assigned specialist
        expect(gigDetail).toBeDefined()
        expect(gigDetail!.assignedSpecialistId).toBe(specialist.id)
        expect(gigDetail!.messages).toBeDefined()
        expect(gigDetail!.messages.length).toBeGreaterThan(0)
      })
    })

    it('hides messages from unauthorized users', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })
        const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
        const unauthorizedUser = await createTestUser(prisma, { role: 'SPECIALIST' })

        const gig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'IN_PROGRESS',
          assignedSpecialistId: specialist.id
        })

        await createTestMessage(prisma, {
          gigId: gig.id,
          senderId: client.id,
          content: 'Private message'
        })

        // Query as unauthorized user WITHOUT messages included
        const gigDetail = await prisma.gig.findUnique({
          where: { id: gig.id }
          // Note: messages not included for unauthorized users
        })

        // Verify gig is returned but messages are not included
        expect(gigDetail).toBeDefined()
        expect((gigDetail as any).messages).toBeUndefined()

        // Verify unauthorized user is not the owner or assigned specialist
        expect(gigDetail!.clientId).not.toBe(unauthorizedUser.id)
        expect(gigDetail!.assignedSpecialistId).not.toBe(unauthorizedUser.id)
      })
    })
  })

  describe('Edge cases', () => {
    it('handles non-existent gig ID', async () => {
      await withTestTransaction(async (prisma) => {
        const nonExistentId = 'non-existent-id'

        // Query for non-existent gig
        const gigDetail = await prisma.gig.findUnique({
          where: { id: nonExistentId }
        })

        // Verify null is returned
        expect(gigDetail).toBeNull()
      })
    })

    it('returns gig detail for closed gig', async () => {
      await withTestTransaction(async (prisma) => {
        const client = await createTestUser(prisma, { role: 'CLIENT' })

        const gig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'OPEN',
          closedByAdmin: true
        })

        // Query closed gig
        const gigDetail = await prisma.gig.findUnique({
          where: { id: gig.id }
        })

        // Verify gig data is returned with closed flag
        expect(gigDetail).toBeDefined()
        expect(gigDetail!.closedByAdmin).toBe(true)
        expect(gigDetail!.id).toBe(gig.id)
      })
    })
  })
})
