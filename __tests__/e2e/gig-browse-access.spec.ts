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

    // The rebuilt CreateGigDesign dropped the «View example gigs» link; the /gigs/examples route survives and is
    // CLIENT-accessible (no role check), so a CLIENT reaches it directly.
    await page.goto('http://localhost:3000/gigs/examples')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/gigs\/examples/)

    // Verify the examples page displays correctly
    await expect(page.locator('h2:has-text("Example Gigs")')).toBeVisible()
    await expect(page.locator('text=These are example gigs to help you understand')).toBeVisible()

    // Verify the seeded example gig is displayed
    await expect(page.locator(`text=${exampleGig.title}`)).toBeVisible()
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
    await expect(page.locator('h2:has-text("Example Gigs")')).toBeVisible()

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
