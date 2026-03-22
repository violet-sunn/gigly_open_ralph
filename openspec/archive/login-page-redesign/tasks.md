# Tasks: login-page-redesign

## Task 1: Fetch Figma Design Specifications

**Implementation:**
- Use Figma MCP tool (`mcp__figma__get_design_context`) to fetch design context for login variant
- Extract fileKey: `Nexptl0M63VM62lPVkjxxx` and nodeId: `4100-385` from URL
- Document retrieved specifications:
  - Container dimensions (418x540px, 25px border-radius, 40px padding)
  - Color values for backgrounds, borders, text
  - Typography (22px Manrope SemiBold for heading)
  - Input field styling (#10121c background, #242935 border, 20px border-radius, 20px padding)
  - Button styling (50px height, #0088FF background)
  - Spacing between elements
  - Decorative background pattern asset
- Save screenshot for visual QA reference

**Test Plan:**
- Verify Figma MCP tool returns design context successfully
- Verify screenshot matches expected login variant
- Document all specifications in implementation notes

---

## Task 2: Create Reusable UI Components

**Implementation:**
- Create `AuthContainer` component (or styled div):
  - Width: 418px, min-height: 540px
  - Border-radius: 25px, padding: 40px
  - Background color from Figma spec
  - Centered layout (flex or grid)
  - Responsive: max-width 90vw on mobile
- Create `LogoHeader` component:
  - Displays Gigly logo (reuse from `lib/assets`)
  - Heading: 'Вход' / 'Login' (22px Manrope SemiBold or fallback)
  - Proper spacing between logo and heading
- Create `RoleCard` component:
  - Displays role name and icon
  - Props: `role` ('SPECIALIST' | 'CLIENT'), `selected` (boolean)
  - Selected state: 2px blue border (#0088FF)
  - Unselected state: no border or subtle border
  - Non-interactive (display-only)
- Create `AuthButton` component:
  - Height: 50px, full width
  - Background: #0088FF
  - Text color: white
  - Border-radius per Figma
  - Hover state: darker blue
  - Disabled state: reduced opacity
  - Props: `children`, `disabled`, `type`

**Test Plan:**
- Visual inspection: components match Figma design
- Unit tests: components render with correct props
- Accessibility: keyboard navigation, ARIA labels, screen reader support

---

## Task 3: Update Login Page with New Design

**Implementation:**
- Update `app/login/page.tsx`:
  - Wrap form in `AuthContainer` component
  - Add `LogoHeader` at top
  - Read `?role=` query parameter using `useSearchParams()`
  - Conditionally render role cards:
    - If role === 'SPECIALIST': show specialist card selected, client card unselected
    - If role === 'CLIENT': show client card selected, specialist card unselected
    - If no role: show both unselected or hide cards
  - Update email and password inputs with exact styling:
    - Background: #10121c
    - Border: #242935
    - Border-radius: 20px
    - Padding: 20px
  - Replace submit button with `AuthButton` component
  - Add secondary link to `/register` below button
  - Add decorative background pattern at bottom of container
- Maintain existing form structure:
  - `useActionState(loginUser, null)` for form handling
  - `useFormStatus()` for submit button pending state
  - Error display: `{state?.error && <p>...</p>}`
- Ensure Suspense boundary remains for `useSearchParams()`

**Test Plan:**
- Visual QA: compare with Figma screenshot (exact match)
- Manual test: navigate to `/login?role=SPECIALIST` → specialist card selected
- Manual test: navigate to `/login?role=CLIENT` → client card selected
- Manual test: navigate to `/login` → graceful fallback (no errors)
- Manual test: submit valid credentials → redirects to `/dashboard`
- Manual test: submit invalid credentials → error displays in new UI
- Accessibility: keyboard navigation, screen reader announces all elements

---

## Task 4: Implement Responsive Design

**Implementation:**
- Add responsive breakpoints:
  - Mobile (< 480px): container width 90vw, padding 20px
  - Desktop (>= 480px): container width 418px, padding 40px
- Use Tailwind responsive classes:
  - `w-[90vw] md:w-[418px]`
  - `p-5 md:p-10`
- Test on multiple viewport sizes:
  - Mobile: 375px, 414px
  - Tablet: 768px
  - Desktop: 1440px, 1920px
- Ensure all elements remain readable and functional

**Test Plan:**
- Visual QA on mobile (375px): container adapts, elements stack correctly
- Visual QA on desktop (1440px): container centered, exact dimensions
- E2E test: login flow works on mobile viewport
- E2E test: login flow works on desktop viewport

---

## Task 5: Add Decorative Background Pattern

**Implementation:**
- Extract background pattern asset from Figma design
- Add pattern to auth container:
  - Position: absolute bottom or background-image
  - Ensure pattern doesn't obscure form elements
  - Use CSS `background-position: bottom` and `background-repeat: no-repeat`
- Make pattern responsive:
  - Scale down on mobile if needed
  - Hide on very small viewports if it interferes

**Test Plan:**
- Visual QA: pattern displays at bottom of container
- Visual QA: pattern doesn't obscure form elements
- Visual QA: pattern scales or hides appropriately on mobile

---

## Task 6: Verify Existing Auth Logic Unchanged

**Implementation:**
- Confirm `loginUser` server action is not modified
- Confirm rate limiting logic is not modified
- Confirm session creation logic is not modified
- Confirm middleware route protection is not modified
- Run all existing authentication tests:
  - Integration tests: `__tests__/integration/login.test.ts`
  - E2E tests: `__tests__/e2e/login.spec.ts`

**Test Plan:**
- Run `npm run test:unit` → all auth tests pass
- Run `npm run test:e2e` → all login E2E tests pass
- Manual test: rate limiting still works (15 attempts per 15 min)
- Manual test: invalid credentials show error
- Manual test: valid credentials create session and redirect

---

## Task 7: Add E2E Tests for Role Parameter Handling

**Implementation:**
- Create new E2E test file: `__tests__/e2e/login-role-param.spec.ts`
- Test scenarios:
  1. Login with `?role=SPECIALIST` → specialist card selected, login succeeds
  2. Login with `?role=CLIENT` → client card selected, login succeeds
  3. Login without role param → graceful fallback, login succeeds
  4. Login with invalid role param (e.g., `?role=ADMIN`) → graceful fallback, login succeeds
- Use Playwright to:
  - Navigate to login page with query params
  - Verify role card selection state (border color, visual indicators)
  - Submit login form
  - Verify redirect to dashboard
  - Verify session contains correct role from database (not query param)

**Test Plan:**
- Run `npm run test:e2e` → all new tests pass
- Verify tests cover all role parameter scenarios
- Verify tests check visual selection state (border color)
- Verify tests confirm auth logic unchanged (database role used, not query param)

---

## Task 8: Visual QA and Figma Comparison

**Implementation:**
- Open Figma design and login page side-by-side
- Compare pixel-by-pixel:
  - Container dimensions and border-radius
  - Logo and heading typography
  - Role card layout and selection state
  - Input field styling (colors, border-radius, padding)
  - Button styling (height, color, text)
  - Spacing between all elements
  - Background pattern position and appearance
- Document any deviations and justify or fix
- Take screenshots for documentation

**Test Plan:**
- Visual comparison checklist:
  - [ ] Container dimensions match (418x540px)
  - [ ] Border-radius matches (25px)
  - [ ] Padding matches (40px)
  - [ ] Logo and heading match
  - [ ] Role cards match (layout, selection state)
  - [ ] Input fields match (colors, border-radius, padding)
  - [ ] Button matches (height, color, text)
  - [ ] Background pattern matches
  - [ ] Spacing between elements matches
- All checklist items verified and documented

---

## Task 9: Accessibility Audit

**Implementation:**
- Run accessibility audit tools (Lighthouse, axe DevTools)
- Verify keyboard navigation:
  - Tab through all form elements
  - Submit form with Enter key
  - Focus indicators visible
- Verify screen reader support:
  - All form labels announced
  - Error messages announced
  - Role cards have appropriate ARIA labels
  - Button states announced (disabled, loading)
- Verify color contrast:
  - Text on backgrounds meets WCAG AA (4.5:1)
  - Focus indicators meet WCAG AA (3:1)

**Test Plan:**
- Lighthouse accessibility score >= 95
- Keyboard navigation: all elements reachable and functional
- Screen reader test: all content announced correctly
- Color contrast: all text meets WCAG AA standards
- No accessibility regressions from old login page

---

## Task 10: Update Documentation

**Implementation:**
- Update `openspec/project.md` → Current State section:
  - Add "Login page redesigned to match Figma design with role context display"
- Update `openspec/project.md` → Completed Changes section:
  - Add entry for `login-page-redesign` change
- Document new components in code comments:
  - `AuthContainer`, `LogoHeader`, `RoleCard`, `AuthButton`
- Add inline comments explaining role parameter handling

**Test Plan:**
- Documentation is clear and accurate
- New components are documented
- Current State reflects new login page design
