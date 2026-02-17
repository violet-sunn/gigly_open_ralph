'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function createGig(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'CLIENT') {
    return { error: 'Only clients can create gigs.' }
  }

  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const acceptanceCriteriaRaw = (formData.get('acceptanceCriteria') as string) || ''
  const acceptanceCriteria = acceptanceCriteriaRaw.trim()
  const budgetRaw = formData.get('budget') as string
  const tags = ((formData.get('tags') as string) || '').trim()

  // Optional structured requirement fields
  const goal = ((formData.get('goal') as string) || '').trim()
  const deliverables = ((formData.get('deliverables') as string) || '').trim()
  const constraints = ((formData.get('constraints') as string) || '').trim()

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
  const serviceFee = Math.floor(budgetKopecks * 0.20)
  const totalAmount = budgetKopecks + serviceFee

  await prisma.gig.create({
    data: {
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
    },
  })

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

  const gigId = formData.get('gigId') as string
  const approach = ((formData.get('approach') as string) || '').trim()
  const questions = ((formData.get('questions') as string) || '').trim()
  const estimatedEffort = ((formData.get('estimatedEffort') as string) || '').trim()

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

  await prisma.application.create({
    data: {
      gigId,
      specialistId: session.userId,
      approach,
      questions,
      estimatedEffort,
      coverLetter: '', // Legacy field, set to empty string
    },
  })

  redirect(`/dashboard/gigs/${gigId}`)
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

  redirect(`/dashboard/gigs/${application.gigId}`)
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

  redirect(`/dashboard/gigs/${application.gigId}`)
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

  redirect(`/dashboard/gigs/${gigId}`)
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

  redirect(`/dashboard/gigs/${gigId}`)
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

  await prisma.gig.update({
    where: { id: gigId },
    data: {
      status: 'PAID',
      paidAt: new Date()
    },
  })

  redirect(`/dashboard/gigs/${gigId}`)
}

export async function sendMessage(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  const gigId = formData.get('gigId') as string
  const contentRaw = (formData.get('content') as string) || ''

  // Validate length before trimming
  if (contentRaw.length > 2000) {
    return { error: 'Message is too long. Maximum 2000 characters allowed.' }
  }

  const content = contentRaw.trim()

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
    },
  })

  if (!gig) {
    return { error: 'Gig not found.' }
  }

  if (gig.closedByAdmin) {
    return { error: 'Cannot send messages to a closed gig.' }
  }

  if (!gig.assignedSpecialistId) {
    return { error: 'Cannot send messages until a specialist is assigned.' }
  }

  const isOwner = gig.clientId === session.userId
  const isAssignedSpecialist = gig.assignedSpecialistId === session.userId

  if (!isOwner && !isAssignedSpecialist) {
    return { error: 'You are not authorized to send messages on this gig.' }
  }

  await prisma.message.create({
    data: {
      gigId,
      senderId: session.userId,
      content,
    },
  })

  redirect(`/dashboard/gigs/${gigId}`)
}
