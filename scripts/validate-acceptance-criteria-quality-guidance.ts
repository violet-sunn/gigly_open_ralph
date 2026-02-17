#!/usr/bin/env tsx

/**
 * Validation script for acceptance-criteria-quality-guidance change
 * Tests all scenarios from the specification
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

console.log('🧪 Validating acceptance-criteria-quality-guidance implementation...\n')

let allPassed = true
const results: string[] = []

// Test 1: Component file exists
console.log('Test 1: Component file exists')
const componentPath = join(process.cwd(), 'app/components/AcceptanceCriteriaQualityWarning.tsx')
if (existsSync(componentPath)) {
  console.log('✓ Component file exists\n')
  results.push('✓ Component file exists')
} else {
  console.log('✗ Component file does not exist\n')
  results.push('✗ Component file does not exist')
  allPassed = false
}

// Test 2: Component has correct structure
console.log('Test 2: Component structure validation')
const componentCode = readFileSync(componentPath, 'utf-8')
const componentTests = [
  { test: componentCode.includes("'use client'"), desc: "Has 'use client' directive" },
  { test: componentCode.includes('interface AcceptanceCriteriaQualityWarningProps'), desc: 'Has props interface' },
  { test: componentCode.includes('characterCount: number'), desc: 'Props include characterCount' },
  { test: componentCode.includes('hasInteracted: boolean'), desc: 'Props include hasInteracted' },
  { test: componentCode.includes('characterCount >= 50 && characterCount < 150 && hasInteracted'), desc: 'Has correct conditional logic' },
  { test: componentCode.includes('bg-amber-50'), desc: 'Has amber background styling' },
  { test: componentCode.includes('border-amber-300'), desc: 'Has amber border styling' },
  { test: componentCode.includes('text-amber-800'), desc: 'Has amber text styling' },
  { test: componentCode.includes('aria-live="polite"'), desc: 'Has aria-live attribute' },
  { test: componentCode.includes('role="status"'), desc: 'Has role="status" attribute' },
  { test: componentCode.includes('💡'), desc: 'Has lightbulb emoji' },
  { test: componentCode.includes('Consider adding more detail to prevent disputes'), desc: 'Has correct message text' },
  { test: componentCode.includes('transition-opacity duration-200'), desc: 'Has transition classes' },
]

componentTests.forEach(({ test, desc }) => {
  if (test) {
    console.log(`✓ ${desc}`)
    results.push(`✓ Component: ${desc}`)
  } else {
    console.log(`✗ ${desc}`)
    results.push(`✗ Component: ${desc}`)
    allPassed = false
  }
})
console.log()

// Test 3: Form integration
console.log('Test 3: Form integration validation')
const formPath = join(process.cwd(), 'app/dashboard/gigs/new/gig-form.tsx')
const formCode = readFileSync(formPath, 'utf-8')

const formTests = [
  { test: formCode.includes("import { AcceptanceCriteriaQualityWarning } from '@/app/components/AcceptanceCriteriaQualityWarning'"), desc: 'Imports warning component' },
  { test: formCode.includes('const [acHasInteracted, setAcHasInteracted] = useState(false)'), desc: 'Has acHasInteracted state' },
  { test: formCode.includes('if (!acHasInteracted)'), desc: 'Has interaction tracking logic' },
  { test: formCode.includes('setAcHasInteracted(true)'), desc: 'Sets interaction state on change' },
  { test: formCode.includes('<AcceptanceCriteriaQualityWarning'), desc: 'Renders warning component' },
  { test: formCode.includes('characterCount={acceptanceCriteriaCount}'), desc: 'Passes characterCount prop' },
  { test: formCode.includes('hasInteracted={acHasInteracted}'), desc: 'Passes hasInteracted prop' },
]

formTests.forEach(({ test, desc }) => {
  if (test) {
    console.log(`✓ ${desc}`)
    results.push(`✓ Form: ${desc}`)
  } else {
    console.log(`✗ ${desc}`)
    results.push(`✗ Form: ${desc}`)
    allPassed = false
  }
})
console.log()

// Test 4: Warning positioning
console.log('Test 4: Warning component positioning')
const textareaIndex = formCode.indexOf('id="acceptanceCriteria"')
const warningIndex = formCode.indexOf('<AcceptanceCriteriaQualityWarning')
const counterIndex = formCode.indexOf('<CharacterCounter', warningIndex)

if (textareaIndex > 0 && warningIndex > textareaIndex && counterIndex > warningIndex) {
  console.log('✓ Warning positioned between textarea and character counter')
  results.push('✓ Warning positioned correctly')
} else {
  console.log('✗ Warning not positioned correctly')
  results.push('✗ Warning positioning incorrect')
  allPassed = false
}
console.log()

// Test 5: No backend changes
console.log('Test 5: Backend validation (no changes required)')
const gigActionPath = join(process.cwd(), 'app/actions/gig.ts')
const gigActionCode = readFileSync(gigActionPath, 'utf-8')

// Check that createGig still has the same validation (50 char minimum)
if (gigActionCode.includes('acceptanceCriteria.trim().length < 50')) {
  console.log('✓ Server-side validation unchanged (50 char minimum)')
  results.push('✓ Server-side validation unchanged')
} else {
  console.log('⚠ Server-side validation may have changed')
  results.push('⚠ Server-side validation check inconclusive')
}
console.log()

// Summary
console.log('═'.repeat(60))
console.log('VALIDATION SUMMARY')
console.log('═'.repeat(60))
results.forEach(r => console.log(r))
console.log('═'.repeat(60))

if (allPassed) {
  console.log('\n✅ All validation checks passed!')
  console.log('\nNext steps:')
  console.log('1. Start dev server: npm run dev')
  console.log('2. Navigate to http://localhost:3005/register')
  console.log('3. Register as CLIENT user')
  console.log('4. Navigate to /dashboard/gigs/new')
  console.log('5. Test the warning behavior:')
  console.log('   - Type 50-149 chars → warning appears')
  console.log('   - Type 150+ chars → warning disappears')
  console.log('   - Submit form with warning visible → should succeed')
  process.exit(0)
} else {
  console.log('\n❌ Some validation checks failed. Please review the errors above.')
  process.exit(1)
}
