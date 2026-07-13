import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * transport-settings — the «Настройки» popup (Figma node 3121:2609) opened from the shell gear (?settings=1), over the
 * current page. Six section cards: Учетные данные · Платежные данные · Уведомления · Безопасность · Язык и регион ·
 * Удалить аккаунт. Every control is WIRED (visibly changes + persists) or GRAYED+inert (2FA / Email / Password / avatar).
 * Seeds users + a Session row directly into the E2E db (file:./test.db).
 */
let prefsId: string
let prefsEmail: string
let delId: string
let delEmail: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  prefsEmail = `tset-prefs-${stamp}@example.com`
  delEmail = `tset-del-${stamp}@example.com`

  const prefs = await prisma.user.create({
    data: {
      email: prefsEmail,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'ООО Настройки', inn: '7700000021' } },
    },
  })
  prefsId = prefs.id
  // Two real session rows for the «Активные сессии» list + terminate-all (the E2E token is sid-less → both non-current).
  await prisma.session.create({ data: { userId: prefs.id, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64) Chrome/120.0 Safari/537.36' } })
  await prisma.session.create({ data: { userId: prefs.id, userAgent: 'Mozilla/5.0 (iPhone) Safari/605.1' } })

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

async function openSettings(page: any, id: string, email: string, role: 'CLIENT' | 'SPECIALIST' = 'CLIENT') {
  await setE2ESession(page, { id, email, role })
  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Настройки' }).click()
  await page.waitForURL(/settings=1/)
  await expect(page.getByRole('heading', { name: 'Учетные данные' })).toBeVisible()
}

test.describe('transport-settings — «Настройки» popup', () => {
  test('the gear opens the modal (?settings=1) with all six sections, and X closes it', async ({ page }) => {
    await openSettings(page, prefsId, prefsEmail)

    // modal chrome
    await expect(page.getByRole('dialog', { name: 'Настройки' })).toBeVisible()
    for (const title of ['Учетные данные', 'Платежные данные', 'Уведомления', 'Безопасность', 'Язык и регион', 'Удалить аккаунт']) {
      await expect(page.getByRole('heading', { name: title })).toBeVisible()
    }

    await page.getByRole('button', { name: 'Закрыть' }).click()
    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByRole('dialog', { name: 'Настройки' })).toHaveCount(0)
  })

  test('wired notification toggles flip + persist; sourceless ones are grayed', async ({ page }) => {
    await openSettings(page, prefsId, prefsEmail)

    // Wired (real bell source) — flips live + persists. Gates the in-app notification at display time.
    const msg = page.getByRole('switch', { name: 'Новые сообщения в чатах' })
    await expect(msg).toBeEnabled()
    await expect(msg).toHaveAttribute('aria-checked', 'true') // seeded default on
    await msg.click()
    await expect(msg).toHaveAttribute('aria-checked', 'false') // visibly flipped
    await expect(page.getByText('Сохранено')).toBeVisible()

    await page.reload() // ?settings=1 persists → modal re-opens with fresh data
    await expect(page.getByRole('switch', { name: 'Новые сообщения в чатах' })).toHaveAttribute('aria-checked', 'false')

    // Sourceless rows — nothing generates them, so they stay grayed/inert.
    await expect(page.getByRole('switch', { name: 'Новости и обновления платформы' })).toBeDisabled()
    await expect(page.getByRole('switch', { name: 'Новые гиги по вашему стеку' })).toBeDisabled()
  })

  test('currency is present but grayed/inert (out of MVP scope)', async ({ page }) => {
    await openSettings(page, prefsId, prefsEmail)

    // The currency control renders 1:1 but cannot be changed: the radiogroup is aria-disabled and pointer-events:none.
    const group = page.getByRole('radiogroup', { name: 'Валюта получения выплат' })
    await expect(group).toHaveAttribute('aria-disabled', 'true')
    await expect(group).toHaveCSS('pointer-events', 'none')
    // The seeded default (RUB) is shown selected; the others are visibly present but not selectable.
    await expect(page.getByRole('radio', { name: 'RUB' })).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByRole('radio', { name: 'USD' })).toHaveAttribute('aria-checked', 'false')
  })

  test('language is grayed/inert (out of MVP scope); timezone stays wired and persists', async ({ page }) => {
    await openSettings(page, prefsId, prefsEmail)

    // Язык интерфейса: no interactive <select> is rendered; the value renders muted/inert showing the default «Русский».
    await expect(page.getByLabel('Язык интерфейса')).toHaveCount(0)
    await expect(page.getByText('Русский')).toBeVisible()

    // Часовой пояс remains fully wired — it persists and is surfaced on the profile.
    await page.getByLabel('Часовой пояс').selectOption('Asia/Tbilisi')
    await expect(page.getByText('Сохранено')).toBeVisible()

    await page.reload()
    await expect(page.getByLabel('Часовой пояс')).toHaveValue('Asia/Tbilisi')
  })

  test('grayed controls (2FA / Email / Password) are present but inert', async ({ page }) => {
    await openSettings(page, prefsId, prefsEmail)

    await expect(page.getByRole('switch', { name: 'Двухфакторность' })).toBeDisabled()
    await expect(page.getByLabel('Email')).toBeDisabled()
    await expect(page.getByLabel('Password')).toBeDisabled()
  })

  test('«Завершить все неактивные сеансы» clears the inactive sessions', async ({ page }) => {
    await openSettings(page, prefsId, prefsEmail)

    await expect(page.locator('[data-session-row]')).toHaveCount(2)
    await page.getByRole('button', { name: 'Завершить все неактивные сеансы' }).click()
    await expect(page.locator('[data-session-row]')).toHaveCount(0)
  })

  test('delete-account: correct email tears down and redirects to /', async ({ page }) => {
    await openSettings(page, delId, delEmail, 'SPECIALIST')

    await page.getByRole('button', { name: 'Удалить аккаунт навсегда' }).click()
    await expect(page.getByText(/Это действие необратимо/)).toBeVisible()
    await page.locator('input[name="confirmEmail"]').fill(delEmail)
    await page.getByRole('button', { name: 'Подтвердить удаление' }).click()

    await page.waitForURL((url: URL) => url.pathname === '/', { timeout: 15000 })
    expect(new URL(page.url()).pathname).toBe('/')
  })
})
