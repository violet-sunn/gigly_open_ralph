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
import { createTestUser, createTestApplication, resetE2EDb } from '../helpers/seed'
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
    // FK-safe full reset (the shared E2E db may hold disputes/reviews/notifications referencing gigs+users).
    await resetE2EDb(prisma)
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

    // Category is the FK target for the create-gig chip — seed it idempotently (afterEach doesn't clear categories).
    await prisma.category.upsert({
      where: { slug: 'programming' },
      create: { slug: 'programming', name: 'Программирование', order: 2 },
      update: {},
    })

    await page.goto('http://localhost:3000/gigs/new')
    await expect(page).toHaveURL(/\/gigs\/new/)

    // Drive the rebuilt CreateGigDesign brief by its stable name= contract (category + criteria via the editor).
    await page.locator('input[name="title"]').fill('Разработка REST API для мобильного приложения')
    await page.getByText('Программирование', { exact: true }).click()
    await page.locator('textarea[name="description"]').fill('Необходимо разработать REST API для мобильного приложения. Требуется опыт работы с Node.js и PostgreSQL.')
    await page.locator('input[name="goal"]').fill('Запустить мобильное приложение с надёжным API')
    await page.locator('textarea[name="deliverables"]').fill('Готовый REST API с документацией OpenAPI и автотестами')

    // One criterion, long enough to clear createGig's ≥50-char acceptanceCriteria floor.
    await page.getByPlaceholder(/например/).fill('API проходит все интеграционные тесты и покрытие кода не ниже восьмидесяти процентов')
    await page.getByRole('button', { name: 'Добавить' }).click()

    await page.locator('input[name="budget"]').fill('1500') // 1500 roubles
    await page.locator('input[name="deadlineDays"]').fill('14')

    // Publish → the rebuilt flow redirects to the dedicated success screen.
    await page.getByRole('button', { name: 'Опубликовать гиг' }).click()
    await page.waitForURL('**/gigs/new/success')
    console.log('✓ Gig published, landed on /gigs/new/success')

    // Look up the created gig (newest for this client).
    const gigs = await prisma.gig.findMany({
      where: { clientId: client.id },
      orderBy: { createdAt: 'desc' },
      take: 1,
    })
    expect(gigs.length).toBeGreaterThan(0)
    const gigId = gigs[0].id
    console.log(`✓ Found created gig: ${gigId}`)
    expect(gigId).toBeTruthy()

    // Verify gig was created in database
    const gig = await prisma.gig.findUnique({ where: { id: gigId } })
    expect(gig).toBeTruthy()
    expect(gig?.status).toBe('OPEN')
    expect(gig?.budget).toBe(150000) // 1500 roubles = 150000 kopecks
    expect(gig?.serviceFee).toBe(26250) // 17.5% of budget (SSOT: lib/pricing.ts)
    expect(gig?.totalAmount).toBe(176250) // budget + serviceFee

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

    // Accept moved to the dedicated applications screen (ApplicationsDesign) in the reground.
    await page.goto(`http://localhost:3000/gigs/${gigId}/applications`)
    await page.waitForLoadState('networkidle')

    // Find and click the «Принять» button on the pending applicant card.
    const acceptButton = page.getByRole('button', { name: 'Принять' }).first()
    await expect(acceptButton).toBeVisible({ timeout: 5000 })

    // Click the accept button
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

    // Find and click the «Принять работу» button (rebuilt approve action).
    const approveButton = page.getByRole('button', { name: 'Принять работу' }).first()
    await expect(approveButton).toBeVisible({ timeout: 5000 })

    // Click the approve button
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

    // Find and click the «Отметить как оплаченный» button (rebuilt mark-paid action).
    const markPaidButton = page.getByRole('button', { name: 'Отметить как оплаченный' }).first()
    await expect(markPaidButton).toBeVisible({ timeout: 5000 })

    // Click the mark-paid button
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
    expect(finalGig?.serviceFee).toBe(26250) // 17.5% of budget (SSOT: lib/pricing.ts)
    expect(finalGig?.totalAmount).toBe(176250)

    console.log('✅ Complete client journey test passed!')
    console.log(`   Gig ID: ${gigId}`)
    console.log(`   Client: ${client.email}`)
    console.log(`   Specialist: ${specialist.email}`)
    console.log(`   Final Status: ${finalGig?.status}`)
  })
})
