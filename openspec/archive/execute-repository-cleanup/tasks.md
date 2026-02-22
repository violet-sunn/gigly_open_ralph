# Implementation Tasks: Execute Repository Cleanup

## Task 1: Clean Root Directory
**Status:** Pending

**Implementation Notes:**
- Delete exactly 3 files from the project root
- Use explicit file paths to prevent accidental deletions
- Verify files exist before attempting deletion
- DO NOT touch `prisma/dev.db` or any files in subdirectories

**Commands:**
```bash
# Verify files exist before deletion
ls -la dev.db test.db tsconfig.tsbuildinfo 2>/dev/null

# Delete root database files and build cache
rm -f dev.db test.db tsconfig.tsbuildinfo

# Verify deletion
ls -la | grep -E "(dev\.db|test\.db|tsconfig\.tsbuildinfo)" || echo "✓ Root directory clean"
```

**Test Plan:**
- Run `ls -la` in project root
- Verify `dev.db` is NOT present
- Verify `test.db` is NOT present
- Verify `tsconfig.tsbuildinfo` is NOT present
- Verify `prisma/dev.db` still exists: `ls -la prisma/dev.db`
- Verify test databases still exist: `ls -la __tests__/.tmp/*.db 2>/dev/null | wc -l`

**Acceptance Criteria:**
- Root directory contains no `.db` files
- Root directory contains no `.tsbuildinfo` files
- `prisma/dev.db` remains untouched
- Test databases in `__tests__/.tmp/` remain untouched

---

## Task 2: Update .gitignore
**Status:** Pending

**Implementation Notes:**
- Add patterns to prevent future commits of deleted file types
- Use `/*.db` pattern to match only root directory (not subdirectories)
- Ensure patterns don't conflict with existing gitignore rules
- Add comments for clarity

**Commands:**
```bash
# Check if patterns already exist
grep -E "(^/\*\.db|^tsconfig\.tsbuildinfo)" .gitignore

# If not present, add them
cat >> .gitignore << 'EOF'

# Database files in root (added by cleanup)
/*.db
/*.sqlite

# TypeScript build cache (added by cleanup)
tsconfig.tsbuildinfo
EOF

# Verify patterns were added
tail -10 .gitignore
```

**Test Plan:**
- Read `.gitignore` file
- Verify pattern `/*.db` exists
- Verify pattern `/*.sqlite` exists
- Verify pattern `tsconfig.tsbuildinfo` exists
- Create test file: `touch test-ignore.db`
- Run `git status` and verify `test-ignore.db` is NOT shown as untracked
- Clean up: `rm test-ignore.db`

**Acceptance Criteria:**
- `.gitignore` contains `/*.db` pattern
- `.gitignore` contains `/*.sqlite` pattern
- `.gitignore` contains `tsconfig.tsbuildinfo` pattern
- Git ignores new `.db` files created in root
- Git does NOT ignore `prisma/*.db` files

---

## Task 3: Delete Legacy Validation Scripts
**Status:** Pending

**Implementation Notes:**
- Delete exactly 26 files from `scripts/` directory
- Use pattern matching to ensure all legacy scripts are removed
- Preserve `scripts/legacy-tests/` directory (already archived)
- List files before deletion for verification

**Commands:**
```bash
# List files to be deleted (verification)
echo "=== Files to be deleted ==="
ls -1 scripts/validate-*.ts 2>/dev/null
ls -1 scripts/verify-*.ts 2>/dev/null
ls -1 scripts/final-verification*.ts 2>/dev/null
ls -1 scripts/seed-*-test-data.ts 2>/dev/null
ls -1 scripts/seed-messages.ts 2>/dev/null
ls -1 scripts/comprehensive-test.ts 2>/dev/null

# Count files to be deleted
echo "=== Total files to delete ==="
(ls -1 scripts/validate-*.ts scripts/verify-*.ts scripts/final-verification*.ts scripts/seed-*-test-data.ts scripts/seed-messages.ts scripts/comprehensive-test.ts 2>/dev/null | wc -l)

# Delete legacy scripts
rm -f scripts/validate-*.ts
rm -f scripts/verify-*.ts
rm -f scripts/final-verification*.ts
rm -f scripts/seed-*-test-data.ts
rm -f scripts/seed-messages.ts
rm -f scripts/comprehensive-test.ts

# Verify deletion
echo "=== Remaining files in scripts/ ==="
ls -la scripts/
```

**Test Plan:**
- List files in `scripts/` directory before deletion
- Count files matching deletion patterns (should be 26)
- Execute deletion commands
- List files in `scripts/` directory after deletion
- Verify no files matching `validate-*.ts` remain
- Verify no files matching `verify-*.ts` remain
- Verify no files matching `final-verification*.ts` remain
- Verify no files matching `seed-*-test-data.ts` remain
- Verify `scripts/legacy-tests/` directory still exists
- Verify `scripts/legacy-tests/README.md` still exists

