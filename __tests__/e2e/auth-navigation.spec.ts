import { test, expect } from '@playwright/test'

test.describe('Auth Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from homepage
    await page.goto('/')
  })

  test('homepage to login flow via auth page (SPECIALIST)', async ({ page }) => {
    // Click "Get Started" button
    await page.click('text=Get Started')

    // Should navigate to /auth
    await expect(page).toHaveURL('/auth')

    // Select SPECIALIST role
    await page.click('[data-testid="role-specialist"]')

    // Click "Войти" (Login) button
    await page.click('button:has-text("Войти")')

    // Should navigate to /login with role parameter
    await expect(page).toHaveURL('/login?role=SPECIALIST')

    // Verify SPECIALIST role is pre-selected (has blue border)
    const specialistCard = page.locator('[data-testid="role-specialist"]')
    await expect(specialistCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')
  })

  test('homepage to login flow via auth page (CLIENT)', async ({ page }) => {
    // Click "Get Started" button
    await page.click('text=Get Started')

    // Should navigate to /auth
    await expect(page).toHaveURL('/auth')

    // Select CLIENT role
    await page.click('[data-testid="role-client"]')

    // Click "Войти" (Login) button
    await page.click('button:has-text("Войти")')

    // Should navigate to /login with role parameter
    await expect(page).toHaveURL('/login?role=CLIENT')

    // Verify CLIENT role is pre-selected (has blue border)
    const clientCard = page.locator('[data-testid="role-client"]')
    await expect(clientCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')
  })

  test('homepage to register flow via auth page (SPECIALIST)', async ({ page }) => {
    // Click "Get Started" button
    await page.click('text=Get Started')

    // Should navigate to /auth
    await expect(page).toHaveURL('/auth')

    // Select SPECIALIST role
    await page.click('[data-testid="role-specialist"]')

    // Click "Зарегестрироватся" (Register) button
    await page.click('button:has-text("Зарегестрироватся")')

    // Should navigate to /register with role parameter
    await expect(page).toHaveURL('/register?role=SPECIALIST')

    // Verify SPECIALIST role is pre-selected (has blue border)
    const specialistCard = page.locator('[data-testid="role-specialist"]')
    await expect(specialistCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')
  })

  test('homepage to register flow via auth page (CLIENT)', async ({ page }) => {
    // Click "Get Started" button
    await page.click('text=Get Started')

    // Should navigate to /auth
    await expect(page).toHaveURL('/auth')

    // Select CLIENT role
    await page.click('[data-testid="role-client"]')

    // Click "Зарегестрироватся" (Register) button
    await page.click('button:has-text("Зарегестрироватся")')

    // Should navigate to /register with role parameter
    await expect(page).toHaveURL('/register?role=CLIENT')

    // Verify CLIENT role is pre-selected (has blue border)
    const clientCard = page.locator('[data-testid="role-client"]')
    await expect(clientCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')
  })

  test('homepage "Sign in" link navigates to auth page', async ({ page }) => {
    // Click "Sign in" link in the "Already have an account?" text
    await page.click('text=Sign in')

    // Should navigate to /auth
    await expect(page).toHaveURL('/auth')

    // Verify auth page elements are visible
    await expect(page.locator('text=Вход')).toBeVisible()
    await expect(page.locator('[data-testid="role-specialist"]')).toBeVisible()
    await expect(page.locator('[data-testid="role-client"]')).toBeVisible()
  })

  test('direct login access works without redirect', async ({ page }) => {
    // Navigate directly to /login
    await page.goto('/login')

    // Should stay on /login (no redirect to /auth)
    await expect(page).toHaveURL('/login')

    // Verify login page elements are visible
    await expect(page.locator('text=Вход')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })

  test('direct register access works without redirect', async ({ page }) => {
    // Navigate directly to /register
    await page.goto('/register')

    // Should stay on /register (no redirect to /auth)
    await expect(page).toHaveURL('/register')

    // Verify register page elements are visible
    await expect(page.locator('text=Регистрация')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })

  test('direct login with role parameter preserves role', async ({ page }) => {
    // Navigate directly to /login?role=SPECIALIST
    await page.goto('/login?role=SPECIALIST')

    // Should stay on /login with role parameter
    await expect(page).toHaveURL('/login?role=SPECIALIST')

    // Verify SPECIALIST role is pre-selected
    const specialistCard = page.locator('[data-testid="role-specialist"]')
    await expect(specialistCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')
  })

  test('direct register with role parameter preserves role', async ({ page }) => {
    // Navigate directly to /register?role=CLIENT
    await page.goto('/register?role=CLIENT')

    // Should stay on /register with role parameter
    await expect(page).toHaveURL('/register?role=CLIENT')

    // Verify CLIENT role is pre-selected
    const clientCard = page.locator('[data-testid="role-client"]')
    await expect(clientCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')
  })
})

test.describe('Auth Navigation - Authenticated User Redirects', () => {
  test('authenticated user redirected from /auth to dashboard', async ({ page }) => {
    // Register and login
    await page.goto('/register')
    await page.click('[data-testid="role-specialist"]')
    await page.fill('input[name="email"]', `test-auth-nav-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'TestPass123')
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/dashboard')

    // Try to navigate to /auth
    await page.goto('/auth')

    // Should be redirected to /dashboard
    await expect(page).toHaveURL('/dashboard')
  })

  test('authenticated user redirected from /login to dashboard', async ({ page }) => {
    // Register and login
    await page.goto('/register')
    await page.click('[data-testid="role-specialist"]')
    await page.fill('input[name="email"]', `test-login-redirect-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'TestPass123')
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/dashboard')

    // Try to navigate to /login
    await page.goto('/login')

    // Should be redirected to /dashboard
    await expect(page).toHaveURL('/dashboard')
  })

  test('authenticated user redirected from /register to dashboard', async ({ page }) => {
    // Register and login
    await page.goto('/register')
    await page.click('[data-testid="role-client"]')
    await page.fill('input[name="email"]', `test-register-redirect-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'TestPass123')
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/dashboard')

    // Try to navigate to /register
    await page.goto('/register')

    // Should be redirected to /dashboard
    await expect(page).toHaveURL('/dashboard')
  })
})
