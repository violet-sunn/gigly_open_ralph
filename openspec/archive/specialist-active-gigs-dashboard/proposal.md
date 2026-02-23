# Change Proposal: Specialist Active Gigs Dashboard

## Problem Statement

Currently, specialists cannot interact with gigs they've been assigned to from their dashboard. The specialist dashboard shows "My Applications" - a list of all applications they've submitted (PENDING, ACCEPTED, REJECTED). While specialists CAN see their accepted gigs in this list, **the gig items are not clickable**.

This creates a critical workflow blocker:
- Specialists can see they have active work, but cannot navigate to it from the dashboard
- No way to click through to access messaging with the client
- No way to click through to submit completed work
- Must manually type URLs or use browser history to access their active gigs
- Effectively stranded on the dashboard with no path forward

## Current Behavior

**Specialist Dashboard (`/dashboard`):**
- Shows "My Applications" section with all applications (PENDING, ACCEPTED, REJECTED)
- Each application shows gig title, status, and date
- **Applications are NOT clickable** - no links to gig detail pages

**The Problem:**
- Specialists can SEE their accepted/active gigs in the applications list
- But they CANNOT click on them to navigate to the gig detail page
- All interaction features (messaging, work submission) exist on the gig detail page
- Without clickable links, specialists are blocked from accessing these features

## Proposed Solution

Add an "Active Gigs" section to the specialist dashboard that displays all gigs where the user is the assigned specialist (`assignedSpecialistId === userId`) **with clickable links**. This section will:

1. **Display active gigs prominently** - positioned above "My Applications" section
2. **Show gig status and key information** - title, budget, status, client company name
3. **Provide clickable navigation** - each gig is a clickable link to `/dashboard/gigs/[id]` (unlike "My Applications")
4. **Enable interaction** - specialists can click through to access messaging and work submission
5. **Support full lifecycle** - show gigs in IN_PROGRESS, REVIEW, COMPLETED, and PAID statuses
6. **Separate concerns** - "Active Gigs" (work I'm doing) vs "My Applications" (application history)

## Benefits

- **Unblocks core workflow** - specialists can now navigate to their active gigs from the dashboard
- **Enables messaging** - one click to access gig detail page with messaging features
- **Enables work submission** - one click to access work submission forms
- **Better information architecture** - separates "active work" from "application history"
- **Improved task management** - specialists can quickly see and access what needs attention
- **Aligns with user mental model** - "My Active Gigs" is where I go to work on gigs

## Scope

### In Scope
- New "Active Gigs" section on specialist dashboard
- Query gigs where `assignedSpecialistId === userId`
- Display gig title, budget, status, client info, and date
- Clickable links to gig detail pages
- Visual status indicators (IN_PROGRESS, REVIEW, COMPLETED, PAID)
- Empty state message when no active gigs

### Out of Scope
- Filtering or sorting active gigs (can be added later if needed)
- Notifications or alerts for status changes
- Inline messaging or work submission from dashboard (use gig detail page)
- Changes to gig detail page functionality (already complete)
- Changes to application management (already complete)

## Non-Goals

- This change does NOT modify the "My Applications" section
- This change does NOT add new server actions (all actions already exist)
- This change does NOT change gig lifecycle or status transitions
- This change does NOT add new database fields or models

## Technical Approach

### Database Query
```typescript
const activeGigs = await prisma.gig.findMany({
  where: {
    assignedSpecialistId: session.userId,
    status: { in: ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] }
  },
  include: {
    client: {
      select: {
        email: true,
        clientProfile: true
      }
    }
  },
  orderBy: { updatedAt: 'desc' }
});
```

### UI Changes
- Modify `app/dashboard/page.tsx` (specialist section only)
- Add "Active Gigs" section above "My Applications"
- Reuse existing gig list styling patterns
- Add status badges with color coding

### No New Server Actions Required
All functionality (messaging, work submission, approval) already exists on the gig detail page. This change only adds navigation/visibility.

## Risks & Mitigations

**Risk:** Performance impact if specialist has many active gigs
**Mitigation:** Query is simple and indexed (assignedSpecialistId). Can add pagination later if needed.

**Risk:** Confusion between "Active Gigs" and "My Applications"
**Mitigation:** Clear section headings and visual distinction. "Active Gigs" shows clickable current work with action-oriented UI. "My Applications" shows application history (all statuses including PENDING/REJECTED) without clickable links.

**Risk:** Empty state for new specialists
**Mitigation:** Show helpful message: "No active gigs yet. Browse and apply to gigs to get started."

**Risk:** Duplicate information (same gigs appear in both sections)
**Mitigation:** This is intentional and beneficial. "Active Gigs" is for action (clickable, work-focused), "My Applications" is for history (all applications, read-only). Different purposes justify the duplication.

## Success Metrics

- Specialists can navigate from dashboard to active gigs in 1 click (currently impossible)
- 100% of specialists with active gigs can access messaging features (currently blocked)
- 100% of specialists with active gigs can access work submission features (currently blocked)
- Reduced support requests about "how do I access my gig?"
- Improved specialist satisfaction with dashboard UX

## Dependencies

None. All required functionality already exists:
- Gig model has `assignedSpecialistId` field
- Gig detail page has messaging and work submission
- Dashboard page structure supports additional sections

## Rollout Plan

1. Implement UI changes to specialist dashboard
2. Add integration tests for active gigs query
3. Add E2E tests for specialist dashboard navigation
4. Deploy (no migration required)
5. Monitor for performance or UX issues

## Future Enhancements (Post-MVP)

- Filter active gigs by status (IN_PROGRESS, REVIEW, etc.)
- Sort by deadline or priority
- Badge indicators for unread messages
- Quick actions (e.g., "Submit Work" button directly on dashboard)
