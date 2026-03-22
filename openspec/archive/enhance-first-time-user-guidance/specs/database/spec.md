# Database Specification Delta

## ADDED Requirements

### Requirement: User Guidance State Tracking
The User model MUST track first-time user guidance state to determine when to show contextual help.

#### Scenario: New user has default guidance state
- GIVEN a new user is created via registration
- WHEN the User record is created
- THEN `hasCreatedFirstGig` MUST default to false
- AND `hasSubmittedFirstApplication` MUST default to false
- AND `gigCreationGuidanceDismissed` MUST default to false
- AND `applicationGuidanceDismissed` MUST default to false

#### Scenario: User creates first gig successfully
- GIVEN a user with `hasCreatedFirstGig = false`
- WHEN `createGig` server action completes successfully
- THEN `hasCreatedFirstGig` MUST be updated to true
- AND the update MUST happen in the same transaction as gig creation

#### Scenario: User submits first application successfully
- GIVEN a user with `hasSubmittedFirstApplication = false`
- WHEN `applyToGig` server action completes successfully
- THEN `hasSubmittedFirstApplication` MUST be updated to true
- AND the update MUST happen in the same transaction as application creation

#### Scenario: User dismisses gig creation guidance
- GIVEN a user viewing the gig creation form with guidance visible
- WHEN the user clicks the dismiss button on the guidance banner
- THEN `gigCreationGuidanceDismissed` MUST be updated to true
- AND the guidance MUST not appear on subsequent visits to the gig creation form

#### Scenario: User dismisses application guidance
- GIVEN a user viewing an application form with guidance visible
- WHEN the user clicks the dismiss button on the guidance banner
- THEN `applicationGuidanceDismissed` MUST be updated to true
- AND the guidance MUST not appear on subsequent application forms

#### Scenario: Guidance state is independent per user
- GIVEN multiple users on the platform
- WHEN one user dismisses guidance
- THEN other users MUST still see guidance based on their own state
- AND guidance state MUST NOT be shared across users

#### Scenario: Existing users have null guidance state
- GIVEN a user created before this feature was implemented
- WHEN the user accesses the gig creation form
- THEN null values MUST be treated as false (show guidance)
- AND the database migration MUST set default values for existing users

**Acceptance Criteria:**
- User model includes four new boolean fields:
  - `hasCreatedFirstGig Boolean @default(false)`
  - `hasSubmittedFirstApplication Boolean @default(false)`
  - `gigCreationGuidanceDismissed Boolean @default(false)`
  - `applicationGuidanceDismissed Boolean @default(false)`
- Database migration creates fields with @default(false) for all existing users
- `createGig` action updates `hasCreatedFirstGig` in same transaction
- `applyToGig` action updates `hasSubmittedFirstApplication` in same transaction
- New `dismissGuidance` server action updates dismissal flags
- All fields are indexed for query performance (if needed based on query patterns)
- Schema changes are backward compatible (no breaking changes)

---

### Requirement: Dismiss Guidance Server Action
The system MUST provide a `dismissGuidance` server action that persists user dismissal of guidance banners.

#### Scenario: Dismiss gig creation guidance
- GIVEN an authenticated user viewing gig creation guidance
- WHEN `dismissGuidance` is called with type "gigCreation"
- THEN `gigCreationGuidanceDismissed` MUST be set to true
- AND the action MUST return success
- AND subsequent page loads MUST not show the guidance

#### Scenario: Dismiss application guidance
- GIVEN an authenticated user viewing application guidance
- WHEN `dismissGuidance` is called with type "application"
- THEN `applicationGuidanceDismissed` MUST be set to true
- AND the action MUST return success

#### Scenario: Invalid guidance type
- GIVEN an authenticated user
- WHEN `dismissGuidance` is called with an invalid type
- THEN it MUST return `{ error: 'Invalid guidance type.' }`
- AND no database updates MUST occur

#### Scenario: Unauthenticated user attempts to dismiss guidance
- GIVEN no valid session
- WHEN `dismissGuidance` is called
- THEN it MUST redirect to `/login`

**Acceptance Criteria:**
- `dismissGuidance` is exported from `app/actions/user.ts` with `'use server'`
- Signature is `(type: 'gigCreation' | 'application') => Promise<{ error?: string }>`
- Valid types: "gigCreation", "application"
- Updates corresponding boolean field in User table
- Returns `{ error: string }` on failure, `{}` on success
- Requires authentication (redirects to /login if not authenticated)
- Operation is fast (< 50ms)
