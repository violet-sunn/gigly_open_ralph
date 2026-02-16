# Implementation Tasks: Specialist Profiles

## Task 1: Create ClientProfile and SpecialistProfile Models

**Implementation:**
- Update `prisma/schema.prisma` to add two new models:

  **ClientProfile:**
  ```prisma
  model ClientProfile {
    userId        String   @id
    user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    companyName   String
    inn           String
    kpp           String   @default("")
    contactPerson String   @default("")
    phoneNumber   String   @default("")
    createdAt     DateTime @default(now())
    updatedAt     DateTime @updatedAt
  }
  ```

  **SpecialistProfile:**
  ```prisma
  model SpecialistProfile {
    userId          String   @id
    user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    displayName     String   @default("")
    techStack       String   @default("")
    experienceLevel String   @default("")
    bio             String   @default("")
    hourlyRate      Int      @default(0)
    createdAt       DateTime @default(now())
    updatedAt       DateTime @updatedAt
  }
  ```

- Update User model to add relations:
  ```prisma
  model User {
    // ... existing fields ...
    clientProfile     ClientProfile?
    specialistProfile SpecialistProfile?
  }
  ```

- Run `npx prisma format` to format the schema
- Run `npx prisma migrate dev --name add_profile_tables` to create and apply migration
- Run `npx prisma generate` to update Prisma client

**Test Plan:**
```bash
# Validate schema
npx prisma validate

# Check migration was created
ls prisma/migrations/ | grep add_profile_tables

# Open Prisma Studio and verify models
npx prisma studio
# Navigate to ClientProfile and SpecialistProfile models
# Verify userId is the primary key
# Verify all fields are present with correct types and defaults
```

**Acceptance:**
- Schema validates without errors
- Migration file exists
- Both profile tables visible in Prisma Studio
- userId is primary key in both tables
- Foreign key constraint to User(id) with CASCADE delete
- No existing user records are affected

---

## Task 2: Create Update Profile Server Action

**Implementation:**
- Create `app/actions/profile.ts` with `'use server'` directive
- Implement `updateProfile(prevState, formData)` function:
  - Get session via `getSession()`, redirect to `/login` if null
  - Branch based on `session.role`:

    **For SPECIALIST:**
    - Extract: displayName, techStack, experienceLevel, bio, hourlyRate
    - Validate experienceLevel is "", "MIDDLE", or "SENIOR"
    - Validate hourlyRate is >= 0 if provided
    - Convert hourlyRate from roubles to kopecks (× 100)
    - Use `prisma.specialistProfile.upsert({ where: { userId }, create: { userId, ...data }, update: { ...data } })`

    **For CLIENT:**
    - Extract: companyName, inn, kpp, contactPerson, phoneNumber
    - Validate companyName and inn are non-empty
    - Use `prisma.clientProfile.upsert({ where: { userId }, create: { userId, ...data }, update: { ...data } })`

  - Redirect to `/dashboard/profile` on success
  - Return `{ error: string }` on failure

**Test Plan:**
```bash
# Create integration test script
npx tsx scripts/test-update-profile.ts
```

Test script should verify:
- SPECIALIST can create profile (first time)
- SPECIALIST can update existing profile
- CLIENT can create profile (first time)
- CLIENT can update existing profile
- CLIENT validation: companyName and inn required
- SPECIALIST validation: experienceLevel must be "", "MIDDLE", or "SENIOR"
- SPECIALIST validation: hourlyRate must be >= 0
- Hourly rate 5000 roubles is stored as 500000 kopecks
- Unauthenticated request redirects to `/login`
- Upsert creates record if not exists, updates if exists

**Acceptance:**
- All test scenarios pass
- Action is compatible with `useActionState`
- Upsert operation works for both create and update
- Role-based table selection works correctly

---

## Task 3: Create Profile View Page

