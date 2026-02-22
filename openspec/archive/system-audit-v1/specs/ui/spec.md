# UI Specification Delta - System Audit

## ADDED Requirements

### Requirement: Admin Pagination Implementation Validation

The platform SHALL validate that pagination is correctly implemented on admin pages as documented.

#### Scenario: Admin user management page has pagination

**Given** the documentation claims "Pagination on admin user management page (30 items per page)"
**When** the audit reviews `app/admin/users/page.tsx`
**Then** the page SHALL implement offset-based pagination
**And** page size SHALL be 30 users per page
**And** pagination controls SHALL be rendered
**And** URL parameters SHALL include `?page=N`

**Acceptance Criteria**:
- Check: `app/admin/users/page.tsx` has pagination logic
- Check: `const PAGE_SIZE = 30` or similar constant exists
- Check: Prisma query uses `skip` and `take` for pagination
- Check: PaginationControls component is rendered
- Document: Admin user pagination implementation status

#### Scenario: Admin gig management page has pagination

**Given** the documentation claims "Pagination on admin gig management page (30 items per page)"
**When** the audit reviews `app/admin/gigs/page.tsx`
**Then** the page SHALL implement offset-based pagination
**And** page size SHALL be 30 gigs per page
**And** pagination controls SHALL be rendered
**And** URL parameters SHALL include `?page=N`

**Acceptance Criteria**:
- Check: `app/admin/gigs/page.tsx` has pagination logic
- Check: `const PAGE_SIZE = 30` or similar constant exists
- Check: Prisma query uses `skip` and `take` for pagination
- Check: PaginationControls component is rendered
- Document: Admin gig pagination implementation status

#### Scenario: Admin pagination integrates with filters

**Given** admin pages have filters (role, status, closed)
**When** the audit reviews filter integration
**Then** filters SHALL reset pagination to page 1
**And** pagination SHALL preserve filter parameters in URL
**And** filter changes SHALL not break pagination state

**Acceptance Criteria**:
- Check: Filter changes remove `page` parameter from URL
- Check: Pagination links preserve filter parameters
- Review: URL structure like `/admin/users?role=CLIENT&page=2`
- Document: Admin filter-pagination integration

---

### Requirement: Server Action Revalidation Validation

The platform SHALL validate that Server Actions correctly revalidate paths after mutations to ensure UI consistency.

#### Scenario: User suspension revalidates admin pages

**Given** admin suspends a user via Server Action
**When** the audit reviews `suspendUser` action
**Then** the action SHALL call `revalidatePath('/admin/users')`
**And** the action SHALL call `revalidatePath('/admin')`
**And** the UI SHALL refresh after suspension

**Acceptance Criteria**:
- Check: `app/actions/admin.ts` has `suspendUser` action
- Check: Action calls `revalidatePath()` after mutation
- Check: Paths include both admin dashboard and user management page
- Document: Revalidation implementation for user suspension

#### Scenario: Gig closure revalidates admin pages

**Given** admin closes a gig via Server Action
**When** the audit reviews `closeGig` action
**Then** the action SHALL call `revalidatePath('/admin/gigs')`
**And** the action SHALL call `revalidatePath('/admin')`
**And** the UI SHALL refresh after closure

**Acceptance Criteria**:
- Check: `app/actions/admin.ts` has `closeGig` action
- Check: Action calls `revalidatePath()` after mutation
- Check: Paths include both admin dashboard and gig management page
- Document: Revalidation implementation for gig closure

#### Scenario: Pagination state persists after mutations

**Given** admin is viewing page 2 of users
**When** admin suspends a user
**Then** the page SHALL refresh
**And** pagination state SHALL remain on page 2 (or adjust if page becomes empty)
**And** no UI errors SHALL occur

**Acceptance Criteria**:
- Review: Revalidation behavior with pagination
- Check: URL parameters are preserved after revalidation
- Document: Pagination state handling after mutations

---

### Requirement: PaginationControls Component Validation

The platform SHALL validate that the PaginationControls component is correctly implemented and reused across pages.

#### Scenario: PaginationControls component exists

**Given** pagination is implemented on multiple pages
**When** the audit checks for the component
**Then** a reusable `PaginationControls` component SHALL exist
**And** the component SHALL be a client component (uses hooks)
**And** the component SHALL be wrapped in Suspense boundary

**Acceptance Criteria**:
- Check: Component exists (likely in `app/components/` or similar)
- Check: Component uses `useSearchParams()` and `usePathname()` hooks
- Check: Component is wrapped in `<Suspense>` in parent pages
- Document: PaginationControls component location and implementation

#### Scenario: PaginationControls displays page numbers correctly

**Given** the PaginationControls component is rendered
**When** the audit reviews the component logic
**Then** the component SHALL display Previous/Next buttons
**And** the component SHALL display page numbers with ellipsis logic
**And** the component SHALL display results count ("Showing X-Y of Z")
**And** the component SHALL handle edge cases (first page, last page, single page)

**Acceptance Criteria**:
- Check: Component renders Previous/Next buttons
- Check: Component uses ellipsis for large page counts (current ± 2 pages)
- Check: Component displays results count
- Document: PaginationControls UI implementation

---

## MODIFIED Requirements

None - this is a validation/audit change, not a feature modification.

## REMOVED Requirements

None - this is a validation/audit change, not a feature removal.
