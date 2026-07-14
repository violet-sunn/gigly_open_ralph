import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { createTestUser } from '../helpers/seed'

vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'session') {
        const token = getTestSessionToken()
        return token ? { value: token } : undefined
      }
      return undefined
    },
    set: vi.fn(),
    delete: vi.fn(),
  })),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

import { heartbeat } from '@/app/actions/presence'

describe('heartbeat — presence ping (profile-experience-fixes)', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('sets lastSeenAt to ~now for an authenticated user', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'SPECIALIST' })

    // Fresh users have never been seen.
    const before = await prisma.user.findUnique({ where: { id: user.id } })
    expect(before!.lastSeenAt).toBeNull()

    const t0 = Date.now()
    await withAuthContext(user, async () => {
      await heartbeat()
    })

    const after = await prisma.user.findUnique({ where: { id: user.id } })
    expect(after!.lastSeenAt).not.toBeNull()
    // Written timestamp is within a few seconds of the call.
    expect(Math.abs(after!.lastSeenAt!.getTime() - t0)).toBeLessThan(5_000)
  })

  it('is a no-op for an unauthenticated caller (no write, no throw)', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'SPECIALIST' })

    // No session token set → unauthenticated.
    await expect(heartbeat()).resolves.toBeUndefined()

    const after = await prisma.user.findUnique({ where: { id: user.id } })
    expect(after!.lastSeenAt).toBeNull()
  })
})
