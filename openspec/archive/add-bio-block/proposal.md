# add-bio-block

**Type:** Regular change (design-system / block — the missing `Bio` atom)
**Created:** 2026-06-20
**Plan:** `openspec/planning/full-design-reground.md` — Phase 3 (kit gap surfaced by the §3.2 delta analysis)
**Capability:** `ui` (a new block + its adoption in `ChatHeader` + gig-detail conditions)
**Depends on:** the Phase-0/1 kit (Avatar, Rating, SpecialtyTag primitives + the `verified` icon asset). Unblocks the
`reconcile-chats` / `reconcile-gig-detail-apply` screen reconciliations (they compose `Bio`).

## Why

The full-design component audit (`full-design-reground.md` §3.2) found **one real block gap**: the design's **`bio`**
(Figma node `2931:2365`, 4 variants) + its **`bio/message/COMPANY`** sibling (`2931:2366`) — the canonical
identity row (avatar + name + **verify-patch** + **stars** + **`Специальность`**) used on the chat thread header and
the gig-detail CONDITIONS column. The coded kit only **approximates** it: `ChatHeader` renders avatar + name +
verified + rating + presence but **no `Специальность`** and has no `sizeFor` variant axis; the gig-detail conditions
bio is a stand-in `ClientCard`. There is no first-class `Bio` block, so the chat + gig-detail screens can't reconcile
faithfully to the design.

This adds `Bio` as a proper block composing the existing primitives, with the design's `sizeFor` (gig | acc-bio) ×
`user` (specialist | company) variants, and adopts it where the design uses bio — closing the gap and giving the
Phase-3 screen reconciliations a real block to compose.

## What

- **Add the `Bio` block** (`app/components/blocks/Bio.tsx`) + `BioVM` (`view-models.ts`), composed purely from
  primitives + layout + tokens: `Avatar` + name (`text-title`/`text-label`) + the **verify-patch** (`ICON.verified`,
  the exported patch-check asset — F4) + `Rating` (stars/count) + the **`SpecialtyTag`** (`Специальность`), plus the
  optional presence/info line («был(-а) недавно»). Typed variant axes: **`sizeFor: 'gig' | 'acc-bio'`** (the larger
  acc-bio thread/conditions header vs the compact gig one) and **`user: 'specialist' | 'company'`**. The
  **`bio/message/COMPANY`** node collapses into this block as the **`user: 'company'`** variant (no `Специальность`
  for a company) — a sanctioned consolidation of the two Figma nodes into one block with a `user` axis (the §3.2
  "reconcile to a minimal set" principle), recorded in the reconciliation note.
- **Adopt it in `ChatHeader`.** Re-implement `ChatHeader` to render `<Bio>` (the acc-bio thread header), mapping
  `ChatHeaderVM` → `BioVM`; add an optional `specialty?` to `ChatHeaderVM` so the counterparty's `Специальность`
  surfaces. The chat screens' `ChatHeaderVM` contract is **preserved** (specialty optional; existing fields unchanged).
- **Adopt it in the gig-detail conditions.** The gig-detail col2 leads with the company bio — bind a `bio: BioVM`
  in `getGigDetail` (from the gig's client: name + rating + verified, `user: 'company'`, `sizeFor: 'acc-bio'`) and
  render `<Bio>` as the conditions bio. (`reconcile-gig-detail-apply` later composes the rest of col2 around it; this
  change just adopts the bio block + its data.)
- **Workbench + fixtures + render tests** for all 4 variants (sizeFor × user, with/without specialty/verify/stars).

No new primitive; `Bio` is a block over the existing kit. Token-pure (F2) + the screens stay composition-pure (F5).

## Key facts / decisions

- **Two Figma nodes → one block.** `bio` (2931:2365) + `bio/message/COMPANY` (2931:2366) collapse into `Bio` with a
  `user` axis (company omits `Специальность`) — avoids a near-duplicate component, per the §3.2 minimal-set principle.
- **`ChatHeader` becomes a thin adopter, not a deletion.** It keeps its VM contract (so `reconcile-chats` and the chat
  E2E are unaffected) but renders `Bio` internally — the kit converges on one identity row.
- **`ClientCard` stays a block.** It's still used for the dispute detail pairing (`DisputeView`); the gig-detail col2
  adopts `Bio` as the *bio header* specifically, not a wholesale ClientCard removal.
- **F1 is structural here.** Fidelity DoD = F2 (token-pure) + F5 (composition-pure) + structural/overlay match to node
  `2931:2365`; the absolute ≤1% pixel gate is the Phase-4 `refidelity-from-full-design`.

## Scope

- **New block:** `app/components/blocks/Bio.tsx` + `BioVM` in `app/components/blocks/view-models.ts` + the barrel export
  + `app/components/blocks/fixtures.ts` (the 4 variants) + the workbench catalog entry.
- **Adoption:** `app/components/blocks/ChatHeader.tsx` (render `Bio`; `ChatHeaderVM` += optional `specialty`),
  `lib/view-models.ts` (`getGigDetail` builds `bio: BioVM`; `GigDetailData` += `bio`), `app/(protected)/gigs/[id]/GigDetail.tsx`
  (render `<Bio>` in col2).
- **Tests:** `__tests__/unit/components/domain-blocks.test.tsx` (Bio renders the 4 variants + the parts); the existing
  chat + gig-detail E2E stay green (ChatHeader still renders; a Bio assertion added to gig-detail).
- **Docs:** the reconciliation note in `docs/DESIGN_SYSTEM_SPEC.md` (the two-nodes→one-block decision); check the
  `add-bio-block` item in `full-design-reground.md`.

## Non-goals

- The full gig-detail col2 re-layout (terms + apply + chat) — that's `reconcile-gig-detail-apply`; this only adds the bio.
- Re-laying the chat screens — `reconcile-chats` owns that; this only swaps `ChatHeader`'s internals to `Bio`.
- Removing `ClientCard` (still used by the dispute detail).
- The absolute F1 ≤1% pixel gate (Phase 4).

## References

`gigly_full_design/design-system/source/Bio.jsx` (node `2931:2365`, 4 variants) + `BioMessageCOMPANY.jsx` (`2931:2366`);
`full-design-reground.md` §3.2 (the Bio gap); the existing `app/components/blocks/ChatHeader.tsx` + `ClientCard.tsx`;
the `Avatar`/`Rating`/`SpecialtyTag` primitives + `ICON.verified`; `ChatHeaderVM`/`RatingVM`/`GigDetailData`.
