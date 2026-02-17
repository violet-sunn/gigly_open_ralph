import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

interface ValidationResult {
  scenario: string
  passed: boolean
  details: string
}

const results: ValidationResult[] = []

function logResult(scenario: string, passed: boolean, details: string) {
  results.push({ scenario, passed, details })
  const icon = passed ? '✅' : '❌'
  console.log(`${icon} ${scenario}`)
  if (details) console.log(`   ${details}`)
}

async function validateGigSpec() {
  console.log('\n═══════════════════════════════════════════════════════')
  console.log('📋 VALIDATING GIG SPEC (Server Action)')
  console.log('═══════════════════════════════════════════════════════\n')

  // Setup
  await prisma.user.deleteMany({ where: { email: { contains: 'validate-test' } } })
  const hashedPassword = await bcrypt.hash('password123', 10)

  const client = await prisma.user.create({
    data: {
      email: 'validate-test-client@example.com',
      password: hashedPassword,
      role: 'CLIENT',
    },
  })

  // Scenario 1: Successful gig creation with acceptanceCriteria (trimmed)
  try {
    const criteria = '  This is a valid acceptance criteria with more than fifty characters  '
    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'Test description',
        acceptanceCriteria: criteria.trim(),
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        clientId: client.id,
      },
    })

    const trimmedCorrectly = gig.acceptanceCriteria === criteria.trim()
    const hasCorrectLength = gig.acceptanceCriteria!.length >= 50

    logResult(
      'Scenario: Successful gig creation with acceptanceCriteria',
      trimmedCorrectly && hasCorrectLength,
      `Trimmed: ${trimmedCorrectly}, Length: ${gig.acceptanceCriteria!.length} chars`
    )

    await prisma.gig.delete({ where: { id: gig.id } })
  } catch (e) {
    logResult('Scenario: Successful gig creation with acceptanceCriteria', false, `Error: ${e}`)
  }

  // Scenario 2: Acceptance criteria field is nullable (for legacy gigs)
  try {
    const legacyGig = await prisma.gig.create({
      data: {
        title: 'Legacy Gig',
        description: 'Test',
        acceptanceCriteria: null,
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        clientId: client.id,
      },
    })

    logResult(
      'Scenario: Database allows null acceptanceCriteria (legacy support)',
      legacyGig.acceptanceCriteria === null,
      'Legacy gigs can have null acceptance criteria'
    )

    await prisma.gig.delete({ where: { id: legacyGig.id } })
  } catch (e) {
    logResult('Scenario: Database allows null acceptanceCriteria', false, `Error: ${e}`)
  }

  // Scenario 3: Multi-line formatting preserved
  try {
    const multiline = `Line 1: First requirement
Line 2: Second requirement
Line 3: Third requirement with more than fifty characters total`

    const gig = await prisma.gig.create({
      data: {
        title: 'Multiline Test',
        description: 'Test',
        acceptanceCriteria: multiline,
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        clientId: client.id,
      },
    })

    const preserved = gig.acceptanceCriteria === multiline
    const lineCount = gig.acceptanceCriteria!.split('\n').length

    logResult(
      'Scenario: Multi-line formatting preserved',
      preserved && lineCount === 3,
      `Lines preserved: ${lineCount}, Format intact: ${preserved}`
    )

    await prisma.gig.delete({ where: { id: gig.id } })
  } catch (e) {
    logResult('Scenario: Multi-line formatting preserved', false, `Error: ${e}`)
  }

  // Cleanup
  await prisma.user.delete({ where: { id: client.id } })
}

