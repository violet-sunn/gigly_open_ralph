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
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

import { toBrowseGigCardVM, getGigSearch } from '@/lib/view-models'
import type { GigCardVM } from '@/app/components/blocks/view-models'

describe('toBrowseGigCardVM', () => {
  it('shows the gig owner (client) rating + name, reusing toGigCardVM', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT', companyName: 'ООО Ромашка' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN', tags: 'React,Go' })
    // A review of the CLIENT (reviews exist after COMPLETED/PAID) → drives the browse card's rating.
    await prisma.review.create({ data: { rating: 5, gigId: gig.id, authorId: specialist.id, targetId: client.id } })

    const vm: GigCardVM = await toBrowseGigCardVM(gig as never, 'list')

    expect(vm.layout).toBe('list')
    expect(vm.status).toBe('open')
    expect(vm.rating.value).toBe(5) // the client's rating, not the (absent) specialist's
    expect(vm.rating.count).toBe(1)
    expect(vm.rating.verified).toBe(true)
    expect(vm.clientName).toBe('ООО Ромашка')
    expect(vm.tags).toEqual(['React', 'Go'])
  })

  it('reports a zero rating for a client with no reviews', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    const vm = await toBrowseGigCardVM(gig as never)
    expect(vm.rating.value).toBe(0)
    expect(vm.rating.count).toBe(0)
    expect(vm.layout).toBe('grid')
  })
})

describe('getGigSearch', () => {
  it('maps the queried gigs + FilterBar VM + count + view (grid layout)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const g1 = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    const g2 = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    const gigs = await prisma.gig.findMany({
      where: { id: { in: [g1.id, g2.id] } },
      include: { client: { select: { email: true, clientProfile: true } } },
    })

    const data = await getGigSearch({
      gigs: gigs as never,
      count: 2,
      page: 1,
      totalPages: 1,
      perPage: 25,
      view: 'grid',
      query: 'react',
    })

    expect(data.gigCards).toHaveLength(2)
    expect(data.count).toBe(2)
    expect(data.view).toBe('grid')
    expect(data.gigCards.every((c) => c.layout === 'grid')).toBe(true)
    expect(data.filterBar.query).toBe('react')
    expect(data.filterBar.view).toBe('grid')
    expect(data.filterBar.filters).toEqual([])
  })
})
