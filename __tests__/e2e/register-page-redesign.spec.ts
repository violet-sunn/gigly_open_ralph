import { test, expect } from '@playwright/test';

/**
 * Register page — the composed 3-step onboarding wizard reconciled to its Figma auth nodes
 * (reconcile-auth-and-onboarding, Phase 1). The page composes from the kit (AuthLayout + AuthHeader [Logomark +
 * heading + AuthStepDots dot counter] + RoleCards + form primitives), token-pure. These tests assert the
 * reconciled composed structure, not raw hex values.
 */
test.describe('Register Page Redesign (composed wizard)', () => {
  test('displays the Figma node heading "Создайте свой аккаунт"', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Создайте свой аккаунт' })).toBeVisible();
  });

  test('shows the AuthStepDots dot counter (not the labelled StepIndicator)', async ({ page }) => {
    await page.goto('/register');
    const dots = page.getByRole('progressbar');
    await expect(dots).toHaveAttribute('aria-valuenow', '1');
    await expect(dots).toHaveAttribute('aria-valuemax', '3');
    await expect(page.getByText('Доступ')).toHaveCount(0); // step labels removed
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
    await expect(page.getByRole('heading', { name: 'Создайте свой аккаунт' })).toBeVisible();
    await expect(page.getByTestId('role-client')).toBeVisible();
  });
});
