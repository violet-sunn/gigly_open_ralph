import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'

/**
 * compose-shell-cutover (Phase 2) — verifies the protected layout renders the AppShell + role-based RU SidebarNav
 * (F3 logical parity) + Topbar, preserves logout, and guards unauthenticated access.
 *
 * Uses setE2ESession (the working E2E session helper). /dashboard is null-safe for a session without a DB row
 * (the page uses `user?.`), so the shell renders without seeding.
 */
test.describe('compose-shell-cutover — protected app shell', () => {
  test('CLIENT: RU sidebar (Дашборд/Мои гиги/Чаты/Финансы/Споры), no Поиск; logout works', async ({ page }) => {
    await setE2ESession(page, {
      id: 'shell-client-e2e',
      email: 'shell-client-e2e@example.com',
      role: 'CLIENT',
    })
    await page.goto('/dashboard')

    for (const label of ['Дашборд', 'Мои гиги', 'Чаты', 'Финансы', 'Споры']) {
      await expect(page.getByRole('link', { name: new RegExp(label) })).toBeVisible()
    }
    // CLIENT has no "Поиск"
    await expect(page.getByRole('link', { name: /Поиск/ })).toHaveCount(0)

    // logout — submit the SidebarNav "Выйти" form (→ logoutUser → redirect to /). We submit the form
    // directly rather than coordinate-clicking: the fabricated no-DB user triggers the dashboard's
    // onboarding overlay (a pre-existing dashboard concern, not the shell) that sits over the viewport.
    const logoutButton = page.getByRole('button', { name: /Выйти/ })
    await expect(logoutButton).toBeVisible()
    await page
      .locator('form:has(button:has-text("Выйти"))')
      .evaluate((f) => (f as HTMLFormElement).requestSubmit())
    await expect(page).toHaveURL('/', { timeout: 10000 })
  })

  test('SPECIALIST: sidebar additionally shows Поиск', async ({ page }) => {
    await setE2ESession(page, {
      id: 'shell-spec-e2e',
      email: 'shell-spec-e2e@example.com',
      role: 'SPECIALIST',
    })
    await page.goto('/dashboard')

    await expect(page.getByRole('link', { name: /Дашборд/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Поиск/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Финансы/ })).toBeVisible()
  })

  test('unauthenticated request to a protected route redirects to /login', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})
