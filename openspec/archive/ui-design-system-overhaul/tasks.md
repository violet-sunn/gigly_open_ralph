# Implementation Tasks: UI Design System Overhaul

## Phase 1: Design System Foundation (Day 1)

### Task 1.1: Set up Tailwind custom configuration
**Implementation:**
- Update `tailwind.config.ts` with custom color palette:
  - Primary navy background: `#0A0E27` (or similar from mockups)
  - Bright blue accent: `#0EA5E9` (or similar from mockups)
  - Refined gray scale for borders, text, backgrounds
  - Success/warning/error colors
- Add custom typography scale:
  - Font sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
  - Font weights: normal (400), medium (500), semibold (600), bold (700)
  - Line heights for each size
- Add custom spacing scale (if needed beyond Tailwind defaults)
- Add custom border radius values
- Add custom shadow values for elevation system

**Test Plan:**
- Run `npm run build` to verify Tailwind config is valid
- Inspect generated CSS to confirm custom tokens are available
- No functional tests needed (config only)

**Acceptance:**
- [ ] `tailwind.config.ts` includes custom `colors` object with navy, blue, grays
- [ ] Custom typography tokens defined in `theme.extend`
- [ ] Build succeeds without errors
- [ ] Custom classes available in dev tools (e.g., `bg-navy-900`, `text-blue-500`)

---

### Task 1.2: Create design token documentation
**Implementation:**
- Create `docs/DESIGN_SYSTEM.md` documenting:
  - Color palette with hex codes and usage guidelines
  - Typography scale with examples
  - Spacing scale
  - Component patterns (button variants, card styles, etc.)
  - Code examples for common patterns

**Test Plan:**
- Manual review of documentation for completeness
- No automated tests needed

**Acceptance:**
- [ ] `docs/DESIGN_SYSTEM.md` exists with complete design token reference
- [ ] Includes visual examples or descriptions
- [ ] Includes usage guidelines for developers

---

## Phase 2: Core Components (Days 2-3)

### Task 2.1: Update button components
**Implementation:**
- Identify all button patterns in codebase (primary, secondary, danger, disabled)
- Update button classes to use new design system:
  - Primary: bright blue background, white text, hover state, focus ring
  - Secondary: transparent/outlined, blue text, hover state
  - Danger: red background for destructive actions
  - Disabled: reduced opacity, no hover
- Update all instances:
  - Login/register forms
  - Gig creation form
  - Application actions (Accept/Reject)
  - Message forms
  - Admin actions
  - Profile edit forms

**Test Plan:**
- Run full test suite: `npm test`
- Manual QA: Click all buttons across all pages, verify hover/focus states
- Verify disabled states work correctly
- Check keyboard navigation (Tab, Enter)

**Acceptance:**
- [ ] All buttons use consistent styling from design system
- [ ] Hover states work on all buttons
- [ ] Focus states visible for keyboard navigation
- [ ] Disabled states have reduced opacity
- [ ] All 570+ tests pass
- [ ] Manual QA checklist completed

---

### Task 2.2: Update form input components
**Implementation:**
- Update all text inputs, textareas, selects to use new design system:
  - Navy/dark background with lighter border
  - Bright blue focus ring
  - Proper padding and font size
  - Placeholder text color
  - Error state styling (red border)
- Update all forms:
  - Login form (`app/login/page.tsx`)
  - Register form (`app/register/page.tsx`)
  - Gig creation form (`app/(protected)/gigs/new/gig-form.tsx`)
  - Application form (`app/(protected)/gigs/[id]/apply-form.tsx`)
  - Message forms (`app/(protected)/gigs/[id]/message-form.tsx`)
  - Profile edit form (`app/(protected)/profile/edit/ProfileEditForm.tsx`)
  - Admin forms

**Test Plan:**
- Run integration tests for all forms
- Manual QA: Fill out each form, verify focus states, error states
- Test keyboard navigation (Tab through fields)
- Test screen reader announcements (if possible)

**Acceptance:**
- [ ] All inputs have consistent styling
- [ ] Focus states use bright blue ring
- [ ] Error states show red border
- [ ] Placeholder text is readable
- [ ] All form tests pass
- [ ] Manual QA checklist completed

---

### Task 2.3: Update card components
**Implementation:**
- Update all card/container patterns to use new design system:
  - Subtle background color (slightly lighter than page background)
  - Refined border (thin, subtle color)
  - Rounded corners (consistent radius)
  - Subtle shadow for elevation
  - Proper padding (consistent spacing)
