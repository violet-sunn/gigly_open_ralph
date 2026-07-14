# Fix Application Lifecycle (apply / withdraw / re-apply)

**Change:** `fix-application-lifecycle`
**Created:** 2026-07-14
**Status:** IMPLEMENTED (2026-07-14) — verified via integration suite (application-withdrawal 13/13, application-flow 32/32, example-gigs 9/9, gig-detail-vm 4/4) + live E2E (application-withdrawal.spec.ts: reversible→re-apply→final-with-dialog→«Отозвано» marker, 2/2)
**Planning:** `openspec/planning/prod-feedback-fixes.md` (Change 1)

## Why

Stress-testing on prod surfaced defects in the specialist application flow, and fixing them properly requires a small business-rule revision (unlimited withdraw/re-apply is exploitable and clutters the gig for the client). Root causes located in `app/actions/gig.ts` and the gig-detail view:

1. **Withdraw breaks re-application, and is unbounded (NEW bug + rule gap).** `withdrawApplication` sets `status: 'WITHDRAWN'` but keeps the row (`gig.ts:686-688`); `applyToGig` treats *any* existing row as "already applied" (`gig.ts:210-215`) and the model has `@@unique([gigId, specialistId])`, so re-apply is impossible and the gig view stays stuck on «На рассмотрении». Simply allowing re-apply would let a specialist apply/withdraw endlessly. Desired rule: **one free (reversible) withdrawal per gig; the second withdrawal is final.**

2. **No way to apply on example gigs (Спец #6).** `applyToGig` intentionally rejects `gig.isExample` (`gig.ts:198`), but the detail renders nothing in place of the form, so it reads as broken. **Decision (confirmed):** example gigs stay a showcase — NOT apply-able, no extra gigs seeded. Fix = make the state legible.

3. **Disabled «Отправить заявку» reads as broken (Заказчик #5).** The submit gate (approach ≥ 100, questions ≥ 50) shows counters, but the disabled state is too subtle.

## Business rule: one free withdrawal per gig

State is modeled explicitly on the `Application` row (unique per `(gigId, specialistId)`) with a status enum plus a single persistent flag `freeWithdrawalUsed` — chosen over a bare counter because the rule is exactly "one free," so a boolean expresses intent precisely and cannot drift out of sync with the status.

**Statuses:** `PENDING`, `ACCEPTED`, `REJECTED`, `WITHDRAWN` (reversible), `WITHDRAWN_FINAL` (permanent). Stored values stay English; «Отозвано» is the display label for both withdrawn states.

- **Apply** → `PENDING`, `freeWithdrawalUsed = false`.
- **1st withdrawal** — *reversible, no penalty*: status → `WITHDRAWN`, `freeWithdrawalUsed = true`. The specialist MAY re-apply.
- **Re-apply after 1st withdrawal** — reactivates the same row to `PENDING` (`freeWithdrawalUsed` stays `true`).
- **2nd withdrawal** — *final*: allowed ONLY after an explicit confirmation dialog; status → `WITHDRAWN_FINAL`. The specialist may NOT re-apply. The gig **remains visible** with a final «Отозвано» marker and a disabled apply control (user decision — gig does NOT disappear from the feed).
- **Re-apply after final withdrawal** (status `WITHDRAWN_FINAL`) → rejected with a clear message.

Re-application is thus gated purely by **status** (`WITHDRAWN` → reactivate; `WITHDRAWN_FINAL` → reject) — no arithmetic threshold. `freeWithdrawalUsed` only decides which withdrawal (reversible vs final) the next `withdrawApplication` performs.

### Confirmation dialog (only for the final withdrawal)

The 1st withdrawal is frictionless (at most a light confirm — it is reversible). The **2nd** withdrawal (when `freeWithdrawalUsed = true`) MUST open a confirmation dialog (reuse `app/_design/ConfirmDialog.tsx`) warning it is final — «Если отменить отклик сейчас, повторно откликнуться на этот гиг будет нельзя» — with a confirm («Отозвать окончательно») and a dismiss («Не отменять» — the «отмена отмены»). The withdrawal executes ONLY on confirm.

### Integrity / anti-exploit

- `freeWithdrawalUsed` and `status` live on the `Application` row (unique per `(gigId, specialistId)`). They are **server-authoritative** — never derived from session/cookie/client input — so they survive logout/session refresh and cannot be reset or spoofed by the client. State never bleeds between gigs or users.
- **No reset path:** the only `Application` deletions are in the delete-account flow (`app/actions/settings.ts`); a specialist cannot delete a single application to reset state (deleting one's whole account is self-defeating).
- **Atomic updates:** `withdrawApplication` and the re-apply reactivation MUST perform the check-and-update atomically (transaction / conditional update against the current status), so concurrent apply/withdraw calls cannot race the state (TOCTOU).
- The final-withdrawal limit is enforced **server-side** (the dialog is UX only): a client that skips the dialog still cannot re-apply once status is `WITHDRAWN_FINAL`.

## What Changes

- Add `freeWithdrawalUsed Boolean @default(false)` to `Application`; add `WITHDRAWN_FINAL` as a valid status; apply schema via `prisma db push`.
- `withdrawApplication`: only withdraw a `PENDING` application, atomically; if `freeWithdrawalUsed = false` → `WITHDRAWN` + set flag true; if `true` → `WITHDRAWN_FINAL`.
- `applyToGig`: reactivate a `WITHDRAWN` row to `PENDING` (atomic, keep flag); reject when status is `WITHDRAWN_FINAL`; keep example-gig and non-OPEN rejections.
- Gig VM (`getGig`) exposes the specialist's `status` + `freeWithdrawalUsed` so the UI picks the right state (apply form / reversible-withdrawn / final-withdrawn) and the right dialog.
- `GigDetail.tsx`: `WITHDRAWN` shows the apply form again; `WITHDRAWN_FINAL` shows the «Отозвано» marker + disabled apply; the withdraw control opens the confirmation dialog when the next withdrawal is final; example gigs show the demo notice; disabled submit is visibly disabled with the unmet rule highlighted.

## Constraints / Non-goals

- Keep `@@unique([gigId, specialistId])` — reactivate the existing row; never create duplicates; never hard-delete on withdraw (state must persist).
- Example gigs stay non-apply-able; no extra seeded gigs. Out of scope: terms negotiation (Change 2), gig editing (Change 3).
- No redesign; reuse existing GigDetail markup, tokens, and `ConfirmDialog`.

## Verification

Verified live (not only tests): apply → «На рассмотрении»; withdraw once → apply form returns (status `WITHDRAWN`, «Отозвано», reversible); re-apply → success; withdraw again → confirmation dialog; «Не отменять» keeps the application; confirm → `WITHDRAWN_FINAL`, apply disabled, gig still visible; re-apply rejected server-side even if the dialog is bypassed; concurrent withdraw/apply cannot desync state.
