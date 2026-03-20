# Implementation Tasks: UI Admin Pages Token Migration

## Task 1: Migrate Admin Dashboard Statistics Cards
**Description:** Replace hardcoded colors with design tokens in admin dashboard statistics cards.

**Implementation Notes:**
- File: `app/admin/page.tsx`
- Update statistics card containers (lines 28-46):
  - Replace `bg-navy-800 border border-gray-700` with `bg-surface-level-1 border border-neutral-weak`
  - Verify padding `p-8` (32px) for generous spacing
  - Verify rounded corners `rounded-lg`
- Update error-colored statistics (Suspended Users, Closed Gigs):
  - Verify `text-error-500` for count display (lines 40, 45)
- Update grid layout:
  - Verify `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6` (line 27)
- Preserve all text labels and count displays

**Test Plan:**
- Navigate to `/admin` as ADMIN user
- Verify all four statistics cards render with token-based colors
- Verify error-colored counts (Suspended Users, Closed Gigs) are visually distinct
- Verify grid layout responsive behavior (1 col mobile, 2 cols tablet, 4 cols desktop)
- Verify card spacing matches Dashboard pattern (gap-6)
- Run `npm run test:e2e -- admin-moderation` to verify no regressions

**Expected Outcome:**
Admin dashboard statistics cards use token-based styling matching Dashboard card hierarchy.

---

## Task 2: Migrate Admin Dashboard Navigation Cards
**Description:** Update navigation cards (User Management, Gig Management) to use design tokens.

**Implementation Notes:**
- File: `app/admin/page.tsx`
- Update navigation card containers (lines 50-65):
  - Replace `bg-navy-800 border border-gray-700` with `bg-surface-level-1 border border-neutral-weak`
  - Verify hover state: `hover:border-blue-500` (already using token-compatible color)
  - Verify padding `p-8` (32px)
  - Verify transition: `transition-colors duration-200`
- Update grid layout:
  - Verify `grid grid-cols-1 md:grid-cols-2 gap-6` (line 49)
- Preserve all heading and description text

**Test Plan:**
- Navigate to `/admin` as ADMIN user
- Verify both navigation cards render with token-based colors
- Test hover states on both cards (border should change to blue)
- Click both cards to verify navigation works
- Verify grid layout responsive behavior (1 col mobile, 2 cols desktop)
- Run `npm run test:e2e -- admin-moderation` to verify no regressions

**Expected Outcome:**
Navigation cards use token-based styling with proper hover states.

---

## Task 3: Migrate User Management Filter Panel
**Description:** Update filter panel card to use design tokens.

**Implementation Notes:**
- File: `app/admin/users/page.tsx`
- Update filter panel container (lines 85-87):
  - Replace `bg-navy-800 border border-gray-700` with `bg-surface-level-1 border border-neutral-weak`
  - Verify padding `p-6` (24px)
  - Verify rounded corners `rounded-lg shadow-md`
  - Verify margin bottom `mb-6`
- Filter component (`UserFilters.tsx`) should maintain existing styling
- Preserve all filter labels and functionality

**Test Plan:**
- Navigate to `/admin/users` as ADMIN user
- Verify filter panel renders with token-based colors
- Test all filter options (role: CLIENT/SPECIALIST/ADMIN, status: active/suspended)
- Verify filter submission works correctly
- Verify URL parameters update correctly
- Run `npm run test:e2e -- admin-moderation` to verify no regressions

**Expected Outcome:**
Filter panel uses token-based styling matching Dashboard filter panels.

---

## Task 4: Migrate User Management Table Container
**Description:** Update table container to use design tokens.

**Implementation Notes:**
- File: `app/admin/users/page.tsx`
- Update table container (lines 95-158):
  - Replace `bg-navy-800 border border-gray-700` with `bg-surface-level-1 border border-neutral-weak`
  - Verify rounded corners `rounded-lg overflow-hidden shadow-md`
- Update table header (lines 97-114):
  - Replace `bg-navy-900` with `bg-surface-level-0` or keep as-is for contrast
  - Verify text color `text-gray-300` for column headers
