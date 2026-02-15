# Database Specification Delta

## MODIFIED Requirements

### Requirement: User Model Role Field
The `role` field on the User model MUST accept `"CLIENT"`, `"SPECIALIST"`, or `"ADMIN"` as values. The `@default("USER")` is kept in the schema for backwards compatibility, but new registrations MUST always provide an explicit role.

#### Scenario: User created with CLIENT role
- GIVEN a registration form submission with role "CLIENT"
- WHEN the user is created
- THEN the stored `role` field MUST be `"CLIENT"`

#### Scenario: User created with SPECIALIST role
- GIVEN a registration form submission with role "SPECIALIST"
- WHEN the user is created
- THEN the stored `role` field MUST be `"SPECIALIST"`

#### Scenario: Invalid role rejected
- GIVEN a registration attempt with role "INVALID"
- WHEN the server action processes the request
- THEN it MUST return an error and NOT create the user

#### Scenario: Clean slate before role changes
- GIVEN existing users may have `role = "USER"` in the database
- WHEN the role change is applied
- THEN all existing user rows MUST be deleted first
- AND the schema default MUST be kept as `@default("USER")` for safety

**Acceptance Criteria:**
- Prisma schema keeps `role String @default("USER")` (no schema migration needed)
- `registerUser` validates that role is one of `"CLIENT"` or `"SPECIALIST"`
- All existing users are deleted before implementation begins
- `npx prisma validate` passes
