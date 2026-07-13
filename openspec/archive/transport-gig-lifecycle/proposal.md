# transport-gig-lifecycle

**Plan:** `openspec/planning/transport-design-from-prototype.md` (change 4 of 8 — the gig lifecycle: detail × role × status, the create-gig brief, and the applications screen).

## Why

The three gig-lifecycle screens already exist and are **already built on the prototype's own inline-styled markup + `app/_design/tokens.css`** (same vocabulary as the change-3 dashboards), wired to rich view-models and the `app/actions/gig.ts` actions. But they were last grounded against Figma nodes / by-eye, not the authoritative captured reference. Now that change 1 produced `design-reference/screens/`, this change **reconciles them to the captured reference** — every gig-detail role × status variant, the create-gig brief, and the applications screen — preserving all data/action wiring.

This is a **reconcile** (diff-and-fix against the reference), NOT a rebuild and NOT a new component variant.

## Reference mapping (CRITICAL — use these exact files)

| App route / role | App component (EXISTING — reconcile in place) | Captured reference |
|---|---|---|
| `/gigs/[id]` SPECIALIST × 7 statuses + applied | `app/(protected)/gigs/[id]/GigDetail.tsx` | `gigDetail.specialist.{открыт,на-рассмотрении,в-работе,на-проверке,завершён,оплачен,отклонён}` + `gigDetail.specialist.открыт-applied` |
| `/gigs/[id]` COMPANY × 7 statuses | `app/(protected)/gigs/[id]/GigDetail.tsx` | `gigDetail.company.{открыт,на-рассмотрении,в-работе,на-проверке,завершён,оплачен,отклонён}` |
| `/gigs/new` (CLIENT) | `app/(protected)/gigs/new/CreateGigDesign.tsx` | `createGig.company.{png,html}` |
| `/gigs/[id]/applications` (COMPANY) | `app/(protected)/gigs/[id]/applications/ApplicationsDesign.tsx` | `applications.company.{png,html}` |

15 gig-detail states + 1 create + 1 applications = **17 captured states**, all present (none pending). The gig statuses (drive the panel via the VM `status`): открыт / на рассмотрении / в работе / на проверке / завершён / оплачен / отклонён.

## What

Reconcile to the captured reference, preserving all existing data/action wiring:

- **Gig detail** (`GigDetail.tsx`): diff EACH of the 15 role × status states against its captured reference and fix divergences in the two-column layout (header + bio/conditions/criteria + the col2 «УСЛОВИЯ» panel and chat) and especially the **role × status action rail** — SPECIALIST (apply / applied / withdraw / submit-work), COMPANY (view-applications / accept-flow lives on the applications screen / approve / return-for-revision / mark-paid), the dispute link (in-progress/review, assigned, non-example), and the terminal notices (paid, admin-rejected). The inline action blocks (`ApplyBlock` / `ApproveBlock` / `MarkPaidBlock` / `GigActionButton`) stay **inline** (a composed screen can't import sibling non-kit islands — see the project's inline-island constraint).
- **Create gig** (`CreateGigDesign.tsx`): diff vs `createGig.company` and fix the guided brief (Что нужно / Как поймём готово / Что важно / Условия), the live «Готовность брифа» readiness panel, and the «Сводка» fee panel (budget → 10% serviceFee → total).
- **Applications** (`ApplicationsDesign.tsx`): diff vs `applications.company` and fix the back link + header/count, the applicant cards (avatar/name/verify/level/rating/status/tags + Подход/Вопросы/Оценка fields + assigned banner + dimmed-rejected), and the accept/reject affordances.

## Constraints / Non-goals

- **Reconcile, don't rebuild; keep filenames.** `GigDetail.tsx` keeps that exact name (NOT `*Design.tsx`); do NOT create a new component variant. Keep `CreateGigDesign.tsx` / `ApplicationsDesign.tsx` as-is. Preserve the `page.tsx → VM → component` wiring and the inline action blocks.
- **No action / lifecycle changes.** All `app/actions/gig.ts` actions (`applyToGig`, `withdrawApplication`, `submitWork`, `approveWork`, `requestRevision`, `markAsPaid`, `createGig`, `acceptApplication`, `rejectApplication`) and the status machine stay exactly as they are. The 10% serviceFee/total math is unchanged.
- **Data gaps are additive only (Method §3).** Touch `lib/view-models.ts` only if the design shows a field the VM genuinely lacks (expected rare — the VMs are rich).
- **Success screen DEFERRED (user decision).** The PRD mentioned the create-gig success screen, but the prototype has NO captured success screen (it confirms publish via a `toast.success`), and the app's `/gigs/new/success` is still on the kit vocabulary. Reconciling it is **explicitly out of scope** for this change and parked for a later cleanup. The `createGig → redirect('/gigs/new/success')` flow is unchanged.
- **Dispute link is navigation only.** The dispute *screens* are change 6; here only the link target (`/disputes/new?gig=…`) and its visibility conditions are reconciled, not the dispute screens.
- **Out of scope:** dashboards/browse/my-gigs (change 3, done), chats/finance/profile (5), disputes (6), admin (7), auth (8). The gig-detail not-found fallback in `page.tsx` (a stray Tailwind block) is a minor optional cleanup, not a requirement.
- Desktop-only (1512px); reuse existing tokens; no new UI system.

## Impact

- Modifies: `app/(protected)/gigs/[id]/GigDetail.tsx`, `app/(protected)/gigs/new/CreateGigDesign.tsx`, `app/(protected)/gigs/[id]/applications/ApplicationsDesign.tsx` (+ their inline sub-blocks).
- Possibly: `lib/view-models.ts` only if a real data gap surfaces.
- No data-model or server-action changes. Existing E2E for these routes (`compose-gig-detail-apply`, `compose-create-gig`, plus any applications/lifecycle specs) must stay green; selectors updated only where markup changed.
