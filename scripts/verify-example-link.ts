#!/usr/bin/env tsx

/**
 * Verification script for example link in gig creation form
 *
 * This script verifies that the example link has been correctly added
 * to the "Requirements & Success Criteria" section header.
 */

import fs from 'fs'
import path from 'path'

const FORM_FILE = path.join(process.cwd(), 'app/dashboard/gigs/new/gig-form.tsx')

interface VerificationResult {
  passed: boolean
  message: string
}

function verify(): VerificationResult[] {
  const results: VerificationResult[] = []

  // Read the form file
  const content = fs.readFileSync(FORM_FILE, 'utf-8')

  // Check 1: Flex layout in section header
  const hasFlexLayout = content.includes('<div className="flex items-center justify-between mb-2">')
  results.push({
    passed: hasFlexLayout,
    message: hasFlexLayout
      ? '✓ Section header uses flex layout with justify-between'
      : '✗ Section header missing flex layout'
  })

  // Check 2: Link element exists
  const hasLink = content.includes('<a')
  results.push({
    passed: hasLink,
    message: hasLink
      ? '✓ Link element exists'
      : '✗ Link element not found'
  })

  // Check 3: Link href attribute
  const hasHref = content.includes('href="/dashboard/gigs"')
  results.push({
    passed: hasHref,
    message: hasHref
      ? '✓ Link href="/dashboard/gigs" is correct'
      : '✗ Link href is missing or incorrect'
  })

  // Check 4: Link target="_blank"
  const hasTarget = content.includes('target="_blank"')
  results.push({
    passed: hasTarget,
    message: hasTarget
      ? '✓ Link opens in new tab (target="_blank")'
      : '✗ Link missing target="_blank"'
  })

  // Check 5: Link rel="noopener noreferrer"
  const hasRel = content.includes('rel="noopener noreferrer"')
  results.push({
    passed: hasRel,
    message: hasRel
      ? '✓ Link has security attributes (rel="noopener noreferrer")'
      : '✗ Link missing rel="noopener noreferrer"'
  })

  // Check 6: Link styling
  const hasCorrectStyling = content.includes('className="text-sm text-indigo-600 hover:text-indigo-800 underline"')
  results.push({
    passed: hasCorrectStyling,
    message: hasCorrectStyling
      ? '✓ Link has correct styling (text-sm, indigo colors, underline)'
      : '✗ Link styling is missing or incorrect'
  })

  // Check 7: Link text
  const hasCorrectText = content.includes('💡 View example gigs for inspiration')
  results.push({
    passed: hasCorrectText,
    message: hasCorrectText
      ? '✓ Link text is correct: "💡 View example gigs for inspiration"'
      : '✗ Link text is missing or incorrect'
  })

  // Check 8: Section heading still exists
  const hasHeading = content.includes('<h3 className="text-lg font-semibold text-gray-900">Requirements &amp; Success Criteria</h3>')
  results.push({
    passed: hasHeading,
    message: hasHeading
      ? '✓ Section heading is preserved'
      : '✗ Section heading is missing or modified'
  })

  // Check 9: Section description still exists
  const hasDescription = content.includes('Define what success looks like and help specialists understand your needs')
  results.push({
    passed: hasDescription,
    message: hasDescription
      ? '✓ Section description is preserved'
      : '✗ Section description is missing or modified'
  })

  return results
}

function main() {
  console.log('🔍 Verifying example link implementation...\n')

  const results = verify()
  const allPassed = results.every(r => r.passed)

  results.forEach(result => {
    console.log(result.message)
  })

  console.log('\n' + '='.repeat(60))

  if (allPassed) {
    console.log('✅ All verification checks passed!')
    console.log('\nImplementation summary:')
    console.log('- Link added to "Requirements & Success Criteria" section header')
    console.log('- Link opens /dashboard/gigs in new tab')
    console.log('- Link has correct styling and security attributes')
    console.log('- All existing form elements preserved')
    process.exit(0)
  } else {
    const failedCount = results.filter(r => !r.passed).length
    console.log(`❌ ${failedCount} verification check(s) failed`)
    process.exit(1)
  }
}

main()
