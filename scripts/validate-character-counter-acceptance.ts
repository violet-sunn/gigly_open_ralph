/**
 * Validation script for requirements-iteration-5a: Character Counter Implementation
 * Validates all acceptance criteria from the spec
 */

import * as fs from 'fs'
import * as path from 'path'

interface ValidationResult {
  scenario: string
  passed: boolean
  details: string[]
  failures: string[]
}

const results: ValidationResult[] = []

function validateScenario(scenario: string, checks: () => { passed: boolean; details: string[]; failures: string[] }) {
  const result = checks()
  results.push({
    scenario,
    passed: result.passed,
    details: result.details,
    failures: result.failures
  })
}

// Read source files
const characterCounterPath = path.join(process.cwd(), 'app/dashboard/gigs/new/character-counter.tsx')
const gigFormPath = path.join(process.cwd(), 'app/dashboard/gigs/new/gig-form.tsx')
const actionsPath = path.join(process.cwd(), 'app/actions/gig.ts')

const characterCounterCode = fs.readFileSync(characterCounterPath, 'utf-8')
const gigFormCode = fs.readFileSync(gigFormPath, 'utf-8')
const actionsCode = fs.readFileSync(actionsPath, 'utf-8')

console.log('╔══════════════════════════════════════════════════════════════════════╗')
console.log('║  VALIDATION REPORT: requirements-iteration-5a                        ║')
console.log('╚══════════════════════════════════════════════════════════════════════╝\n')

// Scenario 1: Character count displays for acceptanceCriteria field
validateScenario('Character count displays for acceptanceCriteria field', () => {
  const details: string[] = []
  const failures: string[] = []
  let passed = true

  if (characterCounterCode.includes('characters (minimum)')) {
    details.push('✓ Format includes "(minimum)" suffix')
  } else {
    failures.push('✗ Missing "(minimum)" suffix in format')
    passed = false
  }

  if (gigFormCode.includes('min={50}')) {
    details.push('✓ acceptanceCriteria uses min={50}')
  } else {
    failures.push('✗ acceptanceCriteria missing min={50}')
    passed = false
  }

  if (characterCounterCode.includes('text-red-600') && characterCounterCode.includes('current < min')) {
    details.push('✓ Red color (text-red-600) when under minimum')
  } else {
    failures.push('✗ Red color logic missing or incorrect')
    passed = false
  }

  if (characterCounterCode.includes('text-gray-600')) {
    details.push('✓ Gray color (text-gray-600) for normal range')
  } else {
    failures.push('✗ Gray color missing')
    passed = false
  }

  if (characterCounterCode.includes('text-right')) {
    details.push('✓ Right-aligned (text-right class)')
  } else {
    failures.push('✗ Missing text-right class')
    passed = false
  }

  return { passed, details, failures }
})

// Scenario 2-4: Character count displays for optional fields
validateScenario('Character count displays for optional fields', () => {
  const details: string[] = []
  const failures: string[] = []
  let passed = true

  if (characterCounterCode.includes('/ ${max} characters')) {
    details.push('✓ Format shows "X / 1000 characters"')
  } else {
    failures.push('✗ Max format incorrect')
    passed = false
  }

  const maxCount = (gigFormCode.match(/max=\{1000\}/g) || []).length
  if (maxCount === 3) {
    details.push('✓ All three optional fields use max={1000}')
  } else {
    failures.push(`✗ Expected 3 fields with max={1000}, found ${maxCount}`)
    passed = false
  }

  if (characterCounterCode.includes('text-orange-600') && characterCounterCode.includes('max * 0.9')) {
    details.push('✓ Orange color (text-orange-600) when ≥90% of max')
  } else {
    failures.push('✗ Orange color logic missing or incorrect')
    passed = false
  }

  return { passed, details, failures }
})

// Scenario 5: Character count updates in real-time
validateScenario('Character count updates in real-time', () => {
  const details: string[] = []
  const failures: string[] = []
  let passed = true

  const onChangeCount = (gigFormCode.match(/onChange=\{.*?value\.length.*?\}/gs) || []).length
  if (onChangeCount === 4) {
    details.push('✓ All 4 textareas have onChange handlers')
  } else {
    failures.push(`✗ Expected 4 onChange handlers, found ${onChangeCount}`)
    passed = false
  }

  if (gigFormCode.includes('e.target.value.length')) {
    details.push('✓ Uses .length property for counting')
  } else {
    failures.push('✗ Not using .length property')
    passed = false
  }

  if (gigFormCode.includes('setAcceptanceCriteriaCount') &&
      gigFormCode.includes('setGoalCount') &&
      gigFormCode.includes('setDeliverablesCount') &&
      gigFormCode.includes('setConstraintsCount')) {
    details.push('✓ All state setters present')
  } else {
    failures.push('✗ Missing state setters')
    passed = false
  }

  return { passed, details, failures }
})

