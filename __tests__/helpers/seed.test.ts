import { describe, it, expect } from 'vitest'
import { withTestTransaction } from './db'
import { createTestUser, createTestGig, createTestApplication } from './seed'

describe('Seed Data Helpers', () => {
  describe('createTestUser', () => {
    it('creates user with default CLIENT role and profile', async () => {
      await withTestTransaction(async (tx) => {
        const user = await createTestUser(tx)

        expect(user.email).toContain('test-')
        expect(user.role).toBe('CLIENT')
        expect(user.password).toBeDefined()
        expect(user.clientProfile).toBeTruthy()
        expect(user.clientProfile?.companyName).toBe('Test Company')
        expect(user.clientProfile?.inn).toBe('1234567890')
      })
    })

    it('creates user with SPECIALIST role and profile', async () => {
      await withTestTransaction(async (tx) => {
        const user = await createTestUser(tx, { role: 'SPECIALIST' })

        expect(user.role).toBe('SPECIALIST')
        expect(user.specialistProfile).toBeTruthy()
        expect(user.specialistProfile?.techStack).toBe('React, TypeScript')
        expect(user.specialistProfile?.experienceLevel).toBe('SENIOR')
        expect(user.clientProfile).toBeNull()
      })
    })

    it('creates user with ADMIN role without profile', async () => {
      await withTestTransaction(async (tx) => {
        const user = await createTestUser(tx, { role: 'ADMIN' })

        expect(user.role).toBe('ADMIN')
        expect(user.clientProfile).toBeNull()
        expect(user.specialistProfile).toBeNull()
      })
    })

    it('applies custom overrides', async () => {
      await withTestTransaction(async (tx) => {
        const user = await createTestUser(tx, {
          email: 'custom@example.com',
          role: 'CLIENT',
          companyName: 'Custom Company',
          inn: '9876543210',
          suspended: true
        })

        expect(user.email).toBe('custom@example.com')
        expect(user.suspended).toBe(true)
        expect(user.clientProfile?.companyName).toBe('Custom Company')
        expect(user.clientProfile?.inn).toBe('9876543210')
      })
    })

    it('generates unique emails for multiple users', async () => {
      await withTestTransaction(async (tx) => {
        const user1 = await createTestUser(tx)
        const user2 = await createTestUser(tx)

        expect(user1.email).not.toBe(user2.email)
      })
    })
  })

  describe('createTestGig', () => {
    it('creates gig with default values and auto-generated client', async () => {
      await withTestTransaction(async (tx) => {
        const gig = await createTestGig(tx)

        expect(gig.title).toBe('Test Gig')
        expect(gig.description).toBe('Test gig description')
        expect(gig.budget).toBe(100000)
        expect(gig.serviceFee).toBe(10000)
        expect(gig.totalAmount).toBe(110000)
        expect(gig.status).toBe('OPEN')
        expect(gig.tags).toBe('React,TypeScript')
        expect(gig.client).toBeTruthy()
        expect(gig.client.role).toBe('CLIENT')
      })
    })

    it('creates gig with existing client', async () => {
      await withTestTransaction(async (tx) => {
        const client = await createTestUser(tx, { role: 'CLIENT' })
        const gig = await createTestGig(tx, { clientId: client.id })

        expect(gig.clientId).toBe(client.id)
        expect(gig.client.id).toBe(client.id)
      })
    })

    it('applies custom overrides', async () => {
      await withTestTransaction(async (tx) => {
        const gig = await createTestGig(tx, {
          title: 'Custom Gig',
          budget: 200000,
          status: 'CLOSED',
          tags: 'Python,Django'
        })

        expect(gig.title).toBe('Custom Gig')
        expect(gig.budget).toBe(200000)
        expect(gig.status).toBe('CLOSED')
        expect(gig.tags).toBe('Python,Django')
      })
    })
  })

  describe('createTestApplication', () => {
    it('creates application with auto-generated gig and specialist', async () => {
      await withTestTransaction(async (tx) => {
        const app = await createTestApplication(tx)

        expect(app.approach).toBe('Test technical approach')
        expect(app.questions).toBe('Test clarifying questions')
        expect(app.estimatedEffort).toBe('2 weeks')
        expect(app.status).toBe('PENDING')
        expect(app.gig).toBeTruthy()
        expect(app.specialist).toBeTruthy()
        expect(app.specialist.role).toBe('SPECIALIST')
      })
    })

    it('creates application with existing gig and specialist', async () => {
      await withTestTransaction(async (tx) => {
        const gig = await createTestGig(tx)
        const specialist = await createTestUser(tx, { role: 'SPECIALIST' })

        const app = await createTestApplication(tx, {
          gigId: gig.id,
          specialistId: specialist.id
        })

        expect(app.gigId).toBe(gig.id)
        expect(app.specialistId).toBe(specialist.id)
      })
    })

    it('applies custom overrides', async () => {
      await withTestTransaction(async (tx) => {
        const app = await createTestApplication(tx, {
          approach: 'Custom approach',
          estimatedEffort: '1 week',
          status: 'ACCEPTED'
        })

        expect(app.approach).toBe('Custom approach')
        expect(app.estimatedEffort).toBe('1 week')
        expect(app.status).toBe('ACCEPTED')
      })
    })

    it('creates complete entity graph', async () => {
      await withTestTransaction(async (tx) => {
        const app = await createTestApplication(tx)

        // Verify all relations are loaded
        expect(app.gig.client).toBeTruthy()
        expect(app.specialist.specialistProfile).toBeTruthy()

        // Verify data integrity
        expect(app.gigId).toBe(app.gig.id)
        expect(app.specialistId).toBe(app.specialist.id)
      })
    })
  })
})
