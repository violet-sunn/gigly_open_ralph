# Implementation Tasks - Dark Theme UI Redesign

## Task Checklist

### Phase 1: Design System Foundation

#### Task 1: Update Tailwind Configuration
**Description**: Extract design tokens from mockups and update `tailwind.config.ts` with dark theme color palette.

**Implementation Notes**:
- Update `theme.extend.colors` with HSL color values:
  - `background: "hsl(222 47% 11%)"` - deep dark background
  - `foreground: "hsl(210 40% 98%)"` - light text
  - `card: "hsl(224 47% 14%)"` - card surface
  - `primary: "hsl(217 91% 60%)"` - blue accent
  - `secondary: "hsl(217 33% 17%)"` - secondary elements
  - `muted: "hsl(215 20% 65%)"` - muted text
  - `border: "hsl(217 33% 17%)"` - borders
  - `input: "hsl(217 33% 17%)"` - input backgrounds
- Update `borderRadius` to use `0.75rem` default
- Do NOT change any plugins or other configuration

**Test Plan**:
```bash
# Verify Tailwind config compiles
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Visual inspection: colors should be available in autocomplete
```

**Acceptance Criteria**:
- [ ] All color tokens defined as HSL values
- [ ] Border radius updated to 0.75rem
- [ ] Build succeeds without errors
- [ ] No TypeScript errors

---

#### Task 2: Update Global CSS Variables
**Description**: Update `app/globals.css` with CSS variables for dark theme.

**Implementation Notes**:
- Update `:root` CSS variables to match Tailwind config:
  ```css
  :root {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    --card: 224 47% 14%;
    --card-foreground: 210 40% 98%;
    --primary: 217 91% 60%;
    --primary-foreground: 222 47% 11%;
    --secondary: 217 33% 17%;
    --muted: 215 20% 65%;
    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 217 91% 60%;
    --radius: 0.75rem;
  }
  ```
- Update `.dark` class variables to match (same values for dark-first approach)
- Update `body` base styles to use `bg-background text-foreground`
- Do NOT change @tailwind directives or other base styles

**Test Plan**:
```bash
# Verify CSS compiles
npm run dev

# Visual inspection: background should be dark on all pages
# Open http://localhost:3000 and check background color
```

**Acceptance Criteria**:
- [ ] CSS variables match Tailwind config
- [ ] Dark theme applied globally
- [ ] No CSS compilation errors
- [ ] Background is dark on all pages

---

### Phase 2: Navigation & Global Components

#### Task 3: Rebuild Main Navigation Bar
**Description**: Restructure `app/components/MainNav.tsx` to match mockup top bar design.

**Implementation Notes**:
- Rebuild JSX structure:
  - Container: `<nav className="border-b border-border bg-card">`
  - Inner wrapper: `<div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">`
  - Logo: `<Link href="/" className="text-2xl font-bold text-foreground">GIGLY</Link>`
  - Nav links: `<div className="hidden md:flex items-center gap-6">` with links styled as `text-muted-foreground hover:text-foreground`
  - Right section: `<div className="flex items-center gap-4">` with NotificationBell and user avatar
- Keep ALL existing links (do not add/remove)
- Keep ALL existing logic (session checks, role-based rendering)
- Do NOT change any props or component imports

**Test Plan**:
```bash
# Run existing tests
npm test -- MainNav

# Visual inspection
npm run dev
# Check navigation bar on all pages
# Verify links work correctly
# Test responsive behavior (mobile menu if applicable)
```

**Acceptance Criteria**:
- [ ] Navigation bar uses dark theme colors
- [ ] Logo is prominent and styled correctly
- [ ] All existing links present and functional
- [ ] Notification bell positioned correctly
- [ ] Responsive on mobile devices
- [ ] All tests pass

---

#### Task 4: Update Notification Bell Styling
**Description**: Update `app/components/NotificationBell.tsx` to match mockup styling.

**Implementation Notes**:
- Update bell icon styling: `className="text-muted-foreground hover:text-foreground"`
- Update badge styling: `className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center"`
- Keep ALL existing logic (unread count, dropdown toggle)
- Do NOT change any state management or event handlers

**Test Plan**:
```bash
# Run existing tests
npm test -- NotificationBell

# Visual inspection
# Check bell icon appearance
# Verify badge displays correctly with count
# Test dropdown open/close functionality
```

