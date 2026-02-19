# Proposal: Comprehensive Tests for Gig Browsing, Filtering, and Detail View

## Why

The gig browsing, filtering, and detail view features are core to the Gigly marketplace but currently lack comprehensive test coverage. These features were implemented across multiple changes (specialist-gig-browsing, gig-filtering-and-search, client-gig-detail-link) and involve complex interactions between:
- Role-based access control (CLIENT vs SPECIALIST views)
- Dynamic filtering with multiple parameters (text search, tags, budget range)
- Gig lifecycle state transitions (OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID)
- Application management and display

Without thorough tests, regressions in these critical user flows could go undetected. The existing gig-creation.test.ts provides a pattern, but browsing and filtering logic needs dedicated coverage.

## What

Create comprehensive integration test suites covering:

1. **Gig Browsing Tests** (`__tests__/integration/gig-browsing.test.ts`)
   - Role-based gig listing (SPECIALIST sees OPEN gigs, CLIENT sees all their gigs)
   - Empty state handling
   - Gig data display (title, budget, tags, dates)

2. **Gig Filtering Tests** (`__tests__/integration/gig-filtering.test.ts`)
   - Text search (title and description, case-insensitive)
   - Tag filtering (single and multiple tags with OR logic)
   - Budget range filtering (min, max, both)
   - Sorting (newest, highest budget, lowest budget)
   - Combined filters (AND logic between filter types)
   - Invalid parameter handling

3. **Gig Detail View Tests** (`__tests__/integration/gig-detail-view.test.ts`)
   - Information display for all roles
   - Application list visibility (owner only)
   - Apply form visibility (SPECIALIST only, not if already applied)
   - Structured requirement fields display
   - Message display and authorization

4. **Gig Lifecycle Tests** (`__tests__/integration/gig-lifecycle.test.ts`)
   - State transitions: OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID
   - Authorization at each transition
   - Application acceptance flow (auto-reject other applications)
   - Work submission and approval
   - Payment marking

## Constraints

- Tests MUST use existing test helpers (`withAuthContext`, `createTestUser`, `createTestGig`, etc.)
- Tests MUST use transaction rollback pattern for isolation
- Tests MUST follow patterns from `gig-creation.test.ts`
- Tests MUST cover scenarios from archived change specs
- Tests MUST validate both success and error cases
- Tests MUST use Russian data generators for realistic test data

## Success Criteria

- All tests pass: `npm run test:unit` completes successfully
- Coverage includes all scenarios from archived specs:
  - specialist-gig-browsing: 13 scenarios
  - gig-filtering-and-search: 15+ scenarios
  - client-gig-detail-link: basic navigation
  - gig lifecycle: 7 state transitions
- Tests validate authorization, data integrity, and business logic
- Tests serve as living documentation for gig browsing features
- No regressions in existing tests

## Non-Goals

- E2E tests (Playwright) - focus on integration tests only
- Performance/load testing
- Testing UI components directly (server-side logic only)
- Testing features not yet implemented (pagination, saved searches)
