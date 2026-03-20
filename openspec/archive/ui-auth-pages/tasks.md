# Implementation Tasks: UI Authentication Pages Token Migration

## Task 1: Update Homepage Token-Based Styling

**Description:**
Migrate homepage (`app/page.tsx`) to use token-based styling for both anonymous and authenticated views, ensuring visual consistency with Dashboard patterns.

**Implementation Notes:**
- Replace `bg-navy-900` page background (already correct, verify)
- Update "Get Started" button: `bg-blue-500 hover:bg-blue-600 text-white`
- Update "Sign in" link: `text-blue-500 hover:text-blue-400 font-medium`
- Update "Go to Dashboard" button (authenticated view): `bg-blue-500 hover:bg-blue-600 text-white`
- Update "Sign out" button (authenticated view): `text-blue-500 border border-blue-500 hover:bg-blue-500/10`
- Verify focus states include: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900`
- Preserve all existing functionality (session check, logout action, navigation)
- Preserve all text content exactly

**Files to Modify:**
- `app/page.tsx`

**Test Plan:**
```bash
# Manual testing
npm run dev
# Navigate to http://localhost:3000
# Verify anonymous view: "Get Started" and "Sign in" links visible
# Verify button styling matches Dashboard primary CTAs
# Login as any user
# Navigate to http://localhost:3000
# Verify authenticated view: email and logout button visible
# Verify button styling matches Dashboard patterns
# Click "Sign out" and verify redirect to homepage

# Visual verification
# Compare button styling with Dashboard primary CTAs
# Verify color consistency (blue #1379f3)
# Verify spacing and padding consistency
```

**Acceptance Criteria:**
- [ ] Page background uses `bg-navy-900`
- [ ] "Get Started" button uses `bg-blue-500 hover:bg-blue-600 text-white`
- [ ] "Sign in" link uses `text-blue-500 hover:text-blue-400`
- [ ] "Go to Dashboard" button uses `bg-blue-500 hover:bg-blue-600 text-white`
- [ ] "Sign out" button uses `text-blue-500 border border-blue-500 hover:bg-blue-500/10`
- [ ] All focus states include proper ring styling
- [ ] Session check works identically
- [ ] Logout functionality works identically
- [ ] Navigation works identically

---

## Task 2: Update Login Page Token-Based Styling

**Description:**
Migrate login page (`app/login/page.tsx`) to use token-based styling for form container, inputs, buttons, and error messages, matching Dashboard form patterns.

**Implementation Notes:**
- Update form container: `bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md p-8`
- Update form fields spacing: `space-y-6` (24px vertical gaps)
- Update input fields: `bg-navy-800 border border-gray-600 text-white placeholder:text-gray-400`
- Update input focus states: `focus:ring-1 focus:ring-blue-500 focus:border-blue-500`
- Update input padding: `px-4 py-3`
- Update labels: `text-white text-sm font-medium`
- Update submit button: `bg-blue-500 hover:bg-blue-600 text-white w-full py-3 px-6 rounded-md text-sm font-semibold`
- Update submit button focus: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900`
- Update submit button disabled: `disabled:opacity-50 disabled:cursor-not-allowed`
- Update error message: `text-error-500 text-sm`
- Update registration link: `text-blue-500 hover:text-blue-400 font-medium`
- Update surrounding text: `text-gray-300 text-sm`
- Preserve all existing functionality (useActionState, useFormStatus, loginUser action)
- Preserve all field names, labels, placeholder text

**Files to Modify:**
- `app/login/page.tsx`

**Test Plan:**
```bash
# Run integration tests
npm run test:unit -- __tests__/integration/login.test.ts

# Expected: All tests pass without modification
# Tests verify:
# - Successful login with valid credentials
# - Failed login with invalid credentials
# - Error message display
# - Redirect to /dashboard on success

# Manual testing
npm run dev
# Navigate to http://localhost:3000/login
# Verify form container styling matches Dashboard cards
# Verify input field styling (borders, focus states)
# Verify submit button styling matches Dashboard primary CTAs
# Test login with invalid credentials - verify error message styling
# Test login with valid credentials - verify redirect to /dashboard
# Verify "Sign up" link styling and navigation

# Visual verification
# Compare form container with Dashboard card styling
# Compare input fields with Dashboard form inputs
# Compare button with Dashboard primary CTAs
# Verify spacing rhythm (24px gaps between fields)
```

