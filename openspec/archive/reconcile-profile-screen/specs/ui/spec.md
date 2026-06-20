# Spec delta — ui (reconcile-profile-screen)

Reconciles `/profile` to **Профиль/specialist (`2860:2103`)**: the ID block adopts the `SpecialtyTag` primitive +
a token-pure availability status pill, the stray `"Профиль"` page-title is removed, and the 2-col BLOCK +
analytics placeholder are affirmed — all while preserving the profile data, the owner edit flow, and the read-only
public view.

## MODIFIED Requirements

### Requirement: Profile Screen Reconciled to the Figma Profile Node
The `/profile` screen (`app/(protected)/profile/Profile.tsx`, shared by own + public `/profile/[userId]`) MUST
remain a composition-pure `@composed-screen` inside the layout's `AppShell`, reconciled to **Профиль/specialist
(`2860:2103`)**: an **ID block** (`ProfileHeader` ‖ the analytics placeholder `StatPanel`) followed by the 2-column
**BLOCK** (`TagList` + `ExperienceList` ‖ `CategoryTags` + the realized `GigCard` feed), each section led by a
`SectionHeader`. The screen MUST NOT render a `"Профиль"` page-title heading (the node CONTENT leads with the ID
block). It MUST be token-pure (F2) and composition-pure (F5), and MUST preserve the profile data binding, the
owner edit affordance → `/profile/edit`, and the read-only public view.

#### Scenario: Composes the ID block + 2-col BLOCK without a page title
- GIVEN a SPECIALIST profile at `/profile`
- WHEN it renders
- THEN it MUST render the `ProfileHeader` ID block and the analytics placeholder `StatPanel` as the ID-block row
- AND it MUST render the 2-col BLOCK — `TagList` («Стек») + `ExperienceList` («Опыт») in one column and
  `CategoryTags` + the realized `GigCard` feed in the other — each section headed by a `SectionHeader`
- AND it MUST NOT render a `"Профиль"` page-title heading
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

#### Scenario: Honors the analytics placeholder
- GIVEN the ID-block row
- WHEN it renders
- THEN the right panel MUST show the «на стадии разработки» analytics placeholder
  («Здесь будет ваша статистика»), the mock's deferred-feature widget

#### Scenario: Profile data + edit flow preserved
- GIVEN the composed profile
- WHEN an owner views `/profile` and a non-owner views `/profile/[userId]`
- THEN the real profile data MUST bind (name, specialty, verify, tech stack, categories, experience, realized gigs)
- AND the owner MUST see the edit affordance → `/profile/edit` (a save round-trips), and the non-owner MUST NOT see
  any edit affordance

### Requirement: ProfileHeader ID Block Uses SpecialtyTag + a Status Pill
The `ProfileHeader` block MUST render the ID block per the Figma node: the avatar with its online/offline state,
the name (display type), the **specialty via the `SpecialtyTag` primitive** (white chip, brand-blue mono — NOT an
ad-hoc bordered pill), a **token-pure availability status pill** (online/offline, with a dot), the phone-verified
row, and the member-since line, plus the optional owner edit affordance. It MUST be token-pure.

#### Scenario: Specialty renders via SpecialtyTag
- GIVEN `<ProfileHeader vm={…}>` with a `roleTag`
- WHEN it renders
- THEN the specialty MUST render via the `SpecialtyTag` primitive (the `bg-surface-inverse` chip with
  `text-brand-default` mono text), not the ad-hoc `rounded-pill border` pill
- AND the `roleTag` text MUST still be visible (e.g. "Senior Frontend Engineer")

#### Scenario: Availability status pill with a dot
- GIVEN `<ProfileHeader vm={…}>` with `online: true` and with `online: false`
- WHEN each renders
- THEN the ID block MUST show a token-pure availability status pill carrying a dot, reflecting the online/offline
  state — no raw hex/px literals

#### Scenario: Verify + member-since preserved, token-pure
- GIVEN any `ProfileHeader`
- WHEN it renders
- THEN it MUST keep the phone-verified row ("Номер телефона верифицирован") and the member-since line
- AND the file MUST be token-pure (no raw hex/px)

## ADDED Requirements

### Requirement: ID-Block Real Stats Are a Sanctioned Content Variant
The static node shows only the «на стадии разработки» analytics placeholder in the ID block; the implementation
MUST honor that placeholder AND MAY retain the real numeric stats (Рейтинг / Завершено задач / Повторные заказы,
from `header.stats`) as a **sanctioned content variant** — a functional enhancement the mock lacks. This MUST be
recorded in the design-system reconciliation note, NOT resolved by dropping the placeholder. F3 parity for the ID
block is asserted at the layout-grammar + flow level, not a literal element-count match.

#### Scenario: Placeholder honored, real stats retained and recorded
- GIVEN the ID block
- WHEN it renders
- THEN the «на стадии разработки» placeholder MUST be present (honored)
- AND retaining the real numeric stats MUST be documented as a sanctioned content variant in the reconciliation
  note (`docs/DESIGN_SYSTEM_SPEC.md` §10.x)

### Requirement: Profile Reconciliation Keeps the Suite Green
Reconciling the profile MUST update the affected E2E/unit assertions to the new ID-block composition (SpecialtyTag
+ status pill, no page-title) while preserving every behavioural assertion (data binding, owner edit round-trip,
read-only public view), and MUST keep the build, token-purity lint, and unit/E2E suites green.

#### Scenario: Tests updated to the reconciled composition, suite green
- GIVEN `__tests__/e2e/compose-profile.spec.ts` and the ProfileHeader render test
- WHEN they run after the reconciliation
- THEN they MUST assert the `SpecialtyTag` specialty chip + the availability status pill (and not a removed
  page-title), while the data-binding, edit-round-trip, and read-only assertions still pass
- AND `npm run build`, `npm run lint:tokens`, and `npm run test:unit` MUST pass
