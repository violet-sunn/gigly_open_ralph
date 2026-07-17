import { describe, it, expect, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser, createTestGig, createTestApplication, createTestMessage } from '../helpers/seed'

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

// Everything getGigDetail returns is serialized into the RSC payload of the "use client" GigDetail component, so it is
// readable in DevTools by anyone who opens /gigs/[id] — regardless of what the UI renders. These guards assert on the
// SERIALIZED payload rather than on named fields, so a future field that smuggles private data in fails too.
describe('getGigDetail payload (what actually ships to the browser)', () => {
  const buildChattingGig = async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT', companyName: 'ООО Заказчик' })
    const assigned = await createTestUser(prisma, { role: 'SPECIALIST' })
    const outsider = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, {
      clientId: client.id,
      assignedSpecialistId: assigned.id,
      status: 'IN_PROGRESS',
    })
    const secret = 'СЕКРЕТНАЯ РЕПЛИКА ИЗ ПРИВАТНОГО ЧАТА 9f3a1c'
    await createTestMessage(prisma, { gigId: gig.id, senderId: assigned.id, content: secret })
    return { client, assigned, outsider, gig, secret }
  }

  it('does not ship the private chat thread to a non-participant', async () => {
    const { outsider, gig, secret } = await buildChattingGig()
    const payload = JSON.stringify(await getGigDetail(gig.id, { userId: outsider.id, role: 'SPECIALIST' }))
    expect(payload).not.toContain(secret)
  })

  it("does not ship the assigned specialist's email to a non-participant", async () => {
    const { assigned, outsider, gig } = await buildChattingGig()
    const payload = JSON.stringify(await getGigDetail(gig.id, { userId: outsider.id, role: 'SPECIALIST' }))
    expect(payload).not.toContain(assigned.email)
  })

  // The thread is not "hidden from outsiders" — it is not in this payload for ANYONE. Messages are read through
  // getChatThread (/chats?gig=…), which authorises per request. Keeping the participant in this guard is what stops
  // someone "helpfully" re-adding the thread here and gating it with a flag.
  it('does not ship the chat thread even to the gig owner — the thread belongs to getChatThread', async () => {
    const { client, gig, secret } = await buildChattingGig()
    const payload = JSON.stringify(await getGigDetail(gig.id, { userId: client.id, role: 'CLIENT' }))
    expect(payload).not.toContain(secret)
  })

  it('still reports the chat entry-point flags (the fix removed data, not the affordance)', async () => {
    const { client, gig } = await buildChattingGig()
    const data = await getGigDetail(gig.id, { userId: client.id, role: 'CLIENT' })
    expect(data!.messaging.assigned).toBe(true)
    expect(data!.messaging.canView).toBe(true)
  })

  it('keeps the owner-only fee out of a specialist payload (the gating pattern this file guards)', async () => {
    const { outsider, gig } = await buildChattingGig()
    const data = await getGigDetail(gig.id, { userId: outsider.id, role: 'SPECIALIST' })
    expect(data!.conditions.fee).toBeUndefined()
  })
})

describe('getGigDetail — open-dispute marker', () => {
  const buildGig = async (status: string) => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const spec = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: spec.id, status })
    return { prisma, client, spec, gig }
  }

  it('hasOpenDispute is false with no dispute, and the owner can approve on REVIEW', async () => {
    const { client, gig } = await buildGig('REVIEW')
    const data = await getGigDetail(gig.id, { userId: client.id, role: 'CLIENT' })
    expect(data!.hasOpenDispute).toBe(false)
    expect(data!.lifecycle.canApprove).toBe(true)
  })

  it('an OPEN dispute flips hasOpenDispute and withholds canApprove (UI matches the server guard)', async () => {
    const { prisma, client, spec, gig } = await buildGig('REVIEW')
    await prisma.dispute.create({ data: { gigId: gig.id, openerId: spec.id, reason: 'Спор' } })

    const data = await getGigDetail(gig.id, { userId: client.id, role: 'CLIENT' })
    expect(data!.hasOpenDispute).toBe(true)
    expect(data!.lifecycle.canApprove).toBe(false)
  })

  it('an OPEN dispute withholds canPay on a COMPLETED gig', async () => {
    const { prisma, client, spec, gig } = await buildGig('COMPLETED')
    await prisma.dispute.create({ data: { gigId: gig.id, openerId: spec.id, reason: 'Спор' } })

    const data = await getGigDetail(gig.id, { userId: client.id, role: 'CLIENT' })
    expect(data!.hasOpenDispute).toBe(true)
    expect(data!.lifecycle.canPay).toBe(false)
  })

  it('a RESOLVED dispute does not count as open', async () => {
    const { prisma, client, spec, gig } = await buildGig('REVIEW')
    await prisma.dispute.create({ data: { gigId: gig.id, openerId: spec.id, reason: 'Спор', status: 'RESOLVED' } })

    const data = await getGigDetail(gig.id, { userId: client.id, role: 'CLIENT' })
    expect(data!.hasOpenDispute).toBe(false)
    expect(data!.lifecycle.canApprove).toBe(true)
  })
})

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
    expect(data!.header.description).toBe(gig.description) // main block renders the brief body
    expect(data!.requirements).toHaveLength(3) // goal + deliverables + constraints
    // conditions panel: срок/бюджет figures present; the specialist does NOT see the company fee breakdown
    expect(data!.conditions.client.budget).toBe(data!.terms.client[0].value)
    expect(data!.conditions.status.label).toBeTruthy()
    expect(data!.conditions.fee).toBeUndefined()
    expect(data!.criteria.items.map((i) => i.label)).toEqual(['Критерий один', 'Критерий два'])
    expect(data!.client.name).toBe('ООО Ромашка')
    expect(data!.client.rating.value).toBe(4)
    expect(data!.lifecycle.canApply).toBe(true)
    expect(data!.isOwner).toBe(false)
    expect(data!.viewerApplication).toBeNull()
    // No application counter → «Мои условия» shows an explicit not-proposed state, NOT the gig's figures (which
    // would make the tab indistinguishable from «Условия {company}» — see the gig spec's terms-tabs requirement).
    expect(data!.terms.proposed.map((r) => r.value)).toEqual(['— не предложено', '— не предложено'])
    expect(data!.terms.proposed).not.toEqual(data!.terms.client)
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
    // the company (owner) sees the fee breakdown in the conditions panel; the specialist did not
    expect(ownerView!.conditions.fee).toBeDefined()
    expect(specView!.conditions.fee).toBeUndefined()
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
