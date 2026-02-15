import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const TEST_CLIENT_EMAIL = 'app-test-client@example.com'
const TEST_SPEC1_EMAIL = 'app-test-spec1@example.com'
const TEST_SPEC2_EMAIL = 'app-test-spec2@example.com'
const TEST_PASSWORD = 'TestPass123!'

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
    console.log('\n--- Gig Application Integration Tests ---\n')

    // Cleanup from previous runs
    const testEmails = [TEST_CLIENT_EMAIL, TEST_SPEC1_EMAIL, TEST_SPEC2_EMAIL]
    await prisma.application.deleteMany({
      where: { specialist: { email: { in: testEmails } } }
    })
    await prisma.gig.deleteMany({
      where: { client: { email: { in: testEmails } } }
    })
    await prisma.user.deleteMany({
      where: { email: { in: testEmails } }
    })

    // Setup: create test users
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10)
    const clientUser = await prisma.user.create({
      data: { email: TEST_CLIENT_EMAIL, password: hashedPassword, role: 'CLIENT' }
    })
    const spec1 = await prisma.user.create({
      data: { email: TEST_SPEC1_EMAIL, password: hashedPassword, role: 'SPECIALIST' }
    })
    const spec2 = await prisma.user.create({
      data: { email: TEST_SPEC2_EMAIL, password: hashedPassword, role: 'SPECIALIST' }
    })

    // Setup: create an OPEN gig
    const budgetKopecks = 10000000
    const serviceFee = Math.floor(budgetKopecks * 0.20)
    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig for Applications',
        description: 'A test gig',
        budget: budgetKopecks,
        serviceFee,
        totalAmount: budgetKopecks + serviceFee,
        tags: 'React, Node.js',
        clientId: clientUser.id,
      }
    })

    // Test 1: Create application from SPECIALIST-1
    console.log('Test 1: Create application from SPECIALIST-1')
    const app1 = await prisma.application.create({
      data: {
        gigId: gig.id,
        specialistId: spec1.id,
        coverLetter: 'I am a great fit for this gig.',
      }
    })

    if (app1.gigId === gig.id) {
      pass('Application gigId matches gig')
    } else {
      fail('Application gigId matches gig', `Got: ${app1.gigId}`)
    }

    if (app1.specialistId === spec1.id) {
      pass('Application specialistId matches specialist')
    } else {
      fail('Application specialistId matches specialist', `Got: ${app1.specialistId}`)
    }

    if (app1.coverLetter === 'I am a great fit for this gig.') {
      pass('Cover letter stored correctly')
    } else {
      fail('Cover letter stored correctly', `Got: ${app1.coverLetter}`)
    }

    // Test 2: Application status defaults to PENDING
    console.log('\nTest 2: Application status defaults to PENDING')
    if (app1.status === 'PENDING') {
      pass('Application status is PENDING')
    } else {
      fail('Application status is PENDING', `Got: ${app1.status}`)
    }

    // Test 3: Duplicate application prevented
    console.log('\nTest 3: Duplicate application prevented')
    let duplicateError = false
    try {
      await prisma.application.create({
        data: {
          gigId: gig.id,
          specialistId: spec1.id,
          coverLetter: 'Duplicate attempt',
        }
      })
    } catch {
      duplicateError = true
    }
    if (duplicateError) {
      pass('Duplicate application throws unique constraint error')
    } else {
      fail('Duplicate application throws unique constraint error', 'No error thrown')
    }

    // Test 4: Second specialist can apply
    console.log('\nTest 4: Second specialist applies')
    const app2 = await prisma.application.create({
      data: {
        gigId: gig.id,
        specialistId: spec2.id,
        coverLetter: '',
      }
    })

    if (app2.specialistId === spec2.id) {
      pass('SPECIALIST-2 application created')
    } else {
      fail('SPECIALIST-2 application created', `Got: ${app2.specialistId}`)
    }

    if (app2.coverLetter === '') {
      pass('Empty cover letter stored as empty string')
    } else {
      fail('Empty cover letter stored as empty string', `Got: ${app2.coverLetter}`)
    }

    // Test 5: Gig has 2 applications
    console.log('\nTest 5: Gig application count')
    const gigWithApps = await prisma.gig.findUnique({
      where: { id: gig.id },
      include: { applications: true },
    })
    if (gigWithApps && gigWithApps.applications.length === 2) {
      pass('Gig has 2 applications')
    } else {
      fail('Gig has 2 applications', `Got: ${gigWithApps?.applications.length}`)
    }

    // Test 6: _count works for applications
    console.log('\nTest 6: Gig _count for applications')
    const gigWithCount = await prisma.gig.findUnique({
      where: { id: gig.id },
      include: { _count: { select: { applications: true } } },
    })
    if (gigWithCount && gigWithCount._count.applications === 2) {
      pass('Gig _count.applications is 2')
    } else {
      fail('Gig _count.applications is 2', `Got: ${gigWithCount?._count.applications}`)
    }

    // Test 7: User applications relation
    console.log('\nTest 7: User applications relation')
    const spec1WithApps = await prisma.user.findUnique({
      where: { id: spec1.id },
      include: { applications: { include: { gig: { select: { title: true } } } } },
    })
    if (spec1WithApps && spec1WithApps.applications.length === 1) {
      pass('SPECIALIST-1 has 1 application')
    } else {
      fail('SPECIALIST-1 has 1 application', `Got: ${spec1WithApps?.applications.length}`)
    }

    if (spec1WithApps && spec1WithApps.applications[0].gig.title === 'Test Gig for Applications') {
      pass('Application includes gig title via relation')
    } else {
      fail('Application includes gig title via relation', `Got: ${spec1WithApps?.applications[0]?.gig?.title}`)
    }

    // Test 8: Non-OPEN gig excluded from OPEN query
    console.log('\nTest 8: Non-OPEN gig excluded from OPEN query')
    const closedGig = await prisma.gig.create({
      data: {
        title: 'Closed Gig',
        description: 'This gig is in progress',
        budget: 5000000,
        serviceFee: 1000000,
        totalAmount: 6000000,
        status: 'IN_PROGRESS',
        clientId: clientUser.id,
      }
    })

    const openGigs = await prisma.gig.findMany({
      where: { status: 'OPEN' },
    })
    const closedInOpen = openGigs.some((g) => g.id === closedGig.id)
    if (!closedInOpen) {
      pass('IN_PROGRESS gig excluded from OPEN query')
    } else {
      fail('IN_PROGRESS gig excluded from OPEN query', 'Found in results')
    }

    const openGigFound = openGigs.some((g) => g.id === gig.id)
    if (openGigFound) {
      pass('OPEN gig included in OPEN query')
    } else {
      fail('OPEN gig included in OPEN query', 'Not found in results')
    }

    // Cleanup
    await prisma.application.deleteMany({
      where: { specialist: { email: { in: testEmails } } }
    })
    await prisma.gig.deleteMany({
      where: { client: { email: { in: testEmails } } }
    })
    await prisma.user.deleteMany({
      where: { email: { in: testEmails } }
    })

    // Summary
    console.log(`\n--- Results: ${passed} passed, ${failed} failed ---\n`)
  } finally {
    await prisma.$disconnect()
  }

  if (failed > 0) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Test script crashed:', err)
  process.exit(1)
})
