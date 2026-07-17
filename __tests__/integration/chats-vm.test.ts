import { describe, it, expect, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser, createTestGig, createTestMessage } from '../helpers/seed'

vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({ get: () => undefined, set: vi.fn(), delete: vi.fn() })),
}))
vi.mock('next/navigation', () => ({
  redirect: vi.fn((u: string) => {
    throw new Error(`NEXT_REDIRECT:${u}`)
  }),
}))

import { getConversations, getChatThread, getUnreadChatCount, getNewMessages } from '@/lib/view-models'

async function seedConversation() {
  const prisma = getTestPrismaClient()
  const client = await createTestUser(prisma, { role: 'CLIENT', companyName: 'ООО Ромашка' })
  const specialist = await createTestUser(prisma, { role: 'SPECIALIST', displayName: 'Иван Спец' })
  const gig = await createTestGig(prisma, {
    clientId: client.id,
    status: 'IN_PROGRESS',
    assignedSpecialistId: specialist.id,
    title: 'Миграция на PostgreSQL',
  })
  // Two messages from the specialist (so they are "from others" for the client viewer).
  await createTestMessage(prisma, { gigId: gig.id, senderId: specialist.id, content: 'Первое сообщение' })
  await createTestMessage(prisma, { gigId: gig.id, senderId: specialist.id, content: 'Второе сообщение' })
  return { prisma, client, specialist, gig }
}

describe('getConversations', () => {
  it('lists one conversation per gig-with-messages with counterparty + subtitle + preview + all-unread (no lastReadAt)', async () => {
    const { client, gig } = await seedConversation()

    const convos = await getConversations({ userId: client.id, role: 'CLIENT' })
    expect(convos).toHaveLength(1)
    expect(convos[0].id).toBe(gig.id)
    expect(convos[0].name).toBe('Иван Спец') // counterparty (specialist) for a CLIENT viewer
    expect(convos[0].subtitle).toBe('Миграция на PostgreSQL')
    expect(convos[0].preview).toBe('Второе сообщение') // last message
    expect(convos[0].unread).toBe(2) // both from the specialist, no lastReadAt
    expect(convos[0].status).toBe('in-progress') // the gig status badge (reconcile-chats)
  })

  it('honors Notification.lastReadAt (lastReadAt after all messages → 0 unread)', async () => {
    const { prisma, client, gig } = await seedConversation()
    await prisma.notification.upsert({
      where: { userId_gigId: { userId: client.id, gigId: gig.id } },
      create: { userId: client.id, gigId: gig.id, lastReadAt: new Date(Date.now() + 60_000) },
      update: { lastReadAt: new Date(Date.now() + 60_000) },
    })

    const convos = await getConversations({ userId: client.id, role: 'CLIENT' })
    expect(convos[0].unread).toBe(0)
  })

  it('does not count the viewer’s own messages as unread (SPECIALIST viewer)', async () => {
    const { specialist, gig } = await seedConversation()
    // The two seeded messages are FROM the specialist → not unread for the specialist viewer.
    const convos = await getConversations({ userId: specialist.id, role: 'SPECIALIST' })
    expect(convos).toHaveLength(1)
    expect(convos[0].name).toBe('ООО Ромашка') // counterparty (client) for a SPECIALIST viewer
    expect(convos[0].unread).toBe(0)
  })

  it('lists a gig whose only message is the system opener, and does NOT count it as unread (chat-on-acceptance)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT', companyName: 'ООО Ромашка' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST', displayName: 'Иван Спец' })
    const gig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'IN_PROGRESS',
      assignedSpecialistId: specialist.id,
      title: 'Новый гиг',
    })
    // Only a system opener (senderId = null) exists — mirrors acceptApplication's seed.
    await createTestMessage(prisma, { gigId: gig.id, senderId: null, content: 'Заявка принята. Обсудите детали.' })

    // Both parties see the conversation, with the opener as preview but 0 unread.
    for (const viewer of [{ userId: client.id, role: 'CLIENT' }, { userId: specialist.id, role: 'SPECIALIST' }]) {
      const convos = await getConversations(viewer)
      expect(convos).toHaveLength(1)
      expect(convos[0].id).toBe(gig.id)
      expect(convos[0].preview).toBe('Заявка принята. Обсудите детали.')
      expect(convos[0].unread).toBe(0) // system opener is not a counterparty message
    }
  })
})

