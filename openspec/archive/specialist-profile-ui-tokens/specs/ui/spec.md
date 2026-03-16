# UI Spec Delta — specialist-profile-ui-tokens

## ADDED Requirements

### Requirement: Token-backed Specialist Profile UI (Pilot)
The system MUST render the authenticated Specialist profile page using the semantic UI tokens defined in `openspec/specs/ui/design-tokens.json`.

#### Scenario: Specialist views profile with token-backed surfaces
- GIVEN an authenticated user with role `SPECIALIST`
- WHEN they navigate to `/profile`
- THEN the page background MUST use `color-semantic.bg.surface.level-0`
- AND primary content cards MUST use `color-semantic.bg.surface.level-1`
- AND nested content blocks MUST use `color-semantic.bg.surface.level-2`

#### Scenario: Specialist profile hero section uses brand border and gradient
- GIVEN an authenticated user with role `SPECIALIST`
- WHEN they navigate to `/profile`
- THEN the hero/profile section MUST render a visible border using `color-semantic.border.brand.default`
- AND the hero/profile section MUST render a subtle brand gradient background based on `gradient.gradient`

#### Scenario: Specialist profile typography uses token typography
- GIVEN an authenticated user with role `SPECIALIST`
- WHEN they navigate to `/profile`
- THEN the display name MUST use a headline typography token
- AND supporting text (labels, secondary copy) MUST use body typography tokens

#### Scenario: Specialist profile key blocks match Figma primitives
- GIVEN an authenticated user with role `SPECIALIST`
- WHEN they navigate to `/profile`
- THEN the page MUST include:
  - a large avatar block (rounded rectangle)
  - a role pill
  - an in-block “Редактировать” affordance for editable sections
  - a stats pill row (rating, completed tasks, repeat orders)
  - an “Опыт работы” content card with an edit affordance

**Acceptance Criteria:**
- `/profile` Specialist view contains text “Опыт работы” and “Редактировать”.
- The page MUST NOT render a “Поделиться профилем” control in this pilot.
- Clicking the in-block “Редактировать” affordance MUST navigate to `/profile/edit`.
- Computed CSS background colors match token-resolved values:
  - `bg.surface.level-0` resolves to `#01030e`
  - `bg.surface.level-1` resolves to `#060813`
  - `bg.surface.level-2` resolves to `#10121c`

---

### Requirement: Token Reference Integrity for UI Tokens
The token source file `openspec/specs/ui/design-tokens.json` MUST NOT contain unresolved references for tokens required by the Specialist profile pilot.

#### Scenario: Brand border tokens resolve to concrete primitives
- GIVEN `color-semantic.border.brand.default` and `color-semantic.border.brand.hover` are used by the Specialist profile page
- WHEN the token file is parsed and references are resolved
- THEN both tokens MUST resolve to concrete color values (hex with alpha)

**Acceptance Criteria:**
- A deterministic validation (unit test or script) verifies that all token references used by the Specialist profile page resolve without missing paths.

## MODIFIED Requirements
- None.

## REMOVED Requirements
- None.
