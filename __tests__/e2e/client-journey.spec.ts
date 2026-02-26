/**
 * E2E Test: Complete Client Journey
 *
 * This test validates the entire client journey from registration to payment:
 * 1. Client registers and authenticates
 * 2. Client creates gig via UI
 * 3. Specialist applies (programmatic)
 * 4. Client accepts application via UI
 * 5. Specialist submits work (programmatic)
 * 6. Client approves work via UI
 * 7. Client marks as paid via UI
 * 8. Final state verification
 *
 * Uses hybrid approach: client actions via Playwright UI, specialist actions programmatically.
 */

import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createTestUser, createTestApplication } from '../helpers/seed'
import { createTestSession } from '../helpers/auth'

// Setup test database connection for E2E tests
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
})

const prisma = new PrismaClient({
  adapter: adapter as any
})

test.describe('Complete Client Journey E2E', () => {
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

  test('complete client journey from registration to payment', async ({ page }) => {
    // ========================================================================
    // STEP 1: Create and authenticate CLIENT user
    // ========================================================================
    // Note: We create the user programmatically because the current registration
    // UI doesn't include profile fields. This follows existing E2E test patterns.

    const clientEmail = `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: clientEmail,
      password: 'TestPassword123!',
      companyName: 'ООО "ТехноСтарт"',
      inn: '7743013902'
    })

    // Verify user was created successfully
    const verifyUser = await prisma.user.findUnique({
      where: { id: client.id },
      include: { clientProfile: true }
    })
    expect(verifyUser).toBeTruthy()
    expect(verifyUser?.clientProfile).toBeTruthy()
    console.log(`✓ Created CLIENT user: ${client.id} (${client.email})`)

    // Set authenticated session
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

    // Verify authentication by navigating to dashboard
    await page.goto('http://localhost:3000/dashboard')
    await expect(page).toHaveURL(/\/dashboard/)

    // Wait a moment to ensure database sync
    await page.waitForTimeout(1000)

    // ========================================================================
    // STEP 2: Client creates gig via UI
    // ========================================================================

    await page.goto('http://localhost:3000/gigs/new')
    await expect(page).toHaveURL(/\/dashboard\/gigs\/new/)

    // Fill gig creation form with Russian data
    await page.fill('input[name="title"]', 'Разработка REST API для мобильного приложения')
    await page.fill('textarea[name="description"]', 'Необходимо разработать REST API для мобильного приложения. Требуется опыт работы с Node.js и PostgreSQL. Проект включает аутентификацию, работу с базой данных и документацию.')
    await page.fill('textarea[name="acceptanceCriteria"]', 'API должен поддерживать CRUD операции для всех основных сущностей, иметь документацию в формате OpenAPI, покрытие тестами не менее 80%, и быть готовым к деплою на production.')
    await page.fill('input[name="budget"]', '1500') // 1500 roubles
    await page.fill('input[name="tags"]', 'React,TypeScript,Node.js')

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for redirect - could be to dashboard or gig detail page
    await page.waitForLoadState('networkidle')

    // Check if we were redirected to dashboard (gig created successfully)
    const currentUrl = page.url()
    console.log(`✓ After gig creation, redirected to: ${currentUrl}`)

    // If redirected to dashboard, find the gig we just created
    let gigId: string
    if (currentUrl.includes('/gigs/')) {
      // Redirected to gig detail page
      gigId = currentUrl.split('/').pop() as string
    } else {
      // Redirected to dashboard, need to find the gig
      const gigs = await prisma.gig.findMany({
        where: { clientId: client.id },
        orderBy: { createdAt: 'desc' },
        take: 1
      })
      expect(gigs.length).toBeGreaterThan(0)
      gigId = gigs[0].id
      console.log(`✓ Found created gig: ${gigId}`)
    }

    expect(gigId).toBeTruthy()

    // Verify gig was created in database
    const gig = await prisma.gig.findUnique({ where: { id: gigId } })
    expect(gig).toBeTruthy()
    expect(gig?.status).toBe('OPEN')
    expect(gig?.budget).toBe(150000) // 1500 roubles = 150000 kopecks
    expect(gig?.serviceFee).toBe(15000) // 10% of budget
    expect(gig?.totalAmount).toBe(165000) // budget + serviceFee

    // ========================================================================
    // STEP 3: Specialist applies to gig (programmatic)
    // ========================================================================

    const specialistEmail = `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      email: specialistEmail,
      password: 'TestPassword123!',
      displayName: 'Александр Петров',
      techStack: 'React, TypeScript, Node.js, PostgreSQL',
      experienceLevel: 'SENIOR'
    })

    const application = await createTestApplication(prisma, {
      gigId: gigId,
      specialistId: specialist.id,
      approach: 'Буду использовать архитектуру REST с валидацией через Zod. Для аутентификации применю JWT токены с refresh механизмом. База данных PostgreSQL с Prisma ORM. Реализую полное покрытие тестами через Jest.',
      questions: 'Какие требования к производительности API? Ожидаемая нагрузка в RPS? Нужна ли документация API в формате OpenAPI или Swagger? Какая версия Node.js используется в проекте?',
      estimatedEffort: '2 недели (80 часов)'
    })

    expect(application.status).toBe('PENDING')
    expect(application.gigId).toBe(gigId)
    expect(application.specialistId).toBe(specialist.id)

    // ========================================================================
    // STEP 4: Client reviews and accepts application via UI
    // ========================================================================

    // Navigate to the gig detail page to see the application
    await page.goto(`http://localhost:3000/gigs/${gigId}`)
    await page.waitForLoadState('networkidle')

    // Find and click the Accept button for the application
    const acceptButton = page.locator('button:has-text("Accept")').first()
    await expect(acceptButton).toBeVisible({ timeout: 5000 })

    // Click the Accept button
    await acceptButton.click()

    // Wait for the page to reload after the server action
    await page.waitForLoadState('networkidle')

    // Poll the database until the status changes (with timeout)
    let gigAfterAccept = null
    for (let i = 0; i < 10; i++) {
      gigAfterAccept = await prisma.gig.findUnique({
        where: { id: gigId },
        include: { applications: true }
      })

      if (gigAfterAccept?.status === 'IN_PROGRESS') {
        break
      }

      await page.waitForTimeout(500)
    }

    console.log(`✓ Gig status after accept: ${gigAfterAccept?.status}`)
    console.log(`✓ Assigned specialist: ${gigAfterAccept?.assignedSpecialistId}`)

    expect(gigAfterAccept?.status).toBe('IN_PROGRESS')
    expect(gigAfterAccept?.assignedSpecialistId).toBe(specialist.id)

    const acceptedApp = gigAfterAccept?.applications.find(a => a.id === application.id)
    expect(acceptedApp?.status).toBe('ACCEPTED')

    // ========================================================================
    // STEP 5: Specialist submits work (programmatic via database)
    // ========================================================================
    // Note: We update the database directly here because calling server actions
    // outside of a proper HTTP request context causes Next.js errors in E2E tests.
    // This simulates the specialist submitting work.

    await prisma.gig.update({
      where: { id: gigId },
      data: {
        status: 'REVIEW'
      }
    })

    // Verify gig status changed to REVIEW
    const gigAfterSubmit = await prisma.gig.findUnique({ where: { id: gigId } })
    expect(gigAfterSubmit?.status).toBe('REVIEW')
    console.log(`✓ Specialist submitted work, gig status: ${gigAfterSubmit?.status}`)

    // ========================================================================
    // STEP 6: Client approves work via UI
    // ========================================================================

    // Navigate to the gig detail page
    await page.goto(`http://localhost:3000/gigs/${gigId}`)
    await page.waitForLoadState('networkidle')

    // Find and click the Approve Work button
    const approveButton = page.locator('button:has-text("Approve")').first()
    await expect(approveButton).toBeVisible({ timeout: 5000 })

    // Click the Approve button
    await approveButton.click()

    // Wait for the page to reload
    await page.waitForLoadState('networkidle')

    // Poll the database until the status changes (with timeout)
    let gigAfterApprove = null
    for (let i = 0; i < 10; i++) {
      gigAfterApprove = await prisma.gig.findUnique({ where: { id: gigId } })

      if (gigAfterApprove?.status === 'COMPLETED') {
        break
      }

      await page.waitForTimeout(500)
    }

    console.log(`✓ Gig status after approve: ${gigAfterApprove?.status}`)

    // Verify gig status changed to COMPLETED
    expect(gigAfterApprove?.status).toBe('COMPLETED')

    // ========================================================================
    // STEP 7: Client marks gig as paid via UI
    // ========================================================================

    // Navigate to the gig detail page
    await page.goto(`http://localhost:3000/gigs/${gigId}`)
    await page.waitForLoadState('networkidle')

    // Find and click the Mark as Paid button
    const markPaidButton = page.locator('button:has-text("Mark as Paid")').first()
    await expect(markPaidButton).toBeVisible({ timeout: 5000 })

    // Click the Mark as Paid button
    await markPaidButton.click()

    // Wait for the page to reload
    await page.waitForLoadState('networkidle')

    // Poll the database until the status changes (with timeout)
    let gigAfterPaid = null
    for (let i = 0; i < 10; i++) {
      gigAfterPaid = await prisma.gig.findUnique({ where: { id: gigId } })

      if (gigAfterPaid?.status === 'PAID') {
        break
      }

      await page.waitForTimeout(500)
    }

    console.log(`✓ Gig status after mark as paid: ${gigAfterPaid?.status}`)

    // Verify gig status changed to PAID
    expect(gigAfterPaid?.status).toBe('PAID')
    expect(gigAfterPaid?.paidAt).toBeTruthy()

    // ========================================================================
    // STEP 8: Final state verification
    // ========================================================================

    const finalGig = await prisma.gig.findUnique({
      where: { id: gigId },
      include: {
        client: { include: { clientProfile: true } },
        assignedSpecialist: { include: { specialistProfile: true } },
        applications: true
      }
    })

    // Verify gig status and timestamps
    expect(finalGig?.status).toBe('PAID')
    expect(finalGig?.assignedSpecialistId).toBe(specialist.id)
    expect(finalGig?.paidAt).toBeTruthy()

    // Verify application status
    const finalApp = finalGig?.applications.find(a => a.specialistId === specialist.id)
    expect(finalApp?.status).toBe('ACCEPTED')

    // Verify user profiles
    expect(finalGig?.client.role).toBe('CLIENT')
    expect(finalGig?.client.clientProfile).toBeTruthy()
    expect(finalGig?.client.clientProfile?.companyName).toBe('ООО "ТехноСтарт"')
    expect(finalGig?.client.clientProfile?.inn).toBe('7743013902')

    expect(finalGig?.assignedSpecialist?.role).toBe('SPECIALIST')
    expect(finalGig?.assignedSpecialist?.specialistProfile).toBeTruthy()
    expect(finalGig?.assignedSpecialist?.specialistProfile?.displayName).toBe('Александр Петров')

    // Verify budget calculations
    expect(finalGig?.budget).toBe(150000)
    expect(finalGig?.serviceFee).toBe(15000)
    expect(finalGig?.totalAmount).toBe(165000)

    console.log('✅ Complete client journey test passed!')
    console.log(`   Gig ID: ${gigId}`)
    console.log(`   Client: ${client.email}`)
    console.log(`   Specialist: ${specialist.email}`)
    console.log(`   Final Status: ${finalGig?.status}`)
  })
})
