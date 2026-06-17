# Spec delta — ui (reconcile-design-tokens-from-figma)

Closes the residual token-layer decisions the components/screens Figma import surfaced *after* the
2026-06-17 colour/type/effect reconcile. The colour/type/effect/`--gig-bg`/category reconcile already
landed in `openspec/specs/ui/design-tokens.json`; this delta does NOT restate it. New requirements only.

## ADDED Requirements

### Requirement: Screen-Level Blue Reconciliation
The system MUST account for every blue observed in the Figma component/screen designs against the token
palette, leaving no unaccounted near-duplicate. The role/specialty blue `#006ccb` (job-experience role
text, node `3088:3896`) MUST be resolved to a recorded decision — either normalized to an existing brand
token or sanctioned as a new semantic token — and MUST NOT survive as a raw, untokened literal.

#### Scenario: The three blues are each mapped to a token
- GIVEN `#0088ff` (brand/default), `#4cacff` (brand/highlight), and `#006ccb` (role/specialty text)
- WHEN the token palette and the reconciliation log are inspected
- THEN `#0088ff` MUST map to `color-semantic.brand.default` and `#4cacff` to `color-semantic.brand.highlight`
- AND `#006ccb` MUST be recorded as either normalized to an existing brand token (recommended: `brand.default`)
  or added as a new semantic token (e.g. `brand.link`)
- AND the chosen resolution MUST be written to the reconciliation log with its rationale

#### Scenario: No unaccounted blue remains a raw literal target
- GIVEN the recorded decision for `#006ccb`
- WHEN `design-tokens.json` is inspected
- THEN `#006ccb` MUST NOT appear as an orphan value with no semantic name UNLESS the decision sanctioned it
  as a named token
- AND if normalized, the log MUST state which token the JobExperienceCard role text will bind to (so the
  later block change has a token target, not a hex)

---

### Requirement: Non-Token Font Family Decision
The three font families seen raw in the Figma designs — `Vremena Grotesk`, `IBM Plex Sans`, and `Inter` —
MUST be resolved to a recorded decision, since the token model binds only two families (`font.family.sans`
= SF Compact, `font.family.mono` = NKDuy Mono). Each MUST be either added as a family token or mapped to an
existing family token; the decision and its rationale MUST be recorded.

#### Scenario: Each non-token family has a recorded resolution
- GIVEN `Vremena Grotesk` (message/notification/value text), `IBM Plex Sans` (embedded gig titles + file chip),
  and `Inter` (attention-card emoji markers)
- WHEN the reconciliation log is inspected
- THEN each family MUST have an explicit resolution — "add family token" OR "map to `font.family.sans`/`mono`"
- AND `Inter` MUST be noted as already the dev-stage substitute for `font.family.sans` (not a third family in code)
- AND the recommended resolution (map Vremena/IBM Plex to existing families for MVP, flag for designer
  confirmation) MUST be recorded unless the designer confirms intentional distinct families

#### Scenario: No new family token is added without a recorded justification
- GIVEN the recommended "no new family tokens for MVP" decision
- WHEN `design-tokens.json` `font.family` is inspected
- THEN it MUST contain only the justified families (expected: `sans`, `mono` unchanged)
- AND any added family token MUST carry a description citing the designer confirmation that motivated it

---

### Requirement: Category Hue Binding Confirmation
Because the tag/Category hues exist in Figma only as component-variant fills (raw hex, not bound variables),
the five-hue `category.*` mapping in the SSOT MUST be confirmed against the Figma component fills and the
`marketing #0088ff` vs `Blue #4cacff` ambiguity resolved, with the result recorded.

#### Scenario: The five category hues are confirmed against component fills
- GIVEN `category.marketing #0088ff`, `category.design #f45fb1`, `category.programming #0cc671`,
  `category.development #05c9e6`, `category.coding #f27c0d`
- WHEN compared against the `tag`/`Category` component-variant fills in `docs/figma-components-export.md`
  / `docs/figma-component-audit.md`
- THEN each category token value MUST equal its corresponding component fill OR a divergence MUST be logged
- AND the `marketing #0088ff` vs `Blue #4cacff` ambiguity MUST be resolved in the log (recommended:
  `marketing = #0088ff` brand; `#4cacff` is the highlight tint used for the "Стек" Blue tag label, not a category)

---

### Requirement: Reconciliation Decision Log
Every decision made by this change MUST be recorded in a durable, human-readable reconciliation log so the
later block/screen changes inherit token targets rather than re-deriving values.

#### Scenario: The log records each residual decision
- GIVEN this change resolves the third blue, the three non-token families, and the category-hue confirmation
- WHEN the reconciliation log (in `docs/DESIGN_SYSTEM_SPEC.md` or `docs/TOKEN_RECONCILIATION.md`) is inspected
- THEN it MUST contain a dated entry for each of the three decisions with: the observed raw value(s), the
  decision, the rationale, and the token target (where applicable)
- AND it MUST cite the originating import doc(s) (`docs/figma-screens-export.md`, `docs/figma-components-export.md`)

---

### Requirement: Generated Pipeline Stays in Sync With the Reconciled SSOT
After any token edit this change makes, `scripts/generated-tokens.{js,css}` MUST be regenerated from
`design-tokens.json` and remain byte-in-sync (ignoring the timestamp line), and token validation MUST assert
this so a hand-edit or stale generation is caught.

#### Scenario: Regeneration is a no-op diff when no token changed
- GIVEN the recommended decisions add/normalize no tokens (the common case)
- WHEN `node scripts/parse-design-tokens.js` is run
- THEN `scripts/generated-tokens.{js,css}` MUST be unchanged except for the `Generated:` timestamp line

#### Scenario: A token edit propagates and stays in sync
- GIVEN a decision that DOES add/normalize a token (e.g. a sanctioned `brand.link`)
- WHEN the parser is re-run and `npm run build` executes
- THEN both generated files MUST reflect the edit, the build MUST pass, and the token validation test MUST
  assert the generated outputs match the JSON

#### Scenario: Token-purity lint stays green and still catches new literals
- GIVEN the existing baseline-then-tighten token-purity lint
- WHEN `npm run lint:tokens` (or the build) runs after this change
- THEN it MUST pass on the baselined codebase
- AND it MUST still fail on a planted, non-baselined off-token literal (e.g. `color: #006ccb`)
