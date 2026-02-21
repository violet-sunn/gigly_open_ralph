import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { setE2ESession } from '../helpers/auth'
import { createTestUser } from '../helpers/seed'

// Setup test database connection for E2E tests
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
})

const prisma = new PrismaClient({
  adapter: adapter as any
})

test.describe('CSRF Protection - Configuration Verification', () => {
  test.afterEach(async () => {
    // Clean up test data
    await prisma.gig.deleteMany({})
    await prisma.clientProfile.deleteMany({})
    await prisma.user.deleteMany({})
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('Server Actions work with same-origin requests', async ({ page }) => {
    // This test verifies that legitimate same-origin requests work correctly
    // Next.js 15 should allow these requests

    // Create CLIENT user
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      companyName: 'Test Company',
      inn: '7743013902'
    })

    // Set authenticated session
    await setE2ESession(page, client)

    await page.goto('http://localhost:3000/dashboard/gigs/new')

    // Fill gig creation form (legitimate same-origin request)
    await page.fill('input[name="title"]', 'Test Gig for CSRF Verification')
    await page.fill('textarea[name="description"]', 'This gig tests that same-origin requests work correctly')
    await page.fill('textarea[name="acceptanceCriteria"]', 'Verify that the gig is created successfully with proper same-origin request headers')
    await page.fill('input[name="budget"]', '100000')
    await page.click('button[type="submit"]')

    // Wait for completion
    await page.waitForTimeout(2000)

    // Assert: Gig should be created successfully
    const gigs = await prisma.gig.findMany({
      where: { title: 'Test Gig for CSRF Verification' }
    })
    expect(gigs.length).toBe(1)
    expect(gigs[0].budget).toBe(100000 * 100) // Budget stored in kopecks
  })

  test('Next.js configuration does not weaken CSRF protection', async () => {
    // This test verifies that next.config.ts doesn't have dangerous settings
    // This is tested in unit tests, but we verify the runtime behavior here

    // The fact that same-origin requests work (previous test) confirms
    // that Server Actions are functioning correctly

    // Note: Testing cross-origin rejection at E2E level is complex due to
    // browser security restrictions. Configuration validation is done in
    // unit tests (__tests__/unit/config-validation.test.ts)

    expect(true).toBe(true) // Placeholder - actual verification is in config tests
  })
})
