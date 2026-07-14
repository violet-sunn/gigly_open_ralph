import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { createTestUser, createTestGig, createTestApplication } from '../helpers/seed'

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
    set: vi.fn(),
    delete: vi.fn(),
  })),
}))
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

import { getSpecialistDashboard, getDashboardAttention } from '@/lib/view-models'
import type { GigCardVM } from '@/app/components/blocks/view-models'

describe('getSpecialistDashboard', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('maps applications + assigned gigs into the five status tabs with counts', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      displayName: 'Тест Спец',
      techStack: 'React',
      experienceLevel: 'SENIOR',
      bio: 'Опытный инженер',
    })

    // Assigned gigs across the work statuses (В работе / На проверке / Завершённые).
    const inProgressGig = await createTestGig(prisma, { clientId: client.id, status: 'IN_PROGRESS', assignedSpecialistId: specialist.id })
    await createTestGig(prisma, { clientId: client.id, status: 'REVIEW', assignedSpecialistId: specialist.id })
    await createTestGig(prisma, { clientId: client.id, status: 'COMPLETED', assignedSpecialistId: specialist.id })
    await createTestGig(prisma, {
      clientId: client.id,
      status: 'PAID',
      assignedSpecialistId: specialist.id,
      paidAt: new Date(),
    })

    // Applications: one PENDING (Заявки); REJECTED + WITHDRAWN + WITHDRAWN_FINAL (archive → Все only).
    const openGig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    await createTestApplication(prisma, { gigId: openGig.id, specialistId: specialist.id, status: 'PENDING' })
    const rejGig = await createTestGig(prisma, { clientId: client.id, status: 'IN_PROGRESS' })
    await createTestApplication(prisma, { gigId: rejGig.id, specialistId: specialist.id, status: 'REJECTED' })
    const witGig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    await createTestApplication(prisma, { gigId: witGig.id, specialistId: specialist.id, status: 'WITHDRAWN' })
    const witFinalGig = await createTestGig(prisma, { clientId: client.id, status: 'IN_PROGRESS' })
    await createTestApplication(prisma, { gigId: witFinalGig.id, specialistId: specialist.id, status: 'WITHDRAWN_FINAL' })

    // A notification → the WELCOME-2 attention strip (one row per [userId, gigId]).
    await prisma.notification.create({
      data: { userId: specialist.id, gigId: inProgressGig.id, type: 'STATUS_CHANGE', eventType: 'work_approved' },
    })

    const data = await withAuthContext(specialist, async () => getSpecialistDashboard(specialist.id))

    // F3 — exactly the five tabs, in order.
    expect(data.tabs.map((t) => t.label)).toEqual(['Все', 'Заявки', 'В работе', 'На проверке', 'Завершённые'])

    const count = (v: string) => data.tabs.find((t) => t.value === v)?.count
    expect(count('all')).toBe(8) // 1 pending + 4 assigned + 3 archived
    expect(count('applications')).toBe(1)
    expect(count('in-progress')).toBe(1)
    expect(count('verification')).toBe(1)
    expect(count('completed')).toBe(2) // COMPLETED + PAID

    // Completion 100% (all four specialist profile fields filled).
    expect(data.completion).toBe(100)

    // tabKey + status mapping.
    const byTab = (k: string) => data.gigCards.filter((c) => c.tabKey === k)
    expect(byTab('applications')[0].status).toBe('review') // pending application → «На рассмотрении»
    expect(byTab('in-progress')[0].status).toBe('in-progress')
    expect(byTab('verification')[0].status).toBe('verification')
    expect(byTab('completed').every((c) => c.status === 'completed')).toBe(true)
    // Terminal states surfaced only under Все, not in any work tab. All share the red `rejected` tone, but each
    // reads truthfully via statusLabel (withdrawn-status-truthfulness): a withdrawn app must NOT read as rejected.
    expect(byTab('archive')).toHaveLength(3)
    expect(byTab('archive').every((c) => c.status === 'rejected')).toBe(true)
    const labels = byTab('archive').map((c) => c.statusLabel).sort()
    expect(labels).toEqual(['Отклонён', 'Отозвано', 'Отозвано (окончательно)'])

    // Assignable to GigCardVM (compile-time) + messages present.
    const first: GigCardVM = data.gigCards[0]
    expect(typeof first.budget).toBe('string')
    expect(Array.isArray(data.messages.conversations)).toBe(true)

    // WELCOME — greeting + two onboarding tiles (the first carries the real completion as its progress).
    expect(data.greeting).toBeTruthy()
    expect(data.onboarding.length).toBeGreaterThanOrEqual(2)
    expect(data.onboarding[0].progress).toBe(data.completion)

    // WELCOME-2 — the attention strip (≤6, the seeded notification → ≥1 typed card with a gig embed).
    expect(Array.isArray(data.attention)).toBe(true)
    expect(data.attention.length).toBeGreaterThanOrEqual(1)
    expect(data.attention.length).toBeLessThanOrEqual(6)
    expect(data.attention[0].type).toBe('accepted') // work_approved → accepted
    expect(data.attention[0].embed.kind).toBe('gig')
  })

  it('returns an empty grid and zero tab counts for a specialist with no gigs or applications', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const data = await withAuthContext(specialist, async () => getSpecialistDashboard(specialist.id))

    expect(data.gigCards).toHaveLength(0)
    expect(data.tabs.every((t) => t.count === 0)).toBe(true)
    expect(data.tabs.map((t) => t.value)).toEqual(['all', 'applications', 'in-progress', 'verification', 'completed'])
    expect(data.completion).toBeGreaterThanOrEqual(0)
    expect(data.completion).toBeLessThanOrEqual(100)
    // No notifications → an empty attention strip (the screen hides the WELCOME-2 section).
    expect(data.attention).toEqual([])
  })
})