**Acceptance Criteria**:
- [ ] Bell icon uses muted color with hover state
- [ ] Badge uses destructive color (red)
- [ ] All existing functionality works
- [ ] All tests pass

---

#### Task 5: Update Notification Dropdown Styling
**Description**: Update `app/components/NotificationDropdown.tsx` to match dark theme.

**Implementation Notes**:
- Update dropdown container: `className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50"`
- Update notification items: `className="p-4 hover:bg-accent border-b border-border last:border-b-0"`
- Update empty state: Use muted text color
- Keep ALL existing logic (notification fetching, mark as read)
- Do NOT change any async operations or data fetching

**Test Plan**:
```bash
# Run existing tests
npm test -- NotificationDropdown

# Visual inspection
# Open dropdown and check styling
# Verify notification items display correctly
# Test click to navigate functionality
```

**Acceptance Criteria**:
- [ ] Dropdown uses dark card background
- [ ] Notification items have hover states
- [ ] Empty state styled correctly
- [ ] All existing functionality works
- [ ] All tests pass

---

### Phase 3: Page Restructuring

#### Task 6: Rebuild Homepage
**Description**: Restructure `app/page.tsx` to match dark theme design.

**Implementation Notes**:
- Rebuild JSX structure:
  - Main container: `<main className="min-h-screen bg-background">`
  - Content wrapper: `<div className="max-w-4xl mx-auto px-4 py-16">`
  - Logo/heading: `<h1 className="text-6xl font-bold text-foreground mb-8">GIGLY</h1>`
  - CTA button: `<Link href="/register" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90">`
- Keep ALL existing logic (session check, conditional rendering)
- Do NOT change any Server Component logic or data fetching

**Test Plan**:
```bash
# Run existing tests
npm test -- page.tsx

# Visual inspection
npm run dev
# Visit http://localhost:3000
# Check logged-out view
# Log in and check logged-in view
# Verify all links work
```

**Acceptance Criteria**:
- [ ] Homepage uses dark background
- [ ] Logo/heading prominent and styled
- [ ] CTA button uses primary color
- [ ] Conditional rendering works (logged in/out)
- [ ] All tests pass

---

#### Task 7: Rebuild Login Page
**Description**: Restructure `app/login/page.tsx` to match dark theme form styling.

**Implementation Notes**:
- Rebuild form container: `<div className="min-h-screen bg-background flex items-center justify-center px-4">`
- Form card: `<div className="w-full max-w-md bg-card border border-border rounded-lg p-8">`
- Input styling: `className="w-full bg-input border border-input text-foreground rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"`
- Button styling: `className="w-full bg-primary text-primary-foreground py-2 rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50"`
- Keep ALL existing logic (useActionState, useFormStatus, form submission)
- Do NOT change any Server Action calls or validation

**Test Plan**:
```bash
# Run existing tests
npm test -- login

# Manual testing
npm run dev
# Visit /login
# Test form submission with valid credentials
# Test form submission with invalid credentials
# Verify error messages display
# Verify loading state works
```

**Acceptance Criteria**:
- [ ] Form uses dark theme styling
- [ ] Inputs have focus states
- [ ] Button has hover and loading states
- [ ] Error messages display correctly
- [ ] All existing functionality works
- [ ] All tests pass

---

#### Task 8: Rebuild Registration Page
**Description**: Restructure `app/register/page.tsx` to match dark theme form styling.

**Implementation Notes**:
- Use same form styling as login page
- Update role selector styling:
  - Radio buttons: `className="text-primary focus:ring-primary"`
  - Labels: `className="flex items-center gap-2 p-4 border border-input rounded-lg cursor-pointer hover:bg-accent"`
- Keep ALL existing logic (useActionState, role selection, form submission)
- Do NOT change any Server Action calls or validation

**Test Plan**:
```bash
# Run existing tests
npm test -- register

# Manual testing
# Visit /register
# Test role selection
# Test form submission
# Verify validation works
# Verify redirect after successful registration
```

**Acceptance Criteria**:
- [ ] Form uses dark theme styling
- [ ] Role selector styled correctly
- [ ] All existing functionality works
- [ ] All tests pass

---

