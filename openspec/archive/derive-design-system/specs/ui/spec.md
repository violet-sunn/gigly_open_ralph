# UI Specification Delta: derive-design-system

This document contains specification changes for the `derive-design-system` change.

Scope note: these requirements cover **reverse-engineering the canonical design system** from the raw observed
substrate (`docs/DESIGN_SPECS.md`), the component library (`screens/tokens.svg`, `screens/frames.svg`), and the
12 sample screens (`screens/*.jpg`). They produce **documentation only** — `docs/DESIGN_SYSTEM_SPEC.md` (the
SSOT), a reconciliation log, and a coverage matrix. They do **not** produce the machine token source (that is
`design-token-engine`), React primitives/blocks (`ui-primitives`/`domain-blocks`), or screen code (Phase 2).
The screens are **samples, not the spec**: deviations are normalized to the system and logged.

---

## ADDED Requirements

### Requirement: Canonical Design Scales
The raw observed values in `docs/DESIGN_SPECS.md` (colour palette, radius set) plus spacing and type MUST be
normalized into canonical **colour**, **radius**, **spacing**, and **type** scales in
`docs/DESIGN_SYSTEM_SPEC.md`. Every raw observed value MUST be accounted for — mapped to a canonical step, or
recorded as a reconciled near-duplicate or a promoted variant — and no canonical value may be introduced that
does not trace to the observed substrate.

#### Scenario: Canonical colour scale defined and every observed fill mapped
- GIVEN the ~22 observed fills in `docs/DESIGN_SPECS.md` §2
- WHEN `docs/DESIGN_SYSTEM_SPEC.md` is inspected
- THEN it MUST define a canonical colour scale organized by role family (surface ramp, text/neutral, border,
  brand ramp, the 6-status set, the 5-category set)
- AND every one of the observed fills MUST appear in a mapping (observed hex → canonical token, or → a logged
  reconciliation decision)
- AND every canonical colour MUST be a hex that is grep-findable in `screens/tokens.svg` or `screens/frames.svg`

#### Scenario: Near-duplicate colours are reconciled
- GIVEN the observed near-duplicate pairs/sets — green `#10b981`/`#0cc671`, red `#ef4444`/`#ff383c`, and the
  blues `#0088ff`/`#4cacff`/`#0077e6`/`#1379f3`/`#0099ff`
- WHEN the colour normalization is inspected
- THEN each near-duplicate MUST either collapse to a single canonical step (with the others recorded as
  collapsed) OR be promoted to a distinct named variant with a stated reason
- AND distinct *roles* that happen to be close (e.g. status-blue `#3b82f6` vs brand-blue `#0088ff`) MUST remain
  separate variants rather than being collapsed

#### Scenario: Canonical radius scale defined and every observed rx mapped
- GIVEN the 13 observed radii (2, 2.5, 3, 3.5, 4, 4.5, 5, 8, 11, 12, 13, 16, 18) in `docs/DESIGN_SPECS.md` §3
- WHEN the radius normalization is inspected
- THEN it MUST define a canonical radius scale of fewer, named steps (e.g. xs/sm/md/lg/xl/pill, plus circular
  for avatars)
- AND each observed `rx` MUST map to a canonical step (with snapped values, e.g. 2.5→2 or 11/13→12, recorded)
- AND the dominant component radius (8px → cards/inputs/buttons) and the pill radius (18px) MUST be preserved
  as canonical steps

#### Scenario: Canonical spacing scale derived from measured geometry
- GIVEN the spacing-like measurements in `docs/DESIGN_SPECS.md` §5 (12px insets, 40px control height / nav
  pitch, etc.) and the screen-observed one-offs (17/20/21/24/30/47px)
- WHEN the spacing scale is inspected
- THEN `docs/DESIGN_SYSTEM_SPEC.md` MUST define a canonical spacing scale on a regular base grid (e.g. base-4)
- AND each observed one-off MUST map to a canonical step (e.g. 17→16, 21→20, 47→48) with the snap recorded, or
  be flagged as a genuine value
- AND the standard control height (40px) and standard icon size (16px) MUST be captured as named size tokens

#### Scenario: Type scale and roles defined, exact metrics flagged forward
- GIVEN that the SVG text is outlined to paths (zero `font-family` refs; exact metrics are a residual gap per
  `docs/DESIGN_SPECS.md` §7)
