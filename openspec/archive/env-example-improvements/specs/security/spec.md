# Security Specification Delta: Environment Configuration Documentation

## ADDED Requirements

### Requirement: Backward Compatibility for Environment Configuration
The system MUST maintain 100% backward compatibility with existing .env files and test infrastructure.

#### Scenario: Existing .env files continue to work
- GIVEN a developer with an existing `.env` file from before this change
- WHEN they pull the updated `.env.example` documentation
- THEN their existing `.env` file MUST continue to work without modification
- AND all application functionality MUST work identically
- AND no environment variable names MUST be changed

#### Scenario: Test infrastructure continues to work
- GIVEN the existing test infrastructure with mocked rate limiting
- WHEN the documentation is updated
- THEN all 493 existing tests MUST continue to pass
- AND test mocking in `__tests__/helpers/ratelimit-mocks.ts` MUST continue to work
- AND tests MUST NOT require real Upstash credentials

#### Scenario: Code fallback behavior is preserved
- GIVEN the existing fallback for DATABASE_URL in `lib/prisma.ts`
- WHEN the documentation is updated
- THEN the fallback behavior MUST remain unchanged
- AND the code MUST continue to use `'file:./prisma/dev.db'` when DATABASE_URL is not set
- AND no code changes MUST be made

#### Scenario: Variable syntax remains valid
- GIVEN existing placeholder values in `.env.example`
- WHEN documentation is enhanced
- THEN all placeholder values MUST remain valid .env syntax
- AND copying `.env.example` to `.env` MUST produce a parseable file
- AND no syntax errors MUST be introduced

**Acceptance Criteria:**
- All existing .env files work without modification
- All 493 tests pass after documentation changes
- No environment variable names changed
- No code behavior changed
- Test mocking infrastructure unchanged
- Fallback behaviors preserved and documented

---

### Requirement: Comprehensive .env.example Documentation
The system MUST provide a comprehensive `.env.example` file that documents all environment variables with clear explanations, security guidance, and integration details.

#### Scenario: All environment variables are documented
- GIVEN a developer setting up the project for the first time
- WHEN they open `.env.example`
- THEN they MUST see documentation for all environment variables used in the codebase
- AND each variable MUST have a comment explaining its purpose and where it's used in code
- AND the file MUST include DATABASE_URL, SESSION_SECRET, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, and NODE_ENV

#### Scenario: Code usage locations are documented
- GIVEN a developer reading variable documentation
- WHEN they review the comments
- THEN each variable MUST reference the specific files where it's used
- AND DATABASE_URL MUST reference `lib/prisma.ts`
- AND SESSION_SECRET MUST reference `lib/session.ts` and `middleware.ts`
- AND UPSTASH_* variables MUST reference `lib/ratelimit.ts`
- AND NODE_ENV MUST reference `lib/session.ts` and `lib/prisma.ts`

#### Scenario: Fallback behavior is documented
- GIVEN a developer reading variable documentation
- WHEN they review variables with fallback values
- THEN DATABASE_URL MUST document the fallback: `'file:./prisma/dev.db'`
- AND variables without fallbacks MUST be marked as REQUIRED with warning that app will crash if missing
- AND the documentation MUST match actual code behavior in `lib/prisma.ts` line 9

#### Scenario: Required vs optional variables are clearly marked
- GIVEN a developer reading `.env.example`
- WHEN they review the variable list
- THEN required variables MUST be clearly marked (SESSION_SECRET, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)
- AND optional variables MUST be clearly marked with their default/fallback values (DATABASE_URL, NODE_ENV)
- AND developers MUST understand which variables they must configure before running the app

#### Scenario: Security warnings are prominent
- GIVEN a developer opening `.env.example`
- WHEN they read the file header
- THEN they MUST see a prominent security warning section
- AND the warning MUST explain that this file should never contain real secrets
- AND the warning MUST instruct them to copy to `.env` and fill in real values
- AND the warning MUST remind them that `.env` is gitignored

