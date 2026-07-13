/**
 * E2E Test: Messaging Flow Between Client and Specialist (via the rebuilt /chats inbox)
 *
 * e2e-chats (reconciliation #9): the gig-detail screen no longer embeds a chat — all messaging lives at /chats
 * (app/(protected)/chats/ChatsDesign.tsx). This test drives the complete two-way flow through the /chats composer
 * (input[name="content"], aria-label «Сообщение» + send «Отправить»). The underlying sendMessage is UNCHANGED — it
 * still validates participant + assignment and redirects to /gigs/<id> — so each send lands on /gigs/<id> and we
 * re-open /chats?gig=<id> to read the thread back. The composer renders on direct /chats?gig navigation because
 * getChatThread returns a thread for any participant even with zero messages (no message-count gate).
 *
 * 1. Setup: CLIENT, OPEN gig, SPECIALIST, ACCEPTED application, gig → IN_PROGRESS + assigned (programmatic)
 * 2. Client sends the first message via the /chats composer
 * 3. Specialist views it at /chats?gig
 * 4. Specialist replies via the composer
 * 5. Client views both at /chats?gig
 * 6. Verify chronological ordering (DB)
 * 7. Final state verification (DB)
 */

import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createTestUser, createTestGig, createTestApplication, resetE2EDb } from '../helpers/seed'
import { createTestSession } from '../helpers/auth'

// Setup test database connection for E2E tests
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
})

const prisma = new PrismaClient({
  adapter: adapter as any
})

/** Authenticate the given user by injecting the session cookie (clears any prior session first). */
async function loginAs(page: any, user: { id: string; email: string; role: string }) {
  await page.context().clearCookies()
  const token = await createTestSession(user)
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
}

/** Send a message through the /chats composer for the given gig; the composer keeps the user in the conversation.
 *  Sending is optimistic (no navigation) — wait for the bubble to reconcile (the «отправка…» pending state to clear,
 *  i.e. the server write committed) before the caller reads the message back. */
async function sendViaChats(page: any, gigId: string, content: string) {
  await page.goto(`/chats?gig=${gigId}`)
  await page.getByRole('textbox', { name: 'Сообщение' }).fill(content)
  await page.getByLabel('Отправить').click()
  // Optimistic bubble appears immediately and the user stays in the conversation (no redirect).
  await expect(page.getByText(content).last()).toBeVisible()
  await expect(page).toHaveURL(new RegExp(`/chats\\?gig=${gigId}`))
  // Reconciled = persisted: the pending marker is gone and the send did not fail.
  await expect(page.getByText('отправка…')).toHaveCount(0)
  await expect(page.getByText('не отправлено')).toHaveCount(0)
}

