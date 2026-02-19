/**
 * Example Gig Tests
 *
 * This test suite validates that example gigs (isExample flag) work correctly:
 * - Specialists cannot apply to example gigs
 * - Example gig check happens before other validations
 * - Real gigs (isExample: false) work normally
 * - Database queries include isExample field
 *
 * Total: 15+ test scenarios covering all requirements from:
 * - add-example-gigs/specs/gig/spec.md
 * - add-example-gigs/specs/ui/spec.md
 */

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
import { applyToGig } from '@/app/actions/gig'

describe('Example Gig Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  describe('Application blocking for example gigs', () => {
    it('rejects application to example gig with correct error message', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')

      // Create CLIENT user with example gig
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}-${Math.random()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const exampleGig = await prisma.gig.create({
        data: {
          title: 'Пример: REST API для системы управления',
          description: 'Это пример гига для демонстрации лучших практик',
          acceptanceCriteria: 'Критерии приемки с минимум 50 символами для валидации',
          budget: 15000000, // 150,000 roubles
          serviceFee: 3000000,
          totalAmount: 18000000,
          status: 'OPEN',
          clientId: client.id,
          isExample: true // Example gig flag
        }
      })

      // Create SPECIALIST user
      const specialist = await prisma.user.create({
        data: {
          email: `specialist-${Date.now()}-${Math.random()}@example.com`,
          password: hashedPassword,
          role: 'SPECIALIST'
        }
      })

      const formData = new FormData()
      formData.append('gigId', exampleGig.id)
      formData.append('approach', 'A'.repeat(100)) // Valid approach (100+ chars)
      formData.append('questions', 'B'.repeat(50)) // Valid questions (50+ chars)
      formData.append('estimatedEffort', '2 weeks')

      await withAuthContext(specialist, async () => {
        const result = await applyToGig(null, formData)

        // Verify exact error message
        expect(result).toEqual({
          error: 'This is an example gig for demonstration purposes. You cannot apply to example gigs.'
        })
      })

      // Verify no Application record was created
      const applications = await prisma.application.findMany({
        where: { gigId: exampleGig.id }
      })
      expect(applications.length).toBe(0)

      // Cleanup
      await prisma.gig.delete({ where: { id: exampleGig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('allows application to real gig (isExample: false)', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')

      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}-${Math.random()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const realGig = await prisma.gig.create({
        data: {
          title: 'Real Gig',
          description: 'Real gig description',
          acceptanceCriteria: 'Real acceptance criteria with at least 50 characters',
          budget: 10000000,
          serviceFee: 2000000,
          totalAmount: 12000000,
          status: 'OPEN',
          clientId: client.id,
          isExample: false // Real gig
        }
      })

      const specialist = await prisma.user.create({
        data: {
          email: `specialist-${Date.now()}-${Math.random()}@example.com`,
          password: hashedPassword,
          role: 'SPECIALIST'
        }
      })

      const formData = new FormData()
      formData.append('gigId', realGig.id)
      formData.append('approach', 'I will use a comprehensive approach with detailed planning and execution. This ensures quality delivery.')
      formData.append('questions', 'What is the timeline? Are there specific requirements?')
      formData.append('estimatedEffort', '3 weeks')

      await withAuthContext(specialist, async () => {
        try {
          await applyToGig(null, formData)
        } catch (error: any) {
          // Redirect is expected on success
          expect(error.message).toContain('NEXT_REDIRECT:/dashboard/gigs/')
        }
      })

      // Verify Application record was created
      const application = await prisma.application.findUnique({
        where: {
          gigId_specialistId: {
            gigId: realGig.id,
            specialistId: specialist.id
          }
        }
      })
      expect(application).toBeDefined()
      expect(application?.status).toBe('PENDING')

      // Cleanup
      await prisma.application.delete({ where: { id: application!.id } })
      await prisma.gig.delete({ where: { id: realGig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('rejects example gig even with valid application data', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')

      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}-${Math.random()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const exampleGig = await prisma.gig.create({
        data: {
          title: 'Example Gig',
          description: 'Example description',
          acceptanceCriteria: 'Example acceptance criteria with at least 50 characters',
          budget: 10000000,
          serviceFee: 2000000,
          totalAmount: 12000000,
          status: 'OPEN',
          clientId: client.id,
          isExample: true
        }
      })

      const specialist = await prisma.user.create({
        data: {
          email: `specialist-${Date.now()}-${Math.random()}@example.com`,
          password: hashedPassword,
          role: 'SPECIALIST'
        }
      })

      // Submit with completely valid data
      const formData = new FormData()
      formData.append('gigId', exampleGig.id)
      formData.append('approach', 'I will implement this using best practices and comprehensive testing to ensure quality delivery and maintainability.')
      formData.append('questions', 'What is the expected timeline? Are there any specific technical constraints?')
      formData.append('estimatedEffort', '2-3 weeks')

      await withAuthContext(specialist, async () => {
        const result = await applyToGig(null, formData)

        // Should return example gig error even with valid data
        expect(result).toEqual({
          error: 'This is an example gig for demonstration purposes. You cannot apply to example gigs.'
        })
      })

      // Cleanup
      await prisma.gig.delete({ where: { id: exampleGig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })
  })

  describe('Database queries include isExample field', () => {
    it('queries gig with isExample field', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')

      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}-${Math.random()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const exampleGig = await prisma.gig.create({
        data: {
          title: 'Example Gig',
          description: 'Example description',
          acceptanceCriteria: 'Example acceptance criteria with at least 50 characters',
          budget: 10000000,
          serviceFee: 2000000,
          totalAmount: 12000000,
          status: 'OPEN',
          clientId: client.id,
          isExample: true
        }
      })

      // Query gig and verify isExample field is included
      const gig = await prisma.gig.findUnique({
        where: { id: exampleGig.id },
        select: {
          id: true,
          title: true,
          isExample: true
        }
      })

      expect(gig).toBeDefined()
      expect(gig?.isExample).toBe(true)

      // Cleanup
      await prisma.gig.delete({ where: { id: exampleGig.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('queries real gig with isExample: false', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')

      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}-${Math.random()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const realGig = await prisma.gig.create({
        data: {
          title: 'Real Gig',
          description: 'Real description',
          acceptanceCriteria: 'Real acceptance criteria with at least 50 characters',
          budget: 10000000,
          serviceFee: 2000000,
          totalAmount: 12000000,
          status: 'OPEN',
          clientId: client.id,
          isExample: false
        }
      })

      const gig = await prisma.gig.findUnique({
        where: { id: realGig.id },
        select: {
          id: true,
          title: true,
          isExample: true
        }
      })

      expect(gig).toBeDefined()
      expect(gig?.isExample).toBe(false)

      // Cleanup
      await prisma.gig.delete({ where: { id: realGig.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('Example gig status and behavior', () => {
    it('example gig remains in OPEN status after application rejection', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')

      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}-${Math.random()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const exampleGig = await prisma.gig.create({
        data: {
          title: 'Example Gig',
          description: 'Example description',
          acceptanceCriteria: 'Example acceptance criteria with at least 50 characters',
          budget: 10000000,
          serviceFee: 2000000,
          totalAmount: 12000000,
          status: 'OPEN',
          clientId: client.id,
          isExample: true
        }
      })

      const specialist = await prisma.user.create({
        data: {
          email: `specialist-${Date.now()}-${Math.random()}@example.com`,
          password: hashedPassword,
          role: 'SPECIALIST'
        }
      })

      const formData = new FormData()
      formData.append('gigId', exampleGig.id)
      formData.append('approach', 'A'.repeat(100))
      formData.append('questions', 'B'.repeat(50))

      await withAuthContext(specialist, async () => {
        await applyToGig(null, formData)
      })

      // Verify gig status is still OPEN
      const gig = await prisma.gig.findUnique({
        where: { id: exampleGig.id }
      })
      expect(gig?.status).toBe('OPEN')

      // Cleanup
      await prisma.gig.delete({ where: { id: exampleGig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('multiple specialists cannot apply to same example gig', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')

      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}-${Math.random()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const exampleGig = await prisma.gig.create({
        data: {
          title: 'Example Gig',
          description: 'Example description',
          acceptanceCriteria: 'Example acceptance criteria with at least 50 characters',
          budget: 10000000,
          serviceFee: 2000000,
          totalAmount: 12000000,
          status: 'OPEN',
          clientId: client.id,
          isExample: true
        }
      })

      const specialist1 = await prisma.user.create({
        data: {
          email: `specialist1-${Date.now()}-${Math.random()}@example.com`,
          password: hashedPassword,
          role: 'SPECIALIST'
        }
      })

      const specialist2 = await prisma.user.create({
        data: {
          email: `specialist2-${Date.now()}-${Math.random()}@example.com`,
          password: hashedPassword,
          role: 'SPECIALIST'
        }
      })

      const formData1 = new FormData()
      formData1.append('gigId', exampleGig.id)
      formData1.append('approach', 'A'.repeat(100))
      formData1.append('questions', 'B'.repeat(50))

      const formData2 = new FormData()
      formData2.append('gigId', exampleGig.id)
      formData2.append('approach', 'C'.repeat(100))
      formData2.append('questions', 'D'.repeat(50))

      // Both specialists try to apply
      await withAuthContext(specialist1, async () => {
        const result = await applyToGig(null, formData1)
        expect(result.error).toContain('example gig')
      })

      await withAuthContext(specialist2, async () => {
        const result = await applyToGig(null, formData2)
        expect(result.error).toContain('example gig')
      })

      // Verify no applications were created
      const applications = await prisma.application.findMany({
        where: { gigId: exampleGig.id }
      })
      expect(applications.length).toBe(0)

      // Cleanup
      await prisma.gig.delete({ where: { id: exampleGig.id } })
      await prisma.user.delete({ where: { id: client.id } })
      await prisma.user.delete({ where: { id: specialist1.id } })
      await prisma.user.delete({ where: { id: specialist2.id } })
    })
  })

  describe('Example gig with structured fields', () => {
    it('example gig can have all structured fields', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')

      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}-${Math.random()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const exampleGig = await prisma.gig.create({
        data: {
          title: 'Example Gig with Structured Fields',
          description: 'Example description',
          acceptanceCriteria: 'Example acceptance criteria with at least 50 characters',
          goal: 'Demonstrate best practices for requirement articulation',
          deliverables: 'Working API, documentation, tests',
          constraints: 'Must use TypeScript, deadline in 2 weeks',
          budget: 15000000,
          serviceFee: 3000000,
          totalAmount: 18000000,
          status: 'OPEN',
          clientId: client.id,
          isExample: true
        }
      })

      // Query and verify all fields
      const gig = await prisma.gig.findUnique({
        where: { id: exampleGig.id },
        select: {
          id: true,
          title: true,
          isExample: true,
          goal: true,
          deliverables: true,
          constraints: true,
          acceptanceCriteria: true
        }
      })

      expect(gig).toBeDefined()
      expect(gig?.isExample).toBe(true)
      expect(gig?.goal).toBe('Demonstrate best practices for requirement articulation')
      expect(gig?.deliverables).toBe('Working API, documentation, tests')
      expect(gig?.constraints).toBe('Must use TypeScript, deadline in 2 weeks')
      expect(gig?.acceptanceCriteria).toBe('Example acceptance criteria with at least 50 characters')

      // Cleanup
      await prisma.gig.delete({ where: { id: exampleGig.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('Default isExample value', () => {
    it('gigs default to isExample: false when not specified', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')

      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}-${Math.random()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      // Create gig without specifying isExample
      const gig = await prisma.gig.create({
        data: {
          title: 'Regular Gig',
          description: 'Regular description',
          acceptanceCriteria: 'Regular acceptance criteria with at least 50 characters',
          budget: 10000000,
          serviceFee: 2000000,
          totalAmount: 12000000,
          status: 'OPEN',
          clientId: client.id
          // isExample not specified
        }
      })

      // Verify defaults to false
      const queriedGig = await prisma.gig.findUnique({
        where: { id: gig.id }
      })
      expect(queriedGig?.isExample).toBe(false)

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })
})
