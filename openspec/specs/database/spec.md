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
The system MUST define a User model with id, email, password, and role fields.

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

#### Scenario: Role values
- GIVEN a new user registration
- WHEN the role is set
- THEN it MUST be one of `"CLIENT"`, `"SPECIALIST"`, or `"ADMIN"`
- AND the `registerUser` action MUST only accept `"CLIENT"` or `"SPECIALIST"`
- AND `"ADMIN"` MUST only be assignable directly in the database

**Acceptance Criteria:**
- Run `npx prisma format` without errors
- Run `npx prisma validate` without errors
- Model includes all required fields with correct types
- `registerUser` validates role is `"CLIENT"` or `"SPECIALIST"`

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