**Acceptance Criteria:**
- Exactly 26 files deleted from `scripts/` directory
- No files matching `validate-*.ts` remain in `scripts/`
- No files matching `verify-*.ts` remain in `scripts/`
- No files matching `final-verification*.ts` remain in `scripts/`
- No files matching `seed-*-test-data.ts` remain in `scripts/`
- `scripts/comprehensive-test.ts` deleted
- `scripts/seed-messages.ts` deleted
- `scripts/legacy-tests/` directory preserved
- All files in `scripts/legacy-tests/` preserved

---

## Task 4: Verify Application Integrity
**Status:** Pending

**Implementation Notes:**
- Verify the application builds successfully after cleanup
- Verify all tests pass after cleanup
- Verify no missing file errors occur
- This is a critical safety check before committing changes

**Commands:**
```bash
# Verify build succeeds
npm run build

# Verify all tests pass
npm run test:unit

# Verify development database is accessible
ls -la prisma/dev.db

# Verify test infrastructure is intact
ls -la __tests__/helpers/
ls -la __tests__/integration/ | head -10
```

**Test Plan:**
- Run `npm run build`
- Verify build completes without errors
- Verify no "Cannot find module" errors
- Verify no "ENOENT: no such file or directory" errors
- Run `npm run test:unit`
- Verify all 521 tests pass
- Verify test duration is similar to previous runs (~30 seconds)
- Verify no test failures related to missing files

**Acceptance Criteria:**
- `npm run build` exits with code 0 (success)
- Build output shows no errors
- `npm run test:unit` shows 521/521 tests passing
- No tests fail due to missing files
- Test infrastructure remains functional
- Development database remains accessible

---

## Task 5: Verify Cleanup Completeness
**Status:** Pending

**Implementation Notes:**
- Final verification that all cleanup objectives were met
- Count deleted files to match expected total (29 files)
- Verify no unintended deletions occurred
- Document cleanup results

**Commands:**
```bash
# Verify root directory is clean
echo "=== Root directory check ==="
ls -la | grep -E "\.(db|tsbuildinfo)$" && echo "❌ Found unexpected files" || echo "✓ Root clean"

# Verify scripts directory is clean
echo "=== Scripts directory check ==="
ls -1 scripts/ | grep -E "(validate-|verify-|final-verification|seed-.*-test-data|seed-messages|comprehensive-test)" && echo "❌ Found legacy scripts" || echo "✓ Scripts clean"

# Verify critical directories untouched
echo "=== Critical directories check ==="
test -d app && echo "✓ app/ exists"
test -d components && echo "✓ components/ exists"
test -d lib && echo "✓ lib/ exists"
test -d prisma && echo "✓ prisma/ exists"
test -d __tests__ && echo "✓ __tests__/ exists"
test -f prisma/dev.db && echo "✓ prisma/dev.db exists"
test -f prisma/seed.ts && echo "✓ prisma/seed.ts exists"

# Verify gitignore updated
echo "=== Gitignore check ==="
grep -q "/\*\.db" .gitignore && echo "✓ /*.db pattern exists"
grep -q "tsconfig\.tsbuildinfo" .gitignore && echo "✓ tsbuildinfo pattern exists"
```

**Test Plan:**
- Run all verification commands
- Verify all checks pass with ✓ symbols
- Verify no ❌ symbols appear
- Document any unexpected findings
- Confirm total of 29 files deleted (3 root + 26 scripts)

**Acceptance Criteria:**
- Root directory contains no `.db` or `.tsbuildinfo` files
- Scripts directory contains no legacy validation scripts
- All critical directories remain intact
- `prisma/dev.db` and `prisma/seed.ts` remain untouched
- `.gitignore` contains all required patterns
- Application builds successfully
- All 521 tests pass
- No unintended deletions occurred

---

## Verification Checklist

After completing all tasks, verify:
- [ ] Root directory is free of `.db` and `.tsbuildinfo` files
- [ ] 26 legacy scripts deleted from `scripts/` directory
- [ ] `.gitignore` updated with protection patterns
- [ ] `npm run build` succeeds
- [ ] All 521 tests pass
- [ ] `prisma/dev.db` remains untouched
- [ ] `prisma/seed.ts` remains untouched
- [ ] `scripts/legacy-tests/` directory preserved
- [ ] No files in `app/`, `components/`, `lib/`, `__tests__/` were modified
- [ ] Total of 29 files deleted (3 root + 26 scripts)
- [ ] Approximately 200KB disk space reclaimed

---

## Rollback Plan (If Needed)

If any issues occur during cleanup:

```bash
# Restore from git (if changes were committed)
git checkout HEAD -- dev.db test.db tsconfig.tsbuildinfo
git checkout HEAD -- scripts/

# Or restore from git history (if already committed and pushed)
git revert <commit-hash>
```

**Note:** All deleted files are preserved in git history and can be recovered if needed.
