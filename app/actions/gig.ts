'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { sanitizeInput } from '@/lib/sanitize'
import { applicationRateLimiter, messageRateLimiter, getRateLimitError } from '@/lib/ratelimit'
import { createNotification, createNotificationsBulk } from '@/lib/notifications'

export async function createGig(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'CLIENT') {
    return { error: 'Only clients can create gigs.' }
  }

  // Sanitize all text fields before validation
  const title = sanitizeInput(formData.get('title') as string).trim()
  const description = sanitizeInput(formData.get('description') as string).trim()
  const acceptanceCriteriaRaw = (formData.get('acceptanceCriteria') as string) || ''
  const acceptanceCriteria = sanitizeInput(acceptanceCriteriaRaw).trim()
  const budgetRaw = formData.get('budget') as string
  const tagsRaw = (formData.get('tags') as string) || ''
  const tags = sanitizeInput(tagsRaw).trim()

  // Optional structured requirement fields
  const goal = sanitizeInput((formData.get('goal') as string) || '').trim()
  const deliverables = sanitizeInput((formData.get('deliverables') as string) || '').trim()
  const constraints = sanitizeInput((formData.get('constraints') as string) || '').trim()

  if (!title || !description || !acceptanceCriteria) {
    return { error: 'Title, description, and acceptance criteria are required.' }
  }

  if (acceptanceCriteria.length < 50) {
    return { error: 'Acceptance criteria must be at least 50 characters.' }
  }

  const budgetRoubles = Number(budgetRaw)
  if (!budgetRoubles || budgetRoubles <= 0 || !Number.isFinite(budgetRoubles)) {
    return { error: 'Budget must be a positive number.' }
  }

  const budgetKopecks = Math.round(budgetRoubles * 100)
  const serviceFee = Math.floor(budgetKopecks * 0.10)
  const totalAmount = budgetKopecks + serviceFee

  // Check if this is the user's first gig
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { hasCreatedFirstGig: true },
  })

  const gigData = {
    title,
    description,
    acceptanceCriteria,
    goal,
    deliverables,
    constraints,
    budget: budgetKopecks,
    serviceFee,
    totalAmount,
    tags,
    clientId: session.userId,
  }

  // If this is the first gig, update user state in same transaction
  if (user && !user.hasCreatedFirstGig) {
    await prisma.$transaction([
      prisma.gig.create({ data: gigData }),
      prisma.user.update({
        where: { id: session.userId },
        data: { hasCreatedFirstGig: true },
      }),
    ])
  } else {
    await prisma.gig.create({ data: gigData })
  }

  redirect('/dashboard')
}

