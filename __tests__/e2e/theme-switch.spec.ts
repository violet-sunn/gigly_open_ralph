import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * e2e-cross-cutting (theme-switch) — verifies the runtime light/dark theme on the rebuilt surfaces: dark is the
 * default, the rebuilt SettingsDesign «Тема» Segmented control (ВНЕШНИЙ ВИД section) flips the root `data-theme`
 * and re-renders light, the choice persists in localStorage (`gigly-theme`) and survives a reload (applied before
 * paint by the boot script — no flash), and the shell header «Вид» button (aria-label «Переключить тему») toggles
 * the same theme. The old kit Select dropdown («Тема оформления»/«Внешний вид» heading) is gone. Seeds a CLIENT.
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

test.describe('e2e-cross-cutting — runtime theme switch', () => {
  test('dark is the default theme', async ({ page }) => {
    await setE2ESession(page, { id: userId, email: userEmail, role: 'CLIENT' })
    await page.goto('/settings')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(DARK_APP_BG)
  })

  test('the settings «Тема» segmented control applies light + persists across reload (no flash)', async ({ page }) => {
    await setE2ESession(page, { id: userId, email: userEmail, role: 'CLIENT' })
    await page.goto('/settings')
    await expect(page.getByText('ВНЕШНИЙ ВИД')).toBeVisible()
    await expect(page.getByText('Тёмная')).toBeVisible() // reflects the current (default) theme

    // The «Тема» row is a Segmented control of clickable options — pick «Светлая».
    await page.getByText('Светлая').click()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(LIGHT_APP_BG)
    expect(await page.evaluate(() => localStorage.getItem('gigly-theme'))).toBe('light')

    // Reload — the boot script applies light before paint (no flash-of-dark).
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(LIGHT_APP_BG)

    // Switching back to «Тёмная» restores dark.
    await page.getByText('Тёмная').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    expect(await page.evaluate(() => localStorage.getItem('gigly-theme'))).toBe('dark')
  })

  test('the header «Вид» button toggles the theme', async ({ page }) => {
    await setE2ESession(page, { id: userId, email: userEmail, role: 'CLIENT' })
    await page.goto('/dashboard')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    const viewBtn = page.getByRole('button', { name: 'Переключить тему' })
    await viewBtn.click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    expect(await page.evaluate(() => localStorage.getItem('gigly-theme'))).toBe('light')

    await viewBtn.click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    expect(await page.evaluate(() => localStorage.getItem('gigly-theme'))).toBe('dark')
  })
})
