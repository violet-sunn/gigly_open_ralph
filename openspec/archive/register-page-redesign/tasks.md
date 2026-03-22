# Implementation Tasks: Register Page Redesign

## Task 1: Fetch Figma Design Context
Use the Figma MCP tool to retrieve exact design specifications for the register page.

**Implementation Notes:**
- Use `mcp__figma__get_design_context` tool
- File key: `Nexptl0M63VM62lPVkjxxx`
- Node ID: `4100-385`
- Extract exact color values, dimensions, and spacing
- Document any design tokens or patterns used

**Test Plan:**
- Verify Figma tool returns design context successfully
- Verify extracted specifications match requirements
- Document any discrepancies between Figma and requirements

---

## Task 2: Update Register Page Heading
Change the heading text from "Create your account" to "Регистрация" (Russian).

**Implementation Notes:**
- File: `app/register/page.tsx`
- Locate the `<h2>` element with "Create your account" text
- Replace with "Регистрация"
- Maintain existing font size (22px) and styling
- Ensure font-semibold weight is applied

**Test Plan:**
- Visual inspection: heading displays "Регистрация"
- Font size is 22px
- Font weight is semibold
- Text is white and center-aligned
- Existing E2E tests pass

---

## Task 3: Update Input Field Styling
Apply exact Figma styling to email and password input fields.

**Implementation Notes:**
- File: `app/register/page.tsx`
- Update email and password input className attributes
- Background: `bg-[#10121c]`
- Border: `border border-[#242935]`
- Border-radius: `rounded-[20px]`
- Padding: `px-[20px] py-[20px]`
- Focus ring: `focus:ring-2 focus:ring-[#0088ff]`
- Maintain existing placeholder and accessibility attributes

