# Proposal: Create UI Redesign Integration Planning Document

## Change ID
`create-ui-redesign-plan`

## Type
Planning Document Creation

## Problem Statement

A new visual design for Gigly has been delivered as 13 desktop mockups in `/screens` (exported from a Figma draft). It is a ground-up **product revamp** — not a token tweak or a like-for-like reskin — that replaces the current top-nav, English, mobile-responsive UI with a persistent **left-sidebar app shell**, **Russian copy**, and substantially richer screens that introduce new capabilities (ratings, categories, deadlines/milestones, an aggregated chat inbox, a portfolio-style profile, a multi-step onboarding wizard, and new "Финансы"/"Споры" sections).

**Current state:**
- The app uses a top `MainNav` (English labels) inside `app/(protected)/layout.tsx`. The redesign requires a left **sidebar + topbar** shell with role-specific nav and item counts.
- The existing routes (`/dashboard`, `/gigs`, `/gigs/[id]`, `/gigs/new`, `/profile`, per-gig messaging) cover the marketplace loop, but the mockups display data the schema does **not** have: ratings/reviews ("★★★★★ 45" on every card), avatars/photos, a category taxonomy (Дизайн, Маркетинг…), gig deadlines ("Срок выполнения 14 дней"), milestones ("[1 этап]"), terms negotiation ("Условия / Мои условия"), structured work history, phone verification, and entire Finances/Disputes sections.
- `docs/DESIGNER_BRIEF.md` sets the ground rules: the Figma file is still a **draft** ("черновик — продакшн-код по черновику не пишем"); the redesign is **desktop-only** (1440px, "мобильную версию не делаем"); and the current design tokens are **outdated and must be re-exported first**.

**Gap:** There is no roadmap for delivering this revamp. Because it is a *big evolutionary job* — the new look plus the data and backend the design implies — it must be decomposed so that (a) net-new data models land **before** the screens that display them, (b) the working gig lifecycle and its ~700 tests keep passing throughout, and (c) cheap, draft-independent preparation is distinguished from screen assembly that should wait for a locked design. We need a planning document that dissects the 13 screens, maps each to a route and an existing-vs-net-new gap, and emits a dependency-ordered set of ralphy-plan commands.

## Solution Approach

Create a planning document at `openspec/planning/ui-redesign-integration.md` that turns the screenshots into an executable, dependency-ordered roadmap for a **full revamp** (look + the features the design implies).

**The planning document will:**
- **Inventory** all 13 screens and group them: onboarding mini-flow (4), shared app shell (cross-cutting), internal screens (8), and one duplicate to flag (`customer-profile.jpg` == `customer-dashboard.jpg`).
- **Consume** the two component-library SVGs the designer added to `/screens` (`tokens.svg`, `frames.svg`) — the brief's §3 "library page". They supply the authoritative component inventory + states, the semantic status palette, the five categories, the two tag systems, the rating, and the collapsed-sidebar state; they also reveal a **Settings** screen (locale, notification preferences, account deletion) not present in the 13 JPGs.
- **Map** each screen to a target route, its current implementation, the visual gap, and the net-new data/feature it implies (see the dissection in `tasks.md`).
- **Sequence** the work in three dependency layers, all of which are *planned now but executed later* (see the gate below):
  - **Phase 0 — Foundation:** re-export design tokens (incl. the semantic status palette), resolve font licensing (SF Compact / NKDy Mono), scaffold the app shell (expanded + collapsed) behind a flag, stand up a screenshot-compare harness, map the provided component library to code, and build the reusable UI primitives from it.
  - **Phase 1 — Data model & backend:** the net-new concepts the design needs — ratings/reviews, category taxonomy, gig deadline + milestones, profile evolution (avatar, phone verification, position/specialization/location/timezone, structured work history), terms negotiation, a Finances view, a Disputes flow, and account preferences (notification settings, locale, account deletion). Each lands as its own change, ahead of the screens that consume it.
  - **Phase 2 — Screen assembly:** shell cutover → shared gig card → dashboards → gig search → gig detail/apply → profile → chats inbox → finances page → disputes page → auth/onboarding wizard → settings page, each screenshot-compared to its mockup and wired to the real Phase 1 data.
- **Honor the MVP boundary:** per `project.md`, Gigly is *not a payment processor in MVP* (payment is a logical `PAID` status). The Finances change therefore delivers a **ledger/view over logical amounts**, and Disputes builds on the existing `ModerationLog`; real payment-gateway integration stays explicitly post-MVP. The plan flags these boundaries rather than silently crossing them.
- **Provide** copy-pasteable ralphy-plan commands with numbered requirements and deterministic test plans, plus a testing-friction level (the suite has ~700 unit/integration + Playwright E2E tests; `data-testid` and semantic HTML are preserved through screen changes).

**Analysis required (performed during `/ralphy-implement`):**
1. Re-read all 13 screens in `/screens` and confirm the screen→route→gap mapping in `tasks.md`.
2. Audit the current shell (`app/(protected)/layout.tsx`, `app/components/MainNav.tsx`) and the screens it hosts.
3. Diff `prisma/schema.prisma` against the data the mockups display to fix the Phase 1 data-model worklist.
3a. Mine the provided component library (`screens/tokens.svg`, `screens/frames.svg`) for the component inventory, states, status palette, categories, and the implied Settings screen (render with `sharp` / inlined Chromium — both are vectorized).
4. Read `docs/DESIGNER_BRIEF.md` (desktop-only, token re-export, draft status) and `project.md` (MVP non-goals) and encode both into the plan.
5. Review the prior UI initiative (`openspec/archive/create-ui-overhaul-plan/`, `ui-*` changes) to reuse the token pipeline and avoid re-litigating settled patterns.

