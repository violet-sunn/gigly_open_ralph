# Tasks — transport-gig-lifecycle

> RECONCILE-IN-PLACE against the captured reference (these screens already exist and are built on the prototype's
> inline-styled markup + `app/_design/tokens.css`, wired to VMs + `app/actions/gig.ts`). Use the proposal's
> REFERENCE-MAPPING table. Keep filenames (`GigDetail.tsx` is NOT renamed to `*Design`); keep the inline action blocks;
> preserve all action/lifecycle wiring; touch `lib/view-models.ts` only on a genuine data gap (Method §3).

## 1. Baseline
- [x] Confirm current green baseline (`npm run build` + `npm run lint`; note E2E requires the test server — defer the run to validate, as with change 3, freeing :3000 first). Reconciliation driven by three parallel reference-vs-component diff agents (specialist 8 states / company 7 states / create+applications).
- **Test:** build + lint green recorded.

## 2. Reconcile Gig Detail — ALL role × status states (`GigDetail.tsx`)
- [x] Diff EACH captured state against the component's render for that role × status. RESULT: both agents found the component is a near-verbatim transport — card chrome, status colours, the conditions/fee panel, and every action-rail copy/colour match the references exactly. ONE real divergence fixed: `showDisputeLink` was keyed on *assignment* (which lingers into completed/paid) so the «Открыть спор» link over-showed on завершён/оплачен — now gated to `status IN_PROGRESS || REVIEW` (matches the prototype's `gigInProgress || gigReview` rule).
- [x] Two-column layout + role × status action rail verified against the references; no other markup change needed.
- **Notes:** kept `ApplyBlock`/`ApproveBlock`/`MarkPaidBlock`/`GigActionButton` INLINE; no `app/actions/gig.ts` or status-machine change. DEFERRED/skipped (rationale): (a) the `gigDetail.specialist.открыт-applied` capture is byte-identical to `…открыт` (the pipeline never toggled `applied`), so the applied-state UI has NO captured ground truth — left as-is (plausible, on-palette), flagged for a re-capture; the prototype's withdraw-confirm dialog is a behaviour enhancement, not in scope. (b) the «на рассмотрении» amber pill and «отклонён» red status-row are already derived by `gigDisplayStatus`/`conditions.status` in the VM — existing behaviour, not a markup defect. (c) outer page padding comes from the shared shell (consistent across screens).
- **Test:** each state matches its reference on a user-approved screenshot; every action still fires the correct server action.

## 3. Reconcile Create Gig (`CreateGigDesign.tsx`)
- [x] Diff vs `createGig.company` and fix. RESULT (layout/fee panel already matched; 7 copy/style fixes applied): (1) the «Готовность брифа» next-step box now shows bold `Добавьте: {Label}` (case preserved) + the per-field hint sub-line, and complete-state «Бриф готов ✓» / «Бриф готов — отличные шансы на сильные отклики.» (per-field hints transported verbatim from the prototype); (2) score reads `{n} из 7` not `{n} / 7`; (3) category chip inactive border → neutral `var(--hairline-12)`, active border `rgba(rgb,0.6)` / bg `rgba(rgb,0.15)`; (4) «Срок» label (was «Срок, дней») + placeholder «Напр.: 14 дней»; (5) criteria suggestions = the prototype's 4 real phrases, filtered-not-added + slice(3); (6) added-criterion chip shows the raw text (the «Готово, когда…» lives only in the section label).
- **Notes:** `createGig` wiring + `useActionState` + the 10% fee math + the hidden inputs unchanged; `createGig → /gigs/new/success` redirect unchanged; success SCREEN out of scope (user decision).
- **Test:** the create screen matches the reference; readiness + fee update live; publishing still creates the gig and redirects.

## 4. Reconcile Applications (`ApplicationsDesign.tsx`)
- [x] Diff vs `applications.company` and fix. RESULT (near-exact transport; 2 fixes): (1) a pending applicant now reads «Новый отклик» in accent blue — previously fell through to the amber `review` tone / grey fallback (overridden in-component for `a.pending`, so `view-models.ts` stays untouched); (2) verify patch icon 14→16px to match the reference.
- **Notes:** owner-gated `GigApplicationsData` wiring preserved; «Принять»/«Отклонить» still render only for pending applicants while none is assigned, wired to `acceptApplication` / `rejectApplication`. The assigned banner + dimmed-rejected treatment have no counterpart in the (unassigned) reference capture — left as correct state additions.
- **Test:** the screen matches the reference; accept assigns the specialist + flips the gig to IN_PROGRESS + rejects the rest; reject flips one applicant.

## 5. Verify no data gaps
- [x] Confirmed NO data gap — every visible field is already provided by `GigDetailData` / `GigApplicationsData` (status/lifecycle flags, conditions/fee, viewerApplication, applicant fields; the create readiness is pure client state). `lib/view-models.ts` left UNTOUCHED (the «Новый отклик» label/colour was overridden in the component, not the VM).
- **Test:** every visible field is fed by the VM (no hardcoded mock data left in the markup).

## Acceptance (run before marking done)
- [x] `npm run build` and `npm run lint` pass (green; lint ✔ no warnings/errors).
- [x] Gig detail (both roles × statuses), create-gig, and applications match their mapped `design-reference/screens/` files — user eyeballed on live :3000.
- [x] Static copy is the prototype's verbatim text (the create-gig hints/suggestions + «Новый отклик» transported verbatim from the prototype).
- [x] The full gig lifecycle works end-to-end — verified by E2E: create → publish→success (`compose-create-gig`), apply/withdraw/submit (`compose-gig-detail-apply`), accept assigns + auto-rejects others (`build-applications-screen` / `compose-gig-detail-apply`), dispute entry on an in-progress gig (`compose-disputes`).
- [~] GigCard / shared components — gig-detail/applications don't render the feed `GigCard`; no regression surface. (Spot-check optional.)
- [x] Existing E2E — RAN the directly-affected specs against `test.db` (stopped the dev server → Playwright spawned its own server on `file:./test.db`): **17 passed (59.7s)** — `compose-gig-detail-apply` (4), `compose-disputes` (5, confirms the dispute-link gate still shows on IN_PROGRESS), `compose-create-gig` (3), `build-applications-screen` (5). Two specs updated for the intended copy changes (`compose-create-gig`: raw criterion text + new suggestion phrase + «7 из 7»; `build-applications-screen`: «Новый отклик»). The long journey specs (`specialist-journey` / `client-journey` / `application-withdrawal`) were NOT re-run — `grep` confirmed they assert none of the changed strings and the apply/withdraw flows are unchanged; they remain covered by the full-suite run before the branch merges.