- Update card instances:
  - Dashboard gig/application cards
  - Gig list items on browse page
  - Gig detail sections
  - Profile sections
  - Admin list items
  - Notification dropdown items

**Test Plan:**
- Visual inspection of all pages with cards
- Verify hover states on clickable cards
- Run full test suite to ensure no breakage
- Check responsive behavior on mobile widths

**Acceptance:**
- [ ] All cards use consistent styling
- [ ] Hover states work on clickable cards
- [ ] Cards have subtle shadows
- [ ] Spacing is consistent
- [ ] All tests pass
- [ ] Responsive on mobile

---

### Task 2.4: Update badge components
**Implementation:**
- Update all status badges to use new design system:
  - OPEN: blue background
  - IN_PROGRESS: yellow/amber background
  - REVIEW: purple background
  - COMPLETED: green background
  - PAID: green with checkmark
  - PENDING: gray background
  - ACCEPTED: green background
  - REJECTED: red background
  - WITHDRAWN: gray background
- Consistent padding, font size, border radius
- Update all badge instances across pages

**Test Plan:**
- Visual inspection of all status badges
- Verify color coding is intuitive
- Run full test suite

**Acceptance:**
- [ ] All badges use consistent styling
- [ ] Status colors are intuitive and accessible
- [ ] Font size and padding consistent
- [ ] All tests pass

---

## Phase 3: Navigation & Layout (Day 3-4)

### Task 3.1: Update main navigation
**Implementation:**
- Update `app/components/MainNav.tsx` to match mockup design:
  - Navy background
  - GIGLY logo styling (white text, proper font)
  - Navigation links with hover states
  - Notification bell with proper styling
  - User avatar/profile area
  - Proper spacing and alignment
- Ensure responsive behavior maintained

**Test Plan:**
- Visual comparison with mockup
- Test all navigation links
- Test notification bell functionality
- Test on mobile widths
- Run E2E tests for navigation

**Acceptance:**
- [ ] Navigation matches mockup design
- [ ] All links work correctly
- [ ] Notification bell styled correctly
- [ ] Responsive on mobile
- [ ] E2E tests pass

---

### Task 3.2: Update page layouts
**Implementation:**
- Update `app/layout.tsx` for global background color (navy)
- Update `app/(protected)/layout.tsx` for authenticated pages
- Update `app/admin/layout.tsx` for admin pages
- Ensure proper max-width containers
- Ensure proper padding/margins
- Update page backgrounds to use navy

**Test Plan:**
- Visual inspection of all pages
- Verify consistent layout across pages
- Test responsive behavior
- Run full test suite

**Acceptance:**
- [ ] All pages have navy background
- [ ] Consistent max-width containers
- [ ] Proper spacing maintained
- [ ] Responsive on all screen sizes
- [ ] All tests pass

---

### Task 3.3: Update notification components
**Implementation:**
- Update `app/components/NotificationBell.tsx`:
  - Bell icon styling
  - Badge styling (red background, white text)
  - Hover state
- Update `app/components/NotificationDropdown.tsx`:
  - Dropdown container styling
  - Notification item styling
  - Hover states
  - Empty state styling

**Test Plan:**
- Test notification bell click
- Test notification dropdown display
- Test notification item clicks
- Verify badge count updates
- Run notification tests

**Acceptance:**
- [ ] Bell icon styled correctly
- [ ] Badge visible and styled
- [ ] Dropdown styled correctly
- [ ] All notification tests pass

---

## Phase 4: Page-Specific Updates (Days 4-5)

### Task 4.1: Update authentication pages
**Implementation:**
- Update `app/page.tsx` (homepage/landing)
- Update `app/login/page.tsx`
- Update `app/register/page.tsx`
- Apply new design system to forms, buttons, layout
- Ensure proper contrast for readability

**Test Plan:**
- Run authentication E2E tests
- Manual QA: Register new user, login, logout
- Verify error states display correctly
- Test on mobile

**Acceptance:**
- [ ] All auth pages styled correctly
- [ ] Forms use new design system
- [ ] All auth tests pass
- [ ] Manual QA completed

---

### Task 4.2: Update dashboard pages
**Implementation:**

