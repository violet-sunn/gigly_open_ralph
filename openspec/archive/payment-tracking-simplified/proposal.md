# Payment Tracking (Simplified) - Proposal

## Change Name
`payment-tracking-simplified`

## Problem Statement

Currently, the gig lifecycle ends at the COMPLETED status after the client approves work. There is no mechanism to:
- Transition gigs to a PAID status
- Track when payment was made
- Provide clients with a way to mark gigs as paid
- Display payment status to specialists

This creates ambiguity about whether a specialist has been paid and makes it difficult to track financial obligations.

## Proposed Solution

Implement a simplified payment tracking system that:
1. Adds a PAID status to the gig lifecycle (COMPLETED → PAID)
2. Allows clients to mark completed gigs as paid (simulated payment)
3. Tracks the payment date on the Gig model
4. Updates UI to show payment status and provide payment actions

**This is a simplified implementation** that tracks payment state without integrating actual payment gateways (Stripe, bank transfers, etc.). Real payment processing will be implemented in a future change.

## Scope

### In Scope
- Add `paidAt` field to Gig model (nullable DateTime)
- Add `markAsPaid` server action for CLIENT users
- Gig status transition: COMPLETED → PAID
- UI: "Mark as Paid" button on gig detail page (CLIENT owner, COMPLETED gigs)
- UI: Display payment status and date on gig detail and dashboard
- Validation: only gig owner can mark as paid, only COMPLETED gigs can be marked as paid

### Out of Scope
- Actual payment gateway integration (Stripe, PayPal, etc.)
- Escrow account management
- Refunds or disputes
- Payment receipts or invoices
- Automated payment processing
- Payment notifications (email, in-app)
- Multi-currency support
- Payment history or ledger

## Constraints

- **Role-based access**: Only CLIENT users who own the gig can mark it as paid
- **Status validation**: Only gigs with status COMPLETED can transition to PAID
- **Idempotency**: Marking a gig as paid multiple times should be safe (no-op if already paid)
- **Immutability**: Once marked as PAID, the status cannot be reversed (no "unpay" action)
- **Monetary values**: All amounts remain in kopecks (integers) as per existing convention

## Success Criteria

1. CLIENT can mark a COMPLETED gig as paid via UI button
2. Gig status transitions to PAID and `paidAt` is set to current timestamp
3. Payment status is visible on gig detail page and dashboard
4. SPECIALIST can see when their gig was marked as paid
5. Non-owners and non-CLIENT users cannot mark gigs as paid
6. Attempting to mark non-COMPLETED gigs as paid returns an error

## Dependencies

- Existing Gig model and lifecycle (OPEN → IN_PROGRESS → REVIEW → COMPLETED)
- Existing authentication and session management
- Existing role-based access control (CLIENT/SPECIALIST)

## Risks & Mitigations

**Risk**: Users may confuse "Mark as Paid" with actual payment processing.
**Mitigation**: Clear UI copy explaining this is a manual confirmation, not a payment action.

**Risk**: Clients may forget to mark gigs as paid.
**Mitigation**: Future change can add reminders or notifications (out of scope for this change).

**Risk**: No audit trail for who marked the gig as paid.
**Mitigation**: Acceptable for simplified version; can be added later if needed.
