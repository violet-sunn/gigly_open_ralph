import { test, expect, type Page } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

/**
 * Auth flow E2E — complete journeys over the AuthDesign surface (reground-auth-to-design): the «ВХОД В GIGLY» login
 * view and the 3-step onboarding (role → credentials [account created] → setup). Login↔register are linked siblings;
 * no /auth route, no ?role= query.
 */
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./test.db' })
const prisma = new PrismaClient({ adapter: adapter as any })

async function seedUser(role: 'CLIENT' | 'SPECIALIST', email: string, password = 'SecurePass123') {
  await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 10),
      role,
      ...(role === 'SPECIALIST'
        ? { specialistProfile: { create: { displayName: 'Александр Петров', techStack: 'React', experienceLevel: 'SENIOR' } } }
        : { clientProfile: { create: { companyName: 'ООО Тест', inn: '7700000000' } } }),
    },
  })
}

/** Walk the AuthDesign onboarding: role chip → credentials → «Зарегистрироваться» → setup → «Продолжить». */
async function registerViaOnboarding(page: Page, role: 'CLIENT' | 'SPECIALIST', email: string, password = 'SecurePass123') {
  await page.goto('/register')
  await page.getByTestId(role === 'CLIENT' ? 'role-client' : 'role-specialist').click()
  await page.locator('input[name="email"]').fill(email)
  await page.locator('input[name="password"]').fill(password)
  await page.locator('input[name="confirmPassword"]').fill(password)
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click()
  if (role === 'CLIENT') {
    await page.locator('input[name="companyName"]').fill('ООО Тест')
  } else {
    await page.locator('input[name="displayName"]').fill('Тест')
  }
  await page.getByLabel('Местоположение и часовой пояс').selectOption('Europe/Moscow')
  await page.getByRole('button', { name: 'Продолжить' }).click()
  await page.waitForURL('**/dashboard', { timeout: 15000 })
}

test.describe('Auth Flow E2E — login + onboarding', () => {
  test.afterEach(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: 'test-auth-flow' } } })
  })
  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('login: seeded SPECIALIST signs in and reaches the dashboard', async ({ page }) => {
    const email = `test-auth-flow-specialist-${Date.now()}@example.com`
    const password = 'SecurePass123'
    await seedUser('SPECIALIST', email, password)

    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'ВХОД В GIGLY' })).toBeVisible()
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.getByRole('button', { name: 'Войти' }).click()

    await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
    const sessionCookie = (await page.context().cookies()).find((c) => c.name === 'session')
    expect(sessionCookie).toBeDefined()
  })

  test('onboarding: a new CLIENT registers and lands on the dashboard', async ({ page }) => {
    const email = `test-auth-flow-client-${Date.now()}@example.com`
    await registerViaOnboarding(page, 'CLIENT', email)
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user?.role).toBe('CLIENT')
  })

  test('login ↔ register are linked siblings', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Создать аккаунт' }).click()
    await expect(page.getByRole('heading', { name: 'СОЗДАЙТЕ СВОЙ АККАУНТ' })).toBeVisible()
    // step 2 «Войти» returns to login
    await page.getByTestId('role-client').click()
    await page.getByRole('button', { name: 'Войти' }).click()
    await expect(page.getByRole('heading', { name: 'ВХОД В GIGLY' })).toBeVisible()
  })

  test('direct access to /login and /register works (no redirect)', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL('/login')
    await expect(page.locator('input[name="email"]')).toBeVisible()

    await page.goto('/register')
    await expect(page).toHaveURL('/register')
    await expect(page.getByTestId('role-client')).toBeVisible()
    await expect(page.getByTestId('role-specialist')).toBeVisible()
  })

  test('invalid credentials show a Russian error and stay on /login', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'invalid-user@example.com')
    await page.fill('input[name="password"]', 'WrongPassword123')
    await page.getByRole('button', { name: 'Войти' }).click()
    await expect(page.getByText(/неверный email или пароль/i)).toBeVisible({ timeout: 5000 })
    await expect(page).toHaveURL('/login')
  })

  test('confirm-password mismatch is flagged at step 2', async ({ page }) => {
    await page.goto('/register')
    await page.getByTestId('role-client').click()
    await page.fill('input[name="email"]', `test-auth-flow-mismatch-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'SecurePass123')
    await page.fill('input[name="confirmPassword"]', 'Different456')
    await expect(page.getByText('Пароли не совпадают.')).toBeVisible()
  })

  test('a weak password is rejected at step 2 (stays in onboarding)', async ({ page }) => {
    await page.goto('/register')
    await page.getByTestId('role-client').click()
    await page.fill('input[name="email"]', `test-auth-flow-weak-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'weak')
    await page.fill('input[name="confirmPassword"]', 'weak')
    await page.getByRole('button', { name: 'Зарегистрироваться' }).click()
    // No account created → no advance to the setup step; the register button is still present.
    await expect(page.getByRole('button', { name: 'Зарегистрироваться' })).toBeVisible()
    await expect(page).toHaveURL(/\/register/)
  })
})
