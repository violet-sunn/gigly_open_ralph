# Gig Validation as Server SSOT + Legible Create/Edit Form

## Why

A third external stress-test pass (tester Арсений, Round-3, 2026-07-14) found the gig-creation flow is **silently unusable** and the edit flow **bypasses limits**:

1. **Create is blocked with no explanation.** `app/(protected)/gigs/new/CreateGigDesign.tsx` gates the submit button on a **client-only** readiness checklist (description ≥20, required goal + deliverables, criteria ≥50). When a field is short, the button is `disabled` and the checkmark stays off with only a vague «Добавьте: <label>» — **no character count, no stated minimum, no reason**. The `CharacterCounter` component (`app/(protected)/gigs/new/character-counter.tsx`) exists but is rendered **nowhere** and is in **English** — even though the UI spec ("Gig Creation Form") mandates live counters. The re-grounding regressed against spec.
2. **Custom acceptance criteria don't count.** Criteria live in a `criteria[]` state; readiness counts `criteria.join('\n').length ≥ 50`. Text typed into the custom-criteria input (`critInput`) only joins `criteria[]` on Enter / «Добавить». A client who types their own criteria without committing sees the checkmark stay off and **cannot create the gig**.
3. **Edit bypasses creation limits.** The real minimums (description length, required goal/deliverables) live **only** in the client checklist. Server `parseGigForm` (`app/actions/gig.ts`) enforces only: non-empty title/description/criteria, criteria ≥50, budget >0, deadline 1–365, stages 1–50. `updateGig` reuses `parseGigForm` but `EditGigDesign.tsx` has no checklist, so **editing saves values that creation would reject**.

The root cause is architectural: **business rules live client-side; the server is the more lenient path.** This is a P0 create-blocker before the diploma defense (~2026-07-19) — a client literally cannot post a gig.

## What Changes

Make the server the single source of truth (SSOT) and the form legible:

- **Server SSOT** — move the real minimums into `parseGigForm` so **both** `createGig` and `updateGig` enforce them, with clear **Russian** error messages. Decided minimums (kept verbatim from the current client checklist — not raised): **description ≥ 20 chars**, **goal REQUIRED**, **deliverables REQUIRED**, criteria ≥50, budget >0, deadline 1–365, stages 1–50. (`goal`/`deliverables` flip from optional → required; `constraints` stays optional.)
- **Legible counters** — render a live, **localized (Russian)** character counter (repurpose `CharacterCounter`) on the description and criteria fields (current/minimum) and any max-bounded field, re-grounded into `CreateGigDesign` (and the edit form) in the `gigly_full_design` skin.
- **Custom criteria always count** — auto-commit pending `critInput` text on submit (and count it toward readiness) plus a «нажмите Добавить» hint.
- **Why-disabled reason** — surface which requirement is unmet and by how much (e.g. «Описание: ещё N символов»), not just a disabled button.
- **Edit parity** — give `EditGigDesign.tsx` the same readiness/counters so it cannot bypass creation limits (defense-in-depth on top of the server SSOT).

## Impact

- **Affected specs:** `gig` (MODIFIED: Create Gig Server Action — description-min + required goal/deliverables + Russian messages; Update Gig Server Action — explicit minimum-enforcement scenarios), `ui` (ADDED: re-grounded localized readiness/counters/custom-criteria; reconciles the pre-reground English counter scenarios in "Gig Creation Form").
- **Affected code:** `app/actions/gig.ts` (`parseGigForm`, `createGig`, `updateGig`), `app/(protected)/gigs/new/CreateGigDesign.tsx`, `app/(protected)/gigs/new/character-counter.tsx`, `app/(protected)/gigs/[id]/edit/EditGigDesign.tsx`.
- **Non-goals:** no change to the fixed-price application/terms state machine; no fee-formula change (10% stays); no new fields; no design re-grounding beyond wiring the counters/reason into the existing skin. `constraints` remains optional.
- **Behavior change of note:** `goal` and `deliverables` become **required** — existing gigs with empty goal/deliverables are unaffected (validation runs on write); but a future edit of such a gig will require them to be filled.
