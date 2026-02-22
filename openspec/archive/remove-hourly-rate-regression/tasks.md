# Implementation Tasks: remove-hourly-rate-regression

## Task 1: Create Database Migration to Drop hourlyRate Column

**Implementation:**
- Create new migration file in `prisma/migrations/`
- Write SQL to drop `hourlyRate` column from `SpecialistProfile` table
- Use `ALTER TABLE "SpecialistProfile" DROP COLUMN IF EXISTS "hourlyRate";` for safety
- Ensure migration is idempotent (can run multiple times safely)

**Test Plan:**
```bash
# Create migration
npx prisma migrate dev --name remove_hourly_rate_from_specialist_profile --create-only

# Review generated migration SQL
cat prisma/migrations/*/migration.sql | grep -i hourly

# Apply migration
npx prisma migrate dev

# Verify column dropped
npx prisma studio
# Check SpecialistProfile table - hourlyRate column should not exist
```

**Success Criteria:**
- Migration file created
- Migration executes without errors
- Column no longer exists in database
- Other SpecialistProfile columns remain intact

---

## Task 2: Update Prisma Schema

**Implementation:**
- Open `prisma/schema.prisma`
- Locate `model SpecialistProfile`
- Remove the `hourlyRate` field line completely
- Save file

**Test Plan:**
```bash
# Verify hourlyRate removed from schema
! grep -i "hourlyRate" prisma/schema.prisma

# Validate schema syntax
npx prisma validate

# Format schema
npx prisma format
```

**Success Criteria:**
- No hourlyRate field in SpecialistProfile model
- Schema validates successfully
- No syntax errors

---

## Task 3: Regenerate Prisma Client

**Implementation:**
- Run Prisma client generation
- Verify TypeScript types no longer include hourlyRate

**Test Plan:**
```bash
# Regenerate Prisma client
npx prisma generate

# Verify TypeScript compilation
npx tsc --noEmit

# Check generated types (should not include hourlyRate)
grep -i "hourlyRate" node_modules/.prisma/client/index.d.ts && echo "FAIL: hourlyRate still in types" || echo "PASS: hourlyRate removed from types"
```

**Success Criteria:**
- Prisma client regenerated successfully
- TypeScript types do not include hourlyRate
- No compilation errors

---

## Task 4: Update Profile Actions

**Implementation:**
- Open `app/actions/profile.ts`
- Remove all hourlyRate references:
  - Remove from function parameters
  - Remove from validation logic
  - Remove from database update operations
  - Remove from TypeScript types
- Ensure updateProfile action no longer accepts or processes hourlyRate

**Test Plan:**
```bash
# Verify no hourlyRate in profile actions
! grep -i "hourlyRate" app/actions/profile.ts

# Verify TypeScript compiles
npx tsc --noEmit

# Run profile-related tests
npm test -- profile
```

**Success Criteria:**
- No hourlyRate references in profile actions
- TypeScript compiles without errors
- Profile tests pass

---

## Task 5: Update Profile Edit Form

**Implementation:**
- Open `app/dashboard/profile/edit/ProfileEditForm.tsx`
- Remove hourlyRate input field completely:
  - Remove form field JSX
  - Remove from form state
  - Remove validation
  - Remove from submit handler
- Update TypeScript types if needed

**Test Plan:**
```bash
# Verify no hourlyRate in form
! grep -i "hourlyRate" app/dashboard/profile/edit/ProfileEditForm.tsx

# Verify TypeScript compiles
npx tsc --noEmit

# Manual test: Visit /dashboard/profile/edit
# Verify hourly rate field does not appear
```

**Success Criteria:**
- No hourlyRate field in form
- Form renders without errors
- Form submission works without hourlyRate
- TypeScript compiles successfully

---

## Task 6: Update Profile Display Pages

**Implementation:**
- Open `app/dashboard/profile/page.tsx`
- Remove all hourlyRate display logic
- Open `app/dashboard/profile/[userId]/page.tsx`
- Remove all hourlyRate display logic
- Ensure pages render profile data without hourlyRate

**Test Plan:**
```bash
# Verify no hourlyRate in profile pages
! grep -i "hourlyRate" app/dashboard/profile/page.tsx
! grep -i "hourlyRate" app/dashboard/profile/[userId]/page.tsx

# Verify TypeScript compiles
npx tsc --noEmit

# Manual test: Visit profile pages
# Verify hourly rate does not appear anywhere
```

