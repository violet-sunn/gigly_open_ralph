# Tasks — create-figma-ui-reconciliation-plan

Implementing this change = **analyze + author the planning document**. No production code.
Output file: `openspec/planning/figma-grounded-ui-reconciliation.md` (status PLANNED).

## 1. Analyze project context
- [x] Read `openspec/project.md` (vision, MVP boundaries, stack, current state).
- [x] Read `openspec/specs/planning/spec.md` (required sections) + `openspec/planning/README.md` (format).
- [x] Read the archived `openspec/planning/archive/ui-redesign-integration.md` to capture what the mechanism already provides (tokens/primitives/blocks/layout/composition/workbench/fidelity-harness) and its explicitly-deferred items (F1 ≤1% gate, font licence).
- [x] Read the four Figma import docs as the authoritative source of truth: `docs/figma-tokens-export.json`, `docs/figma-components-export.md`, `docs/figma-screens-export.md`, `docs/figma-component-audit.md`.
- **Test:** notes capture the built-vs-authoritative delta with concrete citations (node-ids, hex values, file paths).

## 2. Identify affected systems, gaps, and dependencies
- [x] **Token layer:** type-scale drift + border/brand mapping bugs (vs committed `scripts/generated-tokens.*`); new surface `--gig-bg #1A1A24`; three-blue inconsistency `#08f`/`#006ccb`/`#4cacff`; three non-token font families (Vremena Grotesk, IBM Plex Sans, Inter); tag/Category hues unbound to tokens (hue↔domain rename risk).
- [x] **Primitive layer (from audit):** IconButton (`button_icon`), specialty tag (`Специальность`), Button `Tetriary` 32px tier + `danger` variant, Filter `expand` axis, Select option `disabled`.
- [x] **Block layer (new sub-atoms from screens):** SectionHeader (`H/H1/BLOCK`), JobExperienceCard, RequirementTile (`требование`), CriteriaRow (`критерий`), OnboardingCard (welcome "pic"), AuthStepDots (`counter`), TermsTabs (gig-apply — reconcile vs any existing), CoverLetterTextarea, Logomark; AttentionCard full per-type styling; settings composites ToggleField/CheckField/SessionRow/FileChip.
- [x] **Screen layer:** the 14 screens with node-ids + their composition specs (`docs/figma-screens-export.md` §2).
- [x] **Dependencies:** token reconciliation precedes primitives/blocks; blocks precede the screens that compose them; fidelity re-gate + generativity proof last. Note the **font web-licence** as an external prerequisite that caps the absolute F1 gate (carry, don't resolve).
- **Test:** every gap maps to exactly one Change; the dependency DAG has no screen before its blocks.

## 3. Create the planning document
- [x] Write `openspec/planning/figma-grounded-ui-reconciliation.md` with all spec-required sections: **Problem, Why This Matters, Scope, Changes, Status** (+ a short "Mandate: reconcile to the system, don't copy" preamble echoing the prior plan's principle, and a "Built vs authoritative" delta table).
- [x] Status = `PLANNED`, creation date `2026-06-17`, progress `0/N`.
- [x] Scope MUST cite concrete Figma node-ids and extracted values (no SVG estimates), and list the four import docs as inputs.
- **Test:** document passes the format scenarios in `openspec/specs/planning/spec.md` (all five sections present; Problem 2–5 sentences; Changes copy-pasteable + dependency-ordered; Status has checkboxes + date).

## 4. Generate the ralphy-plan commands (the Changes section)
Author each as a copy-pasteable `/ralphy-plan <name> "…"` block carrying **requirements + a generativity/zero-off-system-values acceptance check + a test plan + explicit dependencies**, dependency-ordered. Proposed scaffold (implementation refines wording/splits):

**Phase 0 — Close the kit gaps the Figma import surfaced (system additions; correct/extend the existing mechanism)**
- [x] `reconcile-design-tokens-from-figma` — re-sync token engine to `docs/figma-tokens-export.json`; fix type-scale drift + border/brand mapping; add `--gig-bg` surface; **decide** the three-blue reconciliation + the three non-token font families (add family tokens vs licensed substitute) + tag/Category hue↔domain mapping; regenerate `scripts/generated-tokens.*`; token-purity lint stays green. *Dep:* none (corrects design-token-engine).
- [x] `add-missing-primitives` — IconButton, specialty Tag, Button Tetriary(32px)+danger, Filter expand axis, Select option disabled; typed APIs, token-pure, all states. *Dep:* reconcile-design-tokens-from-figma.
- [x] `reconcile-attention-card-and-settings-composites` — AttentionCard full per-type styling (per `figma-components-export.md` table) + ToggleField/CheckField/SessionRow/FileChip. *Dep:* tokens, primitives.
- [x] `add-profile-and-gig-detail-blocks` — SectionHeader (`H/H1/BLOCK`), JobExperienceCard, RequirementTile, CriteriaRow. *Dep:* tokens, primitives.
- [x] `add-onboarding-and-auth-blocks` — OnboardingCard, AuthStepDots, Logomark, TermsTabs, CoverLetterTextarea. *Dep:* tokens, primitives.

**Phase 1 — Reconcile each coded screen to its Figma composition spec (one Change per screen/group, each citing node-id)**
- [x] `reconcile-auth-and-onboarding` — `create account` 3179:3179, `create account/specialist` 3179:3863, `/company` 3195:4564, `welcome/specialist` 3195:4282, `/company` 3195:4704. *Dep:* auth/onboarding blocks.
- [x] `reconcile-profile-screen` — `Профиль/specialist` 2860:2103. *Dep:* profile/gig-detail blocks.
- [x] `reconcile-dashboards` — `Дашборд/specialist` 2860:3751, `/company` 3371:5387 (incl. OnboardingCards + attention strip). *Dep:* attention-card, blocks.
- [x] `reconcile-gig-browse` — `Поиск проектов/specialist` 2860:2056. *Dep:* blocks.
- [x] `reconcile-gig-detail-apply` — `Gig` 2860:2243 (requirements/criteria/files/terms-tabs/cover-letter). *Dep:* profile/gig-detail + auth/onboarding blocks.
- [x] `reconcile-my-projects` — `Мои проекты/specialist` 2860:2192, `/company` 3795:5947. *Dep:* blocks.
- [x] `reconcile-chats` — `Чаты` 2860:4702, 3795:6890. *Dep:* blocks.

**Phase 2 — Re-validate the mechanism against the authoritative source**
- [x] `refidelity-from-figma-references` — recalibrate the fidelity harness to use Figma node screenshots (via MCP `get_screenshot`) as the F1 baseline instead of SVG renders; re-assert the ≤1% gate per reconciled screen (noting the font-licence cap); re-run the **generativity** proof so the mock-less admin screens still compose from the expanded kit with zero off-system values. *Dep:* all of Phase 0 + Phase 1.

- **Test:** the Changes section lists each command with requirements/acceptance/test/deps; ordering respects the DAG; `openspec/planning/figma-grounded-ui-reconciliation.md` validates against the planning spec.

## 5. Summarize
- [x] Report the created planning-document path and the next command to run (`/ralphy-implement create-figma-ui-reconciliation-plan`), then the first Change to execute (`reconcile-design-tokens-from-figma`).