- WHEN the type section is inspected
- THEN it MUST define a canonical type scale as a set of named roles (e.g. display, heading levels, title,
  body, label, caption, mono) with relative size/weight/line-height structure
- AND it MUST name the intended families (SF Compact, NKDy Mono) and MUST flag the exact font files + metrics +
  SF Compact web licence as a residual resolved in `typography-system`
- AND any measurable type fact (e.g. an observed heading px size) SHOULD be recorded with its provenance

#### Scenario: Genuine divergences become variants, not dropped values
- GIVEN a raw observed value that is judged an intentional difference rather than measurement noise
- WHEN it is normalized
- THEN it MUST be promoted to a named system variant in the canonical scale
- AND it MUST NOT be silently discarded nor copied as a screen-specific special case

**Acceptance Criteria:**
- Canonical colour, radius, spacing, and type scales exist in `docs/DESIGN_SYSTEM_SPEC.md`
- Every observed fill and radius is mapped to a canonical token or a logged reconciliation decision
- Near-duplicates are reconciled (collapsed or promoted to named variants); close-but-distinct roles stay separate
- Type roles are defined; exact font metrics/licence flagged forward to `typography-system`

---

### Requirement: Semantic Token Taxonomy
`docs/DESIGN_SYSTEM_SPEC.md` MUST define the semantic token taxonomy — the namespaces, the naming convention,
and the mapping from every canonical scale value to a semantic name — such that tokens reference **meaning**,
never a raw hex/px. This taxonomy is the shape `design-token-engine` will serialize.

#### Scenario: Token namespaces are defined
- GIVEN the change is implemented
- WHEN the taxonomy section is inspected
- THEN it MUST define namespaces covering at least: `surface/*`, `text/*`, `border/*`, `brand/*`, `status/*`,
  `category/*`, `space/*`, `radius/*`, `type/*`, and `shadow/*` (plus `z/*`, `opacity/*`, `size/*` as needed)
- AND it MUST state a consistent naming convention (e.g. `namespace/role[-modifier]`)

#### Scenario: Every canonical value has a semantic name
- GIVEN the canonical scales from the "Canonical Design Scales" requirement
- WHEN the taxonomy mapping is inspected
- THEN every canonical colour, radius, spacing step, and type role MUST have exactly one semantic token name
- AND the 6 gig statuses and 5 categories MUST each map to a named `status/*` and `category/*` token

#### Scenario: Tokens reference meaning, not raw values
- GIVEN the taxonomy
- WHEN a token name is read
- THEN it MUST encode role/meaning (e.g. `surface/level-2`, `text/muted`, `status/in-progress`,
  `radius/md`, `space/4`) rather than the raw value (e.g. not `blue-0088ff`, not `radius-8`)

**Acceptance Criteria:**
- Namespaces and a naming convention are defined
- Every canonical value maps to exactly one semantic name; statuses (6) and categories (5) are named
- Names encode meaning, not raw values; the taxonomy is serializable by `design-token-engine`

---

### Requirement: Component Vocabulary and Variant/State Matrices
`docs/DESIGN_SYSTEM_SPEC.md` MUST enumerate the component vocabulary — **primitives** and **blocks** — and
define each component's variant / state / size axes, grounded in the states actually present in the library
(`docs/DESIGN_SPECS.md` §4 and the SVGs), not invented.

#### Scenario: Primitive vocabulary is defined with matrices
- GIVEN the change is implemented
- WHEN the primitives section is inspected
- THEN it MUST enumerate at least: Button, Input, PasswordInput, Select, Filter, Tabs, Toggle, Radio, Tag,
  CategoryTag, StatusBadge/Dot, Avatar, Rating, ViewToggle, ProgressBar, SearchInput
- AND each primitive MUST declare its variant/state/size axes (e.g. Button: variant {primary, secondary,
  ghost, link} × state {default, hover, pressed, disabled}; StatusBadge: 6 status variants × form {pill,
  inline-dot}; Filter/Radio: state {off, hover, on, disabled})
- AND the declared states MUST correspond to states observed in the library

#### Scenario: Block vocabulary is defined with variants
- GIVEN the change is implemented
- WHEN the blocks section is inspected
- THEN it MUST enumerate at least: GigCard, ProfileCard, MessageBubble, ConversationItem, NotificationItem,
  SidebarNav, Topbar, FilterBar, BannerCard, StatPanel, RequirementCard, CriteriaList, ClientCard, TermsTabs,
  ApplyPanel, ChatPanel, MessagesPanel
