import { prisma } from '../lib/prisma'
import * as bcrypt from 'bcryptjs'

async function main() {
  console.log('🧪 Testing messaging across gig statuses...\n')

  // Cleanup previous test data
  console.log('🧹 Cleaning up previous test data...')
  await prisma.message.deleteMany({
    where: {
      gig: {
        title: { contains: '[TEST-MESSAGING]' }
      }
    }
  })
  await prisma.application.deleteMany({
    where: {
      gig: {
        title: { contains: '[TEST-MESSAGING]' }
      }
    }
  })
  await prisma.gig.deleteMany({
    where: {
      title: { contains: '[TEST-MESSAGING]' }
    }
  })
  await prisma.user.deleteMany({
    where: {
      email: { contains: 'test-messaging-' }
    }
  })

  // Create test users
  console.log('👤 Creating test users...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  const client = await prisma.user.create({
    data: {
      email: 'test-messaging-client@example.com',
      password: hashedPassword,
      role: 'CLIENT',
      clientProfile: {
        create: {
          companyName: 'Test Messaging Corp',
          inn: '1234567890',
        }
      }
    }
  })

  const specialist = await prisma.user.create({
    data: {
      email: 'test-messaging-specialist@example.com',
      password: hashedPassword,
      role: 'SPECIALIST',
      specialistProfile: {
        create: {
          displayName: 'Test Specialist',
          techStack: 'React, TypeScript',
          experienceLevel: 'Senior',
        }
      }
    }
  })

  const admin = await prisma.user.create({
    data: {
      email: 'test-messaging-admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    }
  })

  console.log('✅ Test users created\n')

  // Test 1: OPEN status (no specialist assigned)
  console.log('📝 Test 1: OPEN status (no specialist assigned)')
  const openGig = await prisma.gig.create({
    data: {
      title: '[TEST-MESSAGING] Open Gig',
      description: 'Test gig for messaging',
      budget: 10000000,
      serviceFee: 2000000,
      totalAmount: 12000000,
      status: 'OPEN',
      clientId: client.id,
    }
  })
  console.log('  ✅ OPEN gig created (no specialist assigned)')
  console.log('  ℹ️  Expected: Messaging unavailable, informational message shown\n')

  // Test 2: IN_PROGRESS status
  console.log('📝 Test 2: IN_PROGRESS status')
  const inProgressGig = await prisma.gig.create({
    data: {
      title: '[TEST-MESSAGING] In Progress Gig',
      description: 'Test gig for messaging',
      budget: 10000000,
      serviceFee: 2000000,
      totalAmount: 12000000,
      status: 'OPEN',
      clientId: client.id,
    }
  })

  const application = await prisma.application.create({
    data: {
      gigId: inProgressGig.id,
      specialistId: specialist.id,
      coverLetter: 'Test application',
      status: 'PENDING',
    }
  })

  await prisma.application.update({
    where: { id: application.id },
    data: { status: 'ACCEPTED' }
  })

  await prisma.gig.update({
    where: { id: inProgressGig.id },
    data: {
      status: 'IN_PROGRESS',
      assignedSpecialistId: specialist.id,
    }
  })

  const msg1 = await prisma.message.create({
    data: {
      gigId: inProgressGig.id,
      senderId: client.id,
      content: 'Test message from client in IN_PROGRESS',
    }
  })

  const msg2 = await prisma.message.create({
    data: {
      gigId: inProgressGig.id,
      senderId: specialist.id,
      content: 'Test message from specialist in IN_PROGRESS',
    }
  })

  console.log('  ✅ IN_PROGRESS gig created with 2 messages')
  console.log('  ℹ️  Expected: Full messaging available\n')

  // Test 3: REVIEW status
  console.log('📝 Test 3: REVIEW status')
  await prisma.gig.update({
    where: { id: inProgressGig.id },
    data: { status: 'REVIEW' }
  })

  const msg3 = await prisma.message.create({
    data: {
      gigId: inProgressGig.id,
      senderId: client.id,
      content: 'Test message from client in REVIEW',
    }
  })

  console.log('  ✅ Gig transitioned to REVIEW, message sent')
  console.log('  ℹ️  Expected: Messaging still works, all previous messages visible\n')

  // Test 4: COMPLETED status
  console.log('📝 Test 4: COMPLETED status')
  await prisma.gig.update({
    where: { id: inProgressGig.id },
    data: { status: 'COMPLETED' }
  })

  const msg4 = await prisma.message.create({
    data: {
      gigId: inProgressGig.id,
      senderId: specialist.id,
      content: 'Test message from specialist in COMPLETED',
    }
  })

  console.log('  ✅ Gig transitioned to COMPLETED, message sent')
  console.log('  ℹ️  Expected: Messaging still works for post-completion discussion\n')

  // Test 5: PAID status
  console.log('📝 Test 5: PAID status')
  await prisma.gig.update({
    where: { id: inProgressGig.id },
    data: {
      status: 'PAID',
      paidAt: new Date(),
    }
  })

  const msg5 = await prisma.message.create({
    data: {
      gigId: inProgressGig.id,
      senderId: client.id,
      content: 'Test message from client in PAID',
    }
  })

  console.log('  ✅ Gig transitioned to PAID, message sent')
  console.log('  ℹ️  Expected: Messaging still works for follow-up\n')

  // Test 6: Closed by admin
  console.log('📝 Test 6: Closed by admin')
  const closedGig = await prisma.gig.create({
    data: {
      title: '[TEST-MESSAGING] Closed Gig',
      description: 'Test gig for messaging',
      budget: 10000000,
      serviceFee: 2000000,
      totalAmount: 12000000,
      status: 'IN_PROGRESS',
      clientId: client.id,
      assignedSpecialistId: specialist.id,
      closedByAdmin: true,
      closedAt: new Date(),
    }
  })

  const msgBeforeClose = await prisma.message.create({
    data: {
      gigId: closedGig.id,
      senderId: client.id,
      content: 'Message sent before gig was closed',
    }
  })

  console.log('  ✅ Closed gig created with 1 message')
  console.log('  ℹ️  Expected: Existing messages visible, form hidden/disabled\n')

  // Verify message counts
  console.log('📊 Verification:')
  const messageCount = await prisma.message.count({
    where: {
      gig: {
        title: { contains: '[TEST-MESSAGING]' }
      }
    }
  })
  console.log(`  Total messages created: ${messageCount}`)
  console.log(`  Expected: 6 messages (2 in IN_PROGRESS, 1 in REVIEW, 1 in COMPLETED, 1 in PAID, 1 in closed gig)`)

  const gigCount = await prisma.gig.count({
    where: {
      title: { contains: '[TEST-MESSAGING]' }
    }
  })
  console.log(`  Total test gigs created: ${gigCount}`)
  console.log(`  Expected: 3 gigs (OPEN, lifecycle gig, closed gig)\n`)

  console.log('✅ Test data created successfully!')
  console.log('\n📋 Manual Testing Instructions:')
  console.log('1. Login as client: test-messaging-client@example.com / password123')
  console.log('2. Login as specialist: test-messaging-specialist@example.com / password123')
  console.log('3. Visit each test gig and verify messaging behavior:')
  console.log('   - OPEN gig: Should show "Messaging will be available once a specialist is assigned"')
  console.log('   - IN_PROGRESS/REVIEW/COMPLETED/PAID gig: Should show all messages with visual distinction')
  console.log('   - Closed gig: Should show messages but hide message form')
  console.log('4. Verify visual distinction:')
  console.log('   - Client messages: Left-aligned with blue accent')
  console.log('   - Specialist messages: Right-aligned with green accent')
  console.log('5. Try sending whitespace-only messages (should be blocked by browser validation)')
  console.log('\n🧹 Cleanup: Run this script with --cleanup flag to remove test data')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
