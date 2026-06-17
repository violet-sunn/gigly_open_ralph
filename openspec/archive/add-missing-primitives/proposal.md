# add-missing-primitives

**Type:** Regular change (UI / primitives)
**Created:** 2026-06-17
**Plan:** `openspec/planning/figma-grounded-ui-reconciliation.md` — Phase 0, change #2
**Capability:** `ui` (extends the primitive vocabulary in `openspec/specs/ui/spec.md`)
**Depends on:** `reconcile-design-tokens-from-figma` (archived) — the token layer these bind to is reconciled.

## Why

The component audit (`docs/figma-component-audit.md`) found the coded primitive kit (`app/components/primitives/*`) is missing several atoms/axes that the Figma catalog defines and the 14 screens compose from. Until they exist as first-class, token-pure primitives, screens re-introduce ad-hoc styling — the visible drift this iteration closes. Five gaps:

1. **`button_icon` has no code home (❌)** — every icon button is faked via `<Button variant=ghost>` or a bare `<Icon>` (confirmed ad-hoc in 7 blocks: `CategoryTags`, `ChatPanel`, `ExperienceList`, `ProfileHeader`, `SidebarNav`, `TagList`, `ToggleList`). No square 40×40 geometry, `bg:no|yes` axis, Active state, or counter badge.
2. **`Специальность` specialty tag has no component (❌)** — a white chip with brand-blue mono text used on the profile + chat headers; distinct from `Tag`/`CategoryTag`.
3. **Button is missing the `Tetriary` 32px tier and a `danger` variant (⚠️/➕)** — `Button` ships only `size="md"` (40h; `size` is a dead single-value union) and `primary|secondary|ghost|link`. Figma defines a 32px Tetriary tier and the session-delete destructive button.
4. **`Filter` is missing the `Expand` axis (⚠️)** — `Filter` is a single Radio row; Figma's `Filter` has `Expand {no,yes}` (a group that expands/collapses its options).
5. **`Select` option `disabled` state is missing (⚠️)** — `SelectOption` has no `disabled`; Figma's `dropdown/item` has a Disabled state.

## What

Add/extend five primitives, each typed (variant/state/size props through the static token-class maps in `app/components/primitives/tokens.ts`), token-pure, and rendering every state from its Figma source. Refactor the 7 ad-hoc icon-button call sites onto the new `IconButton`.

**Figma sources (node-ids):** `button_icon` `3828:11151` (BG=yes default `3829:11153`); `Специальность` `3435:5794` (S `3435:5790`, XS); `Button` `3149:3432` (Tetriary `3179:4001`, session-delete danger `3152:3486`); `Filter` `2826:2529` (Expand=yes `3904:6136`); `dropdown/item` `3907:6156` (Disabled `3907:6167`). Specs distilled in `docs/figma-component-audit.md` + `docs/figma-components-export.md`.

## Two token decisions this change must make (documented system gaps)

- **Danger red.** The session-delete button uses `#FF383C` (iOS red) + `border/strong` + a 20% red tint. There is **no `accents/red` token** (`status/rejected` is `#ef4444`). **Decision:** map the `danger` variant to the existing **`status-rejected`** token (`bg-status-rejected/20`, `text-status-rejected`, `border-border`); record the `#FF383C ↔ #ef4444` delta as a reconciliation flag rather than minting a near-duplicate token. (If the designer confirms `#FF383C` is intentional, add `accents/red` later.)
- **Specialty-chip white fill.** `Специальность` is a **white** chip; the surface ramp is all-dark (no white surface token). **Decision:** add a `surface/inverse` (`#ffffff`) token (mirrors the existing `text/inverse`) via the token pipeline so the chip is token-pure, regenerate, and log it — per the generativity principle that a real system gap is added to the system, not worked around. (If the `white` keyword is found to pass the token-purity lint as a non-hex utility, that is the fallback; the token is preferred.)

## Scope

- **New files:** `app/components/primitives/IconButton.tsx`, `app/components/primitives/SpecialtyTag.tsx` (+ exports).
- **Edited:** `Button.tsx` + `tokens.ts` (size tier `sm`=32h, `danger` variant), `Filter.tsx` (add a `FilterGroup` expand/collapse wrapper or `expand` axis), `Select.tsx` (option `disabled`), `tokens.ts` unions; `app/workbench/primitives/page.tsx` (catalog stories); `__tests__/unit/components/ui-primitives.test.tsx` (render/state tests). Possibly `openspec/specs/ui/design-tokens.json` + `scripts/generated-tokens.*` (the `surface/inverse` token) + the reconciliation log.
- **Refactor:** the 7 ad-hoc icon-button call sites onto `IconButton`.

## Non-goals

- Building blocks/screens (later Phase-0 block changes + Phase-1 screen reconciliations).
- The absolute F1 ≤1% pixel gate vs Figma crops — that is wired in Phase 2 `refidelity-from-figma-references`; here the bar is all-states render + token-purity + typed-API rejection of off-system values.
- Resolving the SF Compact / NKDuy Mono web licence.

## References

`docs/figma-component-audit.md`, `docs/figma-components-export.md`; existing primitives `app/components/primitives/*` + `tokens.ts`; render tests `__tests__/unit/components/ui-primitives.test.tsx`; catalog `app/workbench/primitives/page.tsx`; token-purity lint `scripts/design-system/validate-token-purity.js`.
