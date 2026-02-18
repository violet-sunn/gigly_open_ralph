import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

describe('User Registration', () => {
  beforeEach(async () => {
    // Clean up test users and their related records
    // Delete in order to respect foreign key constraints
    const testUsers = await prisma.user.findMany({
      where: { email: { contains: 'test@' } },
      select: { id: true }
    })

    const userIds = testUsers.map(u => u.id)

    if (userIds.length > 0) {
      // Delete related records first
      await prisma.message.deleteMany({ where: { senderId: { in: userIds } } })
      await prisma.application.deleteMany({ where: { specialistId: { in: userIds } } })
      await prisma.gig.deleteMany({ where: { clientId: { in: userIds } } })
      await prisma.moderationLog.deleteMany({ where: { adminId: { in: userIds } } })
      await prisma.clientProfile.deleteMany({ where: { userId: { in: userIds } } })
      await prisma.specialistProfile.deleteMany({ where: { userId: { in: userIds } } })
      // Finally delete users
      await prisma.user.deleteMany({ where: { id: { in: userIds } } })
    }
  })

  it('creates a new user with hashed password', async () => {
    const testUser = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      role: 'CLIENT' as const,
      companyName: 'Test Company',
      inn: '1234567890'
    }

    // Hash password (simulating registration logic)
    const hashedPassword = await bcrypt.hash(testUser.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: testUser.email,
        password: hashedPassword,
        role: testUser.role,
        clientProfile: {
          create: {
            companyName: testUser.companyName,
            inn: testUser.inn
          }
        }
      },
      include: {
        clientProfile: true
      }
    })

    // Assertions
    expect(user.email).toBe(testUser.email)
    expect(user.role).toBe('CLIENT')
    expect(user.password).not.toBe(testUser.password) // Password should be hashed
    expect(await bcrypt.compare(testUser.password, user.password)).toBe(true)
    expect(user.clientProfile?.companyName).toBe(testUser.companyName)
    expect(user.clientProfile?.inn).toBe(testUser.inn)
  })

  it('prevents duplicate email registration', async () => {
    const email = `test-duplicate-${Date.now()}@example.com`

    // Create first user
    await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash('password123', 10),
        role: 'SPECIALIST',
        specialistProfile: {
          create: {
            techStack: 'React, Node.js',
            experienceLevel: 'SENIOR'
          }
        }
      }
    })

    // Attempt to create duplicate
    await expect(
      prisma.user.create({
        data: {
          email,
          password: await bcrypt.hash('password456', 10),
          role: 'CLIENT',
          clientProfile: {
            create: {
              companyName: 'Another Company',
              inn: '9876543210'
            }
          }
        }
      })
    ).rejects.toThrow()
  })
})
