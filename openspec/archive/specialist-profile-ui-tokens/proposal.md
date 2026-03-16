# Proposal: Apply UI Design Tokens to Specialist Profile (Pilot)

## Summary
This change introduces a **token-driven, Figma-aligned UI** for the **Specialist profile page** as a pilot to prove that `openspec/specs/ui/design-tokens.json` can be translated into production UI consistently.

The implementation target is the authenticated Specialist profile view at:
- `/(protected)/profile` (route: `/profile`)

The pilot focuses on:
- wiring the semantic tokens into the runtime styling system (CSS variables + Tailwind usage), and
- updating the Specialist profile view to match the Figma reference screen (node `4032:464`).

## Motivation
- `openspec/specs/ui/design-tokens.json` is intended to be the single source of truth for UI semantics.
- The Specialist profile page is a contained surface with clear layout primitives (card, pills, stats row, editable sections).
- A successful pilot provides a repeatable approach to migrate other pages without ad-hoc colors/typography.

## User Story
As a Specialist, I want my profile page to feel premium and consistent with the design system, so that it communicates trust and quality.

## Scope
### In scope
- Introduce a **token → CSS variable** mapping strategy for the subset of tokens needed by the Specialist profile page.
- Ensure the following semantic tokens are available as CSS variables and used by the page:
  - Background surfaces: `color-semantic.bg.surface.level-0/1/2`
  - Text: `color-semantic.text.neutral.strong/weak/inverted`, `color-semantic.text.brand.default`
  - Border: `color-semantic.border.neutral.weak/strong`, `color-semantic.border.brand.default`
  - Gradient: `gradient.gradient` (linear gradient used by the profile hero card)
  - Typography: `font.typography.headline.*`, `font.typography.body.*` as used by the page
- Update the Specialist profile view UI to match the Figma layout primitives **without introducing new product functionality**:
  - hero/profile section with brand border + subtle gradient
  - large rounded avatar (image placeholder supported)
  - name + role pill
  - stats pill row (rating, completed tasks, repeat orders) computed from existing data when possible
  - content card(s) for “Опыт работы” with an in-block “Редактировать” affordance

**Functionality guardrails (anti-regression):**
- The pilot MUST NOT add new controls that do not already exist in the `/profile` experience (e.g. the Figma “Поделиться профилем” button MUST NOT be added).
- Any in-block “Редактировать/Добавить” affordance MUST route to the existing `/profile/edit` page (no inline editing, no new edit routes).
- Existing Specialist general information editing (displayName, techStack, experienceLevel, bio) MUST remain available and unchanged in behavior.

### Out of scope (non-goals)
- Rebuilding the entire navigation header or other pages to the new token system.
- Implementing real rating / stats data (may remain static/placeholder; this change only defines layout).
- Implementing portfolio/projects blocks beyond what is needed to validate token usage on the page.
- Introducing a new CSS framework (Tailwind remains).

## Constraints
- The project uses **Next.js App Router + Tailwind CSS**.
- Avoid large-scale refactors: only update the Specialist profile view and the minimal token plumbing required.
- Token source is `openspec/specs/ui/design-tokens.json`.

## Risks / Open Issues
### Missing referenced primitives in token file
`design-tokens.json` references `color-primitives.light.blue.800/900` from `color-semantic.border.brand.*`, but `color-primitives.light` is not present (only `color-primitives.dark`).

This change therefore includes adding the missing primitives (or rewriting the references) so that token resolution is deterministic.

## Rollout
- Land the token plumbing + Specialist profile UI update behind normal routing (no feature flag).
- If later pages adopt tokens, they MUST use the same CSS variable naming scheme introduced here.
