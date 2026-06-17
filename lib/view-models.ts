import { prisma } from '@/lib/prisma'
import { getRatingForUser } from '@/lib/reviews'
import { CATEGORIES } from '@/lib/categories'
import { getLedger, getFinanceStats } from '@/lib/finances'
import { getDisputeList, getDisputeDetail } from '@/lib/disputes'
import { getPreferences, type Preferences } from '@/lib/preferences'
import { getRecentMessages } from '@/app/actions/message'
import type {
  GigCardVM,
  GigHeaderVM,
  ProfileHeaderVM,
  StatPanelVM,
  LedgerTableVM,
  DisputeListVM,
  DisputeDetailVM,
  TagListVM,
  CategoryTagsVM,
  ExperienceListVM,
  MessagesPanelVM,
  BannerCardVM,
  ConversationItemVM,
  ChatHeaderVM,
  MessageBubbleVM,
  FilterBarVM,
  RequirementCardVM,
  CriteriaListVM,
  ClientCardVM,
  TermsTabsVM,
  ChatPanelVM,
  ApplyPanelVM,
  Status,
  Category,
} from '@/app/components/blocks/view-models'

/**
 * Server-only view-model mappers — bind real schema data into the block view-model contracts (consumed by Phase-2
 * composed screens). Types imported `import type` (erased at build) so the data layer matches the SSOT with NO runtime
 * UI coupling — the lib/reviews.ts / lib/finances.ts pattern.
 */

// Gig lifecycle status → the design Status (the enum has no `paid`; a paid gig is terminal `completed`).
const GIG_STATUS: Record<string, Status> = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  REVIEW: 'verification',
  COMPLETED: 'completed',
  PAID: 'completed',
}
const money = (kopecks: number): string => `${new Intl.NumberFormat('ru-RU').format(kopecks / 100)} ₽`

type GigForCard = {
  id: string
  title: string
  categorySlug: string | null
  tags: string
  status: string
  budget: number
  deadlineDays: number
  assignedSpecialistId: string | null
}

/** Map a gig to its GigCardVM (the gig's assigned specialist supplies the rating when present). */
export async function toGigCardVM(gig: GigForCard, layout: 'grid' | 'list' = 'grid'): Promise<GigCardVM> {
  const rating = gig.assignedSpecialistId
    ? await getRatingForUser(gig.assignedSpecialistId)
    : { value: 0, count: 0, verified: false }
  return {
    id: gig.id,
    title: gig.title,
    category: (gig.categorySlug as Category | null) ?? 'development',
    tags: gig.tags ? gig.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    status: GIG_STATUS[gig.status] ?? 'open',
    budget: money(gig.budget),
    deadlineDays: gig.deadlineDays,
    rating,
    isCurrent: gig.status === 'IN_PROGRESS',
    layout,
  }
}

/** A GigCardVM carrying its raw lifecycle status, so the dashboard tabs can filter the grid client-side. */
export type ClientGigCard = GigCardVM & { rawStatus: string }

export interface ClientDashboardData {
  completion: number
  banner: BannerCardVM
  gigCards: ClientGigCard[]
  tabs: { value: string; label: string; count?: number }[]
  messages: MessagesPanelVM
}

/** Assemble the CLIENT dashboard data: profile completion %, the client's gigs as GigCards (+ tab counts), messages. */
export async function getClientDashboard(userId: string): Promise<ClientDashboardData> {
  const [user, gigs, recent] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, include: { clientProfile: true } }),
    prisma.gig.findMany({ where: { clientId: userId }, orderBy: { createdAt: 'desc' } }),
    getRecentMessages(),
  ])

  const cp = user?.clientProfile
  const fields = [cp?.companyName, cp?.inn, cp?.kpp, cp?.contactPerson, cp?.phoneNumber]
  const filled = fields.filter((f) => f && f.trim() !== '').length
  const completion = Math.round((filled / fields.length) * 100)

  const gigCards: ClientGigCard[] = await Promise.all(
    gigs.map(async (g) => ({ ...(await toGigCardVM(g)), rawStatus: g.status })),
  )

  const countBy = (pred: (s: string) => boolean) => gigCards.filter((g) => pred(g.rawStatus)).length
  const tabs = [
    { value: 'all', label: 'Все', count: gigCards.length },
    { value: 'IN_PROGRESS', label: 'В работе', count: countBy((s) => s === 'IN_PROGRESS') },
    { value: 'REVIEW', label: 'На проверке', count: countBy((s) => s === 'REVIEW') },
    { value: 'COMPLETED', label: 'Завершённые', count: countBy((s) => s === 'COMPLETED' || s === 'PAID') },
  ]

  const conversations: ConversationItemVM[] = recent.map((m) => ({
    id: m.gigId,
    avatar: '',
    name: m.senderName,
    preview: m.contentPreview,
    timestamp: new Date(m.createdAt).toLocaleDateString('ru-RU'),
    unread: 0,
  }))

  const banner: BannerCardVM = {
    headline: 'Найдите сильного специалиста за часы',
    body: `Профиль заполнен на ${completion}%`,
    cta: { label: 'Создать гиг', href: '/gigs/new' },
  }

  return { completion, banner, gigCards, tabs, messages: { conversations } }
}

