# Implementation Tasks: UI Gig Pages Token Migration

## Task 1: Audit Design Tokens for Required Colors
**Description:** Verify that all required color tokens exist in `design-tokens.json` before starting implementation.

**Implementation Notes:**
- Read `openspec/specs/ui/design-tokens.json`
- Verify existence of:
  - `bg-surface-level-1` (primary card background)
  - `bg-surface-level-2` (nested card background)
  - `border-neutral-weak` (subtle borders)
  - `border-neutral-strong` (emphasized borders)
  - `bg-success-weak-default`, `text-success-default` (green status badges)
  - `bg-warning-weak-default`, `text-warning-default` (warning status badges)
  - `bg-danger-weak-default`, `text-danger-default` (danger status badges)
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

## Task 2: Migrate Gig Browse Page Card Hierarchy
**Description:** Replace hardcoded colors with design tokens in gig browse page card styling.

**Implementation Notes:**
- File: `app/(protected)/gigs/page.tsx`
- Update gig card styling (lines 176-209):
  - Replace `bg-surface-level-1 border border-neutral-weak` (already using tokens, verify consistency)
  - Verify hover states: `hover:bg-surface-level-2 hover:border-neutral-strong`
  - Ensure card padding `p-6` (24px) is consistent
- Update empty state card (lines 154-160):
  - Verify `bg-surface-level-1 border border-neutral-weak`
- Update card spacing:
  - Verify `space-y-4` (16px) for card list (line 162)
- Preserve all existing functionality, navigation, and filter integration

**Test Plan:**
- Visual inspection: verify card hierarchy creates depth perception
- Run `npm run dev` and navigate to `/dashboard/gigs`
- Verify all cards render with correct token-based colors
- Test hover states on gig cards
- Click through cards to verify navigation works
- Test with filters applied to verify card styling remains consistent
- Run `npm run test:integration -- gig-browsing` to verify no regressions

**Expected Outcome:**
Gig browse page uses token-based card hierarchy with clear visual depth and consistent hover states.

---

## Task 3: Migrate Filter Panel Styling
**Description:** Update filter panel component to use token-based styling while maintaining light theme for contrast.

**Implementation Notes:**
- File: `app/(protected)/gigs/components/GigFilters.tsx`
- Filter panel container (line 97):
  - Keep `bg-white` for light theme contrast
  - Verify `rounded-lg shadow-md p-6` styling
- Input fields (lines 105-112, 141-163):
  - Verify `border-gray-300 focus:ring-blue-500` styling
  - Ensure consistent input styling across all fields
- Buttons (lines 186-199):
  - "Apply Filters": verify `bg-blue-600 hover:bg-blue-700`
  - "Clear Filters": verify `bg-gray-200 hover:bg-gray-300`
- Preserve all filter logic and state management

**Test Plan:**
- Navigate to gig browse page
- Verify filter panel renders with light theme styling
- Test all filter inputs (search, tags, budget range, sort)
- Test "Apply Filters" button functionality
- Test "Clear Filters" button functionality
- Verify filter state persists in URL parameters
- Run `npm run test:integration -- gig-filtering` to verify no regressions

**Expected Outcome:**
Filter panel maintains light theme styling for contrast while using consistent token-based colors for inputs and buttons.

---

## Task 4: Migrate Gig Detail Page Main Content Cards
**Description:** Replace hardcoded colors with design tokens in gig detail page main content area.

**Implementation Notes:**
- File: `app/(protected)/gigs/[id]/page.tsx`
- Update gig details card (lines 104-216):
  - Verify `bg-surface-level-1 border border-neutral-weak` (already using tokens)
  - Ensure `rounded-lg p-8` styling
- Update apply form container (lines 219-268):
  - Verify `bg-surface-level-1 border border-neutral-weak`
  - Ensure `p-8` padding
- Update submit work form container (lines 270-278):
  - Verify `bg-surface-level-1 border border-neutral-weak`
  - Ensure `p-8` padding
- Update approve work form container (lines 280-295):
  - Verify `bg-surface-level-1 border border-neutral-weak`
  - Ensure `p-8` padding
