# Tasks — examples-for-clients

**Read the proposal first.** Two things shape this change:
1. The create-gig link is **already specced** (`ui/spec.md:2539`) and simply missing — a regression from the re-ground. `e2e/gig-browse-access.spec.ts:74` even *documents* the loss in a comment and navigates directly instead of clicking it. Restore the feature; do not weaken the test further.
2. **Decided:** no CLIENT-only role gate (specialist access is deliberately specced + tested), and the «использовать как шаблон» prefill is deferred. Both are non-goals — see the proposal.

`CreateGigDesign.tsx` carries the C1 validation SSOT work (checklist, counters, why-disabled, criteria auto-commit). **This change is additive: one link.** Do not refactor around it.

> **Two plan premises were wrong; both corrected during implementation — see Task 2a and Task 5 notes.**

## 1. Restore the examples entry point on the creation screen ✅
- [x] `app/(protected)/gigs/new/CreateGigDesign.tsx`: added «💡 Посмотреть примеры» → `/gigs/examples?from=new`, placed in the existing brief-quality hint banner at the top of the screen (the banner already tells the user how to write a good brief, so "see examples" belongs there).
- [x] `target="_blank"` + `rel="noopener"` — the brief lives in `useState`; an in-tab navigation would destroy it.
- [x] Token-pure inline styling (Handjet, `var(--om-accent)`, fig tokens); no kit classes.
- [x] Nothing else in the file touched — the C1 readiness machinery is byte-for-byte unchanged.
- **Verified:** live — link visible, `href=/gigs/examples?from=new`, `target=_blank rel=noopener`, opens a 2nd tab; the half-filled brief and the «3 из 7» checklist are identical after opening it.

## 2. Fix the dead BackButton route + add the return-to-creation context ✅
- [x] `app/components/BackButton.tsx`: `from === 'examples'` → `/gigs/examples` (was `/dashboard/gigs/examples`, **not a route**).
- [x] Added `from === 'new'` → `/gigs/new`, «← Назад к созданию гига».
- [x] Other contexts (browse/profile/dashboard/admin) untouched, English text included.
- [x] **Flipped `__tests__/integration/back-button.test.tsx:70`**, which asserted the dead route, with the reason recorded in a comment. Mutation-checked: restoring `/dashboard/gigs/examples` fails the suite (1 failed / 15 passed), so the assertion bites.
- **Verified:** 16/16 green (15 + the new `from=new` case).

## 2a. Make the gig-detail back control honor `?from=examples` ✅ — **NOT IN THE ORIGINAL PLAN**
> **Premise correction.** The plan assumed a gig detail opened with `?from=examples` renders `BackButton`. It does not. The re-grounded `GigDetail` ships its **own** «← Назад к гигам» control and never renders `BackButton` — `[id]/page.tsx` even documents this ("no breadcrumb / back-button chrome is layered on here"). So `?from=examples` on the example cards has been **inert since the re-ground**, and the examples page is now the *only* live consumer of `BackButton` in the app.
>
> This surfaced only under live verification, and it mattered: the control always pushed `/gigs`, which is **SPECIALIST-only** — a CLIENT who opened an example and clicked back was redirected to `/dashboard`, stranded away from both the examples and their draft. That is a dead end in the exact flow this change creates, so fixing it is this requirement, just implemented where the code actually lives.

- [x] `GigDetail.tsx`: new optional `from` prop; back control reads «← Назад к примерам» → `/gigs/examples` when `from === 'examples'`, else the original «← Назад к гигам» → `/gigs`.
- [x] `[id]/page.tsx`: threads `from` from `searchParams` (server-side) rather than adding `useSearchParams` — keeps data at the page layer and avoids a Suspense boundary.
- [x] Left the «Демонстрационный гиг» notice's «Перейти к поиску гигов» → `/gigs` alone: that is a deliberate CTA, not a back control.
- [x] **Regression guard added during validation** — `gig-browse-access.spec.ts` now has *"CLIENT returns from an example gig back to the examples, not to the specialist browse"*: it opens the example from the list, clicks «← Назад к примерам», and asserts it lands on the examples. Mutation-checked: restoring the unconditional `router.push("/gigs")` fails it.
- **Verified:** live — «← Назад к примерам» renders and returns to `/gigs/examples`; a gig with no `?from` still shows «← Назад к гигам». E2E 5/5.

