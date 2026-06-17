import { test, expect, type Page } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

/**
 * Auth flow E2E — complete journeys over the composed onboarding (compose-auth-onboarding): /auth entry + the 3-step
 * register wizard. /login is unchanged (legacy card with the blue #0265dc border, asserted via CSS); the composed
 * /auth + /register assert selection via aria-pressed and the exported checkerboard footer.
 */
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./test.db' })
const prisma = new PrismaClient({ adapter: adapter as any })

/** Walk the composed register wizard: role (preselected) → credentials → minimal profile → submit. */
async function registerViaWizard(page: Page, role: 'CLIENT' | 'SPECIALIST', email: string, password = 'SecurePass123') {
  await page.goto(`/register?role=${role}`)
  await page.getByRole('button', { name: 'Далее' }).click()
  await page.locator('input[name="email"]').fill(email)
  await page.locator('input[name="password"]').fill(password)
  await page.locator('input[name="confirmPassword"]').fill(password)
  await page.getByRole('button', { name: 'Далее' }).click()
  if (role === 'CLIENT') {
    await page.locator('input[name="companyName"]').fill('ООО Тест')
    await page.locator('input[name="inn"]').fill('7700000000')
  } else {
    await page.locator('input[name="displayName"]').fill('Тест')
  }
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click()
  await page.waitForURL('**/dashboard', { timeout: 15000 })
}

test.describe('Auth Flow E2E Tests - Complete User Journeys', () => {
  test.afterEach(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: 'test-auth-flow' } } })
  })
  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('should complete flow from /auth to login to dashboard (SPECIALIST)', async ({ page }) => {
    const email = `test-auth-flow-specialist-${Date.now()}@example.com`
    const password = 'SecurePass123'
    await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        role: 'SPECIALIST',
        specialistProfile: { create: { displayName: 'Александр Петров', techStack: 'React', experienceLevel: 'SENIOR' } },
      },
    })

    await page.goto('/auth')
    await expect(page.locator('text=Вход')).toBeVisible()
    const specialistCard = page.getByTestId('role-specialist')
    await specialistCard.click()
    await expect(specialistCard).toHaveAttribute('aria-pressed', 'true') // composed /auth: aria-pressed
    await page.click('button:has-text("Войти")')

    await expect(page).toHaveURL('/login?role=SPECIALIST')
    // /login is unchanged — legacy blue-border selection state
    await expect(page.getByTestId('role-specialist')).toHaveCSS('border-color', 'rgb(2, 101, 220)')

    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
    const sessionCookie = (await page.context().cookies()).find((c) => c.name === 'session')
    expect(sessionCookie).toBeDefined()
  })

  test('should complete flow from /auth to register to dashboard (CLIENT)', async ({ page }) => {
    const email = `test-auth-flow-client-${Date.now()}@example.com`

    await page.goto('/auth')
    const clientCard = page.getByTestId('role-client')
    await clientCard.click()
    await expect(clientCard).toHaveAttribute('aria-pressed', 'true')
    await page.click('button:has-text("Зарегистрироваться")')
    await expect(page).toHaveURL('/register?role=CLIENT')
    await expect(page.getByTestId('role-client')).toHaveAttribute('aria-pressed', 'true')

    // Walk the wizard: credentials → profile → submit
    await page.getByRole('button', { name: 'Далее' }).click()
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', 'SecurePass123')
    await page.fill('input[name="confirmPassword"]', 'SecurePass123')
    await page.getByRole('button', { name: 'Далее' }).click()
    await page.fill('input[name="companyName"]', 'ООО Тест')
    await page.fill('input[name="inn"]', '7700000000')
    await page.getByRole('button', { name: 'Зарегистрироваться' }).click()

    await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user?.role).toBe('CLIENT')
  })
})

test.describe('Auth Flow E2E Tests - Backward Compatibility', () => {
  test.afterEach(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: 'test-auth-flow' } } })
  })

  test('should allow direct access to /login without redirect', async ({ page }) => {
    const email = `test-auth-flow-direct-login-${Date.now()}@example.com`
    const password = 'SecurePass123'
    await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        role: 'SPECIALIST',
        specialistProfile: { create: { displayName: 'Тест', techStack: 'React', experienceLevel: 'SENIOR' } },
      },
    })

    await page.goto('/login')
    await expect(page).toHaveURL('/login')
    await expect(page.locator('text=Вход')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
  })

  test('should allow direct access to /register without redirect (composed wizard)', async ({ page }) => {
    await page.goto('/register')
    await expect(page).toHaveURL('/register')
    await expect(page.getByRole('heading', { name: 'Регистрация' })).toBeVisible()
    await expect(page.getByTestId('role-client')).toBeVisible()
    await expect(page.getByTestId('role-specialist')).toBeVisible()
  })
})

