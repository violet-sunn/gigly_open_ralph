import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * compose-client-dashboard — verifies the CLIENT /dashboard rebuilt on the gigly_full_design prototype
 * (app/(protected)/dashboard/DashboardDesign.tsx): WELCOME «Добро пожаловать в Gigly!» + the «Мои гиги»
 * panel with the four CLIENT <div> tab chips (Все/В работе/На проверке/Завершённые — no «Заявки») + the
 * design GigCard feed; col2 = the «Создайте первый гиг» panel + «Сообщения». The company shows NO «Требует
 * внимания» strip (attention is empty for CLIENT), and the page title lives in the shell header
 * (<h1>«ДАШБОРД»</h1>). Seeds a CLIENT + an OPEN gig directly into the E2E db (file:./test.db).
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

test.describe('compose-client-dashboard — rebuilt CLIENT dashboard', () => {
  test('renders the rebuilt blocks (welcome, мои гиги + four tabs, create panel, gig card; no attention strip)', async ({ page }) => {
    await setE2ESession(page, { id: userId, email: userEmail, role: 'CLIENT' })
    await page.goto('/dashboard')

    await expect(page.getByText('Добро пожаловать в Gigly!')).toBeVisible() // WELCOME
    await expect(page.getByText('Заполните профиль')).toBeVisible() // an onboarding tile
    await expect(page.getByRole('heading', { name: 'Мои гиги' })).toBeVisible() // BOARD col1 panel header
    for (const label of ['Все', 'В работе', 'На проверке', 'Завершённые']) {
      // CLIENT has four tabs — NO «Заявки». The only seed gig is OPEN, so no tab/card status collision.
      await expect(page.getByText(label, { exact: true }).first()).toBeVisible()
    }
    await expect(page.getByRole('heading', { name: 'Создайте первый гиг' })).toBeVisible() // col2 create panel
    await expect(page.getByRole('link', { name: /Создать гиг/ }).first()).toBeVisible() // create CTA
    await expect(page.getByText('E2E Dashboard Gig')).toBeVisible() // a GigCard
    await expect(page.getByRole('heading', { name: 'Сообщения' })).toBeVisible() // col2 messages panel
    await expect(page.getByRole('heading', { name: 'Требует внимания' })).toHaveCount(0) // company has no attention strip
    await expect(page.getByRole('heading', { name: 'ДАШБОРД' })).toBeVisible() // title lives in the shell header now
  })

  test('a GigCard opens the gig detail', async ({ page }) => {
    await setE2ESession(page, { id: userId, email: userEmail, role: 'CLIENT' })
    await page.goto('/dashboard')
    // The compact GigCard is a Link (its footer CTA only renders on the browse screen) — click by title.
    await page.getByRole('link', { name: /E2E Dashboard Gig/ }).first().click()
    await expect(page).toHaveURL(new RegExp(`/gigs/${gigId}`))
  })

  test('the create CTA opens /gigs/new', async ({ page }) => {
    await setE2ESession(page, { id: userId, email: userEmail, role: 'CLIENT' })
    await page.goto('/dashboard')
    await page.getByRole('link', { name: /Создать гиг/ }).first().click()
    await expect(page).toHaveURL(/\/gigs\/new/)
  })
})
