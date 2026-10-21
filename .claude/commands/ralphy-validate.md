# /ralphy-validate (Validate against acceptance criteria)

You are validating an OpenSpec change.

## Goal
Prove that the implementation matches the requirements/scenarios and that tests pass.

## Steps
1. Identify the active change folder under `openspec/changes/`.
2. Extract acceptance criteria from:
   - spec scenarios in `openspec/changes/<change-name>/specs/**`
   - test plan notes in `tasks.md`
3. Run tests and/or deterministic verification commands.
4. If failures occur, fix them and re-run until green.

## Output
Report:
- What passed
- What failed (with next actions)
- Any missing tests needed to satisfy acceptance criteria


## Design (only for changes named `design:` or touching `app/**` UI)

In addition to the steps above:
1. Confirm the change's `proposal.md` names the screen mode, the artwork slot and the one L0 action (CLAUDE.md §3).
2. Run `node scripts/design-system/design-dod.mjs <changed files>`; any finding without a recorded deviation in `proposal.md` is a failure.
3. Run Impeccable `/audit` on the changed surface; findings outside `.impeccable/config.json` ignore list are failures.
4. Capture Playwright screenshots at 390 and 1440 for the changed routes; attach or compare with the baseline.
5. Invoke the `gigly-design-dod` skill and include its table in the report. The change is not complete while the verdict is `DoD: FAIL`.
6. Never run Impeccable `document`; `DESIGN.md` is hand-maintained.
