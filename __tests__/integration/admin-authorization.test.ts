import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { setTestSessionToken, getTestSessionToken, withAuthContext } from '../helpers/auth'

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
import { suspendUser, unsuspendUser, closeGig } from '@/app/actions/moderation'

describe('Admin Authorization Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  it('ADMIN can suspend users', async () => {
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
    formData.append('reason', 'Violation of terms of service')

    await withAuthContext(admin, async () => {
      try {
        await suspendUser(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT:/admin/users')
      }
    })

    // Verify user was suspended
    const suspendedUser = await prisma.user.findUnique({
      where: { id: targetUser.id }
    })
    expect(suspendedUser?.suspended).toBe(true)

    // Verify ModerationLog entry was created
    const logs = await prisma.moderationLog.findMany({
      where: {
        action: 'SUSPEND_USER',
        adminId: admin.id,
        targetUserId: targetUser.id
      }
    })
    expect(logs.length).toBe(1)
    expect(logs[0].reason).toBe('Violation of terms of service')

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('CLIENT cannot suspend users', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT and target user
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
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
    formData.append('reason', 'Some reason')

    await withAuthContext(client, async () => {
      const result = await suspendUser(null, formData)
      expect(result).toEqual({ error: 'Only admins can perform moderation actions.' })
    })

    // Verify user was NOT suspended
    const unchangedUser = await prisma.user.findUnique({
      where: { id: targetUser.id }
    })
    expect(unchangedUser?.suspended).toBe(false)

    // Cleanup
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: client.id } })
  })

  it('SPECIALIST cannot suspend users', async () => {
    const prisma = getTestPrismaClient()

    // Create SPECIALIST and target user
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
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
    formData.append('reason', 'Some reason')

    await withAuthContext(specialist, async () => {
      const result = await suspendUser(null, formData)
      expect(result).toEqual({ error: 'Only admins can perform moderation actions.' })
    })

    // Verify user was NOT suspended
    const unchangedUser = await prisma.user.findUnique({
      where: { id: targetUser.id }
    })
    expect(unchangedUser?.suspended).toBe(false)

    // Cleanup
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('ADMIN can close gigs', async () => {
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
    formData.append('reason', 'Inappropriate content')

    await withAuthContext(admin, async () => {
      try {
        await closeGig(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT:/admin/gigs')
      }
    })

    // Verify gig was closed
    const closedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(closedGig?.closedByAdmin).toBe(true)
    expect(closedGig?.closedAt).toBeDefined()

    // Verify ModerationLog entry was created
    const logs = await prisma.moderationLog.findMany({
      where: {
        action: 'CLOSE_GIG',
        adminId: admin.id,
        targetGigId: gig.id
      }
    })
    expect(logs.length).toBe(1)
    expect(logs[0].reason).toBe('Inappropriate content')

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('CLIENT cannot close other users\' gigs', async () => {
    const prisma = getTestPrismaClient()

    // Create two CLIENTs and a gig
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

    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: client1.id,
        status: 'OPEN'
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('reason', 'Some reason')

    // Try to close as non-admin
    await withAuthContext(client2, async () => {
      const result = await closeGig(null, formData)
      expect(result).toEqual({ error: 'Only admins can perform moderation actions.' })
    })

    // Verify gig was NOT closed
    const unchangedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(unchangedGig?.closedByAdmin).toBe(false)
    expect(unchangedGig?.closedAt).toBeNull()

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client1.id } })
    await prisma.user.delete({ where: { id: client2.id } })
  })

  it('ADMIN can unsuspend users', async () => {
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
    formData.append('reason', 'Appeal approved')

    await withAuthContext(admin, async () => {
      try {
        await unsuspendUser(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT:/admin/users')
      }
    })

    // Verify user was unsuspended
    const unsuspendedUser = await prisma.user.findUnique({
      where: { id: targetUser.id }
    })
    expect(unsuspendedUser?.suspended).toBe(false)

    // Verify ModerationLog entry was created
    const logs = await prisma.moderationLog.findMany({
      where: {
        action: 'UNSUSPEND_USER',
        adminId: admin.id,
        targetUserId: targetUser.id
      }
    })
    expect(logs.length).toBe(1)
    expect(logs[0].reason).toBe('Appeal approved')

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })
})
