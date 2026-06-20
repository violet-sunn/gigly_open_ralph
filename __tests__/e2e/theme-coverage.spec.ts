import { test, expect, type Page } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * theme-coverage (light-theme-screen-audit, ТЗ §8.4/§9) — loads the key routes under BOTH themes, asserts each
 * renders without a console error, applies the theme (the page bg switches — catching any screen that fails to
 * theme), and captures a screenshot per (route × theme) as a review artifact. Structural "no white-on-white" is
 * additionally guaranteed at the lint layer (lint:tokens is now fail-on-all — no raw literal can be baked in).
 */
const DARK_BG = 'rgb(1, 3, 14)' // surface-level-0 dark = #01030e
const LIGHT_BG = 'rgb(244, 245, 247)' // surface-level-0 light = #f4f5f7

let specId: string
let specEmail: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  specEmail = `theme-cov-${stamp}@example.com`
  const spec = await prisma.user.create({
    data: {
      email: specEmail,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: { create: { displayName: 'Тема Кавередж', techStack: 'React', experienceLevel: 'SENIOR', bio: 'x' } },
    },
  })
  specId = spec.id
  await prisma.$disconnect()
})

// Public routes (no session) + protected routes (SPECIALIST session) the audit must theme correctly.
const PUBLIC_ROUTES = ['/login?role=SPECIALIST', '/register?role=SPECIALIST', '/auth']
const PROTECTED_ROUTES = ['/dashboard', '/gigs', '/profile', '/settings']

async function assertThemed(page: Page, route: string, theme: 'dark' | 'light') {
  const errors: string[] = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  // Apply the theme before navigation via the persisted key the boot script reads.
  await page.addInitScript((t) => window.localStorage.setItem('gigly-theme', t), theme)
  await page.goto(route)
  await page.waitForLoadState('networkidle')
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
  // The page background switched with the theme (a screen that failed to theme would not).
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  expect(bg, `${route} @ ${theme} body bg`).toBe(theme === 'light' ? LIGHT_BG : DARK_BG)
  await page.screenshot({ path: `test-results/theme/${route.replace(/[^a-z0-9]/gi, '_')}__${theme}.png`, fullPage: true })
  expect(errors, `${route} @ ${theme} console errors`).toEqual([])
}

test.describe('theme-coverage — every key screen renders in both themes', () => {
  for (const theme of ['dark', 'light'] as const) {
    test(`public routes render in ${theme}`, async ({ page }) => {
      for (const route of PUBLIC_ROUTES) await assertThemed(page, route, theme)
    })

    test(`protected routes render in ${theme}`, async ({ page }) => {
      await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
      for (const route of PROTECTED_ROUTES) await assertThemed(page, route, theme)
    })
  }
})
