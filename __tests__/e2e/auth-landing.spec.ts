import { test, expect } from '@playwright/test';

test.describe('Auth Landing Page', () => {
  test('loads correctly for unauthenticated user', async ({ page }) => {
    await page.goto('http://localhost:3000/auth');
    await page.waitForLoadState('networkidle');

    // Verify page title is visible
    await expect(page.getByText('Вход')).toBeVisible();

    // Verify role cards are visible
    await expect(page.getByText('Профиль специалиста')).toBeVisible();
    await expect(page.getByText('Профиль Компании')).toBeVisible();

    // Verify buttons are visible and disabled
    const loginButton = page.getByRole('button', { name: 'Войти' });
    const registerButton = page.getByRole('button', { name: 'Зарегестрироватся' });
    await expect(loginButton).toBeVisible();
    await expect(registerButton).toBeVisible();
    await expect(loginButton).toBeDisabled();
    await expect(registerButton).toBeDisabled();
  });

  test('enables buttons when Specialist role is selected', async ({ page }) => {
    await page.goto('http://localhost:3000/auth');
    await page.waitForLoadState('networkidle');

    // Click Specialist role card
    await page.getByText('Профиль специалиста').click();

    // Verify buttons are enabled
    const loginButton = page.getByRole('button', { name: 'Войти' });
    const registerButton = page.getByRole('button', { name: 'Зарегестрироватся' });
    await expect(loginButton).toBeEnabled();
    await expect(registerButton).toBeEnabled();
  });

  test('enables buttons when Client role is selected', async ({ page }) => {
    await page.goto('http://localhost:3000/auth');
    await page.waitForLoadState('networkidle');

    // Click Client role card
    await page.getByText('Профиль Компании').click();

    // Verify buttons are enabled
    const loginButton = page.getByRole('button', { name: 'Войти' });
    const registerButton = page.getByRole('button', { name: 'Зарегестрироватся' });
    await expect(loginButton).toBeEnabled();
    await expect(registerButton).toBeEnabled();
  });

  test('allows changing role selection', async ({ page }) => {
    await page.goto('http://localhost:3000/auth');
    await page.waitForLoadState('networkidle');

    // Click Specialist role card
    await page.getByText('Профиль специалиста').click();

    // Click Client role card
    await page.getByText('Профиль Компании').click();

    // Verify buttons remain enabled
    const loginButton = page.getByRole('button', { name: 'Войти' });
    await expect(loginButton).toBeEnabled();
  });

  test('navigates to login with Specialist role', async ({ page }) => {
    await page.goto('http://localhost:3000/auth');
    await page.waitForLoadState('networkidle');

    // Click Specialist role card
    await page.getByText('Профиль специалиста').click();

    // Click login button
    const loginButton = page.getByRole('button', { name: 'Войти' });
    await loginButton.click();

    // Verify navigation to /login?role=SPECIALIST
    await page.waitForURL(/\/login\?role=SPECIALIST/);
    expect(page.url()).toContain('/login?role=SPECIALIST');
  });

  test('navigates to login with Client role', async ({ page }) => {
    await page.goto('http://localhost:3000/auth');
    await page.waitForLoadState('networkidle');

    // Click Client role card
    await page.getByText('Профиль Компании').click();

    // Click login button
    const loginButton = page.getByRole('button', { name: 'Войти' });
    await loginButton.click();

    // Verify navigation to /login?role=CLIENT
    await page.waitForURL(/\/login\?role=CLIENT/);
    expect(page.url()).toContain('/login?role=CLIENT');
  });

  test('navigates to register with Specialist role', async ({ page }) => {
    await page.goto('http://localhost:3000/auth');
    await page.waitForLoadState('networkidle');

    // Click Specialist role card
    await page.getByText('Профиль специалиста').click();

    // Click register button
    const registerButton = page.getByRole('button', { name: 'Зарегестрироватся' });
    await registerButton.click();

    // Verify navigation to /register?role=SPECIALIST
    await page.waitForURL(/\/register\?role=SPECIALIST/);
    expect(page.url()).toContain('/register?role=SPECIALIST');
  });

  test('navigates to register with Client role', async ({ page }) => {
    await page.goto('http://localhost:3000/auth');
    await page.waitForLoadState('networkidle');

    // Click Client role card
    await page.getByText('Профиль Компании').click();

    // Click register button
    const registerButton = page.getByRole('button', { name: 'Зарегестрироватся' });
    await registerButton.click();

    // Verify navigation to /register?role=CLIENT
    await page.waitForURL(/\/register\?role=CLIENT/);
    expect(page.url()).toContain('/register?role=CLIENT');
  });

  test('responsive layout on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('http://localhost:3000/auth');
    await page.waitForLoadState('networkidle');

    // Verify page loads and elements are visible
    await expect(page.getByText('Вход')).toBeVisible();
    await expect(page.getByText('Профиль специалиста')).toBeVisible();
    await expect(page.getByText('Профиль Компании')).toBeVisible();

    // Verify buttons are visible
    const loginButton = page.getByRole('button', { name: 'Войти' });
    const registerButton = page.getByRole('button', { name: 'Зарегестрироватся' });
    await expect(loginButton).toBeVisible();
    await expect(registerButton).toBeVisible();

    // Verify interaction works on mobile
    await page.getByText('Профиль специалиста').click();
    await expect(loginButton).toBeEnabled();
  });
});
