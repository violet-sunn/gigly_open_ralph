# Tasks — add-profile-and-gig-detail-blocks

Add SectionHeader, JobExperienceCard, CriteriaRow; reconcile RequirementCard + CriteriaList in place; adopt
SectionHeader in the hand-rolled headings. Token-pure, typed VMs, fixtures. Source: `docs/figma-screens-export.md` §1,
`docs/figma-components-export.md`. Blocks in `app/components/blocks/*`; tests `domain-blocks.test.tsx`;
catalog `app/workbench/registry.tsx`.

## 1. SectionHeader block (Figma H/H1/BLOCK 3371:5248)
- [x] Add `SectionHeaderVM` (`{ title, icon?, count? }`) to `view-models.ts`.
- [x] Add `SectionHeader.tsx`: `text-h1 font-h1` (24 mono) title + optional trailing `Icon` + optional count chip;
      `justify-between`. Token-pure.
- [x] Adopt in `TagList`, `CategoryTags`, `ExperienceList` — replace the `<span className="text-h2 font-h2 …">`
      section title with `<SectionHeader title={vm.title} />`.
- **Test:** renders title at `text-h1 font-h1`; icon/count render when set; the 3 blocks render SectionHeader (no bespoke heading).

## 2. JobExperienceCard block (Figma job experience 3088:3896)
- [x] Add `JobExperienceCardVM` (`{ company, period, role?, description? }`) to `view-models.ts` (or reuse the
      existing experience-entry shape from `ExperienceListVM`).
- [x] Add `JobExperienceCard.tsx`: `border-overlay-line-strong` card, `radius/lg`, company (strong) + period
      (muted, right), role line `text-brand-default` (RC-S1), description (muted body). Token-pure.
- [x] Refactor `ExperienceList` to map entries → `JobExperienceCard` (drop the inline `Panel` entry markup).
- **Test:** renders company/period/role/description; role line uses `text-brand-default`; ExperienceList composes JobExperienceCard.

## 3. CriteriaRow item + CriteriaList reconcile (Figma критерий 2932:7224)
- [x] Add `CriteriaRow.tsx`: numbered left block (`bg-brand-default` + digit `text-surface-level-0`) + title
      (strong) + optional description (muted). Token-pure.
- [x] Extend `CriteriaListVM` item to `{ label, description?, met? }` (`met` now optional/ignored).
- [x] Reconcile `CriteriaList.tsx` to map items → numbered `CriteriaRow` (index 1..N), replacing the met/unmet checklist.
- **Test:** N items → N numbered CriteriaRows; digit on-accent token; `GigDetail.tsx` still compiles.

## 4. RequirementCard reconcile (Figma требование 2932:7177)
- [x] Reconcile `RequirementCard.tsx` to the tile: `border-overlay-line-strong` hairline, `radius/md`,
      `justify-between` column with a min height, `text-h2 font-h2` (18 sans) title + `text-body … text-muted` desc.
      Keep `RequirementCardVM`.
- **Test:** container uses `border-overlay-line-strong` + `rounded-md`; title 18 sans; `GigDetail.tsx` compiles.

## 5. Fixtures + barrel + catalog
- [x] Add fixtures: `sectionHeaderFixture`, `jobExperienceCardFixtures`, and ensure `criteriaListFixture` /
      `requirementCardFixture` still type-check (extend if needed).
- [x] Export `SectionHeader`, `JobExperienceCard`, `CriteriaRow` from `index.ts`.
- [x] Add/adjust workbench `registry.tsx` entries: `SectionHeader`, `JobExperienceCard`; refresh the
      `RequirementCard` + `CriteriaList` stories to the reconciled presentation.
- **Test:** `npm run build` resolves all imports; workbench catalog-coverage test passes.

## 6. Tests + full verification
- [x] Extend `domain-blocks.test.tsx` with SectionHeader, JobExperienceCard, CriteriaRow/CriteriaList(numbered),
      RequirementCard(tile); update any existing CriteriaList/RequirementCard assertions to the reconciled output.
- **Test plan (run, assert green):**
  - `npm run validate:tokens` — pass (no token changes expected; in sync).
  - `npm run lint:tokens` — pass; planting a raw literal in a new block fails it (then revert).
  - `npm run build` — pass.
  - `npm run clean:test-db && npm run test:unit` — green (clean first; re-run any unrelated integration timeout in isolation to confirm the known flake).

## 7. Update the planning doc status
- [x] In `openspec/planning/figma-grounded-ui-reconciliation.md`, check `add-profile-and-gig-detail-blocks` and bump progress to `4/13`.
- **Test:** Status checkbox `[x]`; progress reads `4/13`.