- Update mark as paid container (lines 297-305):
  - Verify `bg-surface-level-1 border border-neutral-weak`
  - Ensure `p-8` padding
- Update applications section card (lines 307-403):
  - Verify `bg-surface-level-1 border border-neutral-weak`
  - Ensure `p-8` padding
- Update individual application cards (lines 324-398):
  - Verify `bg-surface-level-2 border border-neutral-weak`
  - Ensure `p-6` padding for nested cards
- Messages section (lines 405-439):
  - Keep existing `bg-navy-800 border border-gray-700` styling (separate migration)
- Preserve all existing functionality

**Test Plan:**
- Navigate to various gig detail pages (OPEN, IN_PROGRESS, REVIEW, COMPLETED, PAID)
- Verify all cards render with correct token-based colors
- Verify card hierarchy creates depth perception (primary vs nested)
- Test all form submissions (apply, submit work, approve, mark as paid)
- Verify application cards display correctly
- Run `npm run test:integration -- application` to verify no regressions

**Expected Outcome:**
Gig detail page main content uses token-based card hierarchy with clear visual depth.

---

## Task 5: Migrate Gig Detail Page Status Badges
**Description:** Update status badge colors to use semantic color system consistently.

**Implementation Notes:**
- File: `app/(protected)/gigs/[id]/page.tsx`
- Update gig status badge (lines 107-115):
  - PAID: verify `bg-success-weak-default text-success-default`
  - COMPLETED: verify `bg-warning-weak-default text-warning-default`
  - Default (OPEN/IN_PROGRESS): verify `bg-blue-500/10 text-blue-400`
- Update application status badges (lines 341-349):
  - ACCEPTED: verify `bg-success-weak-default text-success-default`
  - REJECTED: verify `bg-danger-weak-default text-danger-default`
  - WITHDRAWN: verify `bg-gray-500/50 text-gray-400`
  - PENDING: verify `bg-warning-weak-default text-warning-default`
- Verify status text remains unchanged
- Ensure badge styling remains consistent: `text-xs px-2 py-1 rounded-full`

**Test Plan:**
- Create test gigs with different statuses (OPEN, IN_PROGRESS, REVIEW, COMPLETED, PAID)
- Create test applications with different statuses (PENDING, ACCEPTED, REJECTED, WITHDRAWN)
- Navigate to gig detail pages
- Verify each status badge uses correct semantic colors
- Verify badge text is readable (contrast check)
- Run `npm run test:integration -- application` to verify no regressions

**Expected Outcome:**
Status badges use consistent semantic colors across all gig and application statuses.

---

## Task 6: Migrate Gig Detail Page Sidebar
**Description:** Update sidebar budget card to use design tokens.

**Implementation Notes:**
- File: `app/(protected)/gigs/[id]/page.tsx`
- Update budget card (lines 481-485):
  - Verify `bg-surface-level-1 border border-neutral-weak`
  - Verify `rounded-lg p-6` styling
  - Verify `sticky top-6` positioning
- Preserve all budget display logic

**Test Plan:**
- Navigate to gig detail page
- Verify sidebar budget card renders with correct token-based colors
- Verify sticky positioning works on scroll
- Verify budget amount displays correctly
- Test responsive behavior on mobile (sidebar stacks below main content)

**Expected Outcome:**
Sidebar budget card uses token-based styling matching Dashboard sidebar pattern.

---

## Task 7: Migrate Gig Detail Page Action Buttons
**Description:** Update all primary action buttons to use solid blue styling.

**Implementation Notes:**
- File: `app/(protected)/gigs/[id]/page.tsx`
- Apply form submit button (in `apply-form.tsx`):
  - Verify `bg-blue-500 hover:bg-blue-600 text-white`
  - Verify focus states: `focus:ring-2 focus:ring-blue-500`
- Submit work form button (in `submit-work-form.tsx`):
  - Verify `bg-blue-500 hover:bg-blue-600 text-white`
- Approve work form button (in `approve-work-form.tsx`):
  - Verify `bg-blue-500 hover:bg-blue-600 text-white`
- Mark as paid button (in `MarkAsPaidButton.tsx`):
  - Verify `bg-blue-500 hover:bg-blue-600 text-white`
