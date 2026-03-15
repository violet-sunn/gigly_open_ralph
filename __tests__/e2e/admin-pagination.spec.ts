import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createTestUser } from '../helpers/seed'
import { createTestSession } from '../helpers/auth'

// Setup test database connection for E2E tests
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
})

const prisma = new PrismaClient({
  adapter: adapter as any
})

test.describe('Admin Users Pagination E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Clean up database
    await prisma.message.deleteMany()
    await prisma.application.deleteMany()
    await prisma.gig.deleteMany()
    await prisma.specialistProfile.deleteMany()
    await prisma.clientProfile.deleteMany()
    await prisma.user.deleteMany()

    // Create test admin user
    const admin = await createTestUser(prisma, {
      role: 'ADMIN',
      email: 'admin@test.com',
      password: 'TestPassword123!',
    })

    // Create 90 users for pagination testing (3 pages of 30 each)
    const users = []
    for (let i = 1; i <= 90; i++) {
      users.push({
        email: `user${i.toString().padStart(2, '0')}@test.com`,
        password: 'hashedpassword',
        role: i % 3 === 0 ? 'ADMIN' : i % 2 === 0 ? 'SPECIALIST' : 'CLIENT',
        suspended: i % 10 === 0, // Every 10th user is suspended
      })
    }
    await prisma.user.createMany({ data: users })

    // Authenticate admin user by setting session cookie
    const sessionToken = await createTestSession(admin)
    await page.context().addCookies([
      {
        name: 'session',
        value: sessionToken,
        url: 'http://localhost:3000/',
        httpOnly: true,
        sameSite: 'Lax',
      },
    ])
  })

  test.afterEach(async () => {
    // Clean up
    await prisma.message.deleteMany()
    await prisma.application.deleteMany()
    await prisma.gig.deleteMany()
    await prisma.specialistProfile.deleteMany()
    await prisma.clientProfile.deleteMany()
    await prisma.user.deleteMany()
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('should navigate through user pages using Next and Previous buttons', async ({ page }) => {
    // Navigate to admin users page
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')

    // Verify we're on page 1
    await expect(page).toHaveURL('/admin/users')
    await expect(page.locator('text=Showing 1-30 of 91 users')).toBeVisible()

    // Verify pagination controls are visible
    await expect(page.locator('nav[aria-label="Pagination"]')).toBeVisible()

    // Click Next button
    await page.click('a[aria-label="Next page"]')
    await page.waitForURL(/page=2/)
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 31-60 of 91 users')).toBeVisible()

    // Verify page 2 is active
    await expect(page.locator('[aria-current="page"]')).toHaveText('2')

    // Click Next again to go to page 3
    await page.click('a[aria-label="Next page"]')
    await page.waitForURL(/page=3/)
    await expect(page).toHaveURL(/page=3/)
    await expect(page.locator('text=Showing 61-90 of 91 users')).toBeVisible()

    // Click Previous button
    await page.click('a[aria-label="Previous page"]')
    await page.waitForURL(/page=2/)
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 31-60 of 91 users')).toBeVisible()
  })

  test('should navigate directly to a specific user page via URL', async ({ page }) => {
    // Navigate directly to page 2
    await page.goto('/admin/users?page=2')
    await page.waitForLoadState('networkidle')

    // Verify we're on page 2
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 31-60 of 91 users')).toBeVisible()
    await expect(page.locator('[aria-current="page"]')).toHaveText('2')
  })

  test('should navigate using page number buttons on users page', async ({ page }) => {
    // Navigate to admin users page
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')

    // Click on page 3 button
    await page.click('a[aria-label="Go to page 3"]')
    await page.waitForURL(/page=3/)
    await expect(page).toHaveURL(/page=3/)
    await expect(page.locator('text=Showing 61-90 of 91 users')).toBeVisible()
    await expect(page.locator('[aria-current="page"]')).toHaveText('3')
  })

  test('should redirect invalid page numbers to valid pages on users page', async ({ page }) => {
    // Try to navigate to page 999 (exceeds total pages)
    await page.goto('/admin/users?page=999')
    await page.waitForLoadState('networkidle')

    // Should redirect to last valid page (page 4)
    await expect(page).toHaveURL(/page=4/)
    await expect(page.locator('text=Showing 91-91 of 91 users')).toBeVisible()

    // Try to navigate to page 0
    await page.goto('/admin/users?page=0')
    await page.waitForLoadState('networkidle')

    // Should redirect to page 1
    await expect(page).toHaveURL('/admin/users')
    await expect(page.locator('text=Showing 1-30 of 91 users')).toBeVisible()
  })

  test('should preserve filters when paginating users', async ({ page }) => {
    // Navigate to admin users page
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')

    // Apply CLIENT role filter
    await page.selectOption('select', { label: 'Client' })
    await page.waitForURL(/role=CLIENT/)

    // Wait for filtered results to render (and pagination to appear/disappear)
    await page.waitForLoadState('networkidle')

    // Verify filtered results
    await expect(page.locator('text=/Showing 1-30 of \\d+ users/')).toBeVisible()

    // For our seed data, CLIENT results are exactly 30 users (1 page), so Next should not exist.
    await expect(page.locator('a[aria-label="Next page"]')).toHaveCount(0)
  })

  test('should reset to page 1 when user filters change', async ({ page }) => {
    // Navigate to page 2
    await page.goto('/admin/users?page=2')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/page=2/)

    // Apply a filter
    await page.selectOption('select', { label: 'Client' })
    await page.waitForURL(/role=CLIENT/)

    // Verify pagination reset to page 1 (no page param in URL)
    await expect(page).not.toHaveURL(/page=/)
    await expect(page.locator('text=/Showing 1-30 of \\d+ users/')).toBeVisible()
  })

  test('should support browser back/forward navigation on users page', async ({ page }) => {
    // Navigate through pages: 1 → 2 → 3
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')

    await page.click('a[aria-label="Next page"]')
    await page.waitForURL(/page=2/)

    await page.click('a[aria-label="Next page"]')
    await page.waitForURL(/page=3/)

    // Use browser back button twice
    await page.goBack()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 31-60 of 91 users')).toBeVisible()

    await page.goBack()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/admin/users')
    await expect(page.locator('text=Showing 1-30 of 91 users')).toBeVisible()

    // Use browser forward button
    await page.goForward()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 31-60 of 91 users')).toBeVisible()
  })

  test('should disable Previous button on first page and Next button on last page', async ({ page }) => {
    // Navigate to page 1
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')

    // Verify Previous button is disabled
    const prevButton = page.locator('span[aria-label="Previous page"][aria-disabled="true"]')
    await expect(prevButton).toBeVisible()
    await expect(prevButton).toHaveClass(/opacity-50/)

    // Navigate to last page (page 4)
    await page.goto('/admin/users?page=4')
    await page.waitForLoadState('networkidle')

    // Verify Next button is disabled
    const nextButton = page.locator('span[aria-label="Next page"][aria-disabled="true"]')
    await expect(nextButton).toBeVisible()
    await expect(nextButton).toHaveClass(/opacity-50/)
  })
})

