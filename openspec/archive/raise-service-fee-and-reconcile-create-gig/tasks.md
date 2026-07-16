# Tasks — raise-service-fee-and-reconcile-create-gig

**Two parts.** Part A (task 1) is a real behaviour change — the service fee rises to 17.5% in code, seed, and tests, behind a new SSOT. Part B (tasks 2-3) reconciles the specs (create-gig staleness + the fee across every spec). Order matters: land the code rate first, because the specs' worked examples must match what the code actually computes.

## 1. Raise the service fee to 17.5% behind an SSOT (code) ✅
- [x] **New `lib/pricing.ts`** (client-safe: pure, no Prisma): `SERVICE_FEE_RATE = 0.175`, `SERVICE_FEE_PCT_LABEL = '17,5%'`, `serviceFeeKopecks()`, `serviceFeeRoubles()`.
- [x] **Replaced the 4 computation sites**: `CreateGigDesign.tsx` + `EditGigDesign.tsx` (`serviceFeeRoubles`), `gig.ts` createGig + updateGig/accept recompute (`serviceFeeKopecks`).
- [x] **Replaced ALL user-facing labels** via `SERVICE_FEE_PCT_LABEL` — the plan said 6; grounding found **8**: the 5 «Сервисный сбор (10%)» (`CreateGigDesign`, `EditGigDesign`, `GigDetail`, `FeePanel`, `ConditionsPanel`), `finances.ts` caption, **plus two the plan missed** — `CreateGigDesign.tsx:419` footer «Сбор 10%…» and `GuideDesign.tsx:31` «Комиссия Gigly — 10%». Comments updated too.
- [x] **Seed**: `prisma/seed.ts` (15 sites) **and `prisma/seed.prod.ts`** (1 site — not in the plan) routed through `serviceFeeKopecks`. Reseeded dev DB; a seeded example gig reads `serviceFee/budget = 17.5%` exactly.
- [x] **Fixture helper** (`__tests__/helpers/seed.ts`): `serviceFee`/`totalAmount` now derive from `serviceFeeKopecks(budget)` via `??` (explicit override, incl. 0, still respected).
- **Verified:**
  - `npx tsc --noEmit`: no new errors in any touched file (the 2 pre-existing `gig-creation.test.ts` errors are unrelated, line-shifted only).
  - **Live prod build 6/6**: budget 100000 → «Сервисный сбор (17,5%)», «17 500 ₽», «117 500 ₽», footer «Сбор 17,5%», publish enabled. **Persisted** gig: `budget 10000000, serviceFee 1750000, totalAmount 11750000` — preview == server.
  - Final grep gate: the only fee-rate literal in `app/ lib/ prisma/` is `SERVICE_FEE_RATE = 0.175` in `lib/pricing.ts`. Zero «10%»/«20%» labels remain.

## 2. Update the rate-asserting tests to 17.5% ✅
Self-consistent seed fixtures (`serviceFee`/`totalAmount` set explicitly and never checked against budget×rate) stayed green — confirmed for `finances-ledger`, `finances-vm`, `compose-finances`, `factory-composability` (its 20000 override round-trips). Only tests asserting the **computed** rate changed:
- [x] `gig-creation.test.ts` — worked-example literals recomputed (1750000 / 5833 / 875000); flooring test now asserts `serviceFeeKopecks(budget)` + pins 5833.
- [x] `factory-validation.test.ts` — renamed; asserts `serviceFeeKopecks(gig.budget)`.
- [x] `terms-negotiation.test.ts` + `withdraw-with-counter.test.ts` — `makeGig` helpers route through the SSOT; the accept-recompute assertion (`Math.floor(35000000 * 0.1)`) → `serviceFeeKopecks(35000000)`.
- [x] `domain-blocks.test.tsx` + `app/components/blocks/fixtures.ts` — `feePanelFixture` figures → 17,5% / 17 500 ₽ / 117 500 ₽; label assertions → «17,5%».
- [x] `helpers/seed.test.ts` — default fixture → 26250 / 176250.
- [x] **`gig-editing.test.ts` — NOT in the plan; found by running the suite.** It has its own local seed helper (seeded a 10% fee) + a recompute assertion + a "no-op save leaves values unchanged" test. The no-op broke because updateGig corrected the stale 10% fee to 17.5%. Fixed by seeding the helper's fee at the current rate (via SSOT) so a no-op is truly no-op; recompute assertion → 3500000 / 23500000.
- [x] E2E (updated by inspection; run separately from vitest): `client-journey`, `specialist-journey`, `gig-editing.spec`, `compose-create-gig`, `compose-gig-detail-apply`, `compose-finances`.
- **Verified:** the 10 fee-affected suites = **209/209 green**; full `npm run test:clean` = **72 failed** — identical to the pre-change baseline (the +2 gig-editing regressions found mid-run were fixed). Zero net regression.

