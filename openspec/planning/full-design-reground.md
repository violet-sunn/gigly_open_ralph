# Full-Design Re-Ground — Reassessment & Re-Route

**Created:** 2026-06-19
**Status:** PLANNED (master plan)
**Supersedes-as-SoT:** the `/screens/*.svg` extraction and the partial Figma MCP exports (`docs/figma-*.md`).
**Extends:** `openspec/planning/figma-grounded-ui-reconciliation.md` (9/13 done) — its remaining items fold into Phase 3 here, re-grounded on the new source.
**New source of truth:** `gigly_full_design/` — full clickable prototype + 62-component bundle + **59 readable JSX sources** + **189 tokens** (Light/Dark) + `DATA-MODEL.md` / `ROUTES.md` / `HANDOFF.md` / `ТЗ — Светлая тема.md`.

## 1. The paradigm shift

Every prior UI iteration was grounded in **lossy inputs**: first the outlined-font SVG extraction, then *partial* Figma MCP exports (18 composites + 14 screens). `gigly_full_design/` replaces both with a **complete, concrete, runnable** handoff — real geometry, real JSX per primitive, a full token set with a second theme, and a prototype that *is* the F1 reference. The mandate: **treat `gigly_full_design` as the paradigm, re-ground the SoT, and re-judge the work done against it.**