**Implementation:**
- Create `app/dashboard/profile/page.tsx` as a server component
- Get session via `getSession()`, redirect if null (middleware handles this)
- Query user based on role:
  - SPECIALIST: `prisma.user.findUnique({ where: { id: session.userId }, include: { specialistProfile: true } })`
  - CLIENT: `prisma.user.findUnique({ where: { id: session.userId }, include: { clientProfile: true } })`
- Handle null profile case: display "Profile not set up yet" with link to `/dashboard/profile/edit`
- If profile exists, render role-specific fields:
  - SPECIALIST: email, displayName, techStack, experienceLevel, bio, hourlyRate (convert kopecks to roubles)
  - CLIENT: email, companyName, inn, kpp, contactPerson, phoneNumber
- Display "Not set" for empty string fields (displayName, techStack, etc.)
- Display "Not set" for hourlyRate if 0
- Include "Edit Profile" link to `/dashboard/profile/edit`
- Include "Back to Dashboard" link to `/dashboard`

**Test Plan:**
```bash
# Start dev server
npm run dev

# Manual testing:
# 1. Login as SPECIALIST user (new user, no profile)
# 2. Navigate to /dashboard/profile
# 3. Verify "Profile not set up yet" message is displayed
# 4. Click link to edit page

# 5. Create profile via edit page
# 6. Navigate back to /dashboard/profile
# 7. Verify all SPECIALIST fields are displayed
# 8. Verify "Not set" appears for empty fields
# 9. Verify hourlyRate is displayed in roubles (not kopecks)

# 10. Login as CLIENT user (new user, no profile)
# 11. Navigate to /dashboard/profile
# 12. Verify "Profile not set up yet" message
# 13. Create profile and verify display
```

**Acceptance:**
- Page renders without errors for both roles
- Handles null profile gracefully
- Correct fields displayed based on role
- Links work correctly
- Empty strings show "Not set"
- Hourly rate displayed in roubles

---

## Task 4: Create Profile Edit Page

**Implementation:**
- Create `app/dashboard/profile/edit/page.tsx` as a client component (`'use client'`)
- Fetch current profile data server-side (or via separate data-fetching pattern)
- Use `useActionState` with `updateProfile` action
- Render role-specific form fields:

  **SPECIALIST:**
  - displayName (text, optional)
  - techStack (text, optional, placeholder: "React, TypeScript, Node.js")
  - experienceLevel (select with options: "", "MIDDLE", "SENIOR")
  - bio (textarea, optional)
  - hourlyRate (number, optional, in roubles)

  **CLIENT:**
  - companyName (text, required)
  - inn (text, required)
  - kpp (text, optional)
  - contactPerson (text, optional)
  - phoneNumber (text, optional)

- Pre-fill form with existing values (or empty if no profile)
- Use `useFormStatus` for pending state ("Saving..." button text)
- Display error message if `state?.error` exists
- Include "Cancel" link to `/dashboard/profile`

**Test Plan:**
```bash
# Manual testing:
# 1. Login as SPECIALIST user without profile
# 2. Navigate to /dashboard/profile/edit
# 3. Verify form fields are empty
# 4. Fill in: displayName "John Doe", techStack "React, TypeScript", experienceLevel "SENIOR", bio "Experienced dev", hourlyRate 5000
# 5. Click "Save Profile"
# 6. Verify redirect to /dashboard/profile
# 7. Verify all fields saved correctly
# 8. Verify hourlyRate shows as 5000 ₽ (not 500000)

# 9. Navigate back to /dashboard/profile/edit
# 10. Verify form is pre-filled with saved values
# 11. Update displayName to "Jane Doe"
# 12. Save and verify update

# 13. Submit with invalid experienceLevel (manually edit HTML to "JUNIOR")
# 14. Verify error message is displayed

# 15. Login as CLIENT user without profile
# 16. Navigate to /dashboard/profile/edit
# 17. Try to submit without companyName
# 18. Verify HTML5 validation prevents submission (required attribute)
# 19. Fill in companyName "Test Co" and inn "1234567890"
# 20. Save and verify
```

