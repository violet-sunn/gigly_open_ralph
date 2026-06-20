# add-light-theme

**Type:** Regular change (design-system / theming — net-new capability)
**Created:** 2026-06-19
**Plan:** `openspec/planning/full-design-reground.md` — Phase 1 (token + theme foundation)
**Capability:** `ui` (the token layer + a runtime theme switch)
**Depends on:** `reconcile-tokens-to-full-design` (archived — the completed dark/base scale + status triads this themes).

## Why

The design ships a **light theme** as a first-class second mode (`ТЗ — Светлая тема.md`, `fig-tokens.css` Light/IC
modes) with a Settings → Внешний вид switch — but the coded app **can't theme**. `tailwind.config.ts` spreads
`tokens.colors` as **literal hex**, so `bg-surface-level-0` compiles to `#01030e` at build time; `app/globals.css`
states outright "no runtime CSS-var dependency," and the CSS-var mirror `scripts/generated-tokens.css` is **never
imported**. A `[data-theme]` attribute would do nothing.

So light theme is **net-new and architectural**: the token layer must resolve through **runtime CSS variables** that
switch on `[data-theme="light"]`. The ТЗ's central principle is that light is **not** a brightness inversion — depth
is rebuilt with **shadow + grey layers** (white cards float on a warm-grey app bg) rather than the dark theme's glow,
while the **brand `#0088ff` and the Handjet pixel type stay identical** in both modes (the brand anchor). The status
colour↔lifecycle mapping stays one-to-one (a `project.md` requirement).

The good news: the `:root` dark var mirror **already exists** in `generated-tokens.css` (every `--surface-level-0`,
`--status-*`, etc.) — it's just unused. This change turns the token layer var-backed, imports it, adds the light
overrides, and wires the switch — **with the dark var values kept equal to the current literals, so the dark theme is
pixel-identical (zero regression)**.

## What

- **Make the token colour layer var-backed (the mechanism).** Change `scripts/parse-design-tokens.js` so the emitted
  `tokens.colors[key]` (consumed by Tailwind) is `var(--<key>)` instead of hex; the parser already emits the dark hex
  into `generated-tokens.css` `:root`. Add a `[data-theme="light"] { … }` block carrying the light overrides. Do the
  same for the **box-shadow** and **gradient** appearance tokens (depth/glow differ by theme). `app/globals.css` MUST
  now `@import` `generated-tokens.css` so the var layer loads. Result: every **token-pure** Tailwind utility
  (`bg-*`, `text-*`, `border-*`, `shadow-*`, `bg-gradient` recipes) themes automatically.
- **Add the light token values to the SSOT.** Each themeable token gains an optional `"light"` sibling
  (`{ "value": <dark>, "light": <light>, … }`); absence = same in both themes (so `brand.default #0088ff` stays). Source
  from `fig-tokens.css` Light mode + the ТЗ palette — surfaces (`primary #f4f5f7` / `elevated #fff` / `sunken #eceef1`),
  text (`primary #0e121b` / `secondary #3f4654` / `muted #6b7280` / `disabled #aab0bb`), borders (`#e6e8ec`), the brand
  **fill** tints (lighter + bordered, brand itself unchanged), the 6 **status** triads (saturated text/border + flat
  8–10% fills replacing the radial glow), the glass→solid-card shadow, overlays.
- **Theme switch + persistence + no-flash.** A small client controller sets
  `document.documentElement.setAttribute('data-theme', 'light'|'dark')`, persists to `localStorage['gigly-theme']`, and
  reads it on load. A tiny **inline boot script** in `app/layout.tsx` `<head>` applies the stored theme **before paint**
  (no flash-of-dark). **Dark is the default** (`:root` = dark; no attribute / `data-theme="dark"` both render dark).
- **Settings → Внешний вид.** Wire the appearance control in `app/(protected)/settings/Settings.tsx` to the
  controller (Тёмная / Светлая), reflecting + updating the persisted choice.
