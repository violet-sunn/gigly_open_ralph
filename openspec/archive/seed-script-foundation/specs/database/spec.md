# Database Specification Delta

## ADDED Requirements

### Requirement: Foundation User Creation
The seed script MUST create 6 foundation users: 2 CLIENTs, 3 SPECIALISTs, and 1 ADMIN.

#### Scenario: Create CLIENT users with profiles
- GIVEN the seed script is executed
- WHEN creating CLIENT users
- THEN it MUST create 2 CLIENT users with:
  - Realistic Russian email addresses (e.g., `ivan.petrov@techcorp.ru`)
  - Pre-computed bcrypt hash for password "TestPass123" (stored as constant)
  - Role "CLIENT"
  - Complete ClientProfile with:
    - Realistic Russian company name (e.g., "ТехКорп", "ДиджиталПро")
    - Valid INN format (10 digits)
    - Contact person name
    - Phone number in Russian format

#### Scenario: Create SPECIALIST users with profiles
- GIVEN the seed script is executed
- WHEN creating SPECIALIST users
- THEN it MUST create 3 SPECIALIST users with:
  - Realistic Russian names and email addresses
  - Pre-computed bcrypt hash for password "TestPass123" (stored as constant)
  - Role "SPECIALIST"
  - Complete SpecialistProfile with:
    - Display name (Russian name)
    - Tech stack (realistic combinations: "React, TypeScript, Node.js", "Python, Django, PostgreSQL", "Go, Docker, Kubernetes")
    - Experience level ("MIDDLE" or "SENIOR")
    - Bio (brief Russian description)
    - Hourly rate in kopecks (e.g., 500000 = 5000 RUB/hour)

#### Scenario: Create ADMIN user
- GIVEN the seed script is executed
- WHEN creating ADMIN user
- THEN it MUST create 1 ADMIN user with:
  - Email `admin@gigly.ru`
  - Pre-computed bcrypt hash for password "TestPass123" (stored as constant)
  - Role "ADMIN"
  - No profile (ADMIN role doesn't require ClientProfile or SpecialistProfile)

#### Scenario: Idempotent user creation
- GIVEN the seed script is executed multiple times
- WHEN creating users
- THEN it MUST use `upsert` operations with email as unique key
- AND running the script multiple times MUST produce the same result
- AND no duplicate users MUST be created

**Acceptance Criteria:**
- Seed script creates exactly 6 foundation users
- All passwords use pre-computed bcrypt hash constant (no dynamic hashing)
- Pre-computed hash is for "TestPass123" with bcrypt rounds: 10
- All CLIENT users have ClientProfile records
- All SPECIALIST users have SpecialistProfile records
- ADMIN user has no profile
- Uses `prisma.user.upsert()` for idempotency
- Russian names and companies are realistic and diverse
- Existing users and data are preserved (no clearing)

---

### Requirement: Seed Script Logging
The seed script MUST log all created users in a clear, developer-friendly format.

#### Scenario: Log created users with credentials
- GIVEN the seed script completes successfully
- WHEN logging output is displayed
- THEN it MUST show:
  - A header "=== SEED COMPLETED ==="
  - A section "Created Users:" with a table or list format
  - For each user: email, role, password (plaintext for dev convenience)
  - A footer with instructions (e.g., "Login with any user using password: TestPass123")

#### Scenario: Log user creation progress
- GIVEN the seed script is creating users
- WHEN each user is created
- THEN it MUST log "Created [ROLE] user: [email]"
- AND it MUST indicate profile creation (e.g., "Created ClientProfile for ivan.petrov@techcorp.ru")

**Acceptance Criteria:**
- Console output is clear and well-formatted
- All foundation users are listed with credentials
- Progress is logged for user creation steps
- Final output includes copy-pasteable login credentials
- Uses console.log() for output (not debug or trace)
- No clearing progress logs (clearing is removed)

---

### Requirement: Example Gigs Creation/Update
The seed script MUST upsert 5 example gigs with full data payloads and assign them to the foundation CLIENT users.

#### Scenario: Upsert example gigs with full data
- GIVEN the seed script creates foundation CLIENT users
- WHEN upserting example gigs
- THEN it MUST use `prisma.gig.upsert()` with complete data payloads
- AND each gig MUST include: id, title, description, goal, deliverables, constraints, acceptanceCriteria, budget, serviceFee, totalAmount, tags, status, isExample, clientId
- AND gigs MUST be assigned to the 2 foundation CLIENT users
- AND gigs MUST be distributed evenly (e.g., 3 gigs to first client, 2 to second)

#### Scenario: Maintain gig quality and structure
- GIVEN the example gigs have well-structured requirements
- WHEN the seed script runs
- THEN all gigs MUST remain in "OPEN" status
- AND all gigs MUST have `isExample: true` flag
- AND gig data MUST match the existing high-quality examples (Backend API, Frontend Dashboard, DevOps CI/CD, Database Optimization, E2E Testing)

#### Scenario: Idempotent gig creation
- GIVEN the seed script is run multiple times
- WHEN upserting gigs
- THEN it MUST use `where: { id }` for unique identification
- AND running multiple times MUST NOT create duplicate gigs
- AND existing gig data MUST be updated with current clientId references

**Acceptance Criteria:**
- All 5 example gigs are upserted with full data payloads
- Gigs are assigned to foundation CLIENT users (not the old seed user)
- Gig content is complete and high-quality
- Gigs are distributed across both CLIENT users
- All gigs have `isExample: true` flag
- Uses `prisma.gig.upsert()` for idempotency
- Gig IDs are stable (same IDs as before)
