# transport-dashboards-search

**Plan:** `openspec/planning/transport-design-from-prototype.md` (change 3 of 8 — the first large content transport; reconciles the highest-traffic screens and the shared feed components they depend on).

## Why

The dashboard, browse, and my-gigs screens already exist (`DashboardDesign.tsx`, `GigSearchDesign.tsx`, `MyGigsDesign.tsx`) from the campaign-4 by-eye effort and are wired to rich view-models — but they **visibly diverge** from the prototype (confirmed by the user while reviewing the shell). Now that change 1 produced the authoritative captured reference, this change **reconciles them (and the shared feed components) to `design-reference/screens/`**. Because `GigCard` and `AttentionCardDesign` are already shared across five screens, fixing them here propagates correct visuals to later changes.

## Reference mapping (CRITICAL — the prototype route names cross-wire to the app routes)

| App route | App component | Prototype route / captured reference |
|---|---|---|
| `/dashboard` (SPECIALIST) | `DashboardDesign` | `design-reference/screens/dashboard.specialist.{png,html}` |
| `/dashboard` (CLIENT) | `DashboardDesign` | `dashboard.company.{png,html}` |
| `/gigs` (browse) | `GigSearchDesign` | **`search.specialist.*`** / `search.company.*` (prototype route `search` = «ПОИСК ГИГОВ») |
| `/my-gigs` | `MyGigsDesign` | **`gigs.specialist.*`** (all-tab) + `myGigs.specialist.{applications,in-progress,review,completed}.*` (tab variants); `gigs.company.*` |

Reconciling a screen to the wrong reference file is the main foreseeable error — use this table.

## What

Reconcile to the captured reference, preserving all existing data wiring:

- **Shared components first** (everything else depends on them): `app/_design/GigCard.tsx` (compact + `full` modes) and `app/_design/AttentionCardDesign.tsx` — diff against the gig cards / attention strip in the reference and fix.
- **DashboardDesign** (SPECIALIST + CLIENT): onboarding/welcome tiles, the «Мои гиги» board (status tabs + feed), the right panel (specialist search box / client create-CTA), the «Сообщения» panel, and the specialist «Требует внимания» attention strip.
- **GigSearchDesign** (`/gigs` browse): the filter row (category / budget / sort), the results grid, the «Ничего не нашлось» empty state, and loading skeletons.
- **MyGigsDesign** (`/my-gigs`): the status tabs (Все / Заявки / В работе / На проверке / Завершённые) and the feed + empty states.

The messages "row" is currently inline in `DashboardDesign` and appears only there (chats has its own); **keep it inline** — extract a shared component only if it actually recurs (it does not in this change's scope).

## Constraints / Non-goals

- **Reconcile, don't rebuild.** Keep the `page.tsx → VM → *Design.tsx` wiring, the existing VM builders (`getClientDashboard` / `getSpecialistDashboard` / `getMyGigs` / `getGigSearch` / `getDashboardAttention` / `getRecentMessages`), client-side tab filtering, and the browse URL-param filters.
- **Data gaps are in-scope (Method §3), but expected to be rare here** — the VMs already carry status, tabs/counts, attention, and messages. Only touch `lib/view-models.ts` if the design shows a field the VM genuinely lacks.
- **Shared-component blast radius:** reconciling `GigCard`/`AttentionCardDesign` also affects profile / gig-detail / applications (later changes). That is acceptable and desirable, but **verify those consumers don't visually regress** as a result.
- **Do not restyle other screens** (gig-detail, profile, chats, finances, disputes, admin) beyond the shared-component changes — they are changes 4–8.
- Desktop-only (1512px); reuse existing tokens; no new UI system.

## Impact

- Modifies: `app/_design/GigCard.tsx`, `app/_design/AttentionCardDesign.tsx`, `app/(protected)/dashboard/DashboardDesign.tsx`, `app/(protected)/gigs/GigSearchDesign.tsx`, `app/(protected)/my-gigs/MyGigsDesign.tsx`.
- Possibly: `lib/view-models.ts` only if a real data gap surfaces.
- No data-model or server-action changes. Existing E2E for these routes must stay green.