## 3. Reconcile the fee across all specs (delta already written; applied at archive) ✅
- [x] `gig/spec.md` — applied the ADDED "Service Fee Rate Is a Single Source of Truth" + MODIFIED "Fee Calculation" (17.5%, recomputed examples 1750000/11750000 and 5827/39127), and swept every incidental `0.10`/`0.1`/`10%` fee reference (Create Gig Server Action AC, Accept Application recompute, Update Gig recompute) → 17.5% / `SERVICE_FEE_RATE`. 14 rate hits, all `0.175`/prohibition prose.
- [x] `database/spec.md` — MODIFIED "Gig Model" serviceFee "20% of budget" → "17.5%" (`budget × 0.175`).
- [x] `testing/spec.md` — swept `:1001` "10% of budget" and `:1569` "serviceFee = budget * 0.2" → 17.5% / `× 0.175`. 0 stale fee refs remain.
- [x] `ui/spec.md` — applied MODIFIED "Gig Creation Form" (17.5%) + MODIFIED "Live Fee Panel" (17.5%); swept the incidental "10% fee" mentions **including three the plan under-counted**: the `FeePanel` AC (`Сервисный сбор 10%`), the "live fee mirrors the server's 10%" AC, and the finances StatVM caption «комиссия Gigly 10%» → «17,5%».
- **Test plan (grep on canonical specs after archive) — PASSED:** no `10%`/`20%`/`0.10`/`0.2` remains as a *fee* reference in `gig`/`database`/`testing`/`ui` specs (remaining hits are prohibition prose, the font ratio `0.1034`, and status-glow "8–10% fills" — none fee); `17.5%`/`0.175` present in each (gig 14, ui 17, testing 2, database 1).

## 4. Reconcile the create-gig spec (the original task) ✅
- [x] Applied MODIFIED "Gig Creation Form" over the canonical requirement: goal/deliverables required, counters deferred to «Localized Live Character Counters», dropped the three dead "X / 1000 characters" scenarios and the English "Definition of Done" / "Additional Details (Optional)" framing — while preserving the form-exists, both access-control redirects, live fee preview, and server-authoritative-validation scenarios.
- [x] **Deleted BOTH "Gig Creation Form Visual Sections" blocks** (the gray-kit `bg-gray-50`/`text-indigo-600` one and the navy-token `bg-surface-level-1`/`/dashboard/gigs/new` duplicate). Located the second by body, not line. `grep -c "Gig Creation Form Visual Sections"` on `ui/spec.md` = **0**; no `/dashboard/gigs/new` remains.
- [x] Left untouched: "Gig Creation Form (Mobile Optimization)" and every authoritative guided-brief requirement (only their fee numbers changed, per task 3). `gig/spec.md` validation minimums untouched.

