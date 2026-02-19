# Change Proposal: Requirements Quality Tests

## Problem Statement

The platform has implemented several requirements quality features to help clients articulate clear requirements:

1. **Required acceptance criteria** (min 50 chars) - from `require-acceptance-criteria` change
2. **Optional structured fields** (goal, deliverables, constraints) - from `requirements-iteration-2` change
3. **Example gigs** (isExample flag, cannot receive applications) - from `add-example-gigs` change

While `gig-creation.test.ts` provides 40 tests covering basic gig creation, there are **critical gaps** in test coverage for requirements quality features:

- No tests for example gig application blocking
- No tests for structured field display on gig detail pages
- No tests for form validation edge cases (whitespace, empty optional fields)
- No tests for example gig UI indicators (badges, informational messages)
- Incomplete coverage of acceptance criteria validation scenarios

**Risk:** Without comprehensive test coverage, regressions in requirements quality features could go undetected, undermining the platform's core value proposition of "Clarity Through Structure."

## Proposed Solution

Create a comprehensive test suite specifically for requirements quality features, organized into three test files:

### 1. **Example Gig Tests** (`__tests__/integration/example-gigs.test.ts`)
- Test isExample flag is set correctly
- Test specialists cannot apply to example gigs (server action validation)
- Test example gig UI indicators (badges on browse and detail pages)
- Test example gigs remain in OPEN status
- Test example gigs display all structured fields

### 2. **Structured Fields Tests** (`__tests__/integration/structured-fields.test.ts`)
- Test goal, deliverables, constraints are saved correctly
- Test optional fields accept empty values
- Test whitespace trimming for optional fields
- Test structured fields display on gig detail page
- Test backward compatibility (gigs without structured fields)

### 3. **Acceptance Criteria Tests** (extend `gig-creation.test.ts`)
- Test acceptance criteria minimum length validation (50 chars)
- Test whitespace-only acceptance criteria is rejected
- Test acceptance criteria trimming behavior
- Test acceptance criteria display on gig detail page

## Scope

### In Scope
- Integration tests for server actions (`applyToGig`, `createGig`)
- Database validation tests (isExample flag, structured fields storage)
- UI component tests (example badges, structured field display)
- Form validation tests (acceptance criteria, optional fields)
- Edge case tests (whitespace, empty values, boundary conditions)

### Out of Scope
- E2E tests (Playwright) - focus on integration tests for speed
- Performance tests - not critical for MVP
- Visual regression tests - no tooling in place
- Tests for features not yet implemented (gig editing, AI-assisted requirements)

## Constraints

- Tests MUST use existing test infrastructure (`withTestTransaction`, `withAuthContext`, factory functions)
- Tests MUST follow patterns established in `gig-creation.test.ts` and `TESTING.md`
- Tests MUST use Russian test data (via `generateRussian*` helpers)
- Tests MUST clean up data properly (no test pollution)
- Tests MUST run in parallel without conflicts (per-worker isolation)

## Non-Goals

- This is NOT a refactoring of existing tests
- This is NOT adding new features (only testing existing features)
- This is NOT replacing `gig-creation.test.ts` (complementing it)

## Success Metrics

### Coverage Targets
- **Example gig features:** 100% scenario coverage (all scenarios from `add-example-gigs/specs/`)
- **Structured fields:** 100% scenario coverage (all scenarios from `requirements-iteration-2/specs/`)
- **Acceptance criteria:** 100% scenario coverage (all scenarios from `require-acceptance-criteria/specs/`)

### Test Quality Metrics
- All tests pass on first run
- No flaky tests (run 10 times, all pass)
- Test execution time < 5 seconds per file
- Clear, descriptive test names following "should/must" pattern

### Documentation
- Each test file includes header comment explaining what it tests
- Complex test scenarios include inline comments
- Test coverage gaps documented in proposal

## Test Structure

### File Organization
```
__tests__/
  integration/
    example-gigs.test.ts          # NEW: 15-20 tests
    structured-fields.test.ts     # NEW: 12-15 tests
    gig-creation.test.ts          # EXTEND: +5 tests for acceptance criteria
```

### Test Naming Convention
```typescript
describe('Example Gigs', () => {
  describe('Application blocking', () => {
    it('rejects application to example gig with clear error message', async () => {
      // Test implementation
    })
  })
})
```

## Acceptance Criteria

1. **Example Gig Tests** (`example-gigs.test.ts`)
   - ✅ Test file created with 15-20 tests
   - ✅ All scenarios from `add-example-gigs/specs/gig/spec.md` covered
   - ✅ All scenarios from `add-example-gigs/specs/ui/spec.md` covered
   - ✅ Tests verify `applyToGig` rejects example gigs
   - ✅ Tests verify error message matches spec
   - ✅ Tests verify no Application record created on rejection

2. **Structured Fields Tests** (`structured-fields.test.ts`)
   - ✅ Test file created with 12-15 tests
   - ✅ All scenarios from `requirements-iteration-2/specs/gig/spec.md` covered
   - ✅ Tests verify goal, deliverables, constraints are saved
   - ✅ Tests verify optional fields accept empty values
   - ✅ Tests verify whitespace trimming
   - ✅ Tests verify backward compatibility

3. **Acceptance Criteria Tests** (extend `gig-creation.test.ts`)
   - ✅ 5 new tests added to existing file
   - ✅ All scenarios from `require-acceptance-criteria/specs/gig/spec.md` covered
   - ✅ Tests verify 50-character minimum
   - ✅ Tests verify whitespace-only rejection
   - ✅ Tests verify trimming behavior

4. **All Tests Pass**
   - ✅ `npm run test:unit` passes with 0 failures
   - ✅ All new tests follow established patterns
   - ✅ No test pollution (proper cleanup)
   - ✅ Tests run in < 15 seconds total

## Dependencies

- Existing test infrastructure (`__tests__/helpers/`)
- Existing factory functions (`createTestUser`, `createTestGig`, `createTestApplication`)
- Existing mocks (`@/lib/prisma`, `next/headers`, `next/navigation`)

## Estimated Effort

**Medium (3-4 hours):**
- Example gig tests: 1.5 hours (15-20 tests)
- Structured fields tests: 1.5 hours (12-15 tests)
- Acceptance criteria tests: 0.5 hours (5 tests)
- Documentation and cleanup: 0.5 hours

## Risks & Mitigations

**Risk:** Tests may duplicate coverage from `gig-creation.test.ts`
**Mitigation:** Review existing tests first, only add tests for uncovered scenarios

**Risk:** Tests may be flaky due to async operations
**Mitigation:** Use `withTestTransaction` for proper isolation, follow established patterns

**Risk:** Test data may not match production data format
**Mitigation:** Use Russian test data generators, validate against actual schema

## Next Steps

After approval:
1. Create `example-gigs.test.ts` with application blocking tests
2. Create `structured-fields.test.ts` with optional field tests
3. Extend `gig-creation.test.ts` with acceptance criteria tests
4. Run full test suite to verify no regressions
5. Document any coverage gaps found during implementation
