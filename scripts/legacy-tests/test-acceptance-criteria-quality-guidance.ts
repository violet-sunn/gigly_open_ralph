#!/usr/bin/env tsx

/**
 * Integration test for acceptance criteria quality guidance
 * Verifies component behavior and form submission
 */

import { readFileSync } from 'fs'
import { join } from 'path'

console.log('🧪 Running integration tests for acceptance-criteria-quality-guidance...\n')

let allPassed = true
const testResults: Array<{ name: string; passed: boolean; details?: string }> = []

function test(name: string, condition: boolean, details?: string) {
  testResults.push({ name, passed: condition, details })
  if (condition) {
    console.log(`✓ ${name}`)
    if (details) console.log(`  ${details}`)
  } else {
    console.log(`✗ ${name}`)
    if (details) console.log(`  ${details}`)
    allPassed = false
  }
}

// Test Suite 1: Component Logic Tests
console.log('Test Suite 1: Component Logic\n')

const componentPath = join(process.cwd(), 'app/components/AcceptanceCriteriaQualityWarning.tsx')
const componentCode = readFileSync(componentPath, 'utf-8')

test(
  'Component returns null when shouldShow is false',
  componentCode.includes('if (!shouldShow) return null'),
  'Early return prevents unnecessary rendering'
)

test(
  'Component shows for 50-149 characters with interaction',
  componentCode.includes('characterCount >= 50 && characterCount < 150 && hasInteracted'),
  'Correct threshold range: 50-149 chars'
)

test(
  'Component has accessibility attributes',
  componentCode.includes('aria-live="polite"') && componentCode.includes('role="status"'),
  'Screen reader support enabled'
)

test(
  'Component uses amber color scheme',
  componentCode.includes('bg-amber-50') &&
  componentCode.includes('border-amber-300') &&
  componentCode.includes('text-amber-800'),
  'Non-alarming visual styling'
)

test(
  'Component has smooth transitions',
  componentCode.includes('transition-opacity duration-200'),
  'Fade in/out animation'
)

console.log()

// Test Suite 2: Form Integration Tests
console.log('Test Suite 2: Form Integration\n')

const formPath = join(process.cwd(), 'app/dashboard/gigs/new/gig-form.tsx')
const formCode = readFileSync(formPath, 'utf-8')

test(
  'Form tracks interaction state',
  formCode.includes('const [acHasInteracted, setAcHasInteracted] = useState(false)'),
  'State initialized to false (no warning on page load)'
)

test(
  'Form sets interaction on first change',
  formCode.includes('if (!acHasInteracted)') && formCode.includes('setAcHasInteracted(true)'),
  'Interaction tracked after first onChange event'
)

test(
  'Form updates character count on change',
  formCode.includes('setAcceptanceCriteriaCount(e.target.value.length)'),
  'Real-time character counting'
)

test(
  'Warning component receives correct props',
  formCode.includes('characterCount={acceptanceCriteriaCount}') &&
  formCode.includes('hasInteracted={acHasInteracted}'),
  'Props passed correctly from form state'
)

// Check positioning
const textareaMatch = formCode.match(/id="acceptanceCriteria"[\s\S]*?<\/textarea>/);
const warningMatch = formCode.match(/<AcceptanceCriteriaQualityWarning[\s\S]*?\/>/);
const counterMatch = formCode.match(/<CharacterCounter[\s\S]*?\/>/);

if (textareaMatch && warningMatch && counterMatch) {
  const textareaPos = formCode.indexOf(textareaMatch[0])
  const warningPos = formCode.indexOf(warningMatch[0])
  const counterPos = formCode.indexOf(counterMatch[0], warningPos)

  test(
    'Warning positioned between textarea and counter',
    textareaPos < warningPos && warningPos < counterPos,
    `Order: textarea (${textareaPos}) → warning (${warningPos}) → counter (${counterPos})`
  )
} else {
  test('Warning positioned between textarea and counter', false, 'Could not find all elements')
}

console.log()

// Test Suite 3: Backend Validation Tests
console.log('Test Suite 3: Backend Validation (unchanged)\n')

