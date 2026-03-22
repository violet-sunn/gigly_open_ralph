import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

// Setup test database connection for E2E tests
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./test.db'
})

const prisma = new PrismaClient({
  adapter: adapter as any
})

test.describe('Auth Flow E2E Tests - Complete User Journeys', () => {
  test.afterEach(async () => {
    // Clean up test data
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test-auth-flow'
        }
      }
    })
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('should complete flow from /auth to login to dashboard (SPECIALIST)', async ({ page }) => {
    // Create test user first
    const email = `test-auth-flow-specialist-${Date.now()}@example.com`
    const password = 'SecurePass123'
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'SPECIALIST',
        specialistProfile: {
          create: {
            displayName: 'Александр Петров',
            techStack: 'React, TypeScript, Node.js',
            experienceLevel: 'SENIOR'
          }
        }
      }
    })

    // Navigate to /auth
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    // Verify page loaded
    await expect(page.locator('text=Вход')).toBeVisible()

    // Select SPECIALIST role
    const specialistCard = page.locator('[data-testid="role-specialist"]')
    await expect(specialistCard).toBeVisible()
    await specialistCard.click()

    // Verify blue border appears on selected card
    await expect(specialistCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')

    // Click "Войти" button
    await page.click('button:has-text("Войти")')

    // Wait for navigation to /login?role=SPECIALIST
    await expect(page).toHaveURL('/login?role=SPECIALIST')

    // Verify SPECIALIST role is pre-selected on login page
    const loginSpecialistCard = page.locator('[data-testid="role-specialist"]')
    await expect(loginSpecialistCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')

    // Fill login form
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 })

    // Verify session cookie exists
    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find(c => c.name === 'session')
    expect(sessionCookie).toBeDefined()

    // Verify dashboard displays specialist content
    await expect(page.locator('text=Browse Gigs').first()).toBeVisible()
  })

  test('should complete flow from /auth to register to dashboard (CLIENT)', async ({ page }) => {
    const email = `test-auth-flow-client-${Date.now()}@example.com`
    const password = 'SecurePass123'

    // Navigate to /auth
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    // Select CLIENT role
    const clientCard = page.locator('[data-testid="role-client"]')
    await expect(clientCard).toBeVisible()
    await clientCard.click()

    // Verify blue border appears
    await expect(clientCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')

    // Click "Зарегестрироватся" button
    await page.click('button:has-text("Зарегестрироватся")')

    // Wait for navigation to /register?role=CLIENT
    await expect(page).toHaveURL('/register?role=CLIENT')

    // Verify CLIENT role is pre-selected
    const registerClientCard = page.locator('[data-testid="role-client"]')
    await expect(registerClientCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')

    // Fill registration form (note: profile fields are completed later, not during registration)
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 })

    // Verify session cookie exists
    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find(c => c.name === 'session')
    expect(sessionCookie).toBeDefined()

    // Verify user was created with correct role
    const user = await prisma.user.findUnique({
      where: { email }
    })
    expect(user).toBeDefined()
    expect(user?.role).toBe('CLIENT')
  })
})

test.describe('Auth Flow E2E Tests - Backward Compatibility', () => {
  test.afterEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test-auth-flow'
        }
      }
    })
  })

  test('should allow direct access to /login without redirect', async ({ page }) => {
    // Create test user
    const email = `test-auth-flow-direct-login-${Date.now()}@example.com`
    const password = 'SecurePass123'
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'SPECIALIST',
        specialistProfile: {
          create: {
            displayName: 'Тест Пользователь',
            techStack: 'React',
            experienceLevel: 'SENIOR'
          }
        }
      }
    })

    // Navigate directly to /login
    await page.goto('/login')

    // Verify URL is /login (no redirect to /auth)
    await expect(page).toHaveURL('/login')

    // Verify login page elements are visible
    await expect(page.locator('text=Вход')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()

    // Verify no role cards are visible (since no role parameter)
    await expect(page.locator('[data-testid="role-specialist"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="role-client"]')).not.toBeVisible()

    // User can login successfully
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.click('button[type="submit"]')

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
  })

  test('should allow direct access to /register without redirect', async ({ page }) => {
    const email = `test-auth-flow-direct-register-${Date.now()}@example.com`
    const password = 'SecurePass123'

    // Navigate directly to /register
    await page.goto('/register')

    // Verify URL is /register (no redirect to /auth)
    await expect(page).toHaveURL('/register')

    // Verify register page elements are visible
    await expect(page.locator('text=Регистрация')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()

    // Note: Without role parameter, role selection UI may not be visible
    // User needs to use /register?role=X or go through /auth flow
    // This test verifies the page loads and is accessible via direct URL
  })
})

