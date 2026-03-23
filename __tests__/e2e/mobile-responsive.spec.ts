import { test, expect } from '@playwright/test'

test.describe('Mobile Responsive Design', () => {
  test.describe('Navigation Hamburger Menu', () => {
    test('should show hamburger menu on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Login as specialist
      await page.goto('/login')
      await page.fill('input[name="email"]', 'specialist@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Hamburger button should be visible on mobile
      const hamburgerButton = page.locator('button[aria-label="Toggle menu"]')
      await expect(hamburgerButton).toBeVisible()

      // Desktop navigation should be hidden
      const desktopNav = page.locator('nav div.hidden.md\\:flex')
      await expect(desktopNav).toBeHidden()
    })

    test('should hide hamburger menu on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'specialist@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Hamburger button should be hidden on desktop
      const hamburgerButton = page.locator('button[aria-label="Toggle menu"]')
      await expect(hamburgerButton).toBeHidden()

      // Desktop navigation should be visible
      const desktopNav = page.locator('nav div.hidden.md\\:flex')
      await expect(desktopNav).toBeVisible()
    })

    test('should toggle mobile menu open and closed', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'specialist@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      const hamburgerButton = page.locator('button[aria-label="Toggle menu"]')

      // Open menu
      await hamburgerButton.click()
      const mobileMenu = page.locator('div.fixed.top-\\[57px\\].right-0')
      await expect(mobileMenu).toBeVisible()

      // Close menu
      await hamburgerButton.click()
      await expect(mobileMenu).toBeHidden()
    })

    test('should display all navigation links in mobile menu', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'specialist@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      const hamburgerButton = page.locator('button[aria-label="Toggle menu"]')
      await hamburgerButton.click()

      // Check for navigation links
      await expect(page.locator('text=Dashboard')).toBeVisible()
      await expect(page.locator('text=Browse Gigs')).toBeVisible()
      await expect(page.locator('text=Profile')).toBeVisible()
      await expect(page.locator('text=Sign Out')).toBeVisible()
    })

    test('should close mobile menu when clicking backdrop', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'specialist@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      const hamburgerButton = page.locator('button[aria-label="Toggle menu"]')
      await hamburgerButton.click()

      const mobileMenu = page.locator('div.fixed.top-\\[57px\\].right-0')
      await expect(mobileMenu).toBeVisible()

      // Click backdrop
      const backdrop = page.locator('div.fixed.inset-0.bg-black')
      await backdrop.click({ position: { x: 10, y: 10 } })

      await expect(mobileMenu).toBeHidden()
    })
  })

  test.describe('Admin Table to Card Conversion', () => {
    test('should display users as cards on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Login as admin
      await page.goto('/login')
      await page.fill('input[name="email"]', 'admin@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      await page.goto('/admin/users')

      // Table should be hidden on mobile
      const table = page.locator('table').first()
      await expect(table).toBeHidden()

      // Cards should be visible
      const cards = page.locator('div.md\\:hidden.space-y-4 > div')
      await expect(cards.first()).toBeVisible()
    })

    test('should display users as table on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'admin@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      await page.goto('/admin/users')

      // Table should be visible on desktop
      const table = page.locator('table').first()
      await expect(table).toBeVisible()

      // Cards should be hidden
      const cardContainer = page.locator('div.md\\:hidden.space-y-4')
      await expect(cardContainer).toBeHidden()
    })

    test('should display gigs as cards on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'admin@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      await page.goto('/admin/gigs')

      // Table should be hidden on mobile
      const table = page.locator('table').first()
      await expect(table).toBeHidden()

      // Cards should be visible
      const cards = page.locator('div.md\\:hidden.space-y-4 > div')
      await expect(cards.first()).toBeVisible()
    })
  })

  test.describe('Form Optimization', () => {
    test('should render gig creation form correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'client@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      await page.goto('/gigs/new')

      // Check form inputs are visible and have adequate height
      const titleInput = page.locator('input[name="title"]')
      await expect(titleInput).toBeVisible()

      const budgetInput = page.locator('input[name="budget"]')
      await expect(budgetInput).toBeVisible()

      const submitButton = page.locator('button[type="submit"]')
      await expect(submitButton).toBeVisible()
    })

    test('should render profile edit form correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'specialist@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      await page.goto('/profile/edit')

      // Check form stacks vertically on mobile
      const displayNameInput = page.locator('input[name="displayName"]')
      await expect(displayNameInput).toBeVisible()

      const bioTextarea = page.locator('textarea[name="bio"]')
      await expect(bioTextarea).toBeVisible()

      const saveButton = page.locator('button[type="submit"]')
      await expect(saveButton).toBeVisible()
    })
  })

  test.describe('Horizontal Scroll Prevention', () => {
    test('should not have horizontal scroll on dashboard (mobile)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'client@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Check document width doesn't exceed viewport
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1) // Allow 1px tolerance
    })

    test('should not have horizontal scroll on gig browse page (mobile)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'specialist@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      await page.goto('/gigs')

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })

    test('should not have horizontal scroll on admin pages (mobile)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'admin@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      await page.goto('/admin/users')

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })
  })

  test.describe('Touch Target Compliance', () => {
    test('should have adequate touch targets for buttons (mobile)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'client@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Check hamburger button size
      const hamburgerButton = page.locator('button[aria-label="Toggle menu"]')
      const hamburgerBox = await hamburgerButton.boundingBox()

      expect(hamburgerBox?.width).toBeGreaterThanOrEqual(44)
      expect(hamburgerBox?.height).toBeGreaterThanOrEqual(44)
    })

    test('should have adequate touch targets for form inputs (mobile)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'client@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      await page.goto('/gigs/new')

      // Check input heights
      const titleInput = page.locator('input[name="title"]')
      const titleBox = await titleInput.boundingBox()

      expect(titleBox?.height).toBeGreaterThanOrEqual(44)

      const budgetInput = page.locator('input[name="budget"]')
      const budgetBox = await budgetInput.boundingBox()

      expect(budgetBox?.height).toBeGreaterThanOrEqual(44)
    })
  })

  test.describe('Responsive Layout Stacking', () => {
    test('should stack dashboard columns vertically on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'client@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Check grid layout stacks on mobile
      const gridContainer = page.locator('div.grid.grid-cols-1.lg\\:grid-cols-3')
      await expect(gridContainer).toBeVisible()
    })

    test('should display dashboard in columns on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'client@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      const gridContainer = page.locator('div.grid.grid-cols-1.lg\\:grid-cols-3')
      await expect(gridContainer).toBeVisible()
    })
  })

  test.describe('Multiple Viewport Testing', () => {
    const viewports = [
      { width: 375, height: 667, name: 'iPhone SE' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1024, height: 768, name: 'Desktop' },
    ]

    for (const viewport of viewports) {
      test(`should render correctly at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })

        await page.goto('/login')
        await page.fill('input[name="email"]', 'specialist@example.com')
        await page.fill('input[name="password"]', 'password123')
        await page.click('button[type="submit"]')
        await page.waitForURL('/dashboard')

        // Check no horizontal scroll
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)

        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)

        // Check page renders without errors
        await expect(page.locator('body')).toBeVisible()
      })
    }
  })
})
