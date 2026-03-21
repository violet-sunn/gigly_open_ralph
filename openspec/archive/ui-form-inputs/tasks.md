# Implementation Tasks

## Task 1: Update Authentication Form Inputs

**Files to modify:**
- `app/register/page.tsx`
- `app/login/page.tsx`

**Implementation:**
1. Replace `bg-navy-800` with `bg-surface-level-1` in all input and textarea elements
2. Replace `border-gray-600` and `border-gray-700` with `border-neutral-weak` in all input and textarea elements
3. Replace `placeholder:text-gray-400` with `placeholder:text-neutral-weak` in all input and textarea elements
4. Preserve all existing focus states (`focus:ring-blue-500`, `focus:border-blue-500`)
5. Preserve all existing validation attributes (`required`, `type`, `name`, etc.)
6. Preserve all existing accessibility attributes (`aria-*`, `id`, `htmlFor`, etc.)

**Test Plan:**
- Run integration tests: `npm run test:unit -- __tests__/integration/user-registration.test.ts`
- Run integration tests: `npm run test:unit -- __tests__/integration/user-login.test.ts`
- Manual verification:
  - Navigate to `/register` and verify all inputs have consistent styling
  - Navigate to `/login` and verify all inputs have consistent styling
  - Test form submission with valid and invalid data
  - Test keyboard navigation (Tab, Enter)
  - Test focus states (blue ring appears on focus)
  - Test error states (error messages display correctly)
  - Verify placeholder text is visible and readable

---

## Task 2: Update Gig Creation Form Inputs

**Files to modify:**
- `app/(protected)/gigs/new/gig-form.tsx`

**Implementation:**
1. Replace `bg-navy-800` with `bg-surface-level-1` in all input and textarea elements
2. Replace `border-gray-600` with `border-neutral-weak` in all input and textarea elements
3. Replace `placeholder:text-gray-400` with `placeholder:text-neutral-weak` in all input and textarea elements
4. Preserve all character counter functionality
5. Preserve all quality warning functionality
6. Preserve all fee calculation preview functionality
7. Preserve all section structure and headings

**Test Plan:**
- Run integration tests: `npm run test:unit -- __tests__/integration/gig-creation.test.ts`
- Manual verification:
  - Navigate to `/dashboard/gigs/new` as CLIENT user
  - Verify all inputs (title, description, acceptanceCriteria, goal, deliverables, constraints, budget, tags) have consistent styling
  - Test character counters update in real-time
  - Test quality warning appears/disappears correctly
  - Test fee calculation preview updates correctly
  - Test form submission with valid data
  - Test form validation with invalid data (empty fields, short acceptanceCriteria)
  - Verify all three visual sections maintain proper styling

---

## Task 3: Update Gig Application and Message Forms

**Files to modify:**
- `app/(protected)/gigs/[id]/apply-form.tsx`
- `app/(protected)/gigs/[id]/message-form.tsx`
- `app/(protected)/gigs/[id]/page.tsx` (for inline work submission and approval forms)

**Implementation:**
1. In `apply-form.tsx`:
   - Replace `bg-navy-800` with `bg-surface-level-1` in all textarea elements
   - Replace `border-gray-600` with `border-neutral-weak` in all textarea elements
   - Replace `placeholder:text-gray-400` with `placeholder:text-neutral-weak` in all textarea elements
   - Preserve character counter functionality for structured fields

2. In `message-form.tsx`:
   - Replace `bg-navy-800` with `bg-surface-level-1` in textarea element
   - Replace `border-gray-600` with `border-neutral-weak` in textarea element
   - Replace `placeholder:text-gray-400` with `placeholder:text-neutral-weak` in textarea element

3. In `page.tsx` (work submission and approval forms):
   - Replace `bg-navy-800` with `bg-surface-level-1` in all textarea elements
   - Replace `border-gray-600` with `border-neutral-weak` in all textarea elements
   - Replace `placeholder:text-gray-400` with `placeholder:text-neutral-weak` in all textarea elements

