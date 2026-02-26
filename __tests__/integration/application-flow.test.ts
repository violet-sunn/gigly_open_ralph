/**
 * Comprehensive Application Flow Tests
 *
 * This test suite validates the complete application flow in the Gigly marketplace:
 * - Application submission (applyToGig) - 16 scenarios
 * - Application acceptance (acceptApplication) - 8 scenarios
 * - Application rejection (rejectApplication) - 6 scenarios
 *
 * Total: 30 test scenarios covering all requirements from:
 * - specialist-gig-browsing spec
 * - application-management spec
 * - structured-application-fields spec
 *
 * Critical findings:
 * - Race condition vulnerability in acceptApplication (documented in proposal)
 * - Tests verify sequential case; true concurrency testing requires explicit transaction control
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
import { applyToGig, acceptApplication, rejectApplication } from '@/app/actions/gig'

describe('Application Flow Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  describe('Application Submission Tests', () => {
    it('creates application with all required fields', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')

      // Create CLIENT user with gig
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig',
          description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, // 100,000 roubles in kopecks
          serviceFee: 2000000,
          totalAmount: 12000000,
          status: 'OPEN',
          clientId: client.id
        }
      })

      // Create SPECIALIST user
      const specialist = await prisma.user.create({
        data: {
          email: `specialist-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'SPECIALIST'
        }
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'I will use a test-driven development approach with comprehensive unit tests and integration tests. This methodology ensures high code quality and maintainability.')
      formData.append('questions', 'What is the expected timeline? Are there any specific testing frameworks preferred?')
      formData.append('estimatedEffort', '2-3 weeks')

      await withAuthContext(specialist, async () => {
        try {
          await applyToGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/gigs/')
        }
      })

      // Verify application was created
      const application = await prisma.application.findUnique({
        where: {
          gigId_specialistId: {
            gigId: gig.id,
            specialistId: specialist.id
          }
        }
      })

      expect(application).toBeDefined()
      expect(application?.status).toBe('PENDING')
      expect(application?.approach).toContain('test-driven development')
      expect(application?.questions).toContain('expected timeline')
      expect(application?.estimatedEffort).toBe('2-3 weeks')
      expect(application?.coverLetter).toBe('') // Legacy field, empty for new applications
    })

    it('rejects application without approach field', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')

      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig',
          description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000,
          serviceFee: 2000000,
          totalAmount: 12000000,
          status: 'OPEN',
          clientId: client.id
        }
      })

      const specialist = await prisma.user.create({
        data: {
          email: `specialist-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'SPECIALIST'
        }
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      // Missing approach field
      formData.append('questions', 'What is the expected timeline?')

      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData)
      })

      expect(result).toEqual({ error: 'Technical approach is required.' })

      // Verify no application was created
      const application = await prisma.application.findUnique({
        where: {
          gigId_specialistId: {
            gigId: gig.id,
            specialistId: specialist.id
          }
        }
      })
      expect(application).toBeNull()
    })

    it('rejects application without questions field', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')

      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: {
          email: `client-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'CLIENT'
        }
      })

      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig',
          description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000,
          serviceFee: 2000000,
          totalAmount: 12000000,
          status: 'OPEN',
          clientId: client.id
        }
      })

      const specialist = await prisma.user.create({
        data: {
          email: `specialist-${Date.now()}@example.com`,
          password: hashedPassword,
          role: 'SPECIALIST'
        }
      })

      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'I will use a test-driven development approach with comprehensive unit tests and integration tests.')
      // Missing questions field

      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData)
      })

      expect(result).toEqual({ error: 'Clarifying questions are required.' })

      // Verify no application was created
      const application = await prisma.application.findUnique({
        where: {
          gigId_specialistId: {
            gigId: gig.id,
            specialistId: specialist.id
          }
        }
      })
      expect(application).toBeNull()
    })

    it('rejects approach shorter than 100 characters', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'Too short')
      formData.append('questions', 'What is the expected timeline for this project?')
      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData)
      })
      expect(result?.error).toContain('Technical approach must be at least 100 characters')
      const application = await prisma.application.findUnique({
        where: { gigId_specialistId: { gigId: gig.id, specialistId: specialist.id } }
      })
      expect(application).toBeNull()
    })

    it('rejects questions shorter than 50 characters', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'I will implement this using a comprehensive test-driven development approach with full unit test coverage, integration tests, and end-to-end testing to ensure quality and reliability.')
      formData.append('questions', 'Timeline?')
      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData)
      })
      expect(result?.error).toContain('Clarifying questions must be at least 50 characters')
      const application = await prisma.application.findUnique({
        where: { gigId_specialistId: { gigId: gig.id, specialistId: specialist.id } }
      })
      expect(application).toBeNull()
    })

    it('rejects approach longer than 2000 characters', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'A'.repeat(2001))
      formData.append('questions', 'What is the expected timeline for this project? Do you have any specific requirements?')
      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData)
      })
      expect(result).toEqual({ error: 'Technical approach is too long. Maximum 2000 characters allowed.' })
      const application = await prisma.application.findUnique({
        where: { gigId_specialistId: { gigId: gig.id, specialistId: specialist.id } }
      })
      expect(application).toBeNull()
    })

    it('rejects questions longer than 1000 characters', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'I will implement this using a comprehensive test-driven development approach with full unit test coverage, integration tests, and end-to-end testing to ensure quality and reliability.')
      formData.append('questions', 'Q'.repeat(1001))
      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData)
      })
      expect(result).toEqual({ error: 'Clarifying questions are too long. Maximum 1000 characters allowed.' })
      const application = await prisma.application.findUnique({
        where: { gigId_specialistId: { gigId: gig.id, specialistId: specialist.id } }
      })
      expect(application).toBeNull()
    })

    it('rejects estimated effort longer than 200 characters', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'I will implement this using a comprehensive test-driven development approach with full unit test coverage, integration tests, and end-to-end testing to ensure quality and reliability.')
      formData.append('questions', 'What is the expected timeline for this project? Are there any specific requirements or constraints?')
      formData.append('estimatedEffort', 'E'.repeat(201))
      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData)
      })
      expect(result).toEqual({ error: 'Estimated effort is too long. Maximum 200 characters allowed.' })
      const application = await prisma.application.findUnique({
        where: { gigId_specialistId: { gigId: gig.id, specialistId: specialist.id } }
      })
      expect(application).toBeNull()
    })

    it('prevents duplicate applications', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const formData1 = new FormData()
      formData1.append('gigId', gig.id)
      formData1.append('approach', 'I will implement this using a comprehensive test-driven development approach with full unit test coverage, integration tests, and end-to-end testing to ensure quality and reliability.')
      formData1.append('questions', 'What is the expected timeline for this project? Are there any specific requirements or constraints?')
      await withAuthContext(specialist, async () => {
        try {
          await applyToGig(null, formData1)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })
      const formData2 = new FormData()
      formData2.append('gigId', gig.id)
      formData2.append('approach', 'I will implement this using a comprehensive test-driven development approach with full unit test coverage, integration tests, and end-to-end testing to ensure quality and reliability.')
      formData2.append('questions', 'What is the expected timeline for this project? Are there any specific requirements or constraints?')
      formData2.append('gigId', gig.id)
      formData2.append('approach', 'Different approach with different methodology and different testing strategy for this project.')
      formData2.append('questions', 'Different questions about the project scope?')
      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData2)
      })
      expect(result).toEqual({ error: 'You have already applied to this gig.' })
      const applications = await prisma.application.findMany({
        where: { gigId: gig.id, specialistId: specialist.id }
      })
      expect(applications).toHaveLength(1)
    })

    it('rejects application to non-existent gig', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const formData = new FormData()
      formData.append('gigId', 'non-existent-gig-id')
      formData.append('approach', 'I will implement this using a comprehensive test-driven development approach with full unit test coverage, integration tests, and end-to-end testing to ensure quality and reliability.')
      formData.append('questions', 'What is the expected timeline for this project? Are there any specific requirements or constraints?')
      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData)
      })
      expect(result).toEqual({ error: 'Gig not found.' })
    })

    it('rejects application to example gig', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Example Gig', description: 'Example description',
          acceptanceCriteria: 'Example acceptance criteria with at least 50 characters',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN',
          clientId: client.id, isExample: true
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'I will implement this using a comprehensive test-driven development approach with full unit test coverage, integration tests, and end-to-end testing to ensure quality and reliability.')
      formData.append('questions', 'What is the expected timeline for this project? Are there any specific requirements or constraints?')
      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData)
      })
      expect(result?.error).toContain('example gig')
    })

    it('rejects application to closed gig', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Closed Gig', description: 'Closed description',
          acceptanceCriteria: 'Closed acceptance criteria with at least 50 characters',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN',
          clientId: client.id, closedByAdmin: true
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'I will implement this using a comprehensive test-driven development approach with full unit test coverage, integration tests, and end-to-end testing to ensure quality and reliability.')
      formData.append('questions', 'What is the expected timeline for this project? Are there any specific requirements or constraints?')
      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData)
      })
      expect(result).toEqual({ error: 'This gig has been closed by administrators.' })
    })
  })

  describe('Application Submission - Gig Status Tests', () => {
    it('rejects application to IN_PROGRESS gig', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'IN_PROGRESS', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'I will implement this using a comprehensive test-driven development approach with full unit test coverage, integration tests, and end-to-end testing to ensure quality and reliability.')
      formData.append('questions', 'What is the expected timeline for this project? Are there any specific requirements or constraints?')
      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData)
      })
      expect(result).toEqual({ error: 'This gig is no longer accepting applications.' })
    })

    it('rejects application to REVIEW gig', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'REVIEW', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'I will implement this using a comprehensive test-driven development approach with full unit test coverage, integration tests, and end-to-end testing to ensure quality and reliability.')
      formData.append('questions', 'What is the expected timeline for this project? Are there any specific requirements or constraints?')
      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData)
      })
      expect(result).toEqual({ error: 'This gig is no longer accepting applications.' })
    })

    it('rejects application to COMPLETED gig', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'COMPLETED', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'I will implement this using a comprehensive test-driven development approach with full unit test coverage, integration tests, and end-to-end testing to ensure quality and reliability.')
      formData.append('questions', 'What is the expected timeline for this project? Are there any specific requirements or constraints?')
      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData)
      })
      expect(result).toEqual({ error: 'This gig is no longer accepting applications.' })
    })

    it('rejects application to PAID gig', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'PAID', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'I will implement this using a comprehensive test-driven development approach with full unit test coverage, integration tests, and end-to-end testing to ensure quality and reliability.')
      formData.append('questions', 'What is the expected timeline for this project? Are there any specific requirements or constraints?')
      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData)
      })
      expect(result).toEqual({ error: 'This gig is no longer accepting applications.' })
    })
  })

  describe('Application Submission - Authorization Tests', () => {
    it('rejects application from CLIENT user', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'I will implement this using a comprehensive test-driven development approach with full unit test coverage, integration tests, and end-to-end testing to ensure quality and reliability.')
      formData.append('questions', 'What is the expected timeline for this project? Are there any specific requirements or constraints?')
      const result = await withAuthContext(client, async () => {
        return await applyToGig(null, formData)
      })
      expect(result).toEqual({ error: 'Only specialists can apply to gigs.' })
    })

    it('redirects unauthenticated user to login', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const formData = new FormData()
      formData.append('gigId', gig.id)
      formData.append('approach', 'I will implement this using a comprehensive test-driven development approach with full unit test coverage, integration tests, and end-to-end testing to ensure quality and reliability.')
      formData.append('questions', 'What is the expected timeline for this project? Are there any specific requirements or constraints?')
      try {
        await applyToGig(null, formData)
        throw new Error('Should have redirected')
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT:/login')
      }
    })
  })

  describe('Application Acceptance Tests', () => {
    it('accepts application successfully', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const application = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist.id, status: 'PENDING',
          approach: 'Test approach with sufficient length for validation requirements',
          questions: 'Test questions with sufficient length for validation'
        }
      })

      const formData = new FormData()
      formData.append('applicationId', application.id)

      await withAuthContext(client, async () => {
        try {
          await acceptApplication(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      const updatedApplication = await prisma.application.findUnique({ where: { id: application.id } })
      expect(updatedApplication?.status).toBe('ACCEPTED')

      const updatedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
      expect(updatedGig?.status).toBe('IN_PROGRESS')
      expect(updatedGig?.assignedSpecialistId).toBe(specialist.id)
    })

    it('auto-rejects other pending applications when one is accepted', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const specialist1 = await prisma.user.create({
        data: { email: `specialist1-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const specialist2 = await prisma.user.create({
        data: { email: `specialist2-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const specialist3 = await prisma.user.create({
        data: { email: `specialist3-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })

      const app1 = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist1.id, status: 'PENDING',
          approach: 'Approach 1 with sufficient length', questions: 'Questions 1 with sufficient length'
        }
      })
      const app2 = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist2.id, status: 'PENDING',
          approach: 'Approach 2 with sufficient length', questions: 'Questions 2 with sufficient length'
        }
      })
      const app3 = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist3.id, status: 'PENDING',
          approach: 'Approach 3 with sufficient length', questions: 'Questions 3 with sufficient length'
        }
      })

      const formData = new FormData()
      formData.append('applicationId', app1.id)

      await withAuthContext(client, async () => {
        try {
          await acceptApplication(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })

      const updatedApp1 = await prisma.application.findUnique({ where: { id: app1.id } })
      const updatedApp2 = await prisma.application.findUnique({ where: { id: app2.id } })
      const updatedApp3 = await prisma.application.findUnique({ where: { id: app3.id } })

      expect(updatedApp1?.status).toBe('ACCEPTED')
      expect(updatedApp2?.status).toBe('REJECTED')
      expect(updatedApp3?.status).toBe('REJECTED')

      const pendingApps = await prisma.application.findMany({
        where: { gigId: gig.id, status: 'PENDING' }
      })
      expect(pendingApps).toHaveLength(0)
    })

    it('rejects acceptance by non-owner CLIENT', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const owner = await prisma.user.create({
        data: { email: `owner-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const otherClient = await prisma.user.create({
        data: { email: `other-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: owner.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const application = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist.id, status: 'PENDING',
          approach: 'Test approach', questions: 'Test questions'
        }
      })
      const formData = new FormData()
      formData.append('applicationId', application.id)
      const result = await withAuthContext(otherClient, async () => {
        return await acceptApplication(null, formData)
      })
      expect(result).toEqual({ error: 'Only the gig owner can manage applications.' })
    })

    it('rejects acceptance by SPECIALIST', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const application = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist.id, status: 'PENDING',
          approach: 'Test approach', questions: 'Test questions'
        }
      })
      const formData = new FormData()
      formData.append('applicationId', application.id)
      const result = await withAuthContext(specialist, async () => {
        return await acceptApplication(null, formData)
      })
      expect(result).toEqual({ error: 'Only clients can manage applications.' })
    })

    it('rejects acceptance on non-OPEN gig', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'IN_PROGRESS', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const application = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist.id, status: 'PENDING',
          approach: 'Test approach', questions: 'Test questions'
        }
      })
      const formData = new FormData()
      formData.append('applicationId', application.id)
      const result = await withAuthContext(client, async () => {
        return await acceptApplication(null, formData)
      })
      expect(result).toEqual({ error: 'This gig is no longer accepting applications.' })
    })

    it('prevents accepting second application after first is accepted', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const specialist1 = await prisma.user.create({
        data: { email: `specialist1-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const specialist2 = await prisma.user.create({
        data: { email: `specialist2-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const app1 = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist1.id, status: 'PENDING',
          approach: 'Approach 1', questions: 'Questions 1'
        }
      })
      const app2 = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist2.id, status: 'PENDING',
          approach: 'Approach 2', questions: 'Questions 2'
        }
      })
      const formData1 = new FormData()
      formData1.append('applicationId', app1.id)
      await withAuthContext(client, async () => {
        try {
          await acceptApplication(null, formData1)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })
      const formData2 = new FormData()
      formData2.append('applicationId', app2.id)
      const result = await withAuthContext(client, async () => {
        return await acceptApplication(null, formData2)
      })
      expect(result).toEqual({ error: 'This gig is no longer accepting applications.' })
      const updatedApp2 = await prisma.application.findUnique({ where: { id: app2.id } })
      expect(updatedApp2?.status).toBe('REJECTED')
      const updatedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
      expect(updatedGig?.assignedSpecialistId).toBe(specialist1.id)
      expect(updatedGig?.status).toBe('IN_PROGRESS')
    })

    it('rejects acceptance of non-PENDING application', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const application = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist.id, status: 'REJECTED',
          approach: 'Test approach', questions: 'Test questions'
        }
      })
      const formData = new FormData()
      formData.append('applicationId', application.id)
      const result = await withAuthContext(client, async () => {
        return await acceptApplication(null, formData)
      })
      expect(result).toEqual({ error: 'This application is no longer pending.' })
    })

    it('rejects acceptance of non-existent application', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const formData = new FormData()
      formData.append('applicationId', 'non-existent-id')
      const result = await withAuthContext(client, async () => {
        return await acceptApplication(null, formData)
      })
      expect(result).toEqual({ error: 'Application not found.' })
    })
  })

  describe('Application Rejection Tests', () => {
    it('rejects application successfully', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const application = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist.id, status: 'PENDING',
          approach: 'Test approach', questions: 'Test questions'
        }
      })
      const formData = new FormData()
      formData.append('applicationId', application.id)
      await withAuthContext(client, async () => {
        try {
          await rejectApplication(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })
      const updatedApplication = await prisma.application.findUnique({ where: { id: application.id } })
      expect(updatedApplication?.status).toBe('REJECTED')
      const updatedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
      expect(updatedGig?.status).toBe('OPEN')
      expect(updatedGig?.assignedSpecialistId).toBeNull()
    })

    it('rejection does not affect other applications', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const specialist1 = await prisma.user.create({
        data: { email: `specialist1-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const specialist2 = await prisma.user.create({
        data: { email: `specialist2-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const app1 = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist1.id, status: 'PENDING',
          approach: 'Approach 1', questions: 'Questions 1'
        }
      })
      const app2 = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist2.id, status: 'PENDING',
          approach: 'Approach 2', questions: 'Questions 2'
        }
      })
      const formData = new FormData()
      formData.append('applicationId', app1.id)
      await withAuthContext(client, async () => {
        try {
          await rejectApplication(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT')
        }
      })
      const updatedApp1 = await prisma.application.findUnique({ where: { id: app1.id } })
      const updatedApp2 = await prisma.application.findUnique({ where: { id: app2.id } })
      expect(updatedApp1?.status).toBe('REJECTED')
      expect(updatedApp2?.status).toBe('PENDING')
      const updatedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
      expect(updatedGig?.status).toBe('OPEN')
    })

    it('rejects rejection by non-owner CLIENT', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const owner = await prisma.user.create({
        data: { email: `owner-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const otherClient = await prisma.user.create({
        data: { email: `other-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: owner.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const application = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist.id, status: 'PENDING',
          approach: 'Test approach', questions: 'Test questions'
        }
      })
      const formData = new FormData()
      formData.append('applicationId', application.id)
      const result = await withAuthContext(otherClient, async () => {
        return await rejectApplication(null, formData)
      })
      expect(result).toEqual({ error: 'Only the gig owner can manage applications.' })
    })

    it('rejects rejection by SPECIALIST', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const application = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist.id, status: 'PENDING',
          approach: 'Test approach', questions: 'Test questions'
        }
      })
      const formData = new FormData()
      formData.append('applicationId', application.id)
      const result = await withAuthContext(specialist, async () => {
        return await rejectApplication(null, formData)
      })
      expect(result).toEqual({ error: 'Only clients can manage applications.' })
    })

    it('rejects rejection of non-PENDING application', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig', description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters to pass validation',
          budget: 10000000, serviceFee: 2000000, totalAmount: 12000000, status: 'OPEN', clientId: client.id
        }
      })
      const specialist = await prisma.user.create({
        data: { email: `specialist-${Date.now()}@example.com`, password: hashedPassword, role: 'SPECIALIST' }
      })
      const application = await prisma.application.create({
        data: {
          gigId: gig.id, specialistId: specialist.id, status: 'ACCEPTED',
          approach: 'Test approach', questions: 'Test questions'
        }
      })
      const formData = new FormData()
      formData.append('applicationId', application.id)
      const result = await withAuthContext(client, async () => {
        return await rejectApplication(null, formData)
      })
      expect(result).toEqual({ error: 'This application is no longer pending.' })
    })

    it('rejects rejection of non-existent application', async () => {
      const prisma = getTestPrismaClient()
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      const client = await prisma.user.create({
        data: { email: `client-${Date.now()}@example.com`, password: hashedPassword, role: 'CLIENT' }
      })
      const formData = new FormData()
      formData.append('applicationId', 'non-existent-id')
      const result = await withAuthContext(client, async () => {
        return await rejectApplication(null, formData)
      })
      expect(result).toEqual({ error: 'Application not found.' })
    })
  })
})