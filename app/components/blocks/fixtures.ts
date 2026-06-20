/**
 * Domain-block fixtures — typed sample view-models, one per block (and per variant axis).
 * Pure data: NO Prisma / server-action / lib imports. Consumed by the render tests now and the
 * component-workbench (#8) next. Blocks render entirely from these before any Phase 1 model exists.
 */
import type {
  GigCardVM,
  GigHeaderVM,
  ProfileCardVM,
  ProfileHeaderVM,
  TagListVM,
  CategoryTagsVM,
  ExperienceListVM,
  ClientCardVM,
  StatPanelVM,
  LedgerTableVM,
  DisputeListVM,
  DisputeDetailVM,
  BannerCardVM,
  RequirementCardVM,
  CriteriaListVM,
  TermsTabsVM,
  ConditionsPanelVM,
  ApplyPanelVM,
  MessageBubbleVM,
  ChatHeaderVM,
  BioVM,
  ConversationItemVM,
  NotificationItemVM,
  MessagesPanelVM,
  ChatPanelVM,
  SidebarNavVM,
  TopbarVM,
  FilterBarVM,
  Status,
  AttentionCardVM,
  AttentionType,
  ToggleFieldVM,
  CheckFieldVM,
  SessionRowVM,
  FileChipVM,
  SectionHeaderVM,
  JobExperienceCardVM,
  OnboardingCardVM,
  AuthHeaderVM,
} from "./view-models";

const STATUSES: Status[] = ["open", "review", "in-progress", "verification", "completed", "rejected"];

// GigCard — all 6 statuses × both layouts (12 fixtures).
export const gigCardFixtures: GigCardVM[] = STATUSES.flatMap((status, i) =>
  (["grid", "list"] as const).map((layout) => ({
    id: `${status}-${layout}`,
    title: `Лендинг для финтех-стартапа ${i + 1}`,
    category: "design",
    tags: ["React", "TypeScript"],
    status,
    budget: "300 400 ₽",
    deadlineDays: 14,
    rating: { value: 5, count: 12, verified: true },
    clientName: "ООО Ромашка",
    isCurrent: status === "in-progress",
    layout,
  })),
);
export const gigCardFixture: GigCardVM = gigCardFixtures[0];

export const gigHeaderFixture: GigHeaderVM = {
  title: "Лендинг для финтех-стартапа",
  status: "open",
  budget: "300 400 ₽",
  deadlineDays: 14,
  category: "design",
  tags: ["React", "TypeScript"],
  postedAt: "12 июня 2026",
  description: "Нужен современный лендинг с акцентом на конверсию и адаптивную вёрстку.",
};

export const profileCardFixture: ProfileCardVM = {
  avatar: "",
  name: "Анна Смирнова",
  roleTag: "Frontend Engineer",
  rating: { value: 5, count: 34, verified: true, online: true },
};

export const profileHeaderFixture: ProfileHeaderVM = {
  avatar: "",
  name: "Анна Смирнова",
  roleTag: "Senior Frontend Engineer",
  verified: true,
  memberSince: "июнь 2024",
  location: "Москва",
  stats: [
    { label: "Гигов выполнено", value: 47 },
    { label: "Рейтинг", value: "4.9" },
    { label: "На платформе", value: "2 года" },
  ],
};

export const tagListFixture: TagListVM = {
  title: "Стек",
  tags: [
    { label: "Python" },
    { label: "Parsing" },
    { label: "Anti-captcha" },
    { label: "Node.js" },
    { label: "WebSocket" },
    { label: "Профилирование" },
  ],
};

export const categoryTagsFixture: CategoryTagsVM = {
  title: "Избранные категории",
  categories: [
    { slug: "marketing", label: "Маркетинг", favorite: true },
    { slug: "design", label: "Дизайн", favorite: true },
    { slug: "programming", label: "Программирование", favorite: true },
    { slug: "development", label: "Разработка", favorite: false },
    { slug: "coding", label: "Кодинг", favorite: false },
  ],
};

