# Change Proposal: specialist-dashboard-tabs

## Change Name
`specialist-dashboard-tabs`

## Priority
**HIGH - USER EXPERIENCE & INFORMATION ARCHITECTURE** | **Size:** M | **Estimated Effort:** 3-4 hours

## Problem Statement

The Specialist dashboard currently displays flat, overlapping lists that create cognitive overload and poor task completion efficiency:

### Current State Issues

1. **Terminal State Mixing**: The "Active Gigs" section queries gigs with status `IN_PROGRESS`, `REVIEW`, `COMPLETED`, and `PAID` (lines 43-48). This means PAID gigs (terminal state, work complete, payment received) appear alongside IN_PROGRESS gigs (active work requiring attention).

2. **Duplicate Visibility**: When a specialist's application is ACCEPTED, the gig appears in both:
   - "Active Gigs" section (because assignedSpecialistId matches)
   - "My Applications" section (because the application exists)

   This creates confusion about where to find information.

3. **Non-Interactive Application Cards**: Items in "My Applications" section (lines 241-276) are plain `<div>` elements, not clickable links. Users cannot navigate to gig details from their applications list.

4. **No Lifecycle Organization**: All items are displayed in chronological order without grouping by lifecycle stage. Users must mentally filter which items need attention vs. which are complete.

5. **Poor Information Scent**: Users cannot quickly identify:
   - What needs their immediate attention (pending applications, active work)
   - What is waiting on others (work under review, awaiting payment)
   - What is complete and archived (paid gigs, rejected applications)

### Impact

- **Cognitive Overload**: Users must scan through mixed lists to find actionable items
- **Reduced Efficiency**: No clear separation between "needs action" and "waiting/complete"
- **Poor UX**: Non-clickable application cards break expected interaction patterns
- **Confusion**: Duplicate visibility of accepted gigs creates uncertainty

## Proposed Solution

Reorganize the Specialist dashboard into a tab-based workspace organized by gig lifecycle stage, with three distinct tabs:

### Tab 1: Active Work
**Purpose**: Work that requires the specialist's attention or is in progress

**Contents**:
- Gigs with status: `IN_PROGRESS`, `REVIEW`, `COMPLETED`
- These are gigs where the specialist is assigned and work is ongoing or awaiting payment
- Excludes PAID gigs (terminal state, moved to Archive)

**Why**: Focuses attention on work that needs action or is awaiting client response

### Tab 2: Pending Applications
**Purpose**: Applications awaiting client decision

**Contents**:
- Applications with status: `PENDING`
- These are gigs the specialist has applied to but not yet been accepted/rejected

**Why**: Separates "waiting for decision" from "active work", reducing mental load

### Tab 3: Archive
**Purpose**: Completed work and closed applications

**Contents**:
- Gigs with status: `PAID` (work complete, payment received)
- Applications with status: `REJECTED` (application declined)

**Why**: Keeps historical data accessible without cluttering active workspace

### Key Improvements

1. **No Duplicate Visibility**: Each gig appears in exactly one tab
   - If application is ACCEPTED → gig appears in "Active Work" only
   - If application is PENDING → appears in "Pending Applications" only
   - If application is REJECTED → appears in "Archive" only
   - If gig is PAID → appears in "Archive" only

2. **All Cards Clickable**: Every gig/application card is wrapped in a `<Link>` component navigating to `/dashboard/gigs/[id]`

3. **Client-Side Tab Switching**: Use React `useState` for instant tab switching without server round-trips

4. **Maintain Existing Queries**: Keep current Prisma queries, just filter results differently for each tab

## Scope

### In Scope

1. Create tab navigation UI component (3 tabs: Active Work, Pending Applications, Archive)
2. Extract Specialist dashboard into separate client component
3. Implement tab state management with `useState`
4. Filter activeGigs for "Active Work" tab (exclude PAID status)
5. Filter applications for "Pending Applications" tab (PENDING status only)
6. Filter for "Archive" tab (PAID gigs + REJECTED applications)
7. Make all application cards clickable (wrap in Link components)
8. Ensure no gig appears in multiple tabs
9. Maintain existing data queries and authorization
10. Preserve profile completion hints and navigation buttons

### Out of Scope (Deferred to Future Changes)

