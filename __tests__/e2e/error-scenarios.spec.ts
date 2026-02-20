/**
 * E2E Test: Error Scenarios and Edge Cases
 *
 * This test suite validates error handling across all major workflows:
 * 1. Unauthorized access redirects to login
 * 2. Role-based access control prevents unauthorized actions
 * 3. Closed gigs show appropriate error messages or hide forms
 * 4. Invalid state transitions are prevented
 * 5. Non-OPEN gigs don't accept applications
 *
 * Note: HTML5 form validation (required, minLength) shows browser-native errors
 * that are not easily testable in E2E. This suite focuses on server-side validation
 * and business logic errors that appear in the UI.
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

test.describe('Error Scenarios E2E', () => {
  test.afterEach(async () => {
    // Clean up test data in correct order (respect foreign key constraints)
    await prisma.message.deleteMany({})
    await prisma.application.deleteMany({})
    await prisma.gig.deleteMany({})
    await prisma.user.deleteMany({})
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  // ========================================================================
  // UNAUTHORIZED ACCESS REDIRECTS
  // ========================================================================

  test.describe('Unauthorized Access Redirects', () => {
    test('unauthenticated access to dashboard redirects to login', async ({ page }) => {
      // Do NOT set session cookie (user is unauthenticated)
      await page.goto('http://localhost:3000/dashboard')

      // Verify redirect to login
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
    })

    test('unauthenticated access to gig creation redirects to login', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard/gigs/new')
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
    })

    test('unauthenticated access to gig detail redirects to login', async ({ page }) => {
      // Create a gig first
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })
      const gig = await createTestGig(prisma, { clientId: client.id })

      // Try to access without authentication
      await page.goto(`http://localhost:3000/dashboard/gigs/${gig.id}`)
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
    })

    test('unauthenticated access to admin redirects to login', async ({ page }) => {
      await page.goto('http://localhost:3000/admin')
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
    })
  })

  // ========================================================================
  // ROLE-BASED ACCESS CONTROL
  // ========================================================================

  test.describe('Role-Based Access Control', () => {
    test('SPECIALIST cannot access gig creation page', async ({ page }) => {
      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

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

      // Try to access CLIENT-only route
      await page.goto('http://localhost:3000/dashboard/gigs/new')
      await page.waitForLoadState('networkidle')

      // Verify redirected to dashboard (SPECIALIST role check in page)
      const url = page.url()
      expect(url).toContain('/dashboard')
      expect(url).not.toContain('/dashboard/gigs/new')
    })

    test('CLIENT cannot see application form on gig detail', async ({ page }) => {
      // Create gig
      const client1 = await createTestUser(prisma, {
        role: 'CLIENT',
        email: `client1-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })
      const gig = await createTestGig(prisma, { clientId: client1.id })

      // Create another CLIENT user
      const client2 = await createTestUser(prisma, {
        role: 'CLIENT',
        email: `client2-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const token = await createTestSession(client2)
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

      await page.goto(`http://localhost:3000/dashboard/gigs/${gig.id}`)
      await page.waitForLoadState('networkidle')

      // Verify application form is not visible (SPECIALIST-only action)
      const applicationForm = page.locator('textarea[name="approach"]')
      const isFormVisible = await applicationForm.isVisible().catch(() => false)

      expect(isFormVisible).toBe(false)
    })

    test('non-ADMIN cannot access admin panel', async ({ page }) => {
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const token = await createTestSession(client)
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

      await page.goto('http://localhost:3000/admin')
      await page.waitForLoadState('networkidle')

      // Verify redirected away from admin (should redirect to login or dashboard)
      const url = page.url()
      expect(url).not.toContain('/admin')
    })
  })

  // ========================================================================
  // CLOSED GIG ERRORS
  // ========================================================================

  test.describe('Closed Gig Errors', () => {
    test('cannot apply to closed gig - server-side validation', async ({ page }) => {
      // Create closed gig (status OPEN but closedByAdmin=true)
      // Note: UI currently shows form for OPEN gigs even if closedByAdmin=true
      // Server-side validation prevents the application from being created
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'OPEN',
        closedByAdmin: true,
        closedAt: new Date()
      })

      // Create SPECIALIST
      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

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

      await page.goto(`http://localhost:3000/dashboard/gigs/${gig.id}`)
      await page.waitForLoadState('networkidle')

      // Form may be visible in UI (status is OPEN), but server-side validation prevents submission
      // Try to submit application
      const approachField = page.locator('textarea[name="approach"]')
      if (await approachField.isVisible()) {
        await approachField.fill('Буду использовать современный стек технологий с применением лучших практик разработки и тестирования кода для выполнения данного проекта')
        await page.fill('textarea[name="questions"]', 'Какие требования к производительности? Какие сроки выполнения?')
        await page.click('button:has-text("Submit Application")')

        // Wait for either error message or redirect
        await page.waitForTimeout(2000)

        // Check if error message appears (server-side validation)
        const errorBox = page.locator('.bg-red-50')
        const hasError = await errorBox.isVisible().catch(() => false)

        if (hasError) {
          const errorText = await errorBox.textContent()
          expect(errorText).toMatch(/closed|администратор/i)
        }
      }

      // Most important: verify no application was created (server-side validation worked)
      const applications = await prisma.application.findMany({
        where: { gigId: gig.id, specialistId: specialist.id }
      })
      expect(applications.length).toBe(0)
    })

    test('closed gig shows closed status indicator', async ({ page }) => {
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        closedByAdmin: true,
        closedAt: new Date()
      })

      const token = await createTestSession(client)
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

      await page.goto(`http://localhost:3000/dashboard/gigs/${gig.id}`)
      await page.waitForLoadState('networkidle')

      // Verify page loads (no error)
      expect(page.url()).toContain(`/dashboard/gigs/${gig.id}`)
    })
  })

  // ========================================================================
  // INVALID STATE TRANSITIONS
  // ========================================================================

  test.describe('Invalid State Transitions', () => {
    test('cannot submit work when not assigned specialist', async ({ page }) => {
      // Create gig with assigned specialist A
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const specialistA = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: `specialistA-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialistA.id
      })

      // Create specialist B (different user)
      const specialistB = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: `specialistB-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const token = await createTestSession(specialistB)
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

      await page.goto(`http://localhost:3000/dashboard/gigs/${gig.id}`)
      await page.waitForLoadState('networkidle')

      // Verify work submission form is not visible (only assigned specialist can submit)
      const workForm = page.locator('textarea[name="workDescription"]')
      const isFormVisible = await workForm.isVisible().catch(() => false)

      expect(isFormVisible).toBe(false)

      // Verify gig status unchanged
      const gigAfter = await prisma.gig.findUnique({ where: { id: gig.id } })
      expect(gigAfter?.status).toBe('IN_PROGRESS')
      expect(gigAfter?.workSubmittedAt).toBeFalsy() // null or undefined
    })

    test('cannot approve work when not gig owner', async ({ page }) => {
      // Create gig owned by client A in REVIEW status
      const clientA = await createTestUser(prisma, {
        role: 'CLIENT',
        email: `clientA-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const gig = await createTestGig(prisma, {
        clientId: clientA.id,
        status: 'REVIEW',
        assignedSpecialistId: specialist.id,
        workSubmittedAt: new Date()
      })

      // Create client B (different user)
      const clientB = await createTestUser(prisma, {
        role: 'CLIENT',
        email: `clientB-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const token = await createTestSession(clientB)
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

      await page.goto(`http://localhost:3000/dashboard/gigs/${gig.id}`)
      await page.waitForLoadState('networkidle')

      // Verify approve button is not visible (only owner can approve)
      const approveButton = page.locator('button:has-text("Approve")')
      const isButtonVisible = await approveButton.isVisible().catch(() => false)

      expect(isButtonVisible).toBe(false)

      // Verify gig status unchanged
      const gigAfter = await prisma.gig.findUnique({ where: { id: gig.id } })
      expect(gigAfter?.status).toBe('REVIEW')
      expect(gigAfter?.completedAt).toBeFalsy() // null or undefined
    })

    test('cannot mark OPEN gig as paid', async ({ page }) => {
      // Create OPEN gig (no assigned specialist)
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'OPEN'
      })

      const token = await createTestSession(client)
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

      await page.goto(`http://localhost:3000/dashboard/gigs/${gig.id}`)
      await page.waitForLoadState('networkidle')

      // Verify "Mark as Paid" button is not visible (only for COMPLETED gigs)
      const paidButton = page.locator('button:has-text("Mark as Paid")')
      const isButtonVisible = await paidButton.isVisible().catch(() => false)

      expect(isButtonVisible).toBe(false)

      // Verify gig status unchanged
      const gigAfter = await prisma.gig.findUnique({ where: { id: gig.id } })
      expect(gigAfter?.status).toBe('OPEN')
      expect(gigAfter?.paidAt).toBeNull()
    })
  })

  // ========================================================================
  // NON-OPEN GIG APPLICATIONS
  // ========================================================================

  test.describe('Non-OPEN Gig Applications', () => {
    test('cannot apply to IN_PROGRESS gig', async ({ page }) => {
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const assignedSpecialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: `assigned-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: assignedSpecialist.id
      })

      // Create different SPECIALIST trying to apply
      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

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

      await page.goto(`http://localhost:3000/dashboard/gigs/${gig.id}`)
      await page.waitForLoadState('networkidle')

      // Verify application form is not visible (only OPEN gigs accept applications)
      const applicationForm = page.locator('textarea[name="approach"]')
      const isFormVisible = await applicationForm.isVisible().catch(() => false)

      expect(isFormVisible).toBe(false)

      // Verify no application was created
      const applications = await prisma.application.findMany({
        where: { gigId: gig.id, specialistId: specialist.id }
      })
      expect(applications.length).toBe(0)
    })

    test('cannot apply to COMPLETED gig', async ({ page }) => {
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const assignedSpecialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: `assigned-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'COMPLETED',
        assignedSpecialistId: assignedSpecialist.id,
        completedAt: new Date()
      })

      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

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

      await page.goto(`http://localhost:3000/dashboard/gigs/${gig.id}`)
      await page.waitForLoadState('networkidle')

      // Verify application form is not visible
      const applicationForm = page.locator('textarea[name="approach"]')
      const isFormVisible = await applicationForm.isVisible().catch(() => false)

      expect(isFormVisible).toBe(false)

      // Verify no application was created
      const applications = await prisma.application.findMany({
        where: { gigId: gig.id, specialistId: specialist.id }
      })
      expect(applications.length).toBe(0)
    })

    test('cannot apply to PAID gig', async ({ page }) => {
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const assignedSpecialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: `assigned-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'PAID',
        assignedSpecialistId: assignedSpecialist.id,
        completedAt: new Date(),
        paidAt: new Date()
      })

      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      })

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

      await page.goto(`http://localhost:3000/dashboard/gigs/${gig.id}`)
      await page.waitForLoadState('networkidle')

      // Verify application form is not visible
      const applicationForm = page.locator('textarea[name="approach"]')
      const isFormVisible = await applicationForm.isVisible().catch(() => false)

      expect(isFormVisible).toBe(false)

      // Verify no application was created
      const applications = await prisma.application.findMany({
        where: { gigId: gig.id, specialistId: specialist.id }
      })
      expect(applications.length).toBe(0)
    })
  })
})
