# Tasks — reconcile-profile-screen

Reconcile `/profile` to **Профиль/specialist (`2860:2103`)**: ID block adopts `SpecialtyTag` + a status pill, drop the
stray `"Профиль"` page-title, affirm the 2-col BLOCK + placeholder. Preserve profile data + edit flow. Sources:
`docs/figma-screens-export.md` §1–2. Friction: **medium** (`ProfileHeader` is shared by own + public profile; the
2-col BLOCK already reconciles via the Phase-0 blocks).

## 1. ProfileHeader ID block — adopt SpecialtyTag for the specialty
- [x] Replaced the ad-hoc `<span class="rounded-pill border …">{vm.roleTag}` specialty pill with the `SpecialtyTag`
      primitive (`<SpecialtyTag>{vm.roleTag}</SpecialtyTag>`, imported from `@/app/components/primitives`). Avatar,
      name (display), verify row, member-since, real-stats row, and the owner edit `IconButton` unchanged.
- **Test:** ✅ ProfileHeader renders the specialty via `SpecialtyTag` (`bg-surface-inverse` + `text-brand-default`
  mono, not `rounded-pill`); `vm.roleTag` text still visible; token-pure.

## 2. ProfileHeader ID block — add the availability status pill
- [x] Added a token-pure availability pill next to the specialty: a `rounded-circular` dot (online →
      `bg-status-completed` mirroring the Avatar dot; offline → `bg-text-subtle`) + label «В сети»/«Не в сети», on a
      `rounded-pill border-border` chip. Driven by `vm.online`. No new primitive needed.
- **Test:** ✅ with `online: true` → «В сети», `online: false`/absent → «Не в сети»; token-pure.

## 3. Profile screen — drop the page-title, affirm the composition
- [x] Removed `Section title="Профиль"` → title-less `<Section gap={6}>` (gap preserved; node leads with the ID
      block). ID-block row (`ProfileHeader` ‖ placeholder `StatPanel`) + the 2-col BLOCK unchanged. No
      `className`/`style`/hex in the screen.
- **Test:** ✅ `/profile` renders no `"Профиль"` page-title heading (E2E `getByRole('heading',{name:'Профиль'})` →
  count 0); ID block + 2-col BLOCK + placeholder render; composition lint PASS.

## 4. Preserve data + edit flow + read-only public view
- [x] No change to `getProfile`/`ProfileData`/`statsPlaceholder`. Owner edit affordance → `/profile/edit`,
      `isOwner=false` read-only public view, and all data binding preserved. The «на стадии разработки» placeholder
      stays.
- [x] Recorded the real-stats-vs-placeholder decision as a **sanctioned content variant** (RC-S7) + the SpecialtyTag/
      status-pill/page-title reconciliation (RC-S8) in `docs/DESIGN_SYSTEM_SPEC.md` §10.6.
- **Test:** ✅ E2E — specialist data binds (Стек/WebSocket, Опыт/Yandex, Избранные категории, Реализованные проекты);
  owner edit → `/profile/edit` + save round-trips; public `/profile/[userId]` shows no edit affordance.

## 5. Update the affected tests to the reconciled composition
- [x] `compose-profile.spec.ts`: added assertions for the SpecialtyTag specialty + the «Не в сети» status pill + the
      removed page-title; kept the data/edit/read-only assertions. Updated the header comment.
- [x] `domain-blocks.test.tsx`: added a dedicated `ProfileHeader` describe (4 tests) — SpecialtyTag chip + verify
      row, offline pill, online pill, owner edit affordance gating.
- [x] Workbench `registry.tsx`: added a dedicated `ProfileHeader` entry rendering both offline + online(+edit) states.
- **Test:** ✅ updated specs pass; no test asserts a removed `"Профиль"` page-title or the old bordered specialty pill.

## 6. Quality gates (run, assert green)
- [x] `npm run validate:tokens` — ✅ PASS (39 canonical colours; outputs in sync).
- [x] `npm run lint:tokens` — ✅ PASS (no new off-token literals).
- [x] `node scripts/design-system/validate-composition.js` — ✅ PASS (18 composed screens).
- [x] `npm run build` — ✅ PASS (`/profile`, `/profile/[userId]` build).
- [x] `npm run clean:test-db && npm run test:unit` — ✅ 937/937 (96 files), +4 new ProfileHeader tests, no flake.
- [x] Profile E2E green: `compose-profile` — ✅ 3/3 (data binds · read-only public · edit round-trip).
- **Acceptance (Fidelity DoD):** ✅ F2 token-pure (lint green), F3 logical/flow parity (ID block + 2-col BLOCK +
  placeholder + data + edit flow), F5 composition-pure (composition lint green). F1 absolute pixel gate deferred to
  Phase 2 (`refidelity-from-figma-references`) on the font-licence cap; here F1 = structural/overlay match to the node.

## 7. Update the planning doc status
- [x] Checked `reconcile-profile-screen` under "Phase 1 — Reconcile screens"; bumped progress to `7/13`.
- **Test:** ✅ the Status checkbox reads `[x]`; progress reads `7/13`.
