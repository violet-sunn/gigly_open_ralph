import { describe, it, expect, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser, createTestGig, createTestApplication } from '../helpers/seed'

vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))

import { getMyGigs } from '@/lib/view-models'

const tabCount = (data: Awaited<ReturnType<typeof getMyGigs>>, value: string) =>
  data.tabs.find((t) => t.value === value)?.count

describe('getMyGigs — CLIENT (own posted gigs)', () => {
  it('returns the client own gigs across the five tabs, with «Заявки» = OPEN gigs that have applications', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT', companyName: 'ООО Ромашка' })

    // An OPEN gig with an application → derived «На рассмотрении» (review) → the «Заявки» tab.
    const openWithApp = await createTestGig(prisma, { clientId: client.id, status: 'OPEN', title: 'OPEN с заявкой' })
    await createTestApplication(prisma, { gigId: openWithApp.id, status: 'PENDING' })
    // An OPEN gig with no applications → surfaces under «Все» only.
    await createTestGig(prisma, { clientId: client.id, status: 'OPEN', title: 'OPEN без заявок' })
    // One of each later-lifecycle status.
    await createTestGig(prisma, { clientId: client.id, status: 'IN_PROGRESS', title: 'В работе' })
    await createTestGig(prisma, { clientId: client.id, status: 'REVIEW', title: 'На проверке' })
    await createTestGig(prisma, { clientId: client.id, status: 'COMPLETED', title: 'Завершён' })

    const data = await getMyGigs({ userId: client.id, role: 'CLIENT' })

    expect(data.gigCards).toHaveLength(5)
    expect(data.tabs.map((t) => t.value)).toEqual(['all', 'apps', 'in-progress', 'verification', 'completed'])
    expect(tabCount(data, 'all')).toBe(5)
    expect(tabCount(data, 'apps')).toBe(1) // the OPEN-with-application gig (derived «На рассмотрении»)
    expect(tabCount(data, 'in-progress')).toBe(1)
    expect(tabCount(data, 'verification')).toBe(1)
    expect(tabCount(data, 'completed')).toBe(1)

    // The OPEN-with-application card carries the derived review status + the «Заявки» tab.
    const apps = data.gigCards.find((c) => c.tabKey === 'apps')
    expect(apps?.title).toBe('OPEN с заявкой')
    expect(apps?.status).toBe('review')
  })

  it('does not include another client gigs', async () => {
    const prisma = getTestPrismaClient()
    const me = await createTestUser(prisma, { role: 'CLIENT' })
    const other = await createTestUser(prisma, { role: 'CLIENT' })
    await createTestGig(prisma, { clientId: other.id, status: 'IN_PROGRESS' })

    const data = await getMyGigs({ userId: me.id, role: 'CLIENT' })
    expect(data.gigCards).toHaveLength(0)
  })
})

describe('getMyGigs — SPECIALIST (applied + assigned gigs)', () => {
  it('returns PENDING applications under «Заявки» and assigned gigs by lifecycle', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST', displayName: 'Иван Спец' })

    // A PENDING application → «Заявки» (derived review status on the card).
    await createTestApplication(prisma, { specialistId: specialist.id, status: 'PENDING' })
    // Assigned gigs across the lifecycle.
    await createTestGig(prisma, { assignedSpecialistId: specialist.id, status: 'IN_PROGRESS', title: 'В работе' })
    await createTestGig(prisma, { assignedSpecialistId: specialist.id, status: 'REVIEW', title: 'На проверке' })
    await createTestGig(prisma, { assignedSpecialistId: specialist.id, status: 'PAID', title: 'Оплачен' })

    const data = await getMyGigs({ userId: specialist.id, role: 'SPECIALIST' })

    expect(data.tabs.map((t) => t.value)).toEqual(['all', 'apps', 'in-progress', 'verification', 'completed'])
    expect(tabCount(data, 'all')).toBe(4)
    expect(tabCount(data, 'apps')).toBe(1)
    expect(tabCount(data, 'in-progress')).toBe(1)
    expect(tabCount(data, 'verification')).toBe(1)
    expect(tabCount(data, 'completed')).toBe(1) // PAID maps to completed

    const apps = data.gigCards.find((c) => c.tabKey === 'apps')
    expect(apps?.status).toBe('review')
  })
})
