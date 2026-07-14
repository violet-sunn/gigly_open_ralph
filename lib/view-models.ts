import { prisma } from '@/lib/prisma'
import { getRatingForUser } from '@/lib/reviews'
import { CATEGORIES } from '@/lib/categories'
import { getLedger, getFinanceStats } from '@/lib/finances'
import { getDisputeList, getDisputeDetail } from '@/lib/disputes'
import { getPreferences, DEFAULT_PREFERENCES, type Preferences } from '@/lib/preferences'
import { timezoneLabel } from '@/lib/profiles'
import { formatUserAgent } from '@/lib/user-agent'
import { getRecentMessages } from '@/app/actions/message'
import { getNotificationDisplayText, getNotificationIcon } from '@/lib/notification-utils'
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
  OnboardingCardVM,
  AttentionCardVM,
  AttentionType,
  ConversationItemVM,
  ChatHeaderVM,
  BioVM,
  MessageBubbleVM,
  FilterBarVM,
  RequirementCardVM,
  CriteriaListVM,
  ClientCardVM,
  TermsTabsVM,
  ConditionsPanelVM,
  ChatPanelVM,
  ApplyPanelVM,
  SessionRowVM,
  ApplicantCardVM,
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

// Display Status → Russian label (mirrors blocks/util STATUS_LABEL) — for the conditions-panel Статус row.
const STATUS_LABEL_RU: Record<Status, string> = {
  open: 'Открыт',
  review: 'На рассмотрении',
  'in-progress': 'В работе',
  verification: 'На проверке',
  completed: 'Завершён',
  rejected: 'Отклонён',
}

/**
 * Display status (reconcile-data-model-to-design): «На рассмотрении» is a DERIVED display state — an OPEN gig that
 * has ≥1 application renders as `review` (amber), OPEN with 0 applications stays `open` (Открыт). The stored
 * Gig.status enum + the lifecycle are unchanged; this is read-time only. (`review` = На рассмотрении; REVIEW maps to
 * `verification` = На проверке.)
 */
export function gigDisplayStatus(status: string, applicationCount = 0): Status {
  if (status === 'OPEN' && applicationCount > 0) return 'review'
  return GIG_STATUS[status] ?? 'open'
}

type GigForCard = {
  id: string
  title: string
  categorySlug: string | null
  tags: string
  status: string
  budget: number
  deadlineDays: number
  assignedSpecialistId: string | null
  applicationCount?: number
  // Design GigCard fields (optional so existing callers compile; populated where available).
  description?: string
  createdAt?: Date
  clientCompany?: string
}

// Gig-status → timeline progress width (design GigCard's bottom bar — там, где «в работе» ≈ 45%).
const STATUS_PROGRESS: Record<string, string> = {
  OPEN: '8%',
  IN_PROGRESS: '45%',
  REVIEW: '80%',
  COMPLETED: '100%',
  PAID: '100%',
}
function gigTimeline(createdAt: Date, deadlineDays: number, status: string): { start: string; end: string; progress: string } {
  const start = new Date(createdAt)
  const end = new Date(start.getTime() + deadlineDays * 86400000)
  const fmt = (d: Date) => new Date(d).toLocaleDateString('ru-RU')
  return { start: fmt(start), end: fmt(end), progress: STATUS_PROGRESS[status] ?? '0%' }
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
    status: gigDisplayStatus(gig.status, gig.applicationCount ?? 0),
    budget: money(gig.budget),
    budgetValue: Math.round(gig.budget / 100), // roubles — for client-side filtering on the dashboard/my-gigs feeds
    deadlineDays: gig.deadlineDays,
    rating,
    company: gig.clientCompany,
    description: gig.description,
    postedAt: gig.createdAt ? relativeTime(gig.createdAt) : undefined,
    timeline: gig.createdAt ? gigTimeline(gig.createdAt, gig.deadlineDays, gig.status) : undefined,
    isCurrent: gig.status === 'IN_PROGRESS',
    layout,
  }
}

/** A GigCardVM carrying its raw lifecycle status, so the dashboard tabs can filter the grid client-side. */
export type ClientGigCard = GigCardVM & { rawStatus: string }

/** The two dashboard onboarding tiles (Figma WELCOME "pic" cards): a profile-completion tile + a how-it-works tile. */
const dashboardOnboarding = (completion: number): OnboardingCardVM[] => [
  { title: 'Заполните профиль', subtitle: 'Расскажите о себе, чтобы получать больше предложений', progress: completion, cta: { label: 'Заполнить профиль' } },
  { title: 'Как это работает', subtitle: 'Короткий гайд по платформе Gigly', progress: 0, cta: { label: 'Смотреть' } },
]

