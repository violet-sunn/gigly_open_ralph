import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/** Seed a SPECIALIST directly (the register form uses radio RoleCards now; setE2ESession is the modern path). */
async function seedSpecialist(suffix: string) {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const email = `es-spec-${suffix}-${Date.now()}@example.com`
  const spec = await prisma.user.create({
    data: {
      email,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: { create: { displayName: 'T', techStack: 'React', experienceLevel: 'SENIOR', bio: 'x' } },
    },
  })
  await prisma.$disconnect()
  return { id: spec.id, email }
}

test.describe('Empty States', () => {
  test.beforeEach(async ({ page }) => {
    // Reset database before each test
    await page.goto('/')
  })

  test.describe('SPECIALIST Empty States', () => {
    test('composed gig search renders the FilterBar and results count', async ({ page }) => {
      const spec = await seedSpecialist('browse')
      await setE2ESession(page, { id: spec.id, email: spec.email, role: 'SPECIALIST' })

      // Navigate to gig browse page (composed from the kit — compose-gig-search)
      await page.goto('/gigs')

      // The composed screen renders the FilterBar + the "Найдено N" count.
      await expect(page.locator('h2:has-text("Поиск гигов")')).toBeVisible()
      await expect(page.getByRole('search')).toBeVisible()
      await expect(page.getByText(/Найдено \d/)).toBeVisible()
    })

    test('composed gig search shows Найдено 0 when filters match nothing', async ({ page }) => {
      const spec = await seedSpecialist('nomatch')
      await setE2ESession(page, { id: spec.id, email: spec.email, role: 'SPECIALIST' })

      // Navigate to gig browse page with filters that match nothing
      await page.goto('/gigs?search=nonexistentgig12345')

      // The composed screen reflects the empty result set via the "Найдено 0" count.
      await expect(page.getByRole('search')).toBeVisible()
      await expect(page.getByText(/Найдено 0/)).toBeVisible()
    })

    test('shows the composed specialist dashboard with empty status tabs', async ({ page }) => {
      // Register as SPECIALIST
      await page.goto('/register')
      await page.fill('input[name="email"]', 'specialist3@test.com')
      await page.fill('input[name="password"]', 'Password123')
      await page.selectOption('select[name="role"]', 'SPECIALIST')
      await page.click('button[type="submit"]')

      // Navigate to dashboard
      await page.goto('/dashboard')

      // The dashboard is composed from the kit (BannerCard + Tabs + GigCard·grid + SearchPanel + MessagesPanel,
      // compose-specialist-dashboard). With no gigs/applications the grid is empty, but the banner + the five
      // status tabs still render.
      await expect(page.getByText(/Находите интересные гиги/)).toBeVisible()
      await expect(page.getByRole('tablist')).toBeVisible()
      for (const label of ['Все', 'Заявки', 'В работе', 'На проверке', 'Завершённые']) {
        await expect(page.getByRole('tab', { name: new RegExp(label) })).toBeVisible()
      }
    })

    test('shows the find-project search on the specialist dashboard', async ({ page }) => {
      // Register as SPECIALIST
      await page.goto('/register')
      await page.fill('input[name="email"]', 'specialist4@test.com')
      await page.fill('input[name="password"]', 'Password123')
      await page.selectOption('select[name="role"]', 'SPECIALIST')
      await page.click('button[type="submit"]')

      // Navigate to dashboard
      await page.goto('/dashboard')

      // The composed dashboard surfaces the SearchPanel "Найти проект" action (the find-project entry point).
      await expect(page.getByRole('search')).toBeVisible()
      await expect(page.getByRole('button', { name: /Найти проект/ })).toBeVisible()
    })
  })

  test.describe('CLIENT Empty States', () => {
    test('shows empty state on client dashboard when no gigs posted', async ({ page }) => {
      // Register as CLIENT
      await page.goto('/register')
      await page.fill('input[name="email"]', 'client@test.com')
      await page.fill('input[name="password"]', 'Password123')
      await page.selectOption('select[name="role"]', 'CLIENT')
      await page.click('button[type="submit"]')

      // Navigate to dashboard
      await page.goto('/dashboard')

      // Verify empty state appears
      await expect(page.locator('text=📋')).toBeVisible()
      await expect(page.locator('text=Post Your First Gig')).toBeVisible()
      await expect(page.locator('text=Get started by posting a gig')).toBeVisible()

      // Verify CTAs exist
      await expect(page.locator('a:has-text("Create Gig")')).toBeVisible()
      await expect(page.locator('a:has-text("View Example Gigs")')).toBeVisible()
    })

    test('shows messages empty state on client dashboard', async ({ page }) => {
      // Register as CLIENT
      await page.goto('/register')
      await page.fill('input[name="email"]', 'client2@test.com')
      await page.fill('input[name="password"]', 'Password123')
      await page.selectOption('select[name="role"]', 'CLIENT')
      await page.click('button[type="submit"]')

      // Navigate to dashboard
      await page.goto('/dashboard')

      // Verify messages empty state with CLIENT-specific text
      await expect(page.locator('text=💬')).toBeVisible()
      await expect(page.locator('text=No Messages Yet')).toBeVisible()
      await expect(page.locator('text=Messages with specialists will appear here once you accept applications')).toBeVisible()
    })
  })

  test.describe('ADMIN Empty States', () => {
    test('shows empty state on admin users page', async ({ page }) => {
      // This test requires an ADMIN user to be created via database
      // For now, we'll skip this test in automated runs
      test.skip()
    })

    test('shows empty state on admin gigs page', async ({ page }) => {
      // This test requires an ADMIN user to be created via database
      // For now, we'll skip this test in automated runs
      test.skip()
    })
  })

  test.describe('Example Gigs Page', () => {
    test('shows empty state when no example gigs available', async ({ page }) => {
      // Register as any user
      await page.goto('/register')
      await page.fill('input[name="email"]', 'user@test.com')
      await page.fill('input[name="password"]', 'Password123')
      await page.selectOption('select[name="role"]', 'SPECIALIST')
      await page.click('button[type="submit"]')

      // Navigate to example gigs page
      await page.goto('/gigs/examples')

      // Verify empty state appears (if no example gigs exist)
      // Note: This may not show if seed data includes example gigs
      const emptyStateIcon = page.locator('text=✨')
      if (await emptyStateIcon.isVisible()) {
        await expect(page.locator('text=No Example Gigs Available')).toBeVisible()
        await expect(page.locator('text=Example gigs haven\'t been set up yet')).toBeVisible()
      }
    })
  })

  test.describe('Accessibility', () => {
    test('empty states are keyboard accessible', async ({ page }) => {
      // Register as SPECIALIST
      await page.goto('/register')
      await page.fill('input[name="email"]', 'specialist5@test.com')
      await page.fill('input[name="password"]', 'Password123')
      await page.selectOption('select[name="role"]', 'SPECIALIST')
      await page.click('button[type="submit"]')

      // Navigate to gig browse page
      await page.goto('/gigs')

      // Tab to the CTA button
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      // Verify focus is on the button
      const viewExamplesButton = page.locator('a:has-text("View Example Gigs")')
      await expect(viewExamplesButton).toBeFocused()

      // Press Enter to activate
      await page.keyboard.press('Enter')

      // Verify navigation occurred
      await expect(page).toHaveURL('/gigs/examples')
    })
  })
})
