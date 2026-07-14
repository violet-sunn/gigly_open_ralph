import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { createTestUser } from '../helpers/seed'

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
import { applyToGig, acceptApplication, rejectApplication, withdrawApplication } from '@/app/actions/gig'
import { getTermsTabs } from '@/lib/terms'
import { getGigApplications, getGigDetail } from '@/lib/view-models'
import type { TermsTabsVM } from '@/app/components/blocks/view-models'

function withdrawForm(applicationId: string) {
  const fd = new FormData()
  fd.set('applicationId', applicationId)
  return fd
}

type TestPrisma = ReturnType<typeof getTestPrismaClient>

// ru-RU formatting uses a non-breaking-space group separator — normalise before comparing.
const noSpace = (s: string) => s.replace(/\s/g, '')

async function makeGig(prisma: TestPrisma, clientId: string, opts?: { budget?: number; deadlineDays?: number }) {
  const budget = opts?.budget ?? 28000000 // 280 000 ₽ in kopecks
  const serviceFee = Math.floor(budget * 0.1)
  return prisma.gig.create({
    data: {
      title: 'Terms Gig',
      description: 'Description for the terms-negotiation test.',
      acceptanceCriteria: 'Acceptance criteria with at least fifty characters to pass validation here.',
      budget,
      serviceFee,
      totalAmount: budget + serviceFee,
      status: 'OPEN',
      deadlineDays: opts?.deadlineDays ?? 10,
      clientId,
    },
  })
}

function applyForm(gigId: string, opts?: { proposedBudget?: string; proposedDeadlineDays?: string }) {
  const fd = new FormData()
  fd.set('gigId', gigId)
  fd.set(
    'approach',
    'I will use a test-driven development approach with comprehensive unit and integration tests, ensuring correctness and maintainability across the whole codebase.'
  )
  fd.set('questions', 'What is the expected timeline, and are there preferred frameworks or constraints I should be aware of?')
  fd.set('estimatedEffort', '2-3 weeks')
  if (opts?.proposedBudget !== undefined) fd.set('proposedBudget', opts.proposedBudget)
  if (opts?.proposedDeadlineDays !== undefined) fd.set('proposedDeadlineDays', opts.proposedDeadlineDays)
  return fd
}

// Create a PENDING application directly (bypassing applyToGig) with optional proposed terms (kopecks).
async function makeApplication(
  prisma: TestPrisma,
  gigId: string,
  specialistId: string,
  proposed?: { proposedBudget?: number; proposedDeadlineDays?: number }
) {
  return prisma.application.create({
    data: {
      gigId,
      specialistId,
      approach: 'a'.repeat(120),
      questions: 'q'.repeat(60),
      status: 'PENDING',
      proposedBudget: proposed?.proposedBudget ?? null,
      proposedDeadlineDays: proposed?.proposedDeadlineDays ?? null,
    },
  })
}

describe('terms-negotiation — propose (applyToGig)', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('persists proposed terms (budget roubles → kopecks, deadline days)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id)
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    await withAuthContext(specialist, async () => {
      await expect(
        applyToGig(null, applyForm(gig.id, { proposedBudget: '350000', proposedDeadlineDays: '20' }))
      ).rejects.toThrow('NEXT_REDIRECT')
    })

    const app = await prisma.application.findUnique({
      where: { gigId_specialistId: { gigId: gig.id, specialistId: specialist.id } },
    })
    expect(app?.proposedBudget).toBe(35000000) // 350 000 ₽ → kopecks
    expect(app?.proposedDeadlineDays).toBe(20)
  })

  it('defaults proposed terms to null when not supplied', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id)
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    await withAuthContext(specialist, async () => {
      await expect(applyToGig(null, applyForm(gig.id))).rejects.toThrow('NEXT_REDIRECT')
    })

    const app = await prisma.application.findUnique({
      where: { gigId_specialistId: { gigId: gig.id, specialistId: specialist.id } },
    })
    expect(app?.proposedBudget).toBeNull()
    expect(app?.proposedDeadlineDays).toBeNull()
  })
})

describe('terms-negotiation — validation', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('rejects a non-positive / non-numeric proposed budget', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id)
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const result = await withAuthContext(specialist, async () =>
      applyToGig(null, applyForm(gig.id, { proposedBudget: '-5' }))
    )
    expect(result?.error).toBeTruthy()
    const app = await prisma.application.findUnique({
      where: { gigId_specialistId: { gigId: gig.id, specialistId: specialist.id } },
    })
    expect(app).toBeNull()
  })

  it('rejects an out-of-range proposed deadline', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id)
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const result = await withAuthContext(specialist, async () =>
      applyToGig(null, applyForm(gig.id, { proposedDeadlineDays: '400' }))
    )
    expect(result?.error).toBeTruthy()
    const app = await prisma.application.findUnique({
      where: { gigId_specialistId: { gigId: gig.id, specialistId: specialist.id } },
    })
    expect(app).toBeNull()
  })
})