test.describe('Auth Flow E2E Tests - Role Pre-selection', () => {
  test.afterEach(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: 'test-auth-flow' } } })
  })

  test('should pre-select SPECIALIST role from query parameter on login', async ({ page }) => {
    await page.goto('/login?role=SPECIALIST')
    await expect(page.getByTestId('role-specialist')).toHaveCSS('border-color', 'rgb(2, 101, 220)') // /login unchanged
  })

  test('should pre-select CLIENT role from query parameter on register (composed wizard)', async ({ page }) => {
    const email = `test-auth-flow-preselect-client-${Date.now()}@example.com`
    await registerViaWizard(page, 'CLIENT', email)
    await expect(page).toHaveURL('/dashboard', { timeout: 15000 })
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user?.role).toBe('CLIENT')
  })
})

test.describe('Auth Flow E2E Tests - Visual States', () => {
  test('should display role card selection state correctly on /auth', async ({ page }) => {
    await page.goto('/auth')
    const specialistCard = page.getByTestId('role-specialist')
    const clientCard = page.getByTestId('role-client')
    await expect(specialistCard).toHaveAttribute('aria-pressed', 'false')

    await specialistCard.click()
    await expect(specialistCard).toHaveAttribute('aria-pressed', 'true')
    await expect(clientCard).toHaveAttribute('aria-pressed', 'false')

    await clientCard.click()
    await expect(clientCard).toHaveAttribute('aria-pressed', 'true')
    await expect(specialistCard).toHaveAttribute('aria-pressed', 'false')
  })

  test('should enable buttons only when role is selected', async ({ page }) => {
    await page.goto('/auth')
    const loginButton = page.locator('button:has-text("Войти")')
    const registerButton = page.locator('button:has-text("Зарегистрироваться")')
    await expect(loginButton).toBeDisabled()
    await expect(registerButton).toBeDisabled()
    await page.click('[data-testid="role-specialist"]')
    await expect(loginButton).toBeEnabled()
    await expect(registerButton).toBeEnabled()
  })
})

test.describe('Auth Flow E2E Tests - Responsive Behavior', () => {
  test('should adapt layout for mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/auth')
    await expect(page.locator('text=Вход')).toBeVisible()
    await expect(page.getByTestId('role-specialist')).toBeVisible()
    await expect(page.locator('button:has-text("Войти")')).toBeVisible()
    await page.click('[data-testid="role-specialist"]')
    await page.click('button:has-text("Войти")')
    await expect(page).toHaveURL('/login?role=SPECIALIST')
  })

  test('should display desktop layout correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/auth')
    await expect(page.getByRole('heading', { name: 'Вход' })).toBeVisible()
    await expect(page.getByTestId('role-specialist')).toBeVisible()
    await expect(page.getByTestId('role-client')).toBeVisible()
  })
})

test.describe('Auth Flow E2E Tests - Accessibility', () => {
  test('should support keyboard activation on /auth', async ({ page }) => {
    await page.goto('/auth')
    const specialistCard = page.getByTestId('role-specialist')
    await specialistCard.focus()
    await page.keyboard.press('Enter')
    await expect(specialistCard).toHaveAttribute('aria-pressed', 'true')

    const loginButton = page.locator('button:has-text("Войти")')
    await loginButton.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL('/login?role=SPECIALIST')
  })

  test('role cards are buttons with an accessible pressed state', async ({ page }) => {
    await page.goto('/auth')
    const specialistCard = page.getByTestId('role-specialist')
    const tag = await specialistCard.evaluate((el) => el.tagName.toLowerCase())
    const role = await specialistCard.getAttribute('role')
    expect(tag === 'button' || role === 'button').toBeTruthy()
    await expect(specialistCard).toHaveAttribute('aria-pressed', 'false')
  })
})

test.describe('Auth Flow E2E Tests - Error States', () => {
  test.afterEach(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: 'test-auth-flow' } } })
  })

  test('should display error for invalid credentials on login', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'invalid-user@example.com')
    await page.fill('input[name="password"]', 'WrongPassword123')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=/invalid.*email.*password/i')).toBeVisible({ timeout: 5000 })
    await expect(page).toHaveURL('/login')
  })

  test('should flag a confirm-password mismatch in the wizard', async ({ page }) => {
    await page.goto('/register?role=CLIENT')
    await page.getByRole('button', { name: 'Далее' }).click()
    await page.fill('input[name="email"]', `test-auth-flow-mismatch-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'SecurePass123')
    await page.fill('input[name="confirmPassword"]', 'Different456')
    await expect(page.getByText('Пароли не совпадают.')).toBeVisible()
  })

  test('should reject a weak password on submission (validation preserved)', async ({ page }) => {
    await page.goto('/register?role=CLIENT')
    await page.getByRole('button', { name: 'Далее' }).click()
    await page.fill('input[name="email"]', `test-auth-flow-weak-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'weak')
    await page.fill('input[name="confirmPassword"]', 'weak')
    await page.getByRole('button', { name: 'Далее' }).click()
    await page.fill('input[name="companyName"]', 'ООО Тест')
    await page.fill('input[name="inn"]', '7700000000')
    await page.getByRole('button', { name: 'Зарегистрироваться' }).click()
    // server-side validation returns an error; the wizard stays on /register
    await expect(page).toHaveURL(/\/register/)
  })
})

test.describe('Auth Flow E2E Tests - Visual Regression', () => {
  test('should display the exported checkerboard footer on /auth', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.locator('img[src="/assets/design-system/patterns/checkerboard.svg"]')).toBeVisible()
  })
})
