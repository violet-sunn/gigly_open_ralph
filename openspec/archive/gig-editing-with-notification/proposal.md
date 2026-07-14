# Gig Editing With Applicant Notification (edit a published gig; notify applicants on material change)

**Change:** `gig-editing-with-notification`
**Created:** 2026-07-14
**Status:** IMPLEMENTED (2026-07-14) — `updateGig` (owner-only, OPEN-only, `parseGigForm` shared with `createGig`, 10% fee recompute) + `gig_updated` fan-out to PENDING applicants (fire-and-forget, no-op-safe) + owner-only `/gigs/[id]/edit` page (EditGigDesign, pre-filled) + «✎ Редактировать» control on the owner gig detail. Verified via integration (gig-editing 19/19) + live E2E (gig-editing.spec 3/3, real browser/server/DB) + build green. No schema change.
**Planning:** `openspec/planning/prod-feedback-fixes.md` (Change 3)

## Why

Stress-testing surfaced that a client who makes a mistake in a published gig has **no way to fix it** (Заказчик #3 — a typo in the «Результаты»/deliverables field, unfixable). Today the gig lifecycle is create-only: `createGig` exists, but there is no `updateGig`, no edit form, and no «Редактировать» control on the gig detail. `project.md → Not Yet Implemented` lists «Gig editing or deletion» explicitly. The only workarounds — leave the typo or close and re-post — both lose the gig's applications and its URL.

Editing a gig that **already has applicants** is not a pure content fix: a specialist applied under the terms they saw (budget, срок, scope). If those terms change, the applicant is now considering a stale offer. So this change pairs the edit with a **notification fan-out**: on a material change, every specialist with an active (`PENDING`) application is told the gig's terms were updated, so they can re-evaluate (and, if needed, withdraw — the one-free-withdrawal rule already lets them). This is the mitigation the planning doc calls for: «do not allow silent edits».

## Decision (confirmed with user)

**Edit is allowed only while the gig is `OPEN`.** Once a specialist is assigned (`IN_PROGRESS`) or the gig has moved further (`REVIEW`/`COMPLETED`/`PAID`), editing is blocked. Rationale: terms lock once someone is working — the platform is fixed-price and models renegotiation via withdraw → re-apply, not silent edits to active work (`project.md`: «Not a bidding platform»). This is the PRD default and keeps the state machine clean (no split "typo-safe fields" model, no mid-flight budget/scope change against an assigned specialist).

## What Changes

1. **`updateGig` server action** (`app/actions/gig.ts`). New `useActionState`-compatible action `(prevState, formData)` with a hidden `gigId`. Guards, in order: authenticated → role `CLIENT` → gig exists → caller is the owner (`gig.clientId === session.userId`) → gig is `OPEN` (not `closedByAdmin`, not `isExample`). Editable fields mirror `createGig`: `title`, `description`, `goal`, `deliverables`, `constraints`, `acceptanceCriteria`, `budget` (roubles → kopecks, **recompute** `serviceFee`/`totalAmount` at 10%), `deadlineDays`, `stageCount`, `categorySlug`, `tags`. Validation is the **same gates as create** (criteria ≥ 50 chars after trim, budget > 0, deadline 1–365, stages 1–50, valid category). On success `redirect('/gigs/{gigId}')` so the corrected field renders immediately.
2. **Applicant notification fan-out.** After a successful update, if the change is **material** (any persisted editable field's stored value actually changed — budget, срок, or a scope field; a whitespace-only no-op save changes nothing → no notification), create one notification per specialist with a `PENDING` application to that gig: `type = 'STATUS_CHANGE'`, `eventType = 'gig_updated'`. Withdrawn (`WITHDRAWN`/`WITHDRAWN_FINAL`) and `REJECTED` applicants are excluded (out of the running; on an `OPEN` gig, `PENDING` is exactly the "non-withdrawn, still-live applicant" set). The editor is never notified. Fan-out uses the existing `createNotificationsBulk` fire-and-forget pattern (a notification failure MUST NOT fail the save). The notification display helper learns to render `gig_updated` («Условия гига обновлены»).
3. **Edit form + entry point.** A new owner-only edit form reuses the `CreateGigDesign` structure (guided-brief layout + readiness/fee panel), **pre-filled** from the gig's current values (acceptance criteria split back from the stored `\n`-joined string into chips; tags split from the stored comma string), submitting to `updateGig`. Reached at `/gigs/[id]/edit`, guarded server-side (owner + `OPEN`, else redirect). An obvious «Редактировать» **button** appears on the owner's gig detail while the gig is `OPEN` (visible when `data.isOwner && data.status === 'OPEN' && !closed && !isExample`) — a clear button, not a subtle pencil (per the profile-edit friction in Change 6).

## Non-goals / Constraints

- **No schema change.** Every field already exists on `Gig`; no new column, no migration. Reuse `createNotificationsBulk`.
- **No editing after `OPEN`** (per decision above): no "typo-safe fields once assigned" path, no `IN_PROGRESS` edit.
- **No delete/archive gig** — this change adds edit only.
- **No renegotiation / client counter-back** — unchanged; terms negotiation stays the specialist-proposes model.
- **No redesign** — reuse the `CreateGigDesign` markup, `app/_design/tokens.css`, and the existing gig-detail owner rails.
- Example gigs and admin-closed gigs remain non-editable.

## Verification

Verified live (not only tests): a client opens a gig **they own** that is `OPEN` and has ≥1 `PENDING` applicant, clicks «Редактировать», sees the form pre-filled with the current title/description/scope/budget/срок/category/criteria/tags, fixes the «Результаты»/deliverables typo (and separately edits the budget), saves; the gig detail then shows the corrected field and the recomputed fee/total; each `PENDING` applicant receives a «Условия гига обновлены» notification (badge + dropdown), while a withdrawn/rejected applicant and the owner receive none; a whitespace-only re-save sends no notification; a non-owner (specialist, or a different client) cannot open `/gigs/[id]/edit` and has no «Редактировать» control; the button is absent once the gig is `IN_PROGRESS`/closed/example. Validation is enforced (criteria < 50, budget ≤ 0, срок out of 1–365 are all rejected with the same messages as create).