export const experienceListFixture: ExperienceListVM = {
  title: "Опыт",
  bio: "Специализируюсь на создании сложных SPA и высоконагруженных интерфейсов. Глубоко понимаю экосистему React.",
  entries: [
    {
      company: "Yandex",
      title: "Senior Frontend Developer",
      period: "2021 — Наст. время",
      description: "Разработка интерфейсов облачной платформы Yandex Cloud. Оптимизация консоли управления.",
    },
    {
      company: "Вконтакте",
      title: "Middle Frontend Developer",
      period: "2018 — 2021",
      description: 'Работа над разделом "Сообщества". Внедрение дизайн-системы VKUI.',
    },
  ],
};

export const clientCardFixture: ClientCardVM = {
  avatar: "",
  name: "ООО Ромашка",
  rating: { value: 4, count: 18, verified: true },
  meta: [
    { key: "Гигов опубликовано", value: "23" },
    { key: "Город", value: "Санкт-Петербург" },
  ],
};

export const statPanelFixture: StatPanelVM = {
  stats: [
    { label: "В работе", value: 3 },
    { label: "Завершено", value: 47 },
    { label: "Заработано", value: "1 240 000 ₽" },
  ],
};

export const ledgerTableFixture: LedgerTableVM = {
  entries: [
    { date: "2026-04-01T10:00:00.000Z", label: "Лендинг для финтех-стартапа", amount: "300 400 ₽", status: "completed" },
    { date: "2026-03-18T10:00:00.000Z", label: "Миграция на PostgreSQL", amount: "180 000 ₽", status: "completed" },
  ],
  balance: "480 400 ₽",
};

export const ledgerTableEmptyFixture: LedgerTableVM = {
  entries: [],
  balance: "0 ₽",
};

export const disputeListFixture: DisputeListVM = {
  disputes: [
    { id: "d1", gig: "Лендинг для финтех-стартапа", status: "open", opener: "Иван Петров" },
    { id: "d2", gig: "Миграция на PostgreSQL", status: "completed", opener: "ООО Ромашка" },
  ],
};

export const disputeListEmptyFixture: DisputeListVM = {
  disputes: [],
};

export const toggleListFixture: { key: string; label: string; checked: boolean }[] = [
  { key: "notifyApplications", label: "Отклики", checked: true },
  { key: "notifyStatusChanges", label: "Изменения статуса", checked: true },
  { key: "notifyMessages", label: "Сообщения", checked: false },
];

export const dataTableFixture: { columns: string[]; rows: { id: string; cells: string[] }[] } = {
  columns: ["Email", "Роль", "Статус"],
  rows: [
    { id: "u1", cells: ["ivan@example.com", "SPECIALIST", "Активен"] },
    { id: "u2", cells: ["ooo@example.com", "CLIENT", "Заблокирован"] },
  ],
};

export const disputeDetailFixture: DisputeDetailVM = {
  id: "d1",
  gig: "Лендинг для финтех-стартапа",
  opener: "Иван Петров",
  openerRole: "specialist",
  amount: "150 000 ₽",
  reason: "Результат не соответствует ТЗ",
  evidence: ["ТЗ.pdf", "переписка.png"],
  timeline: [
    { authorRole: "specialist", authorName: "Иван Петров", text: "Объём работ значительно вырос относительно исходного описания.", at: "10.06.2026" },
  ],
  status: "open",
  resolution: "",
  resolvedBy: null,
};

export const roleCardsFixture: { value: "CLIENT" | "SPECIALIST" | null } = { value: "CLIENT" };

