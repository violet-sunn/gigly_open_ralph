# UI Specification Delta

## ADDED Requirements

### Requirement: Token Migration Validation Procedures
The codebase MUST provide validation procedures to verify complete migration from hardcoded colors to design tokens.

#### Scenario: Grep audit identifies old color patterns
- GIVEN the codebase has been migrated to design tokens
- WHEN a grep audit is performed for old color patterns
- THEN the audit MUST search for: `bg-navy-900`, `bg-navy-800`, `text-gray-*`, `border-gray-*`, `placeholder:text-gray-400`, `focus:ring-offset-navy-900`
- AND the audit MUST exclude `docs/` and `archive/` directories
- AND the audit MUST return zero matches in active code
- AND any matches found MUST be documented with justification

#### Scenario: Test suite validates token-based styling
- GIVEN the token migration is complete
- WHEN the full test suite is executed
- THEN all 521 tests MUST pass
- AND no tests MUST be skipped or disabled
- AND test output MUST be captured for verification

#### Scenario: Visual regression testing confirms consistency
- GIVEN all pages use token-based styling
- WHEN visual regression testing is performed
- THEN all pages MUST render with consistent styling
- AND no visual regressions MUST be detected
- AND screenshots MUST be compared against baseline

#### Scenario: Accessibility audit validates token usage
- GIVEN the design token system includes accessibility considerations
- WHEN an accessibility audit is performed
- THEN all color contrast ratios MUST meet WCAG AA standards
- AND focus indicators MUST be visible and consistent
- AND interactive elements MUST have appropriate color states

### Requirement: Migration Completion Documentation
The DESIGN_SYSTEM.md file MUST document the migration completion status and any exceptions.

#### Scenario: Documentation reflects migration completion
- GIVEN the token migration validation is complete
- WHEN DESIGN_SYSTEM.md is reviewed
- THEN it MUST include a "Migration Status" section
- AND the section MUST state whether migration is 100% complete
- AND the section MUST document the validation date
- AND the section MUST list any intentional hardcoded fallbacks with rationale

#### Scenario: Hardcoded fallbacks are documented
- GIVEN some hardcoded values may be intentionally retained
- WHEN hardcoded fallbacks exist
- THEN each fallback MUST be documented in DESIGN_SYSTEM.md
- AND the documentation MUST explain why the fallback is necessary
- AND the documentation MUST specify the file path and line number
- AND the documentation MUST include a plan for eventual token migration (if applicable)

### Requirement: Validation Script Automation
Validation procedures MUST be automatable and reproducible.

#### Scenario: Grep audit script is executable
- GIVEN validation needs to be repeatable
- WHEN a grep audit script is created
- THEN the script MUST be executable via npm script or bash command
- AND the script MUST output clear results (pass/fail)
- AND the script MUST exit with code 0 on success, non-zero on failure
- AND the script MUST be documented in DESIGN_SYSTEM.md

#### Scenario: Validation can be run in CI/CD
- GIVEN validation should prevent regressions
- WHEN validation scripts are integrated into CI/CD
- THEN the scripts MUST run automatically on pull requests
- AND failures MUST block merging
- AND results MUST be visible in PR checks
