import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { createTestUser, createTestGig, createTestApplication } from '../helpers/seed'

// Mock @/lib/prisma to use the test database (lazy getter)
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))

// Referenceable cookie `delete` spy (hoisted so the mock factory can use it) — for session-teardown assertions.
const { cookieDelete } = vi.hoisted(() => ({ cookieDelete: vi.fn() }))

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
    delete: cookieDelete,
  })),
}))

// Mock next/navigation redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

// Import after mocks
import { updatePreferences, deleteAccount } from '@/app/actions/settings'
import { getPreferences } from '@/lib/preferences'

describe('account-preferences — read/update', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('a new user has the default preferences (locale ru, all toggles on)', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'CLIENT' })
    const prefs = await getPreferences(user.id)
    expect(prefs).toEqual({
      locale: 'ru',
      notifyApplications: true,
      notifyStatusChanges: true,
      notifyMessages: true,
      // reconcile-settings — the prototype's «оплаты» notification + the ПРИВАТНОСТЬ toggles (default on)
      notifyPayments: true,
      showRatingInProfile: true,
      showOnlineStatus: true,
    })
  })

  it('updatePreferences updates supplied fields (partial-safe)', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'SPECIALIST' })
    const fd = new FormData()
    fd.set('locale', 'en')
    fd.set('notifyMessages', 'false')

    const r = await withAuthContext(user, async () => updatePreferences(null, fd))
    expect(r?.success).toBe(true)

    const prefs = await getPreferences(user.id)
    expect(prefs?.locale).toBe('en')
    expect(prefs?.notifyMessages).toBe(false)
    // fields not in the form are left unchanged
    expect(prefs?.notifyApplications).toBe(true)
    expect(prefs?.notifyStatusChanges).toBe(true)
  })

  it('rejects an invalid locale and leaves preferences unchanged', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'CLIENT' })
    const fd = new FormData()
    fd.set('locale', 'xx')

    const r = await withAuthContext(user, async () => updatePreferences(null, fd))
    expect(r?.error).toBeTruthy()
    expect((await getPreferences(user.id))?.locale).toBe('ru')
  })
})

describe('account-preferences — deleteAccount confirmation + teardown', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
    cookieDelete.mockClear()
  })
  afterEach(() => setTestSessionToken(undefined))

  it('rejects a wrong confirmation email and keeps the account', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'CLIENT' })
    const fd = new FormData()
    fd.set('confirmEmail', 'not-my-email@example.com')

    const r = await withAuthContext(user, async () => deleteAccount(null, fd))
    expect(r?.error).toBeTruthy()
    expect(await prisma.user.findUnique({ where: { id: user.id } })).not.toBeNull()
  })

  it('deletes the account with the correct confirmation and tears down the session', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'CLIENT' })
    const fd = new FormData()
    fd.set('confirmEmail', user.email)

    await withAuthContext(user, async () => {
      await expect(deleteAccount(null, fd)).rejects.toThrow('NEXT_REDIRECT')
    })

    expect(await prisma.user.findUnique({ where: { id: user.id } })).toBeNull()
    expect(cookieDelete).toHaveBeenCalledWith('session')
  })
})

describe('account-preferences — deleteAccount cascade', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('deletes the full footprint without FK errors and leaves unrelated data intact', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const otherSpec = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, {
      clientId: client.id,
      assignedSpecialistId: otherSpec.id,
      status: 'COMPLETED',
    })
    const app = await createTestApplication(prisma, {
      gigId: gig.id,
      specialistId: otherSpec.id,
      status: 'ACCEPTED',
    })
    await prisma.message.create({ data: { gigId: gig.id, senderId: client.id, content: 'hi' } })
    await prisma.review.create({
      data: { gigId: gig.id, authorId: client.id, targetId: otherSpec.id, rating: 5 },
    })
    await prisma.dispute.create({ data: { gigId: gig.id, openerId: client.id, reason: 'scope' } })
    await prisma.notification.create({ data: { userId: client.id, gigId: gig.id } })

    // an unrelated user with their own gig
    const unrelated = await createTestUser(prisma, { role: 'CLIENT' })
    const unrelatedGig = await createTestGig(prisma, { clientId: unrelated.id, status: 'OPEN' })

    const fd = new FormData()
    fd.set('confirmEmail', client.email)
    await withAuthContext(client, async () => {
      await expect(deleteAccount(null, fd)).rejects.toThrow('NEXT_REDIRECT')
    })

    // the user and their full footprint are gone
    expect(await prisma.user.findUnique({ where: { id: client.id } })).toBeNull()
    expect(await prisma.gig.findUnique({ where: { id: gig.id } })).toBeNull()
    expect(await prisma.application.findUnique({ where: { id: app.id } })).toBeNull()
    expect(await prisma.message.count({ where: { gigId: gig.id } })).toBe(0)
    expect(await prisma.review.count({ where: { gigId: gig.id } })).toBe(0)
    expect(await prisma.dispute.count({ where: { gigId: gig.id } })).toBe(0)
    expect(await prisma.notification.count({ where: { gigId: gig.id } })).toBe(0)

    // unrelated data survives
    expect(await prisma.user.findUnique({ where: { id: unrelated.id } })).not.toBeNull()
    expect(await prisma.gig.findUnique({ where: { id: unrelatedGig.id } })).not.toBeNull()
    // the assigned specialist (a separate user) survives
    expect(await prisma.user.findUnique({ where: { id: otherSpec.id } })).not.toBeNull()
  })

  it("unassigns (does not delete) others' gigs the user was assigned to", async () => {
    const prisma = getTestPrismaClient()
    const otherClient = await createTestUser(prisma, { role: 'CLIENT' })
    const spec = await createTestUser(prisma, { role: 'SPECIALIST' })
    const othersGig = await createTestGig(prisma, {
      clientId: otherClient.id,
      assignedSpecialistId: spec.id,
      status: 'IN_PROGRESS',
    })

    const fd = new FormData()
    fd.set('confirmEmail', spec.email)
    await withAuthContext(spec, async () => {
      await expect(deleteAccount(null, fd)).rejects.toThrow('NEXT_REDIRECT')
    })

    const survived = await prisma.gig.findUnique({ where: { id: othersGig.id } })
    expect(survived).not.toBeNull()
    expect(survived?.assignedSpecialistId).toBeNull()
    expect(await prisma.user.findUnique({ where: { id: spec.id } })).toBeNull()
    expect(await prisma.user.findUnique({ where: { id: otherClient.id } })).not.toBeNull()
  })
})
