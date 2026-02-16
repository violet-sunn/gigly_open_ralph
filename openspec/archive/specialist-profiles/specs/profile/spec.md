# Profile Specification

## Requirements

### Requirement: Update Profile Server Action
The system MUST provide an `updateProfile` server action that creates or updates the authenticated user's profile in their respective profile table (ClientProfile or SpecialistProfile).

#### Scenario: SPECIALIST creates profile for first time
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user has no SpecialistProfile record yet
- WHEN `updateProfile` is called with valid profile data (displayName, techStack, experienceLevel, bio, hourlyRate)
- THEN a SpecialistProfile record MUST be created with `userId` as primary key
- AND hourlyRate MUST be converted from roubles to kopecks (× 100) before storage
- AND empty string fields MUST remain as empty strings (not converted to null)
- AND the action MUST redirect to `/dashboard/profile`

#### Scenario: SPECIALIST updates existing profile
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user has an existing SpecialistProfile record
- WHEN `updateProfile` is called with updated profile data
- THEN the SpecialistProfile record MUST be updated with the provided values
- AND the action MUST redirect to `/dashboard/profile`

#### Scenario: CLIENT creates profile for first time
- GIVEN an authenticated user with role "CLIENT"
- AND the user has no ClientProfile record yet
- WHEN `updateProfile` is called with valid profile data (companyName, inn, kpp, contactPerson, phoneNumber)
- THEN a ClientProfile record MUST be created with `userId` as primary key
- AND companyName and inn MUST be non-empty strings
- AND the action MUST redirect to `/dashboard/profile`

#### Scenario: CLIENT updates existing profile
- GIVEN an authenticated user with role "CLIENT"
- AND the user has an existing ClientProfile record
- WHEN `updateProfile` is called with updated profile data
- THEN the ClientProfile record MUST be updated with the provided values
- AND the action MUST redirect to `/dashboard/profile`

#### Scenario: Unauthenticated user attempts to update profile
- GIVEN no valid session
- WHEN `updateProfile` is called
- THEN it MUST redirect to `/login`

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

#### Scenario: Invalid hourly rate
- GIVEN a SPECIALIST user submits hourlyRate with a negative value or non-numeric value
- WHEN `updateProfile` is called
- THEN it MUST return `{ error: 'Hourly rate must be a positive number.' }`
- AND no records MUST be modified

#### Scenario: Upsert operation (create or update)
- GIVEN a user submits the profile form
- WHEN `updateProfile` is called
- THEN it MUST use Prisma's `upsert` operation
- AND `where: { userId: session.userId }`
- AND `create: { userId: session.userId, ...data }`
- AND `update: { ...data }`
- AND this MUST handle both first-time creation and subsequent updates

#### Scenario: SPECIALIST cannot create ClientProfile
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `updateProfile` is called
- THEN it MUST only interact with SpecialistProfile table
- AND it MUST NOT create or modify ClientProfile records

#### Scenario: CLIENT cannot create SpecialistProfile
- GIVEN an authenticated user with role "CLIENT"
- WHEN `updateProfile` is called
- THEN it MUST only interact with ClientProfile table
- AND it MUST NOT create or modify SpecialistProfile records

**Acceptance Criteria:**
- `updateProfile` is exported from `app/actions/profile.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- Uses role-based logic to determine which profile table to upsert
- For SPECIALIST: validates experienceLevel is "", "MIDDLE", or "SENIOR" if provided
- For SPECIALIST: validates hourlyRate is positive if provided
- For SPECIALIST: converts hourlyRate from roubles to kopecks before storage
- For CLIENT: validates companyName and inn are non-empty
- Uses Prisma `upsert` to handle both create and update cases
- On success: redirects to `/dashboard/profile`
- On failure: returns `{ error: string }`
- Empty strings are stored as empty strings (not null, per schema defaults)
