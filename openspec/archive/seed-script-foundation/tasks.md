# Implementation Tasks

## Task 1: Pre-compute Bcrypt Hash for TestPass123

**Implementation Notes:**
- At the top of `prisma/seed.ts`, add a constant for the pre-computed password hash:
  ```typescript
  // Pre-computed bcrypt hash for "TestPass123" (rounds: 10)
  // Generated once with: await bcrypt.hash('TestPass123', 10)
  const DEFAULT_PASSWORD_HASH = '$2a$10$YourActualHashHere';
  ```
- To generate the hash once, run this in a Node REPL or temporary script:
  ```typescript
  import bcrypt from 'bcryptjs';
  const hash = await bcrypt.hash('TestPass123', 10);
  console.log(hash);
  ```
- Copy the output and paste it as the `DEFAULT_PASSWORD_HASH` constant
- This avoids running bcrypt.hash() 6 times on every seed execution (performance optimization)

**Test Plan:**
- Generate the hash using the command above
- Verify the hash starts with `$2a$10$` or `$2b$10$`
- Add the constant to seed.ts
- Verify TypeScript compilation succeeds
- Later tasks will verify login works with this hash

---

## Task 2: Create Foundation CLIENT Users

**Implementation Notes:**
- Create 2 CLIENT users with realistic Russian data:

  **Client 1:**
  - Email: `ivan.petrov@techcorp.ru`
  - Password: Use `DEFAULT_PASSWORD_HASH` constant (no bcrypt.hash() call)
  - Role: `CLIENT`
  - ClientProfile (nested create in upsert):
    - companyName: `ТехКорп`
    - inn: `7701234567` (10 digits)
    - kpp: `770101001` (9 digits)
    - contactPerson: `Иван Петров`
    - phoneNumber: `+7 (495) 123-45-67`

  **Client 2:**
  - Email: `maria.sokolova@digitalpro.ru`
  - Password: Use `DEFAULT_PASSWORD_HASH` constant
  - Role: `CLIENT`
  - ClientProfile (nested create in upsert):
    - companyName: `ДиджиталПро`
    - inn: `7702345678` (10 digits)
    - kpp: `770201001` (9 digits)
    - contactPerson: `Мария Соколова`
    - phoneNumber: `+7 (495) 234-56-78`

- Use `prisma.user.upsert()` with `where: { email }` for idempotency
- Create ClientProfile using nested `create` in the `create` block and nested `update` in the `update` block
- Store user objects in variables (e.g., `client1`, `client2`) for later use in gig assignment
- Log each user creation: `console.log('Created CLIENT user: [email]')`

**Example code structure:**
```typescript
const client1 = await prisma.user.upsert({
  where: { email: 'ivan.petrov@techcorp.ru' },
  update: {
    clientProfile: {
      upsert: {
        create: { /* profile data */ },
        update: { /* profile data */ }
      }
    }
  },
  create: {
    email: 'ivan.petrov@techcorp.ru',
    password: DEFAULT_PASSWORD_HASH,
    role: 'CLIENT',
    clientProfile: {
      create: { /* profile data */ }
    }
  }
});
console.log('Created CLIENT user: ivan.petrov@techcorp.ru');
```

**Test Plan:**
- Run `npm run seed`
- Open Prisma Studio: `npx prisma studio`
- Verify 2 CLIENT users exist with correct emails
- Verify passwords are bcrypt hashes (start with `$2a$` or `$2b$`)
- Verify each CLIENT has a ClientProfile record
- Verify ClientProfile fields contain Russian text correctly
- Test login at `/login` with `ivan.petrov@techcorp.ru` / `TestPass123`
- Test login at `/login` with `maria.sokolova@digitalpro.ru` / `TestPass123`
- Verify both users can access `/dashboard` after login
- Verify company names display correctly on dashboard

---

## Task 3: Create Foundation SPECIALIST Users

