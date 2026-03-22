# Change Proposal: auth-assets

## Problem Statement

The authentication screens (login and register pages) currently lack visual assets that establish brand identity and improve user experience. The Figma design includes specific iconography (specialist/client role icons), decorative elements (pixelated background pattern), and logo assets that need to be extracted and integrated into the codebase.

Without these assets:
- Auth screens feel incomplete and don't match the approved design
- Role selection lacks visual distinction between CLIENT and SPECIALIST options
- Brand identity is not established at the critical first touchpoint
- The design-to-code workflow is incomplete

## Proposed Solution

Extract and integrate auth screen assets from the Figma design (node 4100-385) using the Figma MCP tool. Create four categories of assets:

1. **Specialist Icon** (32x32px user/person icon, node 4113:535) - for SPECIALIST role selection
2. **Client Icon** (32x32px briefcase/bag icon) - for CLIENT role selection
3. **Background Pattern** (pixelated checkered pattern) - decorative element for auth screens
4. **Logo Assets** (nodes 4116:427-432) - brand identity elements

All assets will be:
- Stored in `public/assets/auth/` directory for static serving
- Optimized as SVG files (<10KB each) for performance
- Accessible with proper aria-labels and viewBox attributes
- Wrapped in constants or components for easy import and type safety

## Constraints

### MUST Requirements
- Assets MUST match Figma design exactly (1:1 visual fidelity)
- SVG files MUST be optimized and under 10KB each
- SVG files MUST include proper `viewBox` attributes for scaling
- SVG files MUST include `aria-label` or `role` attributes for accessibility
- Assets MUST be stored in `public/assets/auth/` directory
- Asset imports MUST be centralized (constants file or component wrappers)

### SHOULD Requirements
- Asset components SHOULD accept className props for styling flexibility
- SVG code SHOULD be clean (no unnecessary metadata, comments, or editor artifacts)
- Color values SHOULD use exact hex codes from Figma

### Non-Goals
- Redesigning auth screens beyond asset integration
- Creating animated or interactive versions of assets
- Supporting multiple asset variants or themes (single design only)
- Integrating assets into non-auth pages (scope limited to login/register)

## Success Criteria

1. All four asset types are extracted from Figma and stored in `public/assets/auth/`
2. Assets render correctly on login and register pages
3. Visual comparison confirms exact match with Figma design
4. All SVG files are under 10KB
5. Screen reader announces appropriate labels for icon assets
6. Assets are importable via centralized constants or components

## Affected Areas

- `public/assets/auth/` (new directory)
- `app/login/page.tsx` (asset integration)
- `app/register/page.tsx` (asset integration)
- `lib/assets.ts` or `components/auth/icons.tsx` (new file for asset exports)
- `openspec/specs/ui/spec.md` (spec delta for asset requirements)

## Risks & Mitigations

**Risk**: Figma MCP tool may not extract assets in optimal format
**Mitigation**: Manual SVG optimization using SVGO or similar tools if needed

**Risk**: Asset file sizes exceed 10KB threshold
**Mitigation**: Remove unnecessary SVG metadata, simplify paths, use compression

**Risk**: Color values don't match Figma exactly due to color space differences
**Mitigation**: Extract exact hex values from Figma and verify in browser

**Risk**: Assets break responsive layout on mobile devices
**Mitigation**: Use proper viewBox and test on multiple screen sizes
