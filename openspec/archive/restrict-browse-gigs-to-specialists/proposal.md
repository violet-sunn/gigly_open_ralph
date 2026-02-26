# Change Proposal: Restrict Browse Gigs to Specialists

## Problem Statement

Currently, CLIENT users can access the "Browse Gigs" page (`/dashboard/gigs`) by directly navigating to the URL, even though this page is intended only for SPECIALIST users who need to find and apply to gigs. This creates a confusing user experience and violates role-based access control principles.

### Current Behavior
- The `/dashboard/gigs` page only checks authentication (`if (!session) redirect('/login')`)
- No role-based authorization is enforced
- CLIENT users can view all OPEN gigs, including example gigs
- The CLIENT dashboard does not show a "Browse Gigs" link, but the page is still accessible via direct URL

### Why This Is a Problem
1. **Security**: Lack of role-based access control
2. **UX Confusion**: Clients see a page designed for specialists (with "Apply" functionality)
3. **Role Violation**: Clients should post gigs, not browse them
4. **Inconsistent UI**: No link in CLIENT dashboard, but page is accessible

## Complication: Example Gigs

The project contains 5 example gigs (marked with `isExample: true`) that serve important purposes:
- Help new clients understand what good gig descriptions look like
- Demonstrate structured requirements (goal, deliverables, constraints, acceptance criteria)
- Provide realistic examples of budgets, tags, and technical approaches
- Currently linked from gig creation form header: "💡 View example gigs for inspiration"

These example gigs are currently accessible via `/dashboard/gigs` (the browse page), which creates a dependency that must be preserved.

## Proposed Solution

### Approach 1: Role-Based Access Control (Rejected)
Add role-based authorization to `/dashboard/gigs` page:
- Redirect CLIENT users to `/dashboard` with an error message
- Keep page fully accessible to SPECIALIST users
- Maintain existing link from gig creation form (opens in new tab)
- CLIENT users can still view example gigs through the gig creation form link

**Why This Fails**: This creates a terrible UX contradiction. The user clicks "💡 View example gigs for inspiration" and is immediately shown an error message saying they can't access the page. They never actually see the examples they were promised. This is a classic "bait and switch" anti-pattern.

### Approach 2: Separate Example Gigs Page (Recommended)
Create a dedicated `/dashboard/gigs/examples` page:
- Accessible to both CLIENT and SPECIALIST roles
- Shows only example gigs (`isExample: true`)
- Update gig creation form link to point to this new page
- Restrict `/dashboard/gigs` to SPECIALIST only

**Rationale**: Provides cleaner separation of concerns and solves the UX contradiction. Clients get a dedicated page for viewing examples without encountering access errors. The additional implementation work is justified by the improved user experience.

## Recommendation

**Use Approach 2** (Separate Example Gigs Page) because:
- Solves the UX contradiction - users clicking "inspiration" link actually see examples
- Clean separation: `/dashboard/gigs` for specialists, `/dashboard/gigs/examples` for everyone
- No confusing error messages when users follow helpful links
- Example gigs remain accessible to both roles through appropriate channels
- Fixes the security issue without breaking user workflows

## Constraints

- MUST NOT break existing example gig functionality
- MUST NOT remove or hide example gigs
- MUST maintain link from gig creation form
- MUST provide clear error message if CLIENT attempts direct access
- MUST NOT affect SPECIALIST user experience

## Non-Goals

- Creating a separate example gigs gallery (deferred to future enhancement)
- Filtering example gigs from regular gigs on browse page (not needed - they're helpful for specialists too)
- Adding admin tools to manage example gigs (out of scope)

## Success Criteria

1. CLIENT users cannot access `/dashboard/gigs` directly
2. CLIENT users are redirected to `/dashboard` with clear message
3. SPECIALIST users can access `/dashboard/gigs` without changes
4. Example gigs remain visible to both roles through appropriate channels
5. Link from gig creation form continues to work
6. All existing tests pass
7. No regression in specialist gig browsing experience
