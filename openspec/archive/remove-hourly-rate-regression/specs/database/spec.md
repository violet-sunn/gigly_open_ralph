# Database Schema Specification - Remove Hourly Rate

## REMOVED Requirements

### Requirement: Hourly Rate Field in SpecialistProfile
The SpecialistProfile table MUST NOT contain an hourlyRate field.

#### Scenario: SpecialistProfile schema must not have hourlyRate
**Given** the SpecialistProfile table schema
**When** reviewing the table structure
**Then** the table MUST NOT contain a column named "hourlyRate"
**And** the Prisma schema MUST NOT define hourlyRate field in SpecialistProfile model

#### Scenario: Migration must remove hourlyRate column
**Given** an existing database with hourlyRate column
**When** running migrations
**Then** a migration MUST exist that drops the hourlyRate column
**And** the migration MUST execute successfully without data loss for other columns
**And** the migration MUST be idempotent (safe to run multiple times)

#### Scenario: Prisma client must not expose hourlyRate
**Given** the generated Prisma client
**When** accessing SpecialistProfile type
**Then** the type MUST NOT include hourlyRate property
**And** TypeScript compilation MUST succeed without hourlyRate references

---

## Validation Commands

```bash
# Verify hourlyRate not in schema
! grep -i "hourlyRate" prisma/schema.prisma

# Verify migration exists to drop column
grep -l "DROP.*hourlyRate\|ALTER.*DROP.*hourlyRate" prisma/migrations/*/migration.sql

# Verify Prisma client regenerated
npx prisma generate

# Verify TypeScript compiles
npx tsc --noEmit
```