describe('terms-negotiation — TermsTabs contract (both tabs)', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('returns proposed + client rows (Бюджет + Срок), reflecting the counter', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id, { budget: 28000000, deadlineDays: 10 })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const app = await makeApplication(prisma, gig.id, specialist.id, {
      proposedBudget: 30040000, // 300 400 ₽
      proposedDeadlineDays: 14,
    })

    const tabs = await getTermsTabs(app.id)
    expect(tabs).not.toBeNull()
    const contract: TermsTabsVM = tabs! // compile-time contract assertion

    expect(contract.client.map((r) => r.label)).toEqual(['Бюджет', 'Срок'])
    expect(contract.proposed.map((r) => r.label)).toEqual(['Бюджет', 'Срок'])
    // client reflects the gig
    expect(noSpace(contract.client[0].value)).toBe('280000₽')
    expect(contract.client[1]).toEqual({ label: 'Срок', value: '10 дней' })
    // proposed reflects the counter
    expect(noSpace(contract.proposed[0].value)).toBe('300400₽')
    expect(contract.proposed[1]).toEqual({ label: 'Срок', value: '14 дней' })
  })

  it('falls back to the client terms on both tabs when not countered', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id, { budget: 28000000, deadlineDays: 10 })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const app = await makeApplication(prisma, gig.id, specialist.id) // no proposal

    const tabs = await getTermsTabs(app.id)
    expect(tabs!.proposed).toEqual(tabs!.client)
  })

  it('returns null for a non-existent application', async () => {
    expect(await getTermsTabs('does-not-exist')).toBeNull()
  })
})

describe('terms-negotiation — accept-with-terms', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('reconciles the accepted proposal onto the gig and preserves the accept flow', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id, { budget: 28000000, deadlineDays: 10 })
    const spec1 = await createTestUser(prisma, { role: 'SPECIALIST' })
    const spec2 = await createTestUser(prisma, { role: 'SPECIALIST' })
    const app1 = await makeApplication(prisma, gig.id, spec1.id, {
      proposedBudget: 35000000, // 350 000 ₽
      proposedDeadlineDays: 20,
    })
    const app2 = await makeApplication(prisma, gig.id, spec2.id) // other PENDING application

    const fd = new FormData()
    fd.set('applicationId', app1.id)
    await withAuthContext(client, async () => {
      await expect(acceptApplication(null, fd)).rejects.toThrow('NEXT_REDIRECT')
    })

    const updated = await prisma.gig.findUnique({ where: { id: gig.id } })
    expect(updated?.budget).toBe(35000000)
    expect(updated?.serviceFee).toBe(Math.floor(35000000 * 0.1)) // 3 500 000
    expect(updated?.totalAmount).toBe(35000000 + Math.floor(35000000 * 0.1))
    expect(updated?.deadlineDays).toBe(20)
    // existing accept behaviour preserved
    expect(updated?.status).toBe('IN_PROGRESS')
    expect(updated?.assignedSpecialistId).toBe(spec1.id)
    const rejected = await prisma.application.findUnique({ where: { id: app2.id } })
    expect(rejected?.status).toBe('REJECTED')
    const accepted = await prisma.application.findUnique({ where: { id: app1.id } })
    expect(accepted?.status).toBe('ACCEPTED')
  })
})

