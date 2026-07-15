# Tasks — apply-terms-lock

**Read the proposal's premise-correction table before starting.** The PRD's stated roots are wrong: the terms panel has
**no inputs** (nothing to lock — live-verified: identical 11 inputs on both tabs), the tabs are «Условия {company}» /
«Мои условия» (not «От заказчика»/«Предложено»), and clearing the re-apply pre-fill **contradicts a shipped MUST**
(`gig/spec.md:1243-1248`) and is explicitly **out of scope**.

**The real defect (a violation of `gig/spec.md:1199`):** `lib/view-models.ts:721-722` falls back to the gig's own
figures, so «Мои условия» shows the client's `25 дней / 140 000 ₽` until a counter exists — indistinguishable from the
client's tab. Fix at the source (the VM), not by patching the screen.

## 1. VM — «Мои условия» reflects only a real counter
- [x] `lib/view-models.ts` (~L721): remove the `?? gig.budget` / `?? gig.deadlineDays` fallback. `conditions.proposed` MUST derive from `myApp?.proposedBudget` / `myApp?.proposedDeadlineDays` only, and represent absence explicitly (per field — a budget-only counter must leave срок absent).
- [x] `app/components/blocks/view-models.ts` (~L271): widen `ConditionsTermsVM` so `deadline`/`budget` admit an absent state (`string | null` / `Money | null`), making "not proposed" representable instead of approximated.
- [x] Update the block consumers of the widened type: `app/components/blocks/ConditionsPanel.tsx` (~L20) and `fixtures.ts`. **Blast radius is small and verified:** `ConditionsPanel` is not used by any real route (workbench/blocks only) — `GigDetail` has its own inline markup. Do not "fix" it by re-adding a fallback.
- **Test plan:** unit/integration — for a specialist with no counter, `conditions.proposed.budget`/`.deadline` are absent (NOT the gig's values); with a full counter they equal the counter; with a budget-only counter, budget is the counter and срок is absent. `conditions.client` always equals the gig's own figures.

## 2. Gig detail — render the explicit not-proposed state
- [x] `app/(protected)/gigs/[id]/GigDetail.tsx` (~L71, `const term = …`; rows ~L499-540): when the proposed figure is absent, render «— не предложено» in place of the number rather than a gig value.
- [x] Keep the existing note (~L491-497, «Предложите свои условия в форме отклика ниже — иначе действуют условия заказчика») — it stays, it just no longer has to excuse identical numbers.
- [x] Do NOT touch the «Условия {company}» branch or the owner gating (`showTermsTabs = !data.isOwner`) — both already satisfy the spec.
- **Test plan:** live — a specialist with no counter opens «Мои условия» → «— не предложено» + the note, and the figures differ from «Условия {company}». Owner sees no second tab.

## 3. Live link — the tab reflects what is being typed
- [x] Lift `propBudget` / `propDeadline` state out of `ApplyBlock` (~L843-844) into `GigDetail`, passing value+setter down. Both already render inside `GigDetail`, so no context/store is needed.
- [x] The «Мои условия» tab MUST prefer the live typed value, falling back to the submitted counter, then the not-proposed state. Clearing an input returns that field to not-proposed.
- [x] Preserve `ApplyBlock`'s existing client-side validation and the submitted field names (`proposedBudget`, `proposedDeadlineDays`) exactly — the wire format must not change.
- [x] Watch for input lag: the panel now re-renders per keystroke (the fields were already controlled `useState`, just one level down).
- **Test plan:** live — type `120000` into «Ваш бюджет» → the «Мои условия» tab shows `120 000 ₽` immediately, «Условия {company}» still shows the gig's; clear it → back to «— не предложено».

## 4. Confirm the specced behaviours still hold (regression guard)
- [x] `applyToGig` untouched: empty counter still submits `null`/`null` and applies on the client's terms.
- [x] **The re-apply pre-fill still works** (`gig/spec.md:1243-1248`): withdraw a counter-bearing application, re-open the form → inputs pre-filled with the preserved counter; re-submitting unchanged re-sends it. This change MUST NOT clear it.
- [x] With the pre-fill populated, the «Мои условия» tab and the form now **agree** (that was the pre-fill's stated purpose) — verify they show the same figures.
- **Test plan:** integration — the existing terms/lifecycle suites stay green (`structured-fields`, application lifecycle/withdrawal, terms-negotiation). Live — the withdraw → re-apply loop.

## 5. Verify live end-to-end
- [x] `npx tsc --noEmit` clean on touched files; `npm run build` clean; `lint:composition` + `lint:tokens` green.
- [x] Playwright, seed specialist `alexey.ivanov@mail.ru` / `TestPass123` (**note: the PRD's `andrey.sokolova@mail.ru` does not exist**; real specialists are `alexey.ivanov@mail.ru`, `dmitry.volkov@yandex.ru`, `sergey.morozov@gmail.com`). Use an OPEN gig they have not applied to (e.g. `seed-open-gig-4`, budget 140 000 ₽ / 25 дней):
  - (i) «Мои условия» with no counter → «— не предложено», NOT `140 000 ₽`; «Условия СофтПро» → `140 000 ₽ / 25 дней`
  - (ii) type a counter → the tab reflects it live; clear → back to not-proposed
  - (iii) submit empty → application created with no counter (client's terms stand)
  - (iv) withdraw → re-apply → form pre-filled with the preserved counter, tab agrees
  - (v) owner view → no «Мои условия» tab
- [x] Kill any live dev server before `npm run build` — `.next` is shared and building over a live server corrupts it (bit this change's predecessor).
- [x] Clean up temp scripts; ad-hoc Playwright scripts live **inside** the project dir (ESM resolution).
- **Test plan:** the live pass above; assert on rendered text, not internal state.

## Verification summary (2026-07-15)

- **Live E2E — 13/13 against a real prod build** (`next build && next start`), seed specialists `alexey.ivanov@mail.ru` / `dmitry.volkov@yandex.ru`, gig `seed-open-gig-4` (СофтПро, 140 000 ₽ / 25 дней):
  - «Условия СофтПро» → `140 000 ₽ / 25 дней`; **«Мои условия» (no counter) → `— не предложено`**, where it previously rendered the client's `140 000 ₽` — the defect, gone
  - the two tabs are now visibly different (the tab switch is no longer a no-op)
  - typing `120000`/`7` in the apply form updates the tab **live, pre-submit** (`120 000 ₽ / 7 дней`); clearing returns both to `— не предложено`
  - «Условия СофтПро» is unaffected by typing — still the fixed reference
  - a **half-counter** (budget only) shows `99 000 ₽` + `— не предложено` срок — never completed with the gig's figure
  - the owner sees no «Мои условия» tab
  - **the specced re-apply pre-fill still works**: submit counter → withdraw → re-open ⇒ inputs seeded `120000`/`7`, and the tab now *agrees* with them (the pre-fill's stated purpose)
  - after submit (PENDING, no form) the tab shows the **persisted** counter, not the typed path
  - an empty counter still persists `null`/`null` — apply-on-client's-terms semantics unchanged
- **Typecheck:** 0 errors in any touched file. The 3 remaining non-test errors are pre-existing workbench typography issues — proven by stashing this change and seeing the identical count.
- **Lint:** `lint:composition` + `lint:tokens` green. **Build:** clean.
- **Tests reconciled at source — two suites were encoding the bug:**
  - `terms-negotiation.test.ts` asserted `conditions.proposed.budget === conditions.client.budget` under the name *«reports hasCounter false + proposed == client»* — i.e. it locked in the exact fallback the gig spec forbids. Flipped to the specced contract, plus a new half-counter test.
  - `gig-detail-vm.test.ts` asserted `terms.proposed === terms.client` with the comment *"proposed terms fall back to the gig's"*. Flipped.
  - Targeted suites: **58/58 green** (terms-negotiation, withdraw-with-counter, gig-detail-vm, gig-detail-view, application-withdrawal, structured-fields).
- **Zero regressions:** full integration suite **72 failed / 652 passed / 724** vs the pre-change baseline **72 failed / 651 passed / 723** — failures unchanged, passes +1 (the new half-counter test). The 72 are the tracked English-string drift.
- **Gotcha:** `Intl.NumberFormat('ru-RU')` groups with U+00A0, so `'280 000 ₽'` written with a plain space fails `Object.is` against an identical-looking string. The suite already had a `noSpace()` helper for this — use it.

## Validation (/ralphy-validate, 2026-07-15)

All 5 scenarios in the delta mapped to evidence. **5/5 covered.**

**Defect found in my own implementation and fixed:** the fix had created **three copies** of the `— не предложено`
literal (`lib/view-models.ts`, `GigDetail.tsx`, `ConditionsPanel.tsx`) — duplicated because `GigDetail` is a client
component and importing `view-models.ts` would pull Prisma into the browser bundle. If one copy drifted,
`gig-detail-vm.test.ts` would still pass while the screen rendered something else: the exact SSOT failure C1 existed
to fix. Extracted **`lib/terms-display.ts`** (client-safe, no server deps) holding `NOT_PROPOSED`, `formatBudgetRub`,
and the pure `typedProposedTerm()`. Now **one** definition; all three call sites import it.

**Added `__tests__/unit/terms-display.test.ts` (10 tests).** Scenario 3 (live typing) previously had *only* live
evidence, from a script that gets deleted — now the derivation is deterministic and covered: full counter, empty,
whitespace-only, budget-only, срок-only, invalid budget (`0`/`-5`/`abc`), out-of-range/non-integer срок
(`0`/`366`/`2.5`/`x`), boundaries (`1`/`365`), RU pluralisation, and NOT_PROPOSED as a single shared string.

**Mutation-tested (the guards bite):** restoring the original `?? gig.budget` fallback in the VM fails **3 tests**
across `terms-negotiation` + `gig-detail-vm`.

**Re-verified live after the refactor — 8/8 on a clean prod build** (`seed-open-gig-4`, СофтПро 140 000 ₽ / 25 дней),
including the spec's *"the client tab MUST contain no inputs"*: the panel adds **no inputs on either tab** (11 = 11).
Also confirmed an invalid budget (`0`) reads as «не предложено» rather than displaying an unsubmittable figure.

**Coverage map:**
| Scenario | Evidence |
| --- | --- |
| Specialist with a counter sees differing tabs | live (`120 000 ₽` vs `140 000 ₽`) + `terms-negotiation` VM assertion |
| Without a counter, «Мои условия» MUST NOT show the client's figures (per field) | live (`— не предложено`) + flipped `terms-negotiation`/`gig-detail-vm` + half-counter test (mutation-verified) |
| The tab reflects terms being typed | live (pre-submit, clear→absent) + `terms-display` unit tests (10) |
| The client tab stays a fixed reference (no inputs) | live — unaffected by typing; inputs 11=11 on both tabs |
| Client owner does not see a redundant second tab | live (owner view) |

**Final state:** typecheck clean (0 errors in touched files); `lint:composition` + `lint:tokens` green; build clean;
touched suites **68/68**; zero regressions (full integration identical to baseline apart from added tests).

**Gotcha re-learned (3rd time):** `pkill -f "next-server"` does **not** kill node on Windows. The server kept `:3000`,
the new one died with `EADDRINUSE`, and `rm -rf .next && npm run build` then corrupted the build *underneath the
running server* — the page broke and a live check failed for reasons that had nothing to do with the code. Kill by PID
(`Get-NetTCPConnection -LocalPort 3000` → `Stop-Process -Id`) and confirm the port is free before building.

### Second validation pass (2026-07-15)

Closed a **stale-evidence gap**: the re-apply/pre-fill checks (5/5) and the owner check had been run *before* the
`lib/terms-display.ts` extraction, which touched `GigDetail` — the component holding the pre-fill seeding. Claiming
them post-refactor would have been asserting on evidence that no longer described the code. Re-ran both against the
refactored prod build (server start 18:19:50 confirmed later than BUILD_ID 18:19:27, so it is genuinely serving the
new bundle):
- **re-apply/counter — 5/5:** `applyToGig` unchanged (counter persists `12000000`/`7`); a specialist WITH a counter sees differing tabs (`120 000 ₽` vs the gig's `190 000 ₽` — scenario 1 via the *persisted* path, no form on screen); the specced pre-fill survives (`120000`/`7`); the tab agrees with it; an empty counter still persists `null`/`null`.
- **owner — 3/3:** no «Мои условия» tab (found 0), the single terms panel still renders the figures, and the owner path never hits the not-proposed state.

**Every scenario now has post-refactor evidence.** Final: unit + integration **100/100** across the 8 touched suites;
typecheck clean on all touched files.

### Third validation pass (2026-07-15)

Closed the last stale check: the **full-suite** regression comparison also predated the `terms-display` refactor, which
touched `lib/view-models.ts` — a module most suites import, so the blast radius was wider than the 8 suites re-run in
pass 2. Re-ran everything post-refactor:
- **Full integration: 72 failed / 652 passed / 724** — byte-identical to the pre-refactor run and to the baseline
  (72/651/723 + this change's one added test). Zero regressions from the refactor.
- **Full unit (incl. the `dom` component project): 29 files / 330 tests, all green** — the C2 `NotificationBell`
  component tests and the new `terms-display` tests coexist cleanly.

**This pass found no new defects.** All 5 scenarios remain covered with post-refactor evidence; nothing was fixed
because nothing was broken. The change is validated and ready to archive.

## 6. Reconcile spec on archive (deferred to /ralphy-archive)
- [x] Applied the MODIFIED "Gig-Detail Terms Tabs Reflect the Counter" to canonical `openspec/specs/gig/spec.md`. The weak scenario ("…rather than silently showing identical numbers **with no explanation**") is replaced by the per-field not-proposed contract — that wording was the escape hatch the defect lived in: the code *did* render a note, so it satisfied the letter while filling the tab with the client's figures. An explanation no longer licenses substituted figures. Added the live-typing scenario (incl. invalid-value and post-submit behaviour) and the client-tab fixed-reference scenario; added Acceptance Criteria pinning the single-module rule (`lib/terms-display.ts`) that the three-copy drift exposed. 5 scenarios total. A short History note records why the requirement was satisfiable while the tab was useless.
- [x] Left "Proposed Terms Across the Application Lifecycle" (`:1243-1248`) **untouched** — verified by diff: the only change referencing it is a new cross-reference line stating the pre-fill is unchanged. Its pre-fill scenario is still present verbatim.
- [x] Moved `openspec/changes/apply-terms-lock/` → `openspec/archive/apply-terms-lock/`.