/** Notification event → AttentionCard type (the 6-colour notification accent map). */
const ATTENTION_TYPE: Record<string, AttentionType> = {
  application_submitted: 'status-change',
  application_accepted: 'accepted',
  application_rejected: 'rejected',
  application_withdrawn: 'status-change',
  work_submitted: 'status-change',
  work_approved: 'accepted',
  gig_updated: 'status-change',
  payment_marked: 'payment',
  dispute_opened: 'status-change',
  dispute_resolved: 'status-change',
}

/**
 * The dashboard notification strip (Figma «attention card» row): the user's recent Notifications (newest-first, cap
 * 6) mapped to AttentionCardVMs — `type` from the eventType accent map, glyph/title from the notification utils, and
 * the linked gig embedded as a GigCardVM (every notification carries a gig). Empty when the user has no notifications.
 */
export async function getDashboardAttention(userId: string): Promise<AttentionCardVM[]> {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    include: { gig: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })
  return Promise.all(
    notifications.map(async (n) => {
      const type: AttentionType =
        (n.eventType ? ATTENTION_TYPE[n.eventType] : undefined) ??
        (n.type === 'MESSAGE' ? 'message' : n.type === 'PAYMENT' ? 'payment' : 'status-change')
      return {
        type,
        marker: getNotificationIcon(n.type),
        title: getNotificationDisplayText(n),
        date: new Date(n.createdAt).toLocaleDateString('ru-RU'),
        cta: 'Открыть',
        embed: { kind: 'gig' as const, gig: await toGigCardVM(n.gig) },
      }
    }),
  )
}

export interface ClientDashboardData {
  completion: number
  greeting: string
  onboarding: OnboardingCardVM[]
  gigCards: ClientGigCard[]
  tabs: { value: string; label: string; count?: number }[]
  messages: MessagesPanelVM
}

/** Assemble the CLIENT dashboard data: profile completion %, the client's gigs as GigCards (+ tab counts), messages. */
export async function getClientDashboard(userId: string): Promise<ClientDashboardData> {
  const [user, gigs, recent] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, include: { clientProfile: true } }),
    prisma.gig.findMany({
      where: { clientId: userId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { applications: true } } },
    }),
    getRecentMessages(),
  ])

  const cp = user?.clientProfile
  const fields = [cp?.companyName, cp?.inn, cp?.kpp, cp?.contactPerson, cp?.phoneNumber]
  const filled = fields.filter((f) => f && f.trim() !== '').length
  const completion = Math.round((filled / fields.length) * 100)

  const gigCards: ClientGigCard[] = await Promise.all(
    // applicationCount drives the «На рассмотрении» derived status for the client's own OPEN gigs.
    gigs.map(async (g) => ({ ...(await toGigCardVM({ ...g, applicationCount: g._count.applications, clientCompany: cp?.companyName })), rawStatus: g.status })),
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

  const greeting = `Здравствуйте, ${cp?.companyName || user?.email || 'компания'}`

  return { completion, greeting, onboarding: dashboardOnboarding(completion), gigCards, tabs, messages: { conversations } }
}

/** A GigCardVM carrying the dashboard tab it belongs to, so the specialist dashboard tabs can filter the grid. */
export type SpecialistGigCard = GigCardVM & { tabKey: string }

