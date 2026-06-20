import { test, expect } from '@playwright/test'

test.describe('Basic Navigation', () => {
  test('can navigate to homepage', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/')

    // Verify page loads
    expect(page.url()).toContain('localhost:3000')

    // Verify page has content
    const body = await page.locator('body')
    await expect(body).toBeVisible()
  })

  test('can navigate to registration page (composed wizard)', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register')

    // Verify we're on the registration page
    expect(page.url()).toContain('/register')

    // The composed 3-step wizard: step 1 shows the heading + role cards (email/password are on step 2)
    await expect(page.getByRole('heading', { name: 'Создайте свой аккаунт' })).toBeVisible()
    await expect(page.getByTestId('role-client')).toBeVisible()
    await expect(page.getByTestId('role-specialist')).toBeVisible()
  })

  test('can navigate to login page', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Verify we're on the login page
    expect(page.url()).toContain('/login')

    // Verify form elements exist
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })
})
