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
import { createTestUser, createTestGig } from '../helpers/seed'
import { createTestSession } from '../helpers/auth'

// Setup test database connection for E2E tests
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
})

const prisma = new PrismaClient({
  adapter: adapter as any
})

test.describe('Gig Browse Access Control E2E', () => {
  test.afterEach(async () => {
    // Clean up test data
    await prisma.application.deleteMany({})
    await prisma.gig.deleteMany({})
    await prisma.user.deleteMany({})
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

    // Navigate to gig creation form
    await page.goto('http://localhost:3000/gigs/new')
    await expect(page).toHaveURL(/\/gigs\/new/)

    // Find and click the example gigs link
    const exampleLink = page.locator('a:has-text("💡 View example gigs for inspiration")')
    await expect(exampleLink).toBeVisible()

    // Listen for new page (new tab)
    const pagePromise = context.waitForEvent('page')
    await exampleLink.click()
    const newPage = await pagePromise

    // Wait for new page to load
    await newPage.waitForLoadState('networkidle')

    // Verify new tab opened to examples page
    await expect(newPage).toHaveURL(/\/gigs\/examples/)

    // Verify example gigs page displays correctly
    await expect(newPage.locator('h2:has-text("Example Gigs")')).toBeVisible()
    await expect(newPage.locator('text=These are example gigs to help you understand')).toBeVisible()

    // Verify example gig is displayed
    await expect(newPage.locator(`text=${exampleGig.title}`)).toBeVisible()

    // Verify no error message
    await expect(newPage.locator('text=only available for specialists')).not.toBeVisible()

    // Close new tab
    await newPage.close()

    // Verify original page (gig creation form) is still intact
    await expect(page).toHaveURL(/\/gigs\/new/)
    await expect(page.locator('input[name="title"]')).toBeVisible()
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

    // Wait for redirect
    await page.waitForLoadState('networkidle')

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/(dashboard|gigs)(\?|$)/)

    // Verify error message is visible
    await expect(page.locator('text=Browse Gigs is only available for specialists')).toBeVisible()
    await expect(page.locator('text=To view example gigs, visit the Examples page')).toBeVisible()
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

    // Verify page loads successfully
    await expect(page).toHaveURL(/\/gigs(\?|$)/)
    await expect(page.locator('h2:has-text("Open Gigs")')).toBeVisible()

    // Verify both regular and example gigs are displayed
    await expect(page.locator(`text=${regularGig.title}`)).toBeVisible()
    await expect(page.locator(`text=${exampleGig.title}`)).toBeVisible()

    // Verify no error message
    await expect(page.locator('text=only available for specialists')).not.toBeVisible()

    // Navigate to examples page
    await page.goto('http://localhost:3000/gigs/examples')
    await page.waitForLoadState('networkidle')

    // Verify examples page loads successfully
    await expect(page).toHaveURL(/\/gigs\/examples/)
    await expect(page.locator('h2:has-text("Example Gigs")')).toBeVisible()

    // Verify only example gig is displayed
    await expect(page.locator(`text=${exampleGig.title}`)).toBeVisible()
    await expect(page.locator(`text=${regularGig.title}`)).not.toBeVisible()

    // Navigate back to browse page
    await page.goto('http://localhost:3000/gigs')
    await page.waitForLoadState('networkidle')

    // Verify can navigate between both pages
    await expect(page).toHaveURL(/\/gigs(\?|$)/)
    await expect(page.locator('h2:has-text("Open Gigs")')).toBeVisible()
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
