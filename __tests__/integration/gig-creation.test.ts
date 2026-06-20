import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'

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

// Import after mocks
import { createGig } from '@/app/actions/gig'

describe('Gig Creation Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  describe('Required field validation', () => {
    it('creates gig with all required fields', async () => {
      const prisma = getTestPrismaClient()

      // Create CLIENT user
      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description for the gig')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters to pass validation')
      formData.append('budget', '100000')
      formData.append('tags', 'React,TypeScript')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify gig was created
      const gigs = await prisma.gig.findMany({
        where: { clientId: client.id }
      })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].title).toBe('Test Gig')
      expect(gigs[0].description).toBe('Test description for the gig')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects gig with missing title', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      // No title
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        const result = await createGig(null, formData)
        expect(result).toEqual({ error: 'Please fill in all required fields: title, description, and acceptance criteria.' })
      })

      // Verify no gig created
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBe(0)

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects gig with missing description', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      // No description
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        const result = await createGig(null, formData)
        expect(result).toEqual({ error: 'Please fill in all required fields: title, description, and acceptance criteria.' })
      })

      // Verify no gig created
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBe(0)

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects gig with missing acceptance criteria', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      // No acceptance criteria
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        const result = await createGig(null, formData)
        expect(result).toEqual({ error: 'Please fill in all required fields: title, description, and acceptance criteria.' })
      })

      // Verify no gig created
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBe(0)

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects gig with missing budget', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      // No budget

      await withAuthContext(client, async () => {
        const result = await createGig(null, formData)
        expect(result).toEqual({ error: 'Budget must be a positive number in roubles. Enter the amount you\'ll pay the specialist (service fee will be calculated automatically).' })
      })

      // Verify no gig created
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBe(0)

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects gig with whitespace-only title', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', '   ') // Whitespace only
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        const result = await createGig(null, formData)
        expect(result).toEqual({ error: 'Please fill in all required fields: title, description, and acceptance criteria.' })
      })

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects gig with whitespace-only description', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', '   ') // Whitespace only
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        const result = await createGig(null, formData)
        expect(result).toEqual({ error: 'Please fill in all required fields: title, description, and acceptance criteria.' })
      })

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects gig with whitespace-only acceptance criteria', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', '   ') // Whitespace only
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        const result = await createGig(null, formData)
        expect(result).toEqual({ error: 'Please fill in all required fields: title, description, and acceptance criteria.' })
      })

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('Acceptance criteria validation', () => {
    it('accepts acceptance criteria with exactly 50 characters', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'a'.repeat(50)) // Exactly 50 characters
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify gig was created
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('accepts acceptance criteria with more than 50 characters', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'a'.repeat(100)) // 100 characters
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify gig was created
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects acceptance criteria with 49 characters', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'a'.repeat(49)) // 49 characters
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        const result = await createGig(null, formData)
        expect(result).toEqual({ error: 'Acceptance criteria must be at least 50 characters. Add more detail about what defines success for this gig.' })
      })

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects acceptance criteria with very short text', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'Too short') // 9 characters
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        const result = await createGig(null, formData)
        expect(result).toEqual({ error: 'Acceptance criteria must be at least 50 characters. Add more detail about what defines success for this gig.' })
      })

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects whitespace-only acceptance criteria as required', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', '     ') // Only whitespace
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        const result = await createGig(null, formData)
        expect(result).toEqual({ error: 'Please fill in all required fields: title, description, and acceptance criteria.' })
      })

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('trims acceptance criteria before validation', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      // 50 characters excluding whitespace
      formData.append('acceptanceCriteria', '   ' + 'a'.repeat(50) + '   ')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify gig was created and acceptanceCriteria is trimmed
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBe(1)
      expect(gigs[0].acceptanceCriteria).toBe('a'.repeat(50)) // No whitespace

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('accepts long acceptance criteria (500+ characters)', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const longCriteria = 'a'.repeat(500) // 500 characters

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', longCriteria)
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify gig was created with full criteria
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBe(1)
      expect(gigs[0].acceptanceCriteria).toBe(longCriteria)
      expect(gigs[0].acceptanceCriteria.length).toBe(500)

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('Budget validation and conversion', () => {
    it('accepts valid positive budget and converts to kopecks', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000') // 100,000 roubles

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify budget converted to kopecks
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].budget).toBe(10000000) // 100,000 * 100 = 10,000,000 kopecks

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('accepts budget with decimals and rounds correctly', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000.50') // 100,000.50 roubles

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify budget converted and rounded
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].budget).toBe(10000050) // 100,000.50 * 100 = 10,000,050 kopecks (rounded)

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects zero budget', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '0')

      await withAuthContext(client, async () => {
        const result = await createGig(null, formData)
        expect(result).toEqual({ error: 'Budget must be a positive number in roubles. Enter the amount you\'ll pay the specialist (service fee will be calculated automatically).' })
      })

      // Verify no gig created
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBe(0)

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects negative budget', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '-50000')

      await withAuthContext(client, async () => {
        const result = await createGig(null, formData)
        expect(result).toEqual({ error: 'Budget must be a positive number in roubles. Enter the amount you\'ll pay the specialist (service fee will be calculated automatically).' })
      })

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects non-numeric budget', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', 'not-a-number')

      await withAuthContext(client, async () => {
        const result = await createGig(null, formData)
        expect(result).toEqual({ error: 'Budget must be a positive number in roubles. Enter the amount you\'ll pay the specialist (service fee will be calculated automatically).' })
      })

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects empty budget string', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '')

      await withAuthContext(client, async () => {
        const result = await createGig(null, formData)
        expect(result).toEqual({ error: 'Budget must be a positive number in roubles. Enter the amount you\'ll pay the specialist (service fee will be calculated automatically).' })
      })

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('Service fee calculation', () => {
    // Service fee is 10% of budget as documented in project.md
    // Implementation in app/actions/gig.ts uses 0.10 multiplier

    it('calculates 10% service fee correctly', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000') // 100,000 roubles = 10,000,000 kopecks

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify service fee calculation
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].budget).toBe(10000000) // 100,000 * 100
      expect(gigs[0].serviceFee).toBe(1000000) // 10% of 10,000,000 = 1,000,000
      expect(gigs[0].totalAmount).toBe(11000000) // 10,000,000 + 1,000,000

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('floors service fee to nearest kopeck', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '333.33') // Creates fractional kopecks

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify service fee is floored
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      const budget = Math.round(333.33 * 100) // 33333 kopecks
      const expectedServiceFee = Math.floor(budget * 0.10) // Floor of 3333.3 = 3333
      expect(gigs[0].serviceFee).toBe(expectedServiceFee)

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('stores all monetary values correctly', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '50000') // 50,000 roubles

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Fetch and verify all monetary values
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)

      const gig = gigs[0]
      expect(gig.budget).toBe(5000000) // 50,000 * 100
      expect(gig.serviceFee).toBe(500000) // 10% of 5,000,000
      expect(gig.totalAmount).toBe(5500000) // 5,000,000 + 500,000
      expect(gig.totalAmount).toBe(gig.budget + gig.serviceFee) // Verify relationship

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('Default values', () => {
    it('sets status to OPEN by default', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify status is OPEN
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].status).toBe('OPEN')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('handles empty tags correctly', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')
      // No tags field

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify tags is empty string
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].tags).toBe('')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('sets timestamps correctly', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify timestamps are set
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].createdAt).toBeDefined()
      expect(gigs[0].updatedAt).toBeDefined()
      expect(gigs[0].createdAt).toBeInstanceOf(Date)
      expect(gigs[0].updatedAt).toBeInstanceOf(Date)

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('Tags storage', () => {
    it('stores single tag correctly', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')
      formData.append('tags', 'React')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify tags stored correctly
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].tags).toBe('React')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('stores multiple tags correctly', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')
      formData.append('tags', 'React,TypeScript,Node.js')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify tags stored correctly
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].tags).toBe('React,TypeScript,Node.js')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('trims outer whitespace from tags string', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')
      formData.append('tags', '  React,TypeScript  ')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify outer whitespace trimmed
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].tags).toBe('React,TypeScript')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('preserves inner whitespace around individual tags (current behavior)', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')
      formData.append('tags', 'React,  TypeScript , Node.js')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify inner whitespace preserved (documents current behavior)
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].tags).toBe('React,  TypeScript , Node.js')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('Structured requirement fields', () => {
    it('stores all structured fields when provided', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')
      formData.append('goal', 'Achieve specific business outcome')
      formData.append('deliverables', 'Working code, documentation, tests')
      formData.append('constraints', 'Must use TypeScript, deadline in 2 weeks')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify all structured fields stored
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].goal).toBe('Achieve specific business outcome')
      expect(gigs[0].deliverables).toBe('Working code, documentation, tests')
      expect(gigs[0].constraints).toBe('Must use TypeScript, deadline in 2 weeks')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('defaults structured fields to empty string when not provided', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')
      // No goal, deliverables, or constraints

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify structured fields default to empty string
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].goal).toBe('')
      expect(gigs[0].deliverables).toBe('')
      expect(gigs[0].constraints).toBe('')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('allows partial structured fields', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')
      formData.append('goal', 'Only goal provided')
      // No deliverables or constraints

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify goal stored, others empty
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].goal).toBe('Only goal provided')
      expect(gigs[0].deliverables).toBe('')
      expect(gigs[0].constraints).toBe('')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('Role authorization', () => {
    it('allows CLIENT to create gigs', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify gig created
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects SPECIALIST creating gigs', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const specialist = await prisma.user.create({
        data: {
          email: `specialist-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'SPECIALIST'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')

      await withAuthContext(specialist, async () => {
        const result = await createGig(null, formData)
        expect(result).toEqual({ error: 'Only clients can post gigs. Switch to a client account or register as a client to continue.' })
      })

      // Verify no gig created
      const gigs = await prisma.gig.findMany({})
      const specialistGigs = gigs.filter(g => g.clientId === specialist.id)
      expect(specialistGigs.length).toBe(0)

      // Cleanup
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('redirects unauthenticated user to login', async () => {
      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')

      // No auth context
      try {
        await createGig(null, formData)
        expect.fail('Should have redirected')
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT:/login')
      }
    })
  })

  describe('Gig ownership', () => {
    it('sets clientId to authenticated user', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify clientId matches authenticated user
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].clientId).toBe(client.id)

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('allows multiple clients to create separate gigs', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client1 = await prisma.user.create({
        data: {
          email: `client1-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const client2 = await prisma.user.create({
        data: {
          email: `client2-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData1 = new FormData()
      formData1.append('title', 'Client 1 Gig')
      formData1.append('description', 'Test description')
      formData1.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData1.append('budget', '100000')

      const formData2 = new FormData()
      formData2.append('title', 'Client 2 Gig')
      formData2.append('description', 'Test description')
      formData2.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData2.append('budget', '50000')

      await withAuthContext(client1, async () => {
        try {
          await createGig(null, formData1)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      await withAuthContext(client2, async () => {
        try {
          await createGig(null, formData2)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify each gig has correct clientId
      const gigs1 = await prisma.gig.findMany({ where: { clientId: client1.id } })
      const gigs2 = await prisma.gig.findMany({ where: { clientId: client2.id } })

      expect(gigs1.length).toBe(1)
      expect(gigs2.length).toBe(1)
      expect(gigs1[0].clientId).toBe(client1.id)
      expect(gigs2[0].clientId).toBe(client2.id)
      expect(gigs1[0].title).toBe('Client 1 Gig')
      expect(gigs2[0].title).toBe('Client 2 Gig')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client1.id } })
      await prisma.gig.deleteMany({ where: { clientId: client2.id } })
      await prisma.user.delete({ where: { id: client1.id } })
      await prisma.user.delete({ where: { id: client2.id } })
    })
  })

  describe('Whitespace handling', () => {
    it('trims whitespace from title', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', '  Test Gig  ') // Leading and trailing spaces
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify whitespace trimmed
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].title).toBe('Test Gig')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('trims whitespace from description', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', '  Test description  ') // Leading and trailing spaces
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify whitespace trimmed
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].description).toBe('Test description')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('trims whitespace from acceptance criteria', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', '  This is a detailed acceptance criteria with more than 50 characters  ')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify whitespace trimmed
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].acceptanceCriteria).toBe('This is a detailed acceptance criteria with more than 50 characters')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('trims whitespace from structured fields', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')
      formData.append('goal', '  Achieve business outcome  ')
      formData.append('deliverables', '  Code and docs  ')
      formData.append('constraints', '  TypeScript required  ')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify whitespace trimmed from all structured fields
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].goal).toBe('Achieve business outcome')
      expect(gigs[0].deliverables).toBe('Code and docs')
      expect(gigs[0].constraints).toBe('TypeScript required')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('XSS Sanitization', () => {
    it('sanitizes script tags in title', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', '<script>alert("XSS")</script>Test Gig')
      formData.append('description', 'Test description for XSS test')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify script tags removed
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].title).toBe('Test Gig')
      expect(gigs[0].title).not.toContain('<script>')
      expect(gigs[0].title).not.toContain('alert')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('sanitizes img tags with onerror in description', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Description with <img src=x onerror="alert(\'XSS\')"> malicious content')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify img tags removed
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].description).toBe('Description with  malicious content')
      expect(gigs[0].description).not.toContain('<img')
      expect(gigs[0].description).not.toContain('onerror')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('sanitizes XSS in acceptanceCriteria', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', '<svg onload="alert(\'XSS\')">This is a detailed acceptance criteria with more than 50 characters</svg>')
      formData.append('budget', '100000')

      let result
      await withAuthContext(client, async () => {
        try {
          result = await createGig(null, formData)
        } catch (error: any) {
          // Redirect is expected on success
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // If there was an error result, the gig wasn't created
      if (result && 'error' in result) {
        console.log('Gig creation error:', result.error)
      }

      // Verify svg tags removed but text preserved
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].acceptanceCriteria).toBe('This is a detailed acceptance criteria with more than 50 characters')
      expect(gigs[0].acceptanceCriteria).not.toContain('<svg')
      expect(gigs[0].acceptanceCriteria).not.toContain('onload')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('sanitizes XSS in optional fields', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')
      formData.append('goal', '<script>alert("XSS")</script>Achieve business outcome')
      formData.append('deliverables', '<iframe src="javascript:alert(\'XSS\')"></iframe>Code and docs')
      formData.append('constraints', '<a href="javascript:alert(\'XSS\')">TypeScript required</a>')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify all optional fields sanitized
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].goal).toBe('Achieve business outcome')
      expect(gigs[0].goal).not.toContain('<script>')
      expect(gigs[0].deliverables).toBe('Code and docs')
      expect(gigs[0].deliverables).not.toContain('<iframe')
      expect(gigs[0].constraints).toBe('TypeScript required')
      expect(gigs[0].constraints).not.toContain('<a')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects gig when title is only XSS payload (empty after sanitization)', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', '<script></script>')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
      formData.append('budget', '100000')

      const result = await withAuthContext(client, async () => {
        return await createGig(null, formData)
      })

      expect(result).toEqual({ error: 'Please fill in all required fields: title, description, and acceptance criteria.' })

      // Verify no gig created
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBe(0)

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('preserves line breaks in sanitized content', async () => {
      const prisma = getTestPrismaClient()

      const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Line 1\nLine 2\nLine 3')
      formData.append('acceptanceCriteria', 'Criteria line 1\nCriteria line 2\nThis has more than 50 characters total')
      formData.append('budget', '100000')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
        }
      })

      // Verify line breaks preserved
      const gigs = await prisma.gig.findMany({ where: { clientId: client.id } })
      expect(gigs.length).toBeGreaterThan(0)
      expect(gigs[0].description).toContain('\n')
      expect(gigs[0].description).toBe('Line 1\nLine 2\nLine 3')
      expect(gigs[0].acceptanceCriteria).toContain('\n')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })
})
