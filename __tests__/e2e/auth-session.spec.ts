import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { setE2ESession } from '../helpers/auth'
import { createTestUser } from '../helpers/seed'

// Setup test database connection for E2E tests
// Use libSQL adapter (same as production code)
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
})

const prisma = new PrismaClient({
  adapter: adapter as any
})

test.describe('E2E Authentication Session', () => {
  // Clean up test data after each test to prevent pollution
  test.afterEach(async () => {
    // Delete all test users created during the test
    await prisma.user.deleteMany({})
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('CLIENT can access dashboard with session cookie', async ({ page }) => {
    // Create CLIENT user in test database
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      companyName: 'E2E Test Company'
    })

    // Set authenticated session
    await setE2ESession(page, client)

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard')

    // Verify user is authenticated and can see dashboard
    await expect(page).toHaveURL(/\/dashboard/)

    // Should not be redirected to login
    await expect(page).not.toHaveURL(/\/login/)
  })

  test('SPECIALIST can access dashboard with session cookie', async ({ page }) => {
    // Create SPECIALIST user in test database
    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      techStack: 'React, Node.js'
    })

    // Set authenticated session
    await setE2ESession(page, specialist)

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard')

    // Verify user is authenticated
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('session persists across page navigations', async ({ page }) => {
    // Create CLIENT user
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      companyName: 'Navigation Test Co'
    })

    // Set authenticated session
    await setE2ESession(page, client)

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard')
    await expect(page).toHaveURL(/\/dashboard/)

    // Navigate to another protected page
    await page.goto('http://localhost:3000/profile')

    // Should still be authenticated (not redirected to login)
    await expect(page).not.toHaveURL(/\/login/)
  })

  test('ADMIN can access admin dashboard', async ({ page }) => {
    // Create ADMIN user
    const admin = await createTestUser(prisma, {
      role: 'ADMIN',
      email: 'admin@e2e-test.com'
    })

    // Set authenticated session
    await setE2ESession(page, admin)

    // Navigate to admin dashboard
    await page.goto('http://localhost:3000/admin')

    // Verify admin can access admin area
    await expect(page).toHaveURL(/\/admin/)
  })
})
