# add-onboarding-and-auth-blocks

**Type:** Regular change (UI / primitives + blocks)
**Created:** 2026-06-18
**Plan:** `openspec/planning/figma-grounded-ui-reconciliation.md` — Phase 0, change #5 (final Phase-0)
**Capability:** `ui` (extends the primitive + block vocabulary in `openspec/specs/ui/spec.md`)
**Depends on:** `reconcile-design-tokens-from-figma`, `add-missing-primitives` (archived).

## Why

The dashboard-onboarding and auth/gig-apply screens compose from five pieces (`docs/figma-screens-export.md` §1)
the kit either lacks or renders ad-hoc. As in #4, the rule is **reconcile, don't duplicate** — two of the five
already have a kit equivalent:

| Plan item | Figma | Action | Existing? |
|---|---|---|---|
| OnboardingCard | `3082:3820` | **ADD** (block) — distinct from `BannerCard` | no |
| AuthStepDots | `3179:3997` | **ADD** (primitive) — the dot counter; `StepIndicator` (labeled) diverges from Figma | `StepIndicator` (different) |
| Logomark | `3179:3571` | **ADD** (primitive) — renders the exported `gigly-logo.svg` | asset only |
| TermsTabs | `2860:2413` | **CONFIRM** — already composes the canonical `Tabs`; normalize the segmented-pill to it (no 5th toggle) | `TermsTabs` |
| CoverLetterTextarea | `2860:2430` | **ADD** a generic `Textarea` primitive (the cover-letter is an instance, not a bespoke block) | `Input` (single-line only) |

## Key reconciliation facts

- **OnboardingCard ≠ BannerCard.** `BannerCard` is the big promo (type/display, full-bleed art, primary Button).
  The Figma welcome "pic" is a smaller dashboard tile: `radius/lg`, an `overlay/fill` (plus-lighter) scrim, an
  image that bleeds off the edge, `type/h3` title + `type/body` subtitle, an **inline `ProgressBar`** (existing
  primitive), and a **secondary** `Button`. Genuinely a new block; the bleed image is a residual (optional, like
  BannerCard's art — not redrawn).
- **AuthStepDots vs StepIndicator.** `StepIndicator` (numbered + labelled, created before Figma access; used by
  `RegisterWizard.tsx`) is NOT what the Figma auth screens show — those use a minimal **dot** counter
  (active 8px / inactive 6px, 3 steps, no labels). AuthStepDots is the Figma-authoritative indicator. This change
  ADDS it + catalogs it; the **Phase-1** `reconcile-auth-and-onboarding` swaps `RegisterWizard` onto it.
  `StepIndicator` is flagged **superseded for auth** (kept for now; no consumer churn here).
- **TermsTabs is already canonical.** It composes the `Tabs` primitive and is consumed by `GigDetail.tsx`. The
  Figma gig-apply toggle (`2860:2413`, a `#01030e` segmented pill with a 20%-white active segment) is a
  screen-level one-off; per the mandate it is **normalized to the canonical `Tabs`** — TermsTabs is **NOT**
  changed to a bespoke segmented toggle, and **no 5th toggle treatment is added**. This requirement records the decision.
- **Textarea, not CoverLetterTextarea.** The "multiline input variant" is a generic `Textarea` primitive (sibling
  of `Input`): `overlay/fill` surface, `border/default`, `radius/md`, `items-start`, muted placeholder, multi-row.
  The gig-apply cover letter is just `<Textarea>` — no domain-named bespoke block.

## What

Add `Textarea`, `AuthStepDots`, `Logomark` primitives + `OnboardingCard` block (typed VMs/props, token-pure,
composed from primitives + layout + tokens); confirm + document TermsTabs; catalog every new entry; add render
tests. Logomark renders `public/assets/design-system/brand/gigly-logo.svg` (F4 — exported asset, not redrawn).

## Scope

- **New primitives:** `Textarea.tsx`, `AuthStepDots.tsx`, `Logomark.tsx` (+ exports, token maps if needed).
- **New block:** `OnboardingCard.tsx` (+ VM, fixture, export).
- **Confirmed:** `TermsTabs.tsx` (no code change required beyond a doc note — it already uses `Tabs`).
- **Updated:** `app/workbench/registry.tsx`, `__tests__/unit/components/{ui-primitives,domain-blocks}.test.tsx`.

## Non-goals

- Wiring into screens (Phase 1: `reconcile-auth-and-onboarding`, `reconcile-gig-detail-apply`, `reconcile-dashboards`).
- Migrating `RegisterWizard` off `StepIndicator` (Phase 1) or removing `StepIndicator`.
- Changing `TermsTabs`/`BannerCard` behaviour.
- The absolute F1 ≤1% pixel gate (Phase 2 `refidelity-from-figma-references`); here the bar is token-purity +
  typed APIs + all-states render.

## References

`docs/figma-screens-export.md` §1, `docs/figma-components-export.md`; existing `Input`/`Tabs`/`StepIndicator`/
`ProgressBar`/`Button` primitives, `BannerCard`/`TermsTabs` blocks; assets `public/assets/design-system/brand/gigly-logo.svg`;
catalog `app/workbench/registry.tsx`; tests `__tests__/unit/components/*`.
