# Implementation Tasks: UI Dashboard Pages Token Migration

## Task 1: Audit Design Tokens for Required Colors
**Description:** Verify that all required color tokens exist in `design-tokens.json` before starting implementation.

**Implementation Notes:**
- Read `openspec/specs/ui/design-tokens.json`
- Verify existence of:
  - `bg-surface-level-1` (primary card background)
  - `bg-surface-level-2` (nested card background)
  - `border-neutral-weak` (subtle borders)
  - `bg-success-weak-default`, `text-success-default`, `border-success-default` (green status badges)
  - `bg-warning-weak-default`, `text-warning-default`, `border-warning-default` (warning status badges)
  - `bg-danger-weak-default`, `text-danger-default`, `border-danger-default` (danger status badges)
  - `bg-blue-500`, `hover:bg-blue-600` (primary CTAs)
- Check Tailwind config to ensure tokens are properly integrated
- Document any missing tokens that need to be added

**Test Plan:**
- Run `node scripts/parse-design-tokens.js` to regenerate Tailwind config
- Verify no errors during token parsing
- Check that all required utility classes are available in Tailwind output
- If tokens are missing, add them to design-tokens.json and regenerate

**Expected Outcome:**
All required design tokens are available and integrated into Tailwind config.

---

## Task 2: Migrate CLIENT Dashboard Card Hierarchy
**Description:** Replace hardcoded colors with design tokens in CLIENT dashboard main content area.

**Implementation Notes:**
- File: `app/(protected)/dashboard/page.tsx`
- Update "My Gigs" section container:
  - Replace `bg-navy-800 border border-gray-700` with `bg-surface-level-1 border border-neutral-weak`
- Update individual gig cards (lines 165-198):
  - Replace `bg-surface-level-2 border border-neutral-weak` (already using tokens, verify consistency)
  - Ensure hover states use `hover:bg-navy-700 hover:border-neutral-strong` or token equivalents
- Update welcome card (lines 115-123):
  - Replace `bg-navy-800 border border-gray-700` with `bg-surface-level-1 border border-neutral-weak`
- Preserve all existing functionality, text, and navigation

**Test Plan:**
- Visual inspection: verify card hierarchy creates depth perception
- Run `npm run dev` and navigate to CLIENT dashboard
- Verify all cards render with correct token-based colors
- Test hover states on gig cards
- Click through all navigation links to ensure they work
- Run `npm run test:e2e -- client-journey` to verify no regressions

**Expected Outcome:**
CLIENT dashboard uses token-based card hierarchy with clear visual depth.

---

## Task 3: Migrate CLIENT Dashboard Status Badges
**Description:** Update status badge colors to use semantic color system consistently.

**Implementation Notes:**
- File: `app/(protected)/dashboard/page.tsx`
- Update status badge logic (lines 172-181):
  - PAID: `bg-success-weak-default text-success-default border-success-default`
  - COMPLETED: `bg-warning-weak-default text-warning-default border-warning-default`
  - IN_PROGRESS: `bg-success-weak-default text-success-default border-success-default` (green for active work)
  - OPEN: `bg-gray-500/20 text-gray-400 border-gray-500/30`
- Verify status text remains unchanged ("Paid", "Completed", "IN_PROGRESS")
- Ensure badge styling remains consistent: `text-xs px-2 py-1 rounded-md border font-medium`

**Test Plan:**
- Create test gigs with different statuses (OPEN, IN_PROGRESS, COMPLETED, PAID)
- Navigate to CLIENT dashboard
- Verify each status badge uses correct semantic colors
- Verify badge text is readable (contrast check)
- Run `npm run test:e2e -- client-journey` to verify no regressions

**Expected Outcome:**
Status badges use consistent semantic colors across all gig statuses.

---

## Task 4: Migrate CLIENT Dashboard Spacing
**Description:** Update spacing to follow design system rhythm (36-48px gaps, 20-24px padding).

**Implementation Notes:**
- File: `app/(protected)/dashboard/page.tsx`
- Update main container spacing (line 108):
  - Verify `space-y-6` (24px) is appropriate or adjust to `gap-9` (36px) or `gap-12` (48px)
- Update grid gap (line 142):
  - Verify `gap-6` (24px) is appropriate for sidebar separation
- Update card padding:
  - Primary cards: verify `p-8` (32px) for generous spacing (lines 115, 144)
  - Nested gig cards: verify `p-6` (24px) or adjust to `p-4` (16px) if needed (line 168)
  - Sidebar cards: verify `p-6` (24px) (lines 207, 228, 242)
- Update card list spacing:
  - Verify `space-y-6` for gig list (line 163)

**Test Plan:**
- Visual inspection: verify spacing creates clear rhythm
- Measure spacing with browser dev tools
- Compare with Figma prototype spacing
- Verify responsive behavior on mobile (320px width)
- Run `npm run test:e2e -- client-journey` to verify no layout regressions

