# Gig Specification Delta - System Audit

## ADDED Requirements

### Requirement: Pagination Implementation Validation

The platform SHALL validate that pagination is correctly implemented on gig browsing pages as documented.

#### Scenario: Gig browsing page has pagination

**Given** the documentation claims "Pagination on gig browsing page (25 gigs per page, offset-based)"
**When** the audit reviews `app/dashboard/gigs/page.tsx`
**Then** the page SHALL implement offset-based pagination
**And** page size SHALL be 25 gigs per page
**And** pagination controls SHALL be rendered
**And** URL parameters SHALL include `?page=N`

**Acceptance Criteria**:
- Check: `app/dashboard/gigs/page.tsx` has pagination logic
- Check: `const PAGE_SIZE = 25` or similar constant exists
- Check: Prisma query uses `skip` and `take` for pagination
- Check: PaginationControls component is rendered
- Document: Pagination implementation status

#### Scenario: Pagination integrates with filters

**Given** gig browsing has filters (search, tags, budget range)
**When** the audit reviews filter integration
**Then** filters SHALL reset pagination to page 1
**And** pagination SHALL preserve filter parameters in URL
**And** filter changes SHALL not break pagination state

**Acceptance Criteria**:
- Check: Filter changes remove `page` parameter from URL
- Check: Pagination links preserve filter parameters
- Review: URL structure like `/dashboard/gigs?search=react&tags=TypeScript&page=2`
- Document: Filter-pagination integration

#### Scenario: Pagination handles edge cases

**Given** pagination is implemented
**When** the audit reviews edge case handling
**Then** invalid page numbers SHALL redirect to valid pages
**And** empty result pages SHALL display appropriate message
**And** page count calculation SHALL be correct

**Acceptance Criteria**:
- Check: Negative page numbers are handled
- Check: Page numbers beyond max are handled
- Check: Total count query is parallel to data query (performance)
- Document: Edge case handling

---

### Requirement: Gig Lifecycle State Validation

The platform SHALL validate that gig lifecycle transitions are correctly implemented and tested.

#### Scenario: All gig statuses are implemented

**Given** the documentation defines gig lifecycle: OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID
**When** the audit reviews the Gig model
**Then** all five statuses SHALL exist in Prisma schema
**And** status transitions SHALL be enforced in server actions
**And** invalid transitions SHALL be prevented

**Acceptance Criteria**:
- Check: `prisma/schema.prisma` defines all five GigStatus values
- Check: Server actions validate status transitions
- Check: Tests cover all valid and invalid transitions
- Document: Gig lifecycle implementation status

#### Scenario: Gig timestamps are correctly set

**Given** gigs transition through lifecycle stages
**When** the audit reviews timestamp fields
**Then** `createdAt` SHALL be set on creation
**And** `workSubmittedAt` SHALL be set when status changes to REVIEW
**And** `completedAt` SHALL be set when status changes to COMPLETED
**And** `paidAt` SHALL be set when status changes to PAID

**Acceptance Criteria**:
- Check: Prisma schema has all timestamp fields
- Check: Server actions set timestamps on status transitions
- Check: Tests verify timestamps are set correctly
- Document: Timestamp implementation status

---

### Requirement: Service Fee Calculation Validation

The platform SHALL validate that service fee calculation is correct and consistent across the codebase.

#### Scenario: Service fee is 10% as documented

**Given** the documentation states "10% fee on top of the gig budget"
**When** the audit reviews service fee calculation
**Then** server-side calculation SHALL use 10% (0.1 multiplier)
**And** client-side preview SHALL use 10% (0.1 multiplier)
**And** seed data SHALL use 10% service fee
**And** tests SHALL verify 10% calculation

**Acceptance Criteria**:
- Check: `app/actions/gig.ts` calculates `serviceFee = budget * 0.1`
- Check: `app/dashboard/gigs/new/gig-form.tsx` preview uses 10%
- Check: `prisma/seed.ts` uses 10% for example gigs
- Check: Tests assert 10% service fee
- Document: Service fee consistency across codebase

#### Scenario: No 20% service fee references remain

**Given** service fee was changed from 20% to 10% in change #24
**When** the audit searches for 20% references
**Then** no active code SHALL reference 20% service fee
**And** no tests SHALL assert 20% service fee
**And** no comments SHALL mention 20% as current value

**Acceptance Criteria**:
- Search: `grep -r "0.2" app/ lib/ __tests__/ --include="*.ts" --include="*.tsx"`
- Search: `grep -r "20%" app/ lib/ __tests__/ --include="*.ts" --include="*.tsx"`
- Verify: Only 10% (0.1) references exist in active code
- Document: Any remaining 20% references

---

### Requirement: Structured Requirements Fields Validation

The platform SHALL validate that structured requirement fields (goal, deliverables, constraints) are correctly implemented.

#### Scenario: Structured fields exist in Gig model

**Given** the documentation claims structured requirement fields were added in change #18
**When** the audit reviews the Gig model
**Then** `goal`, `deliverables`, and `constraints` fields SHALL exist
**And** fields SHALL have `@default("")` (optional)
**And** fields SHALL be String type

**Acceptance Criteria**:
- Check: `prisma/schema.prisma` has goal, deliverables, constraints fields
- Check: Fields are optional with empty string defaults
- Document: Structured fields implementation status

#### Scenario: Structured fields are displayed on gig detail page

**Given** structured requirement fields exist
**When** the audit reviews gig detail page
**Then** fields SHALL be displayed when populated
**And** fields SHALL be hidden when empty
**And** display SHALL be prominent for specialist visibility

**Acceptance Criteria**:
- Check: `app/dashboard/gigs/[id]/page.tsx` conditionally renders structured fields
- Check: UI shows "Additional Requirements" section
- Document: Structured fields display implementation

---

## MODIFIED Requirements

None - this is a validation/audit change, not a feature modification.

## REMOVED Requirements

None - this is a validation/audit change, not a feature removal.