- Search/filter within tabs
- Sorting options (currently sorted by updatedAt/createdAt)
- Pagination (not needed for MVP, most specialists have <50 items)
- Tab badges showing count of items
- Keyboard navigation between tabs
- URL-based tab state (e.g., `/dashboard?tab=active`)
- Mobile-specific tab UI optimization
- Animation/transitions between tabs
- Empty state illustrations
- Bulk actions on gigs/applications

## Constraints

1. **No Breaking Changes**: Existing functionality must remain intact
2. **Server Component Compatibility**: Main dashboard page remains server component, tabs are client component
3. **Data Fetching**: Use existing Prisma queries, no new database queries
4. **Authorization**: Maintain existing access control (only show user's own gigs/applications)
5. **Styling**: Use existing Tailwind classes, maintain visual consistency

## Success Criteria

1. Specialist dashboard displays three tabs: Active Work, Pending Applications, Archive
2. Active Work tab shows only IN_PROGRESS, REVIEW, COMPLETED gigs (excludes PAID)
3. Pending Applications tab shows only PENDING applications
4. Archive tab shows PAID gigs and REJECTED applications
5. No gig appears in multiple tabs simultaneously
6. All gig cards are clickable and navigate to gig detail page
7. All application cards are clickable and navigate to gig detail page
8. Tab switching is instant (client-side state, no page reload)
9. Profile completion hints remain visible
10. "Browse Gigs" and "My Profile" buttons remain accessible
11. All existing tests continue to pass

## Dependencies

- Existing dashboard page structure (`app/dashboard/page.tsx`)
- Existing Prisma queries for gigs and applications
- Existing session management and authorization
- Existing Link component from Next.js
- Existing Tailwind CSS configuration

## Risks & Mitigations

**Risk**: Users might not understand the new tab organization.
**Mitigation**: Use clear, descriptive tab labels. "Active Work" is more intuitive than "In Progress". Empty states provide guidance.

**Risk**: Extracting to client component might affect performance.
**Mitigation**: Client component only handles tab state and filtering. Data fetching remains server-side. No performance impact expected.

**Risk**: Users might expect URL-based tab state (bookmarkable tabs).
**Mitigation**: Acceptable for MVP. Can be added in future iteration if users request it.

**Risk**: Breaking existing tests that expect specific dashboard structure.
**Mitigation**: Update tests to work with new tab-based structure. Tests should verify correct filtering, not specific DOM structure.

## Technical Decisions

### Decision 1: Client Component vs. Server Component with URL Params

**Options:**
1. Client component with useState for tab state
2. Server component with URL search params (?tab=active)

**Recommendation:** Client component with useState

**Rationale:**
- Faster tab switching (no server round-trip)
- Simpler implementation for MVP
- All data fetched once on page load
- Better UX for frequent tab switching
- URL-based state can be added later if needed

### Decision 2: Tab Component Structure

**Recommendation:** Create `SpecialistDashboardTabs` client component

**Structure:**
```tsx
'use client'

interface Props {
  activeGigs: Gig[]
  applications: Application[]
}

export function SpecialistDashboardTabs({ activeGigs, applications }: Props) {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'archive'>('active')

  // Filter data based on active tab
  // Render tab navigation
  // Render tab content
}
```

**Rationale:**
- Receives data from server component (no client-side fetching)
- Manages only UI state (tab selection)
- Can be easily tested in isolation
- Follows Next.js 13+ patterns

### Decision 3: Filtering Logic

**Active Work Tab:**
```typescript
const activeWorkGigs = activeGigs.filter(gig =>
  gig.status !== 'PAID'
)
```

**Pending Applications Tab:**
```typescript
const pendingApplications = applications.filter(app =>
  app.status === 'PENDING'
)
```

**Archive Tab:**
```typescript
const paidGigs = activeGigs.filter(gig => gig.status === 'PAID')
const rejectedApplications = applications.filter(app => app.status === 'REJECTED')
```

**Rationale:**
- Simple, readable filtering logic
- No database query changes needed
- Easy to test and verify

---

**Document Status:** Proposal - Ready for Implementation
**Created:** 2026-02-23
**Estimated Effort:** 3-4 hours
**Priority:** HIGH - USER EXPERIENCE & INFORMATION ARCHITECTURE
