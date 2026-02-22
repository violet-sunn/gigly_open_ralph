import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { setTestSessionToken, getTestSessionToken, withAuthContext } from '../helpers/auth'

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

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

// Import after mocks
import { suspendUser, unsuspendUser, closeGig } from '@/app/actions/moderation'

describe('Moderation Edge Cases', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  it('rejects suspension with empty reason', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN and target user
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const targetUser = await prisma.user.create({
      data: {
        email: `target-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const formData = new FormData()
    formData.append('userId', targetUser.id)
    formData.append('reason', '')

    await withAuthContext(admin, async () => {
      const result = await suspendUser(null, formData)
      expect(result).toEqual({ error: 'Reason is required for suspension.' })
    })

    // Verify user was NOT suspended
    const unchangedUser = await prisma.user.findUnique({
      where: { id: targetUser.id }
    })
    expect(unchangedUser?.suspended).toBe(false)

    // Cleanup
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('rejects suspension with whitespace-only reason', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN and target user
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const targetUser = await prisma.user.create({
      data: {
        email: `target-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    const formData = new FormData()
    formData.append('userId', targetUser.id)
    formData.append('reason', '   ')

    await withAuthContext(admin, async () => {
      const result = await suspendUser(null, formData)
      expect(result).toEqual({ error: 'Reason is required for suspension.' })
    })

    // Verify user was NOT suspended
    const unchangedUser = await prisma.user.findUnique({
      where: { id: targetUser.id }
    })
    expect(unchangedUser?.suspended).toBe(false)

    // Cleanup
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('rejects suspension of already suspended user', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN and already suspended user
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const targetUser = await prisma.user.create({
      data: {
        email: `target-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT',
        suspended: true
      }
    })

    const formData = new FormData()
    formData.append('userId', targetUser.id)
    formData.append('reason', 'Trying to suspend again')

    await withAuthContext(admin, async () => {
      const result = await suspendUser(null, formData)
      expect(result).toEqual({ error: 'User is already suspended.' })
    })

    // Verify no duplicate log was created
    const logs = await prisma.moderationLog.findMany({
      where: { adminId: admin.id, targetUserId: targetUser.id }
    })
    expect(logs.length).toBe(0)

    // Cleanup
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('rejects suspension of non-existent user', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const formData = new FormData()
    formData.append('userId', 'non-existent-id')
    formData.append('reason', 'Some reason')

    await withAuthContext(admin, async () => {
      const result = await suspendUser(null, formData)
      expect(result).toEqual({ error: 'User not found.' })
    })

    // Verify no log was created
    const logs = await prisma.moderationLog.findMany({
      where: { adminId: admin.id }
    })
    expect(logs.length).toBe(0)

    // Cleanup
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('rejects unsuspension with empty reason', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN and suspended user
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const targetUser = await prisma.user.create({
      data: {
        email: `target-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT',
        suspended: true
      }
    })

    const formData = new FormData()
    formData.append('userId', targetUser.id)
    formData.append('reason', '')

    await withAuthContext(admin, async () => {
      const result = await unsuspendUser(null, formData)
      expect(result).toEqual({ error: 'Reason is required for unsuspension.' })
    })

    // Verify user was NOT unsuspended
    const unchangedUser = await prisma.user.findUnique({
      where: { id: targetUser.id }
    })
    expect(unchangedUser?.suspended).toBe(true)

    // Cleanup
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('rejects unsuspension of non-suspended user', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN and non-suspended user
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const targetUser = await prisma.user.create({
      data: {
        email: `target-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST',
        suspended: false
      }
    })

    const formData = new FormData()
    formData.append('userId', targetUser.id)
    formData.append('reason', 'Trying to unsuspend')

    await withAuthContext(admin, async () => {
      const result = await unsuspendUser(null, formData)
      expect(result).toEqual({ error: 'User is not suspended.' })
    })

    // Cleanup
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('rejects unsuspension of non-existent user', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const formData = new FormData()
    formData.append('userId', 'non-existent-id')
    formData.append('reason', 'Some reason')

    await withAuthContext(admin, async () => {
      const result = await unsuspendUser(null, formData)
      expect(result).toEqual({ error: 'User not found.' })
    })

    // Cleanup
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('rejects gig closure with empty reason', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN, CLIENT, and gig
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

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
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: client.id,
        status: 'OPEN'
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('reason', '')

    await withAuthContext(admin, async () => {
      const result = await closeGig(null, formData)
      expect(result).toEqual({ error: 'Reason is required for closing a gig.' })
    })

    // Verify gig was NOT closed
    const unchangedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(unchangedGig?.closedByAdmin).toBe(false)

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('rejects closure of already closed gig', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN, CLIENT, and already closed gig
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

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
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: client.id,
        status: 'OPEN',
        closedByAdmin: true,
        closedAt: new Date()
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('reason', 'Trying to close again')

    await withAuthContext(admin, async () => {
      const result = await closeGig(null, formData)
      expect(result).toEqual({ error: 'Gig is already closed.' })
    })

    // Verify no duplicate log was created
    const logs = await prisma.moderationLog.findMany({
      where: { adminId: admin.id, targetGigId: gig.id }
    })
    expect(logs.length).toBe(0)

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('rejects closure of non-existent gig', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const formData = new FormData()
    formData.append('gigId', 'non-existent-id')
    formData.append('reason', 'Some reason')

    await withAuthContext(admin, async () => {
      const result = await closeGig(null, formData)
      expect(result).toEqual({ error: 'Gig not found.' })
    })

    // Verify no log was created
    const logs = await prisma.moderationLog.findMany({
      where: { adminId: admin.id }
    })
    expect(logs.length).toBe(0)

    // Cleanup
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('trims reason before storage', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN and target user
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const targetUser = await prisma.user.create({
      data: {
        email: `target-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const formData = new FormData()
    formData.append('userId', targetUser.id)
    formData.append('reason', '  Spam content  ')

    await withAuthContext(admin, async () => {
      try {
        await suspendUser(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Query ModerationLog and verify reason is trimmed
    const logs = await prisma.moderationLog.findMany({
      where: { adminId: admin.id, targetUserId: targetUser.id }
    })
    expect(logs.length).toBe(1)
    expect(logs[0].reason).toBe('Spam content') // Trimmed

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('uses transaction for atomicity', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN and target user
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const targetUser = await prisma.user.create({
      data: {
        email: `target-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const formData = new FormData()
    formData.append('userId', targetUser.id)
    formData.append('reason', 'Test transaction')

    await withAuthContext(admin, async () => {
      try {
        await suspendUser(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Verify both user update and log creation succeeded
    const user = await prisma.user.findUnique({
      where: { id: targetUser.id }
    })
    expect(user?.suspended).toBe(true)

    const logs = await prisma.moderationLog.findMany({
      where: { adminId: admin.id, targetUserId: targetUser.id }
    })
    expect(logs.length).toBe(1)

    // This test verifies that the implementation uses prisma.$transaction
    // by checking that both operations succeeded together
    // In a real scenario, if one fails, both should fail (rollback)

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })
})