- AND each block MUST declare its variant axes (e.g. GigCard: status×6 × layout {grid, list}; SidebarNav:
  role × {expanded, collapsed})
- AND each block MUST list the primitives it is composed from

#### Scenario: Every library component maps to a vocabulary entry
- GIVEN the component inventory in `docs/DESIGN_SPECS.md` §4
- WHEN the vocabulary is inspected
- THEN every inventoried component MUST correspond to a primitive, a block, or a documented composition of them
- AND no inventoried component may be left without a vocabulary mapping

**Acceptance Criteria:**
- Primitives and blocks are enumerated with variant/state/size matrices grounded in observed states
- Each block lists its constituent primitives
- Every library component in `docs/DESIGN_SPECS.md` §4 maps to a vocabulary entry

---

### Requirement: Layout Grammar and Screen-Composition Pattern
`docs/DESIGN_SYSTEM_SPEC.md` MUST define the layout grammar — the page templates, regions/slots, and content
layout primitives — and the screen-composition pattern by which screens are assembled.

#### Scenario: Page templates are defined
- GIVEN the change is implemented
- WHEN the layout-grammar section is inspected
- THEN it MUST define an `AppShell` template with a sidebar slot, a topbar slot, and a content region, in both
  sidebar **expanded** and **collapsed** states
- AND it MUST define an `AuthLayout` template (centered card region + checkerboard footer) for the auth/register
  screens

#### Scenario: Regions/slots and layout primitives are defined
- GIVEN the layout-grammar section
- WHEN it is inspected
- THEN it MUST define the named regions/slots each template exposes
- AND it MUST define content layout primitives (at least `Stack`, `Grid`, `Split`, `Section`, `Panel`, `Rail`)
- AND those primitives MUST express spacing using the canonical spacing scale (no raw px)

#### Scenario: Screen-composition pattern is specified
- GIVEN the change is implemented
- WHEN the composition section is inspected
- THEN it MUST state the rule that a screen = Template + slotted Blocks + data bindings
- AND it MUST state that screens contain **no styling, no layout literals, and no raw markup** — composition
  only (the rule a later composition lint will enforce)

**Acceptance Criteria:**
- `AppShell` (expanded + collapsed) and `AuthLayout` templates are defined with named regions/slots
- Layout primitives (Stack, Grid, Split, Section, Panel, Rail) are defined on the canonical spacing scale
- The screen-composition pattern and its "composition-only" rule are specified

---

### Requirement: Typed Block View-Model Contracts
Every block in the vocabulary MUST declare a typed **view-model contract** — the named, typed shape of the data
it requires — independent of the Prisma schema, so blocks render from fixtures before Phase 1 models exist.

#### Scenario: Each block declares a typed view-model
- GIVEN the block vocabulary
- WHEN the view-model section is inspected
- THEN every enumerated block MUST have a typed view-model contract listing its fields and their types
- AND the contract MUST be expressed in schema-independent terms (e.g. a `GigCardVM` with `status`,
  `category`, `tags`, `budget`, `deadlineDays`, `rating { value, count, verified }`), not as Prisma models

#### Scenario: Contracts decouple UI from schema
- GIVEN the view-model contracts
- WHEN they are inspected
- THEN they MUST reference the data a block displays, not database tables or query shapes
- AND they SHOULD note which Phase 1 data change is expected to fulfill each contract (per the planning doc's
  data-model worklist) without depending on it existing yet

**Acceptance Criteria:**
- Every block has a typed, schema-independent view-model contract with named fields
- Contracts are renderable from fixtures and note their fulfilling Phase 1 change where applicable

---

### Requirement: DESIGN_SYSTEM_SPEC.md as SSOT with Reconciliation Log
`docs/DESIGN_SYSTEM_SPEC.md` MUST exist, be declared the single source of truth for the design system, contain
(or link to) all of the system definition, and include a **complete Reconciliation Log** recording every
screen/library deviation and its resolution.

#### Scenario: The SSOT document exists and is self-describing
- GIVEN the change is implemented
- WHEN the file system is inspected
- THEN `docs/DESIGN_SYSTEM_SPEC.md` MUST exist
- AND it MUST state that it is the single source of truth for the design system
- AND it MUST contain (or link to) the canonical scales, the token taxonomy, the component vocabulary +
  matrices, the layout grammar, and the block view-model contracts
- AND it MUST reference `docs/DESIGN_SPECS.md` as its raw-substrate provenance