## Why This Matters

From `project.md`:
- **"Professional B2B Experience"** and **"Quality Over Quantity"** are core principles; a cohesive revamp — with the trust signals the design adds (ratings, portfolios, clear status) — is exactly what the MVP needs in front of B2B clients.
- **"Russian Market First"** — the redesign's Russian-language shell aligns the product with its actual market, where the current English nav is a mismatch.
- The new capabilities map directly onto stated success metrics: ratings/portfolios support **Organic Retention**; clearer gig structure (deadlines, milestones, categories) supports **Core Loop Completion** and **Time-to-Hire**.

A dependency-ordered plan ensures this large job lands **without breaking the working marketplace loop**, keeps data-model work ahead of the UI that needs it, and respects the documented MVP boundaries (logical payments, moderation-based disputes) instead of over-building.

## Scope

**In Scope (this change — the planning document):**
- Screen-by-screen dissection of the 13 mockups and their mapping to current routes.
- A Phase 1 data-model worklist for every net-new concept the design implies, grounded in the schema.
- A three-phase (Foundation / Data & Backend / Screen Assembly) dependency-ordered set of ralphy-plan commands.
- Testing-friction assessment and mitigation per change.
- Explicit MVP-boundary notes for Finances and Disputes.

**Out of Scope (this change):**
- Any actual implementation (that follows, via the generated commands — and only once the design is locked).
- Real payment-gateway / escrow integration (post-MVP per `project.md`; Finances delivers a logical ledger/view only).
- Mobile/responsive design (brief: desktop-only).
- Producing the final design tokens themselves (the designer re-exports; we integrate).

## Constraints

1. **Plan only, execute nothing yet** — This change produces the planning document; **no** implementation change (not even Phase 0) is started until the design is marked final/locked. The phases express dependency order, not a license to begin.
2. **Data before screens** — Net-new models/backend (Phase 1) MUST precede the screens that display them (Phase 2); a screen change MUST NOT invent its own data layer.
3. **Preserve the working loop** — The full gig lifecycle, applications, messaging, profiles, admin, and notifications MUST keep working through every change; schema changes are additive/backward-compatible.
4. **Test stability** — Preserve `data-testid` and semantic HTML so the ~700-test suite needs minimal selector churn; run tests incrementally per change.
5. **Desktop-only** — Target 1440px; the plan must decide the fate of existing mobile-responsive code rather than leave it half-applied.
6. **Token fidelity** — Styling MUST use the re-exported design tokens (`openspec/specs/ui/design-tokens.json` → `scripts/parse-design-tokens.js`), not ad-hoc hex.
7. **Respect MVP non-goals** — Finances is a logical ledger/view (no real gateway); Disputes builds on `ModerationLog`. The plan flags these boundaries explicitly.

## Dependencies

- Requires: `/screens/*.jpg` (13 mockups — exist) and `docs/DESIGNER_BRIEF.md` (exists).
- Requires: `openspec/specs/planning/spec.md` (exists) and `openspec/specs/ui/spec.md` (exists).
- Requires: `prisma/schema.prisma` and current `app/` implementation (exist) for the gap analysis.
- Soft-blocks all execution: a re-exported design-token JSON and a **locked Figma layout** (owned by the designer, per brief).
- Blocks: all UI-revamp implementation changes emitted by the planning document.

## Success Criteria

1. Planning document exists at `openspec/planning/ui-redesign-integration.md`.
2. Document follows the format in `openspec/specs/planning/spec.md` (Problem, Why, Scope, Changes, Status; creation date present).
3. Document contains the 13-screen inventory and a screen→route→gap mapping table.
4. Document schedules the net-new features as **Phase 1 data-model/backend changes** (not stubs), each ordered ahead of the screen(s) that consume it.
5. Document records the **plan-only gate** (nothing executes until design lock) and orders all changes by dependency across Phase 0 → 1 → 2.
6. Each change provides a copy-pasteable ralphy-plan command with numbered requirements, a deterministic test plan, and a testing-friction level (low/medium/high) + mitigation.
7. Document flags the MVP boundaries for Finances and Disputes, the `customer-profile.jpg` duplicate, and the missing client-profile/admin mocks.
8. Status section shows `PLANNED` with the creation date and a `0/N` progress line.

## Estimated Effort

**Planning Phase** (this change): ~3–4 hours
- ~1.5 hr: confirm screen dissection + schema gap → Phase 1 data-model worklist
- ~1.5 hr: sequence all changes, write ralphy-plan commands, testing-friction notes
- ~30–60 min: write and self-review the planning document against the spec

**Implementation Phase** (after planning, **after design lock**): TBD from the document — a multi-week effort of ~26 changes: foundation (incl. a UI-primitives library built from the provided component library), ~8 data-model/backend changes, and ~12 screen changes.