/**
 * attention-feed-lifecycle: «Требует внимания» keeps a notification only while it still needs the
 * user's attention — UNREAD (`lastReadAt` null) AND the linked gig still live (status not
 * COMPLETED/PAID, `closedByAdmin` false). The filter runs in the query, before the newest-first cap.
 */
describe('getDashboardAttention — attention-feed lifecycle filter', () => {
  it('returns an unread notification whose gig is still live (IN_PROGRESS)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'IN_PROGRESS', assignedSpecialistId: specialist.id })
    await prisma.notification.create({
      data: { userId: specialist.id, gigId: gig.id, type: 'STATUS_CHANGE', eventType: 'application_accepted' },
    })

    const feed = await getDashboardAttention(specialist.id)
    expect(feed).toHaveLength(1)
    expect(feed[0].type).toBe('accepted') // application_accepted → accepted
    expect(feed[0].embed.kind).toBe('gig')
  })

  it('drops a notification once its gig reaches COMPLETED', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'COMPLETED', assignedSpecialistId: specialist.id })
    await prisma.notification.create({
      data: { userId: specialist.id, gigId: gig.id, type: 'STATUS_CHANGE', eventType: 'application_accepted' },
    })

    expect(await getDashboardAttention(specialist.id)).toEqual([])
  })

  it('drops a notification once its gig reaches PAID', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'PAID', assignedSpecialistId: specialist.id, paidAt: new Date() })
    await prisma.notification.create({
      data: { userId: specialist.id, gigId: gig.id, type: 'PAYMENT', eventType: 'payment_marked' },
    })

    expect(await getDashboardAttention(specialist.id)).toEqual([])
  })

  it('drops a notification whose gig was closed by an admin', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    // Still IN_PROGRESS (not terminal) but admin-closed — the closedByAdmin clause must exclude it.
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'IN_PROGRESS', assignedSpecialistId: specialist.id, closedByAdmin: true })
    await prisma.notification.create({
      data: { userId: specialist.id, gigId: gig.id, type: 'STATUS_CHANGE', eventType: 'application_accepted' },
    })

    expect(await getDashboardAttention(specialist.id)).toEqual([])
  })

  it('drops an already-read notification (lastReadAt non-null) on a live gig', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'IN_PROGRESS', assignedSpecialistId: specialist.id })
    await prisma.notification.create({
      data: { userId: specialist.id, gigId: gig.id, type: 'STATUS_CHANGE', eventType: 'application_accepted', lastReadAt: new Date() },
    })

    expect(await getDashboardAttention(specialist.id)).toEqual([])
  })

  it('caps at the 6 newest live-gig unread notifications, excluding a more-recent COMPLETED-gig one', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    // Eight unread notifications on live gigs, with ascending createdAt (idx 0 oldest … 7 newest).
    const base = new Date('2026-07-14T10:00:00Z').getTime()
    const liveGigIds: string[] = []
    for (let i = 0; i < 8; i++) {
      const gig = await createTestGig(prisma, { clientId: client.id, status: 'IN_PROGRESS', assignedSpecialistId: specialist.id })
      liveGigIds.push(gig.id)
      await prisma.notification.create({
        data: {
          userId: specialist.id,
          gigId: gig.id,
          type: 'STATUS_CHANGE',
          eventType: 'application_accepted',
          createdAt: new Date(base + i * 60_000),
        },
      })
    }

    // A COMPLETED-gig notification that is MORE RECENT than every live one — must still be excluded,
    // proving the filter runs before the newest-first cap (not a fetch-6-then-drop).
    const doneGig = await createTestGig(prisma, { clientId: client.id, status: 'COMPLETED', assignedSpecialistId: specialist.id })
    await prisma.notification.create({
      data: {
        userId: specialist.id,
        gigId: doneGig.id,
        type: 'STATUS_CHANGE',
        eventType: 'work_approved',
        createdAt: new Date(base + 999 * 60_000),
      },
    })

    const feed = await getDashboardAttention(specialist.id)
    // Exactly 6 cards, all from live gigs; the more-recent COMPLETED-gig card is absent.
    expect(feed).toHaveLength(6)
    const returnedGigIds = feed.map((c) => (c.embed.kind === 'gig' ? c.embed.gig.id : undefined))
    expect(returnedGigIds).not.toContain(doneGig.id)
    // The 6 newest live gigs (idx 2..7) come back; the two oldest (idx 0,1) are trimmed by the cap.
    expect(returnedGigIds.every((id) => liveGigIds.slice(2).includes(id!))).toBe(true)
    expect(returnedGigIds).not.toContain(liveGigIds[0])
    expect(returnedGigIds).not.toContain(liveGigIds[1])
  })
})
