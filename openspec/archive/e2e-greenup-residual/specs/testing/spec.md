# testing — e2e-greenup-residual delta

## MODIFIED Requirements

### Requirement: Flagged PASS-AS-IS specs reconciled to the rebuilt auth/create-gig/browse screens

The E2E specs flagged by the #16 greenup SHALL assert the rebuilt screens rather than their drifted content, so the **whole** suite runs at 0 failures. Specifically: the auth specs MUST walk the composed `RegisterWizard` using its real step-3 submit label **«Продолжить»** (not «Зарегистрироваться»; the `/auth` register navigation CTA «Зарегистрироваться» is unchanged) and MUST assert the migrated `/login` role-card border **`rgb(0, 136, 255)`** (not the pre-migration `rgb(2, 101, 220)`); `csrf-protection` MUST create a gig through the rebuilt `CreateGigDesign` (criteria editor → hidden `acceptanceCriteria`), not by filling a `textarea[name="acceptanceCriteria"]`; and `gig-browse-access` MUST assert the surviving `/gigs/examples` route + the rebuilt `/gigs` gating/heading, not the dropped create-form example link. App/lib behaviour (`RegisterWizard`, `CreateGigDesign`, `/gigs`, `/gigs/examples`, `registerUser`, `createGig`) MUST NOT change.

#### Scenario: the register wizard walk completes via «Продолжить»

- **GIVEN** `/register?role=CLIENT` (or SPECIALIST), the composed `RegisterWizard`
- **WHEN** a spec walks role → «Далее» → credentials (email/password/confirm) → «Далее» → profile → the step-3 submit
- **THEN** the step-3 submit button is **«Продолжить»** and clicking it posts to `registerUser` and lands on `**/dashboard`
- **AND** the authenticated-user redirect tests (`/auth`, `/login`, `/register` → `/dashboard`) pass because the wizard walk that creates their session now succeeds

#### Scenario: the /login role card asserts the migrated border color

- **GIVEN** `/login?role=SPECIALIST`
- **WHEN** `auth-flow` asserts the role-card `border-color`
- **THEN** the expected value is **`rgb(0, 136, 255)`** (matching `auth-navigation`'s passing assertions), not `rgb(2, 101, 220)`

#### Scenario: csrf-protection creates a gig via the rebuilt brief

- **GIVEN** a seeded CLIENT signed in on `/gigs/new` with the `programming` category seeded
- **WHEN** the spec fills the `CreateGigDesign` brief (title, category chip «Программирование», description, criteria editor «Добавить», budget) and submits «Опубликовать гиг»
- **THEN** the same-origin server action creates the gig (queryable by title, `budget > 0`) — no `textarea[name="acceptanceCriteria"]` fill remains

#### Scenario: gig-browse-access asserts the surviving examples/browse behaviour

- **GIVEN** the rebuilt `/gigs` (SPECIALIST) and the surviving `/gigs/examples` route
- **WHEN** the spec exercises CLIENT vs SPECIALIST browse access and the examples page
- **THEN** it asserts the rebuilt `/gigs` heading/gating and reaches `/gigs/examples` directly (the dropped «View example gigs for inspiration» create-form link is no longer required), or the test is removed with a recorded rationale if the gating/examples affordance was removed by design (user decision)
- **AND** the unauthenticated-redirect scenario (`/gigs`, `/gigs/examples` → `/login`) continues to pass

#### Scenario: the whole E2E suite is green

- **WHEN** `npm run clean:test-db && npm run test:e2e` runs the entire suite
- **THEN** there are **0 failures** — the five reconciled specs plus every other spec pass, and the #16 FK-safe isolation still holds
- **AND** no `app/`/`lib/` behaviour changed