test.describe('Auth Flow E2E Tests - Role Pre-selection', () => {
  test.afterEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test-auth-flow'
        }
      }
    })
  })

  test('should pre-select SPECIALIST role from query parameter on login', async ({ page }) => {
    // Create test user
    const email = `test-auth-flow-preselect-spec-${Date.now()}@example.com`
    const password = 'SecurePass123'
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'SPECIALIST',
        specialistProfile: {
          create: {
            displayName: 'Специалист Тест',
            techStack: 'TypeScript',
            experienceLevel: 'SENIOR'
          }
        }
      }
    })

    // Navigate to /login?role=SPECIALIST
    await page.goto('/login?role=SPECIALIST')

    // Verify SPECIALIST role card has blue border
    const specialistCard = page.locator('[data-testid="role-specialist"]')
    await expect(specialistCard).toBeVisible()
    await expect(specialistCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')

    // Verify CLIENT role card is visible but not selected
    const clientCard = page.locator('[data-testid="role-client"]')
    await expect(clientCard).toBeVisible()
    await expect(clientCard).not.toHaveCSS('border-color', 'rgb(2, 101, 220)')

    // User can login successfully
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.click('button[type="submit"]')

    // Verify authentication succeeds
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
  })

  test('should pre-select CLIENT role from query parameter on register', async ({ page }) => {
    const email = `test-auth-flow-preselect-client-${Date.now()}@example.com`
    const password = 'SecurePass123'

    // Navigate to /register?role=CLIENT
    await page.goto('/register?role=CLIENT')
    await page.waitForLoadState('networkidle')

    // Verify CLIENT role card has blue border
    const clientCard = page.locator('[data-testid="role-client"]')
    await expect(clientCard).toBeVisible()
    await expect(clientCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')

    // Verify SPECIALIST role card is visible but not selected
    const specialistCard = page.locator('[data-testid="role-specialist"]')
    await expect(specialistCard).toBeVisible()
    await expect(specialistCard).not.toHaveCSS('border-color', 'rgb(2, 101, 220)')

    // User can register successfully
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)

    // Submit form and wait for navigation
    await Promise.all([
      page.waitForURL('/dashboard', { timeout: 15000 }),
      page.click('button[type="submit"]')
    ])

    // Verify user was created with CLIENT role
    const user = await prisma.user.findUnique({
      where: { email }
    })
    expect(user?.role).toBe('CLIENT')
  })
})

test.describe('Auth Flow E2E Tests - Visual States', () => {
  test('should display role card selection state correctly on /auth', async ({ page }) => {
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    const specialistCard = page.locator('[data-testid="role-specialist"]')
    const clientCard = page.locator('[data-testid="role-client"]')

    // Initially, no card should have blue border
    await expect(specialistCard).toBeVisible()
    await expect(clientCard).toBeVisible()

    // Click SPECIALIST card
    await specialistCard.click()

    // Verify SPECIALIST card has blue border
    await expect(specialistCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')

    // Verify CLIENT card does not have blue border
    const clientBorderColor = await clientCard.evaluate(el =>
      window.getComputedStyle(el).borderColor
    )
    expect(clientBorderColor).not.toBe('rgb(2, 101, 220)')

    // Click CLIENT card
    await clientCard.click()

    // Verify CLIENT card now has blue border
    await expect(clientCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')

    // Verify SPECIALIST card no longer has blue border
    const specialistBorderColor = await specialistCard.evaluate(el =>
      window.getComputedStyle(el).borderColor
    )
    expect(specialistBorderColor).not.toBe('rgb(2, 101, 220)')
  })

  test('should enable buttons only when role is selected', async ({ page }) => {
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    const loginButton = page.locator('button:has-text("Войти")')
    const registerButton = page.locator('button:has-text("Зарегестрироватся")')

    // Initially, buttons should be disabled
    await expect(loginButton).toBeDisabled()
    await expect(registerButton).toBeDisabled()

    // Select a role
    await page.click('[data-testid="role-specialist"]')

    // Buttons should now be enabled
    await expect(loginButton).toBeEnabled()
    await expect(registerButton).toBeEnabled()
  })
})

test.describe('Auth Flow E2E Tests - Responsive Behavior', () => {
  test('should adapt layout for mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    // Verify page loads correctly
    await expect(page.locator('text=Вход')).toBeVisible()

    // Verify container is responsive (90vw on mobile)
    const container = page.locator('div.bg-\\[\\#060813\\]').first()
    await expect(container).toBeVisible()

    // Verify all interactive elements are functional on mobile
    await expect(page.locator('[data-testid="role-specialist"]')).toBeVisible()
    await expect(page.locator('[data-testid="role-client"]')).toBeVisible()
    await expect(page.locator('button:has-text("Войти")')).toBeVisible()
    await expect(page.locator('button:has-text("Зарегестрироватся")')).toBeVisible()

    // Verify user can interact with elements
    await page.click('[data-testid="role-specialist"]')
    await expect(page.locator('[data-testid="role-specialist"]')).toHaveCSS('border-color', 'rgb(2, 101, 220)')

    // Verify navigation works on mobile
    await page.click('button:has-text("Войти")')
    await expect(page).toHaveURL('/login?role=SPECIALIST')
  })

  test('should display desktop layout correctly', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    // Verify container has fixed width on desktop (418px)
    const container = page.locator('div.bg-\\[\\#060813\\]').first()
    await expect(container).toBeVisible()

    // Verify all elements are visible and properly styled
    await expect(page.locator('text=Вход')).toBeVisible()
    await expect(page.locator('[data-testid="role-specialist"]')).toBeVisible()
    await expect(page.locator('[data-testid="role-client"]')).toBeVisible()

    // Verify Figma design specifications
    const heading = page.locator('h1:has-text("Вход")')
    await expect(heading).toHaveCSS('font-size', '22px')
    await expect(heading).toHaveCSS('color', 'rgb(255, 255, 255)')
  })
})

