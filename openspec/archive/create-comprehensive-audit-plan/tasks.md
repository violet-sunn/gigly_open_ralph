# Tasks: Create Comprehensive Project Audit Plan

## Task 1: Analyze Project Context and Current State

**Implementation:**
- Read `openspec/project.md` to understand product vision, personas, and success metrics
- Review all specs in `openspec/specs/` to understand intended behavior
- Review completed changes in `openspec/archive/` to understand implementation history
- Identify the "Current State" section in project.md to establish baseline

**Test Plan:**
- Verify all key documents have been read and understood
- Confirm understanding of CLIENT, SPECIALIST, and ADMIN personas
- Confirm understanding of MVP vs. post-MVP scope boundaries

---

## Task 2: Audit UX/UI Consistency Across All Pages

**Implementation:**
- Systematically review all pages in `app/` directory
- Check for navigation consistency:
  - Back button presence and behavior
  - Breadcrumbs or context indicators
  - Navigation header consistency
- Check for state handling:
  - Loading states (Suspense boundaries)
  - Error states (error messages, fallbacks)
  - Empty states (no data scenarios)
- Check for responsive design:
  - Mobile viewport handling
  - Touch target sizes
  - Overflow handling
- Document all inconsistencies with specific file paths and line numbers

**Test Plan:**
- Create a checklist of all pages/routes in the application
- For each page, verify presence/absence of:
  - Back button (where contextually appropriate)
  - Loading states
  - Error states
  - Empty states
  - Responsive design
- Document findings in structured format (page → issue → priority)

---

## Task 3: Audit Feature Completeness Against Specs

**Implementation:**
- For each spec in `openspec/specs/`, verify implementation completeness:
  - Authentication: All scenarios covered?
  - Gig lifecycle: All transitions working?
  - Profiles: All fields implemented?
  - Messaging: All edge cases handled?
  - Admin moderation: All tools available?
  - Notifications: All events triggering correctly?
- Identify gaps between spec requirements and actual implementation
- Identify areas where implementation exceeds spec (potential over-engineering)
- Check for polish opportunities (better error messages, clearer UI, etc.)

**Test Plan:**
- For each spec requirement, verify:
  - Is it implemented? (Yes/No/Partial)
  - Does it match the spec? (Yes/No/Differs)
  - Is it tested? (Unit/Integration/E2E/None)
  - Is it polished? (Production-ready/Needs-work)
- Document gaps with specific requirement references

---

## Task 4: Audit Technical Quality and Code Organization

**Implementation:**
- Review code organization:
  - File structure consistency
  - Component reusability
  - Server action organization
  - Type safety (TypeScript usage)
- Review error handling:
  - Consistent error messages
  - Proper error boundaries
  - User-friendly error display
- Review performance considerations:
  - Database query efficiency (N+1 queries?)
  - Pagination implementation
  - Unnecessary re-renders
- Review security:
  - Input validation
  - Authorization checks
  - Rate limiting coverage
- Review accessibility:
  - Semantic HTML
  - ARIA labels
  - Keyboard navigation
  - Screen reader support

**Test Plan:**
- Run through codebase looking for:
  - Duplicate code that could be extracted
  - Missing error handling
  - Potential performance issues
  - Security vulnerabilities
  - Accessibility violations
- Document findings with file paths and suggested improvements

---

## Task 5: Audit Product Vision Alignment

**Implementation:**
- Review project.md "Product Vision & Philosophy" section
- Check each design principle against implementation:
  - "Clarity Through Structure" - Are requirements clear?
  - "Trust Through Transparency" - Are money flows clear?
  - "Quality Over Quantity" - Is Middle+/Senior focus maintained?
  - "Russian Market First" - Is RUB/Russian context consistent?
  - "Simplicity in Core Flow" - Is the gig lifecycle straightforward?
- Review success metrics:
  - Can we measure "Organic Retention"?
  - Can we measure "Core Loop Completion Rate"?
  - Can we measure "Time-to-Hire"?
  - Are we tracking the right data?
- Identify features in "Deferred to Post-MVP" that might be needed sooner
- Identify implemented features that might be over-engineered for MVP

**Test Plan:**
- For each design principle, find 2-3 examples in code that support or violate it
- For each success metric, verify if data is being collected
- Document alignment gaps with specific references to project.md

---

## Task 6: Audit User Journeys End-to-End

**Implementation:**
- Map complete user journeys for each persona:
  - **CLIENT**: Register → Create profile → Post gig → Review applications → Accept specialist → Approve work → Mark as paid
  - **SPECIALIST**: Register → Create profile → Browse gigs → Apply → Work → Submit → Get paid
  - **ADMIN**: Login → View dashboard → Moderate users → Moderate gigs
- For each step, identify:
  - Friction points (confusing UI, missing information)
  - Missing features (can't do X)
  - Broken flows (dead ends, unclear next steps)
  - Opportunities for improvement (better guidance, clearer CTAs)
- Pay special attention to first-time user experience (onboarding)

**Test Plan:**
- Walk through each journey step-by-step
- Document every click, every page transition, every decision point
- Note where users might get confused or stuck
- Identify where back buttons or navigation aids are missing

---

## Task 7: Identify Quick Wins

**Implementation:**
- From all findings, identify improvements that are:
  - High impact on user experience
  - Low implementation effort (< 1 day)
  - No dependencies on other work
- Examples might include:
  - Adding missing back buttons
  - Improving error messages
  - Adding empty states
  - Fixing responsive design issues
  - Adding loading indicators
- Prioritize these for immediate implementation

**Test Plan:**
- For each quick win, estimate:
  - Impact: High/Medium/Low
  - Effort: Hours (< 4h = quick win)
  - Dependencies: None/Some/Many
- Only include items with High impact + Low effort + No dependencies

---

## Task 8: Create Planning Document with Ralphy-Plan Commands

**Implementation:**
- Create `openspec/planning/comprehensive-project-audit.md`
- Follow planning spec format:
  - **Problem**: Summarize audit findings
  - **Why This Matters**: Explain impact on product success
  - **Scope**: List all areas analyzed
  - **Changes**: Group findings into logical changes with ralphy-plan commands
- Organize changes by category:
  - Critical (blocks MVP launch)
  - High Priority (significant UX impact)
  - Medium Priority (polish and improvements)
  - Low Priority (nice-to-haves)
- For each change, provide:
  - Clear description
  - Ready-to-execute ralphy-plan command
  - Estimated complexity
  - Dependencies (if any)
- Provide recommended implementation order

**Test Plan:**
- Verify planning document follows spec format
- Verify all ralphy-plan commands are copy-pasteable
- Verify changes are ordered by priority and dependencies
- Verify each change is specific and actionable
- Verify document is comprehensive (covers all audit areas)

---

## Task 9: Validate Planning Document Completeness

**Implementation:**
- Review planning document against audit findings
- Ensure no major findings were missed
- Ensure priority assignments are justified
- Ensure ralphy-plan commands are realistic in scope
- Ensure recommended order makes sense (dependencies, impact)
- Add creation date and status (PLANNED)

**Test Plan:**
- Cross-reference planning document with audit notes
- Verify each major finding has a corresponding change
- Verify no duplicate changes
- Verify all commands are executable
- Verify document is ready for user review
