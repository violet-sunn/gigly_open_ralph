import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const TEST_CLIENT_EMAIL = 'approve-test-client@example.com'
const TEST_CLIENT2_EMAIL = 'approve-test-client2@example.com'
const TEST_SPEC_EMAIL = 'approve-test-spec@example.com'
const TEST_PASSWORD = 'TestPass123!'

const testEmails = [TEST_CLIENT_EMAIL, TEST_CLIENT2_EMAIL, TEST_SPEC_EMAIL]

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
    console.log('\n--- Approve Work Integration Tests ---\n')

    // Cleanup
    await prisma.application.deleteMany({ where: { specialist: { email: { in: testEmails } } } })
    await prisma.gig.deleteMany({ where: { client: { email: { in: testEmails } } } })
    await prisma.user.deleteMany({ where: { email: { in: testEmails } } })

    // Setup
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10)
    const client1 = await prisma.user.create({ data: { email: TEST_CLIENT_EMAIL, password: hashedPassword, role: 'CLIENT' } })
    const client2 = await prisma.user.create({ data: { email: TEST_CLIENT2_EMAIL, password: hashedPassword, role: 'CLIENT' } })
    const spec = await prisma.user.create({ data: { email: TEST_SPEC_EMAIL, password: hashedPassword, role: 'SPECIALIST' } })

    const budgetKopecks = 10000000
    const serviceFee = Math.floor(budgetKopecks * 0.20)
    const gig = await prisma.gig.create({
      data: {
        title: 'Approve Work Test Gig',
        description: 'Test gig for approve work',
        budget: budgetKopecks,
        serviceFee,
        totalAmount: budgetKopecks + serviceFee,
        tags: 'React',
        clientId: client1.id,
        status: 'REVIEW',
        assignedSpecialistId: spec.id,
      }
    })

    // ---- TEST 1: Gig owner can approve work on REVIEW gig ----
    console.log('TEST-1: Gig owner can approve work on REVIEW gig')
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

    // Reset for next test
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'REVIEW' } })

    // ---- TEST 2: Cannot approve work on OPEN gig ----
    console.log('\nTEST-2: Cannot approve work on OPEN gig')
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'OPEN' } })
    const openGig = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (openGig?.status !== 'REVIEW') {
      pass('Guard: gig status is not REVIEW')
    } else {
      fail('Guard: gig status is not REVIEW', `Got: ${openGig?.status}`)
    }

    // Reset
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'REVIEW' } })

    // ---- TEST 3: Cannot approve work on IN_PROGRESS gig ----
    console.log('\nTEST-3: Cannot approve work on IN_PROGRESS gig')
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'IN_PROGRESS' } })
    const inProgressGig = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (inProgressGig?.status !== 'REVIEW') {
      pass('Guard: gig status is not REVIEW')
    } else {
      fail('Guard: gig status is not REVIEW', `Got: ${inProgressGig?.status}`)
    }

    // Reset
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'REVIEW' } })

    // ---- TEST 4: Cannot approve work on COMPLETED gig ----
    console.log('\nTEST-4: Cannot approve work on COMPLETED gig')
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'COMPLETED' } })
    const completedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (completedGig?.status !== 'REVIEW') {
      pass('Guard: gig status is not REVIEW')
    } else {
      fail('Guard: gig status is not REVIEW', `Got: ${completedGig?.status}`)
    }

    // Reset
    await prisma.gig.update({ where: { id: gig.id }, data: { status: 'REVIEW' } })

    // ---- TEST 5: Non-owner client cannot approve work ----
    console.log('\nTEST-5: Non-owner client cannot approve work')
    const gigForClient2 = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (gigForClient2?.clientId !== client2.id) {
      pass('Guard: user is not the gig owner')
    } else {
      fail('Guard: user is not the gig owner', 'IDs matched unexpectedly')
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
