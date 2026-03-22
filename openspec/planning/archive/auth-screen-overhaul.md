# Auth Screen Overhaul

**Created:** 2026-03-21
**Status:** PLANNED

## Problem

Current authentication screens use basic form layouts without visual polish or branding emphasis. The Figma design shows a sophisticated auth experience with role-first selection, icon-based cards, decorative background patterns, and professional B2B aesthetic. The current implementation has separate /login and /register pages with inline forms, while the Figma design suggests a unified entry point with role selection before credentials. This is not a reskin but a total conversion requiring new components, assets, architectural changes, and visual refinement to match the "high-end B2B marketplace" positioning.

## Why This Matters

Authentication is the first impression for all users. The current generic forms don't reinforce Gigly's positioning as a professional, high-end B2B marketplace (from project.md: "Professional B2B Experience"). The Figma design creates immediate role clarity through visual selection, establishes brand identity with logo treatment and decorative elements, and signals quality through polished UI. This affects user perception, conversion rates, and brand consistency. A well-designed auth experience builds trust before users even create an account.

## Scope

**Figma Design Reference:**
`https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385`

All implementation MUST strictly match this Figma design. Use the Figma MCP tool during implementation to fetch exact specifications.

This initiative affects multiple systems:

**Auth Flow Architecture:**

- Current: Direct navigation to /login or /register with forms
- Target: Unified entry point with role selection, then route to credentials
- Decision: Create /auth landing page with role selection, route to /login or /register with role query param
- Impact: New route, query param handling, role pre-selection logic

**Visual Components:**

- Role selector cards with icons, hover states, selected states (blue border)
- Decorative background pattern (pixelated/checkered bottom pattern)
- Logo treatment with semi-transparent container
- Card-based layout with specific spacing, borders, shadows
- Button variants (primary solid, secondary transparent)

**Assets Required:**

- Specialist icon (user/person icon from Figma)
- Client icon (briefcase/bag icon from Figma)
- Decorative background pattern SVG (bottom pixelated pattern)
- Logo assets (if not already available)

**Design Tokens:**

- Background colors: #01030e (dark brand), #060813 (surface level 1), #10121c (surface level 2)
- Border colors: #242935 (neutral strong), #0265dc (brand blue)
- Brand blue: #0088FF (primary button)
- Typography: Specific font sizes, line heights from Figma
- Border radius: 20px for cards, 10px for buttons, 25px for main container
- Spacing: 40px padding, 47px gap, specific component spacing

**Localization:**

- Figma shows Russian text ("Вход", "Войти", "Зарегестрироватся", "Профиль специалиста", "Профиль Компании")
- Decision needed: Keep English for MVP, add i18n later, or implement Russian now
- Recommendation: Keep English for consistency with existing app, note Russian as post-MVP

**Testing:**

- E2E tests for new /auth landing page
- E2E tests for role selection → login flow
- E2E tests for role selection → register flow
- Visual regression tests for new components
- Accessibility tests for keyboard navigation and screen readers

**Dependencies:**

- Must complete before: Any other auth-related features (password reset, OAuth)
- Blocks: None (can be developed in parallel with other features)
- Depends on: Design token system (already exists)

**Risks:**

- Asset quality: Figma assets may need recreation as SVGs
- Font availability: Figma uses "LINE Seed JP" and "Manrope" - may need font loading or substitution
- Responsive design: Figma shows desktop only - need to design mobile experience
- Migration: Users with bookmarked /login or /register links need redirects
- Localization scope creep: Resist adding full i18n in this change

## Changes

Execute these changes in order:

### 1. Design Token Updates

```bash
/ralphy-plan auth-design-tokens "Update design tokens for auth screen overhaul based on Figma design: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385. Requirements: (1) Use Figma MCP tool to fetch exact color values, spacing, border-radius, and typography specs from the design, (2) Add missing colors (#01030e dark-brand-1300, #10121c surface-level-2, #0265dc brand-blue, #0088FF primary-blue), (3) Add border-radius tokens (20px for cards, 10px for buttons, 25px for container), (4) Add spacing tokens matching Figma (40px padding, 47px gap, 24px internal gaps), (5) Update design-tokens.json and regenerate Tailwind config, (6) Document token usage for auth components. Test: verify tokens available in Tailwind classes, verify CSS variables generated, build succeeds, visual comparison with Figma shows matching colors and spacing."
```

### 2. Auth Assets Preparation