describe('terms-negotiation — preserve accept/reject (lifecycle unchanged)', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('accepting an application with no proposed terms leaves the gig terms unchanged', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id, { budget: 28000000, deadlineDays: 10 })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const app = await makeApplication(prisma, gig.id, specialist.id) // no proposal

    const fd = new FormData()
    fd.set('applicationId', app.id)
    await withAuthContext(client, async () => {
      await expect(acceptApplication(null, fd)).rejects.toThrow('NEXT_REDIRECT')
    })

    const updated = await prisma.gig.findUnique({ where: { id: gig.id } })
    expect(updated?.budget).toBe(gig.budget) // unchanged
    expect(updated?.serviceFee).toBe(gig.serviceFee)
    expect(updated?.totalAmount).toBe(gig.totalAmount)
    expect(updated?.deadlineDays).toBe(10)
    expect(updated?.status).toBe('IN_PROGRESS')
    expect(updated?.assignedSpecialistId).toBe(specialist.id)
  })

  it('rejectApplication still rejects and leaves the gig OPEN', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id, { budget: 28000000, deadlineDays: 10 })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const app = await makeApplication(prisma, gig.id, specialist.id, { proposedBudget: 99900000 })

    const fd = new FormData()
    fd.set('applicationId', app.id)
    await withAuthContext(client, async () => {
      await expect(rejectApplication(null, fd)).rejects.toThrow('NEXT_REDIRECT')
    })

    const rejected = await prisma.application.findUnique({ where: { id: app.id } })
    expect(rejected?.status).toBe('REJECTED')
    const stillOpen = await prisma.gig.findUnique({ where: { id: gig.id } })
    expect(stillOpen?.status).toBe('OPEN')
    expect(stillOpen?.budget).toBe(gig.budget) // reject never touches gig terms
  })
})

describe('terms-negotiation — lifecycle integrity (withdraw / re-apply / scoping)', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('withdrawal preserves the proposed terms on the preserved row', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id)
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    await withAuthContext(specialist, async () => {
      await expect(
        applyToGig(null, applyForm(gig.id, { proposedBudget: '350000', proposedDeadlineDays: '20' }))
      ).rejects.toThrow('NEXT_REDIRECT')
    })
    const app = await prisma.application.findUnique({
      where: { gigId_specialistId: { gigId: gig.id, specialistId: specialist.id } },
    })
    await withAuthContext(specialist, async () => {
      await expect(withdrawApplication(null, withdrawForm(app!.id))).rejects.toThrow('NEXT_REDIRECT')
    })

    const withdrawn = await prisma.application.findUnique({ where: { id: app!.id } })
    expect(withdrawn?.status).toBe('WITHDRAWN')
    expect(withdrawn?.proposedBudget).toBe(35000000) // counter preserved on the row
    expect(withdrawn?.proposedDeadlineDays).toBe(20)
  })

  it('re-apply overwrites the counter with the new submission (same row)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id)
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    await withAuthContext(specialist, async () => {
      await expect(
        applyToGig(null, applyForm(gig.id, { proposedBudget: '350000', proposedDeadlineDays: '20' }))
      ).rejects.toThrow('NEXT_REDIRECT')
    })
    const app = await prisma.application.findUnique({
      where: { gigId_specialistId: { gigId: gig.id, specialistId: specialist.id } },
    })
    await withAuthContext(specialist, async () => {
      await expect(withdrawApplication(null, withdrawForm(app!.id))).rejects.toThrow('NEXT_REDIRECT')
    })
    // Re-apply with DIFFERENT terms → reactivation overwrites the counter, no new row.
    await withAuthContext(specialist, async () => {
      await expect(
        applyToGig(null, applyForm(gig.id, { proposedBudget: '400000', proposedDeadlineDays: '30' }))
      ).rejects.toThrow('NEXT_REDIRECT')
    })

    const rows = await prisma.application.findMany({ where: { gigId: gig.id, specialistId: specialist.id } })
    expect(rows).toHaveLength(1)
    expect(rows[0].id).toBe(app!.id)
    expect(rows[0].status).toBe('PENDING')
    expect(rows[0].proposedBudget).toBe(40000000) // NEW counter
    expect(rows[0].proposedDeadlineDays).toBe(30)
    expect(rows[0].freeWithdrawalUsed).toBe(true) // flag kept from the first withdrawal
  })

  it('re-apply without terms clears the counter (null, not stale)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id)
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    await withAuthContext(specialist, async () => {
      await expect(
        applyToGig(null, applyForm(gig.id, { proposedBudget: '350000', proposedDeadlineDays: '20' }))
      ).rejects.toThrow('NEXT_REDIRECT')
    })
    const app = await prisma.application.findUnique({
      where: { gigId_specialistId: { gigId: gig.id, specialistId: specialist.id } },
    })
    await withAuthContext(specialist, async () => {
      await expect(withdrawApplication(null, withdrawForm(app!.id))).rejects.toThrow('NEXT_REDIRECT')
    })
    // Re-apply with NO terms → the counter must be cleared to null, not left stale.
    await withAuthContext(specialist, async () => {
      await expect(applyToGig(null, applyForm(gig.id))).rejects.toThrow('NEXT_REDIRECT')
    })

    const reactivated = await prisma.application.findUnique({ where: { id: app!.id } })
    expect(reactivated?.status).toBe('PENDING')
    expect(reactivated?.proposedBudget).toBeNull()
    expect(reactivated?.proposedDeadlineDays).toBeNull()
  })

  it('proposed terms are scoped per application row (no bleed across gigs/specialists)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gigX = await makeGig(prisma, client.id)
    const gigY = await makeGig(prisma, client.id)
    const specA = await createTestUser(prisma, { role: 'SPECIALIST' })
    const specB = await createTestUser(prisma, { role: 'SPECIALIST' })

    await withAuthContext(specA, async () => {
      await expect(
        applyToGig(null, applyForm(gigX.id, { proposedBudget: '350000', proposedDeadlineDays: '20' }))
      ).rejects.toThrow('NEXT_REDIRECT')
    })
    await withAuthContext(specB, async () => {
      await expect(applyToGig(null, applyForm(gigX.id))).rejects.toThrow('NEXT_REDIRECT') // no counter
    })
    await withAuthContext(specA, async () => {
      await expect(
        applyToGig(null, applyForm(gigY.id, { proposedBudget: '400000', proposedDeadlineDays: '30' }))
      ).rejects.toThrow('NEXT_REDIRECT')
    })

    const aX = await prisma.application.findUnique({ where: { gigId_specialistId: { gigId: gigX.id, specialistId: specA.id } } })
    const bX = await prisma.application.findUnique({ where: { gigId_specialistId: { gigId: gigX.id, specialistId: specB.id } } })
    const aY = await prisma.application.findUnique({ where: { gigId_specialistId: { gigId: gigY.id, specialistId: specA.id } } })
    expect(aX?.proposedBudget).toBe(35000000)
    expect(aX?.proposedDeadlineDays).toBe(20)
    expect(bX?.proposedBudget).toBeNull() // B's row on the same gig is independent
    expect(aY?.proposedBudget).toBe(40000000) // A's row on another gig is independent
    expect(aY?.proposedDeadlineDays).toBe(30)
  })
})