export const disputeDetailResolvedFixture: DisputeDetailVM = {
  id: "d2",
  gig: "Миграция на PostgreSQL",
  opener: "ООО Ромашка",
  openerRole: "company",
  amount: "200 000 ₽",
  reason: "Результат не соответствует ТЗ",
  evidence: [],
  timeline: [
    { authorRole: "company", authorName: "ООО Ромашка", text: "Работа не соответствует согласованным критериям приёмки.", at: "08.06.2026" },
    { authorRole: "moderator", authorName: "Модератор", text: "В пользу заказчика — бюджет возвращён.", at: "09.06.2026" },
  ],
  status: "completed",
  resolution: "Спор разрешён в пользу заказчика; бюджет возвращён.",
  resolvedBy: "admin@gigly.ru",
};

export const bannerCardFixture: BannerCardVM = {
  headline: "Найдите сильного специалиста за часы, а не недели",
  body: "Структурированные гиги и проверенные Middle+/Senior специалисты.",
  cta: { label: "Создать гиг", href: "/gigs/new" },
  // art: residual (cosmic raster, §7.2) — left undefined → token glow placeholder renders.
};

export const createGigCtaFixture = { label: "Создать гиг", href: "/gigs/new" };

export const searchPanelFixture = { placeholder: "Найти проект", actionLabel: "Найти проект" };

export const resultCountFixture = { count: 42, label: "Найдено" };

export const requirementCardFixture: RequirementCardVM = {
  title: "Определение готовности",
  body: "Адаптивный лендинг на Next.js, lighthouse ≥ 90, передача исходников в Figma.",
  icon: "verified",
};

export const criteriaListFixture: CriteriaListVM = {
  items: [
    { label: "Data Fetching", description: "Серверные компоненты для тяжёлых выборок; Client Components только для интерактива." },
    { label: "Lighthouse Performance ≥ 90", description: "LCP/FCP в зелёной зоне на мобильном профиле." },
    { label: "Передача исходников", description: "Репозиторий + краткая записка по архитектуре." },
  ],
};

export const sectionHeaderFixture: SectionHeaderVM = { title: "Стек", count: 6 };
export const onboardingCardFixtures: OnboardingCardVM[] = [
  { title: "Заполните профиль", subtitle: "Добавьте стек и технологии", progress: 40, cta: { label: "Заполнить профиль" } },
  { title: "Как это работает", subtitle: "Короткий гайд по платформе", progress: 0, cta: { label: "Смотреть" } },
];
export const onboardingCardFixture: OnboardingCardVM = onboardingCardFixtures[0];
export const authHeaderFixtures: AuthHeaderVM[] = [
  { heading: "Создайте свой аккаунт", subtitle: "Выберите свою роль в Gigly.", step: 0, totalSteps: 3, showLogomark: true },
  { heading: "Создайте свой аккаунт", subtitle: "Введите свои учётные данные.", step: 1, totalSteps: 3, showLogomark: true },
  { heading: "Настройте свой аккаунт", subtitle: "Введите данные.", step: 2, totalSteps: 3 },
];
export const authHeaderFixture: AuthHeaderVM = authHeaderFixtures[0];
export const jobExperienceCardFixtures: JobExperienceCardVM[] = experienceListFixture.entries;
export const jobExperienceCardFixture: JobExperienceCardVM = experienceListFixture.entries[0];

export const termsTabsFixture: TermsTabsVM = {
  proposed: [
    { label: "Бюджет", value: "300 400 ₽" },
    { label: "Срок", value: "14 дней" },
  ],
  client: [
    { label: "Бюджет", value: "280 000 ₽" },
    { label: "Срок", value: "10 дней" },
  ],
};

export const conditionsPanelFixture: ConditionsPanelVM = {
  company: "Acme Corp",
  status: { label: "На рассмотрении", tone: "review" },
  client: { deadline: "10 дней", budget: "280 000 ₽" },
  proposed: { deadline: "14 дней", budget: "300 400 ₽" },
  deadlineNote: "1 этап",
  budgetNote: "фикс. цена",
  fee: { service: "28 000 ₽", total: "308 000 ₽" },
};

