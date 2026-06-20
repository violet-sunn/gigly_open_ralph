import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * compose-client-dashboard (reconcile-dashboards, Phase 1 — reconciled to Дашборд/company 3371:5387) — verifies the
 * CLIENT /dashboard is composed from the kit (WELCOME greeting + OnboardingCard×2 → 2-col BOARD: Активные задачи Tabs +
 * GigCard feed ‖ Найти новый проект CreateGigCTA + Сообщения MessagesPanel) with real data, that gig links + the create
 * flow work, and that NO attention strip renders on company. Seeds a CLIENT + a gig directly into the E2E db
 * (file:./test.db, same as the dev server) so the dashboard has real content.
 */
let userId: string
let userEmail: string
let gigId: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  userEmail = `cdash-client-${Date.now()}@example.com`
  const user = await prisma.user.create({
    data: {
      email: userEmail,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'ООО Тест', inn: '7700000000' } },
    },
  })
  userId = user.id
  const gig = await prisma.gig.create({
    data: {
      title: 'E2E Dashboard Gig',
      description: 'Dashboard composition test gig.',
      acceptanceCriteria: 'Acceptance criteria with at least fifty characters to pass validation here.',
      budget: 10000000,
      serviceFee: 1000000,
      totalAmount: 11000000,
      status: 'OPEN',
      tags: 'React',
      deadlineDays: 14,
      clientId: user.id,
    },
  })
  gigId = gig.id
  await prisma.$disconnect()
})

test.describe('compose-client-dashboard — composed CLIENT dashboard', () => {
  test('renders the composed blocks (greeting, onboarding, tabs, create CTA, gig card; no attention strip)', async ({ page }) => {
    await setE2ESession(page, { id: userId, email: userEmail, role: 'CLIENT' })
    await page.goto('/dashboard')

    await expect(page.getByText(/Здравствуйте/)).toBeVisible() // WELCOME greeting (no BannerCard)
    await expect(page.getByText('Заполните профиль')).toBeVisible() // an OnboardingCard
    await expect(page.getByText('Активные задачи')).toBeVisible() // BOARD col1 SectionHeader
    await expect(page.getByRole('tablist')).toBeVisible() // Tabs (Menu-switcher)
    await expect(page.getByRole('link', { name: /Создать гиг/ }).first()).toBeVisible() // CreateGigCTA
    await expect(page.getByText('E2E Dashboard Gig')).toBeVisible() // a GigCard
    await expect(page.getByText('Уведомления')).toHaveCount(0) // company hides the attention strip
    await expect(page.getByRole('heading', { name: 'Дашборд' })).toHaveCount(0) // no page-title
  })

  test('a GigCard opens the gig detail', async ({ page }) => {
    await setE2ESession(page, { id: userId, email: userEmail, role: 'CLIENT' })
    await page.goto('/dashboard')
    await page.getByRole('button', { name: /К проекту/ }).first().click()
    await expect(page).toHaveURL(new RegExp(`/gigs/${gigId}`))
  })

  test('the create CTA opens /gigs/new', async ({ page }) => {
    await setE2ESession(page, { id: userId, email: userEmail, role: 'CLIENT' })
    await page.goto('/dashboard')
    await page.getByRole('link', { name: /Создать гиг/ }).first().click()
    await expect(page).toHaveURL(/\/gigs\/new/)
  })
})
