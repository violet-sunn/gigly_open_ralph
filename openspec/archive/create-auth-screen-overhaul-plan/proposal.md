# Proposal: Create Auth Screen Overhaul Planning Document

## Change Name
`create-auth-screen-overhaul-plan`

## Type
Planning Document Creation

## Problem Statement

The current authentication screens (login and register) are functional but visually basic. They use a standard form-based layout without decorative elements, branding emphasis, or visual polish. The Figma design at `https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385` shows a completely reimagined auth experience with:

- Unified auth flow with role selection before credentials
- Sophisticated visual design with logo treatment, decorative background patterns
- Icon-based role selection cards with hover/selected states
- Centered card layout with specific spacing, borders, and shadows
- Professional B2B aesthetic matching the "high-end marketplace" positioning

This is not a simple reskin but a total conversion requiring architectural changes to the auth flow, new visual components, asset integration, and potentially localization support.

## Why This Planning Document is Needed

The auth screen overhaul touches multiple systems:
- **Auth Flow Architecture**: Current has separate /login and /register pages; Figma suggests unified experience
- **Visual Components**: New card-based role selectors, decorative elements, logo treatment
- **Assets**: Icons for roles (specialist/client), decorative background patterns, logo variants
- **Styling**: Specific colors, borders, shadows, spacing that may require design token updates
- **Localization**: Figma shows Russian text; need to decide on i18n approach
- **Responsive Design**: Ensure new design works across devices

Without strategic planning, implementing this piecemeal risks:
- Inconsistent user experience during transition
- Missing dependencies (assets, tokens, components)
- Architectural decisions made ad-hoc
- Scope creep or incomplete implementation

This planning document will analyze the current state, identify all affected systems, define the target architecture, and provide executable ralphy-plan commands for each change in dependency order.

## Scope

This planning document change will:

1. **Analyze Current State**
   - Review existing auth pages (/login, /register)
   - Review auth actions and session management
   - Review design token system
   - Review component patterns

2. **Analyze Figma Design**
   - Extract visual specifications (colors, spacing, typography)
   - Identify required assets (icons, patterns, logo)
   - Understand interaction patterns
   - Map design to implementation requirements

3. **Identify Affected Systems**
   - Auth page architecture (unified vs separate)
   - Component library (role selectors, decorative elements)
   - Asset management (icons, patterns)
   - Design tokens (colors, spacing)
   - Localization system (if needed)

4. **Define Implementation Strategy**
   - Determine if unified auth screen or enhanced separate pages
   - Identify component hierarchy
   - Plan asset integration approach
   - Define migration path (can old and new coexist?)

5. **Generate Executable Changes**
   - Create ralphy-plan commands for each change
   - Order by dependencies
   - Include clear requirements and test plans

## Deliverable

A planning document at `openspec/planning/auth-screen-overhaul.md` containing:
- Problem analysis
- Why this matters (business/UX impact)
- Scope of affected systems
- Architectural decisions
- Ordered list of ralphy-plan commands
- Status tracking

## Constraints

- Must maintain backward compatibility with existing auth actions
- Must preserve security (rate limiting, password validation, session management)
- Must work with existing Prisma schema and user roles
- Should align with existing design token system
- MVP scope: focus on visual overhaul, defer advanced features (OAuth, password reset)

## Success Criteria

- Planning document follows `openspec/specs/planning/spec.md` format
- All affected systems identified
- Clear architectural decisions documented
- Executable ralphy-plan commands provided
- Dependencies between changes clearly stated
- Risks and unknowns noted