**Test Plan:**
- Visual inspection: inputs have correct background (#10121c)
- Visual inspection: inputs have correct border (#242935)
- Visual inspection: inputs have 20px border-radius
- Visual inspection: inputs have 20px padding
- Focus state shows blue ring (#0088ff)
- Inputs remain functional (typing, validation)
- Existing E2E tests pass

---

## Task 4: Update Submit Button Text
Change the submit button text from "Sign up" to "Зарегестрироватся" (Russian).

**Implementation Notes:**
- File: `app/register/page.tsx`
- Locate the `SubmitButton` component
- Change text from "Sign up" to "Зарегестрироватся"
- Maintain "Signing up..." for pending state
- Verify AuthButton component already has correct styling (50px height, #0088FF background)

**Test Plan:**
- Visual inspection: button displays "Зарегестрироватся"
- Button height is 50px
- Button background is #0088FF
- Pending state shows "Signing up..."
- Button remains functional (click, submit)
- Existing E2E tests pass

---

## Task 5: Update Secondary Link Text and Styling
Change the secondary link text from "Already have an account? Sign in" to "Войти" (Russian).

**Implementation Notes:**
- File: `app/register/page.tsx`
- Locate the secondary AuthButton with "Already have an account? Sign in" text
- Replace with "Войти"
- Verify button uses `variant="secondary"` (rgba(0,136,255,0.24) background)
- Verify button height is 50px
- Verify button links to `/login`

**Test Plan:**
- Visual inspection: link displays "Войти"
- Link height is 50px
- Link background is rgba(0,136,255,0.24)
- Link navigates to `/login` on click
- Existing E2E tests pass

---

## Task 6: Add Decorative Background Pattern
Implement the checkerboard background pattern at the bottom of the page.

**Implementation Notes:**
- File: `app/register/page.tsx`
- Wrap the AuthContainer in a parent div with full-screen background
- Add decorative pattern as absolute positioned element at bottom
- Pattern: SVG checkerboard with #0088ff at 0.3 opacity
- Height: 327px, Width: 100%
- Z-index: 0 (behind content)
- Pointer-events: none
- Reference login page implementation for pattern code

**Test Plan:**
- Visual inspection: pattern visible at bottom of page
- Pattern uses checkerboard design
- Pattern color is #0088ff at 0.3 opacity
- Pattern height is 327px
- Pattern spans full width
- Pattern does not interfere with form interaction
- Pattern is behind content (z-index 0)
- Existing E2E tests pass

---

## Task 7: Ensure Responsive Design
Verify and adjust responsive behavior for mobile viewports.

**Implementation Notes:**
- File: `app/register/page.tsx`
- Verify AuthContainer uses responsive width classes
- Desktop: `w-[418px]`
- Mobile: `w-[90vw]` (viewport < 768px)
- Desktop padding: `p-[40px]`
- Mobile padding: `p-[20px]`
- Use Tailwind responsive prefixes: `md:w-[418px]` and `md:p-[40px]`
- Test on mobile viewport (375px width)

**Test Plan:**
- Visual inspection on desktop (1920px): container is 418px wide with 40px padding
- Visual inspection on mobile (375px): container is 90vw wide with 20px padding
- All form elements remain functional on mobile
- Text remains readable on mobile
- Buttons remain clickable on mobile
- Pattern scales appropriately on mobile
- Existing E2E tests pass

---

## Task 8: Verify Role Pre-selection Behavior
Ensure role query parameter behavior remains unchanged.

**Implementation Notes:**
- No code changes required (existing implementation should work)
- Verify `?role=SPECIALIST` pre-selects SPECIALIST card
- Verify `?role=CLIENT` pre-selects CLIENT card
- Verify no parameter shows both cards unselected
- Verify selected card has blue border (#0265dc or #0088ff)

**Test Plan:**
- Navigate to `/register?role=SPECIALIST`
- Verify SPECIALIST card is pre-selected with blue border
- Navigate to `/register?role=CLIENT`
- Verify CLIENT card is pre-selected with blue border
- Navigate to `/register` (no parameter)
- Verify both cards are visible and unselected
- Verify user can select either card
- Existing E2E tests pass

---

## Task 9: Create E2E Tests for Visual Specifications
Add E2E tests to verify Figma design implementation.

**Implementation Notes:**
- File: `__tests__/e2e/register-page-redesign.spec.ts`
- Test 1: Verify heading displays "Регистрация"
- Test 2: Verify input fields have correct styling (#10121c, #242935, 20px border-radius)
- Test 3: Verify submit button displays "Зарегестрироватся"
- Test 4: Verify secondary link displays "Войти"
- Test 5: Verify decorative pattern is visible at bottom
- Test 6: Verify responsive design (desktop vs mobile)
- Test 7: Verify role pre-selection with query parameter
- Use Playwright's `locator()` and `toHaveCSS()` for style verification

**Test Plan:**
- Run `npm run test:e2e`
- All 7 new tests pass
- All existing E2E tests pass
- Test coverage includes visual specifications and functionality

---

## Task 10: Visual Comparison with Figma
Perform side-by-side visual comparison with Figma design.

**Implementation Notes:**
- Open Figma design: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385
- Open local register page: http://localhost:3000/register
- Compare dimensions, colors, spacing, typography
- Document any discrepancies
- Take screenshots for documentation

**Test Plan:**
- Container dimensions match (418px width, 540px min-height, 25px border-radius)
- Colors match (#060813, #10121c, #242935, #0088FF)
- Spacing matches (47px, 30px, 21px, 17px gaps)
- Typography matches (22px heading, 19px button, 15px link)
- Decorative pattern matches (checkerboard, 327px height)
- Overall visual appearance matches Figma design
- No visual regressions from previous implementation

---

## Summary

**Total Tasks:** 10
**Estimated Effort:** 4-6 hours
**Risk Level:** Low (mostly visual changes, existing functionality preserved)

**Dependencies:**
- Task 1 should be completed first (Figma design context)
- Tasks 2-6 can be done in parallel
- Task 7 depends on Tasks 2-6 (responsive testing)
- Task 8 can be done in parallel (verification only)
- Task 9 depends on Tasks 2-7 (E2E tests)
- Task 10 depends on all previous tasks (final verification)

**Next Steps:**
1. Run `/ralphy-implement register-page-redesign` to begin implementation
2. Follow tasks in order (1 → 2-6 → 7-8 → 9 → 10)
3. Run full test suite after each task
4. Perform visual comparison at the end
5. Run `/ralphy-archive register-page-redesign` when complete