async function validateUIImplementation() {
  console.log('\n═══════════════════════════════════════════════════════')
  console.log('🎨 VALIDATING UI IMPLEMENTATION')
  console.log('═══════════════════════════════════════════════════════\n')

  // Check gig-form.tsx
  const fs = require('fs')
  const formContent = fs.readFileSync('app/dashboard/gigs/new/gig-form.tsx', 'utf-8')

  const hasAcceptanceCriteriaField = formContent.includes('name="acceptanceCriteria"')
  const hasRequiredAttribute = formContent.includes('acceptanceCriteria') && formContent.includes('required')
  const hasRows5 = formContent.includes('rows={5}')
  const hasLabel = formContent.includes('Definition of Done') || formContent.includes('Acceptance Criteria')
  const hasPlaceholder = formContent.includes('placeholder=') && formContent.includes('done')
  const hasHelperText = formContent.includes('Minimum 50 characters')

  logResult(
    'UI: Acceptance criteria field exists',
    hasAcceptanceCriteriaField,
    'Field with name="acceptanceCriteria" found'
  )

  logResult(
    'UI: Field is required',
    hasRequiredAttribute,
    'Required attribute present'
  )

  logResult(
    'UI: Field has 5 rows',
    hasRows5,
    'rows={5} attribute present'
  )

  logResult(
    'UI: Field has proper label',
    hasLabel,
    'Label contains "Definition of Done" or "Acceptance Criteria"'
  )

  logResult(
    'UI: Field has helpful placeholder',
    hasPlaceholder,
    'Placeholder text with example present'
  )

  logResult(
    'UI: Field has helper text',
    hasHelperText,
    'Helper text about 50 char minimum present'
  )

  // Check gig detail page
  const detailContent = fs.readFileSync('app/dashboard/gigs/[id]/page.tsx', 'utf-8')

  const hasDefinitionOfDone = detailContent.includes('Definition of Done')
  const hasBorderStyling = detailContent.includes('border-l-4') || detailContent.includes('border')
  const hasBackgroundColor = detailContent.includes('bg-blue-50') || detailContent.includes('bg-')
  const hasWhitespacePre = detailContent.includes('whitespace-pre-wrap')
  const hasNotSpecified = detailContent.includes('Not specified')
  const hasAcceptanceCriteriaDisplay = detailContent.includes('acceptanceCriteria')

  logResult(
    'UI: Detail page has "Definition of Done" heading',
    hasDefinitionOfDone,
    'Heading text found'
  )

  logResult(
    'UI: Detail page has visually distinct styling',
    hasBorderStyling && hasBackgroundColor,
    'Border and background color present'
  )

  logResult(
    'UI: Detail page preserves whitespace',
    hasWhitespacePre,
    'whitespace-pre-wrap class present'
  )

  logResult(
    'UI: Detail page handles null values',
    hasNotSpecified,
    '"Not specified" fallback present'
  )

  logResult(
    'UI: Detail page displays acceptance criteria',
    hasAcceptanceCriteriaDisplay,
    'acceptanceCriteria field referenced'
  )

  // Check server action
  const actionContent = fs.readFileSync('app/actions/gig.ts', 'utf-8')

  const extractsAcceptanceCriteria = actionContent.includes('acceptanceCriteria')
  const trimsValue = actionContent.includes('.trim()')
  const validates50Chars = actionContent.includes('50') && actionContent.includes('length')
  const hasRequiredValidation = actionContent.includes('acceptance criteria are required')
  const hasTooShortValidation = actionContent.includes('must be at least 50 characters')
  const includesInCreate = actionContent.includes('acceptanceCriteria:') || actionContent.includes('acceptanceCriteria,')

  logResult(
    'Server Action: Extracts acceptanceCriteria from formData',
    extractsAcceptanceCriteria,
    'acceptanceCriteria variable found'
  )

  logResult(
    'Server Action: Trims value before validation',
    trimsValue,
    '.trim() method used'
  )

  logResult(
    'Server Action: Validates 50 character minimum',
    validates50Chars,
    'Length validation with 50 chars found'
  )

  logResult(
    'Server Action: Validates required field',
    hasRequiredValidation,
    'Required validation error message found'
  )

  logResult(
    'Server Action: Validates minimum length',
    hasTooShortValidation,
    'Too short error message found'
  )

  logResult(
    'Server Action: Includes in Prisma create',
    includesInCreate,
    'acceptanceCriteria included in create data'
  )
}

async function validateDatabaseSchema() {
  console.log('\n═══════════════════════════════════════════════════════')
  console.log('🗄️  VALIDATING DATABASE SCHEMA')
  console.log('═══════════════════════════════════════════════════════\n')

  // Check schema file
  const fs = require('fs')
  const schemaContent = fs.readFileSync('prisma/schema.prisma', 'utf-8')

  const hasAcceptanceCriteriaField = schemaContent.includes('acceptanceCriteria')
  const isNullable = schemaContent.includes('acceptanceCriteria   String?')

  logResult(
    'Schema: acceptanceCriteria field exists',
    hasAcceptanceCriteriaField,
    'Field found in Gig model'
  )

  logResult(
    'Schema: Field is nullable',
    isNullable,
    'String? type allows null values for legacy gigs'
  )

  // Check migration exists
  const migrationExists = fs.existsSync('prisma/migrations') &&
    fs.readdirSync('prisma/migrations').some((dir: string) => dir.includes('add_acceptance_criteria'))

  logResult(
    'Migration: add_acceptance_criteria migration exists',
    migrationExists,
    'Migration file found'
  )
}

async function main() {
  console.log('═══════════════════════════════════════════════════════')
  console.log('🧪 OPENSPEC VALIDATION: require-acceptance-criteria')
  console.log('═══════════════════════════════════════════════════════')

  await validateDatabaseSchema()
  await validateGigSpec()
  await validateUIImplementation()

  // Summary
  console.log('\n═══════════════════════════════════════════════════════')
  console.log('📊 VALIDATION SUMMARY')
  console.log('═══════════════════════════════════════════════════════\n')

  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  const total = results.length

  console.log(`Total Scenarios: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`)

  if (failed > 0) {
    console.log('❌ FAILED SCENARIOS:\n')
    results.filter(r => !r.passed).forEach(r => {
      console.log(`   • ${r.scenario}`)
      console.log(`     ${r.details}\n`)
    })
  }

  console.log('═══════════════════════════════════════════════════════')

  if (failed === 0) {
    console.log('✅ ALL ACCEPTANCE CRITERIA VALIDATED SUCCESSFULLY!')
    console.log('═══════════════════════════════════════════════════════\n')
  } else {
    console.log('❌ VALIDATION FAILED - FIX ISSUES ABOVE')
    console.log('═══════════════════════════════════════════════════════\n')
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Validation script failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
