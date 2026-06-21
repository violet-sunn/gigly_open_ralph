import { describe, it, expect, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser, createTestGig } from '../helpers/seed'

vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({ get: () => undefined, set: vi.fn(), delete: vi.fn() })),
}))
vi.mock('next/navigation', () => ({
  redirect: vi.fn((u: string) => {
    throw new Error(`NEXT_REDIRECT:${u}`)
  }),
}))

import { getFinances } from '@/lib/view-models'

describe('getFinances', () => {
  it('reflects a CLIENT’s PAID gig: ledger entry (totalAmount) + balance + stats', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    await createTestGig(prisma, {
      clientId: client.id,
      status: 'PAID',
      title: 'Лендинг',
      budget: 10000000,
      serviceFee: 1000000,
      totalAmount: 11000000,
      paidAt: new Date('2026-04-01T10:00:00Z'),
    })

    const data = await getFinances({ userId: client.id, role: 'CLIENT' })

    expect(data.ledger.entries).toHaveLength(1)
    expect(data.ledger.entries[0].label).toBe('Лендинг')
    expect(data.ledger.entries[0].status).toBe('completed')
    // CLIENT pays the totalAmount (budget + fee) → 110 000 ₽
    expect(data.ledger.entries[0].amount).toContain('110')
    expect(data.ledger.balance).toContain('110')
    // Stats: role-aware figures for a CLIENT (reconcile-finances-and-admin)
    expect(data.stats.stats.some((s) => s.label === 'Выплачено')).toBe(true)
    expect(data.stats.stats.some((s) => s.label === 'В резерве')).toBe(true)
    expect(data.stats.stats.some((s) => s.label === 'Сервисный сбор')).toBe(true)
  })

  it('reflects a SPECIALIST’s PAID gig: amount is the budget (no fee)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const spec = await createTestUser(prisma, { role: 'SPECIALIST' })
    await createTestGig(prisma, {
      clientId: client.id,
      assignedSpecialistId: spec.id,
      status: 'PAID',
      budget: 10000000,
      serviceFee: 1000000,
      totalAmount: 11000000,
      paidAt: new Date('2026-04-02T10:00:00Z'),
    })

    const data = await getFinances({ userId: spec.id, role: 'SPECIALIST' })

    expect(data.ledger.entries).toHaveLength(1)
    // SPECIALIST receives the budget (no fee deducted) → 100 000 ₽
    expect(data.ledger.entries[0].amount).toContain('100')
    expect(data.ledger.balance).toContain('100')
    // Realized label «Заработано» for a SPECIALIST
    expect(data.stats.stats.some((s) => s.label === 'Заработано')).toBe(true)
  })

  it('an IN_PROGRESS gig appears in the operations ledger (lifecycle, not PAID-only)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    await createTestGig(prisma, { clientId: client.id, status: 'IN_PROGRESS', title: 'Активный', totalAmount: 5500000 })

    const data = await getFinances({ userId: client.id, role: 'CLIENT' })
    expect(data.ledger.entries).toHaveLength(1)
    expect(data.ledger.entries[0].label).toBe('Активный')
    expect(data.ledger.entries[0].status).toBe('in-progress')
    expect(data.ledger.balance).toContain('0') // balance is PAID-only; nothing realized yet
  })

  it('returns an empty operations ledger for a user with no lifecycle gigs (e.g. only OPEN)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    await createTestGig(prisma, { clientId: client.id, status: 'OPEN' }) // OPEN is not an operation

    const data = await getFinances({ userId: client.id, role: 'CLIENT' })

    expect(data.ledger.entries).toEqual([])
  })
})