/** A GigCardVM carrying the dashboard tab it belongs to, so the specialist dashboard tabs can filter the grid. */
export type SpecialistGigCard = GigCardVM & { tabKey: string }

export interface SpecialistDashboardData {
  completion: number
  banner: BannerCardVM
  gigCards: SpecialistGigCard[]
  tabs: { value: string; label: string; count?: number }[]
  messages: MessagesPanelVM
}

/**
 * Assemble the SPECIALIST dashboard data: profile completion %, the specialist's applications + assigned gigs as
 * GigCards (each tagged with a tabKey) across the five tabs (Все/Заявки/В работе/На проверке/Завершённые, with
 * counts), and recent messages. Reuses toGigCardVM. Reconciliation (compose-specialist-dashboard): Заявки = PENDING
 * applications (card shows the pending state, «На рассмотрении»); rejected/withdrawn applications are surfaced under
 * Все only (status «Отклонён»), so no data is lost while the five primary tabs match the design exactly.
 */
export async function getSpecialistDashboard(userId: string): Promise<SpecialistDashboardData> {
  const [user, applications, assignedGigs, recent] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, include: { specialistProfile: true } }),
    prisma.application.findMany({
      where: { specialistId: userId },
      include: { gig: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.gig.findMany({
      where: { assignedSpecialistId: userId, status: { in: ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] } },
      orderBy: { updatedAt: 'desc' },
    }),
    getRecentMessages(),
  ])

  // Заявки — PENDING applications; the card reflects the pending application (→ 'review' / На рассмотрении).
  const pendingCards: SpecialistGigCard[] = await Promise.all(
    applications
      .filter((a) => a.status === 'PENDING')
      .map(async (a) => ({ ...(await toGigCardVM(a.gig)), status: 'review' as Status, tabKey: 'applications' })),
  )
  // Rejected/withdrawn — surfaced under Все only (status 'rejected' / Отклонён). Reconciliation: no data lost.
  const archivedCards: SpecialistGigCard[] = await Promise.all(
    applications
      .filter((a) => a.status === 'REJECTED' || a.status === 'WITHDRAWN')
      .map(async (a) => ({ ...(await toGigCardVM(a.gig)), status: 'rejected' as Status, tabKey: 'archive' })),
  )
  // Assigned gigs — В работе / На проверке / Завершённые (standard toGigCardVM status mapping).
  const assignedCards: SpecialistGigCard[] = await Promise.all(
    assignedGigs.map(async (g) => ({
      ...(await toGigCardVM(g)),
      tabKey: g.status === 'IN_PROGRESS' ? 'in-progress' : g.status === 'REVIEW' ? 'verification' : 'completed',
    })),
  )
  const gigCards: SpecialistGigCard[] = [...pendingCards, ...assignedCards, ...archivedCards]

  const sp = user?.specialistProfile
  const fields = [sp?.displayName, sp?.techStack, sp?.experienceLevel, sp?.bio]
  const filled = fields.filter((f) => f && String(f).trim() !== '').length
  const completion = Math.round((filled / fields.length) * 100)

  const countByTab = (key: string) => gigCards.filter((c) => c.tabKey === key).length
  const tabs = [
    { value: 'all', label: 'Все', count: gigCards.length },
    { value: 'applications', label: 'Заявки', count: countByTab('applications') },
    { value: 'in-progress', label: 'В работе', count: countByTab('in-progress') },
    { value: 'verification', label: 'На проверке', count: countByTab('verification') },
    { value: 'completed', label: 'Завершённые', count: countByTab('completed') },
  ]

  const conversations: ConversationItemVM[] = recent.map((m) => ({
    id: m.gigId,
    avatar: '',
    name: m.senderName,
    preview: m.contentPreview,
    timestamp: new Date(m.createdAt).toLocaleDateString('ru-RU'),
    unread: 0,
  }))

  // Welcome banner (no CTA — the working find-project action is the SearchPanel, since BannerCard's CTA is decorative).
  const banner: BannerCardVM = {
    headline: 'Находите интересные гиги и зарабатывайте больше',
    body: `Профиль заполнен на ${completion}%`,
  }

  return { completion, banner, gigCards, tabs, messages: { conversations } }
}

