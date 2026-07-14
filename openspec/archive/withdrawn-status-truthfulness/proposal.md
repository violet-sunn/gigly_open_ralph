# Change: withdrawn-status-truthfulness

## Why

Stress-test Round 2 (Гигли баги.pdf) surfaced two related display defects that make a **withdrawn application read as if the specialist were rejected or stuck** — even though the underlying state machine is already correct (fixed in Round 1). This is a **display-layer truthfulness** problem: the data says «Отозвано», the UI says «Отклонён» / «На рассмотрении».

**Bug #2 — Dashboard shows «Отклонён» for a withdrawn application.**
On «Мои гиги», `getSpecialistDashboard` (lib/view-models.ts ~L286–290) collapses `REJECTED`, `WITHDRAWN`, and `WITHDRAWN_FINAL` into a single archived card with a hardcoded `status: 'rejected'`, which renders the red «Отклонён» badge. The correct «Отозвано» label already exists in the `APPLICATION_STATUS` map (view-models.ts:508) but is unused on the dashboard. Confirmed live: apply → withdraw → dashboard shows «Отклонён», never «Отозвано» (obs 6278, 6367).

**Bug #1 (display half) — Gig detail shows a bare «На рассмотрении» after withdrawal.**
After withdrawing, the gig-detail top status badge still reads «На рассмотрении» — but that is the **gig's derived status** (an OPEN gig with other applicants), not the viewer's own state. There is no per-viewer signal that **this** specialist withdrew and may re-apply. The re-apply form is in fact present (Round 1 mechanic fix), but with the generic «Ваш отклик» heading and a «На рассмотрении» badge above it, the screen reads as "stuck, can't re-apply" (obs 6277, 6368).

This change makes the withdrawn state **read truthfully** in both surfaces. It is **display-layer only** — no state-machine, server-action, or schema changes. The Round-1 re-apply mechanic and the existing `WITHDRAWN_FINAL` «повторный отклик недоступен» notice are **not touched**.

## What Changes

1. **Specialist dashboard archived cards** (lib/view-models.ts, `getSpecialistDashboard` ~L286–290): map each terminal application state to its own label instead of a blanket `'rejected'`:
   - `REJECTED` → «Отклонён» (red) — unchanged
   - `WITHDRAWN` → «Отозвано»
   - `WITHDRAWN_FINAL` → «Отозвано (окончательно)»

2. **Gig detail per-viewer withdrawn state** (lib/view-models.ts `getGigDetail` viewer-application mapping; app/(protected)/gigs/[id]/GigDetail.tsx): when the viewing specialist's own application is `WITHDRAWN`, show a clear per-viewer signal («Вы отозвали отклик» + the re-apply affordance) that is **visually distinct from** the gig's derived «На рассмотрении» badge, so their own status is unambiguous. The existing `WITHDRAWN_FINAL` «Отозвано — повторный отклик недоступен» notice is kept as-is.

### Non-Goals

- No changes to the withdrawal/re-apply state machine, `withdrawApplication`, or `applyToGig` (Round 1 already correct).
- No changes to the `WITHDRAWN_FINAL` notice copy or behaviour.
- No schema or server-action changes.
- Does not address the other Round-2 defects (#3–#9) — tracked separately.

## Impact

- **Affected specs:** `gig` (MODIFIED: Gig Detail Application UI States; ADDED: Specialist Dashboard Archived-Card Status Labels).
- **Affected code:**
  - `lib/view-models.ts` — `getSpecialistDashboard` archived-card status mapping (~L286–290); `getGigDetail` viewer-application state (already exposes `viewerApplication.status`; may need a derived per-viewer flag for the UI).
  - `app/(protected)/gigs/[id]/GigDetail.tsx` — add a `WITHDRAWN` per-viewer notice branch above/around the re-apply form, distinct from the derived stage badge.
- **Risk:** Low — read-time display mapping only; backward compatible (existing archived `REJECTED` cards unchanged).
