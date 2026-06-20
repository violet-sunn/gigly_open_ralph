# Spec delta — ui (add-profile-and-gig-detail-blocks)

Adds SectionHeader, JobExperienceCard, and a CriteriaRow item; reconciles RequirementCard + CriteriaList to
their Figma presentations. All token-pure, composed from primitives + layout + tokens.

## ADDED Requirements

### Requirement: SectionHeader Block
A `SectionHeader` block MUST exist, modelling Figma `H/H1/BLOCK` (`3371:5248`): the «БЛОК» section heading —
a `type/h1` (24px, mono) title with an optional trailing icon and an optional count. It MUST be token-pure,
and the hand-rolled section headings in `TagList`, `CategoryTags`, and `ExperienceList` MUST adopt it.

#### Scenario: Renders the title at the h1 (24 mono) role
- GIVEN `<SectionHeader title="Стек">`
- WHEN it renders
- THEN the title MUST use `text-h1 font-h1` (Figma H2 = 24px, the mono family) — NOT `text-h2` (18 sans)
- AND the file MUST be token-pure (no raw hex/px)

#### Scenario: Optional trailing icon and count
- GIVEN `<SectionHeader title="Стек" icon={ICON.gear} count={5}>`
- WHEN it renders
- THEN a trailing icon MUST render when `icon` is set, and a count when `count` is set
- AND when neither is set, only the title renders

#### Scenario: Hand-rolled headings adopt SectionHeader
- GIVEN `TagList`, `CategoryTags`, `ExperienceList` (which rendered section titles as `text-h2 font-h2`)
- WHEN they are inspected after the change
- THEN each MUST render its section title via `SectionHeader` (no bespoke heading span)

---

### Requirement: JobExperienceCard Block
A `JobExperienceCard` block MUST exist, modelling Figma `job experience` (`3088:3896`): a `border/default`
(frame-stroke) card with company + period, a role line, and a description. `ExperienceList` MUST compose it
instead of inlining the entry. It MUST be token-pure and declare a typed view-model.

#### Scenario: Renders company, period, role, description
- GIVEN `<JobExperienceCard>` with company, period, title (role), description
- WHEN it renders
- THEN it MUST show the company, the period (muted), the role line, and the description (muted body)
- AND the role-line colour MUST be `text-brand-default` (RC-S1 — `#006ccb` normalised to brand/default), not a raw hex

#### Scenario: ExperienceList composes JobExperienceCard
- GIVEN `ExperienceList` with experience entries
- WHEN it renders
- THEN each entry MUST be a `JobExperienceCard` (not inlined markup)
- AND the token-purity lint MUST report zero new off-token literals

---

### Requirement: CriteriaRow Item
A `CriteriaRow` item component MUST exist, modelling Figma `критерий` (`2932:7224`): a numbered left block in
the brand accent + an on-accent digit + a title + optional description. It MUST be token-pure and is the item
`CriteriaList` maps over (NOT a parallel list block).

#### Scenario: Numbered row with on-accent digit
- GIVEN `<CriteriaRow index={1} title="Data Fetching" description="…">`
- WHEN it renders
- THEN the number block MUST use `bg-brand-default` with the digit in `text-surface-level-0` (on-accent dark)
- AND it MUST show the title (strong) and the description (muted) when present
- AND it MUST be token-pure (no raw hex/px)

---

## MODIFIED Requirements

### Requirement: RequirementCard Block
`RequirementCard` MUST render the Figma `требование` tile (`2932:7177`): a `border/default` (frame-stroke)
hairline card at `radius/md`, a `justify-between` column with a minimum height, an 18px (sans) title and a
14px muted description. It MUST be token-pure and keep `RequirementCardVM` (so `GigDetail.tsx` is unaffected).

#### Scenario: Renders as a frame-stroke tile
- GIVEN `<RequirementCard>` with a title and body
- WHEN it renders
- THEN the container MUST use `border-overlay-line-strong` (frame-stroke) at `radius/md`
- AND the title MUST be `text-h2 font-h2` (18 sans) and the body `text-body font-body text-muted`
- AND the layout MUST be a `justify-between` column with a minimum height
- AND the file MUST be token-pure

#### Scenario: View-model unchanged
- GIVEN the existing `RequirementCardVM` (title, body, optional icon)
- WHEN `GigDetail.tsx` renders RequirementCards
- THEN it MUST continue to compile and render without VM changes

---

### Requirement: CriteriaList Block
`CriteriaList` MUST render the Figma `критерии успеха` list (`критерий` rows `2932:7224`) as **numbered**
`CriteriaRow` items (title + optional description), replacing the prior met/unmet checklist. The VM item MUST
gain an optional `description`; `met` becomes optional and back-compatible so `GigDetail.tsx` still compiles.

#### Scenario: Renders numbered CriteriaRow items
- GIVEN `<CriteriaList>` with N items
- WHEN it renders
- THEN it MUST render N `CriteriaRow` items numbered 1..N
- AND each MUST show its label as the title (+ description when present)
- AND the file MUST be token-pure

#### Scenario: Back-compatible VM
- GIVEN the prior `CriteriaListVM` items (`{ label, met? }`)
- WHEN `GigDetail.tsx` renders the list
- THEN it MUST continue to compile (a `description?` is additive; `met?` is now ignored/optional)

---

## ADDED Requirements

### Requirement: Profile/Gig-detail Blocks Catalogued and Tested
Every block added or reconciled by this change MUST appear in the workbench catalog with its states, MUST have
render tests, and MUST keep the suite + lints green.

#### Scenario: Workbench + tests
- GIVEN `app/workbench/registry.tsx` and `__tests__/unit/components/domain-blocks.test.tsx`
- WHEN the catalog renders and `npm run test:unit`, `npm run lint:tokens`, `npm run build` run
- THEN the catalog MUST include `SectionHeader`, `JobExperienceCard`, the reconciled `RequirementCard` tile,
  and the reconciled numbered `CriteriaList`
- AND the new/updated render tests MUST pass, the token-purity lint MUST report no new off-token literals,
  and the build MUST pass
