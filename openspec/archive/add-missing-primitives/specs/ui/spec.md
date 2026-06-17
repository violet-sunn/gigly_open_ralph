# Spec delta — ui (add-missing-primitives)

Adds the five primitives/axes the component audit flagged as missing. All are typed, token-pure, and render
every state from their Figma source. New requirements only.

## ADDED Requirements

### Requirement: Icon Button Primitive
An `IconButton` primitive MUST exist (`app/components/primitives/IconButton.tsx`), modelling Figma `button_icon`
(`3828:11151`). It MUST be square `size/control` (40×40), `radius/sm`, hold a `size/icon-rail` (20) icon, and
expose a typed `bg` axis (`no` | `yes`), the interaction states Default/Hover/Active, and an optional counter
badge. It MUST be token-pure (no raw hex/px) and carry an accessible label. The 7 ad-hoc icon-button call sites
(`CategoryTags`, `ChatPanel`, `ExperienceList`, `ProfileHeader`, `SidebarNav`, `TagList`, `ToggleList`) MUST be
refactored onto it.

#### Scenario: Renders both bg variants with correct geometry
- GIVEN `<IconButton bg="yes">` and `<IconButton bg="no">`
- WHEN each renders
- THEN both MUST be 40×40 (`h-control w-control`) with `radius/sm` and a 20px icon
- AND `bg="yes"` MUST use the `surface/level-2` token fill; `bg="no"` MUST be transparent
- AND hover/active MUST resolve to surface-token classes (no raw literals)

#### Scenario: Optional counter badge
- GIVEN `<IconButton counter={5}>`
- WHEN it renders
- THEN a badge MUST appear top-right using the `brand/default` token fill and an inverse-text token
- AND when `counter` is absent, no badge renders

#### Scenario: Accessible and token-pure
- GIVEN any `IconButton`
- WHEN it renders
- THEN it MUST expose an accessible name (`aria-label` or equivalent)
- AND the token-purity lint MUST report zero new off-token literals for the file

#### Scenario: Ad-hoc icon buttons are refactored
- GIVEN the 7 blocks that faked icon buttons via `Button variant=ghost` / bare `Icon`
- WHEN they are inspected after the change
- THEN each icon-only control MUST use `IconButton`
- AND no block MAY hand-roll square icon-button geometry

---

### Requirement: Specialty Tag Primitive
A `SpecialtyTag` primitive MUST exist, modelling Figma `Специальность` (`3435:5794`): a chip with brand-blue
**mono** text (`type/data` family `mono`) on a white fill, with `S` and `XS` size tiers (`type/data` → `type/data-small`).
It MUST be token-pure; the white fill MUST be expressed via a token (`surface/inverse`), not a raw literal.

#### Scenario: Renders brand-blue mono text on a tokened white fill
- GIVEN `<SpecialtyTag size="S">[Senior Frontend Engineer]</SpecialtyTag>`
- WHEN it renders
- THEN the text MUST use the `brand/default` colour token and the `mono` family at the `type/data` step
- AND the fill MUST be a token (`surface/inverse`), not `#ffffff`
- AND padding MUST use `space/sm` (8) horizontally

#### Scenario: Both size tiers
- GIVEN `size="S"` and `size="XS"`
- WHEN each renders
- THEN `S` MUST use `type/data` (14) and `XS` MUST use `type/data-small` (12)
- AND the typed API MUST reject any size outside `{S, XS}`

#### Scenario: Token-pure
- GIVEN the `SpecialtyTag` file
- WHEN the token-purity lint runs
- THEN it MUST report zero new off-token literals

---

### Requirement: Button Size Tiers and Danger Variant
The `Button` primitive MUST gain a `Tetriary` 32px size tier and a `danger` variant, modelling Figma `Button`
(`3149:3432`: Tetriary `3179:4001`, session-delete `3152:3486`), without changing the existing
`primary|secondary|ghost|link` behaviour or the default `md` (40h) size.

