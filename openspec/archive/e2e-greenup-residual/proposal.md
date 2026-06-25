# e2e-greenup-residual

## Why

Follow-up to reconciliation #16 (`e2e-journeys-and-greenup`). That change ran the **whole** E2E suite for the first time post-reground and, after a tests-only FK-safe isolation fix, brought it from **47 → 13 failures (186 passed)**. The remaining **13 all fail in isolation on a clean DB** — pre-existing content drift in specs the reconciliation plan marked PASS-AS-IS but never re-verified. They were flagged in `openspec/planning/e2e-greenup-residual.md` for this dedicated change (user decision: "fix isolation, flag auth-flow"). Resolving them greens the whole suite and closes the reconciliation initiative's safety net.

Investigated root causes (the 13 split into three clusters):

### A. Auth / register-wizard cluster (9)
The auth specs were written for the composed 3-step `RegisterWizard` (`app/register/RegisterWizard.tsx`) but drifted from it:
- **Wizard submit label:** the step-3 submit button is **«Продолжить»** (`RegisterWizard` line 195; the consent notice also reads «Нажимая «Продолжить»»). The specs' `registerViaWizard` helper and inline walks click **«Зарегистрироваться»**, which doesn't exist on step 3 → every wizard walk fails. Affected: `auth-flow.spec.ts` (`registerViaWizard` + the inline CLIENT walk + the weak-password walk → `:72`, `:145`, `:250`), `auth-navigation.spec.ts` (the three "Authenticated User Redirects" via `registerViaWizard` → `:111`, `:118`, `:125`), `compose-auth-onboarding.spec.ts` (the full-registration test → `:40`). Note: «Зарегистрироваться» is still the valid **navigation CTA on `/auth`** (homepage → register) — only the **wizard step-3 submit** must change to «Продолжить».
- **Stale `/login` role-card border color:** `auth-flow.spec.ts` asserts `toHaveCSS('border-color', 'rgb(2, 101, 220)')` (the pre-migration blue #0265dc) on the `/login` role card (`:40`, `:140`). The migrated token is **`rgb(0, 136, 255)`** — `auth-navigation.spec.ts` already uses it (its `/login` border tests pass). `auth-flow` was never updated.

### B. Stale create-gig form fill (1)
- **`csrf-protection.spec.ts` `:26`** ("Server Actions work with same-origin requests") fills `textarea[name="acceptanceCriteria"]` directly. In the rebuilt `CreateGigDesign`, `acceptanceCriteria` is a **hidden input** populated by the criteria editor — `page.fill` on it times out. Same stale pattern fixed in the journeys: drive the rebuilt brief (category chip «Программирование» → `input[name="category"]`; criteria editor `getByPlaceholder(/например/)` + «Добавить» → hidden `acceptanceCriteria`) and submit «Опубликовать гиг». The CSRF assertion (the gig is created via a same-origin server action) is unchanged.

### C. Old-kit browse / examples UI (3)
- **`gig-browse-access.spec.ts`** (`:40`, `:111`, `:150`) asserts old-kit English UI for the examples + CLIENT-gating features. Findings: the **`/gigs/examples` route still exists** (`app/(protected)/gigs/examples/page.tsx`, still old-kit «Example Gigs»), but the **«💡 View example gigs for inspiration» link was dropped** from the rebuilt `CreateGigDesign` (`:40` clicks it and fails). The CLIENT browse-gating message «Browse Gigs is only available for specialists» and the SPECIALIST browse heading (`h2:has-text("Поиск гигов")` vs the rebuilt shell `<h1>` «ПОИСК ГИГОВ») need re-verification against the rebuilt `/gigs`. **This cluster needs a baseline pass to confirm what survives**, and a decision on the dropped create-form example link (navigate to `/gigs/examples` directly vs drop that sub-assertion) — to be made WITH THE USER if the gating/link affordance was removed by design.

This change is **tests-only** — the `RegisterWizard`, `CreateGigDesign`, `/gigs`, and `/gigs/examples` behaviour is unchanged; the specs are repointed at the real labels/colors/flow.

## What Changes

- **REWRITE the auth cluster** (`auth-flow.spec.ts`, `auth-navigation.spec.ts`, `compose-auth-onboarding.spec.ts`): the wizard step-3 submit click «Зарегистрироваться» → **«Продолжить»** (keep the `/auth` navigation CTA); `auth-flow`'s `/login` border `rgb(2, 101, 220)` → **`rgb(0, 136, 255)`**.
- **REWRITE `csrf-protection.spec.ts`** create-gig fill to the `CreateGigDesign` sequence (category chip + criteria editor «Добавить» + «Опубликовать гиг»; seed the `programming` category); keep the same-origin gig-creation assertion.
- **RECONCILE `gig-browse-access.spec.ts`** to the surviving examples route + the rebuilt `/gigs` gating/heading; for the dropped create-form example link, navigate to `/gigs/examples` directly (or drop that sub-assertion / delete the test if the gating+examples affordance was removed by design — decide WITH THE USER after baseline).
- **GREENUP:** `npm run clean:test-db && npm run test:e2e` → **0 failures**; confirm the FK-safe isolation from #16 still holds.

## Impact

- **Affected:** `__tests__/e2e/{auth-flow,auth-navigation,compose-auth-onboarding,csrf-protection,gig-browse-access}.spec.ts`.
- **Not touched:** `app/`/`lib/` behaviour (`RegisterWizard`, `CreateGigDesign`, `/gigs`, `/gigs/examples`, `registerUser`, `createGig`); the unit/integration suite (951/951); the #16 FK-safe `resetE2EDb` isolation helper.
- **Outcome:** the whole E2E suite reaches **0 failures**, completing the post-reground greenup begun in #16.
