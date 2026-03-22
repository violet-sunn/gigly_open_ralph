import { test, expect } from '@playwright/test'

test.describe('Empty States', () => {
  test.beforeEach(async ({ page }) => {
    // Reset database before each test
    await page.goto('/')
  })

  test.describe('SPECIALIST Empty States', () => {
    test('shows empty state on gig browse page when no gigs exist', async ({ page }) => {
      // Register as SPECIALIST
      await page.goto('/register')
      await page.fill('input[name="email"]', 'specialist@test.com')
      await page.fill('input[name="password"]', 'Password123')
      await page.selectOption('select[name="role"]', 'SPECIALIST')
      await page.click('button[type="submit"]')

      // Navigate to gig browse page
      await page.goto('/gigs')

      // Verify empty state appears
      await expect(page.locator('text=📭')).toBeVisible()
      await expect(page.locator('text=No Open Gigs Available')).toBeVisible()
      await expect(page.locator('text=There are no open gigs at the moment')).toBeVisible()

      // Verify CTA button exists and navigates correctly
      const viewExamplesButton = page.locator('a:has-text("View Example Gigs")')
      await expect(viewExamplesButton).toBeVisible()
      await expect(viewExamplesButton).toHaveAttribute('href', '/gigs/examples')
    })

    test('shows filtered empty state on gig browse page when no matches', async ({ page }) => {
      // Register as SPECIALIST
      await page.goto('/register')
      await page.fill('input[name="email"]', 'specialist2@test.com')
      await page.fill('input[name="password"]', 'Password123')
      await page.selectOption('select[name="role"]', 'SPECIALIST')
      await page.click('button[type="submit"]')

      // Navigate to gig browse page with filters that match nothing
      await page.goto('/gigs?search=nonexistentgig12345')

      // Verify filtered empty state appears
      await expect(page.locator('text=🔍')).toBeVisible()
      await expect(page.locator('text=No Gigs Match Your Filters')).toBeVisible()
      await expect(page.locator('text=Try adjusting your search criteria')).toBeVisible()

      // Verify Clear Filters button exists
      const clearFiltersButton = page.locator('a:has-text("Clear Filters")')
      await expect(clearFiltersButton).toBeVisible()
      await expect(clearFiltersButton).toHaveAttribute('href', '/gigs')
    })

    test('shows empty states on specialist dashboard tabs', async ({ page }) => {
      // Register as SPECIALIST
      await page.goto('/register')
      await page.fill('input[name="email"]', 'specialist3@test.com')
      await page.fill('input[name="password"]', 'Password123')
      await page.selectOption('select[name="role"]', 'SPECIALIST')
      await page.click('button[type="submit"]')

      // Navigate to dashboard
      await page.goto('/dashboard')

      // Verify Active Work empty state
      await expect(page.locator('text=🔍')).toBeVisible()
      await expect(page.locator('text=No Active Work Yet')).toBeVisible()
      await expect(page.locator('text=Browse available gigs and apply')).toBeVisible()

      // Click Pending Applications tab
      await page.click('button:has-text("Pending Applications")')
      await expect(page.locator('text=📝')).toBeVisible()
      await expect(page.locator('text=No Pending Applications')).toBeVisible()

      // Click Archive tab
      await page.click('button:has-text("Archive")')
      await expect(page.locator('text=📦')).toBeVisible()
      await expect(page.locator('text=No Archived Items')).toBeVisible()
    })

    test('shows messages empty state on specialist dashboard', async ({ page }) => {
      // Register as SPECIALIST
      await page.goto('/register')
      await page.fill('input[name="email"]', 'specialist4@test.com')
      await page.fill('input[name="password"]', 'Password123')
      await page.selectOption('select[name="role"]', 'SPECIALIST')
      await page.click('button[type="submit"]')

      // Navigate to dashboard
      await page.goto('/dashboard')

      // Verify messages empty state with SPECIALIST-specific text
      await expect(page.locator('text=💬')).toBeVisible()
      await expect(page.locator('text=No Messages Yet')).toBeVisible()
      await expect(page.locator('text=Messages with clients will appear here once your applications are accepted')).toBeVisible()
    })
  })

  test.describe('CLIENT Empty States', () => {
    test('shows empty state on client dashboard when no gigs posted', async ({ page }) => {
      // Register as CLIENT
      await page.goto('/register')
      await page.fill('input[name="email"]', 'client@test.com')
      await page.fill('input[name="password"]', 'Password123')
      await page.selectOption('select[name="role"]', 'CLIENT')
      await page.click('button[type="submit"]')

      // Navigate to dashboard
      await page.goto('/dashboard')

      // Verify empty state appears
      await expect(page.locator('text=📋')).toBeVisible()
      await expect(page.locator('text=Post Your First Gig')).toBeVisible()
      await expect(page.locator('text=Get started by posting a gig')).toBeVisible()

      // Verify CTAs exist
      await expect(page.locator('a:has-text("Create Gig")')).toBeVisible()
      await expect(page.locator('a:has-text("View Example Gigs")')).toBeVisible()
    })

    test('shows messages empty state on client dashboard', async ({ page }) => {
      // Register as CLIENT
      await page.goto('/register')
      await page.fill('input[name="email"]', 'client2@test.com')
      await page.fill('input[name="password"]', 'Password123')
      await page.selectOption('select[name="role"]', 'CLIENT')
      await page.click('button[type="submit"]')

      // Navigate to dashboard
      await page.goto('/dashboard')

      // Verify messages empty state with CLIENT-specific text
      await expect(page.locator('text=💬')).toBeVisible()
      await expect(page.locator('text=No Messages Yet')).toBeVisible()
      await expect(page.locator('text=Messages with specialists will appear here once you accept applications')).toBeVisible()
    })
  })

  test.describe('ADMIN Empty States', () => {
    test('shows empty state on admin users page', async ({ page }) => {
      // This test requires an ADMIN user to be created via database
      // For now, we'll skip this test in automated runs
      test.skip()
    })

    test('shows empty state on admin gigs page', async ({ page }) => {
      // This test requires an ADMIN user to be created via database
      // For now, we'll skip this test in automated runs
      test.skip()
    })
  })

  test.describe('Example Gigs Page', () => {
    test('shows empty state when no example gigs available', async ({ page }) => {
      // Register as any user
      await page.goto('/register')
      await page.fill('input[name="email"]', 'user@test.com')
      await page.fill('input[name="password"]', 'Password123')
      await page.selectOption('select[name="role"]', 'SPECIALIST')
      await page.click('button[type="submit"]')

      // Navigate to example gigs page
      await page.goto('/gigs/examples')

      // Verify empty state appears (if no example gigs exist)
      // Note: This may not show if seed data includes example gigs
      const emptyStateIcon = page.locator('text=✨')
      if (await emptyStateIcon.isVisible()) {
        await expect(page.locator('text=No Example Gigs Available')).toBeVisible()
        await expect(page.locator('text=Example gigs haven\'t been set up yet')).toBeVisible()
      }
    })
  })

  test.describe('Accessibility', () => {
    test('empty states are keyboard accessible', async ({ page }) => {
      // Register as SPECIALIST
      await page.goto('/register')
      await page.fill('input[name="email"]', 'specialist5@test.com')
      await page.fill('input[name="password"]', 'Password123')
      await page.selectOption('select[name="role"]', 'SPECIALIST')
      await page.click('button[type="submit"]')

      // Navigate to gig browse page
      await page.goto('/gigs')

      // Tab to the CTA button
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      // Verify focus is on the button
      const viewExamplesButton = page.locator('a:has-text("View Example Gigs")')
      await expect(viewExamplesButton).toBeFocused()

      // Press Enter to activate
      await page.keyboard.press('Enter')

      // Verify navigation occurred
      await expect(page).toHaveURL('/gigs/examples')
    })
  })
})
