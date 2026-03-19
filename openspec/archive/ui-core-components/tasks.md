# Implementation Tasks: ui-core-components

## Task 1: Verify Design Token Integration

**Implementation:**
- Read `tailwind.config.ts` to verify design tokens are available as Tailwind classes
- Check `scripts/generated-tokens.js` and `scripts/generated-tokens.css` exist
- If tokens are missing, run `node scripts/parse-design-tokens.js` to regenerate
- Document available token classes for buttons, inputs, links

**Test Plan:**
```bash
# Verify token files exist
ls -la scripts/generated-tokens.*

# Check Tailwind config includes tokens
grep -A 10 "generated-tokens" tailwind.config.ts

# Test build compiles successfully
npm run build
```

**Expected Result:**
- Token files exist and are imported in Tailwind config
- Build completes without errors
- Token classes are available (e.g., `bg-brand-primary`, `text-neutral-strong`)

---

## Task 2: Create Token Mapping Document

**Implementation:**
- Audit all 27+ files identified by grep for button/input/link patterns
- Create mapping table: Current hardcoded class → Design token class
- Document semantic meaning for each pattern (e.g., "Primary CTA button" → `bg-brand-primary`)
- Review with design system documentation to ensure correct token usage

**Mapping Examples:**
```
Buttons:
- bg-blue-500 hover:bg-blue-600 → bg-brand-primary hover:bg-brand-primary-hover
- bg-green-500 hover:bg-green-600 → bg-success-500 hover:bg-success-600
- bg-red-500 hover:bg-red-600 → bg-error-500 hover:bg-error-600

Inputs:
- bg-navy-800 border-gray-600 text-white → bg-surface-level-1 border-neutral-weak text-neutral-strong
- focus:border-blue-500 focus:ring-blue-500 → focus:border-brand-primary focus:ring-brand-primary

Links:
- text-blue-500 hover:text-blue-400 → text-brand-primary hover:text-brand-primary-hover
- text-blue-600 hover:text-blue-800 → text-brand-secondary hover:text-brand-secondary-hover
```

**Test Plan:**
- Manual review of mapping against `design-tokens.json`
- Verify semantic correctness with design system docs
- Confirm all patterns from grep results are covered

**Expected Result:**
- Complete mapping table covering all button, input, link patterns
- Clear semantic naming for each pattern
- No ambiguous or missing mappings

---

## Task 3: Migrate Button Components

**Implementation:**
- Update button patterns in these files (identified by grep):
  - `app/login/page.tsx` - Sign in button
  - `app/register/page.tsx` - Sign up button
  - `app/(protected)/gigs/new/gig-form.tsx` - Post Gig button
  - `app/(protected)/gigs/[id]/apply-form.tsx` - Submit Application button
  - `app/(protected)/gigs/[id]/application-actions.tsx` - Accept/Reject buttons
  - `app/(protected)/gigs/[id]/submit-work-form.tsx` - Submit Work button
  - `app/(protected)/gigs/[id]/approve-work-form.tsx` - Approve Work button
  - `app/(protected)/gigs/[id]/withdraw-application-button.tsx` - Withdraw button
  - `app/components/MarkAsPaidButton.tsx` - Mark as Paid button
  - Other files with button patterns

- For each button:
  1. Identify current color classes (bg-*, text-*, hover:*, focus:*)
  2. Replace with token-based classes from mapping
  3. Preserve all other classes (padding, rounded, disabled, transition, etc.)
  4. Preserve semantic HTML (`<button>` tag)
  5. Preserve all text content and aria attributes

**Test Plan:**
```bash
# Run integration tests for forms
npm run test:unit -- gig-creation
npm run test:unit -- application
npm run test:unit -- auth

# Run E2E tests for button interactions
npm run test:e2e -- login
npm run test:e2e -- registration
npm run test:e2e -- gig-creation
npm run test:e2e -- application-flow

# Manual verification
# 1. Visit each page with buttons
# 2. Verify visual appearance matches original
# 3. Test hover states
# 4. Test focus states (Tab key)
# 5. Test disabled states
# 6. Test button clicks work identically
```

**Expected Result:**
- All button components use design token classes
- All tests pass without modification
- Visual appearance is pixel-perfect match
- All interactions work identically
- Accessibility unchanged (focus rings, keyboard nav)

---

## Task 4: Migrate Input/Textarea Components

**Implementation:**
- Update input/textarea patterns in these files:
  - `app/login/page.tsx` - Email, password inputs
  - `app/register/page.tsx` - Email, password inputs
  - `app/(protected)/gigs/new/gig-form.tsx` - Title, description, acceptance criteria, budget, tags
  - `app/(protected)/gigs/[id]/apply-form.tsx` - Approach, questions, effort textareas
  - `app/(protected)/gigs/[id]/message-form.tsx` - Message textarea
  - `app/(protected)/profile/edit/ProfileEditForm.tsx` - Profile fields
  - Other files with input/textarea patterns

- For each input/textarea:
  1. Identify current color classes (bg-*, border-*, text-*, placeholder:*, focus:*)
  2. Replace with token-based classes from mapping
  3. Preserve all other classes (padding, rounded, w-full, rows, etc.)
  4. Preserve semantic HTML (`<input>`, `<textarea>` tags)
  5. Preserve all attributes (type, name, required, placeholder, maxLength, etc.)
  6. Preserve all labels and helper text