#### Task 9: Rebuild CLIENT Dashboard
**Description**: Restructure `app/(protected)/dashboard/page.tsx` CLIENT view to match mockup card-based layout.

**Implementation Notes**:
- Rebuild CLIENT section JSX:
  - Main container: `<div className="min-h-screen bg-background">`
  - Content wrapper: `<div className="max-w-7xl mx-auto px-4 py-8">`
  - Welcome card: `<div className="bg-card border border-border rounded-lg p-6 mb-6">`
  - Gig list: `<div className="space-y-4">` with each gig as `<Link href={...} className="block bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">`
- Keep ALL existing Prisma queries
- Keep ALL existing data fetching logic
- Do NOT change any Server Component props or data flow

**Test Plan**:
```bash
# Run existing tests
npm test -- dashboard

# Manual testing as CLIENT user
# Visit /dashboard
# Verify welcome card displays
# Verify gig list displays
# Click on gig cards to navigate
# Verify "Post a Gig" link works
```

**Acceptance Criteria**:
- [ ] Dashboard uses card-based layout
- [ ] All cards styled with dark theme
- [ ] Gig cards have hover states
- [ ] All existing functionality works
- [ ] All tests pass

---

#### Task 10: Rebuild SPECIALIST Dashboard
**Description**: Restructure `app/(protected)/dashboard/page.tsx` SPECIALIST view and `SpecialistDashboardTabs.tsx` to match mockup.

**Implementation Notes**:
- Rebuild SPECIALIST section JSX with card layout
- Update `SpecialistDashboardTabs.tsx`:
  - Tab container: `<div className="border-b border-border mb-6">`
  - Tab buttons: `className="px-4 py-2 font-medium ${active ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}"`
  - Tab content: Use card styling for gig/application items
- Keep ALL existing state management (useState for tab switching)
- Keep ALL existing data filtering logic
- Do NOT change any props or data flow

**Test Plan**:
```bash
# Run existing tests
npm test -- dashboard
npm test -- SpecialistDashboardTabs

# Manual testing as SPECIALIST user
# Visit /dashboard
# Test tab switching
# Verify each tab shows correct data
# Click on gig/application cards to navigate
```

**Acceptance Criteria**:
- [ ] Dashboard uses card-based layout
- [ ] Tabs styled with active state
- [ ] Tab content uses card styling
- [ ] Tab switching works correctly
- [ ] All existing functionality works
- [ ] All tests pass

---

#### Task 11: Rebuild Gig Browse Page
**Description**: Restructure `app/(protected)/gigs/page.tsx` to match mockup filter + grid layout.

**Implementation Notes**:
- Rebuild page structure:
  - Search bar: `<input className="w-full bg-input border border-input text-foreground rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary" />`
  - Filter section: `<div className="flex items-center gap-4 mb-6">` with filter buttons
  - Gig grid: `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`
  - Gig cards: `<div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">`
- Keep ALL existing Prisma queries
- Keep ALL existing filter logic
- Keep ALL existing pagination logic
- Do NOT change any Server Component data fetching

**Test Plan**:
```bash
# Run existing tests
npm test -- gigs/page

# Manual testing
# Visit /gigs
# Test search functionality
# Test filter functionality
# Test pagination
# Click on gig cards to navigate
```

**Acceptance Criteria**:
- [ ] Page uses grid layout
- [ ] Search bar styled correctly
- [ ] Filters work correctly
- [ ] Gig cards have hover states
- [ ] Pagination styled correctly
- [ ] All existing functionality works
- [ ] All tests pass

---

#### Task 12: Rebuild Gig Detail Page
**Description**: Restructure `app/(protected)/gigs/[id]/page.tsx` to match mockup two-column layout.

**Implementation Notes**:
- Rebuild page structure:
  - Main container: `<div className="min-h-screen bg-background">`
  - Two-column grid: `<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">`
  - Main content (left): `<div className="lg:col-span-2 space-y-6">`
  - Sidebar (right): `<div className="space-y-6">`
  - All sections use card styling: `<div className="bg-card border border-border rounded-lg p-6">`
- Keep ALL existing Prisma queries
- Keep ALL existing conditional rendering logic
- Keep ALL existing authorization checks
- Do NOT change any Server Component data fetching or props

