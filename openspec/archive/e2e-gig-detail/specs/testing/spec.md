# Testing Specification Delta

## ADDED Requirements

### Requirement: Gig-Detail Reconciled E2E Coverage

The E2E suite SHALL verify the rebuilt `/gigs/[id]` screen (`app/(protected)/gigs/[id]/GigDetail.tsx`) against its current `gigly_full_design` markup — using the Prisma-seed (`file:./test.db`) + `setE2ESession` harness — covering the apply, withdraw, owner-accept, submit, and example-gate flows with the screen's **current** Russian labels. The specs SHALL select the apply fields by `name` (`approach`/`questions`/`estimatedEffort`), SHALL NOT assert any embedded chat composer, «Файлы» section, breadcrumb, or kit `role="tab"` conditions, and SHALL NOT reference deleted kit components.

#### Scenario: A SPECIALIST applies and can withdraw

- **Given** a seeded OPEN gig and an authenticated SPECIALIST who has not applied
- **When** they open `/gigs/[id]`, fill `textarea[name="approach"]` + `textarea[name="questions"]`, and click `«Отправить заявку»`
- **Then** the screen SHALL show `«Заявка отправлена ✓»` and a `«Отозвать заявку»` control
- **And** clicking `«Отозвать заявку»` SHALL remove that control (the PENDING application is withdrawn)

#### Scenario: The owner sees the fee breakdown and routes to the applications screen

- **Given** an authenticated CLIENT who owns a gig with a PENDING application
- **When** they open `/gigs/[id]`
- **Then** the owner-only `«Сервисный сбор (10%)»` breakdown SHALL be visible
- **And** `«Смотреть отклики»` SHALL navigate to `/gigs/[id]/applications`, where accepting the applicant returns to the gig-detail showing `«В работе»`

#### Scenario: The assigned specialist submits work

- **Given** an authenticated SPECIALIST assigned to an IN_PROGRESS gig
- **When** they open `/gigs/[id]` and click `«Сдать работу на проверку»`
- **Then** the status SHALL become `«На проверке»`

#### Scenario: Example gigs cannot be applied to

- **Given** an authenticated SPECIALIST on an example gig (`isExample = true`)
- **When** they open `/gigs/[id]`
- **Then** no `«Отправить заявку»` button SHALL render (the apply form is gated server-side by `lifecycle.canApply`)

#### Scenario: Section content renders

- **Given** a seeded gig with structured requirements and criteria
- **When** the gig-detail loads
- **Then** `«Технические требования»`, `«Критерии успеха»`, `«Бюджет проекта»`, and `«Срок выполнения»` SHALL all be visible

## REMOVED Requirements

### Requirement: Gig-Detail Embedded-Chat E2E Coverage

**Reason for removal:** The rebuilt `/gigs/[id]` (`GigDetail.tsx`) embeds **no** message composer — the old `compose-gig-detail-apply.spec.ts` "messaging works once a specialist is assigned" test drove a `textbox «Сообщение»` that no longer exists. Messaging was moved to the dedicated `/chats` screen; that coverage is owned by change #9 (`e2e-chats`), not replaced here.

The platform previously SHALL have verified that an assigned participant could send a message from an inline composer on the gig-detail screen and see it appear in the thread.

#### Scenario: Inline gig-detail message round-trips

- **Given** an assigned specialist on an IN_PROGRESS gig's detail page
- **When** they type into the `«Сообщение»` composer and submit
- **Then** the message appears in the gig-detail thread

> Removed: the gig-detail no longer embeds chat; messaging lives at `/chats` (change #9).

---

### Requirement: Kit-Era Withdrawal/Archive E2E Coverage

**Reason for removal:** `application-withdrawal.spec.ts` asserted the **kit** UI — the `/register` → role-radio → `/login` flow, English labels (`Apply to Gig`, `Withdraw Application`, `WITHDRAWN`, `Withdrawn on`, `Accept`/`Reject`), the dashboard `Archive` tab, and a client-side withdrawn-application list on the gig-detail. None of these exist in the rebuilt Russian UI. The withdrawal interaction is re-expressed against the rebuilt gig-detail (`«Заявка отправлена ✓»` / `«Отозвать заявку»`) under the reconciled coverage above; owner-facing applicant state lives on the `/applications` screen (change #7).

The platform previously SHALL have verified, via the registration flow and English labels, that a specialist could withdraw a PENDING application, see a `WITHDRAWN`/`Withdrawn on` badge and an `Archive`-tab entry, and that the client saw `WITHDRAWN` in the applications list with no `Accept`/`Reject` controls.

#### Scenario: Specialist withdraws and sees the kit WITHDRAWN/Archive state

- **Given** a specialist with a PENDING application (reached via `/register` + English-labelled apply)
- **When** they click `Withdraw Application`
- **Then** a `WITHDRAWN` badge and an `Archive`-tab entry appear

> Removed: kit registration flow, English labels, `WITHDRAWN`/`Archive` UI, and the gig-detail client-side application list no longer exist. The withdrawal flow is covered against the rebuilt gig-detail; owner-side applicant state is change #7's `/applications` screen.
