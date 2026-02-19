# Gig Specification — Application Flow Tests

## ADDED Requirements

### Requirement: Application Submission Tests
The test suite MUST validate all aspects of the `applyToGig` server action.

#### Scenario: Successful application with all required fields
- GIVEN an authenticated SPECIALIST user
- AND an OPEN gig exists
- WHEN `applyToGig` is called with valid approach (≥100 chars), questions (≥50 chars), and optional estimatedEffort
- THEN an Application record MUST be created with:
  - `gigId` = provided gig ID
  - `specialistId` = session userId
  - `approach` = provided approach text
  - `questions` = provided questions text
  - `estimatedEffort` = provided effort text (or empty string)
  - `status` = "PENDING"
  - `coverLetter` = "" (legacy field, empty for new applications)
- AND the application MUST be retrievable from the database

#### Scenario: Application requires technical approach
- GIVEN an authenticated SPECIALIST user
- WHEN `applyToGig` is called without approach field
- THEN it MUST return `{ error: 'Technical approach is required.' }`
- AND no Application record MUST be created

#### Scenario: Application requires clarifying questions
- GIVEN an authenticated SPECIALIST user
- WHEN `applyToGig` is called without questions field
- THEN it MUST return `{ error: 'Clarifying questions are required.' }`
- AND no Application record MUST be created

#### Scenario: Technical approach minimum length validation
- GIVEN an authenticated SPECIALIST user
- WHEN `applyToGig` is called with approach < 100 characters
- THEN it MUST return error containing "Technical approach must be at least 100 characters"
- AND no Application record MUST be created

#### Scenario: Clarifying questions minimum length validation
- GIVEN an authenticated SPECIALIST user
- WHEN `applyToGig` is called with questions < 50 characters
- THEN it MUST return error containing "Clarifying questions must be at least 50 characters"
- AND no Application record MUST be created

#### Scenario: Technical approach maximum length validation
- GIVEN an authenticated SPECIALIST user
- WHEN `applyToGig` is called with approach > 2000 characters
- THEN it MUST return `{ error: 'Technical approach is too long. Maximum 2000 characters allowed.' }`
- AND no Application record MUST be created

#### Scenario: Clarifying questions maximum length validation
- GIVEN an authenticated SPECIALIST user
- WHEN `applyToGig` is called with questions > 1000 characters
- THEN it MUST return `{ error: 'Clarifying questions are too long. Maximum 1000 characters allowed.' }`
- AND no Application record MUST be created

#### Scenario: Estimated effort maximum length validation
- GIVEN an authenticated SPECIALIST user
- WHEN `applyToGig` is called with estimatedEffort > 200 characters
- THEN it MUST return `{ error: 'Estimated effort is too long. Maximum 200 characters allowed.' }`
- AND no Application record MUST be created

#### Scenario: Duplicate application prevention
- GIVEN a SPECIALIST has already applied to a gig
- WHEN `applyToGig` is called for the same gig by the same specialist
- THEN it MUST return `{ error: 'You have already applied to this gig.' }`
- AND no additional Application record MUST be created

#### Scenario: Cannot apply to non-existent gig
- GIVEN an authenticated SPECIALIST user
- WHEN `applyToGig` is called with a non-existent gigId
- THEN it MUST return `{ error: 'Gig not found.' }`
- AND no Application record MUST be created

#### Scenario: Cannot apply to IN_PROGRESS gig
- GIVEN a gig with status "IN_PROGRESS"
- WHEN `applyToGig` is called by a SPECIALIST
- THEN it MUST return `{ error: 'This gig is no longer accepting applications.' }`
- AND no Application record MUST be created

#### Scenario: Cannot apply to REVIEW gig
- GIVEN a gig with status "REVIEW"
- WHEN `applyToGig` is called by a SPECIALIST
- THEN it MUST return `{ error: 'This gig is no longer accepting applications.' }`
- AND no Application record MUST be created

#### Scenario: Cannot apply to COMPLETED gig
- GIVEN a gig with status "COMPLETED"
- WHEN `applyToGig` is called by a SPECIALIST
- THEN it MUST return `{ error: 'This gig is no longer accepting applications.' }`
- AND no Application record MUST be created

#### Scenario: Cannot apply to PAID gig
- GIVEN a gig with status "PAID"
- WHEN `applyToGig` is called by a SPECIALIST
- THEN it MUST return `{ error: 'This gig is no longer accepting applications.' }`
- AND no Application record MUST be created

#### Scenario: Cannot apply to closed gig
- GIVEN a gig with closedByAdmin = true
- WHEN `applyToGig` is called by a SPECIALIST
- THEN it MUST return `{ error: 'This gig has been closed by administrators.' }`
- AND no Application record MUST be created

#### Scenario: Cannot apply to example gig
- GIVEN a gig with isExample = true
- WHEN `applyToGig` is called by a SPECIALIST
- THEN it MUST return error containing "example gig"
- AND no Application record MUST be created

#### Scenario: Only SPECIALIST role can apply
- GIVEN an authenticated CLIENT user
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Only specialists can apply to gigs.' }`
- AND no Application record MUST be created

**Acceptance Criteria:**
- All scenarios pass with consistent results
- Tests use `withTestTransaction` for isolation
- Tests use `withAuthContext` for authentication
- Tests validate database state after operations

