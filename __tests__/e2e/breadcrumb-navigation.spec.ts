import { test, expect } from '@playwright/test'
import { loginAsSpecialist, loginAsClient, loginAsAdmin } from './helpers/auth'

test.describe('Breadcrumb Navigation', () => {
  test.describe('Gig Detail Page Breadcrumbs', () => {
    test('specialist sees Dashboard > Browse Gigs > [Gig Title]', async ({ page }) => {
      await loginAsSpecialist(page)

      // Navigate to browse gigs
      await page.goto('/gigs')
      await page.waitForLoadState('networkidle')

      // Click on first gig
      const firstGigLink = page.locator('a[href^="/gigs/"]').first()
      await firstGigLink.click()
      await page.waitForLoadState('networkidle')

      // Verify breadcrumb structure
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      await expect(breadcrumb).toBeVisible()

      // Check breadcrumb items
      const breadcrumbText = await breadcrumb.textContent()
      expect(breadcrumbText).toContain('Dashboard')
      expect(breadcrumbText).toContain('Browse Gigs')
      expect(breadcrumbText).toContain('/')

      // Verify Dashboard link
      const dashboardLink = breadcrumb.locator('a[href="/dashboard"]')
      await expect(dashboardLink).toBeVisible()

      // Verify Browse Gigs link
      const browseGigsLink = breadcrumb.locator('a[href="/gigs"]')
      await expect(browseGigsLink).toBeVisible()

      // Verify current page is not a link
      const currentPage = breadcrumb.locator('[aria-current="page"]')
      await expect(currentPage).toBeVisible()
    })

    test('client sees Dashboard > [Gig Title]', async ({ page }) => {
      await loginAsClient(page)

      // Navigate to dashboard
      await page.goto('/dashboard')
      await page.waitForLoadState('networkidle')

      // Click on first gig in "My Gigs" section
      const firstGigLink = page.locator('a[href^="/gigs/"]').first()
      await firstGigLink.click()
      await page.waitForLoadState('networkidle')

      // Verify breadcrumb structure
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      await expect(breadcrumb).toBeVisible()

      // Check breadcrumb items
      const breadcrumbText = await breadcrumb.textContent()
      expect(breadcrumbText).toContain('Dashboard')
      expect(breadcrumbText).not.toContain('Browse Gigs')

      // Verify Dashboard link
      const dashboardLink = breadcrumb.locator('a[href="/dashboard"]')
      await expect(dashboardLink).toBeVisible()

      // Verify current page is not a link
      const currentPage = breadcrumb.locator('[aria-current="page"]')
      await expect(currentPage).toBeVisible()
    })

    test('breadcrumb links navigate correctly', async ({ page }) => {
      await loginAsSpecialist(page)

      // Navigate to a gig detail page
      await page.goto('/gigs')
      await page.waitForLoadState('networkidle')
      const firstGigLink = page.locator('a[href^="/gigs/"]').first()
      await firstGigLink.click()
      await page.waitForLoadState('networkidle')

      // Click Dashboard breadcrumb link
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      const dashboardLink = breadcrumb.locator('a[href="/dashboard"]')
      await dashboardLink.click()
      await page.waitForLoadState('networkidle')

      // Verify we're on dashboard
      await expect(page).toHaveURL('/dashboard')
    })

    test('breadcrumb links navigate to Browse Gigs', async ({ page }) => {
      await loginAsSpecialist(page)

      // Navigate to a gig detail page
      await page.goto('/gigs')
      await page.waitForLoadState('networkidle')
      const firstGigLink = page.locator('a[href^="/gigs/"]').first()
      await firstGigLink.click()
      await page.waitForLoadState('networkidle')

      // Click Browse Gigs breadcrumb link
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      const browseGigsLink = breadcrumb.locator('a[href="/gigs"]')
      await browseGigsLink.click()
      await page.waitForLoadState('networkidle')

      // Verify we're on browse gigs page
      await expect(page).toHaveURL('/gigs')
    })
  })

  test.describe('Profile Page Breadcrumbs', () => {
    test('profile page shows Dashboard > Profile', async ({ page }) => {
      await loginAsSpecialist(page)

      // Navigate to profile
      await page.goto('/profile')
      await page.waitForLoadState('networkidle')

      // Verify breadcrumb structure
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      await expect(breadcrumb).toBeVisible()

      // Check breadcrumb items
      const breadcrumbText = await breadcrumb.textContent()
      expect(breadcrumbText).toContain('Dashboard')
      expect(breadcrumbText).toContain('Profile')

      // Verify Dashboard link
      const dashboardLink = breadcrumb.locator('a[href="/dashboard"]')
      await expect(dashboardLink).toBeVisible()

      // Verify current page
      const currentPage = breadcrumb.locator('[aria-current="page"]')
      await expect(currentPage).toBeVisible()
      expect(await currentPage.textContent()).toContain('Profile')
    })

    test('profile edit page shows Dashboard > Profile > Edit', async ({ page }) => {
      await loginAsSpecialist(page)

      // Navigate to profile edit
      await page.goto('/profile/edit')
      await page.waitForLoadState('networkidle')

      // Verify breadcrumb structure
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      await expect(breadcrumb).toBeVisible()

      // Check breadcrumb items
      const breadcrumbText = await breadcrumb.textContent()
      expect(breadcrumbText).toContain('Dashboard')
      expect(breadcrumbText).toContain('Profile')
      expect(breadcrumbText).toContain('Edit')

      // Verify Dashboard link
      const dashboardLink = breadcrumb.locator('a[href="/dashboard"]')
      await expect(dashboardLink).toBeVisible()

      // Verify Profile link
      const profileLink = breadcrumb.locator('a[href="/profile"]')
      await expect(profileLink).toBeVisible()

      // Verify current page
      const currentPage = breadcrumb.locator('[aria-current="page"]')
      await expect(currentPage).toBeVisible()
      expect(await currentPage.textContent()).toContain('Edit')
    })

    test('profile breadcrumb links navigate correctly', async ({ page }) => {
      await loginAsSpecialist(page)

      // Navigate to profile edit
      await page.goto('/profile/edit')
      await page.waitForLoadState('networkidle')

      // Click Profile breadcrumb link
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      const profileLink = breadcrumb.locator('a[href="/profile"]')
      await profileLink.click()
      await page.waitForLoadState('networkidle')

      // Verify we're on profile page
      await expect(page).toHaveURL('/profile')
    })
  })

  test.describe('Admin Page Breadcrumbs', () => {
    test('admin users page shows Admin > Users', async ({ page }) => {
      await loginAsAdmin(page)

      // Navigate to admin users
      await page.goto('/admin/users')
      await page.waitForLoadState('networkidle')

      // Verify breadcrumb structure
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      await expect(breadcrumb).toBeVisible()

      // Check breadcrumb items
      const breadcrumbText = await breadcrumb.textContent()
      expect(breadcrumbText).toContain('Admin')
      expect(breadcrumbText).toContain('Users')

      // Verify Admin link
      const adminLink = breadcrumb.locator('a[href="/admin"]')
      await expect(adminLink).toBeVisible()

      // Verify current page
      const currentPage = breadcrumb.locator('[aria-current="page"]')
      await expect(currentPage).toBeVisible()
      expect(await currentPage.textContent()).toContain('Users')
    })

    test('admin gigs page shows Admin > Gigs', async ({ page }) => {
      await loginAsAdmin(page)

      // Navigate to admin gigs
      await page.goto('/admin/gigs')
      await page.waitForLoadState('networkidle')

      // Verify breadcrumb structure
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      await expect(breadcrumb).toBeVisible()

      // Check breadcrumb items
      const breadcrumbText = await breadcrumb.textContent()
      expect(breadcrumbText).toContain('Admin')
      expect(breadcrumbText).toContain('Gigs')

      // Verify Admin link
      const adminLink = breadcrumb.locator('a[href="/admin"]')
      await expect(adminLink).toBeVisible()

      // Verify current page
      const currentPage = breadcrumb.locator('[aria-current="page"]')
      await expect(currentPage).toBeVisible()
      expect(await currentPage.textContent()).toContain('Gigs')
    })

    test('admin breadcrumb links navigate correctly', async ({ page }) => {
      await loginAsAdmin(page)

      // Navigate to admin users
      await page.goto('/admin/users')
      await page.waitForLoadState('networkidle')

      // Click Admin breadcrumb link
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      const adminLink = breadcrumb.locator('a[href="/admin"]')
      await adminLink.click()
      await page.waitForLoadState('networkidle')

      // Verify we're on admin dashboard
      await expect(page).toHaveURL('/admin')
    })

    test('admin dashboard does not have breadcrumbs', async ({ page }) => {
      await loginAsAdmin(page)

      // Navigate to admin dashboard
      await page.goto('/admin')
      await page.waitForLoadState('networkidle')

      // Verify no breadcrumb
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      await expect(breadcrumb).not.toBeVisible()
    })
  })

  test.describe('Breadcrumb Accessibility', () => {
    test('breadcrumb is keyboard accessible', async ({ page }) => {
      await loginAsSpecialist(page)

      // Navigate to a gig detail page
      await page.goto('/gigs')
      await page.waitForLoadState('networkidle')
      const firstGigLink = page.locator('a[href^="/gigs/"]').first()
      await firstGigLink.click()
      await page.waitForLoadState('networkidle')

      // Tab to breadcrumb links
      await page.keyboard.press('Tab')

      // Find the Dashboard link in breadcrumb
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      const dashboardLink = breadcrumb.locator('a[href="/dashboard"]')

      // Focus the dashboard link
      await dashboardLink.focus()

      // Verify it's focused
      await expect(dashboardLink).toBeFocused()

      // Press Enter to navigate
      await page.keyboard.press('Enter')
      await page.waitForLoadState('networkidle')

      // Verify navigation worked
      await expect(page).toHaveURL('/dashboard')
    })

    test('breadcrumb has correct ARIA attributes', async ({ page }) => {
      await loginAsSpecialist(page)

      // Navigate to a gig detail page
      await page.goto('/gigs')
      await page.waitForLoadState('networkidle')
      const firstGigLink = page.locator('a[href^="/gigs/"]').first()
      await firstGigLink.click()
      await page.waitForLoadState('networkidle')

      // Verify nav has aria-label
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      await expect(breadcrumb).toBeVisible()

      // Verify current page has aria-current
      const currentPage = breadcrumb.locator('[aria-current="page"]')
      await expect(currentPage).toBeVisible()
    })
  })

  test.describe('Responsive Breadcrumb Behavior', () => {
    test('breadcrumb collapses on mobile viewport', async ({ page }) => {
      await loginAsSpecialist(page)

      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })

      // Navigate to a gig detail page (3 levels)
      await page.goto('/gigs')
      await page.waitForLoadState('networkidle')
      const firstGigLink = page.locator('a[href^="/gigs/"]').first()
      await firstGigLink.click()
      await page.waitForLoadState('networkidle')

      // Verify breadcrumb is visible
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      await expect(breadcrumb).toBeVisible()

      // Check that ellipsis is present (indicating collapse)
      const breadcrumbText = await breadcrumb.textContent()
      expect(breadcrumbText).toContain('...')
    })

    test('breadcrumb shows all items on desktop viewport', async ({ page }) => {
      await loginAsSpecialist(page)

      // Set desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 })

      // Navigate to a gig detail page (3 levels)
      await page.goto('/gigs')
      await page.waitForLoadState('networkidle')
      const firstGigLink = page.locator('a[href^="/gigs/"]').first()
      await firstGigLink.click()
      await page.waitForLoadState('networkidle')

      // Verify breadcrumb is visible
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      await expect(breadcrumb).toBeVisible()

      // Check that all items are visible
      const breadcrumbText = await breadcrumb.textContent()
      expect(breadcrumbText).toContain('Dashboard')
      expect(breadcrumbText).toContain('Browse Gigs')

      // Ellipsis should not be visible on desktop
      expect(breadcrumbText).not.toContain('...')
    })
  })
})
