/**
 * E2E Test: Gig Browse Access Control
 *
 * This test validates role-based access control for gig browsing:
 * 1. CLIENT can view example gigs from gig creation form
 * 2. CLIENT cannot access main browse page
 * 3. SPECIALIST can access both browse and examples pages
 */

import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createTestUser, createTestGig, resetE2EDb } from '../helpers/seed'
import { createTestSession } from '../helpers/auth'

// Setup test database connection for E2E tests
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
})

const prisma = new PrismaClient({
  adapter: adapter as any
})

test.describe('Gig Browse Access Control E2E', () => {
  // Clean slate before each test (count/visibility assertions must not see other specs' leftover gigs).
  test.beforeEach(async () => {
    await resetE2EDb(prisma)
  })

  test.afterEach(async () => {
    // FK-safe full reset (the shared E2E db may hold disputes/reviews/notifications referencing gigs+users).
    await resetE2EDb(prisma)
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('CLIENT can view example gigs from gig creation form', async ({ page, context }) => {
    // Create CLIENT user
    const clientEmail = `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: clientEmail,
      password: 'TestPassword123!',
      companyName: 'ООО "ТехноСтарт"',
      inn: '7743013902'
    })

    // Create example gig
    const exampleGig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'OPEN',
      isExample: true,
      title: 'Пример: Разработка REST API',
      description: 'Это пример гига для демонстрации лучших практик'
    })

    // Set authenticated session
    const token = await createTestSession(client)
    await context.addCookies([
      {
        name: 'session',
        value: token,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
      }
    ])

    // Reach the examples the way a CLIENT actually does: by clicking the link on the gig-creation screen. Asserting
    // the click (not a page.goto) is the point — this test exists to fail if the entry point is ever dropped again.
    await page.goto('http://localhost:3000/gigs/new')
    await page.waitForLoadState('networkidle')

    const examplesLink = page.getByRole('link', { name: /Посмотреть примеры/ })
    await expect(examplesLink).toBeVisible()

    // The link opens a new tab on purpose (the in-progress brief lives in client state), so follow the popup.
    const [examplesPage] = await Promise.all([
      context.waitForEvent('page'),
      examplesLink.click(),
    ])
    await examplesPage.waitForLoadState('networkidle')
    await expect(examplesPage).toHaveURL(/\/gigs\/examples/)

    // Verify the examples page displays correctly (Russian, re-grounded)
    await expect(examplesPage.getByRole('heading', { name: 'Примеры гигов' })).toBeVisible()

    // Verify the seeded example gig is displayed
    await expect(examplesPage.locator(`text=${exampleGig.title}`)).toBeVisible()
  })

  test('CLIENT returns from an example gig back to the examples, not to the specialist browse', async ({ page, context }) => {
    // Guards the gig-detail back control: it used to push /gigs unconditionally, which is SPECIALIST-only — a CLIENT
    // was redirected on to /dashboard, stranded away from both the examples and their in-progress brief.
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`,
      password: 'TestPassword123!',
      companyName: 'ООО "ТехноСтарт"',
      inn: '7743013902'
    })
    const exampleGig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'OPEN',
      isExample: true,
      title: 'Пример: Разработка REST API'
    })

    const token = await createTestSession(client)
    await context.addCookies([
      {
        name: 'session',
        value: token,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
      }
    ])

    await page.goto('http://localhost:3000/gigs/examples')
    await page.waitForLoadState('networkidle')

    // Open the example from the list, so the ?from=examples return path is the one under test.
    await page.locator(`a[href*="${exampleGig.id}"]`).click()
    await page.waitForURL(/\/gigs\/.*from=examples/)
    await page.waitForLoadState('networkidle')

    const back = page.getByText('← Назад к примерам', { exact: true })
    await expect(back).toBeVisible()
    await back.click()

    await expect(page).toHaveURL(/\/gigs\/examples/)
    await expect(page.getByRole('heading', { name: 'Примеры гигов' })).toBeVisible()
  })

  test('CLIENT cannot access main browse page', async ({ page, context }) => {
    // Create CLIENT user
    const clientEmail = `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: clientEmail,
      password: 'TestPassword123!',
      companyName: 'ООО "ТехноСтарт"',
      inn: '7743013902'
    })

    // Set authenticated session
    const token = await createTestSession(client)
    await context.addCookies([
      {
        name: 'session',
        value: token,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
      }
    ])

    // Attempt to navigate to browse page directly
    await page.goto('http://localhost:3000/gigs')
    await page.waitForLoadState('networkidle')

    // The rebuilt /gigs gates CLIENTs server-side → redirect to /dashboard (the error query param is consumed
    // and cleaned by the dashboard, so assert the redirect itself, not the transient param).
    await expect(page).toHaveURL(/\/dashboard/)
    expect(page.url()).not.toContain('/gigs')
  })

  test('SPECIALIST can access both browse and examples pages', async ({ page, context }) => {
    // Create SPECIALIST user
    const specialistEmail = `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      email: specialistEmail,
      password: 'TestPassword123!',
      techStack: 'React, Node.js, PostgreSQL',
      experienceLevel: 'SENIOR'
    })

    // Create CLIENT user and gigs
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: `client-${Date.now()}@test.com`,
      password: 'TestPassword123!',
      companyName: 'ООО "ТехноСтарт"',
      inn: '7743013902'
    })

    // Create regular gig
    const regularGig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'OPEN',
      isExample: false,
      title: 'Разработка веб-приложения'
    })

    // Create example gig
    const exampleGig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'OPEN',
      isExample: true,
      title: 'Пример: REST API'
    })

    // Set authenticated session
    const token = await createTestSession(specialist)
    await context.addCookies([
      {
        name: 'session',
        value: token,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
      }
    ])

    // Navigate to browse page
    await page.goto('http://localhost:3000/gigs')
    await page.waitForLoadState('networkidle')

    // Verify the rebuilt browse (GigSearchDesign) loads — the «Найдено» results heading.
    await expect(page).toHaveURL(/\/gigs(\?|$)/)
    await expect(page.getByRole('heading', { name: 'Найдено' })).toBeVisible()

    // Verify both regular and example gigs are displayed (both are OPEN; browse doesn't filter examples out)
    await expect(page.locator(`text=${regularGig.title}`)).toBeVisible()
    await expect(page.locator(`text=${exampleGig.title}`)).toBeVisible()

    // Navigate to examples page
    await page.goto('http://localhost:3000/gigs/examples')
    await page.waitForLoadState('networkidle')

    // Verify examples page loads successfully
    await expect(page).toHaveURL(/\/gigs\/examples/)
    await expect(page.getByRole('heading', { name: 'Примеры гигов' })).toBeVisible()

    // Verify only the example gig is displayed there
    await expect(page.locator(`text=${exampleGig.title}`)).toBeVisible()
    await expect(page.locator(`text=${regularGig.title}`)).not.toBeVisible()

    // Navigate back to browse page
    await page.goto('http://localhost:3000/gigs')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/gigs(\?|$)/)
    await expect(page.getByRole('heading', { name: 'Найдено' })).toBeVisible()
  })

  test('Unauthenticated user redirected to login', async ({ page }) => {
    // Attempt to access browse page without authentication
    await page.goto('http://localhost:3000/gigs')
    await page.waitForLoadState('networkidle')

    // Verify redirect to login
    await expect(page).toHaveURL(/\/login/)

    // Attempt to access examples page without authentication
    await page.goto('http://localhost:3000/gigs/examples')
    await page.waitForLoadState('networkidle')

    // Verify redirect to login
    await expect(page).toHaveURL(/\/login/)
  })
})
