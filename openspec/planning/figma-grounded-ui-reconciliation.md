# Figma-Grounded UI Reconciliation

**Created:** 2026-06-17
**Status:** PLANNED
**Predecessor:** `openspec/planning/archive/ui-redesign-integration.md` (COMPLETE, 29/29) — built the mechanism from lossy SVGs; this iteration reconciles it to authoritative Figma data.

## Mandate: reconcile to the system, don't copy screens

The mechanism already exists. The prior plan built the layered engine (tokens → primitives → blocks → layout grammar → composition → workbench → fidelity gate) and composed every screen. **This is not a rebuild.** It is the *reconciliation pass* that plan was waiting for — it **extends and corrects** the existing kit so the built UI matches the now-authoritative Figma source.

The same two principles carry over: **(1)** the *system* is the source of truth, not any single screen — a deliberate divergence becomes a system **variant**, an accidental one is normalized and flagged to the designer; **(2)** the mechanism stays a mechanism — every reconciled screen composes from the kit (`Template + Blocks + data`), and the **generativity** proof (mock-less admin screens, zero off-system values) must still pass against the *expanded* kit. If it doesn't, the fix is in the **system**, not the screen.

## Problem

The prior `ui-redesign-integration` mechanism was grounded in **lossy inputs** — the `/screens/*.svg` extraction, where fonts were **outlined to paths** (unrecoverable), semantic token *names* were absent, geometry was *measured/estimated* from SVG coordinates, and the **F1 ≤1% pixel gate was deferred** (the shell-cutover diff sat at ~9.8%, dominated by the substitute font and uncomposed bodies). That plan itself named "Figma Dev Mode + a fresh token JSON" as the refinement needed to attach semantic names and cross-check geometry, and flagged **fonts/licence** + a **locked design** as hard blockers. The result: a working, coherent kit that still drifts from the real design — the visible "hickups."

Those blockers are now resolved. Authoritative data was imported straight from Figma (file `gl9wHy8VGJQTmNuQZNukqg`, Pro seat) via the official MCP and persisted in the repo (`docs/figma-tokens-export.json`, `docs/figma-components-export.md`, `docs/figma-screens-export.md`, `docs/figma-component-audit.md`). It exposes concrete divergences — token drift, three non-token font families, a three-way blue inconsistency, a new surface value, unbound tag/category hues, **nine sub-atoms the SVG extraction never surfaced**, several missing primitives, and per-screen composition deltas across all 14 screens — that must be closed for the UI to become logically and visually faithful and for the deferred fidelity gate to finally be met.

## Why This Matters

From `project.md`, "Professional B2B Experience" and "Quality Over Quantity" demand a UI that is both exact *and* coherent. The mechanism delivered coherence; this iteration delivers **exactness against the real design** instead of against an estimate of it. Closing the token/font/colour gaps makes the deferred F1 gate reachable per-screen; adding the nine missing blocks and the audit's missing primitives removes the ad-hoc styling that currently re-introduces drift; and re-grounding the fidelity baseline on Figma screenshots (not SVG renders) turns "looks close" into a measured, defensible result. The trust signals the design encodes (ratings, verification, clear status, structured gig detail) then render faithfully, supporting Organic Retention, Core-Loop Completion, and Time-to-Hire.

## Built vs. authoritative — the delta this plan closes

| Layer | Built (from SVGs / fixtures) | Authoritative (from Figma import) | Gap to close |
|---|---|---|---|
| Tokens | `scripts/generated-tokens.*` from estimated SVG fills; legacy values | `docs/figma-tokens-export.json` w/ semantic names | type-scale drift, border/brand mapping bugs, missing `--gig-bg #1A1A24` |
| Colour | brand `#0088ff`, highlight `#4cacff` | + role/specialty `#006ccb` (job-experience) | **three blues** to reconcile to one scale |
| Type | SF Compact + NKDy Mono substitutes | + **Vremena Grotesk**, **IBM Plex Sans**, **Inter** (emoji) | 3 non-token families — add tokens or licensed substitute |
| Tags | kit re-keys hues by domain (marketing/design/…) | Figma hues are **raw hex, unbound to tokens** | pin hue↔domain mapping w/ designer |
| Primitives | Button/Filter/Select/StatusBadge/… | audit: missing IconButton, specialty tag, Button Tetriary(32)+danger, Filter expand, Select disabled | add 5 primitives/axes |
| Blocks | GigCard, ProfileCard, ChatPanel, … | + 9 new sub-atoms + full attention-card + 4 settings composites | add ~14 blocks/variants |
| Screens | composed from fixtures, F1 deferred | 14 screens w/ exact node-ids + composition specs | reconcile each to its node-id, meet F1 |

