# Tasks — fix-application-lifecycle

Ordered checklist. Each task lists implementation notes and a test plan. Run on the current branch; commit per logical group. After the code tasks, verify live (Task 9).

## 1. Reproduce and pin the defects
- [x] Reproduce: (a) apply → withdraw → re-apply blocked, status stuck «На рассмотрении»; (b) example gig has no apply control; (c) < 100-char approach → button looks dead.
- **Test plan:** capture current (wrong) behavior in a scratch note/screenshots. No assertion yet.

## 2. Model: withdrawal flag + final status
- [x] In `prisma/schema.prisma` `model Application`: add `freeWithdrawalUsed Boolean @default(false)`. Treat `status` as the enum `PENDING | ACCEPTED | REJECTED | WITHDRAWN | WITHDRAWN_FINAL` (string field; document the terminal `WITHDRAWN_FINAL`).
- [x] Apply with `prisma db push` (matches dev + the prod entrypoint; no migration file needed per this project's flow).
- **Implementation note:** one boolean + explicit final status, both per-row and server-only — this is what makes it exploit-safe and non-bleeding across gigs/users. Do NOT store this in session/cookie/client. No counter needed (rule is exactly "one free").
- **Test plan:** `prisma db push` succeeds; a fresh application has `freeWithdrawalUsed = false` and `status = PENDING`; fields round-trip.

## 3. Withdrawal semantics in `withdrawApplication` (atomic)
- [x] In `app/actions/gig.ts` `withdrawApplication`: require the caller owns the application, the gig is not `isExample`, and the current status is `PENDING`. Reject otherwise with a clear message.
- [x] Perform the transition **atomically** (transaction or a conditional `updateMany` guarded by `status: 'PENDING'`) to avoid TOCTOU races:
  - if `freeWithdrawalUsed = false` → set `status: 'WITHDRAWN'`, `freeWithdrawalUsed: true` (reversible, 1st).
  - if `freeWithdrawalUsed = true` → set `status: 'WITHDRAWN_FINAL'` (final, 2nd).
- [x] Preserve the row in both cases.
- **Test plan:** integration — withdraw a PENDING app with flag false → WITHDRAWN + flag true; (after re-apply) withdraw again → WITHDRAWN_FINAL; withdrawing a non-PENDING/example/not-owned app errors and changes nothing; two concurrent withdraw calls do not double-transition.

## 4. Re-application + finality gate in `applyToGig` (atomic)
- [x] Replace the existing-row handling (`gig.ts:210-215`), gating by **status**:
  - `PENDING`/`ACCEPTED` → "already applied" error.
  - `WITHDRAWN` → **reactivate** atomically: update the row to `status: 'PENDING'`, overwrite `approach`/`questions`/`estimatedEffort`/`proposedBudget`/`proposedDeadlineDays`/`coverLetter:''`, keep `freeWithdrawalUsed` (stays true); re-fire the owner APPLICATION notification.
  - `WITHDRAWN_FINAL` → **reject**: e.g. «Вы окончательно отозвали отклик на этот гиг и больше не можете откликнуться.»; change nothing.
  - no existing row → create as today (`freeWithdrawalUsed` defaults false).
- [x] Keep all pre-checks (isExample, closedByAdmin, status !== 'OPEN', field validation) before the existing-row branch. Reactivation must be atomic against the current status.
- **Test plan:** integration — apply → withdraw(WITHDRAWN,flag) → re-apply(reactivates PENDING, flag kept) → withdraw(WITHDRAWN_FINAL) → re-apply REJECTED; unique constraint never violated; the finality reject fires even when the action is called directly (dialog bypassed).

## 5. Expose application state to the gig VM
- [x] In `lib/view-models.ts` `getGig` (and any dashboard/my-applications VM), expose the viewing specialist's `status` and `freeWithdrawalUsed`. Both `WITHDRAWN` and `WITHDRAWN_FINAL` MUST be treated as **not actively applied** for the "show apply form?" decision; distinguish reversible (`WITHDRAWN`) vs final (`WITHDRAWN_FINAL`).
- **Test plan:** integration — VM reports {status, freeWithdrawalUsed}; WITHDRAWN → not-applied + reversible (apply form); WITHDRAWN_FINAL → not-applied + final (marker).

## 6. GigDetail application states + confirmation dialog
- [x] In `app/(protected)/gigs/[id]/GigDetail.tsx`, render per state for a viewing SPECIALIST:
  - No application / `WITHDRAWN` → the apply form (re-apply allowed).
  - `WITHDRAWN_FINAL` → «Отозвано» marker + «повторный отклик недоступен» + disabled apply control; **gig stays visible**.
  - `PENDING` → «На рассмотрении» + a withdraw control.
- [x] Withdraw control: if `freeWithdrawalUsed = true` (next withdrawal is final), clicking opens `ConfirmDialog` (`app/_design/ConfirmDialog.tsx`) with the warning «Если отменить отклик сейчас, повторно откликнуться на этот гиг будет нельзя», a confirm «Отозвать окончательно», and a dismiss «Не отменять»; `withdrawApplication` runs ONLY on confirm. If `freeWithdrawalUsed = false`, a light confirm (or immediate) is acceptable — no dire warning.
- [x] Russian labels: display «Отозвано» for both withdrawn states (final adds the "повторно нельзя" note); do not change stored English status values.
- **Test plan:** E2E — apply → withdraw (1st, no dire dialog) → apply form returns; re-apply → withdraw (2nd) → confirmation dialog; «Не отменять» keeps it PENDING; confirm → WITHDRAWN_FINAL marker, apply disabled, gig still listed.

## 7. Legible example-gig state (Спец #6)
- [x] Keep the server `isExample` rejection. In `GigDetail.tsx`, when `gig.isExample` and the viewer is a SPECIALIST, render a clear notice («Это демонстрационный гиг — отклик недоступен; реальные гиги ищите в поиске») with a link to `/gigs`, instead of an empty area or phantom form.
- **Test plan:** E2E — example gig shows the notice + working search link, no apply form; normal OPEN gig shows the form.

## 8. Legible disabled submit (Заказчик #5)
- [x] In the apply form, give «Отправить заявку» a visibly disabled style when `!valid`, and emphasize the unmet rule in the existing counter hint until satisfied.
- **Test plan:** E2E — 37/100 approach → button visibly disabled, approach counter emphasized; past minimums → emphasis clears, button enables and submits.

## 9. Spec delta, tests, and live verification
- [x] Ensure `specs/gig/spec.md` matches the implemented behavior (one-free-withdrawal rule via flag + WITHDRAWN_FINAL, atomic updates, dialog, example notice, disabled legibility).
- [x] Run the application/gig E2E specs; update selectors for the new states/dialog.
- [x] **Live check (required):** full walkthrough from the proposal's Verification section, incl. bypassing the dialog (call the action directly) to confirm server-side finality, and a concurrent withdraw/apply sanity check.
- **Test plan:** touched E2E green; live walkthrough matches; spec validation passes (every Requirement has ≥1 Scenario).

**Progress:** 9/9 tasks completed
