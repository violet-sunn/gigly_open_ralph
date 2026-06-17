import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { createTestUser } from '../helpers/seed'

// Mock @/lib/prisma to use the test database (lazy getter)
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))

// Mock next/headers for session cookie management
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

// Mock next/navigation redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

// Import after mocks
import { createGig } from '@/app/actions/gig'
import { setFavoriteCategories } from '@/app/actions/category'
import { CATEGORIES, isCategorySlug, getCategories, getFavoriteCategories } from '@/lib/categories'
import { CATEGORY_LABEL } from '@/app/components/blocks/util'

async function seedCategories(prisma: ReturnType<typeof getTestPrismaClient>) {
  let order = 0
  for (const c of CATEGORIES) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: { slug: c.slug, name: c.name, order: order++ } })
  }
}

function gigForm(opts?: { title?: string; category?: string }) {
  const fd = new FormData()
  fd.set('title', opts?.title ?? `Гиг ${Math.random().toString(36).slice(2)}`)
  fd.set('description', 'Подробное описание задачи для теста категорий.')
  fd.set('acceptanceCriteria', 'Критерии приёмки должны быть достаточно длинными, минимум пятьдесят символов точно.')
  fd.set('budget', '120000')
  fd.set('tags', 'React,TypeScript')
  if (opts?.category !== undefined) fd.set('category', opts.category)
  return fd
}

describe('Category taxonomy — model & contract', () => {
  beforeEach(async () => {
    setTestSessionToken(undefined)
    await seedCategories(getTestPrismaClient())
  })
  afterEach(() => setTestSessionToken(undefined))

  it('seeds exactly the five categories whose slugs match the UI contract', async () => {
    const prisma = getTestPrismaClient()
    const rows = await prisma.category.findMany()
    expect(rows).toHaveLength(5)
    const slugs = rows.map((r) => r.slug).sort()
    expect(slugs).toEqual(Object.keys(CATEGORY_LABEL).sort())
    // names match the UI labels
    for (const r of rows) expect(r.name).toBe(CATEGORY_LABEL[r.slug as keyof typeof CATEGORY_LABEL])
  })

  it('CATEGORIES is exactly the five and isCategorySlug guards the set', () => {
    expect(CATEGORIES).toHaveLength(5)
    expect(CATEGORIES.map((c) => c.slug).sort()).toEqual(Object.keys(CATEGORY_LABEL).sort())
    expect(isCategorySlug('design')).toBe(true)
    expect(isCategorySlug('mauve')).toBe(false)
  })

  it('getCategories returns the five, ordered', async () => {
    const cats = await getCategories()
    expect(cats).toHaveLength(5)
    expect(cats.map((c) => c.order)).toEqual([0, 1, 2, 3, 4])
  })
})

describe('Category taxonomy — gig ⇄ category', () => {
  beforeEach(async () => {
    setTestSessionToken(undefined)
    await seedCategories(getTestPrismaClient())
  })
  afterEach(() => setTestSessionToken(undefined))

  it('createGig accepts a valid category and persists it', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    await withAuthContext(client, async () => {
      await expect(createGig(null, gigForm({ title: 'Категорийный гиг', category: 'design' }))).rejects.toThrow('NEXT_REDIRECT')
    })
    const gig = await prisma.gig.findFirst({ where: { clientId: client.id }, include: { category: true } })
    expect(gig?.categorySlug).toBe('design')
    expect(gig?.category?.name).toBe('Дизайн')
  })

  it('createGig rejects an off-taxonomy category', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const result = await withAuthContext(client, async () => createGig(null, gigForm({ category: 'mauve' })))
    expect(result?.error).toBeTruthy()
    expect(await prisma.gig.count({ where: { clientId: client.id } })).toBe(0)
  })

  it('createGig without a category succeeds with null (safe-default)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    await withAuthContext(client, async () => {
      await expect(createGig(null, gigForm({ title: 'Без категории' }))).rejects.toThrow('NEXT_REDIRECT')
    })
    const gig = await prisma.gig.findFirst({ where: { clientId: client.id } })
    expect(gig?.categorySlug).toBeNull()
  })
})

describe('Category taxonomy — specialist favorites', () => {
  beforeEach(async () => {
    setTestSessionToken(undefined)
    await seedCategories(getTestPrismaClient())
  })
  afterEach(() => setTestSessionToken(undefined))

  function favForm(...slugs: string[]) {
    const fd = new FormData()
    for (const s of slugs) fd.append('categories', s)
    return fd
  }

  it('a specialist sets and queries favorites; re-setting replaces them', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    await withAuthContext(specialist, async () => setFavoriteCategories(null, favForm('design', 'coding')))
    let favs = await getFavoriteCategories(specialist.id)
    expect(favs.map((c) => c.slug).sort()).toEqual(['coding', 'design'])

    await withAuthContext(specialist, async () => setFavoriteCategories(null, favForm('marketing')))
    favs = await getFavoriteCategories(specialist.id)
    expect(favs.map((c) => c.slug)).toEqual(['marketing'])
  })

  it('off-taxonomy slugs are filtered out', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    await withAuthContext(specialist, async () => setFavoriteCategories(null, favForm('design', 'mauve')))
    const favs = await getFavoriteCategories(specialist.id)
    expect(favs.map((c) => c.slug)).toEqual(['design'])
  })

  it('rejects a non-specialist', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const result = await withAuthContext(client, async () => setFavoriteCategories(null, favForm('design')))
    expect(result?.error).toBeTruthy()
    expect(await getFavoriteCategories(client.id)).toHaveLength(0)
  })
})