- Application actions buttons (in `application-actions.tsx`):
  - Accept button: verify `bg-blue-500 hover:bg-blue-600`
  - Reject button: verify appropriate styling
- Withdraw application button (in `withdraw-application-button.tsx`):
  - Verify red/warning styling for destructive action
- Preserve all button text and functionality

**Test Plan:**
- Test all action buttons on gig detail pages
- Verify hover states work correctly
- Verify focus states work with keyboard navigation
- Verify loading states display correctly
- Click all buttons to verify functionality works
- Run `npm run test:integration -- application` to verify no regressions

**Expected Outcome:**
All primary action buttons use solid blue with proper hover/focus states.

---

## Task 8: Migrate Gig Creation Form Visual Sections
**Description:** Update gig creation form sections to use token-based styling.

**Implementation Notes:**
- File: `app/(protected)/gigs/new/gig-form.tsx`
- Update "Basic Information" section (lines 57-92):
  - Replace `bg-navy-800 border border-gray-700` with `bg-surface-level-1 border border-neutral-weak`
  - Verify `rounded-lg p-8` styling
- Update "Requirements & Success Criteria" section (lines 95-218):
  - Replace `bg-navy-800 border border-gray-700` with `bg-surface-level-1 border border-neutral-weak`
  - Verify `rounded-lg p-8` styling
  - Preserve example gigs link styling
- Update "Budget & Details" section (lines 221-276):
  - Replace `bg-navy-800 border border-gray-700` with `bg-surface-level-1 border border-neutral-weak`
  - Verify `rounded-lg p-6` styling
- Update form field styling:
  - Keep `bg-navy-800 text-white` for dark theme consistency
  - Verify `border-gray-600 focus:border-blue-500 focus:ring-blue-500`
- Update submit button (lines 13-20):
  - Verify `bg-blue-500 hover:bg-blue-600 text-white`
  - Verify focus states
- Preserve all character counters, quality warnings, and validation logic

**Test Plan:**
- Navigate to `/dashboard/gigs/new`
- Verify all three sections render with correct token-based colors
- Verify section spacing is consistent
- Test all form fields (input, textarea, select)
- Test character counters on all textarea fields
- Test quality warning on acceptance criteria field
- Test budget preview calculation
- Submit form with valid data to verify functionality
- Submit form with invalid data to verify validation
- Run `npm run test:integration -- gig-creation` to verify no regressions

**Expected Outcome:**
Gig creation form uses token-based styling for visual sections while maintaining all functionality.

---

## Task 9: Verify Form Field Styling Consistency
**Description:** Ensure all form fields across gig pages use consistent token-based styling.

**Implementation Notes:**
- Review all form components:
  - `apply-form.tsx` (application submission)
  - `submit-work-form.tsx` (work submission)
  - `approve-work-form.tsx` (work approval)
  - `message-form.tsx` (messaging)
  - `gig-form.tsx` (gig creation)
- Verify consistent styling:
  - Input fields: `border-gray-600 focus:border-blue-500 focus:ring-blue-500`
  - Textarea fields: same as input fields
  - Background: `bg-navy-800` for dark theme
  - Text color: `text-white`
  - Placeholder: `placeholder:text-gray-400`
- Verify error message styling is consistent
- Preserve all validation logic

**Test Plan:**
- Test all forms across gig pages
- Verify visual consistency of form fields
- Test focus states on all inputs
- Test error message display
- Verify placeholder text is visible
- Test with keyboard navigation
- Run all integration tests to verify no regressions

**Expected Outcome:**
All form fields use consistent token-based styling across all gig pages.

---

## Task 10: Run Full Integration Test Suite
**Description:** Execute complete integration test suite to verify zero functional regressions.

**Implementation Notes:**
- Run all gig-related integration tests
- Verify no test failures related to styling changes
- Check for any broken selectors or assertions
- Verify all form submissions, filters, and navigation work

**Test Plan:**
```bash
# Run gig creation tests
npm run test:integration -- gig-creation

# Run gig filtering tests
npm run test:integration -- gig-filtering

# Run application flow tests
npm run test:integration -- application

# Run full integration suite
npm run test:integration
```