```bash
/ralphy-plan auth-assets "Create and integrate auth screen assets from Figma design: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385. Requirements: (1) Use Figma MCP tool to extract asset URLs and specifications, (2) Create specialist icon SVG (32x32px user/person icon, exact match to Figma node 4113:535), (3) Create client icon SVG (32x32px briefcase/bag icon, exact match to Figma), (4) Create decorative background pattern SVG (pixelated checkered pattern from bottom of design, exact colors and dimensions), (5) Extract and optimize logo assets from Figma (node 4116:427-432), (6) Store assets in public/assets/auth/ directory, (7) Create asset constants or component wrappers for easy import, (8) Ensure SVGs are optimized and accessible (aria-labels, proper viewBox). Test: verify assets render correctly, verify exact visual match with Figma, verify file sizes reasonable (<10KB each), verify accessibility with screen reader."
```

### 3. Auth UI Components

```bash
/ralphy-plan auth-ui-components "Build reusable auth UI components matching Figma design: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385. Requirements: (1) Use Figma MCP tool to fetch exact component specs and measurements, (2) RoleCard component (node 4113:481, 4116:396) with 32px icon, 17px text, 20px padding, 24px gap, 20px border-radius, hover state, selected state with 2px #0265dc border, (3) AuthContainer component with 418px width, 540px height, 25px border-radius, #060813 background, #242935 border, centered layout, (4) LogoHeader component (node 4106:615) with semi-transparent background (rgba(49,54,67,0.5)), 10px border-radius, 7px/9px padding, (5) AuthButton component with primary variant (50px height, #0088FF background, 10px border-radius) and secondary variant (rgba(0,136,255,0.24) background), (6) All components use design tokens, (7) Components are accessible (keyboard navigation, ARIA labels, focus states). Test: visual comparison with Figma shows pixel-perfect match, Storybook stories for each component with all states, accessibility audit passes."
```

### 4. Auth Landing Page

```bash
/ralphy-plan auth-landing-page "Create /auth landing page matching Figma design: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385. Requirements: (1) Use Figma MCP tool to verify exact layout and spacing, (2) New route at /auth with full-screen dark background (#01030e), (3) Centered card (node 4101:522) with LogoHeader at top, (4) Two RoleCard components with 17px gap between them (Specialist with user icon, Client with briefcase icon), (5) Two AuthButton components with 21px gap (primary 'Войти'/'Login', secondary 'Зарегестрироватся'/'Register'), (6) 30px gap between role cards section and buttons section, (7) 40px padding inside card, 47px gap between logo and content, (8) Decorative background pattern at bottom (node 4111:399), (9) On role selection + button click, navigate to /login?role=X or /register?role=X, (10) Responsive design (mobile: reduce card width to 90vw, stack cards vertically), (11) Middleware allows unauthenticated access to /auth. Test: visual comparison with Figma shows exact match, E2E test for role selection → login navigation, E2E test for role selection → register navigation, verify query params passed correctly, verify responsive layout on mobile."
```

### 5. Login Page Redesign

```bash
/ralphy-plan login-page-redesign "Redesign /login page to match Figma design: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385. Requirements: (1) Use Figma MCP tool to fetch exact specifications for login variant, (2) Apply AuthContainer with exact dimensions (418x540px, 25px border-radius, 40px padding), (3) LogoHeader at top with 'Вход'/'Login' heading (22px Manrope SemiBold or fallback), (4) Read role from query param (?role=SPECIALIST or ?role=CLIENT), (5) Display selected role card with 2px blue border if provided, show unselected role card without border, (6) Email and password input fields with exact styling (#10121c background, #242935 border, 20px border-radius, 20px padding), (7) Primary AuthButton for submit (50px height, #0088FF background, 'Войти'/'Login' text), (8) Secondary link to /register ('Зарегестрироватся'/'Register'), (9) Decorative background pattern at bottom, (10) Maintain existing auth action and validation, (11) Responsive design. Test: visual comparison with Figma shows exact match, E2E test for login with role param, E2E test for login without role param (graceful fallback), verify existing login functionality works, verify rate limiting still active."
```

### 6. Register Page Redesign

