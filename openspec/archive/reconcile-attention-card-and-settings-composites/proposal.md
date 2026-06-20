# reconcile-attention-card-and-settings-composites

**Type:** Regular change (UI / blocks + tokens)
**Created:** 2026-06-17
**Plan:** `openspec/planning/figma-grounded-ui-reconciliation.md` — Phase 0, change #3
**Capability:** `ui` (extends the block vocabulary + token layer in `openspec/specs/ui/spec.md`)
**Depends on:** `reconcile-design-tokens-from-figma` (archived), `add-missing-primitives` (archived — `danger` Button, `IconButton`, `SpecialtyTag`, `Select` disabled).

## Why

The Figma import (`docs/figma-components-export.md`) defines five composites the coded kit has no first-class block for. The dashboards + settings + gig-detail screens compose from them, so without them those screens re-introduce ad-hoc styling. Specifically:

1. **AttentionCard** (`3367:3916`, 12 variants) — the dashboard notification card. It has a documented **per-type accent map** and an **embedded gig/message block** that keeps its *own* gig-status glow. The coded kit only has `NotificationItem` (the dropdown row) — a different, simpler block; there is no AttentionCard.
2. **ToggleField** (`3138:3199`) — a settings toggle *row* (title + description + Toggle). `ToggleList` exists but arranges label-only rows without descriptions.
3. **CheckField** (`3138:3148`) — a settings radio/checkbox list (circle / check-circle).
4. **SessionRow** (`3149:2645`) — a settings session row with `Default | active | delete` states (active = «Текущий» status pill; delete = the destructive Button).
5. **FileChip** (`3600:5262`) — the chat/gig-detail attachment chip (file icon + name + size).

## The token decision this change must make (documented system gap)

The AttentionCard's six notification-**type** accents are a **distinct palette**, NOT the gig-status palette:

| type | accent | nearest status token | distinct? |
|---|---|---|---|
| Смена статуса | `#7c3aed` purple | verification `#8b5cf6` | yes |
| Новое сообщение | `#2563eb` blue | in-progress `#3b82f6` | yes |
| Приближается дедлайн | `#ea580c` orange | review `#f59e0b` | yes |
| Заявка принята | `#16a34a` green | completed `#10b981` | yes |
| Заявка отклонена | `#9ca3af` **gray** | rejected `#ef4444` (red) | **very** |
| Получена оплата | `#0891b2` cyan | — | yes |

**Decision:** add a semantic **`attention/*`** colour token group (six tokens) to `design-tokens.json` — per the generativity principle (a real palette gap is added to the system, as `surface/inverse` was). The AttentionCard then maps `type → attention/<type>` token; the marker fill, the `inset 4px` left accent, and the ambient glow all derive from that one token (data-driven, **no per-variant copies**). The card's *ambient glow* (radial, `mix-blend-screen`) is reproduced as a token-based layered fill keyed to the accent (mirroring the existing `gradient/status-completed-glow` pattern); the **embedded block keeps its own gig-status glow** unchanged.

## What

Add five blocks (typed view-models + fixtures, token-pure, composed from primitives + layout + tokens) and the `attention/*` token group. Reuse existing primitives: `StatusBadge variant="current"` (SessionRow active pill), `Button variant="danger"` (SessionRow delete), `IconButton`/`Icon` (FileChip, close affordances), `Toggle` (ToggleField). Catalog every block + state in the workbench; add render tests; keep the token pipeline + lint green.

**Figma sources:** AttentionCard `3367:3916` (per-type variants `3367:3915/3917/4225/4249/4273/4297`), ToggleField `3138:3199`, CheckField `3138:3148`, SessionRow `3149:2645`, FileChip `3600:5262`. Specs distilled in `docs/figma-components-export.md`.

## Scope

- **Token layer:** add `color-semantic.attention.{status-change,message,deadline,accepted,rejected,payment}` + the per-type glow (gradient tokens or a CSS-var-parameterised layered fill) to `design-tokens.json`; regenerate `scripts/generated-tokens.{js,css}`; update the token validation/`validate-tokens.js` coverage if it enumerates colour groups.
- **New blocks:** `AttentionCard.tsx`, `ToggleField.tsx`, `CheckField.tsx`, `SessionRow.tsx`, `FileChip.tsx` (+ view-models in `view-models.ts`, fixtures in `fixtures.ts`, exports in `index.ts`).
- **Catalog + tests:** entries in `app/workbench/registry.tsx`; render/state tests in `__tests__/unit/components/domain-blocks.test.tsx`.

## Non-goals

- Wiring these into screens (Phase 1 reconciliations) or into the live `Notification` model.
- The absolute F1 ≤1% pixel gate vs Figma crops (Phase 2 `refidelity-from-figma-references`); here the bar is all-states render + token-purity + data-driven per-type map.
- Replacing `NotificationItem` (the dropdown row stays; AttentionCard is the dashboard card).
- Re-deriving CheckField's circle/check-circle glyphs if absent from the exported-asset registry — flagged as a residual (route to Figma export), not redrawn.

## References

`docs/figma-components-export.md` (composite specs + per-type attention map), `docs/figma-component-audit.md`; existing blocks `app/components/blocks/*` + `view-models.ts` + `fixtures.ts`; catalog `app/workbench/registry.tsx`; block tests `__tests__/unit/components/domain-blocks.test.tsx`; token pipeline `scripts/parse-design-tokens.js` + `scripts/design-system/validate-tokens.js`.
