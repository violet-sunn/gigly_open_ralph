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

test.describe('Gig Pagination E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Clean up database
    await prisma.message.deleteMany()
    await prisma.application.deleteMany()
    await prisma.gig.deleteMany()
    await prisma.specialistProfile.deleteMany()
    await prisma.clientProfile.deleteMany()
    await prisma.user.deleteMany()

    // Create test users
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: 'client@test.com',
      password: 'TestPassword123!',
    })

    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      email: 'specialist@test.com',
      password: 'TestPassword123!',
    })

    // Create 60 gigs for pagination testing (3 pages of 25 each)
    const gigs = []
    for (let i = 1; i <= 60; i++) {
      gigs.push({
        title: `Test Gig ${i.toString().padStart(2, '0')}`,
        description: `Description for gig ${i}`,
        acceptanceCriteria: 'Test acceptance criteria that is long enough to pass validation requirements',
        budget: 10000000 + i * 100000, // Varying budgets
        serviceFee: 1000000 + i * 10000,
        totalAmount: 11000000 + i * 110000,
        status: 'OPEN' as const,
        clientId: client.id,
        tags: i % 2 === 0 ? 'React,TypeScript' : 'Python,Django',
      })
    }
    await prisma.gig.createMany({ data: gigs })

    // Authenticate specialist user by setting session cookie
    const sessionToken = await createTestSession(specialist)
    await page.context().addCookies([
      {
        name: 'session',
        value: sessionToken,
        domain: 'localhost',
        path: '/',
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

  test('should navigate through pages using Next and Previous buttons', async ({ page }) => {
    // Navigate to gig browse page
    await page.goto('/dashboard/gigs')
    await page.waitForLoadState('networkidle')

    // Verify we're on page 1
    await expect(page).toHaveURL('/dashboard/gigs')
    await expect(page.locator('text=Showing 1-25 of 60 gigs')).toBeVisible()

    // Verify pagination controls are visible
    await expect(page.locator('nav[aria-label="Pagination"]')).toBeVisible()

    // Click Next button
    await page.click('a[aria-label="Next page"]')
    await page.waitForURL(/page=2/)
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 26-50 of 60 gigs')).toBeVisible()

    // Verify page 2 is active
    await expect(page.locator('[aria-current="page"]')).toHaveText('2')

    // Click Next again to go to page 3
    await page.click('a[aria-label="Next page"]')
    await page.waitForURL(/page=3/)
    await expect(page).toHaveURL(/page=3/)
    await expect(page.locator('text=Showing 51-60 of 60 gigs')).toBeVisible()

    // Click Previous button
    await page.click('a[aria-label="Previous page"]')
    await page.waitForURL(/page=2/)
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 26-50 of 60 gigs')).toBeVisible()
  })

  test('should navigate directly to a specific page via URL', async ({ page }) => {
    // Navigate directly to page 2
    await page.goto('/dashboard/gigs?page=2')
    await page.waitForLoadState('networkidle')

    // Verify we're on page 2
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 26-50 of 60 gigs')).toBeVisible()
    await expect(page.locator('[aria-current="page"]')).toHaveText('2')
  })

  test('should navigate using page number buttons', async ({ page }) => {
    // Navigate to gig browse page
    await page.goto('/dashboard/gigs')
    await page.waitForLoadState('networkidle')

    // Click on page 3 button
    await page.click('a[aria-label="Go to page 3"]')
    await page.waitForURL(/page=3/)
    await expect(page).toHaveURL(/page=3/)
    await expect(page.locator('text=Showing 51-60 of 60 gigs')).toBeVisible()
    await expect(page.locator('[aria-current="page"]')).toHaveText('3')
  })

  test('should redirect invalid page numbers to valid pages', async ({ page }) => {
    // Try to navigate to page 999 (exceeds total pages)
    await page.goto('/dashboard/gigs?page=999')
    await page.waitForLoadState('networkidle')

    // Should redirect to last valid page (page 3)
    await expect(page).toHaveURL(/page=3/)
    await expect(page.locator('text=Showing 51-60 of 60 gigs')).toBeVisible()

    // Try to navigate to page 0
    await page.goto('/dashboard/gigs?page=0')
    await page.waitForLoadState('networkidle')

    // Should redirect to page 1
    await expect(page).toHaveURL('/dashboard/gigs')
    await expect(page.locator('text=Showing 1-25 of 60 gigs')).toBeVisible()
  })

  test('should preserve filters when paginating', async ({ page }) => {
    // Navigate to gig browse page
    await page.goto('/dashboard/gigs')
    await page.waitForLoadState('networkidle')

    // Apply React tag filter
    await page.check('input[type="checkbox"]', { force: true })
    await page.click('button:has-text("Apply Filters")')
    await page.waitForURL(/tags=React/)

    // Verify filtered results (30 React gigs)
    await expect(page.locator('text=Showing 1-25 of 30 gigs')).toBeVisible()

    // Navigate to page 2
    await page.click('a[aria-label="Next page"]')
    await page.waitForURL(/page=2/)

    // Verify URL includes both filter and page params
    await expect(page).toHaveURL(/tags=React/)
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 26-30 of 30 gigs')).toBeVisible()
  })

  test('should reset to page 1 when filters change', async ({ page }) => {
    // Navigate to page 2
    await page.goto('/dashboard/gigs?page=2')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/page=2/)

    // Apply a filter
    await page.check('input[type="checkbox"]', { force: true })
    await page.click('button:has-text("Apply Filters")')
    await page.waitForURL(/tags=React/)

    // Verify pagination reset to page 1 (no page param in URL)
    await expect(page).not.toHaveURL(/page=/)
    await expect(page.locator('text=Showing 1-25 of 30 gigs')).toBeVisible()
  })

  test('should support browser back/forward navigation', async ({ page }) => {
    // Navigate through pages: 1 → 2 → 3
    await page.goto('/dashboard/gigs')
    await page.waitForLoadState('networkidle')

    await page.click('a[aria-label="Next page"]')
    await page.waitForURL(/page=2/)

    await page.click('a[aria-label="Next page"]')
    await page.waitForURL(/page=3/)

    // Use browser back button twice
    await page.goBack()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 26-50 of 60 gigs')).toBeVisible()

    await page.goBack()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/dashboard/gigs')
    await expect(page.locator('text=Showing 1-25 of 60 gigs')).toBeVisible()

    // Use browser forward button
    await page.goForward()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('text=Showing 26-50 of 60 gigs')).toBeVisible()
  })

  test('should disable Previous button on first page and Next button on last page', async ({ page }) => {
    // Navigate to page 1
    await page.goto('/dashboard/gigs')
    await page.waitForLoadState('networkidle')

    // Verify Previous button is disabled
    const prevButton = page.locator('span[aria-label="Previous page"][aria-disabled="true"]')
    await expect(prevButton).toBeVisible()
    await expect(prevButton).toHaveClass(/opacity-50/)

    // Navigate to last page (page 3)
    await page.goto('/dashboard/gigs?page=3')
    await page.waitForLoadState('networkidle')

    // Verify Next button is disabled
    const nextButton = page.locator('span[aria-label="Next page"][aria-disabled="true"]')
    await expect(nextButton).toBeVisible()
    await expect(nextButton).toHaveClass(/opacity-50/)
  })
})
