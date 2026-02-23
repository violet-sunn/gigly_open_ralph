# Implementation Tasks: input-accessibility-fix

## Task 1: Remove Dark Mode CSS from globals.css

**Description**: Remove the dark mode media query that causes input text visibility issues.

**Implementation**:
1. Open `app/globals.css`
2. Delete lines 10-15 (the `@media (prefers-color-scheme: dark)` block)
3. Keep the `:root` CSS variables for light mode (lines 5-8)
4. Keep the body styling (lines 17-21)

**Expected Result**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}
```

**Test Plan**:
1. Open the application in a browser with dark mode system preference enabled
2. Navigate to `/login`
3. Verify the page background remains white (not black)
4. Verify text remains dark (not light)
5. Verify no visual regressions on any page

**Acceptance Criteria**:
- Dark mode media query removed from `app/globals.css`
- Application displays light theme regardless of system preference
- No visual regressions on existing pages

---

## Task 2: Audit and Fix Login Page Input Styling

**Description**: Ensure login page inputs have explicit text color and consistent styling.

**Implementation**:
1. Open `app/login/page.tsx`
2. Locate email input (line 41-48)
3. Add `text-gray-900` to className if not present
4. Verify border and focus classes are correct
5. Locate password input (line 54-61)
6. Add `text-gray-900` to className if not present
7. Verify border and focus classes are correct

**Current State** (lines 41-48):
```tsx
<input
  id="email"
  name="email"
  type="email"
  required
  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  placeholder="you@example.com"
/>
```

**Expected State**:
```tsx
<input
  id="email"
  name="email"
  type="email"
  required
  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  placeholder="you@example.com"
/>
```

**Test Plan**:
1. Navigate to `/login`
2. Type in the email field
3. Verify text is dark and clearly visible (not light gray or invisible)
4. Type in the password field
5. Verify text is dark and clearly visible
6. Test with dark mode system preference enabled
7. Verify inputs remain readable
8. Test focus states (click into each field)
9. Verify blue focus ring appears

**Acceptance Criteria**:
- Email input has `text-gray-900 bg-white` classes
- Password input has `text-gray-900 bg-white` classes
- Input text is clearly visible when typing
- Focus states work correctly (blue ring)
- No visual regressions

---

## Task 3: Audit and Fix Registration Page Input Styling

**Description**: Ensure registration page inputs have explicit text color and consistent styling.

**Implementation**:
1. Open `app/register/page.tsx`
2. Locate all input fields (email, password, role radio buttons)
3. Add `text-gray-900 bg-white` to text input className if not present
4. Verify border and focus classes are correct

**Test Plan**:
1. Navigate to `/register`
2. Type in the email field
3. Verify text is dark and clearly visible
4. Type in the password field
5. Verify text is dark and clearly visible
6. Select role radio buttons
7. Verify radio buttons are visible and functional
8. Test with dark mode system preference enabled
9. Verify all inputs remain readable
10. Submit form and verify no functionality broken

**Acceptance Criteria**:
- All text inputs have `text-gray-900 bg-white` classes
- Input text is clearly visible when typing
- Radio buttons remain functional
- Focus states work correctly
- Form submission works as before

---

## Task 4: Audit and Fix Gig Creation Form Input Styling

**Description**: Ensure gig creation form inputs and textareas have explicit text color and consistent styling.

**Implementation**:
1. Open `app/dashboard/gigs/new/gig-form.tsx`
2. Locate all input and textarea fields:
   - Title input (line 62-69)
   - Description textarea (line 76-83)
   - Acceptance criteria textarea (line 110-123)
   - Goal textarea (line 144-151)
   - Deliverables textarea (line 168-175)
   - Constraints textarea (line 192-199)
   - Budget input (line 226-237)
   - Tags input (line 262-267)
3. Add `text-gray-900` to className for each field if not present
4. Verify `bg-white` is present or add it
5. Verify border and focus classes are correct

**Current State Example** (line 62-69):
```tsx
<input
  id="title"
  name="title"
  type="text"
  required
  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
  placeholder="e.g. Build a React dashboard"
/>
```

**Expected State**:
```tsx
<input
  id="title"
  name="title"
  type="text"
  required
  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
  placeholder="e.g. Build a React dashboard"
