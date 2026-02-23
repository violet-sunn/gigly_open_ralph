# UI Spec Delta: specialist-dashboard-tabs

## MODIFIED Requirements

### Requirement: Role-Based Dashboard

#### MODIFIED Scenario: Specialist visits dashboard
- GIVEN a user with role "SPECIALIST" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST display "Specialist Dashboard" heading
- AND it MUST show a "Browse Gigs" link to `/dashboard/gigs`
- AND it MUST show a "My Profile" link to `/dashboard/profile`
- AND it MUST display three tabs: "Active Work", "Pending Applications", "Archive"
- AND the "Active Work" tab MUST be selected by default
- AND it MUST display a "Sign out" button

**Rationale:** Reorganizes dashboard into tab-based workspace organized by gig lifecycle stage to reduce cognitive overload and improve task completion efficiency.

---

#### ADDED Scenario: Active Work tab displays in-progress gigs
- GIVEN a SPECIALIST user is on `/dashboard`
- AND the "Active Work" tab is selected
- WHEN the tab content renders
- THEN the tab MUST display gigs where:
  - The specialist is assigned (assignedSpecialistId matches user ID)
  - Status is IN_PROGRESS, REVIEW, or COMPLETED (excludes PAID)
- AND each gig MUST be wrapped in a `<Link href="/dashboard/gigs/{gig.id}">`
- AND each gig MUST show: title, status, budget (₽), and date
- AND each gig MUST have hover affordance (e.g., bg-gray-50 on hover)
- AND if no active gigs exist, it MUST show "No active work."
- AND PAID gigs MUST NOT appear in this tab

**Acceptance Criteria:**
- Filter logic: `activeGigs.filter(gig => gig.status !== 'PAID')`
- All gig cards wrapped in Link components
- Hover state provides visual feedback
- Empty state message when no items

---

#### ADDED Scenario: Pending Applications tab displays pending applications
- GIVEN a SPECIALIST user is on `/dashboard`
- AND the "Pending Applications" tab is selected
- WHEN the tab content renders
- THEN the tab MUST display applications where:
  - Status is PENDING (awaiting client decision)
  - The specialist is the applicant
- AND each application MUST be wrapped in a `<Link href="/dashboard/gigs/{app.gigId}">`
- AND each application MUST show: gig title, status, and date
- AND each application MUST have hover affordance (e.g., bg-gray-50 on hover)
- AND if no pending applications exist, it MUST show "No pending applications."
- AND ACCEPTED applications MUST NOT appear in this tab (they appear in Active Work)
- AND REJECTED applications MUST NOT appear in this tab (they appear in Archive)

**Acceptance Criteria:**
- Filter logic: `applications.filter(app => app.status === 'PENDING')`
- All application cards wrapped in Link components
- Hover state provides visual feedback
- Empty state message when no items

---

#### ADDED Scenario: Archive tab displays completed and rejected items
- GIVEN a SPECIALIST user is on `/dashboard`
- AND the "Archive" tab is selected
- WHEN the tab content renders
- THEN the tab MUST display two sections:
  - "Completed Gigs" section showing gigs with status PAID
  - "Rejected Applications" section showing applications with status REJECTED
- AND each item MUST be wrapped in a `<Link href="/dashboard/gigs/{id}">`
- AND each item MUST show: title, status, and date
- AND each item MUST have hover affordance (e.g., bg-gray-50 on hover)
- AND if no archived items exist, it MUST show "No archived items."
- AND IN_PROGRESS, REVIEW, COMPLETED gigs MUST NOT appear in this tab

**Acceptance Criteria:**
- Filter logic for paid gigs: `activeGigs.filter(gig => gig.status === 'PAID')`
- Filter logic for rejected apps: `applications.filter(app => app.status === 'REJECTED')`
- Two distinct sections with clear headings
- All cards wrapped in Link components
- Empty state message when both sections are empty

---

#### ADDED Scenario: Tab switching is instant
- GIVEN a SPECIALIST user is on `/dashboard`
- WHEN they click on a different tab
- THEN the tab content MUST update immediately (client-side state change)
- AND no network request MUST be made
- AND no loading spinner MUST be displayed
- AND the active tab MUST be visually distinguished (e.g., blue border or background)
- AND the previous tab content MUST be hidden
- AND the new tab content MUST be displayed

**Acceptance Criteria:**
- Tab state managed with React `useState`
- No server round-trips on tab switch
- Active tab has visual distinction (border-b-2 border-blue-600 or similar)
- Tab switching completes in <100ms

---

#### ADDED Scenario: No gig appears in multiple tabs
- GIVEN a SPECIALIST user has multiple gigs and applications
- WHEN they view the dashboard and switch between tabs
- THEN each gig MUST appear in exactly one tab:
  - If application is ACCEPTED and gig is IN_PROGRESS/REVIEW/COMPLETED → appears in "Active Work" only
  - If application is PENDING → appears in "Pending Applications" only
  - If application is REJECTED → appears in "Archive" only
  - If gig is PAID → appears in "Archive" only
