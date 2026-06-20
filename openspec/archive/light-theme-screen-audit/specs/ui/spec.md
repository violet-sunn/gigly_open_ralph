# Spec delta — ui (light-theme-screen-audit)

The light-theme acceptance pass (`add-light-theme` follow-up): a deterministic **WCAG-AA contrast gate** over every
text×surface token pair in both themes, **elimination of the 74 legacy raw-colour literals** (purity lint flipped to
fail-on-all), a **theme-correct logo on light**, and a **both-themes per-screen** render+screenshot review with a
no-white-on-white check.

## ADDED Requirements

### Requirement: WCAG-AA Contrast Is Enforced in Both Themes
A deterministic gate (`scripts/design-system/validate-contrast.js`, `npm run lint:contrast`) MUST compute the WCAG
contrast ratio for every meaningful text×surface token pair using the SSOT values for **both** themes (dark =
`value`, light = `light ?? value`) and MUST assert **≥4.5:1** for body/label/caption text and **≥3:1** for large text
(h1/h2/display/title). Any pair below threshold MUST fail the gate; documented exceptions MUST be an explicit
allowlist in the script with a rationale (not a silent skip).

#### Scenario: Every text-on-surface pair passes AA in both themes
- GIVEN the token SSOT (dark + light values)
- WHEN `npm run lint:contrast` runs
- THEN it MUST PASS only if every audited `text.*` × `surface.*` pair (and `text.inverse` × `brand.default`/
  `surface.inverse`, each `status.*` text × its surface) meets its AA threshold in BOTH themes
- AND it MUST FAIL (exit 1) on a planted below-AA value, naming the offending pair + theme + ratio

### Requirement: No Un-themeable Raw Colour Literals Remain (Lint Flipped to Fail-on-All)
Every screen/component MUST be free of raw colour literals so it themes correctly; `token-purity-baseline.json` MUST
be emptied and `validate-token-purity.js` MUST fail on **any** raw hex/rgba literal (the BASELINE-THEN-TIGHTEN policy
flipped). Each legacy file MUST be token-migrated, or **deleted if it is dead/duplicate code**, preserving behaviour.

#### Scenario: Purity lint fails on any literal; baseline is empty
- GIVEN the codebase after the cleanup
- WHEN `npm run lint:tokens` runs
- THEN the baseline MUST be empty (0 recorded occurrences) and the lint MUST PASS with no raw literals
- AND introducing any raw hex/rgba into a component MUST fail the lint (no baseline to absorb it)

#### Scenario: Dead duplicate auth code removed, not double-fixed
- GIVEN the duplicate auth trees `components/auth/*` (root) and `app/components/auth/*`
- WHEN the audit determines which the routes import
- THEN the unused/orphan copy MUST be deleted (not theme-fixed), and the live copy MUST be token-pure

### Requirement: The Logo Reads On Light
`Logomark` MUST render legibly + on-brand on a light surface — via the sanctioned treatment (a `surface.inverse` dark
plate behind the mark under light, or a themed mark), with the brand blue + Handjet wordmark invariant. The decision
MUST be recorded in `docs/DESIGN_SYSTEM_SPEC.md`.

#### Scenario: Logomark is legible under data-theme="light"
- GIVEN a page with `data-theme="light"`
- WHEN `Logomark` (mark + wordmark) renders
- THEN the mark MUST remain visible against the light surface (not white-on-white) and the wordmark MUST use a
  theme-correct token (e.g. `text-strong`, which is dark on light)
- AND the chosen treatment MUST be token-pure (no raw literal) and recorded as the sanctioned decision

### Requirement: Every Screen Renders Correctly In Both Themes
An E2E (`__tests__/e2e/theme-coverage.spec.ts`) MUST load every route + the key modal states under **both**
`data-theme` values, assert each renders without console errors, capture a screenshot per (screen × theme) as a review
artifact, and assert **no white-on-white**: each screen's computed page background MUST differ from its dominant
card/text colours by a minimum delta (catching baked-literal fragments).

#### Scenario: Both-theme render sweep + no white-on-white
- GIVEN each app route (dashboard, search, gig detail, my gigs, chats, finances, disputes, profile, create-gig,
  settings, applications, admin, auth/login/register) and the confirm/settings/notification modal states
- WHEN each is loaded under `data-theme="dark"` and `data-theme="light"`
- THEN each MUST render without a console error, a screenshot MUST be captured for both themes, and the page bg MUST
  differ from the card/text colours by ≥ the minimum contrast delta (no collapse to white-on-white)

### Requirement: The Audit Keeps the Suites Green
The cleanup MUST preserve every existing behavioural test (auth/login/register/profile E2E + the unit/integration
suites) and keep `lint:contrast`, `lint:tokens` (fail-on-all), `validate:tokens`, `lint:composition`, `build`, and
`test:unit` green.

#### Scenario: All gates green after the audit
- GIVEN the change
- WHEN `npm run lint:contrast`, `npm run lint:tokens`, `npm run validate:tokens`, `npm run lint:composition`,
  `npm run build`, `npm run clean:test-db && npm run test:unit`, and the theme-coverage + preserved auth E2E run
- THEN all MUST pass — AA met both themes, zero raw literals (baseline empty), the logo reads on light, and no
  behavioural regression

**Acceptance Criteria:**
- `lint:contrast` PASSES (AA both themes) + FAILS on a planted below-AA value
- `token-purity-baseline.json` emptied; `lint:tokens` fails on any raw literal; the 10 legacy files token-migrated or deleted
- `Logomark` legible on light (token-pure treatment recorded in DESIGN_SYSTEM_SPEC)
- `theme-coverage` E2E: both-themes render + screenshots + no-white-on-white; preserved auth/login/register E2E green
- `validate:tokens` + `lint:composition` + `build` + `test:unit` green
