/**
 * E2E Test: Specialist Active Gigs Dashboard
 *
 * This test validates the Active Gigs section on the specialist dashboard:
 * - Active Gigs section visibility
 * - Empty state handling
 * - Active gig display with correct information
 * - Navigation to gig detail pages
 * - Status badges with correct colors
 * - Payment date display for PAID gigs
 * - Client name display (company name or email fallback)
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

test.describe('Specialist Active Gigs Dashboard E2E', () => {
  test.afterEach(async () => {
    // Clean up test data
    await prisma.message.deleteMany({})
    await prisma.application.deleteMany({})
    await prisma.gig.deleteMany({})
    await prisma.specialistProfile.deleteMany({})
    await prisma.clientProfile.deleteMany({})
    await prisma.user.deleteMany({})
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('shows Active Gigs section above My Applications', async ({ page }) => {
    // Create specialist user
    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      email: `specialist-${Date.now()}@test.com`,
      password: 'TestPassword123!',
      displayName: 'Test Specialist',
      techStack: 'React, Node.js',
      experienceLevel: 'SENIOR'
    })

    // Set authenticated session
    const token = await createTestSession(specialist)
    await page.context().addCookies([
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

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard')
    await page.waitForLoadState('networkidle')

    // Verify Active Gigs section exists
    const activeGigsHeading = page.locator('text=Active Gigs')
    await expect(activeGigsHeading).toBeVisible()

    // Verify My Applications section exists
    const applicationsHeading = page.locator('text=My Applications')
    await expect(applicationsHeading).toBeVisible()

    // Verify Active Gigs appears before My Applications
    const activeGigsBox = activeGigsHeading.locator('..')
    const applicationsBox = applicationsHeading.locator('..')

    const activeGigsPosition = await activeGigsBox.boundingBox()
    const applicationsPosition = await applicationsBox.boundingBox()

    expect(activeGigsPosition!.y).toBeLessThan(applicationsPosition!.y)
  })

  test('shows empty state when no active gigs', async ({ page }) => {
    // Create specialist user
    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      email: `specialist-${Date.now()}@test.com`,
      password: 'TestPassword123!',
      displayName: 'Test Specialist',
      techStack: 'React, Node.js',
      experienceLevel: 'SENIOR'
    })

    // Set authenticated session
    const token = await createTestSession(specialist)
    await page.context().addCookies([
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

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard')
    await page.waitForLoadState('networkidle')

    // Verify empty state message
    await expect(page.locator('text=No active gigs yet')).toBeVisible()
    await expect(page.locator('text=Browse and apply to gigs')).toBeVisible()

    // Verify link to browse gigs exists
    const browseLink = page.locator('a:has-text("Browse and apply to gigs")')
    await expect(browseLink).toBeVisible()
    await expect(browseLink).toHaveAttribute('href', '/gigs')
  })

  test('displays active gig with all information', async ({ page }) => {
    // Create client and specialist
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: `client-${Date.now()}@test.com`,
      password: 'TestPassword123!',
      companyName: 'Test Company LLC',
      inn: '1234567890'
    })

    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      email: `specialist-${Date.now()}@test.com`,
      password: 'TestPassword123!',
      displayName: 'Test Specialist',
      techStack: 'React, Node.js',
      experienceLevel: 'SENIOR'
    })

    // Create IN_PROGRESS gig assigned to specialist
    const gig = await createTestGig(prisma, {
      clientId: client.id,
      title: 'Build REST API',
      status: 'IN_PROGRESS',
      assignedSpecialistId: specialist.id,
      budget: 10000000 // 100,000 roubles in kopecks
    })

    // Set authenticated session
    const token = await createTestSession(specialist)
    await page.context().addCookies([
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

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard')
    await page.waitForLoadState('networkidle')

    // Verify gig title is displayed
    await expect(page.locator('text=Build REST API')).toBeVisible()

    // Verify budget is displayed
    await expect(page.locator('text=100,000 ₽')).toBeVisible()

    // Verify client company name is displayed
    await expect(page.locator('text=Client: Test Company LLC')).toBeVisible()

    // Verify status badge is displayed
    await expect(page.locator('text=In Progress')).toBeVisible()
  })

  test('navigates to gig detail when clicking active gig', async ({ page }) => {
    // Create client and specialist
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: `client-${Date.now()}@test.com`,
      password: 'TestPassword123!',
      companyName: 'Test Company LLC',
      inn: '1234567890'
    })

    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      email: `specialist-${Date.now()}@test.com`,
      password: 'TestPassword123!',
      displayName: 'Test Specialist',
      techStack: 'React, Node.js',
      experienceLevel: 'SENIOR'
    })

    // Create IN_PROGRESS gig assigned to specialist
    const gig = await createTestGig(prisma, {
      clientId: client.id,
      title: 'Build REST API',
      status: 'IN_PROGRESS',
      assignedSpecialistId: specialist.id
    })

    // Set authenticated session
    const token = await createTestSession(specialist)
    await page.context().addCookies([
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

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard')
    await page.waitForLoadState('networkidle')

    // Click on the active gig
    await page.click('text=Build REST API')
    await page.waitForLoadState('networkidle')

    // Verify navigation to gig detail page
    await expect(page).toHaveURL(new RegExp(`/gigs/${gig.id}`))
    await expect(page.locator('text=Build REST API')).toBeVisible()
  })

  test('shows correct status badges for different statuses', async ({ page }) => {
    // Create client and specialist
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: `client-${Date.now()}@test.com`,
      password: 'TestPassword123!',
      companyName: 'Test Company LLC',
      inn: '1234567890'
    })

    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      email: `specialist-${Date.now()}@test.com`,
      password: 'TestPassword123!',
      displayName: 'Test Specialist',
      techStack: 'React, Node.js',
      experienceLevel: 'SENIOR'
    })

    // Create gigs with different statuses
    await createTestGig(prisma, {
      clientId: client.id,
      title: 'Gig In Progress',
      status: 'IN_PROGRESS',
      assignedSpecialistId: specialist.id
    })

    await createTestGig(prisma, {
      clientId: client.id,
      title: 'Gig Under Review',
      status: 'REVIEW',
      assignedSpecialistId: specialist.id
    })

    await createTestGig(prisma, {
      clientId: client.id,
      title: 'Gig Completed',
      status: 'COMPLETED',
      assignedSpecialistId: specialist.id
    })

    await createTestGig(prisma, {
      clientId: client.id,
      title: 'Gig Paid',
      status: 'PAID',
      assignedSpecialistId: specialist.id,
      paidAt: new Date()
    })

    // Set authenticated session
    const token = await createTestSession(specialist)
    await page.context().addCookies([
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

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard')
    await page.waitForLoadState('networkidle')

    // Verify all status badges are displayed
    await expect(page.locator('text=In Progress').first()).toBeVisible()
    await expect(page.locator('text=Under Review').first()).toBeVisible()
    await expect(page.locator('text=Completed - Awaiting Payment').first()).toBeVisible()
    await expect(page.locator('text=Paid').first()).toBeVisible()
  })

  test('shows payment date for PAID gigs', async ({ page }) => {
    // Create client and specialist
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: `client-${Date.now()}@test.com`,
      password: 'TestPassword123!',
      companyName: 'Test Company LLC',
      inn: '1234567890'
    })

    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      email: `specialist-${Date.now()}@test.com`,
      password: 'TestPassword123!',
      displayName: 'Test Specialist',
      techStack: 'React, Node.js',
      experienceLevel: 'SENIOR'
    })

    // Create PAID gig with payment date
    const paidDate = new Date('2024-12-15')
    await createTestGig(prisma, {
      clientId: client.id,
      title: 'Paid Gig',
      status: 'PAID',
      assignedSpecialistId: specialist.id,
      paidAt: paidDate
    })

    // Set authenticated session
    const token = await createTestSession(specialist)
    await page.context().addCookies([
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

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard')
    await page.waitForLoadState('networkidle')

    // Verify PAID badge is displayed
    await expect(page.locator('text=Paid').first()).toBeVisible()

    // Verify payment date is displayed (formatted as ru-RU locale)
    const formattedDate = paidDate.toLocaleDateString('ru-RU')
    await expect(page.locator(`text=${formattedDate}`).first()).toBeVisible()
  })

  test('shows client company name when available', async ({ page }) => {
    // Create client with company name
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: `client-${Date.now()}@test.com`,
      password: 'TestPassword123!',
      companyName: 'Acme Corporation',
      inn: '1234567890'
    })

    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      email: `specialist-${Date.now()}@test.com`,
      password: 'TestPassword123!',
      displayName: 'Test Specialist',
      techStack: 'React, Node.js',
      experienceLevel: 'SENIOR'
    })

    // Create active gig
    await createTestGig(prisma, {
      clientId: client.id,
      title: 'Test Gig',
      status: 'IN_PROGRESS',
      assignedSpecialistId: specialist.id
    })

    // Set authenticated session
    const token = await createTestSession(specialist)
    await page.context().addCookies([
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

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard')
    await page.waitForLoadState('networkidle')

    // Verify company name is displayed
    await expect(page.locator('text=Client: Acme Corporation')).toBeVisible()
  })

  test('shows client email when company name not available', async ({ page }) => {
    const clientEmail = `client-${Date.now()}@test.com`

    // Create client without company name
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: clientEmail,
      password: 'TestPassword123!'
      // No companyName provided
    })

    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      email: `specialist-${Date.now()}@test.com`,
      password: 'TestPassword123!',
      displayName: 'Test Specialist',
      techStack: 'React, Node.js',
      experienceLevel: 'SENIOR'
    })

    // Create active gig
    await createTestGig(prisma, {
      clientId: client.id,
      title: 'Test Gig',
      status: 'IN_PROGRESS',
      assignedSpecialistId: specialist.id
    })

    // Set authenticated session
    const token = await createTestSession(specialist)
    await page.context().addCookies([
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

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard')
    await page.waitForLoadState('networkidle')

    // Verify client email is displayed
    await expect(page.locator(`text=Client: ${clientEmail}`)).toBeVisible()
  })
})
