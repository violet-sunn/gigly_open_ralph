import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * e2e-cross-cutting (keyboard-navigation) — reconciled to the rebuilt AppShellDesign keyboard affordances:
 *  - the skip link «Перейти к основному содержимому» is the first focusable element and moves focus to #main-content
 *  - the login form has a logical Tab order (email → password)
 *  - the header search (placeholder «Поиск чего угодно…», shown on /gigs) is keyboard-driven (type + Enter → ?search=)
 *  - the notification bell (aria-label «Notifications») opens a role=menu dropdown that Escape closes, returning focus
 *
 * The deleted kit scenarios (welcome-modal focus trap, the «/» search shortcut, RoleCard aria-pressed, the English
 * nav links, pagination) targeted removed/non-rebuilt features and are dropped. Seeds a SPECIALIST.
 */
let specId: string
let specEmail: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  specEmail = `kbd-${stamp}@example.com`
  const spec = await prisma.user.create({
    data: {
      email: specEmail,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: { create: { displayName: 'Кбд Спец', techStack: 'React', experienceLevel: 'SENIOR', bio: 'x' } },
    },
  })
  specId = spec.id
  await prisma.$disconnect()
})

test.describe('e2e-cross-cutting — keyboard navigation', () => {
  test.describe('Skip to main content', () => {
    test('the skip link is the first focusable element', async ({ page }) => {
      await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
      await page.goto('/dashboard')

      await page.keyboard.press('Tab')
      const skipLink = page.locator('a:has-text("Перейти к основному содержимому"):focus')
      await expect(skipLink).toBeVisible()
    })

    test('activating the skip link moves focus to #main-content', async ({ page }) => {
      await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
      await page.goto('/dashboard')

      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
      await expect(page.locator('#main-content')).toBeFocused()
    })
  })

  test.describe('Login form tab order', () => {
    test('Tab moves from email to password', async ({ page }) => {
      await page.goto('/login')
      const email = page.locator('input[name="email"]')
      await email.focus()
      await page.keyboard.press('Tab')
      await expect(page.locator('input[name="password"]')).toBeFocused()
    })
  })

  test.describe('Header search by keyboard', () => {
    test('typing a query + Enter navigates to /gigs?search=', async ({ page }) => {
      await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
      await page.goto('/gigs')

      const search = page.locator('input[placeholder="Поиск чего угодно..."]')
      await search.focus()
      await expect(search).toBeFocused()
      await search.type('React')
      await page.keyboard.press('Enter')

      await page.waitForURL('**/gigs?search=React')
      expect(page.url()).toContain('search=React')
    })
  })

  test.describe('Notification dropdown Escape', () => {
    test('Escape closes the dropdown and returns focus to the bell', async ({ page }) => {
      await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
      await page.goto('/dashboard')

      const bell = page.locator('button[aria-label="Notifications"]')
      await bell.focus()
      await page.keyboard.press('Enter') // open

      const dropdown = page.locator('div[role="menu"]')
      await expect(dropdown).toBeVisible()

      await page.keyboard.press('Escape')
      await expect(dropdown).not.toBeVisible()
      await expect(bell).toBeFocused()
    })
  })
})