/>
```

**Test Plan**:
1. Log in as CLIENT user
2. Navigate to `/dashboard/gigs/new`
3. Type in each field (title, description, acceptance criteria, goal, deliverables, constraints, budget, tags)
4. Verify text is dark and clearly visible in all fields
5. Test with dark mode system preference enabled
6. Verify all inputs remain readable
7. Test character counters still work
8. Test quality warning still appears
9. Test fee preview still calculates correctly
10. Submit form and verify gig is created successfully

**Acceptance Criteria**:
- All 8 input/textarea fields have `text-gray-900 bg-white` classes
- Input text is clearly visible when typing in all fields
- Character counters remain functional
- Quality warning remains functional
- Fee preview remains functional
- Form submission works as before
- No visual regressions in form layout

---

## Task 5: Audit and Fix Message Form Input Styling

**Description**: Ensure message form textarea has explicit text color and consistent styling.

**Implementation**:
1. Open `app/dashboard/gigs/[id]/message-form.tsx`
2. Locate the message content textarea
3. Add `text-gray-900 bg-white` to className if not present
4. Verify border and focus classes are correct

**Test Plan**:
1. Log in as CLIENT user
2. Create a gig and accept an application (or use existing IN_PROGRESS gig)
3. Navigate to `/dashboard/gigs/[id]` for the gig
4. Scroll to message form
5. Type in the message textarea
6. Verify text is dark and clearly visible
7. Test with dark mode system preference enabled
8. Verify textarea remains readable
9. Send a message and verify it appears in the message list
10. Log in as SPECIALIST and verify message form is also readable

**Acceptance Criteria**:
- Message textarea has `text-gray-900 bg-white` classes
- Input text is clearly visible when typing
- Message sending works as before
- No visual regressions

---

## Task 6: Audit and Fix Profile Edit Form Input Styling

**Description**: Ensure profile edit form inputs have explicit text color and consistent styling.

**Implementation**:
1. Open `app/dashboard/profile/edit/page.tsx`
2. Locate all input and textarea fields (role-specific fields)
3. Add `text-gray-900 bg-white` to className for each field if not present
4. Verify border and focus classes are correct

**Test Plan**:
1. Log in as CLIENT user
2. Navigate to `/dashboard/profile/edit`
3. Type in each field (companyName, inn, kpp, contactPerson, phoneNumber)
4. Verify text is dark and clearly visible in all fields
5. Test with dark mode system preference enabled
6. Verify all inputs remain readable
7. Save profile and verify changes persist
8. Log in as SPECIALIST user
9. Navigate to `/dashboard/profile/edit`
10. Type in each field (displayName, techStack, experienceLevel, bio)
11. Verify text is dark and clearly visible in all fields
12. Save profile and verify changes persist

**Acceptance Criteria**:
- All CLIENT profile inputs have `text-gray-900 bg-white` classes
- All SPECIALIST profile inputs have `text-gray-900 bg-white` classes
- Input text is clearly visible when typing in all fields
- Profile saving works as before
- No visual regressions

---

## Task 7: Audit and Fix Profile View Pages

**Description**: Ensure profile view pages (own profile and public profile) display with consistent light theme styling and do not inherit dark mode CSS variables.

**Implementation**:
1. Open `app/dashboard/profile/page.tsx`
2. Audit all text elements for explicit text color classes
3. Ensure all containers have explicit background colors
4. Add `text-gray-900` to any text elements that might inherit from body
5. Verify all `<p>` tags displaying profile data have explicit text color
6. Open `app/dashboard/profile/[userId]/page.tsx`
7. Perform the same audit for the public profile page
8. Ensure headings, labels, and content text all have explicit colors

**Current State Analysis**:
Both profile pages use light theme classes, but some text elements may inherit color from the body element. When dark mode CSS is active (before Task 1), these elements display light text on white backgrounds, creating visibility issues.

**Areas to Check**:
- Page headings (`<h1>` tags) - should have `text-gray-900`
- Field labels (`.text-gray-700`) - already correct
- Profile data (`<p>` tags) - need explicit `text-gray-900`
- Container backgrounds - verify `bg-white` is present
- Warning/error messages - verify explicit colors
- Link elements - verify explicit colors

**Expected Changes**:

For `app/dashboard/profile/page.tsx`:
- Line 46: Add `text-gray-900` to h1 if not present
- Lines 50, 54, 58, 62, 66: Ensure `<p>` tags have `text-gray-900` class
- Line 116: Add `text-gray-900` to h1 if not present
- Lines 120, 124, 128, 132, 136, 140: Ensure `<p>` tags have `text-gray-900` class

For `app/dashboard/profile/[userId]/page.tsx`:
- Line 51: Add `text-gray-900` to h1 if not present
- Lines 55, 59, 63, 67: Ensure `<p>` tags have `text-gray-900` class
- Line 85: Add `text-gray-900` to h1 if not present
- Lines 89, 93: Ensure `<p>` tags have `text-gray-900` class

**Test Plan**:
1. Set OS to dark mode system preference
2. Navigate to `/dashboard/profile` (before Task 1 is applied)
3. Observe if any text appears light/invisible (this confirms the issue)
4. Apply Task 1 (remove dark mode CSS)
5. Apply this task (add explicit text colors)
6. Navigate to `/dashboard/profile` again
7. Verify all text is dark and clearly visible
8. Verify page background is white
9. Verify no elements inherit light text color from body
10. Log in as different user and navigate to `/dashboard/profile/[userId]`
11. Verify public profile page also displays correctly
12. Test with both CLIENT and SPECIALIST profiles
13. Verify "Not set" / "Not specified" placeholders are visible
14. Verify all links are visible and styled correctly

**Acceptance Criteria**:
- All headings have explicit `text-gray-900` class
- All profile data `<p>` tags have explicit `text-gray-900` class
- All containers have explicit `bg-white` or appropriate background
- Profile pages display correctly with light theme regardless of system preference
- No text inherits light color from body element
- Both own profile and public profile pages are fixed
- Both CLIENT and SPECIALIST profile views work correctly
- No visual regressions in layout or spacing

---

## Task 8: Comprehensive Manual Testing

**Description**: Perform comprehensive manual testing across all forms with various system preferences.

**Test Plan**:

### Test Case 1: Light Mode System Preference
1. Set OS to light mode
2. Open application in browser
3. Test all forms (login, register, gig creation, messaging, profile edit)
4. Test all profile pages (own profile, public profile)
5. Verify all inputs have dark, readable text
6. Verify all profile text is dark and readable
7. Verify no visual regressions

### Test Case 2: Dark Mode System Preference
1. Set OS to dark mode
2. Open application in browser
3. Test all forms (login, register, gig creation, messaging, profile edit)
4. Test all profile pages (own profile, public profile)
5. Verify all inputs have dark, readable text (not light text)
6. Verify all profile text is dark and readable (not light text)
7. Verify application displays light theme (not dark theme)
8. Verify no visual regressions

### Test Case 3: Browser Compatibility
1. Test in Chrome (latest)
2. Test in Firefox (latest)
3. Test in Safari (latest)
4. Test in Edge (latest)
5. Verify consistent appearance across all browsers

### Test Case 4: Contrast Verification
1. Use browser DevTools to inspect input text color
2. Verify text color is `#111827` (text-gray-900) or darker
3. Verify background is `#ffffff` (white) or `#f9fafb` (gray-50)
4. Calculate contrast ratio (should be ≥ 4.5:1 for WCAG AA)
5. Verify all inputs meet contrast requirements

