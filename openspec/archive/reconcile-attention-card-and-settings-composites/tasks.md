# Tasks — reconcile-attention-card-and-settings-composites

Add five blocks + the `attention/*` token group (token-pure, typed VMs, all states). Source specs:
`docs/figma-components-export.md`. Blocks live in `app/components/blocks/*` (VMs in `view-models.ts`,
fixtures in `fixtures.ts`, exports in `index.ts`); catalog in `app/workbench/registry.tsx`; tests in
`__tests__/unit/components/domain-blocks.test.tsx`.

## 1. Add the `attention/*` token group
- [x] Add `color-semantic.attention.{status-change #7c3aed, message #2563eb, deadline #ea580c, accepted #16a34a,
      rejected #9ca3af, payment #0891b2}` to `openspec/specs/ui/design-tokens.json` with descriptions citing the
      Figma per-type map; note these are DISTINCT from `status/*`.
- [x] Add the per-type glow as a token-based layered fill — either six `gradient/attention-<type>-glow` entries
      (mirroring `gradient/status-completed-glow`) or one CSS-var-parameterised fill keyed to the accent.
- [x] `npm run tokens:generate`; confirm `attention-*` utilities emit; update `validate-tokens.js` colour-group
      coverage if it enumerates groups.
- **Test:** `validate:tokens` green (in sync, new colour count); `bg-attention-accepted` etc. resolve in Tailwind.

## 2. AttentionCard block (Figma `attention card` 3367:3916)
- [x] Add `AttentionCardVM` to `view-models.ts`: `{ type: AttentionType, title, date, cta, embed: GigCardVM | MessagePreviewVM }`.
- [x] Add `AttentionCard.tsx`: ONE component with a `type → attention/<type>` token map driving marker fill, the
      left `inset 4px` accent, the ambient glow (token-based), the CTA `Button` fill; embed renders the gig/message
      block (which keeps its own gig-status glow). `radius/xl` shell, `border/default` hairline, header (marker +
      title + relative date). No per-variant copies.
- [x] Add fixtures (one per type) to `fixtures.ts`; export from `index.ts`.
- **Test:** render all six types — assert marker/accent/glow resolve to the matching `attention/*` token; assert a
  single map (e.g. the six render via the same component); embedded gig variant keeps gig-status glow; `lint:tokens` clean.

## 3. ToggleField + CheckField (Figma 3138:3199, 3138:3148)
- [x] `ToggleField.tsx`: row = title (label) + description (muted body) + `Toggle`; `{ title, description, checked, onChange }`.
- [x] `CheckField.tsx`: single-select list; rows use circle/check-circle indicators + label; `{ options, value, onChange }`.
      If circle/check-circle glyphs are absent from `ICON`, flag as a residual (route to Figma export) — do not redraw.
- [x] VMs + fixtures + exports.
- **Test:** ToggleField shows title+desc+Toggle and fires onChange; CheckField marks the selected row and fires
  onChange with its key; both token-pure.

## 4. SessionRow block (Figma `session` 3149:2645)
- [x] `SessionRow.tsx` with `state: "Default" | "active" | "delete"`: Default = title+desc+`IconButton` close;
      active = + `StatusBadge variant="current"` («Текущий»); delete = `Button variant="danger"`. Reuse primitives;
      no bespoke pill/red.
- [x] VM + fixtures + export.
- **Test:** each state renders the right primitive (current pill for active, danger Button for delete); token-pure.

## 5. FileChip block (Figma `file` 3600:5262)
- [x] `FileChip.tsx`: row, `overlay/line` fill, `radius/md`, file icon + name + size; `{ name, size, icon? }`;
      family tokens (sans per RC-S2). VM + fixtures + export.
- **Test:** renders name+size on `overlay-line` token surface; token-pure.

## 6. Catalog + full verification
- [x] Add workbench `registry.tsx` entries: AttentionCard (6 types), ToggleField, CheckField, SessionRow
      (3 states), FileChip — each with a `reference`.
- [x] Extend `domain-blocks.test.tsx` with render/state tests for the five blocks.
- **Test plan (run, assert green):**
  - `npm run tokens:generate` — generated files reflect `attention/*`, otherwise differ only by timestamp.
  - `npm run validate:tokens` — pass (in sync).
  - `npm run lint:tokens` — pass; planting a raw literal in a new block fails it (then revert).
  - `npm run build` — pass.
  - `npm run clean:test-db && npm run test:unit` — green (run once, clean first per the test-db pollution note;
    if an unrelated integration test times out, re-run it in isolation to confirm it's the known flake).

## 7. Update the planning doc status
- [x] In `openspec/planning/figma-grounded-ui-reconciliation.md`, check `reconcile-attention-card-and-settings-composites`
      and bump progress to `3/13`.
- **Test:** Status checkbox `[x]`; progress reads `3/13`.