describe('getChatThread', () => {
  it('returns the thread (direction per viewer + date) + the counterparty header', async () => {
    const { client, specialist, gig } = await seedConversation()
    await createTestMessage(getTestPrismaClient(), { gigId: gig.id, senderId: client.id, content: 'Ответ клиента' })

    const thread = await getChatThread(gig.id, { userId: client.id, role: 'CLIENT' })
    expect(thread).not.toBeNull()
    expect(thread!.chat.thread).toHaveLength(3)
    // Specialist messages are "in" for the client; the client's own message is "out".
    expect(thread!.chat.thread[0].direction).toBe('in')
    expect(thread!.chat.thread[2].direction).toBe('out')
    expect(thread!.chat.thread[0].date).toBeTruthy() // day-separator label present
    expect(thread!.header.name).toBe('Иван Спец') // counterparty (specialist)
    // Bio adoption (reconcile-chats): CLIENT viewer → specialist counterparty + Специальность from the profile.
    expect(thread!.header.counterparty).toBe('specialist')
    expect(thread!.header.specialty).toBe('SENIOR') // experienceLevel default (no position/specialization seeded)
    void specialist
  })

  it('for a SPECIALIST viewer the counterparty is the company (no Специальность)', async () => {
    const { specialist, gig } = await seedConversation()

    const thread = await getChatThread(gig.id, { userId: specialist.id, role: 'SPECIALIST' })
    expect(thread).not.toBeNull()
    expect(thread!.header.name).toBe('ООО Ромашка') // counterparty (company)
    expect(thread!.header.counterparty).toBe('company')
    expect(thread!.header.specialty).toBeUndefined() // companies have no Специальность
  })

  it('is sendable (canSend=true, no closedReason) for an active IN_PROGRESS gig', async () => {
    const { client, gig } = await seedConversation() // seeded IN_PROGRESS
    const thread = await getChatThread(gig.id, { userId: client.id, role: 'CLIENT' })
    expect(thread!.chat.composer.canSend).toBe(true)
    expect(thread!.chat.composer.closedReason).toBeUndefined()
  })

  it('is read-only (canSend=false + reason) for a COMPLETED gig', async () => {
    const { prisma, client, gig } = await seedConversation()
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'COMPLETED' } })
    const thread = await getChatThread(gig.id, { userId: client.id, role: 'CLIENT' })
    expect(thread!.chat.composer.canSend).toBe(false)
    expect(thread!.chat.composer.closedReason).toMatch(/завершён/)
  })

  it('is read-only for a gig closed by admin', async () => {
    const { prisma, client, gig } = await seedConversation()
    await prisma.gig.update({ where: { id: gig.id }, data: { closedByAdmin: true } })
    const thread = await getChatThread(gig.id, { userId: client.id, role: 'CLIENT' })
    expect(thread!.chat.composer.canSend).toBe(false)
    expect(thread!.chat.composer.closedReason).toMatch(/администратором/)
  })

  it('renders a null-sender message as a centered system bubble labeled Gigly (chat-on-acceptance)', async () => {
    const { client, gig } = await seedConversation()
    await createTestMessage(getTestPrismaClient(), { gigId: gig.id, senderId: null, content: 'Заявка принята. Обсудите детали.' })

    const thread = await getChatThread(gig.id, { userId: client.id, role: 'CLIENT' })
    const system = thread!.chat.thread.find((m) => m.body === 'Заявка принята. Обсудите детали.')
    expect(system).toBeTruthy()
    expect(system!.direction).toBe('system')
    expect(system!.author).toBe('Gigly')
  })

  it('returns null for a non-participant viewer', async () => {
    const { prisma, gig } = await seedConversation()
    const stranger = await createTestUser(prisma, { role: 'SPECIALIST' })
    const thread = await getChatThread(gig.id, { userId: stranger.id, role: 'SPECIALIST' })
    expect(thread).toBeNull()
  })

  it('returns null for a missing gig', async () => {
    const thread = await getChatThread('nonexistent', { userId: 'u', role: 'CLIENT' })
    expect(thread).toBeNull()
  })
})