// ---- Gig search / browse (compose-gig-search) -----------------------------

/** A browse gig carries its owner (client) — OPEN gigs have no specialist, so the card shows the client's rating. */
type BrowseGig = GigForCard & {
  clientId: string
  client?: { email: string; clientProfile: { companyName: string } | null } | null
}

/**
 * Browse card: reuse toGigCardVM, then show the gig OWNER's rating + name (OPEN gigs have no assigned specialist, so
 * the relevant reputation on the browse screen is the client's).
 */
export async function toBrowseGigCardVM(gig: BrowseGig, layout: 'grid' | 'list' = 'grid'): Promise<GigCardVM> {
  const base = await toGigCardVM(gig, layout)
  const rating = await getRatingForUser(gig.clientId)
  return { ...base, rating, clientName: gig.client?.clientProfile?.companyName ?? gig.client?.email }
}

export interface GigSearchData {
  gigCards: GigCardVM[]
  filterBar: FilterBarVM
  count: number
  page: number
  totalPages: number
  perPage: number
  view: 'grid' | 'list'
}

/**
 * Shape the (already-executed) OPEN-gig browse query into the composed /gigs screen's data: gigs as browse GigCards
 * (client rating + name, in the active layout), the FilterBarVM, the total count, pagination, and the view. The page
 * owns the query (the single source of truth for search/tags/budget/sort/category/rating/pagination); this only maps.
 */
export async function getGigSearch(input: {
  gigs: BrowseGig[]
  count: number
  page: number
  totalPages: number
  perPage: number
  view: 'grid' | 'list'
  query: string
}): Promise<GigSearchData> {
  const gigCards = await Promise.all(input.gigs.map((g) => toBrowseGigCardVM(g, input.view)))
  const filterBar: FilterBarVM = { query: input.query, view: input.view, filters: [] }
  return {
    gigCards,
    filterBar,
    count: input.count,
    page: input.page,
    totalPages: input.totalPages,
    perPage: input.perPage,
    view: input.view,
  }
}

// ---- Gig detail (compose-gig-detail-apply) --------------------------------

export interface GigDetailApplication {
  id: string
  name: string
  email: string
  level?: string
  tags: string[]
  approach?: string
  questions?: string
  estimate?: string
  coverLetter?: string
  status: string
  rating: { value: number; count: number; verified: boolean }
  createdAt: string
}

export interface GigDetailData {
  gigId: string
  header: GigHeaderVM
  requirements: RequirementCardVM[]
  criteria: CriteriaListVM
  client: ClientCardVM
  clientId: string
  terms: TermsTabsVM
  chat: ChatPanelVM
  apply: ApplyPanelVM
  isOwner: boolean
  isAssignedSpecialist: boolean
  isExample: boolean
  closedByAdmin: boolean
  closedAt: string | null
  paidAt: string | null
  status: string
  viewerApplication: { id: string; status: string } | null
  applications: GigDetailApplication[]
  lifecycle: { canApply: boolean; canSubmit: boolean; canApprove: boolean; canPay: boolean }
  messaging: { assigned: boolean; canView: boolean; canSend: boolean }
  moderations: { id: string; action: string; reason: string; by: string; at: string }[]
  assignedSpecialistEmail: string | null
}

/**
 * Assemble the gig-detail data for a viewer (compose-gig-detail-apply): the seven block VMs (header / requirements /
 * criteria / client / terms / chat / apply) plus the role + lifecycle state that the composed screen needs to wire the
 * (unchanged) server actions. Reuses getRatingForUser + the GIG_STATUS/money helpers. Returns null when the gig is
 * missing (the page renders the not-found notice). Server-only; VM types imported `import type`.
 */
