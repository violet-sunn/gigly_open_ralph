import { describe, it, expect, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser, createTestGig } from '../helpers/seed'

// Mock @/lib/prisma to use the test database (lazy getter)
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))

// Import after mocks
import { getLedger, getFinanceStats } from '@/lib/finances'
import type { LedgerTableVM, StatPanelVM } from '@/app/components/blocks/view-models'

// ru-RU formatting uses a non-breaking-space group separator — normalise before comparing.
const noSpace = (s: string) => s.replace(/\s/g, '')

describe('finances-ledger — CLIENT realized ledger', () => {
  it('derives entries + balance from PAID gigs (amount = totalAmount), excluding non-paid', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    await createTestGig(prisma, {
      title: 'Paid gig',
      clientId: client.id,
      budget: 10000000,
      serviceFee: 1000000,
      totalAmount: 11000000,
      status: 'PAID',
      paidAt: new Date(),
    })
    await createTestGig(prisma, { title: 'Completed gig', clientId: client.id, status: 'COMPLETED' })
    await createTestGig(prisma, { title: 'Open gig', clientId: client.id, status: 'OPEN' })

    const ledger: LedgerTableVM = await getLedger(client.id, 'CLIENT')
    expect(ledger.entries).toHaveLength(1)
    expect(ledger.entries[0].label).toBe('Paid gig')
    expect(noSpace(ledger.entries[0].amount)).toBe('110000₽') // totalAmount
    expect(ledger.entries[0].status).toBe('completed')
    expect(typeof ledger.entries[0].date).toBe('string')
    expect(noSpace(ledger.balance)).toBe('110000₽')
  })
})

describe('finances-ledger — SPECIALIST realized ledger', () => {
  it('derives entries + balance from assigned PAID gigs (amount = budget)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    await createTestGig(prisma, {
      title: 'Earned gig',
      clientId: client.id,
      assignedSpecialistId: specialist.id,
      budget: 10000000,
      serviceFee: 1000000,
      totalAmount: 11000000,
      status: 'PAID',
      paidAt: new Date(),
    })

    const ledger = await getLedger(specialist.id, 'SPECIALIST')
    expect(ledger.entries).toHaveLength(1)
    expect(noSpace(ledger.entries[0].amount)).toBe('100000₽') // budget (no fee)
    expect(noSpace(ledger.balance)).toBe('100000₽')
  })

  it('orders entries newest-paid first', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    await createTestGig(prisma, {
      title: 'Older',
      clientId: client.id,
      assignedSpecialistId: specialist.id,
      budget: 5000000,
      status: 'PAID',
      paidAt: new Date('2026-01-01T00:00:00Z'),
    })
    await createTestGig(prisma, {
      title: 'Newer',
      clientId: client.id,
      assignedSpecialistId: specialist.id,
      budget: 6000000,
      status: 'PAID',
      paidAt: new Date('2026-03-01T00:00:00Z'),
    })

    const ledger = await getLedger(specialist.id, 'SPECIALIST')
    expect(ledger.entries.map((e) => e.label)).toEqual(['Newer', 'Older'])
  })
})

describe('finances-ledger — reflects payment statuses', () => {
  it('a COMPLETED-but-unpaid gig is not realized; marking it PAID moves it into the ledger', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await createTestGig(prisma, {
      title: 'Pending gig',
      clientId: client.id,
      budget: 10000000,
      serviceFee: 1000000,
      totalAmount: 11000000,
      status: 'COMPLETED',
    })

    let ledger = await getLedger(client.id, 'CLIENT')
    expect(ledger.entries).toHaveLength(0)
    expect(noSpace(ledger.balance)).toBe('0₽')

    // Transition COMPLETED → PAID (logical payment)
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'PAID', paidAt: new Date() } })

    ledger = await getLedger(client.id, 'CLIENT')
    expect(ledger.entries).toHaveLength(1)
    expect(noSpace(ledger.balance)).toBe('110000₽')
  })
})

describe('finances-ledger — stats (paid + pending)', () => {
  it('reflects realized and pending amounts per role', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    await createTestGig(prisma, {
      title: 'Paid',
      clientId: client.id,
      budget: 10000000,
      serviceFee: 1000000,
      totalAmount: 11000000,
      status: 'PAID',
      paidAt: new Date(),
    })
    await createTestGig(prisma, {
      title: 'Pending',
      clientId: client.id,
      budget: 5000000,
      serviceFee: 500000,
      totalAmount: 5500000,
      status: 'COMPLETED',
    })

    const panel: StatPanelVM = await getFinanceStats(client.id, 'CLIENT')
    expect(panel.stats[0].label).toBe('Оплачено')
    expect(noSpace(String(panel.stats[0].value))).toBe('110000₽') // realized (PAID totalAmount)
    expect(panel.stats[1].label).toBe('Ожидает')
    expect(noSpace(String(panel.stats[1].value))).toBe('55000₽') // pending (COMPLETED totalAmount)
    expect(panel.stats[2].label).toBe('Выполнено')
    expect(panel.stats[2].value).toBe(1) // count of PAID
  })
})

describe('finances-ledger — empty + read-only', () => {
  it('empty finances are graceful (no PAID gigs)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const ledger = await getLedger(client.id, 'CLIENT')
    expect(ledger.entries).toEqual([])
    expect(noSpace(ledger.balance).startsWith('0')).toBe(true)
  })

  it('the helpers are read-only (calling them does not mutate gigs)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await createTestGig(prisma, {
      title: 'Paid',
      clientId: client.id,
      budget: 10000000,
      serviceFee: 1000000,
      totalAmount: 11000000,
      status: 'PAID',
      paidAt: new Date(),
    })
    const before = await prisma.gig.findUnique({ where: { id: gig.id } })

    await getLedger(client.id, 'CLIENT')
    await getFinanceStats(client.id, 'CLIENT')

    const after = await prisma.gig.findUnique({ where: { id: gig.id } })
    expect(after).toEqual(before) // unchanged
  })
})
