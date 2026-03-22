# UI Specification Delta: auth-assets

This document contains specification changes for the auth-assets change.

---

## ADDED Requirements

### Requirement: Auth Asset File Organization
Auth screen assets MUST be organized in a dedicated directory structure with clear naming conventions.

#### Scenario: Assets are stored in public/assets/auth directory
- GIVEN the auth-assets change is implemented
- WHEN the file system is inspected
- THEN a `public/assets/auth/` directory MUST exist
- AND the directory MUST contain the following files:
  - `specialist-icon.svg` (32x32px user/person icon)
  - `client-icon.svg` (32x32px briefcase/bag icon)
  - `background-pattern.svg` (pixelated checkered pattern)
  - `logo.svg` or multiple logo variants (from Figma nodes 4116:427-432)

#### Scenario: Asset filenames follow kebab-case convention
- GIVEN any auth asset file
- WHEN the filename is inspected
- THEN the filename MUST use kebab-case (lowercase with hyphens)
- AND the filename MUST have `.svg` extension
- AND the filename MUST be descriptive of the asset's purpose

---

### Requirement: SVG Optimization and Accessibility
All SVG assets MUST be optimized for performance and accessible to assistive technologies.

#### Scenario: SVG files are under 10KB
- GIVEN any SVG file in `public/assets/auth/`
- WHEN the file size is measured
- THEN the file size MUST be less than 10KB (10,240 bytes)
- AND the SVG MUST NOT contain unnecessary metadata, comments, or editor artifacts

#### Scenario: SVG files include proper viewBox attributes
- GIVEN any SVG file in `public/assets/auth/`
- WHEN the SVG markup is inspected
- THEN the `<svg>` element MUST include a `viewBox` attribute
- AND the viewBox MUST define the coordinate system for proper scaling
- AND icon SVGs MUST use `viewBox="0 0 32 32"` for 32x32px dimensions

#### Scenario: Icon SVGs include accessibility attributes
- GIVEN an icon SVG file (specialist-icon.svg or client-icon.svg)
- WHEN the SVG markup is inspected
- THEN the `<svg>` element MUST include either:
  - An `aria-label` attribute with descriptive text (e.g., "Specialist role icon"), OR
  - A `role="img"` attribute with a child `<title>` element
- AND the accessibility text MUST describe the icon's purpose, not its visual appearance

#### Scenario: Decorative SVGs are marked as presentational
- GIVEN the background pattern SVG (background-pattern.svg)
- WHEN the SVG markup is inspected
- THEN the `<svg>` element MUST include `aria-hidden="true"` attribute
- AND the SVG MUST include `role="presentation"` attribute
- BECAUSE decorative elements should be hidden from screen readers

---

### Requirement: Centralized Asset Imports
Auth assets MUST be importable through a centralized module to ensure consistency and type safety.

#### Scenario: Asset constants file exports all auth assets
- GIVEN the auth-assets change is implemented
- WHEN a developer needs to use an auth asset
- THEN they MUST be able to import from a centralized location (e.g., `lib/assets.ts` or `components/auth/icons.tsx`)
- AND the module MUST export constants or components for each asset
- AND the exports MUST include TypeScript types for props (if components)

#### Scenario: Asset components accept className prop
- GIVEN an asset exported as a React component
- WHEN the component is used in JSX
- THEN the component MUST accept a `className` prop for Tailwind styling
- AND the className MUST be applied to the root `<svg>` element
- AND the component MUST preserve default dimensions while allowing override via className

---

### Requirement: Visual Fidelity with Figma Design
Integrated assets MUST match the Figma design exactly in appearance and dimensions.

#### Scenario: Icon dimensions match Figma specifications
- GIVEN the specialist-icon.svg or client-icon.svg
- WHEN the icon is rendered in the browser
- THEN the icon MUST render at 32x32 pixels by default
- AND the icon MUST match the visual appearance of Figma node 4113:535 (specialist) or corresponding client node

#### Scenario: Color values match Figma exactly
- GIVEN any SVG asset with color fills or strokes
- WHEN the SVG markup is inspected
- THEN color values MUST use exact hex codes from Figma design
- AND color values MUST NOT be approximated or rounded
- AND the visual appearance in browser MUST match Figma preview

#### Scenario: Background pattern matches Figma dimensions and colors
- GIVEN the background-pattern.svg
- WHEN the pattern is rendered in the browser
- THEN the pattern MUST match the pixelated checkered pattern from the bottom of Figma node 4100-385
- AND the pattern colors MUST match Figma exactly
- AND the pattern dimensions MUST preserve the aspect ratio from Figma

---

### Requirement: Asset Integration in Auth Pages
Auth assets MUST be integrated into login and register pages with proper rendering and positioning.

#### Scenario: Role icons appear in register page role selection
- GIVEN a user visits the `/register` page
- WHEN the role selection UI renders
- THEN the specialist icon MUST appear next to the SPECIALIST role option
- AND the client icon MUST appear next to the CLIENT role option
- AND the icons MUST be visually distinct and recognizable

#### Scenario: Assets render without layout shift
- GIVEN a user loads an auth page (login or register)
- WHEN the page renders
- THEN assets MUST NOT cause cumulative layout shift (CLS)
- AND assets MUST have explicit width/height attributes or CSS dimensions
- AND assets MUST load without blocking page interactivity

---

## Test Plan

### Visual Fidelity Tests
1. Open Figma design (node 4100-385) in one browser tab
2. Open `/register` page in another browser tab
3. Compare specialist icon, client icon, and background pattern side-by-side
4. Verify exact visual match (colors, dimensions, shapes)
5. Take screenshots and overlay for pixel-perfect comparison if needed

### File Size Tests
```bash
# Verify all SVG files are under 10KB
ls -lh public/assets/auth/*.svg | awk '{if ($5 ~ /K/) print $9, $5}'
# Expected: All files show size < 10K
```

### Accessibility Tests
1. Open `/register` page in browser
2. Open browser DevTools and inspect SVG elements
3. Verify `aria-label` or `role="img"` + `<title>` on icon SVGs
4. Verify `aria-hidden="true"` on decorative background pattern
5. Enable screen reader (NVDA/JAWS/VoiceOver)
6. Navigate to role selection area
7. Verify screen reader announces "Specialist role icon" and "Client role icon"
8. Verify screen reader does NOT announce background pattern

### Import Tests
```typescript
// Verify centralized imports work
import { SpecialistIcon, ClientIcon } from '@/lib/assets'
// OR
import { SpecialistIcon, ClientIcon } from '@/components/auth/icons'

// Verify className prop works
<SpecialistIcon className="w-8 h-8 text-blue-500" />
```

### Responsive Tests
1. Open `/register` page in browser
2. Open DevTools responsive mode
3. Test at breakpoints: 320px, 768px, 1024px, 1920px
4. Verify icons scale proportionally
5. Verify background pattern adapts without distortion
6. Verify no horizontal scrolling or overflow
