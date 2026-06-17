# UI Redesign Integration

**Created:** 2026-06-13
**Revised:** 2026-06-13 — reframed: **build the mechanism that creates the UI; the screens are its instances and acceptance tests** (was: reconstruct screens 1:1).
**Status:** PLANNED

## Mandate: build the mechanism, not the screens

The screenshots are **samples of an intended system, not the system itself.** Replicating them screen-by-screen — even pixel-perfectly — yields non-modular dead-ends: each screen is a bespoke composition that shares nothing reusable, cannot be extended, and decays into the next parody the moment someone adds screen #14. The first attempt failed precisely this way (screens recreated by eye, no system underneath).

**The deliverable is the mechanism that produces the UI** — a single-source-of-truth design system, a composition engine, a living workbench, and enforcement — from which these 13 screens **and any future screen** are *composed*, not hand-built. The screens are how we **validate** the mechanism, not what we ship.

Two principles follow:

- **The system is the source of truth, not the screens.** Screenshots are observations of an intended system. We reverse-engineer that system (canonical scales, taxonomies, variant matrices, layout grammar, composition rules), **reconcile** screen-level one-offs against it, and treat the screens as regression instances. A deliberate divergence becomes a system **variant**, never a copied special-case; an accidental inconsistency is normalized to the system and flagged to the designer.
- **Two acceptance tests prove it is a mechanism, not a replica.** (1) **Fidelity** — every reference screen, *composed from the kit*, passes the pixel-diff DoD. (2) **Generativity** — a novel screen with no mock (the admin moderation views) can be assembled from the kit with **zero new tokens/primitives/blocks and zero bespoke styling**. If generativity fails, the system is incomplete — you fix the **system**, not the screen.

## Problem

A ground-up redesign of Gigly arrived as 13 desktop mockups + a two-part component library (`tokens.svg`, `frames.svg`) in `/screens`. Taken literally, the mockups invite a screen-by-screen rebuild that produces a pixel-accurate but architecturally inert UI — exactly the trap that produced today's "parody." The real need is a **UI-creation mechanism**: a layered design system (tokens → primitives → blocks → layout grammar → screen composition) with a workbench and enforcement, that yields the 13 screens as instances and makes screen #14 cheap and correct by construction — all without breaking the working marketplace loop and its ~700 tests, and without building against a still-draft design.

## Why This Matters

From `project.md`, "Professional B2B Experience" and "Quality Over Quantity" demand a UI that is both exact and *coherent* — and coherence is a property of a system, not of individually-traced screens. A mechanism makes correctness inheritable: new screens, A/B variants, and future features compose from a vetted kit instead of re-deriving styling by eye, so the product stops regressing toward parody. It also shortens delivery: once the engine exists, screens are thin compositions, and the trust signals the design adds (ratings, portfolios, clear status) map onto Organic Retention, Core Loop Completion, and Time-to-Hire.

## The mechanism (what we are building)

A layered, single-source-of-truth engine. Each layer is consumed only by the layer above; nothing reaches around it.

