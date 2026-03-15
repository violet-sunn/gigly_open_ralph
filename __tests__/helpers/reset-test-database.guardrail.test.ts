import { describe, it, expect } from 'vitest'
import { getTestPrismaClient, resetTestDatabase } from './db'
import { createTestApplication, createTestGig, createTestMessage, createTestUser } from './seed'

describe('resetTestDatabase guardrail', () => {
  it('clears all core tables (users/profiles/gigs/applications/messages/notifications/moderation logs)', async () => {
    const prisma = getTestPrismaClient()

    // Create at least one record in each core table resetTestDatabase() is responsible for.
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const gig = await createTestGig(prisma, {
      clientId: client.id,
      assignedSpecialistId: specialist.id,
      status: 'IN_PROGRESS'
    })

    await createTestApplication(prisma, { gigId: gig.id, specialistId: specialist.id })
    await createTestMessage(prisma, { gigId: gig.id, senderId: specialist.id })

    await prisma.notification.create({
      data: {
        userId: client.id,
        gigId: gig.id,
        type: 'MESSAGE',
        lastReadAt: new Date()
      }
    })

    await prisma.moderationLog.create({
      data: {
        action: 'CLOSE_GIG',
        reason: 'guardrail',
        adminId: client.id,
        targetGigId: gig.id
      }
    })

    // Canary: if any of these counts are already 0, the guardrail is not exercising the reset.
    expect(await prisma.user.count()).toBeGreaterThan(0)
    expect(await prisma.gig.count()).toBeGreaterThan(0)
    expect(await prisma.application.count()).toBeGreaterThan(0)
    expect(await prisma.message.count()).toBeGreaterThan(0)
    expect(await prisma.notification.count()).toBeGreaterThan(0)
    expect(await prisma.moderationLog.count()).toBeGreaterThan(0)

    await resetTestDatabase()

    expect(await prisma.notification.count()).toBe(0)
    expect(await prisma.message.count()).toBe(0)
    expect(await prisma.application.count()).toBe(0)
    expect(await prisma.moderationLog.count()).toBe(0)
    expect(await prisma.gig.count()).toBe(0)
    expect(await prisma.clientProfile.count()).toBe(0)
    expect(await prisma.specialistProfile.count()).toBe(0)
    expect(await prisma.user.count()).toBe(0)
  })
})