export async function getGigDetail(
  gigId: string,
  viewer: { userId: string; role: string },
): Promise<GigDetailData | null> {
  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    include: {
      client: { include: { clientProfile: true } },
      assignedSpecialist: true,
      applications: {
        include: { specialist: { include: { specialistProfile: true } } },
        orderBy: { createdAt: 'desc' },
      },
      messages: {
        include: { sender: { include: { clientProfile: true, specialistProfile: true } } },
        orderBy: { createdAt: 'asc' },
      },
      moderations: viewer.role === 'ADMIN' ? { include: { admin: true }, orderBy: { createdAt: 'desc' } } : false,
    },
  })
  if (!gig) return null

  const isOwner = viewer.role === 'CLIENT' && gig.clientId === viewer.userId
  const isAssignedSpecialist = viewer.role === 'SPECIALIST' && gig.assignedSpecialistId === viewer.userId
  const myApp = viewer.role === 'SPECIALIST' ? gig.applications.find((a) => a.specialistId === viewer.userId) : undefined
  const hasActiveApp = !!myApp && myApp.status !== 'WITHDRAWN' && myApp.status !== 'REJECTED'

  const fmt = (d: Date) => new Date(d).toLocaleDateString('ru-RU')
  const tagsArr = gig.tags ? gig.tags.split(',').map((t) => t.trim()).filter(Boolean) : []

  const header: GigHeaderVM = {
    title: gig.title,
    status: GIG_STATUS[gig.status] ?? 'open',
    budget: money(gig.budget),
    deadlineDays: gig.deadlineDays,
    category: (gig.categorySlug as Category | null) ?? 'development',
    tags: tagsArr,
    postedAt: fmt(gig.createdAt),
  }

  const requirements: RequirementCardVM[] = []
  if (gig.goal) requirements.push({ title: 'Цель', body: gig.goal })
  if (gig.deliverables) requirements.push({ title: 'Результаты', body: gig.deliverables })
  if (gig.constraints) requirements.push({ title: 'Ограничения', body: gig.constraints })

  const critItems = (gig.acceptanceCriteria ?? '')
    .split(/\r?\n|•|;/)
    .map((s) => s.trim())
    .filter(Boolean)
  const criteria: CriteriaListVM = {
    items: critItems.length ? critItems.map((label) => ({ label })) : [{ label: 'Не указано' }],
  }

  const client: ClientCardVM = {
    avatar: '',
    name: gig.client.clientProfile?.companyName || gig.client.email,
    rating: await getRatingForUser(gig.clientId),
    meta: [{ key: 'Email', value: gig.client.email }],
  }

  // Terms: proposed = the viewer's application counter (fallback to the gig's when no counter); client = the gig's.
  const proposedBudget = myApp?.proposedBudget ?? gig.budget
  const proposedDeadline = myApp?.proposedDeadlineDays ?? gig.deadlineDays
  const terms: TermsTabsVM = {
    proposed: [
      { label: 'Бюджет', value: money(proposedBudget) },
      { label: 'Срок', value: `${proposedDeadline} дней` },
    ],
    client: [
      { label: 'Бюджет', value: money(gig.budget) },
      { label: 'Срок', value: `${gig.deadlineDays} дней` },
    ],
  }

  const chat: ChatPanelVM = {
    thread: gig.messages.map((m) => ({
      direction: (m.senderId === viewer.userId ? 'out' : 'in') as 'in' | 'out',
      author: m.sender.clientProfile?.companyName || m.sender.specialistProfile?.displayName || m.sender.email,
      timestamp: new Date(m.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      body: m.content,
    })),
    composer: { canAttach: false },
  }

  const apply: ApplyPanelVM = {
    submitLabel: 'Откликнуться',
    fields: [
      { name: 'approach', label: 'Технический подход', placeholder: 'Как вы решите задачу…', required: true, multiline: true },
      { name: 'questions', label: 'Уточняющие вопросы', placeholder: 'Что нужно прояснить…', required: true, multiline: true },
      { name: 'estimatedEffort', label: 'Оценка трудозатрат', placeholder: 'напр. 2 недели' },
    ],
  }

  const applications: GigDetailApplication[] = isOwner
    ? await Promise.all(
        gig.applications.map(async (a) => ({
          id: a.id,
          name: a.specialist.specialistProfile?.displayName || a.specialist.email,
          email: a.specialist.email,
          level: a.specialist.specialistProfile?.experienceLevel || undefined,
          tags: a.specialist.specialistProfile?.techStack
            ? a.specialist.specialistProfile.techStack.split(',').map((t) => t.trim()).filter(Boolean)
            : [],
          approach: a.approach || undefined,
          questions: a.questions || undefined,
          estimate: a.estimatedEffort || undefined,
          coverLetter: a.coverLetter || undefined,
          status: a.status,
          rating: await getRatingForUser(a.specialistId),
          createdAt: fmt(a.createdAt),
        })),
      )
    : []

  const assigned = gig.assignedSpecialistId !== null
  return {
    gigId: gig.id,
    header,
    requirements,
    criteria,
    client,
    clientId: gig.clientId,
    terms,
    chat,
    apply,
    isOwner,
    isAssignedSpecialist,
    isExample: gig.isExample,
    closedByAdmin: gig.closedByAdmin,
    closedAt: gig.closedAt ? new Date(gig.closedAt).toLocaleString('ru-RU') : null,
    paidAt: gig.paidAt ? fmt(gig.paidAt) : null,
    status: gig.status,
    viewerApplication: myApp ? { id: myApp.id, status: myApp.status } : null,
    applications,
    lifecycle: {
      canApply:
        viewer.role === 'SPECIALIST' &&
        gig.status === 'OPEN' &&
        !gig.isExample &&
        !gig.closedByAdmin &&
        !hasActiveApp &&
        !isAssignedSpecialist,
      canSubmit: isAssignedSpecialist && gig.status === 'IN_PROGRESS',
      canApprove: isOwner && gig.status === 'REVIEW',
      canPay: isOwner && gig.status === 'COMPLETED',
    },
    messaging: {
      assigned,
      canView: (isOwner || isAssignedSpecialist) && assigned,
      canSend: (isOwner || isAssignedSpecialist) && assigned && !gig.closedByAdmin && gig.status !== 'PAID',
    },
    moderations: (gig.moderations ?? []).map((log) => ({
      id: log.id,
      action: log.action,
      reason: log.reason,
      by: (log as { admin?: { email: string } }).admin?.email ?? 'Admin',
      at: new Date(log.createdAt).toLocaleString('ru-RU'),
    })),
    assignedSpecialistEmail: gig.assignedSpecialist?.email ?? null,
  }
}