### Test Case 5: Existing Functionality
1. Test login flow (login, redirect to dashboard)
2. Test registration flow (register, redirect to dashboard)
3. Test gig creation (create gig, verify it appears in dashboard)
4. Test messaging (send message, verify it appears in message list)
5. Test profile editing (edit profile, verify changes persist)
6. Verify all existing functionality works as before

**Acceptance Criteria**:
- All forms display readable input text in both light and dark mode system preferences
- Application displays consistent light theme regardless of system preference
- All browsers display inputs consistently
- All inputs meet WCAG AA contrast requirements (≥ 4.5:1)
- All existing functionality works as before
- No visual regressions detected

---

## Task 9: Run Existing Test Suite

**Description**: Verify all existing tests continue to pass after changes.

**Test Plan**:
1. Run unit tests: `npm run test:unit`
2. Verify all tests pass
3. Run E2E tests: `npm run test:e2e`
4. Verify all tests pass
5. If any tests fail, investigate and fix

**Acceptance Criteria**:
- All unit tests pass
- All E2E tests pass
- No test regressions introduced

---

## Summary

**Total Tasks**: 9
**Estimated Time**: 2.5-3.5 hours
**Dependencies**: None (tasks can be done sequentially)

**Task Order**:
1. Remove dark mode CSS (Task 1) - 15 minutes
2. Fix login page (Task 2) - 15 minutes
3. Fix registration page (Task 3) - 15 minutes
4. Fix gig creation form (Task 4) - 30 minutes
5. Fix message form (Task 5) - 15 minutes
6. Fix profile edit form (Task 6) - 20 minutes
7. Fix profile view pages (Task 7) - 20 minutes
8. Comprehensive manual testing (Task 8) - 50 minutes
9. Run existing test suite (Task 9) - 10 minutes

**Critical Path**: Tasks 1-7 must be completed before Task 8 (manual testing)
