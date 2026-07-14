# Tasks — gig-editing-with-notification

Ordered checklist. Each task lists implementation notes and a test plan. **No schema change** — every editable field already exists on `Gig`. Reuse `createGig`'s validation and `createNotificationsBulk`. **Edit is allowed only while the gig is `OPEN`** (confirmed with user). Verify live (Task 6).

## 1. `updateGig` server action (owner edits an OPEN gig) — DONE
- [x] Added `updateGig(prevState, formData)` to `app/actions/gig.ts`. Extracted a shared `parseGigForm(formData)` helper (returns `{ error }` or `{ fields }`) and refactored `createGig` to use it, so create/edit validation can never drift (messages verbatim). `updateGig` reads a hidden `gigId`, reuses `parseGigForm`.
- [x] Guards in order: `getSession()` → `/login`; role `CLIENT` else `{ error: 'Редактировать гиги могут только заказчики.' }`; load gig, not-found if missing; owner check else `{ error: 'Редактировать гиг может только заказчик, опубликовавший его.' }`; `closedByAdmin`/`isExample` → clear error; `status !== 'OPEN'` → `{ error: 'Редактировать гиг можно только пока он открыт и специалист не назначен.' }`.
- [x] Persists via `prisma.gig.update` with an explicit WHITELIST (title/description/criteria/goal/deliverables/constraints/budget/serviceFee/totalAmount/tags/categorySlug/deadlineDays/stageCount). Does NOT touch status/clientId/assignedSpecialistId/isExample/closedByAdmin/timestamps.
- [x] Computes a `material` flag (each editable field new-vs-stored, same normalization) BEFORE the update for the Task 2 fan-out. `redirect('/gigs/{gigId}')` on success.
- **Implementation note:** to keep create/edit validation from drifting, optionally extract a shared `parseGigForm(formData)` helper returning either `{ error }` or the normalized field object, and call it from both `createGig` and `updateGig` — but do not change `createGig`'s external behaviour/messages.
- **Test plan:** integration (`__tests__/integration/gig-editing.test.ts`) — owner edits an OPEN gig → fields updated, fee recomputed on budget change, redirect; non-CLIENT/non-owner/unauthenticated rejected; non-OPEN (IN_PROGRESS/REVIEW/COMPLETED/PAID)/closed/example rejected; missing required / criteria < 50 / budget ≤ 0 / deadline out of 1–365 / stage out of 1–50 / bad category rejected with the create-parity messages; no-op save succeeds and leaves stored values unchanged.