// ---- Profile (compose-profile) --------------------------------------------

export interface ProfileData {
  role: 'SPECIALIST' | 'CLIENT'
  header: ProfileHeaderVM
  /** The mock's analytics placeholder («Здесь будет ваша статистика»); the real numeric stats live in header.stats. */
  stats: StatPanelVM
  stack?: TagListVM // SPECIALIST only
  categories?: CategoryTagsVM // SPECIALIST only
  experience?: ExperienceListVM // SPECIALIST only
  realized: GigCardVM[] // SPECIALIST: COMPLETED/PAID assigned gigs (empty for CLIENT)
  rating: { value: number; count: number; verified: boolean }
  isOwner: boolean
}

const longDate = (d: Date): string =>
  new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

/** A WorkExperience period: «2021 — Наст. время» (null endYear = current), «2018 — 2021», or a single year. */
const period = (start: number | null, end: number | null): string => {
  if (start == null && end == null) return ''
  const s = start != null ? String(start) : ''
  const e = end != null ? String(end) : 'Наст. время'
  return s ? `${s} — ${e}` : e
}

/** The mock's «coming soon» analytics widget (a deferred feature) — real stats live in header.stats. */
const statsPlaceholder = (): StatPanelVM => ({
  stats: [{ label: 'Окно находится на стадии разработки', value: 'Здесь будет ваша статистика' }],
})

/**
 * Assemble the profile data for a viewer (compose-profile): the block VMs (ProfileHeader / StatPanel / TagList /
 * CategoryTags / ExperienceList / realized GigCards) + the aggregate rating + `isOwner`. SPECIALIST binds the
 * profile-evolution fields, the tech stack, the five categories with the user's favorites marked, the bio + work
 * experience, and the COMPLETED/PAID assigned gigs; CLIENT binds the company header + stats. Returns `null` when the
 * user is missing or the role's profile is unset (the page renders the not-set-up / not-found notice). Reuses
 * getRatingForUser / CATEGORIES / toGigCardVM. Server-only; VM types imported `import type`.
 */
