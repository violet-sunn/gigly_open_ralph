# UI Specification Delta: Specialist Profiles

## ADDED Requirements

### Requirement: Profile View Page
The system MUST provide a profile view page at `/dashboard/profile` showing the authenticated user's profile from their respective profile table.

#### Scenario: SPECIALIST views own profile
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/dashboard/profile`
- THEN the page MUST query the user with `include: { specialistProfile: true }`
- AND if `specialistProfile` is null, display "Profile not set up yet" with a link to edit
- AND if `specialistProfile` exists, display:
  - Email (from session)
  - Display name (or "Not set" if empty string)
  - Tech stack (or "Not set" if empty string)
  - Experience level (or "Not set" if empty string)
  - Bio (or "Not set" if empty string)
  - Hourly rate in roubles (or "Not set" if 0)
  - An "Edit Profile" link to `/dashboard/profile/edit`
  - A "Back to Dashboard" link to `/dashboard`

#### Scenario: CLIENT views own profile
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/dashboard/profile`
- THEN the page MUST query the user with `include: { clientProfile: true }`
- AND if `clientProfile` is null, display "Profile not set up yet" with a link to edit
- AND if `clientProfile` exists, display:
  - Email (from session)
  - Company name
  - INN
  - KPP (or "Not set" if empty string)
  - Contact person (or "Not set" if empty string)
  - Phone number (or "Not set" if empty string)
  - An "Edit Profile" link to `/dashboard/profile/edit`
  - A "Back to Dashboard" link to `/dashboard`

#### Scenario: Unauthenticated user visits profile page
- GIVEN no valid session
- WHEN a user navigates to `/dashboard/profile`
- THEN they MUST be redirected to `/login` (handled by existing middleware)

**Acceptance Criteria:**
- `app/dashboard/profile/page.tsx` exists as a server component
- Reads session via `getSession()`
- Queries user with appropriate profile relation based on role
- Handles null profile (not yet created)
- Renders different fields based on `session.role`
- Displays "Not set" for empty string fields
- Includes links to edit page and dashboard

---

### Requirement: Profile Edit Page
The system MUST provide a profile edit page at `/dashboard/profile/edit` with a form to update profile fields in the respective profile table.

#### Scenario: SPECIALIST edits profile
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/dashboard/profile/edit`
- THEN the page MUST display a form with:
  - Display name input (text, optional)
  - Tech stack input (text, optional, placeholder: "React, TypeScript, Node.js")
  - Experience level select (options: "", "MIDDLE", "SENIOR", optional)
  - Bio textarea (optional)
  - Hourly rate input (number, optional, in roubles)
  - A "Save Profile" submit button
  - A "Cancel" link to `/dashboard/profile`

#### Scenario: CLIENT edits profile
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/dashboard/profile/edit`
- THEN the page MUST display a form with:
  - Company name input (text, required)
  - INN input (text, required)
  - KPP input (text, optional)
  - Contact person input (text, optional)
  - Phone number input (text, optional)
  - A "Save Profile" submit button
  - A "Cancel" link to `/dashboard/profile`

#### Scenario: Form pre-fills existing data
- GIVEN a user with existing profile data
- WHEN they navigate to `/dashboard/profile/edit`
- THEN all form fields MUST be pre-filled with current values from their profile table
- AND if no profile exists yet, fields MUST render as empty inputs

#### Scenario: Form shows loading state
- GIVEN a user submits the profile edit form
- WHEN the server action is processing
- THEN the submit button MUST show "Saving..." text
- AND the button MUST be disabled

#### Scenario: Form shows error
- GIVEN a user submits invalid data
- WHEN the server action returns an error
- THEN the error message MUST be displayed inline on the form

#### Scenario: Form shows success
- GIVEN a user submits valid data
- WHEN the server action succeeds
- THEN the user MUST be redirected to `/dashboard/profile`

#### Scenario: Unauthenticated user visits edit page
- GIVEN no valid session
- WHEN a user navigates to `/dashboard/profile/edit`
- THEN they MUST be redirected to `/login` (handled by existing middleware)

**Acceptance Criteria:**
- `app/dashboard/profile/edit/page.tsx` exists as a `'use client'` component
- Uses `useActionState` with `updateProfile` action
- Uses `useFormStatus` for pending state on submit button
- Form fields are role-specific (SPECIALIST vs CLIENT)
- Pre-fills form with existing profile data via server-side data fetch
- Displays `state?.error` when present
- Redirects to `/dashboard/profile` on success
- CLIENT form marks companyName and inn as required

---

### Requirement: Public Profile View Page
The system MUST provide a public profile view page at `/dashboard/profile/[userId]` showing another user's profile from their respective profile table (read-only).

#### Scenario: View SPECIALIST public profile
- GIVEN an authenticated user
- WHEN they navigate to `/dashboard/profile/[userId]` where userId belongs to a SPECIALIST
- THEN the page MUST query the user with `include: { specialistProfile: true }`
- AND if `specialistProfile` is null, display "Profile not available"
- AND if `specialistProfile` exists, display:
  - Display name (or email if displayName is empty)
  - Tech stack (or "Not specified" if empty)
  - Experience level (or "Not specified" if empty)
  - Bio (or "Not specified" if empty)
  - Hourly rate in roubles (or "Not specified" if 0)
  - A "Back" link (to previous page or dashboard)