#### Scenario: Size axis is real (not a dead union)
- GIVEN `<Button size="sm">` and `<Button size="md">`
- WHEN each renders
- THEN `sm` MUST be 32px tall (the Tetriary tier) and `md` MUST remain 40px (`size/control`)
- AND the typed `size` union MUST include both and reject any other value
- AND existing `md` consumers MUST render unchanged

#### Scenario: Danger variant is token-pure
- GIVEN `<Button variant="danger">`
- WHEN it renders
- THEN it MUST use the `status/rejected` token for text and a tinted fill (`status-rejected` at reduced alpha)
  with a `border/default` border — NO raw `#FF383C`/`#ef4444` literal
- AND the `#FF383C ↔ #ef4444` (status-rejected) delta MUST be recorded in the reconciliation log

#### Scenario: Variant union extended without regressions
- GIVEN the `ButtonVariant` union
- WHEN inspected
- THEN it MUST include `danger` alongside the existing four
- AND existing Button render tests MUST stay green

---

### Requirement: Filter Group Expand/Collapse Axis
The filter primitives MUST support the `Expand` axis from Figma `Filter` (`2826:2529`, Expand=yes `3904:6136`):
a group that shows a header and expands/collapses its `Filter` option rows. It MUST be token-pure and
keyboard-operable.

#### Scenario: Expanded shows options, collapsed hides them
- GIVEN a filter group with `expanded={true}` then `expanded={false}`
- WHEN each renders
- THEN expanded MUST render its `Filter` option rows; collapsed MUST hide them
- AND the header MUST expose `aria-expanded` reflecting the state

#### Scenario: Composes existing Filter rows
- GIVEN the group
- WHEN it renders its options
- THEN each option MUST be the existing `Filter` (Radio + label + optional count) primitive — not a re-implementation
- AND the token-purity lint MUST report zero new off-token literals

#### Scenario: Toggle is controllable
- GIVEN an `onToggle` handler
- WHEN the header is activated (click / Enter / Space)
- THEN `onToggle` MUST fire so the parent can flip `expanded`

---

### Requirement: Select Option Disabled State
`Select` MUST support a per-option `disabled` state, modelling Figma `dropdown/item` Disabled (`3907:6167`).
A disabled option MUST be visually de-emphasised (the `opacity/disabled` token), non-selectable, and marked for
assistive tech.

#### Scenario: Disabled option is non-interactive
- GIVEN a `SelectOption` with `disabled: true` in an expanded `Select`
- WHEN the option renders and is clicked
- THEN it MUST NOT fire `onSelect`
- AND it MUST carry `aria-disabled="true"`
- AND it MUST use the `opacity/disabled` token for de-emphasis (no raw opacity literal)

#### Scenario: Enabled options unaffected
- GIVEN a mix of enabled and disabled options
- WHEN the list renders
- THEN enabled options MUST still select on click and show the selected/hover states
- AND the `SelectOption` type MUST accept an optional `disabled?: boolean`

---

### Requirement: New Primitives Are Catalogued and Token-Validated
Every primitive/axis added by this change MUST appear in the workbench catalog with all its states, MUST have
render/state tests, and MUST keep the token pipeline green.

#### Scenario: Workbench shows all new states
- GIVEN `app/workbench/primitives/page.tsx`
- WHEN it renders
- THEN it MUST include `IconButton` (bg no/yes, +counter), `SpecialtyTag` (S/XS), `Button` (sm tier + danger),
  the Filter expand group, and a disabled `Select` option

#### Scenario: Render tests and lints pass
- GIVEN `__tests__/unit/components/ui-primitives.test.tsx` extended for the new primitives
- WHEN `npm run test:unit`, `npm run lint:tokens`, and `npm run validate:tokens` run
- THEN the new render/state tests MUST pass, the token-purity lint MUST report no new off-token literals,
  and (if a `surface/inverse` token was added) the generated outputs MUST stay in sync with the JSON
- AND `npm run build` MUST pass
