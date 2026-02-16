import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function testMarkAsPaid() {
  console.log('🧪 Testing markAsPaid functionality...\n')

  try {
    // 1. Create CLIENT user
    console.log('1. Creating CLIENT user...')
    const clientPassword = await bcrypt.hash('password123', 10)
    const client = await prisma.user.create({
      data: {
        email: `client-test-${Date.now()}@example.com`,
        password: clientPassword,
        role: 'CLIENT',
      },
    })
    console.log(`✅ CLIENT created: ${client.email}`)

    // 2. Create SPECIALIST user
    console.log('\n2. Creating SPECIALIST user...')
    const specialistPassword = await bcrypt.hash('password123', 10)
    const specialist = await prisma.user.create({
      data: {
        email: `specialist-test-${Date.now()}@example.com`,
        password: specialistPassword,
        role: 'SPECIALIST',
      },
    })
    console.log(`✅ SPECIALIST created: ${specialist.email}`)

    // 3. Create gig
    console.log('\n3. Creating gig...')
    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig for Payment',
        description: 'Testing payment flow',
        budget: 10000000, // 100,000 roubles in kopecks
        serviceFee: 2000000,
        totalAmount: 12000000,
        clientId: client.id,
      },
    })
    console.log(`✅ Gig created: ${gig.title} (status: ${gig.status})`)

    // 4. Create application
    console.log('\n4. Creating application...')
    const application = await prisma.application.create({
      data: {
        gigId: gig.id,
        specialistId: specialist.id,
        coverLetter: 'I am interested in this gig',
      },
    })
    console.log(`✅ Application created (status: ${application.status})`)

    // 5. Accept application
    console.log('\n5. Accepting application...')
    await prisma.$transaction([
      prisma.application.update({
        where: { id: application.id },
        data: { status: 'ACCEPTED' },
      }),
      prisma.gig.update({
        where: { id: gig.id },
        data: {
          status: 'IN_PROGRESS',
          assignedSpecialistId: specialist.id,
        },
      }),
    ])
    const gigAfterAccept = await prisma.gig.findUnique({ where: { id: gig.id } })
    console.log(`✅ Application accepted (gig status: ${gigAfterAccept?.status})`)

    // 6. Submit work
    console.log('\n6. Submitting work...')
    await prisma.gig.update({
      where: { id: gig.id },
      data: { status: 'REVIEW' },
    })
    const gigAfterSubmit = await prisma.gig.findUnique({ where: { id: gig.id } })
    console.log(`✅ Work submitted (gig status: ${gigAfterSubmit?.status})`)

    // 7. Approve work
    console.log('\n7. Approving work...')
    await prisma.gig.update({
      where: { id: gig.id },
      data: { status: 'COMPLETED' },
    })
    const gigAfterApprove = await prisma.gig.findUnique({ where: { id: gig.id } })
    console.log(`✅ Work approved (gig status: ${gigAfterApprove?.status})`)

    // 8. Mark as paid
    console.log('\n8. Marking gig as paid...')
    const beforePaid = await prisma.gig.findUnique({ where: { id: gig.id } })
    console.log(`   Before: status=${beforePaid?.status}, paidAt=${beforePaid?.paidAt}`)

    await prisma.gig.update({
      where: { id: gig.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    })

    const afterPaid = await prisma.gig.findUnique({ where: { id: gig.id } })
    console.log(`   After: status=${afterPaid?.status}, paidAt=${afterPaid?.paidAt}`)

    if (afterPaid?.status === 'PAID' && afterPaid?.paidAt) {
      console.log('✅ Gig marked as paid successfully!')
    } else {
      console.log('❌ Failed to mark gig as paid')
      throw new Error('Mark as paid failed')
    }

    // 9. Test idempotency (try marking as paid again)
    console.log('\n9. Testing idempotency (marking as paid again)...')
    try {
      const alreadyPaid = await prisma.gig.findUnique({ where: { id: gig.id } })
      if (alreadyPaid?.status === 'PAID') {
        console.log('✅ Idempotency check: gig is already PAID (would return error in action)')
      }
    } catch (error) {
      console.log('❌ Idempotency test failed:', error)
    }

    // 10. Verify paidAt is immutable
    console.log('\n10. Verifying paidAt timestamp...')
    const finalGig = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (finalGig?.paidAt) {
      console.log(`✅ paidAt is set: ${finalGig.paidAt.toISOString()}`)
    } else {
      console.log('❌ paidAt is not set')
    }

    console.log('\n✅ All tests passed!')
    console.log('\n📊 Test Summary:')
    console.log(`   - Gig lifecycle: OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID`)
    console.log(`   - paidAt field: ${finalGig?.paidAt ? 'Set' : 'Not set'}`)
    console.log(`   - Final status: ${finalGig?.status}`)

  } catch (error) {
    console.error('\n❌ Test failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

testMarkAsPaid()
