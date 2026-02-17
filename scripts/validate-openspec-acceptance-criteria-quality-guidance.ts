#!/usr/bin/env tsx

/**
 * OpenSpec Validation: acceptance-criteria-quality-guidance
 * Validates implementation against all scenarios in specs/ui/spec.md
 */

import { readFileSync } from 'fs'
import { join } from 'path'

console.log('🔍 OpenSpec Validation: acceptance-criteria-quality-guidance')
console.log('═'.repeat(70))
console.log()

const componentPath = join(process.cwd(), 'app/components/AcceptanceCriteriaQualityWarning.tsx')
const formPath = join(process.cwd(), 'app/dashboard/gigs/new/gig-form.tsx')
const actionPath = join(process.cwd(), 'app/actions/gig.ts')

const componentCode = readFileSync(componentPath, 'utf-8')
const formCode = readFileSync(formPath, 'utf-8')
const actionCode = readFileSync(actionPath, 'utf-8')

interface ValidationResult {
  scenario: string
  status: 'PASS' | 'FAIL' | 'MANUAL'
  details: string[]
  evidence?: string
}

const results: ValidationResult[] = []

function validate(scenario: string, checks: Array<{ test: boolean; detail: string }>, manual = false): void {
  const allPassed = checks.every(c => c.test)
  const status = manual ? 'MANUAL' : (allPassed ? 'PASS' : 'FAIL')

  results.push({
    scenario,
    status,
    details: checks.map(c => `${c.test ? '✓' : '✗'} ${c.detail}`)
  })
}

console.log('📋 SCENARIO VALIDATION\n')

// Scenario 1: Warning appears for brief acceptance criteria
validate('Scenario 1: Warning appears for brief acceptance criteria (50-149 chars)', [
  { test: componentCode.includes('characterCount >= 50 && characterCount < 150 && hasInteracted'), detail: 'Conditional logic: 50-149 chars + hasInteracted' },
  { test: componentCode.includes('💡'), detail: 'Lightbulb emoji present' },
  { test: componentCode.includes('Consider adding more detail to prevent disputes'), detail: 'Correct warning message' },
  { test: componentCode.includes('deliverables, quality standards, or success metrics'), detail: 'Mentions specific examples' },
  { test: componentCode.includes('bg-amber-50'), detail: 'Amber background (bg-amber-50)' },
  { test: componentCode.includes('border-amber-300'), detail: 'Amber border (border-amber-300)' },
  { test: componentCode.includes('text-amber-800'), detail: 'Amber text (text-amber-800)' },
  { test: formCode.includes('<AcceptanceCriteriaQualityWarning'), detail: 'Warning component rendered in form' },
  { test: formCode.indexOf('<AcceptanceCriteriaQualityWarning') > formCode.indexOf('id="acceptanceCriteria"'), detail: 'Positioned after textarea' },
])

// Scenario 2: Warning disappears when quality threshold is reached
validate('Scenario 2: Warning disappears at 150+ characters', [
  { test: componentCode.includes('< 150'), detail: 'Upper bound excludes 150 (< 150)' },
  { test: componentCode.includes('if (!shouldShow) return null'), detail: 'Returns null when condition not met' },
])

// Scenario 3: Warning does not appear on page load
validate('Scenario 3: Warning does not appear on page load', [
  { test: formCode.includes('const [acHasInteracted, setAcHasInteracted] = useState(false)'), detail: 'hasInteracted initialized to false' },
  { test: componentCode.includes('&& hasInteracted'), detail: 'hasInteracted required in condition' },
])

// Scenario 4: Warning does not appear below hard minimum
validate('Scenario 4: Warning does not appear below 50 characters', [
  { test: componentCode.includes('>= 50'), detail: 'Lower bound is 50 (>= 50)' },
  { test: componentCode.includes('characterCount >= 50 && characterCount < 150'), detail: 'Only shows in 50-149 range' },
])

