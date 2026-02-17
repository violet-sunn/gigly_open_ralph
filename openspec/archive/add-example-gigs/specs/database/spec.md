# Database Specification Delta

## ADDED Requirements

### Requirement: Gig Model Example Flag
The Gig model MUST include an `isExample` boolean field to distinguish example gigs from real gigs.

#### Scenario: isExample field exists
- GIVEN the Prisma schema file
- WHEN the Gig model is defined
- THEN it MUST include an `isExample` field as Boolean with @default(false)

#### Scenario: New gigs default to non-example
- GIVEN a CLIENT user creates a new gig via the platform
- WHEN the gig is created
- THEN `isExample` MUST be false (real gig)

#### Scenario: Example gigs are marked as examples
- GIVEN a gig created via seed data as an example
- WHEN the gig is created
- THEN `isExample` MUST be true

**Acceptance Criteria:**
- Gig model includes `isExample Boolean @default(false)` field
- Migration adds `isExample` column to Gig table
- Existing gigs default to `isExample = false` after migration
- `npx prisma validate` passes

---

### Requirement: Example Gig Seed Data
The system MUST provide a seed script that creates 3-5 example gigs demonstrating excellent requirements.

#### Scenario: Seed script creates example gigs
- GIVEN a fresh database or a database without example gigs
- WHEN the seed script is executed
- THEN 3-5 example gigs MUST be created with:
  - `isExample` = true
  - `status` = "OPEN"
  - Realistic titles covering different project types (backend, frontend, DevOps, etc.)
  - Complete, well-written descriptions
  - Clear, specific acceptance criteria (minimum 200 characters)
  - Non-empty goal, deliverables, and constraints fields
  - Realistic budgets (150k-200k RUB range, stored in kopecks)
  - Appropriate tags for each project type
  - `clientId` = a seed user with role "CLIENT" (created by seed script)

#### Scenario: Example gigs cover diverse project types
- GIVEN the seed script
- WHEN executed
- THEN example gigs MUST include at least:
  - 1 backend/API development gig
  - 1 frontend/UI development gig
  - 1 DevOps/infrastructure gig
  - 1-2 additional gigs (e.g., database optimization, testing, architecture)

#### Scenario: Example gigs demonstrate all structured fields
- GIVEN any example gig created by seed
- WHEN the gig is queried
- THEN all structured requirement fields MUST be non-empty:
  - `goal` (50-200 characters, clear desired outcome)
  - `deliverables` (100-300 characters, specific outputs)
  - `constraints` (50-200 characters, technical preferences/timeline)
  - `acceptanceCriteria` (200-500 characters, clear success criteria)

#### Scenario: Seed script is idempotent
- GIVEN the seed script has been run once
- WHEN the seed script is run again
- THEN it MUST NOT create duplicate example gigs
- AND it MUST either skip creation or update existing example gigs

**Acceptance Criteria:**
- File `prisma/seed.ts` exists with seed function
- Seed script creates a seed CLIENT user (email: `example-client@gigly.ru`, role: "CLIENT")
- Seed script creates 3-5 example gigs with `isExample = true`
- All example gigs have complete, high-quality content in all structured fields
- Example gigs cover diverse project types with appropriate tags
- Budgets are realistic (150k-200k RUB, stored as kopecks)
- Seed script can be run via `npx prisma db seed`
- `package.json` includes `prisma.seed` configuration
- Seed script uses `upsert` or checks for existing records to avoid duplicates
