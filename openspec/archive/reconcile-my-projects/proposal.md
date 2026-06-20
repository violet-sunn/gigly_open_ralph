# reconcile-my-projects

**Type:** Regular change (UI / screen reconciliation — «Мои гиги»)
**Created:** 2026-06-20
**Plan:** `openspec/planning/full-design-reground.md` — Phase 3 (screen reconciliation, **authored fresh from the
prototype**)
**Capability:** `ui`
**Depends on:** `reconcile-data-model-to-design` (archived — the derived `under_review`/«На рассмотрении» status that
feeds the «Заявки» tab), `compose-dashboards` (archived — the role-aware own-gig list logic this factors out and
reuses). The kit blocks it composes (`GigCard`, `Tabs`, `SectionHeader`, `Notice`/empty state) all exist.

## Why

The prototype (`gigly_full_design/`, `ROUTES.md` line 11) has a first-class **«Мои гиги»** screen — the `gigs` route,
available to **both roles** — that lists the **viewer's own gigs** with **status tabs** (Все / Заявки / В работе / На
проверке / Завершённые), an **empty state**, and **skeletons** during load (`ROUTES.md` line 27; `Gigly App.dc.html`
~L272–307). Today this surface only exists **embedded inside the dashboards** (`ClientDashboard` / `SpecialistDashboard`
active-gigs sections, fed by `getClientDashboard` / `getSpecialistDashboard`) — there is **no standalone «Мои гиги»
screen**.

**Routing decision (confirmed with the product owner).** The prototype's `gigs` "route" is an internal screen key in a
single-file click-through, **not a URL contract**. In the current code the path `/gigs` is already taken by a *different*
screen — the SPECIALIST **public browse/search** (filters all OPEN gigs to apply to), which the prototype does not draw
but which is a real, shipped feature. Per web-routing best practice (a bare plural collection route = "all"; a personal
subset takes an explicit qualifier; never silently change what an existing URL means), **«Мои гиги» gets its own
kebab-case route `/my-gigs` (both roles), and `/gigs` stays the browse/search screen, unchanged.** This is faithful to
the prototype **screen** while keeping the URL contract conventional and non-breaking.

## What

- **New screen `/my-gigs`** (`app/(protected)/my-gigs/`) — an F5-pure `@composed-screen` inside `AppShell`, reconciled
  to the prototype «Мои гиги»: a `SectionHeader` «Мои гиги» + a `Tabs` status bar (with per-tab counts) over a **2-column
  `GigCard` grid** of the viewer's **own** gigs, with the prototype **empty state** («Здесь пока пусто» + «Гигов с таким
  статусом нет. Они появятся здесь, когда изменится статус работ.») when a tab is empty.
- **Role-aware content, one route** (the GitHub-`/issues` pattern):
  - **CLIENT** → gigs they posted. Tabs: Все / **Заявки** (own OPEN gigs with applications → derived «На рассмотрении»)
    / В работе / На проверке / Завершённые.
  - **SPECIALIST** → gigs they work on / applied to. Tabs: Все / **Заявки** (own PENDING applications) / В работе / На
    проверке / Завершённые.
  The **5-tab set matches the prototype for both roles**; the «Заявки» tab is role-specific in *what* it counts.
- **View-model** — factor the existing dashboard own-gig logic into a dedicated **`getMyGigs(viewer)`** that returns the
  role-aware `GigCard[]` (each tagged with its tab) + the 5-tab descriptor (labels + counts). Reuses `toGigCardVM` and
  the `gigDisplayStatus` derivation (so «На рассмотрении» = OPEN + applications>0, exactly as the data-model change
  defined). No new gig query semantics — the same `where` clauses the dashboards already use.
- **Skeleton/loading** — a `loading.tsx` (or Suspense fallback) rendering the prototype's 2-column skeleton grid while
  the server data resolves.
- **Navigation** — add «Мои гиги» → `/my-gigs` to the sidebar nav for **both roles**; keep «Поиск» → `/gigs` for the
  specialist. Update the nav fixtures (which currently disagree — one points «Мои гиги» at `/gigs`, another at
  `/projects`; both are reconciled to `/my-gigs`).

No screen carries off-token literals (F2) or bespoke markup (F5) — it stays `Template + Blocks + data`. All on-screen
text is Russian, exactly as the prototype shows it.

