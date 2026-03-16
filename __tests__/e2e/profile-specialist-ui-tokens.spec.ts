import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createTestUser } from '../helpers/seed'
import { setE2ESession } from '../helpers/auth'

// Setup test database connection for E2E tests
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
})

const prisma = new PrismaClient({
  adapter: adapter as any,
})

test.describe('Specialist Profile UI tokens (pilot)', () => {
  test.afterEach(async () => {
    await prisma.message.deleteMany({})
    await prisma.application.deleteMany({})
    await prisma.gig.deleteMany({})
    await prisma.specialistProfile.deleteMany({})
    await prisma.clientProfile.deleteMany({})
    await prisma.user.deleteMany({})
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('renders token-backed surfaces and edit affordances without new controls', async ({ page }) => {
    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      displayName: 'Тестовый Специалист',
      techStack: 'Senior Frontend Engineer',
      experienceLevel: 'SENIOR',
      bio: 'Короткое био для теста',
    })

    await setE2ESession(page, specialist)

    await page.goto('/profile')
    await expect(page).toHaveURL(/\/profile/)

    // Key blocks
    await expect(page.getByText('Опыт работы')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Редактировать' }).first()).toBeVisible()

    // Functionality guardrails
    await expect(page.getByText('Поделиться профилем')).toHaveCount(0)

    // Edit affordance routes to existing edit page
    const editLink = page.getByRole('link', { name: 'Редактировать' }).first()
    await expect(editLink).toHaveAttribute('href', '/profile/edit')

    // Token-backed surface colors (computed)
    // Note: computed styles return rgb()
    // Page background is applied on <body> (globals.css) and the route root container
    const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor)
    expect(bodyBg).toBe('rgb(1, 3, 14)') // #01030e

    // Root background contract: body is token-backed (layout + globals).
    // The protected layout may also apply background via inline style.
    const rootContainer = page.locator('div.min-h-screen').first()
    const rootBg = await rootContainer.evaluate((el) => window.getComputedStyle(el).backgroundColor)
    expect(rootBg).toBe('rgb(1, 3, 14)')

    // (We still assert computed colors for inner surfaces below.)



    const cards = page.locator('section').filter({ hasText: 'Опыт работы' })
    const cardBg = await cards.first().evaluate((el) => window.getComputedStyle(el).backgroundColor)
    expect(cardBg).toBe('rgb(6, 8, 19)') // #060813

    const nested = page.locator('text=Короткое био для теста').first().locator('..')
    const nestedBg = await nested.evaluate((el) => window.getComputedStyle(el).backgroundColor)
    expect(nestedBg).toBe('rgb(16, 18, 28)') // #10121c
  })
})
