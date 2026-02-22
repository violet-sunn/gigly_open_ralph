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

describe('Moderation Logging', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  it('creates log when suspending user', async () => {
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
    formData.append('reason', 'Spam activity detected')

    await withAuthContext(admin, async () => {
      try {
        await suspendUser(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Query ModerationLog
    const logs = await prisma.moderationLog.findMany({
      where: {
        action: 'SUSPEND_USER',
        adminId: admin.id,
        targetUserId: targetUser.id
      }
    })

    expect(logs.length).toBe(1)
    expect(logs[0].action).toBe('SUSPEND_USER')
    expect(logs[0].reason).toBe('Spam activity detected')
    expect(logs[0].adminId).toBe(admin.id)
    expect(logs[0].targetUserId).toBe(targetUser.id)
    expect(logs[0].targetGigId).toBeNull()
    expect(logs[0].createdAt).toBeInstanceOf(Date)

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('creates log when unsuspending user', async () => {
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
        role: 'SPECIALIST',
        suspended: true
      }
    })

    const formData = new FormData()
    formData.append('userId', targetUser.id)
    formData.append('reason', 'Appeal approved after review')

    await withAuthContext(admin, async () => {
      try {
        await unsuspendUser(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Query ModerationLog
    const logs = await prisma.moderationLog.findMany({
      where: {
        action: 'UNSUSPEND_USER',
        adminId: admin.id,
        targetUserId: targetUser.id
      }
    })

    expect(logs.length).toBe(1)
    expect(logs[0].action).toBe('UNSUSPEND_USER')
    expect(logs[0].reason).toBe('Appeal approved after review')
    expect(logs[0].adminId).toBe(admin.id)
    expect(logs[0].targetUserId).toBe(targetUser.id)
    expect(logs[0].targetGigId).toBeNull()

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('creates log when closing gig', async () => {
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
    formData.append('reason', 'Violates community guidelines')

    await withAuthContext(admin, async () => {
      try {
        await closeGig(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Query ModerationLog
    const logs = await prisma.moderationLog.findMany({
      where: {
        action: 'CLOSE_GIG',
        adminId: admin.id,
        targetGigId: gig.id
      }
    })

    expect(logs.length).toBe(1)
    expect(logs[0].action).toBe('CLOSE_GIG')
    expect(logs[0].reason).toBe('Violates community guidelines')
    expect(logs[0].adminId).toBe(admin.id)
    expect(logs[0].targetGigId).toBe(gig.id)
    expect(logs[0].targetUserId).toBeNull()

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('does not create log on failed action', async () => {
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
    formData.append('reason', '') // Empty reason - will fail validation

    await withAuthContext(admin, async () => {
      const result = await suspendUser(null, formData)
      expect(result.error).toBe('Reason is required for suspension.')
    })

    // Verify no ModerationLog entry was created
    const logs = await prisma.moderationLog.findMany({
      where: { adminId: admin.id }
    })
    expect(logs.length).toBe(0)

    // Cleanup
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('logs are immutable', async () => {
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

    // Suspend user (creates log1)
    const formData1 = new FormData()
    formData1.append('userId', targetUser.id)
    formData1.append('reason', 'Initial suspension')

    await withAuthContext(admin, async () => {
      try {
        await suspendUser(null, formData1)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    const log1 = await prisma.moderationLog.findFirst({
      where: { action: 'SUSPEND_USER', targetUserId: targetUser.id }
    })
    expect(log1).toBeDefined()
    const log1CreatedAt = log1!.createdAt

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10))

    // Unsuspend user (creates log2)
    const formData2 = new FormData()
    formData2.append('userId', targetUser.id)
    formData2.append('reason', 'Unsuspension after appeal')

    await withAuthContext(admin, async () => {
      try {
        await unsuspendUser(null, formData2)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Verify both logs exist unchanged
    const allLogs = await prisma.moderationLog.findMany({
      where: { adminId: admin.id, targetUserId: targetUser.id },
      orderBy: { createdAt: 'asc' }
    })

    expect(allLogs.length).toBe(2)
    expect(allLogs[0].action).toBe('SUSPEND_USER')
    expect(allLogs[0].reason).toBe('Initial suspension')
    expect(allLogs[0].createdAt).toEqual(log1CreatedAt) // Unchanged
    expect(allLogs[1].action).toBe('UNSUSPEND_USER')
    expect(allLogs[1].reason).toBe('Unsuspension after appeal')

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('can filter logs by action type', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN, users, and gig
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const user1 = await prisma.user.create({
      data: {
        email: `user1-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const user2 = await prisma.user.create({
      data: {
        email: `user2-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST',
        suspended: true
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
        clientId: user1.id,
        status: 'OPEN'
      }
    })

    // Create different types of logs
    await withAuthContext(admin, async () => {
      // Suspend user1
      const fd1 = new FormData()
      fd1.append('userId', user1.id)
      fd1.append('reason', 'Reason 1')
      try { await suspendUser(null, fd1) } catch {}

      // Unsuspend user2
      const fd2 = new FormData()
      fd2.append('userId', user2.id)
      fd2.append('reason', 'Reason 2')
      try { await unsuspendUser(null, fd2) } catch {}

      // Close gig
      const fd3 = new FormData()
      fd3.append('gigId', gig.id)
      fd3.append('reason', 'Reason 3')
      try { await closeGig(null, fd3) } catch {}
    })

    // Filter by SUSPEND_USER
    const suspendLogs = await prisma.moderationLog.findMany({
      where: { action: 'SUSPEND_USER', adminId: admin.id }
    })
    expect(suspendLogs.length).toBe(1)
    expect(suspendLogs[0].action).toBe('SUSPEND_USER')

    // Filter by UNSUSPEND_USER
    const unsuspendLogs = await prisma.moderationLog.findMany({
      where: { action: 'UNSUSPEND_USER', adminId: admin.id }
    })
    expect(unsuspendLogs.length).toBe(1)
    expect(unsuspendLogs[0].action).toBe('UNSUSPEND_USER')

    // Filter by CLOSE_GIG
    const closeLogs = await prisma.moderationLog.findMany({
      where: { action: 'CLOSE_GIG', adminId: admin.id }
    })
    expect(closeLogs.length).toBe(1)
    expect(closeLogs[0].action).toBe('CLOSE_GIG')

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: user2.id } })
    await prisma.user.delete({ where: { id: user1.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('can filter logs by target user', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN and multiple users
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const user1 = await prisma.user.create({
      data: {
        email: `user1-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const user2 = await prisma.user.create({
      data: {
        email: `user2-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    // Create logs for both users
    await withAuthContext(admin, async () => {
      // Suspend user1
      const fd1 = new FormData()
      fd1.append('userId', user1.id)
      fd1.append('reason', 'Reason for user1')
      try { await suspendUser(null, fd1) } catch {}

      // Suspend user2
      const fd2 = new FormData()
      fd2.append('userId', user2.id)
      fd2.append('reason', 'Reason for user2')
      try { await suspendUser(null, fd2) } catch {}
    })

    // Filter by user1
    const user1Logs = await prisma.moderationLog.findMany({
      where: { targetUserId: user1.id }
    })
    expect(user1Logs.length).toBe(1)
    expect(user1Logs[0].targetUserId).toBe(user1.id)
    expect(user1Logs[0].reason).toBe('Reason for user1')

    // Filter by user2
    const user2Logs = await prisma.moderationLog.findMany({
      where: { targetUserId: user2.id }
    })
    expect(user2Logs.length).toBe(1)
    expect(user2Logs[0].targetUserId).toBe(user2.id)
    expect(user2Logs[0].reason).toBe('Reason for user2')

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.user.delete({ where: { id: user2.id } })
    await prisma.user.delete({ where: { id: user1.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('can filter logs by target gig', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN, CLIENT, and multiple gigs
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

    const gig1 = await prisma.gig.create({
      data: {
        title: 'Gig 1',
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

    const gig2 = await prisma.gig.create({
      data: {
        title: 'Gig 2',
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'Python',
        clientId: client.id,
        status: 'OPEN'
      }
    })

    // Close both gigs
    await withAuthContext(admin, async () => {
      const fd1 = new FormData()
      fd1.append('gigId', gig1.id)
      fd1.append('reason', 'Reason for gig1')
      try { await closeGig(null, fd1) } catch {}

      const fd2 = new FormData()
      fd2.append('gigId', gig2.id)
      fd2.append('reason', 'Reason for gig2')
      try { await closeGig(null, fd2) } catch {}
    })

    // Filter by gig1
    const gig1Logs = await prisma.moderationLog.findMany({
      where: { targetGigId: gig1.id }
    })
    expect(gig1Logs.length).toBe(1)
    expect(gig1Logs[0].targetGigId).toBe(gig1.id)
    expect(gig1Logs[0].reason).toBe('Reason for gig1')

    // Filter by gig2
    const gig2Logs = await prisma.moderationLog.findMany({
      where: { targetGigId: gig2.id }
    })
    expect(gig2Logs.length).toBe(1)
    expect(gig2Logs[0].targetGigId).toBe(gig2.id)
    expect(gig2Logs[0].reason).toBe('Reason for gig2')

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.gig.delete({ where: { id: gig2.id } })
    await prisma.gig.delete({ where: { id: gig1.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('logs include relations', async () => {
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
    formData.append('reason', 'Test reason')

    await withAuthContext(admin, async () => {
      try {
        await suspendUser(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Query with relations
    const logs = await prisma.moderationLog.findMany({
      where: { adminId: admin.id },
      include: {
        admin: true,
        targetUser: true,
        targetGig: true
      }
    })

    expect(logs.length).toBe(1)
    expect(logs[0].admin).toBeDefined()
    expect(logs[0].admin.email).toBe(admin.email)
    expect(logs[0].admin.role).toBe('ADMIN')
    expect(logs[0].targetUser).toBeDefined()
    expect(logs[0].targetUser?.email).toBe(targetUser.email)
    expect(logs[0].targetGig).toBeNull()

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('logs are ordered by createdAt descending', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN and users
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const user1 = await prisma.user.create({
      data: {
        email: `user1-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const user2 = await prisma.user.create({
      data: {
        email: `user2-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    // Create logs with delays to ensure different timestamps
    await withAuthContext(admin, async () => {
      const fd1 = new FormData()
      fd1.append('userId', user1.id)
      fd1.append('reason', 'First action')
      try { await suspendUser(null, fd1) } catch {}

      await new Promise(resolve => setTimeout(resolve, 10))

      const fd2 = new FormData()
      fd2.append('userId', user2.id)
      fd2.append('reason', 'Second action')
      try { await suspendUser(null, fd2) } catch {}
    })

    // Query with DESC ordering
    const logs = await prisma.moderationLog.findMany({
      where: { adminId: admin.id },
      orderBy: { createdAt: 'desc' }
    })

    expect(logs.length).toBe(2)
    // Most recent first
    expect(logs[0].reason).toBe('Second action')
    expect(logs[1].reason).toBe('First action')
    expect(logs[0].createdAt.getTime()).toBeGreaterThan(logs[1].createdAt.getTime())

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.user.delete({ where: { id: user2.id } })
    await prisma.user.delete({ where: { id: user1.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })
})
