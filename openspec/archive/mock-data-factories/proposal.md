# Change Proposal: Mock Data Factories

## Problem Statement

Tests need realistic, valid data for all models (User, Gig, Application, Message, etc.) to properly validate business logic and user workflows. Currently:

1. **Existing factories use generic English data** - Test users are "test-123@example.com", companies are "Test Company", which doesn't reflect the Russian market reality
2. **Missing factories** - No dedicated factory for Message model, no standalone profile factories
3. **Validation compliance unclear** - Not obvious that factories create data passing all validations (e.g., experienceLevel must be MIDDLE/SENIOR)
4. **Limited discoverability** - Factories exist but lack documentation and examples showing common patterns

This makes tests less realistic and harder to write, especially for developers unfamiliar with the domain.

## Proposed Solution

Enhance the existing test factory system in `__tests__/helpers/seed.ts` with:

1. **Russian data generators** - Realistic Russian names, company names, tech content, and messages
2. **Message factory** - `createTestMessage()` for gig-scoped messaging tests
3. **Validation-compliant defaults** - All factories guarantee data passes model validations
4. **Improved composability** - Clear patterns for creating related data graphs
5. **Documentation and examples** - Usage guide with common test scenarios

### Russian Data Examples

**Names:**
- Александр Петров, Мария Иванова, Дмитрий Соколов, Екатерина Волкова

**Companies:**
- ООО "ТехноСтарт", ООО "Цифровые Решения", ООО "Инновационные Системы"

**INN (Realistic pool):**
- Pool of realistic 10-digit INN values (e.g., "7743013902", "7707083893", "5004002123")
- Random selection from pool for test variety

**Tech Stack:**
- React, TypeScript, Node.js, PostgreSQL, Docker, Kubernetes (same as international, but with Russian context)

**Gig Titles:**
- "Разработка REST API для мобильного приложения"
- "Настройка CI/CD pipeline на GitLab"
- "Рефакторинг legacy кода на TypeScript"

**Messages:**
- "Добрый день! Уточните, пожалуйста, требования к производительности API."
- "Работа завершена, результаты в ветке feature/api-refactor."

## Constraints

- **Backward compatibility** - Existing tests using current factories must continue to work
- **Override support** - All factories must accept overrides for specific fields
- **Transaction-safe** - Factories must work within `withTestTransaction()` rollback pattern
- **Deterministic when needed** - Support seeded random generation for reproducible tests
- **No external dependencies** - Use built-in data, no API calls or external files
- **Uniqueness guarantees** - Fields with unique constraints (email) MUST auto-generate unique values to prevent "Unique constraint failed" errors in parallel test execution

## Non-Goals

- Faker.js or similar library integration (keep dependencies minimal)
- Localization beyond Russian (single market focus)
- Image/file generation for profiles or attachments
- Performance optimization for bulk data generation (MVP focuses on correctness)
- Real INN/KPP validation (use realistic-looking but fake values)

## Success Metrics

- All existing tests pass with enhanced factories
- New tests can be written with realistic Russian data in <5 lines of code
- Factory usage documented with examples covering 80% of common test scenarios
- Zero validation errors when using factory defaults