**Test Plan:**
- Run integration tests: `npm run test:unit -- __tests__/integration/application-flow.test.ts`
- Run integration tests: `npm run test:unit -- __tests__/integration/gig-lifecycle.test.ts`
- Manual verification:
  - Navigate to an OPEN gig as SPECIALIST and verify apply form styling
  - Test application submission with structured fields
  - Navigate to an IN_PROGRESS gig as assigned SPECIALIST and verify work submission form styling
  - Navigate to a REVIEW gig as CLIENT owner and verify approval form styling
  - Navigate to any gig with assigned specialist and verify message form styling
  - Test all form submissions work correctly
  - Verify character counters work in apply form

---

## Task 4: Update Admin Form Inputs

**Files to modify:**
- `app/admin/users/UserFilters.tsx`
- `app/admin/users/SuspendUserForm.tsx`
- `app/admin/users/UnsuspendUserForm.tsx`
- `app/admin/gigs/GigFilters.tsx`
- `app/admin/gigs/CloseGigForm.tsx`

**Implementation:**
1. In filter components (`UserFilters.tsx`, `GigFilters.tsx`):
   - Replace `bg-navy-800` with `bg-surface-level-1` in all input and select elements
   - Replace `border-gray-600` with `border-neutral-weak` in all input and select elements
   - Replace `placeholder:text-gray-400` with `placeholder:text-neutral-weak` in all input elements

2. In moderation forms (`SuspendUserForm.tsx`, `UnsuspendUserForm.tsx`, `CloseGigForm.tsx`):
   - Replace `bg-navy-800` with `bg-surface-level-1` in all textarea elements
   - Replace `border-gray-600` with `border-neutral-weak` in all textarea elements
   - Replace `placeholder:text-gray-400` with `placeholder:text-neutral-weak` in all textarea elements

**Test Plan:**
- Run integration tests: `npm run test:unit -- __tests__/integration/admin-moderation.test.ts` (if exists)
- Manual verification:
  - Navigate to `/admin/users` as ADMIN user
  - Verify user filter inputs have consistent styling
  - Test filtering by role, suspended status, search text
  - Navigate to `/admin/gigs` as ADMIN user
  - Verify gig filter inputs have consistent styling
  - Test filtering by status, closed status, search text
  - Test suspend user form styling and submission
  - Test unsuspend user form styling and submission
  - Test close gig form styling and submission
  - Verify all moderation actions create audit logs correctly

---

## Task 5: Update Profile Edit Form Inputs

**Files to modify:**
- `app/(protected)/profile/edit/ProfileEditForm.tsx`

**Implementation:**
1. Replace `bg-navy-800` with `bg-surface-level-1` in all input and textarea elements
2. Replace `border-gray-600` with `border-neutral-weak` in all input and textarea elements
3. Replace `placeholder:text-gray-400` with `placeholder:text-neutral-weak` in all input and textarea elements
4. Preserve role-based field rendering (CLIENT vs SPECIALIST)
5. Preserve all validation logic (required fields for CLIENT)
6. Preserve 2-column grid layout

**Test Plan:**
- Run integration tests: `npm run test:unit -- __tests__/integration/profile-management.test.ts` (if exists)
- Manual verification:
  - Navigate to `/profile/edit` as CLIENT user
  - Verify all CLIENT fields (companyName, inn, kpp, contactPerson, phoneNumber) have consistent styling
  - Test form submission with valid CLIENT data
  - Navigate to `/profile/edit` as SPECIALIST user
  - Verify all SPECIALIST fields (displayName, techStack, experienceLevel, bio) have consistent styling
  - Test form submission with valid SPECIALIST data
  - Verify form pre-fills existing data correctly
  - Verify validation errors display correctly

---

## Task 6: Update Other Component Inputs

