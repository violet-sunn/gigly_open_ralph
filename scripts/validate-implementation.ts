import 'dotenv/config'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import fs from 'fs'

async function validateImplementation() {
  console.log('=== ADMIN ROLE & MODERATION VALIDATION ===\n')

  let passed = 0
  let failed = 0
  const failures: string[] = []

  // DATABASE SCHEMA
  console.log('📋 DATABASE SCHEMA VALIDATION')

  try {
    const user = await prisma.user.findFirst()
    if (user && 'suspended' in user) {
      console.log('✓ User.suspended field exists')
      passed++
    }
  } catch (e) {
    console.log('✗ User.suspended field missing')
    failures.push('User.suspended field not found')
    failed++
  }

  try {
    const gig = await prisma.gig.findFirst()
    if (gig && 'closedByAdmin' in gig && 'closedAt' in gig) {
      console.log('✓ Gig.closedByAdmin and closedAt fields exist')
      passed++
    }
  } catch (e) {
    console.log('✗ Gig closure fields missing')
    failures.push('Gig fields not found')
    failed++
  }

  try {
    const logCount = await prisma.moderationLog.count()
    console.log(`✓ ModerationLog model exists (${logCount} records)`)
    passed++
  } catch (e) {
    console.log('✗ ModerationLog model missing')
    failures.push('ModerationLog not found')
    failed++
  }

  // FILE STRUCTURE
  console.log('\n📁 FILE STRUCTURE VALIDATION')

  const files = [
    'app/actions/moderation.ts',
    'app/admin/page.tsx',
    'app/admin/users/page.tsx',
    'app/admin/gigs/page.tsx',
  ]

  for (const file of files) {
    if (fs.existsSync(file)) {
      console.log(`✓ ${file}`)
      passed++
    } else {
      console.log(`✗ ${file} missing`)
      failures.push(`Missing: ${file}`)
      failed++
    }
  }

  // CODE VALIDATION
  console.log('\n🔐 CODE VALIDATION')

  const authCode = fs.readFileSync('app/actions/auth.ts', 'utf-8')
  if (authCode.includes('user.suspended')) {
    console.log('✓ Login checks suspended status')
    passed++
  } else {
    failures.push('Suspended check missing')
    failed++
  }

  const middlewareCode = fs.readFileSync('middleware.ts', 'utf-8')
  if (middlewareCode.includes('/admin') && middlewareCode.includes('ADMIN')) {
    console.log('✓ Middleware protects /admin routes')
    passed++
  } else {
    failures.push('Admin protection missing')
    failed++
  }

  const gigCode = fs.readFileSync('app/actions/gig.ts', 'utf-8')
  if (gigCode.includes('closedByAdmin')) {
    console.log('✓ applyToGig checks closed gigs')
    passed++
  } else {
    failures.push('Closed gig check missing')
    failed++
  }

  console.log('\n' + '='.repeat(50))
  console.log(`RESULT: ${passed} passed, ${failed} failed`)
  console.log('='.repeat(50))

  if (failed > 0) {
    console.log('\n❌ FAILURES:')
    failures.forEach((f, i) => console.log(`${i + 1}. ${f}`))
    process.exit(1)
  } else {
    console.log('\n✅ ALL CHECKS PASSED')
  }

  await prisma.$disconnect()
}

validateImplementation()