**Success Criteria:**
- No hourlyRate display on any profile page
- Pages render correctly
- TypeScript compiles successfully

---

## Task 7: Update Test Helpers

**Implementation:**
- Open `__tests__/helpers/auth.ts`
- Remove hourlyRate from specialist profile creation
- Open `__tests__/helpers/seed.ts`
- Remove hourlyRate from test data
- Update TypeScript types

**Test Plan:**
```bash
# Verify no hourlyRate in test helpers
! grep -i "hourlyRate" __tests__/helpers/auth.ts
! grep -i "hourlyRate" __tests__/helpers/seed.ts

# Run all tests
npm test

# Verify tests pass
```

**Success Criteria:**
- No hourlyRate in test helpers
- All tests pass
- Test data creates valid specialist profiles

---

## Task 8: Update Seed Script

**Implementation:**
- Open `prisma/seed.ts`
- Remove hourlyRate from all specialist profile creation
- Ensure seed data is valid without hourlyRate

**Test Plan:**
```bash
# Verify no hourlyRate in seed script
! grep -i "hourlyRate" prisma/seed.ts

# Run seed script
npx prisma db seed

# Verify seed completes successfully
```

**Success Criteria:**
- No hourlyRate in seed script
- Seed script runs without errors
- Database populated correctly

---

## Task 9: Update Documentation

**Implementation:**
- Open `current_application_map.md`
- Remove all hourlyRate mentions from specialist profile section
- Open `designer_ux_requirements.md`
- Remove all почасовая ставка mentions from specialist profile section
- Open `TESTING.md`
- Remove hourlyRate from test data specifications
- Update `openspec/specs/profile/spec.md`
- Remove hourlyRate requirements
- Update `openspec/specs/database/spec.md`
- Remove hourlyRate field documentation
- Update `openspec/specs/ui/spec.md`
- Remove hourlyRate UI specifications

**Test Plan:**
```bash
# Verify no hourlyRate in application map
! grep -i "hourlyRate\|почасов" current_application_map.md

# Verify no hourlyRate in designer requirements
! grep -i "hourlyRate\|почасов" designer_ux_requirements.md

# Verify no hourlyRate in testing docs
! grep -i "hourlyRate" TESTING.md

# Verify no hourlyRate in active specs
! grep -i "hourlyRate" openspec/specs/**/*.md
```

**Success Criteria:**
- No hourlyRate in any documentation
- Documentation accurately reflects current system
- All specs updated

---

## Task 10: Comprehensive Verification

**Implementation:**
- Run all validation commands
- Verify complete removal of hourlyRate
- Ensure all tests pass
- Verify TypeScript compilation
- Check database schema

**Test Plan:**
```bash
# Comprehensive grep (excluding archive and node_modules)
grep -r "hourlyRate\|почасов" . \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=openspec/archive \
  --exclude-dir=.git

# Should return NO matches (exit code 1)
# If any matches found, they must be removed

# Run all tests
npm test

# Verify TypeScript compilation
npx tsc --noEmit

# Verify Prisma schema
npx prisma validate

# Verify database state
npx prisma studio
# Check SpecialistProfile table - no hourlyRate column
```

**Success Criteria:**
- Zero hourlyRate references in active codebase
- All tests pass
- TypeScript compiles without errors
- Prisma schema valid
- Database schema correct
- Application runs without errors

---

## Completion Checklist

- [ ] Task 1: Database migration created and applied
- [ ] Task 2: Prisma schema updated
- [ ] Task 3: Prisma client regenerated
- [ ] Task 4: Profile actions updated
- [ ] Task 5: Profile edit form updated
- [ ] Task 6: Profile display pages updated
- [ ] Task 7: Test helpers updated
- [ ] Task 8: Seed script updated
- [ ] Task 9: Documentation updated
- [ ] Task 10: Comprehensive verification passed

**Final Validation:**
```bash
# This command MUST return no results
grep -r "hourlyRate\|почасов" . \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=openspec/archive \
  --exclude-dir=.git \
  && echo "FAIL: hourlyRate references still exist" \
  || echo "PASS: All hourlyRate references removed"
```