export const applyPanelFixture: ApplyPanelVM = {
  submitLabel: "Откликнуться",
  fields: [
    { name: "approach", label: "Технический подход", placeholder: "Как вы решите задачу…", required: true, multiline: true },
    { name: "questions", label: "Уточняющие вопросы", placeholder: "Что нужно прояснить…", required: true, multiline: true },
    { name: "estimate", label: "Оценка трудозатрат", placeholder: "напр. 12 дней" },
  ],
};

export const messageBubbleFixtures: MessageBubbleVM[] = [
  { direction: "in", author: "ООО Ромашка", timestamp: "10:24", body: "Здравствуйте! Когда сможете приступить?", date: "1 апреля 2026 г." },
  { direction: "out", author: "Анна Смирнова", timestamp: "10:26", body: "Привет! Готова начать завтра.", readState: "read", date: "1 апреля 2026 г." },
];

export const chatHeaderFixture: ChatHeaderVM = {
  avatar: "",
  name: "Vercel",
  verified: true,
  rating: { value: 5, count: 45, verified: true },
  presence: "был(-а) недавно",
  counterparty: "specialist",
  specialty: "[Senior Frontend Engineer]",
};

// Bio block — the 4 variants (sizeFor × user). Specialist shows `Специальность`; company omits it.
export const bioSpecialistFixture: BioVM = {
  avatar: "",
  name: "Тимур Камальтдинов",
  verified: true,
  rating: { value: 5, count: 45, verified: true },
  specialty: "[Senior Frontend Engineer]",
  presence: "был(-а) недавно",
  sizeFor: "acc-bio",
  user: "specialist",
};
export const bioCompanyFixture: BioVM = {
  avatar: "",
  name: "ООО Ромашка",
  verified: true,
  rating: { value: 4, count: 12, verified: true },
  sizeFor: "acc-bio",
  user: "company",
};
export const bioGigFixture: BioVM = {
  avatar: "",
  name: "Иван Петров",
  verified: false,
  rating: { value: 4, count: 8, verified: false },
  specialty: "[Backend]",
  sizeFor: "gig",
  user: "specialist",
};

export const conversationItemFixtures: ConversationItemVM[] = [
  { id: "c1", avatar: "", name: "ООО Ромашка", subtitle: "Лендинг для финтех-стартапа", preview: "Когда сможете приступить?", timestamp: "10:24", unread: 2, status: "in-progress" },
  { id: "c2", avatar: "", name: "Иван Петров", subtitle: "Миграция на PostgreSQL", preview: "Спасибо, всё отлично!", timestamp: "вчера", unread: 0, status: "verification" },
];

export const notificationItemFixtures: NotificationItemVM[] = [
  { id: "n1", type: "application", body: "Новый отклик на ваш гиг «Лендинг»", timestamp: "5 мин назад", read: false },
  { id: "n2", type: "status", body: "Работа принята заказчиком", timestamp: "2 ч назад", read: false },
  { id: "n3", type: "message", body: "Новое сообщение от ООО Ромашка", timestamp: "вчера", read: true },
];

export const messagesPanelFixture: MessagesPanelVM = {
  conversations: conversationItemFixtures,
};

export const chatPanelFixture: ChatPanelVM = {
  thread: messageBubbleFixtures,
  composer: { canAttach: true },
  header: chatHeaderFixture,
};

const clientNav = (collapsed: boolean): SidebarNavVM => ({
  role: "client",
  collapsed,
  profile: profileCardFixture,
  items: [
    { icon: "dashboard", label: "Дашборд", href: "/dashboard", active: true },
    { icon: "my-gigs", label: "Мои гиги", href: "/my-gigs", count: 4, active: false },
    { icon: "chats", label: "Чаты", href: "/chats", count: 2, active: false },
    { icon: "finances", label: "Финансы", href: "/finances", active: false },
    { icon: "disputes", label: "Споры", href: "/disputes", active: false },
  ],
});

