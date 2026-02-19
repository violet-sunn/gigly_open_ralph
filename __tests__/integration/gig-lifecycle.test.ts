import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { createTestUser, createTestGig, createTestApplication } from '../helpers/seed'

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

// Import server actions after mocks
import { acceptApplication, submitWork, approveWork, markAsPaid } from '@/app/actions/gig'

describe('Gig Lifecycle Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  describe('State transitions', () => {
    it('transitions OPEN → IN_PROGRESS on application acceptance', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist1 = await createTestUser(prisma, { role: 'SPECIALIST' })
      const specialist2 = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'OPEN'
      })

      const app1 = await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist1.id,
        status: 'PENDING'
      })

      const app2 = await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist2.id,
        status: 'PENDING'
      })

      // Accept application as gig owner
      const formData = new FormData()
      formData.append('applicationId', app1.id)

      await withAuthContext(client, async () => {
        try {
          await acceptApplication(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      // Verify gig status changed to IN_PROGRESS
      const updatedGig = await prisma.gig.findUnique({
        where: { id: gig.id }
      })
      expect(updatedGig!.status).toBe('IN_PROGRESS')
      expect(updatedGig!.assignedSpecialistId).toBe(specialist1.id)

      // Verify accepted application status
      const updatedApp1 = await prisma.application.findUnique({
        where: { id: app1.id }
      })
      expect(updatedApp1!.status).toBe('ACCEPTED')

      // Verify other application was auto-rejected
      const updatedApp2 = await prisma.application.findUnique({
        where: { id: app2.id }
      })
      expect(updatedApp2!.status).toBe('REJECTED')

      // Cleanup
      await prisma.application.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist1.id } })
      await prisma.user.delete({ where: { id: specialist2.id } })
    })

    it('auto-rejects other applications on acceptance', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist1 = await createTestUser(prisma, { role: 'SPECIALIST' })
      const specialist2 = await createTestUser(prisma, { role: 'SPECIALIST' })
      const specialist3 = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'OPEN'
      })

      const app1 = await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist1.id,
        status: 'PENDING'
      })

      const app2 = await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist2.id,
        status: 'PENDING'
      })

      const app3 = await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist3.id,
        status: 'PENDING'
      })

      // Accept one application
      const formData = new FormData()
      formData.append('applicationId', app2.id)

      await withAuthContext(client, async () => {
        try {
          await acceptApplication(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      // Verify accepted application
      const updatedApp2 = await prisma.application.findUnique({
        where: { id: app2.id }
      })
      expect(updatedApp2!.status).toBe('ACCEPTED')

      // Verify other applications are rejected
      const updatedApp1 = await prisma.application.findUnique({
        where: { id: app1.id }
      })
      expect(updatedApp1!.status).toBe('REJECTED')

      const updatedApp3 = await prisma.application.findUnique({
        where: { id: app3.id }
      })
      expect(updatedApp3!.status).toBe('REJECTED')

      // Cleanup
      await prisma.application.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist1.id } })
      await prisma.user.delete({ where: { id: specialist2.id } })
      await prisma.user.delete({ where: { id: specialist3.id } })
    })

    it('transitions IN_PROGRESS → REVIEW on work submission', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      // Submit work as assigned specialist
      const formData = new FormData()
      formData.append('gigId', gig.id)

      await withAuthContext(specialist, async () => {
        try {
          await submitWork(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      // Verify gig status changed to REVIEW
      const updatedGig = await prisma.gig.findUnique({
        where: { id: gig.id }
      })
      expect(updatedGig!.status).toBe('REVIEW')

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('transitions REVIEW → COMPLETED on work approval', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'REVIEW',
        assignedSpecialistId: specialist.id
      })

      // Approve work as gig owner
      const formData = new FormData()
      formData.append('gigId', gig.id)

      await withAuthContext(client, async () => {
        try {
          await approveWork(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      // Verify gig status changed to COMPLETED
      const updatedGig = await prisma.gig.findUnique({
        where: { id: gig.id }
      })
      expect(updatedGig!.status).toBe('COMPLETED')

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('transitions COMPLETED → PAID on payment marking', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'COMPLETED',
        assignedSpecialistId: specialist.id
      })

      // Mark as paid as gig owner
      const formData = new FormData()
      formData.append('gigId', gig.id)

      await withAuthContext(client, async () => {
        try {
          await markAsPaid(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      // Verify gig status changed to PAID
      const updatedGig = await prisma.gig.findUnique({
        where: { id: gig.id }
      })
      expect(updatedGig!.status).toBe('PAID')
      expect(updatedGig!.paidAt).toBeDefined()
      expect(updatedGig!.paidAt).toBeInstanceOf(Date)

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('completes full lifecycle flow (OPEN → PAID)', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      // Create gig in OPEN state
      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'OPEN'
      })

      const application = await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist.id,
        status: 'PENDING'
      })

      // Step 1: Accept application (OPEN → IN_PROGRESS)
      let formData = new FormData()
      formData.append('applicationId', application.id)

      await withAuthContext(client, async () => {
        try {
          await acceptApplication(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      let updatedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
      expect(updatedGig!.status).toBe('IN_PROGRESS')

      // Step 2: Submit work (IN_PROGRESS → REVIEW)
      formData = new FormData()
      formData.append('gigId', gig.id)

      await withAuthContext(specialist, async () => {
        try {
          await submitWork(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      updatedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
      expect(updatedGig!.status).toBe('REVIEW')

      // Step 3: Approve work (REVIEW → COMPLETED)
      formData = new FormData()
      formData.append('gigId', gig.id)

      await withAuthContext(client, async () => {
        try {
          await approveWork(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      updatedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
      expect(updatedGig!.status).toBe('COMPLETED')

      // Step 4: Mark as paid (COMPLETED → PAID)
      formData = new FormData()
      formData.append('gigId', gig.id)

      await withAuthContext(client, async () => {
        try {
          await markAsPaid(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      updatedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
      expect(updatedGig!.status).toBe('PAID')
      expect(updatedGig!.paidAt).toBeDefined()

      // Cleanup
      await prisma.application.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })
  })

  describe('Invalid transitions', () => {
    it('rejects invalid transition (OPEN → REVIEW)', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'OPEN'
      })

      // Attempt to approve work on OPEN gig
      const formData = new FormData()
      formData.append('gigId', gig.id)

      await withAuthContext(client, async () => {
        const result = await approveWork(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toContain('can only be approved for gigs under review')
      })

      // Verify gig status unchanged
      const updatedGig = await prisma.gig.findUnique({
        where: { id: gig.id }
      })
      expect(updatedGig!.status).toBe('OPEN')

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('cannot submit work on OPEN gig', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'OPEN'
      })

      // Attempt to submit work on OPEN gig
      const formData = new FormData()
      formData.append('gigId', gig.id)

      await withAuthContext(specialist, async () => {
        const result = await submitWork(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toContain('can only be submitted for gigs in progress')
      })

      // Verify gig status unchanged
      const updatedGig = await prisma.gig.findUnique({
        where: { id: gig.id }
      })
      expect(updatedGig!.status).toBe('OPEN')

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('cannot approve work on IN_PROGRESS gig', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      // Attempt to approve work on IN_PROGRESS gig
      const formData = new FormData()
      formData.append('gigId', gig.id)

      await withAuthContext(client, async () => {
        const result = await approveWork(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toContain('can only be approved for gigs under review')
      })

      // Verify gig status unchanged
      const updatedGig = await prisma.gig.findUnique({
        where: { id: gig.id }
      })
      expect(updatedGig!.status).toBe('IN_PROGRESS')

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('cannot mark as paid on REVIEW gig', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'REVIEW',
        assignedSpecialistId: specialist.id
      })

      // Attempt to mark as paid on REVIEW gig
      const formData = new FormData()
      formData.append('gigId', gig.id)

      await withAuthContext(client, async () => {
        const result = await markAsPaid(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toContain('Only completed gigs can be marked as paid')
      })

      // Verify gig status unchanged
      const updatedGig = await prisma.gig.findUnique({
        where: { id: gig.id }
      })
      expect(updatedGig!.status).toBe('REVIEW')

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })
  })

  describe('Authorization checks', () => {
    it('non-owner cannot accept application', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const otherClient = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'OPEN'
      })

      const application = await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist.id,
        status: 'PENDING'
      })

      // Attempt to accept as different client
      const formData = new FormData()
      formData.append('applicationId', application.id)

      await withAuthContext(otherClient, async () => {
        const result = await acceptApplication(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toContain('Only the gig owner can manage applications')
      })

      // Verify gig status unchanged
      const updatedGig = await prisma.gig.findUnique({
        where: { id: gig.id }
      })
      expect(updatedGig!.status).toBe('OPEN')

      // Cleanup
      await prisma.application.delete({ where: { id: application.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: otherClient.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('non-owner cannot approve work', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const otherClient = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'REVIEW',
        assignedSpecialistId: specialist.id
      })

      // Attempt to approve as different client
      const formData = new FormData()
      formData.append('gigId', gig.id)

      await withAuthContext(otherClient, async () => {
        const result = await approveWork(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toContain('Only the gig owner can approve work')
      })

      // Verify gig status unchanged
      const updatedGig = await prisma.gig.findUnique({
        where: { id: gig.id }
      })
      expect(updatedGig!.status).toBe('REVIEW')

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: otherClient.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('non-owner cannot mark as paid', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const otherClient = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'COMPLETED',
        assignedSpecialistId: specialist.id
      })

      // Attempt to mark as paid as different client
      const formData = new FormData()
      formData.append('gigId', gig.id)

      await withAuthContext(otherClient, async () => {
        const result = await markAsPaid(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toContain('Only the gig owner can mark this gig as paid')
      })

      // Verify gig status unchanged
      const updatedGig = await prisma.gig.findUnique({
        where: { id: gig.id }
      })
      expect(updatedGig!.status).toBe('COMPLETED')

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: otherClient.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('non-assigned specialist cannot submit work', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const assignedSpecialist = await createTestUser(prisma, { role: 'SPECIALIST' })
      const otherSpecialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: assignedSpecialist.id
      })

      // Attempt to submit work as different specialist
      const formData = new FormData()
      formData.append('gigId', gig.id)

      await withAuthContext(otherSpecialist, async () => {
        const result = await submitWork(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toContain('Only the assigned specialist can submit work')
      })

      // Verify gig status unchanged
      const updatedGig = await prisma.gig.findUnique({
        where: { id: gig.id }
      })
      expect(updatedGig!.status).toBe('IN_PROGRESS')

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: assignedSpecialist.id } })
      await prisma.user.delete({ where: { id: otherSpecialist.id } })
    })
  })
})
