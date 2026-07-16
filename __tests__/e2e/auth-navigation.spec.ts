import { test, expect, type Page } from '@playwright/test'

/**
 * Auth navigation (reground-auth-to-design) — the homepage points at /login; login↔register are linked siblings on the
 * AuthDesign surface. There is no /auth route and no ?role= query. Authenticated users are redirected off /login but
 * ALLOWED on /register (the two-phase onboarding creates the account at step 2, so step-3 setup runs while authed).
 */

/** Register via the AuthDesign onboarding to obtain an authenticated session. */
async function registerViaOnboarding(page: Page, role: 'CLIENT' | 'SPECIALIST', email: string) {
  await page.goto('/register')
  await page.getByTestId(role === 'CLIENT' ? 'role-client' : 'role-specialist').click()
  await page.locator('input[name="email"]').fill(email)
  await page.locator('input[name="password"]').fill('TestPass123')
  await page.locator('input[name="confirmPassword"]').fill('TestPass123')
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click()
  // Step-3 profile setup gates «Продолжить» until every required field is filled (AuthDesign OnboardingStep3):
  //   CLIENT  → companyName, contactPerson, position, timezone
  //   SPECIALIST → displayName, specialization, timezone
  if (role === 'CLIENT') {
    await page.locator('input[name="companyName"]').fill('ООО Тест')
    await page.locator('input[name="contactPerson"]').fill('Иванов Иван Иванович')
    await page.locator('input[name="position"]').fill('Директор')
  } else {
    await page.locator('input[name="displayName"]').fill('Иванов Иван Иванович')
    await page.getByLabel('Специализация').selectOption('Frontend')
  }
  await page.getByLabel('Местоположение и часовой пояс').selectOption('Europe/Moscow')
  await page.getByRole('button', { name: 'Продолжить' }).click()
  await page.waitForURL('**/dashboard', { timeout: 15000 })
}

test.describe('Auth Navigation Flow', () => {
  test('homepage «Создать аккаунт» navigates to /register', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Создать аккаунт' }).click()
    await expect(page).toHaveURL('/register')
    await expect(page.getByRole('heading', { name: 'СОЗДАЙТЕ СВОЙ АККАУНТ' })).toBeVisible()
  })

  test('homepage «Войти» navigates to /login', async ({ page }) => {
    await page.goto('/')
    // Two «Войти» links point at /login (header + hero); either satisfies the intent.
    await page.getByRole('link', { name: 'Войти' }).first().click()
    await expect(page).toHaveURL('/login')
    await expect(page.locator('input[name="email"]')).toBeVisible()
  })

  test('login → register via «Создать аккаунт»', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Создать аккаунт' }).click()
    await expect(page.getByRole('heading', { name: 'СОЗДАЙТЕ СВОЙ АККАУНТ' })).toBeVisible()
    await expect(page.getByTestId('role-client')).toBeVisible()
    await expect(page.getByTestId('role-specialist')).toBeVisible()
  })

  test('direct /login access works without redirect', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL('/login')
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })

  test('direct /register access works without redirect', async ({ page }) => {
    await page.goto('/register')
    await expect(page).toHaveURL('/register')
    await expect(page.getByRole('heading', { name: 'СОЗДАЙТЕ СВОЙ АККАУНТ' })).toBeVisible()
    await expect(page.getByTestId('role-client')).toBeVisible()
    await expect(page.getByTestId('role-specialist')).toBeVisible()
  })
})

test.describe('Auth Navigation - Authenticated User Behaviour', () => {
  test('authenticated user is redirected from /login to dashboard', async ({ page }) => {
    await registerViaOnboarding(page, 'SPECIALIST', `test-login-redirect-${Date.now()}@example.com`)
    await expect(page).toHaveURL('/dashboard')
    await page.goto('/login')
    await expect(page).toHaveURL('/dashboard')
  })

  test('authenticated user is ALLOWED on /register (onboarding setup surface)', async ({ page }) => {
    await registerViaOnboarding(page, 'CLIENT', `test-register-allowed-${Date.now()}@example.com`)
    await expect(page).toHaveURL('/dashboard')
    await page.goto('/register')
    await expect(page).toHaveURL('/register') // not bounced to /dashboard
  })
})
