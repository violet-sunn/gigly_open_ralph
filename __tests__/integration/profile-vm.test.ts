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

import { getProfile } from '@/lib/view-models'

describe('getProfile', () => {
  it('returns null for a missing user', async () => {
    const data = await getProfile('nonexistent', { userId: 'u', role: 'SPECIALIST' })
    expect(data).toBeNull()
  })

  it('maps a SPECIALIST profile: header, stack, categories (favorites), experience, realized, rating, isOwner', async () => {
    const prisma = getTestPrismaClient()

    // Categories (reset between tests) — seed the two we will favorite.
    await prisma.category.createMany({
      data: [
        { slug: 'marketing', name: 'Маркетинг', order: 0 },
        { slug: 'design', name: 'Дизайн', order: 1 },
        { slug: 'programming', name: 'Программирование', order: 2 },
        { slug: 'development', name: 'Разработка', order: 3 },
        { slug: 'coding', name: 'Кодинг', order: 4 },
      ],
    })

    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      displayName: 'Иван Иванов',
      techStack: 'Python, Node.js, WebSocket',
      bio: 'Специализируюсь на высоконагруженных интерфейсах.',
    })
    // profile-evolution fields + work experience + favorites + a verified transaction.
    await prisma.specialistProfile.update({
      where: { userId: specialist.id },
      data: {
        position: 'Senior Frontend Engineer',
        phoneVerified: true,
        location: 'Москва',
        workExperience: {
          create: [
            { company: 'Yandex', title: 'Senior Frontend Developer', startYear: 2021, endYear: null, order: 0, description: 'Облачная платформа.' },
            { company: 'Вконтакте', title: 'Middle Frontend Developer', startYear: 2018, endYear: 2021, order: 1 },
          ],
        },
      },
    })
    await prisma.user.update({
      where: { id: specialist.id },
      data: { favoriteCategories: { connect: [{ slug: 'marketing' }, { slug: 'design' }] } },
    })

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const reviewer = await createTestUser(prisma, { role: 'CLIENT' })
    const realized = await createTestGig(prisma, {
      clientId: client.id,
      status: 'COMPLETED',
      assignedSpecialistId: specialist.id,
      tags: 'React,Go',
    })
    await prisma.review.create({ data: { rating: 5, gigId: realized.id, authorId: reviewer.id, targetId: specialist.id } })

    const data = await getProfile(specialist.id, { userId: specialist.id, role: 'SPECIALIST' })

    expect(data).not.toBeNull()
    expect(data!.role).toBe('SPECIALIST')
    expect(data!.isOwner).toBe(true)
    // header
    expect(data!.header.name).toBe('Иван Иванов')
    expect(data!.header.roleTag).toBe('Senior Frontend Engineer')
    expect(data!.header.verified).toBe(true)
    // stack
    expect(data!.stack!.tags.map((t) => t.label)).toEqual(['Python', 'Node.js', 'WebSocket'])
    // categories — exactly five, two favorited
    expect(data!.categories!.categories).toHaveLength(5)
    expect(data!.categories!.categories.filter((c) => c.favorite).map((c) => c.slug).sort()).toEqual(['design', 'marketing'])
    // experience — ordered, period «Наст. время» for the null endYear
    expect(data!.experience!.entries.map((e) => e.company)).toEqual(['Yandex', 'Вконтакте'])
    expect(data!.experience!.entries[0].period).toBe('2021 — Наст. время')
    expect(data!.experience!.entries[1].period).toBe('2018 — 2021')
    // realized COMPLETED gig
    expect(data!.realized).toHaveLength(1)
    expect(data!.realized[0].layout).toBe('list')
    // rating aggregate (not hardcoded)
    expect(data!.rating.value).toBe(5)
    expect(data!.rating.count).toBe(1)
  })

  it('marks isOwner=false for a different viewer (public view)', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const viewer = await createTestUser(prisma, { role: 'CLIENT' })

    const data = await getProfile(specialist.id, { userId: viewer.id, role: 'CLIENT' })
    expect(data).not.toBeNull()
    expect(data!.isOwner).toBe(false)
  })

  it('maps a CLIENT profile: company header + stats, no stack/experience/categories', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT', companyName: 'ООО Ромашка' })
    await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    await createTestGig(prisma, { clientId: client.id, status: 'COMPLETED' })

    const data = await getProfile(client.id, { userId: client.id, role: 'CLIENT' })
    expect(data).not.toBeNull()
    expect(data!.role).toBe('CLIENT')
    expect(data!.header.name).toBe('ООО Ромашка')
    expect(data!.stack).toBeUndefined()
    expect(data!.experience).toBeUndefined()
    expect(data!.categories).toBeUndefined()
    expect(data!.realized).toEqual([])
    // published=2, completed=1 surfaced in header stats
    expect(data!.header.stats.find((s) => s.label === 'Опубликовано')?.value).toBe(2)
    expect(data!.header.stats.find((s) => s.label === 'Завершено')?.value).toBe(1)
  })

  it('surfaces experienceLevel on the SPECIALIST ProfileData (for explicit display)', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST', experienceLevel: 'MIDDLE' })

    const data = await getProfile(specialist.id, { userId: specialist.id, role: 'SPECIALIST' })
    expect(data!.experienceLevel).toBe('MIDDLE')
  })
})

describe('getProfile — real online indicator (Спец #16)', () => {
  it('online=true when showOnlineStatus is on and lastSeenAt is fresh', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    await prisma.user.update({
      where: { id: specialist.id },
      data: { showOnlineStatus: true, lastSeenAt: new Date() },
    })

    const data = await getProfile(specialist.id, { userId: specialist.id, role: 'SPECIALIST' })
    expect(data!.header.online).toBe(true)
  })

  it('online=false when lastSeenAt is stale (older than the 5-min window)', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    await prisma.user.update({
      where: { id: specialist.id },
      data: { showOnlineStatus: true, lastSeenAt: new Date(Date.now() - 6 * 60_000) },
    })

    const data = await getProfile(specialist.id, { userId: specialist.id, role: 'SPECIALIST' })
    expect(data!.header.online).toBe(false)
  })

  it('online=false when lastSeenAt is null (never seen)', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    // lastSeenAt defaults to null; showOnlineStatus defaults to true.

    const data = await getProfile(specialist.id, { userId: specialist.id, role: 'SPECIALIST' })
    expect(data!.header.online).toBe(false)
  })

  it('online=false when showOnlineStatus is off, even with a fresh lastSeenAt', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    await prisma.user.update({
      where: { id: specialist.id },
      data: { showOnlineStatus: false, lastSeenAt: new Date() },
    })

    const data = await getProfile(specialist.id, { userId: specialist.id, role: 'SPECIALIST' })
    expect(data!.header.online).toBe(false)
  })

  it('applies the same gate to CLIENT profiles', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    await prisma.user.update({
      where: { id: client.id },
      data: { showOnlineStatus: true, lastSeenAt: new Date() },
    })

    const data = await getProfile(client.id, { userId: client.id, role: 'CLIENT' })
    expect(data!.role).toBe('CLIENT')
    expect(data!.header.online).toBe(true)
  })
})
