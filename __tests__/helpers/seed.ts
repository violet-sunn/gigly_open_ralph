import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

/**
 * Generate unique email for test users
 */
function generateUniqueEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`
}

/**
 * Create test user with sensible defaults
 * Automatically creates appropriate profile based on role
 */
export async function createTestUser(
  tx: PrismaClient,
  overrides?: {
    email?: string
    password?: string
    role?: 'CLIENT' | 'SPECIALIST' | 'ADMIN'
    suspended?: boolean
    // Client profile fields
    companyName?: string
    inn?: string
    kpp?: string
    contactPerson?: string
    phoneNumber?: string
    // Specialist profile fields
    displayName?: string
    techStack?: string
    experienceLevel?: string
    bio?: string
    hourlyRate?: number
  }
) {
  const role = overrides?.role || 'CLIENT'
  const email = overrides?.email || generateUniqueEmail()
  const password = overrides?.password || 'password123'
  const hashedPassword = await bcrypt.hash(password, 10)

  // Build user data
  const userData: any = {
    email,
    password: hashedPassword,
    role,
    suspended: overrides?.suspended || false
  }

  // Add profile based on role
  if (role === 'CLIENT') {
    userData.clientProfile = {
      create: {
        companyName: overrides?.companyName || 'Test Company',
        inn: overrides?.inn || '1234567890',
        kpp: overrides?.kpp || '',
        contactPerson: overrides?.contactPerson || '',
        phoneNumber: overrides?.phoneNumber || ''
      }
    }
  } else if (role === 'SPECIALIST') {
    userData.specialistProfile = {
      create: {
        displayName: overrides?.displayName || '',
        techStack: overrides?.techStack || 'React, TypeScript',
        experienceLevel: overrides?.experienceLevel || 'SENIOR',
        bio: overrides?.bio || '',
        hourlyRate: overrides?.hourlyRate || 5000
      }
    }
  }

  // Create user with profile
  const user = await tx.user.create({
    data: userData,
    include: {
      clientProfile: true,
      specialistProfile: true
    }
  })

  return user
}

/**
 * Create test gig with sensible defaults
 * Automatically creates client user if not provided
 */
export async function createTestGig(
  tx: PrismaClient,
  overrides?: {
    title?: string
    description?: string
    acceptanceCriteria?: string
    goal?: string
    deliverables?: string
    constraints?: string
    budget?: number
    serviceFee?: number
    totalAmount?: number
    status?: string
    tags?: string
    clientId?: string
    assignedSpecialistId?: string
    paidAt?: Date
    closedByAdmin?: boolean
    closedAt?: Date
    isExample?: boolean
  }
) {
  // Create client if not provided
  let clientId = overrides?.clientId
  if (!clientId) {
    const client = await createTestUser(tx, { role: 'CLIENT' })
    clientId = client.id
  }

  const budget = overrides?.budget || 100000
  const serviceFee = overrides?.serviceFee || 10000
  const totalAmount = overrides?.totalAmount || 110000

  const gig = await tx.gig.create({
    data: {
      title: overrides?.title || 'Test Gig',
      description: overrides?.description || 'Test gig description',
      acceptanceCriteria: overrides?.acceptanceCriteria || null,
      goal: overrides?.goal || '',
      deliverables: overrides?.deliverables || '',
      constraints: overrides?.constraints || '',
      budget,
      serviceFee,
      totalAmount,
      status: overrides?.status || 'OPEN',
      tags: overrides?.tags || 'React,TypeScript',
      clientId,
      assignedSpecialistId: overrides?.assignedSpecialistId || null,
      paidAt: overrides?.paidAt || null,
      closedByAdmin: overrides?.closedByAdmin || false,
      closedAt: overrides?.closedAt || null,
      isExample: overrides?.isExample || false
    },
    include: {
      client: {
        include: {
          clientProfile: true
        }
      },
      assignedSpecialist: true
    }
  })

  return gig
}

/**
 * Create test application with sensible defaults
 * Automatically creates gig and specialist if not provided
 */
export async function createTestApplication(
  tx: PrismaClient,
  overrides?: {
    gigId?: string
    specialistId?: string
    coverLetter?: string
    approach?: string
    questions?: string
    estimatedEffort?: string
    status?: string
  }
) {
  // Create gig if not provided
  let gigId = overrides?.gigId
  if (!gigId) {
    const gig = await createTestGig(tx)
    gigId = gig.id
  }

  // Create specialist if not provided
  let specialistId = overrides?.specialistId
  if (!specialistId) {
    const specialist = await createTestUser(tx, { role: 'SPECIALIST' })
    specialistId = specialist.id
  }

  const application = await tx.application.create({
    data: {
      gigId,
      specialistId,
      coverLetter: overrides?.coverLetter || '',
      approach: overrides?.approach || 'Test technical approach',
      questions: overrides?.questions || 'Test clarifying questions',
      estimatedEffort: overrides?.estimatedEffort || '2 weeks',
      status: overrides?.status || 'PENDING'
    },
    include: {
      gig: {
        include: {
          client: true
        }
      },
      specialist: {
        include: {
          specialistProfile: true
        }
      }
    }
  })

  return application
}
