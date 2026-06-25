# Testing Specification Delta

## REMOVED Requirements

### Requirement: Workbench Visual-Fidelity Golden Gate E2E Coverage

**Reason for removal:** `__tests__/e2e/fidelity-gate.spec.ts` enforced a self-referential **≤1% golden-image gate** over the legacy kit `/workbench/*` catalog (tokens/primitives/blocks/templates/layout/screens/generativity) in both themes at 1440px, diffing each live render vs a committed golden via `scripts/design-system/fidelity-diff.js`. After the `gigly_full_design` reground the shipped app no longer derives from that kit catalog — every screen was rebuilt on the prototype's inline-styled markup + the token bridge `app/_design/tokens.css`. The gate is the visual arm of the retired F2/F5 apparatus (`lint:tokens` / `lint:composition` were already removed from `package.json`); its goldens are environment-pinned to the project's Playwright Chromium (flaky across OS / font rendering) and gate a surface the product does not ship from. It is removed — not rewritten — and its dangling `test:fidelity` / `test:fidelity:update` npm scripts are removed with it.

The platform previously SHALL have asserted that every `/workbench/*` surface in both themes rendered within 1% differing pixels of its committed golden image.

#### Scenario: Workbench surface stays within 1% of its golden

**Given** the `/workbench/tokens` (or any catalogued) surface at 1440px in a given theme
**When** its live render is diffed against the committed golden
**Then** the differing-pixel ratio SHALL be ≤ 1%

> Removed: the golden gate covered the superseded kit `/workbench` catalog, not the shipped `gigly_full_design` screens; it is the visual sibling of the retired `lint:tokens`/`lint:composition` gates. The shipped design layer is instead covered by the new design-token render requirement below.

---

### Requirement: Workbench Fidelity-Capture Apparatus E2E Coverage

**Reason for removal:** `__tests__/e2e/fidelity.spec.ts` (in its pre-reground form) rendered the `/workbench/*` surfaces, diffed the composed-screen surface vs a *lossy* reference frame (`docs/design-system/reference-renders/frames/specialist-dashboard.lossy.jpg`) via `fidelity-diff.js`, and asserted only that the apparatus produced a numeric ratio (explicitly informational, "≤1% deferred to Phase 2"). The kit-derived "Phase 2 design-lock" workflow it scaffolded was abandoned by the reground. This coverage is retired and **replaced** in the same file by the design-token render requirement below.

The platform previously SHALL have rendered each catalogued `/workbench/*` surface at 1440px and produced a numeric pixel-diff ratio vs a reference frame (informational; not gated).

#### Scenario: Capture apparatus renders a surface and yields a ratio

**Given** a catalogued `/workbench/*` surface at 1440px
**When** it is rendered and diffed against its reference frame
**Then** the diff SHALL produce a numeric ratio (asserted only to be a number)

> Removed: the capture apparatus targeted the legacy kit catalog and a lossy reference frame from an abandoned workflow; the file is rewritten to assert the shipped token layer renders.

## ADDED Requirements

### Requirement: Design-Token Render E2E Coverage

The platform SHALL provide an E2E spec (`__tests__/e2e/fidelity.spec.ts`) that verifies the shipped design-token bridge `app/_design/tokens.css` actually loads and resolves in the browser on a rebuilt design route, in both the default (dark) and light (`data-theme="light"`) states. The spec SHALL read resolved `:root` CSS custom properties (not per-screen markup) so it stays stable across the per-screen REWRITE changes, and SHALL NOT reference deleted kit components, the `/workbench` catalog, `scripts/design-system/fidelity-diff.js`, or any removed lint script.

#### Scenario: Design tokens resolve to their committed dark values

**Given** an authenticated user (via `setE2ESession`) on a rebuilt route that imports `app/_design/tokens.css` (e.g. `/dashboard`)
**When** the page has loaded in the default (dark) theme
**Then** `getComputedStyle(document.documentElement)` SHALL resolve the design tokens to their committed dark values (e.g. `--surface-card` = `#0e101a`, `--text-1` = `#ffffff`)

**Acceptance Criteria**:
- The spec authenticates and navigates to a route whose rendered component imports `app/_design/tokens.css`
- At least two `:root` design tokens resolve to their exact `tokens.css` dark values
- The spec imports neither `fidelity-diff.js` nor any `/workbench` route

#### Scenario: Light theme override from tokens.css cascades

**Given** the same route with the tokens resolved in dark
**When** `data-theme="light"` is set on the document element
**Then** the tokens SHALL resolve to the light values defined **only** in `tokens.css`'s `html[data-theme="light"]` block (e.g. `--surface-card` = `#ffffff`, `--accent-ink` = `#0a66c2`, `--surface-app` = `#f4f5f7`)

**Acceptance Criteria**:
- Switching `data-theme` to `light` re-resolves the asserted tokens to their light values
- The light values asserted exist only in `app/_design/tokens.css` (proving that file loaded, not merely `globals.css`)
- `npx playwright test __tests__/e2e/fidelity.spec.ts` passes after `npm run clean:test-db`

#### Scenario: Spec is stable across per-screen rewrites

**Given** the per-screen REWRITE changes (#3–#14) will rewrite the design screens' markup
**When** those changes land
**Then** this spec SHALL continue to pass because it asserts resolved `:root` custom properties, not screen-specific elements, selectors, or colours

**Acceptance Criteria**:
- No assertion targets a per-screen element, label, or computed element colour
- The spec depends only on the route loading `tokens.css` and the token values themselves
