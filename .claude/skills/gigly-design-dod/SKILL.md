---
name: gigly-design-dod
description: Run the Gigly design definition of done (DESIGN.md §15) on a design: change and report pass/fail per item. Use at the end of any UI task, inside /ralphy-validate for design: changes, or when asked "does this meet DESIGN.md".
---

# gigly-design-dod

You are the last gate before a `design:` change is accepted. You do not fix; you report. The report is a table, one row per DoD item, with PASS / FAIL / N/A / NEEDS-HUMAN and one line of evidence each.

## Procedure

1. Read `DESIGN.md` §0 (rule hardness), §2.1–2.3, §14, §15. Read the change's `proposal.md`: it must name the screen's mode, artwork slot and the one L0 action. Missing → FAIL on the first item, stop.
2. Run the deterministic checks and paste their output as evidence:
   - `node scripts/design-system/design-dod.mjs <changed files>` — hex, radius, box-shadow default, scroll listeners, easeOutExpo, monospace, banned words, arrow CTAs, achromatic tokens, one L0 per page, declared mode.
   - `npm run lint:contrast` and `npm run validate:tokens` if they have been ported to the OKLCH tokens; otherwise mark the contrast item NEEDS-HUMAN and say the validators are still bound to the legacy `design-tokens.json`.
   - Impeccable `/audit` on the changed surface; zero findings outside `.impeccable/config.json` ignore list.
   - Playwright screenshots at 390 and 1440 for the changed routes; compare with the previous baseline when one exists.
3. Judge the items a script cannot prove and mark them NEEDS-HUMAN with a specific question, never a guess: does the art placement follow the artwork's zones; is the brightest pixel the L0 in workspace mode; do thresholds read as cuts; does the screen read as Gigly or as a generic dark site.
4. Any deviation from a DEFAULT must be recorded in `proposal.md` in one line. A recorded deviation is PASS; an unrecorded one is FAIL.

## Output

```
| # | Item (DESIGN.md §15) | Result | Evidence |
```
followed by: the list of FAIL items with the exact file and line, the list of NEEDS-HUMAN questions, and one verdict line: `DoD: PASS` / `DoD: FAIL (n items)`.

Never soften a FAIL into a PASS because the work looks good. Never promote a DEFAULT to a LAW: if an item is a DEFAULT and the deviation is recorded, it passes.
