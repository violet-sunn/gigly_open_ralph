import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser, createTestGig, createTestMessage } from '../helpers/seed'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'

// Mock @/lib/prisma to use test database (lazy getter)
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))

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
      if (name === 'session') setTestSessionToken(value)
    }),
    delete: vi.fn((name: string) => {
      if (name === 'session') setTestSessionToken(undefined)
    }),
  })),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

import { getLiveCounts } from '@/app/actions/counts'
import { getUnreadCount } from '@/app/actions/notification'
import { getUnreadChatCount } from '@/lib/view-models'

/**
 * `getLiveCounts` is the single round trip behind the shell's live counters (live-counters change). Its whole job is
 * to return the SAME numbers the individual derivations return — it must never fork the count logic — and to stay
 * harmless when polled from a logged-out tab.
 */
describe('getLiveCounts (live-counters)', () => {
  let prisma: ReturnType<typeof getTestPrismaClient>

  beforeEach(() => {
    prisma = getTestPrismaClient()
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  it('does not throw or redirect without a session, and reports unauthenticated', async () => {
    // The shell polls this on an interval; a tab whose session just expired must not throw out of the interval.
    const result = await getLiveCounts()
    expect(result).toEqual({ authenticated: false, notifications: 0, gigs: 0, chats: 0 })
  })

  it('returns counts matching the individual derivations for a CLIENT', async () => {
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id })
    await createTestGig(prisma, { clientId: client.id })
    // An unread message from the other party -> one unread conversation.
    await createTestMessage(prisma, { gigId: gig.id, senderId: specialist.id })

    await withAuthContext(client, async () => {
      const live = await getLiveCounts()
      const notifications = await getUnreadCount()
      const chats = await getUnreadChatCount({ userId: client.id, role: 'CLIENT' })

      expect(live.authenticated).toBe(true)
      expect(live.gigs).toBe(2)
      expect(live.chats).toBe(chats)
      expect(live.notifications).toBe(notifications.count)
    })
  })

  it('scopes the gigs count by role (SPECIALIST sees assigned, not posted)', async () => {
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    // Posted by the client, assigned to the specialist.
    await createTestGig(prisma, {
      clientId: client.id,
      assignedSpecialistId: specialist.id,
      status: 'IN_PROGRESS',
    })
    // Posted by the client, unassigned — must NOT count for the specialist.
    await createTestGig(prisma, { clientId: client.id })

    await withAuthContext(specialist, async () => {
      const live = await getLiveCounts()
      expect(live.gigs).toBe(1)
    })

    await withAuthContext(client, async () => {
      const live = await getLiveCounts()
      expect(live.gigs).toBe(2)
    })
  })

  it('reflects a newly created notification without any cache in between', async () => {
    // The core Round-3 symptom: the count must move as soon as the row exists (the write was never the problem —
    // the read was frozen in a mount-only effect).
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id })

    await withAuthContext(client, async () => {
      const before = await getLiveCounts()

      await prisma.notification.create({
        data: {
          userId: client.id,
          gigId: gig.id,
          type: 'APPLICATION',
          eventType: 'application_submitted',
          eventData: JSON.stringify({ specialistId: specialist.id }),
        },
      })

      const after = await getLiveCounts()
      expect(after.notifications).toBe(before.notifications + 1)
    })
  })

  it('returns zeroed counts for an ADMIN (admin shell renders no counters)', async () => {
    const admin = await createTestUser(prisma, { role: 'ADMIN' })

    await withAuthContext(admin, async () => {
      const live = await getLiveCounts()
      expect(live).toEqual({ authenticated: true, notifications: 0, gigs: 0, chats: 0 })
    })
  })
})