// A moderator cannot judge a dispute without the correspondence it is about. The admin reads it here — and ONLY reads:
// getChatThread is the only authorised path to a gig's messages, and persistMessage still refuses non-participants.
describe('getChatThread — ADMIN moderation view', () => {
  it('an ADMIN who is not a participant can read any gig thread', async () => {
    const { prisma, gig } = await seedConversation()
    const admin = await createTestUser(prisma, { role: 'ADMIN' })

    const thread = await getChatThread(gig.id, { userId: admin.id, role: 'ADMIN' })

    expect(thread).not.toBeNull()
    expect(thread!.chat.thread).toHaveLength(2)
    expect(thread!.chat.thread.map((b) => b.body)).toEqual(['Первое сообщение', 'Второе сообщение'])
  })

  it('an ADMIN can never send — read-only in every gig state, with the reason surfaced', async () => {
    const { prisma, gig } = await seedConversation() // IN_PROGRESS: sendable for a participant
    const admin = await createTestUser(prisma, { role: 'ADMIN' })

    const thread = await getChatThread(gig.id, { userId: admin.id, role: 'ADMIN' })

    expect(thread!.chat.composer.canSend).toBe(false)
    expect(thread!.chat.composer.closedReason).toMatch(/модератора/)
  })

  // The regression this guards: direction is computed against the viewer's id, and an admin sent nothing — so without
  // a perspective the entire conversation collapses onto one side, exactly when you need to tell the parties apart.
  it('lays the conversation out two-sided for an ADMIN instead of collapsing it', async () => {
    const { prisma, client, gig } = await seedConversation()
    await createTestMessage(prisma, { gigId: gig.id, senderId: client.id, content: 'Ответ клиента' })
    const admin = await createTestUser(prisma, { role: 'ADMIN' })

    const thread = await getChatThread(gig.id, { userId: admin.id, role: 'ADMIN' })
    const directions = thread!.chat.thread.map((b) => b.direction)

    expect(directions).toEqual(['in', 'in', 'out']) // specialist × 2 on one side, client on the other
  })

  it('never labels a bubble «Вы» for an ADMIN — an observer is not a party', async () => {
    const { prisma, client, specialist, gig } = await seedConversation()
    await createTestMessage(prisma, { gigId: gig.id, senderId: client.id, content: 'Ответ клиента' })
    const admin = await createTestUser(prisma, { role: 'ADMIN' })

    const thread = await getChatThread(gig.id, { userId: admin.id, role: 'ADMIN' })
    const authors = thread!.chat.thread.map((b) => b.author)

    expect(authors).not.toContain('Вы')
    // Every bubble is attributed to whoever actually wrote it.
    expect(authors).toEqual([specialist.email, specialist.email, client.email])
  })

  it('still marks a system message as Gigly for an ADMIN', async () => {
    const { prisma, gig } = await seedConversation()
    await createTestMessage(prisma, { gigId: gig.id, senderId: null, content: 'Заявка принята.' })
    const admin = await createTestUser(prisma, { role: 'ADMIN' })

    const thread = await getChatThread(gig.id, { userId: admin.id, role: 'ADMIN' })
    const system = thread!.chat.thread.find((b) => b.direction === 'system')

    expect(system!.author).toBe('Gigly')
  })

  it('a non-participant with a non-ADMIN role is still refused', async () => {
    const { prisma, gig } = await seedConversation()
    const stranger = await createTestUser(prisma, { role: 'CLIENT' })
    expect(await getChatThread(gig.id, { userId: stranger.id, role: 'CLIENT' })).toBeNull()
  })
})

describe('getUnreadChatCount', () => {
  it('counts conversations with ≥1 unread message', async () => {
    const { client } = await seedConversation()
    expect(await getUnreadChatCount({ userId: client.id, role: 'CLIENT' })).toBe(1)
  })
})

describe('getNewMessages (chat-realtime delta poll)', () => {
  it('returns only messages strictly newer than the cursor, ascending', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'IN_PROGRESS', assignedSpecialistId: specialist.id })
    const m1 = await createTestMessage(prisma, { gigId: gig.id, senderId: specialist.id, content: 'one' })
    await new Promise((r) => setTimeout(r, 10))
    const m2 = await createTestMessage(prisma, { gigId: gig.id, senderId: specialist.id, content: 'two' })

    const all = await getNewMessages(gig.id, new Date(0).toISOString(), { userId: client.id, role: 'CLIENT' })
    expect(all.map((b) => b.body)).toEqual(['one', 'two'])

    const afterM1 = await getNewMessages(gig.id, new Date(m1.createdAt).toISOString(), { userId: client.id, role: 'CLIENT' })
    expect(afterM1.map((b) => b.body)).toEqual(['two']) // m1 excluded (gt), m2 included
    expect(afterM1[0].id).toBe(m2.id)
    expect(afterM1[0].direction).toBe('in') // from the specialist, for the CLIENT viewer
    expect(afterM1[0].createdAt).toBeTruthy()

    const afterM2 = await getNewMessages(gig.id, new Date(m2.createdAt).toISOString(), { userId: client.id, role: 'CLIENT' })
    expect(afterM2).toHaveLength(0)
  })

  it('refuses a non-participant (returns [])', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const stranger = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'IN_PROGRESS', assignedSpecialistId: specialist.id })
    await createTestMessage(prisma, { gigId: gig.id, senderId: specialist.id, content: 'secret' })

    const res = await getNewMessages(gig.id, new Date(0).toISOString(), { userId: stranger.id, role: 'SPECIALIST' })
    expect(res).toEqual([])
  })

  it('returns [] for a missing gig or an invalid cursor', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'IN_PROGRESS', assignedSpecialistId: specialist.id })
    await createTestMessage(prisma, { gigId: gig.id, senderId: specialist.id, content: 'hi' })

    expect(await getNewMessages('nope', new Date(0).toISOString(), { userId: client.id, role: 'CLIENT' })).toEqual([])
    expect(await getNewMessages(gig.id, 'not-a-date', { userId: client.id, role: 'CLIENT' })).toEqual([])
  })
})