- Update table body (lines 116-150):
  - Replace `bg-navy-800` with `bg-surface-level-1`
  - Verify divider color `divide-gray-700` or replace with `divide-neutral-weak`
- Preserve all table structure, column headers, and cell content

**Test Plan:**
- Navigate to `/admin/users` as ADMIN user
- Verify table container renders with token-based colors
- Verify table header has appropriate contrast
- Verify table rows are readable
- Verify pagination works correctly
- Test with various filter combinations
- Run `npm run test:e2e -- admin-moderation` to verify no regressions

**Expected Outcome:**
Table container uses token-based styling with clear visual hierarchy.

---

## Task 5: Verify User Management Status Badges
**Description:** Verify status badges use semantic color system (already implemented, just verify).

**Implementation Notes:**
- File: `app/admin/users/page.tsx`
- Verify status badge colors (lines 128-136):
  - Suspended: `bg-error-500/10 text-error-400` (red, semantic)
  - Active: `bg-success-500/10 text-success-400` (green, semantic)
- These already use semantic tokens, just verify they match Dashboard patterns
- Verify badge styling: `px-2 py-1 text-xs font-medium rounded-full`

**Test Plan:**
- Navigate to `/admin/users` as ADMIN user
- Create test users with both suspended and active statuses
- Verify suspended badges display in red
- Verify active badges display in green
- Verify badge text is readable (contrast check)
- Compare with Dashboard status badges for consistency

**Expected Outcome:**
Status badges use semantic colors consistently with Dashboard patterns.

---

## Task 6: Migrate User Management Action Buttons
**Description:** Update suspend/unsuspend action buttons to use appropriate semantic colors.

**Implementation Notes:**
- Files: `app/admin/users/SuspendUserForm.tsx`, `app/admin/users/UnsuspendUserForm.tsx`
- SuspendUserForm button:
  - Should use red/error color: `bg-error-500 hover:bg-error-600 text-white`
  - Verify focus state: `focus:ring-2 focus:ring-error-500`
  - Button text: "Suspend" (preserve exactly)
- UnsuspendUserForm button:
  - Should use green/success color: `bg-success-500 hover:bg-success-600 text-white`
  - Verify focus state: `focus:ring-2 focus:ring-success-500`
  - Button text: "Unsuspend" (preserve exactly)
- Verify loading states show appropriate text ("Suspending...", "Unsuspending...")

**Test Plan:**
- Navigate to `/admin/users` as ADMIN user
- Test suspend action on active user
- Verify button uses red color
- Verify loading state shows "Suspending..."
- Verify action completes successfully
- Test unsuspend action on suspended user
- Verify button uses green color
- Verify loading state shows "Unsuspending..."
- Verify action completes successfully
- Run `npm run test:e2e -- admin-moderation` to verify suspend/unsuspend flows

**Expected Outcome:**
Action buttons use semantic colors (red for suspend, green for unsuspend) with proper states.

---

## Task 7: Migrate Gig Management Filter Panel
**Description:** Update filter panel card to use design tokens.

**Implementation Notes:**
- File: `app/admin/gigs/page.tsx`
- Update filter panel container (lines 87-89):
  - Replace `bg-navy-800 border border-gray-700` with `bg-surface-level-1 border border-neutral-weak`
  - Verify padding `p-6` (24px)
  - Verify rounded corners `rounded-lg shadow-md`
  - Verify margin bottom `mb-6`
- Filter component (`GigFilters.tsx`) should maintain existing styling
- Preserve all filter labels and functionality

**Test Plan:**
- Navigate to `/admin/gigs` as ADMIN user
- Verify filter panel renders with token-based colors
- Test all filter options (status: OPEN/IN_PROGRESS/REVIEW/COMPLETED/PAID, closed: true/false)
- Verify filter submission works correctly
- Verify URL parameters update correctly
- Run `npm run test:e2e -- admin-moderation` to verify no regressions

**Expected Outcome:**
Filter panel uses token-based styling matching user management filter panel.

---

## Task 8: Migrate Gig Management Table Container
**Description:** Update table container to use design tokens.

