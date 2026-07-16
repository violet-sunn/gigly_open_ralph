import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser, createTestGig, createTestMessage } from '../helpers/seed'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'

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
import { getUnreadNotifications, getUnreadCount, markNotificationAsRead } from '@/app/actions/notification'

describe('Notification System', () => {
  let prisma: ReturnType<typeof getTestPrismaClient>

  beforeEach(() => {
    prisma = getTestPrismaClient()
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  describe('getUnreadNotifications', () => {
    it('returns gigs with unread messages for gig owner', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
      const gig = await createTestGig(prisma, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'IN_PROGRESS',
      })

      // Specialist sends message to client
      await createTestMessage(prisma, {
        gigId: gig.id,
        senderId: specialist.id,
        content: 'Hello from specialist',
      })

      const notifications = await withAuthContext(client, async () => {
        return await getUnreadNotifications()
      })

      expect(notifications).toHaveLength(1)
      expect(notifications[0].gigId).toBe(gig.id)
      expect(notifications[0].gigTitle).toBe(gig.title)
      expect(notifications[0].unreadCount).toBe(1)
    })

    it('returns gigs with unread messages for assigned specialist', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
      const gig = await createTestGig(prisma, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'IN_PROGRESS',
      })

      // Client sends message to specialist
      await createTestMessage(prisma, {
        gigId: gig.id,
        senderId: client.id,
        content: 'Hello from client',
      })

      const notifications = await withAuthContext(specialist, async () => {
        return await getUnreadNotifications()
      })

      expect(notifications).toHaveLength(1)
      expect(notifications[0].gigId).toBe(gig.id)
    })

    it('excludes gigs with no messages from others', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
      const gig = await createTestGig(prisma, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'IN_PROGRESS',
      })

      // Client sends message (as owner)
      await createTestMessage(prisma, {
        gigId: gig.id,
        senderId: client.id,
        content: 'Message from myself',
      })

      const notifications = await withAuthContext(client, async () => {
        return await getUnreadNotifications()
      })

      expect(notifications).toHaveLength(0)
    })

    it('excludes closed gigs', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
      const gig = await createTestGig(prisma, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'IN_PROGRESS',
        closedByAdmin: true,
      })

      await createTestMessage(prisma, {
        gigId: gig.id,
        senderId: specialist.id,
        content: 'Message on closed gig',
      })

      const notifications = await withAuthContext(client, async () => {
        return await getUnreadNotifications()
      })

      expect(notifications).toHaveLength(0)
    })

    it('includes gigs with no notification record (never read)', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
      const gig = await createTestGig(prisma, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'IN_PROGRESS',
      })

      await createTestMessage(prisma, {
        gigId: gig.id,
        senderId: specialist.id,
        content: 'First message',
      })

      const notifications = await withAuthContext(client, async () => {
        return await getUnreadNotifications()
      })

      expect(notifications).toHaveLength(1)
      expect(notifications[0].gigId).toBe(gig.id)
    })

    it('excludes gigs where messages are read', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
      const gig = await createTestGig(prisma, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'IN_PROGRESS',
      })

      const message = await createTestMessage(prisma, {
        gigId: gig.id,
        senderId: specialist.id,
        content: 'Message',
      })

      // Create notification with lastReadAt after message
      await prisma.notification.create({
        data: {
          userId: client.id,
          gigId: gig.id,
          lastReadAt: new Date(message.createdAt.getTime() + 1000),
        },
      })

      const notifications = await withAuthContext(client, async () => {
        return await getUnreadNotifications()
      })

      expect(notifications).toHaveLength(0)
    })

    it('sorts notifications by most recent message first', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig1 = await createTestGig(prisma, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'IN_PROGRESS',
        title: 'Gig 1',
      })

      const gig2 = await createTestGig(prisma, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'IN_PROGRESS',
        title: 'Gig 2',
      })

      // Create messages with different timestamps
      await createTestMessage(prisma, {
        gigId: gig1.id,
        senderId: specialist.id,
        content: 'Old message',
      })

      await new Promise(resolve => setTimeout(resolve, 10))

      await createTestMessage(prisma, {
        gigId: gig2.id,
        senderId: specialist.id,
        content: 'Recent message',
      })

      const notifications = await withAuthContext(client, async () => {
        return await getUnreadNotifications()
      })

      expect(notifications).toHaveLength(2)
      expect(notifications[0].gigTitle).toBe('Gig 2') // Most recent first
      expect(notifications[1].gigTitle).toBe('Gig 1')
    })

    it('respects the notification preference — a disabled type is hidden from the bell (reversibly)', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
      const gig = await createTestGig(prisma, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'IN_PROGRESS',
      })
      await createTestMessage(prisma, { gigId: gig.id, senderId: specialist.id, content: 'Hi' })

      // Default ON → the message shows in the bell.
      const before = await withAuthContext(client, () => getUnreadNotifications())
      expect(before).toHaveLength(1)

      // Disable «Новые сообщения в чатах» → display-time gating drops it (no rows removed).
      await prisma.user.update({ where: { id: client.id }, data: { notifyMessages: false } })
      const after = await withAuthContext(client, () => getUnreadNotifications())
      expect(after).toHaveLength(0)

      // Re-enable → it returns, proving the gating is reversible.
      await prisma.user.update({ where: { id: client.id }, data: { notifyMessages: true } })
      const restored = await withAuthContext(client, () => getUnreadNotifications())
      expect(restored).toHaveLength(1)
    })
  })

  describe('getUnreadCount', () => {
    it('returns correct count of gigs with unread messages', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      for (let i = 0; i < 3; i++) {
        const gig = await createTestGig(prisma, {
          clientId: client.id,
          assignedSpecialistId: specialist.id,
          status: 'IN_PROGRESS',
        })

        await createTestMessage(prisma, {
          gigId: gig.id,
          senderId: specialist.id,
          content: `Message ${i}`,
        })
      }

      const result = await withAuthContext(client, async () => {
        return await getUnreadCount()
      })

      expect(result.count).toBe(3)
    })

    it('returns 0 when no unread messages', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })

      const result = await withAuthContext(client, async () => {
        return await getUnreadCount()
      })

      expect(result.count).toBe(0)
    })
  })

  describe('markNotificationAsRead', () => {
    it('creates notification record if none exists', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
      const gig = await createTestGig(prisma, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'IN_PROGRESS',
      })

      await createTestMessage(prisma, {
        gigId: gig.id,
        senderId: specialist.id,
        content: 'Message',
      })

      const result = await withAuthContext(client, async () => {
        return await markNotificationAsRead(gig.id)
      })

      expect(result.error).toBeUndefined()

      const notification = await prisma.notification.findUnique({
        where: {
          userId_gigId: {
            userId: client.id,
            gigId: gig.id,
          },
        },
      })

      expect(notification).toBeDefined()
      expect(notification!.lastReadAt).toBeDefined()
    })

    it('updates existing notification record', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
      const gig = await createTestGig(prisma, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'IN_PROGRESS',
      })

      const oldDate = new Date('2020-01-01')
      await prisma.notification.create({
        data: {
          userId: client.id,
          gigId: gig.id,
          lastReadAt: oldDate,
        },
      })

      await withAuthContext(client, async () => {
        return await markNotificationAsRead(gig.id)
      })

      const notification = await prisma.notification.findUnique({
        where: {
          userId_gigId: {
            userId: client.id,
            gigId: gig.id,
          },
        },
      })

      expect(notification!.lastReadAt!.getTime()).toBeGreaterThan(oldDate.getTime())
    })

    it('rejects unauthorized users', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
      const otherSpecialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'IN_PROGRESS',
      })

      const result = await withAuthContext(otherSpecialist, async () => {
        return await markNotificationAsRead(gig.id)
      })

      expect(result.error).toBe('Недостаточно прав, чтобы отметить это уведомление прочитанным.')
    })

    it('returns error for non-existent gig', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })

      const result = await withAuthContext(client, async () => {
        return await markNotificationAsRead('non-existent-id')
      })

      expect(result.error).toBe('Этот гиг больше не существует или был удалён.')
    })
  })
})
