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

describe('finances-ledger — CLIENT operations ledger', () => {
  it('includes the lifecycle gigs (PAID + COMPLETED), excludes OPEN; balance is the PAID total', async () => {
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
    const labels = ledger.entries.map((e) => e.label)
    expect(labels).toContain('Paid gig')
    expect(labels).toContain('Completed gig')
    expect(labels).not.toContain('Open gig') // OPEN is not an operation
    expect(ledger.entries).toHaveLength(2)
    const paid = ledger.entries.find((e) => e.label === 'Paid gig')!
    expect(noSpace(paid.amount)).toBe('110000₽') // totalAmount
    expect(paid.statusLabel).toBe('Оплачено') // PAID badge override
    expect(noSpace(ledger.balance)).toBe('110000₽') // balance = realized (PAID) only
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
  it('a COMPLETED gig shows as an operation but is unrealized; marking it PAID realizes it into the balance', async () => {
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
    expect(ledger.entries).toHaveLength(1) // appears as an operation
    expect(noSpace(ledger.balance)).toBe('0₽') // but not realized (balance = PAID only)

    // Transition COMPLETED → PAID (logical payment)
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'PAID', paidAt: new Date() } })

    ledger = await getLedger(client.id, 'CLIENT')
    expect(ledger.entries).toHaveLength(1)
    expect(noSpace(ledger.balance)).toBe('110000₽') // now realized
  })
})

describe('finances-ledger — stats (role figures)', () => {
  it('reflects the CLIENT role figures: Выплачено / В резерве / Сервисный сбор', async () => {
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
      title: 'Reserved',
      clientId: client.id,
      budget: 5000000,
      serviceFee: 500000,
      totalAmount: 5500000,
      status: 'IN_PROGRESS', // committed-but-unpaid → «В резерве»
    })

    const panel: StatPanelVM = await getFinanceStats(client.id, 'CLIENT')
    expect(panel.stats[0].label).toBe('Выплачено')
    expect(noSpace(String(panel.stats[0].value))).toBe('110000₽') // PAID totalAmount
    expect(panel.stats[1].label).toBe('В резерве')
    expect(noSpace(String(panel.stats[1].value))).toBe('55000₽') // IN_PROGRESS totalAmount
    expect(panel.stats[2].label).toBe('Сервисный сбор')
    expect(noSpace(String(panel.stats[2].value))).toBe('10000₽') // PAID serviceFee
  })

  it('reflects the SPECIALIST role figures: Заработано / На проверке / В работе', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const spec = await createTestUser(prisma, { role: 'SPECIALIST' })
    await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: spec.id, budget: 10000000, status: 'PAID', paidAt: new Date() })
    await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: spec.id, budget: 4000000, status: 'REVIEW' })
    await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: spec.id, budget: 3000000, status: 'IN_PROGRESS' })

    const panel = await getFinanceStats(spec.id, 'SPECIALIST')
    expect(panel.stats[0].label).toBe('Заработано')
    expect(noSpace(String(panel.stats[0].value))).toBe('100000₽') // PAID budget
    expect(panel.stats[1].label).toBe('На проверке')
    expect(noSpace(String(panel.stats[1].value))).toBe('40000₽') // REVIEW budget
    expect(panel.stats[2].label).toBe('В работе')
    expect(noSpace(String(panel.stats[2].value))).toBe('30000₽') // IN_PROGRESS budget
  })
})

describe('finances-ledger — empty + read-only', () => {
  it('empty finances are graceful (no lifecycle gigs)', async () => {
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
