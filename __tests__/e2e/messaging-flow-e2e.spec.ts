/**
 * E2E Test: Messaging Flow Between Client and Specialist
 *
 * This test validates the complete messaging flow from both user perspectives:
 * 1. Setup: Create CLIENT, OPEN gig, SPECIALIST, accept application (programmatic)
 * 2. Client sends message via UI
 * 3. Specialist views message via UI
 * 4. Specialist sends reply via UI
 * 5. Client views reply via UI
 * 6. Verify chronological ordering
 * 7. Final state verification
 *
 * Uses hybrid approach: UI interactions for messaging, programmatic setup and session management.
 */

import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createTestUser, createTestGig, createTestApplication } from '../helpers/seed'
import { createTestSession } from '../helpers/auth'

// Setup test database connection for E2E tests
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
})

const prisma = new PrismaClient({
  adapter: adapter as any
})

test.describe('Messaging Flow E2E', () => {
  test.afterEach(async () => {
    // Clean up test data in correct order (children before parents)
    await prisma.message.deleteMany({})
    await prisma.application.deleteMany({})
    await prisma.gig.deleteMany({})
    await prisma.user.deleteMany({})
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('complete messaging flow between client and specialist', async ({ page }) => {
    // ========================================================================
    // STEP 1: Setup - Create users, gig, and application (programmatic)
    // ========================================================================

    // Create CLIENT user with Russian profile data
    const clientEmail = `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: clientEmail,
      password: 'TestPassword123!',
      companyName: 'ООО "ТехноСтарт"',
      inn: '7743013902'
    })

    // Verify client was created
    const verifyClient = await prisma.user.findUnique({
      where: { id: client.id },
      include: { clientProfile: true }
    })
    expect(verifyClient).toBeTruthy()
    expect(verifyClient?.clientProfile).toBeTruthy()
    console.log(`✓ Created CLIENT user: ${client.id} (${client.email})`)

    // Create OPEN gig with Russian content
    const gig = await createTestGig(prisma, {
      clientId: client.id,
      title: 'Разработка REST API для мобильного приложения',
      description: 'Необходимо разработать REST API для мобильного приложения. Требуется опыт работы с Node.js и PostgreSQL. Проект включает аутентификацию, работу с базой данных и документацию.',
      acceptanceCriteria: 'API должен поддерживать CRUD операции для всех основных сущностей, иметь документацию в формате OpenAPI, покрытие тестами не менее 80%, и быть готовым к деплою на production.',
      budget: 150000, // 1500 roubles in kopecks
      tags: 'React,TypeScript,Node.js',
      status: 'OPEN'
    })

    // Verify gig was created
    const verifyGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(verifyGig).toBeTruthy()
    expect(verifyGig?.status).toBe('OPEN')
    console.log(`✓ Created OPEN gig: ${gig.id}`)

    // Create SPECIALIST user with Russian profile data
    const specialistEmail = `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      email: specialistEmail,
      password: 'TestPassword123!',
      displayName: 'Дмитрий Соколов',
      techStack: 'React, TypeScript, Node.js, PostgreSQL',
      experienceLevel: 'SENIOR'
    })

    // Verify specialist was created
    const verifySpecialist = await prisma.user.findUnique({
      where: { id: specialist.id },
      include: { specialistProfile: true }
    })
    expect(verifySpecialist).toBeTruthy()
    expect(verifySpecialist?.specialistProfile).toBeTruthy()
    console.log(`✓ Created SPECIALIST user: ${specialist.id} (${specialist.email})`)

    // Create application with Russian structured fields
    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      approach: 'Буду использовать архитектуру REST с валидацией через Zod. Для аутентификации применю JWT токены с refresh механизмом. База данных PostgreSQL с Prisma ORM. Реализую полное покрытие тестами через Jest. Документация будет в формате OpenAPI 3.0.',
      questions: 'Какие требования к производительности API? Ожидаемая нагрузка в RPS? Нужна ли документация API в формате OpenAPI или Swagger? Какая версия Node.js используется в проекте? Есть ли требования к логированию и мониторингу?',
      estimatedEffort: '2 недели (80 часов)',
      status: 'ACCEPTED'
    })

    expect(application.status).toBe('ACCEPTED')
    console.log(`✓ Created ACCEPTED application: ${application.id}`)

    // Update gig to IN_PROGRESS with assignedSpecialistId
    await prisma.gig.update({
      where: { id: gig.id },
      data: {
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      }
    })

    // Verify gig status and assignment
    const gigAfterSetup = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(gigAfterSetup?.status).toBe('IN_PROGRESS')
    expect(gigAfterSetup?.assignedSpecialistId).toBe(specialist.id)
    console.log(`✓ Setup complete: Gig ${gig.id} is IN_PROGRESS with assigned specialist`)

    // ========================================================================
    // STEP 2: Client sends message (UI)
    // ========================================================================

    // Authenticate as client
    const clientToken = await createTestSession(client)
    await page.context().addCookies([
      {
        name: 'session',
        value: clientToken,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
      }
    ])

    // Navigate to gig detail page
    await page.goto(`http://localhost:3000/dashboard/gigs/${gig.id}`)
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(new RegExp(`/dashboard/gigs/${gig.id}`))
    console.log(`✓ Client authenticated and navigated to gig detail page`)

    // Fill and submit message form
    const clientMessage = 'Добрый день! Когда сможете начать работу? Есть ли у вас опыт с PostgreSQL?'
    const messageTextarea = page.locator('textarea[name="content"]')
    await expect(messageTextarea).toBeVisible({ timeout: 5000 })
    await messageTextarea.fill(clientMessage)

    // Submit the message
    const submitButton = page.locator('form').filter({ has: messageTextarea }).locator('button[type="submit"]')
    await submitButton.click()
    await page.waitForLoadState('networkidle')

    // Wait for database sync
    await page.waitForTimeout(500)

    // Verify message appears on page
    const clientMessageOnPage = page.locator(`text=${clientMessage}`)
    await expect(clientMessageOnPage).toBeVisible({ timeout: 5000 })
    console.log(`✓ Client sent message: "${clientMessage.substring(0, 50)}..."`)

    // Verify message in database
    const messagesAfterClient = await prisma.message.findMany({
      where: { gigId: gig.id }
    })
    expect(messagesAfterClient.length).toBe(1)
    expect(messagesAfterClient[0].senderId).toBe(client.id)
    expect(messagesAfterClient[0].content).toBe(clientMessage)
    console.log(`✓ Message verified in database (ID: ${messagesAfterClient[0].id})`)

    // Clear cookies to logout
    await page.context().clearCookies()
    console.log(`✓ Client logged out (cookies cleared)`)

    // ========================================================================
    // STEP 3: Specialist views message (UI)
    // ========================================================================

    // Authenticate as specialist
    const specialistToken = await createTestSession(specialist)
    await page.context().addCookies([
      {
        name: 'session',
        value: specialistToken,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
      }
    ])

    // Navigate to gig detail page
    await page.goto(`http://localhost:3000/dashboard/gigs/${gig.id}`)
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(new RegExp(`/dashboard/gigs/${gig.id}`))
    console.log(`✓ Specialist authenticated and navigated to gig detail page`)

    // Verify client's message is visible
    const clientMessageVisible = page.locator(`text=${clientMessage}`)
    await expect(clientMessageVisible).toBeVisible({ timeout: 5000 })
    console.log(`✓ Specialist can see client's message`)

    // ========================================================================
    // STEP 4: Specialist sends reply (UI)
    // ========================================================================

    // Fill and submit reply
    const specialistReply = 'Могу начать завтра. Опыт с PostgreSQL более 5 лет. Уточните требования к производительности API.'
    const replyTextarea = page.locator('textarea[name="content"]')
    await expect(replyTextarea).toBeVisible({ timeout: 5000 })
    await replyTextarea.fill(specialistReply)

    // Submit the reply
    const replySubmitButton = page.locator('form').filter({ has: replyTextarea }).locator('button[type="submit"]')
    await replySubmitButton.click()
    await page.waitForLoadState('networkidle')

    // Wait for database sync
    await page.waitForTimeout(500)

    // Verify reply appears on page
    const specialistReplyOnPage = page.locator(`text=${specialistReply}`)
    await expect(specialistReplyOnPage).toBeVisible({ timeout: 5000 })
    console.log(`✓ Specialist sent reply: "${specialistReply.substring(0, 50)}..."`)

    // Verify reply in database
    const messagesAfterSpecialist = await prisma.message.findMany({
      where: { gigId: gig.id },
      orderBy: { createdAt: 'asc' }
    })
    expect(messagesAfterSpecialist.length).toBe(2)
    expect(messagesAfterSpecialist[1].senderId).toBe(specialist.id)
    expect(messagesAfterSpecialist[1].content).toBe(specialistReply)
    console.log(`✓ Reply verified in database (ID: ${messagesAfterSpecialist[1].id})`)

    // Clear cookies to logout
    await page.context().clearCookies()
    console.log(`✓ Specialist logged out (cookies cleared)`)

    // ========================================================================
    // STEP 5: Client views reply (UI)
    // ========================================================================

    // Re-authenticate as client
    const clientToken2 = await createTestSession(client)
    await page.context().addCookies([
      {
        name: 'session',
        value: clientToken2,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
      }
    ])

    // Navigate to gig detail page
    await page.goto(`http://localhost:3000/dashboard/gigs/${gig.id}`)
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(new RegExp(`/dashboard/gigs/${gig.id}`))
    console.log(`✓ Client re-authenticated and navigated to gig detail page`)

    // Verify both messages are visible
    const clientMessageVisible2 = page.locator(`text=${clientMessage}`)
    await expect(clientMessageVisible2).toBeVisible({ timeout: 5000 })
    const specialistReplyVisible = page.locator(`text=${specialistReply}`)
    await expect(specialistReplyVisible).toBeVisible({ timeout: 5000 })
    console.log(`✓ Client can see both messages (original and reply)`)

    // ========================================================================
    // STEP 6: Verify chronological ordering
    // ========================================================================

    // Query messages from database in chronological order
    const messages = await prisma.message.findMany({
      where: { gigId: gig.id },
      orderBy: { createdAt: 'asc' },
      include: { sender: true }
    })

    // Verify message count
    expect(messages.length).toBe(2)

    // Verify first message is from client
    expect(messages[0].senderId).toBe(client.id)
    expect(messages[0].content).toBe(clientMessage)

    // Verify second message is from specialist
    expect(messages[1].senderId).toBe(specialist.id)
    expect(messages[1].content).toBe(specialistReply)

    // Verify chronological order (timestamps)
    expect(messages[0].createdAt.getTime()).toBeLessThan(messages[1].createdAt.getTime())

    console.log(`✓ Messages are ordered chronologically:`)
    console.log(`  1. Client message (${messages[0].createdAt.toISOString()})`)
    console.log(`  2. Specialist reply (${messages[1].createdAt.toISOString()})`)

    // ========================================================================
    // STEP 7: Final state verification
    // ========================================================================

    const finalGig = await prisma.gig.findUnique({
      where: { id: gig.id },
      include: {
        client: { include: { clientProfile: true } },
        assignedSpecialist: { include: { specialistProfile: true } },
        applications: true,
        messages: { orderBy: { createdAt: 'asc' }, include: { sender: true } }
      }
    })

    // Verify gig state
    expect(finalGig?.status).toBe('IN_PROGRESS')
    expect(finalGig?.assignedSpecialistId).toBe(specialist.id)

    // Verify application state
    const finalApp = finalGig?.applications.find(a => a.specialistId === specialist.id)
    expect(finalApp?.status).toBe('ACCEPTED')

    // Verify messages
    expect(finalGig?.messages.length).toBe(2)
    expect(finalGig?.messages[0].senderId).toBe(client.id)
    expect(finalGig?.messages[0].content).toBe(clientMessage)
    expect(finalGig?.messages[1].senderId).toBe(specialist.id)
    expect(finalGig?.messages[1].content).toBe(specialistReply)

    // Verify user profiles
    expect(finalGig?.client.role).toBe('CLIENT')
    expect(finalGig?.client.clientProfile?.companyName).toBe('ООО "ТехноСтарт"')
    expect(finalGig?.client.clientProfile?.inn).toBe('7743013902')

    expect(finalGig?.assignedSpecialist?.role).toBe('SPECIALIST')
    expect(finalGig?.assignedSpecialist?.specialistProfile?.displayName).toBe('Дмитрий Соколов')
    expect(finalGig?.assignedSpecialist?.specialistProfile?.techStack).toBe('React, TypeScript, Node.js, PostgreSQL')
    expect(finalGig?.assignedSpecialist?.specialistProfile?.experienceLevel).toBe('SENIOR')

    console.log('✅ Complete messaging flow test passed!')
    console.log(`   Gig ID: ${gig.id}`)
    console.log(`   Client: ${client.email}`)
    console.log(`   Specialist: ${specialist.email}`)
    console.log(`   Messages: ${finalGig?.messages.length}`)
    console.log(`   Final Status: ${finalGig?.status}`)
  })
})