export async function applyToGig(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'SPECIALIST') {
    return { error: 'Only specialists can apply to gigs.' }
  }

  // Check rate limit AFTER auth, BEFORE validation
  const rateLimitResult = await applicationRateLimiter.limit(session.userId)
  if (!rateLimitResult.success) {
    return { error: getRateLimitError(rateLimitResult.reset, 'applications') }
  }

  const gigId = formData.get('gigId') as string

  // Sanitize all text fields before validation
  const approach = sanitizeInput((formData.get('approach') as string) || '').trim()
  const questions = sanitizeInput((formData.get('questions') as string) || '').trim()
  const estimatedEffort = sanitizeInput((formData.get('estimatedEffort') as string) || '').trim()

  // Validate required fields
  if (!approach) {
    return { error: 'Technical approach is required.' }
  }
  if (!questions) {
    return { error: 'Clarifying questions are required.' }
  }

  // Validate minimum lengths
  if (approach.length < 100) {
    return { error: 'Technical approach must be at least 100 characters. Please provide more detail about your methodology.' }
  }
  if (questions.length < 50) {
    return { error: 'Clarifying questions must be at least 50 characters. What do you need to know about the requirements?' }
  }

  // Validate maximum lengths
  if (approach.length > 2000) {
    return { error: 'Technical approach is too long. Maximum 2000 characters allowed.' }
  }
  if (questions.length > 1000) {
    return { error: 'Clarifying questions are too long. Maximum 1000 characters allowed.' }
  }
  if (estimatedEffort.length > 200) {
    return { error: 'Estimated effort is too long. Maximum 200 characters allowed.' }
  }

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })
  if (!gig) {
    return { error: 'Gig not found.' }
  }

  if (gig.isExample) {
    return { error: 'This is an example gig for demonstration purposes. You cannot apply to example gigs.' }
  }

  if (gig.closedByAdmin) {
    return { error: 'This gig has been closed by administrators.' }
  }

  if (gig.status !== 'OPEN') {
    return { error: 'This gig is no longer accepting applications.' }
  }

  const existing = await prisma.application.findUnique({
    where: { gigId_specialistId: { gigId, specialistId: session.userId } },
  })
  if (existing) {
    return { error: 'You have already applied to this gig.' }
  }

  // Get specialist profile for notification
  const specialist = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      hasSubmittedFirstApplication: true,
      specialistProfile: {
        select: {
          displayName: true,
        },
      },
    },
  })

  const applicationData = {
    gigId,
    specialistId: session.userId,
    approach,
    questions,
    estimatedEffort,
    coverLetter: '', // Legacy field, set to empty string
  }

  // If this is the first application, update user state in same transaction
  if (specialist && !specialist.hasSubmittedFirstApplication) {
    const application = await prisma.$transaction(async (tx) => {
      const app = await tx.application.create({ data: applicationData })
      await tx.user.update({
        where: { id: session.userId },
        data: { hasSubmittedFirstApplication: true },
      })
      return app
    })

    // Create notification for gig owner (fire-and-forget)
    const specialistName = specialist?.specialistProfile?.displayName || specialist?.email || 'A specialist'
    createNotification(
      gig.clientId,
      gigId,
      'APPLICATION',
      'application_submitted',
      {
        specialistId: session.userId,
        specialistName,
        applicationId: application.id,
      }
    )
  } else {
    const application = await prisma.application.create({ data: applicationData })

    // Create notification for gig owner (fire-and-forget)
    const specialistName = specialist?.specialistProfile?.displayName || specialist?.email || 'A specialist'
    createNotification(
      gig.clientId,
      gigId,
      'APPLICATION',
      'application_submitted',
      {
        specialistId: session.userId,
        specialistName,
        applicationId: application.id,
      }
    )
  }

  redirect(`/gigs/${gigId}`)
}

export async function acceptApplication(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'CLIENT') {
    return { error: 'Only clients can manage applications.' }
  }

  const applicationId = formData.get('applicationId') as string

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { gig: true },
  })

  if (!application) {
    return { error: 'Application not found.' }
  }

  if (application.gig.clientId !== session.userId) {
    return { error: 'Only the gig owner can manage applications.' }
  }

  if (application.gig.status !== 'OPEN') {
    return { error: 'This gig is no longer accepting applications.' }
  }

  if (application.status !== 'PENDING') {
    return { error: 'This application is no longer pending.' }
  }

  // Get all pending applications that will be auto-rejected
  const pendingApplications = await prisma.application.findMany({
    where: {
      gigId: application.gigId,
      id: { not: applicationId },
      status: 'PENDING',
    },
  })

  await prisma.$transaction([
    prisma.application.update({
      where: { id: applicationId },
      data: { status: 'ACCEPTED' },
    }),
    prisma.gig.update({
      where: { id: application.gigId },
      data: {
        status: 'IN_PROGRESS',
        assignedSpecialistId: application.specialistId,
      },
    }),
    prisma.application.updateMany({
      where: {
        gigId: application.gigId,
        id: { not: applicationId },
        status: 'PENDING',
      },
      data: { status: 'REJECTED' },
    }),
  ])

  // Create notification for accepted specialist (fire-and-forget)
  createNotification(
    application.specialistId,
    application.gigId,
    'APPLICATION',
    'application_accepted',
    { applicationId }
  )

  // Create bulk notifications for auto-rejected specialists
  if (pendingApplications.length > 0) {
    const rejectedNotifications = pendingApplications.map((app) => ({
      userId: app.specialistId,
      gigId: application.gigId,
      type: 'APPLICATION' as const,
      eventType: 'application_rejected',
      eventData: JSON.stringify({ applicationId: app.id }),
    }))
    createNotificationsBulk(rejectedNotifications)
  }

  redirect(`/gigs/${application.gigId}`)
}

