import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const TEST_EMAIL_CLIENT = 'gig-test-client@example.com'
const TEST_EMAIL_SPECIALIST = 'gig-test-specialist@example.com'
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
    console.log('\n--- Gig Creation Integration Tests ---\n')

    // Cleanup from previous runs
    await prisma.gig.deleteMany({
      where: { client: { email: { in: [TEST_EMAIL_CLIENT, TEST_EMAIL_SPECIALIST] } } }
    })
    await prisma.user.deleteMany({
      where: { email: { in: [TEST_EMAIL_CLIENT, TEST_EMAIL_SPECIALIST] } }
    })

    // Setup: create test users
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10)
    const clientUser = await prisma.user.create({
      data: { email: TEST_EMAIL_CLIENT, password: hashedPassword, role: 'CLIENT' }
    })
    const specUser = await prisma.user.create({
      data: { email: TEST_EMAIL_SPECIALIST, password: hashedPassword, role: 'SPECIALIST' }
    })

    // Test 1: Fee calculation — 100,000 ₽
    console.log('Test 1: Fee calculation for 100,000 ₽ budget')
    const budget1 = 100000
    const budgetKopecks1 = budget1 * 100 // 10,000,000
    const fee1 = Math.floor(budgetKopecks1 * 0.20) // 2,000,000
    const total1 = budgetKopecks1 + fee1 // 12,000,000

    if (budgetKopecks1 === 10000000) {
      pass('Budget 100,000₽ = 10,000,000 kopecks')
    } else {
      fail('Budget 100,000₽ = 10,000,000 kopecks', `Got: ${budgetKopecks1}`)
    }

    if (fee1 === 2000000) {
      pass('Service fee = 2,000,000 kopecks (20,000₽)')
    } else {
      fail('Service fee = 2,000,000 kopecks', `Got: ${fee1}`)
    }

    if (total1 === 12000000) {
      pass('Total = 12,000,000 kopecks (120,000₽)')
    } else {
      fail('Total = 12,000,000 kopecks', `Got: ${total1}`)
    }

    // Test 2: Fee calculation with rounding — 333 ₽
    console.log('\nTest 2: Fee calculation for 333 ₽ budget (rounding)')
    const budget2 = 333
    const budgetKopecks2 = budget2 * 100 // 33,300
    const fee2 = Math.floor(budgetKopecks2 * 0.20) // 6,660
    const total2 = budgetKopecks2 + fee2 // 39,960

    if (fee2 === 6660) {
      pass('Service fee for 333₽ = 6,660 kopecks')
    } else {
      fail('Service fee for 333₽ = 6,660 kopecks', `Got: ${fee2}`)
    }

    if (total2 === 39960) {
      pass('Total for 333₽ = 39,960 kopecks')
    } else {
      fail('Total for 333₽ = 39,960 kopecks', `Got: ${total2}`)
    }

    // Test 3: Create gig via Prisma and verify fields
    console.log('\nTest 3: Create gig and verify all fields')
    const gig = await prisma.gig.create({
      data: {
        title: 'Build a React dashboard',
        description: 'Full-stack dashboard with charts and auth',
        budget: budgetKopecks1,
        serviceFee: fee1,
        totalAmount: total1,
        tags: 'React, TypeScript',
        clientId: clientUser.id,
      }
    })

    if (gig.title === 'Build a React dashboard') {
      pass('Gig title stored correctly')
    } else {
      fail('Gig title stored correctly', `Got: ${gig.title}`)
    }

    if (gig.description === 'Full-stack dashboard with charts and auth') {
      pass('Gig description stored correctly')
    } else {
      fail('Gig description stored correctly', `Got: ${gig.description}`)
    }

    if (gig.budget === 10000000) {
      pass('Gig budget stored in kopecks')
    } else {
      fail('Gig budget stored in kopecks', `Got: ${gig.budget}`)
    }

    if (gig.serviceFee === 2000000) {
      pass('Gig serviceFee stored correctly')
    } else {
      fail('Gig serviceFee stored correctly', `Got: ${gig.serviceFee}`)
    }

    if (gig.totalAmount === 12000000) {
      pass('Gig totalAmount stored correctly')
    } else {
      fail('Gig totalAmount stored correctly', `Got: ${gig.totalAmount}`)
    }

    if (gig.tags === 'React, TypeScript') {
      pass('Gig tags stored correctly')
    } else {
      fail('Gig tags stored correctly', `Got: ${gig.tags}`)
    }

    // Test 4: Gig linked to client user
    console.log('\nTest 4: Gig is linked to client user')
    if (gig.clientId === clientUser.id) {
      pass('Gig clientId matches client user')
    } else {
      fail('Gig clientId matches client user', `Got: ${gig.clientId}`)
    }

    // Test 5: Gig status defaults to OPEN
    console.log('\nTest 5: Gig status defaults to OPEN')
    if (gig.status === 'OPEN') {
      pass('Gig status is OPEN')
    } else {
      fail('Gig status is OPEN', `Got: ${gig.status}`)
    }

    // Test 6: Query gigs by client
    console.log('\nTest 6: Query gigs by user')
    const clientGigs = await prisma.gig.findMany({ where: { clientId: clientUser.id } })
    if (clientGigs.length === 1) {
      pass('Client user has 1 gig')
    } else {
      fail('Client user has 1 gig', `Got: ${clientGigs.length}`)
    }

    const specGigs = await prisma.gig.findMany({ where: { clientId: specUser.id } })
    if (specGigs.length === 0) {
      pass('Specialist user has 0 gigs')
    } else {
      fail('Specialist user has 0 gigs', `Got: ${specGigs.length}`)
    }

    // Test 7: User-Gig relation
    console.log('\nTest 7: User includes gigs relation')
    const userWithGigs = await prisma.user.findUnique({
      where: { id: clientUser.id },
      include: { gigs: true },
    })
    if (userWithGigs && userWithGigs.gigs.length === 1) {
      pass('User.gigs relation returns gigs array')
    } else {
      fail('User.gigs relation returns gigs array', `Got: ${userWithGigs?.gigs?.length}`)
    }

    // Cleanup
    await prisma.gig.deleteMany({
      where: { client: { email: { in: [TEST_EMAIL_CLIENT, TEST_EMAIL_SPECIALIST] } } }
    })
    await prisma.user.deleteMany({
      where: { email: { in: [TEST_EMAIL_CLIENT, TEST_EMAIL_SPECIALIST] } }
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