- **Update the validator.** `scripts/design-system/validate-tokens.js` moves its drift check to the CSS-var layer:
  assert `tokens.colors[key]` is `var(--<key>)`, that `generated-tokens.css` `:root` carries each token's **dark** value,
  and that `[data-theme="light"]` carries every declared `.light` override. Statuses/categories/parody checks unchanged.

## Key facts / decisions

- **Dark is unchanged + default; zero regression.** The dark var values equal today's literals (the prototype's proven
  approach), so converting to vars is visually a no-op on dark. `:root` = dark; `[data-theme="light"]` overrides.
- **Brand `#0088ff` + Handjet are theme-invariant.** No `light` override on `brand.default` or the font families; only
  the brand *fill tints* + hover physics differ (ТЗ §4).
- **Status stays one-to-one; glow → flat fill on light.** Each status keeps its hue (text/border, +~10% saturation on
  light); the radial `status-*-glow` is overridden to a flat 8–10% fill on light (glow is invisible on white, ТЗ §6).
- **Token-pure components theme for free; legacy literals don't.** Components reference tokens (F2/F5 lint), so the
  var-backed layer themes them app-wide. The **74 baselined legacy raw-literal occurrences** (lint:tokens) won't theme
  — they are pre-existing debt; addressing them is incremental (per-screen, Phase 3), not this change.
- **Opacity-modifier caveat.** Plain `var(--x)` colours don't support Tailwind `/opacity` modifiers; the kit uses
  dedicated `overlay.*` / `opacity-*` tokens instead, so this is a non-issue — verified during implementation (any
  `bg-token/NN` usage, if found, is migrated to an overlay token).

## Scope

- **Pipeline:** `scripts/parse-design-tokens.js` (var-backed colours + `[data-theme=light]` + shadow/gradient theming),
  regenerated `scripts/generated-tokens.{js,css}`, `app/globals.css` (`@import` the var layer), `tailwind.config.ts`
  (unchanged — it already spreads `tokens.*`), `scripts/design-system/validate-tokens.js` (drift check → CSS layer).
- **Token SSOT:** `openspec/specs/ui/design-tokens.json` — `light` siblings on the themeable colour/shadow/gradient tokens.
- **Runtime:** `app/layout.tsx` (no-flash boot script), a `theme` client controller, `app/(protected)/settings/Settings.tsx`
  (the Внешний вид switch).
- **Tests:** an E2E `__tests__/e2e/theme-switch.spec.ts` (toggle flips `data-theme`, persists across reload, dark default);
  unit/integration coverage for the controller + the parser's light emission; the existing suites stay green.
- **Docs:** a theming note in `docs/DESIGN_SYSTEM_SPEC.md` + check the Phase-1 `add-light-theme` item.

## Non-goals

- The exhaustive **per-screen visual review** of every screen/modal/state in both themes + the formal **WCAG AA
  contrast audit** of each text-on-surface pair (ТЗ §8.4 / §9.3) — that rides the **Phase-3 screen reconciliations**
  (each reconciled screen is reviewed in both themes) + a dedicated `light-theme-screen-audit` follow-up. This change
  delivers the **mechanism + the token values + the switch**, making the toggle functional app-wide for token-pure UI.
- Fixing the **74 legacy raw-literal occurrences** (they won't theme; pre-existing debt, addressed per-screen).
- The **logo-on-light "плашка"** design decision (ТЗ §5 — flagged for designer; the Handjet wordmark renders, dark
  is default).
- `prefers-color-scheme` auto-switching, a high-contrast mode, and the theme-transition animation (ТЗ §10).

## References

`gigly_full_design/ТЗ - Светлая тема.md` (the light-theme brief — palette, depth principle, acceptance);
`gigly_full_design/design-system/fig-tokens.css` (Light/IC modes) + `styles.css` (the prototype's `[data-theme]`
layer); `app/globals.css`, `tailwind.config.ts`, `scripts/parse-design-tokens.js`, `scripts/generated-tokens.{js,css}`,
`scripts/design-system/validate-tokens.js`; `app/(protected)/settings/Settings.tsx`, `app/layout.tsx`.
