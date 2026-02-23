# Change Proposal: Application Withdrawal

## Problem Statement

Specialists can apply to gigs but have **NO ability to withdraw PENDING applications**. Once submitted, applications are immutable from the specialist's perspective. This creates:

1. **Asymmetric control**: Clients have full control (accept/reject), specialists have none
2. **Poor user agency**: Specialists cannot change their mind or withdraw if circumstances change
3. **Stale applications**: Applications remain PENDING even when specialist is no longer interested
4. **Bad UX**: No way to signal "I'm no longer available" without contacting client directly

### Real-World Scenarios

- Specialist applies to multiple gigs, gets accepted elsewhere, wants to withdraw other applications
- Specialist realizes after applying that the gig doesn't match their skills/availability
- Specialist's circumstances change (vacation, other commitments, etc.)
- Specialist wants to revise their application but can only do so by withdrawing and reapplying

## Proposed Solution

Add **application withdrawal capability** for specialists with PENDING applications.

### Core Functionality

1. **Server Action**: `withdrawApplication` in `app/actions/gig.ts`
   - Validates: specialist owns the application, status is PENDING
   - Updates application status to 'WITHDRAWN' (soft delete, preserves audit trail)
   - Returns error or redirects to gig detail page

2. **UI Button**: "Withdraw Application" on gig detail page
   - Visible only to specialist who owns the application
   - Only shown for PENDING applications
   - Confirmation dialog to prevent accidental withdrawal

3. **Dashboard Integration**: Show WITHDRAWN applications in Archive tab
   - Specialists can see their withdrawal history
   - Clear visual distinction from REJECTED applications

4. **Client View**: Display WITHDRAWN status in applications list
   - Clients can see when specialists withdraw
   - Helps clients understand application pool changes

## Constraints & Design Decisions

### Status Model
- **WITHDRAWN is a new terminal status** (like ACCEPTED, REJECTED)
- WITHDRAWN applications cannot be un-withdrawn (no undo)
- Only PENDING applications can be withdrawn (not ACCEPTED/REJECTED)

### Authorization
- Only the specialist who owns the application can withdraw it
- Clients cannot withdraw applications on behalf of specialists
- Admins do not have withdrawal capability (they can close gigs instead)

### Gig State Constraints
- Cannot withdraw from closed gigs (closedByAdmin = true)
- Cannot withdraw from example gigs (isExample = true)
- Can withdraw from any gig status (OPEN, IN_PROGRESS, REVIEW, COMPLETED, PAID) as long as application is PENDING

### Audit Trail
- Soft delete: status changes to WITHDRAWN, record remains in database
- updatedAt timestamp captures withdrawal time
- No separate withdrawnAt field (use updatedAt)

### Rate Limiting
- No rate limiting on withdrawal (low abuse risk, self-limiting action)
- Specialist can only withdraw their own PENDING applications once

## Non-Goals

- ❌ Undo withdrawal (no "un-withdraw" functionality)
- ❌ Withdraw ACCEPTED applications (would break gig lifecycle)
- ❌ Withdraw REJECTED applications (already terminal)
- ❌ Bulk withdrawal (withdraw all applications at once)
- ❌ Withdrawal reasons/comments (keep it simple)
- ❌ Notifications to client when specialist withdraws (post-MVP)

## Success Criteria

1. Specialists can withdraw their own PENDING applications
2. WITHDRAWN applications appear in Archive tab on specialist dashboard
3. Clients see WITHDRAWN status in applications list
4. Authorization prevents unauthorized withdrawals
5. Comprehensive test coverage (integration + E2E)

## Risks & Mitigations

**Risk**: Specialists withdraw applications maliciously or frivolously
- **Mitigation**: No undo, withdrawal is permanent (creates friction)
- **Mitigation**: Post-MVP: track withdrawal rate, flag high-withdrawal users

**Risk**: Client confusion when applications disappear
- **Mitigation**: WITHDRAWN status is visible to clients
- **Mitigation**: Applications remain in database (soft delete)

**Risk**: Race condition (client accepts while specialist withdraws)
- **Mitigation**: Database transaction ensures atomic status check + update
- **Mitigation**: Only PENDING applications can be withdrawn

## Implementation Approach

1. **Database**: No schema changes needed (status is already a string field)
2. **Server Action**: Follow `applyToGig` pattern for consistency
3. **UI**: Follow existing action button patterns (Submit Work, Approve Work)
4. **Testing**: Integration tests for server action, E2E tests for user flow
