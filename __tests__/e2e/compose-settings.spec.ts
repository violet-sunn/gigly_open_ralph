import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * reconcile-settings (Phase 3) — verifies /settings is reconciled to the prototype «Настройки» (four sections: ВНЕШНИЙ
 * ВИД with Тема/Язык/Валюта via CheckField + display-only ₽; УВЕДОМЛЕНИЯ + ПРИВАТНОСТЬ via ToggleField persisted through
 * updatePreferences; АККАУНТ «Выйти из аккаунта» + the preserved delete-account; АКТИВНЫЕ СЕССИИ via the real Session
 * backend with terminate). Seeds users + a Session row directly into the E2E db (file:./test.db).
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
  // A real session row → the «Активные сессии» list renders it (sid-less E2E token → terminable «Default»).
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

test.describe('reconcile-settings — reconciled settings screen', () => {
  test('the Topbar gear links to /settings', async ({ page }) => {
    await setE2ESession(page, { id: prefsId, email: prefsEmail, role: 'CLIENT' })
    await page.goto('/dashboard')
    const gearLink = page.locator('a[href="/settings"]')
    await expect(gearLink).toBeVisible()
    await gearLink.click()
    await expect(page).toHaveURL('/settings')
  })

  test('renders the four sections — ВНЕШНИЙ ВИД (RU), УВЕДОМЛЕНИЯ + ПРИВАТНОСТЬ toggles, АККАУНТ', async ({ page }) => {
    await setE2ESession(page, { id: prefsId, email: prefsEmail, role: 'CLIENT' })
    await page.goto('/settings')

    await expect(page.getByRole('heading', { name: 'Настройки' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Внешний вид' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Уведомления' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Приватность' })).toBeVisible()
    await expect(page.getByText('Русский')).toBeVisible() // CheckField language (RU default)
    await expect(page.getByText('₽ Рубль')).toBeVisible() // display-only currency

    // notification + privacy toggles default on, with the prototype labels
    await expect(page.getByRole('switch', { name: 'Новые отклики' })).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByRole('switch', { name: 'Уведомления об оплатах' })).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByRole('switch', { name: 'Показывать статус «онлайн»' })).toHaveAttribute('aria-checked', 'true')

    // account logout action present
    await expect(page.getByRole('button', { name: 'Выйти из аккаунта' })).toBeVisible()
  })

  test('toggling a notification + Save persists (reflected on reload)', async ({ page }) => {
    await setE2ESession(page, { id: prefsId, email: prefsEmail, role: 'CLIENT' })
    await page.goto('/settings')

    await page.getByRole('switch', { name: 'Сообщения' }).click() // turn off
    await page.getByRole('button', { name: 'Сохранить' }).click()
    await expect(page.getByText('Настройки сохранены.')).toBeVisible()

    await page.reload()
    await expect(page.getByRole('switch', { name: 'Сообщения' })).toHaveAttribute('aria-checked', 'false')
  })

  test('the active-sessions list renders the device and a session can be terminated', async ({ page }) => {
    await setE2ESession(page, { id: prefsId, email: prefsEmail, role: 'CLIENT' })
    await page.goto('/settings')

    await expect(page.getByRole('heading', { name: 'Активные сессии' })).toBeVisible()
    await expect(page.getByText('Chrome · Windows')).toBeVisible() // parsed from the seeded UA
    await page.getByRole('button', { name: 'Удалить сессию' }).first().click()
    await expect(page.getByText('Chrome · Windows')).toHaveCount(0) // removed after terminate + refresh
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
