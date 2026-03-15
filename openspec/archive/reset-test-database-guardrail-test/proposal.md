# Change Proposal: reset-test-database-guardrail-test

## Summary
Add a small “guardrail” test that ensures the global `resetTestDatabase()` helper truly clears the per-worker test database between tests.

This change protects the test infrastructure against schema drift: when new Prisma models/tables are added in the future, contributors may forget to update `resetTestDatabase()`’s delete order/list. Without a guardrail, this can silently reintroduce cross-test data leakage and flaky test failures.

## Problem
The repository relies on test database isolation for fast, parallel Vitest execution. The current strategy resets the database before each test.

Because the reset logic is implemented as explicit deletes (in FK-safe order), it is possible for future schema changes to introduce a new table that is not cleared. If that happens:
- later tests may observe data created by earlier tests
- unique constraints may fail unpredictably
- failures will appear unrelated to the schema change

## Goals
- Provide a deterministic test that fails loudly when `resetTestDatabase()` is no longer clearing all relevant tables.
- Keep the guardrail cheap and easy to maintain.

## Non-goals
- Do not redesign the test database strategy (no move to automatic introspection or transaction-only isolation).
- Do not change production database behavior.
- Do not eliminate notification unique-constraint log noise (that can be handled in a separate change).

## Constraints
- The guardrail MUST run as part of `npm run test:unit`.
- The guardrail MUST be deterministic and not depend on test ordering.
- The guardrail MUST avoid brittle coupling to unrelated business logic; it should exercise only the test reset surface area.
