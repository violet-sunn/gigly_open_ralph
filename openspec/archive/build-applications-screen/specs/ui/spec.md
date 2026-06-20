# Spec delta — ui (build-applications-screen)

Adds the company **«Отклики»** screen at `/gigs/[id]/applications` (gig-scoped, owner-only), lifting the applicant list
out of the gig-detail inline owner block into its own route + a first-class `ApplicantCard` block. The accept/reject
lifecycle is reused verbatim. Token-pure (F2) + composition-pure (F5).

## ADDED Requirements

### Requirement: Company Applications Screen at /gigs/[id]/applications
The application MUST provide a company **«Отклики»** screen at `/gigs/[id]/applications`, a composition-pure
`@composed-screen` inside `AppShell`, available **only to the gig owner** (CLIENT who owns the gig). A non-owner
(specialist, other company, or unauthenticated) MUST be redirected to `/gigs/[id]` (or `/login`). The screen MUST render
a «← Назад к проекту» link to `/gigs/[id]`, a `SectionHeader` «Отклики» with the applicant count and the subtitle «на
проект «{gig.title}»», the `ApplicantCard` list, and an empty state when there are no applicants. It MUST be token-pure
(F2) and composition-pure (F5); all on-screen text MUST be Russian.

#### Scenario: The owner sees the gig-scoped applicants list
- GIVEN a CLIENT who owns a gig with applications
- WHEN they open `/gigs/[id]/applications`
- THEN the screen MUST show «Отклики» + the count + «на проект «{gig.title}»», a «← Назад к проекту» link, and an
  `ApplicantCard` per applicant
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

#### Scenario: Non-owners are redirected
- GIVEN a specialist, a non-owner company, or an unauthenticated visitor
- WHEN they request `/gigs/[id]/applications`
- THEN they MUST be redirected away (`/gigs/[id]` or `/login`) and MUST NOT see the applicants

#### Scenario: Empty state
- GIVEN an owned gig with no applications
- WHEN the owner opens the screen
- THEN it MUST render an empty state (no applicant cards)

### Requirement: ApplicantCard Block
A new `ApplicantCard` block (+ `ApplicantCardVM`) MUST render the prototype applicant card: an identity row (avatar +
name + verify-patch + level + ★ rating) with a status pill, the tech tags, and the **Подход** / **Уточняющие вопросы** /
**Оценка трудозатрат** sections. It MUST expose an actions slot (children) that the screen fills with the inline
Принять/Отклонить forms (the server-action wiring stays in the screen). The block MUST be token-pure and presentational
(no server-action imports).

#### Scenario: ApplicantCard renders identity + the three sections + an actions slot
- GIVEN an `ApplicantCardVM` (name, level, rating, tags, approach/questions/estimate, status) with action children
- WHEN it renders
- THEN it MUST show the identity row + status pill, the tags, the Подход/Уточняющие вопросы/Оценка трудозатрат sections,
  and the provided actions
- AND it MUST contain no `className=`/`style=`/hex literals beyond its kit primitives

### Requirement: Accept/Reject on the Applications Screen (Lifecycle Reused)
For a **pending** applicant the screen MUST render **Принять** and **Отклонить** wired to the existing
`acceptApplication` / `rejectApplication` actions — reused verbatim. Accept MUST assign the specialist, transition the
gig `OPEN → IN_PROGRESS`, and auto-reject the other PENDING applications (with the existing notifications). When the gig
is assigned, the screen MUST render the derived success notice «Назначен {name} — гиг переходит «В работу». Остальные
отклики отклонены автоматически.».

#### Scenario: Accept assigns and auto-rejects others
- GIVEN an owner viewing two pending applicants
- WHEN they Принять one
- THEN that application MUST become ACCEPTED, the gig MUST become `IN_PROGRESS` with the specialist assigned, and the
  other PENDING application(s) MUST become REJECTED
- AND on revisiting the screen the «Назначен {name} …» success notice MUST be shown

#### Scenario: Reject rejects one applicant
- GIVEN an owner viewing a pending applicant
- WHEN they Отклонить
- THEN that application MUST become REJECTED and the gig MUST remain OPEN

### Requirement: Gig-Detail Owner Affordance Becomes the Applications Link
The gig-detail screen MUST replace its inline owner applicant list with the prototype **«Смотреть отклики (N)»** link to
`/gigs/[id]/applications` (owner only). Gig-detail MUST NOT render the inline `ApplicationEntry` owner list anymore; every
other gig-detail flow (apply/withdraw, lifecycle, messaging, dispute) is unchanged.

#### Scenario: gig-detail links to the applications screen
- GIVEN the gig owner on `/gigs/[id]`
- WHEN it renders
- THEN it MUST show «Смотреть отклики (N)» linking to `/gigs/[id]/applications` and MUST NOT render the inline applicant
  list

### Requirement: getGigApplications View-Model
`lib/view-models.ts` MUST expose `getGigApplications(gigId, viewer)` returning the gig title, the applicant count, the
assigned state (`assignedName` when assigned), and the applicants as `ApplicantCardVM[]` — owner-gated (null/redirect
for non-owners), reusing the existing `GigDetailApplication` assembly (no new query semantics).

#### Scenario: getGigApplications is owner-gated and shaped
- GIVEN `getGigApplications(gigId, viewer)`
- WHEN the viewer owns the gig, it MUST return the title, count, assigned state, and the applicant cards
- AND WHEN the viewer does not own the gig, it MUST signal non-access (null) so the page redirects

### Requirement: Applications Screen Keeps the Suite Green
The change MUST add E2E + VM + block-render tests and update the gig-detail tests (inline list → link), keeping build,
token-purity, composition, and unit/E2E suites green.

#### Scenario: Tests green
- GIVEN `build-applications-screen.spec.ts`, `gig-applications-vm.test.ts`, `domain-blocks.test.tsx`,
  `compose-gig-detail-apply.spec.ts`
- WHEN they run
- THEN they MUST assert the owner list + accept→`IN_PROGRESS`+auto-reject + reject + non-owner redirect + empty state +
  the ApplicantCard render + the gig-detail «Смотреть отклики» link (no inline list)
- AND `npm run build`, `npm run lint:tokens`, `npm run lint:composition`, and `npm run test:unit` MUST pass

**Acceptance Criteria:**
- `/gigs/[id]/applications` (owner-only; non-owner redirected): «← Назад к проекту» + «Отклики» + count + «на проект «{title}»» + ApplicantCard list + empty state; F5-pure
- new `ApplicantCard` block + `ApplicantCardVM` (identity + status + tags + Подход/Уточняющие вопросы/Оценка трудозатрат + actions slot); fixture + render test
- accept/reject reused verbatim (accept → assign + `IN_PROGRESS` + auto-reject others + notify); derived «Назначен …» success notice
- gig-detail replaces the inline owner list with «Смотреть отклики (N)» → the screen; `getGigApplications(gigId, viewer)` owner-gated
- F2 + F5 lints green; `build` + `test:unit` + `build-applications-screen` E2E green; F1 = structural vs the prototype `applications` frame (≤1% deferred to Phase 4)
