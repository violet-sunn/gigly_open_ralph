# Change Proposal: Remove Hourly Rate Regression

## Change Name
`remove-hourly-rate-regression`

## Problem Statement

A critical constraint violation has been identified: the project contains hourly rate functionality for specialists, which MUST NOT exist according to project requirements.

**Current State:**
- `hourlyRate` field exists in SpecialistProfile database schema
- Hourly rate appears in profile forms, pages, and actions
- Hourly rate is in test data, seed scripts, and documentation
- 24 files contain references to hourly rate

**Constraint Violation:**
The project has a HARD CONSTRAINT: there MUST NOT be anything connected with hourly rate for specialists. No mentions whatsoever.

**Affected Files (24 total):**
- Database: `prisma/schema.prisma`, migration files
- Application code: profile actions, forms, pages
- Tests: test helpers, seed data
- Documentation: specs, application map, testing docs

## Proposed Solution

Completely remove all hourly rate functionality from the entire codebase.

**Transformation Approach:**

1. **Database Layer**
   - Create migration to drop `hourlyRate` column from SpecialistProfile
   - Update Prisma schema to remove the field
   - Regenerate Prisma client

2. **Application Layer**
   - Remove hourly rate field from profile edit form
   - Remove hourly rate display from profile pages
   - Remove hourly rate handling from profile actions
   - Update TypeScript types

3. **Testing Layer**
   - Remove hourly rate from test helpers
   - Remove hourly rate from seed data
   - Update test assertions

4. **Documentation Layer**
   - Remove hourly rate from all specs
   - Update application map
   - Update testing documentation

## Constraints

### Critical Constraints
- **ZERO TOLERANCE:** No hourly rate references can remain anywhere in the codebase
- **DATABASE SAFETY:** Migration must safely drop column without affecting other fields
- **TEST COVERAGE:** All existing tests must pass after removal
- **DOCUMENTATION ACCURACY:** All specs and docs must reflect the removal
- **TYPE SAFETY:** TypeScript compilation must succeed

### Scope Boundaries
- **In Scope:** All code, tests, migrations, documentation, seed data, specs
- **Out of Scope:** None - this is a complete removal across all layers

## Deliverables

1. **Database Migration:** New migration file to drop `hourlyRate` column
2. **Prisma Schema:** Updated schema without `hourlyRate` field
3. **Profile Forms:** Updated forms without hourly rate input
4. **Profile Pages:** Updated pages without hourly rate display
5. **Profile Actions:** Updated actions without hourly rate handling
6. **Test Data:** Updated test helpers and seed data
7. **Documentation:** Updated all specs and documentation

## Success Criteria

1. **Zero References:** `grep -r "hourlyRate\|почасов" .` returns no matches (excluding archive)
2. **Tests Pass:** All tests pass successfully
3. **Migration Works:** Database migration executes without errors
4. **TypeScript Compiles:** No type errors
5. **Documentation Clean:** All specs updated and accurate

## Risk Assessment

**Risk Level:** 🟡 **Medium**

**Risks:**
- Database migration could fail if not properly structured
- Multiple files need coordinated changes
- Tests may break if not updated correctly
- Type errors may cascade through the codebase

**Mitigation:**
- Create and test migration before schema changes
- Update files in logical order (database → code → tests → docs)
- Run tests after each major change
- Use grep to verify complete removal
- Regenerate Prisma client after schema changes

## Non-Goals

- Adding any replacement functionality
- Changing any other profile fields
- Modifying unrelated features
- Performance optimization

## Expected Impact

**For Users:**
- No visible impact (feature should not have existed)

**For Developers:**
- Cleaner codebase aligned with constraints
- Reduced confusion about specialist pricing model
- Simpler profile management

**For Database:**
- One column removed from SpecialistProfile table
- Slightly reduced storage requirements
