# Change Proposal: derive-design-system

> Phase 0, change 2 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`).
> It consumes the **raw observed** substrate produced by `extract-svg-tokens-and-assets`
> (`docs/DESIGN_SPECS.md` + the asset library) and turns it into the **canonical design system** — the
> blueprint every later phase (`design-token-engine`, `layout-grammar`, `ui-primitives`, `domain-blocks`,
> the screen compositions) implements against. Like its predecessor, it is **paper/analysis over artifacts
> we already hold** (the SVGs, the extracted specs, the 12 screen JPGs): it writes no application code and
> is **not** gated on the Figma design lock (the lock caps *pixel fidelity*, not *paper normalization*).

## Problem Statement

The redesign arrived as 13 desktop mockups + a two-part vector component library (`screens/tokens.svg`,
`screens/frames.svg`). `extract-svg-tokens-and-assets` already pulled the **measured substrate** out of those
SVGs into `docs/DESIGN_SPECS.md`: ~22 observed colour fills (with near-duplicate pairs left as-found), 13
corner radii spanning 2–18px, per-component geometry, and a component inventory — all explicitly **raw and
un-normalized**, because collapsing them into canonical scales and naming them is *this* change's job.

But raw observed values are not a system. As they stand they contain:

- **Near-duplicates that must be reconciled** — two greens (`#10b981`/`#0cc671`), two reds
  (`#ef4444`/`#ff383c`), and several blues (`#0088ff`/`#4cacff`/`#0077e6`/`#1379f3`/`#0099ff`); 13 radii where
  a handful (2/2.5/3/3.5, 11/12/13) are clearly the same intended step measured slightly differently.
- **No spacing or type scale yet** — spacing exists only scattered through geometry (12px insets, 40px control
  height / nav pitch) and the screens show one-off gaps (17/20/21/24/30/47px); type is entirely **outlined to
  paths** in the SVGs, so its *scale* must be defined here and its *exact font metrics* carried forward as a
  flagged dependency.
- **No taxonomy, vocabulary, grammar, or contracts** — there is an inventory of components but no semantic
  token names, no variant/state matrices, no layout grammar, no per-block data contracts.

The core risk this change defuses is the one that produced the previous "parody": **treating the screens as
the spec.** The 13 screens are *samples of an intended system*, not the system itself. Rebuilt screen-by-screen
they share nothing reusable and decay into the next bespoke dead-end. The mandate (from the planning doc) is to
**reverse-engineer the system, reconcile the screens against it, and treat the screens as regression
instances** — a deliberate divergence becomes a system **variant**; an accidental inconsistency is **normalized
to the system and logged**. Without this blueprint, `design-token-engine` has no taxonomy to shape its JSON to,
`ui-primitives`/`domain-blocks` have no variant matrices or contracts to build against, and every later change
re-derives structure by eye.

## Proposed Solution

Reverse-engineer the canonical Gigly design system from the extracted substrate + the library + the screens,
and record it as a single source of truth: **`docs/DESIGN_SYSTEM_SPEC.md`**, accompanied by a **reconciliation
log** (every screen/library deviation → its resolution) and a **coverage matrix** (proof that nothing is left
unaccounted). Six deliverables:

1. **Canonical scales (normalize + reconcile).** Collapse the raw observed values from `docs/DESIGN_SPECS.md`
   into canonical **colour**, **radius**, **spacing**, and **type** scales. Reconcile near-duplicates to one
   canonical step; promote genuine, intentional differences to named **variants**; derive the spacing scale
   from the measured geometry + observed one-offs onto a regular base grid; define the type scale's role/size/
   weight/line-height structure (exact font files + metrics remain a flagged residual resolved in
   `typography-system`). Every raw value is either mapped to a canonical token or recorded as a variant — none
   silently dropped.
2. **Semantic token taxonomy.** Define the token namespaces and naming convention
   (`surface/*`, `text/*`, `border/*`, `brand/*`, `status/*`, `category/*`, `space/*`, `radius/*`, `type/*`,
   `shadow/*`, `z/*`, `opacity/*`, `size/*`) and map every canonical scale value to a semantic name — meaning,
   never a raw hex/px. This is the exact shape `design-token-engine` will serialize into the token JSON.
3. **Component vocabulary + variant/state matrices.** Enumerate the **primitives** (Button, Input,
   PasswordInput, Select, Filter, Tabs, Toggle, Radio, Tag, CategoryTag, StatusBadge/Dot, Avatar, Rating,
   ViewToggle, ProgressBar, SearchInput) and the **blocks** (GigCard, ProfileCard, MessageBubble,
   ConversationItem, NotificationItem, SidebarNav, Topbar, FilterBar, BannerCard, StatPanel, RequirementCard,
   CriteriaList, ClientCard, TermsTabs, ApplyPanel, ChatPanel, MessagesPanel, …), and define each one's
   variant / state / size axes from the states actually present in the library.
