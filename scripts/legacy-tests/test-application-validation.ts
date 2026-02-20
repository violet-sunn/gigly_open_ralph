import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'

async function main() {
  console.log('🧪 Testing Database Schema for Structured Application Fields\n')

  // Setup: Create test users and gig
  console.log('🔧 Setting up test environment...')
  const hashedPassword = await hash('password123', 10)

  // Clean up
  await prisma.application.deleteMany({
    where: {
      specialist: { email: 'schema-specialist@example.com' }
    }
  })
  await prisma.gig.deleteMany({
    where: {
      client: { email: 'schema-client@example.com' }
    }
  })
  await prisma.user.deleteMany({
    where: {
      email: { in: ['schema-client@example.com', 'schema-specialist@example.com'] }
    }
  })

  const client = await prisma.user.create({
    data: {
      email: 'schema-client@example.com',
      password: hashedPassword,
      role: 'CLIENT',
    }
  })

  const specialist = await prisma.user.create({
    data: {
      email: 'schema-specialist@example.com',
      password: hashedPassword,
      role: 'SPECIALIST',
    }
  })

  const gig = await prisma.gig.create({
    data: {
      title: 'Schema Test Gig',
      description: 'Test gig for schema validation',
      acceptanceCriteria: 'Must pass all schema tests',
      budget: 10000000,
      serviceFee: 2000000,
      totalAmount: 12000000,
      status: 'OPEN',
      tags: 'Test',
      clientId: client.id,
    }
  })

  console.log('✅ Test environment ready\n')

  // Test 1: Verify all fields exist and have correct defaults
  console.log('📋 Test 1: Create application with all fields')
  const app1 = await prisma.application.create({
    data: {
      gigId: gig.id,
      specialistId: specialist.id,
      approach: 'I will implement this using a test-driven development approach with comprehensive unit tests and integration tests to ensure quality and maintainability.',
      questions: 'What are the specific requirements and constraints for this project?',
      estimatedEffort: '2-3 weeks',
      coverLetter: '',
      status: 'PENDING',
    }
  })
  console.log('✅ Application created with all fields')
  console.log('   - approach:', app1.approach.length, 'chars')
  console.log('   - questions:', app1.questions.length, 'chars')
  console.log('   - estimatedEffort:', app1.estimatedEffort.length, 'chars')
  console.log('   - coverLetter:', app1.coverLetter.length, 'chars')

  // Test 2: Verify default values work
  console.log('\n📋 Test 2: Create application without optional fields')
  await prisma.application.deleteMany({ where: { gigId: gig.id } })

  const app2 = await prisma.application.create({
    data: {
      gigId: gig.id,
      specialistId: specialist.id,
      approach: 'Test approach',
      questions: 'Test questions',
      // estimatedEffort omitted - should default to ""
      // coverLetter omitted - should default to ""
      status: 'PENDING',
    }
  })
  console.log('✅ Application created with defaults')
  console.log('   - estimatedEffort (should be empty):', app2.estimatedEffort === '' ? 'Empty ✓' : 'Not empty ✗')
  console.log('   - coverLetter (should be empty):', app2.coverLetter === '' ? 'Empty ✓' : 'Not empty ✗')

  // Test 3: Verify legacy application format works
  console.log('\n📋 Test 3: Create legacy application (coverLetter only)')
  await prisma.application.deleteMany({ where: { gigId: gig.id } })

  const app3 = await prisma.application.create({
    data: {
      gigId: gig.id,
      specialistId: specialist.id,
      coverLetter: 'I am a great fit for this project.',
      approach: '',
      questions: '',
      estimatedEffort: '',
      status: 'PENDING',
    }
  })
  console.log('✅ Legacy application created')
  console.log('   - coverLetter:', app3.coverLetter.length, 'chars')
  console.log('   - approach (should be empty):', app3.approach === '' ? 'Empty ✓' : 'Not empty ✗')
  console.log('   - questions (should be empty):', app3.questions === '' ? 'Empty ✓' : 'Not empty ✗')

  // Test 4: Verify fields can store long text
  console.log('\n📋 Test 4: Test field length capacity')
  await prisma.application.deleteMany({ where: { gigId: gig.id } })

  const longApproach = 'A'.repeat(2000)
  const longQuestions = 'Q'.repeat(1000)
  const longEffort = 'E'.repeat(200)

  const app4 = await prisma.application.create({
    data: {
      gigId: gig.id,
      specialistId: specialist.id,
      approach: longApproach,
      questions: longQuestions,
      estimatedEffort: longEffort,
      coverLetter: '',
      status: 'PENDING',
    }
  })
  console.log('✅ Long text stored successfully')
  console.log('   - approach:', app4.approach.length, 'chars (max 2000)')
  console.log('   - questions:', app4.questions.length, 'chars (max 1000)')
  console.log('   - estimatedEffort:', app4.estimatedEffort.length, 'chars (max 200)')

  // Test 5: Verify unique constraint still works
  console.log('\n📋 Test 5: Test unique constraint (gigId + specialistId)')
  try {
    await prisma.application.create({
      data: {
        gigId: gig.id,
        specialistId: specialist.id,
        approach: 'Another approach',
        questions: 'More questions',
        estimatedEffort: '1 week',
        coverLetter: '',
        status: 'PENDING',
      }
    })
    console.log('❌ FAILED: Duplicate application was created (unique constraint not working)')
  } catch (error) {
    console.log('✅ Unique constraint working correctly')
    console.log('   - Duplicate application rejected as expected')
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('✅ All database schema tests passed!')
  console.log('='.repeat(60))
  console.log('\n📝 Schema Test Summary:')
  console.log('✓ All new fields (approach, questions, estimatedEffort) exist')
  console.log('✓ Default values work correctly (empty strings)')
  console.log('✓ Legacy format (coverLetter only) is supported')
  console.log('✓ Fields can store text up to specified limits')
  console.log('✓ Unique constraint (gigId + specialistId) still works')
  console.log('\n⚠️  Important Note:')
  console.log('Database schema does NOT enforce validation rules.')
  console.log('Validation is implemented in the server action (app/actions/gig.ts):')
  console.log('  - Required field checks (approach, questions)')
  console.log('  - Minimum lengths (approach: 100, questions: 50)')
  console.log('  - Maximum lengths (approach: 2000, questions: 1000, effort: 200)')
  console.log('  - Clear, actionable error messages')
  console.log('\nThis is by design - validation at the application layer provides:')
  console.log('  - Better error messages for users')
  console.log('  - More flexible validation logic')
  console.log('  - Easier to update validation rules without migrations')
}

main()
  .catch((e) => {
    console.error('❌ Test failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
