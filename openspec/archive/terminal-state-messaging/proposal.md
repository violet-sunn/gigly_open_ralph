# Change Proposal: Terminal State Messaging

## Problem Statement

Messaging remains available after gigs reach PAID status, allowing conversations to continue after financial settlement. This creates potential for:

1. **Scope creep**: Clients may request additional work after payment is complete
2. **Post-payment disputes**: Disagreements can arise without clear boundaries
3. **Unclear expectations**: Both parties may be uncertain whether the engagement is truly finished

The current implementation checks `closedByAdmin` to disable messaging, but does NOT check `gig.status === 'PAID'`. The `sendMessage` action validates authorization but NOT terminal state.

## Proposed Solution

Block messaging for PAID gigs at both UI and server layers:

1. **UI Layer**: Hide MessageForm component when `gig.status === 'PAID'` and display explanatory message
2. **Server Layer**: Add validation in `sendMessage` action to reject mutations for PAID gigs
3. **Read-Only Access**: Keep existing messages visible for reference and dispute resolution
4. **Backward Compatibility**: Maintain existing `closedByAdmin` logic

## Rationale

- **PAID is a terminal state**: Once payment is marked, the gig lifecycle is complete
- **Clear boundaries**: Prevents ambiguity about when the engagement ends
- **Dispute protection**: Reduces post-payment conflicts by establishing clear cutoff
- **Consistent with closedByAdmin**: Aligns with existing pattern for disabling messaging

## Constraints

- MUST NOT affect messaging on gigs in other statuses (OPEN, IN_PROGRESS, REVIEW, COMPLETED)
- MUST keep existing messages visible (read-only) for audit trail
- MUST maintain existing `closedByAdmin` logic (both conditions can disable messaging)
- MUST provide clear user feedback about why messaging is disabled

## Non-Goals

- Changing the PAID status behavior or lifecycle
- Adding messaging to OPEN gigs (already blocked by "no assigned specialist" check)
- Implementing message editing or deletion
- Adding email notifications about messaging being disabled

## Success Criteria

1. MessageForm is hidden when `gig.status === 'PAID'`
2. Explanatory message is displayed: "This gig has been marked as paid. Messaging is no longer available."
3. `sendMessage` action returns error for PAID gigs: "Cannot send messages to a paid gig."
4. Existing messages remain visible on PAID gigs
5. All existing tests pass
6. New tests cover PAID status messaging scenarios
