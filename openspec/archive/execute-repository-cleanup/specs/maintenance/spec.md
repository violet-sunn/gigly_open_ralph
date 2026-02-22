# Repository Maintenance Specification

## ADDED Requirements

### Requirement: Root Directory Cleanup
The project root directory MUST be free of misplaced database files and build artifacts.

#### Scenario: Remove misplaced database files from root
**Given** the project root contains `dev.db` and `test.db` files
**When** executing the cleanup
**Then** both `dev.db` and `test.db` MUST be deleted from the project root
**And** `prisma/dev.db` MUST remain untouched
**And** test databases in `__tests__/.tmp/` MUST remain untouched

#### Scenario: Remove TypeScript build cache
**Given** the project root contains `tsconfig.tsbuildinfo`
**When** executing the cleanup
**Then** `tsconfig.tsbuildinfo` MUST be deleted from the project root
**And** the file SHALL be regenerated automatically on next build

#### Scenario: Verify root directory is clean
**Given** the cleanup has been executed
**When** listing files in the project root
**Then** no `.db` files SHALL exist in the root
**And** no `.tsbuildinfo` files SHALL exist in the root
**And** standard project files (package.json, tsconfig.json, etc.) MUST remain

### Requirement: Legacy Scripts Cleanup
The scripts directory MUST be free of redundant validation scripts superseded by the test suite.

#### Scenario: Remove validation scripts
**Given** the `scripts/` directory contains files matching `validate-*.ts`
**When** executing the cleanup
**Then** all files matching `scripts/validate-*.ts` MUST be deleted
**And** the count of deleted validation scripts MUST be 11

#### Scenario: Remove verification scripts
**Given** the `scripts/` directory contains files matching `verify-*.ts`
**When** executing the cleanup
**Then** all files matching `scripts/verify-*.ts` MUST be deleted
**And** the count of deleted verification scripts MUST be 3

#### Scenario: Remove comprehensive test script
**Given** the `scripts/` directory contains `comprehensive-test.ts`
**When** executing the cleanup
**Then** `scripts/comprehensive-test.ts` MUST be deleted

#### Scenario: Remove final verification scripts
**Given** the `scripts/` directory contains files matching `final-verification*.ts`
**When** executing the cleanup
**Then** all files matching `scripts/final-verification*.ts` MUST be deleted
**And** the count of deleted final verification scripts MUST be 2

#### Scenario: Remove legacy seed scripts
**Given** the `scripts/` directory contains files matching `seed-*-test-data.ts` or `seed-messages.ts`
**When** executing the cleanup
**Then** all files matching `seed-*-test-data.ts` MUST be deleted
**And** `scripts/seed-messages.ts` MUST be deleted
**And** `prisma/seed.ts` MUST remain untouched

#### Scenario: Preserve legacy-tests archive
**Given** the `scripts/legacy-tests/` directory exists
**When** executing the cleanup
**Then** the `scripts/legacy-tests/` directory MUST remain untouched
**And** all files within `scripts/legacy-tests/` MUST remain untouched

#### Scenario: Verify scripts directory is clean
**Given** the cleanup has been executed
**When** listing files in the `scripts/` directory
**Then** no files matching `validate-*.ts` SHALL exist
**And** no files matching `verify-*.ts` SHALL exist
**And** no files matching `final-verification*.ts` SHALL exist
**And** no files matching `seed-*-test-data.ts` SHALL exist
**And** `scripts/legacy-tests/` directory MUST still exist

### Requirement: Gitignore Protection
The .gitignore file MUST prevent future commits of deleted file types.

#### Scenario: Prevent root database files
**Given** the `.gitignore` file
**When** checking for database file patterns
**Then** the pattern `/*.db` MUST exist
**And** the pattern `/*.sqlite` MUST exist
**And** these patterns MUST only match files in the root directory
**And** `prisma/*.db` files MUST NOT be ignored

#### Scenario: Prevent TypeScript build cache
**Given** the `.gitignore` file
**When** checking for TypeScript cache patterns
**Then** the pattern `tsconfig.tsbuildinfo` MUST exist

#### Scenario: Verify gitignore effectiveness
**Given** the `.gitignore` has been updated
**When** creating a new `test.db` file in the root
**Then** `git status` MUST NOT show the file as untracked
**And** the file MUST be ignored by git

### Requirement: Application Integrity
The application MUST continue to function correctly after cleanup.

#### Scenario: Build succeeds after cleanup
**Given** all cleanup tasks have been executed
**When** running `npm run build`
**Then** the build MUST complete successfully
**And** no errors related to missing files SHALL occur

#### Scenario: Tests pass after cleanup
**Given** all cleanup tasks have been executed
**When** running `npm run test:unit`
**Then** all 521 tests MUST pass
**And** no tests SHALL fail due to missing files

#### Scenario: Development database remains functional
**Given** all cleanup tasks have been executed
**When** running the application in development mode
**Then** the application MUST connect to `prisma/dev.db`
**And** no database connection errors SHALL occur

### Requirement: Cleanup Verification
The cleanup operation MUST be verifiable through deterministic commands.

#### Scenario: Verify file deletion count
**Given** the cleanup has been executed
**When** counting deleted files
**Then** exactly 29 files MUST have been deleted (3 from root + 26 from scripts)

#### Scenario: Verify disk space reclaimed
**Given** the cleanup has been executed
**When** measuring disk space change
**Then** approximately 200KB of disk space MUST be reclaimed

#### Scenario: Verify no unintended deletions
**Given** the cleanup has been executed
**When** checking critical directories
**Then** all files in `app/` MUST remain untouched
**And** all files in `components/` MUST remain untouched
**And** all files in `lib/` MUST remain untouched
**And** all files in `prisma/` (except root db files) MUST remain untouched
**And** all files in `__tests__/` MUST remain untouched