**Test Plan**:
```bash
# Run existing tests
npm test -- gigs/[id]

# Manual testing
# Visit gig detail as SPECIALIST (can apply)
# Visit gig detail as CLIENT owner (see applications)
# Visit gig detail as assigned SPECIALIST (see messages)
# Verify all sections display correctly
# Test all interactive elements (apply, accept/reject, messages)
```

**Acceptance Criteria**:
- [ ] Page uses two-column layout
- [ ] All sections use card styling
- [ ] Budget sidebar prominent
- [ ] All existing functionality works
- [ ] All tests pass

---

#### Task 13: Update Gig Detail Child Components
**Description**: Update styling for all child components in gig detail page.

**Implementation Notes**:
Update the following components with dark theme styling:
- `apply-form.tsx`: Form inputs and button styling
- `application-actions.tsx`: Accept/Reject button styling
- `submit-work-form.tsx`: Form styling
- `approve-work-form.tsx`: Form styling
- `message-form.tsx`: Textarea and button styling
- `message-list.tsx`: Message bubble styling with sender distinction
- `withdraw-application-button.tsx`: Button styling

Keep ALL existing logic in each component:
- Do NOT change useActionState hooks
- Do NOT change useFormStatus hooks
- Do NOT change any form submission handlers
- Do NOT change any Server Action calls

**Test Plan**:
```bash
# Run existing tests
npm test -- gigs/[id]

# Manual testing for each component
# Test apply form submission
# Test application accept/reject
# Test work submission
# Test work approval
# Test message sending
# Test application withdrawal
```

**Acceptance Criteria**:
- [ ] All forms use dark theme styling
- [ ] All buttons have hover and loading states
- [ ] Message bubbles have sender distinction
- [ ] All existing functionality works
- [ ] All tests pass

---

#### Task 14: Rebuild Profile Pages
**Description**: Restructure profile pages (`/profile`, `/profile/edit`, `/profile/[userId]`) to match mockup.

**Implementation Notes**:
- Update `app/(protected)/profile/page.tsx`:
  - Profile header card with large avatar and info
  - Statistics card (if SPECIALIST)
  - Experience section
  - Use card-based layout throughout
- Update `app/(protected)/profile/edit/page.tsx`:
  - Form uses dark theme input styling
  - Keep ALL existing form logic
- Update `app/(protected)/profile/[userId]/page.tsx`:
  - Same layout as own profile
  - Keep ALL existing authorization logic

Keep ALL existing Prisma queries and data fetching
Do NOT change any Server Actions or validation

**Test Plan**:
```bash
# Run existing tests
npm test -- profile

# Manual testing
# Visit /profile (own profile)
# Visit /profile/edit
# Test profile update
# Visit /profile/[userId] (other user's profile)
```

**Acceptance Criteria**:
- [ ] Profile pages use card-based layout
- [ ] Avatar displayed prominently
- [ ] Forms use dark theme styling
- [ ] All existing functionality works
- [ ] All tests pass

---

#### Task 15: Rebuild Gig Creation Form
**Description**: Restructure `app/(protected)/gigs/new/page.tsx` and `gig-form.tsx` to match dark theme.

**Implementation Notes**:
- Update form sections with card styling:
  - Each section: `<div className="bg-card border border-border rounded-lg p-6 space-y-4">`
  - Section headings: `<h3 className="text-lg font-semibold text-foreground">`
- Update input styling to match dark theme
- Update character counters styling
- Keep ALL existing form logic
- Keep ALL existing validation
- Keep ALL existing character counter logic
- Do NOT change any Server Action calls

**Test Plan**:
```bash
# Run existing tests
npm test -- gigs/new

# Manual testing
# Visit /gigs/new
# Fill out form
# Test character counters
# Test validation
# Submit form
# Verify gig created successfully
```

**Acceptance Criteria**:
- [ ] Form sections use card styling
- [ ] All inputs use dark theme styling
- [ ] Character counters styled correctly
- [ ] Fee preview styled correctly
- [ ] All existing functionality works
- [ ] All tests pass

---

#### Task 16: Update Admin Pages
**Description**: Update admin pages (`/admin`, `/admin/users`, `/admin/gigs`) to match dark theme.

