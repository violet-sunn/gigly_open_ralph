# Proposal: Comprehensive Gig Creation Tests

## Problem Statement

The gig creation functionality is a critical entry point to the Gigly platform. While basic authorization tests exist, there is no comprehensive test coverage for:

1. **Field validation** - Required fields, minimum/maximum lengths, data types
2. **Business logic** - Service fee calculation (20%), budget conversion (roubles to kopecks), total amount computation
3. **Structured requirements** - Optional fields (goal, deliverables, constraints) that help clients articulate clear requirements
4. **Edge cases** - Empty strings, whitespace-only input, boundary values, invalid data types
5. **Data persistence** - Correct storage of all fields including tags and structured requirements

Current test coverage focuses on authorization (CLIENT vs SPECIALIST roles) but does not validate the core business rules and data integrity requirements that ensure gigs are created correctly.

## Proposed Solution

Create a comprehensive integration test suite (`__tests__/integration/gig-creation.test.ts`) that validates all aspects of gig creation:

- **Required field validation** - Title, description, acceptance criteria, budget
- **Acceptance criteria quality** - Minimum 50 characters to ensure meaningful success criteria
- **Budget validation** - Positive numbers only, correct conversion to kopecks, service fee calculation
- **Structured requirements** - Optional goal, deliverables, constraints fields
- **Tags storage** - Comma-separated tags stored correctly
- **Default values** - Status defaults to OPEN, timestamps set correctly
- **Role enforcement** - Only CLIENT can create gigs (already tested, but included for completeness)
- **Edge cases** - Whitespace handling, boundary values, invalid inputs

## Critical Findings During Spec Creation

### Service Fee Inconsistency (20% vs 10%)
**Issue:** The actual implementation in `app/actions/gig.ts` (line 44) uses **20%** service fee (`budgetKopecks * 0.20`), which contradicts:
- `project.md` documentation: "Service fee is currently set to 10%"
- `lib/utils/currency.ts`: `calculateServiceFee()` defaults to 10%

**Impact:** This test suite validates the ACTUAL implementation (20%), not the documented standard (10%). This inconsistency should be resolved in a separate change.

**Recommendation:** Either update the implementation to use 10%, or update all documentation to reflect 20%.

### Tags Normalization Gap
**Issue:** The current implementation only trims outer whitespace from the entire tags string, but does NOT normalize individual tags. Input like `"React,  TypeScript , Node.js"` is stored as-is with inner whitespace preserved.

**Impact:** This may cause issues with tag filtering and matching. Tests document this current behavior.

**Recommendation:** Consider adding individual tag normalization (trim each tag after splitting by comma) in a future change.

## Constraints

- Tests MUST use the existing test infrastructure (Vitest, test database helpers, auth helpers)
- Tests MUST follow patterns established in TESTING.md
- Tests MUST use `withTestTransaction` for database isolation
- Tests MUST use `withAuthContext` for authenticated operations
- Tests MUST clean up test data (handled automatically by transactions)
- Tests MUST be deterministic and independent
- Tests MUST validate the ACTUAL implementation behavior (20% service fee), not the documented standard

## Success Criteria

1. All gig creation validation rules are covered by tests
2. All tests pass consistently
3. Tests follow established patterns from TESTING.md
4. Edge cases and boundary conditions are tested
5. Test coverage includes both happy path and error scenarios
6. Tests validate data persistence (fields stored correctly in database)
