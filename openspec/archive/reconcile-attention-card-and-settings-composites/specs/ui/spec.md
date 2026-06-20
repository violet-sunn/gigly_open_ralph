# Spec delta — ui (reconcile-attention-card-and-settings-composites)

Adds the `attention/*` token group and five blocks (AttentionCard + ToggleField, CheckField, SessionRow,
FileChip), all token-pure and composed from primitives + layout + tokens. New requirements only.

## ADDED Requirements

### Requirement: Attention Notification Accent Tokens
A semantic `attention/*` colour token group MUST exist in `design-tokens.json`, encoding the six
notification-**type** accents (distinct from the gig-`status/*` palette). Each token MUST be a single
canonical value; AttentionCard MUST reference these tokens, never raw hex.

#### Scenario: Six attention accents are named and distinct from status
- GIVEN the notification types status-change, message, deadline, accepted, rejected, payment
- WHEN `design-tokens.json` `color-semantic.attention` is inspected
- THEN it MUST define `status-change` (#7c3aed), `message` (#2563eb), `deadline` (#ea580c),
  `accepted` (#16a34a), `rejected` (#9ca3af, neutral), `payment` (#0891b2)
- AND these MUST be separate tokens from `status/*` (e.g. `attention/rejected` is gray, not `status/rejected` red)
- AND the generated `scripts/generated-tokens.{js,css}` MUST emit the group and stay in sync with the JSON

#### Scenario: Per-type glow is tokenised, not raw
- GIVEN the AttentionCard ambient glow keyed to each accent
- WHEN the glow is implemented
- THEN it MUST derive from the `attention/*` token (a token-based layered fill / gradient token), mirroring
  `gradient/status-completed-glow` — NO raw hex radial-gradient literal in component source

---

### Requirement: AttentionCard Block
An `AttentionCard` block MUST exist, modelling Figma `attention card` (`3367:3916`). It MUST be **data-driven
by notification type** (one implementation; no per-variant copies), with the type accent driving the marker,
the left `inset 4px` accent, and the ambient glow, while the **embedded gig/message block keeps its own
gig-status styling**. It MUST be token-pure and declare a typed view-model.

#### Scenario: Type drives the accent in one code path
- GIVEN `AttentionCard` rendered for each of the six types from fixtures
- WHEN each renders
- THEN the marker fill, the left accent, and the glow MUST all resolve to that type's `attention/*` token
- AND there MUST be a single component (a `type → token` map), not six hand-written variants

#### Scenario: Shell geometry and structure match the source
- GIVEN any AttentionCard
- WHEN it renders
- THEN it MUST be a `radius/xl` card with a `border/default`-class hairline, a header (marker + title + relative
  date), an embedded content block, and a full-width CTA `Button` whose fill is the type accent token
- AND the left accent MUST be a 4px inset edge in the type accent token

#### Scenario: Embedded block keeps its own gig-status glow
- GIVEN a variant whose embedded block is a gig card (e.g. accepted / rejected / payment)
- WHEN it renders
- THEN the embedded block MUST use its gig-status glow (independent of the outer attention accent)
- AND the message-type variant MUST embed a message preview block instead

#### Scenario: Token-pure
- GIVEN the `AttentionCard` file
- WHEN the token-purity lint runs
- THEN it MUST report zero new off-token literals

---

### Requirement: Settings Field Blocks (ToggleField, CheckField)
`ToggleField` and `CheckField` blocks MUST exist, modelling Figma `toggle field` (`3138:3199`) and
`check field` (`3138:3148`). Both MUST be token-pure and declare typed view-models.

#### Scenario: ToggleField is a titled+described toggle row
- GIVEN `<ToggleField>` with a title, description, and `checked`
- WHEN it renders
- THEN it MUST show the title (label type), the description (muted body), and a `Toggle` primitive reflecting `checked`
- AND toggling MUST invoke its `onChange`

#### Scenario: CheckField is a single-select list
- GIVEN `<CheckField>` with options where one is selected
- WHEN it renders
- THEN each row MUST show a circle (unselected) / check-circle (selected) indicator + a label
- AND selecting a row MUST invoke `onChange` with that row's key
- AND if the circle/check-circle glyphs are not in the exported-asset registry, the gap MUST be flagged as a
  residual (routed to Figma export), not redrawn inline

---

### Requirement: SessionRow Block
A `SessionRow` block MUST exist, modelling Figma `session` (`3149:2645`) with `Default | active | delete`
states, reusing existing primitives. It MUST be token-pure.

#### Scenario: Three states reuse existing primitives
- GIVEN `state="Default"`, `state="active"`, `state="delete"`
- WHEN each renders
- THEN Default MUST show title + description + a remove affordance (`IconButton`/close)
- AND active MUST show the «Текущий» pill via `StatusBadge variant="current"` (no bespoke pill)
- AND delete MUST show the destructive `Button variant="danger"` (no raw red literal)

#### Scenario: Token-pure
- GIVEN the `SessionRow` file
- WHEN the token-purity lint runs
- THEN it MUST report zero new off-token literals

---

### Requirement: FileChip Block
A `FileChip` block MUST exist, modelling Figma `file` (`3600:5262`): a row with a file-type icon, filename, and
size, on the `overlay/line` surface. It MUST be token-pure and declare a typed view-model.

#### Scenario: Renders name + size on the overlay token surface
- GIVEN `<FileChip name="ТЗ.doc" size="15 MB">`
- WHEN it renders
- THEN it MUST show a file icon, the name, and the size, on an `overlay/line` token fill at `radius/md`
- AND the typography MUST use family tokens (sans per the RC-S2 decision), no raw font-family literal

---

### Requirement: New Composites Are Catalogued and Validated
Every block added by this change MUST appear in the workbench catalog with its states, MUST have render/state
tests, and MUST keep the token pipeline + lint green.

#### Scenario: Workbench shows the new blocks
- GIVEN `app/workbench/registry.tsx`
- WHEN the catalog renders
- THEN it MUST include `AttentionCard` (all six types), `ToggleField`, `CheckField`, `SessionRow`
  (Default/active/delete), and `FileChip`, each mapped to a `reference`

#### Scenario: Render tests, lints, and build pass
- GIVEN `__tests__/unit/components/domain-blocks.test.tsx` extended for the new blocks
- WHEN `npm run test:unit`, `npm run lint:tokens`, `npm run validate:tokens`, and `npm run build` run
- THEN the new render/state tests MUST pass; the token-purity lint MUST report no new off-token literals;
  the generated token outputs MUST stay in sync with the JSON (the `attention/*` group included);
  and the build MUST pass
