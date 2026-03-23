import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'

// Mock @/lib/prisma to use test database
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
    set: vi.fn(),
    delete: vi.fn()
  }))
}))

// Mock next/navigation redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  })
}))

// Import after mocks
import { updateProfile } from '@/app/actions/profile'

describe('Profile Sanitization Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  describe('CLIENT Profile Sanitization', () => {
    it('sanitizes XSS in companyName', async () => {
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
      formData.append('companyName', '<script>alert("XSS")</script>Tech Corp')
      formData.append('inn', '1234567890')

      await withAuthContext(client, async () => {
        try {
          await updateProfile(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/profile')
        }
      })

      // Verify companyName is sanitized
      const profile = await prisma.clientProfile.findUnique({
        where: { userId: client.id }
      })
      expect(profile).not.toBeNull()
      expect(profile!.companyName).toBe('Tech Corp')
      expect(profile!.companyName).not.toContain('<script>')
      expect(profile!.companyName).not.toContain('alert')

      // Cleanup
      await prisma.clientProfile.delete({ where: { userId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('sanitizes XSS in inn field', async () => {
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
      formData.append('companyName', 'Tech Corp')
      formData.append('inn', '<img src=x onerror="alert(\'XSS\')">1234567890')

      await withAuthContext(client, async () => {
        try {
          await updateProfile(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/profile')
        }
      })

      // Verify inn is sanitized
      const profile = await prisma.clientProfile.findUnique({
        where: { userId: client.id }
      })
      expect(profile).not.toBeNull()
      expect(profile!.inn).toBe('1234567890')
      expect(profile!.inn).not.toContain('<img')
      expect(profile!.inn).not.toContain('onerror')

      // Cleanup
      await prisma.clientProfile.delete({ where: { userId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('rejects profile when companyName is only XSS (empty after sanitization)', async () => {
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
      formData.append('companyName', '<script></script>')
      formData.append('inn', '1234567890')

      const result = await withAuthContext(client, async () => {
        return await updateProfile(null, formData)
      })

      expect(result).toEqual({ error: 'Company name and INN are required. Please fill in these fields to complete your profile.' })

      // Verify no profile created
      const profile = await prisma.clientProfile.findUnique({
        where: { userId: client.id }
      })
      expect(profile).toBeNull()

      // Cleanup
      await prisma.user.delete({ where: { id: client.id } })
    })

    it('sanitizes XSS in contactPerson field', async () => {
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
      formData.append('companyName', 'Tech Corp')
      formData.append('inn', '1234567890')
      formData.append('contactPerson', '<svg onload="alert(\'XSS\')">John Doe</svg>')

      await withAuthContext(client, async () => {
        try {
          await updateProfile(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/profile')
        }
      })

      // Verify contactPerson is sanitized
      const profile = await prisma.clientProfile.findUnique({
        where: { userId: client.id }
      })
      expect(profile).not.toBeNull()
      expect(profile!.contactPerson).toBe('John Doe')
      expect(profile!.contactPerson).not.toContain('<svg')
      expect(profile!.contactPerson).not.toContain('onload')

      // Cleanup
      await prisma.clientProfile.delete({ where: { userId: client.id } })
      await prisma.user.delete({ where: { id: client.id } })
    })
  })

  describe('SPECIALIST Profile Sanitization', () => {
    it('sanitizes XSS in techStack', async () => {
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
      formData.append('displayName', 'John Developer')
      formData.append('techStack', '<script>alert("XSS")</script>React, TypeScript, Node.js')
      formData.append('experienceLevel', 'SENIOR')

      await withAuthContext(specialist, async () => {
        try {
          await updateProfile(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/profile')
        }
      })

      // Verify techStack is sanitized
      const profile = await prisma.specialistProfile.findUnique({
        where: { userId: specialist.id }
      })
      expect(profile).not.toBeNull()
      expect(profile!.techStack).toBe('React, TypeScript, Node.js')
      expect(profile!.techStack).not.toContain('<script>')
      expect(profile!.techStack).not.toContain('alert')

      // Cleanup
      await prisma.specialistProfile.delete({ where: { userId: specialist.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('sanitizes XSS in bio field', async () => {
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
      formData.append('displayName', 'John Developer')
      formData.append('techStack', 'React, TypeScript')
      formData.append('experienceLevel', 'SENIOR')
      formData.append('bio', '<img src=x onerror="alert(\'XSS\')">Senior developer with 10 years of experience')

      await withAuthContext(specialist, async () => {
        try {
          await updateProfile(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/profile')
        }
      })

      // Verify bio is sanitized
      const profile = await prisma.specialistProfile.findUnique({
        where: { userId: specialist.id }
      })
      expect(profile).not.toBeNull()
      expect(profile!.bio).toBe('Senior developer with 10 years of experience')
      expect(profile!.bio).not.toContain('<img')
      expect(profile!.bio).not.toContain('onerror')

      // Cleanup
      await prisma.specialistProfile.delete({ where: { userId: specialist.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('preserves line breaks in techStack', async () => {
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
      formData.append('displayName', 'John Developer')
      formData.append('techStack', 'Frontend:\nReact, TypeScript\n\nBackend:\nNode.js, PostgreSQL')
      formData.append('experienceLevel', 'SENIOR')

      await withAuthContext(specialist, async () => {
        try {
          await updateProfile(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/profile')
        }
      })

      // Verify line breaks preserved
      const profile = await prisma.specialistProfile.findUnique({
        where: { userId: specialist.id }
      })
      expect(profile).not.toBeNull()
      expect(profile!.techStack).toContain('\n')
      expect(profile!.techStack).toBe('Frontend:\nReact, TypeScript\n\nBackend:\nNode.js, PostgreSQL')

      // Cleanup
      await prisma.specialistProfile.delete({ where: { userId: specialist.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })

    it('sanitizes XSS in displayName', async () => {
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
      formData.append('displayName', '<a href="javascript:alert(\'XSS\')">John Developer</a>')
      formData.append('techStack', 'React, TypeScript')
      formData.append('experienceLevel', 'SENIOR')

      await withAuthContext(specialist, async () => {
        try {
          await updateProfile(null, formData)
        } catch (error: any) {
          expect(error.message).toContain('NEXT_REDIRECT:/profile')
        }
      })

      // Verify displayName is sanitized
      const profile = await prisma.specialistProfile.findUnique({
        where: { userId: specialist.id }
      })
      expect(profile).not.toBeNull()
      expect(profile!.displayName).toBe('John Developer')
      expect(profile!.displayName).not.toContain('<a')
      expect(profile!.displayName).not.toContain('javascript:')

      // Cleanup
      await prisma.specialistProfile.delete({ where: { userId: specialist.id } })
      await prisma.user.delete({ where: { id: specialist.id } })
    })
  })
})
