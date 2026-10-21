# create-design-migration-plan

**Type:** Planning Document Change (generates a strategic planning document)
**Created:** 2026-10-21
**Generates:** `openspec/planning/design-migration.md`
**References spec:** `openspec/specs/planning/spec.md` (planning-document format — not duplicated here)

## Why

The previous design campaign, `openspec/planning/transport-design-from-prototype.md` (COMPLETE), transported `gigly_full_design/` into the app and ended four campaigns of drift. It moved the *old* design. The product now has a new visual direction recorded in `DESIGN.md` at the repo root (one season hue per scene, rendered light, chamfered shape, Cyrillic-first type, music-video motion, scene / workspace modes, MVP vs HOUSE paths). No shipped screen follows it, and the old token engine (`openspec/specs/ui/design-tokens.json` → `scripts/generated-tokens.css`) cannot express it.

The repo was also cleaned beforehand (`chore/cleanup`, merged in PR #1): seven competing design documents archived, nine surplus skills archived, `CLAUDE.md` turned into a router with a skills table, `design-dod.mjs` and the `gigly-design-dod` skill wired into `/ralphy-validate`. This campaign builds on that state.

## What will be analyzed

1. `DESIGN.md` in full, `design.config.ts` (path = MVP), `PRODUCT.md`, `openspec/project.md`.
2. The archived campaign `transport-design-from-prototype.md`: its method (transport, not reconstruct), its lessons (reconstruction by eye drifts; "E2E green" is not a design gate; verification is the user's eyes on a screenshot), its pilot checkpoint.
3. The current UI: every `page.tsx` route, `app/_design/*`, `app/components/*`, the token engine, the validators in `scripts/design-system/`, the E2E suite that guards each screen.
4. The installed skills (`.claude/skills/`, Impeccable via `.impeccable/`) and where each one's rules conflict with `DESIGN.md`.

## What the planning document contains

A document following `openspec/specs/planning/spec.md` (Problem, Why This Matters, Scope, Changes, Status) plus a Method section (how one screen migrates) and a Skills section (which skill works at which stage, with the allow lists that keep each skill from undoing a `DESIGN.md` decision). Each of the twelve Changes carries: the screen's mode / slot / L0, requirements, non-goals, the E2E specs that must stay green, and a `Skills:` line naming exactly what runs. Change 2 (lab) and change 4 (pilot) are user-gated stops.

## Scope / Non-goals

- **In scope:** producing the planning document and recording the skills routing in `CLAUDE.md` §4.
- **Non-goals:** executing any migration change; touching `app/`, `lib/`, `prisma/`, `openspec/specs/`; HOUSE-path work (palette extraction, foundry type, commissioned art), which is listed as follow-ups.

## References

- Planning format: `openspec/specs/planning/spec.md`, `openspec/planning/README.md`
- Prior campaign: `openspec/planning/transport-design-from-prototype.md`
- Design truth: `DESIGN.md`; routing: `CLAUDE.md`
