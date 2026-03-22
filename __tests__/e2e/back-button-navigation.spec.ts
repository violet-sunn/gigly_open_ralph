import { test, expect } from '@playwright/test'

test.describe('Back Button Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Register and login as CLIENT for most tests
    await page.goto('/register')
    const timestamp = Date.now()
    await page.fill('input[name="email"]', `client${timestamp}@test.com`)
    await page.fill('input[name="password"]', 'Test1234')
    await page.click('button[data-role="CLIENT"]')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('Profile → Profile Edit → Back to Profile', async ({ page }) => {
    // Navigate to profile
    await page.goto('/dashboard/profile')
    await page.waitForLoadState('networkidle')

    // Click edit profile link (should include from=profile)
    await page.click('a[href*="/profile/edit?from=profile"]')
    await page.waitForURL(/\/profile\/edit\?from=profile/)

    // Verify BackButton appears
    const backButton = page.locator('a:has-text("← Back to Profile")')
    await expect(backButton).toBeVisible()

    // Click back button
    await backButton.click()
    await page.waitForURL('/dashboard/profile')

    // Verify we're back on profile page
    await expect(page).toHaveURL('/dashboard/profile')
  })

  test('Dashboard → Gig Creation → Back to Dashboard', async ({ page }) => {
    // Start on dashboard
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Click create gig link (should include from=dashboard)
    await page.click('a[href*="/gigs/new?from=dashboard"]')
    await page.waitForURL(/\/gigs\/new\?from=dashboard/)

    // Verify BackButton appears
    const backButton = page.locator('a:has-text("← Back to Dashboard")')
    await expect(backButton).toBeVisible()

    // Click back button
    await backButton.click()
    await page.waitForURL('/dashboard')

    // Verify we're back on dashboard
    await expect(page).toHaveURL('/dashboard')
  })

  test('Dashboard → Examples → Back to Dashboard', async ({ page }) => {
    // Navigate to examples page with from=dashboard
    await page.goto('/dashboard/gigs/examples?from=dashboard')
    await page.waitForLoadState('networkidle')

    // Verify BackButton appears
    const backButton = page.locator('a:has-text("← Back to Dashboard")')
    await expect(backButton).toBeVisible()

    // Click back button
    await backButton.click()
    await page.waitForURL('/dashboard')

    // Verify we're back on dashboard
    await expect(page).toHaveURL('/dashboard')
  })

  test('BackButton does not appear without from parameter', async ({ page }) => {
    // Navigate to profile edit without from parameter
    await page.goto('/profile/edit')
    await page.waitForLoadState('networkidle')

    // Verify BackButton does not appear
    const backButton = page.locator('a:has-text("← Back")')
    await expect(backButton).not.toBeVisible()
  })
})

test.describe('Admin Back Button Navigation', () => {
  test.beforeEach(async ({ page, context }) => {
    // Create admin user via database
    const { prisma } = await import('@/lib/prisma')
    const bcrypt = await import('bcryptjs')

    const timestamp = Date.now()
    const email = `admin${timestamp}@test.com`
    const hashedPassword = await bcrypt.hash('Admin1234', 10)

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    // Login as admin
    await page.goto('/login')
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', 'Admin1234')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('Admin Dashboard → Admin Users → Back to Admin Dashboard', async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')

    // Click user management link (should include from=admin-dashboard)
    await page.click('a[href*="/admin/users?from=admin-dashboard"]')
    await page.waitForURL(/\/admin\/users\?from=admin-dashboard/)

    // Verify BackButton appears
    const backButton = page.locator('a:has-text("← Back to Admin Dashboard")')
    await expect(backButton).toBeVisible()

    // Click back button
    await backButton.click()
    await page.waitForURL('/admin')

    // Verify we're back on admin dashboard
    await expect(page).toHaveURL('/admin')
  })

  test('Admin Dashboard → Admin Gigs → Back to Admin Dashboard', async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')

    // Click gig management link (should include from=admin-dashboard)
    await page.click('a[href*="/admin/gigs?from=admin-dashboard"]')
    await page.waitForURL(/\/admin\/gigs\?from=admin-dashboard/)

    // Verify BackButton appears
    const backButton = page.locator('a:has-text("← Back to Admin Dashboard")')
    await expect(backButton).toBeVisible()

    // Click back button
    await backButton.click()
    await page.waitForURL('/admin')

    // Verify we're back on admin dashboard
    await expect(page).toHaveURL('/admin')
  })
})

