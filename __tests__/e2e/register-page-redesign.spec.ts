import { test, expect } from '@playwright/test';

/**
 * Register page — the composed 3-step onboarding wizard (compose-auth-onboarding, Phase 2). Supersedes the prior
 * hardcoded-Figma/hex spec: the page is now composed from the kit (AuthLayout + StepIndicator + RoleCards + form
 * primitives), token-pure. These tests assert the new composed structure, not raw hex values.
 */
test.describe('Register Page Redesign (composed wizard)', () => {
  test('displays the Russian heading "Регистрация"', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Регистрация' })).toBeVisible();
  });

  test('shows the 3-step indicator', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByText('Роль')).toBeVisible();
    await expect(page.getByText('Доступ')).toBeVisible();
    await expect(page.getByText('Профиль', { exact: true })).toBeVisible();
  });

  test('role cards display Russian text and are both visible (no preselection)', async ({ page }) => {
    await page.goto('/register');
    const client = page.getByTestId('role-client');
    const specialist = page.getByTestId('role-specialist');
    await expect(client).toContainText('Профиль Компании');
    await expect(specialist).toContainText('Профиль специалиста');
    await expect(client).toHaveAttribute('aria-pressed', 'false');
    await expect(specialist).toHaveAttribute('aria-pressed', 'false');
  });

  test('pre-selects SPECIALIST from the query parameter', async ({ page }) => {
    await page.goto('/register?role=SPECIALIST');
    await expect(page.getByTestId('role-specialist')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('role-client')).toHaveAttribute('aria-pressed', 'false');
  });

  test('pre-selects CLIENT from the query parameter', async ({ page }) => {
    await page.goto('/register?role=CLIENT');
    await expect(page.getByTestId('role-client')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('role-specialist')).toHaveAttribute('aria-pressed', 'false');
  });

  test('advances to the credentials step with email + password + confirm-password', async ({ page }) => {
    await page.goto('/register?role=CLIENT');
    await page.getByRole('button', { name: 'Далее' }).click();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
  });

  test('renders the exported checkerboard footer asset', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('img[src="/assets/design-system/patterns/checkerboard.svg"]')).toBeVisible();
  });

  test('is responsive on a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Регистрация' })).toBeVisible();
    await expect(page.getByTestId('role-client')).toBeVisible();
  });
});