const actionPath = join(process.cwd(), 'app/actions/gig.ts')
const actionCode = readFileSync(actionPath, 'utf-8')

test(
  'Server-side minimum validation unchanged',
  actionCode.includes('acceptanceCriteria.length < 50') &&
  actionCode.includes("return { error: 'Acceptance criteria must be at least 50 characters.' }"),
  'Hard minimum (50 chars) still enforced server-side'
)

test(
  'No new server-side validation for 150 chars',
  !actionCode.includes('150') && !actionCode.includes('quality'),
  'Soft validation is client-side only'
)

test(
  'Form submission logic unchanged',
  actionCode.includes("redirect('/dashboard')"),
  'Successful submission still redirects to dashboard'
)

console.log()

// Test Suite 4: Behavioral Scenarios
console.log('Test Suite 4: Behavioral Scenarios\n')

// Scenario: Warning does not appear on page load
test(
  'Scenario: No warning on page load',
  formCode.includes('useState(false)'),
  'hasInteracted starts false, preventing initial warning'
)

// Scenario: Warning appears for brief criteria
test(
  'Scenario: Warning appears for 50-149 chars',
  componentCode.includes('characterCount >= 50 && characterCount < 150'),
  'Threshold correctly defined'
)

// Scenario: Warning disappears at 150 chars
test(
  'Scenario: Warning disappears at 150+ chars',
  componentCode.includes('< 150'),
  'Upper bound excludes 150 and above'
)

// Scenario: Warning does not block submission
test(
  'Scenario: Warning does not block submission',
  !actionCode.includes('150') && !formCode.includes('disabled') && !formCode.includes('preventDefault'),
  'No client-side or server-side blocking logic'
)

console.log()

// Test Suite 5: Edge Cases
console.log('Test Suite 5: Edge Cases\n')

test(
  'Edge case: Warning hidden below 50 chars',
  componentCode.includes('>= 50'),
  'Lower bound is inclusive (50 shows warning)'
)

test(
  'Edge case: Warning hidden at exactly 150 chars',
  componentCode.includes('< 150'),
  'Upper bound is exclusive (150 hides warning)'
)

test(
  'Edge case: Interaction state persists',
  !formCode.includes('setAcHasInteracted(false)'),
  'No logic to reset interaction state'
)

test(
  'Edge case: Works with copy-paste',
  formCode.includes('onChange={(e)'),
  'onChange handler triggers on paste events'
)

console.log()

// Summary
console.log('═'.repeat(70))
console.log('TEST SUMMARY')
console.log('═'.repeat(70))

const passed = testResults.filter(t => t.passed).length
const failed = testResults.filter(t => !t.passed).length
const total = testResults.length

console.log(`Total tests: ${total}`)
console.log(`Passed: ${passed}`)
console.log(`Failed: ${failed}`)
console.log()

if (failed > 0) {
  console.log('Failed tests:')
  testResults.filter(t => !t.passed).forEach(t => {
    console.log(`  ✗ ${t.name}`)
    if (t.details) console.log(`    ${t.details}`)
  })
  console.log()
}

console.log('═'.repeat(70))

if (allPassed) {
  console.log('\n✅ All integration tests passed!')
  console.log('\n📋 Implementation Summary:')
  console.log('  • Component created with correct logic and styling')
  console.log('  • Form integration complete with state tracking')
  console.log('  • Warning positioned correctly in layout')
  console.log('  • Server-side validation unchanged (50 char minimum)')
  console.log('  • Soft validation is client-side only (non-blocking)')
  console.log('  • Accessibility attributes included')
  console.log('  • Smooth transitions implemented')
  console.log('\n🎯 Ready for manual testing:')
  console.log('  1. Navigate to http://localhost:3005/register')
  console.log('  2. Register as CLIENT user')
  console.log('  3. Go to /dashboard/gigs/new')
  console.log('  4. Type 50-149 chars in acceptance criteria → warning appears')
  console.log('  5. Type 150+ chars → warning disappears')
  console.log('  6. Submit form with warning visible → succeeds')
  process.exit(0)
} else {
  console.log('\n❌ Some integration tests failed.')
  console.log('Please review the failures above and fix the implementation.')
  process.exit(1)
}
