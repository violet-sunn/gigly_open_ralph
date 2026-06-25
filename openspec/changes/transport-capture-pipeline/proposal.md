# transport-capture-pipeline

**Plan:** `openspec/planning/transport-design-from-prototype.md` (change 1 of 8 — the prerequisite that produces the transport source for every later change).

## Why

The live UI diverges from the `gigly_full_design/` prototype because prior campaigns *reconstructed* screens by eye. This initiative instead *transports* the prototype's own rendered markup. To do that reproducibly — and to keep the transport source in the repo rather than in ephemeral scratch files — we need a committed capture pipeline.

The prototype is not static HTML: `Gigly App.dc.html` is a custom runtime (`support.js`) where screens are assembled at runtime from a component bundle and a state machine (`{{ }}` interpolation, `<sc-if>`/`<sc-for>`, `<x-import …from="./design-system/Components.bundle.js">`). The only way to obtain a screen's concrete, fully-resolved markup is to **render it in a browser and read the live DOM**. A headless render also yields a reference screenshot. This was proven this session: all 19 entry route-states rendered clean (zero page errors) and produced both resolved HTML and PNGs.

This change productionizes that proof into a committed script + reference assets.

## What

- A Node script under `scripts/` that serves `gigly_full_design/` over a local static HTTP server, drives Playwright chromium at **1512px** width, navigates each state via `window.__giglyGo({role, route, gig, stage, dispute, modal, tab, applied})`, and writes the fully-resolved page HTML + a reference PNG per state into a tracked location (`design-reference/screens/`).
- Coverage: the **19 role-valid route-states**, plus **every variant state** each screen renders (gig-detail role×status, my-gigs tabs/empty/loading, search results/empty/filtered/loading, both role variants of dual-role screens), plus **overlays** (profile-edit `bio`/`cats`/`stack` modals, notifications dropdown, success toast, destructive-confirmation dialog).
- An npm script (`capture:design`) to run it, and a documented **state → trigger matrix** (`design-reference/STATE-MATRIX.md`).

## Constraints / Non-goals

- **No app code changes.** This change adds tooling and committed reference assets only; it does not modify `app/`.
- **The settings modal is out of scope** this round (settings is deferred per the plan).
- **`Auth.dc.html` is out of scope here** — the auth screens are captured by change 8 (`transport-auth`).
- Desktop-only at fixed 1512px (the prototype's fixed width).

## Impact

- New: `scripts/capture-design.mjs` (or `.ts`), `design-reference/screens/**`, `design-reference/STATE-MATRIX.md`, a `capture:design` entry in `package.json`.
- No runtime/app behavior changes; existing tests unaffected.
