import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { createTestUser } from '../helpers/seed'
import { serviceFeeKopecks } from '@/lib/pricing'

// Cross-cutting verification (fix-application-lifecycle × fix-terms-negotiation): a specialist who applied ON THEIR
// OWN TERMS (a counter) withdraws — the one-free-withdrawal semantics must still hold, BOTH the client and specialist
// sides must reflect the withdrawal, the counter must be preserved on the row, and the specialist must be able to
// re-apply on their terms again (with the new counter taking effect). No cross-feature regressions.

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

import { applyToGig, withdrawApplication } from '@/app/actions/gig'
import { getGigApplications, getGigDetail, getSpecialistDashboard } from '@/lib/view-models'

type TestPrisma = ReturnType<typeof getTestPrismaClient>
const noSpace = (s: string) => s.replace(/\s/g, '')

async function makeGig(prisma: TestPrisma, clientId: string) {
  const budget = 28000000 // 280 000 ₽
  const serviceFee = serviceFeeKopecks(budget)
  return prisma.gig.create({
    data: {
      title: 'Counter+Withdraw Gig',
      description: 'Description for the withdraw-with-counter cross-cutting test.',
      acceptanceCriteria: 'Acceptance criteria with at least fifty characters to pass validation here.',
      budget,
      serviceFee,
      totalAmount: budget + serviceFee,
      status: 'OPEN',
      deadlineDays: 10,
      clientId,
    },
  })
}

function applyForm(gigId: string, opts?: { proposedBudget?: string; proposedDeadlineDays?: string }) {
  const fd = new FormData()
  fd.set('gigId', gigId)
  fd.set(
    'approach',
    'I will use a test-driven development approach with comprehensive unit and integration tests, ensuring correctness and maintainability across the codebase.'
  )
  fd.set('questions', 'What is the expected timeline, and are there preferred frameworks or constraints I should be aware of before I start?')
  if (opts?.proposedBudget !== undefined) fd.set('proposedBudget', opts.proposedBudget)
  if (opts?.proposedDeadlineDays !== undefined) fd.set('proposedDeadlineDays', opts.proposedDeadlineDays)
  return fd
}

function withdrawForm(applicationId: string) {
  const fd = new FormData()
  fd.set('applicationId', applicationId)
  return fd
}

