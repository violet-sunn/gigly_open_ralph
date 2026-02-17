# Database Specification Delta

## MODIFIED Requirements

### Requirement: Application Model
The system MUST define an Application model linking a Specialist to a Gig with structured fields for technical approach, clarifying questions, and estimated effort.

#### Scenario: Application schema definition
- GIVEN the Prisma schema file
- WHEN the Application model is defined
- THEN it MUST include:
  - `id` field as String with @id and @default(cuid())
  - `gigId` field as String (foreign key to Gig)
  - `gig` relation to Gig model
  - `specialistId` field as String (foreign key to User)
  - `specialist` relation to User model
  - `coverLetter` field as String with @default("") (LEGACY - kept for backward compatibility)
  - `approach` field as String with @default("") (technical approach/methodology)
  - `questions` field as String with @default("") (clarifying questions about requirements)
  - `estimatedEffort` field as String with @default("") (optional effort estimate)
  - `status` field as String with @default("PENDING")
  - `createdAt` field as DateTime with @default(now())
  - `updatedAt` field as DateTime with @updatedAt
- AND there MUST be a unique constraint on `[gigId, specialistId]`

#### Scenario: New applications use structured fields
- GIVEN a SPECIALIST submits a new application after this change
- WHEN the application is created
- THEN `approach` and `questions` MUST contain non-empty values
- AND `coverLetter` MUST be empty string (not used in new applications)
- AND `estimatedEffort` MAY be empty string or contain a value

#### Scenario: Legacy applications display gracefully
- GIVEN an existing application created before this change
- WHEN the application is displayed
- THEN if `approach` and `questions` are empty, the system MUST display `coverLetter` instead
- AND the UI MUST handle both old and new application formats

**Acceptance Criteria:**
- Run `npx prisma format` without errors
- Run `npx prisma validate` without errors
- Application model includes `approach`, `questions`, and `estimatedEffort` fields
- All new fields have @default("") for backward compatibility
- Migration adds new columns without breaking existing data
- `coverLetter` field remains in schema (not removed)
