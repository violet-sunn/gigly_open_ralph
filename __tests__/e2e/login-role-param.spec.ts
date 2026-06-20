import { test, expect } from '@playwright/test';

test.describe('Login Page Role Parameter Handling', () => {
  test('Login with SPECIALIST role parameter shows specialist card selected', async ({ page }) => {
    await page.goto('/login?role=SPECIALIST');

    // Wait for page to load
    await page.waitForSelector('h1:has-text("Вход")');

    // Verify role cards are displayed by checking for the text content
    await expect(page.locator('text=Профиль специалиста')).toBeVisible();
    await expect(page.locator('text=Профиль Компании')).toBeVisible();

    // Find the specialist card div (the one with the border)
    // It's the parent of the p tag containing "Профиль специалиста"
    const specialistCard = page.locator('p:has-text("Профиль специалиста")').locator('..');

    // Check if it has the blue border class
    const specialistClasses = await specialistCard.getAttribute('class');
    expect(specialistClasses).toContain('border-brand-default');
  });

  test('Login with CLIENT role parameter shows client card selected', async ({ page }) => {
    await page.goto('/login?role=CLIENT');

    // Wait for page to load
    await page.waitForSelector('h1:has-text("Вход")');

    // Verify role cards are displayed
    await expect(page.locator('text=Профиль специалиста')).toBeVisible();
    await expect(page.locator('text=Профиль Компании')).toBeVisible();

    // Find the client card div
    const clientCard = page.locator('p:has-text("Профиль Компании")').locator('..');

    // Check if it has the blue border class
    const clientClasses = await clientCard.getAttribute('class');
    expect(clientClasses).toContain('border-brand-default');
  });

  test('Login without role parameter shows no role cards', async ({ page }) => {
    await page.goto('/login');

    // Wait for page to load
    await page.waitForSelector('h1:has-text("Вход")');

    // Verify role cards are NOT displayed
    await expect(page.locator('text=Профиль специалиста')).not.toBeVisible();
    await expect(page.locator('text=Профиль Компании')).not.toBeVisible();

    // Verify login form is still functional
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Login with invalid role parameter shows no role cards', async ({ page }) => {
    await page.goto('/login?role=ADMIN');

    // Wait for page to load
    await page.waitForSelector('h1:has-text("Вход")');

    // Verify role cards are NOT displayed (graceful fallback)
    await expect(page.locator('text=Профиль специалиста')).not.toBeVisible();
    await expect(page.locator('text=Профиль Компании')).not.toBeVisible();

    // Verify login form is still functional
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Login form displays correctly with Figma design specifications', async ({ page }) => {
    await page.goto('/login?role=SPECIALIST');

    // Wait for page to load
    await page.waitForSelector('h1:has-text("Вход")');

    // Verify auth container styling - target the inner container with bg-[#060813]
    const authContainer = page.locator('div.bg-surface-level-2').first();
    await expect(authContainer).toBeVisible();
    await expect(authContainer).toHaveCSS('background-color', 'rgb(16, 18, 28)'); // surface-level-2 dark (#10121c)
    await expect(authContainer).toHaveCSS('border-radius', '25px');

    // Verify heading
    const heading = page.locator('h1:has-text("Вход")');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveCSS('font-size', '22px');
    await expect(heading).toHaveCSS('color', 'rgb(255, 255, 255)');

    // Verify input fields styling
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveCSS('background-color', 'rgb(14, 16, 26)'); // surface-level-1 dark (#0e101a)
    await expect(emailInput).toHaveCSS('border-radius', '20px');
    await expect(emailInput).toHaveCSS('padding-left', '20px');

    // Verify submit button styling
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toHaveCSS('background-color', 'rgb(0, 136, 255)'); // #0088ff
    await expect(submitButton).toHaveCSS('height', '50px');
    await expect(submitButton).toHaveCSS('border-radius', '10px');

    // Verify register link styling
    const registerLink = page.locator('a[href="/register"]');
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveCSS('height', '50px');
  });

  test('Responsive design - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login?role=SPECIALIST');

    // Verify container adapts to mobile
    await page.waitForSelector('h1:has-text("Вход")');
    const authContainer = page.locator('div.bg-surface-level-2').first();
    await expect(authContainer).toBeVisible();

    // Verify all elements are still functional
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('a[href="/register"]')).toBeVisible();
  });

  test('Decorative background pattern is visible', async ({ page }) => {
    await page.goto('/login?role=SPECIALIST');

    // Verify background pattern SVG exists
    const backgroundPattern = page.locator('svg').filter({ has: page.locator('pattern#checkerboard') });
    await expect(backgroundPattern).toBeVisible();
  });
});