describe('withdraw-with-counter — apply-on-own-terms → withdraw → both sides → re-apply on terms', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('preserves the one-free-withdrawal semantics AND the counter, reflects on both sides, and re-applies on terms', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id)
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const owner = { userId: client.id, role: 'CLIENT' }
    const spec = { userId: specialist.id, role: 'SPECIALIST' }

    // ── 1. Apply ON OWN TERMS (counter 350 000 ₽ / 20 дней) ──
    await withAuthContext(specialist, async () => {
      await expect(
        applyToGig(null, applyForm(gig.id, { proposedBudget: '350000', proposedDeadlineDays: '20' }))
      ).rejects.toThrow('NEXT_REDIRECT')
    })
    let app = await prisma.application.findUnique({
      where: { gigId_specialistId: { gigId: gig.id, specialistId: specialist.id } },
    })
    expect(app?.status).toBe('PENDING')
    expect(app?.proposedBudget).toBe(35000000)
    expect(app?.proposedDeadlineDays).toBe(20)
    expect(app?.freeWithdrawalUsed).toBe(false)

    // ── 2. Withdraw (first, reversible) — the withdraw-counter still works ──
    await withAuthContext(specialist, async () => {
      await expect(withdrawApplication(null, withdrawForm(app!.id))).rejects.toThrow('NEXT_REDIRECT')
    })
    app = await prisma.application.findUnique({ where: { id: app!.id } })
    expect(app?.status).toBe('WITHDRAWN')
    expect(app?.freeWithdrawalUsed).toBe(true) // free withdrawal consumed
    expect(app?.proposedBudget).toBe(35000000) // counter PRESERVED on the row
    expect(app?.proposedDeadlineDays).toBe(20)

    // ── 3a. CLIENT side reflects the withdrawal ──
    let clientView = await getGigApplications(gig.id, owner)
    const withdrawnCard = clientView!.applicants.find((a) => a.id === app!.id)
    expect(withdrawnCard?.status.label).toBe('Отозвано')
    expect(withdrawnCard?.pending).toBe(false) // no accept/reject affordance for a withdrawn applicant
    expect(noSpace(withdrawnCard!.proposedBudget!)).toContain('350000') // their counter still visible
    expect(withdrawnCard?.proposedDeadline).toBe('20 дней')

    // ── 3b. SPECIALIST side reflects the withdrawal (gig detail + dashboard) ──
    let specView = await getGigDetail(gig.id, spec)
    expect(specView!.viewerApplication?.status).toBe('WITHDRAWN')
    expect(specView!.viewerApplication?.freeWithdrawalUsed).toBe(true)
    expect(specView!.lifecycle.canApply).toBe(true) // reversible withdrawal → the apply form returns (can re-apply)

    let dash = await getSpecialistDashboard(specialist.id)
    let card = dash.gigCards.find((c) => c.id === gig.id)
    expect(card?.tabKey).toBe('archive') // withdrawn app sits in the archive, not «Заявки»

    // ── 4. Re-apply ON OWN (NEW) TERMS (400 000 ₽ / 30 дней) — same row reactivated ──
    await withAuthContext(specialist, async () => {
      await expect(
        applyToGig(null, applyForm(gig.id, { proposedBudget: '400000', proposedDeadlineDays: '30' }))
      ).rejects.toThrow('NEXT_REDIRECT')
    })
    const rows = await prisma.application.findMany({ where: { gigId: gig.id, specialistId: specialist.id } })
    expect(rows).toHaveLength(1) // no duplicate row
    expect(rows[0].id).toBe(app!.id)
    expect(rows[0].status).toBe('PENDING')
    expect(rows[0].proposedBudget).toBe(40000000) // NEW counter took effect
    expect(rows[0].proposedDeadlineDays).toBe(30)
    expect(rows[0].freeWithdrawalUsed).toBe(true) // flag stays consumed (no reset exploit)

    // ── 5. Both sides reflect the re-application on the new terms ──
    clientView = await getGigApplications(gig.id, owner)
    const reCard = clientView!.applicants.find((a) => a.id === app!.id)
    expect(reCard?.status.label).toBe('На рассмотрении')
    expect(reCard?.pending).toBe(true) // accept/reject available again
    expect(noSpace(reCard!.proposedBudget!)).toContain('400000')
    expect(reCard?.proposedDeadline).toBe('30 дней')

    specView = await getGigDetail(gig.id, spec)
    expect(specView!.viewerApplication?.status).toBe('PENDING')
    expect(specView!.viewerApplication?.hasCounter).toBe(true)
    expect(specView!.conditions.proposed.deadline).not.toBe(specView!.conditions.client.deadline)

    dash = await getSpecialistDashboard(specialist.id)
    card = dash.gigCards.find((c) => c.id === gig.id)
    expect(card?.tabKey).toBe('applications') // back under «Заявки»

    // ── 6. The second withdrawal is FINAL (one-free-withdrawal still governs after a counter re-apply) ──
    await withAuthContext(specialist, async () => {
      await expect(withdrawApplication(null, withdrawForm(app!.id))).rejects.toThrow('NEXT_REDIRECT')
    })
    app = await prisma.application.findUnique({ where: { id: app!.id } })
    expect(app?.status).toBe('WITHDRAWN_FINAL')
    expect(app?.proposedBudget).toBe(40000000) // counter still preserved on the final row

    // ── 7. Re-apply after the final withdrawal is rejected server-side (no new row, no change) ──
    const result = await withAuthContext(specialist, async () => {
      return applyToGig(null, applyForm(gig.id, { proposedBudget: '500000', proposedDeadlineDays: '15' }))
    })
    expect(result).toEqual({
      error: 'Вы окончательно отозвали отклик на этот гиг и больше не можете откликнуться.',
    })
    const finalRows = await prisma.application.findMany({ where: { gigId: gig.id, specialistId: specialist.id } })
    expect(finalRows).toHaveLength(1)
    expect(finalRows[0].status).toBe('WITHDRAWN_FINAL')
    expect(finalRows[0].proposedBudget).toBe(40000000) // unchanged — the rejected re-apply touched nothing
  })
})
