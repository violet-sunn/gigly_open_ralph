# add-profile-and-gig-detail-blocks

**Type:** Regular change (UI / blocks)
**Created:** 2026-06-17
**Plan:** `openspec/planning/figma-grounded-ui-reconciliation.md` — Phase 0, change #4
**Capability:** `ui` (extends/refines the block vocabulary in `openspec/specs/ui/spec.md`)
**Depends on:** `reconcile-design-tokens-from-figma`, `add-missing-primitives` (both archived).

## Why

The profile (`2860:2103`) and gig-detail (`2860:2243`) screens compose from four sub-blocks the kit either
lacks or renders ad-hoc (`docs/figma-screens-export.md` §1): a section header, a work-experience card, a
gig-requirement tile, and a numbered success-criterion row. Without first-class, token-pure blocks for these,
the Phase-1 screen reconciliations will re-introduce ad-hoc styling.

**Reconcile, don't duplicate (the plan's own mandate).** Two of the four already have an existing block for the
same concept — adding parallel blocks would be exactly the "parody" the plan forbids. So this change **adds two
genuinely-new blocks and reconciles two existing ones in place**:

| Plan item | Figma | Action | Existing? |
|---|---|---|---|
| SectionHeader (`H/H1/BLOCK`) | `3371:5248` | **ADD** + adopt in the hand-rolled `БЛОК` headings | no (ad-hoc `<span>` headings) |
| JobExperienceCard | `3088:3896` | **ADD**, extract from `ExperienceList`'s inline entry; `ExperienceList` composes it | inline only |
| RequirementTile | `2932:7177` | **RECONCILE `RequirementCard`** in place to the tile spec (no parallel block) | `RequirementCard` |
| CriteriaRow | `2932:7224` | **RECONCILE `CriteriaList`** to numbered rows + extract a `CriteriaRow` item | `CriteriaList` |

## Key reconciliation facts

- **SectionHeader type role.** The Figma `H/H1/BLOCK` heading is **H2 = 24px, NKDuy Mono** → in our token scale
  that is the **`type/h1`** role (`text-h1 font-h1`, mono), NOT `type/h2` (18px sans). The plan command said
  "type/h2 NKDuy 24" loosely; the correct binding is the `h1` role. Adopting SectionHeader therefore also
  **corrects** the current `БЛОК` headings (TagList/CategoryTags/ExperienceList render section titles as
  `text-h2 font-h2` = 18 sans) to the authoritative 24 mono.
- **JobExperienceCard role-text colour.** Per RC-S1 (archived), the `#006ccb` role text normalises to
  `brand/default` — JobExperienceCard binds `text-brand-default`, not a raw hex.
- **RequirementCard → tile.** Reconcile its presentation to `требование`: `border-overlay-line-strong`
  (frame-stroke) hairline, `radius/md`, `justify-between` column with a min height, sans 18 title + 14 muted
  desc. Keep the block name + `RequirementCardVM` (consumed by `GigDetail.tsx`) — only the rendering changes.
- **CriteriaList → numbered.** Reconcile to the `критерий` presentation: a numbered left block
  (`bg-brand-default` + `text-surface-level-0` on-accent digit) + title + optional description, via a new
  `CriteriaRow` item the list maps over. The prior met/unmet checklist semantics were not in the Figma; the VM
  item gains an optional `description` and `met` becomes optional (back-compatible for `GigDetail.tsx`).

## What

Add `SectionHeader.tsx`, `JobExperienceCard.tsx`, `CriteriaRow.tsx`; reconcile `RequirementCard.tsx` +
`CriteriaList.tsx`; refactor `ExperienceList`, `TagList`, `CategoryTags` to use `SectionHeader`; add/extend
view-models + fixtures; catalog entries; render tests. Token-pure, composed from primitives + layout + tokens.

## Scope

- **New:** `SectionHeader.tsx`, `JobExperienceCard.tsx`, `CriteriaRow.tsx` (+ VMs, fixtures, exports).
- **Reconciled:** `RequirementCard.tsx`, `CriteriaList.tsx` (presentation; VMs extended back-compatibly),
  `ExperienceList.tsx` / `TagList.tsx` / `CategoryTags.tsx` (adopt SectionHeader).
- **Updated:** `view-models.ts`, `fixtures.ts`, `index.ts`, `app/workbench/registry.tsx`,
  `__tests__/unit/components/domain-blocks.test.tsx`. Consumers `GigDetail.tsx` / `Profile.tsx` keep their VMs
  (only block internals change); they get pixel-validated in Phase 1.

## Non-goals

- Wiring into screens (Phase 1) or the absolute F1 ≤1% pixel gate (Phase 2 `refidelity-from-figma-references`).
- Adding parallel `RequirementTile`/`CriteriaRow` *blocks* alongside the existing ones (explicitly avoided —
  `CriteriaRow` is an item sub-component of `CriteriaList`, not a duplicate list).
- Resolving the SF Compact / NKDuy Mono web licence.

## References

`docs/figma-screens-export.md` §1, `docs/figma-components-export.md`; existing blocks `app/components/blocks/*`;
token roles in `openspec/specs/ui/design-tokens.json` (`type/h1` = 24 mono); RC-S1 in `docs/DESIGN_SYSTEM_SPEC.md` §10.1.
