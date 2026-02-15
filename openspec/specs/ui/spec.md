# UI Specification Delta

## MODIFIED Requirements

### Requirement: Homepage Landing Page
The homepage at `/` MUST provide a clear entry point into the application instead of a generic placeholder.

#### Scenario: Homepage renders with navigation to register
- GIVEN a user navigates to `/`
- WHEN the page loads
- THEN it MUST display the application name "Gigly"
- AND it MUST display a call-to-action link/button to `/register`
- AND the link MUST be clearly visible and styled

**Acceptance Criteria:**
- `app/page.tsx` renders a link or button pointing to `/register`
- The link text is clear (e.g., "Get Started", "Sign Up")
- The page is styled with Tailwind CSS
- Clicking the link navigates to `/register`

---

## MODIFIED Requirements

### Requirement: Registration Form Feedback
The registration form MUST provide visible feedback after submission.

#### Scenario: Successful registration
- GIVEN a user fills in valid email and password on `/register`
- WHEN the form is submitted
- THEN the user MUST be redirected to `/` or shown a success message
- AND the form MUST NOT appear to do nothing

#### Scenario: Failed registration (duplicate email)
- GIVEN a user submits an email that already exists
- WHEN the form is submitted
- THEN an error message MUST be displayed on the page
- AND the form MUST remain visible so the user can retry

#### Scenario: Failed registration (missing fields)
- GIVEN a user submits with empty email or password
- WHEN the form is submitted
- THEN HTML5 validation MUST prevent submission (existing `required` attributes)

**Acceptance Criteria:**
- On success: user is redirected to `/` or sees a success message
- On error: an error message is displayed inline on the registration page
- The form uses `useActionState` (React 19) or equivalent to track submission state
- A loading/pending indicator is shown while the form submits
