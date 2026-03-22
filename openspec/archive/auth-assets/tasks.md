# Implementation Tasks: auth-assets

## Task 1: Extract Figma Design Context and Asset Specifications

**Implementation Notes:**
- Use Figma MCP tool `mcp__figma__get_design_context` to extract design context for node 4100-385
- Extract file key from URL: `Nexptl0M63VM62lPVkjxxx`
- Extract node ID from URL: `4100-385` (convert to `4100:385` format)
- Review returned design context for asset URLs and specifications
- Identify specific nodes for each asset:
  - Specialist icon: node 4113:535
  - Client icon: (identify from design context)
  - Background pattern: (identify from bottom of design)
  - Logo assets: nodes 4116:427-432
- Document exact dimensions, colors, and positioning from Figma

**Test Plan:**
```bash
# Verify Figma MCP tool returns design context successfully
# Expected: JSON response with code, assets, and screenshot
# Verify asset URLs are accessible and downloadable
# Verify dimensions and colors are documented
```

---

## Task 2: Create Directory Structure and Specialist Icon SVG

**Implementation Notes:**
- Create `public/assets/auth/` directory
- Use Figma MCP tool `mcp__figma__get_screenshot` or `mcp__figma__get_design_context` to extract specialist icon (node 4113:535)
- Create `public/assets/auth/specialist-icon.svg` with:
  - `viewBox="0 0 32 32"` for 32x32px dimensions
  - `aria-label="Specialist role icon"` for accessibility
  - Exact colors from Figma (hex codes)
  - Clean SVG markup (no unnecessary attributes)
- Optimize SVG using manual cleanup or SVGO if needed
- Verify file size is under 10KB

**Test Plan:**
```bash
# Verify directory exists
ls -la public/assets/auth/

# Verify file exists and size
ls -lh public/assets/auth/specialist-icon.svg
# Expected: File size < 10K

# Verify SVG is valid XML
xmllint --noout public/assets/auth/specialist-icon.svg
# Expected: No errors

# Verify accessibility attributes
grep -E 'aria-label|role="img"' public/assets/auth/specialist-icon.svg
# Expected: Match found

# Visual test: Open in browser
# Navigate to: file:///path/to/public/assets/auth/specialist-icon.svg
# Expected: Icon renders correctly at 32x32px
```

---

## Task 3: Create Client Icon SVG

**Implementation Notes:**
- Use Figma MCP tool to extract client icon (briefcase/bag icon, identify node from design context)
- Create `public/assets/auth/client-icon.svg` with:
  - `viewBox="0 0 32 32"` for 32x32px dimensions
  - `aria-label="Client role icon"` for accessibility
  - Exact colors from Figma (hex codes)
  - Clean SVG markup
- Optimize SVG to ensure file size under 10KB
- Verify visual match with Figma design

**Test Plan:**
```bash
# Verify file exists and size
ls -lh public/assets/auth/client-icon.svg
# Expected: File size < 10K

# Verify SVG is valid XML
xmllint --noout public/assets/auth/client-icon.svg
# Expected: No errors

# Verify accessibility attributes
grep -E 'aria-label|role="img"' public/assets/auth/client-icon.svg
# Expected: Match found

# Visual comparison test
# 1. Open Figma design (node 4100-385)
# 2. Open file:///path/to/public/assets/auth/client-icon.svg
# 3. Compare side-by-side
# Expected: Exact visual match
```

---

## Task 4: Create Background Pattern SVG

**Implementation Notes:**
- Use Figma MCP tool to extract background pattern (pixelated checkered pattern from bottom of design)
- Identify exact node ID for pattern from design context
- Create `public/assets/auth/background-pattern.svg` with:
  - Appropriate `viewBox` based on pattern dimensions from Figma
  - `aria-hidden="true"` and `role="presentation"` (decorative element)
  - Exact colors from Figma for checkered pattern
  - Optimized SVG markup
