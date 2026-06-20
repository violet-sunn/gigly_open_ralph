# light-theme-screen-audit

**Type:** Regular change (design-system / theming hardening — the light-theme acceptance pass)
**Created:** 2026-06-19
**Plan:** `openspec/planning/full-design-reground.md` — Phase 1 follow-up (the `add-light-theme` deferred scope)
**Capability:** `ui` (theming correctness across screens + the WCAG gate)
**Depends on:** `add-light-theme` (the runtime `[data-theme]` mechanism + the light token values). This change makes
the theme *correct on every screen*, closing `ТЗ — Светлая тема` §8.4 / §9.

## Why

`add-light-theme` delivered the **mechanism**: token-pure UI themes automatically via the var layer. But it explicitly
deferred the **acceptance pass** — and two real gaps remain that keep the light theme from being shippable:

1. **74 legacy raw-colour literals don't theme.** The token-purity lint baselines **74** raw hex/rgba occurrences
   (`token-purity-baseline.json`) — concentrated in the pre-reconciliation auth surfaces: `app/login/page.tsx` (24),
   `app/register/page.tsx` (20), `components/auth/*` (12), `app/auth/page.tsx` (6), `app/components/auth/*` (9),
   `app/components/ui/InfoIcon.tsx` (2), `app/(protected)/profile/page.tsx` (1). Baked literals like `#01030e` /
   `rgba(255,255,255,.08)` **do not switch on `[data-theme]`** — so those screens render dark-on-dark fragments under
   light (the "white-on-white / провалы" the ТЗ §9.2 forbids). The lint's own policy is **BASELINE-THEN-TIGHTEN**:
   "a later cleanup change flips this to fail-on-all once legacy is recomposed." **This is that change.**
2. **No contrast guarantee.** `ТЗ §3/§9.3` require every text token to pass **WCAG AA** on its surface in *both*
   themes (≥4.5:1 body, ≥3:1 large). Nothing verifies this; grey labels that "тонут" acceptably on dark can fall
   below AA on white.
3. **The logo on light is unresolved** (`ТЗ §5`) — the Gigly mark/wordmark must stay legible + on-brand on a white
   surface (a dark "плашка" island or a weight bump — a flagged designer decision).

This change turns "the toggle works" into "the light theme is correct and accessible on every screen."

## What

- **Add a deterministic WCAG-AA contrast gate.** A new `scripts/design-system/validate-contrast.js` reads the SSOT,
  computes the WCAG contrast ratio for every meaningful **text×surface** token pair in **both** themes (dark =
  `value`, light = `light ?? value`), and asserts AA: **≥4.5:1** for body/label/caption text, **≥3:1** for large
  (h1/h2/display/title) text and for non-text UI separators where the ТЗ allows. Pairs covered: `text.{strong,muted,
  subtle,disabled-where-meaningful}` × `surface.{level-0,1,2,3}`; `text.inverse` × `brand.default` + `surface.inverse`;
  each `status.*` (text) × the surface it sits on; `brand.default`-as-text × surfaces. Add an `npm run lint:contrast`
  script + wire it into the design-system gates. Documented exceptions (e.g. a deliberately-muted placeholder) are an
  explicit allowlist in the script with a rationale, not a silent skip.
- **Eliminate the un-themeable literals (baseline → 0).** Recompose / token-migrate the legacy files so no raw colour
  literal remains, then **flip the token-purity lint to fail-on-all** (empty `token-purity-baseline.json`). For each
  file: convert hex/rgba → the semantic token utility (`bg-surface-*`, `text-*`, `border-*`, `tint-*`, the `overlay.*`
  hairlines); **delete dead/duplicate files** if found (the `components/auth/*` root tree appears to duplicate
  `app/components/auth/*` — verify routing and remove the unused copy rather than fixing it twice). Preserve each
  screen's behaviour + existing tests.
- **Resolve the logo on light.** Give `Logomark` a theme-correct treatment so it reads on a white surface — the chosen
  approach (a `surface.inverse` dark plate behind the mark under light, OR a themed mark) implemented + recorded as the
  sanctioned decision (with a designer-review note). The brand blue + Handjet stay invariant.
- **Both-themes per-screen review.** An E2E (`theme-coverage.spec.ts`) loads every route + key modal state under **both**
  `data-theme`s, asserts it renders without console errors, and **captures a screenshot per (screen × theme)** as a
  review artifact. A scripted "no white-on-white" assertion checks that each screen's computed page-bg ≠ its
  card/text colours within a minimum delta (catches baked-literal fragments the contrast token-gate can't see).

## Key facts / decisions

- **This change fulfills the lint's BASELINE-THEN-TIGHTEN contract.** Success = `token-purity-baseline.json` emptied
  and the lint failing on *any* raw literal thereafter. If a legacy file genuinely can't be cleaned this pass, it is
  **recomposed or deleted**, not re-baselined.
- **Dead-duplicate auth trees.** `components/auth/*` (repo root) vs `app/components/auth/*` — the audit verifies which
  the routes actually import and **deletes the orphan** (don't theme-fix dead code).
- **Contrast gate is the AA source of truth.** Per-token, both themes, deterministic — replaces "eyeball it." The
  visual screenshot review is a human aid layered on top, not the gate.
- **Scope is correctness, not redesign.** No new screens/blocks; no layout changes beyond what removing a literal
  requires. Reconciliation of screen *composition* to the prototype remains the Phase-3 changes' job.

## Scope

- **New gate:** `scripts/design-system/validate-contrast.js` + `lint:contrast` npm script (+ optional fold into `fidelity`).
- **Literal cleanup:** `app/login/page.tsx`, `app/register/page.tsx`, `app/auth/page.tsx`, `app/components/auth/*`,
  `components/auth/*` (verify/delete dupes), `app/components/ui/InfoIcon.tsx`, `app/(protected)/profile/page.tsx`;
  empty `scripts/design-system/token-purity-baseline.json`.
- **Logo:** `app/components/primitives/Logomark.tsx` (+ the logo asset if a themed variant is needed).
- **Tests:** `__tests__/e2e/theme-coverage.spec.ts` (both-themes render + screenshots + no-white-on-white); contrast
  unit/CLI; preserve the existing auth/login/register E2E + unit suites.
- **Docs:** `docs/DESIGN_SYSTEM_SPEC.md` (the contrast gate + the logo decision + baseline-flipped); check the
  `light-theme-screen-audit` follow-up in `full-design-reground.md`.

## Non-goals

- Composition reconciliation of any screen to its Figma/prototype node (the Phase-3 `reconcile-*` changes own that).
- New theming features: `prefers-color-scheme` auto, a high-contrast (AAA) mode, theme-transition animation (ТЗ §10).
- Changing the dark theme's appearance (dark is the shipped default; the audit only fixes literals that also break
  dark consistency, and tightens contrast where a token already failed AA on dark).
- Net-new screens/modals (audit only what exists).

## References

`gigly_full_design/ТЗ - Светлая тема.md` §3 (contrast), §5 (logo), §8.4 (per-screen review), §9 (acceptance);
`scripts/design-system/validate-token-purity.js` + `token-purity-baseline.json` (the 74 legacy literals + the
BASELINE-THEN-TIGHTEN policy); `openspec/specs/ui/design-tokens.json` (the dark+light token values to audit);
`app/components/primitives/Logomark.tsx`; the archived `add-light-theme` (the var layer this builds on).
