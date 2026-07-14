import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { createTestUser, createTestGig, createTestApplication } from '../helpers/seed'

// Mock @/lib/prisma to use test database (lazy getter)
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  }
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
    set: vi.fn((name: string, value: string) => {
      if (name === 'session') {
        setTestSessionToken(value)
      }
    }),
    delete: vi.fn((name: string) => {
      if (name === 'session') {
        setTestSessionToken(undefined)
      }
    })
  }))
}))

// Mock next/navigation redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  })
}))

// Import server actions after mocks
import { withdrawApplication, applyToGig } from '@/app/actions/gig'

// Helpers to drive the actions with FormData.
function withdrawForm(applicationId: string) {
  const fd = new FormData()
  fd.append('applicationId', applicationId)
  return fd
}
function applyForm(gigId: string) {
  const fd = new FormData()
  fd.append('gigId', gigId)
  // Meets the server thresholds (approach ≥ 100, questions ≥ 50).
  fd.append('approach', 'Разберу задачу по слоям, начну с профилирования узких мест, затем оптимизирую запросы и покрою тестами.'.padEnd(100, '.'))
  fd.append('questions', 'Какие граничные условия для нагрузки и какой SLA по времени ответа считается приемлемым для релиза?'.padEnd(50, '.'))
  fd.append('estimatedEffort', '~3 дня')
  return fd
}

describe('withdrawApplication action', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  it('first withdrawal of a PENDING application is reversible (WITHDRAWN + flag set)', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'PENDING',
    })

    await withAuthContext(specialist, async () => {
      try {
        await withdrawApplication(null, withdrawForm(application.id))
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
        expect(error.message).toContain(`/gigs/${gig.id}`)
      }
    })

    const updatedApp = await prisma.application.findUnique({ where: { id: application.id } })
    expect(updatedApp?.status).toBe('WITHDRAWN')
    expect(updatedApp?.freeWithdrawalUsed).toBe(true)
  })

  it('second withdrawal (after re-apply) is final (WITHDRAWN_FINAL)', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    // The re-applied state: PENDING with the free withdrawal already spent.
    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'PENDING',
      freeWithdrawalUsed: true,
    })

    await withAuthContext(specialist, async () => {
      try {
        await withdrawApplication(null, withdrawForm(application.id))
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    const updatedApp = await prisma.application.findUnique({ where: { id: application.id } })
    expect(updatedApp?.status).toBe('WITHDRAWN_FINAL')
    // The flag stays true — it never resets.
    expect(updatedApp?.freeWithdrawalUsed).toBe(true)
  })

  it('re-apply after a reversible withdrawal reactivates the SAME row to PENDING (flag kept)', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'WITHDRAWN',
      freeWithdrawalUsed: true,
    })

    await withAuthContext(specialist, async () => {
      try {
        await applyToGig(null, applyForm(gig.id))
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // No new row created; the existing row is reactivated.
    const rows = await prisma.application.findMany({ where: { gigId: gig.id, specialistId: specialist.id } })
    expect(rows).toHaveLength(1)
    expect(rows[0].id).toBe(application.id)
    expect(rows[0].status).toBe('PENDING')
    expect(rows[0].freeWithdrawalUsed).toBe(true)
  })

  it('re-apply after a final withdrawal is rejected server-side (no change)', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'WITHDRAWN_FINAL',
      freeWithdrawalUsed: true,
    })

    const result = await withAuthContext(specialist, async () => {
      return applyToGig(null, applyForm(gig.id))
    })

    expect(result).toEqual({
      error: 'Вы окончательно отозвали отклик на этот гиг и больше не можете откликнуться.',
    })
    const updatedApp = await prisma.application.findUnique({ where: { id: application.id } })
    expect(updatedApp?.status).toBe('WITHDRAWN_FINAL')
  })

  it('rejects CLIENT role', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'PENDING',
    })

    const result = await withAuthContext(client, async () => {
      return withdrawApplication(null, withdrawForm(application.id))
    })

    expect(result).toEqual({ error: 'Отзывать отклики могут только специалисты. Заказчик может отклонить отклик.' })

    const updatedApp = await prisma.application.findUnique({ where: { id: application.id } })
    expect(updatedApp?.status).toBe('PENDING')
  })

  it('redirects unauthenticated user', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'PENDING',
    })

    try {
      await withdrawApplication(null, withdrawForm(application.id))
      throw new Error('Expected redirect, but action succeeded')
    } catch (error: any) {
      expect(error.message).toContain('NEXT_REDIRECT')
      expect(error.message).toContain('/login')
    }
  })

  it('rejects non-owner specialist', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const otherSpecialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'PENDING',
    })

    const result = await withAuthContext(otherSpecialist, async () => {
      return withdrawApplication(null, withdrawForm(application.id))
    })

    expect(result).toEqual({ error: 'Вы можете отозвать только свои отклики.' })

    const updatedApp = await prisma.application.findUnique({ where: { id: application.id } })
    expect(updatedApp?.status).toBe('PENDING')
  })

  it('rejects ACCEPTED application', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'ACCEPTED',
    })

    const result = await withAuthContext(specialist, async () => {
      return withdrawApplication(null, withdrawForm(application.id))
    })

    expect(result).toEqual({ error: 'Отозвать можно только отклик на рассмотрении — этот уже принят или отклонён.' })

    const updatedApp = await prisma.application.findUnique({ where: { id: application.id } })
    expect(updatedApp?.status).toBe('ACCEPTED')
  })

  it('rejects REJECTED application', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'REJECTED',
    })

    const result = await withAuthContext(specialist, async () => {
      return withdrawApplication(null, withdrawForm(application.id))
    })

    expect(result).toEqual({ error: 'Отозвать можно только отклик на рассмотрении — этот уже принят или отклонён.' })

    const updatedApp = await prisma.application.findUnique({ where: { id: application.id } })
    expect(updatedApp?.status).toBe('REJECTED')
  })

  it('rejects already WITHDRAWN application (idempotency)', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'WITHDRAWN',
      freeWithdrawalUsed: true,
    })

    const result = await withAuthContext(specialist, async () => {
      return withdrawApplication(null, withdrawForm(application.id))
    })

    expect(result).toEqual({ error: 'Этот отклик уже отозван.' })
  })

  it('rejects withdrawal from closed gig', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN', closedByAdmin: true })
    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'PENDING',
    })

    const result = await withAuthContext(specialist, async () => {
      return withdrawApplication(null, withdrawForm(application.id))
    })

    expect(result).toEqual({ error: 'Нельзя отозвать отклик по закрытому гигу.' })

    const updatedApp = await prisma.application.findUnique({ where: { id: application.id } })
    expect(updatedApp?.status).toBe('PENDING')
  })

  it('rejects withdrawal from example gig', async () => {
    const prisma = getTestPrismaClient()

    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN', isExample: true })
    const application = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: specialist.id,
      status: 'PENDING',
    })

    const result = await withAuthContext(specialist, async () => {
      return withdrawApplication(null, withdrawForm(application.id))
    })

    expect(result).toEqual({ error: 'Нельзя отозвать отклик по демонстрационному гигу.' })

    const updatedApp = await prisma.application.findUnique({ where: { id: application.id } })
    expect(updatedApp?.status).toBe('PENDING')
  })

  it('returns error for non-existent application', async () => {
    const specialist = await createTestUser(getTestPrismaClient(), { role: 'SPECIALIST' })

    const result = await withAuthContext(specialist, async () => {
      return withdrawApplication(null, withdrawForm('non-existent-id'))
    })

    expect(result).toEqual({ error: 'Этот отклик больше не существует или был удалён.' })
  })
})
