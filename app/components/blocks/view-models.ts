/**
 * Domain-block view-model contracts — DESIGN_SYSTEM_SPEC.md §5, verbatim.
 *
 * Each block declares a typed, SCHEMA-INDEPENDENT view-model: the shape of the data it *displays*,
 * never a Prisma table. Blocks render from fixtures (app/components/blocks/fixtures.ts) before Phase 1
 * models exist; later Phase 1 changes (ratings-reviews-model, category-taxonomy, …) *fulfill* these
 * contracts without this layer depending on them.
 */
import type { Status, Category } from "@/app/components/primitives";

// Re-export the shared enums so blocks/fixtures import everything from one place.
export type { Status, Category };

// ---- scalar / enum aliases (schema-independent) -------------------------
export type DateISO = string; // ISO timestamp, formatted for display by the block
export type ImageRef = string; // asset path / URL (Avatar src etc.)
export type IconRef = string; // an ICON registry key or asset path
export type Money = string; // pre-formatted display value, e.g. "300 400 ₽"
export type NotifType = "application" | "status" | "message";

export interface RatingVM {
  value: number;
  count: number;
  verified: boolean;
  online?: boolean;
}
export interface StatVM {
  label: string;
  value: string | number;
  /** Optional muted caption line under the value (e.g. «комиссия Gigly 10%») — finance tiles. */
  caption?: string;
}
export interface KeyVal {
  key: string;
  value: string;
}
export interface FilterOptVM {
  value: string;
  label: string;
  active?: boolean;
  count?: number;
}
export interface FieldVM {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  value?: string;
}
export interface TermRow {
  label: string;
  value: string;
}

// ---- Cards & profile ----------------------------------------------------
export interface GigCardVM {
  id: string;
  title: string;
  category: Category;
  tags: string[];
  status: Status;
  budget: Money;
  /** Numeric budget in roubles (for client-side budget filtering/sorting on the dashboard & my-gigs feeds). */
  budgetValue?: number;
  deadlineDays: number;
  rating: { value: number; count: number; verified: boolean };
  clientName?: string;
  /** Company (заказчик) name for the card bio row — design GigCard. */
  company?: string;
  /** Gig brief (2-line clamp) — design GigCard. */
  description?: string;
  /** Relative post time ("2 мин", "1 ч") — design GigCard top-right. */
  postedAt?: string;
  /** Timeline strip (design GigCard): start/end dates + progress width ("45%"). */
  timeline?: { start: string; end: string; progress: string };
  isCurrent?: boolean;
  layout: "grid" | "list";
}
export interface GigHeaderVM {
  title: string;
  status: Status;
  budget: Money;
  deadlineDays: number;
  category: Category;
  tags: string[];
  postedAt: DateISO;
  /** The gig brief body — the prototype `main` block renders it under the tag row (срок/бюджет live in the
   *  conditions panel, so `main` carries the description, not the budget/deadline meta row). */
  description?: string;
}
export interface ProfileHeaderVM {
  avatar: ImageRef;
  name: string;
  roleTag: string;
  verified: boolean;
  memberSince: DateISO;
  location?: string;
  /** transport-settings — the «Часовой пояс» preference, rendered as a (GMT…) label under the header. */
  timezone?: string;
  online?: boolean;
  stats: StatVM[];
}
export interface TagListVM {
  title: string; // «Стек»
  tags: { label: string; color?: Category }[];
}
export interface CategoryTagsVM {
  title: string; // «Избранные категории»
  categories: { slug: Category; label: string; favorite: boolean }[];
}
export interface ExperienceListVM {
  title: string; // «Опыт»
  bio?: string;
  entries: JobExperienceCardVM[];
}
/** A work-experience entry (Figma `job experience` 3088:3896). */
export interface JobExperienceCardVM {
  company: string;
  title?: string; // role line
  period: string;
  description?: string;
}
/** Section heading (Figma `H/H1/BLOCK` 3371:5248) — type/h1 (24 mono) + optional icon/count. */
export interface SectionHeaderVM {
  title: string;
  icon?: IconRef;
  count?: number;
}
export interface ProfileCardVM {
  avatar: ImageRef;
  name: string;
  roleTag?: string;
  rating?: RatingVM;
}
export interface ClientCardVM {
  avatar: ImageRef;
  name: string;
  rating: RatingVM;
  meta?: KeyVal[];
}
export interface StatPanelVM {
  stats: StatVM[];
}
export interface LedgerTableVM {
  entries: {
    date: DateISO;
    label: string;
    amount: Money;
    status: Status;
    /** Optional counterparty line under the label (reconcile-finances-and-admin). */
    subtitle?: string;
    /** Optional status-badge label override (e.g. «Оплачено» for PAID, which has no design Status). */
    statusLabel?: string;
    /** Optional "r,g,b" dot/label colour override (e.g. the awaiting-payment green that isn't in STATUS_RGB). */
    statusColor?: string;
  }[];
  balance: Money;
}
export interface DisputeListVM {
  disputes: {
    id: string;
    gig: string;
    status: Status;
    opener: string;
    /** Design list row extras (reconcile-disputes): reason · opener · created + the gig amount. */
    reason?: string;
    amount?: Money;
    created?: string;
  }[];
}
/** The six DATA-MODEL dispute reasons (DisputeReason). SQLite stores the raw String; this is the typed contract. */
export type DisputeReason =
  | "Оплата не поступила"
  | "Результат не соответствует ТЗ"
  | "Заказчик не выходит на связь"
  | "Исполнитель не выходит на связь"
  | "Просрочен срок выполнения"
  | "Другое";