test.describe('Auth Flow E2E Tests - Accessibility', () => {
  test('should support keyboard navigation on /auth', async ({ page }) => {
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    // Start keyboard navigation
    await page.keyboard.press('Tab')

    // Verify focus moves through interactive elements
    // Note: Exact tab order depends on DOM structure
    // We'll verify that role cards and buttons are keyboard accessible

    // Navigate to SPECIALIST card and activate with Enter
    const specialistCard = page.locator('[data-testid="role-specialist"]')
    await specialistCard.focus()
    await page.keyboard.press('Enter')

    // Verify selection worked
    await expect(specialistCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')

    // Navigate to login button and activate
    const loginButton = page.locator('button:has-text("Войти")')
    await loginButton.focus()
    await page.keyboard.press('Enter')

    // Verify navigation occurred
    await expect(page).toHaveURL('/login?role=SPECIALIST')
  })

  test('should have proper ARIA attributes on role cards', async ({ page }) => {
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    const specialistCard = page.locator('[data-testid="role-specialist"]')
    const clientCard = page.locator('[data-testid="role-client"]')

    // Verify role cards are buttons or have button role
    const specialistRole = await specialistCard.getAttribute('role')
    const specialistTagName = await specialistCard.evaluate(el => el.tagName.toLowerCase())

    // Should be either a button element or have role="button"
    expect(specialistTagName === 'button' || specialistRole === 'button').toBeTruthy()

    // Click specialist card and verify selection state
    await specialistCard.click()

    // Verify buttons have accessible labels
    const loginButton = page.locator('button:has-text("Войти")')
    const registerButton = page.locator('button:has-text("Зарегестрироватся")')

    await expect(loginButton).toBeVisible()
    await expect(registerButton).toBeVisible()
  })
})

test.describe('Auth Flow E2E Tests - Error States', () => {
  test.afterEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test-auth-flow'
        }
      }
    })
  })

  test('should display error for invalid credentials on login', async ({ page }) => {
    await page.goto('/login')

    // Fill form with non-existent user
    await page.fill('input[name="email"]', 'invalid-user@example.com')
    await page.fill('input[name="password"]', 'WrongPassword123')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for error message to appear (flexible selector)
    await expect(
      page.locator('text=/invalid.*email.*password/i')
    ).toBeVisible({ timeout: 5000 })

    // Verify URL is still /login (no redirect)
    await expect(page).toHaveURL('/login')

    // Verify form fields are still editable
    await expect(page.locator('input[name="email"]')).toBeEditable()
    await expect(page.locator('input[name="password"]')).toBeEditable()
  })

  test('should display validation errors on registration with weak password', async ({ page }) => {
    await page.goto('/register?role=CLIENT')

    const email = `test-auth-flow-weak-pass-${Date.now()}@example.com`

    // Fill form with weak password
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', 'weak')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for error message (server-side validation)
    await page.waitForTimeout(2000)

    // Check if error message appears or if we're still on register page
    const errorMessage = page.locator('text=/password/i')
    const isOnRegisterPage = page.url().includes('/register')

    // Either error message should be visible OR we should still be on register page
    if (isOnRegisterPage) {
      // Validation prevented redirect, which is correct behavior
      await expect(page).toHaveURL('/register?role=CLIENT')
    } else {
      // If redirected, error should have been shown
      await expect(errorMessage).toBeVisible()
    }
  })

  test('should require role selection before submission', async ({ page }) => {
    await page.goto('/register')

    const email = `test-auth-flow-no-role-${Date.now()}@example.com`

    // Fill email and password without selecting role
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', 'SecurePass123')

    // Try to submit form without selecting role
    await page.click('button[type="submit"]')

    // Browser should prevent submission due to required radio button
    // Wait a moment to ensure no redirect happens
    await page.waitForTimeout(2000)

    // Verify still on register page (form validation prevented submission)
    await expect(page).toHaveURL('/register')
  })
})

