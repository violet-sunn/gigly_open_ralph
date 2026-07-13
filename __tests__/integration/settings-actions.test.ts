import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser } from '../helpers/seed'

// transport-settings — the wired settings actions (extended updatePreferences + the new partial-safe profile updates +
// terminate-all). getSession is cookie-based, so we mock it to a fixed session per test.
let currentSession: { userId: string; email: string; role: string; sid?: string } | null = null

vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))
vi.mock('@/lib/session', () => ({
  getSession: vi.fn(async () => currentSession),
  destroySession: vi.fn(async () => {}),
}))
vi.mock('next/navigation', () => ({
  redirect: vi.fn((u: string) => {
    throw new Error(`NEXT_REDIRECT:${u}`)
  }),
}))

import {
  updatePreferences,
  updateTimezone,
  updateAccountName,
  terminateInactiveSessions,
} from '@/app/actions/settings'

const fd = (entries: Record<string, string>) => {
  const f = new FormData()
  for (const [k, v] of Object.entries(entries)) f.set(k, v)
  return f
}

beforeEach(() => {
  currentSession = null
})

describe('updatePreferences — transport-settings fields', () => {
  it('persists currency + the two new notification toggles (partial-safe)', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'CLIENT', email: `pa-${Date.now()}@example.com` })
    currentSession = { userId: user.id, email: user.email, role: 'CLIENT' }

    const res = await updatePreferences(null, fd({ currency: 'usd', notifyPlatformNews: 'false', notifyNewGigs: 'false' }))
    expect(res).toEqual({ success: true })

    const u = await prisma.user.findUnique({ where: { id: user.id } })
    expect(u?.currency).toBe('usd')
    expect(u?.notifyPlatformNews).toBe(false)
    expect(u?.notifyNewGigs).toBe(false)
    expect(u?.notifyApplications).toBe(true) // untouched
  })

  it('rejects an unsupported currency', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'CLIENT', email: `pb-${Date.now()}@example.com` })
    currentSession = { userId: user.id, email: user.email, role: 'CLIENT' }

    const res = await updatePreferences(null, fd({ currency: 'btc' }))
    expect(res?.error).toBeTruthy()
    const u = await prisma.user.findUnique({ where: { id: user.id } })
    expect(u?.currency).toBe('rub') // unchanged default
  })
})

describe('updateTimezone — partial-safe profile write', () => {
  it('persists a valid timezone without clobbering other profile fields', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'SPECIALIST', email: `tz-${Date.now()}@example.com`, displayName: 'Спец', techStack: 'React' })
    currentSession = { userId: user.id, email: user.email, role: 'SPECIALIST' }

    const res = await updateTimezone(null, fd({ timezone: 'Asia/Tbilisi' }))
    expect(res).toEqual({ success: true })

    const p = await prisma.specialistProfile.findUnique({ where: { userId: user.id } })
    expect(p?.timezone).toBe('Asia/Tbilisi')
    expect(p?.displayName).toBe('Спец') // not clobbered
    expect(p?.techStack).toBe('React') // not clobbered
  })

  it('rejects an invalid timezone', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'SPECIALIST', email: `tz2-${Date.now()}@example.com` })
    currentSession = { userId: user.id, email: user.email, role: 'SPECIALIST' }

    const res = await updateTimezone(null, fd({ timezone: 'Mars/Olympus' }))
    expect(res?.error).toBeTruthy()
  })
})

describe('updateAccountName — partial-safe name write', () => {
  it('updates displayName only (SPECIALIST), leaving other fields intact', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'SPECIALIST', email: `nm-${Date.now()}@example.com`, displayName: 'Старое', techStack: 'Go' })
    currentSession = { userId: user.id, email: user.email, role: 'SPECIALIST' }

    const res = await updateAccountName(null, fd({ name: 'Новое Имя' }))
    expect(res).toEqual({ success: true })

    const p = await prisma.specialistProfile.findUnique({ where: { userId: user.id } })
    expect(p?.displayName).toBe('Новое Имя')
    expect(p?.techStack).toBe('Go') // not clobbered
  })
})

describe('terminateInactiveSessions', () => {
  it('deletes every session except the current one', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'CLIENT', email: `ts-${Date.now()}@example.com` })
    const s1 = await prisma.session.create({ data: { userId: user.id, userAgent: 'current' } })
    await prisma.session.create({ data: { userId: user.id, userAgent: 'other-1' } })
    await prisma.session.create({ data: { userId: user.id, userAgent: 'other-2' } })
    currentSession = { userId: user.id, email: user.email, role: 'CLIENT', sid: s1.id }

    const res = await terminateInactiveSessions()
    expect(res).toEqual({ success: true })

    const rows = await prisma.session.findMany({ where: { userId: user.id } })
    expect(rows.map((r) => r.id)).toEqual([s1.id])
  })
})