export async function getProfile(
  targetUserId: string,
  viewer: { userId: string; role: string },
): Promise<ProfileData | null> {
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: {
      specialistProfile: { include: { workExperience: { orderBy: { order: 'asc' } } } },
      clientProfile: true,
      favoriteCategories: { orderBy: { order: 'asc' } },
    },
  })
  if (!user) return null

  const isOwner = viewer.userId === targetUserId
  const rating = await getRatingForUser(targetUserId)
  const ratingValue = rating.value ? rating.value.toFixed(1) : '—'

  // SPECIALIST profile (the specialist-progile mock).
  if (user.specialistProfile) {
    const sp = user.specialistProfile
    const realizedGigs = await prisma.gig.findMany({
      where: { assignedSpecialistId: targetUserId, status: { in: ['COMPLETED', 'PAID'] } },
      orderBy: { updatedAt: 'desc' },
    })
    const realized = await Promise.all(realizedGigs.map((g) => toGigCardVM(g, 'list')))

    // Real stats: completed-task count + repeat-order rate (clients with ≥2 completed gigs).
    const completedCount = realizedGigs.length
    const clientCounts = new Map<string, number>()
    for (const g of realizedGigs) clientCounts.set(g.clientId, (clientCounts.get(g.clientId) ?? 0) + 1)
    const repeatClients = [...clientCounts.values()].filter((n) => n >= 2).length
    const repeatRate = clientCounts.size > 0 ? Math.round((repeatClients / clientCounts.size) * 100) : 0

    const header: ProfileHeaderVM = {
      avatar: sp.avatarUrl || '',
      name: sp.displayName || user.email,
      roleTag: sp.position || sp.specialization || sp.experienceLevel || 'Специалист',
      verified: sp.phoneVerified,
      memberSince: longDate(user.createdAt),
      location: sp.location || undefined,
      online: false,
      stats: [
        { label: 'Рейтинг', value: ratingValue },
        { label: 'Завершено задач', value: completedCount },
        { label: 'Повторные заказы', value: `${repeatRate}%` },
      ],
    }

    const stack: TagListVM = {
      title: 'Стек',
      tags: (sp.techStack ? sp.techStack.split(',').map((t) => t.trim()).filter(Boolean) : []).map((label) => ({
        label,
      })),
    }

    const favoriteSlugs = new Set(user.favoriteCategories.map((c) => c.slug))
    const categories: CategoryTagsVM = {
      title: 'Избранные категории',
      categories: CATEGORIES.map((c) => ({ slug: c.slug, label: c.name, favorite: favoriteSlugs.has(c.slug) })),
    }

    const experience: ExperienceListVM = {
      title: 'Опыт',
      bio: sp.bio || undefined,
      entries: sp.workExperience.map((w) => ({
        company: w.company,
        title: w.title || undefined,
        period: period(w.startYear, w.endYear),
        description: w.description || undefined,
      })),
    }

    return { role: 'SPECIALIST', header, stats: statsPlaceholder(), stack, categories, experience, realized, rating, isOwner }
  }

  // CLIENT profile (no mock — composed from the same blocks).
  if (user.clientProfile) {
    const cp = user.clientProfile
    const gigs = await prisma.gig.findMany({ where: { clientId: targetUserId } })
    const published = gigs.length
    const completed = gigs.filter((g) => g.status === 'COMPLETED' || g.status === 'PAID').length

    const header: ProfileHeaderVM = {
      avatar: cp.avatarUrl || '',
      name: cp.companyName || user.email,
      roleTag: 'Заказчик',
      verified: cp.phoneVerified,
      memberSince: longDate(user.createdAt),
      online: false,
      stats: [
        { label: 'Рейтинг', value: ratingValue },
        { label: 'Опубликовано', value: published },
        { label: 'Завершено', value: completed },
      ],
    }

    return { role: 'CLIENT', header, stats: statsPlaceholder(), realized: [], rating, isOwner }
  }

  // User exists but the role's profile is unset → not-set-up.
  return null
}

// ---- Chats (compose-chats) ------------------------------------------------

const timeOfDay = (d: Date): string =>
  new Date(d).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

/** The viewer's participating gigs (CLIENT: own gigs with an assigned specialist; SPECIALIST: assigned gigs). */
const chatWhere = (viewer: { userId: string; role: string }) =>
  viewer.role === 'CLIENT'
    ? { clientId: viewer.userId, assignedSpecialistId: { not: null } }
    : { assignedSpecialistId: viewer.userId }

/**
 * The inbox: one ConversationItemVM per gig the viewer participates in that has ≥1 message — the counterparty name, the
 * gig title (subtitle), the last message (preview), its time, and the unread count (messages from others created after
 * the viewer's Notification.lastReadAt for that gig — the getUnreadNotifications rule). Sorted by last message desc.
 * Server-only; reuses the getRecentMessages participant rule.
 */
export async function getConversations(viewer: { userId: string; role: string }): Promise<ConversationItemVM[]> {
  const gigs = await prisma.gig.findMany({
    where: chatWhere(viewer),
    include: {
      messages: { orderBy: { createdAt: 'desc' } },
      notifications: { where: { userId: viewer.userId } },
      client: { include: { clientProfile: true } },
      assignedSpecialist: { include: { specialistProfile: true } },
    },
  })

  const conversations: (ConversationItemVM & { _last: number })[] = gigs
    .filter((g) => g.messages.length > 0)
    .map((g) => {
      const last = g.messages[0]
      const lastReadAt = g.notifications[0]?.lastReadAt ?? null
      const unread = g.messages.filter(
        (m) => m.senderId !== viewer.userId && (!lastReadAt || m.createdAt > lastReadAt),
      ).length
      // Counterparty = the other party in this gig.
      const counterparty =
        viewer.role === 'CLIENT'
          ? g.assignedSpecialist?.specialistProfile?.displayName || g.assignedSpecialist?.email || 'Специалист'
          : g.client.clientProfile?.companyName || g.client.email
      const avatar =
        (viewer.role === 'CLIENT'
          ? g.assignedSpecialist?.specialistProfile?.avatarUrl
          : g.client.clientProfile?.avatarUrl) || ''
      const preview = last.content.length > 50 ? `${last.content.slice(0, 50)}…` : last.content
      return {
        id: g.id,
        avatar,
        name: counterparty,
        subtitle: g.title,
        preview,
        timestamp: timeOfDay(last.createdAt),
        unread,
        _last: new Date(last.createdAt).getTime(),
      }
    })

  conversations.sort((a, b) => b._last - a._last)
  return conversations.map(({ _last, ...vm }) => vm)
}

