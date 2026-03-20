# Implementation Tasks: UI Page Backgrounds Token Migration

## Task 1: Update Auth Pages (Register & Login)

**Implementation Notes:**
- File: `app/register/page.tsx`
  - Find: `className="min-h-screen flex items-center justify-center bg-navy-900 px-4"`
  - Replace with: `className="min-h-screen flex items-center justify-center bg-surface-level-0 px-4"`
- File: `app/login/page.tsx`
  - Find: `className="min-h-screen flex items-center justify-center bg-navy-900 px-4"`
  - Replace with: `className="min-h-screen flex items-center justify-center bg-surface-level-0 px-4"`

**Test Plan:**
- Run: `npm run dev` and visually inspect `/register` and `/login` pages
- Assert: Page backgrounds appear identical to before (dark navy color)
- Assert: Form containers remain properly visible with good contrast
- Assert: All form fields remain functional (type, submit, validation)
- Run: `npm run test:e2e -- auth` (if auth E2E tests exist)
- Assert: All authentication E2E tests pass without modification

---

## Task 2: Update Homepage

**Implementation Notes:**
- File: `app/page.tsx`
  - Find: `className="min-h-screen flex items-center justify-center bg-navy-900"`
  - Replace with: `className="min-h-screen flex items-center justify-center bg-surface-level-0"`

**Test Plan:**
- Run: `npm run dev` and visit `/` (both logged out and logged in states)
- Assert: Page background appears identical to before
- Assert: "Get Started" and "Sign in" buttons remain visible and functional (logged out)
- Assert: "Go to Dashboard" and "Sign out" buttons remain visible and functional (logged in)
- Run: `npm run test:e2e -- homepage` (if homepage E2E tests exist)
- Assert: All homepage tests pass without modification

---

## Task 3: Update Dashboard Page

**Implementation Notes:**
- File: `app/(protected)/dashboard/page.tsx`
  - Find: `className="min-h-screen bg-navy-900"`
  - Replace with: `className="min-h-screen bg-surface-level-0"`

**Test Plan:**
- Run: `npm run dev` and visit `/dashboard` as both CLIENT and SPECIALIST
- Assert: Page background appears identical to before
- Assert: CLIENT dashboard shows "My Gigs" section with proper card visibility
- Assert: SPECIALIST dashboard shows tabs (Active Work, Pending Applications, Archive) with proper visibility
- Assert: All dashboard links and navigation remain functional
- Run: `npm run test:e2e -- dashboard` (if dashboard E2E tests exist)
- Assert: All dashboard tests pass without modification

---

## Task 4: Update Gig Browse Page

**Implementation Notes:**
- File: `app/(protected)/gigs/page.tsx`
  - Find: `className="min-h-screen bg-navy-900 py-8"`
  - Replace with: `className="min-h-screen bg-surface-level-0 py-8"`

**Test Plan:**
- Run: `npm run dev` and visit `/dashboard/gigs` as SPECIALIST
- Assert: Page background appears identical to before
- Assert: Gig cards remain properly visible with good contrast
- Assert: Filter panel remains functional (text search, tags, budget range, sort)
- Assert: Pagination controls remain functional
- Assert: Clicking gig cards navigates to detail pages correctly
- Run: `npm run test:integration -- gig-filtering`
- Assert: All gig filtering tests pass without modification
- Run: `npm run test:e2e -- gig-browse` (if gig browse E2E tests exist)
- Assert: All gig browse tests pass without modification

---

## Task 5: Update Admin Pages

**Implementation Notes:**
- File: `app/admin/layout.tsx`
  - Find: `className="min-h-screen bg-navy-900"`
  - Replace with: `className="min-h-screen bg-surface-level-0"`
- File: `app/admin/page.tsx`
  - Find: `className="min-h-screen bg-navy-900"`
  - Replace with: `className="min-h-screen bg-surface-level-0"`
- File: `app/admin/users/page.tsx`
  - Find: `className="min-h-screen bg-navy-900"` (page container)
  - Replace with: `className="min-h-screen bg-surface-level-0"`
  - Find: `className="bg-navy-900"` (table header)
  - Replace with: `className="bg-surface-level-0"`

**Test Plan:**
- Run: `npm run dev` and visit `/admin`, `/admin/users`, `/admin/gigs` as ADMIN
- Assert: Page backgrounds appear identical to before across all admin pages
- Assert: Statistics cards on admin dashboard remain visible
- Assert: User table on `/admin/users` remains readable with proper contrast
- Assert: Suspend/unsuspend actions remain functional
- Assert: Gig management actions remain functional
- Assert: Pagination on admin pages remains functional
- Run: `npm run test:integration -- admin` (if admin integration tests exist)
- Assert: All admin tests pass without modification

---

## Task 6: Update Shared Components

**Implementation Notes:**
- File: `app/components/PaginationControls.tsx`
  - Find: `className="px-3 py-2 text-sm font-medium text-gray-500 bg-navy-900 border border-gray-700 rounded-md cursor-not-allowed opacity-50 pointer-events-none"` (Previous button disabled state, line ~92)
  - Replace with: `className="px-3 py-2 text-sm font-medium text-gray-500 bg-surface-level-0 border border-gray-700 rounded-md cursor-not-allowed opacity-50 pointer-events-none"`
  - Find: `className="px-3 py-2 text-sm font-medium text-gray-500 bg-navy-900 border border-gray-700 rounded-md cursor-not-allowed opacity-50 pointer-events-none"` (Next button disabled state, line ~152)
  - Replace with: `className="px-3 py-2 text-sm font-medium text-gray-500 bg-surface-level-0 border border-gray-700 rounded-md cursor-not-allowed opacity-50 pointer-events-none"`