describe('terms-negotiation — counterparty visibility (getGigApplications)', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('surfaces an applicant counter + the gig terms; absent when no counter', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id, { budget: 28000000, deadlineDays: 10 })
    const specWith = await createTestUser(prisma, { role: 'SPECIALIST' })
    const specWithout = await createTestUser(prisma, { role: 'SPECIALIST' })
    await makeApplication(prisma, gig.id, specWith.id, { proposedBudget: 35000000, proposedDeadlineDays: 20 })
    await makeApplication(prisma, gig.id, specWithout.id) // no counter

    const data = await getGigApplications(gig.id, { userId: client.id, role: 'CLIENT' })
    expect(data).not.toBeNull()
    expect(noSpace(data!.gigBudget)).toContain('280000') // gig's own terms surfaced for comparison
    expect(data!.gigDeadline).toBe('10 дней')

    const countered = data!.applicants.find((a) => a.proposedBudget)
    const plain = data!.applicants.find((a) => !a.proposedBudget)
    expect(countered).toBeTruthy()
    expect(noSpace(countered!.proposedBudget!)).toContain('350000')
    expect(countered!.proposedDeadline).toBe('20 дней')
    expect(plain).toBeTruthy()
    expect(plain!.proposedBudget).toBeUndefined()
    expect(plain!.proposedDeadline).toBeUndefined()
  })
})

describe('terms-negotiation — gig VM hasCounter (getGigDetail)', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('reports hasCounter true + differing proposed terms when the viewer countered', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id, { budget: 28000000, deadlineDays: 10 })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    await makeApplication(prisma, gig.id, specialist.id, { proposedBudget: 35000000, proposedDeadlineDays: 20 })

    const data = await getGigDetail(gig.id, { userId: specialist.id, role: 'SPECIALIST' })
    expect(data!.viewerApplication?.hasCounter).toBe(true)
    // proposed tab differs from the client tab
    expect(data!.conditions.proposed.budget).not.toBe(data!.conditions.client.budget)
    expect(data!.conditions.proposed.deadline).not.toBe(data!.conditions.client.deadline)
  })

  it('reports hasCounter false + proposed == client when the viewer did not counter', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await makeGig(prisma, client.id, { budget: 28000000, deadlineDays: 10 })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    await makeApplication(prisma, gig.id, specialist.id) // no counter

    const data = await getGigDetail(gig.id, { userId: specialist.id, role: 'SPECIALIST' })
    expect(data!.viewerApplication?.hasCounter).toBe(false)
    expect(data!.conditions.proposed.budget).toBe(data!.conditions.client.budget)
    expect(data!.conditions.proposed.deadline).toBe(data!.conditions.client.deadline)
  })
})