/**
 * The selected conversation: the gig's messages → MessageBubble thread (direction per viewer, time, long-date for day
 * separators) + the counterparty ChatHeader (name + avatar + rating + presence). Authorizes the viewer (gig owner or
 * assigned specialist) — returns null otherwise. Server-only; reuses getRatingForUser.
 */
export async function getChatThread(
  gigId: string,
  viewer: { userId: string; role: string },
): Promise<{ header: ChatHeaderVM; chat: ChatPanelVM } | null> {
  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    include: {
      messages: { orderBy: { createdAt: 'asc' }, include: { sender: true } },
      client: { include: { clientProfile: true } },
      assignedSpecialist: { include: { specialistProfile: true } },
    },
  })
  if (!gig) return null

  const isParticipant = gig.clientId === viewer.userId || gig.assignedSpecialistId === viewer.userId
  if (!isParticipant) return null

  const thread: MessageBubbleVM[] = gig.messages.map((m) => ({
    direction: (m.senderId === viewer.userId ? 'out' : 'in') as 'in' | 'out',
    author: m.senderId === viewer.userId ? 'Вы' : m.sender.email,
    timestamp: timeOfDay(m.createdAt),
    date: longDate(m.createdAt),
    body: m.content,
  }))

  // Counterparty = the other party.
  const viewerIsClient = gig.clientId === viewer.userId
  const counterpartyId = viewerIsClient ? gig.assignedSpecialistId : gig.clientId
  const counterpartyName = viewerIsClient
    ? gig.assignedSpecialist?.specialistProfile?.displayName || gig.assignedSpecialist?.email || 'Специалист'
    : gig.client.clientProfile?.companyName || gig.client.email
  const counterpartyAvatar =
    (viewerIsClient ? gig.assignedSpecialist?.specialistProfile?.avatarUrl : gig.client.clientProfile?.avatarUrl) || ''
  const rating = counterpartyId ? await getRatingForUser(counterpartyId) : { value: 0, count: 0, verified: false }

  const header: ChatHeaderVM = {
    avatar: counterpartyAvatar,
    name: counterpartyName,
    verified: rating.verified,
    rating,
    presence: 'был(-а) недавно',
  }

  return { header, chat: { thread, composer: { canAttach: false }, header } }
}

/** The sidebar «Чаты» badge: count of the viewer's conversations with ≥1 unread message (matches the inbox). */
export async function getUnreadChatCount(viewer: { userId: string; role: string }): Promise<number> {
  const conversations = await getConversations(viewer)
  return conversations.filter((c) => c.unread > 0).length
}

// ---- Finances (compose-finances) ------------------------------------------

export interface FinancesData {
  stats: StatPanelVM
  ledger: LedgerTableVM
}

/**
 * Assemble the /finances data (compose-finances): the finance stat tiles + the realized ledger, bundled for the
 * composed screen's single data prop. A thin aggregator over the LOGICAL finances data layer (lib/finances) — no
 * re-derivation, no writes; amounts are the logical PAID status (project.md Escrow/Payments MVP boundary). Normalizes
 * the session role to CLIENT|SPECIALIST. Server-only; VM types imported `import type`.
 */
export async function getFinances(viewer: { userId: string; role: string }): Promise<FinancesData> {
  const role = viewer.role === 'SPECIALIST' ? 'SPECIALIST' : 'CLIENT'
  const [stats, ledger] = await Promise.all([
    getFinanceStats(viewer.userId, role),
    getLedger(viewer.userId, role),
  ])
  return { stats, ledger }
}

// ---- Disputes (compose-disputes) ------------------------------------------

export interface DisputesData {
  disputes: DisputeListVM
  isAdmin: boolean
}

/**
 * Assemble the /disputes list data (compose-disputes): the scoped dispute list + whether the viewer is an admin. A thin
 * aggregator over the disputes-flow data layer (lib/disputes) — no re-derivation, no writes. An ADMIN sees ALL disputes;
 * a participant (opener, or the gig's client / assigned specialist) sees only their own. Server-only.
 */
export async function getDisputes(viewer: { userId: string; role: string }): Promise<DisputesData> {
  const isAdmin = viewer.role === 'ADMIN'
  const disputes = await getDisputeList(isAdmin ? {} : { participantId: viewer.userId })
  return { disputes, isAdmin }
}

/**
 * One dispute's detail (compose-disputes), authorization-enforced. Returns the DisputeDetailVM for an ADMIN or a
 * participant; returns null when the dispute does not exist OR the viewer is neither an admin nor a participant (so the
 * detail page 404s). A thin wrapper over lib/disputes (no re-derivation). Server-only.
 */
