# Implementation Tasks: Optimize Mobile Responsive Design

## Task 1: Audit Current Mobile Responsive State

**Implementation:**
- Manually test all pages at 375px (iPhone SE), 768px (iPad), 1024px (desktop) viewports
- Document horizontal scrolling issues
- Document touch target size violations
- Document table overflow issues
- Document form usability issues
- Create checklist of pages to fix

**Test Plan:**
- Use browser DevTools responsive mode
- Test at 375px, 768px, 1024px widths
- Document findings in a markdown file for reference

---

## Task 2: Implement Responsive Navigation with Hamburger Menu

**Implementation:**
- Modify `app/components/MainNav.tsx` to show hamburger menu on mobile (<768px)
- Hide navigation links on mobile, show them in slide-out menu
- Add hamburger icon button (☰) that toggles mobile menu
- Mobile menu should slide in from right or top
- Desktop navigation remains unchanged (horizontal links)
- Use Tailwind responsive utilities: `hidden md:flex` for desktop nav, `md:hidden` for mobile menu button
- Ensure touch target for hamburger button is 44x44px minimum

**Test Plan:**
- E2E test: verify hamburger menu appears at <768px viewport
- E2E test: verify hamburger menu toggles open/closed
- E2E test: verify all navigation links are accessible in mobile menu
- E2E test: verify desktop navigation unchanged at >=768px
- Manual test: verify touch target size is adequate

---

## Task 3: Convert Admin Tables to Card Layouts on Mobile

**Implementation:**
- Modify `app/admin/users/page.tsx`: convert user table to card layout on mobile
- Modify `app/admin/gigs/page.tsx`: convert gig table to card layout on mobile
- Use Tailwind responsive utilities: `hidden md:table` for table, `md:hidden` for cards
- Card layout should display:
  - User cards: email, role badge, status badge, actions button
  - Gig cards: title, status badge, budget, client, created date, actions button
- Maintain all functionality (suspend/unsuspend, close gig)
- Ensure touch targets for action buttons are 44x44px minimum

**Test Plan:**
- E2E test: verify tables display on desktop (>=768px)
- E2E test: verify cards display on mobile (<768px)
- E2E test: verify all data fields are visible in card layout
- E2E test: verify action buttons work in card layout
- Manual test: verify touch target sizes are adequate

---

## Task 4: Optimize Gig Creation Form for Mobile

**Implementation:**
- Modify `app/(protected)/gigs/new/gig-form.tsx`
- Increase input padding on mobile (from 20px to 16px for better touch)
- Ensure all input fields have min-height of 44px
- Adjust spacing between form fields for better mobile UX
- Ensure textarea fields have adequate height on mobile
- Test form submission on mobile viewport

**Test Plan:**
- E2E test: verify form renders correctly at 375px viewport
- E2E test: verify all inputs are tappable (44x44px minimum)
- E2E test: verify form submission works on mobile
- E2E test: verify no horizontal scrolling
- Manual test: verify form is usable on actual mobile device

---

## Task 5: Optimize Profile Edit Form for Mobile

**Implementation:**
- Modify `app/(protected)/profile/edit/ProfileEditForm.tsx`
- Ensure 2-column grid stacks vertically on mobile (already uses `grid-cols-1 lg:grid-cols-2`)
- Increase input padding on mobile for better touch
- Ensure all input fields have min-height of 44px
- Adjust spacing between form fields
- Ensure Save/Cancel buttons are adequately sized (44px height minimum)

**Test Plan:**
- E2E test: verify form stacks vertically at <1024px viewport
- E2E test: verify all inputs are tappable (44x44px minimum)
- E2E test: verify form submission works on mobile
- E2E test: verify no horizontal scrolling
- Manual test: verify form is usable on actual mobile device

---

## Task 6: Optimize Dashboard Pages for Mobile

**Implementation:**
- Modify `app/(protected)/dashboard/page.tsx`
- Ensure 2-column grid (main content + sidebar) stacks vertically on mobile
- Verify gig cards and application cards are mobile-friendly
- Ensure all buttons and links have adequate touch targets (44x44px)
- Test CLIENT and SPECIALIST dashboard variants

**Test Plan:**
- E2E test: verify dashboard renders correctly at 375px viewport
- E2E test: verify 2-column layout stacks vertically on mobile
- E2E test: verify all interactive elements are tappable
- E2E test: verify no horizontal scrolling
- Manual test: verify both CLIENT and SPECIALIST dashboards on mobile

---

## Task 7: Optimize Gig Browse and Detail Pages for Mobile

**Implementation:**
- Modify `app/(protected)/gigs/page.tsx` (browse page)
- Ensure filter panel is mobile-friendly (stack vertically if needed)
- Ensure gig cards are mobile-friendly (already use flex layout)
- Modify `app/(protected)/gigs/[id]/page.tsx` (detail page)
- Ensure gig detail content is readable on mobile
- Ensure application form is mobile-friendly
- Ensure message list is mobile-friendly

**Test Plan:**
- E2E test: verify gig browse page renders correctly at 375px
- E2E test: verify filter panel is usable on mobile
- E2E test: verify gig detail page renders correctly at 375px
- E2E test: verify application form is usable on mobile
- E2E test: verify no horizontal scrolling

---

## Task 8: Touch Target Size Audit and Fixes

**Implementation:**
- Audit all interactive elements across the application
- Identify elements smaller than 44x44px
- Fix violations by:
  - Increasing button padding
  - Increasing min-height/min-width
  - Adding padding to clickable areas
- Focus on: buttons, links, form inputs, checkboxes, radio buttons, dropdown triggers

**Test Plan:**
- Manual audit: use browser DevTools to measure touch targets
- Create checklist of violations
- Verify all fixes meet 44x44px minimum
- E2E test: verify critical interactive elements are adequately sized

---

## Task 9: Horizontal Scroll Prevention

**Implementation:**
- Audit all pages for horizontal scrolling at 375px viewport
- Fix violations by:
  - Adding `overflow-x-hidden` to containers
  - Using `max-w-full` on wide elements
  - Adjusting padding/margins on mobile
  - Using responsive utilities to hide/show content
- Common culprits: wide tables, long text without wrapping, fixed-width containers

**Test Plan:**
- Manual test: scroll horizontally on all pages at 375px viewport
- E2E test: verify no horizontal scrollbar appears
- E2E test: verify content fits within viewport width
- Test on actual mobile devices (iOS Safari, Android Chrome)

---

## Task 10: E2E Test Suite for Mobile Responsive Behavior

**Implementation:**
- Create `__tests__/e2e/mobile-responsive.spec.ts`
- Test navigation hamburger menu
- Test table-to-card conversion on admin pages
- Test form usability on mobile viewports
- Test dashboard layout stacking
- Test horizontal scroll prevention
- Use Playwright viewport configuration: `{ width: 375, height: 667 }` for mobile

**Test Plan:**
- Run E2E tests at 375px, 768px, 1024px viewports
- Verify all tests pass
- Verify test coverage for all critical mobile scenarios
- Run tests in CI pipeline

---

## Task 11: Update UI Specification

**Implementation:**
- Update `openspec/specs/ui/spec.md` with new mobile responsive requirements
- Document hamburger menu behavior
- Document table-to-card conversion rules
- Document touch target size requirements
- Document horizontal scroll prevention rules
- Document viewport breakpoints (375px, 768px, 1024px)

**Test Plan:**
- Review spec changes with team
- Ensure all requirements are testable
- Ensure all requirements use MUST/SHALL language
