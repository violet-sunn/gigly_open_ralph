# Change Proposal: layout-grammar

> Phase 0, change 5 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`).
> It is the **syntax** layer of the mechanism: the page templates, the content layout primitives, and the
> screen-composition rule that turns screens from free-form markup into *arrangements of regions/slots*. It
> implements `docs/DESIGN_SYSTEM_SPEC.md` §4 (Layout Grammar + Screen-Composition Pattern) on the canonical
> spacing/token scale shipped by `design-token-engine`, with families from `typography-system`.

## Problem Statement

The token layer exists, but there is **no layout vocabulary** to arrange them. Today:

- The only "shell" is `app/(protected)/layout.tsx` — a bespoke `MainNav` wrapper that uses raw, now-undefined
  post-cutover classes (`bg-surface-level-1`, `border-neutral-weak`) and an inline `style={{…}}`. It is a
  pre-redesign artifact, **not** a reusable template.
- There are **no layout primitives** (Stack/Grid/Split/Section/Panel/Rail); spacing and structure are expressed
  ad-hoc with raw Tailwind/markup in every page.
- There is **no composition rule or enforcement** — nothing stops a screen from containing styling, layout
  literals, or raw markup (Fidelity DoD **F5** is unenforceable), which is exactly how the previous parody
  accreted bespoke per-screen layouts.

`docs/DESIGN_SYSTEM_SPEC.md` §4 *defines* the grammar (AppShell + AuthLayout templates; Stack/Grid/Split/Section/
Panel/Rail primitives; the "screen = Template + slotted Blocks + data, composition-only" rule). This change
**implements** it so later phases compose screens instead of hand-building them.

## Proposed Solution

Build the page-skeleton engine as token-pure, presentational React components plus the composition lint. Four
deliverables:

1. **`AppShell` template** — a `sidebar` slot, a `topbar` slot, and a `content` region, in both sidebar
   **`expanded`** and **`collapsed`** (icon-rail) states, per `DESIGN_SYSTEM_SPEC.md` §4.1 and the geometry in
   `docs/DESIGN_SPECS.md` §5 (40px control height, 20px rail icon). It accepts blocks as slot props — it does
   **not** build SidebarNav/Topbar (those are `domain-blocks`); it renders **placeholder** blocks for now.
2. **`AuthLayout` template** — a centered `card` region + a checkerboard `footer`
   (`public/assets/design-system/patterns/checkerboard.svg`) for the auth/register screens.
3. **Content layout primitives** — `Stack` (axis + gap), `Grid` (columns + gap), `Split` (two-pane ratio + gap),
   `Section` (titled region + gap), `Panel` (surface + radius + padding), `Rail` (narrow icon column). Every
   primitive expresses spacing/radius/surface **only via canonical tokens** (Tailwind token utilities) — **no raw
   px**.
4. **Screen-composition pattern + composition lint** — encode the rule "a screen = Template + slotted Blocks +
   data bindings; **no styling, no layout literals, no raw markup**" and enforce it with a `lint:composition`
   script. Because no composed screens exist yet, the lint targets files that **opt in** via a
   `/* @composed-screen */` marker (Phase 2 screens carry it); it passes vacuously today and is proven by a
   **planted raw-markup screen fixture that fails**. A later change tightens the scope to all route `page.tsx`
   once `compose-shell-cutover` lands.

This change emits **components + a lint only**. It does **not** wire the templates into live routes
(`compose-shell-cutover`, Phase 2), build domain blocks (`domain-blocks`), or compose real screens. Templates are
proven against **placeholder** blocks/fixtures.

## Constraints

### MUST Requirements
- `AppShell` MUST expose `sidebar`, `topbar`, and `content` slots and support both `expanded` and `collapsed`
  sidebar states; `AuthLayout` MUST expose a centered `card` region + a checkerboard `footer`.
- The layout primitives `Stack`, `Grid`, `Split`, `Section`, `Panel`, `Rail` MUST exist and express
  spacing/radius/surface **only via canonical tokens** (no raw px / off-token literals); `npm run lint:tokens`
  MUST still pass.
- A `lint:composition` MUST exist encoding "screen = Template + slotted Blocks + data; composition-only" and MUST
  **fail** on a screen file containing raw styled markup (`style=`, off-token `className`, raw structural tags)
  or importing outside the allowlist (templates/blocks/primitives/data), and **pass** on a compliant composed
  screen.
- Templates and primitives MUST render (verified by render tests) with **placeholder** blocks — `npm run build`
  and `npm run test:unit` MUST stay green.
- The components MUST be presentational/token-pure and MUST NOT cut over the live shell or build domain blocks.

### SHOULD Requirements
- `AppShell` collapsed state SHOULD use the `Rail` primitive at the icon-rail width (`size/icon-rail` = 20px) per
  `docs/DESIGN_SPECS.md` §5.
- Components SHOULD live under a clear kit home (`app/components/templates/`, `app/components/layout/`) so
  `ui-primitives`/`domain-blocks` slot in alongside.
- The composition lint SHOULD report the offending file + reason and SHOULD be wired into the build/CI path.

### Non-Goals
- **No shell cutover.** Wiring `AppShell` into `app/(protected)/layout.tsx` with live data is
  `compose-shell-cutover` (Phase 2). The current shell stays as-is.
- **No domain blocks** (SidebarNav, Topbar, GigCard, …) — `domain-blocks` (#7). AppShell takes them as slots.
- **No primitives** (Button, Input, …) — `ui-primitives` (#6).
- **No real screen composition** — Phase 2. This change proves templates with placeholders only.
- **No pixel fidelity gate.** F1 pixel-diff is `fidelity-harness` (#9, not built); this change verifies structure
  + token-purity + composition, and flags F1 deferred.

## Success Criteria

1. `AppShell` (expanded + collapsed, 3 slots) and `AuthLayout` (card + checkerboard footer) exist and render with
   placeholder blocks (render tests pass).
2. `Stack`, `Grid`, `Split`, `Section`, `Panel`, `Rail` exist, are token-pure, and render (render tests pass).
3. `lint:composition` exists, **passes** the current (no composed screens) tree and a compliant sample, and
   **fails** a planted raw-markup screen fixture, naming it.
4. `npm run build`, `npm run test:unit`, `npm run lint:tokens` all pass; F1 pixel-fidelity explicitly deferred to
   `fidelity-harness`.

## Affected Areas

- `app/components/templates/AppShell.tsx`, `app/components/templates/AuthLayout.tsx` (new)
- `app/components/layout/{Stack,Grid,Split,Section,Panel,Rail}.tsx` (new)
- `scripts/design-system/validate-composition.js` (new — the composition lint) + `package.json` (`lint:composition`)
- `__tests__/unit/layout-grammar.test.tsx` (new — render + token-purity-of-output tests)
- read-only inputs: `docs/DESIGN_SYSTEM_SPEC.md` §4, `docs/DESIGN_SPECS.md` §5, the canonical tokens
- `openspec/specs/ui/spec.md` (spec delta)
- (NOT modified: `app/(protected)/layout.tsx` — cutover is Phase 2)

## Risks & Mitigations

**Risk**: The composition lint, applied to existing pre-redesign pages, would flag hundreds of raw-markup
violations and block the build.
**Mitigation**: Scope it to **opt-in `@composed-screen` files** (none today → passes vacuously); prove it via a
planted fixture. Phase 2 composed screens carry the marker; a later change widens scope to all `page.tsx` after
`compose-shell-cutover`. This mirrors the token-purity baseline-then-tighten approach.

**Risk**: Templates need SidebarNav/Topbar which don't exist yet (`domain-blocks`).
**Mitigation**: `AppShell` takes them as **slot props** and is proven with **placeholder** blocks; the real
blocks slot in during `domain-blocks`/`compose-shell-cutover` with no template change.

**Risk**: "Fidelity DoD on the empty shell" can't run — `fidelity-harness` doesn't exist.
**Mitigation**: Verify structure via render tests + token-purity (F2) + composition (F5) now; explicitly defer the
F1 pixel-diff to `fidelity-harness` (#9).

**Risk**: New components re-introduce raw literals (off-token spacing/colour).
**Mitigation**: Primitives use only canonical token utilities; `npm run lint:tokens` stays green (the lint scans
`app/`, which now includes these components).

**Risk**: Server/client component boundaries (Next App Router) break rendering.
**Mitigation**: Templates/primitives are presentational (no client hooks) so they work as server components;
render tests run in jsdom to confirm.