/** One entry in a dispute's timeline (DATA-MODEL DisputeEntry). */
export interface DisputeEntryVM {
  authorRole: "specialist" | "company" | "moderator";
  authorName: string;
  text: string;
  at: string;
}

export interface DisputeDetailVM {
  id: string;
  gig: string;
  /** «Контрагент» — the other party in the dispute, viewer-relative (disputeDetail.* header). */
  counterparty?: string;
  opener: string;
  openerRole: "specialist" | "company" | "";
  amount: Money;
  reason: DisputeReason | string;
  evidence: string[];
  timeline: DisputeEntryVM[];
  status: Status;
  resolution: string;
  resolvedBy?: string | null;
}

// ---- Navigation & shell -------------------------------------------------
export interface SidebarNavItemVM {
  icon: IconRef;
  label: string;
  href: string;
  count?: number;
  active: boolean;
}
export interface SidebarNavVM {
  role: "client" | "specialist";
  items: SidebarNavItemVM[];
  collapsed: boolean;
  profile: ProfileCardVM;
}
export interface TopbarVM {
  profile: ProfileCardVM;
  unreadNotifications: number;
}
export interface FilterBarVM {
  query?: string;
  filters: FilterOptVM[];
  view: "grid" | "list";
}

// ---- Messaging ----------------------------------------------------------
export interface MessageBubbleVM {
  /** Message id — delta-poll dedupe + optimistic reconcile (absent on legacy fixtures). */
  id?: string;
  direction: "in" | "out";
  author: string;
  timestamp: DateISO;
  body: string;
  readState?: "sent" | "read";
  /** Long-form day label (e.g. «1 апреля 2026 г.») — ChatPanel inserts a day separator when it changes. */
  date?: DateISO;
  /** ISO timestamp — the delta-poll cursor + ordering key (chat-realtime). */
  createdAt?: DateISO;
  /** Optimistic send state: pending = not yet confirmed by the server; failed = the send errored. */
  pending?: boolean;
  failed?: boolean;
}
/** Bio block (Figma `bio` 2931:2365 + `bio/message/COMPANY` 2931:2366 → one block). The identity row:
 *  avatar + name + verify-patch + stars + `Специальность`. `user: 'company'` omits the specialty. */
