import { describe, it, expect, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser, createTestGig, createTestApplication } from '../helpers/seed'

vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))

import { getGigApplications } from '@/lib/view-models'

describe('getGigApplications — owner-gated company «Отклики»', () => {
  it('returns the gig title, count, and applicant cards for the owner', async () => {
    const prisma = getTestPrismaClient()
    const owner = await createTestUser(prisma, { role: 'CLIENT', companyName: 'ООО Заказчик' })
    const gig = await createTestGig(prisma, { clientId: owner.id, status: 'OPEN', title: 'Гиг с откликами' })
    const spec = await createTestUser(prisma, { role: 'SPECIALIST', displayName: 'Иван Спец' })
    await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: spec.id,
      approach: 'Сделаю поэтапно',
      questions: 'Есть ли макеты?',
      estimatedEffort: '2 недели',
      status: 'PENDING',
    })

    const data = await getGigApplications(gig.id, { userId: owner.id, role: 'CLIENT' })
    expect(data).not.toBeNull()
    expect(data!.title).toBe('Гиг с откликами')
    expect(data!.count).toBe(1)
    expect(data!.assignedName).toBeUndefined()
    expect(data!.applicants).toHaveLength(1)
    const a = data!.applicants[0]
    expect(a.name).toBe('Иван Спец')
    expect(a.approach).toBe('Сделаю поэтапно')
    expect(a.questions).toBe('Есть ли макеты?')
    expect(a.estimate).toBe('2 недели')
    expect(a.pending).toBe(true)
    expect(a.status.tone).toBe('review')
  })

  it('returns null for a non-owner (gating)', async () => {
    const prisma = getTestPrismaClient()
    const owner = await createTestUser(prisma, { role: 'CLIENT' })
    const gig = await createTestGig(prisma, { clientId: owner.id, status: 'OPEN' })
    const other = await createTestUser(prisma, { role: 'CLIENT' })
    const spec = await createTestUser(prisma, { role: 'SPECIALIST' })

    expect(await getGigApplications(gig.id, { userId: other.id, role: 'CLIENT' })).toBeNull()
    expect(await getGigApplications(gig.id, { userId: spec.id, role: 'SPECIALIST' })).toBeNull()
  })

  it('exposes assignedName when the gig is assigned', async () => {
    const prisma = getTestPrismaClient()
    const owner = await createTestUser(prisma, { role: 'CLIENT' })
    const spec = await createTestUser(prisma, { role: 'SPECIALIST', displayName: 'Назначенный Спец' })
    const gig = await createTestGig(prisma, {
      clientId: owner.id,
      status: 'IN_PROGRESS',
      assignedSpecialistId: spec.id,
    })
    await createTestApplication(prisma, { gigId: gig.id, specialistId: spec.id, status: 'ACCEPTED' })

    const data = await getGigApplications(gig.id, { userId: owner.id, role: 'CLIENT' })
    expect(data!.assignedName).toBe('Назначенный Спец')
  })

  it('returns null for a missing gig', async () => {
    expect(await getGigApplications('nope', { userId: 'u', role: 'CLIENT' })).toBeNull()
  })
})
