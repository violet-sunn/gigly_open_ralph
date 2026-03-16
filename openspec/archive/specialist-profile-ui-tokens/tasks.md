# Tasks: specialist-profile-ui-tokens

1. **Fix token source integrity for referenced primitives**
   - Implementation notes:
     - Update `openspec/specs/ui/design-tokens.json` to ensure all references used by `color-semantic.*` resolve.
     - Specifically ensure `color-primitives.light.blue.800` and `color-primitives.light.blue.900` exist OR replace those references with existing primitives.
     - Values MUST match the Figma semantic fallbacks observed on the screen:
       - `--border/brand/default` fallback appears as `#0265dc`
       - `--border/brand/hover` fallback appears as `#1379f3` or a nearby brand shade (confirm in Figma tokens)
   - Test plan:
     - Run a deterministic resolver check (script or unit test) that parses `design-tokens.json` and asserts no `{...}` references remain unresolved for the subset used by Specialist profile.

2. **Create token-to-CSS-variable export for required semantic tokens**
   - Implementation notes:
     - Add a small build-time step (script) or runtime import that exports a flat map of CSS variables (e.g. `--bg-surface-level-0`, `--text-neutral-strong`).
     - The CSS variables MUST be defined globally (e.g., in `app/globals.css`).
     - Keep the mapping explicit for this pilot (only variables required by the Specialist profile page).
   - Test plan:
     - Unit test: parse the generated CSS (or the mapping object) and assert required CSS variables are present.

3. **Update Specialist profile view page layout to match Figma primitives**
   - Implementation notes:
     - Update `app/(protected)/profile/page.tsx` (Specialist branch only) to:
       - use token-backed colors for backgrounds, text, borders
       - implement the hero card (brand border + gradient background)
       - implement avatar block (large rounded rectangle)
       - implement role pill (DO NOT add new “Поделиться профилем” control in this pilot)
       - implement stats pill row (compute from existing data when possible; otherwise show explicit placeholders)
       - implement “Опыт работы” card with an in-block “Редактировать” affordance that routes to `/profile/edit`
     - Keep Client profile UI unchanged in this change.
   - Test plan:
     - Add a Playwright e2e test that:
       - signs in as a SPECIALIST
       - visits `/profile`
       - asserts the presence of key elements by role/text (e.g., “Опыт работы”, “Редактировать”)
       - asserts computed styles for at least:
         - page background equals token `bg.surface.level-0` (#01030e)
         - primary card background equals token `bg.surface.level-1` (#060813)
         - secondary card background equals token `bg.surface.level-2` (#10121c)

4. **Document the token usage contract for future pages**
   - Implementation notes:
     - Update `openspec/specs/ui/spec.md` (or add a delta spec in this change) describing:
       - naming scheme for CSS variables
       - rule: pages MUST use semantic tokens (not raw hex) for colors already defined in tokens
   - Test plan:
     - Spec-only change; no runtime tests.

5. **Regression verification**
   - Test plan:
     - `npm run test:unit`
     - `npx playwright test __tests__/e2e/profile-specialist-ui-tokens.spec.ts --project=chromium`
     - `npm run build`
     - (Optional) `npm run test:e2e` to ensure no unrelated E2E regressions

   - Note:
     - The full Playwright suite contains legacy tests that may fail independently of this pilot.
       The targeted profile token E2E test is the acceptance gate for this change.
