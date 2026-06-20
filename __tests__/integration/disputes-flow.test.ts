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

// Mock next/cache (resolveDispute / closeGig call revalidatePath)
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Import after mocks
import { openDispute, resolveDispute } from '@/app/actions/dispute'
import { closeGig } from '@/app/actions/moderation'
import { getDisputeList, getDisputeDetail } from '@/lib/disputes'
import type { DisputeListVM } from '@/app/components/blocks/view-models'

type TestPrisma = ReturnType<typeof getTestPrismaClient>

function openForm(gigId: string, reason = 'Scope grew significantly beyond the original task description here.') {
  const fd = new FormData()
  fd.set('gigId', gigId)
  fd.set('reason', reason)
  return fd
}

function resolveForm(disputeId: string, resolution: string, status?: string, verdict?: string) {
  const fd = new FormData()
  fd.set('disputeId', disputeId)
  fd.set('resolution', resolution)
  if (status) fd.set('status', status)
  if (verdict) fd.set('verdict', verdict)
  return fd
}

async function gigWithSpecialist(prisma: TestPrisma) {
  const client = await createTestUser(prisma, { role: 'CLIENT' })
  const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
  const gig = await createTestGig(prisma, {
    clientId: client.id,
    assignedSpecialistId: specialist.id,
    status: 'IN_PROGRESS',
  })
  return { client, specialist, gig }
}

describe('disputes-flow — open (participants)', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('a participant (client) opens an OPEN dispute', async () => {
    const prisma = getTestPrismaClient()
    const { client, gig } = await gigWithSpecialist(prisma)
    await withAuthContext(client, async () => {
      await expect(openDispute(null, openForm(gig.id))).rejects.toThrow('NEXT_REDIRECT')
    })
    const d = await prisma.dispute.findUnique({
      where: { gigId_openerId: { gigId: gig.id, openerId: client.id } },
    })
    expect(d?.status).toBe('OPEN')
    expect(d?.reason).toBeTruthy()
  })

  it('the assigned specialist can also open a dispute', async () => {
    const prisma = getTestPrismaClient()
    const { specialist, gig } = await gigWithSpecialist(prisma)
    await withAuthContext(specialist, async () => {
      await expect(openDispute(null, openForm(gig.id))).rejects.toThrow('NEXT_REDIRECT')
    })
    expect(await prisma.dispute.count({ where: { gigId: gig.id, openerId: specialist.id } })).toBe(1)
  })

  it('rejects a non-participant', async () => {
    const prisma = getTestPrismaClient()
    const { gig } = await gigWithSpecialist(prisma)
    const stranger = await createTestUser(prisma, { role: 'SPECIALIST' })
    const r = await withAuthContext(stranger, async () => openDispute(null, openForm(gig.id)))
    expect(r?.error).toBeTruthy()
    expect(await prisma.dispute.count({ where: { gigId: gig.id } })).toBe(0)
  })

  it('rejects an empty reason', async () => {
    const prisma = getTestPrismaClient()
    const { client, gig } = await gigWithSpecialist(prisma)
    const r = await withAuthContext(client, async () => openDispute(null, openForm(gig.id, '   ')))
    expect(r?.error).toBeTruthy()
  })

  it('rejects a gig with no assigned specialist', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    const r = await withAuthContext(client, async () => openDispute(null, openForm(gig.id)))
    expect(r?.error).toBeTruthy()
    expect(await prisma.dispute.count({ where: { gigId: gig.id } })).toBe(0)
  })

  it('rejects a duplicate dispute by the same opener on the same gig', async () => {
    const prisma = getTestPrismaClient()
    const { client, gig } = await gigWithSpecialist(prisma)
    await prisma.dispute.create({ data: { gigId: gig.id, openerId: client.id, reason: 'first' } })
    const r = await withAuthContext(client, async () => openDispute(null, openForm(gig.id)))
    expect(r?.error).toBeTruthy()
    expect(await prisma.dispute.count({ where: { gigId: gig.id, openerId: client.id } })).toBe(1)
  })
})

