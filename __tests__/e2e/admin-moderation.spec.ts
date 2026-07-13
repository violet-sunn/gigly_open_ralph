/**
 * E2E Test: Admin Moderation Workflow
 *
 * This test validates the complete admin moderation workflow:
 * 1. Setup: Create test users (CLIENT, SPECIALIST, ADMIN) and gig programmatically
 * 2. Admin Authentication: Login as ADMIN via UI
 * 3. User Suspension: Suspend a user with reason via UI
 * 4. Verify Suspension: Logout, attempt to login as suspended user, verify login fails
 * 5. Admin Re-authentication: Login as ADMIN again
 * 6. Gig Closure: Close a gig with reason via UI
 * 7. Verify Closure: Verify gig shows as closed
 * 8. Moderation History: Verify moderation logs exist in database
 *
 * Uses hybrid approach: admin actions via Playwright UI, setup programmatically.
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

test.describe('Admin Moderation E2E', () => {
  test.afterEach(async () => {
    // Clean up test data in correct order (children first)
    await prisma.moderationLog.deleteMany({})
    await prisma.message.deleteMany({})
    await prisma.application.deleteMany({})
    await prisma.gig.deleteMany({})
    await prisma.user.deleteMany({})
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('complete admin moderation workflow', async ({ page }) => {
    // ========================================================================
    // STEP 1: Create test users and gig programmatically
    // ========================================================================

    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(7)

    // Create CLIENT user
    const clientEmail = `client-${timestamp}-${randomSuffix}@test.com`
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: clientEmail,
      password: 'TestPassword123!',
      companyName: 'ООО "ТехноСтарт"',
      inn: '7743013902'
    })

    // Create SPECIALIST user (will be suspended)
    const specialistEmail = `specialist-${timestamp}-${randomSuffix}@test.com`
    const specialistPassword = 'TestPassword123!'
    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      email: specialistEmail,
      password: specialistPassword,
      displayName: 'Александр Петров'
    })

    // Create ADMIN user
    const adminEmail = `admin-${timestamp}-${randomSuffix}@test.com`
    const adminPassword = 'AdminPassword123!'
    const admin = await createTestUser(prisma, {
      role: 'ADMIN',
      email: adminEmail,
      password: adminPassword
    })

    // Create OPEN gig
    const gig = await createTestGig(prisma, {
      clientId: client.id,
      title: 'Разработка REST API для мобильного приложения',
      description: 'Необходимо разработать REST API для мобильного приложения с аутентификацией.'
    })

    // Verify setup
    const verifyClient = await prisma.user.findUnique({
      where: { id: client.id },
      include: { clientProfile: true }
    })
    const verifySpecialist = await prisma.user.findUnique({
      where: { id: specialist.id },
      include: { specialistProfile: true }
    })
    const verifyAdmin = await prisma.user.findUnique({ where: { id: admin.id } })
    const verifyGig = await prisma.gig.findUnique({ where: { id: gig.id } })

    expect(verifyClient).toBeTruthy()
    expect(verifyClient?.clientProfile).toBeTruthy()
    expect(verifySpecialist).toBeTruthy()
    expect(verifySpecialist?.specialistProfile).toBeTruthy()
    expect(verifyAdmin).toBeTruthy()
    expect(verifyAdmin?.role).toBe('ADMIN')
    expect(verifyGig).toBeTruthy()
    expect(verifyGig?.status).toBe('OPEN')

    console.log(`✓ Created CLIENT user: ${client.id} (${client.email})`)
    console.log(`✓ Created SPECIALIST user: ${specialist.id} (${specialist.email})`)
    console.log(`✓ Created ADMIN user: ${admin.id} (${admin.email})`)
    console.log(`✓ Created OPEN gig: ${gig.id}`)

    // ========================================================================
    // STEP 2: Admin authentication (programmatic)
    // ========================================================================
    // Note: We authenticate programmatically to ensure the test database is used
    // consistently for both setup and server actions during UI interactions.

    const adminToken = await createTestSession(admin)
    await page.context().addCookies([
      {
        name: 'session',
        value: adminToken,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
      }
    ])

    // Verify authentication — an ADMIN's home is the moderation console (/dashboard redirects ADMINs to /admin).
    await page.goto('http://localhost:3000/admin')
    await expect(page).toHaveURL(/\/admin/)

    console.log(`✓ Admin authenticated successfully`)

    // ========================================================================
    // STEP 3: Suspend user via UI
    // ========================================================================

    await page.goto('http://localhost:3000/admin/users')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin\/users/)

    // Find the specialist user row by email (transported row markup — div rows, not a table)
    const specialistRow = page.locator('[data-row="user"]').filter({ hasText: specialistEmail })
    await expect(specialistRow).toBeVisible()

    // Click the row's «Заблокировать» → the captured destructive-confirm dialog opens (no reason field; hardcoded reason)
    await specialistRow.getByRole('button', { name: 'Заблокировать' }).click()

    // Confirm in the dialog and wait for the action to complete
    await Promise.all([
      page.waitForURL(/\/admin\/users/, { timeout: 10000 }),
      page.getByRole('dialog').getByRole('button', { name: 'Заблокировать' }).click()
    ])

    // Wait for page to fully load
    await page.waitForLoadState('networkidle')

    // Add extra wait to ensure database transaction completes
    await page.waitForTimeout(2000)

    console.log(`✓ Suspend action completed, checking database...`)

    // Verify user is suspended in database
    const suspendedUser = await prisma.user.findUnique({
      where: { id: specialist.id }
    })
    expect(suspendedUser?.suspended).toBe(true)

    // Verify ModerationLog entry exists
    const suspendLog = await prisma.moderationLog.findFirst({
      where: {
        action: 'SUSPEND_USER',
        targetUserId: specialist.id,
        adminId: admin.id
      }
    })
    expect(suspendLog).toBeTruthy()
    expect(suspendLog?.reason).toContain('Модерация')

    console.log(`✓ User suspended successfully`)
    console.log(`✓ ModerationLog entry created for SUSPEND_USER`)

    // ========================================================================
    // STEP 4: Verify suspended user cannot login
    // ========================================================================

    // Clear admin session by deleting cookies
    await page.context().clearCookies()

    // Navigate to login page
    await page.goto('http://localhost:3000/login')
    await expect(page).toHaveURL(/\/login/)

    // Try to login as suspended user
    await page.fill('input[name="email"]', specialistEmail)
    await page.fill('input[name="password"]', specialistPassword)
    await page.click('button[type="submit"]')

    // Wait a moment for error message
    await page.waitForTimeout(1000)

    // Verify error message is displayed
    const errorMessage = page.locator('text=/suspended|заблокирован/i')
    await expect(errorMessage).toBeVisible()

    // Verify URL is still /login (no redirect)
    await expect(page).toHaveURL(/\/login/)

    console.log(`✓ Suspended user login blocked successfully`)

    // ========================================================================
    // STEP 5: Admin re-authentication
    // ========================================================================

    // Clear the form and login as admin again
    await page.fill('input[name="email"]', adminEmail)
    await page.fill('input[name="password"]', adminPassword)
    await page.click('button[type="submit"]')

    // Wait for redirect to the admin's home (login routes ADMINs to /admin, not /dashboard)
    await page.waitForURL(/\/admin/)
    await expect(page).toHaveURL(/\/admin/)

    console.log(`✓ Admin re-authenticated successfully`)

    // ========================================================================
    // STEP 6: Close gig via UI
    // ========================================================================

    await page.goto('http://localhost:3000/admin/gigs')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin\/gigs/)

    // Find the gig row by title (transported row markup — div rows, not a table)
    const gigRow = page.locator('[data-row="gig"]').filter({ hasText: gig.title })
    await expect(gigRow).toBeVisible()

    // Click the row's «Закрыть» → the destructive-confirm dialog opens (no reason field; hardcoded reason)
    await gigRow.getByRole('button', { name: 'Закрыть' }).click()

    // Confirm in the dialog and wait for the action to complete
    await Promise.all([
      page.waitForURL(/\/admin\/gigs/, { timeout: 10000 }),
      page.getByRole('dialog').getByRole('button', { name: 'Закрыть' }).click()
    ])

    // Wait for page to fully load
    await page.waitForLoadState('networkidle')

    // Add extra wait to ensure database transaction completes
    await page.waitForTimeout(2000)

    console.log(`✓ Close gig action completed, checking database...`)

    // Verify gig is closed in database
    const closedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(closedGig?.closedByAdmin).toBe(true)
    expect(closedGig?.closedAt).toBeTruthy()

    // Verify ModerationLog entry exists
    const closeLog = await prisma.moderationLog.findFirst({
      where: {
        action: 'CLOSE_GIG',
        targetGigId: gig.id,
        adminId: admin.id
      }
    })
    expect(closeLog).toBeTruthy()
    expect(closeLog?.reason).toContain('Закрыт модератором')

    console.log(`✓ Gig closed successfully`)
    console.log(`✓ ModerationLog entry created for CLOSE_GIG`)

    // ========================================================================
    // STEP 7: Verify moderation history
    // ========================================================================

    // Query all moderation logs for this admin
    const moderationLogs = await prisma.moderationLog.findMany({
      where: { adminId: admin.id },
      orderBy: { createdAt: 'asc' }
    })

    expect(moderationLogs.length).toBeGreaterThanOrEqual(2)

    // Verify SUSPEND_USER log
    const suspendLogVerify = moderationLogs.find(log => log.action === 'SUSPEND_USER')
    expect(suspendLogVerify).toBeTruthy()
    expect(suspendLogVerify?.targetUserId).toBe(specialist.id)
    expect(suspendLogVerify?.reason).toContain('Модерация')

    // Verify CLOSE_GIG log
    const closeLogVerify = moderationLogs.find(log => log.action === 'CLOSE_GIG')
    expect(closeLogVerify).toBeTruthy()
    expect(closeLogVerify?.targetGigId).toBe(gig.id)
    expect(closeLogVerify?.reason).toContain('Закрыт модератором')

    console.log(`✓ Moderation history verified: ${moderationLogs.length} log entries`)

    // ========================================================================
    // STEP 8: Final state verification
    // ========================================================================

    // Verify final state of all entities
    const finalSpecialist = await prisma.user.findUnique({
      where: { id: specialist.id }
    })
    const finalGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })

    expect(finalSpecialist?.suspended).toBe(true)
    expect(finalGig?.closedByAdmin).toBe(true)
    expect(finalGig?.closedAt).toBeTruthy()

    console.log(`✓ Final state verification passed`)
    console.log(`✓ Test completed successfully`)
  })
})
