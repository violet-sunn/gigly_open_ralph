'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { sanitizeInput } from '@/lib/sanitize'
import { applicationRateLimiter, messageRateLimiter, getRateLimitError } from '@/lib/ratelimit'
import { createNotification, createNotificationsBulk } from '@/lib/notifications'
import { isCategorySlug } from '@/lib/categories'

export async function createGig(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'CLIENT') {
    return { error: 'Only clients can post gigs. Switch to a client account or register as a client to continue.' }
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
    return { error: 'Please fill in all required fields: title, description, and acceptance criteria.' }
  }

  if (acceptanceCriteria.length < 50) {
    return { error: 'Acceptance criteria must be at least 50 characters. Add more detail about what defines success for this gig.' }
  }

  const budgetRoubles = Number(budgetRaw)
  if (!budgetRoubles || budgetRoubles <= 0 || !Number.isFinite(budgetRoubles)) {
    return { error: 'Budget must be a positive number in roubles. Enter the amount you\'ll pay the specialist (service fee will be calculated automatically).' }
  }

  const budgetKopecks = Math.round(budgetRoubles * 100)
  const serviceFee = Math.floor(budgetKopecks * 0.10)
  const totalAmount = budgetKopecks + serviceFee

  // Optional category — must be one of the canonical five if supplied (safe-default: null when absent)
  const category = (formData.get('category') as string) || null
  if (category && !isCategorySlug(category)) {
    return { error: 'Please choose a valid category.' }
  }

  // Optional deadline (Срок выполнения) — whole days 1–365; absent → 0 (unspecified, rendered gracefully)
  let deadlineDays = 0
  const deadlineRaw = formData.get('deadlineDays') as string | null
  if (deadlineRaw != null && deadlineRaw !== '') {
    const n = Number(deadlineRaw)
    if (!Number.isInteger(n) || n < 1 || n > 365) {
      return { error: 'Срок выполнения must be a whole number of days between 1 and 365.' }
    }
    deadlineDays = n
  }

  // Optional stage count (этапы) — whole number 1–50; absent → 1
  let stageCount = 1
  const stageRaw = formData.get('stageCount') as string | null
  if (stageRaw != null && stageRaw !== '') {
    const n = Number(stageRaw)
    if (!Number.isInteger(n) || n < 1 || n > 50) {
      return { error: 'Number of stages (этапы) must be a whole number between 1 and 50.' }
    }
    stageCount = n
  }

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
    categorySlug: category,
    deadlineDays,
    stageCount,
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

  // reconcile-create-gig: land on the dedicated «Гиг опубликован» success screen (Post/Redirect/Get).
  redirect('/gigs/new/success')
}

