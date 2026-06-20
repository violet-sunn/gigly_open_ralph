import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { createTestUser, createTestGig } from '../helpers/seed'

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

import { toGigCardVM, getClientDashboard } from '@/lib/view-models'
import type { GigCardVM } from '@/app/components/blocks/view-models'

const noSpace = (s: string) => s.replace(/\s/g, '')

describe('toGigCardVM', () => {
  it('maps status/category/budget/deadline/tags + isCurrent', async () => {
    const vm: GigCardVM = await toGigCardVM({
      id: 'g1',
      title: 'Лендинг',
      categorySlug: null,
      tags: 'React, TypeScript',
      status: 'IN_PROGRESS',
      budget: 10000000,
      deadlineDays: 14,
      assignedSpecialistId: null,
    })
    expect(vm.status).toBe('in-progress')
    expect(vm.isCurrent).toBe(true)
    expect(vm.category).toBe('development') // null → default
    expect(vm.tags).toEqual(['React', 'TypeScript'])
    expect(noSpace(vm.budget)).toBe('100000₽')
    expect(vm.deadlineDays).toBe(14)
  })

  it('maps PAID → completed and keeps the category slug', async () => {
    const vm = await toGigCardVM({
      id: 'g2',
      title: 't',
      categorySlug: 'design',
      tags: '',
      status: 'PAID',
      budget: 5000000,
      deadlineDays: 7,
      assignedSpecialistId: null,
    })
    expect(vm.status).toBe('completed')
    expect(vm.category).toBe('design')
    expect(vm.tags).toEqual([])
  })
})

describe('getClientDashboard', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('returns completion %, the client gigs as cards, tab counts, and messages', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' }) // clientProfile: companyName + inn (2/5)
    await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    await createTestGig(prisma, { clientId: client.id, status: 'IN_PROGRESS' })

    const data = await withAuthContext(client, async () => getClientDashboard(client.id))

    expect(data.gigCards).toHaveLength(2)
    expect(data.completion).toBe(40) // companyName + inn filled of 5 fields
    expect(data.tabs.find((t) => t.value === 'all')?.count).toBe(2)
    expect(data.tabs.find((t) => t.value === 'IN_PROGRESS')?.count).toBe(1)
    expect(data.tabs.map((t) => t.label)).toEqual(['Все', 'В работе', 'На проверке', 'Завершённые'])
    // WELCOME — greeting + two onboarding tiles (the first carries the real completion as its progress); no banner.
    expect(data.greeting).toBeTruthy()
    expect(data.onboarding.length).toBeGreaterThanOrEqual(2)
    expect(data.onboarding[0].progress).toBe(data.completion)
    expect(Array.isArray(data.messages.conversations)).toBe(true)
    // each card carries its raw lifecycle status for client-side tab filtering
    expect(data.gigCards.every((c) => typeof c.rawStatus === 'string')).toBe(true)
  })
})