```bash
/ralphy-plan register-page-redesign "Redesign /register page to match Figma design: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385. Requirements: (1) Use Figma MCP tool to fetch exact specifications, (2) Apply AuthContainer with exact dimensions (418x540px, 25px border-radius, 40px padding), (3) LogoHeader at top with 'Регистрация'/'Register' heading (22px Manrope SemiBold or fallback), (4) Read role from query param and pre-select with blue border if provided, (5) If no role param, show both RoleCard components for selection (maintain current behavior), (6) Email and password input fields with exact styling (#10121c background, #242935 border, 20px border-radius, 20px padding), (7) Primary AuthButton for submit (50px height, #0088FF background, 'Зарегестрироватся'/'Sign up' text), (8) Secondary link to /login ('Войти'/'Login'), (9) Decorative background pattern at bottom, (10) Maintain existing validation (password requirements, rate limiting), (11) Responsive design. Test: visual comparison with Figma shows exact match, E2E test for register with role param, E2E test for register without role param, verify role pre-selection works, verify existing validation works."
```

### 7. Auth Navigation Updates

```bash
/ralphy-plan auth-navigation-updates "Update navigation and redirects for new auth flow based on Figma design: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385. Requirements: (1) Update homepage / to link to /auth instead of /register, (2) Update middleware to allow /auth for unauthenticated users, (3) Update any internal links to auth pages to point to /auth, (4) Preserve backward compatibility (direct /login and /register still work for bookmarked links), (5) Consider adding soft redirects from /login and /register to /auth for better UX (optional). Test: E2E test for homepage → /auth → role selection → login flow, verify middleware allows /auth access, verify direct /login and /register still work, verify authenticated users redirected from auth pages to dashboard."
```

### 8. Auth E2E Test Suite

```bash
/ralphy-plan auth-e2e-tests "Comprehensive E2E tests for new auth flow matching Figma design: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385. Requirements: (1) Test complete flow: /auth → select role → login → dashboard, (2) Test complete flow: /auth → select role → register → dashboard, (3) Test direct /login access (backward compatibility), (4) Test direct /register access (backward compatibility), (5) Test role pre-selection from query params (?role=SPECIALIST, ?role=CLIENT), (6) Test visual states (role card hover, role card selected with blue border, button hover), (7) Test responsive behavior (mobile viewport, card stacking), (8) Test accessibility (keyboard navigation, screen reader announcements, focus states), (9) Test error states (invalid credentials, validation errors, rate limiting), (10) Visual regression tests comparing screenshots with Figma design. Test: all E2E tests pass, visual regression tests show <5% pixel difference from Figma, coverage includes happy path and error cases, tests run in CI."
```

## Status

- [ ] auth-design-tokens
- [ ] auth-assets
- [ ] auth-ui-components
- [ ] auth-landing-page
- [ ] login-page-redesign
- [ ] register-page-redesign
- [ ] auth-navigation-updates
- [ ] auth-e2e-tests

**Progress:** 0/8 changes completed
**Started:** Not started
**Completed:** Not completed

## Notes

**Implementation Fidelity:**
This is a TOTAL CONVERSION, not a reskin. Each change MUST use the Figma MCP tool to fetch exact specifications during implementation. Visual comparison with Figma design is required for acceptance. Target: pixel-perfect match within 5% tolerance for spacing and sizing.

**Font Considerations:**
Figma design uses "LINE Seed JP" and "Manrope" fonts. Options: (1) Load exact fonts via Google Fonts or self-hosted for perfect match, (2) Use existing app fonts with adjusted sizing to match visual hierarchy. Recommendation: Load Manrope for headings (22px SemiBold) to match Figma, use existing fonts for body text. Font loading is worth the overhead for auth screens (first impression).

**Localization Decision:**
Figma shows Russian text throughout ("Вход", "Войти", "Зарегестрироватся", "Профиль специалиста", "Профиль Компании"). Options: (1) Implement with Russian text to match Figma exactly, (2) Keep English for consistency with existing app. Recommendation: Include Russian text in components as shown in Figma, but make text configurable via props for future i18n. This preserves exact visual match while allowing flexibility.

**Responsive Design:**
Figma shows desktop layout only (MacBook Pro 14"). Mobile design needs to be inferred: stack role cards vertically, reduce padding, ensure touch targets are adequate (44px minimum). Each change should include responsive considerations.

**Migration Strategy:**
New /auth page is additive - existing /login and /register pages continue to work. This allows gradual migration and easy rollback. Once new flow is validated, can add redirects or remove old pages.

**Asset Quality:**
Figma assets are raster images from API. For production, should recreate as optimized SVGs for crisp rendering at any size and better performance. Icons should be simple, recognizable, and accessible.