export async function rejectApplication(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'CLIENT') {
    return { error: 'Only clients can manage applications.' }
  }

  const applicationId = formData.get('applicationId') as string

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { gig: true },
  })

  if (!application) {
    return { error: 'Application not found.' }
  }

  if (application.gig.clientId !== session.userId) {
    return { error: 'Only the gig owner can manage applications.' }
  }

  if (application.status !== 'PENDING') {
    return { error: 'This application is no longer pending.' }
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: 'REJECTED' },
  })

  // Create notification for rejected specialist (fire-and-forget)
  createNotification(
    application.specialistId,
    application.gigId,
    'APPLICATION',
    'application_rejected',
    { applicationId }
  )

  redirect(`/gigs/${application.gigId}`)
}

export async function submitWork(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'SPECIALIST') {
    return { error: 'Only specialists can submit work.' }
  }

  const gigId = formData.get('gigId') as string

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })

  if (!gig) {
    return { error: 'Gig not found.' }
  }

  if (gig.status !== 'IN_PROGRESS') {
    return { error: 'Work can only be submitted for gigs in progress.' }
  }

  if (gig.assignedSpecialistId !== session.userId) {
    return { error: 'Only the assigned specialist can submit work.' }
  }

  await prisma.gig.update({
    where: { id: gigId },
    data: { status: 'REVIEW' },
  })

  // Create notification for gig owner (fire-and-forget)
  createNotification(
    gig.clientId,
    gigId,
    'STATUS_CHANGE',
    'work_submitted',
    { specialistId: session.userId }
  )

  redirect(`/gigs/${gigId}`)
}

export async function approveWork(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'CLIENT') {
    return { error: 'Only clients can approve work.' }
  }

  const gigId = formData.get('gigId') as string

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })

  if (!gig) {
    return { error: 'Gig not found.' }
  }

  if (gig.status !== 'REVIEW') {
    return { error: 'Work can only be approved for gigs under review.' }
  }

  if (gig.clientId !== session.userId) {
    return { error: 'Only the gig owner can approve work.' }
  }

  await prisma.gig.update({
    where: { id: gigId },
    data: { status: 'COMPLETED' },
  })

  // Create notification for assigned specialist (fire-and-forget)
  if (gig.assignedSpecialistId) {
    createNotification(
      gig.assignedSpecialistId,
      gigId,
      'STATUS_CHANGE',
      'work_approved',
      { clientId: session.userId }
    )
  }

  redirect(`/gigs/${gigId}`)
}

export async function markAsPaid(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'CLIENT') {
    return { error: 'Only clients can mark gigs as paid.' }
  }

  const gigId = formData.get('gigId') as string

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })

  if (!gig) {
    return { error: 'Gig not found.' }
  }

  if (gig.clientId !== session.userId) {
    return { error: 'Only the gig owner can mark this gig as paid.' }
  }

  if (gig.status === 'PAID') {
    return { error: 'This gig has already been marked as paid.' }
  }

  if (gig.status !== 'COMPLETED') {
    return { error: 'Only completed gigs can be marked as paid.' }
  }

  const paidAt = new Date()

  await prisma.gig.update({
    where: { id: gigId },
    data: {
      status: 'PAID',
      paidAt,
    },
  })

  // Create notification for assigned specialist (fire-and-forget)
  if (gig.assignedSpecialistId) {
    createNotification(
      gig.assignedSpecialistId,
      gigId,
      'STATUS_CHANGE',
      'payment_marked',
      { clientId: session.userId, paidAt: paidAt.toISOString() }
    )
  }

  redirect(`/gigs/${gigId}`)
}

