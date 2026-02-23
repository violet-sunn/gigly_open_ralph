# Tasks: specialist-dashboard-tabs

## Task 1: Create SpecialistDashboardTabs client component

**Implementation:**
- Create new file `app/dashboard/SpecialistDashboardTabs.tsx`
- Mark as `'use client'` directive
- Accept props: `activeGigs: Gig[]`, `applications: Application[]`
- Implement `useState` for tab state: `'active' | 'pending' | 'archive'`
- Default to `'active'` tab

**Test Plan:**
```bash
# Verify file exists and has correct structure
cat app/dashboard/SpecialistDashboardTabs.tsx | grep "'use client'"
cat app/dashboard/SpecialistDashboardTabs.tsx | grep "useState"
```

**Acceptance Criteria:**
- Component exports `SpecialistDashboardTabs` function
- Uses `'use client'` directive
- Accepts typed props for activeGigs and applications
- Manages tab state with useState

---

## Task 2: Implement tab navigation UI

**Implementation:**
- Create tab button group with 3 tabs: "Active Work", "Pending Applications", "Archive"
- Style active tab with blue background, inactive with gray
- Use Tailwind classes: `border-b-2`, `border-blue-600` for active state
- Make tabs keyboard accessible with proper button semantics
- Add click handlers to update tab state

**Test Plan:**
```bash
# Verify tab navigation exists
grep -n "Active Work" app/dashboard/SpecialistDashboardTabs.tsx
grep -n "Pending Applications" app/dashboard/SpecialistDashboardTabs.tsx
grep -n "Archive" app/dashboard/SpecialistDashboardTabs.tsx
grep -n "setActiveTab" app/dashboard/SpecialistDashboardTabs.tsx
```

**Acceptance Criteria:**
- Three tab buttons render with correct labels
- Active tab has visual distinction (blue border/background)
- Clicking tab updates state
- Tab buttons are semantic `<button>` elements

---

## Task 3: Implement filtering logic for Active Work tab

**Implementation:**
- Filter `activeGigs` to exclude `PAID` status
- Display filtered gigs in Active Work tab
- Show gigs with status: `IN_PROGRESS`, `REVIEW`, `COMPLETED`
- Wrap each gig card in `<Link href={`/dashboard/gigs/${gig.id}`}>`
- Maintain existing card styling and layout

**Test Plan:**
```bash
# Verify filtering logic
grep -n "gig.status !== 'PAID'" app/dashboard/SpecialistDashboardTabs.tsx
grep -n "Link href=.*gig.id" app/dashboard/SpecialistDashboardTabs.tsx

# Run tests
npm test -- --testPathPattern=dashboard
```

**Acceptance Criteria:**
- Active Work tab shows only IN_PROGRESS, REVIEW, COMPLETED gigs
- PAID gigs do not appear in Active Work tab
- All gig cards are wrapped in Link components
- Cards navigate to `/dashboard/gigs/[id]` on click

---

## Task 4: Implement filtering logic for Pending Applications tab

**Implementation:**
- Filter `applications` to show only `PENDING` status
- Display filtered applications in Pending Applications tab
- Wrap each application card in `<Link href={`/dashboard/gigs/${app.gigId}`}>`
- Show gig title, budget, and application date
- Maintain existing card styling

**Test Plan:**
```bash
# Verify filtering logic
grep -n "app.status === 'PENDING'" app/dashboard/SpecialistDashboardTabs.tsx
grep -n "Link href=.*app.gigId" app/dashboard/SpecialistDashboardTabs.tsx

# Run tests
npm test -- --testPathPattern=dashboard
```

**Acceptance Criteria:**
- Pending Applications tab shows only PENDING applications
- ACCEPTED and REJECTED applications do not appear
- All application cards are wrapped in Link components
- Cards navigate to gig detail page on click

---

## Task 5: Implement filtering logic for Archive tab

**Implementation:**
- Filter `activeGigs` for `PAID` status
- Filter `applications` for `REJECTED` status
- Display both lists in Archive tab with section headers
- Wrap all cards in Link components
- Show "No archived items" message if both lists are empty

