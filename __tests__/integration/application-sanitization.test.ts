import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'

// Mock @/lib/prisma to use test database
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
    set: vi.fn(),
    delete: vi.fn()
  }))
}))

// Mock next/navigation redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  })
}))

// Import after mocks
import { applyToGig } from '@/app/actions/gig'

describe('Application Sanitization Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  describe('XSS Sanitization in Applications', () => {
    it('sanitizes XSS in approach field', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)

      // Create client and gig
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig',
          description: 'Test description',
          acceptanceCriteria: 'Test criteria',
          budget: 10000000,
          serviceFee: 1000000,
          totalAmount: 11000000,
          tags: 'React',
          clientId: client.id,
          status: 'OPEN'
        }
      })

      // Create specialist
      const specialist = await prisma.user.create({
        data: {
          email: `specialist-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'SPECIALIST'
        }
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', '<script>alert("XSS")</script>I will use React and TypeScript to build a robust solution. My approach involves setting up the project structure first, then implementing core features with proper testing. This is more than 100 characters.')
      formData.append('questions', 'What is the expected timeline? Do you have design mockups?')

      await withAuthContext(specialist, async () => {
        try {
          await applyToGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain(`NEXT_REDIRECT:/gigs/${gig.id}`)
        }
      })

      // Verify approach is sanitized
      const applications = await prisma.application.findMany({
        where: { specialistId: specialist.id }
      })
      expect(applications.length).toBe(1)
      expect(applications[0].approach).not.toContain('<script>')
      expect(applications[0].approach).not.toContain('alert')
      expect(applications[0].approach).toContain('I will use React and TypeScript')

      // Cleanup
      await prisma.application.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('sanitizes XSS in questions field', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)

      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig',
          description: 'Test description',
          acceptanceCriteria: 'Test criteria',
          budget: 10000000,
          serviceFee: 1000000,
          totalAmount: 11000000,
          tags: 'React',
          clientId: client.id,
          status: 'OPEN'
        }
      })

      const specialist = await prisma.user.create({
        data: {
          email: `specialist-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'SPECIALIST'
        }
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'I will use React and TypeScript to build a robust solution. My approach involves setting up the project structure first, then implementing core features with proper testing.')
      formData.append('questions', '<img src=x onerror="alert(\'XSS\')">What is the expected timeline? Do you have design mockups?')

      await withAuthContext(specialist, async () => {
        try {
          await applyToGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain(`NEXT_REDIRECT:/gigs/${gig.id}`)
        }
      })

      // Verify questions are sanitized
      const applications = await prisma.application.findMany({
        where: { specialistId: specialist.id }
      })
      expect(applications.length).toBe(1)
      expect(applications[0].questions).not.toContain('<img')
      expect(applications[0].questions).not.toContain('onerror')
      expect(applications[0].questions).toContain('What is the expected timeline')

      // Cleanup
      await prisma.application.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('sanitizes XSS in estimatedEffort field', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)

      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig',
          description: 'Test description',
          acceptanceCriteria: 'Test criteria',
          budget: 10000000,
          serviceFee: 1000000,
          totalAmount: 11000000,
          tags: 'React',
          clientId: client.id,
          status: 'OPEN'
        }
      })

      const specialist = await prisma.user.create({
        data: {
          email: `specialist-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'SPECIALIST'
        }
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'I will use React and TypeScript to build a robust solution. My approach involves setting up the project structure first, then implementing core features with proper testing.')
      formData.append('questions', 'What is the expected timeline? Do you have design mockups?')
      formData.append('estimatedEffort', '<svg onload="alert(\'XSS\')">2-3 weeks</svg>')

      await withAuthContext(specialist, async () => {
        try {
          await applyToGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain(`NEXT_REDIRECT:/gigs/${gig.id}`)
        }
      })

      // Verify estimatedEffort is sanitized
      const applications = await prisma.application.findMany({
        where: { specialistId: specialist.id }
      })
      expect(applications.length).toBe(1)
      expect(applications[0].estimatedEffort).toBe('2-3 weeks')
      expect(applications[0].estimatedEffort).not.toContain('<svg')
      expect(applications[0].estimatedEffort).not.toContain('onload')

      // Cleanup
      await prisma.application.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('rejects application when approach is only XSS (too short after sanitization)', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)

      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig',
          description: 'Test description',
          acceptanceCriteria: 'Test criteria',
          budget: 10000000,
          serviceFee: 1000000,
          totalAmount: 11000000,
          tags: 'React',
          clientId: client.id,
          status: 'OPEN'
        }
      })

      const specialist = await prisma.user.create({
        data: {
          email: `specialist-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'SPECIALIST'
        }
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', '<script>alert("XSS")</script>Short')
      formData.append('questions', 'What is the expected timeline? Do you have design mockups?')

      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData)
      })

      expect(result).toEqual({
        error: 'Technical approach must be at least 100 characters. Please provide more detail about your methodology.'
      })

      // Verify no application created
      const applications = await prisma.application.findMany({
        where: { specialistId: specialist.id }
      })
      expect(applications.length).toBe(0)

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })
  })
})
