# Spec delta — ui (reconcile-auth-and-onboarding)

Reconciles the composed `/register` wizard to its 5 Figma auth/onboarding nodes: swaps the labelled
`StepIndicator` for the `AuthStepDots` dot counter, adds the `Logomark` + per-step headings, and keeps the screen
token-pure and composition-pure while preserving `registerUser`, validation, role preselect, and the
register→dashboard flow.

## MODIFIED Requirements

### Requirement: Register Wizard Composes the Figma Auth/Onboarding Nodes
The `/register` screen (`app/register/RegisterWizard.tsx`) MUST remain a single kit-composed 3-step wizard
(`AuthLayout` + blocks + primitives + data, no bespoke markup) whose three steps reconcile to the Figma nodes:
**step 1** = create-account role-select (`3179:3179`), **step 2** = create-account/specialist (`3179:3863`) &
/company (`3195:4564`), **step 3** = welcome/specialist (`3195:4282`) & /company (`3195:4704`). It MUST use the
authoritative `AuthStepDots` counter (NOT the labelled `StepIndicator`), lead steps 1–2 with the `Logomark`, and
carry a per-step heading + subtitle matching each node's copy. It MUST be token-pure (F2) and composition-pure
(F5), and MUST preserve `registerUser`, the confirm-password mismatch check, `?role=` preselect, and the flow
that lands a completed registration on `/dashboard`.

#### Scenario: Step indicator is the AuthStepDots counter with 3-step parity
- GIVEN the `/register` wizard on any step
- WHEN it renders
- THEN it MUST render the `AuthStepDots` primitive with `count = 3` and `current` equal to the active step index
- AND it MUST advance the active dot across steps (1/3 → 2/3 → 3/3) and expose the step via the primitive's
  `aria-label`/`progressbar` role
- AND it MUST NOT render the labelled `StepIndicator` (the "Роль/Доступ/Профиль" text labels) on the auth path

#### Scenario: Steps 1–2 lead with the Logomark and a node heading
- GIVEN the role-select step (1) and the credentials step (2)
- WHEN each renders
- THEN each MUST render the `Logomark` primitive (the exported brand mark) above the counter
- AND each MUST render the node's heading + subtitle (e.g. step 1 "Создайте свой аккаунт" / "Выберите свою роль…",
  step 2 "…" / "Введите свои учётные данные.")

#### Scenario: Step 1 composes the role selector
- GIVEN the role-select step
- WHEN it renders
- THEN it MUST render the `RoleCards` block (the `roleplay` ×2 selector) and `?role=` MUST preselect the matching
  card (`aria-pressed="true"`)
- AND the primary «Далее» button MUST be disabled until a role is chosen

#### Scenario: Step 2 composes the credential inputs token-pure
- GIVEN the credentials step
- WHEN it renders
- THEN it MUST render the email + password + confirm-password inputs from kit primitives plus the
  primary/secondary buttons
- AND a confirm-password mismatch MUST surface the existing inline error and block advancing
- AND the step MUST carry no raw hex/px/styling literals

#### Scenario: Step 3 composes the role-specific profile and completes registration
- GIVEN the welcome/profile step for each role
- WHEN it renders and is submitted with valid data
- THEN it MUST render the role-specific profile fields (specialist: display name + position + tech stack + the
  Select dropdowns; company: company name + INN + contact + phone) from kit primitives, led by the counter at 3/3
- AND submitting MUST invoke the unchanged `registerUser`, persist the profile, and land on `/dashboard`

#### Scenario: Composition- and token-purity
- GIVEN `RegisterWizard.tsx`
- WHEN the token-purity + composition lints run
- THEN the screen MUST report no off-token literals and no bespoke styling/markup (it composes
  `AuthLayout + RoleCards + primitives + data` only)

## ADDED Requirements

### Requirement: Welcome-Step Field Set Is a Sanctioned Content Variant
The Figma welcome node shows `Input + Select ×2`; the implemented step 3 MUST keep the **full profile field set**
that `registerUser` persists. This divergence MUST be treated as a **sanctioned content variant** of the node's
layout grammar (heading + counter + labelled fields + back/primary buttons), recorded in the design-system
reconciliation notes — NOT resolved by dropping persisted fields. F3 parity for step 3 is asserted at the
layout-grammar + flow level, not a literal field-count match.

#### Scenario: Full field set is preserved and the divergence is recorded
- GIVEN the welcome/profile step
- WHEN it renders
- THEN it MUST present every field `registerUser` consumes for the role (no field dropped to match the node's
  count)
- AND the field-count divergence from the Figma node MUST be documented as a sanctioned content variant in the
  reconciliation note (`docs/DESIGN_SYSTEM_SPEC.md` §10.x)

### Requirement: Auth Reconciliation Keeps the Suite and Lints Green
Reconciling the wizard MUST update the affected E2E/integration assertions to the new composition (dot counter +
Logomark + headings) while preserving every behavioural assertion (role preselect, mismatch, register→dashboard),
and MUST keep the build, token-purity lint, and unit/E2E suites green.

#### Scenario: Tests updated to the reconciled composition, suite green
- GIVEN `__tests__/e2e/compose-auth-onboarding.spec.ts` and the other affected auth tests
- WHEN they run after the reconciliation
- THEN the `StepIndicator` label assertions MUST be replaced by `AuthStepDots`/aria assertions
- AND the behavioural assertions (`?role=` preselect, confirm-password mismatch, full register → `/dashboard`,
  specialist vs company step-3 fields) MUST still pass
- AND `npm run build`, `npm run lint:tokens`, and `npm run test:unit` MUST pass
