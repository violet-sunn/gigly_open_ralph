import { describe, it, expect, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser, createTestGig } from '../helpers/seed'

vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))

import { getAdminDashboard } from '@/lib/view-models'

describe('getAdminDashboard (reconcile-finances-and-admin)', () => {
  it('returns stats + the OPEN dispute queue + the recent moderation log', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT', companyName: 'ООО Касса' })
    const spec = await createTestUser(prisma, { role: 'SPECIALIST', displayName: 'Спец' })
    const admin = await createTestUser(prisma, { role: 'ADMIN' })

    const gigOpen = await createTestGig(prisma, {
      clientId: client.id,
      assignedSpecialistId: spec.id,
      status: 'IN_PROGRESS',
      title: 'Гиг со спором',
    })
    const gigResolved = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: spec.id, status: 'IN_PROGRESS' })
    await prisma.dispute.create({ data: { gigId: gigOpen.id, openerId: client.id, reason: 'X', status: 'OPEN' } })
    await prisma.dispute.create({ data: { gigId: gigResolved.id, openerId: client.id, reason: 'Y', status: 'RESOLVED' } })
    await prisma.moderationLog.create({ data: { action: 'SUSPEND_USER', reason: 'спам', adminId: admin.id, targetUserId: spec.id } })

    const data = await getAdminDashboard()

    // stats
    expect(data.stats.stats.some((s) => s.label === 'Пользователи')).toBe(true)
    expect(data.stats.stats.some((s) => s.label === 'Гиги')).toBe(true)

    // the dispute queue contains only the OPEN dispute
    expect(data.disputes.disputes).toHaveLength(1)
    expect(data.disputes.disputes[0].gig).toBe('Гиг со спором')

    // the moderation log row is mapped (RU action label + actor email)
    expect(data.log).toHaveLength(1)
    expect(data.log[0].action).toBe('Заблокирован пользователь')
    expect(data.log[0].actor).toBe(admin.email)
  })
})
