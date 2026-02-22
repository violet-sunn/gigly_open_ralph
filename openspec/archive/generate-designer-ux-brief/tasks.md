# Implementation Tasks: generate-designer-ux-brief

## Task 1: Analyze Source Document and Create Document Structure

**Implementation:**
- Read `current_application_map.md` to understand all screens and flows
- Create `designer_ux_requirements.md` at project root
- Write document header and overview section in Russian
- Create main section structure:
  - Обзор платформы
  - Экраны регистрации и входа
  - Экраны клиента
  - Экраны специалиста
  - Экраны администратора
  - Общие компоненты

**Test Plan:**
- Verify file exists at project root
- Verify all main sections are present
- Verify document is in Russian
- Verify no technical jargon in overview section

**Output:** Document structure with overview section completed

---

## Task 2: Transform Registration and Login Screens

**Implementation:**
- Extract registration screen information from application map section 2.1
- Transform into designer-friendly format:
  - Remove file paths and source references
  - Remove technical validation details (bcrypt, JWT)
  - Simplify password requirements to user-friendly language
  - Use simple field type names (Текстовое поле, Выпадающий список)
- Extract login screen information from application map section 2.2
- Transform into designer-friendly format
- Remove rate limiting technical details, keep only user-visible behavior

**Test Plan:**
- Verify registration screen section exists
- Verify login screen section exists
- Verify no file paths (e.g., "app/register/page.tsx")
- Verify no technical terms (e.g., "bcrypt", "JWT", "rate limiter")
- Verify all form fields are listed
- Verify field constraints are in simple Russian

**Output:** Registration and login screens documented in designer-friendly format

---

## Task 3: Transform Client Journey Screens

**Implementation:**
- Extract client screens from application map section 3
- Transform each screen:
  - Section 3.1: Gig creation screen
    - List all form fields (название, описание, критерии приёмки, бюджет, etc.)
    - Remove kopecks conversion logic, show only roubles
    - Remove service fee calculation details, show only final display
    - Simplify field constraints (e.g., "Минимум 50 символов" instead of technical validation)
  - Section 3.2: Application review screen
    - Describe displayed application data
    - List actions: Принять, Отклонить
    - Describe what happens (in user terms, not database terms)
  - Section 3.3-3.5: Gig status progression screens
    - Describe each status in simple terms
    - List available actions at each status
    - Remove database state transition details

**Test Plan:**
- Verify gig creation screen section exists with all fields
- Verify application review screen section exists
- Verify status progression is described
- Verify no database terms (e.g., "assignedSpecialistId", "upsert")
- Verify no backend logic (e.g., "Math.floor(budgetRoubles * 100)")
- Verify budget is shown in roubles, not kopecks
- Verify all actions are listed as buttons

**Output:** All client journey screens documented in designer-friendly format

---

## Task 4: Transform Specialist Journey Screens

**Implementation:**
- Extract specialist screens from application map section 4
- Transform each screen:
  - Section 4.1: Gig browsing screen
    - List filter options in simple terms
    - Describe displayed gig information
    - Remove technical pagination details, keep only "25 заданий на страницу"
  - Section 4.2: Application submission screen
    - List all form fields (технический подход, уточняющие вопросы, оценка трудозатрат)
    - Simplify character limits (e.g., "100-2000 символов")
    - Remove rate limiting technical details
  - Section 4.3: Work submission screen
    - Describe when this appears
    - Describe submit work action
    - Remove state transition details

**Test Plan:**
- Verify gig browsing screen section exists with filters
- Verify application submission screen section exists with all fields
- Verify work submission screen section exists
- Verify no technical terms (e.g., "rate limiter", "Server Action")
- Verify character limits are in simple format
- Verify all form fields are listed

**Output:** All specialist journey screens documented in designer-friendly format

---

## Task 5: Transform Admin Journey Screens

**Implementation:**
- Extract admin screens from application map section 5
- Transform each screen:
  - Section 5.1: User management screen
    - List displayed columns (email, роль, статус, дата регистрации)
    - List filter options (роль, статус)
    - List actions (заблокировать, разблокировать)
    - Remove technical pagination details, keep only "30 пользователей на страницу"
  - Section 5.2-5.4: Moderation actions
    - Describe each action in user terms
    - List required fields (причина)
    - Remove ModerationLog technical details

**Test Plan:**
- Verify user management screen section exists
- Verify moderation actions are described
- Verify no database terms (e.g., "ModerationLog", "Prisma")
- Verify no technical details (e.g., "transaction", "upsert")
- Verify all columns and filters are listed
- Verify all actions are described

**Output:** All admin journey screens documented in designer-friendly format

---

## Task 6: Transform Shared Components

**Implementation:**
- Extract messaging component from application map section 6.1
- Transform into designer-friendly format:
  - Describe where messaging appears
  - Describe who can send messages (in user role terms)
  - List message input field with constraints
  - Describe message display
  - Remove rate limiting technical details
  - Remove authorization check details

**Test Plan:**
- Verify messaging component section exists
- Verify message input field is described
- Verify message display is described
- Verify no technical terms (e.g., "rate limiter", "authorization check")
- Verify character limit is in simple format (e.g., "Максимум 2000 символов")

**Output:** Messaging component documented in designer-friendly format

---

## Task 7: Verify Completeness and Clarity

**Implementation:**
- Review entire document for completeness
- Verify all screens from application map are covered
- Scan for any remaining technical jargon
- Verify all sections follow standard format
- Verify document is entirely in Russian
- Verify document is actionable for designers

**Test Plan:**
- Run verification commands:
  ```bash
  # Verify file exists and has substantial content
  test -f designer_ux_requirements.md && wc -l designer_ux_requirements.md

  # Verify no file paths remain
  ! grep -E "app/|lib/|prisma/" designer_ux_requirements.md

  # Verify no database terms remain
  ! grep -iE "prisma|upsert|assignedSpecialistId|kopecks|bcrypt|jwt" designer_ux_requirements.md

  # Verify no source code references remain
  ! grep -E ":\d+-\d+" designer_ux_requirements.md

  # Verify document is in Russian (check for Russian characters)
  grep -q "[А-Яа-я]" designer_ux_requirements.md
  ```

**Success Criteria:**
- Document is at least 400 lines (comprehensive but simpler than technical map)
- All verification commands pass
- All spec scenarios are satisfied
- Design team can create mockups from this document
- No technical jargon remains

**Output:** Complete, verified designer UX requirements document ready for design team use
