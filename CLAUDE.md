# Gigly — agent router

This file routes; it does not explain. Each line points to the one document that holds the truth for that question. If two documents disagree, the one named here wins.

## 1. Two truths, never mixed

| Question | Truth | Changes through |
| --- | --- | --- |
| How the product **behaves** (gig lifecycle, DoD, applications, statuses, auth, data) | `openspec/specs/` | `feat:` / `fix:` changes under `openspec/changes/` |
| How the product **looks and moves** (color, light, shape, type, motion, art, sound) | `DESIGN.md` | `design:` changes under `openspec/changes/` |
| What the product is for | `PRODUCT.md`, `openspec/project.md` | Edited by the owner only |

A change is either `feat:` or `design:`, never both. A `design:` change does not touch `openspec/specs/` or business logic; a `feat:` change does not introduce new visual decisions. If a task needs both, split it into two changes and ship the `feat:` first.

Current codebase state ≠ target. `gigly_full_design/`, `app/_design/` and `scripts/generated-tokens.css` are the shipped prototype on the OLD design. They are not a reference for new UI work; `DESIGN.md` is. They are retired screen by screen through `design: migrate <screen>` changes. The notes and sketches in `brand-visuals/` (everything except `refs/`) are the 20 Oct exploration that preceded `DESIGN.md`: history, not reference.

## 2. Process

Spec-driven via ralphy-spec (OpenSpec + Ralph loop). Commands: `/ralphy-plan`, `/ralphy-implement`, `/ralphy-validate`, `/ralphy-archive`. Specs are the source of truth; tasks complete only when verification passes; keep changes small and revertable. Loop completion promise: `<promise>TASK_COMPLETE</promise>` only when all tasks are done and tests are green.

For `design:` changes `/ralphy-validate` also runs the design checks (see `.claude/commands/ralphy-validate.md` §Design).

Campaigns (multi-change initiatives) live in `openspec/planning/` per its `README.md`: one document per initiative with the ordered `/ralphy-plan` commands, archived to `planning/archive/` when done. The design migration is `openspec/planning/design-migration.md`; it has a user-approved pilot checkpoint, and nothing after the pilot starts until the user approves its screenshots.

## 3. Before any UI work

1. Read `DESIGN.md` fully. Note `DESIGN_PATH` in `design.config.ts`.
2. Decide the screen's mode (`scene` / `workspace`), its artwork slot, and its one L0 action. Write these three lines into the change's `proposal.md`.
3. New page or component → an exploration file under `app/lab/` with 2–3 variants, then STOP for review. Never build the full page before a variant is chosen.
4. Build with tokens only. Run the DoD (`DESIGN.md` §15).

## 4. Skills: who speaks when

| Skill | Scope | Does not apply to |
| --- | --- | --- |
| `design-taste-frontend` (taste-skill) | (a) Exploration in `app/lab/`: composition and section blueprints only, always `draw.mjs --keep palette,type` (palette and type come from `DESIGN.md`). (b) Gate on any changed page: `inspect.mjs` (scenes) or `inspect.mjs --app` (workspace), always with `--allow gradient,button-fx,shadow,heavy-shadow,glass,hairline,outlined-box,palette-purple` — these are DESIGN.md decisions (light fall-off, L0 glow, glass forms, 1px chamfer edges, violet seasons). Every other rule (eyebrows, mono, numbering, micro-labels, icon cards, emoji, gradient text, placeholder data…) stays enforced. (c) `references/critique.md` look loop, three rounds max | Its palette and type draws; its house rules where they contradict `DESIGN.md` |
| `emil-design-eng` | `data-mode="workspace"` and workspace-grade controls inside scenes (form fields, the player): component craft, micro-interactions, when NOT to animate | Scene transitions, thresholds, the accepted moment, landing scenes — their motion is `DESIGN.md` §10 (beats, cuts, holds), which Emil's <300ms / ease-out rules would wrongly "fix" |
| `review-animations` | Review of the same workspace motion, Before/After/Why table | Anything Emil does not apply to |
| `gigly-design-dod` | The DoD checklist as a pass/fail report; invoked by `/ralphy-validate` on `design:` changes | — |
| Impeccable (`.impeccable/`) | `/audit` on every changed surface; `/normalize` when a migrated screen drifted from tokens; `/polish` as the last pass of a screen; `/critique` in the lab. Rules that contradict `DESIGN.md` (`dark-glow` first) go to `.impeccable/config.json` `ignoreRules` once, with the DESIGN.md section as the reason. Never run `document`: it would re-derive the old prototype as truth | — |

Two skills with an opinion on the same thing = pick by this table, not by preference. If the table is silent, `DESIGN.md` wins. Which skills a given change uses is listed in that change's command in `openspec/planning/design-migration.md`.

## 5. When the rules are silent

Do not fall back to "what dark sites usually do". Produce an exploration file with 2–3 variants and ask. A pause beats a default. Record every deviation from a DEFAULT in one line in the PR.

## 6. Hard limits

- No hex in `app/`; tokens only. No achromatic gray/black. One L0 per screen.
- No new design document anywhere. If `DESIGN.md` lacks something, add it there.
- No secrets, local paths or API keys in tracked files. `.claude/settings.json` is ignored on purpose.
- Russian UI copy; the words «премиум» / «люкс» never appear.
- Do not reproduce or embed `brand-visuals/refs/`; mood only.

## 7. Verify

`npm test` (vitest) · `npm run test:e2e` (Playwright) · `npm run lint:contrast` · `npm run validate:tokens` · `npx @google/design.md lint DESIGN.md` after editing `DESIGN.md`.
