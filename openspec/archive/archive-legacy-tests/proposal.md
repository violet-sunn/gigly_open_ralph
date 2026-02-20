# Change Proposal: Archive Legacy Tests

## Change ID
`archive-legacy-tests`

## Status
Proposed

## Problem Statement

The project currently has 26 legacy test scripts (`scripts/test-*.ts`) that were created before proper test infrastructure existed. These scripts:

1. **Use a custom test runner** with `pass()` and `fail()` functions instead of standard testing frameworks
2. **Can be confused with real tests** in `__tests__/` directory, leading to:
   - Developers running the wrong tests
   - Uncertainty about which tests are authoritative
   - Maintenance burden on outdated test patterns
3. **Serve as build verification scripts** rather than proper unit/integration tests
4. **Have historical value** but should not be the primary testing approach going forward

Now that the project has comprehensive Vitest and Playwright infrastructure (as of change #21), these legacy scripts are obsolete for testing purposes but valuable for historical reference.

## Proposed Solution

Archive all legacy test scripts to a dedicated subdirectory with clear documentation:

1. **Create `scripts/legacy-tests/` directory** to house archived scripts
2. **Move all `scripts/test-*.ts` files** to `scripts/legacy-tests/`
   - **Pattern:** `scripts/test-*.ts`
   - **Example files:** `test-auth-flow.ts`, `test-gig-creation.ts`, `test-gig-lifecycle.ts`, `test-messaging-iteration-2.ts`, etc.
   - **Total count:** 26 files
3. **Create `scripts/legacy-tests/README.md`** explaining:
   - These are legacy build verification scripts, not real tests
   - Real tests are in `__tests__/` using Vitest
   - Scripts preserved for historical reference only
   - Not maintained or run in CI
   - **Explicit disclaimer:** "Do NOT add new tests here. All new tests MUST be written in Vitest under `__tests__/`"
4. **Preserve all scripts** without modification (no deletion)
5. **Update `TESTING.md`** to document the archive location

## Goals

- **Eliminate confusion** between legacy scripts and real tests
- **Establish clear testing conventions** (Vitest in `__tests__/`, not custom runners in `scripts/`)
- **Preserve historical context** for future reference
- **Clean up project structure** without losing work

## Non-Goals

- Deleting legacy scripts (preserve for history)
- Converting legacy scripts to Vitest (not worth the effort)
- Running legacy scripts in CI (use real tests instead)
- Documenting how to run legacy scripts (they're archived)
- Changing any npm scripts; CI test commands continue to use Vitest/Playwright only

## Constraints

- **MUST NOT delete any files** (historical preservation)
- **MUST NOT modify script contents** (preserve as-is)
- **MUST verify real tests still work** after restructuring

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking references to legacy scripts | Low risk: scripts are standalone, not imported by other code |
| Losing historical context | README.md documents purpose and context |
| Confusion about which tests to run | README.md clearly states these are archived, not active tests |

## Success Criteria

1. All 26 `scripts/test-*.ts` files moved to `scripts/legacy-tests/`
2. `scripts/legacy-tests/README.md` exists with clear explanation and explicit disclaimer
3. No `scripts/test-*.ts` files remain in root `scripts/` directory
4. **`npm run test:unit` passes** with exit code 0
5. **`npm run test:e2e` (if present) is unaffected** by the move
6. No broken imports or references to moved files in active codebase
7. `TESTING.md` updated to mention legacy scripts archive

## Estimated Effort

**Low complexity** - Simple file reorganization with documentation.

- Implementation: 15 minutes
- Testing: 5 minutes
- Total: ~20 minutes
