# Implementation Tasks: UI Interactive States Token Migration

## Task 1: Update Authentication Pages Focus Rings

**Description:**
Replace hardcoded `focus:ring-offset-navy-900` with token-based `focus:ring-offset-surface-level-0` in registration and login page submit buttons.

**Files to Modify:**
- `app/register/page.tsx` (line 14)
- `app/login/page.tsx` (line 14)

**Implementation Notes:**
1. Open `app/register/page.tsx`
2. Locate the `SubmitButton` component (line 8-19)
3. In the button className, replace `focus:ring-offset-navy-900` with `focus:ring-offset-surface-level-0`
4. Repeat for `app/login/page.tsx`

**Specific Change:**
```tsx
// Before:
className="... focus:ring-offset-2 focus:ring-offset-navy-900 ..."

// After:
className="... focus:ring-offset-2 focus:ring-offset-surface-level-0 ..."
```

**Test Plan:**
1. Navigate to `/register` in browser
2. Tab to the "Sign up" button using keyboard
3. Verify focus ring is visible with blue color and proper offset
4. Repeat for `/login` page with "Sign in" button
5. Test on different screen sizes (mobile, tablet, desktop)
6. Verify focus ring contrast meets WCAG AA (≥3:1)
7. Run E2E tests: `npm run test:e2e -- auth`
8. Verify all authentication flow tests pass

**Success Criteria:**
- Focus rings visible on both pages
- No visual regressions
- All E2E tests pass
- Keyboard navigation works correctly

---

## Task 2: Update Homepage CTA Focus Rings

**Description:**
Replace hardcoded `focus:ring-offset-navy-900` with token-based `focus:ring-offset-surface-level-0` in all homepage call-to-action buttons.

**Files to Modify:**
- `app/page.tsx` (lines 19, 26, 37)

**Implementation Notes:**
1. Open `app/page.tsx`
2. Locate three button/link elements with focus ring classes:
   - "Get Started" link (line 19)
   - "Sign out" button (line 26)
   - "Go to Dashboard" link (line 37)
3. Replace `focus:ring-offset-navy-900` with `focus:ring-offset-surface-level-0` in all three locations

**Specific Change:**
```tsx
// Before (all 3 instances):
className="... focus:ring-offset-2 focus:ring-offset-navy-900"

// After (all 3 instances):
className="... focus:ring-offset-2 focus:ring-offset-surface-level-0"
```

**Test Plan:**
1. Navigate to `/` as anonymous user
2. Tab through "Get Started" and "Sign in" links
3. Verify focus rings visible on both elements
4. Sign in as any user
5. Navigate to `/` as authenticated user
6. Tab through "Go to Dashboard" and "Sign out" buttons
7. Verify focus rings visible on both elements
8. Test on different screen sizes
9. Run E2E tests: `npm run test:e2e -- homepage`
10. Verify all homepage tests pass

**Success Criteria:**
- Focus rings visible on all CTA elements
- Anonymous and authenticated states both work
- No visual regressions
- All E2E tests pass

---

## Task 3: Update Gig Creation Form Focus Ring

**Description:**
Replace hardcoded `focus:ring-offset-navy-900` with token-based `focus:ring-offset-surface-level-0` in gig creation form submit button.

**Files to Modify:**
- `app/(protected)/gigs/new/gig-form.tsx` (line 16)

**Implementation Notes:**
1. Open `app/(protected)/gigs/new/gig-form.tsx`
2. Locate the `SubmitButton` component (line 10-21)
3. In the button className, replace `focus:ring-offset-navy-900` with `focus:ring-offset-surface-level-0`

**Specific Change:**
```tsx
// Before:
className="... focus:ring-offset-2 focus:ring-offset-navy-900 ..."

// After:
className="... focus:ring-offset-2 focus:ring-offset-surface-level-0 ..."
```

