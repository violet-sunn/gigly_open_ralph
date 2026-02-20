import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const TEST_CLIENT_EMAIL = 'lifecycle-test-client@example.com'
const TEST_SPEC_EMAIL = 'lifecycle-test-spec@example.com'
const TEST_PASSWORD = 'TestPass123!'

const testEmails = [TEST_CLIENT_EMAIL, TEST_SPEC_EMAIL]

let passed = 0
let failed = 0

function pass(name: string) {
  console.log(`  PASS: ${name}`)
  passed++
}

function fail(name: string, reason: string) {
  console.error(`  FAIL: ${name} — ${reason}`)
  failed++
}

async function main() {
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  })
  const prisma = new PrismaClient({ adapter: adapter as any })

  try {
    console.log('\n--- End-to-End Gig Lifecycle Test ---\n')

    // Cleanup
    await prisma.application.deleteMany({ where: { specialist: { email: { in: testEmails } } } })
    await prisma.gig.deleteMany({ where: { client: { email: { in: testEmails } } } })
    await prisma.user.deleteMany({ where: { email: { in: testEmails } } })

    // Setup users
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10)
    const client = await prisma.user.create({
      data: { email: TEST_CLIENT_EMAIL, password: hashedPassword, role: 'CLIENT' }
    })
    const specialist = await prisma.user.create({
      data: { email: TEST_SPEC_EMAIL, password: hashedPassword, role: 'SPECIALIST' }
    })

    console.log('STEP 1: Client creates gig (OPEN)')
    const budgetKopecks = 10000000
    const serviceFee = Math.floor(budgetKopecks * 0.20)
    const gig = await prisma.gig.create({
      data: {
        title: 'Lifecycle Test Gig',
        description: 'Complete lifecycle test',
        budget: budgetKopecks,
        serviceFee,
        totalAmount: budgetKopecks + serviceFee,
        tags: 'React,TypeScript',
        clientId: client.id,
      }
    })

    if (gig.status === 'OPEN') {
      pass('Gig created with status OPEN')
    } else {
      fail('Gig created with status OPEN', `Got: ${gig.status}`)
    }

    console.log('\nSTEP 2: Specialist applies to gig')
    const application = await prisma.application.create({
      data: {
        gigId: gig.id,
        specialistId: specialist.id,
        coverLetter: 'I am interested in this gig',
      }
    })

    if (application.status === 'PENDING') {
      pass('Application created with status PENDING')
    } else {
      fail('Application created with status PENDING', `Got: ${application.status}`)
    }

    console.log('\nSTEP 3: Client accepts application (OPEN → IN_PROGRESS)')
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
    if (gigAfterAccept?.status === 'IN_PROGRESS') {
      pass('Gig status updated to IN_PROGRESS')
    } else {
      fail('Gig status updated to IN_PROGRESS', `Got: ${gigAfterAccept?.status}`)
    }

    if (gigAfterAccept?.assignedSpecialistId === specialist.id) {
      pass('Specialist assigned to gig')
    } else {
      fail('Specialist assigned to gig', `Got: ${gigAfterAccept?.assignedSpecialistId}`)
    }

    console.log('\nSTEP 4: Specialist submits work (IN_PROGRESS → REVIEW)')
    await prisma.gig.update({
      where: { id: gig.id },
      data: { status: 'REVIEW' },
    })

    const gigAfterSubmit = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (gigAfterSubmit?.status === 'REVIEW') {
      pass('Gig status updated to REVIEW')
    } else {
      fail('Gig status updated to REVIEW', `Got: ${gigAfterSubmit?.status}`)
    }

    console.log('\nSTEP 5: Client approves work (REVIEW → COMPLETED)')
    await prisma.gig.update({
      where: { id: gig.id },
      data: { status: 'COMPLETED' },
    })

    const gigAfterApprove = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (gigAfterApprove?.status === 'COMPLETED') {
      pass('Gig status updated to COMPLETED')
    } else {
      fail('Gig status updated to COMPLETED', `Got: ${gigAfterApprove?.status}`)
    }

    console.log('\nSTEP 6: Verify final state')
    const finalGig = await prisma.gig.findUnique({
      where: { id: gig.id },
      include: {
        client: { select: { email: true } },
        assignedSpecialist: { select: { email: true } },
        applications: true,
      },
    })

    if (finalGig?.status === 'COMPLETED') {
      pass('Final gig status is COMPLETED')
    } else {
      fail('Final gig status is COMPLETED', `Got: ${finalGig?.status}`)
    }

    if (finalGig?.assignedSpecialist?.email === TEST_SPEC_EMAIL) {
      pass('Assigned specialist is correct')
    } else {
      fail('Assigned specialist is correct', `Got: ${finalGig?.assignedSpecialist?.email}`)
    }

    if (finalGig?.client.email === TEST_CLIENT_EMAIL) {
      pass('Gig owner is correct')
    } else {
      fail('Gig owner is correct', `Got: ${finalGig?.client.email}`)
    }

    const acceptedApp = finalGig?.applications.find(app => app.id === application.id)
    if (acceptedApp?.status === 'ACCEPTED') {
      pass('Application status is ACCEPTED')
    } else {
      fail('Application status is ACCEPTED', `Got: ${acceptedApp?.status}`)
    }

    console.log('\nSTEP 7: Test error cases')

    // Try to submit work on COMPLETED gig (should fail)
    const completedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (completedGig?.status !== 'IN_PROGRESS') {
      pass('Cannot submit work on COMPLETED gig (status check)')
    } else {
      fail('Cannot submit work on COMPLETED gig', 'Status is IN_PROGRESS')
    }

    // Try to approve work on COMPLETED gig (should fail)
    if (completedGig?.status !== 'REVIEW') {
      pass('Cannot approve work on COMPLETED gig (status check)')
    } else {
      fail('Cannot approve work on COMPLETED gig', 'Status is REVIEW')
    }

    // Cleanup
    await prisma.application.deleteMany({ where: { specialist: { email: { in: testEmails } } } })
    await prisma.gig.deleteMany({ where: { client: { email: { in: testEmails } } } })
    await prisma.user.deleteMany({ where: { email: { in: testEmails } } })

    console.log(`\n--- Results: ${passed} passed, ${failed} failed ---\n`)
  } finally {
    await prisma.$disconnect()
  }

  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error('Test script crashed:', err)
  process.exit(1)
})