- Consider using `<pattern>` element for repeating pattern if applicable
- Verify file size under 10KB

**Test Plan:**
```bash
# Verify file exists and size
ls -lh public/assets/auth/background-pattern.svg
# Expected: File size < 10K

# Verify decorative attributes
grep -E 'aria-hidden="true"|role="presentation"' public/assets/auth/background-pattern.svg
# Expected: Both attributes found

# Visual test in browser
# Create test HTML file with pattern as background
# Compare with Figma design
# Expected: Pattern matches exactly (colors, dimensions, pixel grid)
```

---

## Task 5: Extract and Optimize Logo Assets

**Implementation Notes:**
- Use Figma MCP tool to extract logo assets from nodes 4116:427-432
- Determine if multiple logo variants exist (full logo, icon only, wordmark, etc.)
- Create SVG files in `public/assets/auth/` with descriptive names:
  - `logo.svg` (primary logo)
  - `logo-icon.svg` (if icon variant exists)
  - `logo-wordmark.svg` (if wordmark variant exists)
- Each logo SVG must include:
  - Appropriate `viewBox` based on logo dimensions
  - `aria-label="Gigly logo"` or similar
  - Exact brand colors from Figma
- Optimize all logo files to ensure under 10KB each
- Verify visual fidelity with Figma

**Test Plan:**
```bash
# Verify all logo files exist
ls -lh public/assets/auth/logo*.svg
# Expected: One or more logo files, all < 10K

# Verify accessibility attributes on each logo
for file in public/assets/auth/logo*.svg; do
  echo "Checking $file"
  grep -E 'aria-label' "$file"
done
# Expected: All logos have aria-label

# Visual comparison test
# Open each logo SVG in browser
# Compare with Figma nodes 4116:427-432
# Expected: Exact visual match for all variants
```

---

## Task 6: Create Centralized Asset Module

**Implementation Notes:**
- Create `lib/assets.ts` or `components/auth/icons.tsx` for centralized exports
- Export React components for each icon asset:
  ```typescript
  export function SpecialistIcon({ className }: { className?: string }) {
    return (
      <svg
        viewBox="0 0 32 32"
        aria-label="Specialist role icon"
        className={className}
      >
        {/* SVG content */}
      </svg>
    )
  }
  ```
- Export components for ClientIcon, Logo, etc.
- For background pattern, export as component or constant path
- Add TypeScript types for all exports
- Ensure className prop is properly applied to root SVG element
- Test imports work from auth pages

**Test Plan:**
```typescript
// Test file: __tests__/unit/assets.test.tsx
import { SpecialistIcon, ClientIcon } from '@/lib/assets'
import { render } from '@testing-library/react'

test('SpecialistIcon renders with default props', () => {
  const { container } = render(<SpecialistIcon />)
  const svg = container.querySelector('svg')
  expect(svg).toHaveAttribute('viewBox', '0 0 32 32')
  expect(svg).toHaveAttribute('aria-label', 'Specialist role icon')
})

test('SpecialistIcon accepts className prop', () => {
  const { container } = render(<SpecialistIcon className="w-8 h-8 text-blue-500" />)
  const svg = container.querySelector('svg')
  expect(svg).toHaveClass('w-8', 'h-8', 'text-blue-500')
})

test('ClientIcon renders with accessibility attributes', () => {
  const { container } = render(<ClientIcon />)
  const svg = container.querySelector('svg')
  expect(svg).toHaveAttribute('aria-label', 'Client role icon')
})
```

---

## Task 7: Integrate Assets into Register Page

**Implementation Notes:**
- Update `app/register/page.tsx` to import icon components
- Add SpecialistIcon next to SPECIALIST role selection button/option
- Add ClientIcon next to CLIENT role selection button/option
- Apply appropriate Tailwind classes for sizing and positioning (e.g., `w-8 h-8`)
- Ensure icons are visually aligned with role labels
- Add background pattern if design calls for it on register page
- Test responsive behavior on mobile/tablet/desktop

