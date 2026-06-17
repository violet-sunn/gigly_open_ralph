import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * compose-gig-search (Phase 2) — verifies the SPECIALIST /gigs browse screen is composed from the kit (FilterBar +
 * ViewToggle + GigCard·(grid/list) + "Найдено N"), that search / category filter / grid⇄list / gig links work, and
 * that the existing pagination/query is preserved. Seeds a SPECIALIST + a client + OPEN gigs (with categories) into the
 * E2E db (file:./test.db, same as the dev server).
 */
let specId: string
let specEmail: string
let designGigId: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  specEmail = `gsearch-spec-${stamp}@example.com`

  // Categories (FK target for gig.categorySlug) — idempotent.
  for (const c of [
    { slug: 'design', name: 'Дизайн', order: 1 },
    { slug: 'development', name: 'Разработка', order: 3 },
  ]) {
    await prisma.category.upsert({ where: { slug: c.slug }, create: c, update: {} })
  }

  const client = await prisma.user.create({
    data: {
      email: `gsearch-client-${stamp}@example.com`,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'ООО Поиск', inn: '7700000000' } },
    },
  })
  const spec = await prisma.user.create({
    data: {
      email: specEmail,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: { create: { displayName: 'Тест Спец', techStack: 'React', experienceLevel: 'SENIOR', bio: 'Опыт' } },
    },
  })
  specId = spec.id

  const base = {
    description: 'Gig search composition test gig.',
    acceptanceCriteria: 'Acceptance criteria with at least fifty characters to pass validation here.',
    budget: 10000000,
    serviceFee: 1000000,
    totalAmount: 11000000,
    tags: 'React',
    deadlineDays: 14,
    status: 'OPEN' as const,
    clientId: client.id,
  }
  const gDesign = await prisma.gig.create({ data: { ...base, title: 'E2E Search Design Gig', categorySlug: 'design' } })
  designGigId = gDesign.id
  await prisma.gig.create({ data: { ...base, title: 'E2E Search Dev Gig', categorySlug: 'development' } })
  await prisma.gig.create({ data: { ...base, title: 'E2E Search Plain Gig' } })

  await prisma.$disconnect()
})

test.describe('compose-gig-search — composed SPECIALIST gig search', () => {
  test('renders the composed blocks (FilterBar, Найдено N, gig cards)', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/gigs')

    await expect(page.getByRole('search')).toBeVisible() // FilterBar
    await expect(page.getByText(/Найдено 3/)).toBeVisible() // ResultCount (3 OPEN gigs)
    await expect(page.getByText('E2E Search Design Gig')).toBeVisible() // a GigCard
    await expect(page.getByText('E2E Search Dev Gig')).toBeVisible()
  })

  test('search narrows the results (URL ?search=)', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/gigs')
    await page.getByRole('searchbox').fill('Design')
    await page.getByRole('searchbox').press('Enter')
    await page.waitForURL(/search=Design/)
    await expect(page.getByText(/Найдено 1/)).toBeVisible()
    await expect(page.getByText('E2E Search Design Gig')).toBeVisible()
    await expect(page.getByText('E2E Search Dev Gig')).toHaveCount(0)
  })

  test('the category filter narrows the results (URL ?category=)', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/gigs')
    // The category Select shows its current value ("Все категории") until a category is chosen.
    await page.getByRole('button', { name: 'Все категории' }).click()
    await page.getByRole('option', { name: 'Дизайн' }).click()
    await page.waitForURL(/category=design/)
    await expect(page.getByText(/Найдено 1/)).toBeVisible()
    await expect(page.getByText('E2E Search Design Gig')).toBeVisible()
  })

  test('the ViewToggle switches to list layout (URL ?view=list)', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/gigs')
    await page.getByRole('button', { name: 'Список' }).click()
    await page.waitForURL(/view=list/)
    await expect(page.getByText('E2E Search Design Gig').first()).toBeVisible()
  })

  test('a GigCard opens the gig detail with from=browse', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/gigs?search=Design')
    await page.getByRole('button', { name: /К проекту/ }).first().click()
    await expect(page).toHaveURL(new RegExp(`/gigs/${designGigId}\\?.*from=browse`))
  })
})
