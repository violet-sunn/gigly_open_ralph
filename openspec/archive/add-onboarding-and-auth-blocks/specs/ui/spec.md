# Spec delta — ui (add-onboarding-and-auth-blocks)

Adds `Textarea`, `AuthStepDots`, `Logomark` primitives + an `OnboardingCard` block; confirms TermsTabs on the
canonical `Tabs`. All token-pure, composed from primitives + layout + tokens.

## ADDED Requirements

### Requirement: Textarea Primitive
A `Textarea` primitive MUST exist (`app/components/primitives/Textarea.tsx`), modelling the Figma cover-letter
field (`2860:2430`): a multi-line input on an `overlay/fill` surface with a `border/default` hairline at
`radius/md`, top-aligned text, and a muted placeholder. It MUST be token-pure and is the field the gig-apply
cover letter composes (no domain-named bespoke block).

#### Scenario: Renders a multi-line field token-pure
- GIVEN `<Textarea placeholder="…">`
- WHEN it renders
- THEN it MUST render a `<textarea>` on `bg-overlay-fill` with `border-border` at `rounded-md`, `items-start`
  (top-aligned), and a `placeholder:text-muted` placeholder
- AND the file MUST be token-pure (no raw hex/px)

#### Scenario: Disabled state
- GIVEN `<Textarea disabled>`
- WHEN it renders
- THEN the `<textarea>` MUST be disabled and de-emphasised via the `opacity/disabled` token

---

### Requirement: AuthStepDots Primitive
An `AuthStepDots` primitive MUST exist, modelling the Figma auth `counter` (`3179:3997`): a row of N dots where
the **active** dot is larger (8px) and brand-coloured and the inactive dots are smaller (6px) and dimmed. It MUST
be token-pure and is the authoritative auth step indicator (distinct from the labelled `StepIndicator`).

#### Scenario: Marks the active step
- GIVEN `<AuthStepDots count={3} current={1}>`
- WHEN it renders
- THEN it MUST render 3 dots; the dot at index 1 MUST use the `brand/default` token and be visually larger
- AND the other dots MUST be dimmed (a translucent/muted token), smaller
- AND the file MUST be token-pure (no raw hex/px)

#### Scenario: Accessible
- GIVEN any `AuthStepDots`
- WHEN it renders
- THEN it MUST expose the progress to assistive tech (e.g. an `aria-label` describing step current of count)

---

### Requirement: Logomark Primitive
A `Logomark` primitive MUST exist, rendering the **exported** Gigly brand mark
(`public/assets/design-system/brand/gigly-logo.svg`, Figma `3179:3571`) — never a redrawn glyph (F4). It MUST
support a size and be token-pure.

#### Scenario: Renders the exported asset
- GIVEN `<Logomark />`
- WHEN it renders
- THEN it MUST render an `<img>`/`Icon` whose source is the exported `gigly-logo.svg` asset
- AND it MUST carry an accessible name (e.g. `alt="Gigly"`)
- AND it MUST NOT inline a redrawn logo path

---

### Requirement: OnboardingCard Block
An `OnboardingCard` block MUST exist, modelling the Figma welcome "pic" (`3082:3820`) — distinct from
`BannerCard`: a `radius/lg` card with an `overlay/fill` scrim, an optional bleed image (residual — exported or
omitted, not redrawn), a `type/h3` title + `type/body` subtitle, an inline `ProgressBar` primitive, and a
**secondary** `Button`. It MUST be token-pure and declare a typed view-model.

#### Scenario: Composes ProgressBar + secondary Button on a scrim
- GIVEN `<OnboardingCard>` with title, subtitle, progress, and a CTA
- WHEN it renders
- THEN it MUST show the title (`text-h2 font-h2`, the type/h3 role) and subtitle (`text-body … text-muted`)
- AND it MUST render the `ProgressBar` primitive at the given value
- AND it MUST render a `Button variant="secondary"` for the CTA
- AND the container MUST use `radius/lg` with an `overlay/fill` scrim (token), no raw hex

#### Scenario: Bleed image is an optional residual
- GIVEN an OnboardingCard with and without an `art` image
- WHEN each renders
- THEN the image MUST render via an exported `ImageRef` when present and be omitted otherwise (not redrawn)

---

### Requirement: TermsTabs Uses the Canonical Tabs (no bespoke toggle)
`TermsTabs` MUST continue to compose the canonical `Tabs` primitive; the Figma gig-apply segmented-pill toggle
(`2860:2413`) MUST be **normalized to `Tabs`**, NOT reproduced as a fifth bespoke toggle treatment.

#### Scenario: TermsTabs renders canonical tabs
- GIVEN `<TermsTabs>` (proposed / client)
- WHEN it renders
- THEN it MUST render the two tabs via the `Tabs` primitive (`role="tab"` elements)
- AND no bespoke segmented-pill toggle component may be introduced for it

---

### Requirement: Onboarding/Auth Primitives & Block Catalogued and Tested
Every primitive/block added by this change MUST appear in the workbench catalog with its states, MUST have
render tests, and MUST keep the suite + lints green.

#### Scenario: Workbench + tests
- GIVEN the workbench catalog registry and the primitive/block test files
- WHEN the catalog renders and `npm run test:unit`, `npm run lint:tokens`, `npm run build` run
- THEN the catalog MUST include `Textarea`, `AuthStepDots`, `Logomark`, and `OnboardingCard`
- AND the new render tests MUST pass, the token-purity lint MUST report no new off-token literals, and the build MUST pass
