import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * e2e-chats (reconciliation #9) — verifies the rebuilt two-pane inbox at /chats (app/(protected)/chats/ChatsDesign.tsx):
 * the LEFT «Сообщения» conversation list (counterparty + project subtitle + «В работе» status + unread + preview), row
 * selection → /chats?gig=<id>, the RIGHT thread (day separator + bubbles) + composer (input[name=content], aria-label
 * «Сообщение» + send «Отправить»), and the live search. Sending reuses the UNCHANGED sendMessage (which redirects to
 * /gigs/<id>); since rebuilt gig-detail no longer renders the thread, the bubble is read back by re-opening /chats?gig.
 * Seeds a CLIENT + assigned SPECIALIST + an IN_PROGRESS gig + two specialist messages (so the client's unread badge = 2).
 */
let clientId: string
let clientEmail: string
let gigId: string
const GIG_TITLE = 'E2E Chats Gig — миграция дашборда'
const FIRST_MSG = 'Здравствуйте! Готов приступить.'
const LAST_MSG = 'Уточните сроки по первому этапу.' // < 50 chars → preview equals it verbatim

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  clientEmail = `cchat-client-${stamp}@example.com`

  const client = await prisma.user.create({
    data: {
      email: clientEmail,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'ООО Тест Чат', inn: '7700000003' } },
    },
  })
  clientId = client.id

  const spec = await prisma.user.create({
    data: {
      email: `cchat-spec-${stamp}@example.com`,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: {
        create: { displayName: 'Иван Спец', techStack: 'React', experienceLevel: 'SENIOR', position: 'Backend-разработчик' },
      },
    },
  })

  const gig = await prisma.gig.create({
    data: {
      title: GIG_TITLE,
      description: 'Chats composition test gig.',
      acceptanceCriteria: 'Acceptance criteria with at least fifty characters to pass validation here.',
      budget: 5000000,
      serviceFee: 500000,
      totalAmount: 5500000,
      status: 'IN_PROGRESS',
      tags: 'React',
      deadlineDays: 14,
      clientId: client.id,
      assignedSpecialistId: spec.id,
    },
  })
  gigId = gig.id

  // Two messages from the specialist → the client viewer has 2 unread (distinct from the conversation-count badge «1»).
  await prisma.message.create({ data: { gigId: gig.id, senderId: spec.id, content: FIRST_MSG } })
  await prisma.message.create({ data: { gigId: gig.id, senderId: spec.id, content: LAST_MSG } })

  await prisma.$disconnect()
})

test.describe('e2e-chats — two-pane inbox', () => {
  test('the inbox lists the conversation (counterparty + project + «В работе» + unread + preview)', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/chats')

    await expect(page.getByRole('heading', { name: 'Сообщения' })).toBeVisible()
    await expect(page.getByText('Иван Спец')).toBeVisible() // counterparty
    await expect(page.getByText(GIG_TITLE)).toBeVisible() // project subtitle
    await expect(page.getByText('В работе').first()).toBeVisible() // gig-status badge (IN_PROGRESS → in-progress)
    await expect(page.getByText('2', { exact: true })).toBeVisible() // unread badge (two specialist messages)
    await expect(page.getByText(LAST_MSG)).toBeVisible() // last-message preview
    await expect(page.getByPlaceholder('Поиск по названию или описанию')).toBeVisible() // live search input
  })

  test('selecting a conversation row navigates to /chats?gig=<id> and opens the thread', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/chats')

    await page.getByText('Иван Спец').click() // the conversation row
    await expect(page).toHaveURL(new RegExp(`/chats\\?gig=${gigId}`))
    await expect(page.getByRole('textbox', { name: 'Сообщение' })).toBeVisible() // composer opened
  })

  test('the open thread renders the day separator, bubbles, and the composer', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto(`/chats?gig=${gigId}`)

    // Both seeded bodies appear in the thread (FIRST only in the thread; LAST also in the list preview → use .last()).
    await expect(page.getByText(FIRST_MSG)).toBeVisible()
    await expect(page.getByText(LAST_MSG).last()).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Сообщение' })).toBeVisible()
    await expect(page.getByLabel('Отправить')).toBeVisible()
    // Day separator = the messages' ru-RU long date (e.g. «22 июня 2026 г.»).
    await expect(page.getByText(/\d{1,2}\s+\S+\s+\d{4}\s*г\./).first()).toBeVisible()
  })

  test('sending a message via the composer reuses sendMessage and persists (read back on /chats)', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto(`/chats?gig=${gigId}`)

    const msg = `E2E ответ ${Date.now()}`
    await page.getByRole('textbox', { name: 'Сообщение' }).fill(msg)
    await page.getByLabel('Отправить').click()

    // sendMessage is reused verbatim → it redirects to /gigs/<id>.
    await expect(page).toHaveURL(new RegExp(`/gigs/${gigId}`))

    // Rebuilt gig-detail no longer renders the thread — read the new bubble back by re-opening the conversation.
    // The just-sent message is now also the list preview, so it appears twice → assert the thread bubble (.last()).
    await page.goto(`/chats?gig=${gigId}`)
    await expect(page.getByText(msg).last()).toBeVisible()
  })

  test('the live search filters the conversation list', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/chats')

    await page.getByPlaceholder('Поиск по названию или описанию').fill('несуществующий запрос zzz')
    await expect(page.getByText('Иван Спец')).toHaveCount(0) // live filter, no «Найти» button
    await expect(page.getByText('Чаты не найдены.')).toBeVisible()
  })
})
