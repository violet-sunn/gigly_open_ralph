# Implementation Tasks: derive-design-system

> **STATUS: ✅ COMPLETE (2026-06-14).** All 13 tasks implemented. Deliverable `docs/DESIGN_SYSTEM_SPEC.md`
> written (canonical scales, taxonomy, vocabulary + matrices, layout grammar, view-model contracts,
> reconciliation log, coverage matrix). Validator `scripts/design-system/validate-derive-acceptance.js`:
> **58/58 PASS**. Scope guards: no `.ts/.tsx`, no token JSON. Each task marked `[x]` below.

> **No application code.** Deliverable is `docs/DESIGN_SYSTEM_SPEC.md` (the SSOT) containing the canonical
> scales, semantic token taxonomy, component vocabulary + variant/state matrices, layout grammar, block
> view-model contracts, a complete **Reconciliation Log**, and a **System Coverage Matrix**. Inputs are
> read-only: `docs/DESIGN_SPECS.md` (raw observed substrate), `screens/tokens.svg`/`frames.svg` (library),
> `screens/*.jpg` (12 sample screens), `docs/design-system/reference-renders/`, and
> `openspec/planning/ui-redesign-integration.md`. Coverage/validation MAY use a throwaway script under
> `scripts/design-system/`, which is tooling, not shipped app code. **Screens are samples, not the spec** —
> deviations are normalized to the system and logged. Friction: medium.

---

## Task 1: [x] Assemble inputs and build the working inventory

**Implementation Notes:**
- Read the raw substrate end-to-end: `docs/DESIGN_SPECS.md` §2 (22 fills), §3 (13 radii), §5 (measured
  geometry), §4 (component inventory), §7 (residual gaps). This is the authoritative source — do **not**
  re-measure or re-source values by eye or from Figma.
- Read the mechanism, block list, screen→composition mapping, and data-model worklist in
  `openspec/planning/ui-redesign-integration.md` (the system shape is already sketched there).
- List the 12 sample screens (`screens/*.jpg`) and open their reference renders under
  `docs/design-system/reference-renders/frames/` for element-level inspection.
