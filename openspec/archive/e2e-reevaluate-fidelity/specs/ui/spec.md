# UI Specification Delta

## REMOVED Requirements

### Requirement: F1 ≤1% Visual-Fidelity Gate (Golden-Image Regression)

**Reason for removal:** This requirement mandated `npm run test:fidelity` — the `/workbench/*` golden-image gate implemented by `__tests__/e2e/fidelity-gate.spec.ts`. This change deletes that spec and removes its `test:fidelity` / `test:fidelity:update` scripts (see the companion `testing` delta). The gate captured the **legacy kit `/workbench` catalog**, which the `gigly_full_design` reground superseded — the shipped app renders the prototype's inline-styled markup keyed off `app/_design/tokens.css`, not the kit surfaces this gate diffed. Its goldens are environment-pinned to the project's Playwright Chromium (flaky across OS / font rendering) and gate a surface the product no longer ships from. It is the visual arm of the retired F2/F5 apparatus (`lint:tokens` / `lint:composition` were already removed from `package.json`). The requirement is retired, not replaced; the shipped design layer is instead covered by the new **Design-Token Render E2E Coverage** requirement in the `testing` spec.

The project previously MUST have provided a fidelity gate (`npm run test:fidelity`) that, for every `/workbench/*` surface in both themes at 1440px, captured the live render and asserted ≤1% differing pixels vs a committed golden (via `fidelity-diff.js`), wrote the golden when absent (`FIDELITY_UPDATE=1` / `test:fidelity:update`), and emitted `diff.png` / `side-by-side.png` / `overlay-50.png`.

#### Scenario: A matching render passes the ≤1% gate

- GIVEN a committed golden for a `/workbench/*` surface×theme
- WHEN the live render is captured and diffed via `fidelity-diff.js`
- THEN the ratio MUST be ≤ 1% and the gate MUST pass, emitting the diff / side-by-side / overlay-50 artifacts

> Removed: the ≤1% golden gate covered the superseded kit `/workbench` catalog; the shipped token layer is covered by the `testing` spec's design-token render requirement. The sibling `ui` requirements **Human F1 Reference Re-Baselined to the Prototype** (the workbench registry `reference` baselines — `app/workbench/registry.tsx` is still present) and **Generativity Re-Proven in Both Themes** (`validate-generativity` / `npm run lint:generativity` — still present) are **NOT** removed; only their incidental "probe golden" corroboration that ran *through this gate* no longer applies.