4. **Layout grammar + screen-composition pattern.** Define the `AppShell` template (sidebar slot + topbar slot
   + content region; expanded/collapsed) and `AuthLayout`, the regions/slots, the content layout primitives
   (`Stack`, `Grid`, `Split`, `Section`, `Panel`, `Rail`) on the canonical spacing scale, and the composition
   rule: **a screen = Template + slotted Blocks + data bindings — no styling, no layout literals, no raw
   markup.**
5. **Typed block view-model contracts.** For each block, declare the typed **view-model** (the shape of the
   data it needs) so the UI is decoupled from the Prisma schema — the engine is buildable against fixtures
   before Phase 1 models exist, and stable when the schema changes.
6. **The SSOT doc + reconciliation log + coverage matrix.** Assemble all of the above into
   `docs/DESIGN_SYSTEM_SPEC.md`; include a **Reconciliation Log** with an entry per screen/library deviation
   (decision: normalize / make-a-variant / flag-for-designer), and a **System Coverage Matrix** proving every
   library component and every screen maps onto system entities with **no unaccounted one-offs**.

This change **defines only** — it produces documentation. It does not create the machine token source
(`design-token-engine`), does not build React primitives/blocks (`ui-primitives`/`domain-blocks`), and does not
compose screens (Phase 2). It is the contract those changes fulfill.

## Constraints

### MUST Requirements
- Every canonical colour/radius/spacing value MUST trace to the raw observed substrate in
  `docs/DESIGN_SPECS.md` (and through it to a real SVG fill/`rx`/coordinate). Normalization MUST NOT introduce
  values absent from the substrate, and MUST NOT re-source values from the screens by eye or from Figma.
- Every raw observed value (each of the ~22 fills and 13 radii, plus the geometry-derived spacing) MUST be
  **accounted for**: mapped to a canonical token, or explicitly recorded in the reconciliation log as a
  collapsed near-duplicate or a promoted variant. None may be silently dropped.
- Near-duplicate values MUST be reconciled to a single canonical step **unless** the difference is judged a
  genuine, intentional variant — in which case it MUST be a **named system variant**, never a copied special
  case, and MUST carry a reconciliation entry stating why.
- The screens MUST be treated as **samples, not the spec**: where screens disagree with each other or with the
  library, the value MUST be normalized to the canonical scale/variant and the deviation logged. The system —
  not any single screenshot — is authoritative.
- Every **primitive** and **block** MUST declare its variant/state/size matrix from the states **present in
  the library** (per `docs/DESIGN_SPECS.md` §4 and the SVGs) — not invented.
- Every **block** MUST declare a **typed view-model contract** (field names + types) that is independent of the
  Prisma schema.
- `docs/DESIGN_SYSTEM_SPEC.md` MUST be declared the **single source of truth** for the design system and MUST
  contain (or link to) all six deliverables, the reconciliation log, and the coverage matrix.
- The reconciliation log MUST be **complete**: every screen/library deviation has an entry with a resolution.
- The coverage matrix MUST show that **every library component and every screen** maps to system entities with
  **no unaccounted one-offs**.

### SHOULD Requirements
- The type scale SHOULD measure what is measurable from the renders/JPG coordinates (e.g. the 22px auth
  heading already used in `login-page-redesign`) and SHOULD explicitly flag the exact font files/metrics +
  SF Compact web licence as a residual inherited from `docs/DESIGN_SPECS.md` §7 (resolved in
  `typography-system`).
- The taxonomy SHOULD be shaped so `design-token-engine` can serialize it directly (stable namespace names,
  one canonical value per leaf).
- Semantic token *names* MAY be cross-checked against a fresh Figma token export **when available**, but names
  are a refinement — their absence MUST NOT block this change (the system can be named from meaning).
- The system MUST be defined so the **mock-less** screens (admin moderation, Finances, Disputes, Settings) are
  expressible from the vocabulary with no new entity — i.e. the vocabulary is complete enough for the later
  **generativity** proof (`prove-extensibility-admin`). Any entity those screens would need but the library
  lacks SHOULD be recorded as a system gap.
