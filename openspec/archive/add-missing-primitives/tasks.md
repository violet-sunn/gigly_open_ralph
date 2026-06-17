# Tasks — add-missing-primitives

Add five primitives/axes (token-pure, typed, all states). Source specs: `docs/figma-component-audit.md` +
`docs/figma-components-export.md`. Token maps live in `app/components/primitives/tokens.ts`; render tests in
`__tests__/unit/components/ui-primitives.test.tsx`; catalog in `app/workbench/primitives/page.tsx`.

## 1. IconButton primitive (Figma `button_icon` 3828:11151)
- [x] Add `IconButton.tsx`: square `h-control w-control`, `rounded-sm`, `Icon` at `size/icon-rail` (20), typed
      `bg: "no" | "yes"` (yes → `bg-surface-level-2`, no → `bg-transparent`), `hover:`/`active:` surface-token classes,
      optional `counter?: number` badge (top-right, `bg-brand-default`, `text-inverse`, smallest text token), required `aria-label`.
- [x] Add an `IconButtonBg` union + class map to `tokens.ts`.
- [x] Refactor the 7 ad-hoc call sites (`CategoryTags`, `ChatPanel`, `ExperienceList`, `ProfileHeader`, `SidebarNav`,
      `TagList`, `ToggleList`) onto `IconButton`; remove hand-rolled square icon-button markup.
- **Test:** render both `bg` variants (assert 40×40 + surface token), `counter` badge present/absent, `aria-label` present;
  `lint:tokens` no new literals; affected blocks' existing tests stay green.

## 2. SpecialtyTag primitive (Figma `Специальность` 3435:5794)
- [x] Decide the white fill: add `surface/inverse` (`#ffffff`) to `openspec/specs/ui/design-tokens.json` (mirrors
      `text/inverse`), regenerate (`npm run tokens:generate`), and log it — UNLESS the `white` keyword passes
      `lint:tokens` (then use `bg-white` and note the exception).
- [x] Add `SpecialtyTag.tsx`: chip, `px-2`, `mono` family, `brand/default` text, typed `size: "S" | "XS"`
      (`type/data` → `type/data-small`); brackets are caller content.
- **Test:** render S/XS (assert mono family + brand-default token + data/data-small step), fill is a token not `#ffffff`,
  typed API rejects bad size; `lint:tokens` + `validate:tokens` green (generated in sync if a token was added).

## 3. Button size tier + danger variant (Figma `Button` 3149:3432)
- [x] Extend `ControlSize` to `"md" | "sm"`; make `Button` honour `size` (drop the `void size`): `sm` = 32px tier
      (`h-8` / Tetriary geometry), `md` unchanged (40h).
- [x] Add `danger` to `ButtonVariant` + `BUTTON_VARIANT`: `bg-status-rejected/20 text-status-rejected border border-border`
      (token-pure; NO `#FF383C`). Record the `#FF383C ↔ #ef4444` delta in the reconciliation log (`docs/DESIGN_SYSTEM_SPEC.md` §10.1).
- **Test:** render `size="sm"`/`"md"` (assert 32 vs 40h), `variant="danger"` (assert status-rejected tokens, no raw hex),
  existing Button tests green; typed unions reject off-system values.

## 4. Filter expand/collapse axis (Figma `Filter` 2826:2529, Expand=yes 3904:6136)
- [x] Add a `FilterGroup` (header + collapsible body) that composes existing `Filter` rows; `expanded` prop +
      `onToggle`; header carries `aria-expanded`; keyboard-operable (Enter/Space).
- **Test:** expanded renders option rows, collapsed hides them; `aria-expanded` reflects state; `onToggle` fires on
  click/Enter/Space; options are `Filter` instances; `lint:tokens` clean.

## 5. Select option disabled state (Figma `dropdown/item` 3907:6167)
- [x] Add `disabled?: boolean` to `SelectOption`; in `Select` render disabled options with `aria-disabled`,
      `opacity-disabled` token, and a guarded `onSelect` (no fire when disabled).
- **Test:** disabled option does not fire `onSelect`, has `aria-disabled="true"`, uses the opacity token; enabled
  options still select/hover; type accepts optional `disabled`.

## 6. Catalog + full verification
- [x] Add workbench stories for every new primitive/state in `app/workbench/primitives/page.tsx`.
- [x] Extend `__tests__/unit/components/ui-primitives.test.tsx` with the new render/state tests.
- **Test plan (run, assert green):**
  - `npm run tokens:generate` (only if `surface/inverse` was added) — generated files differ only by timestamp + the new token.
  - `npm run validate:tokens` — pass (in sync).
  - `npm run lint:tokens` — pass; planting a raw literal in a new primitive fails it (then revert).
  - `npm run build` — pass.
  - `npm run clean:test-db && npm run test:unit` — green (run once; clean first per the test-db pollution note).

## 7. Update the planning doc status
- [x] In `openspec/planning/figma-grounded-ui-reconciliation.md`, check `add-missing-primitives` and bump progress to `2/13`.
- **Test:** Status checkbox `[x]`; progress reads `2/13`.
