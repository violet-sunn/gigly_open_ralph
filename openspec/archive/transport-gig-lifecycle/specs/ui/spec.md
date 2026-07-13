# UI — Gig Lifecycle (delta)

> Reconciles the existing gig-lifecycle screens (already built on the prototype's inline-styled markup + `tokens.css`) to the captured reference in `design-reference/screens/`. See the proposal's reference-mapping table. All `app/actions/gig.ts` actions and the gig status machine are preserved.

## ADDED Requirements

### Requirement: Gig Detail Reconciled To Reference (All Role × Status States)
`app/(protected)/gigs/[id]/GigDetail.tsx` (this exact filename — NOT a new `*Design` variant) MUST match the captured gig-detail reference for EVERY role × status combination, preserving the `GigDetailData` wiring and the inline action blocks.

#### Scenario: Each role × status state matches its captured reference
- **GIVEN** the rendered `GigDetail` for a given role and gig status
- **WHEN** compared to the matching `design-reference/screens/gigDetail.{specialist,company}.<status>` (all 7 statuses per role: открыт / на рассмотрении / в работе / на проверке / завершён / оплачен / отклонён, plus `gigDetail.specialist.открыт-applied`)
- **THEN** the two-column layout MUST match: col1 (header title/status/meta + bio + criteria/requirements) and col2 (the «УСЛОВИЯ» conditions panel with Срок/Бюджет grotesk numerics, the owner-only fee breakdown, and the chat/action area)
- **AND** static copy MUST be the prototype's verbatim text

#### Scenario: Role × status action rail matches and stays wired
- **GIVEN** a SPECIALIST or COMPANY viewer at a given status
- **WHEN** the action rail renders
- **THEN** it MUST present the correct affordances per the reference: SPECIALIST → apply form (canApply) / applied state (PENDING) / withdraw / submit-work (canSubmit); COMPANY → «Смотреть отклики» link (OPEN owner) / approve + return-for-revision (canApprove) / mark-paid (canPay) / the in-progress waiting notice
- **AND** the dispute link MUST appear only when not-closed, the viewer is owner or assigned specialist, the gig is assigned, and it is not an example (target `/disputes/new?gig=…`)
- **AND** the terminal states MUST render the reference notices (PAID «Гиг оплачен»; admin-closed «Гиг отклонён»)
- **AND** every action MUST remain wired to its existing `app/actions/gig.ts` action (`applyToGig` / `withdrawApplication` / `submitWork` / `approveWork` / `requestRevision` / `markAsPaid`); no action or status-machine change

### Requirement: Create Gig Reconciled To Reference
`app/(protected)/gigs/new/CreateGigDesign.tsx` MUST match `design-reference/screens/createGig.company`, preserving the `createGig` wiring and the 10% fee math.

#### Scenario: Guided brief, readiness, and fee panels match
- **GIVEN** the `/gigs/new` create screen (CLIENT)
- **WHEN** it renders and the user edits fields
- **THEN** the guided-brief sections (Что нужно сделать / Как поймём, что готово / Что важно учесть / Условия) MUST match the reference, with the criteria tag-editor and the category chip select
- **AND** the live «Готовность брифа» readiness panel MUST match (the checklist, the progress/percent, and the next-step hint)
- **AND** the «Сводка» fee panel MUST show Бюджет → Сервисный сбор (10%) → Итого к оплате computed live (`fee = floor(budget × 0.10)`, `total = budget + fee`)
- **AND** submitting MUST still call `createGig` and redirect to `/gigs/new/success` (the success screen itself is out of scope for this change)

### Requirement: Applications Reconciled To Reference
`app/(protected)/gigs/[id]/applications/ApplicationsDesign.tsx` MUST match `design-reference/screens/applications.company`, preserving the owner-gated `GigApplicationsData` wiring and the accept/reject actions.

#### Scenario: Applicant cards and accept/reject match and stay wired
- **GIVEN** the COMPANY owner on `/gigs/[id]/applications`
- **WHEN** the screen renders
- **THEN** the back link, the «Отклики» header + count + «на проект «{title}»», and each applicant card (avatar + name + verify + level + rating + status dot/label + stack tags + Подход / Уточняющие вопросы / Оценка трудозатрат) MUST match the reference
- **AND** when a specialist is assigned, the «Назначен …» banner MUST show and rejected cards MUST dim
- **AND** the «Принять» / «Отклонить» affordances MUST render only for pending applicants while none is assigned, wired to the existing `acceptApplication` (assigns + auto-rejects others) / `rejectApplication` actions

### Requirement: Gig Lifecycle Reconciliation Keeps The Suite Green
Reconciling these screens MUST keep the build, lint, and the affected E2E specs green, updating selectors only where the markup changed; no server-action changes, and `lib/view-models.ts` touched only for an additive field if a real data gap surfaces.

#### Scenario: Build, lint, and lifecycle E2E
- **GIVEN** the reconciled gig-lifecycle screens
- **WHEN** `npm run build`, `npm run lint`, and the lifecycle E2E specs (`compose-gig-detail-apply`, `compose-create-gig`, and any applications/lifecycle specs) run
- **THEN** they MUST pass, and the full gig lifecycle (create → apply → accept → submit → approve → mark-paid, plus withdraw / reject / return-for-revision) MUST still work end-to-end
- **AND** any E2E selector updates MUST be limited to the changed markup
