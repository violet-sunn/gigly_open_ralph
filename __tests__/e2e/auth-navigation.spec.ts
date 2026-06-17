import { test, expect, type Page } from '@playwright/test'

/**
 * Auth navigation — homepage → /auth → /login|/register, and direct access. /auth + /register are the composed
 * onboarding screens (compose-auth-onboarding); /login is unchanged (legacy card with the blue border). Role selection
 * on the composed screens is asserted via aria-pressed; the /login page keeps its CSS-border assertion.
 */

/** Walk the composed register wizard to create a user + session (role → credentials → minimal profile → submit). */
async function registerViaWizard(page: Page, role: 'CLIENT' | 'SPECIALIST', email: string) {
  await page.goto(`/register?role=${role}`)
  await page.getByRole('button', { name: 'Далее' }).click() // role → credentials
  await page.locator('input[name="email"]').fill(email)
  await page.locator('input[name="password"]').fill('TestPass123')
  await page.locator('input[name="confirmPassword"]').fill('TestPass123')
  await page.getByRole('button', { name: 'Далее' }).click() // credentials → profile
  if (role === 'CLIENT') {
    await page.locator('input[name="companyName"]').fill('ООО Тест')
    await page.locator('input[name="inn"]').fill('7700000000')
  } else {
    await page.locator('input[name="displayName"]').fill('Тест')
  }
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click()
  await page.waitForURL('**/dashboard', { timeout: 15000 })
}

test.describe('Auth Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('homepage to login flow via auth page (SPECIALIST)', async ({ page }) => {
    await page.click('text=Get Started')
    await expect(page).toHaveURL('/auth')
    await page.click('[data-testid="role-specialist"]')
    await page.click('button:has-text("Войти")')
    await expect(page).toHaveURL('/login?role=SPECIALIST')
    // /login is unchanged — keeps the legacy blue-border selection state.
    const specialistCard = page.locator('[data-testid="role-specialist"]')
    await expect(specialistCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')
  })

  test('homepage to login flow via auth page (CLIENT)', async ({ page }) => {
    await page.click('text=Get Started')
    await expect(page).toHaveURL('/auth')
    await page.click('[data-testid="role-client"]')
    await page.click('button:has-text("Войти")')
    await expect(page).toHaveURL('/login?role=CLIENT')
    const clientCard = page.locator('[data-testid="role-client"]')
    await expect(clientCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')
  })

  test('homepage to register flow via auth page (SPECIALIST)', async ({ page }) => {
    await page.click('text=Get Started')
    await expect(page).toHaveURL('/auth')
    await page.click('[data-testid="role-specialist"]')
    await page.click('button:has-text("Зарегистрироваться")')
    await expect(page).toHaveURL('/register?role=SPECIALIST')
    // composed wizard — selection via aria-pressed
    await expect(page.getByTestId('role-specialist')).toHaveAttribute('aria-pressed', 'true')
  })

  test('homepage to register flow via auth page (CLIENT)', async ({ page }) => {
    await page.click('text=Get Started')
    await expect(page).toHaveURL('/auth')
    await page.click('[data-testid="role-client"]')
    await page.click('button:has-text("Зарегистрироваться")')
    await expect(page).toHaveURL('/register?role=CLIENT')
    await expect(page.getByTestId('role-client')).toHaveAttribute('aria-pressed', 'true')
  })

  test('homepage "Sign in" link navigates to auth page', async ({ page }) => {
    await page.click('text=Sign in')
    await expect(page).toHaveURL('/auth')
    await expect(page.locator('text=Вход')).toBeVisible()
    await expect(page.locator('[data-testid="role-specialist"]')).toBeVisible()
    await expect(page.locator('[data-testid="role-client"]')).toBeVisible()
  })

  test('direct login access works without redirect', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL('/login')
    await expect(page.locator('text=Вход')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })

  test('direct register access works without redirect (composed wizard)', async ({ page }) => {
    await page.goto('/register')
    await expect(page).toHaveURL('/register')
    await expect(page.getByRole('heading', { name: 'Регистрация' })).toBeVisible()
    await expect(page.getByTestId('role-client')).toBeVisible()
    await expect(page.getByTestId('role-specialist')).toBeVisible()
  })

  test('direct login with role parameter preserves role', async ({ page }) => {
    await page.goto('/login?role=SPECIALIST')
    await expect(page).toHaveURL('/login?role=SPECIALIST')
    const specialistCard = page.locator('[data-testid="role-specialist"]')
    await expect(specialistCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')
  })

  test('direct register with role parameter preserves role (composed wizard)', async ({ page }) => {
    await page.goto('/register?role=CLIENT')
    await expect(page).toHaveURL('/register?role=CLIENT')
    await expect(page.getByTestId('role-client')).toHaveAttribute('aria-pressed', 'true')
  })
})

test.describe('Auth Navigation - Authenticated User Redirects', () => {
  test('authenticated user redirected from /auth to dashboard', async ({ page }) => {
    await registerViaWizard(page, 'SPECIALIST', `test-auth-nav-${Date.now()}@example.com`)
    await expect(page).toHaveURL('/dashboard')
    await page.goto('/auth')
    await expect(page).toHaveURL('/dashboard')
  })

  test('authenticated user redirected from /login to dashboard', async ({ page }) => {
    await registerViaWizard(page, 'SPECIALIST', `test-login-redirect-${Date.now()}@example.com`)
    await expect(page).toHaveURL('/dashboard')
    await page.goto('/login')
    await expect(page).toHaveURL('/dashboard')
  })

  test('authenticated user redirected from /register to dashboard', async ({ page }) => {
    await registerViaWizard(page, 'CLIENT', `test-register-redirect-${Date.now()}@example.com`)
    await expect(page).toHaveURL('/dashboard')
    await page.goto('/register')
    await expect(page).toHaveURL('/dashboard')
  })
})
