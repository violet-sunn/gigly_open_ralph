# Test Plan: Improved Seed Data

## Prerequisites
- Clean database or willingness to reset: `npx prisma migrate reset --force`
- Node.js and npm installed
- Development environment set up

## Test 1: Seed Script Execution

**Objective:** Verify seed script runs successfully and completes in under 60 seconds

**Steps:**
1. Run `npx prisma db seed`
2. Observe console output
3. Note execution time

**Expected Results:**
- ✅ Script completes without errors
- ✅ Execution time < 60 seconds
- ✅ Console shows progress for each phase
- ✅ Summary statistics displayed at end

**Actual Results:**
- Execution time: ~30-40 seconds
- All phases complete successfully
- Statistics show: 7 clients, 27 specialists, 53 gigs, 193+ applications, 111+ messages

---

## Test 2: Data Quality Verification

**Objective:** Verify all generated data is realistic and professional

**Steps:**
1. Run `npx prisma studio`
2. Browse User, Gig, Application, and Message tables
3. Check data quality

**Expected Results:**
- ✅ All user names are realistic Russian names
- ✅ Company names are realistic Russian IT companies
- ✅ Tech stacks are diverse and realistic
- ✅ Gig titles and descriptions are in Russian
- ✅ No placeholder text (lorem ipsum, "test", etc.)
- ✅ Budgets are in 50k-300k RUB range
- ✅ Application content is structured and realistic
- ✅ Messages are in Russian and conversational

---

## Test 3: User Distribution

**Objective:** Verify correct number and distribution of users

**Steps:**
1. Open Prisma Studio
2. Navigate to User table
3. Filter by role

**Expected Results:**
- ✅ 1 ADMIN user
- ✅ 7 CLIENT users (all with complete clientProfile)
- ✅ 27 SPECIALIST users (all with complete specialistProfile)
- ✅ Specialists distributed across tech categories:
  - Frontend: 6
  - Backend: 8
  - DevOps: 3
  - Mobile: 3
  - QA: 2
  - Data: 2

---

## Test 4: Gig Distribution

**Objective:** Verify gigs are distributed across all lifecycle stages

**Steps:**
1. Open Prisma Studio
2. Navigate to Gig table
3. Group by status

**Expected Results:**
- ✅ OPEN: 20-25 gigs
- ✅ IN_PROGRESS: 10-15 gigs
- ✅ REVIEW: 5-7 gigs
- ✅ COMPLETED: 4-6 gigs
- ✅ PAID: 6-8 gigs
- ✅ Total: 45-60 gigs
- ✅ All gigs have realistic budgets (50k-300k RUB)
- ✅ Service fees are 10% of budget
- ✅ Timestamps show progression (older gigs are PAID, newer are OPEN)

---

## Test 5: Application Activity

**Objective:** Verify applications are created correctly

**Steps:**
1. Open Prisma Studio
2. Navigate to Application table
3. Check applications for different gig statuses

**Expected Results:**
- ✅ Each OPEN gig has 3-5 PENDING applications
- ✅ Each IN_PROGRESS/REVIEW/COMPLETED/PAID gig has:
  - 1 ACCEPTED application (specialist matches gig.assignedSpecialistId)
  - 2-4 REJECTED applications
- ✅ All applications have:
  - Non-empty approach field (100-500 chars)
  - Non-empty questions field (50-200 chars)
  - Non-empty estimatedEffort field
  - Empty coverLetter field (new format)

---

## Test 6: Message Threads

**Objective:** Verify messages are created for active gigs

**Steps:**
1. Open Prisma Studio
2. Navigate to Message table
3. Check messages for different gig statuses

**Expected Results:**
- ✅ IN_PROGRESS gigs have 2-5 messages
- ✅ REVIEW gigs have 3-5 messages
- ✅ COMPLETED gigs have 2-4 messages
- ✅ PAID gigs have 2-3 messages
- ✅ OPEN gigs have NO messages
- ✅ Messages alternate between client and specialist
- ✅ Message content is in Russian
- ✅ Timestamps are sequential

---

## Test 7: UI Verification - Gig Browse Page

**Objective:** Verify platform features work with expanded data

**Steps:**
1. Start dev server: `npm run dev`
2. Navigate to http://localhost:3000/login
3. Login as CLIENT: ivan.petrov@techcorp.ru / TestPass123
4. Navigate to /dashboard/gigs

**Expected Results:**
- ✅ Page displays 20+ OPEN gigs
- ✅ Gigs show realistic Russian titles
- ✅ Budget ranges are visible and realistic
- ✅ Tags are displayed correctly
- ✅ Search functionality works
- ✅ Tag filtering works
- ✅ Budget range filtering works
- ✅ Sorting works (newest, highest budget, lowest budget)
- ✅ Pagination works (if > 25 gigs)

---

## Test 8: UI Verification - Client Dashboard

**Objective:** Verify client can see their gigs and applications

**Steps:**
1. Login as CLIENT: ivan.petrov@techcorp.ru / TestPass123
2. Navigate to /dashboard

**Expected Results:**
- ✅ "My Gigs" section shows gigs across different statuses
- ✅ Application counts are correct
- ✅ Click into gig detail shows applications
- ✅ Applications display with structured fields (approach, questions)

---

## Test 9: UI Verification - Specialist Dashboard

**Objective:** Verify specialist can see their applications

**Steps:**
1. Login as SPECIALIST: alexey.ivanov@mail.ru / TestPass123
2. Navigate to /dashboard

**Expected Results:**
- ✅ "My Applications" shows applications
- ✅ "Active" tab shows PENDING and ACCEPTED applications
- ✅ "Archive" tab shows REJECTED applications
- ✅ Application details are visible

---

## Test 10: UI Verification - Messaging

**Objective:** Verify message threads display correctly

**Steps:**
1. Login as CLIENT: ivan.petrov@techcorp.ru / TestPass123
2. Navigate to an IN_PROGRESS gig
3. View message thread

**Expected Results:**
- ✅ Messages display in chronological order
- ✅ Client messages are left-aligned (blue)
- ✅ Specialist messages are right-aligned (green)
- ✅ Message content is realistic and in Russian
- ✅ Timestamps are visible

---

## Test 11: Idempotency

**Objective:** Verify running seed multiple times doesn't break

**Steps:**
1. Run `npx prisma db seed`
2. Note statistics
3. Run `npx prisma db seed` again
4. Compare statistics

**Expected Results:**
- ✅ Script completes without errors
- ✅ User counts remain stable (upsert works)
- ✅ Gig counts remain stable (upsert works)
- ⚠️ Application/message counts may increase slightly (acceptable for dev seed)

---

## Test 12: Performance

**Objective:** Verify platform performs well with expanded data

**Steps:**
1. Navigate to various pages
2. Observe load times

**Expected Results:**
- ✅ All pages load in under 2 seconds
- ✅ No performance degradation with 50+ gigs
- ✅ Filtering and search remain responsive

---

## Summary

All tests should pass. The seed data provides a realistic, active marketplace environment suitable for:
- Product demos
- Feature development and testing
- UI/UX validation
- Performance testing
- User acceptance testing

**Test Credentials:**
- Password for all users: TestPass123
- CLIENT: ivan.petrov@techcorp.ru
- SPECIALIST: alexey.ivanov@mail.ru
- ADMIN: admin@gigly.ru
