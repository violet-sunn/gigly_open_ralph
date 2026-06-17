import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { createTestUser, createTestGig } from '../helpers/seed'

// Mock @/lib/prisma to use the test database (lazy getter)
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
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
    delete: vi.fn(),
  })),
}))

// Mock next/navigation redirect (throws so tests can detect it)
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

// Import after mocks
import { leaveReview } from '@/app/actions/review'
import { getRatingForUser } from '@/lib/reviews'

function reviewForm(gigId: string, rating: number | string, comment?: string) {
  const fd = new FormData()
  fd.set('gigId', gigId)
  fd.set('rating', String(rating))
  if (comment !== undefined) fd.set('comment', comment)
  return fd
}

describe('Reviews — leaveReview', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('lets a client review the specialist after COMPLETED (target = specialist)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: specialist.id, status: 'COMPLETED' })

    await withAuthContext(client, async () => {
      await expect(leaveReview(null, reviewForm(gig.id, 5, 'Отличная работа'))).rejects.toThrow('NEXT_REDIRECT')
    })

    const review = await prisma.review.findUnique({ where: { gigId_authorId: { gigId: gig.id, authorId: client.id } } })
    expect(review).toBeTruthy()
    expect(review!.rating).toBe(5)
    expect(review!.targetId).toBe(specialist.id)
    expect(review!.comment).toContain('Отличная работа')
  })

  it('lets the specialist review the client after PAID (target = client)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: specialist.id, status: 'PAID' })

    await withAuthContext(specialist, async () => {
      await expect(leaveReview(null, reviewForm(gig.id, 4))).rejects.toThrow('NEXT_REDIRECT')
    })

    const review = await prisma.review.findUnique({ where: { gigId_authorId: { gigId: gig.id, authorId: specialist.id } } })
    expect(review!.targetId).toBe(client.id)
    expect(review!.rating).toBe(4)
  })

  it('allows both parties to review the same gig (two reviews)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: specialist.id, status: 'COMPLETED' })

    await withAuthContext(client, async () => { await expect(leaveReview(null, reviewForm(gig.id, 5))).rejects.toThrow('NEXT_REDIRECT') })
    await withAuthContext(specialist, async () => { await expect(leaveReview(null, reviewForm(gig.id, 4))).rejects.toThrow('NEXT_REDIRECT') })

    const count = await prisma.review.count({ where: { gigId: gig.id } })
    expect(count).toBe(2)
  })

  it('blocks a review before completion (OPEN / IN_PROGRESS / REVIEW)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    for (const status of ['OPEN', 'IN_PROGRESS', 'REVIEW']) {
      const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: specialist.id, status })
      const result = await withAuthContext(client, async () => leaveReview(null, reviewForm(gig.id, 5)))
      expect(result?.error).toBeTruthy()
      expect(await prisma.review.count({ where: { gigId: gig.id } })).toBe(0)
    }
  })

  it('rejects a non-party', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const outsider = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: specialist.id, status: 'COMPLETED' })

    const result = await withAuthContext(outsider, async () => leaveReview(null, reviewForm(gig.id, 5)))
    expect(result?.error).toBeTruthy()
    expect(await prisma.review.count({ where: { gigId: gig.id } })).toBe(0)
  })

  it('validates the rating is an integer 1–5', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: specialist.id, status: 'COMPLETED' })

    for (const bad of [0, 6, -1, 'abc', 3.5]) {
      const result = await withAuthContext(client, async () => leaveReview(null, reviewForm(gig.id, bad)))
      expect(result?.error, `rating ${bad} should be rejected`).toBeTruthy()
    }
    expect(await prisma.review.count({ where: { gigId: gig.id } })).toBe(0)
  })

  it('rejects a duplicate review by the same author for the same gig', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: specialist.id, status: 'COMPLETED' })

    await withAuthContext(client, async () => { await expect(leaveReview(null, reviewForm(gig.id, 5))).rejects.toThrow('NEXT_REDIRECT') })
    const result = await withAuthContext(client, async () => leaveReview(null, reviewForm(gig.id, 3)))
    expect(result?.error).toBeTruthy()
    expect(await prisma.review.count({ where: { gigId: gig.id } })).toBe(1)
  })

  it('sanitizes the comment (strips HTML)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: specialist.id, status: 'COMPLETED' })

    await withAuthContext(client, async () => {
      await expect(leaveReview(null, reviewForm(gig.id, 5, '<script>alert(1)</script>Молодец'))).rejects.toThrow('NEXT_REDIRECT')
    })
    const review = await prisma.review.findUnique({ where: { gigId_authorId: { gigId: gig.id, authorId: client.id } } })
    expect(review!.comment).not.toContain('<script>')
    expect(review!.comment).toContain('Молодец')
  })

  it('redirects an unauthenticated caller to /login', async () => {
    const prisma = getTestPrismaClient()
    const gig = await createTestGig(prisma, { status: 'COMPLETED' })
    setTestSessionToken(undefined)
    await expect(leaveReview(null, reviewForm(gig.id, 5))).rejects.toThrow('NEXT_REDIRECT:/login')
  })

  it('errors when the gig does not exist', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })
    const result = await withAuthContext(client, async () => leaveReview(null, reviewForm('does-not-exist', 5)))
    expect(result?.error).toBeTruthy()
  })
})

describe('Reviews — getRatingForUser aggregate (RatingVM contract)', () => {
  beforeEach(() => setTestSessionToken(undefined))

  it('returns exactly { value, count, verified } matching the contract', async () => {
    const prisma = getTestPrismaClient()
    const target = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gigA = await createTestGig(prisma, { status: 'COMPLETED' })
    const gigB = await createTestGig(prisma, { status: 'PAID' })
    const a1 = await createTestUser(prisma, { role: 'CLIENT' })
    const a2 = await createTestUser(prisma, { role: 'CLIENT' })
    await prisma.review.create({ data: { gigId: gigA.id, authorId: a1.id, targetId: target.id, rating: 5 } })
    await prisma.review.create({ data: { gigId: gigB.id, authorId: a2.id, targetId: target.id, rating: 4 } })

    const rating = await getRatingForUser(target.id)
    expect(rating.value).toBe(4.5)
    expect(rating.count).toBe(2)
    expect(rating.verified).toBe(true)
    expect(Object.keys(rating).sort()).toEqual(['count', 'value', 'verified'])
  })

  it('returns zeros for a user with no reviews', async () => {
    const prisma = getTestPrismaClient()
    const target = await createTestUser(prisma, { role: 'SPECIALIST' })
    const rating = await getRatingForUser(target.id)
    expect(rating).toEqual({ value: 0, count: 0, verified: false })
  })
})