#### Scenario: Reconciliation log records every deviation with a resolution
- GIVEN the screens disagree with each other or with the library (spacing one-offs, near-duplicate colours,
  radius variance, slightly different paddings)
- WHEN the Reconciliation Log section is inspected
- THEN it MUST contain an entry for each such deviation
- AND each entry MUST state the observed deviation, the decision (normalize-to-scale / promote-to-variant /
  flag-for-designer), and the canonical entity it resolves to
- AND the log MUST be complete — no observed deviation left unaddressed

#### Scenario: Screens are treated as samples, not the spec
- GIVEN any screen-level value that differs from the canonical scale
- WHEN its reconciliation entry is read
- THEN the resolution MUST normalize it to the system (or promote a deliberate variant) — never enshrine the
  screenshot value as a one-off
- AND the canonical system, not the screenshot, MUST be stated as authoritative

**Acceptance Criteria:**
- `docs/DESIGN_SYSTEM_SPEC.md` exists, is declared the SSOT, and contains/links all system definitions
- A Reconciliation Log records every deviation → resolution and is complete
- Screens are treated as samples; deviations resolve to the system, not to copied one-offs

---

### Requirement: System Coverage and Traceability
`docs/DESIGN_SYSTEM_SPEC.md` MUST include a **System Coverage Matrix** demonstrating that every library
component and every one of the 12 sample screens maps onto system entities (tokens, primitives, blocks, layout
primitives, templates) with **no unaccounted one-offs**, and that the vocabulary is complete enough for the
later generativity proof.

#### Scenario: Every library component is traced
- GIVEN the component inventory in `docs/DESIGN_SPECS.md` §4
- WHEN the coverage matrix is inspected
- THEN every inventoried component MUST be traced to the primitive/block/composition that represents it
- AND any component with no mapping MUST be recorded as a system gap, not omitted

#### Scenario: Every screen maps to a composition with no orphan one-offs
- GIVEN the 12 sample screens (`screens/auth.jpg`, `reg.jpg`, `reg-customer.jpg`, `reg-specialist.jpg`,
  `customer-dashboard.jpg`, `customer-projects.jpg`, `specialist-dashboard.jpg`, `specialist-gig-search.jpg`,
  `specialist-gig.jpg`, `specialist-projects.jpg`, `specialist-chats.jpg`, `specialist-progile.jpg`)
- WHEN the coverage matrix is inspected
- THEN each screen MUST be expressed as `Template + Blocks + data bindings`
- AND every distinct visual element in each screen MUST resolve to a system entity (token / primitive / block /
  layout primitive)
- AND any element that resolves to none MUST be logged as a one-off in the Reconciliation Log with a resolution
  — there MUST be no unaccounted one-offs

#### Scenario: Every raw value is accounted for
- GIVEN the ~22 observed fills and 13 observed radii in `docs/DESIGN_SPECS.md`
- WHEN the coverage matrix / reconciliation log is inspected
- THEN each observed value MUST resolve to a canonical token or a logged reconciliation decision
- AND the matrix MUST make it verifiable that none was silently dropped

#### Scenario: Vocabulary is complete enough for generativity
- GIVEN the mock-less screens (admin moderation `/admin/*`, Finances, Disputes, Settings)
- WHEN the coverage analysis is inspected
- THEN the spec MUST confirm each is expressible from the defined vocabulary (`AppShell` + existing
  blocks/primitives) with no new system entity
- AND any entity such a screen would require but the library lacks MUST be recorded as a system gap to resolve
  before Phase 2 (feeding the `prove-extensibility-admin` generativity proof)

**Acceptance Criteria:**
- A System Coverage Matrix traces every library component and every one of the 12 screens to system entities
- Every raw observed value resolves to a canonical token or a logged decision — no silent drops
- No unaccounted one-offs remain; mock-less screens are confirmed expressible (generativity-ready), gaps logged

---

## Test Plan

