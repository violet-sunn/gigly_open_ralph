# reconcile-dashboards

**Type:** Regular change (UI / screen reconciliation — both role dashboards)
**Created:** 2026-06-18
**Plan:** `openspec/planning/figma-grounded-ui-reconciliation.md` — Phase 1, change #8 (highest-friction screen)
**Capability:** `ui` (reconciles the composed dashboard screens + their VMs in `openspec/specs/ui/spec.md`)
**Depends on:** `reconcile-attention-card-and-settings-composites` (archived — `AttentionCard`), `add-onboarding-and-auth-blocks` (archived — `OnboardingCard`), `add-profile-and-gig-detail-blocks` (archived — `SectionHeader`). All blocks exist.

## Why

Both `/dashboard` screens (`SpecialistDashboard.tsx`, `ClientDashboard.tsx`) are kit-composed but were built in
Phase-2 **before Figma access** and before the Phase-0 notification/onboarding blocks. They lead with a `BannerCard`
+ a flat vertical stack (Tabs → GigCard grid → MessagesPanel), which diverges from **Дашборд/specialist
(`2860:3751`)** and **Дашборд/company (`3371:5387`)**:

| Figma section | Built today | Action |
|---|---|---|
| WELCOME = greeting (name + h2) + **2× OnboardingCard** ("pic") | `BannerCard` headline | **replace** with greeting (`SectionHeader`) + `OnboardingCard ×2` |
| BOARD = **2-col**: «Активные задачи» feed ‖ «Сообщения» feed | flat stack (Tabs → grid → messages) | **re-lay-out** to a 2-col `Split`, each col led by a `SectionHeader` |
| company col1 = «Активные задачи» + **Menu-switcher** tabs + Gig feed | Tabs + grid (both roles) | keep the Tabs as the «Активные задачи» Menu-switcher |
| company col2 = «Найти новый проект» mini-card + «Сообщения» | `CreateGigCTA` + MessagesPanel | keep, under `SectionHeader`s |
| specialist col2 = «найти гиг» + «Сообщения» | SearchPanel + MessagesPanel | keep, under `SectionHeader`s |
| specialist WELCOME-2 = `SectionHeader` + **row of 6× AttentionCard** | — (absent) | **add** the notification strip (specialist only) |
| company: the 6× strip is **`hidden=true`** in the mock | — | **not rendered** on company |
| — (node CONTENT leads with WELCOME, **no page title**) | `Section title="Дашборд"` h2 | **remove** the stray heading |

Every block this needs already exists (`SectionHeader`, `OnboardingCard`, `AttentionCard`, `GigCard`,
`MessagesPanel`, `Tabs`, `SearchPanel`, `CreateGigCTA`) and the layout primitives (`Split`, `Section`, `Stack`,
`Grid`). **No new component is introduced** — this is a screen re-composition + the data the new sections bind.

## What

- **WELCOME** (both roles): replace `BannerCard` with a greeting heading (`SectionHeader`, name-bound) + **two
  `OnboardingCard`s** (the dashboard "pic" tiles — profile-completion + a how-it-works tile), bound from the new VM.
- **BOARD** (both roles): re-lay-out the body into a **2-col `Split`** — **col1** «Активные задачи»
  (`SectionHeader` + the Tabs/Menu-switcher status filter + the `GigCard` feed), **col2** «Сообщения»
  (`SectionHeader` + the `MessagesPanel`) plus the role's find-project affordance (specialist: `SearchPanel` under
  «найти гиг»; company: `CreateGigCTA` under «Найти новый проект»).
- **Specialist WELCOME-2**: add the **6× `AttentionCard` strip** (`SectionHeader` + a row of `AttentionCard`s),
  bound from the new `attention` VM (the user's recent notifications). The **company** dashboard does NOT render it
  (mock `hidden=true`).
- **Remove** the `Section title="Дашборд"` page-title (the node leads with WELCOME).
- **Extend the VMs/builders**: add `greeting`, `onboarding: OnboardingCardVM[]`, and (specialist) `attention:
  AttentionCardVM[]` to `SpecialistDashboardData`/`ClientDashboardData`, bound from **live data** in
  `getSpecialistDashboard`/`getClientDashboard` (+ a `getDashboardAttention` helper). `banner` is replaced by
  greeting + onboarding. Preserve `completion`, `gigCards`, `tabs`, `messages`, and all gig-link / search / create
  navigation.

No screen may carry off-token literals (F2) or bespoke markup (F5) — both stay `Template + Blocks + data`.

## Key reconciliation facts

- **Tabs are retained as the «Активные задачи» Menu-switcher.** The company node shows a `Menu-switcher` tab strip
  in col1; the specialist node shows a plain «Активные задачи» feed. Both built dashboards already carry the
  functional status Tabs (Все/Заявки/В работе/На проверке/Завершённые for specialist; Все/В работе/На
  проверке/Завершённые for client). Per "system > single screen", the Tabs are kept for **both** roles as the
  col1 Menu-switcher — for the company it matches the node; for the specialist the filter is a **sanctioned
  content variant** (functional filtering the static feed omits). No tab/count data changes.
- **`BannerCard` leaves the dashboards but stays in the kit.** The WELCOME greeting + `OnboardingCard ×2` replace
  it per the node; `BannerCard` remains a catalogued block for other surfaces.
- **The attention strip binds live notifications, specialist-only.** `getDashboardAttention(userId)` maps the
  user's recent `Notification`s (newest first, cap 6) → `AttentionCardVM`s (`type` from an eventType→`AttentionType`
  map; `embed` = the linked gig as a `GigCardVM` when resolvable, else a message-style preview). Rendered on the
  specialist dashboard when non-empty; the company dashboard keeps it **hidden** per the mock.

## Scope

- **Reconciled screens:** `app/(protected)/dashboard/{SpecialistDashboard,ClientDashboard}.tsx`.
- **Data layer:** `lib/view-models.ts` — `SpecialistDashboardData`/`ClientDashboardData` (+ `greeting`,
  `onboarding`, specialist `attention`; drop `banner`), `getSpecialistDashboard`/`getClientDashboard`, and a new
  `getDashboardAttention` helper.
- **Tests updated:** `__tests__/e2e/compose-{specialist,client}-dashboard.spec.ts` (assert greeting + OnboardingCards
  + the 2-col BOARD + the specialist AttentionCard strip; keep tabs/gig-link/search/create assertions);
  `__tests__/integration/{specialist,client}-dashboard-vm.test.ts` (assert the new VM fields; drop `banner`).

## Non-goals

- New blocks/primitives (none needed). Changing `getRecentMessages`, the Notification model, or the gig/tab
  filtering semantics. The `dashboard/page.tsx` server notice/fallback markup (pre-redesign, unmarked — out of scope).
- Building a real notifications backend (the strip binds existing `Notification` rows).
- The absolute F1 ≤1% pixel gate (Phase 2 `refidelity-from-figma-references`); here F1 = structural/overlay match
  to each node.

## References

`docs/figma-screens-export.md` §2 (Дашборд/specialist `2860:3751`, Дашборд/company `3371:5387`); the screens +
`lib/view-models.ts` (`getSpecialistDashboard`/`getClientDashboard`); blocks `AttentionCard`/`OnboardingCard`/
`SectionHeader`/`GigCard`/`MessagesPanel`/`SearchPanel`/`CreateGigCTA`; VMs `AttentionCardVM`/`OnboardingCardVM`;
tests `__tests__/e2e/compose-{specialist,client}-dashboard.spec.ts`,
`__tests__/integration/{specialist,client}-dashboard-vm.test.ts`.
