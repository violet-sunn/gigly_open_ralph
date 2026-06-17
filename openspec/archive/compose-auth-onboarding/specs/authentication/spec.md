# Authentication Specification Delta: compose-auth-onboarding

This delta extends registration for the 3-step onboarding wizard (`compose-auth-onboarding`). `registerUser` is
**additively extended** to persist the step-3 role-specific profile and enforce confirm-password (both backward-
compatible — existing single-step callers are unaffected), and the **Registration Page UI** requirement is **replaced**:
the page is now the kit-composed 3-step wizard (token-pure), superseding the prior hardcoded-Figma/hex specification.
`loginUser`, the session/redirect contract, password hashing/strength, rate limiting, and route protection are
unchanged.

---

## MODIFIED Requirements

### Requirement: Registration Action with Session and Role
The registration Server Action MUST accept a role, validate it, create a session, and redirect on success — and MUST
**additively** (a) enforce a confirm-password match when a confirm-password is supplied, and (b) persist the supplied
role-specific profile (`ClientProfile`/`SpecialistProfile`) in the same transaction as the `User`. The action signature,
rate limiting, password hashing, password-strength validation, and role validation are preserved; behaviour for callers
that supply only email/password/role (no confirm-password, no profile) is unchanged.

#### Scenario: Redirect and auto-login after successful registration
- GIVEN a valid registration submission with role "CLIENT" or "SPECIALIST"
- WHEN the user is created successfully
- THEN a session cookie MUST be set with the new user's ID, email, and role
- AND the action MUST redirect to `/dashboard`

#### Scenario: Registration with invalid role
- GIVEN form data with an invalid role (e.g., "HACKER", "ADMIN", "USER")
- WHEN `registerUser` is called
- THEN it MUST return an `{ error }` and no user MUST be created

#### Scenario: Confirm-password mismatch is rejected (when supplied)
- GIVEN a registration submission that includes a `confirmPassword` field
- WHEN `confirmPassword` does not equal `password`
- THEN `registerUser` MUST return an `{ error }` (e.g. «Пароли не совпадают.») AND no user MUST be created
- AND WHEN no `confirmPassword` field is supplied (single-step callers), the check MUST be skipped (unchanged behaviour)

#### Scenario: Step-3 profile is persisted with the user
- GIVEN a registration submission that includes role-specific profile fields
- WHEN the user is created
- THEN the matching profile MUST be created in the same transaction — CLIENT → `ClientProfile` (companyName, inn,
  contactPerson, phoneNumber); SPECIALIST → `SpecialistProfile` (displayName, position, specialization, experienceLevel,
  techStack, timezone) — with free-text fields sanitized and dropdown values validated against the datasets
  (`SPECIALIZATIONS`/`EXPERIENCE_LEVELS`/`TIMEZONES`; invalid values coerced to `''`, not persisted verbatim)
- AND WHEN no profile fields are supplied, no profile MUST be created (unchanged behaviour)

#### Scenario: Error returned on failure
- GIVEN a registration submission that fails (e.g., duplicate email)
- WHEN the Server Action catches the error
- THEN it MUST return an object with an error message AND the form MUST display that message

**Acceptance Criteria:**
- `registerUser` reads `formData.get('role')` and validates it is `"CLIENT"` or `"SPECIALIST"`; on success `createSession()` then `redirect('/dashboard')`; on failure `{ error: string }`; signature compatible with `useActionState`
- Confirm-password mismatch (when supplied) → error, no user; absent → skipped (backward-compatible)
- Role-specific profile (when supplied) persisted in the same transaction, dataset-validated; absent → no profile (backward-compatible)
- Rate limiting, password hashing, and password-strength validation preserved

### Requirement: Registration Page UI Design
The registration page (`/register`) MUST be the kit-composed 3-step onboarding wizard (`RegisterWizard`) — composed from
`AuthLayout` + `StepIndicator` + `RoleCards` + form primitives, token-pure (no hardcoded hex/px literals) — replacing
the prior single-step hardcoded-Figma page. It MUST preserve role preselection from `?role=`, the RU copy, the
decorative checkerboard footer (the exported asset), responsiveness, and all existing authentication functionality
(validation, rate limiting, session creation).

#### Scenario: Registration page is the composed 3-step wizard
- GIVEN a user navigates to `/register`
- WHEN the page renders
- THEN it MUST render `<RegisterWizard>` inside `AuthLayout`, showing a `StepIndicator` with three steps (role →
  credentials → role-specific profile), the heading «Регистрация», and the exported checkerboard footer
  (`/assets/design-system/patterns/checkerboard.svg`) — composed from the kit, token-pure (no `className`/`style`/hex in
  the screen)

#### Scenario: Role pre-selection from query parameter
- GIVEN a user navigates to `/register?role=SPECIALIST` (or `=CLIENT`)
- WHEN the page renders
- THEN step 1 MUST pre-select that role; an absent/invalid `?role=` MUST start with no preselection (both roles
  selectable)

#### Scenario: Role-specific profile step
- GIVEN the wizard reaches step 3
- WHEN the chosen role is CLIENT vs SPECIALIST
- THEN it MUST present the company profile (`reg-customer`) vs the specialist profile (`reg-specialist`), the specialist
  dropdowns bound to the datasets (`SPECIALIZATIONS`/`EXPERIENCE_LEVELS`/`TIMEZONES`)

#### Scenario: Responsive
- GIVEN a user views `/register` on a mobile viewport (< 768px)
- WHEN the page renders
- THEN the composed card MUST remain functional and readable and the footer MUST scale (the `AuthLayout` is responsive
  via tokens)

**Acceptance Criteria:**
- `/register` renders the F5-pure composed `RegisterWizard` (AuthLayout + StepIndicator + RoleCards + form primitives); token-pure (no hardcoded hex/px)
- 3 steps with a `StepIndicator`; «Регистрация» heading; exported checkerboard footer renders; responsive
- Role preselect from `?role=`; role-specific step 3 with dataset-bound dropdowns
- All existing authentication functionality preserved (validation, rate limiting, session creation); fidelity vs the references (auth/reg/reg-customer/reg-specialist) with F1 ≤1% deferred on the font-licence gate

---

## Test Plan

```bash
# Registration action: profile persistence + confirm-password (backward-compatible)
npm run clean:test-db && npx vitest run __tests__/integration/register-onboarding.test.ts 2>&1 | tail -12

# Composed wizard + role preselect + validation + register→dashboard (E2E)
npx playwright test __tests__/e2e/compose-auth-onboarding.spec.ts --project=chromium 2>&1 | tail -12

# Page is token-pure (no hardcoded hex in the composed screen)
grep -qE 'className=|style=|#[0-9a-fA-F]{3,6}' app/register/RegisterWizard.tsx && echo "CHECK hex/raw" || echo "OK token-pure"
npm run lint:composition && npm run lint:tokens && echo "F5 + tokens green"
```
