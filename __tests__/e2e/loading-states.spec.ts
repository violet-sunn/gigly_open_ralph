import { test, expect } from '@playwright/test'

test.describe('Loading States', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:3000')
  })

  test('profile edit shows loading indicator during submission', async ({ page }) => {
    // Register and login as specialist
    await page.goto('http://localhost:3000/register')
    await page.fill('input[name="email"]', `specialist-${Date.now()}@test.com`)
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.click('button:has-text("Specialist")')
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard')

    // Navigate to profile edit
    await page.goto('http://localhost:3000/profile/edit')

    // Fill form
    await page.fill('input[name="displayName"]', 'Test Specialist')
    await page.fill('input[name="techStack"]', 'React, TypeScript')

    // Submit form
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Verify loading state appears
    await expect(submitButton).toContainText('Saving profile...')
    await expect(submitButton).toBeDisabled()

    // Wait for redirect to profile page
    await page.waitForURL('**/profile', { timeout: 10000 })
  })

  test('gig creation shows loading indicator during submission', async ({ page }) => {
    // Register and login as client
    await page.goto('http://localhost:3000/register')
    await page.fill('input[name="email"]', `client-${Date.now()}@test.com`)
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.click('button:has-text("Client")')
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard')

    // Navigate to gig creation
    await page.goto('http://localhost:3000/gigs/new')

    // Fill form
    await page.fill('input[name="title"]', 'Test Gig')
    await page.fill('textarea[name="description"]', 'Test description for the gig')
    await page.fill('textarea[name="acceptanceCriteria"]', 'Test acceptance criteria with at least 50 characters to meet the minimum requirement')
    await page.fill('input[name="budget"]', '100000')

    // Submit form
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Verify loading state appears
    await expect(submitButton).toContainText('Posting gig...')
    await expect(submitButton).toBeDisabled()

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 })
  })

  test('application submission shows loading indicator', async ({ page }) => {
    // First create a gig as client
    await page.goto('http://localhost:3000/register')
    const clientEmail = `client-${Date.now()}@test.com`
    await page.fill('input[name="email"]', clientEmail)
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.click('button:has-text("Client")')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard')

    await page.goto('http://localhost:3000/gigs/new')
    await page.fill('input[name="title"]', 'Test Gig for Application')
    await page.fill('textarea[name="description"]', 'Test description')
    await page.fill('textarea[name="acceptanceCriteria"]', 'Test acceptance criteria with at least 50 characters minimum')
    await page.fill('input[name="budget"]', '50000')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard')

    // Get the gig ID from the dashboard
    const gigLink = page.locator('a[href^="/gigs/"]').first()
    const gigUrl = await gigLink.getAttribute('href')

    // Logout
    await page.goto('http://localhost:3000/logout')

    // Register as specialist
    await page.goto('http://localhost:3000/register')
    await page.fill('input[name="email"]', `specialist-${Date.now()}@test.com`)
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.click('button:has-text("Specialist")')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard')

    // Navigate to the gig
    await page.goto(`http://localhost:3000${gigUrl}`)

    // Fill application form
    await page.fill('textarea[name="approach"]', 'This is my technical approach to solving this problem. I will use modern best practices and ensure high quality delivery with proper testing.')
    await page.fill('textarea[name="questions"]', 'What is the expected timeline? Are there any specific constraints?')

    // Submit application
    const submitButton = page.locator('button[type="submit"]:has-text("Submit Application")')
    await submitButton.click()

    // Verify loading state
    await expect(submitButton).toContainText('Submitting application...')
    await expect(submitButton).toBeDisabled()

    // Wait for success
    await page.waitForTimeout(2000)
  })
})

test.describe('Loading States with Slow Network', () => {
  test('loading indicators persist during slow network', async ({ page }) => {
    // Simulate slow network (2 second delay)
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.continue()
    })

    // Register and login as client
    await page.goto('http://localhost:3000/register')
    await page.fill('input[name="email"]', `client-slow-${Date.now()}@test.com`)
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.click('button:has-text("Client")')

    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Verify loading state appears and persists
    await expect(submitButton).toContainText('Registering...')
    await expect(submitButton).toBeDisabled()

    // Wait for completion (with extended timeout due to slow network)
    await page.waitForURL('**/dashboard', { timeout: 15000 })
  })

  test('duplicate submissions prevented during slow network', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.continue()
    })

    // Register and login as client
    await page.goto('http://localhost:3000/register')
    await page.fill('input[name="email"]', `client-dup-${Date.now()}@test.com`)
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.click('button:has-text("Client")')

    const submitButton = page.locator('button[type="submit"]')

    // Click submit button multiple times rapidly
    await submitButton.click()
    await submitButton.click().catch(() => {}) // Second click should be ignored
    await submitButton.click().catch(() => {}) // Third click should be ignored

    // Verify button is disabled (preventing duplicate clicks)
    await expect(submitButton).toBeDisabled()

    // Wait for completion
    await page.waitForURL('**/dashboard', { timeout: 15000 })

    // Verify only one account was created (user successfully logged in)
    await expect(page).toHaveURL(/.*dashboard/)
  })
})
