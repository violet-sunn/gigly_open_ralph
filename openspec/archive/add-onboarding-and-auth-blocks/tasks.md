# Tasks — add-onboarding-and-auth-blocks

Add `Textarea`, `AuthStepDots`, `Logomark` primitives + `OnboardingCard` block; confirm TermsTabs. Token-pure,
typed, all states. Source: `docs/figma-screens-export.md` §1, `docs/figma-components-export.md`. Primitives in
`app/components/primitives/*`; block in `app/components/blocks/*`; catalog `app/workbench/registry.tsx`; tests
`__tests__/unit/components/{ui-primitives,domain-blocks}.test.tsx`.

## 1. Textarea primitive (Figma cover-letter 2860:2430)
- [x] Add `Textarea.tsx`: `<textarea>` on `bg-overlay-fill`, `border-border`, `rounded-md`, `px-3 py-2`,
      `items-start`, `placeholder:text-muted`, `text-body font-body text-strong`, focus ring (brand); `disabled`
      → `opacity-disabled`. Reuse/extend the INPUT_* token map where natural. Export from `primitives/index.ts`.
- **Test:** renders `<textarea>` with `bg-overlay-fill` + `border-border` + `rounded-md`; disabled sets the attr + opacity token; token-pure.

## 2. AuthStepDots primitive (Figma counter 3179:3997)
- [x] Add `AuthStepDots.tsx`: row of `count` dots; active (`current`) = larger (`h-2 w-2`, `bg-brand-default`),
      inactive = smaller (`h-1.5 w-1.5`, a dimmed token e.g. `bg-text-subtle`/`opacity-disabled`); `rounded-circular`;
      `aria-label` "Шаг N из M". Export.
- **Test:** renders `count` dots; the `current` dot uses `bg-brand-default` and is larger; aria-label present; token-pure.
  (If the lint flags `h-1.5`/`w-1.5`, drop to `h-2`/`w-2` with an opacity step for the inactive dots.)

## 3. Logomark primitive (Figma 3179:3571)
- [x] Add `Logomark.tsx`: renders `public/assets/design-system/brand/gigly-logo.svg` via `<img>`/`Icon`,
      `alt="Gigly"`, a `size` (default 75 via `h-…`/explicit). Export. No redrawn path.
- **Test:** renders an `<img>` whose `src` includes `gigly-logo`; has an accessible name.

## 4. OnboardingCard block (Figma welcome "pic" 3082:3820)
- [x] Add `OnboardingCardVM` (`{ title, subtitle?, progress: number, cta: { label }, art?: ImageRef }`) to `view-models.ts`.
- [x] Add `OnboardingCard.tsx`: `Panel surface={2} radius="lg"` with an `bg-overlay-fill` scrim + optional bleed
      `art` (residual, exported or omitted) + `type/h3` title (`text-h2 font-h2`) + `type/body` subtitle + inline
      `ProgressBar` + `Button variant="secondary"`. Token-pure. Fixture + export.
- **Test:** shows title (h2 role) + subtitle + ProgressBar at value + secondary Button; container `rounded-lg` + `bg-overlay-fill`; art optional; token-pure.

## 5. Confirm TermsTabs on canonical Tabs (Figma 2860:2413)
- [x] Verify `TermsTabs.tsx` composes the `Tabs` primitive (it does) — NO code change beyond a doc note that the
      Figma segmented-pill is normalized to `Tabs` (no 5th toggle). Record in `docs/DESIGN_SYSTEM_SPEC.md` §10.x.
- **Test:** `TermsTabs` renders `role="tab"` elements (existing test covers this); confirm no new toggle component exists.

## 6. Catalog + tests
- [x] Workbench `registry.tsx`: add `Textarea`, `AuthStepDots`, `Logomark` (primitive entries) + `OnboardingCard` (block entry).
- [x] Extend `ui-primitives.test.tsx` (Textarea, AuthStepDots, Logomark) + `domain-blocks.test.tsx` (OnboardingCard).
- **Test plan (run, assert green):**
  - `npm run validate:tokens` — pass (no token changes expected; in sync).
  - `npm run lint:tokens` — pass; planting a raw literal in a new primitive fails it (then revert).
  - `npm run build` — pass.
  - `npm run clean:test-db && npm run test:unit` — green (clean first; re-run any unrelated integration timeout in isolation to confirm the known `gig-browse-access` flake).

## 7. Update the planning doc status
- [x] In `openspec/planning/figma-grounded-ui-reconciliation.md`, check `add-onboarding-and-auth-blocks` and bump
      progress to `5/13` (Phase 0 COMPLETE — note Phase 1 screen reconciliations begin next).
- **Test:** Status checkbox `[x]`; progress reads `5/13`.