**A. Dashboard Layout (`app/(protected)/dashboard/page.tsx`):**
- **CRITICAL DOM RESTRUCTURING REQUIRED:**
  - **Top greeting card:** Full-width card with user greeting and profile link
    - `flex items-center justify-between bg-navy-800 border border-gray-700 rounded-lg p-6 mb-6`
    - Left: "Добрый день, [Name]" with role subtitle
    - Right: "Перейти в профиль" link with arrow icon
  - **2-column grid layout:** `grid grid-cols-1 lg:grid-cols-3 gap-6`
    - **Left column (main content, `lg:col-span-2`):**
      - For CLIENT: "My Gigs" section with tabbed interface or list
        - Tab/badge showing count: "ЗАКАЗЫ В РАБОТЕ" with blue badge showing number
        - "ВСЕ ЗАКАЗЫ" link on the right
        - Gig cards in vertical list with hover states
      - For SPECIALIST: Tabbed interface (Active Work, Pending Applications, Archive)
        - Tabs with active state (blue underline or background)
        - Tab content with gig/application cards
    - **Right column (sidebar, `lg:col-span-1`):**
      - **"Найти проект" (Find Project) card** with search icon and CTA
        - Blue background card with prominent styling
        - "Проекты и вакансии с актуальными заказами" subtitle
      - **"ФИНАНСЫ" (Finances) section:**
        - Card showing earnings: "Earned this month: $4,250.00" with arrow icon
      - **"СООБЩЕНИЯ" (Messages) section:**
        - Card with recent message list
        - Each message: avatar, sender name, preview text, unread indicator (blue dot)
        - Message items clickable with hover state
  - **Mobile responsive:** Grid stacks to single column on mobile (`< lg`)

**B. Specialist Dashboard Tabs (`app/(protected)/dashboard/SpecialistDashboardTabs.tsx`):**
- Update tab styling:
  - Horizontal tab bar: `flex gap-4 border-b border-gray-700 mb-6`
  - Active tab: blue underline or background (`border-b-2 border-blue-500`)
  - Inactive tabs: gray text with hover state
- Tab content uses card styling for each item
- Empty states with helpful messaging and icons

**Test Plan:**
- Run dashboard E2E tests
- Manual QA: View as CLIENT and SPECIALIST
- **Test 2-column grid layout on desktop and single-column on mobile**
- **Test sidebar cards (Find Project, Finances, Messages)**
- Test tab switching for SPECIALIST dashboard
- Verify empty states
- Test responsive behavior

**Acceptance:**
- [ ] Dashboard has greeting card at top
- [ ] Dashboard has 2-column grid (main content left, sidebar right)
- [ ] Sidebar includes Find Project, Finances, and Messages cards
- [ ] CLIENT dashboard shows gigs with count badge
- [ ] SPECIALIST dashboard has styled tabs with active state
- [ ] Layout is responsive (stacks on mobile)
- [ ] Empty states styled correctly
- [ ] All dashboard tests pass
- [ ] Manual QA completed including layout testing

---

### Task 4.3: Update gig pages
**Implementation:**

**A. Browse Gigs Page (`app/(protected)/gigs/page.tsx`):**
- **DOM RESTRUCTURING REQUIRED:**
  - Wrap filter tabs and search bar in horizontal flex container: `flex items-center justify-between mb-6`
  - Filter tabs: `flex gap-2` with active tab having blue underline/background
  - Search bar: positioned on the right side of the flex container
  - Sort/filter dropdowns: `flex gap-4` aligned to the right
- **Gig Card Layout (each card in the list):**
  - Use `flex justify-between items-start` for horizontal layout
  - Left side: title, description, tags (stacked vertically)
  - Right side: price and "Откликнуться →" button (aligned to the right, `flex flex-col items-end gap-2`)
  - Company logo/avatar on the left (if available): `flex gap-4` with avatar + content
- Apply design system styling to all elements

**B. Gig Creation Form (`app/(protected)/gigs/new/page.tsx` and `gig-form.tsx`):**
- Keep existing form sections structure (already has visual sections)
- Apply design system styling to inputs, buttons, character counters
- Fee preview: make more prominent with larger text and blue accent color

