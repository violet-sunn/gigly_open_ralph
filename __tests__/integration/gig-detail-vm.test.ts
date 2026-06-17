import { describe, it, expect, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser, createTestGig, createTestApplication } from '../helpers/seed'

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

import { getGigDetail } from '@/lib/view-models'

describe('getGigDetail', () => {
  it('returns null for a missing gig', async () => {
    const data = await getGigDetail('nonexistent', { userId: 'u', role: 'SPECIALIST' })
    expect(data).toBeNull()
  })

  it('maps a SPECIALIST view of an OPEN gig (canApply, header, requirements, criteria, terms, client rating)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT', companyName: 'ООО Ромашка' })
    const reviewer = await createTestUser(prisma, { role: 'SPECIALIST' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'OPEN',
      tags: 'React,Go',
      goal: 'Цель проекта',
      deliverables: 'Результаты',
      constraints: 'Ограничения',
      acceptanceCriteria: 'Критерий один\nКритерий два',
    })
    await prisma.review.create({ data: { rating: 4, gigId: gig.id, authorId: reviewer.id, targetId: client.id } })

    const data = await getGigDetail(gig.id, { userId: specialist.id, role: 'SPECIALIST' })

    expect(data).not.toBeNull()
    expect(data!.header.status).toBe('open')
    expect(data!.header.tags).toEqual(['React', 'Go'])
    expect(data!.requirements).toHaveLength(3) // goal + deliverables + constraints
    expect(data!.criteria.items.map((i) => i.label)).toEqual(['Критерий один', 'Критерий два'])
    expect(data!.client.name).toBe('ООО Ромашка')
    expect(data!.client.rating.value).toBe(4)
    expect(data!.lifecycle.canApply).toBe(true)
    expect(data!.isOwner).toBe(false)
    expect(data!.viewerApplication).toBeNull()
    // No application counter → proposed terms fall back to the gig's
    expect(data!.terms.proposed).toEqual(data!.terms.client)
    expect(data!.apply.fields.map((f) => f.name)).toEqual(['approach', 'questions', 'estimatedEffort'])
  })

  it('reflects the viewer application + terms counter, and the owner view of applications', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST', displayName: 'Спец' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    const app = await createTestApplication(prisma, { gigId: gig.id, specialistId: specialist.id, status: 'PENDING' })
    await prisma.application.update({
      where: { id: app.id },
      data: { proposedBudget: 5000000, proposedDeadlineDays: 5 },
    })

    const specView = await getGigDetail(gig.id, { userId: specialist.id, role: 'SPECIALIST' })
    expect(specView!.viewerApplication?.status).toBe('PENDING')
    expect(specView!.lifecycle.canApply).toBe(false) // already applied
    expect(specView!.terms.proposed.find((r) => r.label === 'Срок')?.value).toBe('5 дней')

    const ownerView = await getGigDetail(gig.id, { userId: client.id, role: 'CLIENT' })
    expect(ownerView!.isOwner).toBe(true)
    expect(ownerView!.applications).toHaveLength(1)
    expect(ownerView!.applications[0].name).toBe('Спец')
    expect(ownerView!.applications[0].status).toBe('PENDING')
  })

  it('exposes lifecycle + messaging flags for the assigned specialist and owner across statuses', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const inProgress = await createTestGig(prisma, {
      clientId: client.id,
      status: 'IN_PROGRESS',
      assignedSpecialistId: specialist.id,
    })
    const review = await createTestGig(prisma, {
      clientId: client.id,
      status: 'REVIEW',
      assignedSpecialistId: specialist.id,
    })
    const completed = await createTestGig(prisma, {
      clientId: client.id,
      status: 'COMPLETED',
      assignedSpecialistId: specialist.id,
    })

    const ip = await getGigDetail(inProgress.id, { userId: specialist.id, role: 'SPECIALIST' })
    expect(ip!.isAssignedSpecialist).toBe(true)
    expect(ip!.lifecycle.canSubmit).toBe(true)
    expect(ip!.messaging.canSend).toBe(true)

    const rv = await getGigDetail(review.id, { userId: client.id, role: 'CLIENT' })
    expect(rv!.lifecycle.canApprove).toBe(true)

    const cp = await getGigDetail(completed.id, { userId: client.id, role: 'CLIENT' })
    expect(cp!.lifecycle.canPay).toBe(true)
  })
})