**Implementation Notes:**
- Create 3 SPECIALIST users with diverse tech stacks:

  **Specialist 1 (Frontend):**
  - Email: `alexey.ivanov@mail.ru`
  - Password: Use `DEFAULT_PASSWORD_HASH` constant
  - Role: `SPECIALIST`
  - SpecialistProfile (nested create in upsert):
    - displayName: `Алексей Иванов`
    - techStack: `React, TypeScript, Next.js, Tailwind CSS`
    - experienceLevel: `SENIOR`
    - bio: `Senior фронтенд-разработчик с 8 годами опыта. Специализируюсь на React и TypeScript.`
    - hourlyRate: `600000` (6000 RUB/hour in kopecks)

  **Specialist 2 (Backend):**
  - Email: `dmitry.volkov@yandex.ru`
  - Password: Use `DEFAULT_PASSWORD_HASH` constant
  - Role: `SPECIALIST`
  - SpecialistProfile (nested create in upsert):
    - displayName: `Дмитрий Волков`
    - techStack: `Python, Django, PostgreSQL, Redis`
    - experienceLevel: `MIDDLE`
    - bio: `Middle бэкенд-разработчик. Работаю с Python и Django более 5 лет.`
    - hourlyRate: `450000` (4500 RUB/hour in kopecks)

  **Specialist 3 (DevOps):**
  - Email: `sergey.morozov@gmail.com`
  - Password: Use `DEFAULT_PASSWORD_HASH` constant
  - Role: `SPECIALIST`
  - SpecialistProfile (nested create in upsert):
    - displayName: `Сергей Морозов`
    - techStack: `Go, Docker, Kubernetes, CI/CD, AWS`
    - experienceLevel: `SENIOR`
    - bio: `Senior DevOps инженер. Специализируюсь на контейнеризации и автоматизации.`
    - hourlyRate: `700000` (7000 RUB/hour in kopecks)

- Use `prisma.user.upsert()` with nested SpecialistProfile upsert
- Log each user creation: `console.log('Created SPECIALIST user: [email]')`

**Example code structure:**
```typescript
await prisma.user.upsert({
  where: { email: 'alexey.ivanov@mail.ru' },
  update: {
    specialistProfile: {
      upsert: {
        create: { /* profile data */ },
        update: { /* profile data */ }
      }
    }
  },
  create: {
    email: 'alexey.ivanov@mail.ru',
    password: DEFAULT_PASSWORD_HASH,
    role: 'SPECIALIST',
    specialistProfile: {
      create: { /* profile data */ }
    }
  }
});
console.log('Created SPECIALIST user: alexey.ivanov@mail.ru');
```

**Test Plan:**
- Run `npm run seed`
- Open Prisma Studio: `npx prisma studio`
- Verify 3 SPECIALIST users exist with correct emails
- Verify each SPECIALIST has a SpecialistProfile record
- Verify tech stacks are diverse and realistic
- Verify experience levels are "MIDDLE" or "SENIOR" (not empty)
- Verify hourly rates are stored in kopecks (large numbers: 450000, 600000, 700000)
- Test login with each specialist email / `TestPass123`
- Navigate to `/dashboard/profile` and verify profile data displays correctly
- Verify Russian text (names, bio) renders correctly in UI
- Navigate to `/dashboard/gigs` and verify specialists can browse gigs

---

## Task 4: Create ADMIN User