**Expected Outcome:**
Dashboard spacing follows consistent rhythm with clear visual separation.

---

## Task 5: Migrate CLIENT Dashboard CTAs
**Description:** Update primary action buttons and sidebar CTA card to use design tokens.

**Implementation Notes:**
- File: `app/(protected)/dashboard/page.tsx`
- Update "Post New Gig" button (lines 147-152):
  - Verify `bg-blue-500 hover:bg-blue-600` (solid blue #1379f3)
  - Verify `text-white` for contrast
  - Verify focus state: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900`
- Update "Find Project" sidebar card (lines 206-225):
  - Verify `bg-blue-500/10 border border-blue-500/20` for gradient effect
  - Verify icon background: `bg-blue-500/20`
  - Verify CTA button: `bg-blue-500 hover:bg-blue-600`
- Preserve all button text exactly as-is

**Test Plan:**
- Visual inspection: verify CTAs are visually prominent
- Test hover states on all buttons
- Test focus states with keyboard navigation (Tab key)
- Verify button text unchanged
- Click all CTAs to verify navigation works
- Run `npm run test:e2e -- client-journey` to verify no regressions

**Expected Outcome:**
Primary CTAs use solid blue with proper hover/focus states, sidebar CTA uses gradient.

---

## Task 6: Migrate SPECIALIST Dashboard Card Hierarchy
**Description:** Replace hardcoded colors with design tokens in SPECIALIST dashboard tabs component.

**Implementation Notes:**
- File: `app/(protected)/dashboard/SpecialistDashboardTabs.tsx`
- Update tab container cards (lines 101, 150, 184):
  - Replace `bg-navy-800 border border-gray-700` with `bg-surface-level-1 border border-neutral-weak`
- Update individual gig/application cards:
  - Active Work tab (lines 113-142): verify `bg-surface-level-2 border border-neutral-weak`
  - Pending Applications tab (lines 162-177): verify `bg-surface-level-2 border border-neutral-weak`
  - Archive tab (lines 200-224, 236-259): verify `bg-surface-level-2 border border-neutral-weak`
- Ensure hover states use token equivalents
- Preserve all tab labels and functionality

**Test Plan:**
- Navigate to SPECIALIST dashboard
- Switch between all three tabs (Active Work, Pending Applications, Archive)
- Verify card hierarchy creates depth perception
- Test hover states on all cards
- Click through cards to verify navigation works
- Run `npm run test:e2e -- specialist-journey` to verify no regressions

**Expected Outcome:**
SPECIALIST dashboard tabs use token-based card hierarchy with clear visual depth.

---

## Task 7: Migrate SPECIALIST Dashboard Status Badges
**Description:** Update status badge colors in tabs component to use semantic color system.

**Implementation Notes:**
- File: `app/(protected)/dashboard/SpecialistDashboardTabs.tsx`
- Update Active Work tab status badges (lines 130-139):
  - IN_PROGRESS: `bg-success-weak-default text-success-default border-success-default` (green)
  - REVIEW: `bg-warning-weak-default text-warning-default border-warning-default`
  - COMPLETED: `bg-success-weak-default text-success-default border-success-default`
- Update Pending Applications tab badges (line 169):
  - PENDING: `bg-warning-weak-default text-warning-default border-warning-default`
- Update Archive tab badges (lines 219, 243-246):
  - PAID: `bg-success-weak-default text-success-default border-success-default`
  - REJECTED: `bg-danger-weak-default text-danger-default border-danger-default`
  - WITHDRAWN: `bg-gray-500/20 text-gray-400 border-gray-500/30`
- Verify status text remains unchanged

**Test Plan:**
- Create test data with various statuses
- Navigate to SPECIALIST dashboard
- Switch through all tabs
- Verify each status badge uses correct semantic colors
- Verify badge text is readable (contrast check)
- Run `npm run test:e2e -- specialist-journey` to verify no regressions

**Expected Outcome:**
Status badges use consistent semantic colors across all tabs.

---

## Task 8: Migrate SPECIALIST Dashboard Spacing
**Description:** Update spacing in tabs component to follow design system rhythm.

**Implementation Notes:**
- File: `app/(protected)/dashboard/SpecialistDashboardTabs.tsx`
- Update tab container spacing (line 61):
  - Verify `space-y-6` (24px) between tab nav and content
- Update card list spacing:
  - Active Work: verify `space-y-4` (16px) for card list (line 111)
  - Pending Applications: verify `space-y-4` (line 160)
  - Archive: verify `space-y-6` (line 193) for section separation
- Update card padding:
  - Tab container cards: verify `p-6` (24px) (lines 101, 150, 184)
  - Individual cards: verify `p-4` (16px) (lines 115, 164, 202, 237)

**Test Plan:**
- Visual inspection: verify spacing creates clear rhythm
- Measure spacing with browser dev tools
- Compare with Figma prototype spacing
- Verify responsive behavior on mobile
- Run `npm run test:e2e -- specialist-journey` to verify no layout regressions

**Expected Outcome:**
Tabs component spacing follows consistent rhythm with clear visual separation.

---

## Task 9: Migrate SPECIALIST Dashboard Sidebar
**Description:** Update sidebar cards in SPECIALIST dashboard to use design tokens.

**Implementation Notes:**
- File: `app/(protected)/dashboard/page.tsx` (SPECIALIST section, lines 315-377)
- Update "Find Project" card (lines 317-335):
  - Verify `bg-blue-500/10 border border-blue-500/20`
  - Verify icon background: `bg-blue-500/20`
  - Verify CTA button: `bg-blue-500 hover:bg-blue-600`
- Update "Finances" card (lines 338-349):
  - Replace `bg-navy-800 border border-gray-700` with `bg-surface-level-1 border border-neutral-weak`
- Update "Messages" card (lines 352-376):
  - Replace `bg-navy-800 border border-gray-700` with `bg-surface-level-1 border border-neutral-weak`
- Preserve all card content and functionality

**Test Plan:**
- Navigate to SPECIALIST dashboard
- Verify all sidebar cards render with correct token-based colors
- Test "Browse Gigs" button navigation
- Test message links navigation
- Verify hover states on message items
- Run `npm run test:e2e -- specialist-journey` to verify no regressions

**Expected Outcome:**
SPECIALIST sidebar uses consistent token-based styling matching CLIENT sidebar.

---

## Task 10: Run Full E2E Test Suite
**Description:** Execute complete E2E test suite to verify zero functional regressions.

**Implementation Notes:**
- Run all E2E tests for both CLIENT and SPECIALIST journeys
- Verify no test failures related to styling changes
- Check for any broken selectors or assertions
- Verify tab switching, navigation, and all interactive elements work

**Test Plan:**
```bash
# Run CLIENT journey tests
npm run test:e2e -- client-journey

# Run SPECIALIST journey tests
npm run test:e2e -- specialist-journey

# Run full E2E suite
npm run test:e2e
```

**Expected Outcome:**
- All E2E tests pass without modification
- No functional regressions introduced
- All navigation and interactions work identically to before migration

---

## Task 11: Visual Verification Against Figma Prototype
**Description:** Perform side-by-side comparison with Figma prototype to verify visual hierarchy.

**Implementation Notes:**
- Open Figma prototype: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4032-181
- Open local development server: `npm run dev`
- Compare CLIENT dashboard:
  - Card hierarchy (primary vs nested cards)
  - Status badge colors
  - Spacing rhythm
  - CTA prominence
- Compare SPECIALIST dashboard:
  - Tabs layout and styling
  - Card hierarchy within tabs
  - Status badge colors
  - Spacing rhythm
- Document any discrepancies

**Test Plan:**
- Take screenshots of both dashboards
- Compare with Figma prototype screenshots
- Verify visual hierarchy matches conceptually (not pixel-perfect)
- Check spacing measurements with browser dev tools
- Verify color values match design tokens
- Get stakeholder approval if needed

**Expected Outcome:**
Visual hierarchy matches Figma prototype conceptually, creating clear depth and organization.

---

## Task 12: Accessibility Audit
**Description:** Verify that token migration maintains accessibility standards.

**Implementation Notes:**
- Test keyboard navigation through all dashboard elements
- Verify focus states are visible on all interactive elements
- Test with screen reader (NVDA or JAWS)
- Check color contrast ratios for all text/background combinations
- Verify ARIA labels remain intact

**Test Plan:**
- Keyboard navigation test:
  - Tab through all interactive elements
  - Verify focus indicators are visible
  - Verify tab order is logical
- Screen reader test:
  - Navigate dashboard with screen reader
  - Verify all content is announced correctly
  - Verify status badges are announced with context
- Contrast check:
  - Use browser dev tools or WebAIM contrast checker
  - Verify all text meets WCAG AA standards (4.5:1 for normal text)
  - Verify status badges have sufficient contrast

**Expected Outcome:**
- All interactive elements are keyboard accessible
- Focus states are clearly visible
- Screen reader announces all content correctly
- All text meets WCAG AA contrast standards

---

## Summary

**Total Tasks:** 12

**Estimated Effort:** 4-6 hours

**Critical Path:**
1. Task 1 (token audit) must complete first
2. Tasks 2-5 (CLIENT dashboard) can proceed in parallel
3. Tasks 6-9 (SPECIALIST dashboard) can proceed in parallel
4. Tasks 10-12 (testing/verification) must complete last

**Success Criteria:**
- All dashboard pages use design tokens exclusively
- Visual hierarchy matches Figma prototype conceptually
- All E2E tests pass without modification
- Zero functional regressions
- Accessibility standards maintained
