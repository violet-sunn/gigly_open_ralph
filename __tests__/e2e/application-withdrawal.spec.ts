import { test, expect } from '@playwright/test'

test.describe('Application Withdrawal', () => {
  test('specialist can withdraw PENDING application and see it in Archive', async ({ page }) => {
    // Register as CLIENT and create a gig
    await page.goto('/register')
    await page.fill('input[name="email"]', `client-${Date.now()}@test.com`)
    await page.fill('input[name="password"]', 'TestPass123')
    await page.click('[data-testid="role-client"]')
    await page.waitForTimeout(200) // Allow React state to flush
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard')

    // Create a gig
    await page.goto('/gigs/new')
    await page.fill('input[name="title"]', 'Test Gig for Withdrawal')
    await page.fill('textarea[name="description"]', 'Test description for withdrawal flow')
    await page.fill('textarea[name="acceptanceCriteria"]', 'Test acceptance criteria that is long enough to pass validation requirements')
    await page.fill('input[name="budget"]', '100000')
    await page.fill('input[name="tags"]', 'React')
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard')

    // Get the gig ID from the page
    const gigLink = page.locator('a[href^="/gigs/"]').first()
    const gigHref = await gigLink.getAttribute('href')
    const gigId = gigHref?.split('/').pop()

    // Logout
    await page.goto('/logout')
    await page.waitForURL('/login')

    // Register as SPECIALIST
    await page.goto('/register')
    const specialistEmail = `specialist-${Date.now()}@test.com`
    await page.fill('input[name="email"]', specialistEmail)
    await page.fill('input[name="password"]', 'TestPass123')
    await page.click('[data-testid="role-specialist"]')
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard')

    // Navigate to the gig and apply
    await page.goto(`/gigs/${gigId}`)
    await page.fill('textarea[name="approach"]', 'This is my technical approach that is long enough to pass validation requirements for the approach field in the application form')
    await page.fill('textarea[name="questions"]', 'These are my clarifying questions that are long enough to pass validation')
    await page.click('button:has-text("Apply to Gig")')

    // Wait for redirect back to gig detail
    await page.waitForURL(`/gigs/${gigId}`)

    // Verify "Withdraw Application" button appears
    await expect(page.locator('button:has-text("Withdraw Application")')).toBeVisible()

    // Click withdraw button
    await page.click('button:has-text("Withdraw Application")')

    // Wait for redirect
    await page.waitForURL(`/gigs/${gigId}`)

    // Verify WITHDRAWN status badge appears
    await expect(page.locator('text=WITHDRAWN')).toBeVisible()
    await expect(page.locator('text=Withdrawn on')).toBeVisible()

    // Verify withdraw button no longer appears
    await expect(page.locator('button:has-text("Withdraw Application")')).not.toBeVisible()

    // Navigate to dashboard and check Archive tab
    await page.goto('/dashboard')
    await page.click('button:has-text("Archive")')

    // Verify WITHDRAWN application appears in Archive
    await expect(page.locator('text=Test Gig for Withdrawal')).toBeVisible()
    await expect(page.locator('text=WITHDRAWN')).toBeVisible()
    await expect(page.locator('text=Withdrawn on')).toBeVisible()
  })

  test('client sees WITHDRAWN status in applications list', async ({ page }) => {
    // Register as CLIENT and create a gig
    await page.goto('/register')
    const clientEmail = `client-${Date.now()}@test.com`
    await page.fill('input[name="email"]', clientEmail)
    await page.fill('input[name="password"]', 'TestPass123')
    await page.click('[data-testid="role-client"]')
    await page.click('button[type="submit"]')

    await page.waitForURL('/dashboard')

    // Create a gig
    await page.goto('/gigs/new')
    await page.fill('input[name="title"]', 'Test Gig for Client View')
    await page.fill('textarea[name="description"]', 'Test description')
    await page.fill('textarea[name="acceptanceCriteria"]', 'Test acceptance criteria that is long enough to pass validation')
    await page.fill('input[name="budget"]', '100000')
    await page.fill('input[name="tags"]', 'React')
    await page.click('button[type="submit"]')

    await page.waitForURL('/dashboard')

    const gigLink = page.locator('a[href^="/gigs/"]').first()
    const gigHref = await gigLink.getAttribute('href')
    const gigId = gigHref?.split('/').pop()

    // Logout
    await page.goto('/logout')
    await page.waitForURL('/login')

    // Register as SPECIALIST and apply
    await page.goto('/register')
    const specialistEmail = `specialist-${Date.now()}@test.com`
    await page.fill('input[name="email"]', specialistEmail)
    await page.fill('input[name="password"]', 'TestPass123')
    await page.click('[data-testid="role-specialist"]')
    await page.click('button[type="submit"]')

    await page.waitForURL('/dashboard')

    // Apply to gig
    await page.goto(`/gigs/${gigId}`)
    await page.fill('textarea[name="approach"]', 'Technical approach that is long enough to pass validation requirements for the approach field')
    await page.fill('textarea[name="questions"]', 'Clarifying questions that are long enough to pass validation')
    await page.click('button:has-text("Apply to Gig")')

    await page.waitForURL(`/gigs/${gigId}`)

    // Withdraw application
    await page.click('button:has-text("Withdraw Application")')
    await page.waitForURL(`/gigs/${gigId}`)

    // Logout
    await page.goto('/logout')
    await page.waitForURL('/login')

    // Login as CLIENT
    await page.fill('input[name="email"]', clientEmail)
    await page.fill('input[name="password"]', 'TestPass123')
    await page.click('button[type="submit"]')

    await page.waitForURL('/dashboard')

    // View gig detail
    await page.goto(`/gigs/${gigId}`)

    // Verify WITHDRAWN status visible in applications list
    await expect(page.locator('text=WITHDRAWN')).toBeVisible()
    await expect(page.locator('text=Withdrawn on')).toBeVisible()

    // Verify no Accept/Reject buttons for WITHDRAWN application
    const applicationSection = page.locator('li', { has: page.locator('text=WITHDRAWN') })
    await expect(applicationSection.locator('button:has-text("Accept")')).not.toBeVisible()
    await expect(applicationSection.locator('button:has-text("Reject")')).not.toBeVisible()
  })

  test('withdraw button only visible for PENDING applications', async ({ page }) => {
    // Register as CLIENT and create a gig
    await page.goto('/register')
    await page.fill('input[name="email"]', `client-${Date.now()}@test.com`)
    await page.fill('input[name="password"]', 'TestPass123')
    await page.click('[data-testid="role-client"]')
    await page.waitForTimeout(200) // Allow React state to flush
    await page.click('button[type="submit"]')

    await page.waitForURL('/dashboard')

    await page.goto('/gigs/new')
    await page.fill('input[name="title"]', 'Test Gig for Button Visibility')
    await page.fill('textarea[name="description"]', 'Test description')
    await page.fill('textarea[name="acceptanceCriteria"]', 'Test acceptance criteria that is long enough to pass validation')
    await page.fill('input[name="budget"]', '100000')
    await page.fill('input[name="tags"]', 'React')
    await page.click('button[type="submit"]')

    await page.waitForURL('/dashboard')

    const gigLink = page.locator('a[href^="/gigs/"]').first()
    const gigHref = await gigLink.getAttribute('href')
    const gigId = gigHref?.split('/').pop()

    // Logout
    await page.goto('/logout')
    await page.waitForURL('/login')

    // Register as SPECIALIST
    await page.goto('/register')
    await page.fill('input[name="email"]', `specialist-${Date.now()}@test.com`)
    await page.fill('input[name="password"]', 'TestPass123')
    await page.click('input[type="radio"][name="role"][value="SPECIALIST"]')
    await page.click('button[type="submit"]')

    await page.waitForURL('/dashboard')

    // Apply to gig
    await page.goto(`/gigs/${gigId}`)
    await page.fill('textarea[name="approach"]', 'Technical approach that is long enough to pass validation requirements')
    await page.fill('textarea[name="questions"]', 'Clarifying questions that are long enough to pass validation')
    await page.click('button:has-text("Apply to Gig")')

    await page.waitForURL(`/gigs/${gigId}`)

    // Verify button appears for PENDING application
    await expect(page.locator('button:has-text("Withdraw Application")')).toBeVisible()

    // Withdraw application
    await page.click('button:has-text("Withdraw Application")')
    await page.waitForURL(`/gigs/${gigId}`)

    // Verify button no longer appears after withdrawal
    await expect(page.locator('button:has-text("Withdraw Application")')).not.toBeVisible()

    // Verify WITHDRAWN badge appears instead
    await expect(page.locator('text=WITHDRAWN')).toBeVisible()
  })
})
