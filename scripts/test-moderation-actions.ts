import 'dotenv/config'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function testModerationActions() {
  console.log('Testing moderation actions...\n')

  try {
    // Clean up test data
    await prisma.moderationLog.deleteMany({
      where: {
        admin: { email: { in: ['admin-test@example.com', 'client-test-mod@example.com'] } }
      }
    })
    await prisma.user.deleteMany({
      where: { email: { in: ['admin-test@example.com', 'client-test-mod@example.com'] } }
    })
    await prisma.gig.deleteMany({
      where: { client: { email: 'client-test-mod@example.com' } }
    })

    // Create ADMIN user
    const hashedPassword = await bcrypt.hash('password123', 10)
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin-test@example.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    console.log('✓ Created ADMIN user:', adminUser.email)

    // Create CLIENT user
    const clientUser = await prisma.user.create({
      data: {
        email: 'client-test-mod@example.com',
        password: hashedPassword,
        role: 'CLIENT'
      }
    })
    console.log('✓ Created CLIENT user:', clientUser.email)

    // Test 1: Suspend user
    console.log('\n--- Test 1: Suspend User ---')
    await prisma.$transaction([
      prisma.user.update({
        where: { id: clientUser.id },
        data: { suspended: true }
      }),
      prisma.moderationLog.create({
        data: {
          action: 'SUSPEND_USER',
          reason: 'Test suspension',
          adminId: adminUser.id,
          targetUserId: clientUser.id
        }
      })
    ])

    const suspendedUser = await prisma.user.findUnique({ where: { id: clientUser.id } })
    if (suspendedUser?.suspended) {
      console.log('✓ User suspended successfully')
    } else {
      throw new Error('User was not suspended')
    }

    const suspendLog = await prisma.moderationLog.findFirst({
      where: { action: 'SUSPEND_USER', targetUserId: clientUser.id }
    })
    if (suspendLog) {
      console.log('✓ ModerationLog created for suspension')
      console.log('  - Action:', suspendLog.action)
      console.log('  - Reason:', suspendLog.reason)
    } else {
      throw new Error('ModerationLog not created')
    }

    // Test 2: Unsuspend user
    console.log('\n--- Test 2: Unsuspend User ---')
    await prisma.$transaction([
      prisma.user.update({
        where: { id: clientUser.id },
        data: { suspended: false }
      }),
      prisma.moderationLog.create({
        data: {
          action: 'UNSUSPEND_USER',
          reason: 'Test unsuspension',
          adminId: adminUser.id,
          targetUserId: clientUser.id
        }
      })
    ])

    const unsuspendedUser = await prisma.user.findUnique({ where: { id: clientUser.id } })
    if (!unsuspendedUser?.suspended) {
      console.log('✓ User unsuspended successfully')
    } else {
      throw new Error('User was not unsuspended')
    }

    const unsuspendLog = await prisma.moderationLog.findFirst({
      where: { action: 'UNSUSPEND_USER', targetUserId: clientUser.id }
    })
    if (unsuspendLog) {
      console.log('✓ ModerationLog created for unsuspension')
    } else {
      throw new Error('ModerationLog not created')
    }

    // Test 3: Close gig
    console.log('\n--- Test 3: Close Gig ---')
    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig for Closure',
        description: 'This gig will be closed by admin',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        clientId: clientUser.id
      }
    })
    console.log('✓ Created test gig:', gig.title)

    await prisma.$transaction([
      prisma.gig.update({
        where: { id: gig.id },
        data: {
          closedByAdmin: true,
          closedAt: new Date()
        }
      }),
      prisma.moderationLog.create({
        data: {
          action: 'CLOSE_GIG',
          reason: 'Test gig closure',
          adminId: adminUser.id,
          targetGigId: gig.id
        }
      })
    ])

    const closedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (closedGig?.closedByAdmin && closedGig.closedAt) {
      console.log('✓ Gig closed successfully')
      console.log('  - closedByAdmin:', closedGig.closedByAdmin)
      console.log('  - closedAt:', closedGig.closedAt)
    } else {
      throw new Error('Gig was not closed')
    }

    const closeLog = await prisma.moderationLog.findFirst({
      where: { action: 'CLOSE_GIG', targetGigId: gig.id }
    })
    if (closeLog) {
      console.log('✓ ModerationLog created for gig closure')
    } else {
      throw new Error('ModerationLog not created')
    }

    // Clean up
    await prisma.moderationLog.deleteMany({
      where: { adminId: adminUser.id }
    })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: clientUser.id } })
    await prisma.user.delete({ where: { id: adminUser.id } })
    console.log('\n✓ Test data cleaned up')

    console.log('\n✅ All moderation action tests passed!')
  } catch (error) {
    console.error('✗ Test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testModerationActions()