test.describe('Messaging Flow E2E', () => {
  test.afterEach(async () => {
    // FK-safe full reset (the shared E2E db may hold disputes/reviews/notifications referencing gigs+users).
    await resetE2EDb(prisma)
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('complete messaging flow between client and specialist via /chats', async ({ page }) => {
    // ========================================================================
    // STEP 1: Setup - Create users, gig, and application (programmatic)
    // ========================================================================

    const clientEmail = `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
    const client = await createTestUser(prisma, {
      role: 'CLIENT',
      email: clientEmail,
      password: 'TestPassword123!',
      companyName: 'ООО "ТехноСтарт"',
      inn: '7743013902'
    })

    const verifyClient = await prisma.user.findUnique({
      where: { id: client.id },
      include: { clientProfile: true }
    })
    expect(verifyClient).toBeTruthy()
    expect(verifyClient?.clientProfile).toBeTruthy()

    const gig = await createTestGig(prisma, {
      clientId: client.id,
      title: 'Разработка REST API для мобильного приложения',
      description: 'Необходимо разработать REST API для мобильного приложения. Требуется опыт работы с Node.js и PostgreSQL. Проект включает аутентификацию, работу с базой данных и документацию.',
      acceptanceCriteria: 'API должен поддерживать CRUD операции для всех основных сущностей, иметь документацию в формате OpenAPI, покрытие тестами не менее 80%, и быть готовым к деплою на production.',
      budget: 150000, // 1500 roubles in kopecks
      tags: 'React,TypeScript,Node.js',
      status: 'OPEN'
    })

    const verifyGig = await prisma.gig.findUnique({ where: { id: gig.id } })
    expect(verifyGig).toBeTruthy()
    expect(verifyGig?.status).toBe('OPEN')

    const specialistEmail = `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      email: specialistEmail,
      password: 'TestPassword123!',
      displayName: 'Дмитрий Соколов',
      techStack: 'React, TypeScript, Node.js, PostgreSQL',
      experienceLevel: 'SENIOR'
    })

    const verifySpecialist = await prisma.user.findUnique({
      where: { id: specialist.id },
      include: { specialistProfile: true }
    })
    expect(verifySpecialist).toBeTruthy()
    expect(verifySpecialist?.specialistProfile).toBeTruthy()

    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      approach: 'Буду использовать архитектуру REST с валидацией через Zod. Для аутентификации применю JWT токены с refresh механизмом. База данных PostgreSQL с Prisma ORM. Реализую полное покрытие тестами через Jest. Документация будет в формате OpenAPI 3.0.',
      questions: 'Какие требования к производительности API? Ожидаемая нагрузка в RPS? Нужна ли документация API в формате OpenAPI или Swagger? Какая версия Node.js используется в проекте? Есть ли требования к логированию и мониторингу?',
      estimatedEffort: '2 недели (80 часов)',
      status: 'ACCEPTED'
    })
    expect(application.status).toBe('ACCEPTED')

    // Update gig to IN_PROGRESS with assignedSpecialistId
    await prisma.gig.update({
      where: { id: gig.id },
      data: { status: 'IN_PROGRESS', assignedSpecialistId: specialist.id }
    })

    const gigAfterSetup = await prisma.gig.findUnique({ where: { id: gig.id } })
    expect(gigAfterSetup?.status).toBe('IN_PROGRESS')
    expect(gigAfterSetup?.assignedSpecialistId).toBe(specialist.id)

    // ========================================================================
    // STEP 2: Client sends the first message (UI, via /chats)
    // ========================================================================

    await loginAs(page, { id: client.id, email: client.email, role: 'CLIENT' })

    const clientMessage = 'Добрый день! Когда сможете начать работу? Есть ли у вас опыт с PostgreSQL?'
    await sendViaChats(page, gig.id, clientMessage)

    // Read it back on the conversation thread.
    await page.goto(`/chats?gig=${gig.id}`)
    await expect(page.getByText(clientMessage).last()).toBeVisible()

    // Verify message in database
    const messagesAfterClient = await prisma.message.findMany({ where: { gigId: gig.id } })
    expect(messagesAfterClient.length).toBe(1)
    expect(messagesAfterClient[0].senderId).toBe(client.id)
    expect(messagesAfterClient[0].content).toBe(clientMessage)

    // ========================================================================
    // STEP 3: Specialist views the message (UI, via /chats)
    // ========================================================================

    await loginAs(page, { id: specialist.id, email: specialist.email, role: 'SPECIALIST' })
    await page.goto(`/chats?gig=${gig.id}`)
    await expect(page.getByText(clientMessage).last()).toBeVisible()

    // ========================================================================
    // STEP 4: Specialist sends a reply (UI, via /chats)
    // ========================================================================

    const specialistReply = 'Могу начать завтра. Опыт с PostgreSQL более 5 лет. Уточните требования к производительности API.'
    await sendViaChats(page, gig.id, specialistReply)

    await page.goto(`/chats?gig=${gig.id}`)
    await expect(page.getByText(specialistReply).last()).toBeVisible()

    // Verify reply in database
    const messagesAfterSpecialist = await prisma.message.findMany({
      where: { gigId: gig.id },
      orderBy: { createdAt: 'asc' }
    })
    expect(messagesAfterSpecialist.length).toBe(2)
    expect(messagesAfterSpecialist[1].senderId).toBe(specialist.id)
    expect(messagesAfterSpecialist[1].content).toBe(specialistReply)

    // ========================================================================
    // STEP 5: Client views both messages (UI, via /chats)
    // ========================================================================

    await loginAs(page, { id: client.id, email: client.email, role: 'CLIENT' })
    await page.goto(`/chats?gig=${gig.id}`)
    await expect(page.getByText(clientMessage).last()).toBeVisible()
    await expect(page.getByText(specialistReply).last()).toBeVisible()

    // ========================================================================
    // STEP 6: Verify chronological ordering (DB)
    // ========================================================================

    const messages = await prisma.message.findMany({
      where: { gigId: gig.id },
      orderBy: { createdAt: 'asc' },
      include: { sender: true }
    })

    expect(messages.length).toBe(2)
    expect(messages[0].senderId).toBe(client.id)
    expect(messages[0].content).toBe(clientMessage)
    expect(messages[1].senderId).toBe(specialist.id)
    expect(messages[1].content).toBe(specialistReply)
    expect(messages[0].createdAt.getTime()).toBeLessThanOrEqual(messages[1].createdAt.getTime())

    // ========================================================================
    // STEP 7: Final state verification (DB)
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

    expect(finalGig?.status).toBe('IN_PROGRESS')
    expect(finalGig?.assignedSpecialistId).toBe(specialist.id)

    const finalApp = finalGig?.applications.find(a => a.specialistId === specialist.id)
    expect(finalApp?.status).toBe('ACCEPTED')

    expect(finalGig?.messages.length).toBe(2)
    expect(finalGig?.messages[0].senderId).toBe(client.id)
    expect(finalGig?.messages[0].content).toBe(clientMessage)
    expect(finalGig?.messages[1].senderId).toBe(specialist.id)
    expect(finalGig?.messages[1].content).toBe(specialistReply)

    expect(finalGig?.client.role).toBe('CLIENT')
    expect(finalGig?.client.clientProfile?.companyName).toBe('ООО "ТехноСтарт"')
    expect(finalGig?.client.clientProfile?.inn).toBe('7743013902')

    expect(finalGig?.assignedSpecialist?.role).toBe('SPECIALIST')
    expect(finalGig?.assignedSpecialist?.specialistProfile?.displayName).toBe('Дмитрий Соколов')
    expect(finalGig?.assignedSpecialist?.specialistProfile?.techStack).toBe('React, TypeScript, Node.js, PostgreSQL')
    expect(finalGig?.assignedSpecialist?.specialistProfile?.experienceLevel).toBe('SENIOR')
  })

  test('live receive — the counterparty sees a new message without reloading (delta poll)', async ({ page, browser }) => {
    const stamp = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const client = await createTestUser(prisma, {
      role: 'CLIENT', email: `live-client-${stamp}@test.com`, companyName: 'ООО Лайв', inn: '7700000044',
    })
    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST', email: `live-spec-${stamp}@test.com`, displayName: 'Лайв Спец', techStack: 'React', experienceLevel: 'SENIOR',
    })
    const gig = await createTestGig(prisma, {
      clientId: client.id, title: 'Live receive gig', status: 'IN_PROGRESS', assignedSpecialistId: specialist.id,
    })

    // Client viewing the thread in the primary context.
    await loginAs(page, { id: client.id, email: client.email, role: 'CLIENT' })
    await page.goto(`/chats?gig=${gig.id}`)

    // Specialist viewing the SAME thread in a second context (no shared cookies).
    const ctx2 = await browser.newContext()
    const page2 = await ctx2.newPage()
    // Force the receiver tab to always report "visible". The hook (correctly) pauses polling when the tab is hidden, but
    // in one headless run only one page is foreground at a time — without this the cross-context receive is flaky. In
    // real life each user has their own focused tab, so this faithfully models the poll-while-visible path.
    await page2.addInitScript(() => {
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' })
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => false })
    })
    await loginAs(page2, { id: specialist.id, email: specialist.email, role: 'SPECIALIST' })
    await page2.goto(`/chats?gig=${gig.id}`)

    // Client sends; the specialist's open thread must show it via the delta poll — no reload, no navigation.
    const liveMsg = `Live ${stamp}`
    await page.getByRole('textbox', { name: 'Сообщение' }).fill(liveMsg)
    await page.getByLabel('Отправить').click()
    // Wait for the client's send to COMMIT (optimistic «отправка…» cleared) so the receiver's poll can't race ahead of
    // the DB write.
    await expect(page.getByText(liveMsg)).toBeVisible()
    await expect(page.getByText('отправка…')).toHaveCount(0)

    // The receiver (always-visible) picks it up on its next delta poll — no reload, no navigation.
    await expect(page2.getByText(liveMsg)).toBeVisible({ timeout: 15000 })

    await ctx2.close()
  })
})
