# Implementation Tasks: Project Initialization

## Task Checklist

### 1. Initialize Next.js Project
**Implementation:**
- Run `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir`
- Accept defaults for ESLint, import alias
- Verify package.json shows Next.js 15+

**Test Plan:**
- Run `npm run dev`
- Navigate to http://localhost:3000
- Verify default Next.js page loads
- Check `package.json` for `"next": "^15.x.x"`

---

### 2. Install and Configure Prisma
**Implementation:**
- Run `npm install prisma @prisma/client`
- Run `npx prisma init --datasource-provider sqlite`
- Verify `prisma/schema.prisma` created
- Verify `.env` created with DATABASE_URL

**Test Plan:**
- Check `prisma/schema.prisma` exists
- Verify datasource provider is "sqlite"
- Run `npx prisma format` (should succeed)

---

### 3. Define User Model in Prisma Schema
**Implementation:**
- Edit `prisma/schema.prisma`
- Add User model with fields:
  ```prisma
  model User {
    id        String   @id @default(cuid())
    email     String   @unique
    password  String
    role      String   @default("USER")
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }
  ```

**Test Plan:**
- Run `npx prisma format`
- Run `npx prisma validate`
- Both commands should succeed without errors

---

### 4. Create and Apply Initial Migration
**Implementation:**
- Run `npx prisma migrate dev --name init`
- Verify migration files created in `prisma/migrations/`
- Verify SQLite database file created (`prisma/dev.db`)

**Test Plan:**
- Check `prisma/migrations/` directory exists with migration
- Run `npx prisma studio`
- Verify User model appears in Prisma Studio
- Verify table has all columns (id, email, password, role, createdAt, updatedAt)

---

### 5. Generate Prisma Client
**Implementation:**
- Run `npx prisma generate`
- Create `lib/prisma.ts` with singleton Prisma client:
  ```typescript
  import { PrismaClient } from '@prisma/client'

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
  }

  export const prisma = globalForPrisma.prisma ?? new PrismaClient()

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  ```

**Test Plan:**
- Run `npx prisma generate` (should succeed)
- Verify `node_modules/.prisma/client` exists
- Import prisma client in a test file (no TypeScript errors)

---

### 6. Create Server Action for User Registration
**Implementation:**
- Create `app/actions/auth.ts`
- Add `'use server'` directive at top
- Implement `registerUser` function:
  ```typescript
  'use server'

  import { prisma } from '@/lib/prisma'

  export async function registerUser(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const user = await prisma.user.create({
        data: { email, password }
      })
      return { success: true, userId: user.id }
    } catch (error) {
      return { success: false, error: 'Registration failed' }
    }
  }
  ```

**Test Plan:**
- TypeScript compilation succeeds
- No import errors for prisma client
- Function signature accepts FormData
- Function returns result object

---

### 7. Create Registration Page
**Implementation:**
- Create `app/register/page.tsx`
- Import registerUser Server Action
- Create form with:
  - Email input (type="email", name="email", required)
  - Password input (type="password", name="password", required)
  - Submit button
  - Form action pointing to registerUser
- Style with Tailwind CSS (centered, card layout, proper spacing)

**Test Plan:**
- Navigate to http://localhost:3000/register
- Verify form renders
- Verify email input has type="email"
- Verify password input has type="password"
- Verify submit button is visible
- Check browser DevTools for no console errors

---

### 8. Test User Registration Flow
**Implementation:**
- Start dev server (`npm run dev`)
- Navigate to /register
- Fill in email and password
- Submit form
- Check database for created user

**Test Plan:**
- Open http://localhost:3000/register
- Enter email: `test@example.com`
- Enter password: `password123`
- Click submit button
- Run `npx prisma studio`
- Verify user exists in User table with entered email
- Verify user has default role "USER"
- Verify createdAt and updatedAt are populated

---

### 9. Visual Verification with Screenshot
**Implementation:**
- Ensure dev server is running
- Use agent-browser or screenshot tool to capture /register page
- Verify all form elements are visible and styled

**Test Plan:**
- Take screenshot of http://localhost:3000/register
- Verify screenshot shows:
  - Email input field with label
  - Password input field with label
  - Submit button
  - Tailwind styling applied (proper spacing, colors, layout)
  - Form is centered or well-positioned
- Screenshot should be clear and show functional UI

---

## Validation Commands

After completing all tasks, run these commands to verify:

```bash
# Verify Next.js runs
npm run dev

# Verify Prisma schema is valid
npx prisma validate

# Verify database and migrations
npx prisma studio

# Verify TypeScript compilation
npx tsc --noEmit

# Check for linting issues
npm run lint
```

## Success Criteria
- ✅ All commands run without errors
- ✅ Registration form accessible at /register
- ✅ Form submission creates user in database
- ✅ Screenshot shows functional, styled form
- ✅ No TypeScript or ESLint errors