**Implementation Notes:**
- File: `app/admin/gigs/page.tsx`
- Update table container (lines 97-164):
  - Replace `bg-navy-800 border border-gray-700` with `bg-surface-level-1 border border-neutral-weak`
  - Verify rounded corners `rounded-lg overflow-hidden shadow-md`
- Update table header (lines 99-119):
  - Replace `bg-navy-900` with `bg-surface-level-0` or keep as-is for contrast
  - Verify text color `text-gray-300` for column headers
- Update table body (lines 121-156):
  - Replace `bg-navy-800` with `bg-surface-level-1`
  - Verify divider color `divide-gray-700` or replace with `divide-neutral-weak`
- Preserve all table structure, column headers, and cell content

**Test Plan:**
- Navigate to `/admin/gigs` as ADMIN user
- Verify table container renders with token-based colors
- Verify table header has appropriate contrast
- Verify table rows are readable
- Verify pagination works correctly
- Test with various filter combinations
- Run `npm run test:e2e -- admin-moderation` to verify no regressions

**Expected Outcome:**
Table container uses token-based styling with clear visual hierarchy.

---

## Task 9: Migrate Gig Management Status Badges
**Description:** Update gig status badges to use semantic color system matching Dashboard.

**Implementation Notes:**
- File: `app/admin/gigs/page.tsx`
- Update gig status badge (lines 141-143):
  - Current: `bg-blue-500/10 text-blue-500` (generic blue for all statuses)
  - Update to semantic colors based on status:
    - OPEN: `bg-gray-500/20 text-gray-400` (gray, neutral)
    - IN_PROGRESS: `bg-success-500/10 text-success-400` (green, active work)
    - REVIEW: `bg-warning-500/10 text-warning-400` (yellow/orange, needs attention)
    - COMPLETED: `bg-warning-500/10 text-warning-400` (yellow/orange, awaiting payment)
    - PAID: `bg-success-500/10 text-success-400` (green, completed)
- Update "Closed" badge (lines 132-134):
  - Verify `bg-error-500/10 text-error-400` (red, already semantic)
- Verify badge styling: `px-2 py-1 text-xs font-medium rounded-full`

**Test Plan:**
- Navigate to `/admin/gigs` as ADMIN user
- Create test gigs with all statuses (OPEN, IN_PROGRESS, REVIEW, COMPLETED, PAID)
- Verify each status badge uses correct semantic color
- Verify "Closed" badge displays in red for closed gigs
- Verify badge text is readable (contrast check)
- Compare with Dashboard gig status badges for consistency
- Run `npm run test:e2e -- admin-moderation` to verify no regressions

**Expected Outcome:**
Gig status badges use semantic colors consistently with Dashboard patterns.

---

## Task 10: Migrate Gig Management Action Button
**Description:** Update close gig action button to use appropriate semantic color.

**Implementation Notes:**
- File: `app/admin/gigs/CloseGigForm.tsx`
- Update close button:
  - Should use red/error color: `bg-error-500 hover:bg-error-600 text-white`
  - Verify focus state: `focus:ring-2 focus:ring-error-500`
  - Button text: "Close" (preserve exactly)
- Verify loading state shows "Closing..."

**Test Plan:**
- Navigate to `/admin/gigs` as ADMIN user
- Test close action on open gig
- Verify button uses red color
- Verify loading state shows "Closing..."
- Verify action completes successfully
- Verify gig shows "Closed" badge after action
- Verify closed gig no longer shows close button
- Run `npm run test:e2e -- admin-moderation` to verify close gig flow

**Expected Outcome:**
Close button uses red/error color with proper loading state.

---

## Task 11: Verify Admin Page Spacing Consistency
**Description:** Verify spacing follows Dashboard rhythm across all admin pages.

**Implementation Notes:**
- Verify spacing consistency across all three admin pages:
  - Admin dashboard: gap-6 for card grids, p-8 for cards, mb-8 for sections
  - User management: gap-6 for spacing, p-6 for filter panel, mb-6 for sections
  - Gig management: gap-6 for spacing, p-6 for filter panel, mb-6 for sections
- Verify container padding: `px-4 sm:px-6 lg:px-8 py-8` (consistent across all pages)
- Verify max-width: `max-w-7xl mx-auto` (consistent across all pages)
- Compare with Dashboard spacing patterns

