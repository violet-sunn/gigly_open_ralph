# Change Proposal: Execute Repository Cleanup

## Change Name
`execute-repository-cleanup`

## Problem Statement

The repository cleanup audit (`cleanup_report_v1.md`) identified 32 items requiring attention, with the most significant being:

1. **Misplaced Database Files:** `dev.db` and `test.db` exist in the project root, creating confusion about the source of truth for the development database. The actual development database is `prisma/dev.db`, and test databases are managed in `__tests__/.tmp/`.

2. **Legacy Validation Scripts:** 26 validation scripts (~150KB) in the `scripts/` directory from previous development iterations. These scripts were used for manual testing before the comprehensive test suite (521 tests) was established. They are now redundant and create maintenance burden.

3. **Build Artifacts:** `tsconfig.tsbuildinfo` is a TypeScript incremental build cache that should be gitignored and regenerated automatically.

These files clutter the workspace, confuse new developers about which files are active, and create unnecessary noise in the repository.

## Proposed Solution

Execute the cleanup actions recommended in the audit report:

1. **Delete Root Database Files:** Remove `dev.db` and `test.db` from project root (NOT from `prisma/` directory)
2. **Delete Build Artifacts:** Remove `tsconfig.tsbuildinfo` (will be regenerated automatically)
3. **Delete Legacy Scripts:** Remove all 26 legacy validation scripts from `scripts/` directory
4. **Update .gitignore:** Ensure patterns prevent these files from returning

**Rationale for Deletion (Not Archiving):**
- Full git history preserves all deleted files if needed
- 521 passing tests provide superior coverage compared to legacy scripts
- Keeping dead code creates maintenance burden
- Clean repository improves developer experience

## Constraints

### Critical Safety Constraints
- **Database Safety:** Delete ONLY `./dev.db` and `./test.db` from project root. DO NOT touch `prisma/dev.db` or `__tests__/.tmp/*.db`
- **Scope Lock:** ONLY delete files explicitly listed in tasks. DO NOT modify `app/`, `lib/`, `components/`, `prisma/`, or `__tests__/` directories
- **Verification Required:** Must verify application builds and tests pass after cleanup

### Files to Delete (Explicit List)

**Root Directory (3 files):**
- `./dev.db`
- `./test.db`
- `./tsconfig.tsbuildinfo`

**Scripts Directory (26 files):**
- All files matching `scripts/validate-*.ts` (11 files)
- All files matching `scripts/verify-*.ts` (3 files)
- All files matching `scripts/final-verification*.ts` (2 files)
- All files matching `scripts/seed-*-test-data.ts` (3 files)
- `scripts/comprehensive-test.ts`
- `scripts/seed-messages.ts`
- Additional validation scripts as identified in audit

**Files to KEEP:**
- `scripts/legacy-tests/` directory (already archived with README)
- `prisma/dev.db` (active development database)
- `prisma/seed.ts` (active seed script)
- All files in `__tests__/.tmp/` (test databases)

## Success Criteria

1. **Root Directory Clean:** No `.db` or `.tsbuildinfo` files in project root
2. **Scripts Directory Clean:** No legacy validation scripts remain
3. **Gitignore Updated:** Patterns prevent future commits of deleted file types
4. **Application Functional:** Build succeeds without errors
5. **Tests Passing:** All 521 tests continue to pass
6. **No Unintended Deletions:** Active application code and test infrastructure untouched

## Non-Goals

- Refactoring or improving existing code
- Cleaning up `scripts/legacy-tests/` directory (already properly archived)
- Modifying database schema or migrations
- Updating dependencies or package versions
- Performance optimizations

## Risk Assessment

**Risk Level:** 🟢 **Low**

All files being deleted are:
- Redundant (superseded by test suite)
- Misplaced (database files in wrong location)
- Regenerable (build artifacts)
- Preserved in git history (can be recovered if needed)

**Mitigation:**
- Explicit file list prevents accidental deletions
- Verification step ensures application still works
- Git history preserves all deleted files
- Test suite validates functionality after cleanup

## Deliverable

A clean repository with:
- 29 fewer files (~200KB disk space reclaimed)
- Clear database file locations
- Updated .gitignore preventing file return
- All 521 tests passing
- Successful build verification