**Test Plan:**
```bash
# Run integration tests for forms
npm run test:unit -- gig-creation
npm run test:unit -- application
npm run test:unit -- auth
npm run test:unit -- profile

# Run E2E tests for form interactions
npm run test:e2e -- gig-creation
npm run test:e2e -- application-submission
npm run test:e2e -- profile-edit

# Manual verification
# 1. Visit each form page
# 2. Verify input styling matches original
# 3. Test focus states (click into field)
# 4. Test placeholder text visibility
# 5. Test error states (submit invalid data)
# 6. Test character counters still work
# 7. Verify form submission works identically
```

**Expected Result:**
- All input/textarea components use design token classes
- All tests pass without modification
- Visual appearance is pixel-perfect match
- All form validation works identically
- Placeholder text remains visible and readable
- Error states display correctly

---

## Task 5: Migrate Link Components

**Implementation:**
- Update link patterns in these files:
  - `app/login/page.tsx` - "Sign up" link
  - `app/register/page.tsx` - "Sign in" link
  - `app/components/BackButton.tsx` - Back navigation links
  - `app/(protected)/gigs/new/gig-form.tsx` - "View example gigs" link
  - `app/(protected)/dashboard/page.tsx` - Navigation links
  - Other files with link patterns

- For each link:
  1. Identify current color classes (text-*, hover:*)
  2. Replace with token-based classes from mapping
  3. Preserve all other classes (font-*, underline, transition, etc.)
  4. Preserve semantic HTML (`<a>` or `<Link>` tags)
  5. Preserve all attributes (href, target, rel, etc.)
  6. Preserve all text content

**Test Plan:**
```bash
# Run E2E tests for navigation
npm run test:e2e -- navigation
npm run test:e2e -- gig-browsing

# Manual verification
# 1. Visit pages with links
# 2. Verify link color matches original
# 3. Test hover states
# 4. Test focus states (Tab key)
# 5. Test link navigation works
# 6. Verify external links open in new tab (where applicable)
```

**Expected Result:**
- All link components use design token classes
- All tests pass without modification
- Visual appearance is pixel-perfect match
- All navigation works identically
- Hover states work correctly
- Accessibility unchanged (focus rings, keyboard nav)

---

## Task 6: Run Full Integration Test Suite

**Implementation:**
- Run complete integration test suite to verify no regressions
- Pay special attention to form component tests
- Check for any test failures or warnings

**Test Plan:**
```bash
# Run all integration tests
npm run test:unit

# Check test coverage
npm run test:coverage

# Review coverage report for affected files
open coverage/index.html
```

**Expected Result:**
- All 493+ tests pass
- No new test failures
- No decrease in test coverage
- All form interactions work correctly
- All button interactions work correctly

---

## Task 7: Run Full E2E Test Suite

**Implementation:**
- Run complete E2E test suite to verify user flows
- Test critical paths: registration, login, gig creation, application submission
- Verify all button/input/link interactions work in real browser

**Test Plan:**
```bash
# Run all E2E tests
npm run test:e2e

# Run specific critical flows
npm run test:e2e -- auth
npm run test:e2e -- gig-lifecycle
npm run test:e2e -- application-flow
```

**Expected Result:**
- All E2E tests pass
- No new test failures
- All user flows work identically
- No visual regressions in screenshots
- All form submissions work correctly

---

## Task 8: Manual Accessibility Verification

**Implementation:**
- Use screen reader (NVDA/JAWS on Windows, VoiceOver on Mac) to test:
  - Button labels are announced correctly
  - Input labels and placeholders are announced
  - Link text is meaningful
  - Focus order is logical
  - All interactive elements are keyboard accessible

- Use browser DevTools accessibility audit:
  - Check color contrast ratios (WCAG AA)
  - Verify focus indicators are visible
  - Check for ARIA attribute correctness

**Test Plan:**
```bash
# Run Playwright accessibility tests (if available)
npm run test:e2e -- accessibility

# Manual checks:
# 1. Tab through all forms - verify focus visible
# 2. Use screen reader on login/register pages
# 3. Use screen reader on gig creation form
# 4. Use screen reader on application form
# 5. Check color contrast with DevTools
# 6. Verify all buttons have accessible names
```

**Expected Result:**
- All interactive elements keyboard accessible
- Focus indicators visible on all elements
- Screen reader announces all elements correctly
- Color contrast meets WCAG AA standards
- No accessibility regressions from original implementation

---

## Task 9: Visual Regression Review

**Implementation:**
- Manually review all affected pages side-by-side with original
- Take screenshots before/after for comparison
- Check for any unintended visual changes

**Pages to Review:**
- `/login` - Login form
- `/register` - Registration form
- `/dashboard` - Client and Specialist dashboards
- `/gigs` - Gig browse page
- `/gigs/new` - Gig creation form
- `/gigs/[id]` - Gig detail page (with apply form, accept/reject buttons)
- `/profile/edit` - Profile edit form

**Test Plan:**
- Visual comparison of each page
- Check button colors, hover states, focus states
- Check input styling, borders, focus states
- Check link colors and hover states
- Verify no layout shifts or spacing changes

**Expected Result:**
- All pages visually identical to original
- No color mismatches
- No layout shifts
- No spacing changes
- Hover and focus states work identically

---

## Rollback Plan

If critical issues are discovered:
1. Revert all changes via git: `git revert <commit-hash>`
2. Document issues found
3. Update token mapping to fix issues
4. Re-attempt migration with corrected mapping