**Test Plan:**
1. Sign in as CLIENT user
2. Navigate to `/dashboard/gigs/new`
3. Fill out the gig creation form
4. Tab to the "Post Gig" button
5. Verify focus ring is visible with proper styling
6. Submit the form and verify it works correctly
7. Test keyboard navigation through entire form
8. Run E2E tests: `npm run test:e2e -- gig-creation`
9. Run integration tests: `npm run test:unit -- gig-creation`
10. Verify all tests pass

**Success Criteria:**
- Focus ring visible on submit button
- Form submission works correctly
- No functional regressions
- All gig creation tests pass (43 integration tests)

---

## Task 4: Update Gig Detail Apply Form Focus Ring

**Description:**
Replace hardcoded `focus:ring-offset-navy-900` with token-based `focus:ring-offset-surface-level-0` in gig detail page apply form submit button.

**Files to Modify:**
- `app/(protected)/gigs/[id]/apply-form.tsx` (line 14)

**Implementation Notes:**
1. Open `app/(protected)/gigs/[id]/apply-form.tsx`
2. Locate the `SubmitButton` component
3. In the button className, replace `focus:ring-offset-navy-900` with `focus:ring-offset-surface-level-0`

**Specific Change:**
```tsx
// Before:
className="... focus:ring-offset-2 focus:ring-offset-navy-900 ..."

// After:
className="... focus:ring-offset-2 focus:ring-offset-surface-level-0 ..."
```

**Test Plan:**
1. Sign in as SPECIALIST user
2. Navigate to `/dashboard/gigs` and click on an OPEN gig
3. Scroll to the apply form
4. Tab to the "Apply" button
5. Verify focus ring is visible
6. Fill out the application form and submit
7. Verify application submission works correctly
8. Run E2E tests: `npm run test:e2e -- application`
9. Verify all application flow tests pass

**Success Criteria:**
- Focus ring visible on apply button
- Application submission works correctly
- No functional regressions
- All application tests pass

---

## Task 5: Update Profile Pages Focus Rings

**Description:**
Replace hardcoded `focus:ring-offset-navy-900` with token-based `focus:ring-offset-surface-level-0` in profile view and edit pages.

**Files to Modify:**
- `app/(protected)/profile/page.tsx` (line 247)
- `app/(protected)/profile/edit/ProfileEditForm.tsx` (line 15)

**Implementation Notes:**
1. Open `app/(protected)/profile/page.tsx`
2. Locate the "Edit Profile" link (around line 247)
3. Replace `focus:ring-offset-navy-900` with `focus:ring-offset-surface-level-0`
4. Open `app/(protected)/profile/edit/ProfileEditForm.tsx`
5. Locate the save button (line 15)
6. Replace `focus:ring-offset-navy-900` with `focus:ring-offset-surface-level-0`

**Specific Change:**
```tsx
// Before (both files):
className="... focus:ring-offset-2 focus:ring-offset-navy-900 ..."

// After (both files):
className="... focus:ring-offset-2 focus:ring-offset-surface-level-0 ..."
```

**Test Plan:**
1. Sign in as any user (CLIENT or SPECIALIST)
2. Navigate to `/dashboard/profile`
3. Tab to the "Edit Profile" link
4. Verify focus ring is visible
5. Click "Edit Profile" to navigate to edit page
6. Fill out profile form
7. Tab to the "Save" button
8. Verify focus ring is visible
9. Submit the form and verify it works
10. Run E2E tests: `npm run test:e2e -- profile`
11. Verify all profile tests pass

**Success Criteria:**
- Focus rings visible on both pages
- Profile view and edit functionality works correctly
- No functional regressions
- All profile tests pass

---

## Task 6: Update Dashboard CTA Focus Ring

**Description:**
Replace hardcoded `focus:ring-offset-navy-900` with token-based `focus:ring-offset-surface-level-0` in dashboard CTA buttons.

**Files to Modify:**
- `app/(protected)/dashboard/page.tsx` (line 149)

