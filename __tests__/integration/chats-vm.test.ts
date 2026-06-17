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

import { getConversations, getChatThread, getUnreadChatCount } from '@/lib/view-models'

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
    void specialist
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

describe('getUnreadChatCount', () => {
  it('counts conversations with ≥1 unread message', async () => {
    const { client } = await seedConversation()
    expect(await getUnreadChatCount({ userId: client.id, role: 'CLIENT' })).toBe(1)
  })
})