// Scenario 5: Warning does not block form submission
validate('Scenario 5: Warning does not block form submission', [
  { test: !formCode.includes('preventDefault'), detail: 'No preventDefault in form' },
  { test: !formCode.includes('disabled') || formCode.includes('disabled={pending}'), detail: 'No custom disabled logic for warning' },
  { test: actionCode.includes('acceptanceCriteria.length < 50'), detail: 'Server validates 50 char minimum' },
  { test: !actionCode.includes('150'), detail: 'Server does not validate 150 char threshold' },
  { test: actionCode.includes("redirect('/dashboard')"), detail: 'Successful submission redirects' },
])

// Scenario 6: Warning is accessible to screen readers
validate('Scenario 6: Warning is accessible to screen readers', [
  { test: componentCode.includes('aria-live="polite"'), detail: 'Has aria-live="polite"' },
  { test: componentCode.includes('role="status"'), detail: 'Has role="status"' },
])

// Scenario 7: Warning has smooth visual transition
validate('Scenario 7: Warning has smooth visual transition', [
  { test: componentCode.includes('transition-opacity'), detail: 'Has transition-opacity class' },
  { test: componentCode.includes('duration-200'), detail: 'Has duration-200 (200ms)' },
])

// Scenario 8: Warning styling is visually distinct but not alarming
validate('Scenario 8: Warning styling is visually distinct but not alarming', [
  { test: componentCode.includes('bg-amber-50'), detail: 'Light amber background (not red)' },
  { test: componentCode.includes('border-amber-300'), detail: 'Visible amber border' },
  { test: componentCode.includes('text-amber-800'), detail: 'Dark amber text' },
  { test: componentCode.includes('rounded-md'), detail: 'Rounded corners' },
  { test: componentCode.includes('p-3'), detail: 'Padding for visual comfort' },
  { test: !componentCode.includes('⚠️') && !componentCode.includes('❌'), detail: 'No error icons' },
  { test: componentCode.includes('💡'), detail: 'Uses lightbulb (helpful tip icon)' },
])

// Scenario 9: Warning does not interfere with existing character counter
validate('Scenario 9: Warning does not interfere with character counter', [
  { test: formCode.includes('<CharacterCounter'), detail: 'Character counter still present' },
  { test: formCode.includes('current={acceptanceCriteriaCount}'), detail: 'Character counter receives count' },
  { test: formCode.includes('min={50}'), detail: 'Character counter has min prop' },
  { test: formCode.indexOf('<AcceptanceCriteriaQualityWarning') < formCode.indexOf('<CharacterCounter', formCode.indexOf('acceptanceCriteria')), detail: 'Warning positioned before counter' },
])

// Scenario 10: Warning message provides actionable guidance
validate('Scenario 10: Warning message provides actionable guidance', [
  { test: componentCode.includes('deliverables, quality standards, or success metrics'), detail: 'Mentions specific examples' },
  { test: componentCode.includes('prevent disputes'), detail: 'Explains benefit' },
  { test: componentCode.includes('Consider'), detail: 'Uses encouraging language ("Consider")' },
  { test: componentCode.includes('?'), detail: 'Phrased as question' },
  { test: !componentCode.includes('must') && !componentCode.includes('required'), detail: 'Not demanding/mandatory language' },
])

// Scenario 11: Warning state persists during form interaction
validate('Scenario 11: Warning state persists during form interaction', [
  { test: !formCode.includes('setAcHasInteracted(false)'), detail: 'No logic to reset hasInteracted' },
  { test: formCode.includes('const [acHasInteracted'), detail: 'State persists in component' },
])

// Scenario 12: Warning works correctly with copy-paste
validate('Scenario 12: Warning works correctly with copy-paste', [
  { test: formCode.includes('onChange={(e)'), detail: 'onChange handler present (triggers on paste)' },
  { test: formCode.includes('e.target.value.length'), detail: 'Calculates length from value (works with paste)' },
])

// Print results
console.log()
results.forEach((result, index) => {
  const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '🔍'
  console.log(`${icon} ${result.scenario}`)
  result.details.forEach(detail => console.log(`   ${detail}`))
  console.log()
})

// Summary
console.log('═'.repeat(70))
console.log('VALIDATION SUMMARY')
console.log('═'.repeat(70))

