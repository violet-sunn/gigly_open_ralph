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
 * reground-auth-to-design — two-phase onboarding (Auth.dc.html). registerUser (step 2 «Зарегистрироваться») creates
 * the account + session ONLY and returns `{ ok: true }` without redirecting; it does NOT persist any profile (that is
 * step-3's `updateProfile`). Confirm-password match and password validation are still enforced here.
 */
describe('registerUser — two-phase onboarding (account-only, no profile)', () => {
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

  it('creates a CLIENT account and returns { ok: true } without a profile', async () => {
    const email = `cli-${Date.now()}-${Math.random()}@example.com`
    emails.push(email)
    const fd = form({
      email,
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
      role: 'CLIENT',
    })
    const result = await registerUser(null, fd)
    expect(result).toEqual({ ok: true })

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email }, include: { clientProfile: true } })
    expect(user?.role).toBe('CLIENT')
    expect(user?.clientProfile).toBeNull()
  })

  it('creates a SPECIALIST account and returns { ok: true } without a profile', async () => {
    const email = `spec-${Date.now()}-${Math.random()}@example.com`
    emails.push(email)
    const fd = form({
      email,
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
      role: 'SPECIALIST',
    })
    const result = await registerUser(null, fd)
    expect(result).toEqual({ ok: true })

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email }, include: { specialistProfile: true } })
    expect(user?.role).toBe('SPECIALIST')
    expect(user?.specialistProfile).toBeNull()
  })

  it('does NOT persist profile fields even when present in the payload', async () => {
    // Profile setup is step-3's updateProfile; any profile fields posted to registerUser are ignored.
    const email = `noprofile-${Date.now()}-${Math.random()}@example.com`
    emails.push(email)
    const fd = form({
      email,
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
      role: 'CLIENT',
      companyName: 'ООО Ромашка',
      inn: '7700000001',
      contactPerson: 'Иван Петров',
    })
    const result = await registerUser(null, fd)
    expect(result).toEqual({ ok: true })

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email }, include: { clientProfile: true } })
    expect(user?.clientProfile).toBeNull()
  })

  it('rejects a confirm-password mismatch and creates no user', async () => {
    const email = `mismatch-${Date.now()}-${Math.random()}@example.com`
    emails.push(email)
    const fd = form({
      email,
      password: 'SecurePass123',
      confirmPassword: 'Different456',
      role: 'CLIENT',
    })
    const result = await registerUser(null, fd)
    expect(result).toEqual({ error: 'Пароли не совпадают.' })

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })

  it('still rejects a weak password (validation preserved)', async () => {
    const email = `weak-${Date.now()}-${Math.random()}@example.com`
    emails.push(email)
    const fd = form({ email, password: 'weak', confirmPassword: 'weak', role: 'CLIENT' })
    const result = await registerUser(null, fd)
    expect(result?.error).toBeTruthy()

    const prisma = getTestPrismaClient()
    expect(await prisma.user.findUnique({ where: { email } })).toBeNull()
  })
})
