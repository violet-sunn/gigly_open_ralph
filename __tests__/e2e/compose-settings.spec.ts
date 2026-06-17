import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * compose-settings (Phase 2) — verifies /settings is composed from the kit (language Select + notification ToggleList +
 * a delete DangerAction) over the account-preferences data layer, reached from the Topbar gear: the gear links to
 * /settings; the screen reflects the stored prefs (RU default + the 3 toggles); toggling + Save persists; «Удалить
 * аккаунт» confirms via the account email (wrong → rejected, correct → teardown + redirect to /). No full-screen
 * Настройки frame → F1 is component-level (the library Select/Toggle).
 */
let prefsId: string
let prefsEmail: string
let delId: string
let delEmail: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  prefsEmail = `cset-prefs-${stamp}@example.com`
  delEmail = `cset-del-${stamp}@example.com`

  const prefs = await prisma.user.create({
    data: {
      email: prefsEmail,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'ООО Настройки', inn: '7700000020' } },
    },
  })
  prefsId = prefs.id

  const del = await prisma.user.create({
    data: {
      email: delEmail,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: { create: { displayName: 'Удаляемый', techStack: 'React', experienceLevel: 'SENIOR' } },
    },
  })
  delId = del.id

  await prisma.$disconnect()
})

test.describe('compose-settings — composed settings screen', () => {
  test('the Topbar gear links to /settings', async ({ page }) => {
    await setE2ESession(page, { id: prefsId, email: prefsEmail, role: 'CLIENT' })
    await page.goto('/dashboard')
    const gearLink = page.locator('a[href="/settings"]')
    await expect(gearLink).toBeVisible()
    await gearLink.click()
    await expect(page).toHaveURL('/settings')
  })

  test('shows the language Select (RU default) + the three notification toggles', async ({ page }) => {
    await setE2ESession(page, { id: prefsId, email: prefsEmail, role: 'CLIENT' })
    await page.goto('/settings')

    await expect(page.getByRole('heading', { name: 'Настройки' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Язык' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Уведомления' })).toBeVisible()
    await expect(page.getByText('Русский')).toBeVisible() // Select shows the RU default
    await expect(page.getByRole('switch', { name: 'Отклики' })).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByRole('switch', { name: 'Изменения статуса' })).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByRole('switch', { name: 'Сообщения' })).toHaveAttribute('aria-checked', 'true')
  })

  test('toggling a category + Save persists (reflected on reload)', async ({ page }) => {
    await setE2ESession(page, { id: prefsId, email: prefsEmail, role: 'CLIENT' })
    await page.goto('/settings')

    await page.getByRole('switch', { name: 'Сообщения' }).click() // turn off
    await page.getByRole('button', { name: 'Сохранить' }).click()
    await expect(page.getByText('Настройки сохранены.')).toBeVisible()

    await page.reload()
    await expect(page.getByRole('switch', { name: 'Сообщения' })).toHaveAttribute('aria-checked', 'false')
  })

  test('delete-account: wrong email is rejected, correct email tears down and redirects to /', async ({ page }) => {
    await setE2ESession(page, { id: delId, email: delEmail, role: 'SPECIALIST' })
    await page.goto('/settings')

    await page.getByRole('button', { name: 'Удалить аккаунт' }).click() // reveal confirm
    await expect(page.getByText(/Это действие необратимо/)).toBeVisible()

    // Wrong email → rejected, still on /settings, account intact
    await page.locator('input[name="confirmEmail"]').fill('wrong@example.com')
    await page.getByRole('button', { name: 'Подтвердить удаление' }).click()
    await expect(page.getByText(/type your account email/i)).toBeVisible()
    await expect(page).toHaveURL('/settings')

    // Reload for a clean confirm form, then the correct email → teardown + redirect to /
    await page.reload()
    await page.getByRole('button', { name: 'Удалить аккаунт' }).click()
    await page.locator('input[name="confirmEmail"]').fill(delEmail)
    await page.getByRole('button', { name: 'Подтвердить удаление' }).click()
    await page.waitForURL((url) => url.pathname === '/', { timeout: 15000 })
    expect(new URL(page.url()).pathname).toBe('/')
  })
})
