# Database Specification

## Requirements

### Requirement: Prisma ORM Setup
The system MUST use Prisma as the database ORM with SQLite as the database provider.

#### Scenario: Prisma initialization
- GIVEN a fresh project
- WHEN Prisma is initialized
- THEN a `prisma/schema.prisma` file MUST exist
- AND the datasource MUST be configured for SQLite
- AND the client generator MUST be configured

**Acceptance Criteria:**
- File `prisma/schema.prisma` exists
- Contains `datasource db { provider = "sqlite" }`
- Contains `generator client { provider = "prisma-client-js" }`

---

### Requirement: User Model
The system MUST define a User model with id, email, password, role fields, and relations to Gig and Application.

#### Scenario: User schema definition
- GIVEN the Prisma schema file
- WHEN the User model is defined
- THEN it MUST include:
  - `id` field as String with @id and @default(cuid())
  - `email` field as String with @unique
  - `password` field as String
  - `role` field as String with @default("USER") for backwards compatibility
  - `createdAt` field as DateTime with @default(now())
  - `updatedAt` field as DateTime with @updatedAt
  - `gigs` relation field (Gig[])
  - `applications` relation field (Application[])

#### Scenario: Role values
- GIVEN a new user registration
- WHEN the role is set
- THEN it MUST be one of `"CLIENT"`, `"SPECIALIST"`, or `"ADMIN"`
- AND the `registerUser` action MUST only accept `"CLIENT"` or `"SPECIALIST"`
- AND `"ADMIN"` MUST only be assignable directly in the database

#### Scenario: User has gigs relation
- GIVEN the updated User model
- WHEN queried with `include: { gigs: true }`
- THEN it MUST return the user's gigs array

#### Scenario: User has applications relation
- GIVEN the updated User model
- WHEN queried with `include: { applications: true }`
- THEN it MUST return the user's applications array

**Acceptance Criteria:**
- Run `npx prisma format` without errors
- Run `npx prisma validate` without errors
- Model includes all required fields with correct types
- User model includes `gigs Gig[]` and `applications Application[]` relation fields
- `registerUser` validates role is `"CLIENT"` or `"SPECIALIST"`

---

### Requirement: Gig Model
The system MUST define a Gig model linked to the User model with a relation to Application.

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
  - `applications` relation field (Application[])

#### Scenario: Gig has applications relation
- GIVEN the updated Gig model
- WHEN queried with `include: { applications: true }`
- THEN it MUST return the gig's applications array

**Acceptance Criteria:**
- `npx prisma validate` passes
- Gig table exists in SQLite with all columns
- Gig model includes `applications Application[]` relation field

---

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

**Acceptance Criteria:**
- `npx prisma validate` passes
- Application table exists with unique constraint on (gigId, specialistId)

---

### Requirement: Database Migrations
The system MUST support database migrations for schema changes.

#### Scenario: Initial migration
- GIVEN a defined User model
- WHEN migrations are created and applied
- THEN the SQLite database MUST contain a User table
- AND the table MUST have all defined columns

**Acceptance Criteria:**
- Run `npx prisma migrate dev --name init` succeeds
- File `prisma/migrations/*/migration.sql` is created
- SQLite database file is created
- Run `npx prisma studio` shows User model
