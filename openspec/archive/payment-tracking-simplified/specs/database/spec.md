# Database Specification - Payment Tracking Delta

## MODIFIED Requirements

### Requirement: Gig Model
The Gig model MUST be extended to track payment status and timestamp.

#### Scenario: Gig schema includes payment tracking
- GIVEN the Prisma schema file
- WHEN the Gig model is updated
- THEN it MUST include a `paidAt` field as DateTime? (nullable)
- AND the field MUST default to null for new gigs

#### Scenario: Gig transitions to PAID status
- GIVEN a Gig with status "COMPLETED"
- WHEN the gig is marked as paid
- THEN the Gig `status` MUST be updated to "PAID"
- AND `paidAt` MUST be set to the current timestamp

#### Scenario: Payment timestamp is immutable
- GIVEN a Gig with status "PAID" and paidAt set
- WHEN the gig is queried later
- THEN the `paidAt` value MUST remain unchanged
- AND the status MUST remain "PAID"

**Acceptance Criteria:**
- `npx prisma validate` passes
- Gig model includes `paidAt DateTime?` field
- Migration adds `paidAt` column to Gig table (nullable)
- Existing gigs have `paidAt = null` after migration
- Gig status supports "PAID" value
