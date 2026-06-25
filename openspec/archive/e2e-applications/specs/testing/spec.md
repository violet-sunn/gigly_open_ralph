# Testing Specification Delta

## ADDED Requirements

### Requirement: Applications Screen Reconciled E2E Coverage

The E2E suite SHALL verify the rebuilt company «Отклики» screen at `/gigs/[id]/applications` (`app/(protected)/gigs/[id]/applications/ApplicationsDesign.tsx`, wired to `getGigApplications`) against its current `gigly_full_design` markup — using the Prisma-seed (`file:./test.db`) + `setE2ESession` harness. The spec SHALL assert the **full applicant-card anatomy** the prototype renders: the specialist name, the experience `[level]` chip, the rating row, the derived status **«На рассмотрении»** (PENDING → `review`), the **stack tags**, and the three fields **«Подход» / «Уточняющие вопросы» / «Оценка трудозатрат»**; the **«Принять»** and **«Отклонить»** actions on pending applicants; the screen header **«Отклики»** + count + the **«на проект «{title}»»** subtitle; the **«← Назад к проекту»** link; the gig-detail **«Смотреть отклики (N)»** `<button>` entry point; the accept flow (assign → `IN_PROGRESS`, others auto-rejected, the **«Назначен …»** banner); the **non-owner redirect**; and the **«Откликов пока нет.»** empty state.

#### Scenario: The owner sees the full applicant card

- **Given** an authenticated CLIENT owner of an OPEN gig with two PENDING applicants (one SENIOR / `React,TypeScript`, one MIDDLE / `Go`) seeded into `file:./test.db`
- **When** they open `/gigs/[id]/applications`
- **Then** the «Отклики» heading, the «на проект «{title}»» subtitle, and the «← Назад к проекту» link SHALL be visible
- **And** the first applicant's name, its `[level]` chip (e.g. `[SENIOR]`), a rating row, the status «На рассмотрении», a stack tag (e.g. «React»), and the «Подход» / «Уточняющие вопросы» / «Оценка трудозатрат» field labels SHALL be visible

#### Scenario: Pending applicants expose Принять and Отклонить

- **Given** the owner on `/gigs/[id]/applications` with a PENDING applicant
- **When** the page renders
- **Then** both a «Принять» and an «Отклонить» button SHALL be present on the pending applicant card

#### Scenario: The gig detail links to the applications screen

- **Given** an authenticated CLIENT owner on `/gigs/[id]` for a gig with applications
- **When** they click the «Смотреть отклики (N)» button
- **Then** the browser SHALL navigate to `/gigs/[id]/applications`

#### Scenario: Принять assigns the specialist and shows the assigned banner

- **Given** the owner on `/gigs/[id]/applications` with two PENDING applicants
- **When** they click «Принять» on the first applicant
- **Then** the browser SHALL navigate to the gig detail and the gig SHALL display «В работе» (IN_PROGRESS)
- **And** revisiting `/gigs/[id]/applications` SHALL show the «Назначен … — гиг переходит «В работу»» banner

#### Scenario: A non-owner is redirected away

- **Given** an authenticated SPECIALIST (not the gig owner)
- **When** they open `/gigs/[id]/applications`
- **Then** the browser SHALL be redirected to the gig detail `/gigs/[id]`

#### Scenario: An empty gig shows the empty state

- **Given** the owner of an OPEN gig with no applications
- **When** they open `/gigs/[id]/applications`
- **Then** «Откликов пока нет.» SHALL be visible

## MODIFIED Requirements

### Requirement: Applications Screen E2E Coverage Breadth

The `build-applications-screen.spec.ts` coverage SHALL assert the **complete** rebuilt applicant card (name + `[level]` + rating + status «На рассмотрении» + stack tags + «Подход»/«Уточняющие вопросы»/«Оценка трудозатрат») and **both** pending actions («Принять» + «Отклонить»), not only a subset of fields and the accept action.

Previously the spec asserted only the name, «Подход», «Оценка трудозатрат», and «Принять» — it did not cover the `[level]` chip, the rating row, the «На рассмотрении» status, the stack tags, the «Уточняющие вопросы» field, or the «Отклонить» action, so a regression dropping any of those in `ApplicationsDesign` would pass unnoticed.

#### Scenario: The broadened card assertions catch a dropped field

- **Given** the rebuilt «Отклики» screen rendering an applicant with a level, tags, status, and all three structured fields
- **When** the spec runs
- **Then** it SHALL fail if any of `[level]`, the status «На рассмотрении», a stack tag, the «Уточняющие вопросы» field, or the «Отклонить» button is absent
