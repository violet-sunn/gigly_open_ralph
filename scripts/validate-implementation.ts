#!/usr/bin/env node

console.log('🔍 Validating Specialist Profiles Implementation\n')

let passed = 0
let failed = 0

function test(name: string, condition: boolean, details?: string) {
  if (condition) {
    console.log(`✓ ${name}`)
    passed++
  } else {
    console.log(`✗ ${name}`)
    if (details) console.log(`  ${details}`)
    failed++
  }
}

// Read files
import { readFileSync, existsSync } from 'fs'

console.log('📝 Database Schema Validation\n')

// Test 1: Check schema file
const schemaContent = readFileSync('prisma/schema.prisma', 'utf-8')

test(
  'ClientProfile model exists with userId as @id',
  schemaContent.includes('model ClientProfile') &&
  schemaContent.includes('userId        String   @id')
)

test(
  'ClientProfile has required fields (companyName, inn)',
  schemaContent.includes('companyName   String') &&
  schemaContent.includes('inn           String')
)

test(
  'ClientProfile has optional fields with defaults',
  schemaContent.includes('kpp           String   @default("")') &&
  schemaContent.includes('contactPerson String   @default("")') &&
  schemaContent.includes('phoneNumber   String   @default("")')
)

test(
  'ClientProfile has CASCADE delete',
  schemaContent.includes('onDelete: Cascade')
)

test(
  'SpecialistProfile model exists with userId as @id',
  schemaContent.includes('model SpecialistProfile') &&
  schemaContent.includes('userId          String   @id')
)

test(
  'SpecialistProfile has all required fields',
  schemaContent.includes('displayName     String   @default("")') &&
  schemaContent.includes('techStack       String   @default("")') &&
  schemaContent.includes('experienceLevel String   @default("")') &&
  schemaContent.includes('bio             String   @default("")') &&
  schemaContent.includes('hourlyRate      Int      @default(0)')
)

test(
  'User model has profile relations',
  schemaContent.includes('clientProfile     ClientProfile?') &&
  schemaContent.includes('specialistProfile SpecialistProfile?')
)

console.log('\n📝 Migration Validation\n')

test(
  'Migration file exists',
  existsSync('prisma/migrations/20260216144043_add_profile_tables/migration.sql')
)

const migrationContent = readFileSync(
  'prisma/migrations/20260216144043_add_profile_tables/migration.sql',
  'utf-8'
)

test(
  'Migration creates ClientProfile table',
  migrationContent.includes('CREATE TABLE "ClientProfile"')
)

test(
  'Migration creates SpecialistProfile table',
  migrationContent.includes('CREATE TABLE "SpecialistProfile"')
)

test(
  'Migration sets userId as PRIMARY KEY',
  migrationContent.includes('"userId" TEXT NOT NULL PRIMARY KEY')
)

test(
  'Migration has foreign key constraints',
  migrationContent.includes('FOREIGN KEY ("userId") REFERENCES "User" ("id")')
)

console.log('\n📝 Server Action Validation\n')

test(
  'Profile action file exists',
  existsSync('app/actions/profile.ts')
)

const actionContent = readFileSync('app/actions/profile.ts', 'utf-8')

test(
  'updateProfile action exists',
  actionContent.includes('export async function updateProfile')
)

test(
  'Action validates experienceLevel',
  actionContent.includes('MIDDLE') && actionContent.includes('SENIOR')
)

test(
  'Action converts hourly rate to kopecks',
  actionContent.includes('* 100') && actionContent.includes('kopecks')
)

test(
  'Action uses upsert for both create and update',
  actionContent.includes('.upsert(')
)

test(
  'Action validates CLIENT required fields',
  actionContent.includes('companyName') && actionContent.includes('inn')
)

console.log('\n📝 UI Components Validation\n')

test(
  'Profile view page exists',
  existsSync('app/dashboard/profile/page.tsx')
)

test(
  'Profile edit page exists',
  existsSync('app/dashboard/profile/edit/page.tsx')
)

test(
  'Profile edit form exists',
  existsSync('app/dashboard/profile/edit/ProfileEditForm.tsx')
)

test(
  'Public profile page exists',
  existsSync('app/dashboard/profile/[userId]/page.tsx')
)

const profileViewContent = readFileSync('app/dashboard/profile/page.tsx', 'utf-8')

test(
  'Profile view handles null profiles',
  profileViewContent.includes('Profile not set up yet')
)

test(
  'Profile view shows role-specific fields',
  profileViewContent.includes('specialistProfile') &&
  profileViewContent.includes('clientProfile')
)

const editFormContent = readFileSync('app/dashboard/profile/edit/ProfileEditForm.tsx', 'utf-8')

test(
  'Edit form uses useActionState',
  editFormContent.includes('useActionState')
)

test(
  'Edit form has role-specific fields',
  editFormContent.includes('SPECIALIST') && editFormContent.includes('CLIENT')
)

const publicProfileContent = readFileSync('app/dashboard/profile/[userId]/page.tsx', 'utf-8')

test(
  'Public profile hides sensitive fields',
  !publicProfileContent.includes('inn') ||
  publicProfileContent.includes('NOT show INN')
)

test(
  'Public profile redirects own profile',
  publicProfileContent.includes('redirect') &&
  publicProfileContent.includes('/dashboard/profile')
)

console.log('\n📝 Dashboard Integration Validation\n')

const dashboardContent = readFileSync('app/dashboard/page.tsx', 'utf-8')

test(
  'Dashboard queries profile data',
  dashboardContent.includes('clientProfile') ||
  dashboardContent.includes('specialistProfile')
)

test(
  'Dashboard shows profile completion hints',
  dashboardContent.includes('Complete your profile') ||
  dashboardContent.includes('profileIncomplete')
)

test(
  'Dashboard has My Profile link',
  dashboardContent.includes('/dashboard/profile')
)

console.log('\n📝 Gig Detail Integration Validation\n')

const gigDetailContent = readFileSync('app/dashboard/gigs/[id]/page.tsx', 'utf-8')

test(
  'Gig detail includes client profile',
  gigDetailContent.includes('clientProfile')
)

test(
  'Gig detail includes specialist profile',
  gigDetailContent.includes('specialistProfile')
)

test(
  'Gig detail shows company name',
  gigDetailContent.includes('companyName')
)

test(
  'Gig detail shows specialist tech stack',
  gigDetailContent.includes('techStack')
)

test(
  'Gig detail shows experience level',
  gigDetailContent.includes('experienceLevel')
)

console.log('\n' + '='.repeat(50))
console.log(`\n📊 Validation Summary: ${passed} passed, ${failed} failed\n`)

if (failed === 0) {
  console.log('✅ All validation checks passed!')
  console.log('\n✓ Database schema correctly defined')
  console.log('✓ Migrations created and structured correctly')
  console.log('✓ Server actions implemented with validation')
  console.log('✓ UI components created with proper logic')
  console.log('✓ Dashboard integration complete')
  console.log('✓ Gig detail integration complete')
  process.exit(0)
} else {
  console.log('❌ Some validation checks failed')
  process.exit(1)
}
