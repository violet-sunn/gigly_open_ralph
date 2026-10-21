# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Clients (primary).** CTO, tech lead, PM, HR or founder at a Russian IT product company or startup (~10–100 people). They have more work than the core team can handle, usually urgently, and need one bounded piece of work done by a strong external specialist. Many are not engineers and struggle to turn "what we want" into a clear task; their failures come from fuzzy requirements and scope creep, not lack of talent.

**Specialists.** Middle+/Senior engineers, architects, DevOps with ~5+ years. They already have a primary job, have hit a salary ceiling, and want well-paid bounded gigs on top without quitting or burning out. They dislike "salesy" freelancing (generic cover letters) and wasted time on clients who don't know what they want.

**Admin.** Platform operator/moderator: suspends users, closes gigs, resolves disputes, hard-deletes junk accounts and gigs (with a blast-radius preview).

## Product Purpose

Gigly is a B2B gig marketplace for the Russian IT market. It connects legal entities (Clients) with vetted Middle+/Senior specialists and drives a concrete piece of work from posting to "marked as paid" through a structured lifecycle.

Success in the MVP means two things: companies actually get work done through outsourcing, and specialists actually earn more by monetizing their seniority. Target metrics on record: >30% of clients post a second gig organically within 3 months, >60% of gigs reach COMPLETED, time-to-hire under 7 days, 3–5 applications per gig.

**Stage (confirmed 2026-10-20):** diploma project defended (July 2026), now carried forward as a real MVP toward real users. Production runs on Amvera Cloud. All users so far have been friends/testers (three feedback rounds); there are no real customers yet.

## Positioning

The user names the combination, not one mechanism, as the claim: no single item was ranked above the others.

- **Clarity upfront.** A required Definition of Done on the client side; structured applications on the specialist side (approach, clarifying questions, estimate). Mutual understanding before work starts, fewer disputes and less scope creep.
- **Middle+/Senior-only pool** ("Russian Toptal Lite"): quality over volume, seniority as the filter. A soft constraint in the MVP, enforced via profiles and messaging, not verification.
- **B2B-only, Russian-first.** Company clients, RUB budgets, explicit budget + service fee, clear statuses. Not global; CIS/global expansion is explicitly not a goal.
- **Fast time-to-hire.** A strong specialist in days, not weeks.

Versus Upwork: local and simpler. Versus FL.ru / Kwork / Habr Freelance: execution quality and a structured process instead of volume. Versus Toptal: accessible for the Russian mid-market, operational efficiency over elite curation.

## Operating Context

- Russian-language web app used at work, desktop-first. Roles are chosen at registration (client or specialist); admin is a separate panel.
- **Core loop:** client creates a gig (title, description, acceptance criteria / Definition of Done, RUB budget, category, deadline) → specialists apply (approach, questions, estimate; one application per specialist per gig, only on OPEN gigs) → client accepts one (others auto-rejected) → work → specialist submits → client approves → client marks as paid.
- Around the loop: per-gig chat, real-time notification bell, disputes with admin resolution (settlement blocked while disputed), finances ledger, profiles, settings (dark/light theme), guide/help, terms and privacy pages.
- Gig sizes: minimum ~10,000 ₽; expected average 150–200k ₽; larger projects are split into several gigs manually.
- Tooling: OpenSpec specs in `openspec/specs/` are the behavioral source of truth; `openspec/project.md` holds the original product vision (note: its 10% fee figure is stale, see below).

## Capabilities and Constraints

- **Stack:** Next.js 15 App Router, React 19, Server Components + Server Actions, Prisma 7 over SQLite (libsql adapter), Tailwind + inline design tokens in `app/_design/`, self-hosted fonts, JWT sessions. Docker on Amvera with SQLite on a persistent volume.
- **Russian-only UI and RUB; no i18n planned** (confirmed). English is not a target.
- **Desktop-first, mobile must still work** (confirmed). The design spec is desktop-only; the app has a narrow-screen mode (≤1024px, off-canvas drawer, single-column grids) verified overflow-free at 360/390/414px. It must not regress.
- **Payment is a logical status.** "Оплачен" is a manual mark by the gig owner; there is no payment gateway. The service fee is 17.5% on top of the budget, charged to the client; the specialist sees and receives the full budget. The rate lives once in `lib/pricing.ts` and is a temporary MVP parameter, not a strategic constant. Existing gigs were not re-priced when it changed from 10%.
- **Lifecycle rules:** OPEN → IN_PROGRESS (client accepts) → REVIEW (assigned specialist submits) → COMPLETED (owner approves) → PAID (owner marks). Admin can close any gig.
- **Terminology (Russian UI):** гиг, отклик, клиент, специалист, критерии приёмки, сервисный сбор, спор, «Оплачен», «Мои гиги».
- **Testing baseline:** Vitest suite green (0 integration failures is the baseline; a failure means your change). Playwright E2E exists; SSE on the bell breaks `networkidle` waits.
- **Explicitly post-MVP, undecided:** real payments/escrow, legal document flows and INN/KPP checks, reputation system, milestones, portfolios, detailed pricing tiers. Do not design as if they exist.

## Brand Commitments

- **Name:** Gigly (Latin script, also in the Russian UI).
- **Design source of truth (confirmed binding for all UI work):** `gigly_full_design/` — the full prototype, 62-component bundle, 59 JSX sources, 189 tokens, light-theme spec, DATA-MODEL / ROUTES / HANDOFF docs. Blue `#0088ff` accent, Handjet + Manrope (self-hosted, licence-clear), dark and light themes. Screens are built by transporting the prototype's rendered markup, never reconstructing from memory. `Auth.dc.html` is the real auth design.
- **Voice:** formal «вы» throughout (observed: 51 вы-forms, 0 ты-forms). Structured, direct, professional B2B tone; the product explicitly rejects "salesy" freelancing language.

## Evidence on Hand

- Interactive design prototype and docs: `gigly_full_design/`; Figma exports in `docs/figma-*.md` and `docs/figma-tokens-export.json`.
- Demo videos (July 2026, local, gitignored): `demo-videos/` — six chapter mp4s plus a compiled full demo of the complete loop.
- Seed dataset: `prisma/seed.ts` — fictional demo users and gigs, not real customers.
- Tester feedback: three rounds from friends, archived in `openspec/planning/archive/prod-feedback-fixes-round2.md` and `-round3.md`.
- **Absent, must not be fabricated:** real customers, testimonials, case studies, press, benchmarks, legal-entity details, a pricing page beyond the fee, and any claim of real payment processing.

## Product Principles

1. **Clarity through structure, not bureaucracy.** Guided fields, prompts and examples create "good friction" that filters for clients who care about outcomes and specialists who think before applying.
2. **Trust through transparency.** Budget, fee and status are always explicit; no hidden deductions from the specialist's payout. Honest about what is a logical status versus a real transfer.
3. **Quality over quantity.** Senior specialists and company clients; no mass-market junior funnel.
4. **Russian market first.** RUB, local realities and communication culture; no global ambitions in the MVP.
5. **Simple core loop, MVP first.** Prove that companies get work done and seniors earn more before building legal/financial infrastructure. A productivity tool, not a fee-taking middleman.

## Accessibility & Inclusion

- Keyboard navigation standard documented in `docs/ACCESSIBILITY.md`: skip-to-content link, visible focus ring meeting WCAG 2.1 AA (3:1), Esc closes modals/dropdowns, `/` focuses search, logical tab order.
- Known gap: the root `<html>` declares `lang="en"` while all content is Russian; screen readers will mispronounce the UI until it is `ru`.
