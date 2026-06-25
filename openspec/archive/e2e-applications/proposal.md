# e2e-applications

## Why

Reconciliation change #7 of the E2E reconciliation plan (`openspec/planning/e2e-reconciliation.md`). The company «Отклики» screen at `/gigs/[id]/applications` was rebuilt on the `gigly_full_design` prototype (`app/(protected)/gigs/[id]/applications/ApplicationsDesign.tsx`), wired to `getGigApplications` → `GigApplicationsData`.

Unlike the earlier reconciliation targets, `build-applications-screen.spec.ts` was **already authored against the rebuilt design** (it asserts «Отклики», «на проект «{title}»», «← Назад к проекту», «Подход», «Оценка трудозатрат», «Принять», the «Назначен … — гиг переходит «В работу»» banner, «Откликов пока нет.», and the gig-detail «Смотреть отклики (N)» `<button>` — all of which exist in the current component). So there is **no kit DOM to tear down here**. What the spec is missing is **coverage breadth**: it does not assert the full applicant-card anatomy the prototype renders and the PRD enumerates — the experience `[level]`, the rating row, the derived status «На рассмотрении» (PENDING → `review` in `APPLICATION_STATUS`), the stack tags, the «Уточняющие вопросы» field, and the «Отклонить» action that sits beside «Принять» on pending applicants.

This change brings the spec up to the same fidelity bar as the other reconciled screens: every element the owner sees on the rebuilt «Отклики» card is asserted, so a future regression in `ApplicationsDesign` (e.g. dropping the level/status/tags or the reject button) is caught.

## What Changes

- **BROADEN `build-applications-screen.spec.ts`** against `ApplicationsDesign.tsx` (no behavioural/app change):
  - Expand the owner-cards test to assert the full applicant card: the specialist name, the `[level]` chip (e.g. `[SENIOR]`), the rating row, the derived status **«На рассмотрении»**, the **stack tags** (e.g. «React»/«TypeScript»), and all three fields **«Подход» / «Уточняющие вопросы» / «Оценка трудозатрат»**.
  - Assert **both** pending actions — «Принять» **and** «Отклонить» — are present on a pending applicant.
  - Keep and make explicit the existing coverage: the «Отклики» heading + count, the «на проект «{title}»» subtitle, the «← Назад к проекту» link, the gig-detail «Смотреть отклики (N)» `<button>` → `/gigs/[id]/applications`, the «Принять» accept flow (gig → `IN_PROGRESS`, others auto-rejected, the «Назначен …» banner on revisit), the non-owner redirect, and the «Откликов пока нет.» empty state.
- Reuse the existing harness (`setE2ESession` + direct Prisma seeding into `file:./test.db`) and the existing two-applicant seed (one SENIOR/`React,TypeScript`, one MIDDLE/`Go`) — it already provides the data the broadened assertions need.

## Impact

- **Affected:** `__tests__/e2e/build-applications-screen.spec.ts` only.
- **Not touched:** `app/`/`lib/` behaviour (`ApplicationsDesign.tsx`, `getGigApplications`, `acceptApplication`/`rejectApplication`, `GigDetail.tsx`); the unit/integration suite (951/951 — must stay green); the canonical testing spec's documentary stance on per-screen E2E.
- **Plan:** advances `openspec/planning/e2e-reconciliation.md` from 6/16 → 7/16.
