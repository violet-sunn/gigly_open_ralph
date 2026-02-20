# Test Plan: Specialist Journey E2E

## Test Execution

### Run Single Test
```bash
npm run test:e2e -- specialist-journey.spec.ts
```
**Expected**: 1 passed in ~16-17 seconds, exit code 0

### Run All E2E Tests
```bash
npm run test:e2e
```
**Expected**: 9 passed in ~30-35 seconds (includes auth-session, registration, client-journey, specialist-journey)

### Verify Idempotency (5 runs)
```bash
for i in {1..5}; do npm run test:e2e -- specialist-journey.spec.ts || exit 1; done
```
**Expected**: All 5 runs pass, no unique constraint violations

## Test Coverage Verification

### Verify Test File Exists
```bash
ls -la __tests__/e2e/specialist-journey.spec.ts
```
**Expected**: File exists, ~12.9KB, 308 lines

### Verify Russian Data
```bash
grep -c "Александр Петров" __tests__/e2e/specialist-journey.spec.ts
grep -c "Разработка REST API" __tests__/e2e/specialist-journey.spec.ts
```
**Expected**: Both return > 0 (Russian content present)

### Verify Spec Integration
```bash
grep -n "Specialist Journey E2E Test" openspec/specs/testing/spec.md
```
**Expected**: Line number returned (spec integrated at line 1742)

## Regression Testing

### Run Full Test Suite
```bash
npm run test:unit && npm run test:e2e
```
**Expected**: All unit tests pass, all E2E tests pass

### Verify No Breaking Changes
```bash
npm run test:e2e -- client-journey.spec.ts
npm run test:e2e -- specialist-journey.spec.ts
```
**Expected**: Both journey tests pass independently

## Performance Benchmarks

- **Single run**: 15.7-17.0 seconds
- **Budget**: < 30 seconds
- **Margin**: 43-47% under budget
- **Consistency**: ±1.3s variance across 5 runs

## Data Quality Checks

### Russian Localization
- ✅ Specialist name: "Александр Петров"
- ✅ Company name: "ООО \"ТехноСтарт\""
- ✅ Gig title: "Разработка REST API для мобильного приложения"
- ✅ Application approach: Russian technical content (261 chars)
- ✅ Application questions: Russian questions (217 chars)

### Validation Compliance
- ✅ Approach: 100-2000 chars (actual: 261)
- ✅ Questions: 50-1000 chars (actual: 217)
- ✅ Budget: 150000 kopecks (1500 RUB)
- ✅ Service fee: 10% (15000 kopecks)

## Cleanup Verification

### Check Test Database Cleanup
```bash
# After test run, verify no orphaned data
npm run test:e2e -- specialist-journey.spec.ts
# Database should be clean (test handles cleanup in afterEach)
```

## Troubleshooting

### If Test Fails
1. Check Next.js dev server is running on port 3000
2. Verify test database is accessible
3. Check SESSION_SECRET is set in .env.test
4. Review Playwright browser logs in test-results/

### Common Issues
- **Timeout**: Increase timeout in playwright.config.ts
- **Database locked**: Ensure no other tests running
- **Session issues**: Verify createTestSession helper works

## Success Criteria

✅ Test file exists and is executable
✅ Test passes consistently (5/5 runs)
✅ Test completes in < 30 seconds
✅ All 9 steps execute successfully
✅ Russian data is realistic and valid
✅ Spec is integrated into main testing spec
✅ No regression in other E2E tests
