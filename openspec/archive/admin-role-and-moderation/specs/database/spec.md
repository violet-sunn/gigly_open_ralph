# Database Specification - Admin Role & Moderation Changes

## MODIFIED Requirements

### Requirement: User Model

**ADDED Field: suspended**
- Type: Boolean
- Default: false
- Purpose: Indicates whether the user account is suspended by an admin

**Acceptance Criteria:**
- `suspended Boolean @default(false)` added to User model
- Suspended users cannot log in (enforced in loginUser action)
- Field is indexed for efficient filtering: `@@index([suspended])`

---

### Requirement: Gig Model

**ADDED Field: closedByAdmin**
- Type: Boolean
- Default: false
- Purpose: Indicates whether the gig was closed by an admin for policy violations

**ADDED Field: closedAt**
- Type: DateTime?
- Optional: true
- Purpose: Timestamp when the gig was closed by an admin

**Acceptance Criteria:**
- `closedByAdmin Boolean @default(false)` added to Gig model
- `closedAt DateTime?` added to Gig model
- closedByAdmin is indexed for efficient filtering: `@@index([closedByAdmin])`
- Closed gigs cannot receive new applications (enforced in applyToGig action)
- closedAt is set when closedByAdmin is set to true

---

## ADDED Requirements

### Requirement: ModerationLog Model
The system MUST track all moderation actions in a dedicated ModerationLog table.

#### Scenario: ModerationLog record creation
- GIVEN any moderation action is performed (suspend, unsuspend, close gig)
- WHEN the action completes successfully
- THEN a ModerationLog record MUST be created with all required fields

#### Scenario: ModerationLog querying
- GIVEN an admin views moderation history
- WHEN querying ModerationLog records
- THEN records MUST be retrievable by targetUserId, targetGigId, or adminId

**Acceptance Criteria:**
- ModerationLog model exists with fields:
  - `id String @id @default(cuid())`
  - `action String` (values: "SUSPEND_USER", "UNSUSPEND_USER", "CLOSE_GIG")
  - `reason String` (required, explanation for the action)
  - `adminId String` (foreign key to User)
  - `targetUserId String?` (optional foreign key to User)
  - `targetGigId String?` (optional foreign key to Gig)
  - `createdAt DateTime @default(now())`
- Relations defined:
  - `admin User @relation("AdminActions", fields: [adminId], references: [id])`
  - `targetUser User? @relation("UserModerations", fields: [targetUserId], references: [id])`
  - `targetGig Gig? @relation("GigModerations", fields: [targetGigId], references: [id])`
- Indexes for efficient querying:
  - `@@index([adminId])`
  - `@@index([targetUserId])`
  - `@@index([targetGigId])`
  - `@@index([createdAt])`
- At least one of targetUserId or targetGigId MUST be non-null (enforced at application level)
- User model has inverse relations: `adminActions ModerationLog[] @relation("AdminActions")` and `moderations ModerationLog[] @relation("UserModerations")`
- Gig model has inverse relation: `moderations ModerationLog[] @relation("GigModerations")`
