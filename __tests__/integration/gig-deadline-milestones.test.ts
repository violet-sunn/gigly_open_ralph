import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { createTestUser, createTestGig } from '../helpers/seed'

// Mock @/lib/prisma to use the test database (lazy getter)
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))

// Mock next/headers for session cookie management
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

// Mock next/navigation redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

// Import after mocks
import { createGig } from '@/app/actions/gig'
import type { GigCardVM } from '@/app/components/blocks/view-models'

function gigForm(opts?: { deadlineDays?: string; stageCount?: string; title?: string }) {
  const fd = new FormData()
  fd.set('title', opts?.title ?? `Гиг ${Math.random().toString(36).slice(2)}`)
  fd.set('description', 'Подробное описание задачи для теста сроков и этапов.')
  fd.set('acceptanceCriteria', 'Критерии приёмки должны быть достаточно длинными, минимум пятьдесят символов точно.')
  fd.set('budget', '120000')
  fd.set('tags', 'React,TypeScript')
  if (opts?.deadlineDays !== undefined) fd.set('deadlineDays', opts.deadlineDays)
  if (opts?.stageCount !== undefined) fd.set('stageCount', opts.stageCount)
  return fd
}

const latestGig = (prisma: ReturnType<typeof getTestPrismaClient>, clientId: string) =>
  prisma.gig.findFirst({ where: { clientId }, orderBy: { createdAt: 'desc' } })

describe('Gig deadline & stages — create inputs', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('persists a valid deadline and stage count', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    await withAuthContext(client, async () => {
      await expect(createGig(null, gigForm({ deadlineDays: '14', stageCount: '3' }))).rejects.toThrow('NEXT_REDIRECT')
    })
    const gig = await latestGig(prisma, client.id)
    expect(gig?.deadlineDays).toBe(14)
    expect(gig?.stageCount).toBe(3)
  })

  it('defaults to 0 / 1 when not supplied (backward-compatible)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    await withAuthContext(client, async () => {
      await expect(createGig(null, gigForm())).rejects.toThrow('NEXT_REDIRECT')
    })
    const gig = await latestGig(prisma, client.id)
    expect(gig?.deadlineDays).toBe(0)
    expect(gig?.stageCount).toBe(1)
  })

  it('rejects an invalid deadline', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    for (const bad of ['0', '-1', '400', 'abc', '3.5']) {
      const result = await withAuthContext(client, async () => createGig(null, gigForm({ deadlineDays: bad })))
      expect(result?.error, `deadline ${bad} should be rejected`).toBeTruthy()
    }
    expect(await prisma.gig.count({ where: { clientId: client.id } })).toBe(0)
  })

  it('rejects an invalid stage count', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    for (const bad of ['0', '-1', '100', 'x', '2.5']) {
      const result = await withAuthContext(client, async () => createGig(null, gigForm({ stageCount: bad })))
      expect(result?.error, `stageCount ${bad} should be rejected`).toBeTruthy()
    }
    expect(await prisma.gig.count({ where: { clientId: client.id } })).toBe(0)
  })
})

describe('Gig deadline & stages — legacy graceful + contract', () => {
  beforeEach(() => setTestSessionToken(undefined))

  it('legacy gigs (no fields) default to 0 / 1 and stay queryable', async () => {
    const prisma = getTestPrismaClient()
    const gig = await createTestGig(prisma, { status: 'OPEN' })
    const fetched = await prisma.gig.findUnique({ where: { id: gig.id } })
    expect(fetched?.deadlineDays).toBe(0)
    expect(fetched?.stageCount).toBe(1)
  })

  it('field types match the GigCard contract', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    await withAuthContext(client, async () => {
      await expect(createGig(null, gigForm({ deadlineDays: '21', stageCount: '2' }))).rejects.toThrow('NEXT_REDIRECT')
    })
    const gig = await latestGig(prisma, client.id)
    expect(typeof gig?.deadlineDays).toBe('number')
    expect(Number.isInteger(gig?.stageCount) && (gig?.stageCount ?? 0) >= 1).toBe(true)
    // compile-time contract match: gig.deadlineDays is assignable to GigCardVM['deadlineDays']
    const _check: GigCardVM['deadlineDays'] = gig!.deadlineDays
    expect(_check).toBe(21)
  })
})
