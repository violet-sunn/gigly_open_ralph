# Change Proposal: ui-primitives

> Phase 0, change 6 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`).
> It is the **vocabulary** layer of the mechanism: the variant-driven primitive components that the whole UI is
> written in. It implements `docs/DESIGN_SYSTEM_SPEC.md` §3.1 (Primitives + variant/state/size matrices) on the
> canonical tokens shipped by `design-token-engine`, with families from `typography-system`, slotting in alongside
> the `layout-grammar` primitives under `app/components/`.

## Problem Statement

The tokens (atoms) and the layout grammar (syntax) exist, but there is **no component vocabulary** — the typed,
variant-driven "words" every block and screen is composed from. Today:

- The only reusable controls are **legacy, pre-redesign** components (`app/components/ui/*`, `app/components/auth/*`,
  `LoadingButton`, `MainNav`, …) full of raw hex/px literals — they are exactly the off-token debt recorded in
  `scripts/design-system/token-purity-baseline.json` and are Phase-2-doomed, **not** a system vocabulary.
- There is **no token-pure, typed primitive set**: every form control, tag, badge, avatar, rating, toggle, and
  progress bar is re-derived ad-hoc per page with raw Tailwind/markup. There is nothing for `domain-blocks` (#7) to
  compose from, so a block today would have to reach down to raw values — defeating the mechanism.
- The library defines a **complete state matrix** for each control (Button has primary/hover/pressed/secondary/
  ghost/disabled/link; FilterRadio has off/hover/on/disabled; etc. — `DESIGN_SPECS.md` §4), but none of it is
  expressed as a typed API. Nothing makes an off-system value (a non-existent variant, an off-token colour)
  **fail to compile** — Fidelity DoD **F2** is enforceable only by the lint, not by the type system.

`docs/DESIGN_SYSTEM_SPEC.md` §3.1 *defines* the primitive vocabulary (16 primitives, each with its variant/state/
size axes grounded in states actually present in the library). This change **implements** it so `domain-blocks`
composes phrases from a vetted kit instead of re-deriving styling by eye.

## Proposed Solution

Build the 16 primitives as **token-pure, controlled, presentational** React components with **typed
`variant`/`state`/`size` props**, plus the typed-API + render verification. State is a typed prop (the component
renders the requested state explicitly; interactivity is wired by consumers via optional callback props), so every
library state is renderable and testable. Four deliverable groups:

1. **A primitive token map** (`app/components/primitives/tokens.ts`) — static `variant → canonical-token Tailwind
   class` lookup tables (button variants, status/category colours, control height `size/control`, etc.), mirroring
   the `app/components/layout/scale.ts` pattern so Tailwind's JIT sees literal class strings. Every value is a
   canonical token (`brand/*`, `surface/*`, `status/*`, `category/*`, `space/*`, `radius/*`, `type/*`, `size/*`) —
   **no raw hex/px**.

2. **The 16 primitives** under `app/components/primitives/` (+ an `index.ts` barrel), each per `DESIGN_SYSTEM_SPEC`
   §3.1 and the measured geometry in `DESIGN_SPECS.md` §5:
   - **Button** — `variant: primary|secondary|ghost|link`; `state: default|hover|pressed|disabled`; `size: md` (40h).
   - **Input** — `state: default|focus|filled|disabled|error`; `size: md` (40h).
   - **PasswordInput** — Input + reveal control; adds `revealed` state (the `eye` glyph is a flagged residual, §7.5).
   - **SearchInput** — Input + search-icon inset (16px @ 12px left) + clear ✕ (16×16 right); `state: default|focus|filled`.
   - **Select** (Select / FilterDropdown) — `state: collapsed|expanded|disabled`; option `default|hover|selected` (106×40).
   - **Radio** — the radio control; `state: off|hover|on|disabled` (uses `radio-off`/`radio-on` assets).
   - **Filter** — the FilterRadio row (Radio + label) as a selectable filter option; `state: off|hover|on|disabled`.
   - **Tabs** — `variant: underline`; tab `default|active` (+ optional count badge).
   - **Toggle** — `switch`; `state: off|on|disabled`.
   - **Tag** (tech) — colour-variant set (the 5 category colours); `size: sm` (radius `sm`).
   - **CategoryTag** — 5 category variants with a left accent (60×23), in the 5 `category/*` colours.
   - **StatusBadge / Dot** — 6 status variants; form `pill` (126×40) + `inline-dot` (8px, `status-dot.svg` tinted via
     `currentColor`) + a "Текущий" current badge.
   - **Avatar** — `circular`; `size: sm` (24, `avatar-sm`) / `lg` (32, `avatar-lg`); + `online` indicator.
   - **Rating** — avatar + verified + ★×5 + count + experience tag; + `online` (ExperienceTag folded in here).
   - **ViewToggle** — grid / list (60×32, two 24px glyphs); `state: grid-active|list-active`.
   - **ProgressBar** — track + fill (h 4px), value `0–100`; track `text/subtle`, fill `brand/default`, radius `xs`.

3. **Typed-API + token-purity enforcement (F2/F3 by construction).** `variant`/`state`/`size` are typed unions, so
   an off-system value (a non-existent variant, an off-scale size) **does not type-check** (`npm run build` /
   `tsc --noEmit` fails). `npm run lint:tokens` stays green — the new primitives add **no** new baseline entries.

4. **Render + typed verification.** A render-test suite (`__tests__/unit/components/ui-primitives.test.tsx`,
   jsdom) renders **every variant/state/size** of every primitive; a typed-rejection check proves an off-system
   prop value fails the type-checker.

Icon-bearing primitives (SearchInput, ViewToggle, Rating, Radio/Filter, StatusBadge/Dot) use the **exported SVGs**
in `public/assets/design-system/icons/` (F4) — not redrawn glyphs. The two known asset residuals (`eye` for the
PasswordInput reveal, `attach` for the chat composer — not a primitive) are flagged per `DESIGN_SPECS.md` §7.5 and
routed to Figma; the PasswordInput reveal ships with an accessible text/label fallback rather than a redrawn glyph.

This change emits **components + tests only**. It does **not** build domain blocks (`domain-blocks`), compose
screens (Phase 2), wire the live shell (`compose-shell-cutover`), or replace/delete the legacy controls (Phase 2
recomposes those). The automated **F1 pixel-diff** gate is `fidelity-harness` (#9, not built); primitives are
built to the §5 geometry and checked against the reference crops, with the automated diff deferred.

## Constraints

### MUST Requirements
- All **16 primitives** MUST exist under `app/components/primitives/`, each exposing the typed `variant`/`state`/
  `size` axes named in `DESIGN_SYSTEM_SPEC.md` §3.1, and MUST render **every state from the library**.
- Primitives MUST be **token-pure**: colour/spacing/radius/type/size expressed **only** via canonical token
  utilities (no raw hex/rgb()/px). `npm run lint:tokens` MUST pass with **no new baseline entries**.
- The `variant`/`state`/`size` props MUST be **typed unions** such that an off-system value fails type-checking;
  `npm run build` MUST stay green and a planted off-system prop value MUST make `tsc --noEmit` fail.
- Icon-bearing primitives MUST use the **exported assets** in `public/assets/design-system/icons/` (F4), not
  redrawn approximations; the `eye`/`attach` residuals MUST be flagged (not redrawn).
- Render tests MUST cover **every variant/state/size** of every primitive; `npm run build` and `npm run test:unit`
  MUST stay green.

### SHOULD Requirements
- Primitives SHOULD be **controlled/presentational** (state as a typed prop; interactivity via optional callback
  props) so every state is directly renderable and server-safe where possible; `"use client"` only where a
  primitive must own a DOM event, documented.
- Primitives SHOULD follow the `app/components/layout/scale.ts` static-map pattern (literal class strings) so
  Tailwind's JIT emits the utilities; dynamic class concatenation (`bg-${x}`) MUST be avoided.
- Standard-control primitives (Button/Input/Select/StatusBadge pill) SHOULD use `size/control` (40px) and
  `radius/md`; primitives SHOULD be built to the measured geometry of `DESIGN_SPECS.md` §5 and visually checked
  against `docs/design-system/reference-renders/` crops (F1 readiness).

### Non-Goals
- **No domain blocks.** GigCard/SidebarNav/Topbar/FilterBar/… are `domain-blocks` (#7); they compose these
  primitives but are out of scope here.
- **No screen composition / shell cutover** — Phase 2 (`compose-*`). Primitives are proven in isolation.
- **No legacy removal.** The pre-redesign `app/components/ui/*`, `app/components/auth/*`, `MainNav`, etc. stay as-is
  (still baselined); Phase 2 recomposes/removes them. This change does **not** touch them.
- **No automated pixel-fidelity gate.** F1 pixel-diff is `fidelity-harness` (#9); this change verifies typed API +
  token-purity (F2) + all-states render (F3) + real assets (F4) + composition-leaf purity (F5), and defers the
  automated F1 diff.
- **No new tokens.** Primitives consume the existing token set only; any gap is a `design-token-engine` change, not
  an inline literal.
- **No redrawn residual icons** (`eye`, `attach`) — flagged and routed to Figma.

## Success Criteria

1. 16 primitives exist under `app/components/primitives/`, each with typed `variant`/`state`/`size` props covering
   every library state, and each renders all its states (render tests pass).
2. Output is token-pure: `npm run lint:tokens` passes with **no new baseline entries**; no raw hex/px in
   `app/components/primitives/`.
3. The typed API rejects off-system values: a planted off-system prop value makes `tsc --noEmit` / `npm run build`
   fail; the clean tree builds green.
4. Icon-bearing primitives use exported assets (F4); `eye`/`attach` residuals are flagged, not redrawn.
5. `npm run build`, `npm run test:unit`, `npm run lint:tokens`, `npm run lint:composition` all pass; legacy
   components untouched; automated F1 pixel-diff explicitly deferred to `fidelity-harness`.

## Affected Areas

- `app/components/primitives/tokens.ts` (new — variant→token static maps + `cx`)
- `app/components/primitives/{Button,Input,PasswordInput,SearchInput,Select,Radio,Filter,Tabs,Toggle,Tag,CategoryTag,StatusBadge,Avatar,Rating,ViewToggle,ProgressBar}.tsx` (new)
- `app/components/primitives/index.ts` (new — barrel)
- `__tests__/unit/components/ui-primitives.test.tsx` (new — all-states render + typed-rejection)
- read-only inputs: `docs/DESIGN_SYSTEM_SPEC.md` §3.1, `docs/DESIGN_SPECS.md` §4/§5, the canonical tokens
  (`scripts/generated-tokens.js`), the exported assets in `public/assets/design-system/icons/`
- `openspec/specs/ui/spec.md` (spec delta)
- (NOT modified: legacy `app/components/ui/*`, `app/components/auth/*`, `MainNav`, `LoadingButton`, … — Phase 2;
  `app/(protected)/layout.tsx` — `compose-shell-cutover`)

## Risks & Mitigations

**Risk**: Dynamic class strings (`bg-${variant}`) are invisible to Tailwind's JIT, so styles silently vanish.
**Mitigation**: Use the proven static-map pattern from `app/components/layout/scale.ts` — every variant maps to a
literal class string; render tests assert the expected token utility class is present in the output.

**Risk**: A primitive needs a tint/elevation not present as a flat token (e.g. `brand/subtle` for selected/focus).
**Mitigation**: `brand/subtle` is defined in the SSOT as `brand/default` at low opacity — express it with a
Tailwind colour-opacity modifier on the token (`bg-brand-default/…`) or the `opacity/subtle` token + a token ring,
never a raw rgba(). No new token, no raw literal.

**Risk**: Reintroducing off-token literals that the purity lint would baseline silently.
**Mitigation**: The lint fails on any **new** (non-baselined) literal; the acceptance run asserts the baseline file
is unchanged (`git diff --quiet scripts/design-system/token-purity-baseline.json`) so nothing new is absorbed.

**Risk**: Two known icons (`eye`, `attach`) are missing from the in-hand SVGs (`DESIGN_SPECS.md` §7.5).
**Mitigation**: Flag them as residuals (route to Figma); PasswordInput's reveal ships an accessible text/label
fallback now rather than a redrawn glyph, preserving F4 (no approximations) and the typed matrix (`revealed` state
present).

**Risk**: "Fidelity DoD (F1)" can't run automated — `fidelity-harness` doesn't exist.
**Mitigation**: Build to the measured §5 geometry, check against the reference crops manually, and enforce
F2/F3/F4/F5 deterministically now; explicitly defer the automated F1 pixel-diff to `fidelity-harness` (#9), exactly
as `layout-grammar` did for the empty shell.

**Risk**: Interactive primitives (Toggle, PasswordInput, Select) drag a client boundary into server components.
**Mitigation**: Primitives are controlled/presentational — state is a prop, handlers are optional passthrough props;
mark `"use client"` only where a primitive owns a DOM event, and keep the rest server-safe. Render tests run in
jsdom to confirm.
