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

import { getSpecialistDashboard } from '@/lib/view-models'
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

    // Applications: one PENDING (Заявки), one REJECTED + one WITHDRAWN (archive → Все only).
    const openGig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    await createTestApplication(prisma, { gigId: openGig.id, specialistId: specialist.id, status: 'PENDING' })
    const rejGig = await createTestGig(prisma, { clientId: client.id, status: 'IN_PROGRESS' })
    await createTestApplication(prisma, { gigId: rejGig.id, specialistId: specialist.id, status: 'REJECTED' })
    const witGig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    await createTestApplication(prisma, { gigId: witGig.id, specialistId: specialist.id, status: 'WITHDRAWN' })

    // A notification → the WELCOME-2 attention strip (one row per [userId, gigId]).
    await prisma.notification.create({
      data: { userId: specialist.id, gigId: inProgressGig.id, type: 'STATUS_CHANGE', eventType: 'work_approved' },
    })

    const data = await withAuthContext(specialist, async () => getSpecialistDashboard(specialist.id))

    // F3 — exactly the five tabs, in order.
    expect(data.tabs.map((t) => t.label)).toEqual(['Все', 'Заявки', 'В работе', 'На проверке', 'Завершённые'])

    const count = (v: string) => data.tabs.find((t) => t.value === v)?.count
    expect(count('all')).toBe(7) // 1 pending + 4 assigned + 2 archived
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
    // Rejected/withdrawn surfaced only under Все (status «Отклонён»), not in any work tab.
    expect(byTab('archive')).toHaveLength(2)
    expect(byTab('archive').every((c) => c.status === 'rejected')).toBe(true)

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