// Scenario 6: Character count is accessible
validateScenario('Character count is accessible', () => {
  const details: string[] = []
  const failures: string[] = []
  let passed = true

  if (characterCounterCode.includes('aria-live="polite"')) {
    details.push('✓ aria-live="polite" attribute present')
  } else {
    failures.push('✗ Missing aria-live="polite"')
    passed = false
  }

  if (characterCounterCode.includes('aria-label')) {
    details.push('✓ aria-label attribute present')
  } else {
    failures.push('✗ Missing aria-label')
    passed = false
  }

  if (characterCounterCode.includes('label: string')) {
    details.push('✓ Label prop defined in interface')
  } else {
    failures.push('✗ Label prop missing from interface')
    passed = false
  }

  return { passed, details, failures }
})

// Scenario 7: Character count does not interfere with validation
validateScenario('Character count does not interfere with validation', () => {
  const details: string[] = []
  const failures: string[] = []
  let passed = true

  if (actionsCode.includes('acceptanceCriteria.length < 50')) {
    details.push('✓ Server-side validation for min 50 chars exists')
  } else {
    failures.push('✗ Server-side validation missing or modified')
    passed = false
  }

  if (actionsCode.includes('Acceptance criteria must be at least 50 characters')) {
    details.push('✓ Server-side error message unchanged')
  } else {
    failures.push('✗ Server-side error message missing')
    passed = false
  }

  if (gigFormCode.includes('action={formAction}')) {
    details.push('✓ Form still uses server action')
  } else {
    failures.push('✗ Form action modified')
    passed = false
  }

  if (gigFormCode.includes('state?.error')) {
    details.push('✓ Error display mechanism unchanged')
  } else {
    failures.push('✗ Error display missing')
    passed = false
  }

  return { passed, details, failures }
})

// Scenario 8: Character count layout is non-intrusive
validateScenario('Character count layout is non-intrusive', () => {
  const details: string[] = []
  const failures: string[] = []
  let passed = true

  if (gigFormCode.includes('flex justify-between')) {
    details.push('✓ Uses flex layout with justify-between')
  } else {
    failures.push('✗ Missing flex layout')
    passed = false
  }

  if (characterCounterCode.includes('text-sm')) {
    details.push('✓ Uses text-sm for small font size')
  } else {
    failures.push('✗ Missing text-sm class')
    passed = false
  }

  const helperTextCount = (gigFormCode.match(/text-gray-500/g) || []).length
  if (helperTextCount >= 4) {
    details.push('✓ Helper text preserved for all fields')
  } else {
    failures.push('✗ Helper text may be missing')
    passed = false
  }

  return { passed, details, failures }
})

// Print results
console.log('VALIDATION RESULTS:\n')

let allPassed = true
results.forEach((result, index) => {
  const status = result.passed ? '✅ PASS' : '❌ FAIL'
  console.log(`${index + 1}. ${status}: ${result.scenario}`)

  if (result.details.length > 0) {
    result.details.forEach(detail => console.log(`   ${detail}`))
  }

  if (result.failures.length > 0) {
    result.failures.forEach(failure => console.log(`   ${failure}`))
    allPassed = false
  }

  console.log('')
})

console.log('═'.repeat(70))
console.log('SUMMARY')
console.log('═'.repeat(70))

const passedCount = results.filter(r => r.passed).length
const totalCount = results.length

console.log(`Scenarios: ${passedCount}/${totalCount} passed`)

if (allPassed) {
  console.log('\n✅ ALL VALIDATION CHECKS PASSED')
  console.log('\n📋 Manual testing still required:')
  console.log('   - Visual verification of character counters in browser')
  console.log('   - Real-time update behavior during typing')
  console.log('   - Color transitions at thresholds')
  console.log('   - Form submission with validation errors')
  console.log('   - Screen reader announcements')
  console.log('   - Responsive layout on mobile devices')
} else {
  console.log('\n❌ VALIDATION FAILED')
  console.log('\nNext actions:')
  results.filter(r => !r.passed).forEach(result => {
    console.log(`\n- Fix: ${result.scenario}`)
    result.failures.forEach(failure => console.log(`  ${failure}`))
  })
}

console.log('\n' + '═'.repeat(70))

process.exit(allPassed ? 0 : 1)
