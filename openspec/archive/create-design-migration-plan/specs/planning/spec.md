# Spec delta — planning

This planning-document change adds **no new requirements** to the `planning` capability. The generated document MUST conform to `openspec/specs/planning/spec.md`. It is referenced, not duplicated.

## MODIFIED Requirements

### Requirement: Planning Document Format
The planning document produced by this change (`openspec/planning/design-migration.md`) MUST satisfy the existing "Planning Document Format" requirement unchanged. This delta records that every change command in it also names the skills that run.

#### Scenario: Changes name their skills
**Given** the "Changes" section of `design-migration.md`
**When** reviewing each `/ralphy-plan` command
**Then** each command MUST end with a `Skills:` line consistent with `CLAUDE.md` §4
**And** no change in scene mode MUST list `emil-design-eng` or `review-animations` for scene motion
**And** every `design-taste-frontend` gate MUST carry the DESIGN.md allow list
**And** the document MUST otherwise satisfy every scenario of the base "Planning Document Format" requirement.
