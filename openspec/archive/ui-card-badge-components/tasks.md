# Implementation Tasks: Token-Based Card and Badge Styling

## Task 1: Analyze Design Token Availability
**Description:** Verify that the required design tokens exist in the design system and are properly configured in Tailwind.

**Implementation Notes:**
- Read `openspec/specs/ui/design-tokens.json` to identify available tokens
- Check `scripts/generated-tokens.js` to verify tokens are parsed correctly
- Identify token mappings for:
  - Surface levels (bg-surface-level-0, bg-surface-level-1, bg-surface-level-2, bg-surface-level-3)
  - Neutral colors (border-neutral-weak, border-neutral-default, text-neutral-strong)
  - Semantic colors (brand, info, warning, success, error)
- Document any missing tokens that need to be added or mapped differently
- If tokens don't exist with expected names, identify alternative tokens or document the need to use existing hardcoded classes with semantic naming

**Test Plan:**
- Run `npm run build` to verify Tailwind compiles without errors
- Check that token classes are available in the generated CSS
- Verify no "unknown utility class" warnings for token-based classes
- If tokens are missing, document which hardcoded classes to use as semantic equivalents

**Expected Outcome:**
- Clear mapping document showing: `bg-navy-800` → `bg-surface-level-1` (or equivalent)
- Confirmation that all required tokens are available in Tailwind config
- No build errors related to missing token classes

---

## Task 2: Update Gig Browse Page Cards
**Description:** Migrate gig card styling on the browse page (`/gigs`) to use design tokens.

**Implementation Notes:**
- File: `app/(protected)/gigs/page.tsx`
- Update card container classes (lines ~176-180):
  - Replace `bg-navy-800` with `bg-surface-level-1` (or identified token)
  - Replace `border-gray-700` with `border-neutral-weak`
  - Replace `hover:bg-navy-700` with `hover:bg-surface-level-2`
  - Replace `hover:border-gray-600` with `hover:border-neutral-default`
- Preserve all other classes (rounded-lg, p-6, transition-colors, etc.)
- Preserve all content structure (title, description, tags, budget, CTA button)
- Preserve Link wrapper and navigation functionality

**Test Plan:**
- Navigate to `/gigs` as a SPECIALIST user
- Verify gig cards render with correct styling
- Verify hover states work correctly (background and border change on hover)
- Verify cards are clickable and navigate to gig detail pages
- Verify filters and pagination still work
- Run existing E2E tests for gig browsing: `npm run test:e2e -- gig-browsing`
- Visual regression test: Compare screenshots before/after migration

**Expected Outcome:**
- Gig cards use token-based styling
- Visual appearance remains consistent
- All interactive functionality preserved
- No test failures

---

## Task 3: Update Client Dashboard Gig Cards
**Description:** Migrate gig card styling on the client dashboard to use design tokens.

**Implementation Notes:**
- File: `app/(protected)/dashboard/page.tsx`
- Update "My Gigs" card container classes (lines ~166-168):
  - Replace `bg-navy-900` with `bg-surface-level-2` (or identified token)
  - Replace `border-gray-700` with `border-neutral-weak`
  - Replace `hover:bg-navy-700` with `hover:bg-surface-level-3`
  - Replace `hover:border-gray-600` with `hover:border-neutral-default`
- Update status badge classes (lines ~172-180):
  - PAID: Replace `bg-success-500/20 text-success-400 border-success-500/30` with token-based classes
  - COMPLETED: Replace `bg-warning-500/20 text-warning-400 border-warning-500/30` with token-based classes
  - IN_PROGRESS: Replace `bg-blue-500/20 text-blue-400 border-blue-500/30` with token-based classes
  - Default: Replace `bg-gray-500/20 text-gray-400 border-gray-500/30` with token-based classes
- Preserve all content (title, budget, application count, dates)
- Preserve Link wrapper and navigation

**Test Plan:**
- Log in as a CLIENT user with existing gigs
- Navigate to `/dashboard`
- Verify "My Gigs" cards render correctly
- Verify status badges display correct colors for each status
- Verify hover states work on cards
- Verify clicking cards navigates to gig detail pages
- Verify payment status messages display correctly
- Run dashboard tests: `npm run test:unit -- dashboard`

**Expected Outcome:**
- Client dashboard gig cards use token-based styling
- Status badges use semantic color tokens
- All functionality preserved
- Tests pass

---

## Task 4: Update Specialist Dashboard Cards
**Description:** Migrate specialist dashboard card styling (Active Work, Pending Applications, Archive tabs) to use design tokens.

**Implementation Notes:**
- File: `app/(protected)/dashboard/SpecialistDashboardTabs.tsx`
- Update Active Work tab card classes (lines ~113-116):
  - Replace `bg-navy-900` with `bg-surface-level-2`
  - Replace `border-gray-700` with `border-neutral-weak`
  - Replace `hover:bg-navy-700` with `hover:bg-surface-level-3`
  - Replace `hover:border-gray-600` with `hover:border-neutral-default`
- Update status badge classes (lines ~130-138):
  - IN_PROGRESS: Use token-based info colors
  - REVIEW: Use token-based warning colors
  - COMPLETED: Use token-based success colors
- Update Pending Applications tab card classes (lines ~163-165): Same token replacements
- Update Archive tab card classes (lines ~203, ~238): Same token replacements
- Update archive status badges (lines ~219, ~243-246):
  - PAID: Use token-based success colors
  - WITHDRAWN: Use token-based neutral colors
  - REJECTED: Use token-based error colors
- Preserve all content and tab switching functionality

