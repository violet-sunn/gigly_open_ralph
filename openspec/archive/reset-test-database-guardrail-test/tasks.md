# Tasks — reset-test-database-guardrail-test

1) Add a guardrail test for DB reset completeness
   - Create a new unit/integration test (prefer `__tests__/helpers/reset-test-database.guardrail.test.ts` or similar).
   - The test MUST:
     - create representative records in the core tables that `resetTestDatabase()` is expected to clear
     - call `resetTestDatabase()`
     - assert the affected tables are empty afterward
   - The test SHOULD use existing factories/helpers to create records (to avoid coupling to internal Prisma details).
   - The test SHOULD explicitly assert emptiness for:
     - `notification`, `message`, `application`, `moderationLog`, `gig`, `clientProfile`, `specialistProfile`, `user`

2) Ensure the guardrail fails when reset coverage is incomplete
   - Add a minimal “canary” assertion that would fail if any of the above tables retains rows.
   - Do NOT add flakiness (no reliance on random order or timing).

3) Run and validate
   - Run: `npm run test:unit`
   - Acceptance: exits 0, no failing tests.

## Test plan
- Primary: `npm run test:unit`
- Optional robustness check: run `npm run test:unit` twice to ensure no leakage/flakes.
