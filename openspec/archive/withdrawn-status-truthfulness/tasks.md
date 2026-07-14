# Tasks: withdrawn-status-truthfulness

> Display-layer only. Do NOT touch the withdrawal/re-apply state machine, `withdrawApplication`, `applyToGig`, or any schema. Round 1 already made the mechanic correct.

## 1. Dashboard archived cards — truthful per-state labels

**File:** `lib/view-models.ts` — `getSpecialistDashboard`, archived-card mapping (~L286–290).

**Context / mechanism:** `SpecialistGigCard` carries a `status: Status` **tone** enum; the card component derives its label from `STATUS_LABEL_RU[tone]` (view-models.ts:62), where `rejected → «Отклонён»`. Today all of `REJECTED | WITHDRAWN | WITHDRAWN_FINAL` are mapped to `status: 'rejected'`, so a withdrawn app shows red «Отклонён». There is **no** distinct tone for withdrawn — the red tone is acceptable for colour, but the **label** must differ. So a bare tone swap is insufficient.

**Implementation:**
- [x] 1.1 Added optional `statusLabel?: string` to `GigCardVM` (`app/components/blocks/view-models.ts`); the design `GigCard` (`app/_design/GigCard.tsx`) now renders `vm.statusLabel ?? STATUS_LABEL_RU[vm.status] ?? vm.status`. This card is consumed by both `/dashboard` (getSpecialistDashboard board — where the bug lived) and `/my-gigs`.
- [x] 1.2 In the archived-card `.map(...)`, all three keep tone `rejected` but carry a truthful `statusLabel`: `REJECTED → «Отклонён»`, `WITHDRAWN → «Отозвано»`, `WITHDRAWN_FINAL → «Отозвано (окончательно)»`. All under `tabKey: 'archive'`.
- [x] 1.3 Updated the inline comment to reflect the per-state mapping.

> **Finding during impl:** the false «Отклонён» is produced by `getSpecialistDashboard` (feeds `/dashboard`, whose board is titled «Мои гиги» — this IS the bug #2 screen). The separate `/my-gigs` route uses `getMyGigs`, which does **not** surface archived applications at all (only PENDING + assigned), so there is no false «Отклонён» there to fix — out of scope for this change.

**Test plan:**
- [x] Extended `__tests__/integration/specialist-dashboard-vm.test.ts` — added a `WITHDRAWN_FINAL` row, asserts archive holds 3 cards all with tone `rejected` and `statusLabel` set `['Отклонён', 'Отозвано', 'Отозвано (окончательно)']`. **PASS** (2/2).

## 2. Gig detail — per-viewer reversible-withdrawn signal

**Files:** `app/(protected)/gigs/[id]/GigDetail.tsx`; `lib/view-models.ts` `getGigDetail` (viewer-application already exposes `viewerApplication.status`, so no VM change may be needed — confirm).

**Context / mechanism:** The top badge `stageLabel` is the gig's **derived** status (`gigDisplayStatus` → «На рассмотрении» when an OPEN gig has other applicants) — leave it. Today `showFinalWithdrawn` handles `WITHDRAWN_FINAL` (a red «Отозвано» notice). For `WITHDRAWN` (reversible), `showApply` + `notApplied` render the plain apply form under a generic «Ваш отклик» heading — with no per-viewer withdrawn signal, so it reads as bare «На рассмотрении».

**Implementation:**
- [x] 2.1 Added `showWithdrawn` flag (`!closed && !data.isExample && va?.status === "WITHDRAWN"`). No VM change needed — `viewerApplication.status` already exposes `WITHDRAWN`.
- [x] 2.2 Rendered a blue `noticeBox` above the ApplyBlock: heading «Вы отозвали отклик» + «Вы можете откликнуться снова — заполните форму ниже.» (or «Этот гиг больше не принимает отклики.» when `!lifecycle.canApply`). The re-apply form (`ApplyBlock`) still renders below.
- [x] 2.3 Mutually exclusive by status: `WITHDRAWN` → blue notice + form; `WITHDRAWN_FINAL` → existing red «повторный отклик недоступен» notice, no form (untouched).
- [x] 2.4 `stageLabel` logic unchanged — the derived «На рассмотрении» badge stays, now clearly secondary to the viewer-specific signal.

**Test plan:**
- [x] Extended `__tests__/e2e/application-withdrawal.spec.ts` test 1: after a reversible withdraw, asserts «Вы отозвали отклик» + «можете откликнуться снова» visible AND the re-apply form present; then re-applies and asserts the signal clears + «Заявка отправлена» returns. **PASS**.
- [x] `WITHDRAWN_FINAL` path unchanged — existing test 2 still asserts the red «повторный отклик недоступен» notice + no form. **PASS**.

## 3. Verification

- [x] 3.1 `npx tsc --noEmit` clean for all touched files (pre-existing test-string-drift errors elsewhere are unrelated — see project notes).
- [x] 3.2 Touched VM specs + full `__tests__/unit` suite: **312 passed** (ran `npm run clean:test-db` first).
- [x] 3.3 **Live verify** via Playwright against a fresh dev server (had to kill a stale :3000 listener with a stale `test.db` handle — the documented E2E gotcha). Full `application-withdrawal.spec.ts`: **5 passed**, driving real browser flows:
  - Dashboard `/dashboard` «Мои гиги» board: withdrawn app reads «Отозвано» / «Отозвано (окончательно)», no «Отклонён».
  - Gig detail: reversible-withdrawn shows «Вы отозвали отклик» + working re-apply, not a bare «На рассмотрении»; re-apply returns to «Заявка отправлена».
  - `WITHDRAWN_FINAL` red notice + example-gig + disabled-submit paths unchanged.
- [ ] 3.4 Run `/ralphy-validate` against these acceptance criteria before archiving.
