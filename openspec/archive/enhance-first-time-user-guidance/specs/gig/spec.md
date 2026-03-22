# Gig Specification Delta

## MODIFIED Requirements

### Requirement: Create Gig Server Action
The system MUST provide a `createGig` server action that creates a gig for the authenticated CLIENT user AND updates first-time user guidance state.

#### Scenario: First gig creation updates user state
- GIVEN an authenticated user with role "CLIENT" AND `hasCreatedFirstGig = false`
- WHEN `createGig` is called with valid data and completes successfully
- THEN a Gig record MUST be created
- AND `hasCreatedFirstGig` MUST be updated to true for the user
- AND both operations MUST happen in the same transaction
- AND the action MUST redirect to `/dashboard`

#### Scenario: Subsequent gig creation does not update user state
- GIVEN an authenticated user with `hasCreatedFirstGig = true`
- WHEN `createGig` is called with valid data
- THEN a Gig record MUST be created
- AND `hasCreatedFirstGig` MUST remain true (no redundant update)
- AND the action MUST redirect to `/dashboard`

#### Scenario: Failed gig creation does not update user state
- GIVEN an authenticated user with `hasCreatedFirstGig = false`
- WHEN `createGig` is called with invalid data (e.g., missing required fields)
- THEN no Gig record MUST be created
- AND `hasCreatedFirstGig` MUST remain false
- AND the action MUST return an error

**Acceptance Criteria:**
- `createGig` action checks `hasCreatedFirstGig` before creating gig
- If `hasCreatedFirstGig = false`, updates it to true in same transaction as gig creation
- Uses Prisma transaction to ensure atomicity: `prisma.$transaction([createGig, updateUser])`
- No update if `hasCreatedFirstGig` is already true (avoid unnecessary writes)
- Error handling: if transaction fails, both operations roll back
- All existing `createGig` scenarios and acceptance criteria remain unchanged

---

### Requirement: Apply to Gig Server Action
The system MUST provide an `applyToGig` server action that creates an application with structured fields AND updates first-time user guidance state.

#### Scenario: First application submission updates user state
- GIVEN an authenticated user with role "SPECIALIST" AND `hasSubmittedFirstApplication = false`
- WHEN `applyToGig` is called with valid data and completes successfully
- THEN an Application record MUST be created
- AND `hasSubmittedFirstApplication` MUST be updated to true for the user
- AND both operations MUST happen in the same transaction
- AND the action MUST redirect to `/gigs/{gigId}`

#### Scenario: Subsequent application submission does not update user state
- GIVEN an authenticated user with `hasSubmittedFirstApplication = true`
- WHEN `applyToGig` is called with valid data
- THEN an Application record MUST be created
- AND `hasSubmittedFirstApplication` MUST remain true (no redundant update)
- AND the action MUST redirect to `/gigs/{gigId}`

#### Scenario: Failed application submission does not update user state
- GIVEN an authenticated user with `hasSubmittedFirstApplication = false`
- WHEN `applyToGig` is called with invalid data (e.g., approach too short)
- THEN no Application record MUST be created
- AND `hasSubmittedFirstApplication` MUST remain false
- AND the action MUST return an error

**Acceptance Criteria:**
- `applyToGig` action checks `hasSubmittedFirstApplication` before creating application
- If `hasSubmittedFirstApplication = false`, updates it to true in same transaction as application creation
- Uses Prisma transaction to ensure atomicity: `prisma.$transaction([createApplication, updateUser])`
- No update if `hasSubmittedFirstApplication` is already true (avoid unnecessary writes)
- Error handling: if transaction fails, both operations roll back
- All existing `applyToGig` scenarios and acceptance criteria remain unchanged
