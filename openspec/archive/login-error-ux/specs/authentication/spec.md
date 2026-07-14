# Authentication Specification — Delta for login-error-ux

## ADDED Requirements

### Requirement: Login Failed-Submit Value Preservation
When a login submission fails (any error returned by `loginUser`), the `AuthDesign` login view MUST preserve the
credentials the user just entered so they can review and correct them without retyping. Both the `Email` field and the
`Пароль` field MUST retain their submitted values after the failed submit re-render. Preservation MUST be implemented
client-side via controlled inputs (React state that survives the Server Action form reset), so the entered password is
NOT sent back from the server in the action's response. The `loginUser` action's signature and return shape MUST remain
unchanged (`(prevState: { error?: string } | null, formData: FormData)`), and successful login MUST still redirect
(`/dashboard`, or `/admin` for ADMIN) with no credential values persisted client-side afterward.

#### Scenario: Email and password survive a failed login
- GIVEN a user on `/login` types an email and a wrong password and submits
- WHEN `loginUser` returns an invalid-credentials error and the login view re-renders
- THEN the `Email` field MUST still show the entered email
- AND the `Пароль` field MUST still contain the entered password (masked, or revealed if the visibility toggle is on)
- AND the user MUST be able to correct only the password and resubmit without re-typing the email

#### Scenario: Corrected credentials log in and redirect
- GIVEN a failed login left the email populated and the password field editable
- WHEN the user fixes the password to the correct value and submits
- THEN `loginUser` MUST authenticate, create the session, and redirect to `/dashboard` (or `/admin` for ADMIN)

#### Scenario: Password is not echoed by the server
- GIVEN a login attempt fails
- WHEN the `loginUser` action's returned state is inspected
- THEN it MUST NOT contain the submitted password (preservation is client-side controlled state, not a server echo)

**Acceptance Criteria:**
- The login `Email` and `Пароль` inputs in `AuthDesign`'s `LoginView` are controlled (`value` + `onChange` from local state)
- Both fields retain their values after a failed-submit re-render (verified live: wrong password → both fields still populated)
- `loginUser` in `app/actions/auth.ts` is unchanged (no new return fields, no password echo)
- The onboarding step-2 password fields and their controlled behaviour, checklist, and confirm-match logic are unaffected

---

### Requirement: Login Error Alert Presentation
The login error message rendered by `AuthDesign`'s login view MUST be presented as a self-contained, bounded alert
occupying its own row in the form flow, positioned above the «Войти» button. The alert MUST have a visible boundary
(background fill + border) with readable contrast, MUST NOT visually overlap the «Войти» button or the decorative
pixel-wave/background, and MUST use the existing design language (Handjet/Manrope fonts and `app/_design/tokens.css`
color tokens). When there is no error, no alert (and no empty reserved artifact) MUST be shown.

#### Scenario: Failed login shows a bounded, non-overlapping alert
- GIVEN a user submits invalid credentials on `/login`
- WHEN the error `«Неверный email или пароль. Проверьте данные и попробуйте снова.»` is displayed
- THEN it MUST appear inside a bounded alert (background fill, border, padding, rounded corners) on its own row
- AND the alert MUST NOT overlap the «Войти» button or the pixel-wave decoration (its fill occludes the decoration beneath)
- AND the copy MUST remain legible against the alert background

#### Scenario: No alert when there is no error
- GIVEN the login view renders with no error state
- THEN no alert block MUST be present in the DOM (no bare red text, no empty box)

#### Scenario: Alert uses the token design language
- GIVEN the login error alert renders
- THEN its colors MUST come from `app/_design/tokens.css` (e.g. the red accent token) and its typography MUST be Manrope/Handjet consistent with the surrounding auth surface

**Acceptance Criteria:**
- The login error is a bounded alert (tinted background + border + padding + border-radius), not a bare `<p>`
- The alert sits on its own row above «Войти» and does not overlap the button or the pixel-wave (verified live)
- Colors/typography use `app/_design/tokens.css` tokens (Handjet/Manrope), red accent for the error state
- The shared `ErrorNote` usages elsewhere in `AuthDesign` (onboarding) are not regressed by this change
