# Database Specification — Gig Creation Delta

## ADDED Requirements

### Requirement: Gig Model
The system MUST define a Gig model linked to the User model.

#### Scenario: Gig schema definition
- GIVEN the Prisma schema file
- WHEN the Gig model is defined
- THEN it MUST include:
  - `id` field as String with @id and @default(cuid())
  - `title` field as String
  - `description` field as String
  - `budget` field as Int (amount in kopecks)
  - `serviceFee` field as Int (calculated as 20% of budget, in kopecks)
  - `totalAmount` field as Int (budget + serviceFee, in kopecks)
  - `status` field as String with @default("OPEN")
  - `tags` field as String with @default("") (comma-separated)
  - `clientId` field as String (foreign key to User)
  - `client` relation to User model
  - `createdAt` field as DateTime with @default(now())
  - `updatedAt` field as DateTime with @updatedAt

#### Scenario: User-Gig relation
- GIVEN the User model exists
- WHEN the Gig model is added
- THEN the User model MUST include a `gigs` relation field (Gig[])

**Acceptance Criteria:**
- `npx prisma validate` passes
- `npx prisma migrate dev --name add-gig-model` succeeds
- Gig table exists in SQLite with all columns

---

## MODIFIED Requirements

### Requirement: User Model
The User model MUST include a relation to Gig.

#### Scenario: User has gigs relation
- GIVEN the updated User model
- WHEN queried with `include: { gigs: true }`
- THEN it MUST return the user's gigs array

**Acceptance Criteria:**
- User model includes `gigs Gig[]` relation field
- `npx prisma validate` passes
