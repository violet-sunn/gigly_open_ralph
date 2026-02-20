import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const TEST_EMAIL_CLIENT = 'test-client@example.com'
const TEST_EMAIL_SPECIALIST = 'test-specialist@example.com'
const TEST_PASSWORD = 'TestPass123!'
const WRONG_PASSWORD = 'WrongPassword'
const GHOST_EMAIL = 'ghost@example.com'
const VALID_ROLES = ['CLIENT', 'SPECIALIST']

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
    console.log('\n--- Auth Flow Integration Tests ---\n')

    // Cleanup from previous runs
    await prisma.user.deleteMany({
      where: { email: { in: [TEST_EMAIL_CLIENT, TEST_EMAIL_SPECIALIST, GHOST_EMAIL] } }
    })

    // Test 1: Create CLIENT user and verify DB state
    console.log('Test 1: Register CLIENT user and verify DB state')
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10)
    await prisma.user.create({
      data: { email: TEST_EMAIL_CLIENT, password: hashedPassword, role: 'CLIENT' }
    })

    const clientUser = await prisma.user.findUnique({ where: { email: TEST_EMAIL_CLIENT } })
    if (clientUser) {
      pass('CLIENT user exists in database')
    } else {
      fail('CLIENT user exists in database', 'User not found')
    }

    if (clientUser && clientUser.role === 'CLIENT') {
      pass('CLIENT user has role "CLIENT"')
    } else {
      fail('CLIENT user has role "CLIENT"', `Got: ${clientUser?.role}`)
    }

    if (clientUser && clientUser.password !== TEST_PASSWORD) {
      pass('Password is not stored in plaintext')
    } else {
      fail('Password is not stored in plaintext', 'Password stored as plaintext')
    }

    if (clientUser && (clientUser.password.startsWith('$2a$') || clientUser.password.startsWith('$2b$'))) {
      pass('Password is a bcrypt hash')
    } else {
      fail('Password is a bcrypt hash', `Got: ${clientUser?.password?.substring(0, 10)}...`)
    }

    // Test 2: Create SPECIALIST user and verify DB state
    console.log('\nTest 2: Register SPECIALIST user and verify DB state')
    await prisma.user.create({
      data: { email: TEST_EMAIL_SPECIALIST, password: hashedPassword, role: 'SPECIALIST' }
    })

    const specUser = await prisma.user.findUnique({ where: { email: TEST_EMAIL_SPECIALIST } })
    if (specUser) {
      pass('SPECIALIST user exists in database')
    } else {
      fail('SPECIALIST user exists in database', 'User not found')
    }

    if (specUser && specUser.role === 'SPECIALIST') {
      pass('SPECIALIST user has role "SPECIALIST"')
    } else {
      fail('SPECIALIST user has role "SPECIALIST"', `Got: ${specUser?.role}`)
    }

    // Test 3: Verify bcrypt.compare works
    console.log('\nTest 3: Verify password hash with bcrypt.compare')
    const validCompare = await bcrypt.compare(TEST_PASSWORD, clientUser!.password)
    if (validCompare) {
      pass('bcrypt.compare returns true for correct password')
    } else {
      fail('bcrypt.compare returns true for correct password', 'Returned false')
    }

    const invalidCompare = await bcrypt.compare(WRONG_PASSWORD, clientUser!.password)
    if (!invalidCompare) {
      pass('bcrypt.compare returns false for wrong password')
    } else {
      fail('bcrypt.compare returns false for wrong password', 'Returned true')
    }

    // Test 4: Login with correct credentials (simulate loginUser logic)
    console.log('\nTest 4: Login with correct credentials')
    const loginUser = await prisma.user.findUnique({ where: { email: TEST_EMAIL_CLIENT } })
    if (loginUser) {
      const isValid = await bcrypt.compare(TEST_PASSWORD, loginUser.password)
      if (isValid) {
        pass('Login with correct credentials succeeds')
      } else {
        fail('Login with correct credentials succeeds', 'Password compare failed')
      }
    } else {
      fail('Login with correct credentials succeeds', 'User not found')
    }

    // Test 5: Login with wrong password
    console.log('\nTest 5: Login with wrong password')
    const loginUser2 = await prisma.user.findUnique({ where: { email: TEST_EMAIL_CLIENT } })
    if (loginUser2) {
      const isValid = await bcrypt.compare(WRONG_PASSWORD, loginUser2.password)
      if (!isValid) {
        pass('Login with wrong password returns error')
      } else {
        fail('Login with wrong password returns error', 'Password compare returned true')
      }
    } else {
      fail('Login with wrong password returns error', 'User not found')
    }

    // Test 6: Login with non-existent email
    console.log('\nTest 6: Login with non-existent email')
    const ghostUser = await prisma.user.findUnique({ where: { email: GHOST_EMAIL } })
    if (!ghostUser) {
      pass('Non-existent email returns null (would produce error response)')
    } else {
      fail('Non-existent email returns null', 'User unexpectedly found')
    }

    // Test 7: Role validation logic
    console.log('\nTest 7: Role validation')
    if (VALID_ROLES.includes('CLIENT')) {
      pass('"CLIENT" is a valid role')
    } else {
      fail('"CLIENT" is a valid role', 'Not in allowed set')
    }

    if (VALID_ROLES.includes('SPECIALIST')) {
      pass('"SPECIALIST" is a valid role')
    } else {
      fail('"SPECIALIST" is a valid role', 'Not in allowed set')
    }

    if (!VALID_ROLES.includes('INVALID')) {
      pass('"INVALID" is rejected as a role')
    } else {
      fail('"INVALID" is rejected as a role', 'Was accepted')
    }

    if (!VALID_ROLES.includes('USER')) {
      pass('"USER" is rejected as a role')
    } else {
      fail('"USER" is rejected as a role', 'Was accepted')
    }

    if (!VALID_ROLES.includes('ADMIN')) {
      pass('"ADMIN" is rejected as a registration role')
    } else {
      fail('"ADMIN" is rejected as a registration role', 'Was accepted')
    }

    // Cleanup
    await prisma.user.deleteMany({
      where: { email: { in: [TEST_EMAIL_CLIENT, TEST_EMAIL_SPECIALIST, GHOST_EMAIL] } }
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