**C. Gig Detail Page (`app/(protected)/gigs/[id]/page.tsx`):**
- **CRITICAL DOM RESTRUCTURING REQUIRED:**
  - **Implement 2-column grid layout:** `grid grid-cols-1 lg:grid-cols-3 gap-6`
  - **Left column (main content, `lg:col-span-2`):**
    - Gig title and description
    - "Суть задачи" (Goal) section
    - "Технические требования" (Technical Requirements) section
    - "Формат и сроки" (Format and Timeline) section
    - Application list (for CLIENT owners)
    - Message list (when specialist assigned)
  - **Right column (sidebar, `lg:col-span-1`):**
    - **Sticky sidebar:** `sticky top-6` (stays visible on scroll)
    - Budget card with prominent price display
    - "Условия Vercel" (Client info) section with company name
    - "Мои условия" (My conditions) section for specialists
    - Apply button/form (for SPECIALISTS)
    - Action buttons (Submit Work, Approve Work, Mark as Paid)
  - **Mobile responsive:** On mobile (`< lg`), sidebar stacks below main content
- Update all gig-related components with design system styling:
  - `apply-form.tsx` - goes in right sidebar
  - `application-actions.tsx` - styled buttons
  - `message-form.tsx` - styled form in left column
  - `message-list.tsx` - styled messages in left column
  - `submit-work-form.tsx` - goes in right sidebar
  - `approve-work-form.tsx` - goes in right sidebar
  - `withdraw-application-button.tsx` - styled button

**Test Plan:**
- Run gig E2E tests (client journey, specialist journey)
- Manual QA: Create gig, browse gigs, apply, accept, message, submit work, approve
- **Test 2-column layout on desktop (1280px+) and single-column on mobile (< 1024px)**
- **Test sticky sidebar behavior on gig detail page**
- Test all filters and pagination on browse page
- Verify all forms work correctly
- Verify horizontal card layout on browse page

**Acceptance:**
- [ ] Browse page has horizontal filter/search layout
- [ ] Gig cards have horizontal layout (content left, price/button right)
- [ ] Gig detail page has 2-column grid (main content left, sidebar right)
- [ ] Sidebar is sticky on desktop
- [ ] Layout is responsive (stacks on mobile)
- [ ] All forms use new design system
- [ ] All gig tests pass (44 integration + 16 E2E)
- [ ] Manual QA completed including layout testing

---

### Task 4.4: Update profile pages
**Implementation:**

**A. Profile View Page (`app/(protected)/profile/page.tsx` and `app/(protected)/profile/[userId]/page.tsx`):**
- **CRITICAL DOM RESTRUCTURING REQUIRED:**
  - **Top header card:** `flex items-start gap-6 bg-navy-800 border border-gray-700 rounded-lg p-6`
    - Left side: Avatar/photo (large circular image, e.g., `w-24 h-24 rounded-full`)
    - Right side: `flex-1` container with:
      - Name and title (stacked vertically)
      - "Перейти в профиль" link (if viewing own profile)
      - Stats row: `flex gap-8 mt-4` with statistics cards:
        - "5.0 ⭐" rating
        - "Завершено задач: 6"
        - "повторных заказов: 83%"
        - Each stat: `flex flex-col` with label and value
  - **Below header, 2-column grid:** `grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6`
    - **Left column:** "Опыт работы" (Experience) section
      - Card container with list of work experiences
      - Each experience: company name, role, date range, description
      - "Добавить" link at top right of section header
    - **Right column:** "Избранные проекты" (Featured Projects) section
      - Card container with project list or empty state
      - "Добавьте опыт работы, чтобы повысить доверие" message if empty
      - Arrow icon for adding projects
  - **Mobile responsive:** Grid stacks to single column on mobile (`< lg`)
- Apply design system styling to all text, cards, badges

**B. Profile Edit Form (`app/(protected)/profile/edit/page.tsx` and `ProfileEditForm.tsx`):**
- Keep existing form structure (single column form)
- Apply design system styling to all inputs, textareas, buttons
- Ensure proper spacing and visual hierarchy

**Test Plan:**
- Run profile tests
- Manual QA: View profile, edit profile, view public profile
- Test as CLIENT and SPECIALIST
- **Test 2-column grid layout on desktop and single-column on mobile**
- **Test header card with avatar and stats layout**
- Verify responsive behavior

**Acceptance:**
- [ ] Profile page has header card with avatar left, info/stats right
- [ ] Profile page has 2-column grid for Experience and Projects sections
- [ ] Layout is responsive (stacks on mobile)
- [ ] Profile edit form uses new design system
- [ ] All profile tests pass
- [ ] Manual QA completed including layout testing

---