**Test Plan:**
```bash
# Verify filtering logic
grep -n "gig.status === 'PAID'" app/dashboard/SpecialistDashboardTabs.tsx
grep -n "app.status === 'REJECTED'" app/dashboard/SpecialistDashboardTabs.tsx

# Run tests
npm test -- --testPathPattern=dashboard
```

**Acceptance Criteria:**
- Archive tab shows PAID gigs and REJECTED applications
- Both sections have clear headers ("Completed Gigs", "Rejected Applications")
- All cards are clickable links
- Empty state message appears when no archived items exist

---

## Task 6: Update dashboard page to use new component

**Implementation:**
- Import `SpecialistDashboardTabs` in `app/dashboard/page.tsx`
- Replace existing "Active Gigs" and "My Applications" sections with tabs component
- Pass `activeGigs` and `applications` as props
- Keep profile completion hints and navigation buttons above tabs
- Maintain server component structure for data fetching

**Test Plan:**
```bash
# Verify integration
grep -n "SpecialistDashboardTabs" app/dashboard/page.tsx
grep -n "activeGigs={activeGigs}" app/dashboard/page.tsx

# Run tests
npm test -- --testPathPattern=dashboard
```

**Acceptance Criteria:**
- Dashboard page imports and renders SpecialistDashboardTabs
- Profile completion hints remain visible
- "Browse Gigs" and "My Profile" buttons remain accessible
- Existing data queries unchanged
- Server component structure maintained

---

## Task 7: Verify no duplicate visibility

**Implementation:**
- Test scenario: Create application with ACCEPTED status
- Verify gig appears ONLY in Active Work tab (not in Pending Applications)
- Test scenario: Create application with PENDING status
- Verify application appears ONLY in Pending Applications tab
- Test scenario: Create gig with PAID status
- Verify gig appears ONLY in Archive tab (not in Active Work)

**Test Plan:**
```bash
# Manual testing steps documented in proposal.md
# Automated test to verify filtering logic
npm test -- --testPathPattern=dashboard

# Visual inspection:
# 1. Start dev server: npm run dev
# 2. Login as specialist with multiple gigs/applications
# 3. Switch between tabs and verify no duplicates
# 4. Check that each gig appears in exactly one tab
```

**Acceptance Criteria:**
- No gig appears in multiple tabs simultaneously
- ACCEPTED applications show gig in Active Work only
- PENDING applications show in Pending Applications only
- PAID gigs show in Archive only
- REJECTED applications show in Archive only

---

## Task 8: Test tab switching performance

**Implementation:**
- Verify tab switching is instant (no loading states)
- Confirm no network requests on tab switch
- Test with large datasets (50+ gigs/applications)
- Verify smooth rendering without flicker

**Test Plan:**
```bash
# Run performance tests
npm test -- --testPathPattern=dashboard

# Manual testing:
# 1. Open browser DevTools Network tab
# 2. Switch between tabs
# 3. Verify no network requests
# 4. Verify instant UI updates
```

**Acceptance Criteria:**
- Tab switching completes in <100ms
- No network requests on tab switch
- No loading spinners or skeleton states
- Smooth transitions without layout shift

---

## Task 9: Update existing tests

**Implementation:**
- Update dashboard tests to work with new tab structure
- Add tests for tab switching behavior
- Add tests for filtering logic (each tab shows correct items)
- Add tests for Link component wrapping
- Verify all existing tests still pass

**Test Plan:**
```bash
# Run full test suite
npm test

# Verify all tests pass
npm test -- --testPathPattern=dashboard --verbose
```

**Acceptance Criteria:**
- All existing tests pass (528 tests)
- New tests cover tab switching
- New tests cover filtering logic
- New tests verify no duplicate visibility
- Test coverage remains >80%

---

**Total Tasks:** 9
**Estimated Effort:** 3-4 hours
**Priority:** HIGH - USER EXPERIENCE & INFORMATION ARCHITECTURE
