import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { setTestSessionToken, getTestSessionToken, withAuthContext } from '../helpers/auth'
import { createTestUser, createTestGig, createTestApplication } from '../helpers/seed'

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
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import {
  deleteGig,
  deleteUser,
  getGigDeletionImpact,
  getUserDeletionImpact,
} from '@/app/actions/moderation'

const form = (o: Record<string, string>) => {
  const f = new FormData()
  for (const [k, v] of Object.entries(o)) f.append(k, v)
  return f
}

describe('Admin hard deletion', () => {
  let prisma: ReturnType<typeof getTestPrismaClient>

  beforeEach(() => {
    prisma = getTestPrismaClient()
    setTestSessionToken(undefined)
  })
  afterEach(() => setTestSessionToken(undefined))

  const mkAdmin = () => createTestUser(prisma, { role: 'ADMIN' })

  it('redirects an unauthenticated caller to /login (both actions)', async () => {
    // No session is set (beforeEach cleared it), so getSession() returns null → redirect.
    await expect(deleteGig(null, form({ gigId: 'x', reason: 'y' }))).rejects.toThrow('NEXT_REDIRECT:/login')
    await expect(deleteUser(null, form({ userId: 'x', reason: 'y' }))).rejects.toThrow('NEXT_REDIRECT:/login')
  })

  // ---- deleteGig -----------------------------------------------------------
  describe('deleteGig', () => {
    it('refuses a non-admin caller and deletes nothing', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })

      const result = await withAuthContext(client, () => deleteGig(null, form({ gigId: gig.id, reason: 'x' })))
      expect(result).toEqual({ error: 'Действия модерации доступны только администраторам.' })
      expect(await prisma.gig.findUnique({ where: { id: gig.id } })).not.toBeNull()
    })

    it('refuses a missing gig and an empty reason', async () => {
      const admin = await mkAdmin()
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })

      expect(await withAuthContext(admin, () => deleteGig(null, form({ gigId: 'nope', reason: 'x' })))).toHaveProperty(
        'error',
      )
      expect(await withAuthContext(admin, () => deleteGig(null, form({ gigId: gig.id, reason: '  ' })))).toEqual({
        error: 'Укажите причину удаления гига.',
      })
      expect(await prisma.gig.findUnique({ where: { id: gig.id } })).not.toBeNull()
    })

    it('refuses a gig with an OPEN dispute and deletes nothing', async () => {
      const admin = await mkAdmin()
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const spec = await createTestUser(prisma, { role: 'SPECIALIST' })
      const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: spec.id, status: 'REVIEW' })
      await prisma.dispute.create({ data: { gigId: gig.id, openerId: spec.id, reason: 'scope', status: 'OPEN' } })

      const result = await withAuthContext(admin, () => deleteGig(null, form({ gigId: gig.id, reason: 'spam' })))
      expect(result).toEqual({ error: 'По гигу открыт спор — удалить его можно будет после решения модератора.' })
      expect(await prisma.gig.findUnique({ where: { id: gig.id } })).not.toBeNull()
    })

    it('purges a gig and every dependent transactionally, leaving unrelated data intact', async () => {
      const admin = await mkAdmin()
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const spec = await createTestUser(prisma, { role: 'SPECIALIST' })
      const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: spec.id, status: 'COMPLETED' })
      const app = await createTestApplication(prisma, { gigId: gig.id, specialistId: spec.id, status: 'ACCEPTED' })
      await prisma.message.create({ data: { gigId: gig.id, senderId: spec.id, content: 'hi' } })
      await prisma.notification.create({ data: { userId: client.id, gigId: gig.id } })
      await prisma.review.create({ data: { gigId: gig.id, authorId: client.id, targetId: spec.id, rating: 5 } })
      const dispute = await prisma.dispute.create({
        data: { gigId: gig.id, openerId: spec.id, reason: 'scope', status: 'RESOLVED' },
      })
      await prisma.disputeEntry.create({ data: { disputeId: dispute.id, authorRole: 'specialist', text: 'note' } })

      // An unrelated gig that must survive.
      const otherGig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })

      await withAuthContext(admin, async () => {
        await expect(deleteGig(null, form({ gigId: gig.id, reason: 'нарушение правил' }))).rejects.toThrow(
          'NEXT_REDIRECT',
        )
      })

      expect(await prisma.gig.findUnique({ where: { id: gig.id } })).toBeNull()
      expect(await prisma.application.findUnique({ where: { id: app.id } })).toBeNull()
      expect(await prisma.message.count({ where: { gigId: gig.id } })).toBe(0)
      expect(await prisma.notification.count({ where: { gigId: gig.id } })).toBe(0)
      expect(await prisma.review.count({ where: { gigId: gig.id } })).toBe(0)
      expect(await prisma.dispute.count({ where: { gigId: gig.id } })).toBe(0)
      expect(await prisma.disputeEntry.count({ where: { disputeId: dispute.id } })).toBe(0)
      // Unrelated gig untouched.
      expect(await prisma.gig.findUnique({ where: { id: otherGig.id } })).not.toBeNull()

      // Audit written with a durable snapshot (targetGigId nulls out, so the id+title live in `reason`).
      const log = await prisma.moderationLog.findFirst({ where: { action: 'DELETE_GIG' } })
      expect(log).not.toBeNull()
      expect(log!.adminId).toBe(admin.id)
      expect(log!.reason).toContain(gig.id)
      expect(log!.reason).toContain(gig.title)
    })
  })

  // ---- deleteUser ----------------------------------------------------------
  describe('deleteUser', () => {
    it('refuses a non-admin caller', async () => {
      const admin = await mkAdmin()
      const target = await createTestUser(prisma, { role: 'SPECIALIST' })
      const nonAdmin = await createTestUser(prisma, { role: 'CLIENT' })

      const result = await withAuthContext(nonAdmin, () => deleteUser(null, form({ userId: target.id, reason: 'x' })))
      expect(result).toEqual({ error: 'Действия модерации доступны только администраторам.' })
      expect(await prisma.user.findUnique({ where: { id: target.id } })).not.toBeNull()
      void admin
    })

    it('refuses missing target, empty reason, an ADMIN target, and self', async () => {
      const admin = await mkAdmin()
      const otherAdmin = await createTestUser(prisma, { role: 'ADMIN' })
      const target = await createTestUser(prisma, { role: 'SPECIALIST' })

      expect(
        await withAuthContext(admin, () => deleteUser(null, form({ userId: 'nope', reason: 'x' }))),
      ).toHaveProperty('error')
      expect(await withAuthContext(admin, () => deleteUser(null, form({ userId: target.id, reason: ' ' })))).toEqual({
        error: 'Укажите причину удаления пользователя.',
      })
      expect(await withAuthContext(admin, () => deleteUser(null, form({ userId: otherAdmin.id, reason: 'x' })))).toEqual(
        { error: 'Администратора нельзя удалить через консоль.' },
      )
      expect(await withAuthContext(admin, () => deleteUser(null, form({ userId: admin.id, reason: 'x' })))).toEqual({
        error: 'Нельзя удалить собственную учётную запись.',
      })
      expect(await prisma.user.findUnique({ where: { id: target.id } })).not.toBeNull()
    })

    it('refuses a user who still owns gigs', async () => {
      const admin = await mkAdmin()
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })

      const result = await withAuthContext(admin, () => deleteUser(null, form({ userId: client.id, reason: 'spam' })))
      expect(result.error).toMatch(/Сначала удалите/)
      expect(await prisma.user.findUnique({ where: { id: client.id } })).not.toBeNull()
    })

    it('refuses a user with an open dispute, and one on an active assignment', async () => {
      const admin = await mkAdmin()
      const otherClient = await createTestUser(prisma, { role: 'CLIENT' })

      // Opener of an OPEN dispute on someone else's gig — owns no gigs.
      const opener = await createTestUser(prisma, { role: 'SPECIALIST' })
      const gigA = await createTestGig(prisma, { clientId: otherClient.id, assignedSpecialistId: opener.id, status: 'REVIEW' })
      await prisma.dispute.create({ data: { gigId: gigA.id, openerId: opener.id, reason: 'scope', status: 'OPEN' } })
      expect(
        (await withAuthContext(admin, () => deleteUser(null, form({ userId: opener.id, reason: 'x' })))).error,
      ).toMatch(/спор/)
      expect(await prisma.user.findUnique({ where: { id: opener.id } })).not.toBeNull()

      // Assigned specialist on an IN_PROGRESS gig — owns no gigs, no dispute.
      const worker = await createTestUser(prisma, { role: 'SPECIALIST' })
      await createTestGig(prisma, { clientId: otherClient.id, assignedSpecialistId: worker.id, status: 'IN_PROGRESS' })
      expect(
        (await withAuthContext(admin, () => deleteUser(null, form({ userId: worker.id, reason: 'x' })))).error,
      ).toMatch(/активн/)
      expect(await prisma.user.findUnique({ where: { id: worker.id } })).not.toBeNull()
    })

    it('purges a gig-less user and their footprint, leaving other users and their gigs intact', async () => {
      const admin = await mkAdmin()
      const otherClient = await createTestUser(prisma, { role: 'CLIENT' })
      const target = await createTestUser(prisma, { role: 'SPECIALIST' })

      // The target's own footprint on OTHER people's gigs.
      const liveGig = await createTestGig(prisma, { clientId: otherClient.id, status: 'OPEN' })
      const app = await createTestApplication(prisma, { gigId: liveGig.id, specialistId: target.id, status: 'PENDING' })

      // A terminal gig they were assigned to (assignment should null out, gig survives).
      const doneGig = await createTestGig(prisma, { clientId: otherClient.id, assignedSpecialistId: target.id, status: 'PAID' })
      await prisma.review.create({ data: { gigId: doneGig.id, authorId: otherClient.id, targetId: target.id, rating: 4 } })
      await prisma.review.create({ data: { gigId: doneGig.id, authorId: target.id, targetId: otherClient.id, rating: 5 } })
      const msg = await prisma.message.create({ data: { gigId: doneGig.id, senderId: target.id, content: 'done' } })
      await prisma.dispute.create({ data: { gigId: doneGig.id, openerId: target.id, reason: 'late', status: 'RESOLVED' } })
      await prisma.notification.create({ data: { userId: target.id, gigId: doneGig.id } })
      await prisma.session.create({ data: { userId: target.id } })
      // createTestUser({ role: 'SPECIALIST' }) already made the SpecialistProfile — it must cascade on delete.

      // A prior moderation log that targeted this user — must survive with targetUserId nulled.
      await prisma.moderationLog.create({
        data: { action: 'SUSPEND_USER', reason: 'earlier', adminId: admin.id, targetUserId: target.id },
      })

      await withAuthContext(admin, async () => {
        await expect(deleteUser(null, form({ userId: target.id, reason: 'спам-аккаунт' }))).rejects.toThrow(
          'NEXT_REDIRECT',
        )
      })

      // Target and their footprint gone.
      expect(await prisma.user.findUnique({ where: { id: target.id } })).toBeNull()
      expect(await prisma.specialistProfile.findUnique({ where: { userId: target.id } })).toBeNull()
      expect(await prisma.session.count({ where: { userId: target.id } })).toBe(0)
      expect(await prisma.notification.count({ where: { userId: target.id } })).toBe(0)
      expect(await prisma.application.findUnique({ where: { id: app.id } })).toBeNull()
      expect(await prisma.review.count({ where: { OR: [{ authorId: target.id }, { targetId: target.id }] } })).toBe(0)
      expect(await prisma.dispute.count({ where: { openerId: target.id } })).toBe(0)

      // Other users and their gigs survive; the target's assignment and message are unlinked, not deleted.
      expect(await prisma.user.findUnique({ where: { id: otherClient.id } })).not.toBeNull()
      expect(await prisma.gig.findUnique({ where: { id: liveGig.id } })).not.toBeNull()
      const survivedDone = await prisma.gig.findUnique({ where: { id: doneGig.id } })
      expect(survivedDone).not.toBeNull()
      expect(survivedDone!.assignedSpecialistId).toBeNull()
      const survivedMsg = await prisma.message.findUnique({ where: { id: msg.id } })
      expect(survivedMsg).not.toBeNull()
      expect(survivedMsg!.senderId).toBeNull()

      // Audit: DELETE_USER with the durable id+email snapshot; the prior log survives with a nulled target.
      const del = await prisma.moderationLog.findFirst({ where: { action: 'DELETE_USER' } })
      expect(del).not.toBeNull()
      expect(del!.reason).toContain(target.id)
      expect(del!.reason).toContain(target.email)
      const prior = await prisma.moderationLog.findFirst({ where: { action: 'SUSPEND_USER' } })
      expect(prior).not.toBeNull()
      expect(prior!.targetUserId).toBeNull()
    })
  })

  // ---- impact previews (read-only) ----------------------------------------
  describe('deletion impact previews', () => {
    it('getGigDeletionImpact returns exact counts + hasOpenDispute and mutates nothing', async () => {
      const admin = await mkAdmin()
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const spec = await createTestUser(prisma, { role: 'SPECIALIST' })
      const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: spec.id, status: 'REVIEW' })
      await createTestApplication(prisma, { gigId: gig.id, specialistId: spec.id, status: 'ACCEPTED' })
      await prisma.message.create({ data: { gigId: gig.id, senderId: spec.id, content: 'a' } })
      await prisma.message.create({ data: { gigId: gig.id, senderId: client.id, content: 'b' } })
      await prisma.review.create({ data: { gigId: gig.id, authorId: client.id, targetId: spec.id, rating: 5 } })
      await prisma.dispute.create({ data: { gigId: gig.id, openerId: spec.id, reason: 'scope', status: 'OPEN' } })

      const impact = await withAuthContext(admin, () => getGigDeletionImpact(gig.id))
      expect(impact).toEqual({ applications: 1, messages: 2, reviews: 1, disputes: 1, hasOpenDispute: true })

      // Read-only.
      expect(await prisma.gig.findUnique({ where: { id: gig.id } })).not.toBeNull()
      expect(await prisma.message.count({ where: { gigId: gig.id } })).toBe(2)
    })

    it('getGigDeletionImpact returns null for a non-admin', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
      expect(await withAuthContext(client, () => getGigDeletionImpact(gig.id))).toBeNull()
    })

    it('getUserDeletionImpact returns counts + block flags', async () => {
      const admin = await mkAdmin()
      const otherClient = await createTestUser(prisma, { role: 'CLIENT' })

      // A gig-owning client → ownsGigs blocks.
      const owner = await createTestUser(prisma, { role: 'CLIENT' })
      await createTestGig(prisma, { clientId: owner.id, status: 'OPEN' })
      const ownerImpact = await withAuthContext(admin, () => getUserDeletionImpact(owner.id))
      expect(ownerImpact!.ownedGigs).toBe(1)
      expect(ownerImpact!.blocked.ownsGigs).toBe(true)

      // A clean specialist with a footprint on someone else's gig, no blockers.
      const clean = await createTestUser(prisma, { role: 'SPECIALIST' })
      const g = await createTestGig(prisma, { clientId: otherClient.id, status: 'OPEN' })
      await createTestApplication(prisma, { gigId: g.id, specialistId: clean.id, status: 'PENDING' })
      const cleanImpact = await withAuthContext(admin, () => getUserDeletionImpact(clean.id))
      expect(cleanImpact!.applications).toBe(1)
      expect(cleanImpact!.blocked).toEqual({
        isAdmin: false,
        isSelf: false,
        ownsGigs: false,
        hasOpenDispute: false,
        activeAssignment: false,
      })

      // Admin/self flags.
      const adminImpact = await withAuthContext(admin, () => getUserDeletionImpact(admin.id))
      expect(adminImpact!.blocked.isAdmin).toBe(true)
      expect(adminImpact!.blocked.isSelf).toBe(true)

      // Active assignment flag.
      const worker = await createTestUser(prisma, { role: 'SPECIALIST' })
      await createTestGig(prisma, { clientId: otherClient.id, assignedSpecialistId: worker.id, status: 'IN_PROGRESS' })
      const workerImpact = await withAuthContext(admin, () => getUserDeletionImpact(worker.id))
      expect(workerImpact!.blocked.activeAssignment).toBe(true)
    })
  })
})