- File: `app/admin/users/SuspendUserForm.tsx`
  - Find: `className="w-full border border-gray-600 rounded-md px-3 py-2 bg-navy-900 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
  - Replace with: `className="w-full border border-gray-600 rounded-md px-3 py-2 bg-surface-level-0 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- File: `app/admin/users/UnsuspendUserForm.tsx`
  - Find: `className="w-full border border-gray-600 rounded-md px-3 py-2 bg-navy-900 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
  - Replace with: `className="w-full border border-gray-600 rounded-md px-3 py-2 bg-surface-level-0 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`

**Test Plan:**
- Run: `npm run dev` and test pagination on `/dashboard/gigs`, `/admin/users`, `/admin/gigs`
- Assert: Disabled pagination buttons (first page Previous, last page Next) appear identical to before
- Assert: Pagination navigation remains functional
- Run: `npm run dev` and test suspend/unsuspend forms on `/admin/users`
- Assert: Textarea inputs in suspend/unsuspend forms remain readable with proper contrast
- Assert: Form submission remains functional
- Run: `npm run test:integration -- pagination` (if pagination tests exist)
- Assert: All pagination tests pass without modification

---

## Task 7: Update Documentation

**Implementation Notes:**
- File: `docs/DESIGN_SYSTEM.md`
  - Find all instances of `bg-navy-900` in code examples (lines 92, 123, 220, 599)
  - Context review: Determine if each instance should be updated or kept as historical reference
  - Update migration guide examples to show `bg-navy-900` → `bg-surface-level-0` pattern
- File: `openspec/specs/ui/spec.md`
  - Find all instances of `bg-navy-900` in requirement scenarios (lines 124, 136, 142, 157, 235, 257, 305, 1493)
  - Replace with `bg-surface-level-0` in all requirement text and acceptance criteria
  - Ensure consistency across all UI specification scenarios

**Test Plan:**
- Run: `grep -r "bg-navy-900" docs/ openspec/specs/ui/`
- Assert: Only intentional references remain (e.g., "before" examples in migration guides)
- Run: `npm run build`
- Assert: Build completes successfully with no warnings
- Manual review: Read updated documentation to ensure clarity and accuracy

---

## Task 8: Verify Visual Consistency

**Implementation Notes:**
- Take screenshots of all affected pages before and after migration
- Compare screenshots pixel-by-pixel or visually
- Check that `bg-surface-level-0` resolves to the same color as `bg-navy-900` (#0A0E27)

**Test Plan:**
- Run: `npm run dev`
- Visit each affected page and visually compare to baseline:
  - `/` (logged out and logged in)
  - `/register`
  - `/login`
  - `/dashboard` (CLIENT and SPECIALIST)
  - `/dashboard/gigs` (SPECIALIST)
  - `/admin` (ADMIN)
  - `/admin/users` (ADMIN)
  - `/admin/gigs` (ADMIN)
- Assert: No visible differences in page background colors
- Assert: All text remains readable with proper contrast
- Assert: All UI elements (cards, forms, buttons) remain properly visible
- Optional: Use visual regression testing tool (Percy, Chromatic) if available

---

## Task 9: Run Full Test Suite

**Implementation Notes:**
- No code changes required for this task
- This is a verification step to ensure zero functional regressions

**Test Plan:**
- Run: `npm run test` (all unit and integration tests)
- Assert: All 521 tests pass without modification
- Assert: No new test failures introduced
- Assert: Test execution time remains similar to baseline
- Run: `npm run test:e2e` (all E2E tests)
- Assert: All E2E tests pass without modification
- Assert: No flaky tests or timeout issues
- Run: `npm run test:coverage`
- Assert: Code coverage remains at or above current levels

---

## Task 10: Verify Accessibility (Contrast Ratios)

**Implementation Notes:**
- Use browser DevTools or automated accessibility testing tools
- Verify WCAG AA compliance for all text on updated backgrounds
- Check contrast ratios for: white text, gray-300 text, gray-400 text, gray-500 text

**Test Plan:**
- Run: Browser DevTools Accessibility Inspector on each affected page
- Assert: White text (#FFFFFF) on `bg-surface-level-0` meets WCAG AA (contrast ratio ≥ 4.5:1)
- Assert: gray-300 text (#D1D5DB) on `bg-surface-level-0` meets WCAG AA
- Assert: gray-400 text (#9CA3AF) on `bg-surface-level-0` meets WCAG AA (for placeholder text)
- Assert: gray-500 text (#6B7280) on `bg-surface-level-0` meets WCAG AA (for secondary text)
- Optional: Run automated accessibility testing tool (axe, Lighthouse)
- Assert: No new accessibility violations introduced
- Document: Record contrast ratios for future reference

---

## Completion Checklist

- [ ] Task 1: Auth pages updated
- [ ] Task 2: Homepage updated
- [ ] Task 3: Dashboard page updated
- [ ] Task 4: Gig browse page updated
- [ ] Task 5: Admin pages updated
- [ ] Task 6: Shared components updated
- [ ] Task 7: Documentation updated
- [ ] Task 8: Visual consistency verified
- [ ] Task 9: Full test suite passes (521/521 tests)
- [ ] Task 10: Accessibility verified (WCAG AA compliance)

## Rollback Plan

If issues are discovered after deployment:

1. Revert all changes: `git revert <commit-hash>`
2. Verify rollback: `npm run test && npm run test:e2e`
3. Investigate root cause before re-attempting migration
4. Consider gradual rollout (feature flag) if issues persist