- Produce a working inventory (scratch or the spec's appendix): every observed value, every library component,
  every screen — the universe the coverage matrix must later account for.

**Test Plan:**
```bash
ls screens/*.jpg | wc -l                       # expect: 12
grep -oiE '#[0-9a-f]{6}' docs/DESIGN_SPECS.md | tr 'A-F' 'a-f' | sort -u | wc -l   # ~22-23 observed fills
grep -c '^|' docs/DESIGN_SPECS.md              # tables present (inventory/geometry)
```
Expected: inputs catalogued; the value/component/screen universe is enumerated before normalization begins.

---

## Task 2: [x] Normalize the colour palette into a canonical scale

**Implementation Notes:**
- Collapse the observed fills into role-family ramps, deciding canonical steps by evidence (occurrence counts
  in `docs/DESIGN_SPECS.md`, role consistency across screens, ΔE proximity):
  - **Surface ramp** (`#01030e` page → `#0e101a` recessed → `#10121c` card/input → `#1a1a24`/`#1a1d2a`
    elevated): keep distinct levels; reconcile the near-pair `#1a1a24`/`#1a1d2a` (collapse to one elevated
    level, or keep as elevated-vs-hover variants — log the decision).
  - **Text/neutral**: `#8a8f99` (muted primary) vs `#9fa0a4` (near-dup secondary — reconcile), `#3a3d45`
    (border), `white` (strong).
  - **Brand ramp**: primary `#0088ff`, hover `#4cacff`, pressed `#0077e6`; `#1379f3`/`#0099ff` (1–2
    occurrences) collapse into primary as accidental variants — log it.
  - **Status set (6)**: open=neutral, review=amber `#f59e0b`, in-progress=blue `#3b82f6`,
    verification=purple `#8b5cf6`, completed=green `#10b981` (canonical; `#0cc671` near-dup), rejected=red
    `#ef4444` (canonical; `#ff383c` near-dup). Keep status-blue `#3b82f6` **separate** from brand-blue
    `#0088ff` (distinct roles).
  - **Category set (5)**: marketing=blue, design=pink `#f45fb1`, programming=green `#0cc671`,
    development=teal `#05c9e6`, coding=orange `#f27c0d`. Reconcile category-green `#0cc671` vs status-green
    `#10b981` (same value re-used, or two greens? — log).
- Record, for every observed fill, its mapping: observed hex → canonical token, or → a reconciliation decision.
  No fill left unmapped; no canonical hex that isn't in the SVGs.

**Test Plan:**
```bash
# Every documented canonical colour is a real SVG fill (sample)
for hex in '#0088ff' '#10b981' '#ef4444' '#f45fb1' '#10121c'; do
  { grep -qi "$hex" screens/tokens.svg || grep -qi "$hex" screens/frames.svg; } && echo "OK  $hex" || echo "CHECK  $hex"
done
# Each near-duplicate is addressed in the doc
for hex in '#0cc671' '#ff383c' '#4cacff' '#1379f3' '#9fa0a4' '#1a1d2a'; do
  grep -qi "$hex" docs/DESIGN_SYSTEM_SPEC.md && echo "OK addressed $hex" || echo "CHECK $hex"
done
```
Expected: colour scale by family; every observed fill mapped; near-duplicates collapsed or promoted with a logged reason.

---

## Task 3: [x] Normalize the radius set into a canonical scale

**Implementation Notes:**
- Snap the 13 observed radii to a small canonical scale and map each observed value to a step:
  - `2`/`2.5` → **xs** (inner chips); `3`/`3.5`/`4`/`4.5`/`5` → **sm** (tags/radios/small controls);
    `8` → **md** (cards/inputs/buttons — the dominant radius); `11`/`12`/`13` → **lg** (panels);
    `16` → **xl** (large containers); `18` → **pill**; avatars → **circular** (radius = half-dimension, not a
    fixed px).
- Preserve `8px` (md) and `18px` (pill) as canonical steps (most load-bearing). Record each snap (e.g.
  `2.5→xs`, `11/13→lg`) in the reconciliation log.

**Test Plan:**
```bash
# Each observed rx is grep-findable in the SVGs (the canonical scale must trace to them)
for r in 2 4.5 8 12 18; do
  { grep -q "rx=\"$r\"" screens/tokens.svg || grep -q "rx=\"$r\"" screens/frames.svg; } && echo "OK rx=$r" || echo "CHECK rx=$r"
done
grep -qiE 'radius|pill|circular' docs/DESIGN_SYSTEM_SPEC.md && echo "radius scale present"
```
Expected: a named radius scale (xs/sm/md/lg/xl/pill/circular); every observed `rx` mapped to a step; snaps logged.

---

## Task 4: [x] Derive the canonical spacing scale and size tokens

**Implementation Notes:**
- Collect spacing-like measurements from `docs/DESIGN_SPECS.md` §5 (12px inset, 40px control height / nav
  pitch, 16×16 icon, 20×20 rail icon, 24/32 avatars) and the screen-observed one-offs (17/20/21/24/30/47px).
- Define a canonical spacing scale on a regular base grid (base-4 recommended): e.g.
  `space/0=0, 1=4, 2=8, 3=12, 4=16, 5=20, 6=24, 8=32, 10=40, 12=48`. Map each one-off (17→16, 21→20, 30→32,
  47→48) and log the snap; flag any value that is genuinely off-grid for the designer.
- Capture non-spacing sizes as named **size tokens**: `size/control=40`, `size/icon=16`, `size/icon-rail=20`,
  `size/avatar-sm=24`, `size/avatar-lg=32`.

**Test Plan:**
```bash
grep -qiE 'spacing|space/|base grid|base-4' docs/DESIGN_SYSTEM_SPEC.md && echo "spacing scale present"
grep -qiE '40|control height' docs/DESIGN_SYSTEM_SPEC.md && echo "control-height size token present"
# One-offs are addressed
for v in 17 21 47; do grep -q "$v" docs/DESIGN_SYSTEM_SPEC.md && echo "OK one-off $v addressed" || echo "CHECK $v"; done
```
Expected: a base-grid spacing scale; one-offs snapped + logged; control/icon/avatar size tokens captured.

---

## Task 5: [x] Define the type scale and roles (flag exact metrics forward)

**Implementation Notes:**
- Define the type scale as named roles with relative structure: e.g. `display, h1, h2, title, body, label,
  caption, mono` — each with a size step, weight, and line-height **relationship** (the scale shape).
- Record measurable type facts with provenance where they exist (e.g. the 22px auth heading used in
  `login-page-redesign`, any cap-height measurable from render coordinates).
- Name the intended families — **SF Compact** (display/UI), **NKDy Mono** (mono) — and **flag** the exact font
  files + glyph metrics + SF Compact web licence as a residual inherited from `docs/DESIGN_SPECS.md` §7,
  resolved in `typography-system`. Define the *scale*, not the *font decision*.

**Test Plan:**
```bash
grep -qiE 'type scale|typography' docs/DESIGN_SYSTEM_SPEC.md && echo "type scale present"
grep -qiE 'SF Compact|NKDy' docs/DESIGN_SYSTEM_SPEC.md && echo "families named"
grep -qiE 'licen|residual|typography-system' docs/DESIGN_SYSTEM_SPEC.md && echo "font metrics flagged forward"
```
Expected: a role-based type scale; families named; exact metrics + licence flagged forward to `typography-system`.

---

## Task 6: [x] Define the semantic token taxonomy

**Implementation Notes:**
- Define the namespaces and naming convention (`namespace/role[-modifier]`), covering at least:
  `surface/*` (level-0..N), `text/*` (strong/muted/subtle/inverse), `border/*`, `brand/*`
  (default/hover/pressed/subtle), `status/*` (open/review/in-progress/verification/completed/rejected),
  `category/*` (marketing/design/programming/development/coding), `space/*`, `radius/*`, `type/*`, `shadow/*`,
  plus `z/*`, `opacity/*`, `size/*` as needed.
- Map **every** canonical value from Tasks 2–5 to exactly one semantic name (a mapping table:
  canonical value → token name → observed provenance). Names encode meaning, never the raw value
  (`surface/level-2`, not `blue-0088ff`).
- Note: this taxonomy is the exact shape `design-token-engine` serializes into the token JSON — keep names
  stable and one canonical value per leaf. Semantic names MAY be cross-checked against a fresh Figma export
  when available, but don't block on it.

**Test Plan:**
```bash
for ns in 'surface/' 'text/' 'status/' 'category/' 'space/' 'radius/' 'type/'; do
  grep -q "$ns" docs/DESIGN_SYSTEM_SPEC.md && echo "OK  $ns" || echo "CHECK  $ns"
done
grep -qiE 'naming convention' docs/DESIGN_SYSTEM_SPEC.md && echo "naming convention stated"
```
Expected: namespaces + convention defined; every canonical value named; statuses (6) and categories (5) named.

---

## Task 7: [x] Define the primitive vocabulary + variant/state/size matrices

**Implementation Notes:**
- Enumerate the primitives and, for each, the variant/state/size axes grounded in the states observed in
  `docs/DESIGN_SPECS.md` §4 and the SVGs:
  - **Button** — variant {primary, secondary, ghost, link} × state {default, hover, pressed, disabled}; size
    {md=40h default}.
  - **Input / SearchInput** — state {default, focus, filled, disabled, error}; SearchInput adds clear (✕) +
    search-icon inset (16px @ 12px left, per §5). **PasswordInput** = Input + reveal (eye — a Figma residual icon).
  - **Select / FilterDropdown** — state {collapsed, expanded, disabled}; option {default, hover, selected}.
  - **Filter / Radio** — state {off, hover, on, disabled}.
  - **Tabs** — tab {default, active} (+ optional count badge); **Toggle** — {off, on, disabled}.
  - **Tag** (tech) — colour-variant set; **CategoryTag** — 5 category variants (left-accent).
  - **StatusBadge/Dot** — 6 status variants × form {pill (126×40), inline-dot (8px)}; plus the "Текущий"
    current badge.
  - **Avatar** — size {sm=24 r12, lg=32 r16}, circular, + online variant; **Rating** — stars(0–5) + count +
    verified + experience tag, + online variant.
  - **ViewToggle** — {grid, list}; **ProgressBar** — track + fill (value 0–100); **ExperienceTag** — labelled pill.
- Declare only states that exist in the library (don't invent).

**Test Plan:**
```bash
for p in Button Input PasswordInput Select Filter Tabs Toggle Radio Tag CategoryTag StatusBadge Avatar Rating ViewToggle ProgressBar SearchInput; do
  grep -q "$p" docs/DESIGN_SYSTEM_SPEC.md && echo "OK  $p" || echo "CHECK  $p"
done
grep -qiE 'variant|state|matrix' docs/DESIGN_SYSTEM_SPEC.md && echo "matrices present"
```
Expected: every primitive enumerated with a variant/state/size matrix grounded in observed states.

---

## Task 8: [x] Define the block vocabulary + variant matrices

**Implementation Notes:**
- Enumerate the blocks and, for each, its variant axes + the primitives it composes (from the planning doc's
  block list + `docs/DESIGN_SPECS.md` §4 composites):
  - **GigCard** — status×6 × layout {grid, list}; composes StatusBadge, Tag, CategoryTag, Rating, budget,
    deadline, "К проекту" Button.
  - **SidebarNav** — role × {expanded, collapsed icon-rail}; composes NavMenuItem(+count), logo, profile,
    SupportCard, logout.
  - **Topbar** — profile card + bell + gear. **FilterBar** — SearchInput + Filter/Select + ViewToggle.
  - **MessageBubble** {in, out}; **ConversationItem** (unread); **NotificationItem** (type icons);
    **MessagesPanel** / **ChatPanel** (thread + composer).
  - **BannerCard** (raster art residual), **StatPanel**, **RequirementCard**, **CriteriaList**, **ClientCard**,
    **ProfileCard**/ProfileHeader, **TermsTabs**, **ApplyPanel** (reuse structured fields).
  - Mapping/admin entities used by mock-less screens: **DataTable**, **LedgerTable**, **DisputeList/Detail**,
    **TagList**, **ExperienceList**, **CategoryTags**, **StepIndicator**, **RoleCard**, **CreateGigCTA**,
    **DangerAction** — include those the screen map references.
- Each block composes **only** primitives + tokens (no raw values).

**Test Plan:**
```bash
for b in GigCard ProfileCard MessageBubble ConversationItem NotificationItem SidebarNav Topbar FilterBar BannerCard StatPanel RequirementCard CriteriaList ClientCard TermsTabs ApplyPanel ChatPanel MessagesPanel; do
  grep -q "$b" docs/DESIGN_SYSTEM_SPEC.md && echo "OK  $b" || echo "CHECK  $b"
done
```
Expected: every block enumerated with variants and its constituent primitives.

---

## Task 9: [x] Define the layout grammar and screen-composition pattern

**Implementation Notes:**
- Define **`AppShell`**: regions {sidebar slot, topbar slot, content region}; states {sidebar expanded,
  sidebar collapsed icon-rail}. Define **`AuthLayout`**: centered card region + checkerboard footer.
- Define the content layout primitives on the canonical spacing scale: **Stack** (axis + gap), **Grid**
  (columns + gap), **Split** (two-pane), **Section** (titled region), **Panel** (surface container w/ radius +
  padding tokens), **Rail** (narrow icon column). All spacing via `space/*`, no raw px.
- State the **composition pattern**: a screen = Template + slotted Blocks + data bindings; screens contain
  **no styling, no layout literals, no raw markup** (the rule `layout-grammar`'s composition lint will enforce).

**Test Plan:**
```bash
for g in AppShell AuthLayout Stack Grid Split Section Panel Rail; do
  grep -q "$g" docs/DESIGN_SYSTEM_SPEC.md && echo "OK  $g" || echo "CHECK  $g"
done
grep -qiE 'expanded|collapsed' docs/DESIGN_SYSTEM_SPEC.md && echo "shell states present"
grep -qiE 'composition only|no raw markup|no styling' docs/DESIGN_SYSTEM_SPEC.md && echo "composition rule stated"
```
Expected: AppShell (expanded+collapsed) + AuthLayout with regions/slots; layout primitives on the spacing scale; composition rule stated.

---

## Task 10: [x] Define each block's typed view-model contract

**Implementation Notes:**
- For each block from Task 8, declare a typed, schema-independent view-model (field names + types). Examples:
  - `GigCardVM { id; title; category; tags: string[]; status: Status; budget: Money; deadlineDays: number;
    rating: { value: number; count: number; verified: boolean }; clientName?; isCurrent?: boolean }`
  - `ProfileHeaderVM { avatar; name; roleTag; verified; memberSince; location?; stats }`
  - `MessageBubbleVM { direction: 'in'|'out'; author; timestamp; body; readState? }`
  - `SidebarNavVM { role; items: { icon; label; href; count?; active }[]; collapsed }`
  - …and so on for ConversationItem, NotificationItem, FilterBar, StatPanel, RequirementCard, CriteriaList,
    ClientCard, TermsTabs, ApplyPanel, ChatPanel/MessagesPanel, BannerCard.
- Reference the data the block *displays*, not Prisma tables. Note which Phase 1 data change fulfills each
  contract (per the planning doc's data-model worklist) without depending on it existing.

**Test Plan:**
```bash
grep -qiE 'view-model|view model|VM' docs/DESIGN_SYSTEM_SPEC.md && echo "contracts present"
# Spot-check a few contracts name their fields
grep -qiE 'deadlineDays|rating' docs/DESIGN_SYSTEM_SPEC.md && echo "GigCard contract fields present"
```
Expected: every block has a typed, schema-independent view-model with named fields, noting its fulfilling Phase 1 change.

---

## Task 11: [x] Build the screen-composition map + System Coverage Matrix

**Implementation Notes:**
- Formalize the screen→composition map for all **12** screens (extend the planning doc's table to
  element-level): each screen = `Template + Blocks + data bindings`. Screens:
  `auth, reg, reg-customer, reg-specialist, customer-dashboard, customer-projects, specialist-dashboard,
  specialist-gig-search, specialist-gig, specialist-projects, specialist-chats, specialist-progile`.
- Build the **System Coverage Matrix** proving:
  1. **Every library component** (`docs/DESIGN_SPECS.md` §4) → primitive/block/composition (no orphan).
  2. **Every screen element** → a system entity (token/primitive/block/layout primitive). Any element resolving
     to none is a **one-off** → push to the Reconciliation Log with a resolution (normalize / variant / flag).
  3. **Every raw value** (22 fills, 13 radii) → canonical token or logged decision — verifiably none dropped.
- **Generativity check:** confirm the mock-less screens (admin `/admin/*`, Finances, Disputes, Settings) are
  expressible from the vocabulary with no new entity; record any required-but-missing entity as a system gap to
  resolve before Phase 2 (feeds `prove-extensibility-admin`).

**Test Plan:**
```bash
grep -qiE 'coverage' docs/DESIGN_SYSTEM_SPEC.md && echo "coverage matrix present"
for s in auth reg reg-customer reg-specialist customer-dashboard customer-projects specialist-dashboard specialist-gig-search specialist-gig specialist-projects specialist-chats specialist-progile; do
  grep -q "$s" docs/DESIGN_SYSTEM_SPEC.md && echo "OK  $s" || echo "CHECK  $s"
done
grep -qiE 'generativity|admin|no new (entity|token)' docs/DESIGN_SYSTEM_SPEC.md && echo "generativity check present"
```
Expected: all 12 screens mapped to compositions; every component + every value traced; no unaccounted one-offs; mock-less screens confirmed expressible, gaps logged.

---

## Task 12: [x] Write the complete Reconciliation Log

**Implementation Notes:**
- Add a **Reconciliation Log** section to `docs/DESIGN_SYSTEM_SPEC.md` (or a companion
  `docs/DESIGN_RECONCILIATION_LOG.md` linked from the SSOT) with one entry per deviation surfaced in Tasks
  2–5 and 11. Each entry states: the **observed deviation** (value/treatment + where seen), the **decision**
  (normalize-to-scale / promote-to-variant / flag-for-designer), and the **canonical entity** it resolves to.
- Cover at minimum: the green/red/blue near-duplicate colours; the surface `#1a1a24`/`#1a1d2a` and neutral
  `#8a8f99`/`#9fa0a4` pairs; the radius snaps (2.5→xs, 11/13→lg); the spacing one-offs (17/21/30/47); and every
  screen-level one-off found in Task 11.
- The log MUST be **complete** — no observed deviation left unaddressed. The system, not any screenshot, is
  authoritative.

**Test Plan:**
```bash
grep -qiE 'reconciliation' docs/DESIGN_SYSTEM_SPEC.md && echo "reconciliation log present"
# Each near-duplicate / one-off has an entry (sample)
for t in '0cc671' 'ff383c' '1379f3' '9fa0a4' '17' '47'; do
  grep -qi "$t" docs/DESIGN_SYSTEM_SPEC.md && echo "OK entry $t" || echo "CHECK $t"
done
grep -qiE 'normalize|variant|flag' docs/DESIGN_SYSTEM_SPEC.md && echo "decisions recorded"
```
Expected: a complete log; every near-duplicate, snap, and screen one-off has an entry with a decision + resolution.

---

## Task 13: [x] Assemble the SSOT, validate acceptance, and confirm scope

**Implementation Notes:**
- Assemble `docs/DESIGN_SYSTEM_SPEC.md` so it (a) declares itself the design-system **single source of truth**,
  (b) contains/links all six deliverables + the reconciliation log + the coverage matrix, and (c) references
  `docs/DESIGN_SPECS.md` as its raw-substrate provenance.
- Optionally add `scripts/design-system/validate-derive-acceptance.js` (mirroring `validate-acceptance.js`)
  mapping each spec scenario (R1..R7) to a deterministic check; run it to PASS/FAIL.
- Run the full deterministic check suite from the spec delta's Test Plan. Do the manual traceability review
  (components → vocabulary; screens → composition; values → tokens; reconciliation completeness).
- Confirm scope discipline: **no** `.ts/.tsx`/schema/test changes; **no** `openspec/specs/ui/design-tokens.json`
  (re)created; **no** React components or screen code — documentation only.

**Test Plan:**
```bash
# Deliverable + SSOT declaration
test -f docs/DESIGN_SYSTEM_SPEC.md && grep -qiE 'single source of truth|SSOT' docs/DESIGN_SYSTEM_SPEC.md && echo "SSOT present"
grep -q 'DESIGN_SPECS.md' docs/DESIGN_SYSTEM_SPEC.md && echo "provenance referenced"
# Scope guards
git status --porcelain | grep -E '\.(ts|tsx)$' && echo "UNEXPECTED code change" || echo "no code changes"
test -f openspec/specs/ui/design-tokens.json && echo "UNEXPECTED token JSON" || echo "no token JSON (correct)"
# Optional validator
test -f scripts/design-system/validate-derive-acceptance.js && node scripts/design-system/validate-derive-acceptance.js || echo "(validator optional)"
```
Expected: SSOT assembled and self-describing; all deterministic checks pass; manual traceability confirmed; no out-of-scope changes; all seven spec requirements satisfied.

---

## Summary

Total tasks: 13
Estimated effort: 6–9 hours (friction: medium)

**Deliverables:**
- ✅ `docs/DESIGN_SYSTEM_SPEC.md` — the canonical SSOT: colour/radius/spacing/type scales, semantic token
  taxonomy, primitive + block vocabularies with variant/state/size matrices, layout grammar (AppShell +
  AuthLayout + layout primitives) and the screen-composition pattern, and typed block view-model contracts.
- ✅ A complete **Reconciliation Log** (every screen/library deviation → resolution).
- ✅ A **System Coverage Matrix** (every component + every screen + every raw value → system entity; no
  unaccounted one-offs; mock-less screens confirmed generativity-ready).
- ✅ (Optional) `scripts/design-system/validate-derive-acceptance.js` — throwaway scenario→check validator.

**Critical path:**
1. Assemble inputs + inventory (Task 1)
2. Normalize scales — colour, radius, spacing, type (Tasks 2–5)
3. Taxonomy (Task 6)
4. Vocabulary — primitives, blocks (Tasks 7–8)
5. Layout grammar (Task 9) + view-model contracts (Task 10)
6. Screen map + coverage matrix (Task 11) + reconciliation log (Task 12)
7. Assemble SSOT + validate + scope-guard (Task 13)

**Scope guards (non-goals):**
- No application/TS/React code; no schema or test-suite changes
- No machine token source — `openspec/specs/ui/design-tokens.json` is NOT (re)created (that is `design-token-engine`)
- No primitive/block code (`ui-primitives`/`domain-blocks`) and no screen composition (Phase 2) — contracts/matrices only
- No font embedding/licensing — flagged residual to `typography-system`
- Raw values come from `docs/DESIGN_SPECS.md`/the SVGs — not re-measured, not re-sourced from Figma/eye
- Screens are samples, not the spec — deviations normalize to the system and are logged

**Success criteria:**
- ✅ Canonical colour/radius/spacing/type scales, each value traceable to the raw substrate
- ✅ Semantic token taxonomy; every canonical value named; statuses (6) + categories (5) named
- ✅ Primitive + block vocabularies with variant/state/size matrices grounded in observed states
- ✅ Layout grammar + screen-composition pattern; typed view-model contract per block
- ✅ SSOT doc + complete reconciliation log + coverage matrix with no unaccounted one-offs
