import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * e2e-settings (reconciliation #11) — verifies /settings is reconciled to the prototype «Настройки» page card
 * (SettingsDesign.tsx). Five sections: ВНЕШНИЙ ВИД (Тема segmented «Тёмная»/«Светлая» → lib/theme; Язык «Русский»;
 * display-only «₽ Рубль»), УВЕДОМЛЕНИЯ + ПРИВАТНОСТЬ (bare-div toggles whose state lives in hidden inputs, persisted
 * via updatePreferences behind «Сохранить»), АКТИВНЫЕ СЕССИИ (real Session backend, terminate via «Завершить»), АККАУНТ
 * («Выйти из аккаунта» + reveal-to-confirm «Удалить аккаунт»). The shell header supplies the «НАСТРОЙКИ» title.
 * Section names are UPPERCASE <span>s (not headings); toggles have no role/aria-checked — state is asserted via the
 * row's hidden <input value="true|false">. Seeds users + a Session row directly into the E2E db (file:./test.db).
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
  // A real session row → the «Активные сессии» list renders it. The E2E token is sid-less, so this row is non-current
  // → terminable via «Завершить». The UA parses to «Chrome · Windows» (lib/user-agent).
  await prisma.session.create({
    data: { userId: prefs.id, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64) Chrome/120.0 Safari/537.36' },
  })

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

test.describe('e2e-settings — reconciled settings screen', () => {
  test('the sidebar gear links to /settings', async ({ page }) => {
    await setE2ESession(page, { id: prefsId, email: prefsEmail, role: 'CLIENT' })
    await page.goto('/dashboard')
    const gearLink = page.locator('a[href="/settings"]')
    await expect(gearLink).toBeVisible()
    await gearLink.click()
    await expect(page).toHaveURL('/settings')
  })

  test('renders the five sections + ВНЕШНИЙ ВИД controls and the account logout', async ({ page }) => {
    await setE2ESession(page, { id: prefsId, email: prefsEmail, role: 'CLIENT' })
    await page.goto('/settings')

    // Section labels are UPPERCASE <span>s (not headings).
    await expect(page.getByText('ВНЕШНИЙ ВИД', { exact: true })).toBeVisible()
    await expect(page.getByText('УВЕДОМЛЕНИЯ', { exact: true })).toBeVisible()
    await expect(page.getByText('ПРИВАТНОСТЬ', { exact: true })).toBeVisible()
    await expect(page.getByText('АККАУНТ', { exact: true })).toBeVisible()

    // ВНЕШНИЙ ВИД controls: Тема segmented, Язык «Русский», display-only «₽ Рубль».
    await expect(page.getByText('Тёмная')).toBeVisible()
    await expect(page.getByText('Светлая')).toBeVisible()
    await expect(page.getByText('Русский')).toBeVisible()
    await expect(page.getByText('₽ Рубль')).toBeVisible()

    // Notification + privacy row labels (bare-div toggles — asserted by their text labels here).
    await expect(page.getByText('Новые отклики')).toBeVisible()
    await expect(page.getByText('Сообщения')).toBeVisible()
    await expect(page.getByText('Уведомления об оплатах')).toBeVisible()
    await expect(page.getByText('Показывать статус «онлайн»')).toBeVisible()

    // Account logout action present.
    await expect(page.getByRole('button', { name: 'Выйти из аккаунта' })).toBeVisible()
  })

  test('the Тема segmented control switches the theme via lib/theme', async ({ page }) => {
    await setE2ESession(page, { id: prefsId, email: prefsEmail, role: 'CLIENT' })
    await page.goto('/settings')

    await page.getByText('Светлая').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    await page.getByText('Тёмная').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  test('toggling a notification + Save persists (reflected on reload)', async ({ page }) => {
    await setE2ESession(page, { id: prefsId, email: prefsEmail, role: 'CLIENT' })
    await page.goto('/settings')

    // The toggle is a bare <div> with no role/aria — its submitted state lives in the row's hidden input.
    const hidden = page.locator('input[name="notifyMessages"]')
    await expect(hidden).toHaveValue('true') // seeded default on

    // Click the toggle <div> that follows the «Сообщения» label, then Save.
    await page.getByText('Сообщения', { exact: true }).locator('xpath=following-sibling::div').click()
    await expect(hidden).toHaveValue('false')
    await page.getByRole('button', { name: 'Сохранить' }).click()
    await expect(page.getByText('Настройки сохранены.')).toBeVisible()

    await page.reload()
    await expect(page.locator('input[name="notifyMessages"]')).toHaveValue('false') // persisted
  })

  test('the active-sessions list renders the device and a session can be terminated', async ({ page }) => {
    await setE2ESession(page, { id: prefsId, email: prefsEmail, role: 'CLIENT' })
    await page.goto('/settings')

    await expect(page.getByText('АКТИВНЫЕ СЕССИИ')).toBeVisible()
    await expect(page.getByText('Chrome · Windows')).toBeVisible() // parsed from the seeded UA
    await page.getByRole('button', { name: 'Завершить' }).first().click()
    await expect(page.getByText('Chrome · Windows')).toHaveCount(0) // removed after terminate + refresh
  })

  test('delete-account: wrong email is rejected, correct email tears down and redirects to /', async ({ page }) => {
    await setE2ESession(page, { id: delId, email: delEmail, role: 'SPECIALIST' })
    await page.goto('/settings')

    await page.getByRole('button', { name: 'Удалить аккаунт' }).click() // reveal confirm
    await expect(page.getByText(/Это действие необратимо/)).toBeVisible()

    // Wrong email → rejected, still on /settings, account intact.
    await page.locator('input[name="confirmEmail"]').fill('wrong@example.com')
    await page.getByRole('button', { name: 'Подтвердить удаление' }).click()
    await expect(page.getByText(/type your account email/i)).toBeVisible()
    await expect(page).toHaveURL('/settings')

    // Reload for a clean confirm form, then the correct email → teardown + redirect to /.
    await page.reload()
    await page.getByRole('button', { name: 'Удалить аккаунт' }).click()
    await page.locator('input[name="confirmEmail"]').fill(delEmail)
    await page.getByRole('button', { name: 'Подтвердить удаление' }).click()
    await page.waitForURL((url) => url.pathname === '/', { timeout: 15000 })
    expect(new URL(page.url()).pathname).toBe('/')
  })
})
