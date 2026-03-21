# Tasks: ui-migration-validation

## Task 1: Create grep audit script for old color patterns

**Implementation:**
- Create `scripts/validate-token-migration.sh` bash script
- Search for old color patterns: `bg-navy-900`, `bg-navy-800`, `text-gray-*`, `border-gray-*`, `placeholder:text-gray-400`, `focus:ring-offset-navy-900`
- Exclude `docs/` and `archive/` directories from search
- Use `grep -r` with appropriate flags for recursive search
- Output clear results: list of files with matches or "✓ No old colors found"
- Exit with code 0 if zero matches, code 1 if matches found
- Add npm script `npm run validate:tokens` to package.json

**Test Plan:**
- Run `npm run validate:tokens` and verify it executes without errors
- Verify script excludes docs/ and archive/ directories
- Verify script exits with code 0 when no matches found
- Verify script exits with code 1 and lists files when matches found
- Test with intentional old color in test file, verify detection

## Task 2: Execute grep audit and document results

**Implementation:**
- Run `npm run validate:tokens` script
- Capture full output
- If matches found:
  - Review each match to determine if intentional or oversight
  - Document intentional hardcoded fallbacks in DESIGN_SYSTEM.md
  - Create follow-up tasks for any unintentional matches
- If zero matches:
  - Document successful validation in task completion notes

**Test Plan:**
- Verify grep audit completes successfully
- Verify all matches (if any) are reviewed and categorized
- Verify intentional fallbacks are documented with rationale
- Verify no false positives (e.g., comments, documentation)

## Task 3: Run full test suite and verify all tests pass

**Implementation:**
- Run `npm test` to execute all tests
- Verify test count matches expected 521 tests
- Capture test output and results
- If any tests fail:
  - Investigate failures related to token migration
  - Document failures and create follow-up tasks
- If all tests pass:
  - Document successful test suite validation

**Test Plan:**
- Verify `npm test` executes all 521 tests
- Verify zero test failures
- Verify zero skipped tests
- Verify test output shows clear pass/fail status
- Verify tests cover token-based styling scenarios

## Task 4: Perform visual regression testing

**Implementation:**
- Identify all user-facing pages for testing:
  - Landing page (/)
  - Login (/login)
  - Register (/register)
  - Client dashboard (/dashboard)
  - Specialist dashboard (/dashboard)
  - Gig browse (/dashboard/gigs)
  - Gig detail (/dashboard/gigs/[id])
  - Gig creation (/dashboard/gigs/new)
  - Profile pages (/dashboard/profile)
  - Admin dashboard (/admin)
  - Admin user management (/admin/users)
  - Admin gig management (/admin/gigs)
- Manually navigate to each page and verify:
  - Colors match design token values
  - No visual inconsistencies or regressions
  - Hover states work correctly
  - Focus states are visible
  - Dark backgrounds use correct tokens
  - Light text on dark backgrounds is readable
- Take screenshots for documentation (optional)
- Document any visual issues found

**Test Plan:**
- Verify all pages render without console errors
- Verify consistent color usage across all pages
- Verify no hardcoded colors visible in rendered output
- Verify interactive states (hover, focus, active) work correctly
- Verify accessibility: color contrast, focus indicators

## Task 5: Run accessibility audit

**Implementation:**
- Use browser DevTools Lighthouse to run accessibility audits on key pages
- Focus on color contrast ratios (WCAG AA: 4.5:1 for normal text, 3:1 for large text)
- Verify focus indicators are visible on all interactive elements
- Check that color is not the only means of conveying information
- Document accessibility score for each page
- Document any accessibility issues found

**Test Plan:**
- Verify Lighthouse accessibility score ≥90 on all pages
- Verify all color contrast ratios meet WCAG AA standards
- Verify focus indicators are visible and consistent
- Verify no color-only information conveyance
- Verify keyboard navigation works correctly

## Task 6: Update DESIGN_SYSTEM.md with migration status

**Implementation:**
- Add "Migration Status" section to DESIGN_SYSTEM.md
- Document validation date
- State whether migration is 100% complete
- List any intentional hardcoded fallbacks with:
  - File path and line number
  - Rationale for hardcoded value
  - Plan for eventual token migration (if applicable)
- Document validation procedures for future reference
- Add link to validation script in documentation

**Test Plan:**
- Verify DESIGN_SYSTEM.md includes "Migration Status" section
- Verify section includes validation date
- Verify section clearly states completion status
- Verify all hardcoded fallbacks are documented with rationale
- Verify documentation is clear and actionable

## Task 7: Create validation summary report

**Implementation:**
- Create summary document with validation results:
  - Grep audit results (zero matches or documented exceptions)
  - Test suite results (521/521 passing)
  - Visual regression results (all pages consistent)
  - Accessibility audit results (scores and issues)
  - Overall migration completion status
- Include recommendations for maintaining token-based styling
- Document validation script usage for future checks

**Test Plan:**
- Verify summary report is complete and accurate
- Verify all validation steps are documented
- Verify recommendations are actionable
- Verify report can be used as reference for future validations
