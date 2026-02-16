# Change Proposal: Gig Work Submission and Approval

## Change Name
`gig-work-submission-and-approval`

## Problem Statement

Currently, gigs transition from OPEN to IN_PROGRESS when a client accepts a specialist's application. However, there is no mechanism for the specialist to signal work completion or for the client to approve the delivered work. The gig remains stuck in IN_PROGRESS indefinitely.

## Proposed Solution

Implement two new lifecycle transitions:

1. **Submit Work (IN_PROGRESS → REVIEW)**: The assigned specialist can submit their completed work, moving the gig to REVIEW status.
2. **Approve Work (REVIEW → COMPLETED)**: The client can review and approve the submitted work, moving the gig to COMPLETED status.

These transitions complete the core work delivery flow, enabling the marketplace to track work completion before payment processing.

## Scope

### In Scope
- `submitWork` server action (SPECIALIST only, assigned specialist only)
- `approveWork` server action (CLIENT only, gig owner only)
- Gig status transitions: IN_PROGRESS → REVIEW → COMPLETED
- UI buttons/forms for submitting and approving work on gig detail pages
- Role-based access control for both actions

### Out of Scope
- Work rejection or revision requests (future change)
- Payment processing (COMPLETED → PAID transition)
- File uploads or deliverable attachments
- Messaging between client and specialist
- Notifications (email/in-app)

## Constraints

- Only the assigned specialist (gig.assignedSpecialistId) can submit work
- Only the gig owner (gig.clientId) can approve work
- Work can only be submitted when gig status is IN_PROGRESS
- Work can only be approved when gig status is REVIEW
- Status transitions are irreversible (no rollback from REVIEW to IN_PROGRESS)
- All status updates must be atomic (single database transaction)

## Success Criteria

- Specialists can submit work on their assigned gigs
- Clients can approve submitted work
- Gig status correctly reflects the work delivery stage
- Unauthorized users cannot perform these actions
- Integration tests validate all scenarios

## Dependencies

- Existing gig and application models
- Existing authentication and session management
- Gig detail pages for both CLIENT and SPECIALIST roles

## Non-Goals

- This change does NOT implement payment processing
- This change does NOT implement work rejection or revision workflows
- This change does NOT add deliverable file storage