## Scope

### Inputs analyzed (authoritative)

- **`docs/figma-tokens-export.json`** — token SSOT with real semantic names (revealed type-scale drift + border/brand mapping bugs vs the committed generated tokens).
- **`docs/figma-components-export.md`** — 18/18 composites with token-mapped specs, the full per-type **attention-card** map (purple `#7c3aed` / blue `#2563eb` / orange `#ea580c` / green `#16a34a` / gray `#9ca3af` / cyan `#0891b2`), and the 5 previously-blocked composites (toggle field `3138:3199`, check field `3138:3148`, session `3149:2645`, file `3600:5262`, attention-card styling `3367:3916`).
- **`docs/figma-screens-export.md`** — all 14 screens as composition specs + the 9 new sub-atoms (SectionHeader `3371:5248`, JobExperienceCard `3088:3896`, RequirementTile `2932:7177`, CriteriaRow `2932:7224`, OnboardingCard `3082:3820`, AuthStepDots `3179:3997`, TermsTabs `2860:2413`, CoverLetterTextarea `2860:2430`, Logomark `3179:3571`).
- **`docs/figma-component-audit.md`** — atomic-primitives ↔ coded-kit gap audit (missing primitives + the tag/Category hue↔domain rename risk).
- `openspec/project.md`, the archived `ui-redesign-integration.md`, and the existing `app/components/{primitives,blocks,layout}` + `templates/AppShell.tsx` kit.

### Affected systems

- **Token layer** — `openspec/specs/ui/design-tokens.json` (or its successor), `scripts/parse-design-tokens.js` / `scripts/generated-tokens.*`, `tailwind.config.ts`, the token-purity lint.
- **Primitive layer** — `app/components/primitives/*` + `tokens.ts` variant maps.
- **Block layer** — `app/components/blocks/*` + the component-workbench catalog + fixtures.
- **Screen layer** — the composed routes under `app/(protected)/*` and `app/auth/*`.
- **Fidelity layer** — the `fidelity-harness` baselines + the generativity check.

### Screen → node-id → blocks (reconciliation targets)

| Screen | node-id | Role | Composes from |
|---|---|---|---|
| create account (role select) | `3179:3179` | both | Logomark + AuthStepDots + roleplay ×2 |
| create account/specialist | `3179:3863` | spec | Logomark + AuthStepDots + Input ×3 + Button ×2 |
| create account/company | `3195:4564` | co | Logomark + AuthStepDots + Input ×3 + Button ×2 |
| welcome/specialist | `3195:4282` | spec | AuthStepDots + Input + Select ×2 + Button ×2 |
| welcome/company | `3195:4704` | co | AuthStepDots + Input + Select ×2 + Button ×2 |
| Профиль/specialist | `2860:2103` | spec | AppShell + SectionHeader + Tag/Category + JobExperienceCard ×2 + GigCard |
| Дашборд/specialist | `2860:3751` | spec | AppShell + OnboardingCard ×2 + GigCard·grid + Message·feed + AttentionCard ×6 |
| Дашборд/company | `3371:5387` | co | AppShell + OnboardingCard ×2 + Menu-switcher + GigCard·feed + Message·feed |
| Поиск проектов | `2860:2056` | spec | AppShell + SectionHeader + switcher + GigCard·grid ×6 |
| Gig (detail+apply) | `2860:2243` | both | AppShell + SectionHeader + RequirementTile ×3 + CriteriaRow ×3 + FileChip ×4 + TermsTabs + CoverLetterTextarea + ApplyPanel + ChatPanel |
| Мои проекты/specialist | `2860:2192` | spec | AppShell + Menu-switcher + GigCard·2col |
| Мои проекты/company | `3795:5947` | co | AppShell + Menu-switcher + GigCard·2col |
| Чаты | `2860:4702`, `3795:6890` | both | AppShell + ConversationItem·list + bio + MessageBubble·thread + Composer |

### Dependencies & ordering