**Files to modify:**
- `app/components/PaginationControls.tsx`
- `app/components/NotificationDropdown.tsx` (if contains form inputs)

**Implementation:**
1. In `PaginationControls.tsx`:
   - Check if component contains any input elements (page number input)
   - If yes, replace `bg-navy-800` with `bg-surface-level-1`
   - If yes, replace `border-gray-600` with `border-neutral-weak`
   - If yes, replace `placeholder:text-gray-400` with `placeholder:text-neutral-weak`

2. In `NotificationDropdown.tsx`:
   - Check if component contains any input elements
   - If yes, apply same token replacements
   - If no inputs, skip this file

**Test Plan:**
- Run integration tests: `npm run test:unit -- __tests__/integration/pagination.test.ts` (if exists)
- Manual verification:
  - Navigate to any paginated page (gig browse, admin pages)
  - Verify pagination controls work correctly
  - If page number input exists, verify styling is consistent
  - Verify notification dropdown works correctly

---

## Task 7: Run Full Integration Test Suite

**Implementation:**
1. Run all integration tests: `npm run test:unit`
2. Run all E2E tests: `npm run test:e2e`
3. Verify zero test failures introduced by styling changes
4. If any tests fail, investigate and fix (should be zero failures if only styling changed)

**Test Plan:**
- All integration tests pass: `npm run test:unit`
- All E2E tests pass: `npm run test:e2e`
- Specific test suites to verify:
  - `__tests__/integration/user-registration.test.ts`
  - `__tests__/integration/user-login.test.ts`
  - `__tests__/integration/gig-creation.test.ts`
  - `__tests__/integration/application-flow.test.ts`
  - `__tests__/integration/gig-lifecycle.test.ts`
  - `__tests__/e2e/auth-flow.spec.ts`
  - `__tests__/e2e/gig-creation.spec.ts`
  - `__tests__/e2e/application-flow.spec.ts`

---

## Task 8: Visual Verification and Accessibility Check

**Implementation:**
1. Manually verify visual consistency across all forms
2. Check WCAG AA contrast ratios for all text/background combinations
3. Verify keyboard navigation works correctly
4. Verify screen reader compatibility (if possible)

**Test Plan:**
- Visual verification checklist:
  - [ ] All form inputs have identical background color (`bg-surface-level-1`)
  - [ ] All form input borders have identical color (`border-neutral-weak`)
  - [ ] All placeholder text has identical color (`placeholder:text-neutral-weak`)
  - [ ] Focus states show blue ring on all inputs
  - [ ] Error states display correctly on all forms
  - [ ] All forms are visually consistent with each other

- Accessibility verification:
  - [ ] Tab navigation works through all form fields
  - [ ] Enter key submits forms correctly
  - [ ] Required fields are marked with `required` attribute
  - [ ] Error messages are associated with inputs (aria-describedby)
  - [ ] Labels are properly associated with inputs (htmlFor/id)
  - [ ] Contrast ratios meet WCAG AA standards (≥ 4.5:1 for normal text)

- Browser compatibility:
  - [ ] Chrome: All forms render correctly
  - [ ] Firefox: All forms render correctly
  - [ ] Safari: All forms render correctly (if available)
  - [ ] Edge: All forms render correctly (if available)

---

## Summary

**Total files to modify:** 13 files
- Authentication: 2 files
- Gig forms: 4 files
- Admin forms: 5 files
- Profile: 1 file
- Other: 1-2 files (depending on component content)

**Token replacements:**
- `bg-navy-800` → `bg-surface-level-1` (11 files)
- `border-gray-600` / `border-gray-700` → `border-neutral-weak` (14 files)
- `placeholder:text-gray-400` → `placeholder:text-neutral-weak` (9 files)

**Expected outcome:**
- Zero functional regressions
- All integration tests pass
- All E2E tests pass
- Visual consistency across all forms
- Maintained accessibility standards
