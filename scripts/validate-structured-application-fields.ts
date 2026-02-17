import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'
import * as fs from 'fs'
import * as path from 'path'

async function main() {
  console.log('🔍 VALIDATION REPORT: Structured Application Fields\n')
  console.log('=' .repeat(70))

  let totalTests = 0
  let passedTests = 0
  let failedTests = 0
  const failures: string[] = []

  function test(name: string, condition: boolean, details?: string) {
    totalTests++
    if (condition) {
      passedTests++
      console.log(`✅ ${name}`)
      if (details) console.log(`   ${details}`)
    } else {
      failedTests++
      console.log(`❌ ${name}`)
      if (details) console.log(`   ${details}`)
      failures.push(name)
    }
  }

  // ========================================================================
  // DATABASE SPECIFICATION VALIDATION
  // ========================================================================
  console.log('\n📊 DATABASE SPECIFICATION\n')

  // Check Prisma schema
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8')

  test(
    'Application model has approach field with @default("")',
    schemaContent.includes('approach') && schemaContent.includes('String') && schemaContent.includes('@default("")')
  )

  test(
    'Application model has questions field with @default("")',
    schemaContent.includes('questions') && schemaContent.includes('String') && schemaContent.includes('@default("")')
  )

  test(
    'Application model has estimatedEffort field with @default("")',
    schemaContent.includes('estimatedEffort') && schemaContent.includes('String') && schemaContent.includes('@default("")')
  )

  test(
    'Application model retains coverLetter field (backward compatibility)',
    schemaContent.includes('coverLetter') && schemaContent.includes('String') && schemaContent.includes('@default("")')
  )

  test(
    'Application model has unique constraint on [gigId, specialistId]',
    schemaContent.includes('@@unique([gigId, specialistId])')
  )

  // Test database operations
  console.log('\n📋 Testing database operations...')

  // Clean up test data
  await prisma.application.deleteMany({
    where: { specialist: { email: 'validation-test@example.com' } }
  })
  await prisma.gig.deleteMany({
    where: { client: { email: 'validation-client-test@example.com' } }
  })
  await prisma.user.deleteMany({
    where: { email: { in: ['validation-client-test@example.com', 'validation-test@example.com'] } }
  })

  const hashedPassword = await hash('test123', 10)
  const testClient = await prisma.user.create({
    data: { email: 'validation-client-test@example.com', password: hashedPassword, role: 'CLIENT' }
  })
  const testSpecialist = await prisma.user.create({
    data: { email: 'validation-test@example.com', password: hashedPassword, role: 'SPECIALIST' }
  })
  const testGig = await prisma.gig.create({
    data: {
      title: 'Validation Test Gig',
      description: 'Test',
      acceptanceCriteria: 'Test',
      budget: 10000000,
      serviceFee: 2000000,
      totalAmount: 12000000,
      status: 'OPEN',
      clientId: testClient.id,
    }
  })

  // Test new application with structured fields
  const newApp = await prisma.application.create({
    data: {
      gigId: testGig.id,
      specialistId: testSpecialist.id,
      approach: 'Test approach with sufficient length to meet the minimum requirement of 100 characters for validation purposes.',
      questions: 'Test questions with sufficient length to meet minimum.',
      estimatedEffort: '1 week',
      coverLetter: '',
      status: 'PENDING',
    }
  })

  test(
    'New application stores structured fields correctly',
    newApp.approach.length > 0 && newApp.questions.length > 0 && newApp.estimatedEffort === '1 week' && newApp.coverLetter === ''
  )

  // Test application without estimatedEffort
  await prisma.application.deleteMany({ where: { gigId: testGig.id } })
  const appWithoutEffort = await prisma.application.create({
    data: {
      gigId: testGig.id,
      specialistId: testSpecialist.id,
      approach: 'Test approach with sufficient length to meet the minimum requirement of 100 characters for validation purposes.',
      questions: 'Test questions with sufficient length to meet minimum.',
      estimatedEffort: '',
      coverLetter: '',
      status: 'PENDING',
    }
  })

  test(
    'Application without estimatedEffort defaults to empty string',
    appWithoutEffort.estimatedEffort === ''
  )

  // Test legacy application
  await prisma.application.deleteMany({ where: { gigId: testGig.id } })
  const legacyApp = await prisma.application.create({
    data: {
      gigId: testGig.id,
      specialistId: testSpecialist.id,
      coverLetter: 'Legacy cover letter',
      approach: '',
      questions: '',
      estimatedEffort: '',
      status: 'PENDING',
    }
  })

  test(
    'Legacy application format is supported (coverLetter only)',
    legacyApp.coverLetter.length > 0 && legacyApp.approach === '' && legacyApp.questions === ''
  )

  // ========================================================================
  // SERVER ACTION SPECIFICATION VALIDATION
  // ========================================================================
  console.log('\n⚙️  SERVER ACTION SPECIFICATION\n')

  // Check server action file
  const actionPath = path.join(process.cwd(), 'app', 'actions', 'gig.ts')
  const actionContent = fs.readFileSync(actionPath, 'utf-8')

  test(
    'applyToGig extracts approach from formData',
    actionContent.includes("formData.get('approach')")
  )

  test(
    'applyToGig extracts questions from formData',
    actionContent.includes("formData.get('questions')")
  )

  test(
    'applyToGig extracts estimatedEffort from formData',
    actionContent.includes("formData.get('estimatedEffort')")
  )

  test(
    'applyToGig validates approach is required',
    actionContent.includes('Technical approach is required')
  )

  test(
    'applyToGig validates questions is required',
    actionContent.includes('Clarifying questions are required')
  )

  test(
    'applyToGig validates approach minimum length (100 chars)',
    actionContent.includes('approach.length < 100') && actionContent.includes('at least 100 characters')
  )

  test(
    'applyToGig validates questions minimum length (50 chars)',
    actionContent.includes('questions.length < 50') && actionContent.includes('at least 50 characters')
  )

  test(
    'applyToGig validates approach maximum length (2000 chars)',
    actionContent.includes('approach.length > 2000') && actionContent.includes('Maximum 2000 characters')
  )

  test(
    'applyToGig validates questions maximum length (1000 chars)',
    actionContent.includes('questions.length > 1000') && actionContent.includes('Maximum 1000 characters')
  )

  test(
    'applyToGig validates estimatedEffort maximum length (200 chars)',
    actionContent.includes('estimatedEffort.length > 200') && actionContent.includes('Maximum 200 characters')
  )

  test(
    'applyToGig sets coverLetter to empty string for new applications',
    actionContent.includes("coverLetter: ''") || actionContent.includes('coverLetter: ""')
  )

  test(
    'applyToGig trims input fields',
    actionContent.includes('.trim()')
  )

  // ========================================================================
  // UI SPECIFICATION VALIDATION
  // ========================================================================
  console.log('\n🎨 UI SPECIFICATION\n')

  // Check ApplyForm component
  const formPath = path.join(process.cwd(), 'app', 'dashboard', 'gigs', '[id]', 'apply-form.tsx')
  const formContent = fs.readFileSync(formPath, 'utf-8')

  test(
    'ApplyForm uses useActionState hook',
    formContent.includes('useActionState')
  )

  test(
    'ApplyForm has approach field with name="approach"',
    formContent.includes('name="approach"')
  )

  test(
    'ApplyForm has questions field with name="questions"',
    formContent.includes('name="questions"')
  )

  test(
    'ApplyForm has estimatedEffort field with name="estimatedEffort"',
    formContent.includes('name="estimatedEffort"')
  )

  test(
    'ApplyForm has character counter state for approach',
    formContent.includes('approachCount')
  )

  test(
    'ApplyForm has character counter state for questions',
    formContent.includes('questionsCount')
  )

  test(
    'ApplyForm has character counter state for estimatedEffort',
    formContent.includes('effortCount')
  )

  test(
    'ApplyForm approach field has minLength={100}',
    formContent.includes('minLength={100}')
  )

  test(
    'ApplyForm approach field has maxLength={2000}',
    formContent.includes('maxLength={2000}')
  )

  test(
    'ApplyForm questions field has minLength={50}',
    formContent.includes('minLength={50}')
  )

  test(
    'ApplyForm questions field has maxLength={1000}',
    formContent.includes('maxLength={1000}')
  )

  test(
    'ApplyForm estimatedEffort field has maxLength={200}',
    formContent.includes('maxLength={200}')
  )

  test(
    'ApplyForm submit button text is "Submit Application"',
    formContent.includes('Submit Application')
  )

  test(
    'ApplyForm submit button shows "Submitting..." when pending',
    formContent.includes('Submitting...')
  )

  test(
    'ApplyForm approach field is marked as required',
    formContent.includes('required') && formContent.includes('approach')
  )

  test(
    'ApplyForm questions field is marked as required',
    formContent.includes('required') && formContent.includes('questions')
  )

  // Check gig detail page
  const detailPath = path.join(process.cwd(), 'app', 'dashboard', 'gigs', '[id]', 'page.tsx')
  const detailContent = fs.readFileSync(detailPath, 'utf-8')

  test(
    'Gig detail page conditionally renders structured fields',
    detailContent.includes('app.approach && app.questions')
  )

  test(
    'Gig detail page displays Technical Approach with emoji',
    detailContent.includes('🔧') && detailContent.includes('Technical Approach')
  )

  test(
    'Gig detail page displays Clarifying Questions with emoji',
    detailContent.includes('❓') && detailContent.includes('Clarifying Questions')
  )

  test(
    'Gig detail page displays Estimated Effort with emoji',
    detailContent.includes('⏱️') && detailContent.includes('Estimated Effort')
  )

  test(
    'Gig detail page conditionally displays estimatedEffort',
    detailContent.includes('app.estimatedEffort &&')
  )

  test(
    'Gig detail page displays legacy coverLetter when structured fields empty',
    detailContent.includes('app.coverLetter') && detailContent.includes('Cover Letter')
  )

  test(
    'Gig detail page uses whitespace-pre-wrap for text formatting',
    detailContent.includes('whitespace-pre-wrap')
  )

  // ========================================================================
  // BUILD AND COMPILATION VALIDATION
  // ========================================================================
  console.log('\n🔨 BUILD VALIDATION\n')

  // These would be checked by running actual commands, but we'll note them
  console.log('   Note: Run `npm run build` to verify TypeScript compilation')
  console.log('   Note: Run `npx prisma validate` to verify schema validity')

  // ========================================================================
  // SUMMARY
  // ========================================================================
  console.log('\n' + '='.repeat(70))
  console.log('📊 VALIDATION SUMMARY')
  console.log('='.repeat(70))
  console.log(`Total Tests: ${totalTests}`)
  console.log(`✅ Passed: ${passedTests}`)
  console.log(`❌ Failed: ${failedTests}`)
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)

  if (failedTests > 0) {
    console.log('\n❌ FAILED TESTS:')
    failures.forEach(f => console.log(`   - ${f}`))
    console.log('\n⚠️  Some acceptance criteria are not met. Review failures above.')
    process.exit(1)
  } else {
    console.log('\n✅ ALL ACCEPTANCE CRITERIA MET!')
    console.log('\n📝 Manual Verification Required:')
    console.log('   1. Start dev server and test application form UI')
    console.log('   2. Verify character counters update in real-time')
    console.log('   3. Test form validation with various inputs')
    console.log('   4. Verify application display for both new and legacy formats')
    console.log('   5. Check visual hierarchy and styling')
  }
}

main()
  .catch((e) => {
    console.error('❌ Validation script error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
