# Profile Specification

## Requirements

### Requirement: Update Profile Server Action
The system MUST provide an `updateProfile` server action that creates or updates the authenticated user's profile in their respective profile table (ClientProfile or SpecialistProfile).

#### Scenario: SPECIALIST creates profile for first time
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user has no SpecialistProfile record yet
- WHEN `updateProfile` is called with valid profile data
- THEN a SpecialistProfile record MUST be created with `userId` as primary key
- AND the action MUST redirect to `/dashboard/profile`

#### Scenario: CLIENT creates profile for first time
- GIVEN an authenticated user with role "CLIENT"
- AND the user has no ClientProfile record yet
- WHEN `updateProfile` is called with valid profile data
- THEN a ClientProfile record MUST be created with `userId` as primary key
- AND companyName and inn MUST be non-empty strings
- AND the action MUST redirect to `/dashboard/profile`

#### Scenario: CLIENT submits without required fields
- GIVEN a CLIENT user submits a form with empty companyName or inn
- WHEN `updateProfile` is called
- THEN it MUST return `{ error: 'Company name and INN are required.' }`
- AND no records MUST be created or modified

#### Scenario: Invalid experience level
- GIVEN a SPECIALIST user submits experienceLevel with value other than "", "MIDDLE", or "SENIOR"
- WHEN `updateProfile` is called
- THEN it MUST return `{ error: 'Experience level must be MIDDLE or SENIOR.' }`
- AND no records MUST be modified

#### Scenario: Upsert operation
- GIVEN a user submits the profile form
- WHEN `updateProfile` is called
- THEN it MUST use Prisma's `upsert` operation
- AND this MUST handle both first-time creation and subsequent updates

**Acceptance Criteria:**
- `updateProfile` is exported from `app/actions/profile.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)`
- Uses role-based logic to determine which profile table to upsert
- For SPECIALIST: validates experienceLevel
- For CLIENT: validates companyName and inn are non-empty
- Uses Prisma `upsert` to handle both create and update cases
- On success: redirects to `/dashboard/profile`
- On failure: returns `{ error: string }`
