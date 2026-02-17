# Database Spec Delta: Requirements Iteration 2

## ADDED Requirements

### Requirement: Gig Model Extended with Structured Requirement Fields
The Gig model MUST include three optional text fields to help clients articulate requirements: goal, deliverables, and constraints.

#### Scenario: Gig schema includes new fields
- GIVEN the Prisma schema file
- WHEN the Gig model is defined
- THEN it MUST include:
  - `goal` field as String with @default("")
  - `deliverables` field as String with @default("")
  - `constraints` field as String with @default("")
- AND these fields MUST be positioned after the existing `acceptanceCriteria` field

#### Scenario: New fields are optional
- GIVEN a gig is created without providing goal, deliverables, or constraints
- WHEN the gig record is saved
- THEN the fields MUST default to empty strings ("")
- AND the gig MUST be created successfully

#### Scenario: New fields accept text content
- GIVEN a client provides values for goal, deliverables, and constraints
- WHEN the gig is created
- THEN all three fields MUST be stored as provided (after trimming)
- AND the values MUST be retrievable in subsequent queries

#### Scenario: Existing gigs remain valid
- GIVEN existing gigs in the database without these fields
- WHEN the migration is applied
- THEN all existing gigs MUST have these fields set to empty strings ("")
- AND no data loss MUST occur

**Acceptance Criteria:**
- Run `npx prisma format` without errors
- Run `npx prisma validate` without errors
- Migration adds three new columns to Gig table with default value ""
- All existing gigs have empty strings for new fields after migration
- New fields are non-nullable String type with @default("")

## MODIFIED Requirements

None - this change only adds new fields without modifying existing behavior.

## REMOVED Requirements

None - this change is purely additive.
