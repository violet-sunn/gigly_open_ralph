# testing — e2e-journeys-and-greenup delta

## MODIFIED Requirements

### Requirement: End-to-end journey + error-scenario E2E coverage on the rebuilt screens

The E2E suite SHALL verify the full gig lifecycle end-to-end (`client-journey`, `specialist-journey`) and the error/ACL scenarios (`error-scenarios`) against the rebuilt screens (`CreateGigDesign`, `GigDetail`, `ApplicationsDesign`) over the **unchanged** gig-lifecycle actions and Gig schema — rather than the old kit DOM. The journeys MUST drive the rebuilt flow: create-gig via the `CreateGigDesign` fill (category chip + criteria editor populate the hidden `input[name="category"]`/`input[name="acceptanceCriteria"]`; submit «Опубликовать гиг» → redirect `**/gigs/new/success`), **accept on `/gigs/[id]/applications`** via «Принять» (not on gig-detail), approve via «Принять работу», and mark-paid via «Отметить как оплаченный»; the apply form MUST use `input[name="estimatedEffort"]` and submit via «Отправить заявку». `error-scenarios` MUST NOT reference the non-existent Gig fields `workSubmittedAt`/`completedAt` (the `status` value — `REVIEW`/`COMPLETED`/`PAID` — encodes the same state) and MUST use the rebuilt action labels. After the rewrites, the **whole** suite (`npm run clean:test-db && npm run test:e2e`) MUST report 0 failures, including every PASS-AS-IS spec. App/lib behaviour (the lifecycle actions, the rebuilt screens, the Gig schema) MUST NOT change.

#### Scenario: the client journey completes create → accept → approve → mark-paid

- **GIVEN** a seeded CLIENT signed in (cookie via `createTestSession`/`setE2ESession`), seed in `file:./test.db`
- **WHEN** the client creates a gig through `CreateGigDesign` (title, category chip, description, goal, deliverables, a criteria-editor entry, budget, deadline) and submits «Опубликовать гиг»
- **THEN** the app redirects to `**/gigs/new/success` and the gig exists with `status='OPEN'` and the 10% serviceFee math (budget → serviceFee → totalAmount)
- **WHEN** a seeded SPECIALIST application (programmatic) is present and the client opens `/gigs/[id]/applications` and clicks «Принять»
- **THEN** the gig becomes `IN_PROGRESS` with `assignedSpecialistId` set and the application `ACCEPTED`
- **WHEN** the specialist's work is submitted (programmatic `status='REVIEW'`), the client approves via «Принять работу», then marks paid via «Отметить как оплаченный»
- **THEN** the gig reaches `status='PAID'` with `paidAt` truthy

#### Scenario: the specialist journey completes browse → apply

- **GIVEN** a seeded OPEN gig and a seeded SPECIALIST signed in
- **WHEN** the specialist browses `/gigs`, opens the gig card, and submits an application via the rebuilt apply form (`textarea[name="approach"]`, `textarea[name="questions"]`, `input[name="estimatedEffort"]`, «Отправить заявку»)
- **THEN** a `PENDING` application is created with the submitted `approach`/`questions`/`estimatedEffort`
- **AND** the programmatic accept → submit → approve steps drive the gig to `COMPLETED` with the application `ACCEPTED`

#### Scenario: error-scenarios use the real schema and rebuilt labels

- **GIVEN** the ACL/redirect and invalid-transition scenarios
- **THEN** the spec references NO `workSubmittedAt`/`completedAt` (it asserts `status` instead) and seeds gigs without those fields
- **AND** the stale English labels are replaced: «Отправить заявку» (apply), «Принять работу» (approve), «Отметить как оплаченный» (mark paid), and a non-assigned specialist does NOT see the «Сдать работу на проверку» submit-work control
- **AND** the unauthenticated-redirect and role-based-access scenarios still pass against the rebuilt routes

#### Scenario: the whole E2E suite runs deterministically (isolation fixed; residual flagged)

- **WHEN** `npm run clean:test-db && npm run test:e2e` runs the entire `__tests__/e2e` suite
- **THEN** the shared-DB FK-cleanup cascade is gone (the FK-safe `resetE2EDb()` is used by every legacy destructive-cleanup spec), reducing failures from 47 to 13
- **AND** the three rewritten specs and every isolation-fixed spec pass
- **AND** the residual failures are exactly the pre-existing PASS-AS-IS content drift that also fails in isolation on a clean db — the auth/register-wizard cluster (`auth-flow`, `auth-navigation`, `compose-auth-onboarding`), `csrf-protection` (stale create-gig fill), and `gig-browse-access` (old-kit UI) — which are **flagged** in `openspec/planning/e2e-greenup-residual.md` for a follow-up, not fixed in this change (user decision)
- **AND** no `app/`/`lib/` behaviour changed
