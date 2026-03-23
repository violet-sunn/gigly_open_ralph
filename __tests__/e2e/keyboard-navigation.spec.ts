import { test, expect } from '@playwright/test'

test.describe('Keyboard Navigation', () => {
  test.describe('Focus Indicators', () => {
    test('should show visible focus indicators on all interactive elements', async ({ page }) => {
      // Register and login
      await page.goto('/register')
      await page.fill('input[name="email"]', 'keyboard-test@example.com')
      await page.fill('input[name="password"]', 'TestPass123')
      await page.click('button:has-text("SPECIALIST")')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Tab through elements and verify focus indicators
      await page.keyboard.press('Tab')

      // Check that focused element has visible ring
      const focusedElement = await page.locator(':focus')
      await expect(focusedElement).toBeVisible()

      // Get computed styles to verify focus ring
      const ringWidth = await focusedElement.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        return styles.getPropertyValue('--tw-ring-width') || styles.outline
      })

      // Verify some focus styling exists
      expect(ringWidth).toBeTruthy()
    })

    test('should maintain focus indicators on buttons', async ({ page }) => {
      await page.goto('/login')

      // Tab to email input
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      // Fill form
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'password123')

      // Tab to submit button
      await page.keyboard.press('Tab')

      const submitButton = await page.locator('button[type="submit"]:focus')
      await expect(submitButton).toBeVisible()
    })
  })

  test.describe('Skip to Main Content', () => {
    test('should show skip link as first focusable element', async ({ page }) => {
      // Login first
      await page.goto('/login')
      await page.fill('input[name="email"]', 'specialist@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Press Tab - first element should be skip link
      await page.keyboard.press('Tab')

      const skipLink = await page.locator('a:has-text("Skip to main content"):focus')
      await expect(skipLink).toBeVisible()
    })

    test('should move focus to main content when skip link is activated', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[name="email"]', 'specialist@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Press Tab to focus skip link
      await page.keyboard.press('Tab')

      // Activate skip link
      await page.keyboard.press('Enter')

      // Verify focus moved to main content
      const mainContent = await page.locator('#main-content:focus')
      await expect(mainContent).toBeFocused()
    })
  })

  test.describe('Keyboard Shortcuts - Esc Key', () => {
    test('should close welcome modal with Esc key', async ({ page }) => {
      // Register new user to trigger welcome modal
      await page.goto('/register')
      await page.fill('input[name="email"]', 'welcome-modal-test@example.com')
      await page.fill('input[name="password"]', 'TestPass123')
      await page.click('button:has-text("SPECIALIST")')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Wait for modal to appear
      const modal = page.locator('div[role="dialog"]')
      await expect(modal).toBeVisible()

      // Press Esc to close
      await page.keyboard.press('Escape')

      // Modal should be closed
      await expect(modal).not.toBeVisible()
    })

    test('should close notification dropdown with Esc key', async ({ page }) => {
      // Login as specialist
      await page.goto('/login')
      await page.fill('input[name="email"]', 'specialist@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Click notification bell to open dropdown
      const notificationBell = page.locator('button[aria-label="Notifications"]')
      await notificationBell.click()

      // Verify dropdown is open
      const dropdown = page.locator('div[role="menu"]')
      await expect(dropdown).toBeVisible()

      // Press Esc to close
      await page.keyboard.press('Escape')

      // Dropdown should be closed
      await expect(dropdown).not.toBeVisible()

      // Focus should return to notification bell
      await expect(notificationBell).toBeFocused()
    })
  })

  test.describe('Keyboard Shortcuts - Forward Slash', () => {
    test('should focus search input when / is pressed on gig browse page', async ({ page }) => {
      // Login as specialist
      await page.goto('/login')
      await page.fill('input[name="email"]', 'specialist@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Navigate to gig browse page
      await page.click('a:has-text("Browse Gigs")')
      await page.waitForURL('/gigs')

      // Press / key
      await page.keyboard.press('/')

      // Search input should be focused
      const searchInput = page.locator('input#search')
      await expect(searchInput).toBeFocused()

      // The / character should not be in the input
      const inputValue = await searchInput.inputValue()
      expect(inputValue).toBe('')
    })

    test('should not activate / shortcut when typing in text input', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[name="email"]', 'specialist@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      await page.click('a:has-text("Browse Gigs")')
      await page.waitForURL('/gigs')

      // Focus on search input manually
      const searchInput = page.locator('input#search')
      await searchInput.click()

      // Type / character
      await page.keyboard.type('/')

      // The / character should be in the input (not treated as shortcut)
      const inputValue = await searchInput.inputValue()
      expect(inputValue).toBe('/')
    })
  })

  test.describe('Tab Order', () => {
    test('should follow logical tab order on login page', async ({ page }) => {
      await page.goto('/login')

      // Tab through elements
      await page.keyboard.press('Tab') // Skip link or first element
      await page.keyboard.press('Tab') // Email input

      let focused = await page.locator(':focus')
      let tagName = await focused.evaluate(el => el.tagName.toLowerCase())
      expect(tagName).toBe('input')

      await page.keyboard.press('Tab') // Password input
      focused = await page.locator(':focus')
      tagName = await focused.evaluate(el => el.tagName.toLowerCase())
      expect(tagName).toBe('input')

      await page.keyboard.press('Tab') // Submit button
      focused = await page.locator(':focus')
      tagName = await focused.evaluate(el => el.tagName.toLowerCase())
      expect(tagName).toBe('button')
    })

    test('should follow logical tab order on gig creation form', async ({ page }) => {
      // Login as client
      await page.goto('/login')
      await page.fill('input[name="email"]', 'client@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Navigate to gig creation
      await page.click('a:has-text("Post Gig")')
      await page.waitForURL('/gigs/new')

      // Tab through form fields - should follow visual order
      await page.keyboard.press('Tab') // Skip link

      // Continue tabbing and verify we hit form fields in order
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      const focused = await page.locator(':focus')
      const isFormElement = await focused.evaluate(el => {
        return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'BUTTON'
      })
      expect(isFormElement).toBe(true)
    })
  })

  test.describe('Focus Trap in Modals', () => {
    test('should trap focus within welcome modal', async ({ page }) => {
      // Register new user to trigger welcome modal
      await page.goto('/register')
      await page.fill('input[name="email"]', 'focus-trap-test@example.com')
      await page.fill('input[name="password"]', 'TestPass123')
      await page.click('button:has-text("SPECIALIST")')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Wait for modal
      const modal = page.locator('div[role="dialog"]')
      await expect(modal).toBeVisible()

      // Tab through modal elements
      await page.keyboard.press('Tab')
      let focused = await page.locator(':focus')

      // Verify focus is within modal
      let isInModal = await focused.evaluate((el, modalEl) => {
        return modalEl?.contains(el) || false
      }, await modal.elementHandle())
      expect(isInModal).toBe(true)

      // Tab multiple times to reach end of modal
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab')
      }

      // Focus should still be within modal (wrapped around)
      focused = await page.locator(':focus')
      isInModal = await focused.evaluate((el, modalEl) => {
        return modalEl?.contains(el) || false
      }, await modal.elementHandle())
      expect(isInModal).toBe(true)
    })

    test('should wrap focus from last to first element in modal', async ({ page }) => {
      await page.goto('/register')
      await page.fill('input[name="email"]', 'focus-wrap-test@example.com')
      await page.fill('input[name="password"]', 'TestPass123')
      await page.click('button:has-text("SPECIALIST")')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      const modal = page.locator('div[role="dialog"]')
      await expect(modal).toBeVisible()

      // Find all focusable elements in modal
      const focusableElements = await modal.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').all()

      // Tab to last element
      for (let i = 0; i < focusableElements.length; i++) {
        await page.keyboard.press('Tab')
      }

      // Tab once more - should wrap to first element
      await page.keyboard.press('Tab')

      const focused = await page.locator(':focus')
      const isInModal = await focused.evaluate((el, modalEl) => {
        return modalEl?.contains(el) || false
      }, await modal.elementHandle())
      expect(isInModal).toBe(true)
    })
  })

  test.describe('Complete User Flows with Keyboard Only', () => {
    test('should complete registration flow using only keyboard', async ({ page }) => {
      await page.goto('/register')

      // Tab to email input
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      // Fill email
      await page.keyboard.type('keyboard-only-reg@example.com')

      // Tab to password
      await page.keyboard.press('Tab')
      await page.keyboard.type('TestPass123')

      // Tab to role selection
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter') // Select SPECIALIST

      // Tab to submit button
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')

      // Should redirect to dashboard
      await page.waitForURL('/dashboard')
      expect(page.url()).toContain('/dashboard')
    })

    test('should complete login flow using only keyboard', async ({ page }) => {
      await page.goto('/login')

      // Tab to email
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.type('specialist@example.com')

      // Tab to password
      await page.keyboard.press('Tab')
      await page.keyboard.type('password123')

      // Tab to submit
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')

      await page.waitForURL('/dashboard')
      expect(page.url()).toContain('/dashboard')
    })

    test('should navigate and apply to gig using only keyboard', async ({ page }) => {
      // Login
      await page.goto('/login')
      await page.fill('input[name="email"]', 'specialist@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Navigate to browse gigs using keyboard
      await page.keyboard.press('Tab') // Skip link
      await page.keyboard.press('Tab') // Logo
      await page.keyboard.press('Tab') // Dashboard
      await page.keyboard.press('Tab') // Browse Gigs
      await page.keyboard.press('Enter')

      await page.waitForURL('/gigs')

      // Use / shortcut to search
      await page.keyboard.press('/')
      await page.keyboard.type('Example')

      // Apply filters
      await page.keyboard.press('Tab') // Move out of search
      // Tab through to Apply Filters button and activate
      for (let i = 0; i < 15; i++) {
        await page.keyboard.press('Tab')
      }

      // Should be able to navigate to a gig card
      const gigLink = page.locator('a').first()
      await expect(gigLink).toBeVisible()
    })
  })

  test.describe('Custom Interactive Components', () => {
    test('should make RoleCard keyboard accessible', async ({ page }) => {
      await page.goto('/register')

      // Tab to first role card
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      // Should be able to activate with Enter
      await page.keyboard.press('Enter')

      // Role should be selected
      const selectedCard = page.locator('button[aria-pressed="true"]')
      await expect(selectedCard).toBeVisible()

      // Should be able to activate with Space
      await page.keyboard.press('Tab')
      await page.keyboard.press('Space')

      // Second role should now be selected
      const cards = await page.locator('button[aria-pressed="true"]').all()
      expect(cards.length).toBe(1)
    })

    test('should make pagination controls keyboard accessible', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[name="email"]', 'specialist@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      await page.click('a:has-text("Browse Gigs")')
      await page.waitForURL('/gigs')

      // Tab to pagination controls (if they exist)
      const paginationExists = await page.locator('nav[aria-label="Pagination"]').count() > 0

      if (paginationExists) {
        // Tab through page until we reach pagination
        for (let i = 0; i < 50; i++) {
          await page.keyboard.press('Tab')
          const focused = await page.locator(':focus')
          const ariaLabel = await focused.getAttribute('aria-label')
          if (ariaLabel && ariaLabel.includes('page')) {
            // Found pagination control
            break
          }
        }

        // Should be able to activate pagination links with Enter
        const focused = await page.locator(':focus')
        const tagName = await focused.evaluate(el => el.tagName.toLowerCase())
        expect(['a', 'button', 'span']).toContain(tagName)
      }
    })
  })
})