export interface BioVM {
  avatar: ImageRef;
  name: string;
  verified?: boolean;
  rating?: RatingVM;
  specialty?: string; // `Специальность` — shown for specialists (omitted when user === 'company')
  presence?: string; // «был(-а) недавно»
  sizeFor?: "gig" | "acc-bio";
  user?: "specialist" | "company";
  /** Optional descriptive line under the identity row (the gig-detail conditions-bio companyDesc). */
  description?: string;
}

/**
 * ConditionsPanel block — the prototype gig-detail «УСЛОВИЯ» sunken panel (Gigly App.dc.html gigDetail col2):
 * a two-tab toggle (the gig's terms «Условия {company}» vs the specialist's «Мои условия») over a Статус row and
 * the Срок выполнения / Бюджет проекта figures rendered as large `grotesk` (Manrope) numerics with the «[N этап]» /
 * «фикс. цена» sublabels. For the company viewer the budget block additionally shows the Сервисный сбор (10%) /
 * Итого к оплате breakdown (`fee`). Schema-independent; figures arrive pre-formatted.
 */
export interface ConditionsTermsVM {
  deadline: string; // e.g. «14 дней»
  budget: Money;
}
export interface ConditionsPanelVM {
  /** Company name for the «Условия {company}» tab label. */
  company: string;
  /** The Статус row — a status tone + its label. */
  status: { label: string; tone: Status };
  /** Figures for the gig owner's terms tab («Условия {company}»). */
  client: ConditionsTermsVM;
  /** Figures for the specialist's counter-terms tab («Мои условия»). */
  proposed: ConditionsTermsVM;
  /** Срок sublabel, e.g. «1 этап» (from the gig's stage count). */
  deadlineNote?: string;
  /** Бюджет sublabel, e.g. «фикс. цена». */
  budgetNote?: string;
  /** Company-only fee breakdown — present ⇒ render Сервисный сбор + Итого (gated by the caller to the owner). */
  fee?: { service: Money; total: Money };
}

export interface ChatHeaderVM {
  avatar: ImageRef;
  name: string;
  verified: boolean;
  rating?: RatingVM;
  presence?: string; // «был(-а) недавно»
  specialty?: string; // counterparty `Специальность` (add-bio-block) — surfaced via the Bio block
  /** The counterparty's role (reconcile-chats) — drives the Bio `user` axis: a company collapses `Специальность`. */
  counterparty?: "specialist" | "company";
}
export interface ConversationItemVM {
  id: string;
  avatar: ImageRef;
  name: string;
  preview: string;
  timestamp: DateISO;
  unread: number;
  /** Optional secondary line under the name (e.g. the gig title). */
  subtitle?: string;
  /** Optional gig status badge (reconcile-chats) — the prototype conversation item shows the gig status. */
  status?: Status;
}
export interface NotificationItemVM {
  id: string;
  type: NotifType;
  body: string;
  timestamp: DateISO;
  read: boolean;
}
export interface MessagesPanelVM {
  conversations: ConversationItemVM[];
}
export interface ChatPanelVM {
  thread: MessageBubbleVM[];
  /** `canSend`=false → the gig is finished/closed (COMPLETED/PAID/closedByAdmin); the thread is read-only history. */
  composer: { canAttach: boolean; canSend: boolean; closedReason?: string };
  /** Optional thread header (counterparty) rendered above the thread. */
  header?: ChatHeaderVM;
}

