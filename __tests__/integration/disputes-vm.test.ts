import { describe, it, expect, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser, createTestGig } from '../helpers/seed'

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

import { getDisputes, getDispute } from '@/lib/view-models'

/**
 * compose-disputes mapper tests — getDisputes (role-scoped list) + getDispute (authorized detail), thin aggregators
 * over lib/disputes. Verifies: ADMIN sees all; a participant sees only their own; detail authorization (admin /
 * participant via opener OR gig client OR assigned specialist → detail; outsider → null); status mapping.
 */
describe('getDisputes / getDispute', () => {
  it('ADMIN getDisputes returns ALL disputes; a participant sees only their own', async () => {
    const prisma = getTestPrismaClient()
    const admin = await createTestUser(prisma, { role: 'ADMIN' })
    const clientA = await createTestUser(prisma, { role: 'CLIENT' })
    const clientB = await createTestUser(prisma, { role: 'CLIENT' })
    const spec = await createTestUser(prisma, { role: 'SPECIALIST' })

    const gigA = await createTestGig(prisma, {
      clientId: clientA.id,
      assignedSpecialistId: spec.id,
      status: 'IN_PROGRESS',
      title: 'Спорный гиг A',
    })
    const gigB = await createTestGig(prisma, {
      clientId: clientB.id,
      assignedSpecialistId: spec.id,
      status: 'IN_PROGRESS',
      title: 'Спорный гиг B',
    })

    await prisma.dispute.create({ data: { gigId: gigA.id, openerId: clientA.id, reason: 'A: scope grew' } })
    await prisma.dispute.create({ data: { gigId: gigB.id, openerId: clientB.id, reason: 'B: quality issue' } })

    const adminView = await getDisputes({ userId: admin.id, role: 'ADMIN' })
    expect(adminView.isAdmin).toBe(true)
    expect(adminView.disputes.disputes).toHaveLength(2)

    // clientA is a participant only of gigA's dispute (opener); not of gigB
    const aView = await getDisputes({ userId: clientA.id, role: 'CLIENT' })
    expect(aView.isAdmin).toBe(false)
    expect(aView.disputes.disputes).toHaveLength(1)
    expect(aView.disputes.disputes[0].gig).toBe('Спорный гиг A')

    // the assigned specialist participates in BOTH gigs' disputes (gig.assignedSpecialistId)
    const specView = await getDisputes({ userId: spec.id, role: 'SPECIALIST' })
    expect(specView.disputes.disputes).toHaveLength(2)
  })

  it('getDispute enforces authorization: admin + participants get it; an outsider gets null', async () => {
    const prisma = getTestPrismaClient()
    const admin = await createTestUser(prisma, { role: 'ADMIN' })
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const spec = await createTestUser(prisma, { role: 'SPECIALIST' })
    const outsider = await createTestUser(prisma, { role: 'SPECIALIST' })

    const gig = await createTestGig(prisma, {
      clientId: client.id,
      assignedSpecialistId: spec.id,
      status: 'IN_PROGRESS',
      title: 'Гиг со спором',
    })
    // The assigned specialist opens the dispute.
    const dispute = await prisma.dispute.create({
      data: { gigId: gig.id, openerId: spec.id, reason: 'Работа отклонена без причины' },
    })

    // Admin → detail
    const adminDetail = await getDispute(dispute.id, { userId: admin.id, role: 'ADMIN' })
    expect(adminDetail).not.toBeNull()
    expect(adminDetail!.gig).toBe('Гиг со спором')
    expect(adminDetail!.reason).toBe('Работа отклонена без причины')
    expect(adminDetail!.status).toBe('open') // OPEN → open

    // Opener (assigned specialist) → detail
    const openerDetail = await getDispute(dispute.id, { userId: spec.id, role: 'SPECIALIST' })
    expect(openerDetail).not.toBeNull()

    // The gig's client (participant, not opener) → detail
    const clientDetail = await getDispute(dispute.id, { userId: client.id, role: 'CLIENT' })
    expect(clientDetail).not.toBeNull()

    // An unrelated user → null (authorization)
    const outsiderDetail = await getDispute(dispute.id, { userId: outsider.id, role: 'SPECIALIST' })
    expect(outsiderDetail).toBeNull()

    // Non-existent dispute → null
    const missing = await getDispute('does-not-exist', { userId: admin.id, role: 'ADMIN' })
    expect(missing).toBeNull()
  })

  it('maps the dispute status to the design Status (RESOLVED → completed, REJECTED → rejected)', async () => {
    const prisma = getTestPrismaClient()
    const admin = await createTestUser(prisma, { role: 'ADMIN' })
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const spec = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, {
      clientId: client.id,
      assignedSpecialistId: spec.id,
      status: 'COMPLETED',
    })

    const resolved = await prisma.dispute.create({
      data: { gigId: gig.id, openerId: client.id, reason: 'r', status: 'RESOLVED', resolution: 'в пользу заказчика' },
    })
    const rejected = await prisma.dispute.create({
      data: { gigId: gig.id, openerId: spec.id, reason: 'r2', status: 'REJECTED', resolution: 'отклонено' },
    })

    const r1 = await getDispute(resolved.id, { userId: admin.id, role: 'ADMIN' })
    expect(r1!.status).toBe('completed')
    expect(r1!.resolution).toBe('в пользу заказчика')

    const r2 = await getDispute(rejected.id, { userId: admin.id, role: 'ADMIN' })
    expect(r2!.status).toBe('rejected')

    const list = await getDisputes({ userId: admin.id, role: 'ADMIN' })
    const statuses = list.disputes.disputes.map((d) => d.status).sort()
    expect(statuses).toEqual(['completed', 'rejected'])
  })
})
