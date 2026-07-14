# Tasks — gig-validation-ssot

Decided minimums (verbatim from the current client checklist; do NOT raise): **description ≥ 20**, **goal required**, **deliverables required**, **criteria ≥ 50**, budget > 0, deadline 1–365, stages 1–50. `constraints` optional. Fee stays 10%.

## 1. Server SSOT — extend `parseGigForm` (app/actions/gig.ts)
- [x] Add to `parseGigForm` (the shared create/edit validator, ~L39): reject `description` shorter than 20 chars (trimmed); reject empty `goal` (trimmed); reject empty `deliverables` (trimmed). Keep existing gates (criteria ≥50, budget >0, deadline 1–365, stages 1–50).
- [x] Ensure every new rejection returns a clear **Russian** message (e.g. «Описание должно быть не короче 20 символов…», «Укажите цель гига.», «Опишите ожидаемый результат.»). Match the tone of the existing Russian messages in this file.
- [x] Confirm `createGig` and `updateGig` both flow through `parseGigForm` (updateGig already does at L198) — no rule duplicated outside it.
- **Test plan:** unit — call `parseGigForm` with (a) 12-char description → error; (b) empty goal → error; (c) empty deliverables → error; (d) all valid → parsed fields. Integration — `createGig` and `updateGig` reject the same sub-minimum inputs with the same messages.

## 2. Localized live counters — repurpose `character-counter.tsx`
- [x] Rewrite `app/(protected)/gigs/new/character-counter.tsx` to render Russian text (e.g. «{current} / {min} символов», «{current} / {max} символов»); keep `aria-live="polite"` + descriptive `aria-label`; keep the min/max color signalling but token-based (`gigly_full_design` skin, not `text-red-600` kit classes).
- [x] Render the counter under the **description** field (min 20) and the **criteria** area (min 50) in `CreateGigDesign.tsx`; add a max counter to any max-bounded field if present.
- **Test plan:** live — typing in description/criteria shows a live Russian counter that updates per keystroke and flips its state at the threshold.

## 3. Why-disabled guidance — `CreateGigDesign.tsx`
- [x] Replace the bare disabled button + vague «Добавьте: <label>» with guidance that names the unmet requirement(s) and the shortfall in Russian (e.g. «Описание: ещё N символов»). Reuse the existing `checks`/`firstGap` machinery but report the numeric deficit, and don't collapse to only the first gap when several remain (or at least make remaining ones discoverable via the checklist ○/✓ + a summary).
- [x] Keep the submit `disabled={!canSubmit}`; `canSubmit` must mirror the server rules exactly (description ≥20, goal+deliverables non-empty, criteria ≥50, budget >0, deadline present).
- **Test plan:** live — short description → button disabled + «ещё N символов»; reaching 20 clears it and enables submit.

## 4. Custom criteria always count — `CreateGigDesign.tsx`
- [x] On submit, auto-commit any pending `critInput` text into `criteria[]` (via `addCrit`) before building the hidden `acceptanceCriteria` input, so typed-but-uncommitted criteria are never dropped.
- [x] Count pending `critInput` toward the readiness check (or auto-commit early) so the checkmark reflects typed text.
- [x] Add a Russian hint near the input when `critInput` is non-empty and not yet added (e.g. «нажмите Добавить»).
- **Test plan:** live — type a ≥50-char custom criterion, do NOT click «Добавить», submit → gig is created (criterion auto-committed); the readiness checkmark reflects the typed text.

## 5. Edit form parity — `app/(protected)/gigs/[id]/edit/EditGigDesign.tsx`
- [x] Port the same readiness affordances to the edit form: localized counters, why-disabled guidance, custom-criteria auto-commit/hint. Reuse the create form's building blocks where possible (extract shared bits if clean; otherwise mirror).
- [x] Verify `updateGig` rejects sub-minimum description/criteria/goal/deliverables server-side even if the UI is bypassed (covered by Task 1, but assert here in the edit context).
- **Test plan:** live — open edit on an existing gig, shorten description below 20 / clear goal → button disabled with reason; force-submit (or direct action) → server rejects.

## 6. Verify live end-to-end + typecheck
- [x] `npx tsc --noEmit` clean on the touched files.
- [x] Live Playwright pass on seed data (client `ivan.petrov@techcorp.ru` / `TestPass123`, dev server on :3000):
  - (i) short description → counter shows deficit + reason, submit disabled; at ≥20 it enables and the gig is created.
  - (ii) custom-only criteria typed but not committed → gig still creatable.
  - (iii) edit an existing gig: cannot save description < 20 or criteria < 50 (server rejects with a clear Russian message).
- [x] Clean up any test gigs created in `dev.db`; remove temp scripts.

## 7. Reconcile spec on archive (deferred to /ralphy-archive)
- [x] Applied the MODIFIED gig requirements to canonical `openspec/specs/gig/spec.md`: updated "Create Gig Server Action" (server-authoritative, description ≥20, required goal/deliverables, Russian messages, redirect `/gigs/new/success`), updated "Update Gig Server Action" (shared `parseGigForm`, added edit-cannot-bypass scenarios for description/goal/deliverables), and ADDED "Shared Server-Authoritative Gig Validator (parseGigForm SSOT)".
- [x] Reconciled `openspec/specs/ui/spec.md`: superseded the English `"X / 50 characters (minimum)"` / `text-red-600` kit counter scenarios under "Gig Creation Form" (localized + token-based, noted goal/deliverables now required, live component = `CreateGigDesign.tsx`), and ADDED the 4 localized requirements (Localized Live Character Counters, Why-Disabled Guidance, Custom Criteria Always Count, Edit Form Readiness Parity).
- [x] Moved `openspec/changes/gig-validation-ssot/` → `openspec/archive/gig-validation-ssot/`.

## Verification summary (2026-07-15)
- **Live E2E (authoritative):** 12/12 checks passed against the running app — short-description client gate + «ещё N символов» reason + live «N / 20 символов» counter + **server rejection on forced submit (proves SSOT, not just client gating)** + auto-commit of uncommitted criteria (persisted) + edit-form parity with no bypass. Seed client `ivan.petrov@techcorp.ru`.
- **Typecheck:** `tsc --noEmit` — 0 errors in any touched source file (project's 33 pre-existing `__tests__` errors unchanged).
- **Integration blast-radius reconciled (goal/deliverables now required + description ≥20 + RU messages):** measured the true pre-change baseline (stashing `parseGigForm`) and fixed every regression at source. Now green: `gig-creation` 49/49, `structured-fields` 11/11, `gig-editing` 19/19, `xss-protection` 31/31, `gig-deadline-milestones` 6/6, `category-taxonomy` 9/9. Tests asserting the OLD optional-goal/deliverables contract were flipped to the new required contract.
- **Out of scope (pre-existing drift, NOT caused by this change):** `gig-authorization` (baseline 10 failed → 9 now) and `authorization-errors` (4 → 4) still fail on OLD English error-string assertions — tracked English-drift greenup ([[test-suite-english-string-drift]]), unaffected by this change.
