# Change: application-management

## Summary

Add functionality for CLIENT users to accept or reject SPECIALIST applications on their gigs. Accepting an application transitions the gig status from `OPEN` to `IN_PROGRESS`, assigns the specialist, and rejects all other pending applications for that gig.

## Motivation

Currently, clients can see applications on their gigs but cannot act on them. The gig lifecycle (`OPEN → IN_PROGRESS → ...`) is blocked at the first transition. This change unblocks the core workflow by letting clients choose a specialist and begin work.

## Scope

### In Scope
- `acceptApplication` server action (CLIENT only)
- `rejectApplication` server action (CLIENT only)
- Add `assignedSpecialistId` field to Gig model to track the chosen specialist
- Update Application model to support `ACCEPTED` and `REJECTED` statuses
- Update gig detail page to show Accept/Reject buttons on PENDING applications (for gig owner)
- Auto-reject remaining PENDING applications when one is accepted
- Prevent new applications on non-OPEN gigs (already implemented)

### Non-Goals
- Specialist notifications (email, in-app) — future change
- Payment or escrow flow — future change
- Gig status transitions beyond IN_PROGRESS (REVIEW, COMPLETED, PAID) — future change
- Client profile or specialist profile enhancements — future change

## Constraints
- All mutations via Server Actions (project convention)
- Only the gig owner (CLIENT who created the gig) can accept/reject
- A gig can have at most one accepted application
- Accepting is irreversible (cannot un-accept once gig is IN_PROGRESS)
- Rejecting is irreversible per application
