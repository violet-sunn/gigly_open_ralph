# Spec delta — planning

This planning-document change adds **no new requirements** to the `planning` capability. The
generated document MUST conform to the existing specification at
`openspec/specs/planning/spec.md` (Planning Document Format, Creation, Naming, Lifecycle,
Integration). It is referenced, not duplicated.

## MODIFIED Requirements

### Requirement: Planning Document Format
The planning document produced by this change (`openspec/planning/figma-grounded-ui-reconciliation.md`)
MUST satisfy the existing "Planning Document Format" requirement unchanged — this delta only records
that the document is **grounded in concrete Figma-extracted data** (node-ids + measured values from
`docs/figma-*` ) rather than estimated values.

#### Scenario: Changes cite authoritative Figma sources
**Given** the "Changes" and "Scope" sections of `figma-grounded-ui-reconciliation.md`
**When** reviewing each change and the scope
**Then** screen-reconciliation changes MUST reference a concrete Figma node-id
**And** system-addition changes MUST cite the originating import doc (`docs/figma-components-export.md`,
`docs/figma-screens-export.md`, `docs/figma-component-audit.md`, or `docs/figma-tokens-export.json`)
**And** the document MUST otherwise satisfy every scenario of the base "Planning Document Format" requirement.