- AND the page MUST NOT show an "Edit Profile" link
- AND the page MUST NOT show the user's email address (privacy)

#### Scenario: View CLIENT public profile
- GIVEN an authenticated user
- WHEN they navigate to `/dashboard/profile/[userId]` where userId belongs to a CLIENT
- THEN the page MUST query the user with `include: { clientProfile: true }`
- AND if `clientProfile` is null, display "Profile not available"
- AND if `clientProfile` exists, display:
  - Company name
  - Contact person (or "Not specified" if empty)
  - A "Back" link (to previous page or dashboard)
- AND the page MUST NOT show INN, KPP, phone number, or email (privacy)
- AND the page MUST NOT show an "Edit Profile" link

#### Scenario: View own profile via public URL
- GIVEN an authenticated user
- WHEN they navigate to `/dashboard/profile/[userId]` where userId matches their own userId
- THEN they MUST be redirected to `/dashboard/profile`

#### Scenario: User not found
- GIVEN a non-existent userId
- WHEN a user navigates to `/dashboard/profile/[userId]`
- THEN the page MUST show a "User not found" message with a link back to `/dashboard`

#### Scenario: Unauthenticated user visits public profile
- GIVEN no valid session
- WHEN a user navigates to `/dashboard/profile/[userId]`
- THEN they MUST be redirected to `/login` (handled by existing middleware)

**Acceptance Criteria:**
- `app/dashboard/profile/[userId]/page.tsx` exists as a server component
- Queries user by userId with appropriate profile relation based on target user's role
- Renders different fields based on target user's role
- Does NOT show sensitive fields (email, INN, KPP, phone for CLIENT)
- Redirects to `/dashboard/profile` if viewing own profile
- Shows "Not specified" for empty string fields
- Handles null profile gracefully
- Includes back link

---

## MODIFIED Requirements

### Requirement: Gig Detail Page
The system MUST provide a page at `/dashboard/gigs/[id]` showing full gig details, INCLUDING client profile information from ClientProfile table.

#### Scenario: SPECIALIST views gig detail with client profile
- GIVEN an authenticated SPECIALIST user
- WHEN they navigate to `/dashboard/gigs/[id]` for an existing gig
- THEN the page MUST display the existing gig details
- AND the page MUST query gig with `include: { client: { include: { clientProfile: true } } }`
- AND if `client.clientProfile` exists and `companyName` is not empty, display the company name next to or below the client email
- AND the company name MUST be a link to `/dashboard/profile/{clientId}`

**Acceptance Criteria:**
- Gig detail page queries gig with nested include for client and clientProfile
- Displays `client.clientProfile.companyName` if profile exists and field is not empty
- Company name links to client's public profile page
- Gracefully handles null clientProfile

---

### Requirement: Role-Based Dashboard
The dashboard MUST render different content based on the user's role, INCLUDING profile completion indicators based on profile table data.

#### Scenario: CLIENT dashboard shows profile completion hint
- GIVEN a user with role "CLIENT" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST query user with `include: { clientProfile: true }`
- AND if `clientProfile` is null OR `companyName` is empty OR `inn` is empty
- THEN display a notice: "Complete your profile to build trust with specialists" with a link to `/dashboard/profile/edit`

#### Scenario: SPECIALIST dashboard shows profile completion hint
- GIVEN a user with role "SPECIALIST" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST query user with `include: { specialistProfile: true }`
- AND if `specialistProfile` is null OR `techStack` is empty OR `experienceLevel` is empty
- THEN display a notice: "Complete your profile to stand out when applying to gigs" with a link to `/dashboard/profile/edit`

#### Scenario: Dashboard shows profile link
- GIVEN an authenticated user (any role)
- WHEN they visit `/dashboard`
- THEN the page MUST display a "My Profile" link to `/dashboard/profile`

**Acceptance Criteria:**
- Dashboard queries user with appropriate profile relation based on role
- Shows profile completion notice if profile is null or key fields are empty
- Includes "My Profile" link in dashboard navigation
- Notice is hidden once profile is complete

---

### Requirement: Gig Detail Page Application List
The system MUST display specialist profile information from SpecialistProfile table in the applications list on gig detail pages.

#### Scenario: CLIENT views applications with specialist profiles
- GIVEN an authenticated CLIENT user who owns a gig
- WHEN they view the gig detail page with applications
- THEN the page MUST query applications with `include: { specialist: { include: { specialistProfile: true } } }`
- AND each application MUST display:
  - Specialist email (existing)
  - If `specialistProfile` exists and `displayName` is not empty: show "DisplayName (email)"
  - If `specialistProfile` exists and `techStack` is not empty: show as tags
  - If `specialistProfile` exists and `experienceLevel` is not empty: show as badge
  - Cover letter (existing)
  - Status (existing)
  - Date (existing)
  - A link to the specialist's public profile: `/dashboard/profile/{specialistId}`

**Acceptance Criteria:**
- Gig detail page queries applications with nested include for specialist and specialistProfile
- Displays specialist profile fields inline in application list
- Specialist email/name links to specialist's public profile page
- Gracefully handles null specialistProfile (shows only email if profile doesn't exist)
- Gracefully handles empty string fields (doesn't display empty tags/badges)
