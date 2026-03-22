# Change Proposal: auth-e2e-tests

## Problem Statement

The new authentication flow (landing page at `/auth` with role selection, redesigned login/register pages matching Figma design) lacks comprehensive E2E test coverage. While basic navigation tests exist, there is no systematic validation of:

1. **Complete user journeys** through the auth flow (from `/auth` through role selection to successful authentication)
2. **Visual fidelity** to the Figma design specifications (role card selection states, button styling, decorative patterns)
3. **Responsive behavior** across different viewport sizes (mobile card stacking, container width adaptation)
4. **Accessibility compliance** (keyboard navigation, screen reader support, focus management)
5. **Error handling** (invalid credentials, validation errors, rate limiting feedback)
6. **Backward compatibility** (direct access to `/login` and `/register` URLs)

Without comprehensive E2E tests, regressions in the auth flow could go undetected, impacting the critical user onboarding experience.

## Proposed Solution

Create a comprehensive E2E test suite using Playwright that validates all aspects of the new authentication flow against the Figma design (node-id=4100-385). The test suite will cover:

- **Happy path flows**: Complete journeys from `/auth` → role selection → login/register → dashboard
- **Visual regression**: Screenshot comparison with Figma design to ensure pixel-perfect implementation
- **Responsive design**: Tests across mobile (< 768px) and desktop viewports
- **Accessibility**: Keyboard navigation, ARIA attributes, focus states, screen reader announcements
- **Error states**: Invalid credentials, validation errors, rate limiting messages
- **Backward compatibility**: Direct URL access to `/login` and `/register`

## Constraints

- **MUST** use existing Playwright E2E testing infrastructure (no new frameworks)
- **MUST** use test database isolation (no impact on development data)
- **MUST** follow existing test patterns in `__tests__/e2e/` directory
- **MUST** complete in reasonable time (< 2 minutes total for all tests)
- **MUST** be idempotent (can run multiple times without side effects)
- **SHOULD** use visual regression testing with < 5% pixel difference threshold
- **SHOULD** test against actual Figma design screenshots where possible

## Non-Goals

- **NOT** testing authentication logic itself (covered by integration tests)
- **NOT** testing password hashing or JWT signing (unit/integration test scope)
- **NOT** testing middleware route protection (integration test scope)
- **NOT** creating new UI components or modifying existing auth pages
- **NOT** testing performance or load characteristics

## Success Criteria

1. All 10 test scenarios from requirements are implemented and passing
2. Visual regression tests show < 5% pixel difference from Figma design
3. Tests cover happy path and error cases for both CLIENT and SPECIALIST roles
4. Tests run successfully in CI environment
5. Test execution completes in < 2 minutes
6. All tests are idempotent and can run in parallel with other E2E tests
7. Test documentation is clear and maintainable

## Dependencies

- Existing Playwright E2E testing infrastructure (`__tests__/e2e/`, `playwright.config.ts`)
- Existing auth pages: `/auth`, `/login`, `/register`
- Existing test helpers: `createTestUser`, `createTestSession`, `setE2ESession`
- Figma design reference: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385

## Risks

- **Visual regression tests may be flaky** due to font rendering differences across environments
  - Mitigation: Use pixel difference threshold (< 5%) instead of exact match
- **Tests may be slow** if too many visual comparisons are performed
  - Mitigation: Limit visual regression to key screens only (auth landing, login, register)
- **Accessibility tests may require additional Playwright plugins**
  - Mitigation: Use built-in Playwright accessibility features and manual ARIA attribute checks