export async function applyToGig(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'SPECIALIST') {
    return { error: 'Only specialists can apply to gigs. Switch to a specialist account or register as a specialist to continue.' }
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

  // Optional proposed terms (TermsTabs "Предложено"). Budget in roubles → kopecks; absent → null.
  let proposedBudget: number | null = null
  const pbRaw = formData.get('proposedBudget') as string | null
  if (pbRaw != null && pbRaw !== '') {
    const r = Number(pbRaw)
    if (!Number.isFinite(r) || r <= 0) {
      return { error: 'Proposed budget must be a positive number in roubles.' }
    }
    proposedBudget = Math.round(r * 100)
  }
  let proposedDeadlineDays: number | null = null
  const pdRaw = formData.get('proposedDeadlineDays') as string | null
  if (pdRaw != null && pdRaw !== '') {
    const n = Number(pdRaw)
    if (!Number.isInteger(n) || n < 1 || n > 365) {
      return { error: 'Proposed срок must be a whole number of days between 1 and 365.' }
    }
    proposedDeadlineDays = n
  }

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })
  if (!gig) {
    return { error: 'This gig no longer exists or has been removed.' }
  }

  if (gig.isExample) {
    return { error: 'This is an example gig for demonstration. Browse real gigs to find work opportunities.' }
  }

  if (gig.closedByAdmin) {
    return { error: 'This gig has been closed by administrators and is no longer available.' }
  }

  if (gig.status !== 'OPEN') {
    return { error: 'This gig is no longer accepting applications. It may already have an assigned specialist.' }
  }

  const existing = await prisma.application.findUnique({
    where: { gigId_specialistId: { gigId, specialistId: session.userId } },
  })
  if (existing) {
    return { error: 'You\'ve already applied to this gig. Check your dashboard to see your application status.' }
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
    proposedBudget,
    proposedDeadlineDays,
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
    return { error: 'Only clients can manage applications. If you\'re the specialist, wait for the client\'s decision.' }
  }

  const applicationId = formData.get('applicationId') as string

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { gig: true },
  })

  if (!application) {
    return { error: 'This application no longer exists or has been removed.' }
  }

  if (application.gig.clientId !== session.userId) {
    return { error: 'Only the client who posted this gig can accept applications.' }
  }

  if (application.gig.status !== 'OPEN') {
    return { error: 'This gig is no longer accepting applications. It may already have an assigned specialist.' }
  }

  if (application.status !== 'PENDING') {
    return { error: 'This application has already been accepted or rejected.' }
  }

  // Get all pending applications that will be auto-rejected
  const pendingApplications = await prisma.application.findMany({
    where: {
      gigId: application.gigId,
      id: { not: applicationId },
      status: 'PENDING',
    },
  })

  // Accept = agree to the application's terms: reconcile any proposed terms onto the gig (TermsTabs).
  // Absent proposals (legacy/un-countered applications) leave the gig's terms unchanged.
  const gigTerms: { budget?: number; serviceFee?: number; totalAmount?: number; deadlineDays?: number } = {}
  if (application.proposedBudget != null) {
    const budget = application.proposedBudget
    gigTerms.budget = budget
    gigTerms.serviceFee = Math.floor(budget * 0.10) // same 10% rule as createGig
    gigTerms.totalAmount = budget + gigTerms.serviceFee
  }
  if (application.proposedDeadlineDays != null) {
    gigTerms.deadlineDays = application.proposedDeadlineDays
  }

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
        ...gigTerms,
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
    return { error: 'Only clients can manage applications. If you\'re the specialist, wait for the client\'s decision.' }
  }

  const applicationId = formData.get('applicationId') as string

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { gig: true },
  })

  if (!application) {
    return { error: 'This application no longer exists or has been removed.' }
  }

  if (application.gig.clientId !== session.userId) {
    return { error: 'Only the client who posted this gig can reject applications.' }
  }

  if (application.status !== 'PENDING') {
    return { error: 'This application has already been accepted or rejected.' }
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
    return { error: 'Only specialists can submit work. If you\'re the client, wait for the specialist to submit their deliverables.' }
  }

  const gigId = formData.get('gigId') as string

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })

  if (!gig) {
    return { error: 'This gig no longer exists or has been removed.' }
  }

  if (gig.status !== 'IN_PROGRESS') {
    return { error: 'Work can only be submitted for gigs that are in progress.' }
  }

  if (gig.assignedSpecialistId !== session.userId) {
    return { error: 'Only the assigned specialist can submit work for this gig.' }
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
    return { error: 'Only clients can approve work. If you\'re the specialist, wait for the client to review your submission.' }
  }

  const gigId = formData.get('gigId') as string

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })

  if (!gig) {
    return { error: 'This gig no longer exists or has been removed.' }
  }

  if (gig.status !== 'REVIEW') {
    return { error: 'Work can only be approved for gigs under review. The specialist needs to submit their work first.' }
  }

  if (gig.clientId !== session.userId) {
    return { error: 'Only the client who posted this gig can approve the work.' }
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

/**
 * Return submitted work for revision (REVIEW → IN_PROGRESS) — the gig-detail «Вернуть на доработку» action from the
 * `gigly_full_design` prototype's owner approve-state. Owner-gated, mirrors approveWork: the client sends the work back
 * so the assigned specialist can resubmit. No work is discarded; only the lifecycle status reverts.
 */
export async function requestRevision(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'CLIENT') {
    return { error: 'Only clients can return work for revision.' }
  }

  const gigId = formData.get('gigId') as string

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })

  if (!gig) {
    return { error: 'This gig no longer exists or has been removed.' }
  }

  if (gig.status !== 'REVIEW') {
    return { error: 'Work can only be returned while it is under review.' }
  }

  if (gig.clientId !== session.userId) {
    return { error: 'Only the client who posted this gig can return the work.' }
  }

  await prisma.gig.update({
    where: { id: gigId },
    data: { status: 'IN_PROGRESS' },
  })

  // Notify the assigned specialist that the work needs changes (fire-and-forget).
  if (gig.assignedSpecialistId) {
    createNotification(
      gig.assignedSpecialistId,
      gigId,
      'STATUS_CHANGE',
      'work_returned',
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
    return { error: 'Only clients can mark gigs as paid. If you\'re the specialist, wait for the client to confirm payment.' }
  }

  const gigId = formData.get('gigId') as string

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })

  if (!gig) {
    return { error: 'This gig no longer exists or has been removed.' }
  }

  if (gig.clientId !== session.userId) {
    return { error: 'Only the client who posted this gig can mark it as paid.' }
  }

  if (gig.status === 'PAID') {
    return { error: 'This gig has already been marked as paid.' }
  }

  if (gig.status !== 'COMPLETED') {
    return { error: 'Only completed gigs can be marked as paid. The work needs to be approved first.' }
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
      'PAYMENT',
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
    return { error: 'Only specialists can withdraw applications. If you\'re the client, you can reject applications instead.' }
  }

  const applicationId = formData.get('applicationId') as string

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { gig: true },
  })

  if (!application) {
    return { error: 'This application no longer exists or has been removed.' }
  }

  if (!application.gig) {
    return { error: 'This gig no longer exists or has been removed.' }
  }

  if (application.specialistId !== session.userId) {
    return { error: 'You can only withdraw your own applications.' }
  }

  if (application.status === 'WITHDRAWN') {
    return { error: 'This application has already been withdrawn.' }
  }

  if (application.status !== 'PENDING') {
    return { error: 'You can only withdraw pending applications. This application has already been accepted or rejected.' }
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
    return { error: 'Message cannot be empty. Please enter a message to send.' }
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
    return { error: 'This gig no longer exists or has been removed.' }
  }

  if (gig.closedByAdmin) {
    return { error: 'Cannot send messages to closed gigs. This gig has been closed by administrators.' }
  }

  if (gig.status === 'PAID') {
    return { error: 'Cannot send messages to completed and paid gigs. The work has been finalized.' }
  }

  if (!gig.assignedSpecialistId) {
    return { error: 'Cannot send messages until a specialist is assigned to this gig. Wait for the client to accept an application.' }
  }

  const isOwner = gig.clientId === session.userId
  const isAssignedSpecialist = gig.assignedSpecialistId === session.userId

  if (!isOwner && !isAssignedSpecialist) {
    return { error: 'You can only send messages if you\'re the client who posted this gig or the assigned specialist.' }
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
