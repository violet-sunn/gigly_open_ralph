import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { getTestSessionToken, setTestSessionToken } from '../helpers/auth'

vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))
vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({
    get: (name: string) => (name === 'x-forwarded-for' || name === 'x-real-ip' ? '127.0.0.1' : null),
  })),
  cookies: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'session') {
        const token = getTestSessionToken()
        return token ? { value: token } : undefined
      }
      return undefined
    },
    set: vi.fn(),
    delete: vi.fn(),
  })),
}))
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

import { registerUser } from '@/app/actions/auth'

/**
 * compose-auth-onboarding — registerUser additively persists the step-3 role-specific profile and enforces
 * confirm-password (both backward-compatible: single-step callers, sending neither, are unaffected).
 */
describe('registerUser — onboarding profile persistence + confirm-password', () => {
  const emails: string[] = []
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(async () => {
    const prisma = getTestPrismaClient()
    for (const email of emails) {
      try {
        await prisma.user.delete({ where: { email } })
      } catch {
        /* ignore */
      }
    }
    emails.length = 0
  })

  function form(fields: Record<string, string>) {
    const fd = new FormData()
    for (const [k, v] of Object.entries(fields)) fd.append(k, v)
    return fd
  }

  it('persists a CLIENT ClientProfile from the step-3 fields', async () => {
    const email = `cli-${Date.now()}-${Math.random()}@example.com`
    emails.push(email)
    const fd = form({
      email,
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
      role: 'CLIENT',
      companyName: 'ООО Ромашка',
      inn: '7700000001',
      contactPerson: 'Иван Петров',
      phoneNumber: '+7 900 000-00-00',
    })
    await expect(registerUser(null, fd)).rejects.toThrow('NEXT_REDIRECT:/dashboard')

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email }, include: { clientProfile: true } })
    expect(user?.role).toBe('CLIENT')
    expect(user?.clientProfile?.companyName).toBe('ООО Ромашка')
    expect(user?.clientProfile?.inn).toBe('7700000001')
    expect(user?.clientProfile?.contactPerson).toBe('Иван Петров')
  })

  it('persists a SPECIALIST SpecialistProfile with valid dropdown values', async () => {
    const email = `spec-${Date.now()}-${Math.random()}@example.com`
    emails.push(email)
    const fd = form({
      email,
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
      role: 'SPECIALIST',
      displayName: 'Анна Смирнова',
      position: 'Senior Frontend',
      techStack: 'React, TypeScript',
      specialization: 'Frontend',
      experienceLevel: 'SENIOR',
      timezone: 'Europe/Moscow',
    })
    await expect(registerUser(null, fd)).rejects.toThrow('NEXT_REDIRECT:/dashboard')

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email }, include: { specialistProfile: true } })
    expect(user?.role).toBe('SPECIALIST')
    expect(user?.specialistProfile?.displayName).toBe('Анна Смирнова')
    expect(user?.specialistProfile?.specialization).toBe('Frontend')
    expect(user?.specialistProfile?.experienceLevel).toBe('SENIOR')
    expect(user?.specialistProfile?.timezone).toBe('Europe/Moscow')
  })

  it('rejects a confirm-password mismatch and creates no user', async () => {
    const email = `mismatch-${Date.now()}-${Math.random()}@example.com`
    emails.push(email)
    const fd = form({
      email,
      password: 'SecurePass123',
      confirmPassword: 'Different456',
      role: 'CLIENT',
      companyName: 'ООО Тест',
      inn: '7700000002',
    })
    const result = await registerUser(null, fd)
    expect(result).toEqual({ error: 'Пароли не совпадают.' })

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })

  it('coerces an invalid dropdown value to empty (not persisted verbatim)', async () => {
    const email = `spec-bad-${Date.now()}-${Math.random()}@example.com`
    emails.push(email)
    const fd = form({
      email,
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
      role: 'SPECIALIST',
      displayName: 'Тест',
      specialization: 'NotAReal__Spec',
      experienceLevel: 'GURU',
      timezone: 'Mars/Olympus',
    })
    await expect(registerUser(null, fd)).rejects.toThrow('NEXT_REDIRECT:/dashboard')

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email }, include: { specialistProfile: true } })
    expect(user?.specialistProfile?.specialization).toBe('')
    expect(user?.specialistProfile?.experienceLevel).toBe('')
    expect(user?.specialistProfile?.timezone).toBe('')
  })

  it('still registers a single-step caller (no confirmPassword, no profile) — backward compatible', async () => {
    const email = `legacy-${Date.now()}-${Math.random()}@example.com`
    emails.push(email)
    const fd = form({ email, password: 'SecurePass123', role: 'CLIENT' })
    await expect(registerUser(null, fd)).rejects.toThrow('NEXT_REDIRECT:/dashboard')

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email }, include: { clientProfile: true } })
    expect(user?.role).toBe('CLIENT')
    expect(user?.clientProfile).toBeNull() // no profile fields supplied → no profile
  })

  it('still rejects a weak password (validation preserved)', async () => {
    const email = `weak-${Date.now()}-${Math.random()}@example.com`
    emails.push(email)
    const fd = form({ email, password: 'weak', confirmPassword: 'weak', role: 'CLIENT', companyName: 'X', inn: '1' })
    const result = await registerUser(null, fd)
    expect(result?.error).toBeTruthy()

    const prisma = getTestPrismaClient()
    expect(await prisma.user.findUnique({ where: { email } })).toBeNull()
  })
})