**Implementation Notes:**
- Create 1 ADMIN user:
  - Email: `admin@gigly.ru`
  - Password: Use `DEFAULT_PASSWORD_HASH` constant
  - Role: `ADMIN`
  - No profile (ADMIN doesn't need ClientProfile or SpecialistProfile)

- Use `prisma.user.upsert()` with `where: { email: 'admin@gigly.ru' }`
- Log creation: `console.log('Created ADMIN user: admin@gigly.ru')`

**Example code structure:**
```typescript
await prisma.user.upsert({
  where: { email: 'admin@gigly.ru' },
  update: {},
  create: {
    email: 'admin@gigly.ru',
    password: DEFAULT_PASSWORD_HASH,
    role: 'ADMIN',
  }
});
console.log('Created ADMIN user: admin@gigly.ru');
```

**Test Plan:**
- Run `npm run seed`
- Open Prisma Studio: `npx prisma studio`
- Verify ADMIN user exists with email `admin@gigly.ru`
- Verify ADMIN user has no ClientProfile or SpecialistProfile
- Test login at `/login` with `admin@gigly.ru` / `TestPass123`
- Verify redirect to `/admin` dashboard (not `/dashboard`)
- Verify admin can access `/admin/users` and `/admin/gigs`
- Verify admin can suspend a user and close a gig

---

## Task 5: Upsert Example Gigs with Full Data Payloads

**Implementation Notes:**
- **CRITICAL**: Since we're not clearing the database, we need to upsert gigs with FULL data payloads (not just update clientId)
- Copy all 5 existing example gig data from the current seed.ts file
- Update each gig's `clientId` to reference the new foundation CLIENT users
- Distribution:
  - Client 1 (Ivan Petrov): Gigs 1, 2, 3 (Backend API, Frontend Dashboard, DevOps CI/CD)
  - Client 2 (Maria Sokolova): Gigs 4, 5 (Database Optimization, E2E Testing)

**Example code structure:**
```typescript
// Gig 1: Backend API (assign to client1)
const gig1Budget = 18000000; // 180,000 RUB
const gig1ServiceFee = Math.floor(gig1Budget * 0.10);
const gig1Total = gig1Budget + gig1ServiceFee;

await prisma.gig.upsert({
  where: { id: 'example-gig-backend-api' },
  update: {
    clientId: client1.id, // Update to new client
  },
  create: {
    id: 'example-gig-backend-api',
    title: 'REST API для системы управления пользователями',
    description: '...',  // Full description
    goal: '...',
    deliverables: '...',
    constraints: '...',
    acceptanceCriteria: '...',
    budget: gig1Budget,
    serviceFee: gig1ServiceFee,
    totalAmount: gig1Total,
    tags: 'Node.js,TypeScript,PostgreSQL,REST API,JWT',
    status: 'OPEN',
    isExample: true,
    clientId: client1.id,
  },
});
console.log('Created/updated example gig: Backend API');
```

- Repeat for all 5 gigs with full data payloads
- Ensure all gigs have `status: 'OPEN'` and `isExample: true`
- Log each gig: `console.log('Created/updated example gig: [title]')`

**Test Plan:**
- Run `npm run seed`
- Open Prisma Studio: `npx prisma studio`
- Verify all 5 example gigs exist
- Verify gigs are distributed: 3 for Client 1 (Ivan), 2 for Client 2 (Maria)
- Login as `ivan.petrov@techcorp.ru`
- Navigate to `/dashboard` and verify "My Gigs" shows 3 gigs
- Login as `maria.sokolova@digitalpro.ru`
- Navigate to `/dashboard` and verify "My Gigs" shows 2 gigs
- Verify gig content (title, description, budget, tags) is complete and correct
- Navigate to `/dashboard/gigs` as SPECIALIST and verify all 5 gigs are visible
- Verify gig detail pages show correct client company names

---

## Task 6: Add Comprehensive Logging

**Implementation Notes:**
- Add a final summary section at the end of `main()` function:
  ```typescript
  console.log('\n=== SEED COMPLETED ===\n');
  console.log('Foundation Users Created:');
  console.log('');
  console.log('CLIENTs:');
  console.log('  • ivan.petrov@techcorp.ru (ТехКорп)');
  console.log('  • maria.sokolova@digitalpro.ru (ДиджиталПро)');
  console.log('');
  console.log('SPECIALISTs:');
  console.log('  • alexey.ivanov@mail.ru (Frontend/React)');
  console.log('  • dmitry.volkov@yandex.ru (Backend/Python)');
  console.log('  • sergey.morozov@gmail.com (DevOps/Go)');
  console.log('');
  console.log('ADMIN:');
  console.log('  • admin@gigly.ru');
  console.log('');
  console.log('Password for all users: TestPass123');
  console.log('');
  console.log('Login at http://localhost:3000/login');
  console.log('');
  ```
- Ensure all intermediate steps log progress (user creation, gig creation)
- Use clear, developer-friendly formatting with bullet points and spacing

**Test Plan:**
- Run `npm run seed`
- Verify console output includes:
  - "Created CLIENT user: [email]" for each client
  - "Created SPECIALIST user: [email]" for each specialist
  - "Created ADMIN user: admin@gigly.ru"
  - "Created/updated example gig: [title]" for each gig
  - Final summary table with all users grouped by role
  - Clear password information
  - Login URL
- Verify output is easy to read and copy-paste credentials
- Verify spacing and formatting make it scannable

---

## Task 7: Verify Idempotency and Non-Destructiveness

**Implementation Notes:**
- Ensure all `prisma.user.upsert()` calls use `where: { email }` for unique identification
- Ensure all `prisma.gig.upsert()` calls use `where: { id }` for unique identification
- Ensure nested profile upserts use proper `upsert` syntax in the `update` block
- Test that running seed multiple times:
  - Does NOT clear existing data (applications, messages, etc.)
  - Does NOT create duplicate users or gigs
  - DOES update existing records to match current seed data

**Test Plan:**
- **First run:**
  - Run `npm run seed`
  - Verify 6 users and 5 gigs are created
  - Open Prisma Studio and note user IDs

- **Create test data:**
  - Login as a specialist
  - Apply to a gig (creates Application record)
  - Login as the gig owner
  - Accept the application
  - Send a message (creates Message record)

- **Second run:**
  - Run `npm run seed` again
  - Verify no errors occur
  - Open Prisma Studio
  - Verify still exactly 6 foundation users and 5 example gigs
  - Verify user IDs are the same (not recreated)
  - **CRITICAL**: Verify Application and Message records still exist (not deleted)
  - Verify profile data is updated to match seed data

- **Third run:**
  - Run `npm run seed` third time
  - Verify stability (no errors, same results)

---

## Task 8: Update package.json Script (if needed)

**Implementation Notes:**
- Check if `package.json` has a `"seed"` script in the `"scripts"` section
- If not, add: `"seed": "npx prisma db seed"`
- Verify `prisma.seed` configuration exists in `package.json`:
  ```json
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
  ```
- If `tsx` is not installed, check if `ts-node` is available
- If neither is installed, add `tsx` as a dev dependency: `npm install -D tsx`

**Test Plan:**
- Run `npm run seed` (should work without errors)
- If command not found, check `package.json` for seed script
- If seed script exists but fails, check for TypeScript execution tool (tsx/ts-node)
- Verify seed script executes and completes successfully
- Check that TypeScript compilation works (seed.ts is compiled and executed)
- Verify no TypeScript errors in seed.ts

---

## Final Verification Checklist

**Complete Test Checklist:**
1. ✅ Run `npm run seed` successfully without errors
2. ✅ Database contains at least 6 foundation users (2 CLIENT, 3 SPECIALIST, 1 ADMIN)
3. ✅ All CLIENTs have ClientProfile with Russian company data
4. ✅ All SPECIALISTs have SpecialistProfile with diverse tech stacks
5. ✅ ADMIN user has no profile
6. ✅ All 5 example gigs exist and are assigned to foundation CLIENTs
7. ✅ Login works for all 6 users with password "TestPass123"
8. ✅ Console output shows clear summary with all credentials
9. ✅ Running seed multiple times is idempotent (no errors, no duplicates)
10. ✅ **CRITICAL**: Existing test data (applications, messages) is preserved after re-running seed
11. ✅ Russian text (names, companies, bios) displays correctly in UI
12. ✅ No dynamic bcrypt.hash() calls (uses pre-computed constant)
13. ✅ Gig detail pages show correct client company names
14. ✅ Specialists can browse and apply to gigs
15. ✅ Admin can access admin dashboard and moderation tools