**Implementation Notes:**
1. Open `app/(protected)/dashboard/page.tsx`
2. Locate the CTA button (around line 149)
3. Replace `focus:ring-offset-navy-900` with `focus:ring-offset-surface-level-0`

**Specific Change:**
```tsx
// Before:
className="... focus:ring-offset-2 focus:ring-offset-navy-900"

// After:
className="... focus:ring-offset-2 focus:ring-offset-surface-level-0"
```

**Test Plan:**
1. Sign in as CLIENT user
2. Navigate to `/dashboard`
3. Tab to the "Post a Gig" button
4. Verify focus ring is visible
5. Sign out and sign in as SPECIALIST user
6. Navigate to `/dashboard`
7. Tab to the "Browse Gigs" button
8. Verify focus ring is visible
9. Run E2E tests: `npm run test:e2e -- dashboard`
10. Verify all dashboard tests pass

**Success Criteria:**
- Focus rings visible on dashboard CTAs
- Dashboard functionality works correctly for both roles
- No functional regressions
- All dashboard tests pass

---

## Task 7: Document Hover State Strategy in UI Spec

**Description:**
Add a new section to the UI specification documenting the hover state strategy to guide developers on when to use tokens vs. hardcoded values.

**Files to Modify:**
- `openspec/specs/ui/spec.md`

**Implementation Notes:**
1. Open `openspec/specs/ui/spec.md`
2. Add a new section after the "Text Color Token Usage Guidelines" requirement
3. Document the hover state strategy with clear guidelines and examples

**Content to Add:**
```markdown
### Requirement: Hover State Strategy

All interactive elements MUST follow a consistent strategy for hover state styling.

#### Scenario: Token-first approach for hover states
- GIVEN an interactive element needs hover state styling
- WHEN appropriate design tokens exist for the hover state
- THEN the component MUST use design tokens (e.g., `hover:bg-surface-level-2` for cards)
- AND hardcoded values MUST NOT be used when tokens are available

#### Scenario: Hardcoded fallbacks for hover states without tokens
- GIVEN an interactive element needs hover state styling
- AND no appropriate design token exists for the desired hover effect
- WHEN the hover state is implemented
- THEN hardcoded values MAY be used as a pragmatic fallback (e.g., `hover:bg-navy-700` for subtle hover effects)
- AND the usage SHOULD be consistent with the design system's color palette

**Hover State Guidelines:**

1. **Cards and Containers:**
   - Use `hover:bg-surface-level-2` when hovering over cards on `bg-surface-level-1` backgrounds
   - Use `hover:border-neutral-strong` for border emphasis on hover

2. **Buttons:**
   - Primary buttons: Use `hover:bg-blue-600` (semantic color, not a token)
   - Secondary buttons: Use `hover:bg-gray-200` or similar semantic colors
   - Danger buttons: Use `hover:bg-red-600` (semantic color)

3. **Links:**
   - Use `hover:text-blue-400` for blue links
   - Use `hover:text-white` for navigation links on dark backgrounds

4. **Navigation Items:**
   - Use `hover:bg-navy-700` for subtle hover effects on dark navigation (acceptable hardcoded fallback)
   - Use `hover:text-white` for text color changes

5. **Form Inputs:**
   - Use `focus:border-blue-500` and `focus:ring-blue-500` (semantic colors)
   - Hover states on inputs are generally not needed (focus states are sufficient)

**When Hardcoded Values Are Acceptable:**
- Subtle hover effects where no appropriate token exists (e.g., `hover:bg-navy-700`)
- Semantic colors for buttons and status indicators (e.g., `hover:bg-blue-600`, `hover:bg-red-600`)
- Transitions and animations that require specific color values

**When Tokens Are Required:**
- Background surfaces (use `bg-surface-level-*` tokens)
- Borders (use `border-neutral-*` tokens)
- Text colors (use `text-neutral-*` tokens for non-semantic text)

**Acceptance Criteria:**
- Hover states use tokens where appropriate tokens exist
- Hardcoded values used only for semantic colors or where no token exists
- Hover effects are consistent across similar components
- All hover states maintain adequate contrast for accessibility
```