- AND no gig MUST appear in both "Active Work" and "Pending Applications"
- AND no gig MUST appear in both "Active Work" and "Archive"
- AND no application MUST appear in both "Pending Applications" and "Archive"

**Acceptance Criteria:**
- Filtering logic ensures mutual exclusivity
- Manual testing confirms no duplicates
- Each gig/application has single source of truth based on status

---

#### ADDED Scenario: All gig and application cards are clickable
- GIVEN a SPECIALIST user is on `/dashboard`
- WHEN they view any tab (Active Work, Pending Applications, or Archive)
- THEN every gig card MUST be a clickable link
- AND every application card MUST be a clickable link
- AND clicking a gig card MUST navigate to `/dashboard/gigs/{gig.id}`
- AND clicking an application card MUST navigate to `/dashboard/gigs/{app.gigId}`
- AND cards MUST show cursor pointer on hover
- AND cards MUST have keyboard accessibility (focusable, Enter key activates)

**Acceptance Criteria:**
- All cards wrapped in `<Link>` component from Next.js
- No plain `<div>` elements for interactive items
- Keyboard navigation works (Tab to focus, Enter to activate)
- Visual hover state indicates clickability

---

#### ADDED Scenario: Profile completion hints remain visible
- GIVEN a SPECIALIST user with incomplete profile
- WHEN they visit `/dashboard`
- THEN the profile completion hint MUST be displayed above the tabs
- AND the hint MUST remain visible regardless of which tab is selected
- AND the "My Profile" link MUST remain accessible

**Acceptance Criteria:**
- Profile completion logic unchanged
- Hints positioned above tab navigation
- Visible on all tabs

---

#### ADDED Scenario: Navigation buttons remain accessible
- GIVEN a SPECIALIST user is on `/dashboard`
- WHEN they view the page
- THEN the "Browse Gigs" link MUST be visible and accessible
- AND the "My Profile" link MUST be visible and accessible
- AND the "Sign out" button MUST be visible and accessible
- AND these elements MUST remain accessible regardless of which tab is selected

**Acceptance Criteria:**
- Navigation elements positioned above or alongside tabs
- Always visible, not hidden by tab content
- Existing functionality unchanged

---

## Implementation Notes

### Component Structure
- Create new client component: `app/dashboard/SpecialistDashboardTabs.tsx`
- Mark with `'use client'` directive
- Accept props: `activeGigs: Gig[]`, `applications: Application[]`
- Manage tab state with `useState<'active' | 'pending' | 'archive'>('active')`

### Data Fetching
- No changes to existing Prisma queries in `app/dashboard/page.tsx`
- Server component fetches data once on page load
- Client component filters data based on active tab

### Filtering Logic
```typescript
// Active Work tab
const activeWorkGigs = activeGigs.filter(gig => gig.status !== 'PAID')

// Pending Applications tab
const pendingApplications = applications.filter(app => app.status === 'PENDING')

// Archive tab
const paidGigs = activeGigs.filter(gig => gig.status === 'PAID')
const rejectedApplications = applications.filter(app => app.status === 'REJECTED')
```

### Styling
- Use existing Tailwind classes for consistency
- Tab navigation: border-b-2 for active state
- Cards: hover:bg-gray-50 for hover affordance
- Maintain existing card layout and spacing

### Accessibility
- Tab buttons are semantic `<button>` elements
- Active tab has `aria-selected="true"`
- Tab panel has `role="tabpanel"`
- All cards are keyboard accessible (Link components)

---

## Testing Strategy

### Unit Tests
- Test filtering logic for each tab
- Test tab state management
- Test that no gig appears in multiple tabs

### Integration Tests
- Test tab switching updates UI correctly
- Test that all cards are clickable
- Test navigation from cards to gig detail page

### Manual Testing
- Verify visual design matches existing dashboard style
- Verify tab switching is instant (no loading)
- Verify hover states work correctly
- Verify keyboard navigation works
- Test with various data scenarios (empty tabs, full tabs, mixed)

---

## Migration Notes

### Breaking Changes
None. This is a UI reorganization with no data model changes.

### Backward Compatibility
- All existing data queries remain unchanged
- All existing authorization logic remains unchanged
- All existing gig detail pages remain unchanged
- Profile completion hints remain functional

### Rollback Plan
If issues arise, revert to previous dashboard implementation by:
1. Remove `SpecialistDashboardTabs` component
2. Restore original "Active Gigs" and "My Applications" sections in `app/dashboard/page.tsx`
3. No database migrations needed (no schema changes)