## Key facts / decisions (derived from the prototype)

- **«Мои гиги» = the viewer's OWN gigs**, role-aware, on one route. Not the public browse (that stays at `/gigs`).
- **`/my-gigs` (kebab-case), browse unchanged at `/gigs`** — confirmed routing decision; non-breaking, convention-correct.
- **5 status tabs for both roles** (Все / Заявки / В работе / На проверке / Завершённые), per `ROUTES.md` line 27.
  CLIENT's «Заявки» = own OPEN gigs that received applications (derived «На рассмотрении»); SPECIALIST's «Заявки» = own
  PENDING applications. (The current CLIENT dashboard's 4-tab set gains the «Заявки» tab here, faithful to the prototype.)
- **Prototype empty state** is exact copy: «Здесь пока пусто» + «Гигов с таким статусом нет. Они появятся здесь, когда
  изменится статус работ.»
- **Dashboards are not touched** — their embedded active-gigs sections remain (a preview). De-duplicating dashboard vs
  `/my-gigs` is out of scope (flagged for a later pass), so nothing regresses.
- **No new browse logic, no migration** — `getMyGigs` reuses the dashboards' existing queries + mappers.
- **F1 baselines on the prototype frame** (`Gigly Развёртка.dc.html`, the `gigs`/«Мои гиги» state); fonts resolved. F1
  here = structural/overlay match; the absolute ≤1% gate is Phase 4 (`refidelity-from-full-design`).

## Scope

- **New screen:** `app/(protected)/my-gigs/page.tsx` (server, fetches `getMyGigs(viewer)`) + `MyGigs.tsx`
  (`@composed-screen`) + `loading.tsx` (skeleton grid).
- **Data layer:** `lib/view-models.ts` — `getMyGigs(viewer)` (role-aware own-gig cards + the 5-tab descriptor),
  factored from / shared with the existing dashboard logic.
- **Navigation:** the sidebar nav (both roles) + `app/components/blocks/fixtures.ts` nav fixtures → «Мои гиги» = `/my-gigs`.
- **Workbench:** register the `MyGigs` screen in `app/workbench/registry.tsx` (with a fixture covering populated + empty
  tabs).
- **Tests:** `__tests__/e2e/compose-my-gigs.spec.ts` (tabs render with counts; switching a tab filters the grid; the
  prototype empty state shows for an empty tab; role-aware content — CLIENT sees posted gigs, SPECIALIST sees
  applied/assigned; a card opens `/gigs/[id]`); `__tests__/integration/my-gigs-vm.test.ts` (`getMyGigs` role-aware cards
  + tab counts, incl. the derived «На рассмотрении»/«Заявки»).
- **Docs:** the reconciliation note in `docs/DESIGN_SYSTEM_SPEC.md` (the «Мои гиги» structure + the `/my-gigs` routing
  decision); check the Phase-3 item in `full-design-reground.md`.

## Non-goals

- Touching the public browse/search screen at `/gigs` (it stays as-is).
- New blocks/primitives — the screen composes existing kit (`GigCard`, `Tabs`, `SectionHeader`, empty state). If the
  prototype empty state needs a dedicated `EmptyState` block (vs `Notice`), that is a flagged follow-up, not new work here.
- De-duplicating the dashboards' embedded active-gigs sections against `/my-gigs` (later pass).
- Changing any gig query semantics, the lifecycle, or the status derivation (reused verbatim).
- The absolute F1 ≤1% pixel gate (Phase 4).

## References

`gigly_full_design/ROUTES.md` (L11 `gigs` = МОИ ГИГИ both roles; L27 the tabs/empty/skeleton spec); `Gigly App.dc.html`
(the `gigs` screen ~L272–307: tab bar + 2-col `Gig Card` grid + skeletons + empty state; tab data ~L1599–1603);
`Gigly Развёртка.dc.html` (the F1 frame). The current `lib/view-models.ts` `getClientDashboard` (L169–210) /
`getSpecialistDashboard` (L233–304) own-gig logic + `gigDisplayStatus` (L72–75) + `toGigCardVM`; blocks
`GigCard`/`Tabs`/`SectionHeader`/`Notice`; the nav fixtures in `app/components/blocks/fixtures.ts` (L374, L387–388).
