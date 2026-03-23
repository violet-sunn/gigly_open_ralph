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

test.describe('Application Confirmation Dialogs', () => {
  test.afterEach(async () => {
    // Clean up test data
    await prisma.message.deleteMany({})
    await prisma.application.deleteMany({})
    await prisma.gig.deleteMany({})
    await prisma.user.deleteMany({})
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test.describe('Reject Application Confirmation', () => {
    test('clicking Reject opens confirmation dialog', async ({ page }) => {
      // Create client and specialist users
      const clientEmail = `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: clientEmail,
        password: 'TestPassword123!',
        companyName: 'Test Company',
        inn: '1234567890'
      })

      const specialistEmail = `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: specialistEmail,
        password: 'TestPassword123!',
        displayName: 'Test Specialist',
        techStack: 'React, TypeScript',
        experienceLevel: 'SENIOR'
      })

      // Client creates a gig
      const gig = await createTestGig(prisma, {
        clientId: client.id,
        title: 'Test Gig for Rejection',
        description: 'Testing rejection confirmation dialog functionality',
        acceptanceCriteria: 'Must work correctly with confirmation dialog and prevent accidental rejections',
        budget: 50000,
        tags: 'React,TypeScript',
        status: 'OPEN'
      })

      // Specialist applies to the gig
      await prisma.application.create({
        data: {
          gigId: gig.id,
          specialistId: specialist.id,
          approach: 'I will implement this feature using React and TypeScript with proper testing coverage and documentation',
          questions: 'What is the expected timeline for this project? Are there any specific design requirements?',
          estimatedEffort: '2 weeks',
          status: 'PENDING'
        }
      })

      // Client logs in and views the application
      await createTestSession(page, client.id, client.email, 'CLIENT')
      await page.goto(`/gigs/${gig.id}`)

      // Click Reject button
      await page.click('button:has-text("Reject")')

      // Verify confirmation dialog appears
      const dialog = page.locator('[role="dialog"]')
      await expect(dialog).toBeVisible()
      await expect(page.locator('#dialog-title')).toHaveText('Reject Application')
      await expect(page.locator('#dialog-message')).toContainText('This will permanently reject this application')
    })

    test('clicking Confirm in dialog executes rejection', async ({ page }) => {
      const clientEmail = `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: clientEmail,
        password: 'TestPassword123!',
        companyName: 'Test Company',
        inn: '1234567890'
      })

      const specialistEmail = `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: specialistEmail,
        password: 'TestPassword123!',
        displayName: 'Test Specialist',
        techStack: 'React, TypeScript',
        experienceLevel: 'SENIOR'
      })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        title: 'Test Gig for Rejection Confirm',
        description: 'Testing rejection execution after confirmation',
        acceptanceCriteria: 'Must reject application after user confirms in dialog',
        budget: 50000,
        tags: 'React,TypeScript',
        status: 'OPEN'
      })

      await prisma.application.create({
        data: {
          gigId: gig.id,
          specialistId: specialist.id,
          approach: 'I will implement this feature using React and TypeScript with proper testing coverage and documentation',
          questions: 'What is the expected timeline for this project? Are there any specific design requirements?',
          estimatedEffort: '2 weeks',
          status: 'PENDING'
        }
      })

      await createTestSession(page, client.id, client.email, 'CLIENT')
      await page.goto(`/gigs/${gig.id}`)

      // Click Reject and confirm
      await page.click('button:has-text("Reject")')
      await page.locator('[role="dialog"] >> button:has-text("Confirm")').click()

      // Verify application is rejected
      await expect(page.locator('text=REJECTED')).toBeVisible()
    })

    test('clicking Cancel in dialog closes without rejecting', async ({ page }) => {
      const clientEmail = `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: clientEmail,
        password: 'TestPassword123!',
        companyName: 'Test Company',
        inn: '1234567890'
      })

      const specialistEmail = `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: specialistEmail,
        password: 'TestPassword123!',
        displayName: 'Test Specialist',
        techStack: 'React, TypeScript',
        experienceLevel: 'SENIOR'
      })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        title: 'Test Gig for Rejection Cancel',
        description: 'Testing rejection cancellation',
        acceptanceCriteria: 'Must not reject when user cancels in dialog',
        budget: 50000,
        tags: 'React,TypeScript',
        status: 'OPEN'
      })

      await prisma.application.create({
        data: {
          gigId: gig.id,
          specialistId: specialist.id,
          approach: 'I will implement this feature using React and TypeScript with proper testing coverage and documentation',
          questions: 'What is the expected timeline for this project? Are there any specific design requirements?',
          estimatedEffort: '2 weeks',
          status: 'PENDING'
        }
      })

      await createTestSession(page, client.id, client.email, 'CLIENT')
      await page.goto(`/gigs/${gig.id}`)

      // Click Reject and cancel
      await page.click('button:has-text("Reject")')
      await page.locator('[role="dialog"] >> button:has-text("Cancel")').click()

      // Verify dialog is closed
      await expect(page.locator('[role="dialog"]')).not.toBeVisible()

      // Verify application is still pending (Accept/Reject buttons still visible)
      await expect(page.locator('button:has-text("Accept")')).toBeVisible()
      await expect(page.locator('button:has-text("Reject")')).toBeVisible()
    })

    test('Escape key closes dialog without rejecting', async ({ page }) => {
      const clientEmail = `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: clientEmail,
        password: 'TestPassword123!',
        companyName: 'Test Company',
        inn: '1234567890'
      })

      const specialistEmail = `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: specialistEmail,
        password: 'TestPassword123!',
        displayName: 'Test Specialist',
        techStack: 'React, TypeScript',
        experienceLevel: 'SENIOR'
      })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        title: 'Test Gig for Escape Key',
        description: 'Testing Escape key functionality',
        acceptanceCriteria: 'Must close dialog with Escape key without rejecting',
        budget: 50000,
        tags: 'React,TypeScript',
        status: 'OPEN'
      })

      await prisma.application.create({
        data: {
          gigId: gig.id,
          specialistId: specialist.id,
          approach: 'I will implement this feature using React and TypeScript with proper testing coverage and documentation',
          questions: 'What is the expected timeline for this project?',
          estimatedEffort: '2 weeks',
          status: 'PENDING'
        }
      })

      await createTestSession(page, client.id, client.email, 'CLIENT')
      await page.goto(`/gigs/${gig.id}`)

      // Open dialog
      await page.click('button:has-text("Reject")')
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      // Press Escape
      await page.keyboard.press('Escape')

      // Verify dialog is closed
      await expect(page.locator('[role="dialog"]')).not.toBeVisible()

      // Verify application is still pending
      await expect(page.locator('button:has-text("Reject")')).toBeVisible()
    })
  })

  test.describe('Withdraw Application Confirmation', () => {
    test('clicking Withdraw opens confirmation dialog', async ({ page }) => {
      const clientEmail = `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: clientEmail,
        password: 'TestPassword123!',
        companyName: 'Test Company',
        inn: '1234567890'
      })

      const specialistEmail = `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: specialistEmail,
        password: 'TestPassword123!',
        displayName: 'Test Specialist',
        techStack: 'React, TypeScript',
        experienceLevel: 'SENIOR'
      })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        title: 'Test Gig for Withdrawal',
        description: 'Testing withdrawal confirmation dialog',
        acceptanceCriteria: 'Must work correctly with confirmation dialog',
        budget: 50000,
        tags: 'React,TypeScript',
        status: 'OPEN'
      })

      await prisma.application.create({
        data: {
          gigId: gig.id,
          specialistId: specialist.id,
          approach: 'I will implement this feature using React and TypeScript with proper testing coverage and documentation',
          questions: 'What is the expected timeline for this project?',
          estimatedEffort: '2 weeks',
          status: 'PENDING'
        }
      })

      await createTestSession(page, specialist.id, specialist.email, 'SPECIALIST')
      await page.goto(`/gigs/${gig.id}`)

      // Click Withdraw button
      await page.click('button:has-text("Withdraw Application")')

      // Verify confirmation dialog appears
      const dialog = page.locator('[role="dialog"]')
      await expect(dialog).toBeVisible()
      await expect(page.locator('#dialog-title')).toHaveText('Withdraw Application')
      await expect(page.locator('#dialog-message')).toContainText('You will not be able to reapply')
    })

    test('clicking Confirm in dialog executes withdrawal', async ({ page }) => {
      const clientEmail = `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: clientEmail,
        password: 'TestPassword123!',
        companyName: 'Test Company',
        inn: '1234567890'
      })

      const specialistEmail = `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: specialistEmail,
        password: 'TestPassword123!',
        displayName: 'Test Specialist',
        techStack: 'React, TypeScript',
        experienceLevel: 'SENIOR'
      })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        title: 'Test Gig for Withdrawal Confirm',
        description: 'Testing withdrawal execution',
        acceptanceCriteria: 'Must withdraw application after confirmation',
        budget: 50000,
        tags: 'React,TypeScript',
        status: 'OPEN'
      })

      await prisma.application.create({
        data: {
          gigId: gig.id,
          specialistId: specialist.id,
          approach: 'I will implement this feature using React and TypeScript with proper testing coverage and documentation',
          questions: 'What is the expected timeline for this project?',
          estimatedEffort: '2 weeks',
          status: 'PENDING'
        }
      })

      await createTestSession(page, specialist.id, specialist.email, 'SPECIALIST')
      await page.goto(`/gigs/${gig.id}`)

      // Click Withdraw and confirm
      await page.click('button:has-text("Withdraw Application")')
      await page.locator('[role="dialog"] >> button:has-text("Confirm")').click()

      // Verify application is withdrawn
      await expect(page.locator('button:has-text("Withdraw Application")')).not.toBeVisible()
      await expect(page.locator('text=WITHDRAWN')).toBeVisible()
    })

    test('clicking Cancel in dialog closes without withdrawing', async ({ page }) => {
      const clientEmail = `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      const client = await createTestUser(prisma, {
        role: 'CLIENT',
        email: clientEmail,
        password: 'TestPassword123!',
        companyName: 'Test Company',
        inn: '1234567890'
      })

      const specialistEmail = `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: specialistEmail,
        password: 'TestPassword123!',
        displayName: 'Test Specialist',
        techStack: 'React, TypeScript',
        experienceLevel: 'SENIOR'
      })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        title: 'Test Gig for Withdrawal Cancel',
        description: 'Testing withdrawal cancellation',
        acceptanceCriteria: 'Must not withdraw when cancelled',
        budget: 50000,
        tags: 'React,TypeScript',
        status: 'OPEN'
      })

      await prisma.application.create({
        data: {
          gigId: gig.id,
          specialistId: specialist.id,
          approach: 'I will implement this feature using React and TypeScript with proper testing coverage and documentation',
          questions: 'What is the expected timeline for this project?',
          estimatedEffort: '2 weeks',
          status: 'PENDING'
        }
      })

      await createTestSession(page, specialist.id, specialist.email, 'SPECIALIST')
      await page.goto(`/gigs/${gig.id}`)

      // Click Withdraw and cancel
      await page.click('button:has-text("Withdraw Application")')
      await page.locator('[role="dialog"] >> button:has-text("Cancel")').click()

      // Verify dialog is closed
      await expect(page.locator('[role="dialog"]')).not.toBeVisible()

      // Verify Withdraw button is still visible
      await expect(page.locator('button:has-text("Withdraw Application")')).toBeVisible()
    })
  })
})
