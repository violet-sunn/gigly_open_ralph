# Tasks — reconcile-my-projects

Build the standalone **«Мои гиги»** screen at a new route `/my-gigs` (both roles), reconciled to the
`gigly_full_design` prototype (`Gigly App.dc.html` `gigs` screen): a `SectionHeader` «Мои гиги» + a `Tabs` status bar
(Все / Заявки / В работе / На проверке / Завершённые, with counts) over a 2-col `GigCard` grid of the **viewer's own
gigs**, with the prototype empty state and skeletons. `/gigs` browse is **untouched**. Friction: **medium** (new route +
a factored role-aware VM; reuses existing queries/mappers/blocks).

## 1. Add the role-aware `getMyGigs` view-model
- [x] `lib/view-models.ts`: add `getMyGigs(viewer: { userId, role })` returning `{ gigCards: MyGigCard[]; tabs: {value,label,count}[] }`
      where `MyGigCard = GigCardVM & { tabKey: string }`. **CLIENT** → own posted gigs (`where: { clientId }`,
      `applicationCount` → `gigDisplayStatus`), tabs: all / **apps** (OPEN with applications → «На рассмотрении») /
      in-progress / verification / completed. **SPECIALIST** → PENDING applications (tabKey `apps`/«Заявки») + assigned
      gigs (in-progress/verification/completed), tabs identical. Reuse `toGigCardVM` + `gigDisplayStatus`; share the
      existing dashboard queries (no new gig semantics). 5-tab set for both roles.
- **Test:** `my-gigs-vm.test.ts` — CLIENT cards = own gigs with the «На рассмотрении» derivation on OPEN+apps; SPECIALIST
  cards = pending applications + assigned gigs; both expose the 5 tabs with correct counts.

## 2. Create the `/my-gigs` route + composed screen
- [x] `app/(protected)/my-gigs/page.tsx` (server): resolve the viewer, call `getMyGigs(viewer)`, render `<MyGigs … />`.
- [x] `app/(protected)/my-gigs/MyGigs.tsx` (`/* @composed-screen */`): inside `AppShell`, a `SectionHeader` «Мои гиги» +
      a `Tabs` bar (the VM tabs, with counts) over a 2-col `Grid` of `GigCard`s filtered by the active tab (client-side
      tab state, like the dashboards). Each card links to `/gigs/[id]`. Template + blocks + data only — no
      className/style/hex.
- **Test:** E2E — `/my-gigs` renders the «Мои гиги» header + the 5 tabs with counts + a `GigCard`; a card opens `/gigs/[id]`.

## 3. Tab filtering + the prototype empty state
- [x] Switching a tab filters the grid by `tabKey` (Все = all). When the active tab has no gigs, render the prototype
      empty state: «Здесь пока пусто» + «Гигов с таким статусом нет. Они появятся здесь, когда изменится статус работ.»
      via the existing empty-state kit (`Notice` / `EmptyState` if present — **flag** if a dedicated block is needed; do
      not invent one inline).
- **Test:** E2E — selecting a tab with no gigs shows «Здесь пока пусто»; selecting a populated tab shows its cards.

## 4. Skeleton / loading state
- [x] `app/(protected)/my-gigs/loading.tsx`: a 2-column skeleton grid (prototype loading state) shown while the server
      data resolves. Uses kit skeleton primitives / layout only.
- **Test:** build includes `/my-gigs` with a `loading` boundary (structural; no behavioural assertion required).

## 5. Navigation wiring
- [x] Add «Мои гиги» → `/my-gigs` to the sidebar nav for **both roles** (keep «Поиск» → `/gigs` for the specialist).
      Reconcile `app/components/blocks/fixtures.ts` nav fixtures so «Мои гиги» points at `/my-gigs` in both (currently
      `/gigs` and `/projects` — both wrong).
- **Test:** E2E — the nav «Мои гиги» link navigates to `/my-gigs` for both roles; fixtures reference `/my-gigs`.

## 6. Token-purity + composition-purity (F2 / F5)
- [x] No `className=`/`style=`/hex literals in `MyGigs.tsx` / `loading.tsx` beyond layout-primitive props; the screen
      composes from kit blocks + layout + tokens.
- **Test:** `lint:composition` PASS (`MyGigs` F5-pure); `lint:tokens` PASS (no new literal).

## 7. Register in the workbench
- [x] **Deviation — N/A.** The workbench registry (`app/workbench/registry.tsx`) catalogs blocks/primitives/tokens/
      templates/layout, **not** composed screens (no screen has an entry — `Chats`/`GigDetail`/dashboards included). So
      `MyGigs` is not registered there; it is covered by `compose-my-gigs` E2E + `lint:composition` instead (RC-S19 note).
- **Test:** `lint:composition` counts the new screen (19 total); the route renders under `AppShell`.

## 8. Record the reconciliation decision
- [x] `docs/DESIGN_SYSTEM_SPEC.md` §10.x: the «Мои гиги» structure (tabs + own-gig grid + empty/skeleton) + the
      `/my-gigs` routing decision (prototype screen ≠ URL contract; `/gigs` stays browse). Check the Phase-3 item in
      `full-design-reground.md`.
- **Test:** the note records the structure + the routing rationale (prototype provenance).

## 9. Quality gates (run, assert green)
- [x] `npm run validate:tokens` + `npm run lint:tokens` — PASS.
- [x] `npm run lint:composition` — PASS (new screen counted).
- [x] `npm run build` — PASS (`/my-gigs` + its `loading`).
- [x] `npm run clean:test-db && npm run test:unit` — green (incl. `my-gigs-vm.test.ts`).
- [x] `compose-my-gigs` E2E green (tabs + counts + filtering + empty state + role-aware content + card→detail nav).
- **Acceptance (Fidelity DoD):** F2 token-pure, F1 structural/overlay match to the prototype `gigs`/«Мои гиги» frame, F3
  flow parity (role-aware own gigs + tab filtering + empty state), F5 composition-pure. F1 ≤1% deferred to Phase 4.

## 10. Planning-status (Phase 3)
- [x] Check `reconcile-my-projects` in `full-design-reground.md` Phase 3.
- **Test:** the Phase-3 item reads `[x]`.