test.describe('Admin Gigs Pagination E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Clean up database
    await prisma.message.deleteMany()
    await prisma.application.deleteMany()
    await prisma.gig.deleteMany()
    await prisma.specialistProfile.deleteMany()
    await prisma.clientProfile.deleteMany()
    await prisma.user.deleteMany()

    // Create test admin user
    const admin = await createTestUser(prisma, {
      role: 'ADMIN',
      email: 'admin@test.com',
      password: 'TestPassword123!',
    })

    // Create test client
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: 'client@test.com',
      password: 'TestPassword123!',
    })

    // Create 90 gigs for pagination testing (3 pages of 30 each)
    const gigs = []
    for (let i = 1; i <= 90; i++) {
      gigs.push({
        title: `Test Gig ${i.toString().padStart(2, '0')}`,
        description: `Description for gig ${i}`,
        acceptanceCriteria: 'Test acceptance criteria that is long enough to pass validation requirements',
        budget: 10000000 + i * 100000,
        serviceFee: 1000000 + i * 10000,
        totalAmount: 11000000 + i * 110000,
        status: i % 3 === 0 ? 'COMPLETED' : i % 2 === 0 ? 'IN_PROGRESS' : 'OPEN',
        clientId: client.id,
        tags: 'React,TypeScript',
        closedByAdmin: i % 20 === 0, // Every 20th gig is closed
      })
    }
    await prisma.gig.createMany({ data: gigs })

    // Authenticate admin user by setting session cookie
    const sessionToken = await createTestSession(admin)
    await page.context().addCookies([
      {
        name: 'session',
        value: sessionToken,
        url: 'http://localhost:3000/',
        httpOnly: true,
        sameSite: 'Lax',
      },
    ])
  })

  test.afterEach(async () => {
    // Clean up
    await prisma.message.deleteMany()
    await prisma.application.deleteMany()
    await prisma.gig.deleteMany()
    await prisma.specialistProfile.deleteMany()
    await prisma.clientProfile.deleteMany()
    await prisma.user.deleteMany()
  })

  test('should navigate through gig pages using Next and Previous buttons', async ({ page }) => {
    // Navigate to admin gigs page
    await page.goto('/admin/gigs')
    await page.waitForLoadState('networkidle')

    // Verify we're on page 1
    await expect(page).toHaveURL('/admin/gigs')
    await expect(page.locator('text=Showing 1-30 of 90 gigs')).toBeVisible()

    // Verify pagination controls are visible
    await expect(page.locator('nav[aria-label="Pagination"]')).toBeVisible()

    // Click Next button
    await page.click('a[aria-label="Next page"]')
    await page.waitForURL(/page=2/)
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 31-60 of 90 gigs')).toBeVisible()

    // Verify page 2 is active
    await expect(page.locator('[aria-current="page"]')).toHaveText('2')

    // Click Next again to go to page 3
    await page.click('a[aria-label="Next page"]')
    await page.waitForURL(/page=3/)
    await expect(page).toHaveURL(/page=3/)
    await expect(page.locator('text=Showing 61-90 of 90 gigs')).toBeVisible()

    // Click Previous button
    await page.click('a[aria-label="Previous page"]')
    await page.waitForURL(/page=2/)
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 31-60 of 90 gigs')).toBeVisible()
  })

  test('should navigate directly to a specific gig page via URL', async ({ page }) => {
    // Navigate directly to page 2
    await page.goto('/admin/gigs?page=2')
    await page.waitForLoadState('networkidle')

    // Verify we're on page 2
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 31-60 of 90 gigs')).toBeVisible()
    await expect(page.locator('[aria-current="page"]')).toHaveText('2')
  })

  test('should navigate using page number buttons on gigs page', async ({ page }) => {
    // Navigate to admin gigs page
    await page.goto('/admin/gigs')
    await page.waitForLoadState('networkidle')

    // Click on page 3 button
    await page.click('a[aria-label="Go to page 3"]')
    await page.waitForURL(/page=3/)
    await expect(page).toHaveURL(/page=3/)
    await expect(page.locator('text=Showing 61-90 of 90 gigs')).toBeVisible()
    await expect(page.locator('[aria-current="page"]')).toHaveText('3')
  })

  test('should redirect invalid page numbers to valid pages on gigs page', async ({ page }) => {
    // Try to navigate to page 999 (exceeds total pages)
    await page.goto('/admin/gigs?page=999')
    await page.waitForLoadState('networkidle')

    // Should redirect to last valid page (page 3)
    await expect(page).toHaveURL(/page=3/)
    await expect(page.locator('text=Showing 61-90 of 90 gigs')).toBeVisible()

    // Try to navigate to page 0
    await page.goto('/admin/gigs?page=0')
    await page.waitForLoadState('networkidle')

    // Should redirect to page 1
    await expect(page).toHaveURL('/admin/gigs')
    await expect(page.locator('text=Showing 1-30 of 90 gigs')).toBeVisible()
  })

  test('should preserve filters when paginating gigs', async ({ page }) => {
    // Navigate to admin gigs page
    await page.goto('/admin/gigs')
    await page.waitForLoadState('networkidle')

    // Apply OPEN status filter
    await page.selectOption('select', { label: 'Open' })
    await page.waitForURL(/status=OPEN/)

    // Verify filtered results
    await expect(page.locator('text=/Showing 1-30 of \\d+ gigs/')).toBeVisible()

    // Navigate to page 2
    await page.click('a[aria-label="Next page"]')
    await page.waitForURL(/page=2/)

    // Verify URL includes both filter and page params
    await expect(page).toHaveURL(/status=OPEN/)
    await expect(page).toHaveURL(/page=2/)
  })

  test('should reset to page 1 when gig filters change', async ({ page }) => {
    // Navigate to page 2
    await page.goto('/admin/gigs?page=2')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/page=2/)

    // Apply a filter
    await page.selectOption('select', { label: 'Open' })
    await page.waitForURL(/status=OPEN/)

    // Verify pagination reset to page 1 (no page param in URL)
    await expect(page).not.toHaveURL(/page=/)
    await expect(page.locator('text=/Showing 1-30 of \\d+ gigs/')).toBeVisible()
  })

  test('should support browser back/forward navigation on gigs page', async ({ page }) => {
    // Navigate through pages: 1 → 2 → 3
    await page.goto('/admin/gigs')
    await page.waitForLoadState('networkidle')

    await page.click('a[aria-label="Next page"]')
    await page.waitForURL(/page=2/)

    await page.click('a[aria-label="Next page"]')
    await page.waitForURL(/page=3/)

    // Use browser back button twice
    await page.goBack()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 31-60 of 90 gigs')).toBeVisible()

    await page.goBack()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/admin/gigs')
    await expect(page.locator('text=Showing 1-30 of 90 gigs')).toBeVisible()

    // Use browser forward button
    await page.goForward()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 31-60 of 90 gigs')).toBeVisible()
  })
})
