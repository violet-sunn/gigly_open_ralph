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

// Import server action after mocks
import { withdrawApplication } from '@/app/actions/gig'

describe('withdrawApplication action', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  it('successfully withdraws PENDING application', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const gig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'OPEN',
    })

    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'PENDING',
    })

    const formData = new FormData()
    formData.append('applicationId', application.id)

    await withAuthContext(specialist, async () => {
      try {
        await withdrawApplication(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
        expect(error.message).toContain(`/gigs/${gig.id}`)
      }
    })

    // Verify application status updated
    const updatedApp = await prisma.application.findUnique({
      where: { id: application.id },
    })
    expect(updatedApp?.status).toBe('WITHDRAWN')
  })

  it('rejects CLIENT role', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const gig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'OPEN',
    })

    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'PENDING',
    })

    const formData = new FormData()
    formData.append('applicationId', application.id)

    const result = await withAuthContext(client, async () => {
      return withdrawApplication(null, formData)
    })

    expect(result).toEqual({ error: 'Only specialists can withdraw applications.' })

    // Verify application status unchanged
    const updatedApp = await prisma.application.findUnique({
      where: { id: application.id },
    })
    expect(updatedApp?.status).toBe('PENDING')
  })

  it('redirects unauthenticated user', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const gig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'OPEN',
    })

    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'PENDING',
    })

    const formData = new FormData()
    formData.append('applicationId', application.id)

    // Should redirect to /login
    try {
      await withdrawApplication(null, formData)
      throw new Error('Expected redirect, but action succeeded')
    } catch (error: any) {
      expect(error.message).toContain('NEXT_REDIRECT')
      expect(error.message).toContain('/login')
    }
  })

  it('rejects non-owner specialist', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const otherSpecialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const gig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'OPEN',
    })

    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'PENDING',
    })

    const formData = new FormData()
    formData.append('applicationId', application.id)

    const result = await withAuthContext(otherSpecialist, async () => {
      return withdrawApplication(null, formData)
    })

    expect(result).toEqual({ error: 'You can only withdraw your own applications.' })

    // Verify application status unchanged
    const updatedApp = await prisma.application.findUnique({
      where: { id: application.id },
    })
    expect(updatedApp?.status).toBe('PENDING')
  })

  it('rejects ACCEPTED application', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const gig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'OPEN',
    })

    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'ACCEPTED',
    })

    const formData = new FormData()
    formData.append('applicationId', application.id)

    const result = await withAuthContext(specialist, async () => {
      return withdrawApplication(null, formData)
    })

    expect(result).toEqual({ error: 'Only pending applications can be withdrawn.' })

    // Verify application status unchanged
    const updatedApp = await prisma.application.findUnique({
      where: { id: application.id },
    })
    expect(updatedApp?.status).toBe('ACCEPTED')
  })

  it('rejects REJECTED application', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const gig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'OPEN',
    })

    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'REJECTED',
    })

    const formData = new FormData()
    formData.append('applicationId', application.id)

    const result = await withAuthContext(specialist, async () => {
      return withdrawApplication(null, formData)
    })

    expect(result).toEqual({ error: 'Only pending applications can be withdrawn.' })

    // Verify application status unchanged
    const updatedApp = await prisma.application.findUnique({
      where: { id: application.id },
    })
    expect(updatedApp?.status).toBe('REJECTED')
  })

  it('rejects already WITHDRAWN application (idempotency)', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const gig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'OPEN',
    })

    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'WITHDRAWN',
    })

    const formData = new FormData()
    formData.append('applicationId', application.id)

    const result = await withAuthContext(specialist, async () => {
      return withdrawApplication(null, formData)
    })

    expect(result).toEqual({ error: 'This application has already been withdrawn.' })
  })

  it('rejects withdrawal from closed gig', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const gig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'OPEN',
      closedByAdmin: true,
    })

    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'PENDING',
    })

    const formData = new FormData()
    formData.append('applicationId', application.id)

    const result = await withAuthContext(specialist, async () => {
      return withdrawApplication(null, formData)
    })

    expect(result).toEqual({ error: 'Cannot withdraw applications from closed gigs.' })

    // Verify application status unchanged
    const updatedApp = await prisma.application.findUnique({
      where: { id: application.id },
    })
    expect(updatedApp?.status).toBe('PENDING')
  })

  it('rejects withdrawal from example gig', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const gig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'OPEN',
      isExample: true,
    })

    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'PENDING',
    })

    const formData = new FormData()
    formData.append('applicationId', application.id)

    const result = await withAuthContext(specialist, async () => {
      return withdrawApplication(null, formData)
    })

    expect(result).toEqual({ error: 'Cannot withdraw applications from example gigs.' })

    // Verify application status unchanged
    const updatedApp = await prisma.application.findUnique({
      where: { id: application.id },
    })
    expect(updatedApp?.status).toBe('PENDING')
  })

  it('returns error for non-existent application', async () => {
    const prisma = getTestPrismaClient()

    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const formData = new FormData()
    formData.append('applicationId', 'non-existent-id')

    const result = await withAuthContext(specialist, async () => {
      return withdrawApplication(null, formData)
    })

    expect(result).toEqual({ error: 'Application not found.' })
  })
})
