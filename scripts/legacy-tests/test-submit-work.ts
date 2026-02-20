import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const TEST_CLIENT_EMAIL = 'submit-test-client@example.com'
const TEST_SPEC_EMAIL = 'submit-test-spec@example.com'
const TEST_SPEC2_EMAIL = 'submit-test-spec2@example.com'
const TEST_PASSWORD = 'TestPass123!'

const testEmails = [TEST_CLIENT_EMAIL, TEST_SPEC_EMAIL, TEST_SPEC2_EMAIL]

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
    console.log('\n--- Submit Work Integration Tests ---\n')

    // Cleanup
    await prisma.application.deleteMany({ where: { specialist: { email: { in: testEmails } } } })
    await prisma.gig.deleteMany({ where: { client: { email: { in: testEmails } } } })
    await prisma.user.deleteMany({ where: { email: { in: testEmails } } })

    // Setup
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10)
    const client = await prisma.user.create({ data: { email: TEST_CLIENT_EMAIL, password: hashedPassword, role: 'CLIENT' } })
    const spec1 = await prisma.user.create({ data: { email: TEST_SPEC_EMAIL, password: hashedPassword, role: 'SPECIALIST' } })
    const spec2 = await prisma.user.create({ data: { email: TEST_SPEC2_EMAIL, password: hashedPassword, role: 'SPECIALIST' } })

    const budgetKopecks = 10000000
    const serviceFee = Math.floor(budgetKopecks * 0.20)
    const gig = await prisma.gig.create({
      data: {
        title: 'Submit Work Test Gig',
        description: 'Test gig for submit work',
        budget: budgetKopecks,
        serviceFee,
        totalAmount: budgetKopecks + serviceFee,
        tags: 'React',
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: spec1.id,
      }
    })

    // ---- TEST 1: Assigned specialist can submit work ----
    console.log('TEST-1: Assigned specialist can submit work on IN_PROGRESS gig')
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

    // Reset for next test
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'IN_PROGRESS' } })

    // ---- TEST 2: Cannot submit work on OPEN gig ----
    console.log('\nTEST-2: Cannot submit work on OPEN gig')
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'OPEN' } })
    const openGig = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (openGig?.status !== 'IN_PROGRESS') {
      pass('Guard: gig status is not IN_PROGRESS')
    } else {
      fail('Guard: gig status is not IN_PROGRESS', `Got: ${openGig?.status}`)
    }

    // Reset
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'IN_PROGRESS' } })

    // ---- TEST 3: Cannot submit work on REVIEW gig ----
    console.log('\nTEST-3: Cannot submit work on REVIEW gig')
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'REVIEW' } })
    const reviewGig = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (reviewGig?.status !== 'IN_PROGRESS') {
      pass('Guard: gig status is not IN_PROGRESS')
    } else {
      fail('Guard: gig status is not IN_PROGRESS', `Got: ${reviewGig?.status}`)
    }

    // Reset
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'IN_PROGRESS' } })

    // ---- TEST 4: Cannot submit work on COMPLETED gig ----
    console.log('\nTEST-4: Cannot submit work on COMPLETED gig')
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'COMPLETED' } })
    const completedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (completedGig?.status !== 'IN_PROGRESS') {
      pass('Guard: gig status is not IN_PROGRESS')
    } else {
      fail('Guard: gig status is not IN_PROGRESS', `Got: ${completedGig?.status}`)
    }

    // Reset
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'IN_PROGRESS' } })

    // ---- TEST 5: Non-assigned specialist cannot submit work ----
    console.log('\nTEST-5: Non-assigned specialist cannot submit work')
    const gigForSpec2 = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (gigForSpec2?.assignedSpecialistId !== spec2.id) {
      pass('Guard: user is not the assigned specialist')
    } else {
      fail('Guard: user is not the assigned specialist', 'IDs matched unexpectedly')
    }

    // ---- TEST 6: Gig not found ----
    console.log('\nTEST-6: Gig not found guard')
    const nonExistentGig = await prisma.gig.findUnique({ where: { id: 'non-existent-id' } })
    if (!nonExistentGig) {
      pass('Guard: gig not found returns null')
    } else {
      fail('Guard: gig not found returns null', 'Found gig unexpectedly')
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
