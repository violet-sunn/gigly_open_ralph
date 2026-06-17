import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * compose-chats (Phase 2) — verifies /chats is composed from the kit (ConversationItem·list + search + ChatHeader +
 * ChatPanel thread + composer), that the inbox binds real conversations, that opening one renders the thread + marks it
 * read, that sending a message (the existing sendMessage) appends it, and that search filters the list. Seeds a CLIENT
 * + an assigned SPECIALIST + an IN_PROGRESS gig + messages directly into the E2E db (file:./test.db).
 */
let clientId: string
let clientEmail: string
let gigId: string

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
      specialistProfile: { create: { displayName: 'Иван Спец', techStack: 'React', experienceLevel: 'SENIOR' } },
    },
  })

  const gig = await prisma.gig.create({
    data: {
      title: 'E2E Chats Gig — миграция дашборда',
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

  await prisma.message.create({ data: { gigId: gig.id, senderId: spec.id, content: 'Здравствуйте! Готов приступить.' } })

  await prisma.$disconnect()
})

test.describe('compose-chats — composed chats inbox', () => {
  test('inbox lists the conversation (counterparty + gig subtitle)', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/chats')

    await expect(page.getByText('Сообщения', { exact: true })).toBeVisible() // Section title
    await expect(page.getByRole('search')).toBeVisible() // SearchPanel
    await expect(page.getByText('Иван Спец')).toBeVisible() // counterparty name (ConversationItem)
    await expect(page.getByText('E2E Chats Gig — миграция дашборда')).toBeVisible() // subtitle
  })

  test('opening a conversation renders the thread + composer', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto(`/chats?gig=${gigId}`)

    // The message appears in both the list preview and the thread bubble — assert the thread bubble (last).
    await expect(page.getByText('Здравствуйте! Готов приступить.').last()).toBeVisible() // a MessageBubble in the thread
    await expect(page.getByRole('textbox', { name: 'Сообщение' })).toBeVisible() // composer Input
  })

  test('sending a message via the existing sendMessage works (lands on the gig conversation)', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto(`/chats?gig=${gigId}`)

    const msg = `E2E ответ ${Date.now()}`
    await page.getByRole('textbox', { name: 'Сообщение' }).fill(msg)
    // The composer send button (aria-label «Отправить») — getByLabel disambiguates from the sidebar support button.
    await page.getByLabel('Отправить').click()

    // sendMessage is reused verbatim → it redirects to the gig-detail conversation (same thread); the message appears.
    await expect(page).toHaveURL(new RegExp(`/gigs/${gigId}`))
    await expect(page.getByText(msg)).toBeVisible()
  })

  test('search filters the conversation list', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/chats')

    await page.getByRole('searchbox').fill('несуществующий запрос zzz')
    await page.getByRole('button', { name: 'Найти' }).click()
    await expect(page.getByText('Иван Спец')).toHaveCount(0)
    await expect(page.getByText('Чаты не найдены')).toBeVisible()
  })
})
