/**
 * Structured Fields Tests
 *
 * This test suite validates that optional structured fields (goal, deliverables, constraints) work correctly:
 * - Fields are saved correctly when provided
 * - Fields default to empty strings when not provided
 * - Whitespace trimming behavior
 * - No minimum length validation for optional fields
 * - Backward compatibility with gigs without structured fields
 *
 * Total: 12+ test scenarios covering all requirements from:
 * - requirements-iteration-2/specs/gig/spec.md
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
import { createGig } from '@/app/actions/gig'

describe('Structured Fields Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  describe('Structured fields storage', () => {
    it('saves all structured fields when provided', async () => {
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

      const formData = new FormData()
      formData.append('title', 'Разработка REST API')
      formData.append('description', 'Нужно разработать REST API для системы управления')
      formData.append('acceptanceCriteria', 'API должен поддерживать CRUD операции, иметь документацию OpenAPI и покрытие тестами не менее 80%')
      formData.append('goal', 'Создать масштабируемый API для управления пользователями')
      formData.append('deliverables', 'Рабочий API, документация OpenAPI, набор тестов')
      formData.append('constraints', 'Использовать TypeScript и Express, срок 2 недели')
      formData.append('budget', '150000')
      formData.append('tags', 'TypeScript,Node.js')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/dashboard')
        }
      })

      // Verify gig was created with all structured fields
      const gigs = await prisma.gig.findMany({
        where: { clientId: client.id }
      })
      expect(gigs.length).toBe(1)
      expect(gigs[0].goal).toBe('Создать масштабируемый API для управления пользователями')
      expect(gigs[0].deliverables).toBe('Рабочий API, документация OpenAPI, набор тестов')
      expect(gigs[0].constraints).toBe('Использовать TypeScript и Express, срок 2 недели')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('defaults to empty strings when optional fields not provided', async () => {
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

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'Acceptance criteria with at least 50 characters for validation')
      formData.append('budget', '100000')
      formData.append('tags', 'React')
      // goal, deliverables, constraints NOT provided

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/dashboard')
        }
      })

      const gigs = await prisma.gig.findMany({
        where: { clientId: client.id }
      })
      expect(gigs.length).toBe(1)
      expect(gigs[0].goal).toBe('')
      expect(gigs[0].deliverables).toBe('')
      expect(gigs[0].constraints).toBe('')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('trims leading and trailing whitespace from structured fields', async () => {
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

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'Acceptance criteria with at least 50 characters for validation')
      formData.append('goal', '   Goal with whitespace   ')
      formData.append('deliverables', '\n\nDeliverables with newlines\n\n')
      formData.append('constraints', '\t\tConstraints with tabs\t\t')
      formData.append('budget', '100000')
      formData.append('tags', 'React')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/dashboard')
        }
      })

      const gigs = await prisma.gig.findMany({
        where: { clientId: client.id }
      })
      expect(gigs[0].goal).toBe('Goal with whitespace')
      expect(gigs[0].deliverables).toBe('Deliverables with newlines')
      expect(gigs[0].constraints).toBe('Constraints with tabs')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('stores whitespace-only values as empty strings', async () => {
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

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'Acceptance criteria with at least 50 characters for validation')
      formData.append('goal', '   ')
      formData.append('deliverables', '\n\n\n')
      formData.append('constraints', '\t\t\t')
      formData.append('budget', '100000')
      formData.append('tags', 'React')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/dashboard')
        }
      })

      const gigs = await prisma.gig.findMany({
        where: { clientId: client.id }
      })
      expect(gigs[0].goal).toBe('')
      expect(gigs[0].deliverables).toBe('')
      expect(gigs[0].constraints).toBe('')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('Structured fields validation', () => {
    it('accepts short structured fields (no minimum length)', async () => {
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

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'Acceptance criteria with at least 50 characters for validation')
      formData.append('goal', 'Short') // Only 5 characters
      formData.append('deliverables', 'API') // Only 3 characters
      formData.append('constraints', 'TS') // Only 2 characters
      formData.append('budget', '100000')
      formData.append('tags', 'React')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/dashboard')
        }
      })

      const gigs = await prisma.gig.findMany({
        where: { clientId: client.id }
      })
      expect(gigs[0].goal).toBe('Short')
      expect(gigs[0].deliverables).toBe('API')
      expect(gigs[0].constraints).toBe('TS')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('accepts long structured fields (no maximum length)', async () => {
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

      const longText = 'A'.repeat(500) // 500 characters

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'Acceptance criteria with at least 50 characters for validation')
      formData.append('goal', longText)
      formData.append('deliverables', longText)
      formData.append('constraints', longText)
      formData.append('budget', '100000')
      formData.append('tags', 'React')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/dashboard')
        }
      })

      const gigs = await prisma.gig.findMany({
        where: { clientId: client.id }
      })
      expect(gigs[0].goal).toBe(longText)
      expect(gigs[0].deliverables).toBe(longText)
      expect(gigs[0].constraints).toBe(longText)

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('Database queries include structured fields', () => {
    it('queries include goal, deliverables, constraints fields', async () => {
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

      const gig = await prisma.gig.create({
        data: {
          title: 'Test Gig',
          description: 'Test description',
          acceptanceCriteria: 'Acceptance criteria with at least 50 characters',
          goal: 'Test goal',
          deliverables: 'Test deliverables',
          constraints: 'Test constraints',
          budget: 10000000,
          serviceFee: 2000000,
          totalAmount: 12000000,
          status: 'OPEN',
          clientId: client.id
        }
      })

      // Query with select
      const queriedGig = await prisma.gig.findUnique({
        where: { id: gig.id },
        select: {
          id: true,
          title: true,
          goal: true,
          deliverables: true,
          constraints: true
        }
      })

      expect(queriedGig).toBeDefined()
      expect(queriedGig?.goal).toBe('Test goal')
      expect(queriedGig?.deliverables).toBe('Test deliverables')
      expect(queriedGig?.constraints).toBe('Test constraints')

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('Backward compatibility', () => {
    it('displays gigs without structured fields gracefully', async () => {
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

      // Create gig with empty structured fields (simulating old gigs)
      const gig = await prisma.gig.create({
        data: {
          title: 'Old Gig',
          description: 'Old description',
          acceptanceCriteria: 'Old acceptance criteria with at least 50 characters',
          goal: '',
          deliverables: '',
          constraints: '',
          budget: 10000000,
          serviceFee: 2000000,
          totalAmount: 12000000,
          status: 'OPEN',
          clientId: client.id
        }
      })

      const queriedGig = await prisma.gig.findUnique({
        where: { id: gig.id }
      })

      expect(queriedGig).toBeDefined()
      expect(queriedGig?.goal).toBe('')
      expect(queriedGig?.deliverables).toBe('')
      expect(queriedGig?.constraints).toBe('')

      // Cleanup
      await prisma.gig.delete({ where: { id: gig.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('Partial structured fields', () => {
    it('saves only filled fields, others remain empty', async () => {
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

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'Acceptance criteria with at least 50 characters for validation')
      formData.append('goal', 'Only goal is filled')
      // deliverables and constraints NOT provided
      formData.append('budget', '100000')
      formData.append('tags', 'React')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/dashboard')
        }
      })

      const gigs = await prisma.gig.findMany({
        where: { clientId: client.id }
      })
      expect(gigs[0].goal).toBe('Only goal is filled')
      expect(gigs[0].deliverables).toBe('')
      expect(gigs[0].constraints).toBe('')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('Character encoding', () => {
    it('accepts Cyrillic characters (Russian text)', async () => {
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

      const formData = new FormData()
      formData.append('title', 'Разработка API')
      formData.append('description', 'Описание проекта на русском языке')
      formData.append('acceptanceCriteria', 'Критерии приемки должны быть выполнены в полном объеме')
      formData.append('goal', 'Создать масштабируемое решение')
      formData.append('deliverables', 'Рабочий код, документация, тесты')
      formData.append('constraints', 'Использовать современные технологии')
      formData.append('budget', '150000')
      formData.append('tags', 'TypeScript')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/dashboard')
        }
      })

      const gigs = await prisma.gig.findMany({
        where: { clientId: client.id }
      })
      expect(gigs[0].goal).toBe('Создать масштабируемое решение')
      expect(gigs[0].deliverables).toBe('Рабочий код, документация, тесты')
      expect(gigs[0].constraints).toBe('Использовать современные технологии')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('accepts special characters and punctuation', async () => {
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

      const formData = new FormData()
      formData.append('title', 'Test Gig')
      formData.append('description', 'Test description')
      formData.append('acceptanceCriteria', 'Acceptance criteria with at least 50 characters for validation')
      formData.append('goal', 'Goal with special chars: @#$%^&*()')
      formData.append('deliverables', 'Deliverables with punctuation: "quotes", commas, periods.')
      formData.append('constraints', 'Constraints with symbols: <html>, {json}, [array]')
      formData.append('budget', '100000')
      formData.append('tags', 'React')

      await withAuthContext(client, async () => {
        try {
          await createGig(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/dashboard')
        }
      })

      const gigs = await prisma.gig.findMany({
        where: { clientId: client.id }
      })
      expect(gigs[0].goal).toBe('Goal with special chars: @#$%^&*()')
      expect(gigs[0].deliverables).toBe('Deliverables with punctuation: "quotes", commas, periods.')
      // Note: <html> is sanitized out as it looks like an HTML tag (XSS protection)
      expect(gigs[0].constraints).toBe('Constraints with symbols: , {json}, [array]')

      // Cleanup
      await prisma.gig.deleteMany({ where: { clientId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })
})
