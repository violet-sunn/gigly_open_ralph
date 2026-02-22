import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { setupTestDatabase, cleanupTestDatabase, withTestTransaction } from '../helpers/db'
import { createTestUser, createTestGig, createTestApplication, createTestMessage } from '../helpers/seed'
import { PrismaClient } from '@prisma/client'

describe('Factory Validation Compliance', () => {
  let prisma: PrismaClient

  beforeAll(async () => {
    prisma = await setupTestDatabase()
  })

  afterAll(async () => {
    await cleanupTestDatabase(prisma)
  })

  describe('User Factory Validation', () => {
    it('creates users with unique emails', async () => {
      await withTestTransaction(async (tx) => {
        const user1 = await createTestUser(tx)
        const user2 = await createTestUser(tx)
        const user3 = await createTestUser(tx)

        expect(user1.email).not.toBe(user2.email)
        expect(user2.email).not.toBe(user3.email)
        expect(user1.email).not.toBe(user3.email)
      })
    })

    it('hashes passwords', async () => {
      await withTestTransaction(async (tx) => {
        const user = await createTestUser(tx, { password: 'testpassword123' })

        expect(user.password).not.toBe('testpassword123')
        expect(user.password).toMatch(/^\$2[aby]\$/) // bcrypt hash pattern
      })
    })

    it('creates users with valid roles', async () => {
      await withTestTransaction(async (tx) => {
        const client = await createTestUser(tx, { role: 'CLIENT' })
        const specialist = await createTestUser(tx, { role: 'SPECIALIST' })
        const admin = await createTestUser(tx, { role: 'ADMIN' })

        expect(client.role).toBe('CLIENT')
        expect(specialist.role).toBe('SPECIALIST')
        expect(admin.role).toBe('ADMIN')
      })
    })

    it('creates SPECIALIST with valid experienceLevel', async () => {
      await withTestTransaction(async (tx) => {
        const specialist = await createTestUser(tx, { role: 'SPECIALIST' })

        expect(specialist.specialistProfile?.experienceLevel).toBe('SENIOR')
        expect(['MIDDLE', 'SENIOR']).toContain(specialist.specialistProfile?.experienceLevel)
      })
    })

    it('creates CLIENT with non-empty companyName and inn', async () => {
      await withTestTransaction(async (tx) => {
        const client = await createTestUser(tx, { role: 'CLIENT' })

        expect(client.clientProfile?.companyName).toBeTruthy()
        expect(client.clientProfile?.companyName.length).toBeGreaterThan(0)
        expect(client.clientProfile?.inn).toBeTruthy()
        expect(client.clientProfile?.inn).toHaveLength(10)
      })
    })

    it('creates CLIENT with realistic INN', async () => {
      await withTestTransaction(async (tx) => {
        const client = await createTestUser(tx, { role: 'CLIENT' })

        expect(client.clientProfile?.inn).toMatch(/^\d{10}$/) // 10 digits
      })
    })

    it('creates SPECIALIST with Russian displayName', async () => {
      await withTestTransaction(async (tx) => {
        const specialist = await createTestUser(tx, { role: 'SPECIALIST' })

        expect(specialist.specialistProfile?.displayName).toBeTruthy()
        expect(specialist.specialistProfile?.displayName).toMatch(/[А-Яа-я]/) // Contains Cyrillic
      })
    })

    it('creates CLIENT with Russian companyName', async () => {
      await withTestTransaction(async (tx) => {
        const client = await createTestUser(tx, { role: 'CLIENT' })

        expect(client.clientProfile?.companyName).toMatch(/ООО/) // Contains "ООО"
      })
    })
  })

  describe('Gig Factory Validation', () => {
    it('creates gigs with budget > 0', async () => {
      await withTestTransaction(async (tx) => {
        const gig = await createTestGig(tx)

        expect(gig.budget).toBeGreaterThan(0)
      })
    })

    it('calculates serviceFee correctly (10% of budget)', async () => {
      await withTestTransaction(async (tx) => {
        const gig = await createTestGig(tx)

        expect(gig.serviceFee).toBe(gig.budget * 0.1)
      })
    })

    it('calculates totalAmount correctly (budget + serviceFee)', async () => {
      await withTestTransaction(async (tx) => {
        const gig = await createTestGig(tx)

        expect(gig.totalAmount).toBe(gig.budget + gig.serviceFee)
      })
    })

    it('creates gigs with valid status', async () => {
      await withTestTransaction(async (tx) => {
        const gig = await createTestGig(tx)

        expect(['OPEN', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID']).toContain(gig.status)
      })
    })

    it('creates gigs with non-empty tags', async () => {
      await withTestTransaction(async (tx) => {
        const gig = await createTestGig(tx)

        expect(gig.tags).toBeTruthy()
        expect(gig.tags.length).toBeGreaterThan(0)
      })
    })

    it('creates gigs with Russian title', async () => {
      await withTestTransaction(async (tx) => {
        const gig = await createTestGig(tx)

        expect(gig.title).toMatch(/[А-Яа-я]/) // Contains Cyrillic
      })
    })

    it('creates gigs with Russian description', async () => {
      await withTestTransaction(async (tx) => {
        const gig = await createTestGig(tx)

        expect(gig.description).toMatch(/[А-Яа-я]/) // Contains Cyrillic
        expect(gig.description.length).toBeGreaterThan(50)
      })
    })
  })

  describe('Application Factory Validation', () => {
    it('creates applications with approach length 100-2000 chars', async () => {
      await withTestTransaction(async (tx) => {
        const app = await createTestApplication(tx)

        expect(app.approach.length).toBeGreaterThanOrEqual(100)
        expect(app.approach.length).toBeLessThanOrEqual(2000)
      })
    })

    it('creates applications with questions length 50-1000 chars', async () => {
      await withTestTransaction(async (tx) => {
        const app = await createTestApplication(tx)

        expect(app.questions.length).toBeGreaterThanOrEqual(50)
        expect(app.questions.length).toBeLessThanOrEqual(1000)
      })
    })

    it('respects unique constraint (gigId, specialistId)', async () => {
      await withTestTransaction(async (tx) => {
        const gig = await createTestGig(tx)
        const specialist = await createTestUser(tx, { role: 'SPECIALIST' })

        // First application should succeed
        const app1 = await createTestApplication(tx, {
          gigId: gig.id,
          specialistId: specialist.id
        })
        expect(app1).toBeTruthy()

        // Second application with same gigId and specialistId should fail
        await expect(
          createTestApplication(tx, {
            gigId: gig.id,
            specialistId: specialist.id
          })
        ).rejects.toThrow()
      })
    })

    it('creates applications with valid status', async () => {
      await withTestTransaction(async (tx) => {
        const app = await createTestApplication(tx)

        expect(['PENDING', 'ACCEPTED', 'REJECTED']).toContain(app.status)
      })
    })

    it('creates applications with Russian approach', async () => {
      await withTestTransaction(async (tx) => {
        const app = await createTestApplication(tx)

        expect(app.approach).toMatch(/[А-Яа-я]/) // Contains Cyrillic
      })
    })

    it('creates applications with Russian questions', async () => {
      await withTestTransaction(async (tx) => {
        const app = await createTestApplication(tx)

        expect(app.questions).toMatch(/[А-Яа-я]/) // Contains Cyrillic
      })
    })

    it('creates applications with empty coverLetter (legacy field)', async () => {
      await withTestTransaction(async (tx) => {
        const app = await createTestApplication(tx)

        expect(app.coverLetter).toBe('')
      })
    })
  })

  describe('Message Factory Validation', () => {
    it('creates messages with non-empty content', async () => {
      await withTestTransaction(async (tx) => {
        const message = await createTestMessage(tx)

        expect(message.content).toBeTruthy()
        expect(message.content.length).toBeGreaterThan(0)
      })
    })

    it('creates messages with content <= 2000 chars', async () => {
      await withTestTransaction(async (tx) => {
        const message = await createTestMessage(tx)

        expect(message.content.length).toBeLessThanOrEqual(2000)
      })
    })

    it('creates messages with valid gigId reference', async () => {
      await withTestTransaction(async (tx) => {
        const gig = await createTestGig(tx)
        const message = await createTestMessage(tx, { gigId: gig.id })

        expect(message.gigId).toBe(gig.id)
        expect(message.gig).toBeTruthy()
      })
    })

    it('creates messages with valid senderId reference', async () => {
      await withTestTransaction(async (tx) => {
        const user = await createTestUser(tx)
        const message = await createTestMessage(tx, { senderId: user.id })

        expect(message.senderId).toBe(user.id)
        expect(message.sender).toBeTruthy()
      })
    })

    it('creates messages with Russian content', async () => {
      await withTestTransaction(async (tx) => {
        const message = await createTestMessage(tx)

        expect(message.content).toMatch(/[А-Яа-я]/) // Contains Cyrillic
      })
    })
  })

  describe('Parallel Execution Safety', () => {
    it('creates 25 users in parallel without email collisions', async () => {
      await withTestTransaction(async (tx) => {
        // Create 25 users in parallel
        const userPromises = Array.from({ length: 25 }, () => createTestUser(tx))
        const users = await Promise.all(userPromises)

        // Collect all emails
        const emails = users.map(u => u.email)

        // Verify all emails are unique
        const uniqueEmails = new Set(emails)
        expect(uniqueEmails.size).toBe(25)
      })
    })

    it('creates 10 gigs with applications in parallel without violations', async () => {
      await withTestTransaction(async (tx) => {
        // Create 10 gigs with applications in parallel
        const gigPromises = Array.from({ length: 10 }, async () => {
          const gig = await createTestGig(tx)
          const app = await createTestApplication(tx, { gigId: gig.id })
          return { gig, app }
        })

        const results = await Promise.all(gigPromises)

        // Verify all gigs and applications were created
        expect(results).toHaveLength(10)
        results.forEach(({ gig, app }) => {
          expect(gig.id).toBeTruthy()
          expect(app.id).toBeTruthy()
          expect(app.gigId).toBe(gig.id)
        })
      })
    })
  })

  describe('Override Functionality', () => {
    it('allows overriding user fields', async () => {
      await withTestTransaction(async (tx) => {
        const user = await createTestUser(tx, {
          email: 'custom@example.com',
          role: 'ADMIN',
          companyName: 'Custom Company'
        })

        expect(user.email).toBe('custom@example.com')
        expect(user.role).toBe('ADMIN')
      })
    })

    it('allows overriding gig fields', async () => {
      await withTestTransaction(async (tx) => {
        const gig = await createTestGig(tx, {
          title: 'Custom Title',
          budget: 200000,
          status: 'COMPLETED'
        })

        expect(gig.title).toBe('Custom Title')
        expect(gig.budget).toBe(200000)
        expect(gig.status).toBe('COMPLETED')
      })
    })

    it('allows overriding application fields', async () => {
      await withTestTransaction(async (tx) => {
        const app = await createTestApplication(tx, {
          approach: 'Custom approach text that is long enough to pass validation requirements',
          questions: 'Custom questions text that is also long enough',
          status: 'ACCEPTED'
        })

        expect(app.approach).toBe('Custom approach text that is long enough to pass validation requirements')
        expect(app.questions).toBe('Custom questions text that is also long enough')
        expect(app.status).toBe('ACCEPTED')
      })
    })

    it('allows overriding message fields', async () => {
      await withTestTransaction(async (tx) => {
        const message = await createTestMessage(tx, {
          content: 'Custom message content'
        })

        expect(message.content).toBe('Custom message content')
      })
    })
  })
})