// ---- Gig detail & onboarding -------------------------------------------
export interface RequirementCardVM {
  title: string;
  body: string;
  icon?: IconRef;
}
export interface CriteriaListVM {
  /** Figma `критерий` rows — numbered title (+ optional description). `met` is legacy/optional. */
  items: { label: string; description?: string; met?: boolean }[];
}
export interface TermsTabsVM {
  proposed: TermRow[];
  client: TermRow[];
}
export interface ApplyPanelVM {
  fields: FieldVM[];
  submitLabel: string;
}
export interface BannerCardVM {
  headline: string;
  body?: string;
  cta?: { label: string; href: string };
  art?: ImageRef;
}
/** Auth-flow HEADER lockup (Figma create-account/welcome nodes) — Logomark + heading/subtitle + AuthStepDots. */
export interface AuthHeaderVM {
  heading: string;
  subtitle?: string;
  /** 0-based index of the current wizard step. */
  step: number;
  /** Total steps in the flow (the dot counter length). */
  totalSteps: number;
  /** Lead with the brand mark (steps 1–2 per Figma; the welcome step omits it). */
  showLogomark?: boolean;
}

/** Dashboard onboarding tile (Figma welcome "pic" 3082:3820) — distinct from BannerCard. */
export interface OnboardingCardVM {
  title: string;
  subtitle?: string;
  progress: number; // 0–100
  cta: { label: string };
  /** Optional bleed image (residual — exported or omitted, not redrawn). */
  art?: ImageRef;
}

// ---- Attention card & settings/chat composites (reconcile-attention-card-and-settings-composites) ----
/** Notification-TYPE accents (DISTINCT from gig status) — drive the AttentionCard accent/glow. */
export type AttentionType =
  | "status-change"
  | "message"
  | "deadline"
  | "accepted"
  | "rejected"
  | "payment";
/** The block embedded inside an AttentionCard — a gig card (keeps its own gig-status styling) or a message preview. */
export type AttentionEmbed =
  | { kind: "gig"; gig: GigCardVM }
  | { kind: "message"; name: string; preview: string; unread: number };
export interface AttentionCardVM {
  type: AttentionType;
  /** Emoji/marker glyph shown in the type-coloured marker. */
  marker: string;
  title: string;
  date: string;
  cta: string;
  embed: AttentionEmbed;
}
export interface ToggleFieldVM {
  title: string;
  description?: string;
  checked: boolean;
}
export interface CheckFieldVM {
  /** Single-select list (Figma circle / check-circle) — maps to the radio-off/radio-on assets. */
  options: { key: string; label: string }[];
  value: string;
}
export type SessionState = "Default" | "active" | "delete";
export interface SessionRowVM {
  /** Session row id (reconcile-settings) — used to terminate a specific session. */
  id?: string;
  title: string;
  description?: string;
  state: SessionState;
}

/** ReadinessMeter (reconcile-create-gig) — the «Готовность брифа» panel: a ProgressBar + a 7-point checklist + a nudge. */
export interface ReadinessCheckVM {
  label: string;
  done: boolean;
}
export interface ReadinessMeterVM {
  pct: number; // 0–100
  tone: "amber" | "brand" | "green";
  checks: ReadinessCheckVM[];
  nudge?: string;
}

/** FeePanel (reconcile-create-gig) — the «Сводка (комиссия)» live summary: Бюджет → Сервисный сбор (10%) → Итого. */
export interface FeePanelVM {
  budget: Money;
  fee: Money;
  total: Money;
}

/** CriteriaEditor (reconcile-create-gig) — the «Готово, когда…» editor: the current criteria + the suggestion pills. */
export interface CriteriaEditorVM {
  items: string[];
  suggestions: string[];
}

/** ApplicantCard (build-applications-screen) — the company «Отклики» applicant card: identity + status + tech tags +
 *  Подход/Уточняющие вопросы/Оценка трудозатрат. The accept/reject forms are passed in as the block's `children`. */
export interface ApplicantCardVM {
  id: string;
  name: string;
  level?: string;
  verified?: boolean;
  rating: RatingVM;
  tags: string[];
  approach?: string;
  questions?: string;
  estimate?: string;
  status: { label: string; tone: Status };
  /** Whether the applicant is still PENDING (drives the accept/reject affordance in the screen). */
  pending: boolean;
}
export interface FileChipVM {
  name: string;
  size: string;
  /** Optional file-type icon. The Figma file-earmark glyph is a residual (route to Figma export). */
  icon?: IconRef;
}