**Acceptance:**
- Form renders with correct fields for each role
- Form pre-fills with existing data
- Form handles null profile (empty inputs)
- Submit button shows loading state
- Validation errors display inline
- Successful update redirects to profile view
- Cancel link works
- Required fields enforced for CLIENT

---

## Task 5: Create Public Profile View Page

**Implementation:**
- Create `app/dashboard/profile/[userId]/page.tsx` as a server component
- Get session via `getSession()`
- Extract userId from params
- If userId === session.userId, redirect to `/dashboard/profile`
- Query user: `prisma.user.findUnique({ where: { id: userId }, include: { clientProfile: true, specialistProfile: true } })`
- If user not found, show "User not found" message
- Determine user role and render appropriate profile:

  **SPECIALIST (if specialistProfile exists):**
  - displayName (or email if empty)
  - techStack (or "Not specified" if empty)
  - experienceLevel (or "Not specified" if empty)
  - bio (or "Not specified" if empty)
  - hourlyRate in roubles (or "Not specified" if 0)
  - Do NOT show email

  **CLIENT (if clientProfile exists):**
  - companyName
  - contactPerson (or "Not specified" if empty)
  - Do NOT show email, inn, kpp, phoneNumber

- If profile is null, show "Profile not available"
- Include "Back" link

**Test Plan:**
```bash
# Manual testing:
# 1. Login as CLIENT user
# 2. Create a gig and get a SPECIALIST userId from an application
# 3. Navigate to /dashboard/profile/{specialistUserId}
# 4. Verify SPECIALIST profile is displayed
# 5. Verify email is NOT shown
# 6. Verify "Not specified" for empty fields

# 7. Login as SPECIALIST user
# 8. Get a CLIENT userId from a gig
# 9. Navigate to /dashboard/profile/{clientUserId}
# 10. Verify CLIENT profile shows only companyName and contactPerson
# 11. Verify INN, KPP, phone, email are NOT shown

# 12. Navigate to /dashboard/profile/{ownUserId}
# 13. Verify redirect to /dashboard/profile

# 14. Navigate to /dashboard/profile/nonexistent-id
# 15. Verify "User not found" message

# 16. Test with user who has no profile
# 17. Verify "Profile not available" message
```

**Acceptance:**
- Public profile displays correct fields based on role
- Sensitive fields are hidden
- Own profile redirects to `/dashboard/profile`
- Non-existent user shows error message
- Null profile handled gracefully
- Back link works

---

## Task 6: Update Dashboard with Profile Hints

**Implementation:**
- Update `app/dashboard/page.tsx`
- Add profile query based on role:
  - CLIENT: `include: { clientProfile: true }`
  - SPECIALIST: `include: { specialistProfile: true }`
- Check profile completion:

  **For CLIENT:**
  - If `clientProfile` is null OR `companyName` is empty OR `inn` is empty
  - Display notice: "Complete your profile to build trust with specialists"
  - Link to `/dashboard/profile/edit`

  **For SPECIALIST:**
  - If `specialistProfile` is null OR `techStack` is empty OR `experienceLevel` is empty
  - Display notice: "Complete your profile to stand out when applying to gigs"
  - Link to `/dashboard/profile/edit`

- Add "My Profile" link to dashboard navigation (for all roles)

**Test Plan:**
```bash
# Manual testing:
# 1. Login as SPECIALIST user without profile
# 2. Navigate to /dashboard
# 3. Verify profile completion notice is displayed
# 4. Click link, verify navigation to /dashboard/profile/edit

# 5. Create profile with techStack and experienceLevel
# 6. Navigate back to /dashboard
# 7. Verify notice is no longer displayed

# 8. Verify "My Profile" link is visible
# 9. Click "My Profile", verify navigation to /dashboard/profile

# 10. Repeat for CLIENT user
# 11. Test with incomplete profile (only companyName, no inn)
# 12. Verify notice still shows
```

