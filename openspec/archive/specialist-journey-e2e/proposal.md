# Change Proposal: Specialist Journey E2E Test

## Change ID
`specialist-journey-e2e`

## Problem Statement

The platform currently has comprehensive E2E test coverage for the client journey (registration → gig creation → application review → work approval → payment), but lacks equivalent coverage for the specialist journey. This creates a testing gap for the core specialist workflow: discovering gigs, applying with structured proposals, submitting work, and completing gigs.

Without this test coverage, we cannot confidently validate that:
- Specialists can successfully browse and discover open gigs
- The application form with structured fields (approach, questions, estimatedEffort) works end-to-end
- Work submission flow functions correctly from the specialist's perspective
- The complete specialist experience is smooth and bug-free

## Proposed Solution

Create a comprehensive E2E test (`__tests__/e2e/specialist-journey.spec.ts`) that validates the complete specialist journey from authentication through gig completion. The test will use Playwright to simulate real user interactions from the specialist's perspective.

### Test Structure

The test will follow a hybrid approach (mirroring the existing `client-journey.spec.ts` pattern):
- **Specialist actions**: Via Playwright UI interactions (focus of the test)
- **Client actions**: Programmatic (setup/teardown to support specialist workflow)

### Test Flow

1. **Setup**: Create CLIENT user and OPEN gig programmatically
2. **Specialist Authentication**: Create SPECIALIST user, set session cookie
3. **Browse Gigs**: Navigate to `/dashboard/gigs`, verify gig listing
4. **View Gig Detail**: Click on gig, navigate to detail page
5. **Apply to Gig**: Fill application form (approach, questions, estimatedEffort) via UI
6. **Application Accepted**: Accept application programmatically (client action)
7. **Submit Work**: Navigate to gig detail, fill work submission form via UI
8. **Work Approved**: Approve work programmatically (client action)
9. **Verify Completion**: Verify gig status is COMPLETED, application is ACCEPTED

### Handling Async Operations

Following the pattern from `client-journey.spec.ts`:
- Use `page.waitForLoadState('networkidle')` after form submissions
- Poll database with timeout loop (10 iterations × 500ms) to verify state changes
- Use `page.waitForTimeout()` for brief pauses when needed
- Verify state changes via direct database queries

### Verification Strategy

Each step will be verified through:
- **UI verification**: Check URL, visible elements, form fields
- **Database verification**: Query database to confirm state changes
- **Console logging**: Log progress for debugging
- **Assertions**: Explicit expect() statements for all critical state

## Constraints

- Must use test database (not dev.db)
- Must clean up test data in afterEach hook
- Must use realistic Russian data (names, company names, gig content)
- Must be idempotent (can run multiple times without conflicts)
- Must complete in under 30 seconds
- Must follow existing E2E test patterns (Playwright, hybrid approach)

## Non-Goals

- Testing admin moderation flows
- Testing messaging between client and specialist (separate test)
- Testing payment gateway integration (MVP uses logical status only)
- Testing edge cases or error scenarios (focus on happy path)

## Success Criteria

- E2E test file exists at `__tests__/e2e/specialist-journey.spec.ts`
- Test passes consistently (10 consecutive runs)
- Test covers all 8 steps of specialist journey
- Test completes in < 30 seconds
- Test uses realistic Russian data
- Test follows AAA pattern (Arrange-Act-Assert)
- Test is documented with clear comments
- Run `npm run test:e2e -- specialist-journey.spec.ts` exits with code 0

## Implementation Notes

- Reuse existing test helpers: `createTestUser`, `createTestGig`, `createTestApplication`, `createTestSession`
- Follow the structure of `client-journey.spec.ts` for consistency
- Use programmatic database updates for client actions (accept, approve) to avoid Next.js context issues in E2E tests
- Include detailed console logging for debugging
- Use unique email addresses (timestamp-based) to avoid conflicts