**Test Plan:**
```bash
# Visual test
# 1. Run dev server: npm run dev
# 2. Navigate to http://localhost:3000/register
# 3. Verify specialist icon appears next to SPECIALIST option
# 4. Verify client icon appears next to CLIENT option
# 5. Verify icons are properly sized and aligned
# Expected: Icons render correctly and match Figma design

# Responsive test
# 1. Open DevTools responsive mode
# 2. Test at 320px, 768px, 1024px widths
# 3. Verify icons scale appropriately
# Expected: No layout breaks, icons remain visible and proportional

# Accessibility test with screen reader
# 1. Enable screen reader (NVDA/JAWS/VoiceOver)
# 2. Navigate to role selection area
# 3. Verify screen reader announces icon labels
# Expected: "Specialist role icon" and "Client role icon" announced
```

---

## Task 8: Integrate Assets into Login Page (if applicable)

**Implementation Notes:**
- Review Figma design to determine if login page uses any assets
- If logo is used on login page, update `app/login/page.tsx` to import Logo component
- If background pattern is used, integrate into login page layout
- Ensure consistent styling with register page
- Test visual appearance and responsive behavior

**Test Plan:**
```bash
# Visual test
# 1. Navigate to http://localhost:3000/login
# 2. Verify any assets (logo, pattern) render correctly
# 3. Compare with Figma design
# Expected: Visual match with Figma

# Responsive test
# Test at multiple breakpoints
# Expected: Assets adapt without breaking layout
```

---

## Task 9: Comprehensive Visual Fidelity and Accessibility Testing

**Implementation Notes:**
- Perform side-by-side comparison of implemented pages with Figma design
- Use browser screenshot tools or overlay technique for pixel-perfect comparison
- Test all assets with screen reader to verify accessibility
- Verify file sizes for all SVG assets
- Document any deviations from Figma design (if unavoidable)

**Test Plan:**
```bash
# File size verification
echo "=== Auth Asset File Sizes ==="
ls -lh public/assets/auth/*.svg | awk '{print $9, $5}'
# Expected: All files < 10K

# Accessibility verification
echo "=== Accessibility Attributes ==="
for file in public/assets/auth/*.svg; do
  echo "File: $file"
  grep -E 'aria-label|aria-hidden|role=' "$file" || echo "  No accessibility attributes found"
done
# Expected: Icons have aria-label, pattern has aria-hidden

# Visual fidelity test
# 1. Open Figma: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385
# 2. Open register page: http://localhost:3000/register
# 3. Take screenshot of both
# 4. Use image comparison tool or overlay in Photoshop/Figma
# Expected: Assets match exactly (colors, dimensions, positioning)

# Screen reader test (manual)
# 1. Enable screen reader
# 2. Navigate through register page
# 3. Verify icon labels are announced
# 4. Verify decorative pattern is NOT announced
# Expected: Icons accessible, pattern hidden from screen reader

# Performance test
# 1. Open DevTools Network tab
# 2. Hard refresh register page
# 3. Check asset load times
# Expected: All SVG assets load in < 100ms, no blocking
```

---

## Summary

Total tasks: 9
Estimated effort: 4-6 hours

**Critical path:**
1. Extract Figma design context (Task 1)
2. Create all SVG assets (Tasks 2-5)
3. Create centralized module (Task 6)
4. Integrate into pages (Tasks 7-8)
5. Comprehensive testing (Task 9)

**Dependencies:**
- Figma MCP tool must be configured and accessible
- Figma design URL must be accessible
- Node IDs must be correct (verify during Task 1)

**Success criteria:**
- ✅ All 4 asset types created and stored in `public/assets/auth/`
- ✅ All SVG files under 10KB
- ✅ All assets accessible (proper aria attributes)
- ✅ Assets integrated into register page (and login if applicable)
- ✅ Visual match with Figma design confirmed
- ✅ Screen reader announces icon labels correctly
- ✅ Centralized import module created and tested
