# Tasks — create-design-migration-plan

Implementing this change = **analyze + author the planning document**. No production code.
Output file: `openspec/planning/design-migration.md` (status PLANNED).

## 1. Analyze project context
- [x] Read `DESIGN.md`, `design.config.ts`, `PRODUCT.md`, `openspec/project.md`.
- [x] Read `openspec/specs/planning/spec.md` and `openspec/planning/README.md`.
- [x] Read `openspec/planning/transport-design-from-prototype.md`: method, lessons, pilot checkpoint, deferred items.
- **Test:** the plan's Problem and Why sections cite the prior campaign and `DESIGN.md` concretely.

## 2. Identify affected systems, gaps and dependencies
- [x] Routes: every `page.tsx` under `app/` (protected, auth, landing, admin, legal, workbench).
- [x] Substrate: `app/_design/*`, `app/components/{primitives,blocks,templates,ui}`, `scripts/generated-tokens.*`, `openspec/specs/ui/spec.md`.
- [x] Validators: `validate-contrast.js` and `validate-tokens.js` bound to the old hex JSON; `fidelity-diff.js` and Playwright reusable; `design-dod.mjs` new.
- [x] Dependencies: tokens + validators → lab (user picks) → package (light layer measured) → pilot (user approves) → remaining screens → retire legacy.
- **Test:** no screen change precedes the package; nothing after the pilot starts before user approval.

## 3. Decide the skills routing
- [x] Inventory active skills: `design-taste-frontend`, `emil-design-eng`, `review-animations`, `gigly-design-dod`, Impeccable.
- [x] Find conflicts with `DESIGN.md`: taste-skill bans gradient, glow (`button-fx`, `shadow`), `glass`, `hairline` / `outlined-box`, `palette-purple`; Emil and review-animations enforce <300 ms / ease-out, which contradicts scene beats and cuts (§10); Impeccable flags `dark-glow`.
- [x] Resolve: taste-skill always with `--keep palette,type` and the allow list; Emil and review-animations only in workspace and on workspace-grade controls; Impeccable `ignoreRules` filled from its first run with the DESIGN.md reason.
- [x] Record the routing in `CLAUDE.md` §4 and a Skills section in the plan.
- **Test:** every Change has a `Skills:` line; no scene change lists Emil or review-animations; every taste-skill gate carries the allow list.

## 4. Create the planning document
- [x] Write `openspec/planning/design-migration.md` with Problem, Why This Matters, Scope, Method, Skills, Changes (12, dependency-ordered, copy-pasteable), Follow-ups, Status (PLANNED, 0/12).
- **Test:** the document passes every scenario of `openspec/specs/planning/spec.md` "Planning Document Format".