**Acceptance Criteria:**
- All environment variables used in codebase are documented
- Each variable references specific code files where it's used
- Fallback behaviors documented and match actual code
- Required variables clearly marked (no fallback, app crashes if missing)
- Optional variables show default/fallback values
- Security warning section at top of file
- File remains valid .env syntax (comments use #)

---

### Requirement: Test Environment Documentation
The system MUST document the test environment setup and explain how tests handle environment variables differently.

#### Scenario: Test environment file is documented
- GIVEN a developer setting up the test environment
- WHEN they open `.env.test.example`
- THEN they MUST see documentation explaining this file is for test environment
- AND they MUST understand that tests use this file instead of `.env`
- AND they MUST see that tests mock rate limiting and don't need real Upstash credentials

#### Scenario: Rate limiting mocking is explained
- GIVEN a developer reading test environment documentation
- WHEN they review the UPSTASH_* variable comments
- THEN they MUST see explanation that tests mock rate limiting via `__tests__/helpers/ratelimit-mocks.ts`
- AND they MUST understand that placeholder values are sufficient for tests
- AND they MUST see that real Upstash credentials are NOT needed for running tests

#### Scenario: Test-specific variable values are documented
- GIVEN a developer reading `.env.test.example`
- WHEN they review the variable values
- THEN NODE_ENV MUST be set to "test"
- AND DATABASE_URL MUST point to test database: `"file:./test.db"`
- AND SESSION_SECRET MUST be a valid test value (32+ characters)
- AND all values MUST be functional for test execution

#### Scenario: Cross-reference between dev and test environments
- GIVEN a developer comparing `.env.example` and `.env.test.example`
- WHEN they review both files
- THEN both files MUST document the same variables
- AND differences in values MUST be explained (e.g., test database vs dev database)
- AND test-specific behavior MUST be clearly marked

**Acceptance Criteria:**
- `.env.test.example` has comprehensive documentation
- Test mocking strategy explained
- Developers understand tests don't need real Upstash credentials
- Test-specific values documented and functional
- Cross-references between dev and test environments
- All 493 tests continue to pass with documented setup

---

### Requirement: SESSION_SECRET Generation Guidance
The system MUST provide clear, actionable guidance for generating secure SESSION_SECRET values with multiple tested methods.

#### Scenario: Multiple generation methods are provided
- GIVEN a developer needs to generate SESSION_SECRET
- WHEN they read the SESSION_SECRET documentation in `.env.example`
- THEN they MUST see at least 2 different LOCAL methods for generating secure values
- AND methods MUST include: openssl command and Node.js crypto command
- AND each method MUST be copy-pasteable and immediately usable
- AND all methods MUST be tested on Linux, macOS, and Windows (Git Bash)
- AND they MUST see a warning NEVER to use online tools (they may log the generated secrets)

#### Scenario: Security requirements are explained
- GIVEN a developer reading SESSION_SECRET documentation
- WHEN they review the comments
- THEN they MUST understand the minimum length requirement (32+ characters recommended)
- AND they MUST understand that the secret should be random and unpredictable
- AND they MUST see a warning against using weak values like "your_session_secret_here" in production
- AND they MUST see a warning NEVER to use online secret generators (security risk)
- AND they MUST understand that SESSION_SECRET has NO fallback (app crashes if missing)

#### Scenario: Code usage is documented
- GIVEN a developer reading SESSION_SECRET documentation
- WHEN they review the comments
- THEN they MUST see that SESSION_SECRET is used in `lib/session.ts` (line 4) for JWT signing
- AND they MUST see that it's also used in `middleware.ts` for JWT verification
- AND they MUST understand the security impact (compromised secret = compromised sessions)

#### Scenario: Production vs development guidance
- GIVEN a developer setting up different environments
- WHEN they read SESSION_SECRET documentation
- THEN they MUST understand that development and production MUST use different secrets
- AND they MUST see guidance on rotating secrets periodically in production
- AND they MUST understand that changing the secret invalidates all existing sessions

**Acceptance Criteria:**
- At least 2 LOCAL methods for generating SESSION_SECRET provided
- Methods include: openssl and Node.js crypto (NO online tools)
- Warning against online secret generators included (security risk - may log secrets)
- All generation commands tested on Linux, macOS, Windows (Git Bash)
- Minimum length recommendation (32+ characters)
- Warning against weak/placeholder values in production
- Code usage locations documented (`lib/session.ts`, `middleware.ts`)
- No fallback behavior clearly stated (REQUIRED variable)
- Guidance on using different secrets per environment
- Session invalidation impact documented

---

### Requirement: Database Configuration Documentation
The system MUST document DATABASE_URL with clear explanations for development and production usage, including fallback behavior.

#### Scenario: SQLite file path and fallback are explained
- GIVEN a developer reading DATABASE_URL documentation
- WHEN they review the comments
- THEN they MUST understand that `file:./prisma/dev.db` creates a local SQLite database
- AND they MUST understand the file will be created automatically on first migration
- AND they MUST see that this variable is OPTIONAL with fallback to `'file:./prisma/dev.db'` in `lib/prisma.ts` (line 9)
- AND they MUST understand the relative path behavior

#### Scenario: Code usage and fallback behavior are documented
- GIVEN a developer reading DATABASE_URL documentation
- WHEN they review the comments
- THEN they MUST see that DATABASE_URL is used in `lib/prisma.ts` with fallback
- AND they MUST understand that if DATABASE_URL is not set, the app uses `'file:./prisma/dev.db'`
- AND they MUST see the exact code reference: `process.env.DATABASE_URL || 'file:./prisma/dev.db'`

#### Scenario: Production database guidance is provided
- GIVEN a developer preparing for production deployment
- WHEN they read DATABASE_URL documentation
- THEN they MUST see a comment about production database options
- AND they MUST understand that SQLite is suitable for development but production may need PostgreSQL/MySQL
- AND they MUST see example format for PostgreSQL connection string (without real credentials)
- AND they MUST understand when to override the default value

#### Scenario: Test environment database is documented
- GIVEN a developer reading `.env.test.example`
- WHEN they review DATABASE_URL
- THEN they MUST see it points to `"file:./test.db"` (separate from dev database)
- AND they MUST understand this prevents test data from polluting dev database
- AND they MUST see that test database is automatically cleaned between test runs

**Acceptance Criteria:**
- DATABASE_URL purpose clearly explained
- SQLite file path behavior documented
- Fallback behavior documented: `'file:./prisma/dev.db'` in `lib/prisma.ts` line 9
- Code usage location referenced
- OPTIONAL status clearly marked (has fallback)
- Production database considerations mentioned
- Example PostgreSQL connection string format provided (as comment)
- Test database separation explained
- No real database credentials included

---

### Requirement: Rate Limiting Configuration Documentation
The system MUST document Upstash Redis environment variables with setup instructions, links, and integration details.

#### Scenario: Upstash Redis purpose and code usage are explained
- GIVEN a developer reading UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN documentation
- WHEN they review the comments
- THEN they MUST understand these variables are used for rate limiting in `lib/ratelimit.ts` (lines 6-7)
- AND they MUST understand that rate limiting prevents brute force attacks and spam
- AND they MUST see which features depend on these variables (login, registration, applications, messaging)
- AND they MUST see that these are REQUIRED variables with NO fallback (app crashes if missing)

#### Scenario: Setup instructions are provided
- GIVEN a developer who needs to configure Upstash Redis
- WHEN they read the documentation
- THEN they MUST see a link to Upstash signup (https://upstash.com)
- AND they MUST see step-by-step instructions: create account → create Redis database → copy REST URL and token
- AND they MUST understand that Upstash has a free tier suitable for development

#### Scenario: Test environment behavior is explained
- GIVEN a developer reading the documentation
- WHEN they review test environment notes
- THEN they MUST understand that tests mock rate limiting via `__tests__/helpers/ratelimit-mocks.ts`
- AND they MUST see that real Upstash credentials are NOT needed for running tests
- AND they MUST understand that placeholder values in `.env.test` are sufficient for test execution

#### Scenario: Missing variables behavior is documented
- GIVEN a developer who hasn't set up Upstash
- WHEN they read the documentation
- THEN they MUST see a clear warning that the app will crash if these variables are missing
- AND they MUST understand that there is NO fallback behavior
- AND they MUST see that they need to set up Upstash before running the app in development or production

**Acceptance Criteria:**
- Purpose of Upstash Redis variables clearly explained
- Code usage location referenced: `lib/ratelimit.ts` lines 6-7
- REQUIRED status clearly marked (no fallback, app crashes if missing)
- Link to Upstash signup provided
- Step-by-step setup instructions included
- Free tier mentioned for development
- Test mocking behavior explained
- Features depending on rate limiting are listed (login, registration, applications, messaging)
- Cross-reference to `__tests__/helpers/ratelimit-mocks.ts`

---

### Requirement: NODE_ENV Documentation
The system MUST document NODE_ENV with clear explanation of its impact on application behavior and code usage.

#### Scenario: NODE_ENV purpose and code usage are explained
- GIVEN a developer reading NODE_ENV documentation
- WHEN they review the comments
- THEN they MUST understand that NODE_ENV controls environment-specific behavior
- AND they MUST see the valid values: "development", "production", "test"
- AND they MUST see that it's used in `lib/session.ts` (line 17) for cookie security
- AND they MUST see that it's used in `lib/prisma.ts` (line 16) for connection pooling
- AND they MUST understand that Next.js automatically sets this value in most cases

#### Scenario: Impact on security is documented
- GIVEN a developer reading NODE_ENV documentation
- WHEN they review the comments
- THEN they MUST understand that NODE_ENV affects cookie security (secure flag in `lib/session.ts`)
- AND they MUST see that production mode enables HTTPS-only cookies
- AND they MUST understand why this matters for security (prevents cookie theft over HTTP)
- AND they MUST see the exact code: `secure: process.env.NODE_ENV === 'production'`

#### Scenario: Development vs production differences are clear
- GIVEN a developer setting up different environments
- WHEN they read NODE_ENV documentation
- THEN they MUST see behavior differences:
  - development: Cookies work over HTTP, Prisma connection pooling disabled
  - production: Cookies require HTTPS, Prisma connection pooling enabled
  - test: Used by test runners, set in `.env.test`
- AND they MUST understand when to use each value
- AND they MUST see that manual setting is rarely needed (Next.js auto-sets)

#### Scenario: Optional status and defaults are documented
- GIVEN a developer reading NODE_ENV documentation
- WHEN they review the comments
- THEN they MUST see that NODE_ENV is OPTIONAL (Next.js sets it automatically)
- AND they MUST understand the default behavior when not set
- AND they MUST see that `.env.test` explicitly sets it to "test"

**Acceptance Criteria:**
- NODE_ENV purpose clearly explained
- Valid values listed: "development", "production", "test"
- Code usage locations referenced: `lib/session.ts` line 17, `lib/prisma.ts` line 16
- Impact on cookie security documented with code reference
- Behavior differences between development and production explained
- Note that Next.js auto-sets this value in most cases
- OPTIONAL status clearly marked
- Test environment value documented in `.env.test.example`

---

### Requirement: .env.example File Structure
The system MUST organize `.env.example` with clear sections and consistent formatting.

#### Scenario: File has logical sections
- GIVEN a developer reading `.env.example`
- WHEN they scan the file structure
- THEN they MUST see variables grouped into logical sections
- AND sections MUST include: Security Warning, Database, Authentication, Rate Limiting, Environment
- AND each section MUST have a clear header comment

#### Scenario: Comments are consistently formatted
- GIVEN a developer reading variable documentation
- WHEN they review the comments
- THEN all comments MUST use consistent formatting
- AND multi-line comments MUST be properly aligned
- AND example commands MUST be clearly marked
- AND external links MUST be on their own lines for visibility

#### Scenario: Example values are safe and clear
- GIVEN a developer copying `.env.example` to `.env`
- WHEN they review the placeholder values
- THEN all placeholder values MUST be obviously fake (e.g., "your_*_here")
- AND no placeholder values MUST be valid for production use
- AND developers MUST be forced to replace placeholders with real values

**Acceptance Criteria:**
- File organized into logical sections with headers
- Consistent comment formatting throughout
- Multi-line comments properly aligned
- Example commands clearly marked
- All placeholder values obviously fake
- No accidentally-valid production values