**Test Plan:**
- Log in as a SPECIALIST user with applications and active work
- Navigate to `/dashboard`
- Verify Active Work tab cards render correctly
- Verify Pending Applications tab cards render correctly
- Verify Archive tab cards render correctly
- Verify status badges display correct colors in each tab
- Verify tab switching works correctly
- Verify hover states work on all cards
- Verify clicking cards navigates to gig detail pages
- Run specialist dashboard tests

**Expected Outcome:**
- All specialist dashboard cards use token-based styling
- Status badges use semantic color tokens across all tabs
- Tab switching and navigation preserved
- Tests pass

---

## Task 5: Update Gig Detail Page Cards and Badges
**Description:** Migrate gig detail page styling (main gig card, application cards, status badges) to use design tokens.

**Implementation Notes:**
- File: `app/(protected)/gigs/[id]/page.tsx`
- Update main gig details card (line ~104):
  - Replace `bg-navy-800` with `bg-surface-level-1`
  - Replace `border-gray-700` with `border-neutral-weak`
- Update gig status badge (lines ~107-114):
  - PAID: Use token-based success colors
  - COMPLETED: Use token-based warning colors
  - Other statuses: Use token-based info/brand colors
- Update application cards (line ~324):
  - Replace `bg-navy-900` with `bg-surface-level-2`
  - Replace `border-gray-700` with `border-neutral-weak`
- Update application status badges (lines ~341-348):
  - ACCEPTED: Use token-based success colors
  - REJECTED: Use token-based error colors
  - WITHDRAWN: Use token-based neutral colors
  - PENDING: Use token-based warning colors
- Preserve all content structure (gig details, applications, messages)
- Preserve all forms (apply, submit work, approve work, mark as paid)

**Test Plan:**
- Navigate to a gig detail page as CLIENT (owner)
- Verify main gig card renders correctly
- Verify gig status badge displays correct color
- Verify application cards render correctly
- Verify application status badges display correct colors
- Navigate to a gig detail page as SPECIALIST (applicant)
- Verify apply form renders correctly
- Navigate to a gig detail page as SPECIALIST (assigned)
- Verify submit work form renders correctly
- Verify all interactive elements work (Accept/Reject buttons, forms)
- Run gig detail page tests: `npm run test:e2e -- gig-detail`

**Expected Outcome:**
- Gig detail page uses token-based styling throughout
- All status badges use semantic color tokens
- All forms and interactive elements preserved
- Tests pass

---

## Task 6: Update Design System Documentation
**Description:** Update the design system documentation to include token-based card and badge examples.

**Implementation Notes:**
- File: `docs/DESIGN_SYSTEM.md`
- Add new section: "Token-Based Card Patterns"
- Include before/after examples showing migration from hardcoded to token-based classes
- Add examples for:
  - Standard card with token-based styling
  - Clickable card with token-based hover states
  - Status badges with semantic color tokens
- Update "Migration Guide" section with card/badge migration examples
- Document token naming conventions for surfaces and semantic colors

**Test Plan:**
- Review documentation for clarity and accuracy
- Verify code examples are syntactically correct
- Verify token class names match actual available tokens
- Verify examples demonstrate best practices

**Expected Outcome:**
- Documentation includes comprehensive token-based card examples
- Migration guide helps developers understand token usage
- Examples are accurate and follow best practices

---

## Task 7: Visual Regression Testing
**Description:** Perform comprehensive visual regression testing to ensure token-based styling maintains visual consistency.

**Implementation Notes:**
- Test all pages with card and badge components:
  - `/gigs` (gig browse page)
  - `/dashboard` (CLIENT view)
  - `/dashboard` (SPECIALIST view - all tabs)
  - `/gigs/[id]` (gig detail page - various states)
- Compare visual appearance before and after migration
- Verify hover states, transitions, and interactive affordances
- Test on multiple screen sizes (mobile, tablet, desktop)
- Verify color contrast meets accessibility standards

**Test Plan:**
- Take screenshots of all affected pages before migration
- Take screenshots of all affected pages after migration
- Compare screenshots side-by-side
- Verify no unintended visual changes
- Test hover states manually
- Test on Chrome, Firefox, Safari
- Test on mobile viewport (320px width)
- Run accessibility audit: `npm run test:a11y` (if available)

**Expected Outcome:**
- Visual appearance is consistent with pre-migration state
- No unintended color or layout changes
- All hover states work correctly
- Accessibility standards maintained

---

## Task 8: Run Full Test Suite
**Description:** Run the complete test suite to ensure no regressions were introduced.

**Implementation Notes:**
- Run all unit tests: `npm run test:unit`
- Run all integration tests: `npm run test:integration`
- Run all E2E tests: `npm run test:e2e`
- Fix any test failures related to class name changes (if tests assert on specific classes)
- Verify all gig browsing, dashboard, and gig detail functionality works end-to-end

**Test Plan:**
- Execute: `npm run test:unit`
- Execute: `npm run test:integration`
- Execute: `npm run test:e2e`
- Review test output for failures
- Investigate and fix any failures
- Verify test coverage remains at acceptable levels

**Expected Outcome:**
- All tests pass
- No regressions in functionality
- Test coverage maintained or improved

---

## Summary

**Total Tasks:** 8
**Estimated Time:** 3-5 hours
**Dependencies:** Tasks should be completed in order (1 → 2 → 3 → 4 → 5 → 6 → 7 → 8)

**Critical Success Factors:**
1. Design tokens must be available and properly configured
2. Visual consistency must be maintained throughout migration
3. All interactive functionality must be preserved
4. All tests must pass after migration
5. Documentation must be updated to reflect new patterns
