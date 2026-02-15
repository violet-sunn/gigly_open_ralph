# Tasks: Role Selection & Role-Based Dashboards

## 1. Wipe existing users and keep schema safe
- Keep `role String @default("USER")` in the Prisma schema (no migration needed)
- Delete all existing users: run `npx tsx -e "import 'dotenv/config'; import { PrismaClient } from '@prisma/client'; import { PrismaLibSql } from '@prisma/adapter-libsql'; const a = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' }); const p = new PrismaClient({ adapter: a as any }); const r = await p.user.deleteMany(); console.log('Deleted', r.count, 'users'); await p['$disconnect']();"` or equivalent
- **Test:** `npx prisma validate` passes. User table is empty.

## 2. Update `createSession` to include `role`
- Change signature to `createSession(userId: string, email: string, role: string)`
- Add `role` to the JWT payload in `SignJWT({ userId, email, role })`
- Update `getSession()` return type to `{ userId: string; email: string; role: string } | null`
- **Test:** `npx tsc --noEmit` passes

## 3. Update middleware `verifySession` return type
- Add `role: string` to the type assertion in `middleware.ts`
- **Test:** `npx tsc --noEmit` passes

## 4. Update `registerUser` to accept and validate role
- Read `formData.get('role')` as string
- Validate it is `"CLIENT"` or `"SPECIALIST"` — return `{ error: 'Please select a role.' }` otherwise
- Pass `role` to `prisma.user.create({ data: { email, password: hashedPassword, role } })`
- Pass `role` to `createSession(user.id, user.email, user.role)`
- **Test:** `npx tsc --noEmit` passes

## 5. Update `loginUser` to include role in session
- Pass `user.role` to `createSession(user.id, user.email, user.role)`
- **Test:** `npx tsc --noEmit` passes

## 6. Update registration form with role selector
- Add radio buttons for "Client" (`value="CLIENT"`) and "Specialist" (`value="SPECIALIST"`)
- Both use `name="role"`, required
- Style consistently with existing form elements
- **Test:** `npx tsc --noEmit` passes. `npm run lint` passes.

## 7. Update dashboard for role-based views
- Read `session.role` from `getSession()`
- CLIENT view: "Client Dashboard" heading, "Post a Gig" CTA (placeholder), "My Gigs" empty state
- SPECIALIST view: "Specialist Dashboard" heading, "Browse Gigs" CTA (placeholder), "My Applications" empty state
- Fallback for unknown roles (e.g. legacy `"USER"` or `"ADMIN"`): show generic dashboard with a message prompting to contact support
- Both views keep the sign-out button
- **Test:** `npx tsc --noEmit` passes. `npm run lint` passes.

## 8. Update integration test script
- Update test user creation to include explicit `role: "CLIENT"` and `role: "SPECIALIST"`
- Assert `user.role` matches after DB query
- Add test for role validation logic: confirm `"INVALID"` is not in the allowed set `["CLIENT", "SPECIALIST"]`
- **Test:** `npx tsx scripts/test-auth-flow.ts` exits 0 with all PASS

## 9. Final validation
- Run `npx tsc --noEmit` — no type errors
- Run `npm run lint` — no lint errors
- Run `npx prisma validate` — schema valid
- Run `npx tsx scripts/test-auth-flow.ts` — all assertions pass
- Run `npm run build` — build succeeds
