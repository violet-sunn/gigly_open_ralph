# UI Specification Delta

## ADDED Requirements

### Requirement: Next.js App Router Setup
The system MUST use Next.js 15+ with App Router architecture.

#### Scenario: Next.js initialization
- GIVEN a new project
- WHEN Next.js is initialized
- THEN it MUST use App Router (app/ directory)
- AND it MUST support TypeScript
- AND it MUST be version 15 or higher

**Acceptance Criteria:**
- `package.json` shows `next` version >= 15.0.0
- `app/` directory exists
- `app/layout.tsx` exists with root layout
- `app/page.tsx` exists with home page
- TypeScript configuration is present

---

### Requirement: Tailwind CSS Integration
The system MUST use Tailwind CSS for styling.

#### Scenario: Tailwind setup
- GIVEN the Next.js project
- WHEN Tailwind CSS is configured
- THEN it MUST be available for styling components
- AND utility classes MUST work in components

**Acceptance Criteria:**
- `tailwind.config.ts` exists
- `postcss.config.js` exists
- Global CSS imports Tailwind directives
- Tailwind classes render correctly in browser

---

### Requirement: Registration Form UI
The registration form MUST be styled and user-friendly.

#### Scenario: Form styling
- GIVEN the registration page
- WHEN the form is rendered
- THEN it MUST use Tailwind CSS classes
- AND it MUST have clear labels
- AND it MUST have appropriate input types
- AND it MUST be centered or well-positioned on the page

**Acceptance Criteria:**
- Form uses Tailwind utility classes
- Email input has `type="email"`
- Password input has `type="password"`
- Labels are associated with inputs
- Submit button is clearly visible
- Form has basic responsive design