describe('disputes-flow — resolve + audit (admin)', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('an admin resolves a dispute and writes a linked ModerationLog audit', async () => {
    const prisma = getTestPrismaClient()
    const { client, gig } = await gigWithSpecialist(prisma)
    const admin = await createTestUser(prisma, { role: 'ADMIN' })
    const dispute = await prisma.dispute.create({
      data: { gigId: gig.id, openerId: client.id, reason: 'scope dispute' },
    })

    await withAuthContext(admin, async () => {
      await expect(
        resolveDispute(null, resolveForm(dispute.id, 'Refund 50% to the client.', 'RESOLVED'))
      ).rejects.toThrow('NEXT_REDIRECT')
    })

    const resolved = await prisma.dispute.findUnique({ where: { id: dispute.id } })
    expect(resolved?.status).toBe('RESOLVED')
    expect(resolved?.resolution).toBe('Refund 50% to the client.')
    expect(resolved?.resolvedById).toBe(admin.id)
    expect(resolved?.resolutionLogId).toBeTruthy()

    const log = await prisma.moderationLog.findUnique({ where: { id: resolved!.resolutionLogId! } })
    expect(log?.action).toBe('RESOLVE_DISPUTE')
    expect(log?.adminId).toBe(admin.id)
    expect(log?.targetGigId).toBe(gig.id)
    expect(log?.targetUserId).toBe(client.id)
  })

  it('a verdict prefixes the resolution and appends a moderator timeline entry (reconcile-disputes-flow)', async () => {
    const prisma = getTestPrismaClient()
    const { client, gig } = await gigWithSpecialist(prisma)
    const admin = await createTestUser(prisma, { role: 'ADMIN' })
    const dispute = await prisma.dispute.create({
      data: { gigId: gig.id, openerId: client.id, reason: 'Результат не соответствует ТЗ' },
    })

    await withAuthContext(admin, async () => {
      await expect(
        resolveDispute(null, resolveForm(dispute.id, 'Бюджет возвращён.', 'RESOLVED', 'specialist'))
      ).rejects.toThrow('NEXT_REDIRECT')
    })

    const resolved = await prisma.dispute.findUnique({ where: { id: dispute.id } })
    expect(resolved?.status).toBe('RESOLVED')
    expect(resolved?.resolution).toBe('В пользу специалиста — Бюджет возвращён.') // verdict prefixed

    const entries = await prisma.disputeEntry.findMany({ where: { disputeId: dispute.id } })
    const moderatorEntry = entries.find((e) => e.authorRole === 'moderator')
    expect(moderatorEntry).toBeTruthy()
    expect(moderatorEntry?.text).toBe('В пользу специалиста — Бюджет возвращён.')
  })

  it('rejects a non-admin', async () => {
    const prisma = getTestPrismaClient()
    const { client, gig } = await gigWithSpecialist(prisma)
    const dispute = await prisma.dispute.create({ data: { gigId: gig.id, openerId: client.id, reason: 'x' } })
    const r = await withAuthContext(client, async () => resolveDispute(null, resolveForm(dispute.id, 'no')))
    expect(r?.error).toBeTruthy()
    expect((await prisma.dispute.findUnique({ where: { id: dispute.id } }))?.status).toBe('OPEN')
  })

  it('rejects an already-resolved dispute', async () => {
    const prisma = getTestPrismaClient()
    const { client, gig } = await gigWithSpecialist(prisma)
    const admin = await createTestUser(prisma, { role: 'ADMIN' })
    const dispute = await prisma.dispute.create({
      data: { gigId: gig.id, openerId: client.id, reason: 'x', status: 'RESOLVED' },
    })
    const r = await withAuthContext(admin, async () => resolveDispute(null, resolveForm(dispute.id, 'again')))
    expect(r?.error).toBeTruthy()
  })

  it('rejects an empty resolution', async () => {
    const prisma = getTestPrismaClient()
    const { client, gig } = await gigWithSpecialist(prisma)
    const admin = await createTestUser(prisma, { role: 'ADMIN' })
    const dispute = await prisma.dispute.create({ data: { gigId: gig.id, openerId: client.id, reason: 'x' } })
    const r = await withAuthContext(admin, async () => resolveDispute(null, resolveForm(dispute.id, '   ')))
    expect(r?.error).toBeTruthy()
    expect((await prisma.dispute.findUnique({ where: { id: dispute.id } }))?.status).toBe('OPEN')
  })
})

describe('disputes-flow — status to participants + contract', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('a participant sees their dispute status (open → completed after resolution)', async () => {
    const prisma = getTestPrismaClient()
    const { client, gig } = await gigWithSpecialist(prisma)
    const dispute = await prisma.dispute.create({
      data: { gigId: gig.id, openerId: client.id, reason: 'scope dispute' },
    })

    let list = await getDisputeList({ participantId: client.id })
    expect(list.disputes).toHaveLength(1)
    expect(list.disputes[0].id).toBe(dispute.id)
    expect(list.disputes[0].status).toBe('open')

    const admin = await createTestUser(prisma, { role: 'ADMIN' })
    await withAuthContext(admin, async () => {
      await expect(resolveDispute(null, resolveForm(dispute.id, 'done'))).rejects.toThrow('NEXT_REDIRECT')
    })

    list = await getDisputeList({ participantId: client.id })
    expect(list.disputes[0].status).toBe('completed')

    const detail = await getDisputeDetail(dispute.id)
    expect(detail?.reason).toBe('scope dispute')
    expect(detail?.status).toBe('completed')
    expect(detail?.resolution).toBe('done')
  })

  it('getDisputeList matches the DisputeListVM contract (status mapped to design Status)', async () => {
    const prisma = getTestPrismaClient()
    const { client, gig } = await gigWithSpecialist(prisma)
    await prisma.dispute.create({ data: { gigId: gig.id, openerId: client.id, reason: 'x' } })

    const list: DisputeListVM = await getDisputeList()
    expect(Array.isArray(list.disputes)).toBe(true)
    expect(['open', 'review', 'in-progress', 'verification', 'completed', 'rejected']).toContain(
      list.disputes[0].status
    )
    expect(typeof list.disputes[0].opener).toBe('string')
    expect(typeof list.disputes[0].gig).toBe('string')
  })
})

describe('disputes-flow — existing moderation unaffected', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('closeGig still closes a gig and writes a CLOSE_GIG ModerationLog', async () => {
    const prisma = getTestPrismaClient()
    const admin = await createTestUser(prisma, { role: 'ADMIN' })
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })

    const fd = new FormData()
    fd.set('gigId', gig.id)
    fd.set('reason', 'Violation of platform terms.')
    await withAuthContext(admin, async () => {
      await expect(closeGig(null, fd)).rejects.toThrow('NEXT_REDIRECT')
    })

    const closed = await prisma.gig.findUnique({ where: { id: gig.id } })
    expect(closed?.closedByAdmin).toBe(true)
    const log = await prisma.moderationLog.findFirst({
      where: { action: 'CLOSE_GIG', targetGigId: gig.id },
    })
    expect(log).toBeTruthy()
  })
})
