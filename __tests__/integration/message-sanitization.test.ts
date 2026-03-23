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
import { sendMessage } from '@/app/actions/gig'

describe('Message Sanitization Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  describe('XSS Sanitization in Messages', () => {
    it('sanitizes XSS in message content', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)

      // Create client and specialist
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

      // Create gig with assigned specialist
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
          status: 'IN_PROGRESS',
          assignedSpecialistId: specialist.id
        }
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', '<script>alert("XSS")</script>Hello, how is the progress?')

      await withAuthContext(client, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain(`NEXT_REDIRECT:/gigs/${gig.id}`)
        }
      })

      // Verify message content is sanitized
      const messages = await prisma.message.findMany({
        where: { gigId: gig.id }
      })
      expect(messages.length).toBe(1)
      expect(messages[0].content).toBe('Hello, how is the progress?')
      expect(messages[0].content).not.toContain('<script>')
      expect(messages[0].content).not.toContain('alert')

      // Cleanup
      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('rejects message when content is only XSS (empty after sanitization)', async () => {
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
          description: 'Test description',
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
      formData.append('content', '<script></script>')

      const result = await withAuthContext(client, async () => {
        return await sendMessage(null, formData)
      })

      expect(result).toEqual({ error: 'Message cannot be empty. Please enter a message to send.' })

      // Verify no message created
      const messages = await prisma.message.findMany({
        where: { gigId: gig.id }
      })
      expect(messages.length).toBe(0)

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('preserves line breaks in sanitized messages', async () => {
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
          description: 'Test description',
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
      formData.append('content', 'Line 1\nLine 2\nLine 3')

      await withAuthContext(client, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain(`NEXT_REDIRECT:/gigs/${gig.id}`)
        }
      })

      // Verify line breaks preserved
      const messages = await prisma.message.findMany({
        where: { gigId: gig.id }
      })
      expect(messages.length).toBe(1)
      expect(messages[0].content).toBe('Line 1\nLine 2\nLine 3')
      expect(messages[0].content).toContain('\n')

      // Cleanup
      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('validates length on sanitized content', async () => {
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
          description: 'Test description',
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

      // Create content with 1900 chars of text + HTML tags
      const textContent = 'a'.repeat(1900)
      const htmlTags = '<script>alert("XSS")</script><img src=x onerror="alert(1)">'
      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', textContent + htmlTags)

      await withAuthContext(client, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain(`NEXT_REDIRECT:/gigs/${gig.id}`)
        }
      })

      // Verify message accepted (sanitized content is under 2000 chars)
      const messages = await prisma.message.findMany({
        where: { gigId: gig.id }
      })
      expect(messages.length).toBe(1)
      expect(messages[0].content).toBe(textContent)
      expect(messages[0].content.length).toBe(1900)

      // Cleanup
      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })
  })
})