This change ships **documentation only** — no application code. Validation is by deterministic file/grep checks
plus a manual traceability review. An optional throwaway validator
(`scripts/design-system/validate-derive-acceptance.js`, mirroring the predecessor's `validate-acceptance.js`)
MAY map each scenario to a check. Commands assume the repo root.

### SSOT document + provenance checks
```bash
test -f docs/DESIGN_SYSTEM_SPEC.md && echo "SSOT exists"
# Declares itself SSOT and references the raw-substrate doc
grep -qiE 'single source of truth|SSOT' docs/DESIGN_SYSTEM_SPEC.md && echo "declares SSOT"
grep -q 'DESIGN_SPECS.md' docs/DESIGN_SYSTEM_SPEC.md && echo "references raw substrate"
# All six deliverable sections present (sample headings)
for s in 'colour' 'radius' 'spacing' 'type' 'taxonomy' 'primitive' 'block' 'layout' 'view-model' 'reconciliation' 'coverage'; do
  grep -qi "$s" docs/DESIGN_SYSTEM_SPEC.md && echo "OK  $s" || echo "CHECK  $s"
done
```

### Canonical scale + provenance checks
```bash
# A sampled canonical colour traces to a real fill in the SVGs
for hex in '#0088ff' '#f59e0b' '#f45fb1'; do
  grep -qi "$hex" docs/DESIGN_SYSTEM_SPEC.md && { grep -qi "$hex" screens/tokens.svg || grep -qi "$hex" screens/frames.svg; } \
    && echo "OK  $hex traces" || echo "CHECK  $hex"
done
# Near-duplicate pairs are addressed (a decision is logged for each)
for hex in '#0cc671' '#ff383c' '#4cacff'; do
  grep -qi "$hex" docs/DESIGN_SYSTEM_SPEC.md && echo "OK  $hex addressed" || echo "CHECK  $hex"
done
# Canonical radius steps named; pill + dominant card radius preserved
grep -qiE 'radius|pill' docs/DESIGN_SYSTEM_SPEC.md && echo "radius scale present"
```

### Vocabulary + grammar + contracts checks
```bash
# Primitives present
for p in Button Input Select Tabs Toggle Radio Tag CategoryTag StatusBadge Avatar Rating ViewToggle ProgressBar SearchInput; do
  grep -q "$p" docs/DESIGN_SYSTEM_SPEC.md && echo "OK  $p" || echo "CHECK  $p"
done
# Blocks present
for b in GigCard ProfileCard MessageBubble ConversationItem NotificationItem SidebarNav Topbar FilterBar BannerCard StatPanel RequirementCard CriteriaList ClientCard TermsTabs ApplyPanel ChatPanel MessagesPanel; do
  grep -q "$b" docs/DESIGN_SYSTEM_SPEC.md && echo "OK  $b" || echo "CHECK  $b"
done
# Layout grammar + composition rule
for g in AppShell AuthLayout Stack Grid Split Section Panel Rail; do
  grep -q "$g" docs/DESIGN_SYSTEM_SPEC.md && echo "OK  $g" || echo "CHECK  $g"
done
grep -qiE 'view-model|view model' docs/DESIGN_SYSTEM_SPEC.md && echo "view-model contracts present"
```

### Coverage + reconciliation checks
```bash
grep -qiE 'reconciliation' docs/DESIGN_SYSTEM_SPEC.md && echo "reconciliation log present"
grep -qiE 'coverage' docs/DESIGN_SYSTEM_SPEC.md && echo "coverage matrix present"
# Each of the 12 screens is referenced in the coverage map
for s in auth reg reg-customer reg-specialist customer-dashboard customer-projects specialist-dashboard specialist-gig-search specialist-gig specialist-projects specialist-chats specialist-progile; do
  grep -q "$s" docs/DESIGN_SYSTEM_SPEC.md && echo "OK  $s" || echo "CHECK  $s"
done
```

### Scope guards (documentation-only)
```bash
# No application code / schema / token JSON created by this change
git status --porcelain | grep -E '\.(ts|tsx)$' && echo "UNEXPECTED code change" || echo "no code changes"
test -f openspec/specs/ui/design-tokens.json && echo "UNEXPECTED: token JSON present (design-token-engine creates it)" || echo "no token JSON (correct)"
```

### Manual traceability review
1. Open `docs/DESIGN_SYSTEM_SPEC.md` beside `docs/DESIGN_SPECS.md` and confirm every observed colour/radius is
   mapped to a canonical token or a logged reconciliation decision (no silent drops).
2. Pick 3 library components from `docs/DESIGN_SPECS.md` §4 and confirm each resolves to a vocabulary entry.
3. Pick 3 screens, open their reference renders, and confirm each element resolves to a system entity — no
   unaccounted one-offs.
4. Confirm the reconciliation log addresses each near-duplicate pair and each spacing one-off.
5. Confirm the mock-less screens (admin/Finances/Disputes/Settings) are stated as expressible from the
   vocabulary, with any gap logged.
