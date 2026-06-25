# testing — e2e-disputes delta

## MODIFIED Requirements

### Requirement: Disputes flow E2E coverage

The E2E suite SHALL verify the rebuilt disputes flow — `DisputesDesign` (`/disputes`), `DisputeDetailDesign` (`/disputes/[id]`), and `NewDisputeDesign` (`/disputes/new?gig=<id>`), each in `app/(protected)/disputes/`) over the **unchanged** `lib/disputes.ts` view models and the `openDispute` / `resolveDispute` actions — rather than the removed kit `DisputeList` / `DisputeDetail` DOM. The specs MUST reach the open-dispute screen from the gig-detail entry by its **text** «Открыть спор» (a clickable `<div>` «Возникли разногласия? Открыть спор», not a `role=button`); MUST assert the empty state **«Открытых споров нет»** (not «Споров нет»); MUST assert the detail's open-status label **«Открыт»** (not «Заморожено») and the timeline header **«Ход рассмотрения»** (not «Хронология»); MUST resolve a dispute by clicking one of the three **«Решение модератора»** verdict buttons directly (no `textarea[name="resolution"]`, no «Разрешить спор» button); and MUST NOT assert the participant reply composer (intentionally omitted) or the kit sidebar active class `bg-surface-level-3` (removed in the rebuilt shell). App/lib behaviour (the three components, `lib/disputes.ts`, `openDispute`, `resolveDispute`) MUST NOT change.

#### Scenario: open a dispute from a gig → the «Открыть спор» screen → it lists

- **GIVEN** an IN_PROGRESS gig «E2E Open-From-Gig …» between the seeded CLIENT and assigned SPECIALIST, with the CLIENT signed in, seeded into `file:./test.db`
- **WHEN** the client opens the gig and clicks the dispute entry by text `/Открыть спор/`
- **THEN** the URL matches `/disputes/new?gig=<gigId>`
- **WHEN** they fill `textarea[name="description"]` and click the **«Открыть спор»** submit button
- **THEN** `openDispute` redirects to `**/gigs/**`
- **AND** visiting `/disputes` shows the gig title «E2E Open-From-Gig»

#### Scenario: an admin resolves a dispute via a verdict button → «Завершён»

- **GIVEN** an OPEN dispute on a seeded gig and the ADMIN signed in, viewing `/disputes/[id]`
- **WHEN** the admin clicks the verdict button **«В пользу заказчика»** in the «Решение модератора» panel
- **THEN** `resolveDispute` redirects to `**/gigs/**`
- **WHEN** the admin reopens `/disputes/[id]`
- **THEN** the status **«Завершён»** is visible
- **AND** the resolution text «В пользу заказчика …» is visible (`.first()` — it appears in both the resolution banner and the moderator timeline entry)

#### Scenario: a participant sees their dispute read-only — no moderator panel

- **GIVEN** a seeded read-only dispute opened by the CLIENT, with the CLIENT signed in
- **WHEN** the client visits `/disputes/[id]`
- **THEN** the gig title and the dispute reason text render
- **AND** the «Решение модератора» panel and its verdict buttons (e.g. «В пользу специалиста») are absent (count 0)

#### Scenario: a non-participant cannot reach the dispute detail

- **GIVEN** the seeded read-only dispute and a non-participant SPECIALIST signed in
- **WHEN** the outsider visits that dispute's `/disputes/[id]`
- **THEN** the page 404s — the dispute reason text is absent (count 0)

#### Scenario: a user with no disputes sees the empty state

- **GIVEN** a SPECIALIST with no disputes signed in
- **WHEN** they visit `/disputes`
- **THEN** the empty state **«Открытых споров нет»** is visible

#### Scenario: the open-dispute screen is participant-gated (reconcile-disputes-flow)

- **GIVEN** an IN_PROGRESS gig «RDF Open Gig» between the seeded CLIENT and assigned SPECIALIST
- **WHEN** the participant CLIENT visits `/disputes/new?gig=<gigId>`
- **THEN** the subtitle «по проекту «RDF Open Gig»» and the reason option «Результат не соответствует ТЗ» are visible
- **WHEN** the non-participant SPECIALIST visits the same URL
- **THEN** the URL is redirected to `/disputes`

#### Scenario: the detail renders the timeline and evidence (reconcile-disputes-flow)

- **GIVEN** a seeded OPEN dispute with `evidence='ТЗ.pdf,переписка.png'` and a company timeline entry, with a participant signed in
- **WHEN** they visit `/disputes/[id]`
- **THEN** the open-status label **«Открыт»** is visible
- **AND** the **«Доказательства»** header and the chip «ТЗ.pdf» are visible
- **AND** the **«Ход рассмотрения»** timeline header and the company entry text are visible

#### Scenario: an admin verdict writes the prefixed resolution (reconcile-disputes-flow)

- **GIVEN** the seeded OPEN dispute and the ADMIN signed in on `/disputes/[id]`
- **WHEN** the admin clicks the verdict button **«В пользу специалиста»**
- **THEN** `resolveDispute` redirects to `**/gigs/**`
- **WHEN** the admin reopens `/disputes/[id]`
- **THEN** the status **«Завершён»** is visible
- **AND** the resolution «В пользу специалиста — Спор разрешён в пользу специалиста.» is visible (`.first()`)