**Implementation Notes**:
- Update all admin pages with dark theme styling
- Use table styling for user/gig lists:
  - Table: `<table className="w-full">`
  - Header: `<thead className="bg-muted/10 border-b border-border">`
  - Rows: `<tr className="border-b border-border hover:bg-accent">`
- Keep ALL existing Prisma queries
- Keep ALL existing moderation logic
- Do NOT change any Server Actions

**Test Plan**:
```bash
# Run existing tests
npm test -- admin

# Manual testing as ADMIN user
# Visit /admin
# Visit /admin/users
# Visit /admin/gigs
# Test suspend/unsuspend user
# Test close gig
# Verify audit logs work
```

**Acceptance Criteria**:
- [ ] Admin pages use dark theme
- [ ] Tables styled correctly
- [ ] All existing functionality works
- [ ] All tests pass

---

### Phase 4: Testing & Refinement

#### Task 17: Run Full Test Suite
**Description**: Run all tests to verify no functionality broken.

**Test Plan**:
```bash
# Run all unit and integration tests
npm test

# Run E2E tests
npm run test:e2e

# Check test coverage
npm run test:coverage
```

**Acceptance Criteria**:
- [ ] All unit tests pass (100%)
- [ ] All integration tests pass (100%)
- [ ] All E2E tests pass (100%)
- [ ] No regression in test coverage

---

#### Task 18: Visual QA and Responsive Testing
**Description**: Perform comprehensive visual QA across all pages and devices.

**Test Plan**:
```bash
# Start dev server
npm run dev

# Test each page at multiple breakpoints:
# - Mobile: 320px, 375px, 414px
# - Tablet: 768px, 1024px
# - Desktop: 1280px, 1920px

# Use browser dev tools to test responsive behavior
# Test on actual devices if available
```

**Checklist**:
- [ ] Homepage (logged in/out)
- [ ] Login page
- [ ] Registration page
- [ ] CLIENT dashboard
- [ ] SPECIALIST dashboard (all tabs)
- [ ] Gig browse page
- [ ] Gig detail page (all states)
- [ ] Profile pages
- [ ] Gig creation form
- [ ] Admin pages
- [ ] Navigation bar (all states)
- [ ] Notification bell and dropdown

**Acceptance Criteria**:
- [ ] All pages responsive on mobile
- [ ] All pages responsive on tablet
- [ ] All pages responsive on desktop
- [ ] No horizontal scrolling
- [ ] All interactive elements accessible
- [ ] All text readable (sufficient contrast)

---

#### Task 19: Accessibility Audit
**Description**: Verify accessibility compliance (keyboard navigation, screen readers, WCAG).

**Test Plan**:
```bash
# Run automated accessibility checks
npx @axe-core/cli http://localhost:3000
npx @axe-core/cli http://localhost:3000/login
npx @axe-core/cli http://localhost:3000/dashboard
# ... test all major pages

# Manual keyboard navigation testing
# Tab through all interactive elements
# Verify focus indicators visible
# Test form submission with keyboard only

# Screen reader testing (if available)
# Test with NVDA (Windows) or VoiceOver (Mac)
```

**Acceptance Criteria**:
- [ ] No critical accessibility violations
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels present where needed
- [ ] Color contrast meets WCAG AA standards

---

#### Task 20: Performance Verification
**Description**: Verify no performance regression from UI changes.

**Test Plan**:
```bash
# Build production bundle
npm run build

# Start production server
npm start

# Run Lighthouse audits
# Use Chrome DevTools > Lighthouse
# Test homepage, dashboard, gig browse, gig detail

# Check bundle size
npm run build
# Compare bundle size to baseline
```

**Acceptance Criteria**:
- [ ] Lighthouse Performance score ≥ 90
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] Bundle size increase < 10% from baseline
- [ ] No console errors or warnings
- [ ] Page load times acceptable (< 3s on 3G)

---

## Summary

Total tasks: 20
Estimated time: 13-20 hours

**Critical Success Factors**:
1. Preserve ALL existing logic (Server Actions, state management, data fetching)
2. Only change JSX structure and Tailwind classes
3. Run tests after each task to catch regressions early
4. Verify responsive behavior for each page
5. Maintain accessibility standards throughout

**Rollback Strategy**:
If any task causes critical issues, git revert the specific commit and reassess approach.