## 2. Applicant notification fan-out on material change — DONE
- [x] In `updateGig`, on `material === true`, loads `PENDING` applications and `createNotificationsBulk(...)` one row per applicant with `type: 'STATUS_CHANGE'`, `eventType: 'gig_updated'`, `eventData: JSON.stringify({ gigId })`. The `status: 'PENDING'` filter excludes REJECTED/WITHDRAWN/WITHDRAWN_FINAL; the owner is never a recipient.
- [x] Fire-and-forget AND defensively `try/catch`-wrapped in `updateGig` itself (findMany + fan-out) — a notification/query failure can never fail the already-committed edit or block the redirect (self-contained, not reliant on the helper's internal catch). Covered by the integration test `a notification fan-out failure does not fail the edit`.
- [x] Added `gig_updated` display text «Условия гига обновлены» in `lib/notification-utils.ts` (STATUS_CHANGE switch) and `gig_updated: 'status-change'` in the `ATTENTION_TYPE` accent map (`lib/view-models.ts`) so the dashboard attention strip renders it and links to the gig.
- **Test plan:** integration — material edit on an OPEN gig with 2 `PENDING` + 1 `WITHDRAWN` + 1 `REJECTED` applicant creates exactly 2 notifications (`STATUS_CHANGE`/`gig_updated`), none for withdrawn/rejected/owner; a no-op save creates 0; a forced `createNotificationsBulk` throw still persists the edit and redirects. Unit/VM test that `gig_updated` maps to legible text.

## 3. Edit page + route (owner-only, pre-filled) — DONE
- [x] Added `app/(protected)/gigs/[id]/edit/page.tsx` (server component): `getSession()` → `/login`; then loads the gig and bounces to `/gigs/{id}` unless owner + CLIENT + OPEN + not-closed + not-example. Server-authoritative (never relies on the button being hidden). Passes pre-split values + `categoryOptions`.
- [x] Added `EditGigDesign.tsx` mirroring `CreateGigDesign` — wired to `updateGig` via `useActionState`, initial state pre-filled from props, hidden `gigId`, hidden `stageCount` (create form omits it → preserve so an edit doesn't falsely reset it to 1), submit «Сохранить изменения», back-link/redirect to `/gigs/{id}`.
- [x] Pre-fill: `acceptanceCriteria` split on `\n` → criteria chips; `tags` split on `,` → tag chips (empties dropped); budget kopecks → roubles; title/description/goal/deliverables/constraints/deadline/category pre-set so the readiness checklist starts satisfied.
- **Test plan:** covered by E2E (Task 6) — pre-fill assertions + non-owner route bounce.

## 4. Gig-detail «Редактировать» entry point — DONE
- [x] In `GigDetail.tsx`, added `canEdit = !closed && data.isOwner && data.status === 'OPEN' && !data.isExample` and render an obvious «✎ Редактировать» button (Handjet/accent tokens) after the back-link, routing to `/gigs/{gigId}/edit` — a clear button, not a subtle pencil.
- [x] `GigDetailData` already exposes `isOwner`/`status`/`closedByAdmin`/`isExample` — no VM change needed.
- **Test plan:** E2E (Task 6) — owner on OPEN sees the button + routes to the edit form; a non-owner sees none; absent once IN_PROGRESS.

## 5. Guardrails / regression sweep — DONE
- [x] No schema change, no lifecycle change; `createGig` behaviour/messages preserved (refactor to `parseGigForm` is behaviour-identical — verified `gig-creation` fails IDENTICALLY on baseline: 16/49, all pre-existing English-string drift).
- [x] Edit cannot alter status/ownership/assignment — explicit column whitelist in `prisma.gig.update`; integration test `cannot alter status/ownership via extra formData fields` asserts injected `status`/`clientId`/`isExample`/`closedByAdmin` are ignored.
- **Result:** new `gig-editing` integration suite 19/19 green; `npm run build` green (`/gigs/[id]/edit` in output); `npx tsc --noEmit` clean for all touched files (remaining TS errors are pre-existing rate-limit/typography test files); `npm run validate:tokens` green. (`lint:tokens`/`lint:composition` scripts don't exist in this repo; `lint:generativity` fails ONLY on the unrelated admin-screen check — pre-existing, verified via stash.)

## 6. E2E + live verification — DONE
- [x] E2E `__tests__/e2e/gig-editing.spec.ts` — 3/3 pass against the live Playwright webServer + real `file:./test.db`: owner opens OPEN gig with a PENDING applicant → «Редактировать» → form pre-filled (title/deliverables/budget) → fix deliverables + change budget → save → gig detail shows the corrected field; DB asserts budget/fee recomputed and the applicant has a `gig_updated` STATUS_CHANGE notification; a non-owner is bounced from `/gigs/[id]/edit` to the detail with no form; the control is absent on an IN_PROGRESS gig.
- [x] **Live check:** the E2E run IS the live walkthrough (real Chromium against the running Next app) — covers pre-fill, corrected field render, fee/total recompute, PENDING-applicant notification, non-owner block, and button absence once IN_PROGRESS. No-op-sends-nothing + withdrawn/rejected-excluded are covered by the integration suite.
- **Result:** integration + E2E green; every Requirement in the spec delta has ≥1 Scenario.

**Progress:** 6/6 tasks completed