Three things this resolves outright:
- **Fonts (the #1 risk that capped F1 ≤1%)** — sanctioned free-Cyrillic substitution: NKDuy Mono→**Handjet**, Vremena Grotesk→**Manrope**, SF Compact→**system**. The "font licence is an external prerequisite" caveat is retired.
- **F1 baseline** — re-ground from `screens/*.svg` renders onto the prototype frames (`Gigly Развёртка.dc.html`).
- **The "three blues" non-issue** — `#0088ff` brand / `#0265dc` border-brand (`light-blue-900`) / `#4cacff` primary-hover now have distinct semantic homes, not an inconsistency.

## 2. Reassessment of the work done — what holds, what re-grounds

**The layered mechanism holds.** The tokens→primitives→blocks→layout→composition→workbench→fidelity engine is sound and its **token values broadly AGREE** with the authoritative export (brand `#0088ff`, surface `#01030e`/`#10121c`, `--gig-bg #1a1a24` = `surface-level-3`, status-testing/verification `#8b5cf6`). `reconcile-design-tokens-from-figma` and the Phase-0 kit additions were **on-target** — this is a re-ground, not a rebuild.

**The codebase is further along than the plan tracked.** Route sweep: `dashboard, /gigs (search+mine), gigDetail, chats, finances, disputes(+detail), profile(+edit, +public), createGig, settings, admin(+users,+gigs), auth/login/register` are **all built and composed**. The 14-screen reconciliation plan undercounts reality — disputes/finances/settings/chats already exist (your recent specs commit).

**What re-grounds (not redone):** the remaining reconciliation items (`reconcile-gig-detail-apply` already planned, `reconcile-my-projects`, `reconcile-chats`) and the fidelity pass should now target the **prototype**, with fonts resolved.

## 3. The delta in four dimensions

### 3.1 Tokens — near-complete agreement; gaps are additive
- ✅ Core palette/surfaces/brand/status values AGREE with `scripts/generated-tokens.*`.
- ➕ **Add:** the full status **radial + border + text** triads (open/in-progress/review/testing/completed/rejected), the `shadow-sm/md/lg/focus` set, the complete `spacing` scale (xs…6xl), `radius` scale incl. `radius-special 16`.
- ➕ **Pin category colours** (currently only `category-marketing #0088ff`): **Маркетинг=blue · Дизайн=rose · Программирование=green · Разработка=teal · Кодинг=orange** — the unbound hue↔domain mapping the old plan flagged is now resolved by `DATA-MODEL.md`.
- 🆕 **Light theme** token values (a whole second mode).

### 3.2 Components — kit is healthy; one real atom gap
- 23 primitives + 44 blocks coded. The design catalog (62) is mostly **primitive-level**; the coded kit correctly **adds ~42 domain blocks** that compose them. Most "design-only" catalog entries already have coded homes (SearchFilters→`SearchPanel`, Section→layout, Menu/Menupage→`SidebarNav`, Roleplay→`RoleCards`, H3/HH1BLOCK/HH2→`SectionHeader`).
- 🆕 **Real gap: `Bio` (+ `BioMessageCOMPANY`)** — the *acc-bio* chat/profile bio (avatar + name + verify-patch + stars + `Специальность`). Used by chat headers + gig-detail conditions; today approximated by `ChatHeader`/`ClientCard`. Worth a first-class block.
- 🔁 **Variant touch-ups:** Button `tetriary` naming vs coded `ghost/link`; `InputField` design states are a subset of the coded `Input`. Minor reconciliation, not new work.

### 3.3 Data model — the biggest delta (real vs denormalized)
**Real reconciles (schema/code):**
- **`Gig.status`** — bare `String "OPEN"`; design distinguishes **`under_review` («На рассмотрении» = has applications)** from **`review` («На проверке» = work submitted)**. *Decision: derive `under_review` (status OPEN + applications>0) rather than store it* — cleaner, MVP-friendly, no migration; only the display/VM mapping changes.
- **`Category.color`** — add the 5-colour field (or encode in `lib/categories.ts` + tokens).
- **`Notification.type`** — add `payment`; consider a denormalized `text` (today derived from `eventData`).
- **`Dispute`** — design is richer: `openerRole`, frozen `amount`, `evidence[]`, a `timeline` of `DisputeEntry`, and a `reason` **enum** (6 reasons). Today `reason` is free text + `status OPEN|RESOLVED|REJECTED`. Real migration if we adopt the resolve-flow + timeline.

**Design-doc denormalizations the code already handles better (NOT gaps):**
- `User.ratingStars/ratingCount` → code derives from the `Review` aggregate (`getRatingForUser`). Keep computed.
- `Transaction` table → finances derive from gigs by status. Keep computed for MVP.
- `Notification.read` → `lastReadAt != null` already encodes it.

### 3.4 Routes — mostly built; targeted gaps
- ✅ **Built & composed:** dashboard, search/mine gigs, gigDetail, chats, finances, disputes(+detail), profile(+edit/+public), createGig, settings, admin(+users/+gigs), auth.
- 🔁 **Reconcile to design:** `settings` (the design adds Session rows + Toggle/Check fields + the **light-theme switch**); `createGig` (the guided-brief: DoD constructor + readiness meter + live 10% fee); `disputes` (dedicated `disputeNew` + admin `disputeResolve` resolution UI vs today's modal/embedded).
- 🆕 **Build:** company **`applications`** screen (applicant list — today embedded in gig detail); **onboarding** screen.

## 4. Re-routed roadmap

> Run each with `/ralphy-plan <name> "…"` then `/ralphy-implement <name>`. Phase 0 is cheap doc re-grounding (mostly done in this commit); Phases 1–4 are the substantive re-route. Every change still meets the inherited **Fidelity DoD (F1–F5)** — but F1 now baselines on the **prototype frames** with **resolved fonts**, so the absolute ≤1% gate is finally in reach.

### Phase 0 — Re-ground the source of truth (cheap)
- [x] `project.md` §Design Tokens → point at `gigly_full_design` (this commit).
- [x] Predecessor note on `figma-grounded-ui-reconciliation.md` (this commit) + memory `gigly-full-design-import`.
- [x] `adopt-design-fonts` — **DONE (2026-06-19)**: NKDuy Mono→Handjet (`--font-mono`) + Vremena Grotesk→Manrope (`--font-grotesk`, new) via `next/font/google` (self-hosted, Cyrillic); SF Compact→system stack (`--font-sans`). Dropped Inter/JetBrains; exposed `font-grotesk`; F1 font cap retired across docs/planning/memory. tokens/build/lint/unit green.

### Phase 1 — Token + theme foundation
- [x] `reconcile-tokens-to-full-design` — **DONE (2026-06-19)**: added 5 status radials + 6 `status-border` tints + `shadow.sm`/`lg` + spacing `80`/`96`; pinned categories (marketing→#4cacff per the design's Category blue, design→rose; SUPERSEDES RC-S3); `status.open` text kept gray. Legacy keys intact; regenerated; `validate:tokens` 45 colours in-sync, `lint:tokens`/`build`/unit green. (RC-T1–T4, DESIGN_SYSTEM_SPEC §10.9.)
- [x] `add-light-theme` — **DONE (2026-06-19)**: appearance tokens var-backed → runtime `[data-theme]` switch; light values (depth via shadow+grey, status glow→flat-fill, brand+Handjet invariant); `lib/theme.ts` + no-flash boot + Settings → Внешний вид. `/opacity`-on-`var()` regression fixed via `tint/*` tokens. validate(48 colours)/lint/build/unit/theme-switch-E2E green. (RC-T5–T7, DESIGN_SYSTEM_SPEC §10.10.) Deferred → `light-theme-screen-audit`.
  - [x] **follow-up `light-theme-screen-audit` — DONE (2026-06-20)**: WCAG-AA contrast gate (`lint:contrast`, both themes); 74 literals → 0 (deleted dead auth trees + token-migrated login/InfoIcon; purity flipped fail-on-all); logo-on-light via `surface.logo-plate` (ТЗ §5); `suppressHydrationWarning` fix; `theme-coverage` E2E. (RC-T8–T11, §10.11.) **Phase 1 fully closed.**

### Phase 2 — Data-model reconcile
- [x] `reconcile-data-model-to-design` — **DONE (2026-06-20)**: `under_review` derived (`gigDisplayStatus`, OPEN+apps→`review`) in card/detail/dashboard mappers (no stored enum, lifecycle untouched); `Category.color` (+seed); `Notification` `payment` type + optional `text`; `Dispute` enriched (`openerRole`/`amount`/`evidence`/reason-enum + new `DisputeEntry` timeline) + resolve verdict (spec/company/50%). Ratings/transactions stay computed. Schema via `db push`; build + **918** unit/integration green (incl. 7 new acceptance tests).

### Phase 3 — Kit gap + screen re-reconciliation (re-ground on the prototype)
- [x] `add-bio-block` — **DONE (2026-06-20)**: `Bio` block (sizeFor gig|acc-bio × user; company omits `Специальность` → collapses `bio` 2931:2365 + `bio/message/COMPANY` 2931:2366); adopted in `ChatHeader` (renders Bio; VM preserved + optional specialty) + gig-detail CONDITIONS (`getGigDetail` `bio: BioVM`). 3-variant render tests; build/lints/921 unit/chat+gig-detail E2E green. (RC-S13, §10.12.)
- [ ] `reconcile-gig-detail-apply` — already authored; re-ground its F1 on the prototype (the design CONFIRMS its col1/col2 structure; the files section remains a sanctioned omission until attachments exist).
- [ ] `/ralphy-plan reconcile-my-projects "…2860:2192 / 3795:5947…"` and `/ralphy-plan reconcile-chats "…2860:4702 / 3795:6890, adopt Bio…"` (from the prior plan, re-grounded).
- [ ] `/ralphy-plan reconcile-settings "Reconcile /settings to the design: SessionRow list, Toggle/Check fields, and the light-theme switch (Phase 1). Test: prefs persist; Fidelity DoD; E2E."`
- [ ] `/ralphy-plan build-applications-screen "Company applicants screen (ROUTES applications): specialist cards (approach/questions/estimate) → Accept (assigns, others rejected) / Reject. Lift from the embedded gig-detail list. Test: accept→in_progress; Fidelity DoD."`
- [ ] `/ralphy-plan reconcile-disputes-flow "Dedicated disputeNew (reason enum + description) + admin disputeResolve (verdict: spec/client/50% → resolved + moderation log) + timeline. Test: open→resolve lifecycle; Fidelity DoD."`
- [ ] `/ralphy-plan reconcile-create-gig "Guided brief: DoD constructor (goal/result/'Готово, когда…' criteria) + readiness meter + live budget→10% fee→total + success screen. Test: validation + fee math; Fidelity DoD."`
- [ ] `/ralphy-plan reconcile-finances-and-admin "Re-ground /finances (role summary + ops by status) and the admin console (stats + dispute queue + users/gigs moderation + log) on the prototype. Test: role figures; Fidelity DoD."`
- [ ] `/ralphy-plan add-onboarding-screen "Onboarding (Онбординг.dc.html). Test: flow + Fidelity DoD."`

### Phase 4 — Re-validate against the prototype
- [ ] `/ralphy-plan refidelity-from-full-design "Re-baseline F1 on the prototype frames (Развёртка) for every screen + component; fonts now resolved → assert the ≤1% gate. Re-run the generativity proof against the expanded kit + light theme. Test: known-good control passes; injected offset + planted off-token fail; admin generativity = zero off-system values in both themes."`

## 5. Caveats
- `gigly_full_design` source/bundle components are only **partially tokenized** (spacing via vars, many color literals baked) — they are the fidelity **spec**, not drop-in token-pure code; our F2/F5 discipline still governs the coded kit.
- Bundle components have baked colors → light theme needs per-component overrides (HANDOFF documents the pattern).
- Desktop-only, one big DC file, inline styles — these are prototype properties, not targets.
- Don't import design-doc denormalizations (stored ratings, a Transaction table) — the computed approach is already correct for MVP.