const passed = results.filter(r => r.status === 'PASS').length
const failed = results.filter(r => r.status === 'FAIL').length
const manual = results.filter(r => r.status === 'MANUAL').length

console.log(`Total scenarios: ${results.length}`)
console.log(`✅ Passed: ${passed}`)
console.log(`❌ Failed: ${failed}`)
console.log(`🔍 Manual testing required: ${manual}`)
console.log()

if (failed > 0) {
  console.log('❌ FAILED SCENARIOS:')
  results.filter(r => r.status === 'FAIL').forEach(r => {
    console.log(`   • ${r.scenario}`)
    r.details.filter(d => d.startsWith('✗')).forEach(d => console.log(`     ${d}`))
  })
  console.log()
}

// Additional acceptance criteria checks
console.log('═'.repeat(70))
console.log('ACCEPTANCE CRITERIA CHECKLIST')
console.log('═'.repeat(70))
console.log()

const acceptanceCriteria = [
  { test: componentCode.includes("'use client'"), desc: 'Component is client component' },
  { test: componentCode.includes('characterCount: number'), desc: 'Props include characterCount: number' },
  { test: componentCode.includes('hasInteracted: boolean'), desc: 'Props include hasInteracted: boolean' },
  { test: componentCode.includes('characterCount >= 50 && characterCount < 150 && hasInteracted'), desc: 'Conditional render logic correct' },
  { test: componentCode.includes('bg-amber-50 border border-amber-300 text-amber-800 rounded-md p-3 mb-2'), desc: 'Tailwind styling classes present' },
  { test: componentCode.includes('transition-opacity duration-200'), desc: 'Smooth fade transition' },
  { test: formCode.includes("import { AcceptanceCriteriaQualityWarning }"), desc: 'Component imported in form' },
  { test: formCode.includes('const [acHasInteracted, setAcHasInteracted] = useState(false)'), desc: 'Form tracks hasInteracted state' },
  { test: actionCode.includes('acceptanceCriteria.length < 50'), desc: 'Server-side validation unchanged' },
  { test: !actionCode.includes('150'), desc: 'No server-side 150 char validation' },
]

acceptanceCriteria.forEach(({ test, desc }) => {
  console.log(`${test ? '✓' : '✗'} ${desc}`)
})

console.log()
console.log('═'.repeat(70))

if (failed === 0) {
  console.log()
  console.log('✅ ALL AUTOMATED VALIDATIONS PASSED')
  console.log()
  console.log('📝 MANUAL TESTING CHECKLIST:')
  console.log()
  console.log('   1. Visual appearance:')
  console.log('      □ Warning has amber color scheme (not alarming)')
  console.log('      □ Warning has smooth fade in/out transition')
  console.log('      □ No layout shift when warning appears/disappears')
  console.log()
  console.log('   2. Interaction behavior:')
  console.log('      □ No warning on initial page load')
  console.log('      □ Warning appears when typing 50-149 characters')
  console.log('      □ Warning disappears at 150+ characters')
  console.log('      □ Warning works with copy-paste')
  console.log('      □ Warning state persists when switching fields')
  console.log()
  console.log('   3. Form submission:')
  console.log('      □ Form submits successfully with warning visible (75 chars)')
  console.log('      □ Gig is created in database')
  console.log('      □ Redirects to /dashboard after submission')
  console.log()
  console.log('   4. Accessibility:')
  console.log('      □ Screen reader announces warning (test with NVDA/JAWS)')
  console.log('      □ Keyboard navigation works correctly')
  console.log()
  console.log('🚀 To perform manual testing:')
  console.log('   1. Navigate to http://localhost:3005/register')
  console.log('   2. Register as CLIENT user')
  console.log('   3. Go to /dashboard/gigs/new')
  console.log('   4. Test acceptance criteria field behavior')
  console.log()
  process.exit(0)
} else {
  console.log()
  console.log('❌ VALIDATION FAILED')
  console.log('   Please fix the failed scenarios above before proceeding.')
  console.log()
  process.exit(1)
}
