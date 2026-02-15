# UI Specification Delta

## MODIFIED Requirements

### Requirement: Registration Form Role Selection
The registration form MUST include a role selector allowing the user to choose between Client and Specialist.

#### Scenario: Role selector renders
- GIVEN a user navigates to `/register`
- WHEN the page loads
- THEN it MUST display two selectable options: "Client" and "Specialist"
- AND no role MUST be pre-selected (user must actively choose)

#### Scenario: Registration submits with selected role
- GIVEN a user selects "Client", fills email and password
- WHEN the form is submitted
- THEN the form data MUST include `role: "CLIENT"`

#### Scenario: Registration without selecting role
- GIVEN a user fills email and password but does not select a role
- WHEN the form is submitted
- THEN the server action MUST return an error (role is required)

**Acceptance Criteria:**
- `app/register/page.tsx` includes a role selector (radio buttons or toggle)
- The selector sends `name="role"` with value `"CLIENT"` or `"SPECIALIST"`
- Role selection is required — form cannot submit without it

---

### Requirement: Role-Based Dashboard
The dashboard MUST render different content based on the user's role.

#### Scenario: Client visits dashboard
- GIVEN a user with role "CLIENT" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST display "Client Dashboard" heading
- AND it MUST show a "Post a Gig" call-to-action (placeholder/disabled)
- AND it MUST show a "My Gigs" section (empty state placeholder)
- AND it MUST display a "Sign out" button

#### Scenario: Specialist visits dashboard
- GIVEN a user with role "SPECIALIST" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST display "Specialist Dashboard" heading
- AND it MUST show a "Browse Gigs" call-to-action (placeholder/disabled)
- AND it MUST show a "My Applications" section (empty state placeholder)
- AND it MUST display a "Sign out" button

**Acceptance Criteria:**
- `app/dashboard/page.tsx` reads `session.role` from `getSession()`
- Renders different content for `"CLIENT"` vs `"SPECIALIST"`
- Both views include the sign-out form