- **Phase 0 (system additions)** corrects/extends the existing mechanism: token re-sync first, then primitives + blocks (which depend on tokens).
- **Phase 1 (screen reconciliation)** — each screen depends on the Phase-0 blocks it composes; no screen before its blocks.
- **Phase 2 (re-validation)** — depends on all of Phase 0 + Phase 1.

### Risks & unknowns

- **Font web-licence** (SF Compact + the three non-token families) remains an **external prerequisite** that caps the absolute F1 ≤1% gate — carried as a noted dependency, not resolved here.
- **tag/Category hue↔domain mapping** has no source-of-truth variable (hues are raw hex) — needs a designer decision; until then the mapping is a flagged assumption.
- DOM restructure on reconciled screens risks the ~860-test suite — mitigate by preserving `data-testid`/ARIA and stable action/form signatures (same discipline as the prior plan's high-friction screens).

### Out of scope / non-goals

- Rebuilding the mechanism (it exists). Re-importing Figma (complete). Authoring the design. Real payment/escrow. Mobile/responsive (desktop 1440px). Resolving the font licence.

## Changes

> Run each with `/ralphy-plan <name> "…"` then `/ralphy-implement <name>`, in order. Every change is complete only when it passes the inherited **Fidelity DoD (F1–F5)** from the predecessor plan; the mechanism stays valid only while the **generativity** proof passes against the expanded kit.

### Phase 0 — Close the kit gaps the Figma import surfaced

#### 1. reconcile-design-tokens-from-figma
```bash
/ralphy-plan reconcile-design-tokens-from-figma "Re-sync the semantic token layer to the AUTHORITATIVE Figma export (docs/figma-tokens-export.json), correcting the SVG-estimated values. Requirements: (1) diff the export against scripts/generated-tokens.* and fix the type-scale drift + border/brand mapping bugs, (2) add the new surface token for --gig-bg #1A1A24, (3) DECIDE and encode the three-blue reconciliation (#0088ff brand vs #006ccb role/specialty vs #4cacff highlight) — collapse to a documented scale or sanction distinct semantic tokens, (4) DECIDE the three non-token font families (Vremena Grotesk, IBM Plex Sans, Inter) — add family tokens or a licensed substitute + measured deltas, (5) pin the tag/Category hue↔domain mapping (hues are raw hex, unbound) in a reconciliation note, (6) regenerate Tailwind config + CSS vars, keep the legacy-name shim. Test: parser clean; build passes; token-purity lint stays green and fails on a planted off-token literal; unit suite green; reconciliation note records every decision (friction: medium). Depends on: none (corrects design-token-engine)."
```
*Why:* the substrate everything else references; fixes the drift that makes screens look "off." *Friction:* medium.

#### 2. add-missing-primitives
```bash
/ralphy-plan add-missing-primitives "Add the primitives/axes the component audit flagged as missing (docs/figma-component-audit.md). Requirements: (1) IconButton from button_icon (40×40, radius/sm, icon 20, bg:no|yes, Default/Hover/Active, optional counter badge) — refactor ad-hoc icon buttons to it, (2) specialty Tag from Специальность (white chip, brand-blue NKDuy Mono, S/XS), (3) Button Tetriary 32px size tier + danger variant (red-tint destructive, per session delete), (4) Filter expand axis (group expand/collapse), (5) Select option disabled state. All typed variant/state props, token-pure, every state from the source. Test: each renders all states and passes the Fidelity DoD vs its Figma node crop; typed APIs reject off-system values; render tests pass (friction: medium). Depends on: reconcile-design-tokens-from-figma."
```
*Friction:* medium.

#### 3. reconcile-attention-card-and-settings-composites
```bash
/ralphy-plan reconcile-attention-card-and-settings-composites "Build/repair the notification + settings composites from docs/figma-components-export.md. Requirements: (1) AttentionCard with the full per-type accent map (Смена статуса #7c3aed, Новое сообщение #2563eb, Приближается дедлайн #ea580c, Заявка принята #16a34a, Заявка отклонена #9ca3af, Получена оплата #0891b2) driving marker/inset-4px-border/glow, with the embedded gig/message block keeping its OWN gig-status glow, (2) ToggleField, CheckField (radio-list), SessionRow (Default/active/delete with danger button), FileChip — each token-pure from primitives. Test: each passes the Fidelity DoD vs its node; the per-type map is data-driven (no per-variant copies); render tests pass (friction: medium). Depends on: reconcile-design-tokens-from-figma, add-missing-primitives."
```
*Friction:* medium.

#### 4. add-profile-and-gig-detail-blocks
```bash
/ralphy-plan add-profile-and-gig-detail-blocks "Add the blocks the profile + gig-detail screens compose from (docs/figma-screens-export.md §1). Requirements: (1) SectionHeader from H/H1/BLOCK (3371:5248 — type/h2 NKDuy Mono 24, optional trailing icon + count) — adopt it for all БЛОК headings, (2) JobExperienceCard (3088:3896 — frame-stroke border, role text resolved against the three-blue decision), (3) RequirementTile (2932:7177 — IBM Plex Sans, h120, justify-between), (4) CriteriaRow (2932:7224 — numbered, left accent block on --color, --color-2 on-accent text). Each typed view-model + fixtures, primitives+tokens only. Test: each passes the Fidelity DoD vs its node from fixtures; contracts typed; render tests pass (friction: medium). Depends on: reconcile-design-tokens-from-figma, add-missing-primitives."
```
*Friction:* medium.

#### 5. add-onboarding-and-auth-blocks
```bash
/ralphy-plan add-onboarding-and-auth-blocks "Add the dashboard-onboarding + auth/apply blocks (docs/figma-screens-export.md §1). Requirements: (1) OnboardingCard from the welcome 'pic' (3082:3820 — radius/lg, plus-lighter scrim, image bleed w/ color-dodge, type/h3 + body, inline ProgressBar, secondary Button), (2) AuthStepDots from counter (3179:3997 — active 8×8 #08f / inactive 6×6, 3 steps), (3) Logomark (3179:3571 — 75×75 asset + wordmark lockup), (4) TermsTabs from the gig-apply toggle (2860:2413 — reconcile against any existing tab treatment; do NOT add a 5th bespoke toggle), (5) CoverLetterTextarea (2860:2430 — multiline input variant). Test: each passes the Fidelity DoD vs its node; TermsTabs reuses the canonical tab variant or is justified as a sanctioned variant; render tests pass (friction: medium). Depends on: reconcile-design-tokens-from-figma, add-missing-primitives."
```
*Friction:* medium.

### Phase 1 — Reconcile each coded screen to its Figma composition spec

#### 6. reconcile-auth-and-onboarding
```bash
/ralphy-plan reconcile-auth-and-onboarding "Reconcile the 5 auth/onboarding screens to their Figma nodes. Requirements: compose create-account-role-select (3179:3179: Logomark + AuthStepDots + roleplay×2), create-account/specialist (3179:3863) + /company (3195:4564) (Logomark + AuthStepDots + Input×3 + Button×2), welcome/specialist (3195:4282) + /company (3195:4704) (AuthStepDots + Input + Select×2 + Button×2); 3-step counter parity; preserve loginUser/registerUser + validation + role preselect. Test: Fidelity DoD (F1 vs each node, F3 steps/fields, F5 composition-pure); register→dashboard; auth E2E green (friction: medium-high). Depends on: add-onboarding-and-auth-blocks."
```

#### 7. reconcile-profile-screen
```bash
/ralphy-plan reconcile-profile-screen "Reconcile /profile to Профиль/specialist (2860:2103). Requirements: AppShell + ID block (avatar + status pill + name + specialty tag + verify + member-since) + 2-col BLOCK (SectionHeader + Tag·stack | SectionHeader + Category + JobExperienceCard×2 + GigCard feed); honor the 'статистика → на стадии разработки' placeholder. Test: Fidelity DoD (F1 vs node, F3, F5); profile data + edit flow work; tests green (friction: medium). Depends on: add-profile-and-gig-detail-blocks."
```

#### 8. reconcile-dashboards
```bash
/ralphy-plan reconcile-dashboards "Reconcile /dashboard for both roles (specialist 2860:3751, company 3371:5387). Requirements: AppShell + WELCOME (greeting + OnboardingCard×2) + BOARD (Активные задачи GigCard feed + Сообщения Message feed; company adds Menu-switcher tabs + 'Найти новый проект') + the 6× AttentionCard strip (shown for specialist; company variant hidden by default per mock). Test: Fidelity DoD (F1 vs each node, F3 tabs/counts, F5); live data binds; tests green (friction: high). Depends on: reconcile-attention-card-and-settings-composites, add-onboarding-and-auth-blocks, add-profile-and-gig-detail-blocks."
```

#### 9. reconcile-gig-browse
```bash
/ralphy-plan reconcile-gig-browse "Reconcile /gigs to Поиск проектов/specialist (2860:2056). Requirements: AppShell + Header (SectionHeader + switcher grid/list) + GigCard·grid ×6 (full status set); preserve filters/search/pagination. Test: Fidelity DoD (F1 vs node, both layouts, F5); search/filter/pagination parity (friction: high). Depends on: add-profile-and-gig-detail-blocks."
```

#### 10. reconcile-gig-detail-apply
```bash
/ralphy-plan reconcile-gig-detail-apply "Reconcile /gigs/[id] to Gig (2860:2243). Requirements: AppShell + col1 (heading + Tag×3 + description + SectionHeader + RequirementTile×3 + CriteriaRow×3 + FileChip×4) + col2 CONDITIONS (company bio + TermsTabs + срок/бюджет + CoverLetterTextarea + ApplyPanel + ChatPanel/MESSAGE thread + Input composer). Map to acceptanceCriteria/goal/deliverables/constraints + structured application fields. Test: Fidelity DoD (F1 vs node, F3, F5); apply works; owner sees applications; lifecycle actions unchanged (friction: high). Depends on: add-profile-and-gig-detail-blocks, add-onboarding-and-auth-blocks."
```

#### 11. reconcile-my-projects
```bash
/ralphy-plan reconcile-my-projects "Reconcile the my-projects views (specialist 2860:2192, company 3795:5947). Requirements: AppShell + Menu-switcher tab strip + Проекты 2-col GigCard grid (mixed active/compact variants per role). Test: Fidelity DoD (F1 vs each node, F3 tabs, F5); tab + data parity; tests green (friction: medium). Depends on: add-profile-and-gig-detail-blocks."
```

#### 12. reconcile-chats
```bash
/ralphy-plan reconcile-chats "Reconcile the chat screens (2860:4702, 3795:6890). Requirements: AppShell + chatlist (HEADER + ConversationItem×N) + chat pane (bio header w/ rating+specialty + MessageBubble thread L/R + date separators + Input composer). Reuse the Message model; keep per-gig messaging intact. Test: Fidelity DoD (F1 vs node, F3 list+thread, F5); inbox + thread + send work (friction: medium). Depends on: add-profile-and-gig-detail-blocks."
```

### Phase 2 — Re-validate against the authoritative source

#### 13. refidelity-from-figma-references
```bash
/ralphy-plan refidelity-from-figma-references "Re-ground the fidelity gate on Figma, not SVG renders. Requirements: (1) capture Figma node screenshots (MCP get_screenshot) as the F1 baseline for every reconciled screen + component, (2) recalibrate the ≤1% threshold + dynamic-region masking, (3) re-assert F1 per reconciled surface (noting the font-licence cap where it still applies), (4) RE-RUN the generativity proof — the mock-less admin screens (/admin, /admin/users, /admin/gigs) must still compose from the EXPANDED kit with zero off-system values; any new gap is logged back to the design-system spec. Test: passes a known-good control; fails an injected offset + a planted off-token value; generativity asserts zero off-system values across admin (friction: medium). Depends on: all of Phase 0 + Phase 1."
```

## Status

**Phase 0 — Close the kit gaps**
- [x] reconcile-design-tokens-from-figma
- [x] add-missing-primitives
- [ ] reconcile-attention-card-and-settings-composites
- [ ] add-profile-and-gig-detail-blocks
- [ ] add-onboarding-and-auth-blocks

**Phase 1 — Reconcile screens**
- [ ] reconcile-auth-and-onboarding
- [ ] reconcile-profile-screen
- [ ] reconcile-dashboards
- [ ] reconcile-gig-browse
- [ ] reconcile-gig-detail-apply
- [ ] reconcile-my-projects
- [ ] reconcile-chats

**Phase 2 — Re-validate**
- [ ] refidelity-from-figma-references

**Progress:** 2/13 changes completed
**Started:** 2026-06-17 — reconcile-design-tokens-from-figma (also committed the uncommitted §10 token reconcile + fixed the stale typography anchor test); add-missing-primitives (IconButton, SpecialtyTag, Button sm+danger, FilterGroup, Select option-disabled; +surface/inverse token; refactored 4 gear edit buttons)
**Completed:** Not completed