**Test Plan:**
- Visual inspection of all three admin pages
- Measure spacing with browser dev tools
- Compare with Dashboard page spacing
- Verify responsive behavior on mobile (320px width)
- Verify no layout shifts or overflow issues

**Expected Outcome:**
All admin pages follow consistent spacing rhythm matching Dashboard patterns.

---

## Task 12: Run Full Admin E2E Test Suite
**Description:** Execute complete admin E2E test suite to verify zero functional regressions.

**Implementation Notes:**
- Run all E2E tests for admin moderation flows
- Verify no test failures related to styling changes
- Check for any broken selectors or assertions
- Verify all admin actions work correctly

**Test Plan:**
```bash
# Run admin moderation tests
npm run test:e2e -- admin-moderation

# Run full E2E suite to catch any cross-page issues
npm run test:e2e
```

**Expected Outcome:**
- All E2E tests pass without modification
- No functional regressions introduced
- All admin actions (suspend, unsuspend, close) work identically to before migration
- All filters and pagination work correctly

---

## Task 13: Visual Verification Against Dashboard Patterns
**Description:** Perform side-by-side comparison with Dashboard to verify visual consistency.

**Implementation Notes:**
- Open Dashboard page: `http://localhost:3000/dashboard`
- Open Admin pages: `http://localhost:3000/admin`, `/admin/users`, `/admin/gigs`
- Compare:
  - Card hierarchy (primary cards use same bg-surface-level-1)
  - Status badge colors (semantic system matches)
  - Spacing rhythm (gaps and padding match)
  - Action button colors (blue for primary, semantic for moderation)
- Document any discrepancies

**Test Plan:**
- Take screenshots of Dashboard and all admin pages
- Compare card styling side-by-side
- Compare status badge colors
- Measure spacing with browser dev tools
- Verify visual hierarchy is consistent
- Get stakeholder approval if needed

**Expected Outcome:**
Visual hierarchy matches Dashboard patterns, creating consistent experience across application.

---

## Task 14: Accessibility Audit
**Description:** Verify that token migration maintains accessibility standards.

**Implementation Notes:**
- Test keyboard navigation through all admin pages
- Verify focus states are visible on all interactive elements
- Test with screen reader (NVDA or JAWS)
- Check color contrast ratios for all text/background combinations
- Verify ARIA labels remain intact
- Test all action buttons (suspend, unsuspend, close)

**Test Plan:**
- Keyboard navigation test:
  - Tab through all interactive elements on all three admin pages
  - Verify focus indicators are visible
  - Verify tab order is logical
  - Test filter forms with keyboard only
  - Test action buttons with keyboard (Enter key)
- Screen reader test:
  - Navigate admin pages with screen reader
  - Verify all content is announced correctly
  - Verify status badges are announced with context
  - Verify table headers and data are properly associated
- Contrast check:
  - Use browser dev tools or WebAIM contrast checker
  - Verify all text meets WCAG AA standards (4.5:1 for normal text)
  - Verify status badges have sufficient contrast
  - Verify action buttons have sufficient contrast

**Expected Outcome:**
- All interactive elements are keyboard accessible
- Focus states are clearly visible
- Screen reader announces all content correctly
- All text meets WCAG AA contrast standards
- No accessibility regressions introduced

---

## Summary

**Total Tasks:** 14

**Estimated Effort:** 3-4 hours

**Critical Path:**
1. Tasks 1-2 (admin dashboard) can proceed first
2. Tasks 3-6 (user management) can proceed in parallel
3. Tasks 7-10 (gig management) can proceed in parallel
4. Task 11 (spacing verification) after all page migrations
5. Tasks 12-14 (testing/verification) must complete last

**Success Criteria:**
- All admin pages use design tokens exclusively
- Visual hierarchy matches Dashboard patterns
- Status badges use semantic color system consistently
- Action buttons use appropriate colors (blue for primary, semantic for moderation)
- All E2E tests pass without modification
- Zero functional regressions
- Accessibility standards maintained
- Filters and pagination work identically
