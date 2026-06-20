import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser } from '../helpers/seed'
import { createTestSession } from '../helpers/auth'
import { formatUserAgent } from '@/lib/user-agent'

// A real in-memory cookie store so createSession → getSession round-trips (and we can read the embedded `sid`).
const cookieStore = new Map<string, string>()

vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))
vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    get: (n: string) => {
      const v = cookieStore.get(n)
      return v ? { value: v } : undefined
    },
    set: (n: string, v: string) => {
      cookieStore.set(n, v)
    },
    delete: (n: string) => {
      cookieStore.delete(n)
    },
  })),
  headers: vi.fn(async () => ({
    get: (n: string) =>
      n.toLowerCase() === 'user-agent'
        ? 'Mozilla/5.0 (Windows NT 10.0; Win64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36'
        : n.toLowerCase() === 'x-forwarded-for'
          ? '203.0.113.7'
          : null,
  })),
}))
vi.mock('next/navigation', () => ({
  redirect: vi.fn((u: string) => {
    throw new Error(`NEXT_REDIRECT:${u}`)
  }),
}))

import { createSession, getSession, destroySession } from '@/lib/session'
import { terminateSession } from '@/app/actions/settings'
import { getActiveSessions } from '@/lib/view-models'

beforeEach(() => cookieStore.clear())

describe('formatUserAgent', () => {
  it('parses a UA into «{browser} · {OS}» and falls back gracefully', () => {
    expect(formatUserAgent('Mozilla/5.0 (Windows NT 10.0) Chrome/120 Safari/537')).toBe('Chrome · Windows')
    expect(formatUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17) Safari/604')).toBe('Safari · iOS')
    expect(formatUserAgent('')).toBe('Браузер · Устройство')
  })
})

describe('createSession + getSession (session tracking)', () => {
  it('creates a Session row capturing UA + IP and embeds its id as `sid`', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'CLIENT' })

    await createSession(user.id, user.email, 'CLIENT')

    const rows = await prisma.session.findMany({ where: { userId: user.id } })
    expect(rows).toHaveLength(1)
    expect(rows[0].userAgent).toContain('Chrome')
    expect(rows[0].ipAddress).toBe('203.0.113.7')

    const session = await getSession()
    expect(session).not.toBeNull()
    expect(session!.userId).toBe(user.id)
    expect(session!.sid).toBe(rows[0].id)
  })

  it('validates a sid-less token (backward-compat with the test harness)', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'SPECIALIST' })
    cookieStore.set('session', await createTestSession({ id: user.id, email: user.email, role: 'SPECIALIST' }))

    const session = await getSession()
    expect(session).not.toBeNull()
    expect(session!.userId).toBe(user.id)
    expect(session!.sid).toBeUndefined() // no row required
    // no Session row exists for this token
    expect(await prisma.session.count({ where: { userId: user.id } })).toBe(0)
  })

  it('destroySession deletes the current session row + clears the cookie', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'CLIENT' })
    await createSession(user.id, user.email, 'CLIENT')
    expect(await prisma.session.count({ where: { userId: user.id } })).toBe(1)

    await destroySession()
    expect(await prisma.session.count({ where: { userId: user.id } })).toBe(0)
    expect(cookieStore.get('session')).toBeUndefined()
  })
})

describe('terminateSession (ownership-enforced)', () => {
  it('terminates the user’s own non-current session and keeps them logged in', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'CLIENT' })
    await createSession(user.id, user.email, 'CLIENT') // current (cookie + sid)
    const other = await prisma.session.create({ data: { userId: user.id, userAgent: 'Firefox/Linux' } })

    const res = await terminateSession(other.id)
    expect(res).toEqual({ success: true })
    expect(await prisma.session.findUnique({ where: { id: other.id } })).toBeNull()
    // current session untouched → still logged in
    expect(await getSession()).not.toBeNull()
  })

  it('refuses to terminate another user’s session', async () => {
    const prisma = getTestPrismaClient()
    const me = await createTestUser(prisma, { role: 'CLIENT' })
    const them = await createTestUser(prisma, { role: 'SPECIALIST' })
    await createSession(me.id, me.email, 'CLIENT')
    const theirs = await prisma.session.create({ data: { userId: them.id, userAgent: 'x' } })

    const res = await terminateSession(theirs.id)
    expect(res).toEqual({ error: 'Session not found.' })
    expect(await prisma.session.findUnique({ where: { id: theirs.id } })).not.toBeNull()
  })
})

describe('getActiveSessions', () => {
  it('marks the current session active, parses the UA, and omits location', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'CLIENT' })
    const a = await prisma.session.create({
      data: { userId: user.id, userAgent: 'Mozilla/5.0 (Macintosh) Safari/605', ipAddress: '198.51.100.2' },
    })
    const b = await prisma.session.create({ data: { userId: user.id, userAgent: 'Mozilla/5.0 (X11; Linux) Firefox/121' } })

    const rows = await getActiveSessions(user.id, a.id)
    expect(rows).toHaveLength(2)
    const current = rows.find((r) => r.id === a.id)!
    const otherRow = rows.find((r) => r.id === b.id)!
    expect(current.state).toBe('active')
    expect(otherRow.state).toBe('Default')
    expect(current.title).toBe('Safari · macOS')
    expect(otherRow.title).toBe('Firefox · Linux')
    // location is omitted — the description is the relative last-active only (no city/IP leak)
    expect(current.description).not.toContain('198.51.100.2')
  })
})
