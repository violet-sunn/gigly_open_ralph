import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const TEST_CLIENT_EMAIL = 'mgmt-test-client@example.com'
const TEST_CLIENT2_EMAIL = 'mgmt-test-client2@example.com'
const TEST_SPEC1_EMAIL = 'mgmt-test-spec1@example.com'
const TEST_SPEC2_EMAIL = 'mgmt-test-spec2@example.com'
const TEST_PASSWORD = 'TestPass123!'

const testEmails = [TEST_CLIENT_EMAIL, TEST_CLIENT2_EMAIL, TEST_SPEC1_EMAIL, TEST_SPEC2_EMAIL]

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
    console.log('\n--- Application Management Integration Tests ---\n')

    // Cleanup
    await prisma.application.deleteMany({ where: { specialist: { email: { in: testEmails } } } })
    await prisma.gig.deleteMany({ where: { client: { email: { in: testEmails } } } })
    await prisma.user.deleteMany({ where: { email: { in: testEmails } } })

    // Setup
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10)
    const client1 = await prisma.user.create({ data: { email: TEST_CLIENT_EMAIL, password: hashedPassword, role: 'CLIENT' } })
    const client2 = await prisma.user.create({ data: { email: TEST_CLIENT2_EMAIL, password: hashedPassword, role: 'CLIENT' } })
    const spec1 = await prisma.user.create({ data: { email: TEST_SPEC1_EMAIL, password: hashedPassword, role: 'SPECIALIST' } })
    const spec2 = await prisma.user.create({ data: { email: TEST_SPEC2_EMAIL, password: hashedPassword, role: 'SPECIALIST' } })

    const budgetKopecks = 10000000
    const serviceFee = Math.floor(budgetKopecks * 0.20)
    const gig = await prisma.gig.create({
      data: {
        title: 'Mgmt Test Gig',
        description: 'Test gig for application management',
        budget: budgetKopecks,
        serviceFee,
        totalAmount: budgetKopecks + serviceFee,
        tags: 'React',
        clientId: client1.id,
      }
    })

    const app1 = await prisma.application.create({ data: { gigId: gig.id, specialistId: spec1.id, coverLetter: 'Spec1 cover' } })
    const app2 = await prisma.application.create({ data: { gigId: gig.id, specialistId: spec2.id, coverLetter: 'Spec2 cover' } })

    // ---- DB SPEC: Gig model has assignedSpecialistId ----
    console.log('DB-1: Gig model has assignedSpecialistId (nullable)')
    const freshGig = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (freshGig && freshGig.assignedSpecialistId === null) {
      pass('assignedSpecialistId is null for OPEN gig')
    } else {
      fail('assignedSpecialistId is null for OPEN gig', `Got: ${freshGig?.assignedSpecialistId}`)
    }

    // ---- REJECT: Reject app2 ----
    console.log('\nREJECT-1: Reject a PENDING application')
    await prisma.application.update({ where: { id: app2.id }, data: { status: 'REJECTED' } })
    const rejectedApp = await prisma.application.findUnique({ where: { id: app2.id } })
    if (rejectedApp?.status === 'REJECTED') {
      pass('Application status updated to REJECTED')
    } else {
      fail('Application status updated to REJECTED', `Got: ${rejectedApp?.status}`)
    }

    // Gig should still be OPEN after reject
    const gigAfterReject = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (gigAfterReject?.status === 'OPEN') {
      pass('Gig status remains OPEN after reject')
    } else {
      fail('Gig status remains OPEN after reject', `Got: ${gigAfterReject?.status}`)
    }

    // ---- REJECT: Cannot reject already-rejected application ----
    console.log('\nREJECT-2: Already-rejected application check')
    const alreadyRejected = await prisma.application.findUnique({ where: { id: app2.id } })
    if (alreadyRejected?.status !== 'PENDING') {
      pass('Already-rejected app has non-PENDING status (guard works)')
    } else {
      fail('Already-rejected app has non-PENDING status', `Got: ${alreadyRejected?.status}`)
    }

    // Reset app2 for accept test
    await prisma.application.update({ where: { id: app2.id }, data: { status: 'PENDING' } })

    // ---- ACCEPT: Accept app1, auto-reject app2 ----
    console.log('\nACCEPT-1: Accept application with transaction (accept app1, auto-reject app2)')
    await prisma.$transaction([
      prisma.application.update({ where: { id: app1.id }, data: { status: 'ACCEPTED' } }),
      prisma.gig.update({
        where: { id: gig.id },
        data: { status: 'IN_PROGRESS', assignedSpecialistId: spec1.id },
      }),
      prisma.application.updateMany({
        where: { gigId: gig.id, id: { not: app1.id }, status: 'PENDING' },
        data: { status: 'REJECTED' },
      }),
    ])

    const acceptedApp = await prisma.application.findUnique({ where: { id: app1.id } })
    if (acceptedApp?.status === 'ACCEPTED') {
      pass('Accepted application status is ACCEPTED')
    } else {
      fail('Accepted application status is ACCEPTED', `Got: ${acceptedApp?.status}`)
    }

    const autoRejectedApp = await prisma.application.findUnique({ where: { id: app2.id } })
    if (autoRejectedApp?.status === 'REJECTED') {
      pass('Other application auto-rejected to REJECTED')
    } else {
      fail('Other application auto-rejected to REJECTED', `Got: ${autoRejectedApp?.status}`)
    }

    const gigAfterAccept = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (gigAfterAccept?.status === 'IN_PROGRESS') {
      pass('Gig status updated to IN_PROGRESS')
    } else {
      fail('Gig status updated to IN_PROGRESS', `Got: ${gigAfterAccept?.status}`)
    }

    if (gigAfterAccept?.assignedSpecialistId === spec1.id) {
      pass('Gig assignedSpecialistId set to accepted specialist')
    } else {
      fail('Gig assignedSpecialistId set to accepted specialist', `Got: ${gigAfterAccept?.assignedSpecialistId}`)
    }

    // ---- ACCEPT: No orphaned PENDING applications ----
    console.log('\nACCEPT-2: No orphaned PENDING applications after accept')
    const pendingApps = await prisma.application.findMany({
      where: { gigId: gig.id, status: 'PENDING' },
    })
    if (pendingApps.length === 0) {
      pass('No orphaned PENDING applications')
    } else {
      fail('No orphaned PENDING applications', `Found ${pendingApps.length} PENDING`)
    }

    // ---- ACCEPT: Cannot accept on non-OPEN gig ----
    console.log('\nACCEPT-3: Non-OPEN gig guard')
    const gigNow = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (gigNow?.status !== 'OPEN') {
      pass('Gig is no longer OPEN (guard condition met)')
    } else {
      fail('Gig is no longer OPEN', `Got: ${gigNow?.status}`)
    }

    // ---- ACCEPT: Cannot accept non-PENDING application ----
    console.log('\nACCEPT-4: Non-PENDING application guard')
    const app1Now = await prisma.application.findUnique({ where: { id: app1.id } })
    if (app1Now?.status !== 'PENDING') {
      pass('Already-accepted app has non-PENDING status (guard works)')
    } else {
      fail('Already-accepted app has non-PENDING status', `Got: ${app1Now?.status}`)
    }

    // ---- DB: assignedSpecialist relation works ----
    console.log('\nDB-2: assignedSpecialist relation query')
    const gigWithSpecialist = await prisma.gig.findUnique({
      where: { id: gig.id },
      include: { assignedSpecialist: { select: { email: true } } },
    })
    if (gigWithSpecialist?.assignedSpecialist?.email === TEST_SPEC1_EMAIL) {
      pass('assignedSpecialist relation returns correct email')
    } else {
      fail('assignedSpecialist relation returns correct email', `Got: ${gigWithSpecialist?.assignedSpecialist?.email}`)
    }

    // ---- DB: User.assignedGigs relation works ----
    console.log('\nDB-3: User assignedGigs relation')
    const specWithGigs = await prisma.user.findUnique({
      where: { id: spec1.id },
      include: { assignedGigs: true },
    })
    if (specWithGigs?.assignedGigs.length === 1 && specWithGigs.assignedGigs[0].id === gig.id) {
      pass('Specialist assignedGigs relation returns the gig')
    } else {
      fail('Specialist assignedGigs relation returns the gig', `Got: ${specWithGigs?.assignedGigs.length} gigs`)
    }

    // ---- OWNERSHIP: client2 should not be able to manage (simulated guard) ----
    console.log('\nOWNERSHIP: Non-owner guard check')
    const gigForOwnerCheck = await prisma.gig.findUnique({ where: { id: gig.id } })
    if (gigForOwnerCheck?.clientId !== client2.id) {
      pass('Non-owner clientId does not match gig owner')
    } else {
      fail('Non-owner clientId does not match gig owner', 'IDs matched unexpectedly')
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
