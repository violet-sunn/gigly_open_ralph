import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { resetE2EDb } from '../helpers/seed'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * compose-gig-search — verifies the SPECIALIST /gigs browse screen rebuilt on the prototype's «ПОИСК ГИГОВ» block
 * (app/(protected)/gigs/GigSearchDesign.tsx, rendering app/_design/GigCard.tsx in `full` mode): four native filter
 * <select>s now in the SHELL HEADER (category/budget/sort/rating — prototype data-dc-tpl="51" cluster), the «Найдено»
 * <h2> + a separate count badge, the FULL GigCard grid, and the prototype empty state. Text search also lives in the
 * SHELL HEADER (placeholder «Поиск чего угодно...», Enter →
 * /gigs?search=) — there is no content search box, no in-content title (shell «ПОИСК ГИГОВ»), and no grid/list
 * switcher. Each GigCard is a card-wide <Link> to /gigs/[id]?from=browse («К проекту» is a <span>, not a button).
 * Seeds a SPECIALIST + a client + three OPEN gigs (design / development / uncategorized) into file:./test.db.
 */
let specId: string
let specEmail: string
let designGigId: string

// The «Найдено» count is an <h2> heading + a SEPARATE count badge <span> — scope the badge to the heading's row so a
// card's digits (rating count, budget) can't collide.
const countBadge = (page: import('@playwright/test').Page, n: string) =>
  page.getByRole('heading', { name: 'Найдено' }).locator('..').getByText(n, { exact: true })

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  // Clean slate so the «Найдено» count reflects only this spec's three seeded gigs (not other specs' leftovers).
  await resetE2EDb(prisma)
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

test.describe('compose-gig-search — rebuilt SPECIALIST gig search', () => {
  test('renders the filter selects, the «Найдено» count, and the full GigCard grid', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/gigs')

    // Four native <select>s in the shell header — category / budget / sort / rating (NOT a content role="search" box).
    await expect(page.getByRole('combobox')).toHaveCount(4)
    await expect(page.getByRole('combobox').filter({ hasText: 'Все категории' })).toBeVisible()
    await expect(page.getByRole('combobox').filter({ hasText: 'до 50 000 ₽' })).toBeVisible()
    await expect(page.getByRole('combobox').filter({ hasText: 'По новизне' })).toBeVisible()
    await expect(page.getByRole('combobox').filter({ hasText: 'Любой рейтинг' })).toBeVisible()

    // «Найдено» heading + the count badge (3 OPEN gigs).
    await expect(page.getByRole('heading', { name: 'Найдено' })).toBeVisible()
    await expect(countBadge(page, '3')).toBeVisible()

    // The full GigCards.
    await expect(page.getByText('E2E Search Design Gig')).toBeVisible()
    await expect(page.getByText('E2E Search Dev Gig')).toBeVisible()
  })

  test('shell-header search narrows the results (URL ?search=)', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/gigs')
    // Text search lives in the shell header now.
    await page.getByPlaceholder('Поиск чего угодно...').fill('Design')
    await page.getByPlaceholder('Поиск чего угодно...').press('Enter')
    await page.waitForURL(/search=Design/)
    await expect(countBadge(page, '1')).toBeVisible()
    await expect(page.getByText('E2E Search Design Gig')).toBeVisible()
    await expect(page.getByText('E2E Search Dev Gig')).toHaveCount(0)
  })

  test('the category filter narrows the results (URL ?category=)', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/gigs')
    await page.getByRole('combobox').filter({ hasText: 'Все категории' }).selectOption({ label: 'Дизайн' })
    await page.waitForURL(/category=design/)
    await expect(countBadge(page, '1')).toBeVisible()
    await expect(page.getByText('E2E Search Design Gig')).toBeVisible()
  })

  test('the budget filter narrows the results (URL ?minBudget=)', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/gigs')
    // The seeded gigs are 100 000 ₽ (budget 10000000 kopecks) → «от 150 000 ₽» (minBudget=150000) excludes all three.
    await page.getByRole('combobox').filter({ hasText: 'до 50 000 ₽' }).selectOption({ label: 'от 150 000 ₽' })
    await page.waitForURL(/minBudget=150000/)
    await expect(countBadge(page, '0')).toBeVisible()
    await expect(page.getByText('Ничего не нашлось')).toBeVisible()
  })

  test('a GigCard opens the gig detail with from=browse', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/gigs?search=Design')
    // The whole card is a <Link> to /gigs/[id]?from=browse («К проекту» is a <span>, not a button) — click by title.
    await page.getByRole('link', { name: /E2E Search Design Gig/ }).first().click()
    await expect(page).toHaveURL(new RegExp(`/gigs/${designGigId}\\?.*from=browse`))
  })

  test('shows the prototype empty state when nothing matches', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/gigs?search=zzz-nonexistent-gig-12345')
    await expect(countBadge(page, '0')).toBeVisible()
    await expect(page.getByText('Ничего не нашлось')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Сбросить фильтры' })).toBeVisible()
  })
})
