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
  const budgetRaw = formData.get('budget') as string
  const tags = ((formData.get('tags') as string) || '').trim()

  if (!title || !description) {
    return { error: 'Title and description are required.' }
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
  const coverLetter = ((formData.get('coverLetter') as string) || '').trim()

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })
  if (!gig) {
    return { error: 'Gig not found.' }
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
      coverLetter,
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