export interface SpecialistDashboardData {
  completion: number
  greeting: string
  onboarding: OnboardingCardVM[]
  /** The 6× notification strip (Figma WELCOME-2) — specialist only; empty when there are no notifications. */
  attention: AttentionCardVM[]
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
  const [user, applications, assignedGigs, recent, attention] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, include: { specialistProfile: true } }),
    prisma.application.findMany({
      where: { specialistId: userId },
      include: { gig: { include: { client: { include: { clientProfile: true } } } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.gig.findMany({
      where: { assignedSpecialistId: userId, status: { in: ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] } },
      include: { client: { include: { clientProfile: true } } },
      orderBy: { updatedAt: 'desc' },
    }),
    getRecentMessages(),
    getDashboardAttention(userId),
  ])

  // Заявки — PENDING applications; the card reflects the pending application (→ 'review' / На рассмотрении).
  const pendingCards: SpecialistGigCard[] = await Promise.all(
    applications
      .filter((a) => a.status === 'PENDING')
      .map(async (a) => ({ ...(await toGigCardVM({ ...a.gig, clientCompany: a.gig.client?.clientProfile?.companyName })), status: 'review' as Status, tabKey: 'applications' })),
  )
  // Rejected/withdrawn — surfaced under Все only (status 'rejected' / Отклонён). Reconciliation: no data lost.
  const archivedCards: SpecialistGigCard[] = await Promise.all(
    applications
      .filter((a) => a.status === 'REJECTED' || a.status === 'WITHDRAWN' || a.status === 'WITHDRAWN_FINAL')
      .map(async (a) => ({ ...(await toGigCardVM({ ...a.gig, clientCompany: a.gig.client?.clientProfile?.companyName })), status: 'rejected' as Status, tabKey: 'archive' })),
  )
  // Assigned gigs — В работе / На проверке / Завершённые (standard toGigCardVM status mapping).
  const assignedCards: SpecialistGigCard[] = await Promise.all(
    assignedGigs.map(async (g) => ({
      ...(await toGigCardVM({ ...g, clientCompany: g.client?.clientProfile?.companyName })),
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

  const greeting = `Здравствуйте, ${sp?.displayName || user?.email || 'специалист'}`

  return {
    completion,
    greeting,
    onboarding: dashboardOnboarding(completion),
    attention,
    gigCards,
    tabs,
    messages: { conversations },
  }
}

// ---- «Мои гиги» (reconcile-my-projects) -----------------------------------

/** A GigCardVM carrying the «Мои гиги» tab it belongs to, so the screen can filter the grid client-side. */
export type MyGigCard = GigCardVM & { tabKey: string }

export interface MyGigsData {
  gigCards: MyGigCard[]
  tabs: { value: string; label: string; count?: number }[]
}

/**
 * «Мои гиги» (reconcile-my-projects) — the viewer's OWN gigs, role-aware, with the prototype's five status tabs
 * (Все / Заявки / В работе / На проверке / Завершённые, each with a count). CLIENT → posted gigs (Заявки = own OPEN
 * gigs that received applications → the derived «На рассмотрении»); SPECIALIST → PENDING applications (Заявки) +
 * assigned gigs (В работе / На проверке / Завершённые). Reuses toGigCardVM + gigDisplayStatus and the same queries the
 * dashboards use — no new gig semantics, no migration. Cards whose status maps to no tab (a CLIENT's OPEN gig with 0
 * applications) surface under «Все» only, so nothing is lost (the specialist-dashboard archive rule).
 */
export async function getMyGigs(viewer: { userId: string; role: string }): Promise<MyGigsData> {
  let gigCards: MyGigCard[]

  if (viewer.role === 'CLIENT') {
    const [me, gigs] = await Promise.all([
      prisma.user.findUnique({ where: { id: viewer.userId }, include: { clientProfile: true } }),
      prisma.gig.findMany({
        where: { clientId: viewer.userId },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { applications: true } } },
      }),
    ])
    const company = me?.clientProfile?.companyName
    gigCards = await Promise.all(
      gigs.map(async (g) => {
        const applicationCount = g._count.applications
        const card = await toGigCardVM({ ...g, applicationCount, clientCompany: company })
        const tabKey =
          g.status === 'OPEN'
            ? applicationCount > 0
              ? 'apps'
              : 'open'
            : g.status === 'IN_PROGRESS'
              ? 'in-progress'
              : g.status === 'REVIEW'
                ? 'verification'
                : 'completed' // COMPLETED | PAID
        return { ...card, tabKey }
      }),
    )
  } else {
    const [applications, assignedGigs] = await Promise.all([
      prisma.application.findMany({
        where: { specialistId: viewer.userId },
        include: { gig: { include: { client: { include: { clientProfile: true } } } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.gig.findMany({
        where: { assignedSpecialistId: viewer.userId, status: { in: ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] } },
        include: { client: { include: { clientProfile: true } } },
        orderBy: { updatedAt: 'desc' },
      }),
    ])
    // Заявки — PENDING applications (the card reflects the pending application → «На рассмотрении»).
    const pending: MyGigCard[] = await Promise.all(
      applications
        .filter((a) => a.status === 'PENDING')
        .map(async (a) => ({ ...(await toGigCardVM({ ...a.gig, clientCompany: a.gig.client?.clientProfile?.companyName })), status: 'review' as Status, tabKey: 'apps' })),
    )
    // Assigned gigs — В работе / На проверке / Завершённые (standard toGigCardVM status mapping).
    const assigned: MyGigCard[] = await Promise.all(
      assignedGigs.map(async (g) => ({
        ...(await toGigCardVM({ ...g, clientCompany: g.client?.clientProfile?.companyName })),
        tabKey: g.status === 'IN_PROGRESS' ? 'in-progress' : g.status === 'REVIEW' ? 'verification' : 'completed',
      })),
    )
    gigCards = [...pending, ...assigned]
  }

  const countBy = (key: string) => gigCards.filter((c) => c.tabKey === key).length
  const tabs = [
    { value: 'all', label: 'Все', count: gigCards.length },
    { value: 'apps', label: 'Заявки', count: countBy('apps') },
    { value: 'in-progress', label: 'В работе', count: countBy('in-progress') },
    { value: 'verification', label: 'На проверке', count: countBy('verification') },
    { value: 'completed', label: 'Завершённые', count: countBy('completed') },
  ]

  return { gigCards, tabs }
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
  gigs: (BrowseGig & { _count?: { applications: number } })[]
  count: number
  page: number
  totalPages: number
  perPage: number
  view: 'grid' | 'list'
  query: string
}): Promise<GigSearchData> {
  const gigCards = await Promise.all(
    // applicationCount drives the «На рассмотрении» derived status for OPEN gigs on browse.
    input.gigs.map((g) => toBrowseGigCardVM({ ...g, applicationCount: g._count?.applications ?? 0 }, input.view)),
  )
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

// ---- Company «Отклики» screen (build-applications-screen) ------------------

/** Application status → its display label + Status tone (mirrors the gig-detail APP_STATUS map). */
const APPLICATION_STATUS: Record<string, { label: string; tone: Status }> = {
  PENDING: { label: 'На рассмотрении', tone: 'review' },
  ACCEPTED: { label: 'Принят', tone: 'completed' },
  REJECTED: { label: 'Отклонён', tone: 'rejected' },
  WITHDRAWN: { label: 'Отозвано', tone: 'rejected' },
  WITHDRAWN_FINAL: { label: 'Отозвано', tone: 'rejected' },
}

export interface GigApplicationsData {
  gigId: string
  title: string
  count: number
  /** The accepted applicant's name when the gig is assigned (drives the «Назначен …» success notice). */
  assignedName?: string
  /** The gig's own terms (formatted) — shown alongside an applicant's counter so the client can compare. */
  gigBudget: string
  gigDeadline: string
  applicants: ApplicantCardVM[]
}

/**
 * The company «Отклики» screen data (build-applications-screen) — the gig-scoped applicants list. **Owner-gated**:
 * returns null unless the viewer is the CLIENT who owns the gig (the page then redirects). Reuses the gig-detail
 * applicant assembly (name/level/rating/tags/approach/questions/estimate) mapped to ApplicantCardVM. Server-only.
 */
export async function getGigApplications(
  gigId: string,
  viewer: { userId: string; role: string },
): Promise<GigApplicationsData | null> {
  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    include: {
      assignedSpecialist: { include: { specialistProfile: true } },
      applications: {
        include: { specialist: { include: { specialistProfile: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  if (!gig) return null
  if (!(viewer.role === 'CLIENT' && gig.clientId === viewer.userId)) return null // owner-gated

  const applicants: ApplicantCardVM[] = await Promise.all(
    gig.applications.map(async (a) => ({
      id: a.id,
      name: a.specialist.specialistProfile?.displayName || a.specialist.email,
      level: a.specialist.specialistProfile?.experienceLevel || undefined,
      verified: false,
      rating: await getRatingForUser(a.specialistId),
      tags: a.specialist.specialistProfile?.techStack
        ? a.specialist.specialistProfile.techStack.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      approach: a.approach || undefined,
      questions: a.questions || undefined,
      estimate: a.estimatedEffort || undefined,
      // Counter-terms (fix-terms-negotiation): surface the applicant's proposal so the client sees it before accepting.
      proposedBudget: a.proposedBudget != null ? money(a.proposedBudget) : undefined,
      proposedDeadline: a.proposedDeadlineDays != null ? `${a.proposedDeadlineDays} дней` : undefined,
      status: APPLICATION_STATUS[a.status] ?? { label: a.status, tone: 'open' as Status },
      pending: a.status === 'PENDING',
    })),
  )

  const assignedName = gig.assignedSpecialistId
    ? gig.assignedSpecialist?.specialistProfile?.displayName || gig.assignedSpecialist?.email || undefined
    : undefined

  return {
    gigId: gig.id,
    title: gig.title,
    count: gig.applications.length,
    assignedName,
    gigBudget: money(gig.budget),
    gigDeadline: `${gig.deadlineDays} дней`,
    applicants,
  }
}

export interface GigDetailData {
  gigId: string
  header: GigHeaderVM
  requirements: RequirementCardVM[]
  criteria: CriteriaListVM
  client: ClientCardVM
  bio: BioVM
  clientId: string
  terms: TermsTabsVM
  conditions: ConditionsPanelVM
  chat: ChatPanelVM
  apply: ApplyPanelVM
  isOwner: boolean
  isAssignedSpecialist: boolean
  isSpecialistViewer: boolean
  isExample: boolean
  closedByAdmin: boolean
  closedAt: string | null
  paidAt: string | null
  status: string
  viewerApplication: {
    id: string
    status: string
    freeWithdrawalUsed: boolean
    hasCounter: boolean
    /** The viewer's preserved counter (proposedBudget in ROUBLES, deadline in days) — pre-fills the re-apply form so
     *  «Мои условия» and the form agree; null when they proposed nothing. */
    proposedBudgetRub: number | null
    proposedDeadlineDays: number | null
  } | null
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
  // Re-application eligibility (fix-application-lifecycle): only a reversible WITHDRAWN row (or no row)
  // lets a specialist (re-)apply. PENDING/ACCEPTED = active; WITHDRAWN_FINAL/REJECTED = blocked.
  const canReapply = !myApp || myApp.status === 'WITHDRAWN'

  const fmt = (d: Date) => new Date(d).toLocaleDateString('ru-RU')
  const tagsArr = gig.tags ? gig.tags.split(',').map((t) => t.trim()).filter(Boolean) : []

  const header: GigHeaderVM = {
    title: gig.title,
    status: gigDisplayStatus(gig.status, gig.applications.length),
    budget: money(gig.budget),
    deadlineDays: gig.deadlineDays,
    category: (gig.categorySlug as Category | null) ?? 'development',
    tags: tagsArr,
    postedAt: fmt(gig.createdAt),
    description: gig.description,
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

  // The CONDITIONS company bio (add-bio-block): the gig owner as a company Bio (no `Специальность`).
  const bio: BioVM = {
    avatar: '',
    name: client.name,
    verified: client.rating.verified,
    rating: client.rating,
    user: 'company',
    sizeFor: 'acc-bio',
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

  // The prototype gig-detail «УСЛОВИЯ» panel: tabs (gig vs my terms) + Статус + grotesk Срок/Бюджет + (company-only)
  // fee breakdown. Срок/Бюджет mirror `terms`; the fee block is owner-only (`serviceFee`/`totalAmount` on the gig).
  const displayStatus = gigDisplayStatus(gig.status, gig.applications.length)
  const conditions: ConditionsPanelVM = {
    company: client.name,
    status: { label: STATUS_LABEL_RU[displayStatus], tone: displayStatus },
    client: { deadline: `${gig.deadlineDays} дней`, budget: money(gig.budget) },
    proposed: { deadline: `${proposedDeadline} дней`, budget: money(proposedBudget) },
    deadlineNote: `${gig.stageCount} этап`,
    budgetNote: 'фикс. цена',
    fee: isOwner ? { service: money(gig.serviceFee), total: money(gig.totalAmount) } : undefined,
  }

  // Read-only once the engagement is finished/closed — same terminal gate as getChatThread / persistMessage.
  const chatClosedReason = gig.closedByAdmin
    ? 'Гиг закрыт администратором — переписка доступна только для просмотра.'
    : gig.status === 'COMPLETED' || gig.status === 'PAID'
      ? 'Гиг завершён — переписка доступна только для просмотра.'
      : undefined
  const chat: ChatPanelVM = {
    thread: gig.messages.map((m) => ({
      direction: (m.senderId === viewer.userId ? 'out' : 'in') as 'in' | 'out',
      author: m.sender.clientProfile?.companyName || m.sender.specialistProfile?.displayName || m.sender.email,
      timestamp: new Date(m.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      body: m.content,
    })),
    composer: { canAttach: false, canSend: !chatClosedReason, closedReason: chatClosedReason },
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
    bio,
    clientId: gig.clientId,
    terms,
    conditions,
    chat,
    apply,
    isOwner,
    isAssignedSpecialist,
    isSpecialistViewer: viewer.role === 'SPECIALIST',
    isExample: gig.isExample,
    closedByAdmin: gig.closedByAdmin,
    closedAt: gig.closedAt ? new Date(gig.closedAt).toLocaleString('ru-RU') : null,
    paidAt: gig.paidAt ? fmt(gig.paidAt) : null,
    status: gig.status,
    viewerApplication: myApp
      ? {
          id: myApp.id,
          status: myApp.status,
          freeWithdrawalUsed: myApp.freeWithdrawalUsed,
          // hasCounter: the specialist proposed at least one differing term (drives the «Мои условия» no-counter note).
          hasCounter: myApp.proposedBudget != null || myApp.proposedDeadlineDays != null,
          proposedBudgetRub: myApp.proposedBudget != null ? myApp.proposedBudget / 100 : null,
          proposedDeadlineDays: myApp.proposedDeadlineDays ?? null,
        }
      : null,
    applications,
    lifecycle: {
      canApply:
        viewer.role === 'SPECIALIST' &&
        gig.status === 'OPEN' &&
        !gig.isExample &&
        !gig.closedByAdmin &&
        canReapply &&
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
  /** SPECIALIST only — the onboarding grade, displayed explicitly beside Стек/Опыт. '' = not set (renders nothing). */
  experienceLevel?: string
  realized: GigCardVM[] // SPECIALIST: COMPLETED/PAID assigned gigs (empty for CLIENT)
  /** CLIENT only — the company «Реквизиты» (design company profile). Carries the full editable set so the owner's
   * requisites modal can submit non-edited fields back to updateProfile's upsert without clobbering them. */
  company?: { companyName: string; inn: string; kpp: string; about: string; contactPerson: string; phoneNumber: string }
  rating: { value: number; count: number; verified: boolean }
  isOwner: boolean
  /** Owner-only raw snapshot of every field updateProfile reads, as strings (phoneVerified = 'true'/'false'). The
   * edit modals render hidden inputs for the fields they don't own so updateProfile's full-record upsert doesn't
   * blank them. Undefined for non-owners. */
  editFields?: Record<string, string>
}

const longDate = (d: Date): string =>
  new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

/** profile-experience-fixes — a user counts as "online" if the shell heartbeat touched `lastSeenAt`
 *  within this window (and they haven't hidden their status). Window > heartbeat interval (60s) so a
 *  live tab never flickers offline between pings. */
const ONLINE_WINDOW_MS = 5 * 60_000

/** Real presence: gated by the target's `showOnlineStatus`, true only when `lastSeenAt` is fresh. */
const isOnline = (u: { showOnlineStatus: boolean; lastSeenAt: Date | null }): boolean =>
  u.showOnlineStatus && u.lastSeenAt != null && Date.now() - new Date(u.lastSeenAt).getTime() < ONLINE_WINDOW_MS

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
  const online = isOnline(user) // real presence — gated by showOnlineStatus + fresh lastSeenAt

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
      timezone: sp.timezone ? timezoneLabel(sp.timezone) : undefined,
      online,
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

    const editFields = isOwner
      ? {
          displayName: sp.displayName,
          techStack: sp.techStack,
          experienceLevel: sp.experienceLevel,
          bio: sp.bio,
          avatarUrl: sp.avatarUrl,
          phoneNumber: sp.phoneNumber,
          phoneVerified: sp.phoneVerified ? 'true' : 'false',
          position: sp.position,
          specialization: sp.specialization,
          location: sp.location,
          timezone: sp.timezone,
        }
      : undefined

    return { role: 'SPECIALIST', header, stats: statsPlaceholder(), stack, categories, experience, experienceLevel: sp.experienceLevel, realized, rating, isOwner, editFields }
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
      timezone: cp.timezone ? timezoneLabel(cp.timezone) : undefined,
      online,
      stats: [
        { label: 'Рейтинг', value: ratingValue },
        { label: 'Опубликовано', value: published },
        { label: 'Завершено', value: completed },
      ],
    }

    return {
      role: 'CLIENT',
      header,
      stats: statsPlaceholder(),
      realized: [],
      company: {
        companyName: cp.companyName,
        inn: cp.inn,
        kpp: cp.kpp,
        about: cp.about,
        contactPerson: cp.contactPerson,
        phoneNumber: cp.phoneNumber,
      },
      rating,
      isOwner,
      editFields: isOwner
        ? {
            companyName: cp.companyName,
            inn: cp.inn,
            kpp: cp.kpp,
            about: cp.about,
            contactPerson: cp.contactPerson,
            phoneNumber: cp.phoneNumber,
            avatarUrl: cp.avatarUrl,
            phoneVerified: cp.phoneVerified ? 'true' : 'false',
            position: cp.position,
            location: cp.location,
            timezone: cp.timezone,
          }
        : undefined,
    }
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
        // The gig status badge (reconcile-chats) — these gigs are assigned (IN_PROGRESS+), so 0 applications matters not.
        status: gigDisplayStatus(g.status),
        _last: new Date(last.createdAt).getTime(),
      }
    })

  conversations.sort((a, b) => b._last - a._last)
  return conversations.map(({ _last, ...vm }) => vm)
}

/**
 * chat-realtime — map a Message row → MessageBubbleVM. Shared by getChatThread (initial thread) and getNewMessages
 * (delta poll) so the bubble shape is identical. Carries `id` + `createdAt` (ISO) for the client's dedupe + poll cursor.
 */
export function toMessageBubble(
  m: { id: string; senderId: string; content: string; createdAt: Date; sender?: { email: string } | null },
  viewerId: string,
): MessageBubbleVM {
  const out = m.senderId === viewerId
  return {
    id: m.id,
    direction: out ? 'out' : 'in',
    author: out ? 'Вы' : m.sender?.email ?? 'Собеседник',
    timestamp: timeOfDay(m.createdAt),
    date: longDate(m.createdAt),
    body: m.content,
    createdAt: new Date(m.createdAt).toISOString(),
  }
}

/**
 * chat-realtime — the delta-poll receive contract: messages of `gigId` newer than `afterIso`, ascending, capped. Applies
 * the SAME participant gate as getChatThread (gig must exist + viewer must be owner or assigned specialist) — returns []
 * otherwise, never exposing a non-participant's messages. Server-only.
 */
export async function getNewMessages(
  gigId: string,
  afterIso: string,
  viewer: { userId: string; role: string },
): Promise<MessageBubbleVM[]> {
  const after = new Date(afterIso)
  if (isNaN(after.getTime())) return []

  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    select: { clientId: true, assignedSpecialistId: true },
  })
  if (!gig) return []
  const isParticipant = gig.clientId === viewer.userId || gig.assignedSpecialistId === viewer.userId
  if (!isParticipant) return []

  const messages = await prisma.message.findMany({
    where: { gigId, createdAt: { gt: after } },
    orderBy: { createdAt: 'asc' },
    include: { sender: true },
    take: 200,
  })
  return messages.map((m) => toMessageBubble(m, viewer.userId))
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

  const thread: MessageBubbleVM[] = gig.messages.map((m) => toMessageBubble(m, viewer.userId))

  // Counterparty = the other party.
  const viewerIsClient = gig.clientId === viewer.userId
  const counterpartyId = viewerIsClient ? gig.assignedSpecialistId : gig.clientId
  const counterpartyName = viewerIsClient
    ? gig.assignedSpecialist?.specialistProfile?.displayName || gig.assignedSpecialist?.email || 'Специалист'
    : gig.client.clientProfile?.companyName || gig.client.email
  const counterpartyAvatar =
    (viewerIsClient ? gig.assignedSpecialist?.specialistProfile?.avatarUrl : gig.client.clientProfile?.avatarUrl) || ''
  const rating = counterpartyId ? await getRatingForUser(counterpartyId) : { value: 0, count: 0, verified: false }

  // Counterparty role drives the Bio `user` axis (reconcile-chats): a CLIENT viewer's counterparty is the assigned
  // specialist (show `Специальность`); a SPECIALIST viewer's counterparty is the company (collapse it). Specialty is
  // bound from the specialist's profile (position → specialization → experience level) — never fabricated.
  const sp = gig.assignedSpecialist?.specialistProfile
  const specialty = viewerIsClient ? sp?.position || sp?.specialization || sp?.experienceLevel || undefined : undefined

  const header: ChatHeaderVM = {
    avatar: counterpartyAvatar,
    name: counterpartyName,
    verified: rating.verified,
    rating,
    presence: 'был(-а) недавно',
    counterparty: viewerIsClient ? 'specialist' : 'company',
    specialty,
  }

  // Read-only once the engagement is finished/closed — mirrors the persistMessage gate so the composer isn't shown when
  // a send would be rejected. Active window is OPEN…REVIEW; COMPLETED/PAID/closedByAdmin are terminal.
  const closedReason = gig.closedByAdmin
    ? 'Гиг закрыт администратором — переписка доступна только для просмотра.'
    : gig.status === 'COMPLETED' || gig.status === 'PAID'
      ? 'Гиг завершён — переписка доступна только для просмотра.'
      : undefined
  const canSend = !closedReason

  return { header, chat: { thread, composer: { canAttach: false, canSend, closedReason }, header } }
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
  const d = await getDisputeDetail(id, viewer)
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
  /** «Активные сессии» (reconcile-settings) — the viewer's sessions, current marked `active`. */
  sessions: SessionRowVM[]
  /** transport-settings — «Часовой пояс»: the profile-level timezone preference (same value the profile shows). */
  timezone: string
  /** transport-settings — «Имя» (Учетные данные): displayName (SPECIALIST) / contactPerson|companyName (CLIENT). */
  name: string
}

/** Relative «last active» label for a session row (e.g. «только что», «5 мин назад», «3 ч назад», «2 дн назад»). */
function relativeTime(d: Date): string {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(d).getTime()) / 60000))
  if (mins < 1) return 'только что'
  if (mins < 60) return `${mins} мин назад`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} ч назад`
  return `${Math.floor(hours / 24)} дн назад`
}

/**
 * The viewer's active sessions → SessionRowVM[] (reconcile-settings). The current session (its id === the JWT `sid`)
 * renders `active`; the others render `Default` with a terminate action. Title = the device parsed from the user-agent;
 * description = the relative last-active time. Location is intentionally omitted (no geo backend — not fabricated).
 */
export async function getActiveSessions(userId: string, currentSid?: string): Promise<SessionRowVM[]> {
  const rows = await prisma.session.findMany({ where: { userId }, orderBy: { lastActiveAt: 'desc' } })
  return rows.map((s) => ({
    id: s.id,
    title: formatUserAgent(s.userAgent),
    description: relativeTime(s.lastActiveAt),
    state: (s.id === currentSid ? 'active' : 'Default') as SessionRowVM['state'],
  }))
}

/**
 * Assemble the /settings data (reconcile-settings): the user's account preferences (locale + notification + privacy
 * toggles) + the viewer's email (for the delete-account confirm) + the «Активные сессии» list. A thin aggregator over
 * lib/preferences + the Session backend — no re-derivation. Falls back to the default preferences if the user row is
 * missing. Server-only.
 */
export async function getSettings(viewer: { userId: string; email: string; sid?: string }): Promise<SettingsData> {
  const [prefs, sessions, profileRow] = await Promise.all([
    getPreferences(viewer.userId),
    getActiveSessions(viewer.userId, viewer.sid),
    prisma.user.findUnique({
      where: { id: viewer.userId },
      select: {
        specialistProfile: { select: { displayName: true, timezone: true } },
        clientProfile: { select: { contactPerson: true, companyName: true, timezone: true } },
      },
    }),
  ])
  const sp = profileRow?.specialistProfile
  const cp = profileRow?.clientProfile
  const timezone = sp?.timezone || cp?.timezone || ''
  const name = sp?.displayName || cp?.contactPerson || cp?.companyName || ''
  return { prefs: prefs ?? DEFAULT_PREFERENCES, email: viewer.email, sessions, timezone, name }
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
  /** Client company name (or email) — shown under the gig title in the console «Гиги» rows (dashboard.admin). */
  client: string
}
export interface AdminListData<T> {
  rows: T[]
  page: number
  totalPages: number
  totalCount: number
  hasFilters: boolean
}

/** Admin dashboard stats (the four platform counts) as a StatPanelVM. Reuses the existing counts. */
/** A rendered moderation-log row for the admin «Журнал модерации» (reconcile-finances-and-admin). */
export interface AdminLogRow {
  id: string
  action: string
  actor: string
  at: string
}
export interface AdminDashboardData {
  stats: StatPanelVM
  /** The OPEN dispute queue («Споры на модерации») — rows link to /disputes/[id] to resolve. */
  disputes: DisputeListVM
  /** Recent moderation-log entries («Журнал модерации»), newest first. */
  log: AdminLogRow[]
  /** Top users/gigs for the consolidated console «Пользователи»/«Гиги» panels (full lists at /admin/users · /admin/gigs). */
  users: AdminUserRow[]
  gigs: AdminGigRow[]
}

/** Russian labels for the moderation-log action codes (incl. RESOLVE_DISPUTE from the disputes flow). */
const MODERATION_ACTION_LABEL: Record<string, string> = {
  SUSPEND_USER: 'Заблокирован пользователь',
  UNSUSPEND_USER: 'Разблокирован пользователь',
  CLOSE_GIG: 'Закрыт гиг',
  RESOLVE_DISPUTE: 'Спор разрешён',
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const [totalUsers, totalGigs, suspendedUsers, closedGigs, disputes, logEntries, usersList, gigsList] = await Promise.all([
    prisma.user.count(),
    prisma.gig.count(),
    prisma.user.count({ where: { suspended: true } }),
    prisma.gig.count({ where: { closedByAdmin: true } }),
    getDisputeList({ status: 'OPEN' }), // the «Споры на модерации» queue
    prisma.moderationLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { admin: true } }),
    getAdminUsers({ page: 1 }),
    getAdminGigs({ page: 1 }),
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
    disputes,
    log: logEntries.map((l) => ({
      id: l.id,
      action: MODERATION_ACTION_LABEL[l.action] ?? l.action,
      actor: l.admin?.email ?? '—',
      at: new Date(l.createdAt).toLocaleString('ru-RU'),
    })),
    users: usersList.rows.slice(0, 6),
    gigs: gigsList.rows.slice(0, 6),
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
      include: { client: { include: { clientProfile: true } } },
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
      client: g.client?.clientProfile?.companyName || g.client?.email || '',
    })),
    page: opts.page,
    totalPages: Math.ceil(totalCount / ADMIN_PAGE_SIZE),
    totalCount,
    hasFilters: Boolean(opts.status || opts.closed),
  }
}
