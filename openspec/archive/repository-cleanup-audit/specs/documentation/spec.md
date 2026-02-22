# Documentation Audit Specification

## ADDED Requirements

### Requirement: Cleanup Report Generation
The audit MUST generate a comprehensive cleanup report at the project root.

#### Scenario: Report file creation
**Given** the audit has completed scanning
**When** generating the report
**Then** a file named `cleanup_report_v1.md` MUST be created at the project root
**And** the file MUST be in Markdown format
**And** the file MUST be human-readable

#### Scenario: Executive summary section
**Given** the cleanup report is being generated
**When** writing the executive summary
**Then** the summary MUST include total findings count
**And** the summary MUST include breakdown by category (root, database, scripts, app, tests)
**And** the summary MUST include overall assessment (clean, minor issues, significant clutter)

### Requirement: Findings Documentation
The audit MUST document each finding with sufficient detail for informed decision-making.

#### Scenario: Finding entry format
**Given** a file or directory has been flagged
**When** documenting the finding in the report
**Then** the entry MUST include the relative path from project root
**And** the entry MUST include a clear reason why it was flagged
**And** the entry MUST include a suggested action (delete, move to archive, investigate, or keep)

#### Scenario: Findings grouped by category
**Given** multiple findings across different directories
**When** organizing the report
**Then** findings MUST be grouped by category:
- Root Directory Clutter
- Database & Migration Artifacts
- Scripts & Utilities
- Application Structure
- Test Infrastructure
**And** each category MUST have a header and count of findings

#### Scenario: Empty category handling
**Given** a category with zero findings
**When** generating the report
**Then** the category MUST still appear in the report
**And** the category MUST show "✅ No issues found" or similar positive message

### Requirement: Report Clarity and Actionability
The report MUST enable informed cleanup decisions without additional investigation.

#### Scenario: Clear reasoning for each finding
**Given** a finding is documented
**When** a developer reads the reason
**Then** the reason MUST clearly explain why the file/directory is suspicious
**And** the reason MUST reference specific patterns (e.g., "matches temp*.ts pattern")
**And** the reason MUST NOT use vague language like "looks wrong" or "seems bad"

#### Scenario: Suggested actions are specific
**Given** a finding is documented
**When** providing a suggested action
**Then** the action MUST be one of: DELETE, ARCHIVE, INVESTIGATE, or KEEP
**And** DELETE MUST be suggested only for obvious temporary files
**And** INVESTIGATE MUST be suggested when context is needed
**And** ARCHIVE MUST be suggested for legacy but potentially useful files

#### Scenario: Report includes recommendations
**Given** the report has been generated
**When** writing the conclusion section
**Then** the report MUST include prioritization recommendations
**And** the report MUST suggest cleanup order (e.g., "start with root directory")
**And** the report MUST warn about files that require careful review before deletion

### Requirement: Report Metadata
The report MUST include metadata for traceability and context.

#### Scenario: Audit metadata header
**Given** the cleanup report is being generated
**When** writing the report header
**Then** the header MUST include audit date and time
**And** the header MUST include project name ("Gigly")
**And** the header MUST include audit version ("v1")
**And** the header MUST include total files scanned count

#### Scenario: Exclusions documented
**Given** certain directories were excluded from scanning
**When** generating the report
**Then** the report MUST list all excluded directories
**And** the report MUST explain why they were excluded (e.g., "standard Next.js build directory")

### Requirement: Report Formatting
The report MUST use consistent Markdown formatting for readability.

#### Scenario: Consistent heading hierarchy
**Given** the report is being formatted
**When** writing section headers
**Then** the report title MUST use H1 (`#`)
**And** category sections MUST use H2 (`##`)
**And** subsections MUST use H3 (`###`)
**And** finding entries MUST use H4 (`####`) or list items

#### Scenario: Visual indicators for severity
**Given** findings have different severity levels
**When** formatting the report
**Then** high-priority findings MUST use 🔴 emoji or similar indicator
**And** medium-priority findings MUST use 🟡 emoji or similar indicator
**And** low-priority findings MUST use 🟢 emoji or similar indicator
**And** clean categories MUST use ✅ emoji

#### Scenario: Code formatting for paths
**Given** file or directory paths are documented
**When** writing paths in the report
**Then** paths MUST be formatted as inline code (backticks)
**And** paths MUST be relative to project root
**And** paths MUST use forward slashes for consistency
