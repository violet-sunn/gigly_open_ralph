# Tasks — transport-capture-pipeline

> Proven foundation (this session): the serve-over-http + Playwright-`__giglyGo` + `page.content()`/`screenshot()` pipeline already rendered all 19 entry states clean. This change productionizes it with full state coverage. Reuse the proven approach; the notes below carry the gotchas already hit.

## 1. Scaffold the capture script in `scripts/`
- [ ] Create `scripts/capture-design.mjs`: a minimal static HTTP server for `gigly_full_design/` + Playwright chromium at viewport width **1512** (height ~982).
- **Notes:**
  - Default `/` → `Gigly App.dc.html`; serve correct content-types for `.html/.js/.css/.svg/.png/.jpg/.json/.woff(2)`.
  - **Windows gotcha (hit this session):** define the served ROOT with `path.resolve(...)` and compare with `file.startsWith(ROOT)` using resolved paths, or the slash-mismatch (`C:/…` vs `C:\…`) makes every request 404.
  - The script lives **inside** the project, so `import { chromium } from 'playwright'` resolves normally — the `createRequire` workaround used in scratchpad is NOT needed here.
  - Load the page with `waitUntil: 'networkidle'` (the prototype pulls Google Fonts Handjet/Manrope over the network) and `await page.evaluate(() => document.fonts.ready)` before screenshotting, so PNGs don't capture a font-swap.
- **Test:** script starts the server, opens the prototype, and `typeof window.__giglyGo === 'function'` (the nav hook is present).

## 2. Discover the full state → trigger matrix from the prototype source
- [ ] Read `Gigly App.dc.html` (and `support.js` as needed) to enumerate the *valid values* for each `__giglyGo` field: `role`, `route`, `gig`, `stage` (the gig-status values — confirm the exact strings the prototype uses for open/in_progress/review/completed/paid/rejected), `tab` (my-gigs tabs), search filter params, `applied`, `modal` (`bio`/`cats`/`stack`), and overlay state flags (`notifOpen`, toast, confirmation).
- **Notes:** do not guess param values — read them out of the source. Record any state that `__giglyGo` cannot reach as **capture-by-interaction** with the click/keystroke needed.
- **Test:** a draft matrix lists every state with concrete trigger params; cross-checked against the routes in `gigly_full_design/ROUTES.md`.

## 3. Implement full-coverage capture with landing verification
- [ ] Iterate the matrix; for each state: call `window.__giglyGo(params)`, wait for render, then write `design-reference/screens/<state>.html` (`page.content()`) and `<state>.png` (`page.screenshot({ fullPage: true, animations: 'disabled' })`).
- **Notes:**
  - **Verify each navigation actually landed** — do NOT trust `__giglyGo` blindly. After each call, assert a per-state discriminator changed (e.g. the header title text, or a state-unique element). This session showed a naive title-grep matched every screen because nav labels repeat; pick a discriminator that is genuinely unique per state (header `<h1>`, action-panel label, etc.). Fail loudly if a state didn't change.
  - Disable the skeleton shimmer animation (`.gigly-skel` `@keyframes gigly-shimmer`) for stable PNGs — `animations: 'disabled'` plus, if needed, an injected `* { animation: none !important }` for loading-state captures.
  - Filenames must be deterministic and descriptive: `dashboard.specialist`, `gigDetail.company.review`, `myGigs.specialist.inProgress`, `search.empty`, `profile.specialist.modal-stack`, etc.
- **Test:** every matrix row produces exactly one `.html` + one `.png`; the landing-verification assertion passes for all states.

## 4. Wire up the npm script
- [ ] Add `"capture:design": "node scripts/capture-design.mjs"` to `package.json` scripts.
- **Test:** `npm run capture:design` runs the capture end-to-end.

## 5. Document the state → trigger matrix
- [ ] Write `design-reference/STATE-MATRIX.md`: one row per captured state → its `__giglyGo` params (or capture-by-interaction note) → the output filename.
- **Test:** matrix row count == number of `.html` files == number of `.png` files (no orphans either direction).

## 6. Zero-error gate + reproducibility
- [ ] Collect `pageerror` events and failed responses for prototype assets; if any occur, the script exits non-zero and names the offending state.
- [ ] Ensure `design-reference/` is committed (not git-ignored); commit the generated HTML+PNG output.
- **Test:** a full run exits 0 with zero page errors; a second run regenerates the identical file set (idempotent).

## Acceptance (run before marking done)
- [ ] `npm run capture:design` exits 0, prints a per-state OK line, reports zero page errors.
- [ ] `design-reference/screens/` contains an HTML+PNG pair for all 19 role-valid route-states, all variant states (gig-detail ×6 statuses ×roles, my-gigs tabs+empty+loading, search results/empty/filtered/loading, dual-role variants), and the overlays (bio/cats/stack modals, notifications dropdown, success toast, confirmation) — and NOT the settings modal or any `Auth.dc.html` screen.
- [ ] No captured `.html` contains `{{`, `<x-import`, `<sc-if`, or `<sc-for`.
- [ ] `design-reference/STATE-MATRIX.md` is 1:1 with the captured output.
- [ ] No files under `app/` changed (no app code touched).
- [ ] Existing build + E2E suite unaffected (this change adds tooling only).