**Acceptance Criteria:**
- [ ] Form container uses `bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md p-8`
- [ ] Form fields use `space-y-6` vertical spacing
- [ ] Input fields use `bg-navy-800 border border-gray-600 text-white`
- [ ] Input focus states use `focus:ring-1 focus:ring-blue-500 focus:border-blue-500`
- [ ] Submit button uses `bg-blue-500 hover:bg-blue-600 text-white w-full`
- [ ] Error messages use `text-error-500 text-sm`
- [ ] Registration link uses `text-blue-500 hover:text-blue-400`
- [ ] All integration tests pass without modification
- [ ] Login functionality works identically
- [ ] Error handling works identically
- [ ] Navigation works identically

---

## Task 3: Update Registration Page Token-Based Styling

**Description:**
Migrate registration page (`app/register/page.tsx`) to use token-based styling for form container, role selector, inputs, buttons, and error messages, matching Dashboard form patterns.

**Implementation Notes:**
- Update form container: `bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md p-8`
- Update form fields spacing: `space-y-6` (24px vertical gaps)
- Update role selector container: `space-y-4` for label and options
- Update role selector options: `border border-gray-600 rounded-md`
- Update role selector selected state: `peer-checked:border-blue-500 peer-checked:bg-blue-500/10 peer-checked:text-blue-500`
- Update role selector hover: `hover:bg-navy-700`
- Update role descriptions: `text-gray-400 text-xs`
- Update input fields: `bg-navy-800 border border-gray-600 text-white placeholder:text-gray-400`
- Update input focus states: `focus:ring-1 focus:ring-blue-500 focus:border-blue-500`
- Update input padding: `px-4 py-3`
- Update labels: `text-white text-sm font-medium`
- Update submit button: `bg-blue-500 hover:bg-blue-600 text-white w-full py-3 px-6 rounded-md text-sm font-semibold`
- Update submit button focus: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900`
- Update submit button disabled: `disabled:opacity-50 disabled:cursor-not-allowed`
- Update error message: `text-error-500 text-sm`
- Update login link: `text-blue-500 hover:text-blue-400 font-medium`
- Update surrounding text: `text-gray-300 text-sm`
- Preserve all existing functionality (useActionState, useFormStatus, registerUser action)
- Preserve role selector values (CLIENT, SPECIALIST)
- Preserve all field names, labels, placeholder text

**Files to Modify:**
- `app/register/page.tsx`

**Test Plan:**
```bash
# Run integration tests
npm run test:unit -- __tests__/integration/registration.test.ts

# Expected: All tests pass without modification
# Tests verify:
# - Successful registration with CLIENT role
# - Successful registration with SPECIALIST role
# - Failed registration with duplicate email
# - Failed registration with invalid role
# - Failed registration with weak password
# - Password validation enforcement
# - Redirect to /dashboard on success

# Manual testing
npm run dev
# Navigate to http://localhost:3000/register
# Verify form container styling matches Dashboard cards
# Verify role selector styling (unselected and selected states)
# Click CLIENT role - verify selected state styling
# Click SPECIALIST role - verify selected state styling
# Verify input field styling (borders, focus states)
# Verify submit button styling matches Dashboard primary CTAs
# Test registration without selecting role - verify error message styling
# Test registration with invalid email - verify HTML5 validation
# Test registration with weak password - verify error message styling
# Test registration with valid data - verify redirect to /dashboard
# Verify "Sign in" link styling and navigation

