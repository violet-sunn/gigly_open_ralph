import { test, expect } from '@playwright/test'

/**
 * reground-auth-to-design — /register is the AuthDesign onboarding view rebuilt on the prototype (Auth.dc.html):
 * step 1 role chips (Компания/Специалист) → step 2 credentials («Зарегистрироваться» = account created here) →
 * step 3 role-specific profile setup («Продолжить» → /dashboard). Role is chosen at step 1 (no ?role=).
 */
test.describe('compose-auth-onboarding — AuthDesign onboarding', () => {
  test('step 1 shows the create-account heading and the diagonal role chips', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: 'СОЗДАЙТЕ СВОЙ АККАУНТ' })).toBeVisible()
    await expect(page.getByText('Выберите свою роль в Gigly.')).toBeVisible()
    await expect(page.getByTestId('role-client')).toBeVisible()
    await expect(page.getByTestId('role-specialist')).toBeVisible()
  })

  test('picking a role advances to the credentials step', async ({ page }) => {
    await page.goto('/register')
    await page.getByTestId('role-client').click()
    await expect(page.getByText('Введите свои учётные данные.')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Зарегистрироваться' })).toBeVisible()
  })

  test('flags a confirm-password mismatch on step 2', async ({ page }) => {
    await page.goto('/register')
    await page.getByTestId('role-client').click()
    await page.locator('input[name="email"]').fill('mismatch@example.com')
    await page.locator('input[name="password"]').fill('SecurePass123')
    await page.locator('input[name="confirmPassword"]').fill('Different456')
    await expect(page.getByText('Пароли не совпадают.')).toBeVisible()
  })

  test('«Войти» on step 2 returns to the login view', async ({ page }) => {
    await page.goto('/register')
    await page.getByTestId('role-specialist').click()
    await page.getByRole('button', { name: 'Войти' }).click()
    await expect(page.getByRole('heading', { name: 'ВХОД В GIGLY' })).toBeVisible()
  })

  test('the step-2 back-arrow returns to role selection (re-choose role)', async ({ page }) => {
    await page.goto('/register')
    await page.getByTestId('role-client').click()
    await expect(page.getByText('Введите свои учётные данные.')).toBeVisible() // step 2
    await page.getByRole('button', { name: 'Назад к выбору роли' }).click()
    // back on step 1 — both role chips selectable again
    await expect(page.getByTestId('role-client')).toBeVisible()
    await expect(page.getByTestId('role-specialist')).toBeVisible()
    await page.getByTestId('role-specialist').click()
    await expect(page.getByText('Введите свои учётные данные.')).toBeVisible()
  })

  test('a full CLIENT onboarding creates the account at step 2 and lands on /dashboard', async ({ page }) => {
    const email = `cli-onb-${Date.now()}@example.com`
    await page.goto('/register')
    await page.getByTestId('role-client').click()

    await page.locator('input[name="email"]').fill(email)
    await page.locator('input[name="password"]').fill('SecurePass123')
    await page.locator('input[name="confirmPassword"]').fill('SecurePass123')
    await page.getByRole('button', { name: 'Зарегистрироваться' }).click()

    // step 3 — company setup
    await expect(page.getByRole('heading', { name: 'ДОБРО ПОЖАЛОВАТЬ' })).toBeVisible()
    await page.locator('input[name="companyName"]').fill('ООО Онбординг')
    await page.locator('input[name="contactPerson"]').fill('Иван Петров')
    await page.locator('input[name="position"]').fill('Директор')
    await page.getByLabel('Местоположение и часовой пояс').selectOption('Europe/Moscow')
    await page.getByRole('button', { name: 'Продолжить' }).click()

    await page.waitForURL('**/dashboard')
    expect(page.url()).toContain('/dashboard')
  })

  test('step 3 renders the specialist profile fields for a SPECIALIST', async ({ page }) => {
    const email = `spec-onb-${Date.now()}@example.com`
    await page.goto('/register')
    await page.getByTestId('role-specialist').click()
    await page.locator('input[name="email"]').fill(email)
    await page.locator('input[name="password"]').fill('SecurePass123')
    await page.locator('input[name="confirmPassword"]').fill('SecurePass123')
    await page.getByRole('button', { name: 'Зарегистрироваться' }).click()

    await expect(page.getByRole('heading', { name: 'НАСТРОЙТЕ СВОЙ АККАУНТ' })).toBeVisible()
    await expect(page.locator('input[name="displayName"]')).toBeVisible()
    await expect(page.getByLabel('Специализация')).toBeVisible()
    await expect(page.getByLabel('Местоположение и часовой пояс')).toBeVisible()
  })
})
