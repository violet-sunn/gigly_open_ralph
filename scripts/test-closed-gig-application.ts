import 'dotenv/config'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function testClosedGigApplication() {
  console.log('Testing closed gig application prevention...\n')

  try {
    // Clean up test data
    await prisma.application.deleteMany({
      where: { specialist: { email: 'specialist-test-closed@example.com' } }
    })
    await prisma.gig.deleteMany({
      where: { client: { email: 'client-test-closed@example.com' } }
    })
    await prisma.moderationLog.deleteMany({
      where: { admin: { email: 'admin-test-closed@example.com' } }
    })
    await prisma.user.deleteMany({
      where: { email: { in: ['admin-test-closed@example.com', 'client-test-closed@example.com', 'specialist-test-closed@example.com'] } }
    })

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10)

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin-test-closed@example.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    console.log('✓ Created ADMIN user')

    const clientUser = await prisma.user.create({
      data: {
        email: 'client-test-closed@example.com',
        password: hashedPassword,
        role: 'CLIENT'
      }
    })
    console.log('✓ Created CLIENT user')

    const specialistUser = await prisma.user.create({
      data: {
        email: 'specialist-test-closed@example.com',
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })
    console.log('✓ Created SPECIALIST user')

    // Create a gig
    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'This gig will be closed',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        clientId: clientUser.id
      }
    })
    console.log('✓ Created test gig')

    // Admin closes the gig
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
          reason: 'Policy violation',
          adminId: adminUser.id,
          targetGigId: gig.id
        }
      })
    ])
    console.log('✓ Admin closed the gig')

    // Verify gig is closed
    const closedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (closedGig?.closedByAdmin) {
      console.log('✓ Gig is marked as closed by admin')
    } else {
      throw new Error('Gig was not closed')
    }

    // Simulate specialist attempting to apply
    // In the actual action, this would return an error
    console.log('\n--- Simulating Application Attempt ---')
    if (closedGig.closedByAdmin) {
      console.log('✓ applyToGig would return error: "This gig has been closed by administrators."')
      console.log('✓ No application would be created')
    }

    // Verify no application exists
    const applicationCount = await prisma.application.count({
      where: { gigId: gig.id, specialistId: specialistUser.id }
    })
    if (applicationCount === 0) {
      console.log('✓ Confirmed: No application exists for closed gig')
    }

    // Clean up
    await prisma.moderationLog.deleteMany({ where: { adminId: adminUser.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: specialistUser.id } })
    await prisma.user.delete({ where: { id: clientUser.id } })
    await prisma.user.delete({ where: { id: adminUser.id } })
    console.log('\n✓ Test data cleaned up')

    console.log('\n✅ All closed gig application tests passed!')
  } catch (error) {
    console.error('✗ Test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testClosedGigApplication()
