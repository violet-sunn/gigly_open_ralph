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
import { createGig, applyToGig, sendMessage } from '@/app/actions/gig'
import { updateProfile } from '@/app/actions/profile'

describe('Comprehensive XSS Protection Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  // Common XSS payloads from OWASP XSS cheat sheet
  const xssPayloads = [
    { name: 'script tag', payload: '<script>alert("XSS")</script>' },
    { name: 'img onerror', payload: '<img src=x onerror="alert(\'XSS\')">' },
    { name: 'svg onload', payload: '<svg onload="alert(\'XSS\')">' },
    { name: 'iframe javascript', payload: '<iframe src="javascript:alert(\'XSS\')"></iframe>' },
    { name: 'anchor javascript', payload: '<a href="javascript:alert(\'XSS\')">click</a>' },
    { name: 'input onfocus', payload: '<input onfocus="alert(\'XSS\')" autofocus>' },
    { name: 'body onload', payload: '<body onload="alert(\'XSS\')">' },
    { name: 'div style javascript', payload: '<div style="background:url(\'javascript:alert(1)\')">text</div>' },
    { name: 'object data', payload: '<object data="javascript:alert(\'XSS\')"></object>' },
    { name: 'embed src', payload: '<embed src="javascript:alert(\'XSS\')">' },
  ]

  describe('Gig Creation XSS Protection', () => {
    xssPayloads.forEach(({ name, payload }) => {
      it(`blocks ${name} in gig title`, async () => {
        const prisma = getTestPrismaClient()

        const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
        const client = await prisma.user.create({
          data: {
            email: `client-${Date.now()}@example.com`,
            password: hashedPassword,
            role: 'CLIENT'
          }
        })

        const formData = new FormData()
        formData.append('title', `${payload}Safe Title`)
        formData.append('description', 'Test description of the work item')
        formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
        formData.append('goal', 'Достичь конкретного бизнес-результата')
        formData.append('deliverables', 'Рабочий код, документация и тесты')
        formData.append('budget', '100000')

        await withAuthContext(client, async () => {
          try {
            await createGig(null, formData)
          } catch (error: any) {
            expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
          }
        })

        // Verify XSS payload removed
        const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
        expect(gigs.length).toBeGreaterThan(0)
        expect(gigs[0].title).not.toContain('<')
        expect(gigs[0].title).not.toContain('>')
        expect(gigs[0].title).not.toContain('javascript:')
        expect(gigs[0].title).not.toContain('alert')
        expect(gigs[0].title).not.toContain('onerror')
        expect(gigs[0].title).not.toContain('onload')

        // Cleanup
        await prisma.gig.deleteMany({ where: { clientId: client.id } })
        await prisma.user.delete({ where: { id: client.id } })
      })
    })
  })

  describe('Application Submission XSS Protection', () => {
    xssPayloads.slice(0, 5).forEach(({ name, payload }) => {
      it(`blocks ${name} in application approach`, async () => {
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
            description: 'Test description of the work item',
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
        formData.append('approach', `${payload}I will use React and TypeScript to build a robust solution. My approach involves setting up the project structure first, then implementing core features with proper testing.`)
        formData.append('questions', 'What is the expected timeline? Do you have design mockups?')

        await withAuthContext(specialist, async () => {
          try {
            await applyToGig(null, formData)
          } catch (error: any) {
            expect(error.message).toContain(`NEXT_REDIRECT:/gigs/${gig.id}`)
          }
        })

        // Verify XSS payload removed
        const applications = await prisma.application.findMany({
          where: { specialistId: specialist.id }
        })
        expect(applications.length).toBe(1)
        expect(applications[0].approach).not.toContain('<')
        expect(applications[0].approach).not.toContain('>')
        expect(applications[0].approach).not.toContain('javascript:')
        expect(applications[0].approach).not.toContain('alert')

        // Cleanup
        await prisma.application.deleteMany({ where: { gigId: gig.id } })
        await prisma.gig.delete({ where: { id: gig.id } })
        await prisma.user.delete({ where: { id: client.id } })
        await prisma.user.delete({ where: { id: specialist.id } })
      })
    })
  })

  describe('Message XSS Protection', () => {
    xssPayloads.slice(0, 5).forEach(({ name, payload }) => {
      it(`blocks ${name} in message content`, async () => {
        const prisma = getTestPrismaClient()

        const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)

        const client = await prisma.user.create({
          data: {
            email: `client-${Date.now()}@example.com`,
            password: hashedPassword,
            role: 'CLIENT'
          }
        })

        const specialist = await prisma.user.create({
          data: {
            email: `specialist-${Date.now()}@example.com`,
            password: hashedPassword,
            role: 'SPECIALIST'
          }
        })

        const gig = await prisma.gig.create({
          data: {
            title: 'Test Gig',
            description: 'Test description of the work item',
            acceptanceCriteria: 'Test criteria',
            budget: 10000000,
            serviceFee: 1000000,
            totalAmount: 11000000,
            tags: 'React',
            clientId: client.id,
            status: 'IN_PROGRESS',
            assignedSpecialistId: specialist.id
          }
        })

        const formData = new FormData()
        formData.append('gigId', gig.id)
        formData.append('content', `${payload}Hello, how is the progress?`)

        await withAuthContext(client, async () => {
          try {
            await sendMessage(null, formData)
          } catch (error: any) {
            expect(error.message).toContain(`NEXT_REDIRECT:/gigs/${gig.id}`)
          }
        })

        // Verify XSS payload removed
        const messages = await prisma.message.findMany({
          where: { gigId: gig.id }
        })
        expect(messages.length).toBe(1)
        expect(messages[0].content).not.toContain('<')
        expect(messages[0].content).not.toContain('>')
        expect(messages[0].content).not.toContain('javascript:')
        expect(messages[0].content).not.toContain('alert')

        // Cleanup
        await prisma.message.deleteMany({ where: { gigId: gig.id } })
        await prisma.gig.delete({ where: { id: gig.id } })
        await prisma.user.delete({ where: { id: client.id } })
        await prisma.user.delete({ where: { id: specialist.id } })
      })
    })
  })

  describe('Profile XSS Protection', () => {
    xssPayloads.slice(0, 5).forEach(({ name, payload }) => {
      it(`blocks ${name} in CLIENT profile`, async () => {
        const prisma = getTestPrismaClient()

        const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
        const client = await prisma.user.create({
          data: {
            email: `client-${Date.now()}@example.com`,
            password: hashedPassword,
            role: 'CLIENT'
          }
        })

        const formData = new FormData()
        formData.append('companyName', `${payload}Tech Corp`)
        formData.append('inn', '1234567890')

        await withAuthContext(client, async () => {
          try {
            await updateProfile(null, formData)
          } catch (error: any) {
            expect(error.message).toContain('NEXT_REDIRECT:/profile')
          }
        })

        // Verify XSS payload removed
        const profile = await prisma.clientProfile.findUnique({
          where: { userId: client.id }
        })
        expect(profile).not.toBeNull()
        expect(profile!.companyName).not.toContain('<')
        expect(profile!.companyName).not.toContain('>')
        expect(profile!.companyName).not.toContain('javascript:')
        expect(profile!.companyName).not.toContain('alert')

        // Cleanup
        await prisma.clientProfile.delete({ where: { userId: client.id } })
        await prisma.user.delete({ where: { id: client.id } })
      })

      it(`blocks ${name} in SPECIALIST profile`, async () => {
        const prisma = getTestPrismaClient()

        const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
        const specialist = await prisma.user.create({
          data: {
            email: `specialist-${Date.now()}@example.com`,
            password: hashedPassword,
            role: 'SPECIALIST'
          }
        })

        const formData = new FormData()
        formData.append('displayName', 'John Developer')
        formData.append('techStack', `${payload}React, TypeScript`)
        formData.append('experienceLevel', 'SENIOR')

        await withAuthContext(specialist, async () => {
          try {
            await updateProfile(null, formData)
          } catch (error: any) {
            expect(error.message).toContain('NEXT_REDIRECT:/profile')
          }
        })

        // Verify XSS payload removed
        const profile = await prisma.specialistProfile.findUnique({
          where: { userId: specialist.id }
        })
        expect(profile).not.toBeNull()
        expect(profile!.techStack).not.toContain('<')
        expect(profile!.techStack).not.toContain('>')
        expect(profile!.techStack).not.toContain('javascript:')
        expect(profile!.techStack).not.toContain('alert')

        // Cleanup
        await prisma.specialistProfile.delete({ where: { userId: specialist.id } })
        await prisma.user.delete({ where: { id: specialist.id } })
      })
    })
  })

  describe('Data Safety Verification', () => {
    it('ensures stored data is safe to display in UI', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      // Create gig with multiple XSS attempts
      const formData = new FormData()
      formData.append('title', '<script>alert(1)</script><img onerror="alert(2)">Safe Title')
      formData.append('description', '<svg onload="alert(3)">Description with <a href="javascript:alert(4)">link</a>')
      formData.append('acceptanceCriteria', '<iframe src="javascript:alert(5)"></iframe>This is acceptance criteria with more than 50 characters after sanitization')
      formData.append('goal', 'Достичь конкретного бизнес-результата')
      formData.append('deliverables', 'Рабочий код, документация и тесты')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify all dangerous content removed
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)

      const gig = gigs[0]

      // No executable scripts
      expect(gig.title).not.toMatch(/<script/i)
      expect(gig.description).not.toMatch(/<script/i)
      expect(gig.acceptanceCriteria).not.toMatch(/<script/i)

      // No event handlers
      expect(gig.title).not.toMatch(/on\w+=/i)
      expect(gig.description).not.toMatch(/on\w+=/i)
      expect(gig.acceptanceCriteria).not.toMatch(/on\w+=/i)

      // No javascript: protocol
      expect(gig.title).not.toContain('javascript:')
      expect(gig.description).not.toContain('javascript:')
      expect(gig.acceptanceCriteria).not.toContain('javascript:')

      // No dangerous tags
      const dangerousTags = ['<iframe', '<object', '<embed', '<svg', '<img']
      dangerousTags.forEach(tag => {
        expect(gig.title).not.toContain(tag)
        expect(gig.description).not.toContain(tag)
        expect(gig.acceptanceCriteria).not.toContain(tag)
      })

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })
})
