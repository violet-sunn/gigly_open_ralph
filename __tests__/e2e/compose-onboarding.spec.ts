import { test, expect } from '@playwright/test'

/**
 * add-onboarding-screen (Phase 3) — verifies the onboarding wizard (`/register`) reconciled to Онбординг.dc.html: the
 * footer legal links render, the step-3 consent disclaimer + the «Продолжить» CTA appear, and a full 3-step
 * role→credentials→profile registration succeeds → /dashboard. The 3-step flow + role-aware headings were already
 * reconciled by reconcile-auth-and-onboarding. Registration's rate limiter is disabled in the Playwright webServer env.
 */
test.describe('add-onboarding-screen — onboarding wizard', () => {
  test('renders the footer links, the step-3 consent disclaimer, and the «Продолжить» CTA', async ({ page }) => {
    await page.goto('/register?role=CLIENT')

    // Footer legal links (AuthLayout footer slot) — visible on every step.
    await expect(page.getByText('Политика конфиденциальности')).toBeVisible()
    await expect(page.getByText('Условия пользования')).toBeVisible()
    await expect(page.getByText('Помощь')).toBeVisible()

    // Step 1 (role preselected) → credentials.
    await page.getByRole('button', { name: 'Далее' }).click()
    await page.locator('input[name="email"]').fill(`onb-render-${Date.now()}@example.com`)
    await page.locator('input[name="password"]').fill('TestPass123')
    await page.locator('input[name="confirmPassword"]').fill('TestPass123')
    await page.getByRole('button', { name: 'Далее' }).click()

    // Step 3 — the consent disclaimer + the «Продолжить» CTA.
    await expect(page.getByText(/Нажимая «Продолжить», вы соглашаетесь/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Продолжить' })).toBeVisible()
  })

  test('a full 3-step registration succeeds and lands on /dashboard', async ({ page }) => {
    await page.goto('/register?role=CLIENT')

    await page.getByRole('button', { name: 'Далее' }).click() // role → credentials
    await page.locator('input[name="email"]').fill(`onb-flow-${Date.now()}@example.com`)
    await page.locator('input[name="password"]').fill('TestPass123')
    await page.locator('input[name="confirmPassword"]').fill('TestPass123')
    await page.getByRole('button', { name: 'Далее' }).click() // credentials → profile

    await page.locator('input[name="companyName"]').fill('ООО Онбординг')
    await page.getByRole('button', { name: 'Продолжить' }).click()

    await page.waitForURL('**/dashboard')
    await expect(page).toHaveURL(/\/dashboard/)
  })
})
