'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { sanitizeInput } from '@/lib/sanitize'
import { applicationRateLimiter, getRateLimitError } from '@/lib/ratelimit'
import { persistMessage } from '@/lib/messaging'
import { createNotification, createNotificationsBulk } from '@/lib/notifications'
import { isCategorySlug } from '@/lib/categories'

/**
 * The normalized, validated set of gig fields shared by `createGig` and `updateGig` — every column a client can set,
 * already sanitized/trimmed with the budget converted to kopecks and the 10% fee/total computed. The two actions apply
 * the SAME validation gates (criteria ≥ 50, budget > 0, deadline 1–365, stages 1–50, valid category) so create/edit
 * can never drift.
 */
type ParsedGigFields = {
  title: string
  description: string
  acceptanceCriteria: string
  goal: string
  deliverables: string
  constraints: string
  budget: number
  serviceFee: number
  totalAmount: number
  tags: string
  categorySlug: string | null
  deadlineDays: number
  stageCount: number
}

/**
 * Parse + validate the gig form (create AND edit). Returns `{ error }` on the first failed gate (messages are the
 * canonical create-gig strings, so edit inherits them verbatim) or `{ fields }` with the normalized values ready to
 * persist. Pure: no session/DB access — callers own auth and the write.
 */
function parseGigForm(formData: FormData): { error: string } | { fields: ParsedGigFields } {
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
    return { error: 'Заполните обязательные поля: название, описание и критерии приёмки.' }
  }

  if (acceptanceCriteria.length < 50) {
    return { error: 'Критерии приёмки должны быть не короче 50 символов. Опишите подробнее, что считается результатом.' }
  }

  const budgetRoubles = Number(budgetRaw)
  if (!budgetRoubles || budgetRoubles <= 0 || !Number.isFinite(budgetRoubles)) {
    return { error: 'Бюджет должен быть положительным числом в рублях. Укажите сумму для специалиста (сервисный сбор считается автоматически).' }
  }

  const budgetKopecks = Math.round(budgetRoubles * 100)
  const serviceFee = Math.floor(budgetKopecks * 0.10)
  const totalAmount = budgetKopecks + serviceFee

  // Optional category — must be one of the canonical five if supplied (safe-default: null when absent)
  const category = (formData.get('category') as string) || null
  if (category && !isCategorySlug(category)) {
    return { error: 'Выберите корректную категорию.' }
  }

  // Optional deadline (Срок выполнения) — whole days 1–365; absent → 0 (unspecified, rendered gracefully)
  let deadlineDays = 0
  const deadlineRaw = formData.get('deadlineDays') as string | null
  if (deadlineRaw != null && deadlineRaw !== '') {
    const n = Number(deadlineRaw)
    if (!Number.isInteger(n) || n < 1 || n > 365) {
      return { error: 'Срок выполнения должен быть целым числом дней от 1 до 365.' }
    }
    deadlineDays = n
  }

  // Optional stage count (этапы) — whole number 1–50; absent → 1
  let stageCount = 1
  const stageRaw = formData.get('stageCount') as string | null
  if (stageRaw != null && stageRaw !== '') {
    const n = Number(stageRaw)
    if (!Number.isInteger(n) || n < 1 || n > 50) {
      return { error: 'Количество этапов должно быть целым числом от 1 до 50.' }
    }
    stageCount = n
  }

  return {
    fields: {
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
    },
  }
}

