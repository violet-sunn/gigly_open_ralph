# Testing Spec Delta — fix-failing-tests-alignment

## ADDED Requirements

### Requirement: Green Test Suite Baseline
The repository MUST maintain a green (passing) test suite for the current, intended application behavior.

#### Scenario: Unit/integration tests pass
- GIVEN a clean working tree
- WHEN a developer runs `npm run test:unit`
- THEN the command MUST exit with status code 0
- AND it MUST report zero failing tests

#### Scenario: E2E tests pass
- GIVEN the Next.js app can be started for Playwright tests per `playwright.config.ts`
- WHEN a developer runs `npm run test:e2e`
- THEN the command MUST exit with status code 0
- AND it MUST report zero failing tests

**Acceptance Criteria:**
- `npm run test:unit` exits 0 on the repository default branch after this change is implemented.
- `npm run test:e2e` exits 0 on the repository default branch after this change is implemented.

---

### Requirement: Test Expectations MUST Match Canonical Routes
Automated tests MUST assert navigation and route behavior using the canonical, product-approved routes documented in OpenSpec.

#### Scenario: Tests do not reference deprecated routes
- GIVEN the OpenSpec defines canonical gig routes under `/gigs/...` (or other approved routing)
- WHEN the test suite is executed
- THEN tests MUST NOT hardcode deprecated routes that are not supported by the application

**Acceptance Criteria:**
- For any route that changed (example: `/dashboard/gigs/*` to `/gigs/*`), all affected tests are updated to assert the canonical route.
- If both routes are intentionally supported, tests MUST include coverage for both and OpenSpec MUST explicitly document both.

---

## MODIFIED Requirements

(If OpenSpec routing or UI contracts are updated as part of this change, the corresponding deltas MUST be recorded under the appropriate domain spec file(s), e.g. `openspec/changes/.../specs/ui/spec.md`.)

## REMOVED Requirements

None.