---

### Requirement: Application Acceptance Tests
The test suite MUST validate all aspects of the `acceptApplication` server action.

#### Scenario: Successful application acceptance
- GIVEN an authenticated CLIENT user who owns a gig
- AND the gig has status "OPEN"
- AND a PENDING application exists for that gig
- WHEN `acceptApplication` is called with the applicationId
- THEN the Application status MUST be updated to "ACCEPTED"
- AND the Gig status MUST be updated to "IN_PROGRESS"
- AND the Gig `assignedSpecialistId` MUST be set to the application's specialistId
- AND all other PENDING applications for that gig MUST be updated to "REJECTED"

#### Scenario: Accepting auto-rejects other pending applications
- GIVEN a gig with 3 PENDING applications
- WHEN one application is accepted
- THEN the accepted application MUST have status "ACCEPTED"
- AND the other 2 applications MUST have status "REJECTED"
- AND no applications MUST remain with status "PENDING"

#### Scenario: Only gig owner can accept applications
- GIVEN an authenticated CLIENT user who does NOT own the gig
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Only the gig owner can manage applications.' }`
- AND no records MUST be modified

#### Scenario: Only CLIENT role can accept applications
- GIVEN an authenticated SPECIALIST user
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Only clients can manage applications.' }`
- AND no records MUST be modified

#### Scenario: Cannot accept application on non-OPEN gig
- GIVEN a gig with status "IN_PROGRESS"
- WHEN `acceptApplication` is called by the gig owner
- THEN it MUST return `{ error: 'This gig is no longer accepting applications.' }`
- AND no records MUST be modified

#### Scenario: Cannot accept second application after first is accepted (race condition protection)
- GIVEN a gig with 2 PENDING applications (Application A and Application B)
- WHEN Application A is accepted (gig transitions to IN_PROGRESS)
- AND immediately after, `acceptApplication` is called for Application B
- THEN the second accept MUST return `{ error: 'This gig is no longer accepting applications.' }`
- AND Application B MUST remain "REJECTED" (auto-rejected by first accept)
- AND the gig MUST still have assignedSpecialistId = Specialist A (not overwritten)
- AND the gig status MUST remain "IN_PROGRESS"

**Note:** This scenario tests protection against concurrent acceptance race conditions. In a true concurrent scenario (two browser tabs clicking "Accept" simultaneously), the implementation should use atomic check-and-update (e.g., `updateMany` with `WHERE status = 'OPEN'`) to prevent the second transaction from overwriting the first. This test verifies the sequential case; true concurrency testing would require explicit transaction control.

#### Scenario: Cannot accept non-PENDING application
- GIVEN an application with status "REJECTED"
- WHEN `acceptApplication` is called by the gig owner
- THEN it MUST return `{ error: 'This application is no longer pending.' }`
- AND no records MUST be modified

#### Scenario: Cannot accept non-existent application
- GIVEN a non-existent applicationId
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Application not found.' }`
- AND no records MUST be modified

**Acceptance Criteria:**
- All scenarios pass with consistent results
- Tests validate transactional behavior (all updates succeed or all fail)
- Tests verify gig lifecycle transition (OPEN → IN_PROGRESS)
- Tests verify auto-rejection of other applications

---

### Requirement: Application Rejection Tests
The test suite MUST validate all aspects of the `rejectApplication` server action.

#### Scenario: Successful application rejection
- GIVEN an authenticated CLIENT user who owns a gig
- AND a PENDING application exists for that gig
- WHEN `rejectApplication` is called with the applicationId
- THEN the Application status MUST be updated to "REJECTED"
- AND the Gig status MUST remain "OPEN"
- AND the Gig `assignedSpecialistId` MUST remain null

#### Scenario: Rejecting does not affect gig status
- GIVEN a gig with status "OPEN" and 2 PENDING applications
- WHEN one application is rejected
- THEN the rejected application MUST have status "REJECTED"
- AND the gig status MUST still be "OPEN"
- AND the other application MUST still be "PENDING"

#### Scenario: Only gig owner can reject applications
- GIVEN an authenticated CLIENT user who does NOT own the gig
- WHEN `rejectApplication` is called
- THEN it MUST return `{ error: 'Only the gig owner can manage applications.' }`
- AND no records MUST be modified

#### Scenario: Only CLIENT role can reject applications
- GIVEN an authenticated SPECIALIST user
- WHEN `rejectApplication` is called
- THEN it MUST return `{ error: 'Only clients can manage applications.' }`
- AND no records MUST be modified

#### Scenario: Cannot reject non-PENDING application
- GIVEN an application with status "ACCEPTED"
- WHEN `rejectApplication` is called by the gig owner
- THEN it MUST return `{ error: 'This application is no longer pending.' }`
- AND no records MUST be modified

#### Scenario: Cannot reject non-existent application
- GIVEN a non-existent applicationId
- WHEN `rejectApplication` is called
- THEN it MUST return `{ error: 'Application not found.' }`
- AND no records MUST be modified

**Acceptance Criteria:**
- All scenarios pass with consistent results
- Tests verify gig status remains unchanged after rejection
- Tests verify other applications are not affected by rejection
