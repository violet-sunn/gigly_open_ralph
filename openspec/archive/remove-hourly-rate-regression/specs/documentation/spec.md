# Documentation Specification - Remove Hourly Rate

## REMOVED Requirements

### Requirement: Hourly Rate in Documentation
Documentation MUST NOT contain hourly rate references.

#### Scenario: Application map must not mention hourly rate
**Given** the current_application_map.md document
**When** reviewing specialist profile documentation
**Then** the document MUST NOT mention hourlyRate field
**And** the document MUST NOT describe hourly rate functionality
**And** the document MUST NOT include hourly rate in field lists

#### Scenario: Designer UX requirements must not mention hourly rate
**Given** the designer_ux_requirements.md document
**When** reviewing specialist profile screens
**Then** the document MUST NOT mention почасовая ставка
**And** the document MUST NOT describe hourly rate input fields
**And** the document MUST NOT show hourly rate in form specifications

#### Scenario: Testing documentation must not reference hourly rate
**Given** the TESTING.md document
**When** reviewing test data specifications
**Then** the document MUST NOT mention hourlyRate
**And** the document MUST NOT describe hourly rate test cases

#### Scenario: OpenSpec specs must not reference hourly rate
**Given** all spec files in openspec/specs/
**When** reviewing requirements
**Then** the specs MUST NOT mention hourlyRate
**And** the specs MUST NOT describe hourly rate functionality
**And** the specs MUST NOT include hourly rate validation rules

---

## Validation Commands

```bash
# Verify no hourlyRate in application map
! grep -i "hourlyRate\|почасов" current_application_map.md

# Verify no hourlyRate in designer requirements
! grep -i "hourlyRate\|почасов" designer_ux_requirements.md

# Verify no hourlyRate in testing docs
! grep -i "hourlyRate" TESTING.md

# Verify no hourlyRate in active specs (excluding archive)
! grep -i "hourlyRate" openspec/specs/**/*.md

# Comprehensive check across all non-archived files
! grep -r "hourlyRate\|почасов" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=openspec/archive
```