const specialistNav = (collapsed: boolean): SidebarNavVM => ({
  role: "specialist",
  collapsed,
  profile: profileCardFixture,
  items: [
    { icon: "dashboard", label: "Дашборд", href: "/dashboard", active: true },
    { icon: "search", label: "Поиск", href: "/gigs", active: false },
    { icon: "my-gigs", label: "Мои гиги", href: "/my-gigs", count: 3, active: false },
    { icon: "chats", label: "Чаты", href: "/chats", count: 5, active: false },
    { icon: "finances", label: "Финансы", href: "/finances", active: false },
    { icon: "disputes", label: "Споры", href: "/disputes", active: false },
  ],
});

export const sidebarNavClientExpanded: SidebarNavVM = clientNav(false);
export const sidebarNavSpecialistCollapsed: SidebarNavVM = specialistNav(true);

export const topbarFixture: TopbarVM = {
  profile: profileCardFixture,
  unreadNotifications: 3,
};

export const filterBarFixture: FilterBarVM = {
  query: "",
  view: "grid",
  filters: [
    { value: "react", label: "React", count: 42, active: true },
    { value: "python", label: "Python", count: 18 },
    { value: "design", label: "Дизайн", count: 27 },
  ],
};

// ---- AttentionCard (per-type) + settings/chat composites -----------------
const attentionGigEmbed: GigCardVM = { ...gigCardFixtures.find((g) => g.layout === "grid")! };
const ATTENTION_SAMPLE: Record<AttentionType, { marker: string; title: string; cta: string }> = {
  "status-change": { marker: "👀", title: "Новый статус", cta: "К проекту" },
  message: { marker: "💬", title: "Новые сообщения", cta: "Ответить" },
  deadline: { marker: "⏳", title: "Скоро дедлайн", cta: "Сдать" },
  accepted: { marker: "🤝", title: "Заявка принята", cta: "Приступить" },
  rejected: { marker: "⛔", title: "Заявка отклонена", cta: "Найти проекты" },
  payment: { marker: "💰", title: "Получена оплата", cta: "Оставить отзыв" },
};
export const attentionCardFixtures: AttentionCardVM[] = (
  Object.keys(ATTENTION_SAMPLE) as AttentionType[]
).map((type) => ({
  type,
  marker: ATTENTION_SAMPLE[type].marker,
  title: ATTENTION_SAMPLE[type].title,
  date: "1 нед.",
  cta: ATTENTION_SAMPLE[type].cta,
  embed:
    type === "message"
      ? { kind: "message", name: "Кристина", preview: "Можете прислать файл ТЗ и ссылку на макет?", unread: 5 }
      : { kind: "gig", gig: { ...attentionGigEmbed, status: type === "rejected" ? "rejected" : "in-progress" } },
}));
export const attentionCardFixture: AttentionCardVM = attentionCardFixtures[0];

export const toggleFieldFixture: ToggleFieldVM = {
  title: "Категория уведомлений",
  description: "Уведомления о новых заявках и сообщениях",
  checked: true,
};

export const checkFieldFixture: CheckFieldVM = {
  options: [
    { key: "all", label: "Все уведомления" },
    { key: "important", label: "Только важные" },
  ],
  value: "important",
};

export const sessionRowFixtures: SessionRowVM[] = [
  { state: "Default", title: "Chrome · Windows", description: "Москва · 2 часа назад" },
  { state: "active", title: "Текущая сессия", description: "Этот браузер" },
  { state: "delete", title: "Удалить аккаунт", description: "Удаление аккаунта необратимо. Все данные будут стёрты." },
];

export const fileChipFixtures: FileChipVM[] = [
  { name: "ТЗ.doc", size: "15 MB" },
  { name: "Макет.fig", size: "8 MB" },
];
export const fileChipFixture: FileChipVM = fileChipFixtures[0];