# Visual verification
# Compare form container with Dashboard card styling
# Compare role selector with Dashboard radio button patterns
# Compare input fields with Dashboard form inputs
# Compare button with Dashboard primary CTAs
# Verify spacing rhythm (24px gaps between fields)
```

**Acceptance Criteria:**
- [ ] Form container uses `bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md p-8`
- [ ] Form fields use `space-y-6` vertical spacing
- [ ] Role selector uses `border-gray-600` with selected state `border-blue-500 bg-blue-500/10 text-blue-500`
- [ ] Role selector values (CLIENT, SPECIALIST) preserved exactly
- [ ] Input fields use `bg-navy-800 border border-gray-600 text-white`
- [ ] Input focus states use `focus:ring-1 focus:ring-blue-500 focus:border-blue-500`
- [ ] Submit button uses `bg-blue-500 hover:bg-blue-600 text-white w-full`
- [ ] Error messages use `text-error-500 text-sm`
- [ ] Login link uses `text-blue-500 hover:text-blue-400`
- [ ] All integration tests pass without modification
- [ ] Registration functionality works identically
- [ ] Role selection works identically
- [ ] Password validation works identically
- [ ] Error handling works identically
- [ ] Navigation works identically

---

## Task 4: Run Integration Test Suite

**Description:**
Execute all authentication-related integration tests to verify no functional regressions were introduced by the styling changes.

**Implementation Notes:**
- Run login integration tests
- Run registration integration tests
- Verify all tests pass without modification
- If any tests fail, investigate and fix styling issues that broke functionality
- Do NOT modify tests to accommodate styling changes - preserve exact functionality

**Test Plan:**
```bash
# Run all authentication integration tests
npm run test:unit -- __tests__/integration/login.test.ts
npm run test:unit -- __tests__/integration/registration.test.ts

# Expected results:
# - All login tests pass (successful login, failed login, error messages)
# - All registration tests pass (CLIENT/SPECIALIST roles, validation, errors)
# - No test modifications required
# - Zero functional regressions

# If tests fail:
# 1. Review error messages
# 2. Check if styling changes broke DOM structure or data attributes
# 3. Verify form field names preserved
# 4. Verify role selector values preserved
# 5. Fix styling issues without modifying tests
```

**Acceptance Criteria:**
- [ ] All login integration tests pass
- [ ] All registration integration tests pass
- [ ] No test files modified
- [ ] Zero functional regressions
- [ ] All form submissions work identically
- [ ] All error handling works identically
- [ ] All redirects work identically

---

## Task 5: Run E2E Authentication Flow Tests

**Description:**
Execute E2E tests covering the complete authentication flow to verify user journeys work identically with new styling.

**Implementation Notes:**
- Run E2E tests that cover authentication flows
- Verify registration flow (CLIENT and SPECIALIST)
- Verify login flow
- Verify logout flow
- Verify role-based dashboard access
- If any tests fail, investigate and fix styling issues that broke functionality
- Do NOT modify tests to accommodate styling changes

**Test Plan:**
```bash
# Run E2E authentication tests
npm run test:e2e

# Expected results:
# - Registration flow works (CLIENT and SPECIALIST)
# - Login flow works
# - Logout flow works
# - Role-based dashboard access works
# - No test modifications required
# - Zero functional regressions

