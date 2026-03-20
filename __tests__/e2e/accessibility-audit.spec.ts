import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Audit - Critical Pages', () => {
  test('Homepage meets WCAG AA standards', async ({ page }) => {
    await page.goto('/')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('Login page meets WCAG AA standards', async ({ page }) => {
    await page.goto('/login')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('Registration page meets WCAG AA standards', async ({ page }) => {
    await page.goto('/register')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('Dashboard page meets WCAG AA standards (authenticated)', async ({ page }) => {
    // Register and login as CLIENT
    await page.goto('/register')
    await page.fill('input[name="email"]', 'accessibility-test@example.com')
    await page.fill('input[name="password"]', 'TestPass123')
    await page.click('input[name="role"][value="CLIENT"]')
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('Gig browse page meets WCAG AA standards (authenticated)', async ({ page }) => {
    // Register and login as SPECIALIST
    await page.goto('/register')
    await page.fill('input[name="email"]', 'specialist-a11y@example.com')
    await page.fill('input[name="password"]', 'TestPass123')
    await page.click('input[name="role"][value="SPECIALIST"]')
    await page.click('button[type="submit"]')

    // Navigate to gig browse
    await page.goto('/gigs')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
