# Change Proposal: Designer UX Requirements Brief

## Change Name
`generate-designer-ux-brief`

## Problem Statement

The `current_application_map.md` document (1061 lines, 48KB) is an excellent technical specification for developers, but it's far too technical for the UI/UX design team to use effectively.

**Current State Problems:**
- Overloaded with file paths and source code references (e.g., `app/actions/gig.ts:193-213`)
- Heavy database terminology (assignedSpecialistId, upsert, Prisma models, kopecks)
- Backend implementation details (JWT tokens, bcrypt hashing, rate limiters)
- Complex markdown tables with validation logic and source code locations
- Mixed technical and user-facing terminology

**Design Team Needs:**
- Clean, human-readable screen-by-screen guide
- Focus on what users see and do, not how it's implemented
- Simple lists instead of technical tables
- No file paths or database jargon
- Professional Russian language throughout
- Actionable information for creating mockups

## Proposed Solution

Generate a new file `designer_ux_requirements.md` that translates the technical application map into a designer-friendly UX requirements document.

**Deliverable:** `designer_ux_requirements.md` at project root

**Transformation Approach:**

1. **Remove ALL Technical Jargon**
   - No file paths (e.g., `app/register/page.tsx`)
   - No database terms (assignedSpecialistId, upsert, Prisma)
   - No backend logic (JWT, bcrypt, kopecks conversion, rate limiters)
   - No source code references

2. **Reorganize by Screens**
   - Each page/view becomes a clear screen description
   - Group by user role (Client, Specialist, Admin)
   - Focus on user journey, not technical architecture

3. **Simplify Format**
   - Use clean, simple lists
   - Avoid complex markdown tables
   - Use clear section headers
   - Keep descriptions concise

4. **Focus on UI/UX Elements**
   - What data is displayed on screen
   - What form inputs exist (type, label, constraints)
   - What buttons/actions are available
   - What happens when user clicks/submits

5. **Professional Russian Language**
   - Entire document in Russian
   - Clear, professional tone
   - Suitable for design team review

## Constraints

### Critical Constraints
- **READ-ONLY MODE:** No codebase files shall be modified, only documentation created
- **NO TECHNICAL DETAILS:** Remove all file paths, database terms, backend logic
- **DESIGNER-FOCUSED:** Only UI/UX relevant information
- **RUSSIAN LANGUAGE:** Entire document in professional Russian
- **GROUND TRUTH ONLY:** Document only what exists in current_application_map.md

### Scope Boundaries
- **In Scope:** Screen layouts, form fields, user actions, data displayed, user flows
- **Out of Scope:** Implementation details, database schema, API endpoints, validation logic code, UI/UX recommendations, visual design specs

## Document Structure

`designer_ux_requirements.md` will contain:

1. **Обзор платформы** — Brief overview for designers
2. **Экраны регистрации и входа** — Registration and login screens
3. **Экраны клиента** — Client screens (gig creation, application review, payment)
4. **Экраны специалиста** — Specialist screens (gig browsing, application submission, work delivery)
5. **Экраны администратора** — Admin screens (user management, moderation)
6. **Общие компоненты** — Shared components (messaging)

**Format for Each Screen:**
1. Название экрана и его назначение
2. Кто видит этот экран (Клиент / Специалист / Администратор)
3. Отображаемые данные
4. Поля форм для дизайна (тип поля, ограничения)
5. Доступные кнопки и действия

## Success Criteria

1. **Completeness:** All screens from application map translated
2. **Clarity:** No technical jargon, readable by non-technical designers
3. **Actionability:** Design team can create mockups directly from this document
4. **Language:** Entirely in professional Russian
5. **Simplicity:** Uses simple lists, avoids complex tables

## Non-Goals

- UI/UX design recommendations (just document current state)
- Visual design specifications (colors, fonts, spacing)
- Interaction design patterns
- Accessibility guidelines
- Mobile responsive layouts
- Performance considerations
- Security documentation

## Expected Impact

**For Design Team:**
- Clear understanding of all screens and user flows
- Exact field requirements for form designs
- Understanding of user roles and permissions
- Basis for creating mockups and prototypes

**For Development Team:**
- Single source of truth for designer-developer communication
- Reference for explaining current functionality to designers
- Baseline for design proposals

## Risk Assessment

**Risk Level:** 🟢 **Low**

This is a read-only documentation transformation task with no code changes. The only risk is incomplete or unclear translation, which will be mitigated by:
- Systematic screen-by-screen transformation
- Validation against original application map
- Verification that no technical jargon remains