### Task 4.5: Update admin pages
**Implementation:**
- Update `app/admin/page.tsx` (admin dashboard)
- Update `app/admin/users/page.tsx` and components
- Update `app/admin/gigs/page.tsx` and components
- Update admin forms:
  - `SuspendUserForm.tsx`
  - `UnsuspendUserForm.tsx`
  - `CloseGigForm.tsx`
- Update filter components:
  - `UserFilters.tsx`
  - `GigFilters.tsx`

**Test Plan:**
- Run admin E2E tests
- Manual QA: View admin dashboard, manage users, manage gigs
- Test all admin actions
- Test filters and pagination

**Acceptance:**
- [ ] All admin pages styled correctly
- [ ] All admin forms use new design system
- [ ] All admin tests pass
- [ ] Manual QA completed

---

## Phase 5: Verification & Polish (Days 6-7)

### Task 5.1: Run full test suite
**Implementation:**
- Run all unit tests: `npm run test:unit`
- Run all E2E tests: `npm run test:e2e`
- Fix any test failures
- Verify test coverage remains high

**Test Plan:**
- `npm test` (all tests)
- Review test output for failures
- Fix any broken tests (should be zero if tasks done correctly)

**Acceptance:**
- [ ] All 570+ tests pass
- [ ] No new test failures introduced
- [ ] Test coverage maintained

---

### Task 5.2: Manual QA checklist
**Implementation:**
- Complete comprehensive manual QA:
  - [ ] Register as CLIENT
  - [ ] Create gig
  - [ ] View gig list
  - [ ] Edit profile
  - [ ] Logout
  - [ ] Register as SPECIALIST
  - [ ] Browse gigs
  - [ ] Apply to gig
  - [ ] Edit profile
  - [ ] Logout
  - [ ] Login as CLIENT
  - [ ] Accept application
  - [ ] Send message
  - [ ] Logout
  - [ ] Login as SPECIALIST
  - [ ] View notification
  - [ ] Reply to message
  - [ ] Submit work
  - [ ] Logout
  - [ ] Login as CLIENT
  - [ ] Approve work
  - [ ] Mark as paid
  - [ ] Test on mobile (320px, 768px, 1024px)
  - [ ] Test keyboard navigation
  - [ ] Test with screen reader (if possible)

**Test Plan:**
- Manual testing following checklist
- Document any issues found
- Fix issues and re-test

**Acceptance:**
- [ ] All manual QA items completed
- [ ] All user flows work correctly
- [ ] No visual bugs or broken layouts
- [ ] Responsive on all screen sizes

---

### Task 5.3: Visual comparison with mockups
**Implementation:**
- Compare each page with corresponding mockup:
  - Profile page vs mockup 1
  - Gig browse page vs mockup 2
  - Dashboard vs mockup 3
  - Gig detail page vs mockup 4
- Document any intentional deviations
- Make final adjustments for alignment

**Test Plan:**
- Side-by-side visual comparison
- Screenshot comparison (if helpful)
- Stakeholder review

**Acceptance:**
- [ ] Color palette matches mockups
- [ ] Typography matches mockups
- [ ] Spacing matches mockups
- [ ] Overall polish matches mockups
- [ ] Stakeholder approval

---

### Task 5.4: Performance verification
**Implementation:**
- Test page load times (should not degrade)
- Test interaction responsiveness
- Verify no layout shifts or flashing
- Check bundle size (should not increase significantly)

**Test Plan:**
- Use browser DevTools Performance tab
- Measure page load times before/after
- Check Lighthouse scores
- Verify no performance regressions

**Acceptance:**
- [ ] Page load times unchanged or improved
- [ ] No layout shifts
- [ ] Bundle size increase < 5%
- [ ] Lighthouse scores maintained

---

### Task 5.5: Documentation updates
**Implementation:**
- Update `README.md` if needed (screenshots, design system mention)
- Ensure `docs/DESIGN_SYSTEM.md` is complete
- Update any other relevant documentation

**Test Plan:**
- Manual review of documentation
- Verify accuracy and completeness

**Acceptance:**
- [ ] All documentation updated
- [ ] Design system documented
- [ ] README reflects new UI (if applicable)

---

## Summary

**Total Tasks**: 18 tasks across 5 phases
**Estimated Effort**: 5-7 days
**Critical Path**: Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5

**Key Success Metrics:**
- All 570+ tests pass
- Manual QA checklist 100% complete
- Visual alignment with mockups confirmed
- No performance degradation
- Stakeholder approval
