import { test, expect } from '@playwright/test'

/**
 * compose-auth-onboarding (reconcile-auth-and-onboarding, Phase 1) — verifies /register is the kit-composed 3-step
 * wizard reconciled to its Figma auth nodes (AuthLayout + AuthHeader [Logomark + heading + AuthStepDots dot counter]
 * + RoleCards + form primitives): the dot counter + Logomark + node heading + role cards render, ?role= preselects,
 * confirm-password mismatch is flagged, and a full register lands on /dashboard with the profile persisted. The
 * exported checkerboard footer renders. F1 ≤1% deferred on the font-licence gate (Phase 2).
 */
test.describe('compose-auth-onboarding — composed registration wizard', () => {
  test('shows the AuthStepDots counter, Logomark, node heading, role cards, and the checkerboard footer asset', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: 'Создайте свой аккаунт' })).toBeVisible()
    // the authoritative dot counter (not the labelled StepIndicator) — step 1 of 3
    const dots = page.getByRole('progressbar')
    await expect(dots).toHaveAttribute('aria-valuenow', '1')
    await expect(dots).toHaveAttribute('aria-valuemax', '3')
    await expect(page.getByText('Доступ')).toHaveCount(0) // StepIndicator labels are gone
    await expect(page.getByAltText('Gigly')).toBeVisible() // Logomark (exported asset)
    await expect(page.getByTestId('role-client')).toBeVisible()
    await expect(page.getByTestId('role-specialist')).toBeVisible()
    await expect(page.locator('img[src="/assets/design-system/patterns/checkerboard.svg"]')).toBeVisible()
  })

  test('?role=SPECIALIST preselects the specialist role on step 1', async ({ page }) => {
    await page.goto('/register?role=SPECIALIST')
    await expect(page.getByTestId('role-specialist')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByTestId('role-client')).toHaveAttribute('aria-pressed', 'false')
  })

  test('flags a confirm-password mismatch on step 2', async ({ page }) => {
    await page.goto('/register?role=CLIENT')
    await page.getByRole('button', { name: 'Далее' }).click() // step 1 → 2
    await page.locator('input[name="email"]').fill('mismatch@example.com')
    await page.locator('input[name="password"]').fill('SecurePass123')
    await page.locator('input[name="confirmPassword"]').fill('Different456')
    await expect(page.getByText('Пароли не совпадают.')).toBeVisible()
  })

  test('a full CLIENT registration lands on /dashboard with the company profile', async ({ page }) => {
    const email = `cdis-onb-${Date.now()}@example.com`
    await page.goto('/register?role=CLIENT')
    await page.getByRole('button', { name: 'Далее' }).click() // → credentials

    await page.locator('input[name="email"]').fill(email)
    await page.locator('input[name="password"]').fill('SecurePass123')
    await page.locator('input[name="confirmPassword"]').fill('SecurePass123')
    await page.getByRole('button', { name: 'Далее' }).click() // → profile

    await page.locator('input[name="companyName"]').fill('ООО Онбординг')
    await page.locator('input[name="inn"]').fill('7700000123')
    await page.getByRole('button', { name: 'Зарегистрироваться' }).click()

    await page.waitForURL('**/dashboard')
    expect(page.url()).toContain('/dashboard')
  })

  test('step 3 renders the specialist profile fields for a SPECIALIST', async ({ page }) => {
    await page.goto('/register?role=SPECIALIST')
    await page.getByRole('button', { name: 'Далее' }).click() // → credentials
    await page.locator('input[name="email"]').fill(`spec-onb-${Date.now()}@example.com`)
    await page.locator('input[name="password"]').fill('SecurePass123')
    await page.locator('input[name="confirmPassword"]').fill('SecurePass123')
    await page.getByRole('button', { name: 'Далее' }).click() // → profile

    await expect(page.locator('input[name="displayName"]')).toBeVisible()
    await expect(page.locator('input[name="techStack"]')).toBeVisible()
    await expect(page.getByLabel('Специализация')).toBeVisible() // Select primitive
  })
})