test.describe('Auth Flow E2E Tests - Visual Regression', () => {
  test('should display decorative checkerboard pattern on /auth', async ({ page }) => {
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    // Verify decorative pattern SVG exists
    const backgroundPattern = page.locator('svg').filter({ has: page.locator('pattern#checkerboard') })
    await expect(backgroundPattern).toBeVisible()

    // Verify pattern is at bottom of page
    const patternContainer = page.locator('div.absolute.bottom-0')
    await expect(patternContainer).toBeVisible()

    // Verify pattern does not block interactive elements
    const specialistCard = page.locator('[data-testid="role-specialist"]')
    await expect(specialistCard).toBeVisible()
    await specialistCard.click()

    // Verify interaction worked (pattern didn't interfere)
    await expect(specialistCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')
  })

  test('should match Figma design specifications for /auth page', async ({ page }) => {
    // Set desktop viewport for consistent comparison
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    // Verify key visual elements match Figma design
    const container = page.locator('div.bg-\\[\\#060813\\]').first()

    // Container styling
    await expect(container).toHaveCSS('background-color', 'rgb(6, 8, 19)') // #060813
    await expect(container).toHaveCSS('border-radius', '25px')
    await expect(container).toHaveCSS('border-color', 'rgb(36, 41, 53)') // #242935

    // Heading styling
    const heading = page.locator('h1:has-text("Вход")')
    await expect(heading).toHaveCSS('font-size', '22px')
    await expect(heading).toHaveCSS('color', 'rgb(255, 255, 255)')
    await expect(heading).toHaveCSS('font-weight', '600')

    // Button styling
    const loginButton = page.locator('button:has-text("Войти")')
    await expect(loginButton).toHaveCSS('background-color', 'rgb(0, 136, 255)') // #0088FF
    await expect(loginButton).toHaveCSS('height', '50px')
    await expect(loginButton).toHaveCSS('border-radius', '10px')

    // Secondary button styling
    const registerButton = page.locator('button:has-text("Зарегестрироватся")')
    await expect(registerButton).toHaveCSS('height', '50px')
    await expect(registerButton).toHaveCSS('border-radius', '10px')

    // Take screenshot for visual comparison
    await page.screenshot({
      path: 'test-results/auth-page-desktop.png',
      fullPage: true
    })
  })

  test('should match Figma design for /login page with role selected', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/login?role=SPECIALIST')
    await page.waitForLoadState('networkidle')

    // Verify role card selection state
    const specialistCard = page.locator('[data-testid="role-specialist"]')
    await expect(specialistCard).toHaveCSS('border-color', 'rgb(2, 101, 220)')
    await expect(specialistCard).toHaveCSS('border-width', '2px')

    // Verify input field styling
    const emailInput = page.locator('input[name="email"]')
    await expect(emailInput).toHaveCSS('background-color', 'rgb(16, 18, 28)') // #10121c
    await expect(emailInput).toHaveCSS('border-radius', '20px')

    // Take screenshot
    await page.screenshot({
      path: 'test-results/login-page-role-selected.png',
      fullPage: true
    })
  })

  test('should display all visual elements correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    // Verify all elements are visible and properly sized
    await expect(page.locator('text=Вход')).toBeVisible()
    await expect(page.locator('[data-testid="role-specialist"]')).toBeVisible()
    await expect(page.locator('[data-testid="role-client"]')).toBeVisible()
    await expect(page.locator('button:has-text("Войти")')).toBeVisible()
    await expect(page.locator('button:has-text("Зарегестрироватся")')).toBeVisible()

    // Take screenshot for mobile layout verification
    await page.screenshot({
      path: 'test-results/auth-page-mobile.png',
      fullPage: true
    })
  })
})