## 5. Grounding + consistency checks (before implement declares done) ✅
- [x] Grounding held: code fee was 10% at every site (confirmed against `gig.ts`/`CreateGigDesign` before editing); both duplicate "Gig Creation Form Visual Sections" blocks still present in canonical `ui/spec.md`.
- [x] No test assumes the removed create-gig spec strings — swept `__tests__/` for "service fee (20", "Additional Details", "/dashboard/gigs/new", "Basic Information"; only `sanitize.test.ts` matches "20%" (unrelated sanitizer input).
- [x] Delta consistency verified: every `### Requirement:` under ADDED/MODIFIED has ≥1 `#### Scenario:` (the REMOVED "Gig Creation Form Visual Sections" legitimately has none).

## Validation (/ralphy-validate)
- **Fee Calculation scenarios** proven exactly: `serviceFeeKopecks(10_000_000) = 1_750_000` (total 11_750_000); `serviceFeeKopecks(33_300) = 5_827` (floors 5827.5; total 39_127). Matches both gig-spec worked examples.
- **SSOT scenarios** proven by grep: `0.175` and the «17,5%» literal appear **only** in `lib/pricing.ts`; no `*0.1`/`*0.2` rate literal and no «10%»/«20%» label anywhere in `app/ lib/ prisma/`; all named files (Create/Edit/GigDetail/Conditions/FeePanel/gig.ts/seed/fixture) import the SSOT; `lib/pricing.ts` has zero imports (client-safe).
- **New `__tests__/unit/pricing.test.ts`** (5 tests) pins the rate + label + both worked examples + the floor guarantee — the safety net for the most money-critical constant. Mutation-checked: setting the rate to 0.10 fails 4/5.
- **Fixed during validation:** three doc-comments in `view-models.ts` still hardcoded «17,5%»; reworded so no comment can drift on the next rate change. Re-ran the fee suites (205/205) after the edit.
- **Live** (prior turn, still valid — no source touched since): preview == server, persisted `serviceFee 1750000`.
- No failures. No missing tests.

## Implementation status
- **Tasks 1, 2, 5 (code + tests + checks): DONE and verified.** This is the whole behaviour change — the fee is 17.5% end-to-end, one SSOT, live-confirmed, baseline-equal test suite.
- **Tasks 3, 4, 6 (canonical spec reconciliation): the /ralphy-archive step.** The deltas are written (`specs/gig`, `specs/database`, `specs/ui`); they apply to canonical `openspec/specs/` at archive, gated by the post-archive grep gates. Same implement→archive split used for C2/C3/C5 this round.

## 6. Archive reconciliation (done at /ralphy-archive) ✅
- [x] Applied all deltas (gig, database, ui) to the canonical specs; swept testing + the incidental gig/ui fee mentions (incl. the 3 the plan under-counted — see task 3).
- [x] Ran the post-archive grep gates from tasks 1, 3, 5 — all pass (no stale fee ref; `0.175`/«17,5%» present in each of the four specs; both "Gig Creation Form Visual Sections" blocks gone; no `/dashboard/gigs/new`).
- [x] `npm run build` + `npm run test:clean` — see the "Archive verification" note below.
- [x] Change folder moved `openspec/changes/` → `openspec/archive/raise-service-fee-and-reconcile-create-gig/`.

**Archive verification (2026-07-16):**
- `npm run build`: **clean** — all routes compiled, incl. `/gigs/new` (6.84 kB), `/gigs/examples`, `/gigs/new/success`. No type or lint errors.
- `npm run test:clean`: **72 failed / 1015 passed (1087)** — identical to the documented pre-change baseline (English-string-drift + test-db-pollution residual: IDOR/moderation/`Unique constraint (userId,gigId)`). Zero net regression attributable to the fee change or the spec reconciliation; the 10 fee-affected suites were separately confirmed 209/209 during implement.
- Grep gates: `Gig Creation Form Visual Sections` count = 0 in `ui/spec.md`; no `/dashboard/gigs/new`; no stale `10%`/`20%`/`0.10`/`0.2` *fee* reference in gig/database/testing/ui; `0.175`/«17,5%» present in all four.
