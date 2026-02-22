# Change Proposal: Repository Cleanup Audit

## Change Name
`repository-cleanup-audit`

## Problem Statement

During rapid development phases, QA & Polish cycles, and various test implementations, AI agents and developers often leave behind temporary files, redundant scripts, misplaced artifacts, and structural clutter. Before moving to UI polishing or production deployment, we must identify these orphaned files to maintain a clean, professional B2B codebase.

The current repository may contain:
- Stray temporary files in the root directory
- Redundant or conflicting configuration files
- Leftover database backups and migration artifacts
- Old execution scripts that should be archived or deleted
- Empty directories in the application structure
- Components with temporary naming patterns (e.g., `TestComponent.tsx`, `temp-utils.ts`)
- Test files that don't follow naming conventions
- Unused mock data or test fixtures

## Proposed Solution

Conduct a **STRICTLY READ-ONLY** comprehensive scan of the entire project directory structure to identify garbage, temporary files, legacy artifacts, and misplaced components.

**Deliverable:** A single detailed report file `cleanup_report_v1.md` at the project root.

The report will categorize findings by directory and provide clear reasoning for each flagged item, enabling informed cleanup decisions.

## Constraints

### Critical Constraints
- **READ-ONLY MODE:** This audit MUST NOT delete, move, rename, or modify ANY files or directories
- **No Code Refactoring:** Focus ONLY on file-level and directory-level clutter, not code quality inside active files
- **Standard Directories Excluded:** Do NOT flag standard Next.js, Git, or Node.js hidden directories (`.next`, `node_modules`, `.git`, `.turbo`, etc.)

### Scope Boundaries
- **In Scope:** File and directory structure, naming patterns, redundant artifacts, orphaned files
- **Out of Scope:** Code quality, refactoring suggestions, performance optimizations, security vulnerabilities

## Audit Scope

### 1. Root Directory Clutter
- Stray `.js`, `.ts`, `.txt`, or `.md` files that don't belong in root
- Redundant configuration files (e.g., both `.prettierrc` and `prettier.config.js` if they conflict)
- Temporary scripts or test files

### 2. Scripts & Database Artifacts
- `prisma/` folder: leftover database backups (`.db.bak`, `.db.old`), multiple seed files
- `scripts/` folder: old execution scripts that should be archived or deleted
- Migration artifacts that failed or were abandoned

### 3. Application & Component Clutter
- `app/`, `components/`, `lib/` directories
- Empty directories
- Components with temporary naming (e.g., `TestComponent.tsx`, `OldHeader.tsx`, `temp-utils.ts`)
- Unused layout files or duplicate page files

### 4. Test Infrastructure Clutter
- `__tests__/` and `e2e/` directories
- Test files not following naming convention (e.g., `test1.ts` instead of `feature.test.ts`)
- Empty test suites or unused mock data files
- Orphaned test database files

## Success Criteria

1. **No Modifications:** Zero files deleted, moved, renamed, or modified during the audit
2. **Comprehensive Report:** `cleanup_report_v1.md` generated at project root
3. **Clear Documentation:** Each flagged item includes:
   - Absolute or relative path
   - Brief reason why it's flagged as potential garbage
   - Suggested action (delete, move, archive, or investigate)
4. **Actionable Findings:** Report enables informed cleanup decisions without requiring additional investigation

## Non-Goals

- Actual cleanup or deletion of files (deferred to separate change)
- Code quality analysis or refactoring suggestions
- Performance optimization recommendations
- Security vulnerability scanning
- Dependency audit or package updates

## Deliverable Format

The `cleanup_report_v1.md` report will include:
- Executive summary with total findings count
- Findings grouped by directory/category
- Each finding with: path, reason, suggested action
- Legend explaining severity levels (if applicable)
- Recommendations for cleanup prioritization
