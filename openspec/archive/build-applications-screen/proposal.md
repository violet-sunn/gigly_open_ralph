# build-applications-screen

**Type:** Regular change (UI / new screen — company «Отклики», lifted from the gig-detail inline list)
**Created:** 2026-06-20
**Plan:** `openspec/planning/full-design-reground.md` — Phase 3 (authored fresh from the prototype)
**Capability:** `ui`
**Depends on:** `reconcile-gig-detail-apply` (archived — it flagged «Смотреть отклики (N)» as the owner affordance and
deferred the dedicated screen to this change), `add-bio-block` (archived). The accept/reject server actions + the owner
applicant VM already exist.

## Why

The prototype has a dedicated company **«Отклики»** screen (`ROUTES.md` L18/L39; `Gigly App.dc.html` ~L1115–1184) — a
**gig-scoped** applicants list reached from gig-detail's **«Смотреть отклики (N)»** (`openApplications`) button. Today
that applicant list is **embedded inline in gig-detail** (`GigDetail.tsx` ~L250–258, owner-only `ApplicationEntry`
list). This change **lifts it into its own route** and turns gig-detail's owner affordance into the prototype's link.

The prototype «Отклики» screen is:
- a **«← Назад к проекту»** back-link, then a header **«Отклики»** + a count badge + the subtitle **«на проект
  «{gig.title}»»**;
- when the gig is assigned, a success notice **«Назначен {name} — гиг переходит «В работу». Остальные отклики отклонены
  автоматически.»**;
- a list of **applicant cards** — each: avatar + name + verify-patch + level tag + ★ rating + a status pill, the tech
  tags, then **Подход** / **Уточняющие вопросы** / **Оценка трудозатрат**, and for a pending applicant the **Принять** /
  **Отклонить** actions.

The accept/reject **lifecycle already exists and is correct** (`acceptApplication` assigns the specialist, gig
`OPEN → IN_PROGRESS`, auto-rejects the other PENDING applications + notifies; `rejectApplication` rejects one). This
change **reuses them verbatim** — it only moves the *presentation* to a dedicated route and adds a first-class
`ApplicantCard` block.

## What

- **New route `/gigs/[id]/applications`** (`app/(protected)/gigs/[id]/applications/`) — a company-owner-only,
  F5-pure `@composed-screen` inside `AppShell`: a «← Назад к проекту» link (→ `/gigs/[id]`), a `SectionHeader` «Отклики»
  with the count + the «на проект «{title}»» subtitle, a derived success `Notice` when the gig is assigned, the
  `ApplicantCard` list, and an empty state when there are no applicants.
- **New `ApplicantCard` block** (+ `ApplicantCardVM`) — canonicalizes the prototype's repeated applicant card: a `Bio`/
  identity row (avatar + name + verify + level + rating) + a status pill, the tech tags, and the **Подход / Уточняющие
  вопросы / Оценка трудозатрат** sections, with an **actions slot** (`children`) the screen fills with the inline
  Принять/Отклонить forms (the action wiring stays in the screen — `compose-screen-inline-islands`). Presentational +
  token-pure; render-tested from a fixture.
- **New VM `getGigApplications(gigId, viewer)`** — **owner-gated** (returns null / the page redirects to `/gigs/[id]`
  for non-owners): the gig title, the applicant count, the assigned state (`assignedName` when assigned), and the
  applicants as `ApplicantCardVM[]` (reusing the existing `GigDetailApplication` assembly — names, ratings, level, tags,
  approach/questions/estimate, status). No new query semantics.
- **gig-detail change** — replace the inline owner applicant list (`ApplicationEntry` + `Отклики: N` notice) with the
  prototype **«Смотреть отклики (N)»** link → `/gigs/[id]/applications`. The owner's accept/reject now live on the
  dedicated screen; every other gig-detail flow is unchanged.
- **Reuse `acceptApplication` / `rejectApplication` verbatim** — no changes to the actions, the lifecycle, the
  auto-reject, or the notifications.

No screen carries off-token literals (F2) or bespoke markup (F5). All on-screen text is Russian, exactly as the
prototype shows it.