export async function withdrawApplication(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'SPECIALIST') {
    return { error: 'Only specialists can withdraw applications.' }
  }

  const applicationId = formData.get('applicationId') as string

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { gig: true },
  })

  if (!application) {
    return { error: 'Application not found.' }
  }

  if (!application.gig) {
    return { error: 'Gig not found.' }
  }

  if (application.specialistId !== session.userId) {
    return { error: 'You can only withdraw your own applications.' }
  }

  if (application.status === 'WITHDRAWN') {
    return { error: 'This application has already been withdrawn.' }
  }

  if (application.status !== 'PENDING') {
    return { error: 'Only pending applications can be withdrawn.' }
  }

  if (application.gig.closedByAdmin) {
    return { error: 'Cannot withdraw applications from closed gigs.' }
  }

  if (application.gig.isExample) {
    return { error: 'Cannot withdraw applications from example gigs.' }
  }

  // Get specialist profile for notification
  const specialist = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { specialistProfile: true },
  })

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: 'WITHDRAWN' },
  })

  // Create notification for gig owner (fire-and-forget)
  const specialistName = specialist?.specialistProfile?.displayName || specialist?.email || 'A specialist'
  createNotification(
    application.gig.clientId,
    application.gigId,
    'APPLICATION',
    'application_withdrawn',
    {
      specialistId: session.userId,
      specialistName,
      applicationId,
    }
  )

  redirect(`/gigs/${application.gigId}`)
}

export async function sendMessage(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  // Check rate limit AFTER auth, BEFORE validation
  const rateLimitResult = await messageRateLimiter.limit(session.userId)
  if (!rateLimitResult.success) {
    return { error: getRateLimitError(rateLimitResult.reset, 'messages') }
  }

  const gigId = formData.get('gigId') as string
  const contentRaw = (formData.get('content') as string) || ''

  // Sanitize content before validation
  const contentSanitized = sanitizeInput(contentRaw)

  // Validate length before trimming (check sanitized content)
  if (contentSanitized.length > 2000) {
    return { error: 'Message is too long. Maximum 2000 characters allowed.' }
  }

  const content = contentSanitized.trim()

  if (!content) {
    return { error: 'Message content is required.' }
  }

  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    select: {
      id: true,
      clientId: true,
      assignedSpecialistId: true,
      closedByAdmin: true,
      status: true,
    },
  })

  if (!gig) {
    return { error: 'Gig not found.' }
  }

  if (gig.closedByAdmin) {
    return { error: 'Cannot send messages to a closed gig.' }
  }

  if (gig.status === 'PAID') {
    return { error: 'Cannot send messages to a paid gig.' }
  }

  if (!gig.assignedSpecialistId) {
    return { error: 'Cannot send messages until a specialist is assigned.' }
  }

  const isOwner = gig.clientId === session.userId
  const isAssignedSpecialist = gig.assignedSpecialistId === session.userId

  if (!isOwner && !isAssignedSpecialist) {
    return { error: 'You are not authorized to send messages on this gig.' }
  }

  // Create message
  await prisma.message.create({
    data: {
      gigId,
      senderId: session.userId,
      content,
    },
  })

  // Determine recipient and create/update notification
  const recipientId = isOwner ? gig.assignedSpecialistId : gig.clientId

  try {
    await prisma.notification.upsert({
      where: {
        userId_gigId: {
          userId: recipientId!,
          gigId,
        },
      },
      create: {
        userId: recipientId!,
        gigId,
        lastReadAt: null,
      },
      update: {
        updatedAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Failed to create/update notification:', error)
  }

  redirect(`/gigs/${gigId}`)
}
