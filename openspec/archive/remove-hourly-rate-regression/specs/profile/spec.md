# Profile Specification - Remove Hourly Rate

## REMOVED Requirements

### Requirement: Hourly Rate in Profile Forms
Profile forms MUST NOT contain hourly rate fields.

#### Scenario: Profile edit form must not have hourly rate field
**Given** the specialist profile edit form
**When** reviewing form fields
**Then** the form MUST NOT contain an hourlyRate input field
**And** the form MUST NOT display hourly rate label or placeholder
**And** the form MUST NOT validate hourly rate
**And** the form MUST NOT submit hourly rate data

#### Scenario: Profile display must not show hourly rate
**Given** a specialist profile page
**When** viewing profile information
**Then** the page MUST NOT display hourly rate value
**And** the page MUST NOT show hourly rate label
**And** the page MUST NOT render hourly rate in any format

---

### Requirement: Hourly Rate in Profile Actions
Profile actions MUST NOT handle hourly rate data.

#### Scenario: Update profile action must not process hourly rate
**Given** the updateProfile server action
**When** processing profile update request
**Then** the action MUST NOT accept hourlyRate parameter
**And** the action MUST NOT validate hourlyRate
**And** the action MUST NOT save hourlyRate to database
**And** TypeScript types MUST NOT include hourlyRate

#### Scenario: Profile data fetching must not include hourly rate
**Given** any profile data query
**When** fetching specialist profile
**Then** the query MUST NOT select hourlyRate field
**And** the returned data MUST NOT include hourlyRate property

---

## Validation Commands

```bash
# Verify no hourlyRate in profile forms
! grep -i "hourlyRate" app/dashboard/profile/edit/ProfileEditForm.tsx

# Verify no hourlyRate in profile pages
! grep -i "hourlyRate" app/dashboard/profile/page.tsx
! grep -i "hourlyRate" app/dashboard/profile/[userId]/page.tsx

# Verify no hourlyRate in profile actions
! grep -i "hourlyRate" app/actions/profile.ts

# Verify TypeScript compiles
npx tsc --noEmit
```