- Analysis/coverage tooling MAY use a throwaway script (e.g. `scripts/design-system/validate-derive-acceptance.js`
  mirroring the predecessor's `validate-acceptance.js`), but it is tooling, not shipped application code.

### Non-Goals
- **No machine token source.** Creating/regenerating `openspec/specs/ui/design-tokens.json` and the Tailwind/
  CSS output is `design-token-engine`. The deleted JSON stays deleted here.
- **No React components, primitives, or blocks** — that is `ui-primitives` / `domain-blocks`. This change
  defines their *matrices and contracts*, not their code.
- **No screen composition** — Phase 2. This change defines the *composition pattern and per-screen map*, not
  the route code.
- **No font embedding/licensing** — flagged residual only; resolved in `typography-system`.
- **No application code, schema, test-suite, or build changes.**
- **No re-extraction.** Raw values come from `docs/DESIGN_SPECS.md` / the SVGs, not re-measured or re-sourced.
- **No authoring/altering the design.** We reverse-engineer the system the screens imply; we do not invent new
  visual design.

## Success Criteria

1. `docs/DESIGN_SYSTEM_SPEC.md` exists, is declared the design-system SSOT, and contains canonical **colour,
   radius, spacing, and type** scales — each value traceable to `docs/DESIGN_SPECS.md`.
2. The semantic **token taxonomy** is defined (namespaces + naming convention) and every canonical scale value
   has a semantic name.
3. The **primitive** and **block** vocabularies are enumerated, each with a variant/state/size matrix grounded
   in the library's actual states.
4. The **layout grammar** (AppShell + AuthLayout templates, regions/slots, layout primitives) and the
   **screen-composition pattern** are defined.
5. Every **block** has a typed **view-model contract**.
6. A **Reconciliation Log** records every screen/library deviation → resolution, and a **System Coverage
   Matrix** maps every library component and every one of the 12 screens onto system entities — with **no
   unaccounted one-offs** and the log **complete**.
7. A spot check confirms: a sampled canonical colour traces to a real fill in the SVGs; a reconciled
   near-duplicate (e.g. one of the green/red/blue pairs) has a logged decision; a sampled library component and
   a sampled screen each resolve to system entities in the coverage matrix.

## Affected Areas

- `docs/DESIGN_SYSTEM_SPEC.md` (new) — the canonical SSOT: scales, taxonomy, vocabulary + matrices, layout
  grammar, view-model contracts, reconciliation log, coverage matrix
- `docs/DESIGN_SPECS.md` (read-only input — the raw observed substrate)
- `screens/tokens.svg`, `screens/frames.svg`, `screens/*.jpg` (read-only inputs — library + sample screens)
- `docs/design-system/reference-renders/` (read-only input — fidelity baselines)
- `openspec/planning/ui-redesign-integration.md` (read-only input — mechanism, block list, screen map)
- `scripts/design-system/` (new, optional throwaway coverage/validation tooling — not shipped app code)
- `openspec/specs/ui/spec.md` (spec delta for the derived-system requirements)

## Risks & Mitigations

**Risk**: Normalization becomes opinionated guesswork (which green is "canonical"?).
**Mitigation**: Reconcile by evidence — prominence (occurrence counts in `docs/DESIGN_SPECS.md`), role
consistency across screens, and proximity (ΔE). Record the rationale in the reconciliation log; where evidence
is genuinely ambiguous, flag it for the designer rather than guessing silently.

**Risk**: Over-collapsing — flattening a genuine variant (e.g. status-blue `#3b82f6` vs brand-blue `#0088ff`)
into one token and losing meaning.
**Mitigation**: The reconcile-don't-copy rule cuts both ways: distinct *roles* stay distinct **variants** even
when colours are close; only same-role near-duplicates collapse. Each collapse/keep decision is logged.

**Risk**: Type scale is under-determined because the SVG text is outlined to paths.
**Mitigation**: Define the type scale's *structure* (roles, relative steps, weights, line-heights) from what is
measurable, and flag exact metrics + the SF Compact licence as a residual forward to `typography-system` —
don't block the system blueprint on the font decision.

**Risk**: The vocabulary is incomplete and a later mock-less screen needs an undefined entity (generativity
fails).
**Mitigation**: Include the mock-less screens (admin/Finances/Disputes/Settings) in the coverage analysis now;
any required-but-missing entity is logged as a system gap to add before Phase 2, not discovered late.

**Risk**: Scope creep into token JSON, components, or screen code.
**Mitigation**: Hard non-goals above; this change emits **documentation only**. The deterministic test plan
guards against `.ts/.tsx`/schema changes and against re-creating the token JSON.

**Risk**: The design later changes (the brief marks it draft).
**Mitigation**: This is paper normalization of the substrate we already hold (consistent with the
already-archived `extract-svg-tokens-and-assets`); if the locked design diverges, the spec is revised. Pixel
fidelity — which the lock truly gates — is a later phase.
