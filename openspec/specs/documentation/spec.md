# Designer UX Requirements Specification

## ADDED Requirements

### Requirement: Document Structure
The designer UX requirements document MUST follow a clear, screen-by-screen structure.

#### Scenario: Document must have all required sections
**Given** the designer UX requirements document
**When** reviewing the document structure
**Then** the document MUST contain section "Обзор платформы"
**And** the document MUST contain section "Экраны регистрации и входа"
**And** the document MUST contain section "Экраны клиента"
**And** the document MUST contain section "Экраны специалиста"
**And** the document MUST contain section "Экраны администратора"
**And** the document MUST contain section "Общие компоненты"

#### Scenario: Each screen must follow standard format
**Given** any screen description in the document
**When** reviewing the screen documentation
**Then** the screen MUST include "Название экрана и его назначение"
**And** the screen MUST include "Кто видит этот экран"
**And** the screen MUST include "Отображаемые данные"
**And** the screen MUST include "Поля форм для дизайна" (if applicable)
**And** the screen MUST include "Доступные кнопки и действия"

---

### Requirement: Language and Clarity
The document MUST be entirely in professional Russian with no technical jargon.

#### Scenario: Document must be in Russian
**Given** the designer UX requirements document
**When** reviewing the document language
**Then** all text MUST be in Russian
**And** all section headers MUST be in Russian
**And** all field descriptions MUST be in Russian
**And** all button labels MUST be in Russian

#### Scenario: No technical jargon allowed
**Given** the designer UX requirements document
**When** scanning for technical terms
**Then** the document MUST NOT contain file paths (e.g., "app/actions/gig.ts")
**And** the document MUST NOT contain database terms (e.g., "assignedSpecialistId", "upsert", "Prisma")
**And** the document MUST NOT contain backend terms (e.g., "JWT", "bcrypt", "rate limiter")
**And** the document MUST NOT contain source code references (e.g., "line 193-213")
**And** the document MUST NOT contain technical validation logic (e.g., "Math.floor(rate * 100)")

#### Scenario: Use simple, designer-friendly language
**Given** any field description in the document
**When** reviewing the field documentation
**Then** field types MUST use simple terms (e.g., "Текстовое поле", "Текстовая область", "Выпадающий список")
**And** constraints MUST use human-readable format (e.g., "Минимум 50 символов", "Максимум 2000 символов")
**And** descriptions MUST focus on user-visible behavior, not implementation

---

### Requirement: Registration and Login Screens
The document MUST comprehensively describe registration and login screens.

#### Scenario: Document registration screen
**Given** the registration screen section
**When** reviewing registration documentation
**Then** the document MUST describe the registration form purpose
**And** the document MUST list all form fields: email, password, role selection
**And** the document MUST describe password requirements in simple terms
**And** the document MUST describe role options: Клиент, Специалист
**And** the document MUST list the submit button

#### Scenario: Document login screen
**Given** the login screen section
**When** reviewing login documentation
**Then** the document MUST describe the login form purpose
**And** the document MUST list all form fields: email, password
**And** the document MUST describe what happens after successful login
**And** the document MUST list the submit button

---

### Requirement: Client Journey Screens
The document MUST comprehensively describe all client screens.

#### Scenario: Document gig creation screen
**Given** the gig creation screen section
**When** reviewing gig creation documentation
**Then** the document MUST describe the screen purpose
**And** the document MUST list all required fields: название, описание, критерии приёмки, бюджет
**And** the document MUST list all optional fields: цель, результаты, ограничения, теги
**And** the document MUST describe field constraints in simple terms
**And** the document MUST describe the budget display (with service fee)
**And** the document MUST list the submit button

#### Scenario: Document application review screen
**Given** the application review screen section
**When** reviewing application review documentation
**Then** the document MUST describe what application data is displayed
**And** the document MUST list available actions: Принять, Отклонить
**And** the document MUST describe what happens when application is accepted
**And** the document MUST describe what happens when application is rejected

#### Scenario: Document gig status progression
**Given** the client journey section
**When** reviewing gig status documentation
**Then** the document MUST describe all gig statuses in simple terms
**And** the document MUST describe how status changes from user perspective
**And** the document MUST describe what actions are available at each status

---

### Requirement: Specialist Journey Screens
The document MUST comprehensively describe all specialist screens.

#### Scenario: Document gig browsing screen
**Given** the gig browsing screen section
**When** reviewing gig browsing documentation
**Then** the document MUST describe the screen purpose
**And** the document MUST list all filter options: поиск, теги, бюджет, сортировка
**And** the document MUST describe what information is displayed for each gig
**And** the document MUST describe pagination

#### Scenario: Document application submission screen
**Given** the application submission screen section
**When** reviewing application submission documentation
**Then** the document MUST describe the screen purpose
**And** the document MUST list all required fields: технический подход, уточняющие вопросы
**And** the document MUST list optional fields: оценка трудозатрат
**And** the document MUST describe field constraints in simple terms
**And** the document MUST list the submit button

#### Scenario: Document work submission screen
**Given** the work submission screen section
**When** reviewing work submission documentation
**Then** the document MUST describe when this screen appears
**And** the document MUST describe the submit work action
**And** the document MUST describe what happens after submission

---

### Requirement: Admin Journey Screens
The document MUST comprehensively describe all admin screens.

#### Scenario: Document user management screen
**Given** the user management screen section
**When** reviewing user management documentation
**Then** the document MUST describe the screen purpose
**And** the document MUST list all displayed columns: email, роль, статус, дата регистрации
**And** the document MUST list available filters: роль, статус
**And** the document MUST list available actions: заблокировать, разблокировать
**And** the document MUST describe pagination

#### Scenario: Document moderation actions
**Given** the admin moderation section
**When** reviewing moderation documentation
**Then** the document MUST describe suspend user action
**And** the document MUST describe unsuspend user action
**And** the document MUST describe close gig action
**And** the document MUST describe required reason field for each action

---

### Requirement: Shared Components
The document MUST describe shared components used across screens.

#### Scenario: Document messaging component
**Given** the messaging component section
**When** reviewing messaging documentation
**Then** the document MUST describe where messaging appears
**And** the document MUST describe who can send messages
**And** the document MUST describe message input field
**And** the document MUST describe message display format
**And** the document MUST list the send button

---

### Requirement: Completeness and Accuracy
The document MUST be complete and accurate relative to the source.

#### Scenario: All screens from application map must be covered
**Given** the current_application_map.md source document
**When** comparing with designer_ux_requirements.md
**Then** every screen in application map MUST have corresponding section in UX requirements
**And** every form in application map MUST have corresponding field list in UX requirements
**And** every user action in application map MUST have corresponding button/action in UX requirements

#### Scenario: No information loss for designers
**Given** any screen in the application map
**When** reviewing the corresponding UX requirements section
**Then** all user-visible data MUST be documented
**And** all form fields MUST be documented
**And** all buttons/actions MUST be documented
**And** all user role restrictions MUST be documented

#### Scenario: Document must be actionable
**Given** the designer UX requirements document
**When** a designer reads any screen description
**Then** the designer MUST be able to create a mockup from the description
**And** the designer MUST understand what data to display
**And** the designer MUST understand what form fields to design
**And** the designer MUST understand what buttons to include
