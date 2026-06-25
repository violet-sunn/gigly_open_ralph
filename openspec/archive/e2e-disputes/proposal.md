# e2e-disputes

## Why

Reconciliation change #13 of the E2E reconciliation plan (`openspec/planning/e2e-reconciliation.md`). The disputes flow was rebuilt on the `gigly_full_design` prototype's own markup over the **unchanged** dispute data layer (`lib/disputes.ts`) and actions (`openDispute` / `resolveDispute` in `app/actions/dispute.ts`):

- **`DisputesDesign.tsx`** (`/disputes`) — a «Споры» header + count badge, an intro line, then the dispute rows (avatar + gig title + `reason · opener · created` + amount + status tone), or the centred empty state **«Открытых споров нет»**. Rows route to the detail. The shell header owns the `<h1>` «СПОРЫ».
- **`DisputeDetailDesign.tsx`** (`/disputes/[id]`) — a header card (gig title + «Причина: … · открыл: …» + status pill + «Сумма по гигу» + a resolved-resolution banner), the **«Ход рассмотрения»** timeline, a **«Доказательства»** evidence chip row, and — only for an **ADMIN** on an OPEN dispute — the **«Решение модератора»** panel with **three verdict submit buttons** («В пользу специалиста» / «В пользу заказчика» / «Частичный возврат 50%»), each its own `<form>` that posts to the existing `resolveDispute`. The participant reply composer was **intentionally omitted** (no backend action yet — a known gap).
- **`NewDisputeDesign.tsx`** (`/disputes/new?gig=<id>`) — a «← Отмена» link, an amber warning banner («…по проекту «{gigTitle}»…»), then the form: reason chips under **«Причина спора»** + a **«Опишите проблему»** `textarea[name=description]` + the **«Открыть спор»** submit, wired to the (unchanged) `openDispute`. Participant-gated server-side (`getNewDisputeContext` → redirect to `/disputes` for non-participants).

Both E2E specs still assert the **old kit DOM** and are red against the rebuild:

`compose-disputes.spec.ts`:
- Test 1 reaches the open-dispute screen via `getByRole('button', { name: 'Открыть спор' })` on the gig — but the rebuilt gig-detail entry is a clickable `<div>` reading **«Возникли разногласия? Открыть спор»** (no `role=button`), so the role-match never resolves.
- Test 2 (admin resolve) fills `textarea[name="resolution"]` and clicks a **«Разрешить спор»** button — neither exists in the rebuilt admin panel, which resolves by clicking one of the **three verdict buttons** directly.
- Test 5 asserts the empty state **«Споров нет»**, but the rebuilt empty state reads **«Открытых споров нет»**.
- Test 6 asserts the sidebar «Споры» link carries the kit class `bg-surface-level-3` — that active-state class is gone in the rebuilt `AppShellDesign`.

`reconcile-disputes-flow.spec.ts`:
- Test B asserts the open-dispute status label **«Заморожено»** and the timeline header **«Хронология»** — the rebuild renders **«Открыт»** (`STATUS_LABEL_RU['open']`) and **«Ход рассмотрения»**.
- Test C selects a verdict, then types a note into `textarea[name="resolution"]` and clicks **«Разрешить спор»** — the rebuilt panel has no note field and no separate resolve button; clicking the verdict button **is** the submit, and the resolution it writes is the fixed «В пользу специалиста — Спор разрешён в пользу специалиста.» (the action prefixes the verdict onto the form's hidden `resolution`).
- Test A (participant-gating) already matches the rebuild and passes as-is.

This change rewrites the broken assertions against the rebuilt components and their stable data/action contracts. **No `app/`/`lib/` behaviour changes.**

## What Changes

- **REWRITE `compose-disputes.spec.ts`** against `DisputesDesign` / `DisputeDetailDesign` / `NewDisputeDesign` (keep the existing seed: a CLIENT «ООО Спор», a SPECIALIST «Иван Петров», an ADMIN, a non-participant SPECIALIST, an empty SPECIALIST; an IN_PROGRESS gig for the open-from-gig flow, a read-only dispute, and a resolve dispute):
  - **Open-from-gig:** click the gig-detail dispute entry by **text** (`getByText(/Открыть спор/)`), confirm the URL `/disputes/new?gig=<id>`, fill `textarea[name="description"]`, submit the **«Открыть спор»** button, wait for the `openDispute` redirect to `**/gigs/**`, then confirm the gig title lists on `/disputes`.
  - **Admin resolve:** as the ADMIN on the OPEN dispute, click the verdict button **«В пользу заказчика»** (which submits directly), wait for the `resolveDispute` redirect to `**/gigs/**`, reopen the detail and assert the status **«Завершён»** and the resolution text «В пользу заказчика …» (`.first()` — it appears in both the resolution banner and the moderator timeline entry).
  - **Participant read-only:** the CLIENT opener sees the gig title + the reason text, and the admin **«Решение модератора»** panel / verdict buttons are **absent** (replaces the stale «Разрешить спор» absence check).
  - **Non-participant 404:** the outsider's `/disputes/[id]` 404s (dispute content absent) — unchanged.
  - **Empty state:** «Открытых споров нет» (replaces «Споров нет»).
  - **Remove** the sidebar nav-active scenario (the `bg-surface-level-3` active class no longer exists in the rebuilt shell; nav-active styling is out of this screen's scope).
- **REWRITE `reconcile-disputes-flow.spec.ts`** against the rebuilt detail + admin panel (keep the existing seed: an open dispute with `openerRole`/`amount`/`evidence='ТЗ.pdf,переписка.png'` + a company timeline entry):
  - **Gating (Test A):** unchanged — the subtitle «по проекту «RDF Open Gig»», a reason option «Результат не соответствует ТЗ», and the non-participant redirect to `/disputes` all still hold.
  - **Detail timeline + evidence:** assert the open-status label **«Открыт»** (was «Заморожено»), **«Доказательства»** + «ТЗ.pdf», the **«Ход рассмотрения»** timeline header (was «Хронология»), and the company entry text.
  - **Admin verdict resolve:** click **«В пользу специалиста»** (submits directly — drop the `textarea[name="resolution"]` fill and the «Разрешить спор» click), wait for the `**/gigs/**` redirect, reopen and assert **«Завершён»** + the resolution «В пользу специалиста — Спор разрешён в пользу специалиста.» (`.first()`).
- Reuse the existing harness (`setE2ESession` + direct Prisma seeding into `file:./test.db`). **No app/lib changes** — the omitted reply composer stays omitted; the admin panel is located by its real button labels, not by added roles.

## Impact

- **Affected:** `__tests__/e2e/compose-disputes.spec.ts` and `__tests__/e2e/reconcile-disputes-flow.spec.ts` only.
- **Not touched:** `app/`/`lib/` behaviour (`DisputesDesign`/`DisputeDetailDesign`/`NewDisputeDesign`, `lib/disputes.ts`, `openDispute`/`resolveDispute`); the unit/integration suite (951/951 — must stay green).
- **Plan:** advances `openspec/planning/e2e-reconciliation.md` from 12/16 → 13/16.
