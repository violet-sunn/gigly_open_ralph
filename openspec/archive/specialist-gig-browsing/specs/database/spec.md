# Database Specification — Specialist Gig Browsing Delta

## ADDED Requirements

### Requirement: Application Model
The system MUST define an Application model linking a Specialist to a Gig.

#### Scenario: Application schema definition
- GIVEN the Prisma schema file
- WHEN the Application model is defined
- THEN it MUST include:
  - `id` field as String with @id and @default(cuid())
  - `gigId` field as String (foreign key to Gig)
  - `gig` relation to Gig model
  - `specialistId` field as String (foreign key to User)
  - `specialist` relation to User model
  - `coverLetter` field as String with @default("")
  - `status` field as String with @default("PENDING")
  - `createdAt` field as DateTime with @default(now())
  - `updatedAt` field as DateTime with @updatedAt
- AND there MUST be a unique constraint on `[gigId, specialistId]`

#### Scenario: Gig-Application relation
- GIVEN the Gig model exists
- WHEN the Application model is added
- THEN the Gig model MUST include an `applications` relation field (Application[])

#### Scenario: User-Application relation
- GIVEN the User model exists
- WHEN the Application model is added
- THEN the User model MUST include an `applications` relation field (Application[])

**Acceptance Criteria:**
- `npx prisma validate` passes
- `npx prisma migrate dev --name add-application-model` succeeds
- Application table exists with unique constraint on (gigId, specialistId)

---

## MODIFIED Requirements

### Requirement: User Model (add applications relation)
The User model MUST include a relation to Application.

#### Scenario: User has applications relation
- GIVEN the updated User model
- WHEN queried with `include: { applications: true }`
- THEN it MUST return the user's applications array

**Acceptance Criteria:**
- User model includes `applications Application[]` relation field

### Requirement: Gig Model (add applications relation)
The Gig model MUST include a relation to Application.

#### Scenario: Gig has applications relation
- GIVEN the updated Gig model
- WHEN queried with `include: { applications: true }`
- THEN it MUST return the gig's applications array

**Acceptance Criteria:**
- Gig model includes `applications Application[]` relation field