## 3. Localize + re-ground the examples page ✅
- [x] New `app/(protected)/gigs/examples/ExamplesDesign.tsx` — Russian heading «Примеры гигов» + count badge, brief-focused intro, cards (title + «✨ пример» + budget + description + tags + date), matching the `DisputesDesign`/`MyGigsDesign` list idiom on `app/_design/tokens.css`. Server component: the rows are plain links, so it stays out of the client bundle.
- [x] `page.tsx` reduced to the data layer (session → query → VM → render), with `BackButton` kept in its Suspense boundary.
- [x] Russian empty state built into the design component; the kit `EmptyState` (English, kit classes) is no longer used here.
- [x] **Dropped the unused `client: { select: { email, clientProfile } }` include** — rendered nowhere, and an unnecessary personal-data fetch on a route with no role check. Query still `isExample: true` + `status: 'OPEN'`, newest first.
- [x] Cards still link to `/gigs/{id}?from=examples` — and, as of Task 2a, that parameter now actually does something.
- [x] **Test gap closed during validation** — new `__tests__/unit/components/ExamplesDesign.test.tsx` (9 tests). The **empty branch could never be live-verified**: the seeded database always has example gigs, so a click-through only ever exercises the populated list. Covers the Russian empty state + «✨», the absence of the superseded English strings, the absence of the kit `EmptyState`'s classes, the Russian «✨ пример» badge, and the `?from=examples` card links. Mutation-checked: regressing the empty state to English *and* dropping `?from=examples` fails 4 of the 9.
- **Note:** kept the page's local `formatRoubles` rather than importing `formatBudgetRub` from `lib/terms-display` — coupling an examples page to the *terms* module for one helper is the wrong dependency. The wider `formatRoubles` duplication (6 files) is a real but separate cleanup.
- **Verified:** live — Russian throughout, no «Example Gigs» / «✨ Example» anywhere in the DOM, heading computed font is `Handjet, monospace`, 5 example cards listed.

## 4. Restore the E2E that was weakened ✅
- [x] `__tests__/e2e/gig-browse-access.spec.ts`: the CLIENT test now **clicks** the link on `/gigs/new` and follows the popup, instead of `page.goto`-ing the examples URL. Stale comment removed. It fails if the entry point is ever dropped again — which is the point.
- [x] Updated the SPECIALIST test's heading assertion to the Russian «Примеры гигов»; its access assertions are unchanged.
- **Verified:** `npx playwright test __tests__/e2e/gig-browse-access.spec.ts` → **4/4 passed**.

## 5. Verify live end-to-end ✅
- [x] `npx tsc --noEmit` — no errors in any touched file (the repo's pre-existing test-file errors are untouched and unrelated).
- [x] `npm run build` clean; server killed **by PID** before building (`Get-NetTCPConnection` → `Stop-Process`), port confirmed free.
- [x] Playwright live pass against a **production build**, seed client `ivan.petrov@techcorp.ru` / specialist `alexey.ivanov@mail.ru`: **21/21 checks** across (i) entry point, (ii) brief survival, (iii) localization + re-ground, (iv) both return paths, (v) unchanged specialist access.
- [x] Temp scripts removed.
- **Note:** the plan's `lint:tokens` / `lint:composition` gates **do not exist** as npm scripts (only `lint:contrast` / `lint:generativity`; the F2/F5 gates were retired with the design-code rebuild). Token purity was verified directly instead — computed font on the rendered page + no kit classes in the new markup.
- **Regression baseline:** full suite = **72 failed / 1001 passed**. Stashing only the C5 source files and re-running the same 14 failing suites gives **72 failed** — identical. Zero regressions; those 14 are the tracked English-string drift. Touched suites: **65/65 green**.
- **Re-validated on the final tree** (after the validation-pass test additions, and after two mutate/restore cycles invalidated the earlier evidence): rebuild clean → live **21/21** → E2E **5/5** → full suite **72 failed / 1010 passed** (+9 = the new component tests; failures unchanged, same 14 files) → `tsc --noEmit` clean on every touched file.

## 6. Reconcile spec on archive ✅
- [x] "Examples Page Back Navigation" → renamed **"Examples Page Entry Point and Back Navigation"**; entry point restated against `CreateGigDesign` (Russian «💡 Посмотреть примеры», `?from=new`, new tab); added the brief-survival, `from=new` return, gig-detail `from=examples` return, and no-`from` regression scenarios; added the note on why the return path lives on `GigDetail`'s own control rather than `BackButton`. History note records the regression + the weakened E2E.
  - The old scenario specced the link as `?from=**dashboard**`; changed to `?from=new` so the return lands on the creation screen the viewer came from. The `from=dashboard` scenario still holds (BackButton keeps that context) and was left in place.
  - Note: the superseded scenario already said *"link already opens in new tab"* — independent corroboration of the new-tab decision.
- [x] "BackButton Component Context Handling" (`:2428`) → examples href corrected to `/gigs/examples` (+ explicit MUST NOT on the 404 route); added the `from=new` scenario.
- [x] "Example Gigs Page Empty State Enhancement" → Russian; now forbids the kit `EmptyState`, with the contradiction against token purity recorded. "(CLIENT or SPECIALIST)" scoping kept — no role gate added.
- [x] ADDED "Example Gigs Page Is Localized and Re-grounded" (4 scenarios + acceptance criteria).
- [x] **"Comfortable «Назад к гигам» Back Control" (`:8452`) generalized — not in the original plan.** It named the label as a fixed string and scoped its scenario to a specialist; the label is now conditional, and a specialist *can* reach `?from=examples` (the examples page is not role-gated), so the requirement was stale. Retitled to «Назад», scenario widened to any viewer/either label; the ≥32px hit-area + hover guarantee is unchanged and still satisfied (same element, same styles).
- [x] Left "Gig Browse Page Empty State Enhancement" (the specialist empty-browse "View Example Gigs" entry) **untouched** — specced, legitimate, and not contradicted now that access is unchanged.