## Key facts / decisions (derived from the prototype)

- **The screen is gig-scoped → `/gigs/[id]/applications`** (the «на проект «{title}»» subtitle + the «← Назад к проекту»
  back-link + the gig-detail «Смотреть отклики (N)» entry point). It is NOT a top-level cross-gig inbox.
- **Company-owner-only.** Non-owners (specialists, other companies) are redirected to `/gigs/[id]` — the page is gated
  exactly like the existing owner applicant list.
- **Accept/reject are reused verbatim.** `acceptApplication` already assigns + sets `IN_PROGRESS` + auto-rejects others +
  notifies, and redirects to `/gigs/[id]`. **Decision:** the redirect is left as-is (lands on the now-in-progress gig
  hub); the prototype's in-place success notice is **derived** on the applications screen from the assigned gig state
  (shown on revisit), not produced by changing the shared action's redirect. This keeps the action contract + its tests
  intact. (Flagged in tasks.)
- **`ApplicantCard` is a justified new block** — the prototype's applicant card is a distinct, repeated design element;
  a first-class block (with a fixture + render test) is cleaner than re-inlining markup. Its action slot keeps the
  server-action wiring in the screen (F5).
- **F1 baselines on the prototype frame** (`Gigly Развёртка.dc.html` applications); fonts resolved. F1 =
  structural/overlay match; the absolute ≤1% gate is Phase 4 (`refidelity-from-full-design`).

## Scope

- **New screen:** `app/(protected)/gigs/[id]/applications/page.tsx` (server, owner-gated, fetches `getGigApplications`) +
  `Applications.tsx` (`@composed-screen`).
- **New block:** `app/components/blocks/ApplicantCard.tsx` + `ApplicantCardVM` (in `view-models.ts`) + barrel export +
  a fixture.
- **Data layer:** `lib/view-models.ts` — `getGigApplications(gigId, viewer)` (reuses the `GigDetailApplication` mapping).
- **gig-detail:** `app/(protected)/gigs/[id]/GigDetail.tsx` — replace the inline owner list with the «Смотреть отклики
  (N)» link; drop the `ApplicationEntry` owner block from gig-detail.
- **Tests:** `__tests__/e2e/build-applications-screen.spec.ts` (owner sees the «Отклики» list with approach/questions/
  estimate + accept → gig `IN_PROGRESS` + others auto-rejected + the assigned notice on revisit; reject; non-owner
  redirected; empty state); `__tests__/integration/gig-applications-vm.test.ts` (`getGigApplications` owner-gated shape);
  `__tests__/unit/components/domain-blocks.test.tsx` (ApplicantCard render); update `compose-gig-detail-apply.spec.ts`
  (gig-detail now shows the «Смотреть отклики» link, not the inline list).
- **Docs:** the note in `docs/DESIGN_SYSTEM_SPEC.md`; check the Phase-3 item in `full-design-reground.md`.

## Non-goals

- Changing `acceptApplication` / `rejectApplication`, the gig lifecycle, the auto-reject, or the notifications.
- A top-level cross-gig applications inbox (the prototype screen is per-gig).
- The absolute F1 ≤1% pixel gate (Phase 4).

## References

`gigly_full_design/Gigly App.dc.html` (the `applications` screen ~L1115–1184: «← Назад к проекту» L1118, «Отклики» +
count L1122–1123, «на проект «{title}»» L1125, the assigned notice L1128–1133, the applicant cards L1135–1182; the
gig-detail «Смотреть отклики (N)» L573 / `openApplications` L2158); `ROUTES.md` L18/L39. The current `GigDetail.tsx`
owner list (`ApplicationEntry` ~L163–183, list ~L250–258) + `AcceptRejectActions`; `lib/view-models.ts`
`GigDetailApplication` (L452–465) + its assembly in `getGigDetail` (L617–636); `acceptApplication` / `rejectApplication`
(`app/actions/gig.ts`); blocks `Bio`/`ProfileCard`/`RequirementCard`/`StatusBadge`/`Notice`/`SectionHeader`.
