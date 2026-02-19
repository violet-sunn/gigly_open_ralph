import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { setTestSessionToken } from '../helpers/auth'
import { createTestUser, createTestGig } from '../helpers/seed'

// Mock @/lib/prisma to use test database (lazy getter)
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  }
}))

describe('Payment Status Display Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  describe('Gig detail query', () => {
    it('includes paidAt field in query results', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      // Create COMPLETED gig (paidAt should be null)
      const completedGig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'COMPLETED',
        assignedSpecialistId: specialist.id
      })

      // Create PAID gig (paidAt should be set)
      const paidGig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'PAID',
        assignedSpecialistId: specialist.id,
        paidAt: new Date('2024-01-15T10:00:00Z')
      })

      // Query gigs (simulating page data fetch)
      const completedGigData = await prisma.gig.findUnique({
        where: { id: completedGig.id }
      })

      const paidGigData = await prisma.gig.findUnique({
        where: { id: paidGig.id }
      })

      // Assert paidAt field is included
      expect(completedGigData).toHaveProperty('paidAt')
      expect(paidGigData).toHaveProperty('paidAt')

      // Assert COMPLETED gig has null paidAt
      expect(completedGigData!.paidAt).toBeNull()

      // Assert PAID gig has paidAt set to Date object
      expect(paidGigData!.paidAt).toBeInstanceOf(Date)
      expect(paidGigData!.paidAt).toEqual(new Date('2024-01-15T10:00:00Z'))

      // Cleanup
      await prisma.gig.delete({ where: { id: completedGig.id } })
      await prisma.gig.delete({ where: { id: paidGig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })
  })

  describe('Payment status display logic', () => {
    it('COMPLETED gig should display awaiting payment status', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'COMPLETED',
        assignedSpecialistId: specialist.id,
        paidAt: null
      })

      const gigData = await prisma.gig.findUnique({
        where: { id: gig.id }
      })

      // Assert status and paidAt for display logic
      expect(gigData!.status).toBe('COMPLETED')
      expect(gigData!.paidAt).toBeNull()

      // Display logic: COMPLETED with null paidAt should show "Awaiting Payment"
      const shouldShowAwaitingPayment = gigData!.status === 'COMPLETED' && gigData!.paidAt === null
      expect(shouldShowAwaitingPayment).toBe(true)

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('PAID gig should display paid status with date', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const paidAt = new Date('2024-01-15T10:00:00Z')

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'PAID',
        assignedSpecialistId: specialist.id,
        paidAt: paidAt
      })

      const gigData = await prisma.gig.findUnique({
        where: { id: gig.id }
      })

      // Assert status and paidAt for display logic
      expect(gigData!.status).toBe('PAID')
      expect(gigData!.paidAt).toBeInstanceOf(Date)
      expect(gigData!.paidAt).toEqual(paidAt)

      // Display logic: PAID with paidAt should show "Paid" status
      const shouldShowPaid = gigData!.status === 'PAID' && gigData!.paidAt !== null
      expect(shouldShowPaid).toBe(true)

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })
  })

  describe('Payment date formatting', () => {
    it('formats payment date in Russian locale', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      // Known date: January 15, 2024
      const paidAt = new Date('2024-01-15T10:00:00Z')

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'PAID',
        assignedSpecialistId: specialist.id,
        paidAt: paidAt
      })

      const gigData = await prisma.gig.findUnique({
        where: { id: gig.id }
      })

      // Format date using Russian locale
      const formattedDate = gigData!.paidAt!.toLocaleDateString('ru-RU')

      // Russian locale format: DD.MM.YYYY
      expect(formattedDate).toMatch(/^\d{1,2}\.\d{1,2}\.\d{4}$/)

      // Verify it's a valid date string
      expect(formattedDate).toBeTruthy()
      expect(typeof formattedDate).toBe('string')

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('handles null paidAt without formatting errors', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'COMPLETED',
        assignedSpecialistId: specialist.id,
        paidAt: null
      })

      const gigData = await prisma.gig.findUnique({
        where: { id: gig.id }
      })

      // Verify paidAt is null
      expect(gigData!.paidAt).toBeNull()

      // Display logic should check for null before formatting
      const formattedDate = gigData!.paidAt ? gigData!.paidAt.toLocaleDateString('ru-RU') : null

      expect(formattedDate).toBeNull()

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('formats different dates consistently', async () => {
      const prisma = getTestPrismaClient()

      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

      // Test multiple dates
      const dates = [
        new Date('2024-01-15T10:00:00Z'),
        new Date('2024-12-31T23:59:59Z'),
        new Date('2024-06-01T00:00:00Z')
      ]

      for (const paidAt of dates) {
        const gig = await createTestGig(prisma, {
          clientId: client.id,
          status: 'PAID',
          assignedSpecialistId: specialist.id,
          paidAt: paidAt
        })

        const gigData = await prisma.gig.findUnique({
          where: { id: gig.id }
        })

        const formattedDate = gigData!.paidAt!.toLocaleDateString('ru-RU')

        // All dates should match Russian locale format
        expect(formattedDate).toMatch(/^\d{1,2}\.\d{1,2}\.\d{4}$/)

        await prisma.gig.delete({ where: { id: gig.id } })
      }

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })
  })
})
