import { describe, it, expect, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, getTestSessionToken, setTestSessionToken } from '../helpers/auth'
import { createTestUser, createTestGig, createTestMessage } from '../helpers/seed'

// Mock @/lib/prisma to use the test database (lazy getter).
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))

// Mock next/headers so getSession() reads the current test session token.
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'session') {
        const token = getTestSessionToken()
        return token ? { value: token } : undefined
      }
      return undefined
    },
    set: vi.fn((name: string, value: string) => {
      if (name === 'session') setTestSessionToken(value)
    }),
    delete: vi.fn((name: string) => {
      if (name === 'session') setTestSessionToken(undefined)
    }),
  })),
}))

// Import after mocks.
import { getRecentMessages } from '@/app/actions/message'

/**
 * chat-on-acceptance — the dashboard «Сообщения» panel is fed by getRecentMessages. The acceptance opener is a
 * system message (senderId = null), so this action MUST tolerate a null sender (no crash) and label it «Gigly».
 */
describe('getRecentMessages (dashboard «Сообщения»)', () => {
  it('tolerates a null-sender (system) message and labels it «Gigly»', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT', companyName: 'ООО Ромашка' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST', displayName: 'Иван Спец' })
    const gig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'IN_PROGRESS',
      assignedSpecialistId: specialist.id,
      title: 'Новый гиг',
    })
    // The only message is the system opener (mirrors acceptApplication's seed).
    await createTestMessage(prisma, { gigId: gig.id, senderId: null, content: 'Заявка принята. Обсудите детали.' })

    // Both parties get the panel item without a throw, with «Gigly» as the sender label.
    for (const viewer of [client, specialist]) {
      const recent = await withAuthContext(viewer, () => getRecentMessages())
      expect(recent).toHaveLength(1)
      expect(recent[0].gigId).toBe(gig.id)
      expect(recent[0].senderName).toBe('Gigly')
      expect(recent[0].contentPreview).toBe('Заявка принята. Обсудите детали.')
    }
  })

  it('still labels a real sender by their profile name (regression)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT', companyName: 'ООО Ромашка' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST', displayName: 'Иван Спец' })
    const gig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'IN_PROGRESS',
      assignedSpecialistId: specialist.id,
    })
    await createTestMessage(prisma, { gigId: gig.id, senderId: specialist.id, content: 'Готов приступить.' })

    const recent = await withAuthContext(client, () => getRecentMessages())
    expect(recent).toHaveLength(1)
    expect(recent[0].senderName).toBe('Иван Спец') // specialist's displayName, not «Gigly»
  })
})
