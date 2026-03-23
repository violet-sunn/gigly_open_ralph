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
import { sendMessage } from '@/app/actions/gig'

describe('Messaging System Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  describe('Message Authorization', () => {
    it('CLIENT owner can send messages', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Добрый день! Как продвигается работа?')

      await withAuthContext(client, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
          expect(error.message).toContain(`/gigs/${gig.id}`)
        }
      })

      // Verify message was created
      const messages = await prisma.message.findMany({
        where: { gigId: gig.id }
      })
      expect(messages).toHaveLength(1)
      expect(messages[0].senderId).toBe(client.id)
      expect(messages[0].content).toBe('Добрый день! Как продвигается работа?')

      // Cleanup
      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('Assigned SPECIALIST can send messages', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Работа завершена, результаты в ветке feature/api.')

      await withAuthContext(specialist, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      // Verify message was created
      const messages = await prisma.message.findMany({
        where: { gigId: gig.id }
      })
      expect(messages).toHaveLength(1)
      expect(messages[0].senderId).toBe(specialist.id)
      expect(messages[0].content).toBe('Работа завершена, результаты в ветке feature/api.')

      // Cleanup
      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('Non-assigned SPECIALIST cannot send messages', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const assignedSpecialist = await createTestUser(prisma, { role: 'SPECIALIST' })
      const otherSpecialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: assignedSpecialist.id
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Unauthorized message attempt')

      await withAuthContext(otherSpecialist, async () => {
        const result = await sendMessage(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toBe('You can only send messages if you\'re the client who posted this gig or the assigned specialist.')
      })

      // Verify no message was created
      const messages = await prisma.message.findMany({
        where: { gigId: gig.id }
      })
      expect(messages).toHaveLength(0)

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: assignedSpecialist.id } })
      await prisma.user.delete({ where: { id: otherSpecialist.id } })
    })

    it('CLIENT non-owner cannot send messages', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const otherClient = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Unauthorized message attempt')

      await withAuthContext(otherClient, async () => {
        const result = await sendMessage(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toBe('You can only send messages if you\'re the client who posted this gig or the assigned specialist.')
      })

      // Verify no message was created
      const messages = await prisma.message.findMany({
        where: { gigId: gig.id }
      })
      expect(messages).toHaveLength(0)

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: otherClient.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('Unauthenticated user redirects to login', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Test message')

      try {
        await sendMessage(null, formData)
        expect(true).toBe(false) // Should not reach here
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
        expect(error.message).toContain('/login')
      }

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })
  })

  describe('Message Visibility', () => {
    it('Messages are scoped to specific gig', async () => {
      const prisma = getTestPrismaClient()

      const client1 = await createTestUser(prisma, { role: 'CLIENT' })
      const client2 = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist1 = await createTestUser(prisma, { role: 'SPECIALIST' })
      const specialist2 = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gigA = await createTestGig(prisma, {
        clientId: client1.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist1.id
      })

      const gigB = await createTestGig(prisma, {
        clientId: client2.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist2.id
      })

      // Send 2 messages to Gig A
      let formData = new FormData()
      formData.append('gigId', gigA.id)
      formData.append('content', 'Message 1 for Gig A')

      await withAuthContext(client1, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      formData = new FormData()
      formData.append('gigId', gigA.id)
      formData.append('content', 'Message 2 for Gig A')

      await withAuthContext(specialist1, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      // Send 3 messages to Gig B
      formData = new FormData()
      formData.append('gigId', gigB.id)
      formData.append('content', 'Message 1 for Gig B')

      await withAuthContext(client2, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      formData = new FormData()
      formData.append('gigId', gigB.id)
      formData.append('content', 'Message 2 for Gig B')

      await withAuthContext(specialist2, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      formData = new FormData()
      formData.append('gigId', gigB.id)
      formData.append('content', 'Message 3 for Gig B')

      await withAuthContext(client2, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      // Verify Gig A has exactly 2 messages
      const messagesA = await prisma.message.findMany({
        where: { gigId: gigA.id }
      })
      expect(messagesA).toHaveLength(2)
      expect(messagesA.every(m => m.gigId === gigA.id)).toBe(true)

      // Verify Gig B has exactly 3 messages
      const messagesB = await prisma.message.findMany({
        where: { gigId: gigB.id }
      })
      expect(messagesB).toHaveLength(3)
      expect(messagesB.every(m => m.gigId === gigB.id)).toBe(true)

      // Verify total messages is 5
      const allMessages = await prisma.message.findMany()
      expect(allMessages).toHaveLength(5)

      // Cleanup
      await prisma.message.deleteMany({ where: { gigId: gigA.id } })
      await prisma.message.deleteMany({ where: { gigId: gigB.id } })
      await prisma.gig.delete({ where: { id: gigA.id } })
      await prisma.gig.delete({ where: { id: gigB.id } })
      await prisma.user.delete({ where: { id: client1.id } })
      await prisma.user.delete({ where: { id: client2.id } })
      await prisma.user.delete({ where: { id: specialist1.id } })
      await prisma.user.delete({ where: { id: specialist2.id } })
    })
    it('Message count is correct per gig', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      // Send 3 messages
      for (let i = 1; i <= 3; i++) {
        const formData = new FormData()
        formData.append('gigId', gig.id)
        formData.append('content', `Message ${i}`)

        await withAuthContext(client, async () => {
          try {
            await sendMessage(null, formData)
          } catch (error: any) {
            expect(error.message).toContain('NEXT_REDIRECT')
          }
        })
      }

      // Verify count
      const messages = await prisma.message.findMany({
        where: { gigId: gig.id }
      })
      expect(messages).toHaveLength(3)

      // Cleanup
      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })
  })

  describe('Message Ordering', () => {
    it('Messages ordered by createdAt ascending', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      for (let i = 1; i <= 3; i++) {
        const formData = new FormData()
        formData.append('gigId', gig.id)
        formData.append('content', `Message ${i}`)

        await withAuthContext(client, async () => {
          try {
            await sendMessage(null, formData)
          } catch (error: any) {
            expect(error.message).toContain('NEXT_REDIRECT')
          }
        })

        await new Promise(resolve => setTimeout(resolve, 10))
      }

      const messages = await prisma.message.findMany({
        where: { gigId: gig.id },
        orderBy: { createdAt: 'asc' }
      })

      expect(messages).toHaveLength(3)
      expect(messages[0].content).toBe('Message 1')
      expect(messages[1].content).toBe('Message 2')
      expect(messages[2].content).toBe('Message 3')

      expect(messages[0].createdAt.getTime()).toBeLessThan(messages[1].createdAt.getTime())
      expect(messages[1].createdAt.getTime()).toBeLessThan(messages[2].createdAt.getTime())

      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('Message timestamps are accurate', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      const beforeSend = new Date()

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Timestamp test message')

      await withAuthContext(client, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      const afterSend = new Date()

      const messages = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(messages).toHaveLength(1)

      const message = messages[0]
      expect(message.createdAt).toBeInstanceOf(Date)
      expect(message.createdAt.getTime()).toBeGreaterThanOrEqual(beforeSend.getTime())
      expect(message.createdAt.getTime()).toBeLessThanOrEqual(afterSend.getTime())

      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })
  })

  describe('State Validation', () => {
    it('Cannot send messages before specialist is assigned', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'OPEN',
        assignedSpecialistId: null
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Test message')

      await withAuthContext(client, async () => {
        const result = await sendMessage(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toBe('Cannot send messages until a specialist is assigned to this gig. Wait for the client to accept an application.')
      })

      const messages = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(messages).toHaveLength(0)

      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('Cannot send messages if gig is closed by admin', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id,
        closedByAdmin: true
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Test message')

      await withAuthContext(client, async () => {
        const result = await sendMessage(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toBe('Cannot send messages to closed gigs. This gig has been closed by administrators.')
      })

      const messages = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(messages).toHaveLength(0)

      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('Can send messages in IN_PROGRESS status', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Message in IN_PROGRESS')

      await withAuthContext(client, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      const messages = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(messages).toHaveLength(1)

      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('Can send messages in REVIEW status', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'REVIEW',
        assignedSpecialistId: specialist.id
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Message in REVIEW')

      await withAuthContext(specialist, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      const messages = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(messages).toHaveLength(1)

      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('Can send messages in COMPLETED status', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'COMPLETED',
        assignedSpecialistId: specialist.id
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Message in COMPLETED')

      await withAuthContext(client, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      const messages = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(messages).toHaveLength(1)

      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('Cannot send messages in PAID status (client)', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'PAID',
        assignedSpecialistId: specialist.id,
        paidAt: new Date()
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Message in PAID')

      await withAuthContext(client, async () => {
        const result = await sendMessage(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toBe('Cannot send messages to completed and paid gigs. The work has been finalized.')
      })

      const messages = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(messages).toHaveLength(0)

      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('Cannot send messages in PAID status (specialist)', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'PAID',
        assignedSpecialistId: specialist.id,
        paidAt: new Date()
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Message in PAID')

      await withAuthContext(specialist, async () => {
        const result = await sendMessage(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toBe('Cannot send messages to completed and paid gigs. The work has been finalized.')
      })

      const messages = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(messages).toHaveLength(0)

      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })
  })

  describe('Content Validation', () => {
    it('Empty content is rejected', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', '')

      await withAuthContext(client, async () => {
        const result = await sendMessage(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toBe('Message cannot be empty. Please enter a message to send.')
      })

      const messages = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(messages).toHaveLength(0)

      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('Whitespace-only content is rejected', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', '   \n\t  ')

      await withAuthContext(client, async () => {
        const result = await sendMessage(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toBe('Message cannot be empty. Please enter a message to send.')
      })

      const messages = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(messages).toHaveLength(0)

      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('Content exceeding max length is rejected', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'a'.repeat(2001))

      await withAuthContext(client, async () => {
        const result = await sendMessage(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toBe('Message is too long. Maximum 2000 characters allowed.')
      })

      const messages = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(messages).toHaveLength(0)

      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('Content is trimmed before storage', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', '  Hello World  ')

      await withAuthContext(client, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      const messages = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(messages).toHaveLength(1)
      expect(messages[0].content).toBe('Hello World')

      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('Valid content within limits is accepted', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Valid message content')

      await withAuthContext(client, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      const messages = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(messages).toHaveLength(1)
      expect(messages[0].content).toBe('Valid message content')

      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('Content at max length boundary is accepted', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'a'.repeat(2000))

      await withAuthContext(client, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      const messages = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(messages).toHaveLength(1)
      expect(messages[0].content).toBe('a'.repeat(2000))

      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })
  })

  describe('Edge Cases', () => {
    it('Send message to non-existent gig', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })

      const formData = new FormData()
      formData.append('gigId', 'non-existent-gig-id')
      formData.append('content', 'Test message')

      await withAuthContext(client, async () => {
        const result = await sendMessage(null, formData)
        expect(result).toHaveProperty('error')
        expect(result.error).toBe('This gig no longer exists or has been removed.')
      })

      await prisma.user.delete({ where: { id: client.id } })
    })

    it('Message count increases correctly', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      const initialCount = await prisma.message.count({ where: { gigId: gig.id } })
      expect(initialCount).toBe(0)

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Test message')

      await withAuthContext(client, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      const newCount = await prisma.message.count({ where: { gigId: gig.id } })
      expect(newCount).toBe(1)

      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('Messages persist across queries', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('content', 'Persistent message')

      await withAuthContext(client, async () => {
        try {
          await sendMessage(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      const firstQuery = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(firstQuery).toHaveLength(1)
      expect(firstQuery[0].content).toBe('Persistent message')
      expect(firstQuery[0].senderId).toBe(client.id)
      expect(firstQuery[0].gigId).toBe(gig.id)

      const secondQuery = await prisma.message.findMany({ where: { gigId: gig.id } })
      expect(secondQuery).toHaveLength(1)
      expect(secondQuery[0].content).toBe('Persistent message')
      expect(secondQuery[0].id).toBe(firstQuery[0].id)

      await prisma.message.deleteMany({ where: { gigId: gig.id } })
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })
  })
})