# Manual E2E testing:
# 1. Register new CLIENT user
#    - Navigate to /register
#    - Select CLIENT role
#    - Fill email and password
#    - Submit form
#    - Verify redirect to /dashboard
#    - Verify CLIENT dashboard displays
# 2. Logout
#    - Click logout button
#    - Verify redirect to homepage
# 3. Login as CLIENT
#    - Navigate to /login
#    - Enter credentials
#    - Submit form
#    - Verify redirect to /dashboard
# 4. Register new SPECIALIST user
#    - Logout
#    - Navigate to /register
#    - Select SPECIALIST role
#    - Fill email and password
#    - Submit form
#    - Verify redirect to /dashboard
#    - Verify SPECIALIST dashboard displays
# 5. Test error paths
#    - Try login with invalid credentials
#    - Try registration with duplicate email
#    - Try registration without selecting role
#    - Verify error messages display correctly
```

**Acceptance Criteria:**
- [ ] All E2E authentication tests pass
- [ ] Registration flow works for CLIENT role
- [ ] Registration flow works for SPECIALIST role
- [ ] Login flow works
- [ ] Logout flow works
- [ ] Role-based dashboard access works
- [ ] Error messages display correctly
- [ ] No test files modified
- [ ] Zero functional regressions

---

## Task 6: Visual Verification and Accessibility Audit

**Description:**
Perform visual verification against Dashboard patterns and Figma prototype, and conduct accessibility audit to ensure no regressions.

**Implementation Notes:**
- Compare authentication pages with Dashboard form patterns
- Verify visual consistency (colors, spacing, typography)
- Test keyboard navigation
- Test screen reader compatibility
- Verify form validation accessibility
- Document any visual discrepancies

**Test Plan:**
```bash
# Visual verification checklist:
# 1. Form containers
#    - Compare login form container with Dashboard cards
#    - Compare registration form container with Dashboard cards
#    - Verify bg-surface-level-1 background color matches
#    - Verify border-neutral-weak border color matches
#    - Verify padding (p-8 = 32px) matches Dashboard cards
# 2. Form inputs
#    - Compare input styling with Dashboard form inputs
#    - Verify border colors match (gray-600 default, blue-500 focus)
#    - Verify background colors match (navy-800)
#    - Verify placeholder text color matches (gray-400)
# 3. Buttons
#    - Compare primary buttons with Dashboard primary CTAs
#    - Verify blue color (#1379f3) matches
#    - Verify hover states match
#    - Verify focus ring styling matches
# 4. Spacing
#    - Verify form field gaps (space-y-6 = 24px)
#    - Verify input padding (px-4 py-3)
#    - Verify button padding (py-3 px-6)
#    - Compare with Dashboard spacing rhythm
# 5. Error messages
#    - Verify error color (text-error-500) matches Dashboard errors
#    - Verify font size (text-sm) matches

# Accessibility audit:
# 1. Keyboard navigation
#    - Tab through all form fields
#    - Verify focus indicators visible
#    - Verify role selector keyboard accessible
#    - Verify submit button keyboard accessible
# 2. Screen reader testing
#    - Test with NVDA or JAWS
#    - Verify labels announced correctly
#    - Verify error messages announced
#    - Verify role selector options announced
#    - Verify button states announced (loading, disabled)
# 3. Form validation
#    - Verify HTML5 validation messages accessible
#    - Verify custom error messages accessible
#    - Verify required field indicators accessible
# 4. Color contrast
#    - Verify text on backgrounds meets WCAG AA
#    - Verify button text contrast
#    - Verify error message contrast

# Compare with Figma prototype:
# - Open Figma: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385
# - Compare form layouts
# - Compare color usage
# - Compare spacing and padding
# - Document any intentional deviations
```

**Acceptance Criteria:**
- [ ] Form containers visually match Dashboard cards
- [ ] Form inputs visually match Dashboard form inputs
- [ ] Buttons visually match Dashboard primary CTAs
- [ ] Spacing rhythm matches Dashboard patterns (24px gaps, 32px padding)
- [ ] Error messages visually match Dashboard error styling
- [ ] Keyboard navigation works correctly
- [ ] Screen reader announces all elements correctly
- [ ] Form validation is accessible
- [ ] Color contrast meets WCAG AA standards
- [ ] Visual consistency with Figma prototype verified
- [ ] No accessibility regressions introduced

---

## Summary

**Total Tasks:** 6

**Estimated Effort:**
- Task 1 (Homepage): 30 minutes
- Task 2 (Login page): 45 minutes
- Task 3 (Registration page): 60 minutes
- Task 4 (Integration tests): 15 minutes
- Task 5 (E2E tests): 30 minutes
- Task 6 (Visual verification): 45 minutes
- **Total: ~3.5 hours**

**Critical Path:**
1. Task 1 → Task 2 → Task 3 (sequential styling updates)
2. Task 4 → Task 5 (sequential testing)
3. Task 6 (final verification)

**Success Metrics:**
- All 3 pages updated with token-based styling
- All integration tests pass (0 failures)
- All E2E tests pass (0 failures)
- Visual consistency verified
- Accessibility audit passed
- Zero functional regressions
