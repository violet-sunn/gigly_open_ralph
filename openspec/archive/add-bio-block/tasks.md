# Tasks — add-bio-block

Add the `Bio` block (Figma `bio` 2931:2365 + `bio/message/COMPANY` 2931:2366 → one block, `user` axis): avatar +
name + verify-patch + stars + `Специальность`, `sizeFor: gig|acc-bio` × `user: specialist|company`; adopt it in
`ChatHeader` + the gig-detail conditions. Source: `gigly_full_design/design-system/source/Bio.jsx`. Friction:
**medium** (one block over existing primitives + two adoptions; chat/gig-detail VM contracts preserved).

## 1. Add the BioVM contract
- [x] Added `BioVM { avatar; name; verified?; rating?; specialty?; presence?; sizeFor?: 'gig'|'acc-bio'; user?:
      'specialist'|'company' }` to `view-models.ts`; `+ optional specialty?` on `ChatHeaderVM`.
- **Test:** ✅ types compile (build green).

## 2. Build the Bio block
- [x] `app/components/blocks/Bio.tsx`: `Avatar` (lg for acc-bio / sm for gig) + name (`text-title`/`text-label`) +
      verify-patch (`ICON.verified` when `verified`) + `Rating` + `SpecialtyTag` (only `user !== 'company'` && specialty)
      + optional presence; `Stack` layout; token-pure. Exported from the barrel.
- **Test:** ✅ render — specialist acc-bio shows avatar/name/verify/stars/`Специальность`; company omits specialty (domain-blocks Bio suite).

## 3. Fixtures + (workbench)
- [x] Added `bioSpecialistFixture` / `bioCompanyFixture` / `bioGigFixture` (sizeFor × user, with/without
      specialty/verify) to `fixtures.ts`.
- [~] Workbench entry **skipped** — the block catalog is selective (sibling `ChatHeader` isn't registered either; Bio
      renders via the chat/gig-detail screens). The 3-variant render tests cover the variants.
- **Test:** ✅ the 3 Bio variants render (domain-blocks 45/45).

## 4. Adopt Bio in ChatHeader
- [x] `ChatHeader` re-implemented to map `ChatHeaderVM` → `BioVM` and render `<Bio sizeFor="acc-bio" user="specialist">`;
      all existing `ChatHeaderVM` fields preserved (+ optional specialty surfaced).
- **Test:** ✅ `compose-chats` E2E green; ChatHeader renders via Bio.

## 5. Adopt Bio in the gig-detail conditions
- [x] `GigDetailData += bio: BioVM`; `getGigDetail` builds it from the client (name, `client.rating`, verified,
      `user: 'company'`, `sizeFor: 'acc-bio'`). `GigDetail.tsx` renders `<Bio vm={data.bio} />` leading col2; `ClientCard` kept.
- **Test:** ✅ `compose-gig-detail-apply` E2E green; col2 renders the company Bio (F5-pure).

## 6. Record the reconciliation decision
- [x] `docs/DESIGN_SYSTEM_SPEC.md` **§10.12 / RC-S13** records `bio` 2931:2365 + `bio/message/COMPANY` 2931:2366 →
      one `Bio` block (user axis); checked the planning item.
- **Test:** ✅ §10.12 records the two-nodes→one-block decision with node ids.

## 7. Quality gates (run, assert green)
- [x] `npm run lint:tokens` — ✅ PASS (Bio token-pure; 0 baseline, fail-on-all).
- [x] `npm run lint:composition` — ✅ PASS (18 screens; GigDetail F5-pure).
- [x] `npm run validate:tokens` — ✅ PASS (unaffected).
- [x] `npm run build` — ✅ PASS.
- [x] `npm run clean:test-db && npm run test:unit` — ✅ **921/921** (918 + 3 Bio render tests).
- [x] `compose-chats` + `compose-gig-detail-apply` E2E — ✅ 9/9.
- **Acceptance (Fidelity DoD):** ✅ F2 token-pure + F5 composition-pure + structural match to node `2931:2365`.
  F1 ≤1% pixel gate deferred to Phase 4 (`refidelity-from-full-design`).

## 8. Planning-status (Phase 3)
- [x] Checked the `add-bio-block` item in `full-design-reground.md` Phase 3.
- **Test:** ✅ the Phase-3 item reads `[x]`.
