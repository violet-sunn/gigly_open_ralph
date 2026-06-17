import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * compose-client-dashboard (Phase 2) — verifies the CLIENT /dashboard is composed from the kit (BannerCard + Tabs +
 * GigCard·grid + CreateGigCTA + MessagesPanel) with real data, and that gig links + the create flow work. Seeds a
 * CLIENT + a gig directly into the E2E db (file:./test.db, same as the dev server) so the dashboard has real content.
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
  test('renders the composed blocks (banner, tabs, create CTA, gig card)', async ({ page }) => {
    await setE2ESession(page, { id: userId, email: userEmail, role: 'CLIENT' })
    await page.goto('/dashboard')

    await expect(page.getByText(/Найдите сильного специалиста/)).toBeVisible() // BannerCard
    await expect(page.getByRole('tablist')).toBeVisible() // Tabs
    await expect(page.getByRole('link', { name: /Создать гиг/ }).first()).toBeVisible() // CreateGigCTA / banner CTA
    await expect(page.getByText('E2E Dashboard Gig')).toBeVisible() // a GigCard
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