export async function getDispute(
  id: string,
  viewer: { userId: string; role: string }
): Promise<DisputeDetailVM | null> {
  const d = await getDisputeDetail(id)
  if (!d) return null
  if (viewer.role === 'ADMIN') return d
  // Participant check: the opener, or the gig's client / assigned specialist (the scoped list encodes exactly this).
  const scoped = await getDisputeList({ participantId: viewer.userId })
  return scoped.disputes.some((x) => x.id === id) ? d : null
}

// ---- Settings (compose-settings) ------------------------------------------

export interface SettingsData {
  prefs: Preferences
  email: string
}

/**
 * Assemble the /settings data (compose-settings): the user's account preferences (locale + notification toggles) + the
 * viewer's email (for the delete-account confirm). A thin aggregator over the account-preferences data layer
 * (lib/preferences) — no re-derivation, no writes. Falls back to the schema defaults if the user row is missing.
 * Server-only; the Preferences shape imported `import type`.
 */
export async function getSettings(viewer: { userId: string; email: string }): Promise<SettingsData> {
  const prefs = (await getPreferences(viewer.userId)) ?? {
    locale: 'ru',
    notifyApplications: true,
    notifyStatusChanges: true,
    notifyMessages: true,
  }
  return { prefs, email: viewer.email }
}

// ---- Admin (prove-extensibility-admin) ------------------------------------

const ADMIN_PAGE_SIZE = 30

export interface AdminUserRow {
  id: string
  email: string
  role: string
  suspended: boolean
  registered: string
}
export interface AdminGigRow {
  id: string
  title: string
  status: string
  closed: boolean
  budget: string
  created: string
}
export interface AdminListData<T> {
  rows: T[]
  page: number
  totalPages: number
  totalCount: number
  hasFilters: boolean
}

/** Admin dashboard stats (the four platform counts) as a StatPanelVM. Reuses the existing counts. */
export async function getAdminDashboard(): Promise<{ stats: StatPanelVM }> {
  const [totalUsers, totalGigs, suspendedUsers, closedGigs] = await Promise.all([
    prisma.user.count(),
    prisma.gig.count(),
    prisma.user.count({ where: { suspended: true } }),
    prisma.gig.count({ where: { closedByAdmin: true } }),
  ])
  return {
    stats: {
      stats: [
        { label: 'Пользователи', value: totalUsers },
        { label: 'Гиги', value: totalGigs },
        { label: 'Заблокировано', value: suspendedUsers },
        { label: 'Закрыто', value: closedGigs },
      ],
    },
  }
}

/** Paginated/filtered admin users (reuses the existing where/skip/take/PAGE_SIZE logic). */
export async function getAdminUsers(opts: {
  role?: string
  status?: string
  page: number
}): Promise<AdminListData<AdminUserRow>> {
  const where: Record<string, unknown> = {}
  if (opts.role && ['CLIENT', 'SPECIALIST', 'ADMIN'].includes(opts.role)) where.role = opts.role
  if (opts.status === 'suspended') where.suspended = true
  else if (opts.status === 'active') where.suspended = false

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (opts.page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ])

  return {
    rows: users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      suspended: u.suspended,
      registered: new Date(u.createdAt).toLocaleDateString('ru-RU'),
    })),
    page: opts.page,
    totalPages: Math.ceil(totalCount / ADMIN_PAGE_SIZE),
    totalCount,
    hasFilters: Boolean(opts.role || opts.status),
  }
}

/** Paginated/filtered admin gigs (reuses the existing where/skip/take/PAGE_SIZE logic). */
export async function getAdminGigs(opts: {
  status?: string
  closed?: string
  page: number
}): Promise<AdminListData<AdminGigRow>> {
  const where: Record<string, unknown> = {}
  if (opts.status && ['OPEN', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'].includes(opts.status))
    where.status = opts.status
  if (opts.closed === 'true') where.closedByAdmin = true
  else if (opts.closed === 'false') where.closedByAdmin = false

  const [gigs, totalCount] = await Promise.all([
    prisma.gig.findMany({
      where,
      skip: (opts.page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.gig.count({ where }),
  ])

  return {
    rows: gigs.map((g) => ({
      id: g.id,
      title: g.title,
      status: g.status,
      closed: g.closedByAdmin,
      budget: money(g.budget),
      created: new Date(g.createdAt).toLocaleDateString('ru-RU'),
    })),
    page: opts.page,
    totalPages: Math.ceil(totalCount / ADMIN_PAGE_SIZE),
    totalCount,
    hasFilters: Boolean(opts.status || opts.closed),
  }
}