**Expected Outcome:**
- All integration tests pass without modification
- No functional regressions introduced
- All form submissions work identically to before migration
- All filters and navigation work identically

---

## Task 11: Visual Verification Against Dashboard Pages
**Description:** Perform side-by-side comparison with Dashboard pages to verify visual consistency.

**Implementation Notes:**
- Open Dashboard pages and gig pages side-by-side
- Compare visual elements:
  - Card hierarchy (primary vs nested cards)
  - Status badge colors
  - Spacing rhythm
  - CTA styling
  - Border colors and weights
- Document any discrepancies
- Ensure gig pages feel like part of the same design system

**Test Plan:**
- Take screenshots of Dashboard pages
- Take screenshots of gig pages
- Compare card backgrounds (should match)
- Compare status badge colors (should match semantic system)
- Compare spacing between elements (should follow same rhythm)
- Compare button styling (should match)
- Verify color values match design tokens
- Get stakeholder approval if needed

**Expected Outcome:**
Visual consistency between Dashboard and gig pages, creating cohesive design language.

---

## Task 12: Accessibility Audit
**Description:** Verify that token migration maintains accessibility standards.

**Implementation Notes:**
- Test keyboard navigation through all gig pages
- Verify focus states are visible on all interactive elements
- Test with screen reader (NVDA or JAWS)
- Check color contrast ratios for all text/background combinations
- Verify ARIA labels remain intact
- Test form validation error announcements

**Test Plan:**
- Keyboard navigation test:
  - Tab through all interactive elements on each page
  - Verify focus indicators are visible
  - Verify tab order is logical
  - Test form submission with Enter key
- Screen reader test:
  - Navigate gig browse page with screen reader
  - Navigate gig detail page with screen reader
  - Fill out gig creation form with screen reader
  - Verify all content is announced correctly
  - Verify status badges are announced with context
- Contrast check:
  - Use browser dev tools or WebAIM contrast checker
  - Verify all text meets WCAG AA standards (4.5:1 for normal text)
  - Verify status badges have sufficient contrast
  - Verify form field labels are readable

**Expected Outcome:**
- All interactive elements are keyboard accessible
- Focus states are clearly visible
- Screen reader announces all content correctly
- All text meets WCAG AA contrast standards
- No accessibility regressions introduced

---

## Task 13: Responsive Behavior Verification
**Description:** Verify that all gig pages remain responsive and functional on mobile devices.

**Implementation Notes:**
- Test all gig pages at various viewport sizes:
  - Mobile: 320px, 375px, 414px
  - Tablet: 768px, 1024px
  - Desktop: 1280px, 1440px, 1920px
- Verify layout adaptations:
  - Gig browse: filter panel and cards stack properly
  - Gig detail: two-column layout stacks on mobile
  - Gig creation: form sections remain readable
- Verify no horizontal scrolling occurs
- Verify touch targets are adequate size (44x44px minimum)

**Test Plan:**
- Use browser dev tools responsive mode
- Test at each breakpoint:
  - 320px (small mobile)
  - 768px (tablet)
  - 1024px (desktop)
- Verify all pages:
  - Gig browse page
  - Gig detail page
  - Gig creation form
- Test interactions:
  - Click/tap all buttons
  - Fill out all forms
  - Use all filters
- Verify no layout breaks or overflow issues

**Expected Outcome:**
- All gig pages are fully responsive
- Layouts adapt appropriately at all breakpoints
- No horizontal scrolling on any viewport
- All interactive elements remain accessible on mobile

---

## Summary

**Total Tasks:** 13

**Estimated Effort:** 6-8 hours

**Critical Path:**
1. Task 1 (token audit) must complete first
2. Tasks 2-3 (gig browse page) can proceed in parallel
3. Tasks 4-7 (gig detail page) can proceed in parallel
4. Task 8-9 (gig creation form) can proceed in parallel
5. Tasks 10-13 (testing/verification) must complete last

**Success Criteria:**
- All gig pages use design tokens exclusively
- Visual consistency with Dashboard pages
- All integration tests pass without modification
- Zero functional regressions
- Accessibility standards maintained
- Responsive behavior verified
