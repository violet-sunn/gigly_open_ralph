# Filesystem Audit Specification

## ADDED Requirements

### Requirement: Root Directory Audit
The audit MUST scan the project root directory to identify clutter and misplaced files.

#### Scenario: Identify stray script files
**Given** the project root directory
**When** scanning for files with extensions `.js`, `.ts`, `.txt`
**Then** any files not matching standard project files (package.json, tsconfig.json, etc.) MUST be flagged
**And** the reason MUST indicate "stray script/temporary file in root"

#### Scenario: Identify redundant configuration files
**Given** the project root directory
**When** scanning for configuration files
**Then** any duplicate or conflicting configs (e.g., both `.prettierrc` and `prettier.config.js`) MUST be flagged
**And** the reason MUST indicate "potential configuration conflict"

#### Scenario: Exclude standard directories
**Given** the project root directory
**When** scanning for directories
**Then** standard directories (`.next`, `node_modules`, `.git`, `.turbo`) MUST NOT be flagged
**And** these directories MUST be excluded from recursive scans

### Requirement: Database Artifacts Audit
The audit MUST scan the `prisma/` directory to identify leftover database files and migration artifacts.

#### Scenario: Identify database backup files
**Given** the `prisma/` directory
**When** scanning for files with patterns `.db.bak`, `.db.old`, `.db-*`
**Then** any backup database files MUST be flagged
**And** the reason MUST indicate "leftover database backup"

#### Scenario: Identify multiple seed files
**Given** the `prisma/` directory
**When** scanning for files matching `seed*.ts` or `*seed.ts`
**Then** if more than one seed file exists, all except `seed.ts` MUST be flagged
**And** the reason MUST indicate "redundant seed script"

### Requirement: Scripts Directory Audit
The audit MUST scan the `scripts/` directory to identify orphaned or legacy scripts.

#### Scenario: Identify temporary execution scripts
**Given** the `scripts/` directory
**When** scanning for files with patterns `test*.ts`, `temp*.ts`, `old*.ts`
**Then** any files matching these patterns MUST be flagged
**And** the reason MUST indicate "temporary or legacy script"

### Requirement: Application Structure Audit
The audit MUST scan `app/`, `components/`, and `lib/` directories to identify structural clutter.

#### Scenario: Identify empty directories
**Given** the application directories (`app/`, `components/`, `lib/`)
**When** scanning recursively for directories
**Then** any directory containing zero files (excluding subdirectories) MUST be flagged
**And** the reason MUST indicate "empty directory"

#### Scenario: Identify temporary component files
**Given** the `components/` directory
**When** scanning for files with patterns `Test*.tsx`, `Old*.tsx`, `*temp*.tsx`, `*backup*.tsx`
**Then** any files matching these patterns MUST be flagged
**And** the reason MUST indicate "temporary or test component"

#### Scenario: Identify temporary utility files
**Given** the `lib/` directory
**When** scanning for files with patterns `temp*.ts`, `test*.ts`, `*backup*.ts`
**Then** any files matching these patterns MUST be flagged
**And** the reason MUST indicate "temporary utility file"

### Requirement: Test Infrastructure Audit
The audit MUST scan `__tests__/` and `e2e/` directories to identify test clutter.

#### Scenario: Identify non-standard test file names
**Given** the `__tests__/` directory
**When** scanning for `.test.ts` or `.spec.ts` files
**Then** any files not following the pattern `<feature>.test.ts` or `<feature>.spec.ts` MUST be flagged
**And** the reason MUST indicate "non-standard test file naming"

#### Scenario: Identify orphaned test database files
**Given** the `__tests__/` directory
**When** scanning for files with patterns `.db`, `.db-*`, `.sqlite`
**Then** any database files outside of `.tmp/` directory MUST be flagged
**And** the reason MUST indicate "orphaned test database file"

#### Scenario: Identify unused mock data files
**Given** the `__tests__/` directory
**When** scanning for files with patterns `mock*.ts`, `fixture*.ts`
**Then** files not referenced by any test file SHOULD be flagged
**And** the reason MUST indicate "potentially unused mock/fixture"

### Requirement: Read-Only Operation
The audit MUST operate in strictly read-only mode without modifying the filesystem.

#### Scenario: No file modifications
**Given** the audit is running
**When** scanning any directory or file
**Then** no files MUST be deleted, moved, renamed, or modified
**And** only read operations (stat, readdir, readFile) SHALL be performed

#### Scenario: No directory modifications
**Given** the audit is running
**When** encountering any directory
**Then** no directories MUST be created, deleted, or renamed
**And** only directory listing operations SHALL be performed