export async function createGig(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'CLIENT') {
    return { error: 'Публиковать гиги могут только заказчики. Войдите как компания или зарегистрируйтесь в роли заказчика.' }
  }

  const parsed = parseGigForm(formData)
  if ('error' in parsed) return parsed

  // Check if this is the user's first gig
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { hasCreatedFirstGig: true },
  })

  const gigData = {
    ...parsed.fields,
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

/**
 * Edit an already-published gig (gig-editing-with-notification). Owner-only, and ONLY while the gig is OPEN — once a
 * specialist is assigned (IN_PROGRESS) or later, terms are locked (the platform is fixed-price; renegotiation is
 * withdraw → re-apply, not a silent edit to active work). Reuses `parseGigForm` so validation matches `createGig`
 * exactly and recomputes the 10% fee. On a MATERIAL change (any persisted field's stored value actually moved), every
 * specialist with an active (PENDING) application is notified their terms were updated — a whitespace-only no-op save
 * changes nothing and notifies no one. The fan-out is fire-and-forget (a notification failure never fails the edit).
 */
export async function updateGig(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'CLIENT') {
    return { error: 'Редактировать гиги могут только заказчики.' }
  }

  const gigId = formData.get('gigId') as string

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })
  if (!gig) {
    return { error: 'Этот гиг больше не существует или был удалён.' }
  }
  if (gig.clientId !== session.userId) {
    return { error: 'Редактировать гиг может только заказчик, опубликовавший его.' }
  }
  if (gig.closedByAdmin) {
    return { error: 'Этот гиг закрыт администрацией и больше недоступен.' }
  }
  if (gig.isExample) {
    return { error: 'Демонстрационный гиг нельзя редактировать.' }
  }
  if (gig.status !== 'OPEN') {
    return { error: 'Редактировать гиг можно только пока он открыт и специалист не назначен.' }
  }

  const parsed = parseGigForm(formData)
  if ('error' in parsed) return parsed
  const f = parsed.fields

  // Material change = any persisted editable field's stored value actually moved (compared after the same
  // trim/normalization used for storage). A no-op / whitespace-only re-save leaves every value equal → no fan-out.
  const material =
    f.title !== gig.title ||
    f.description !== gig.description ||
    f.acceptanceCriteria !== (gig.acceptanceCriteria ?? '') ||
    f.goal !== gig.goal ||
    f.deliverables !== gig.deliverables ||
    f.constraints !== gig.constraints ||
    f.budget !== gig.budget ||
    f.deadlineDays !== gig.deadlineDays ||
    f.stageCount !== gig.stageCount ||
    (f.categorySlug ?? null) !== (gig.categorySlug ?? null) ||
    f.tags !== gig.tags

  // Whitelist the writable columns — status, ownership, assignment, isExample/closedByAdmin, and timestamps are NOT
  // editable through this action.
  await prisma.gig.update({
    where: { id: gigId },
    data: {
      title: f.title,
      description: f.description,
      acceptanceCriteria: f.acceptanceCriteria,
      goal: f.goal,
      deliverables: f.deliverables,
      constraints: f.constraints,
      budget: f.budget,
      serviceFee: f.serviceFee,
      totalAmount: f.totalAmount,
      tags: f.tags,
      categorySlug: f.categorySlug,
      deadlineDays: f.deadlineDays,
      stageCount: f.stageCount,
    },
  })

  // Fan-out to every active (PENDING) applicant on a material change (fire-and-forget). WITHDRAWN/WITHDRAWN_FINAL and
  // REJECTED applicants are out of the running (the PENDING filter excludes them); the owner is never a recipient.
  // The whole block is defensively wrapped so a notification/query failure can NEVER fail the (already-committed) edit
  // or block the redirect — the fan-out is best-effort, self-contained here rather than relying on the helper's catch.
  if (material) {
    try {
      const pending = await prisma.application.findMany({
        where: { gigId, status: 'PENDING' },
        select: { specialistId: true },
      })
      if (pending.length > 0) {
        createNotificationsBulk(
          pending.map((a) => ({
            userId: a.specialistId,
            gigId,
            type: 'STATUS_CHANGE' as const,
            eventType: 'gig_updated',
            eventData: JSON.stringify({ gigId }),
          }))
        )
      }
    } catch (error) {
      console.error('[updateGig] applicant notification fan-out failed:', {
        gigId,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  redirect(`/gigs/${gigId}`)
}

export async function applyToGig(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'SPECIALIST') {
    return { error: 'Откликаться на гиги могут только специалисты. Войдите как специалист или зарегистрируйтесь в этой роли.' }
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
    return { error: 'Опишите ваш подход к задаче.' }
  }
  if (!questions) {
    return { error: 'Задайте уточняющие вопросы.' }
  }

  // Validate minimum lengths
  if (approach.length < 100) {
    return { error: 'Описание подхода должно быть не короче 100 символов. Расскажите подробнее о вашем методе.' }
  }
  if (questions.length < 50) {
    return { error: 'Уточняющие вопросы должны быть не короче 50 символов. Что нужно прояснить по задаче?' }
  }

  // Validate maximum lengths
  if (approach.length > 2000) {
    return { error: 'Описание подхода слишком длинное. Максимум 2000 символов.' }
  }
  if (questions.length > 1000) {
    return { error: 'Уточняющие вопросы слишком длинные. Максимум 1000 символов.' }
  }
  if (estimatedEffort.length > 200) {
    return { error: 'Оценка трудозатрат слишком длинная. Максимум 200 символов.' }
  }

  // Optional proposed terms (TermsTabs "Предложено"). Budget in roubles → kopecks; absent → null.
  let proposedBudget: number | null = null
  const pbRaw = formData.get('proposedBudget') as string | null
  if (pbRaw != null && pbRaw !== '') {
    const r = Number(pbRaw)
    if (!Number.isFinite(r) || r <= 0) {
      return { error: 'Предложенный бюджет должен быть положительным числом в рублях.' }
    }
    proposedBudget = Math.round(r * 100)
  }
  let proposedDeadlineDays: number | null = null
  const pdRaw = formData.get('proposedDeadlineDays') as string | null
  if (pdRaw != null && pdRaw !== '') {
    const n = Number(pdRaw)
    if (!Number.isInteger(n) || n < 1 || n > 365) {
      return { error: 'Предложенный срок должен быть целым числом дней от 1 до 365.' }
    }
    proposedDeadlineDays = n
  }

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })
  if (!gig) {
    return { error: 'Этот гиг больше не существует или был удалён.' }
  }

  if (gig.isExample) {
    return { error: 'Это демонстрационный гиг. Откликайтесь на реальные гиги в поиске.' }
  }

  if (gig.closedByAdmin) {
    return { error: 'Этот гиг закрыт администрацией и больше недоступен.' }
  }

  if (gig.status !== 'OPEN') {
    return { error: 'Этот гиг больше не принимает отклики — возможно, специалист уже назначен.' }
  }

  const existing = await prisma.application.findUnique({
    where: { gigId_specialistId: { gigId, specialistId: session.userId } },
  })
  if (existing) {
    // Re-application is gated purely by status (fix-application-lifecycle).
    if (existing.status === 'PENDING' || existing.status === 'ACCEPTED') {
      return { error: 'Вы уже откликнулись на этот гиг. Статус отклика виден в вашем дашборде.' }
    }
    if (existing.status === 'REJECTED') {
      return { error: 'Ваш отклик на этот гиг был отклонён заказчиком. Повторный отклик недоступен.' }
    }
    if (existing.status === 'WITHDRAWN_FINAL') {
      return { error: 'Вы окончательно отозвали отклик на этот гиг и больше не можете откликнуться.' }
    }
    // status === 'WITHDRAWN' (reversible) → reactivate the SAME row to PENDING, keeping
    // freeWithdrawalUsed. Guarded on the current WITHDRAWN status so a concurrent
    // apply/withdraw cannot double-fire (atomic conditional update, no new row).
    const reactivated = await prisma.application.updateMany({
      where: { id: existing.id, status: 'WITHDRAWN' },
      data: {
        status: 'PENDING',
        approach,
        questions,
        estimatedEffort,
        proposedBudget,
        proposedDeadlineDays,
        coverLetter: '',
      },
    })
    if (reactivated.count === 0) {
      return { error: 'Не удалось обновить отклик. Обновите страницу и попробуйте снова.' }
    }
    const reapplicant = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, specialistProfile: { select: { displayName: true } } },
    })
    const reapplicantName =
      reapplicant?.specialistProfile?.displayName || reapplicant?.email || 'A specialist'
    createNotification(gig.clientId, gigId, 'APPLICATION', 'application_submitted', {
      specialistId: session.userId,
      specialistName: reapplicantName,
      applicationId: existing.id,
    })
    redirect(`/gigs/${gigId}`)
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
    return { error: 'Управлять откликами могут только заказчики. Если вы специалист — дождитесь решения заказчика.' }
  }

  const applicationId = formData.get('applicationId') as string

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { gig: true },
  })

  if (!application) {
    return { error: 'Этот отклик больше не существует или был удалён.' }
  }

  if (application.gig.clientId !== session.userId) {
    return { error: 'Принимать отклики может только заказчик, опубликовавший гиг.' }
  }

  if (application.gig.status !== 'OPEN') {
    return { error: 'Этот гиг больше не принимает отклики — возможно, специалист уже назначен.' }
  }

  if (application.status !== 'PENDING') {
    return { error: 'Этот отклик уже принят или отклонён.' }
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
    return { error: 'Управлять откликами могут только заказчики. Если вы специалист — дождитесь решения заказчика.' }
  }

  const applicationId = formData.get('applicationId') as string

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { gig: true },
  })

  if (!application) {
    return { error: 'Этот отклик больше не существует или был удалён.' }
  }

  if (application.gig.clientId !== session.userId) {
    return { error: 'Отклонять отклики может только заказчик, опубликовавший гиг.' }
  }

  if (application.status !== 'PENDING') {
    return { error: 'Этот отклик уже принят или отклонён.' }
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
    return { error: 'Сдавать работу могут только специалисты. Если вы заказчик — дождитесь сдачи от специалиста.' }
  }

  const gigId = formData.get('gigId') as string

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })

  if (!gig) {
    return { error: 'Этот гиг больше не существует или был удалён.' }
  }

  if (gig.status !== 'IN_PROGRESS') {
    return { error: 'Сдать работу можно только по гигу в статусе «В работе».' }
  }

  if (gig.assignedSpecialistId !== session.userId) {
    return { error: 'Сдать работу может только назначенный специалист.' }
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
    return { error: 'Принимать работу могут только заказчики. Если вы специалист — дождитесь проверки заказчиком.' }
  }

  const gigId = formData.get('gigId') as string

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })

  if (!gig) {
    return { error: 'Этот гиг больше не существует или был удалён.' }
  }

  if (gig.status !== 'REVIEW') {
    return { error: 'Принять работу можно только по гигу на проверке — сначала специалист должен её сдать.' }
  }

  if (gig.clientId !== session.userId) {
    return { error: 'Принять работу может только заказчик, опубликовавший гиг.' }
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
    return { error: 'Возвращать работу на доработку могут только заказчики.' }
  }

  const gigId = formData.get('gigId') as string

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })

  if (!gig) {
    return { error: 'Этот гиг больше не существует или был удалён.' }
  }

  if (gig.status !== 'REVIEW') {
    return { error: 'Вернуть работу можно только пока она на проверке.' }
  }

  if (gig.clientId !== session.userId) {
    return { error: 'Вернуть работу может только заказчик, опубликовавший гиг.' }
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
    return { error: 'Отмечать оплату могут только заказчики. Если вы специалист — дождитесь подтверждения оплаты.' }
  }

  const gigId = formData.get('gigId') as string

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })

  if (!gig) {
    return { error: 'Этот гиг больше не существует или был удалён.' }
  }

  if (gig.clientId !== session.userId) {
    return { error: 'Отметить оплату может только заказчик, опубликовавший гиг.' }
  }

  if (gig.status === 'PAID') {
    return { error: 'Этот гиг уже отмечен как оплаченный.' }
  }

  if (gig.status !== 'COMPLETED') {
    return { error: 'Отметить оплату можно только по завершённому гигу — сначала нужно принять работу.' }
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
    return { error: 'Отзывать отклики могут только специалисты. Заказчик может отклонить отклик.' }
  }

  const applicationId = formData.get('applicationId') as string

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { gig: true },
  })

  if (!application) {
    return { error: 'Этот отклик больше не существует или был удалён.' }
  }

  if (!application.gig) {
    return { error: 'Этот гиг больше не существует или был удалён.' }
  }

  if (application.specialistId !== session.userId) {
    return { error: 'Вы можете отозвать только свои отклики.' }
  }

  if (application.status === 'WITHDRAWN') {
    return { error: 'Этот отклик уже отозван.' }
  }

  if (application.status !== 'PENDING') {
    return { error: 'Отозвать можно только отклик на рассмотрении — этот уже принят или отклонён.' }
  }

  if (application.gig.closedByAdmin) {
    return { error: 'Нельзя отозвать отклик по закрытому гигу.' }
  }

  if (application.gig.isExample) {
    return { error: 'Нельзя отозвать отклик по демонстрационному гигу.' }
  }

  // Get specialist profile for notification
  const specialist = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { specialistProfile: true },
  })

  // One-free-withdrawal rule (fix-application-lifecycle), enforced atomically and race-safe:
  // the two conditional updates are mutually exclusive on freeWithdrawalUsed and both require the
  // row to still be PENDING, so exactly one can win even under concurrent apply/withdraw calls.
  //   1st withdrawal (freeWithdrawalUsed=false) → WITHDRAWN + set flag (reversible).
  //   2nd withdrawal (freeWithdrawalUsed=true)  → WITHDRAWN_FINAL (permanent, re-apply blocked).
  const first = await prisma.application.updateMany({
    where: { id: applicationId, status: 'PENDING', freeWithdrawalUsed: false },
    data: { status: 'WITHDRAWN', freeWithdrawalUsed: true },
  })
  if (first.count === 0) {
    const second = await prisma.application.updateMany({
      where: { id: applicationId, status: 'PENDING', freeWithdrawalUsed: true },
      data: { status: 'WITHDRAWN_FINAL' },
    })
    if (second.count === 0) {
      return { error: 'Не удалось отозвать отклик — возможно, его статус изменился. Обновите страницу.' }
    }
  }

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

  const gigId = formData.get('gigId') as string
  const contentRaw = (formData.get('content') as string) || ''

  // All guards (rate limit, sanitize, validate, gig/participant gates, notification) live in the shared core so this
  // form path and the optimistic `sendMessageLive` can never diverge.
  const result = await persistMessage(session.userId, gigId, contentRaw)
  if ('error' in result) {
    return { error: result.error }
  }

  // Default back to the gig detail; the chats screen passes redirectTo=/chats?gig=<id> so a send keeps the user in
  // their conversation instead of bouncing them to the gig page. Only same-origin absolute paths are honoured
  // (open-redirect guard, mirroring updateProfile). This remains the no-JS progressive-enhancement path.
  const requested = (formData.get('redirectTo') as string) || ''
  redirect(requested.startsWith('/') ? requested : `/gigs/${gigId}`)
}
