import { test, expect } from '@playwright/test';

test.describe('Register Page Redesign', () => {
  test('displays Russian heading "Регистрация"', async ({ page }) => {
    await page.goto('/register');

    const heading = page.locator('h2');
    await expect(heading).toHaveText('Регистрация');
    await expect(heading).toHaveCSS('font-size', '22px');
    await expect(heading).toHaveCSS('font-weight', '600'); // semibold
    await expect(heading).toHaveCSS('color', 'rgb(255, 255, 255)'); // white
  });

  test('input fields have correct Figma styling', async ({ page }) => {
    await page.goto('/register');

    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');

    // Check background color (#10121c)
    await expect(emailInput).toHaveCSS('background-color', 'rgb(16, 18, 28)');
    await expect(passwordInput).toHaveCSS('background-color', 'rgb(16, 18, 28)');

    // Check border color (#242935)
    await expect(emailInput).toHaveCSS('border-color', 'rgb(36, 41, 53)');
    await expect(passwordInput).toHaveCSS('border-color', 'rgb(36, 41, 53)');

    // Check border-radius (20px)
    await expect(emailInput).toHaveCSS('border-radius', '20px');
    await expect(passwordInput).toHaveCSS('border-radius', '20px');

    // Check padding (20px)
    await expect(emailInput).toHaveCSS('padding', '20px');
    await expect(passwordInput).toHaveCSS('padding', '20px');
  });

  test('submit button displays Russian text "Зарегестрироватся"', async ({ page }) => {
    await page.goto('/register');

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toHaveText('Зарегестрироватся');

    // Check button height (50px)
    await expect(submitButton).toHaveCSS('height', '50px');

    // Check button background (#0088FF)
    await expect(submitButton).toHaveCSS('background-color', 'rgb(0, 136, 255)');
  });

  test('secondary link displays Russian text "Войти"', async ({ page }) => {
    await page.goto('/register');

    const secondaryButton = page.locator('button:has-text("Войти")');
    await expect(secondaryButton).toBeVisible();
    await expect(secondaryButton).toHaveText('Войти');

    // Check button height (50px)
    await expect(secondaryButton).toHaveCSS('height', '50px');

    // Check button background (rgba(0,136,255,0.24))
    await expect(secondaryButton).toHaveCSS('background-color', 'rgba(0, 136, 255, 0.24)');
  });

  test('decorative pattern is visible at bottom', async ({ page }) => {
    await page.goto('/register');

    // Check SVG container is visible and has correct height (327px)
    const svgContainer = page.locator('svg').first();
    await expect(svgContainer).toBeVisible();
    await expect(svgContainer).toHaveAttribute('height', '327');

    // Check pattern definition exists
    const pattern = page.locator('pattern#checkerboard');
    await expect(pattern).toHaveCount(1);

    // Check pattern uses correct color (#0088ff at 0.3 opacity)
    const patternRect = page.locator('pattern#checkerboard rect').first();
    await expect(patternRect).toHaveAttribute('fill', '#0088ff');
    await expect(patternRect).toHaveAttribute('opacity', '0.3');

    // Check rect that uses the pattern
    const backgroundRect = page.locator('svg rect[fill="url(#checkerboard)"]');
    await expect(backgroundRect).toHaveCount(1);
  });

  test('responsive design on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/register');

    // Container should be 418px wide on desktop
    const container = page.locator('div.bg-\\[\\#060813\\]').first();
    const boundingBox = await container.boundingBox();

    expect(boundingBox?.width).toBeCloseTo(418, 5);
  });

  test('responsive design on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/register');

    // Container should be 90vw wide on mobile (90% of 375px = 337.5px)
    const container = page.locator('div.bg-\\[\\#060813\\]').first();
    const boundingBox = await container.boundingBox();

    expect(boundingBox?.width).toBeCloseTo(337.5, 10);
  });

  test('role pre-selection with SPECIALIST query parameter', async ({ page }) => {
    await page.goto('/register?role=SPECIALIST');

    // SPECIALIST card should have blue border (#0265dc)
    const specialistCard = page.locator('[data-testid="role-specialist"]');
    await expect(specialistCard).toHaveCSS('border-color', 'rgb(2, 101, 220)');
    await expect(specialistCard).toHaveCSS('border-width', '2px');

    // CLIENT card should have transparent border
    const clientCard = page.locator('[data-testid="role-client"]');
    await expect(clientCard).toHaveCSS('border-color', 'rgba(0, 0, 0, 0)');
  });

  test('role pre-selection with CLIENT query parameter', async ({ page }) => {
    await page.goto('/register?role=CLIENT');

    // CLIENT card should have blue border (#0265dc)
    const clientCard = page.locator('[data-testid="role-client"]');
    await expect(clientCard).toHaveCSS('border-color', 'rgb(2, 101, 220)');
    await expect(clientCard).toHaveCSS('border-width', '2px');

    // SPECIALIST card should have transparent border
    const specialistCard = page.locator('[data-testid="role-specialist"]');
    await expect(specialistCard).toHaveCSS('border-color', 'rgba(0, 0, 0, 0)');
  });

  test('both role cards visible without query parameter', async ({ page }) => {
    await page.goto('/register');

    // Both cards should be visible
    const clientCard = page.locator('[data-testid="role-client"]');
    const specialistCard = page.locator('[data-testid="role-specialist"]');

    await expect(clientCard).toBeVisible();
    await expect(specialistCard).toBeVisible();

    // Both should have transparent borders (unselected)
    await expect(clientCard).toHaveCSS('border-color', 'rgba(0, 0, 0, 0)');
    await expect(specialistCard).toHaveCSS('border-color', 'rgba(0, 0, 0, 0)');
  });

  test('role cards display Russian text', async ({ page }) => {
    await page.goto('/register');

    const clientCard = page.locator('[data-testid="role-client"]');
    const specialistCard = page.locator('[data-testid="role-specialist"]');

    await expect(clientCard).toContainText('Профиль Компании');
    await expect(specialistCard).toContainText('Профиль специалиста');
  });

  test('container has correct dimensions and styling', async ({ page }) => {
    await page.goto('/register');

    const container = page.locator('div.bg-\\[\\#060813\\]').first();

    // Check background color (#060813)
    await expect(container).toHaveCSS('background-color', 'rgb(6, 8, 19)');

    // Check border color (#242935)
    await expect(container).toHaveCSS('border-color', 'rgb(36, 41, 53)');

    // Check border-radius (25px)
    await expect(container).toHaveCSS('border-radius', '25px');

    // Check min-height (540px)
    const boundingBox = await container.boundingBox();
    expect(boundingBox?.height).toBeGreaterThanOrEqual(540);
  });

  test('page background is correct color', async ({ page }) => {
    await page.goto('/register');

    const pageBackground = page.locator('div.bg-\\[\\#01030e\\]').first();
    await expect(pageBackground).toHaveCSS('background-color', 'rgb(1, 3, 14)');
  });

  test('existing registration functionality works', async ({ page }) => {
    await page.goto('/register');

    // Select role
    await page.click('[data-testid="role-specialist"]');

    // Fill form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPass123');

    // Submit button should be enabled
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
  });
});