**Acceptance:**
- Profile completion notice shows for incomplete profiles
- Notice is hidden for complete profiles
- "My Profile" link is visible and works
- Notice links to edit page
- Logic correctly checks for null profile and empty required fields

---

## Task 7: Update Gig Detail Page to Show Client Profile

**Implementation:**
- Update `app/dashboard/gigs/[id]/page.tsx`
- Modify gig query to include nested client profile:
  ```typescript
  include: {
    client: {
      include: { clientProfile: true }
    },
    // ... other includes
  }
  ```
- In the gig detail display:
  - Show client email (existing)
  - If `gig.client.clientProfile` exists and `companyName` is not empty:
    - Display company name next to or below email
    - Make company name a link to `/dashboard/profile/{gig.clientId}`

**Test Plan:**
```bash
# Manual testing:
# 1. Login as CLIENT user
# 2. Create profile with companyName "Test Company"
# 3. Create a gig
# 4. Logout and login as SPECIALIST user
# 5. Navigate to the gig detail page
# 6. Verify client email is displayed
# 7. Verify "Test Company" is displayed
# 8. Click company name link
# 9. Verify navigation to client's public profile

# 10. Test with CLIENT who has no profile
# 11. Verify only email is shown (no company name)

# 12. Test with CLIENT who has profile but empty companyName
# 13. Verify only email is shown
```

**Acceptance:**
- Client company name displays on gig detail page when available
- Company name links to client public profile
- Gracefully handles null clientProfile
- Gracefully handles empty companyName

---

## Task 8: Update Gig Detail Page to Show Specialist Profiles in Applications

**Implementation:**
- Update `app/dashboard/gigs/[id]/page.tsx`
- Modify applications query to include nested specialist profile:
  ```typescript
  include: {
    specialist: {
      include: { specialistProfile: true }
    },
    // ... other includes
  }
  ```
- In the applications list (visible to gig owner), for each application:
  - If `application.specialist.specialistProfile` exists:
    - If `displayName` is not empty: show "DisplayName (email)" as link
    - Otherwise: show email as link
    - If `techStack` is not empty: display as tags/chips
    - If `experienceLevel` is not empty: display as badge
  - Link specialist name/email to `/dashboard/profile/{application.specialistId}`
  - Keep existing fields: cover letter, status, date, action buttons

**Test Plan:**
```bash
# Manual testing:
# 1. Login as SPECIALIST user
# 2. Create profile: displayName "Jane Doe", techStack "React, Node.js", experienceLevel "SENIOR"
# 3. Apply to a gig
# 4. Logout and login as CLIENT user (gig owner)
# 5. Navigate to gig detail page
# 6. Verify application shows:
#    - "Jane Doe (specialist@example.com)" as a link
#    - Tech stack: "React, Node.js" (as tags)
#    - Experience level badge: "SENIOR"
# 7. Click specialist name link
# 8. Verify navigation to specialist's public profile

# 9. Test with SPECIALIST who has no profile
# 10. Verify only email is shown, still links to profile

# 11. Test with SPECIALIST who has profile but empty fields
# 12. Verify only non-empty fields are displayed
# 13. Verify no empty tags or badges are shown
```

**Acceptance:**
- Specialist profile info displays in applications list
- Display name, tech stack, and experience level shown when available
- Specialist name/email links to public profile
- Gracefully handles null specialistProfile
- Gracefully handles empty string fields (doesn't show empty tags/badges)
- Existing application functionality (Accept/Reject) still works

---

## Summary

After completing all tasks:
1. Run full test suite (if available)
2. Test both SPECIALIST and CLIENT user flows end-to-end
3. Verify database migrations are reversible
4. Check for any console errors or warnings
5. Verify all links and navigation work correctly
6. Test with users who have no profiles (null)
7. Test with users who have profiles with empty fields
8. Test profile creation (first time) and updates (subsequent times)
9. Verify privacy: sensitive fields not exposed on public profiles
10. Verify no database bloating: only relevant profile table has data for each user
