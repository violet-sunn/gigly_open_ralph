# Database Spec Delta — application-management

## MODIFIED Requirements

### Requirement: Gig Model
The Gig model MUST include an optional `assignedSpecialistId` field to track the specialist working on the gig.

#### Scenario: Gig schema includes assignedSpecialistId
- GIVEN the Prisma schema file
- WHEN the Gig model is updated
- THEN it MUST add:
  - `assignedSpecialistId` field as String? (nullable, foreign key to User)
  - `assignedSpecialist` relation to User model (optional)
- AND the field MUST be `null` when status is `OPEN`
- AND the field MUST reference a valid User when status is `IN_PROGRESS`

#### Scenario: Gig transitions to IN_PROGRESS
- GIVEN a Gig with status "OPEN"
- WHEN an application is accepted
- THEN the Gig `status` MUST be updated to "IN_PROGRESS"
- AND `assignedSpecialistId` MUST be set to the accepted specialist's userId

**Acceptance Criteria:**
- `npx prisma validate` passes
- Gig model includes `assignedSpecialistId String?` and `assignedSpecialist` relation
- Migration applies cleanly to existing data (nullable field, no data loss)

---

### Requirement: Application Model
The Application model MUST support `ACCEPTED` and `REJECTED` status values in addition to `PENDING`.

#### Scenario: Application status values
- GIVEN an Application record
- WHEN the status field is set
- THEN it MUST be one of: `"PENDING"`, `"ACCEPTED"`, `"REJECTED"`

#### Scenario: Accepting an application updates status
- GIVEN an Application with status "PENDING"
- WHEN the gig owner accepts it
- THEN the Application status MUST be updated to "ACCEPTED"

#### Scenario: Rejecting an application updates status
- GIVEN an Application with status "PENDING"
- WHEN the gig owner rejects it
- THEN the Application status MUST be updated to "REJECTED"

#### Scenario: Auto-reject remaining applications on accept
- GIVEN a Gig with multiple PENDING applications
- WHEN one application is accepted
- THEN all other PENDING applications for that gig MUST be updated to "REJECTED"

**Acceptance Criteria:**
- Application status supports "PENDING", "ACCEPTED", "REJECTED"
- No orphaned PENDING applications after an accept operation