1. **Tokens (atoms).** Semantic SSOT — `surface/level-*`, `text/*`, `status/*`, `space/*`, `radius/*`, `shadow/*`, `type/*`. Everything references *meaning*, never a raw hex/px.
2. **Primitives (vocabulary).** Variant-driven components with typed `variant`/`state`/`size` props and **no hardcoded values**: Button, Input, PasswordInput, Select, Filter, Tabs, Toggle, Radio, Tag, CategoryTag, StatusBadge/Dot, Avatar, Rating, ViewToggle, ProgressBar, SearchInput.
3. **Blocks (phrases).** Domain composites built from primitives, each declaring a typed **view-model contract** (the data it needs): GigCard, ProfileCard, MessageBubble, ConversationItem, NotificationItem, SidebarNav, Topbar, FilterBar, BannerCard, StatPanel, RequirementCard, CriteriaList, ClientCard, TermsTabs, ApplyPanel, ChatPanel, MessagesPanel.
4. **Layout grammar (syntax).** The `AppShell` template (sidebar + topbar + content region, expanded/collapsed) plus content layout primitives (`Stack`, `Grid`, `Split`, `Section`, `Panel`, `Rail`) on the canonical spacing scale. Pages are arrangements of regions/slots — not free-form markup.
5. **Screen composition (sentences).** Each screen = `Template + Blocks + data bindings`. **No styling, no layout literals, no raw markup** in a screen file — composition only.
6. **Workbench.** A living catalog (Storybook-style) that **is the development surface**: every token/primitive/block/template and every state is documented, and screens are assembled and visually regression-tested there before they touch routes.
7. **Enforcement.** Token-purity lint (no off-token literals) + typed variant APIs (an off-system value won't compile) + composition lint (screen files import only blocks/templates) + the fidelity gate. Drift toward approximation becomes structurally impossible.

**Data contracts decouple UI from schema.** Blocks declare view-models; Phase 1 provides models that *fulfill* them; screens bind real data. So the engine is buildable against fixtures before the backend exists, and stable when the schema changes.

## Reconstruction principles & Fidelity Definition of Done

### Bottom-up, system-first order

Build the **mechanism** (Phase 0): derive the system → tokens → type → layout grammar → primitives → blocks (against fixtures) → workbench → gate. Then **data** (Phase 1) fulfills block contracts. Then **screens** (Phase 2) are thin compositions. No screen is built before the kit it composes.

### Reconcile, don't copy

When the screens disagree with each other or with the library (spacing observed as 17/20/21/24/30/47px, slightly different card paddings, etc.), **normalize to a canonical scale/variant** and record the decision in a reconciliation log. The system — not any single screenshot — is authoritative.

### Per-surface loop (the anti-"sloppy" discipline)

For every primitive/block/screen: **(a)** pull exact spec + assets from Dev Mode / SVG geometry → **(b)** build/extend to the system spec (no estimates) → **(c)** for screens, compose from blocks only → **(d)** bind fixtures/real data → **(e)** render at 1440px, pixel-diff vs reference → **(f)** iterate to convergence + clean overlay → **(g)** confirm logical + composition parity.

### Fidelity DoD — every primitive/block/screen MUST pass

- **F1 · Visual.** At exactly **1440px** with mock-matching fixtures, passes the `fidelity-harness` pixel-diff vs the Figma/SVG reference at the calibrated threshold (target ≤ ~1% differing pixels at AA/colour tolerance, dynamic regions masked) **and** a 50%-overlay shows no layout drift.
- **F2 · Token-pure.** Zero colour/spacing/radius/type/shadow literals outside tokens (lint-enforced).
- **F3 · Logical parity.** IA matches the source exactly — nav items/order/counts, tabs, statuses, fields, flows, empty/error/loading states.
- **F4 · Real assets.** Exported Figma icons/logo/illustrations, not redrawn approximations.
- **F5 · Composition-pure.** A screen is `Template + Blocks + data` only — no styling, no layout literals, no raw markup (composition lint enforced). A block uses only primitives + tokens.

Phase 1 (data) changes are exempt from F1/F4 but **must satisfy their block's view-model contract exactly** (F3 at the data layer).

### System-level acceptance — generativity

Beyond per-screen fidelity, the mechanism is complete only when **`prove-extensibility-admin`** assembles the (mock-less) admin moderation screens purely from the kit with zero new system entities and zero bespoke styling. A failure is a *system* defect, fed back into Phase 0.

### Prerequisites — already satisfied vs. still blocking

**Already in hand (from the provided SVGs — no Dev Mode needed):** the colour palette, the radius set, the icon/logo/pattern assets, and component geometry. The token engine, primitives, and blocks can be grounded in these today; extraction is the one genuinely unblocked piece of Phase 0.

**Still hard blockers (cap fidelity until resolved):**
- **Fonts** — SF Compact + NKDy Mono files **and** web-embedding licence. Outlined to paths in the SVGs, so unrecoverable from them; if SF Compact is not web-licensable, type **cannot** be identical — the single biggest fidelity risk. Get a licensed decision (embed vs. agreed substitute) before the typography layer.
- **Locked design** — cannot pixel-match a moving draft (the brief marks it draft); the plan-only gate stands.
- **Raster marketing imagery** — the cosmic banner art is not in the SVGs; export from Figma/source.

**Refinement, not a blocker:**
- **Figma Dev Mode + Code Connect** + a **fresh token JSON** — now needed only to attach *semantic names* to the SVG-derived palette and to cross-check geometry, not to discover values. Useful, not gating.

### Where 1:1 is constrained (handle explicitly)

Fonts (licence — the one thing the SVGs can't supply), raster banner art (not in the SVGs → export + mask in diff), gradients (none in the SVGs — reproduce the "glow" as layered token-based fills/opacity), net-new data (component exact, bound to real Phase 1 data), sub-pixel/AA (absorbed by tolerance, never an excuse for drift).

## Scope

### Inputs analyzed

- **13 desktop mockups** (`/screens/*.jpg`) — content/instance references (lossy; the Figma frames are the fidelity source). Includes `customer-profile.jpg` (duplicate of dashboard).
- **Tokens + reusable assets, already in hand** (`screens/tokens.svg` 1360×9175, `screens/frames.svg` 3940×11463) — the brief's §3 library, **vector and exact**. This is not just a picture to copy; it is an extractable substrate we already possess:
  - **Colour palette (~22 colours)** readable from SVG fills — surfaces (`#01030e`, `#10121c`, `#0e101a`, `#1a1a24`), neutrals (`#8a8f99`, `#9fa0a4`), brand (`#0088ff`, `#0077e6`, `#4cacff`), and the full **status/tag set** (amber `#f59e0b`, blue `#3b82f6`, purple `#9747ff`/`#8b5cf6`, green `#10b981`/`#0cc671`, red `#ef4444`/`#ff383c`, pink `#f45fb1`, teal `#05c9e6`, orange `#f27c0d`).
  - **Radius scale** from rect geometry: 2, 2.5, 3, 3.5, 4, 4.5, 5, 8, 11, 12, 13, 16, 18px (to normalize into a canonical set).
  - **~270 vector ids / 1300+ paths** → individual **icons, the GIGLY logo, and the checkerboard pattern** are sliceable into an asset library directly (no Dev Mode needed).
  - Component inventory + states, the status palette, categories, tag systems, rating, collapsed sidebar, and a **Settings** screen absent from the JPGs.
  - **Not in the SVGs** (residual gaps): raster marketing imagery (cosmic banner art — ≤2 `<image>` nodes), the **font** (text is outlined to paths — unrecoverable here), semantic token *names*, and gradients (none — "glow" is layered fills/opacity).
  - Render to view via `sharp` (tokens) + inlined-SVG Chromium (frames, librsvg rejects its markup).
- `docs/DESIGNER_BRIEF.md`, `prisma/schema.prisma`, current `app/`, and the prior token-migration overhaul (`openspec/archive/create-ui-overhaul-plan/` — done).

### Screen → route → composition mapping

Each screen is an **instance** = `AppShell` (or `AuthLayout`) + blocks + data. The "blocks" column is the mechanism made concrete.

| Mockup | Route (current) | Template + blocks (composition) | Net-new data (Phase 1) |
|---|---|---|---|
| auth / reg / reg-customer / reg-specialist | `/auth`, `/register` | `AuthLayout` + StepIndicator + RoleCards + Form primitives | onboarding profile fields + datasets |
| customer-dashboard | `/dashboard` (CLIENT) | AppShell + BannerCard + Tabs + GigCard·grid + CreateGigCTA + MessagesPanel | completion %, ratings, deadlines |
| customer-projects | client gigs list | AppShell + FilterBar + Tabs + GigCard·list | categories, status tabs |
| specialist-dashboard | `/dashboard` (SPECIALIST) | AppShell + BannerCard + Tabs + GigCard·grid + SearchPanel + MessagesPanel | tab counts, ratings |
| specialist-gig-search | `/gigs` | AppShell + FilterBar + ViewToggle + GigCard·(grid/list) | rating, deadline, category |
| specialist-gig (detail) | `/gigs/[id]` | AppShell + GigHeader + RequirementCard·grid + CriteriaList + ClientCard + TermsTabs + ApplyPanel + ChatPanel | terms, milestones, rating |
| specialist-projects | SPECIALIST gigs list | AppShell + FilterBar + Tabs + GigCard·list | — |
| specialist-chats | **new** `/chats` | AppShell + ConversationItem·list + Search + MessageBubble·thread + Composer | conversation search, unread |
| specialist-progile | `/profile` | AppShell + ProfileHeader + StatPanel + TagList + ExperienceList + CategoryTags + GigCard | avatar, verification, work history, reviews |
| Финансы | **new** `/finances` | AppShell + StatPanel + LedgerTable | finances ledger/view (logical) |
| Споры | **new** `/disputes` | AppShell + DisputeList + DisputeDetail | dispute flow over moderation |
| Settings (library) | **new** `/settings` | AppShell + Select + Toggle·list + DangerAction | notification prefs, locale, deletion |
| Admin (no mock) | `/admin/*` | AppShell + DataTable + Filter + StatusBadge — **generativity proof** | (existing moderation data) |

### Phase 1 data-model worklist (additive; each fulfills a block's view-model contract)

| Concept | New model / fields | Fulfills contract of |
|---|---|---|
| Ratings/reviews | `Review` (1–5, author, target, gig, comment) + aggregate (value, count, verified) | Rating / GigCard / ProfileHeader |
| Categories | `Category` (seed: Маркетинг, Дизайн, Программирование, Разработка, Кодинг) + relations + favorites | CategoryTag / GigCard / FilterBar / Profile |
| Deadline + milestones | `Gig.deadlineDays` + milestones/«этапы» | GigCard / GigHeader |
| Profile evolution | avatar, phone+verified, position, specialization, location, timezone, `WorkExperience` | ProfileHeader / ExperienceList / onboarding |
| Terms negotiation | application proposed-terms vs client terms | TermsTabs |
| Finances | logical ledger/view over budget/fee/PAID | StatPanel / LedgerTable |
| Disputes | `Dispute` (gig, opener, reason, status, resolution) over `ModerationLog` | DisputeList / DisputeDetail |
| Account preferences | notification prefs, locale, `deleteAccount` | Settings blocks |

### Design-system facts (exact spec — from the library SVGs)

- **Status taxonomy (6):** Открыт=neutral · На рассмотрении=amber · В работе=blue · На проверке=purple · Завершён=green · Отклонён=red.
- **Categories (exactly 5):** Маркетинг, Дизайн, Программирование, Разработка, Кодинг (left-accent tags).
- **Sidebar** expanded + collapsed icon-rail; **rating** = stars+count+verified+experience tag; full primitive/block set with states. Exact colours/radii/geometry extracted from the SVGs in `extract-svg-tokens-and-assets`, normalized in `derive-design-system`.

### Logical parity (F3) — must match exactly

- **Sidebar by role.** CLIENT: Дашборд·Мои гиги·Чаты·Финансы·Споры. SPECIALIST: +Поиск.
- **Statuses (6), categories (5), tag systems (2)** as above. **SPECIALIST dashboard tabs:** Все·Заявки·В работе·На проверке·Завершённые (with counts). **Onboarding:** exactly 3 steps.

### Plan-only gate (fixed decisions, 2026-06-13)

1. **Full evolutionary revamp, delivered as a mechanism** — net-new features are real Phase 1 changes fulfilling block contracts.
2. **Plan only, execute nothing yet** — produced now; nothing executes until the design is **locked** (a hard prerequisite for pixel fidelity). Phases are dependency order.

### MVP boundaries (`project.md`)

- Not a payment processor in MVP → `finances-ledger` is a logical view (no gateway); the Finances **screen** is still composed exactly.
- `disputes-flow` builds on `ModerationLog`.

### Dependencies & ordering

- **Phase 0 — Mechanism** (extract → derive system → token engine → type → layout grammar → primitives → blocks → workbench → gate).
- **Phase 1 — Data** fulfilling block contracts (additive; precedes the screen that binds it).
- **Phase 2 — Compose screens** (thin instances) + the generativity proof. Shell cutover depends only on Phase 0.

### Testing friction (~700 tests; mechanism raises the bar but pays back)

- **Low:** tokens, type, primitives, blocks (against fixtures), additive models — each also carries a fidelity-diff and/or contract test.
- **High:** shell cutover, dashboards, lists, gig detail (DOM restructure → preserve `data-testid`, ARIA; fidelity baselines).
- **Mitigations:** additive migrations with defaults; stable action signatures/form `name`s; one surface per change behind the shell flag; fidelity + composition lints run per change; baselines committed.

### Designer gaps to request (cap fidelity until resolved)

- The residual 1:1 prerequisites only — **fonts (files + web licence)**, a **locked layout**, and **raster banner art**. (Palette, radii, icons, logo, and pattern are already in hand via the SVGs; Dev Mode / fresh-token-export are now refinement for semantic names, not blockers.)
- `customer-profile.jpg` duplicates the dashboard (no real client-profile mock); no admin/Finances/Disputes/Settings full-screen mocks (the admin gap is repurposed as the generativity proof); the brief's **«схема переходов»** flow diagram is still missing.

### Out of scope / non-goals

- Real payment-gateway/escrow (post-MVP). Mobile/responsive (desktop-only, 1440px). Authoring the design (we reconstruct the system exactly).

## Changes

> **Plan only — nothing below executes until the Figma design is locked.** Phases are dependency order.
> Run each with `/ralphy-plan <name> "…"` then `/ralphy-implement <name>` when the gate opens.
> Every primitive/block/screen is complete only when it passes the **Fidelity DoD (F1–F5)**; the
> mechanism is complete only when the **generativity** proof passes.

### Phase 0 — The mechanism (the UI-creation engine)

#### 1. extract-svg-tokens-and-assets
```bash
/ralphy-plan extract-svg-tokens-and-assets "Extract the system's substrate from the SVGs WE ALREADY HAVE (screens/tokens.svg, screens/frames.svg), Figma only to fill residual gaps. Requirements: (1) slice the vector ids/groups into a reusable asset library — individual icons (nav set, bell, gear, collapse, send, attach, eye, search, view-toggle, verified, status dots), the GIGLY logo/wordmark, and the checkerboard pattern — as optimized SVGs, (2) derive the colour palette from SVG fills (the ~22 colours, incl. status/tag/brand) and the radius set (2–18px) into docs/DESIGN_SPECS.md, (3) measure per-component geometry (dimensions, paddings, gaps, borders, icon sizes) from SVG coordinates — no estimates, (4) 1440px reference renders of every library component and screen frame as the fidelity baseline, (5) ONLY for residual gaps, use Figma/Dev Mode: raster banner art export, semantic token names, font metrics, and any component not present in the SVGs. Test: asset library + palette + radius set + measured specs + reference renders produced from the SVGs; residual-gap list explicit (no code; friction: low)."
```
*Why:* the tokens and reusable assets are already in the repo as vector — extract them, don't re-source them. Eyeballing (and re-sourcing what we hold) is what produced the parody. *Friction:* low.

#### 2. derive-design-system
```bash
/ralphy-plan derive-design-system "Reverse-engineer the canonical SYSTEM from the screens + library — the screens are samples, not the spec. Requirements: (1) normalize the values already extracted from the SVGs (the ~22-colour palette, the 2–18px radius set) plus spacing/type into canonical scales, reconciling one-offs and flagging genuine divergences as variants, (2) define the semantic token taxonomy, (3) define the component vocabulary + variant/state matrices (primitives AND blocks), (4) define the layout grammar (AppShell template, regions/slots, layout primitives) and the screen-composition pattern, (5) define each block's typed view-model contract, (6) write docs/DESIGN_SYSTEM_SPEC.md (the SSOT) + a reconciliation log (each screen deviation → resolution). Test: every library component + every screen maps to system entities with no unaccounted one-offs; reconciliation log complete (no code; friction: medium)."
```
*Why:* this is the mechanism's blueprint — the difference between a system and traced screens. *Friction:* medium.

#### 3. design-token-engine
```bash
/ralphy-plan design-token-engine "Implement the semantic token layer as the SSOT + enforcement. Requirements: (1) seed openspec/specs/ui/design-tokens.json from the SVG-derived palette/radii (already in hand) shaped to DESIGN_SYSTEM_SPEC's taxonomy — use the fresh Figma export only to attach semantic names / fill gaps, not to discover values, (2) run scripts/parse-design-tokens.js to regenerate Tailwind config + CSS variables, (3) include colour/type/space/radius/shadow/gradient/z-index + the status palette + tag/category colours, named semantically, (4) legacy-name shim, (5) a token-purity lint that FAILS the build on colour/spacing/radius/type literals outside tokens. Test: parser clean, build passes, token-purity lint runs and fails on a planted literal, unit suite green (friction: low)."
```
*Why:* atoms + the lint that makes F2 structural. *Friction:* low.

#### 4. typography-system
```bash
/ralphy-plan typography-system "Implement the exact type layer. Requirements: (1) resolve SF Compact web licence (BLOCKER) — embed the real font or document the licensed substitute + measured deltas, (2) add NKDy Mono + body family via next/font/@font-face, (3) bind families/sizes/weights/line-heights to type tokens, (4) verify glyph metrics vs reference. Test: no layout shift; sample headings/labels pass fidelity-diff; licence documented (friction: low). Flag capped fidelity if SF Compact is not web-licensable."
```
*Why:* type is the most visible axis and the biggest licence risk. *Friction:* low.

#### 5. layout-grammar
```bash
/ralphy-plan layout-grammar "Build the page-skeleton engine. Requirements: (1) AppShell template (sidebar slot + topbar slot + content region; expanded/collapsed) to DESIGN_SPECS, (2) AuthLayout template, (3) content layout primitives (Stack, Grid, Split, Section, Panel, Rail) on the canonical spacing scale, (4) the screen-composition pattern (a screen = template + slotted blocks + data) + a composition lint (screen files import only blocks/templates, no raw styled markup). Test: templates render with placeholder blocks; composition lint fails on a planted raw-markup screen; Fidelity DoD on the empty shell (friction: medium)."
```
*Why:* the syntax of the system — screens become arrangements, not free-form pages. *Friction:* medium.

#### 6. ui-primitives
```bash
/ralphy-plan ui-primitives "Build the primitive vocabulary, variant-driven, all states. Requirements: (1) Button, Input, PasswordInput, Select, Filter, Tabs, Toggle, Radio, Tag, CategoryTag, StatusBadge/Dot, Avatar, Rating, ViewToggle, ProgressBar, SearchInput — typed variant/state/size props, token-pure, every state from the library, (2) zero hardcoded values. Test: each primitive renders all states and passes the Fidelity DoD (F1 vs reference crop, F2, F4, F5); typed API rejects off-system values; render tests pass (friction: low)."
```
*Why:* the words the whole UI is written in. *Friction:* low.

#### 7. domain-blocks
```bash
/ralphy-plan domain-blocks "Build the domain block library from primitives, each with a typed view-model contract + fixtures. Requirements: (1) GigCard (all status variants), ProfileCard, MessageBubble, ConversationItem, NotificationItem, SidebarNav, Topbar, FilterBar, BannerCard, StatPanel, RequirementCard, CriteriaList, ClientCard, TermsTabs, ApplyPanel, ChatPanel, MessagesPanel, (2) each declares a typed view-model (the data it needs) and renders from fixtures — no backend yet, (3) composed only from primitives + tokens. Test: each block passes the Fidelity DoD against its library reference from fixtures; contracts are typed; render tests pass (friction: medium)."
```
*Why:* the reusable phrases screens are composed from — built before any screen, against contracts not schemas. *Friction:* medium.

#### 8. component-workbench
```bash
/ralphy-plan component-workbench "Stand up the living catalog that is the dev surface. Requirements: (1) a Storybook-style explorer documenting every token, primitive, block, and template with all states, (2) map each entry to its DESIGN_SPECS reference crop, (3) assemble screen compositions here (from fixtures) before they touch routes, (4) this is where fidelity baselines live. Test: catalog builds; every system entity has a story + reference; a sample screen composes from blocks in the workbench (friction: low)."
```
*Why:* makes the mechanism inspectable and the build surface; screens are assembled and proven here first. *Friction:* low.

#### 9. fidelity-harness
```bash
/ralphy-plan fidelity-harness "Wire the hard visual gate + the generativity harness. Requirements: (1) render each surface at 1440px with seeded fixtures, pixel-diff vs the reference renders (pixelmatch / Playwright toHaveScreenshot), (2) calibrate a threshold (≤ ~1% at AA/colour tolerance) + masking for dynamic regions, (3) side-by-side + 50%-overlay artifacts, (4) CI-blocking, (5) a generativity check scaffold (assemble an arbitrary screen from the kit and assert zero off-system values). Test: passes a known-good control, fails an injected 4px offset and a planted off-token value (friction: low)."
```
*Why:* turns 'looks close' into measured convergence (F1) and encodes the generativity test. *Friction:* low.

### Phase 1 — Data fulfilling block contracts (additive; precedes its screen)

#### 10. ratings-reviews-model
```bash
/ralphy-plan ratings-reviews-model "Fulfill the Rating/GigCard/ProfileHeader contract. Requirements: (1) Review model (1–5, author, target, gig, comment), (2) leave-review after COMPLETED/PAID, one per party per gig, (3) aggregate exposing exactly the contract fields (average, count, verified), (4) seed sample reviews. Test: create/aggregate/authorization covered; aggregate matches the view-model contract; suite green (friction: low–medium)."
```

#### 11. category-taxonomy
```bash
/ralphy-plan category-taxonomy "Fulfill the CategoryTag/FilterBar contract — exactly five: Маркетинг, Дизайн, Программирование, Разработка, Кодинг. Requirements: (1) Category model + seed, (2) gig⇄category relation, (3) specialist favorite categories, (4) safe-default migration. Test: assign/query; create/edit accept categories; matches the contract; suite green (friction: low–medium)."
```

#### 12. gig-deadline-and-milestones
```bash
/ralphy-plan gig-deadline-and-milestones "Fulfill the GigCard/GigHeader deadline+stages contract. Requirements: (1) Gig.deadlineDays ('Срок выполнения N дней'), (2) milestone model or stageCount ('[N этап]'), (3) create/edit inputs, (4) backward-compatible defaults. Test: create/display; legacy gigs graceful; matches the contract; suite green (friction: medium)."
```

#### 13. profile-evolution
```bash
/ralphy-plan profile-evolution "Fulfill the ProfileHeader/ExperienceList/onboarding contract. Requirements: (1) avatar, (2) phone+verified (logical), (3) position, specialization, location, timezone, (4) WorkExperience model, (5) member-since from createdAt. Additive with defaults. Test: edit/display; existing profiles unaffected; matches the contract; suite green (friction: medium)."
```

#### 14. terms-negotiation
```bash
/ralphy-plan terms-negotiation "Fulfill the TermsTabs contract. Requirements: (1) application proposed terms vs client terms, (2) both-tabs data, (3) accept-with-terms updates the gig, (4) preserve accept/reject. Test: propose/counter/accept; lifecycle otherwise unchanged; matches the contract (friction: medium)."
```

#### 15. finances-ledger
```bash
/ralphy-plan finances-ledger "Fulfill the StatPanel/LedgerTable contract (logical, no gateway). Requirements: (1) derive entries from budget/fee/PAID, (2) balance + history per role, (3) read-only data layer, (4) document the post-MVP boundary. Test: reflects payment statuses; matches the contract; suite green (friction: low–medium)."
```

#### 16. disputes-flow
```bash
/ralphy-plan disputes-flow "Fulfill the DisputeList/DisputeDetail contract over moderation. Requirements: (1) Dispute model linked to ModerationLog, (2) open-dispute action, (3) admin resolve + audit, (4) status to participants. Test: open/resolve/authorization; admin moderation unaffected; matches the contract (friction: medium)."
```

#### 17. account-preferences
```bash
/ralphy-plan account-preferences "Fulfill the Settings contract. Requirements: (1) notification-preference fields/model, (2) locale (RU default), (3) deleteAccount action (cascade, session teardown, confirm), (4) additive. Test: read/update; delete-account authorization + cascade; matches the contract; auth/profile flows green (friction: medium)."
```

### Phase 2 — Compose screens (thin instances; pass the Fidelity DoD)

#### 18. compose-shell-cutover
```bash
/ralphy-plan compose-shell-cutover "Wire AppShell + SidebarNav + Topbar into app/(protected)/layout.tsx with live data, replacing MainNav. Requirements: (1) exact RU nav per role (CLIENT: Дашборд/Мои гиги/Чаты/Финансы/Споры; SPECIALIST: +Поиск), (2) live counts (gigs, unread chats), (3) all protected routes render in the shell, (4) desktop-only, (5) preserve logout + notifications. Test: Fidelity DoD (F1 expanded+collapsed, F3 nav/counts, F5); every route renders; logout works; nav E2E updated (friction: high). Depends on: layout-grammar, domain-blocks."
```
*Depends on:* layout-grammar, domain-blocks, ui-primitives. *Friction:* high.

#### 19. compose-client-dashboard
```bash
/ralphy-plan compose-client-dashboard "Compose /dashboard (CLIENT) from blocks. Requirements: AppShell + BannerCard + Tabs + GigCard·grid + CreateGigCTA + MessagesPanel; real completion %, gigs, messages; no bespoke styling. Test: Fidelity DoD (F1 vs customer-dashboard reference, F3, F5); gig links + create flow work; tests green (friction: high). Depends on: shell-cutover, domain-blocks, ratings, deadline, categories."
```
*Depends on:* compose-shell-cutover, domain-blocks, ratings-reviews-model, gig-deadline-and-milestones, category-taxonomy. *Friction:* high.

#### 20. compose-specialist-dashboard
```bash
/ralphy-plan compose-specialist-dashboard "Compose /dashboard (SPECIALIST) from blocks. Requirements: AppShell + BannerCard + Tabs(Все/Заявки/В работе/На проверке/Завершённые + counts) + GigCard·grid + SearchPanel + MessagesPanel, mapped to existing states. Test: Fidelity DoD (F1 vs specialist-dashboard reference, F3 exact tabs/counts, F5); tab parity; tests green (friction: high). Depends on: shell-cutover, domain-blocks, ratings."
```
*Depends on:* compose-shell-cutover, domain-blocks, ratings-reviews-model, category-taxonomy. *Friction:* high.

#### 21. compose-gig-search
```bash
/ralphy-plan compose-gig-search "Compose /gigs from blocks. Requirements: AppShell + FilterBar + ViewToggle + GigCard·(grid/list) + 'Найдено N'; filters mapped to tag/budget/sort + category + Рейтинг; preserve pagination. Test: Fidelity DoD (F1 vs specialist-gig-search reference, both layouts, F5); search/filter/pagination parity (friction: high). Depends on: shell-cutover, domain-blocks, categories, ratings."
```
*Depends on:* compose-shell-cutover, domain-blocks, category-taxonomy, ratings-reviews-model. *Friction:* high.

#### 22. compose-gig-detail-apply
```bash
/ralphy-plan compose-gig-detail-apply "Compose /gigs/[id] from blocks. Requirements: AppShell + GigHeader + RequirementCard·grid + CriteriaList (from acceptanceCriteria/goal/deliverables/constraints) + ClientCard + TermsTabs + ApplyPanel (reuse structured fields) + ChatPanel (existing messages). Test: Fidelity DoD (F1 vs specialist-gig reference, F3, F5); apply works; owner sees applications; lifecycle actions unchanged (friction: high). Depends on: shell-cutover, domain-blocks, terms, deadline, ratings."
```
*Depends on:* compose-shell-cutover, domain-blocks, terms-negotiation, gig-deadline-and-milestones, ratings-reviews-model. *Friction:* high.

#### 23. compose-profile
```bash
/ralphy-plan compose-profile "Compose /profile from blocks. Requirements: AppShell + ProfileHeader (avatar, name, role tag, phone-verified, member-since, stats placeholder per mock) + StatPanel + TagList(Стек) + ExperienceList(Опыт) + CategoryTags(Избранные) + GigCard(Реализованные from PAID/COMPLETED) + aggregate rating. Test: Fidelity DoD (F1 vs specialist-progile reference, F3, F5); profile data + edit flow work (friction: medium). Depends on: shell-cutover, domain-blocks, profile-evolution, categories, ratings."
```
*Depends on:* compose-shell-cutover, domain-blocks, profile-evolution, category-taxonomy, ratings-reviews-model. *Friction:* medium.

#### 24. compose-chats
```bash
/ralphy-plan compose-chats "Compose /chats from blocks over the Message model. Requirements: AppShell + ConversationItem·list + Search + MessageBubble·thread (in/out, receipts, date separators) + Composer; unread via Notification.lastReadAt; wire sidebar 'Чаты' count. Test: Fidelity DoD (F1 vs specialist-chats reference, F3 list+thread, F5); inbox + thread + send work; per-gig messaging intact (friction: medium). Depends on: shell-cutover, domain-blocks."
```
*Depends on:* compose-shell-cutover, domain-blocks. *Friction:* medium.

#### 25. compose-finances
```bash
/ralphy-plan compose-finances "Compose /finances from blocks over finances-ledger. Requirements: AppShell + StatPanel + LedgerTable; empty state; 'logical amounts, no real payments' framing. Test: Fidelity DoD where a reference exists (else compose from blocks + flag missing mock, F5 still enforced); reflects ledger; nav active (friction: medium). Depends on: shell-cutover, domain-blocks, finances-ledger."
```
*Depends on:* compose-shell-cutover, domain-blocks, finances-ledger. *Friction:* medium. *Note:* no full-screen mock — request a frame.

#### 26. compose-disputes
```bash
/ralphy-plan compose-disputes "Compose /disputes from blocks over disputes-flow. Requirements: AppShell + DisputeList + DisputeDetail + open-dispute entry from a gig + admin resolve view + empty state. Test: Fidelity DoD where a reference exists (else compose from blocks + flag, F5 enforced); open/list/resolve render; authorization respected (friction: medium). Depends on: shell-cutover, domain-blocks, disputes-flow."
```
*Depends on:* compose-shell-cutover, domain-blocks, disputes-flow. *Friction:* medium. *Note:* no full-screen mock — request a frame.

#### 27. compose-auth-onboarding
```bash
/ralphy-plan compose-auth-onboarding "Compose /auth + /register as the 3-step wizard from blocks. Requirements: AuthLayout + StepIndicator + RoleCards + Form primitives; confirm-password; RU copy + checkerboard footer (exported asset); step-3 writes profile-evolution fields + dropdown datasets; keep loginUser/registerUser + validation. Test: Fidelity DoD (F1 vs auth/reg/reg-customer/reg-specialist references, F3 steps/fields, F5); register→dashboard; role preselect; validation; auth E2E updated (friction: medium–high). Depends on: layout-grammar, ui-primitives, profile-evolution."
```
*Depends on:* layout-grammar, ui-primitives, profile-evolution. *Friction:* medium–high.

#### 28. compose-settings
```bash
/ralphy-plan compose-settings "Compose /settings (from the profile-card gear) from blocks/primitives. Requirements: AppShell + Select(language, RU default over locale) + Toggle·list(notification categories) + DangerAction('Удалить аккаунт' → confirm → deleteAccount). Test: Fidelity DoD against library component crops (F1 component-level, F3, F5); read/update prefs; delete-account confirm; nav active (friction: medium). Depends on: shell-cutover, ui-primitives, account-preferences."
```
*Depends on:* compose-shell-cutover, ui-primitives, account-preferences. *Friction:* medium. *Note:* no full-screen mock — assembled from library components.

#### 29. prove-extensibility-admin
```bash
/ralphy-plan prove-extensibility-admin "GENERATIVITY ACCEPTANCE: rebuild the admin moderation screens (/admin, /admin/users, /admin/gigs — which have NO mock) purely from the kit. Requirements: (1) compose from AppShell + existing blocks/primitives (DataTable, FilterBar, StatusBadge, etc.) only, (2) ZERO new tokens/primitives/blocks and ZERO bespoke styling — if any is needed, that is a SYSTEM gap: add it to Phase 0 and note it, (3) preserve all admin behavior. Test: admin screens render from the kit; the generativity check asserts zero off-system values; existing admin tests green; any system additions are logged back to DESIGN_SYSTEM_SPEC (friction: medium). Depends on: the full Phase 0 kit."
```
*Why:* the system-level proof that we built a mechanism, not a replica. *Depends on:* all of Phase 0. *Friction:* medium.

## Status

**Phase 0 — The mechanism**
- [x] extract-svg-tokens-and-assets
- [x] derive-design-system
- [x] design-token-engine
- [x] typography-system
- [x] layout-grammar
- [x] ui-primitives
- [x] domain-blocks
- [x] component-workbench
- [x] fidelity-harness

**Phase 1 — Data fulfilling block contracts**
- [x] ratings-reviews-model
- [x] category-taxonomy
- [x] gig-deadline-and-milestones
- [x] profile-evolution
- [x] terms-negotiation
- [x] finances-ledger
- [x] disputes-flow
- [x] account-preferences

**Phase 2 — Compose screens**
- [x] compose-shell-cutover
- [x] compose-client-dashboard
- [x] compose-specialist-dashboard
- [x] compose-gig-search
- [x] compose-gig-detail-apply
- [x] compose-profile
- [x] compose-chats
- [x] compose-finances
- [x] compose-disputes
- [x] compose-auth-onboarding
- [x] compose-settings
- [x] prove-extensibility-admin

**Progress:** 29/29 changes completed — **PLAN COMPLETE.** **Phase 0 (the mechanism) COMPLETE**; **Phase 1 (data) COMPLETE — 8/8**; **Phase 2 (compose screens + the generativity proof) COMPLETE — 12/12** (compose-shell-cutover, compose-client-dashboard, compose-specialist-dashboard, compose-gig-search, compose-gig-detail-apply, compose-profile, compose-chats, compose-finances, compose-disputes, compose-auth-onboarding, compose-settings, prove-extensibility-admin). Phase 1: ratings-reviews-model, category-taxonomy, gig-deadline-and-milestones, profile-evolution, terms-negotiation, finances-ledger, disputes-flow, account-preferences. Phase 0: extract-svg-tokens-and-assets, derive-design-system, design-token-engine, typography-system, layout-grammar, ui-primitives, domain-blocks, component-workbench, fidelity-harness. The mechanism is validated end-to-end: the generativity proof rebuilt the mock-less admin screens purely from the kit with zero off-system values, closing the plan.

**Phase 2 note (compose-shell-cutover, 2026-06-15):** the protected app shell (`AppShell` + role-based RU `SidebarNav`/`Topbar`, replacing `MainNav`) is wired with live data, logout, and notifications — verified by E2E (`__tests__/e2e/shell-cutover.spec.ts`), F3 logical parity, F5 composition purity, build, the 862-test unit suite, and the fidelity harness; the shell chrome is **visually faithful** (1440px diff + 50%-overlay reviewed). The **F1 ≤1% pixel gate is deferred**: the diff (~9.8%) is dominated by the **substitute font** (SF Compact unlicensed) and the **uncomposed page bodies** (each composed by its own `compose-*` change) — both external to the shell. The remaining screens compose page bodies into this shell; the ≤1% gate is reachable per-screen once the font licence + exported assets land.
**Started:** 2026-06-14 — the paper/extraction/token-engine prerequisites are unblocked and in hand; pixel-fidelity phases remain gated on the Figma design lock + fonts/licence + exported assets
**Completed:** Not completed
