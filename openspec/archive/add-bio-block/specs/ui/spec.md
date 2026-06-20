# Spec delta — ui (add-bio-block)

Adds the missing `Bio` block (Figma `bio` 2931:2365 + `bio/message/COMPANY` 2931:2366 → one block with a `user` axis):
the identity row (avatar + name + verify-patch + stars + `Специальность`) with `sizeFor: gig|acc-bio` × `user:
specialist|company`, composed from the existing primitives — and adopts it in `ChatHeader` + the gig-detail conditions.

## ADDED Requirements

### Requirement: Bio Block (Avatar + Name + Verify + Stars + Specialty), Variant-Typed
A `Bio` block MUST render the design's identity row from primitives only (no `className`/`style`/hex; `Avatar` + name
+ the `verified` patch icon (F4 exported asset) + `Rating` + the `SpecialtyTag` `Специальность` + an optional
presence line), typed by `BioVM` with `sizeFor: 'gig' | 'acc-bio'` and `user: 'specialist' | 'company'`. The
`company` variant MUST omit `Специальность` (covering the `bio/message/COMPANY` node — the two Figma nodes collapse
into this one block). It MUST be token-pure (F2).

#### Scenario: Bio renders its parts across variants
- GIVEN a `BioVM` for a specialist (`sizeFor: 'acc-bio'`, with rating + verified + specialty) and one for a company
- WHEN each renders
- THEN the specialist `Bio` MUST show the avatar, name, the verify-patch (when `verified`), the `Rating` stars, and
  the `SpecialtyTag` `Специальность`; the company `Bio` MUST show avatar + name + verify + rating and MUST NOT render
  a `Специальность`
- AND the block MUST contain no `className=`/`style=`/hex literals (token-pure), composing only kit primitives

### Requirement: ChatHeader Adopts Bio
`ChatHeader` MUST render the `Bio` block (the acc-bio thread header), mapping `ChatHeaderVM` → `BioVM`. `ChatHeaderVM`
MUST gain an optional `specialty?` (surfacing the counterparty's `Специальность`) while preserving its existing
fields, so the chat screens + their E2E are unaffected.

#### Scenario: The chat thread header renders via Bio
- GIVEN a chat with a counterparty (name + rating + presence, optionally a specialty)
- WHEN `ChatHeader` renders
- THEN it MUST render through `Bio` (avatar + name + verify + rating + presence, and the specialty when present)
- AND the existing `ChatHeaderVM` fields MUST still be honored (the chat E2E stays green)

### Requirement: Gig-Detail Conditions Adopt Bio
`getGigDetail` MUST provide a `bio: BioVM` (from the gig's client — name + rating + verified, `user: 'company'`,
`sizeFor: 'acc-bio'`) and the gig-detail screen MUST render `<Bio>` as the conditions bio. The screen MUST stay
composition-pure (F5).

#### Scenario: The gig-detail conditions lead with a company Bio
- GIVEN a gig viewed on `/gigs/[id]`
- THEN `getGigDetail` MUST return `bio` (a company `BioVM` from the client) and the screen MUST render a `Bio` in the
  conditions column
- AND the screen MUST remain composition-pure (no `className`/`style`/hex)

### Requirement: Bio Addition Keeps the Suite Green
Adding `Bio` + adopting it MUST keep the build, token-purity lint, composition lint, and unit/E2E suites green, with
render tests covering the 4 variants.

#### Scenario: Gates green with Bio render coverage
- GIVEN the change
- WHEN `npm run build`, `npm run lint:tokens`, `npm run lint:composition`, `npm run clean:test-db && npm run test:unit`,
  and the chat + gig-detail E2E run
- THEN all MUST pass — `Bio` render tests cover the sizeFor × user variants (with/without specialty/verify/stars), and
  the chat + gig-detail screens render with `Bio` and no regression

**Acceptance Criteria:**
- `Bio` block + `BioVM` (sizeFor gig|acc-bio × user specialist|company; company omits `Специальность`); token-pure; F4 verify asset
- `ChatHeader` renders via `Bio` (`ChatHeaderVM` += optional `specialty`); chat E2E green
- `getGigDetail` returns `bio` + the gig-detail screen renders `Bio` (F5 pure); gig-detail E2E green
- 4-variant render tests + workbench entry; `build` + `lint:tokens` + `lint:composition` + `test:unit` green
- The two-nodes→one-block (`user` axis) decision recorded in `docs/DESIGN_SYSTEM_SPEC.md`