**Test Plan:**
1. Review the documentation for clarity and completeness
2. Verify examples are accurate and match current implementation
3. Share with team for feedback
4. Ensure guidelines are easy to follow for new developers

**Success Criteria:**
- Documentation is clear and comprehensive
- Guidelines cover common use cases
- Examples are accurate and helpful
- Team agrees with the strategy

---

## Task 8: Comprehensive Testing and Verification

**Description:**
Run comprehensive testing across all user flows to verify that the interactive state migration has not introduced any regressions.

**Implementation Notes:**
1. Run full E2E test suite
2. Perform manual keyboard navigation testing
3. Verify focus indicators on all pages
4. Test hover states on all interactive elements
5. Check accessibility compliance

**Test Plan:**

**Automated Testing:**
1. Run full E2E test suite: `npm run test:e2e`
2. Run full integration test suite: `npm run test:unit`
3. Verify all tests pass (expected: 493 tests passing)
4. Check for any new console errors or warnings

**Manual Keyboard Navigation Testing:**
1. Test registration flow with keyboard only (Tab, Enter)
2. Test login flow with keyboard only
3. Test gig creation flow with keyboard only
4. Test gig browsing and application with keyboard only
5. Test profile view and edit with keyboard only
6. Test dashboard navigation with keyboard only
7. Verify all interactive elements are reachable via keyboard
8. Verify focus indicators are visible at all times

**Focus Indicator Visibility Testing:**
1. Check focus rings on all buttons (primary, secondary, danger)
2. Check focus rings on all links (navigation, inline, CTA)
3. Check focus rings on all form inputs (text, textarea, select, radio)
4. Check focus rings on all cards with hover states
5. Verify focus rings have adequate contrast (≥3:1) on all backgrounds
6. Test on different screen sizes (320px, 768px, 1024px, 1440px)

**Hover State Testing:**
1. Hover over all buttons and verify hover effects work
2. Hover over all links and verify hover effects work
3. Hover over all cards and verify hover effects work
4. Hover over navigation items and verify hover effects work
5. Verify hover states are consistent across similar components
6. Verify no hover states are broken or missing

**Accessibility Testing:**
1. Use keyboard-only navigation for all user flows
2. Test with screen reader (NVDA or JAWS) on key pages
3. Verify focus order is logical on all pages
4. Verify no focus traps exist
5. Verify all interactive elements are announced correctly
6. Run axe DevTools accessibility scan on key pages

**Visual Regression Testing:**
1. Take screenshots of all pages before and after changes
2. Compare screenshots for unintended visual changes
3. Verify only focus ring offsets have changed
4. Verify no layout shifts or spacing changes

**Success Criteria:**
- All 493 tests pass without modification
- Keyboard navigation works on all pages
- Focus indicators visible and meet WCAG AA contrast
- Hover states work correctly on all interactive elements
- No accessibility regressions
- No visual regressions (except intended focus ring changes)
- No console errors or warnings

---

## Summary

**Total Tasks:** 8
**Estimated Time:** 3-5 hours
**Files Modified:** 8 component files + 1 spec file

**Task Dependencies:**
- Tasks 1-6 can be completed in parallel (independent file changes)
- Task 7 can be completed independently
- Task 8 must be completed after all other tasks

**Rollback Plan:**
If issues are discovered, revert all changes with:
```bash
git checkout HEAD -- app/register/page.tsx app/login/page.tsx app/page.tsx app/(protected)/profile/page.tsx app/(protected)/profile/edit/ProfileEditForm.tsx app/(protected)/gigs/[id]/apply-form.tsx app/(protected)/gigs/new/gig-form.tsx app/(protected)/dashboard/page.tsx
```

**Next Steps:**
After completing all tasks and verifying success:
1. Commit changes with descriptive message
2. Create pull request with reference to this change proposal
3. Request code review from team
4. Merge after approval
5. Monitor production for any issues
