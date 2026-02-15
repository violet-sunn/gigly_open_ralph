# Authentication Specification Delta

## ADDED Requirements

### Requirement: User Registration Endpoint
The system MUST provide a Server Action to create new users.

#### Scenario: User creation via Server Action
- GIVEN a registration form submission
- WHEN the Server Action receives email, password, and optional role
- THEN it MUST create a new user in the database
- AND return success or error status

**Acceptance Criteria:**
- Server Action function exists (e.g., `createUser` or `registerUser`)
- Function is marked with `'use server'` directive
- Function accepts email and password parameters
- Function creates user via Prisma client
- Function returns a result object with success/error status

---

### Requirement: User Registration Form
The system MUST provide a registration page at /register with a form.

#### Scenario: Registration form rendering
- GIVEN a user navigates to /register
- WHEN the page loads
- THEN it MUST display a registration form
- AND the form MUST include email input field
- AND the form MUST include password input field
- AND the form MUST include a submit button

**Acceptance Criteria:**
- Page exists at `app/register/page.tsx`
- Form renders with email input (type="email")
- Form renders with password input (type="password")
- Form renders with submit button
- Form uses Server Action for submission

---

### Requirement: Visual Verification
The registration form MUST be visually verifiable.

#### Scenario: Screenshot verification
- GIVEN the registration page is rendered
- WHEN a screenshot is taken
- THEN the form elements MUST be visible
- AND the layout MUST be functional

**Acceptance Criteria:**
- Screenshot shows email input field
- Screenshot shows password input field
- Screenshot shows submit button
- Form is styled with Tailwind CSS
