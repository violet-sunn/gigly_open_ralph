import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * theme-switch (add-light-theme) — verifies the net-new runtime light theme: dark is the default, the
 * Settings → Внешний вид switch flips the root `data-theme` to light and re-renders the UI light
 * (a surface element computes the light bg), the choice persists in localStorage (`gigly-theme`) and
 * survives a reload (applied before paint by the boot script, no flash), and switching back restores dark.
 * Seeds a CLIENT directly into the E2E db (file:./test.db).
 */
const LIGHT_APP_BG = 'rgb(244, 245, 247)' // surface-level-0 light = #f4f5f7
const DARK_APP_BG = 'rgb(1, 3, 14)' // surface-level-0 dark = #01030e

let userId: string
let userEmail: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  userEmail = `theme-${stamp}@example.com`
  const u = await prisma.user.create({
    data: {
      email: userEmail,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'ООО Тема', inn: '7700000099' } },
    },
  })
  userId = u.id
  await prisma.$disconnect()
})

test.describe('add-light-theme — runtime theme switch', () => {
  test('dark is the default theme', async ({ page }) => {
    await setE2ESession(page, { id: userId, email: userEmail, role: 'CLIENT' })
    await page.goto('/settings')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(DARK_APP_BG)
  })

  test('switching to Светлая applies light + persists across reload (no flash)', async ({ page }) => {
    await setE2ESession(page, { id: userId, email: userEmail, role: 'CLIENT' })
    await page.goto('/settings')
    await expect(page.getByRole('heading', { name: 'Внешний вид' })).toBeVisible()

    // The Внешний вид Select trigger is named by its aria-label; open it and pick Светлая.
    await expect(page.getByText('Тёмная')).toBeVisible() // reflects the current (default) theme
    await page.getByRole('button', { name: 'Тема оформления' }).click()
    await page.getByRole('option', { name: 'Светлая' }).click()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(LIGHT_APP_BG)
    expect(await page.evaluate(() => localStorage.getItem('gigly-theme'))).toBe('light')

    // Reload — the boot script applies light before paint (no flash-of-dark).
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(LIGHT_APP_BG)
  })

  test('switching back to Тёмная restores dark', async ({ page }) => {
    await setE2ESession(page, { id: userId, email: userEmail, role: 'CLIENT' })
    await page.goto('/settings')
    await page.evaluate(() => localStorage.setItem('gigly-theme', 'light'))
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    await page.getByRole('button', { name: 'Тема оформления' }).click()
    await page.getByRole('option', { name: 'Тёмная' }).click()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(DARK_APP_BG)
    expect(await page.evaluate(() => localStorage.getItem('gigly-theme'))).toBe('dark')
  })
})
