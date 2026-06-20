# Spec delta — ui (add-light-theme)

Adds the net-new **light theme** as a runtime `[data-theme]` mode: the token colour/shadow/gradient layer becomes
var-backed (switchable, not build-baked), the light values are added (depth via shadow + grey, not glow), and a
Settings → Внешний вид switch persists the choice in `localStorage['gigly-theme']`. Dark stays the default and is
visually unchanged; brand `#0088ff` and the Handjet pixel type are theme-invariant; status↔lifecycle stays one-to-one.

## ADDED Requirements

### Requirement: Token Layer Is Runtime-Themeable via [data-theme]
The token colour layer (and the box-shadow + gradient appearance tokens) MUST resolve through **runtime CSS variables**
that switch on the root `[data-theme]` attribute, instead of build-time literals. The Tailwind-consumed
`tokens.colors[key]` MUST be `var(--<key>)`; `scripts/generated-tokens.css` MUST define each token's **dark** value in
`:root` and its **light** override in `[data-theme="light"]`; and `app/globals.css` MUST import that var layer so it
loads. **Dark MUST remain the default** (`:root` = dark; no attribute or `data-theme="dark"` both render dark) and
**visually unchanged** (the dark var values equal the prior literals).

#### Scenario: Tailwind utilities resolve through switchable vars
- GIVEN the regenerated token pipeline
- THEN `tokens.colors[key]` MUST be `var(--<key>)` (not hex), `generated-tokens.css` `:root` MUST carry the dark hex per
  token, and `[data-theme="light"]` MUST carry the declared light overrides
- AND `app/globals.css` MUST `@import` `generated-tokens.css`
- AND a token-pure utility (e.g. `bg-surface-level-0`) MUST render the dark value with no/`dark` `data-theme` and the
  light value under `data-theme="light"`

#### Scenario: Dark theme is the default and unregressed
- GIVEN the app with no stored theme
- THEN it MUST render the dark theme, and the dark token values MUST equal the pre-change literals (no visual regression)

#### Scenario: No Tailwind /opacity modifier on a var-backed colour
- GIVEN colours now resolve as `var(--<key>)` (which Tailwind cannot apply an `/NN` opacity modifier to)
- THEN no component may use a `bg-/text-/border-…/<opacity>` modifier on a token colour; an alpha fill MUST be a
  dedicated full-value token (`color-semantic.tint.*`, e.g. `bg-tint-brand`)
- AND such tint tokens MUST themselves be themeable (a `light` value where the design mutes the fill, ТЗ §4)

### Requirement: Light Token Values Added (Depth via Shadow + Grey; Brand Invariant)
Each themeable colour/shadow/gradient token MUST gain an optional `"light"` value in the SSOT (absence = identical in
both themes), sourced from `fig-tokens.css` Light mode + `ТЗ — Светлая тема.md`: surfaces (app `#f4f5f7`, elevated
`#ffffff`, sunken `#eceef1`), text (primary `#0e121b`, secondary `#3f4654`, muted `#6b7280`, disabled `#aab0bb`),
borders (`#e6e8ec`), brand **fill** tints (lightened + bordered), the 6 **status** triads (saturated text/border + a
flat 8–10% fill replacing the radial glow), and the glass→solid-card shadow. `brand.default` `#0088ff` and the font
families MUST NOT receive a light override.

#### Scenario: Light values present, brand + type invariant, status one-to-one
- GIVEN `design-tokens.json` after the change
- THEN the themeable surface/text/border/status/shadow tokens MUST carry a `light` value, and `brand.default` MUST NOT
  (it stays `#0088ff` in both themes)
- AND each status MUST keep its distinct hue in light (text/border saturated, glow → flat fill), preserving the
  one-to-one status↔lifecycle mapping
- AND no font-family token receives a light override (Handjet/Manrope/system identical across themes)

### Requirement: Theme Switch Persists and Applies Without Flash
A theme controller MUST set `document.documentElement[data-theme]`, persist the choice to `localStorage['gigly-theme']`,
and restore it on load. `app/layout.tsx` MUST run an **inline boot script** in `<head>` that applies the stored theme
**before first paint** (no flash-of-incorrect-theme). `app/(protected)/settings/Settings.tsx` MUST expose the Внешний
вид control (Тёмная / Светлая) wired to the controller, reflecting and updating the persisted value.

#### Scenario: Toggle flips the theme and survives reload
- GIVEN a user on the default (dark) app
- WHEN they switch to Светлая in Settings → Внешний вид
- THEN `document.documentElement` MUST get `data-theme="light"` and the UI MUST re-render light immediately
- AND `localStorage['gigly-theme']` MUST be `"light"`, and after a full reload the app MUST restore light with no
  flash-of-dark (the inline boot script sets the attribute before paint)

#### Scenario: Dark is restored / default when stored or absent
- GIVEN `localStorage['gigly-theme']` is `"dark"` or unset
- WHEN the app loads
- THEN it MUST render the dark theme (default), with no `data-theme="light"` on the root

### Requirement: Both Themes Token-Pure; Pipeline + Suites Green
Both themes MUST be token-pure (F2) — the light values live in the token layer, not as component literals — and the
validator, token-purity lint, composition lint, build, unit suite, and the new theme E2E MUST pass. The validator MUST
verify the var-backed colours + the `:root` dark / `[data-theme="light"]` value layers.

#### Scenario: Deterministic gates pass for both themes
- GIVEN the change
- WHEN `npm run validate:tokens`, `npm run lint:tokens`, `npm run lint:composition`, `npm run build`,
  `npm run clean:test-db && npm run test:unit`, and the theme-switch E2E run
- THEN all MUST pass — tokens valid (var-backed, dark + light layers in sync, no parody), the purity baseline does not
  increase, the app builds, the unit suite is green, and the E2E asserts the toggle + persistence + dark default

**Acceptance Criteria:**
- Tailwind colours are `var(--*)`; `generated-tokens.css` carries `:root` (dark) + `[data-theme="light"]` (light) and is imported by `globals.css`; dark is default + unchanged
- Light values added for surfaces/text/border/status/shadow per `ТЗ`/`fig-tokens.css`; `brand.default` + fonts invariant; status one-to-one
- Settings → Внешний вид toggles `data-theme`, persists in `localStorage['gigly-theme']`, restored before paint (no flash)
- `validate:tokens` + `lint:tokens` + `lint:composition` + `build` + `test:unit` + theme-switch E2E green
