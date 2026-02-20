# Implementation Tasks

## Task 1: Create legacy-tests directory and README

**Implementation:**
1. Create `scripts/legacy-tests/` directory
2. Create `scripts/legacy-tests/README.md` with:
   - Title: "Legacy Test Scripts (Archived)"
   - Explanation: These are legacy build verification scripts created before proper test infrastructure existed
   - Custom test runner: Uses `pass()` and `fail()` functions, not standard testing frameworks
   - Status: Archived, not maintained, not run in CI
   - Purpose: Preserved for historical reference only
   - **Explicit disclaimer:** "Do NOT add new tests here. All new tests MUST be written in Vitest under `__tests__/` (or Playwright for E2E)."
   - Current testing: Direct developers to `__tests__/` directory using Vitest
   - Real test commands: `npm test`, `npm run test:unit`, `npm run test:e2e`
   - File list: Pattern `test-*.ts`, 26 files total (examples: `test-auth-flow.ts`, `test-gig-creation.ts`, `test-gig-lifecycle.ts`)

**Test Plan:**
- Verify `scripts/legacy-tests/` directory exists
- Verify `scripts/legacy-tests/README.md` exists and is readable
- Verify README contains all required sections
- Verify README is clear and under 300 words
- Command: `cat scripts/legacy-tests/README.md` and manually review

**Acceptance Criteria:**
- Directory created: `scripts/legacy-tests/`
- README exists with clear explanation
- README mentions custom test runner, Vitest, and historical status
- README directs to `__tests__/` for real tests
- **README includes explicit disclaimer: "Do NOT add new tests here"**
- README lists file pattern and examples

---

## Task 2: Move all legacy test scripts

**Implementation:**
1. Identify all files matching `scripts/test-*.ts` pattern (26 files total)
2. Move each file to `scripts/legacy-tests/` using `git mv` to preserve history
3. Verify all 26 files are moved

**Files to move (pattern: `scripts/test-*.ts`):**
- Examples: `test-auth-flow.ts`, `test-gig-creation.ts`, `test-gig-applications.ts`, `test-application-management.ts`, `test-submit-work.ts`, `test-approve-work.ts`, `test-gig-lifecycle.ts`, `test-mark-as-paid.ts`, `test-gig-filters.ts`, `test-suspended-login.ts`, `test-admin-registration.ts`, `test-moderation-actions.ts`, `test-closed-gig-application.ts`, `test-messaging-iteration-2.ts`, `test-message-model.ts`, `test-send-message.ts`, `test-messaging-statuses.ts`, `test-acceptance-criteria.ts`, `test-validation.ts`, `test-e2e.ts`, `test-structured-fields.ts`, `test-structured-application-fields.ts`, `test-application-validation.ts`, `test-examples.ts`, `test-character-counter.ts`, `test-acceptance-criteria-quality-guidance.ts`
- Total: 26 files

**Test Plan:**
- Count files before move: `ls scripts/test-*.ts | wc -l` (expect 26)
- Move files: `git mv scripts/test-*.ts scripts/legacy-tests/`
- Count files after move: `ls scripts/legacy-tests/test-*.ts | wc -l` (expect 26)
- Verify no files remain: `ls scripts/test-*.ts` (expect "No such file or directory")
- Verify git tracks as rename: `git status` (should show renames, not deletions + additions)

**Acceptance Criteria:**
- All 26 `test-*.ts` files moved to `scripts/legacy-tests/`
- No `test-*.ts` files remain in root `scripts/` directory
- Git history preserved (files moved, not deleted and recreated)
- File contents unchanged (byte-for-byte identical)

---

## Task 3: Verify real tests still work

**Implementation:**
1. Run full test suite to ensure no broken imports or references
2. Verify all tests in `__tests__/` pass
3. Verify no errors related to missing files in `scripts/`
4. Verify E2E tests are unaffected (if present)

**Test Plan:**
- **Run unit tests:** `npm run test:unit` (expect exit code 0)
- **Run E2E tests (if present):** `npm run test:e2e` (expect exit code 0 or command not found if not configured)
- Verify no import errors or "Cannot find module" errors
- Verify test output shows only Vitest tests from `__tests__/`
- Check for any references to `scripts/test-*.ts` in codebase: `grep -r "scripts/test-" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=scripts/legacy-tests`

**Acceptance Criteria:**
- **`npm run test:unit` passes** with exit code 0
- **`npm run test:e2e` is unaffected** (passes if configured, or command not found if not)
- All tests pass
- No import errors
- No references to legacy scripts in active codebase (excluding archived directory)

---

## Task 4: Update TESTING.md documentation

**Implementation:**
1. Open `TESTING.md`
2. Add a brief note in the "Overview" or near the beginning:
   - **"Legacy custom-runner scripts have been archived to `scripts/legacy-tests/`"**
   - **"All supported and maintained tests live under `__tests__/`"**
   - State they are not run in CI and are for historical reference only
   - Direct developers to use Vitest in `__tests__/` for all new testing

**Test Plan:**
- Verify `TESTING.md` contains note about legacy scripts archive
- Verify note is clear and concise (2-3 sentences)
- Verify note directs to `__tests__/` for real tests
- Verify note mentions CI only runs Vitest/Playwright
- Read documentation end-to-end to ensure it flows well

**Acceptance Criteria:**
- `TESTING.md` updated with legacy scripts note
- Note explicitly states: "Legacy scripts archived to `scripts/legacy-tests/`"
- Note explicitly states: "All supported tests in `__tests__/`"
- Note mentions CI uses Vitest/Playwright only
- Note placed in appropriate section (near beginning or in overview)
- Documentation remains coherent and well-structured

---

## Task 5: Commit changes with descriptive message

**Implementation:**
1. Stage all changes: moved files, new README, updated TESTING.md
2. Commit with message explaining the archival
3. Verify commit includes all expected changes

**Test Plan:**
- Run `git status` to verify all changes staged
- Run `git diff --cached` to review changes
- Verify commit message is descriptive
- Verify commit includes:
  - 26 file renames (scripts/test-*.ts → scripts/legacy-tests/test-*.ts)
  - New file: scripts/legacy-tests/README.md
  - Modified file: TESTING.md

**Acceptance Criteria:**
- All changes committed in single atomic commit
- Commit message clearly describes archival purpose
- Git history shows file renames (not deletions + additions)
- No untracked or unstaged changes remain

---

## Summary

**Total Tasks:** 5
**Estimated Time:** 20 minutes
**Risk Level:** Low (simple file reorganization)

**Dependencies:**
- None (standalone refactoring)

**Rollback Plan:**
- If issues arise, revert commit: `git revert HEAD`
- Files can be moved back with: `git mv scripts/legacy-tests/test-*.ts scripts/`