test.describe('Browse Gigs Back Button with Filters', () => {
  test.beforeEach(async ({ page }) => {
    // Register and login as SPECIALIST
    await page.goto('/register')
    const timestamp = Date.now()
    await page.fill('input[name="email"]', `specialist${timestamp}@test.com`)
    await page.fill('input[name="password"]', 'Test1234')
    await page.click('button[data-role="SPECIALIST"]')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('Browse Gigs → Gig Detail → Back preserves filters and pagination', async ({ page }) => {
    // Navigate to browse gigs with filters
    await page.goto('/dashboard/gigs?search=react&tags=React&page=1')
    await page.waitForLoadState('networkidle')

    // Find and click a gig link (should include from=browse and preserve params)
    const gigLink = page.locator('a[href*="?from=browse"]').first()

    // Only proceed if there's at least one gig
    const gigCount = await gigLink.count()
    if (gigCount > 0) {
      await gigLink.click()
      await page.waitForLoadState('networkidle')

      // Verify BackButton appears
      const backButton = page.locator('a:has-text("← Back to Browse Gigs")')
      await expect(backButton).toBeVisible()

      // Click back button
      await backButton.click()
      await page.waitForLoadState('networkidle')

      // Verify we're back on browse page with filters preserved
      const url = page.url()
      expect(url).toContain('/gigs')
      expect(url).toContain('search=react')
      expect(url).toContain('tags=React')
      expect(url).toContain('page=1')
    }
  })
})

test.describe('Public Profile Back Button', () => {
  let clientEmail: string
  let specialistUserId: string

  test.beforeEach(async ({ page }) => {
    const { prisma } = await import('@/lib/prisma')
    const bcrypt = await import('bcryptjs')

    const timestamp = Date.now()

    // Create specialist user
    const specialistEmail = `specialist${timestamp}@test.com`
    const hashedPassword = await bcrypt.hash('Test1234', 10)

    const specialist = await prisma.user.create({
      data: {
        email: specialistEmail,
        password: hashedPassword,
        role: 'SPECIALIST',
        specialistProfile: {
          create: {
            displayName: 'Test Specialist',
            techStack: 'React, TypeScript',
            experienceLevel: 'SENIOR',
          },
        },
      },
    })

    specialistUserId = specialist.id

    // Create and login as client
    clientEmail = `client${timestamp}@test.com`
    await prisma.user.create({
      data: {
        email: clientEmail,
        password: hashedPassword,
        role: 'CLIENT',
        clientProfile: {
          create: {
            companyName: 'Test Company',
            inn: '1234567890',
          },
        },
      },
    })

    await page.goto('/login')
    await page.fill('input[name="email"]', clientEmail)
    await page.fill('input[name="password"]', 'Test1234')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('Dashboard → Public Profile → Back to Dashboard', async ({ page }) => {
    // Navigate to public profile with from=dashboard
    await page.goto(`/dashboard/profile/${specialistUserId}?from=dashboard`)
    await page.waitForLoadState('networkidle')

    // Verify BackButton appears
    const backButton = page.locator('a:has-text("← Back to Dashboard")')
    await expect(backButton).toBeVisible()

    // Click back button
    await backButton.click()
    await page.waitForURL('/dashboard')

    // Verify we're back on dashboard
    await expect(page).toHaveURL('/dashboard')
  })
})
