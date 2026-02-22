import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// ============================================================================
// Russian Test Data Arrays
// ============================================================================

const RUSSIAN_NAMES = [
  'Александр Петров',
  'Мария Иванова',
  'Дмитрий Соколов',
  'Екатерина Волкова',
  'Сергей Смирнов',
  'Анна Козлова',
  'Михаил Новиков',
  'Ольга Морозова',
  'Андрей Васильев',
  'Елена Павлова',
  'Николай Федоров',
  'Татьяна Семенова',
  'Владимир Егоров',
  'Наталья Кузнецова',
  'Алексей Попов',
  'Ирина Лебедева',
  'Игорь Соловьев',
  'Светлана Орлова',
  'Павел Макаров',
  'Юлия Захарова',
  'Константин Борисов',
  'Виктория Романова',
]

const RUSSIAN_COMPANIES = [
  'ООО "ТехноСтарт"',
  'ООО "Цифровые Решения"',
  'ООО "Инновационные Системы"',
  'ООО "Веб Технологии"',
  'ООО "Софт Девелопмент"',
  'ООО "Код Мастер"',
  'ООО "Айти Сервис"',
  'ООО "Дата Аналитика"',
  'ООО "Облачные Решения"',
  'ООО "Мобильные Приложения"',
  'ООО "Системная Интеграция"',
  'ООО "Разработка Плюс"',
  'ООО "Технологический Прорыв"',
  'ООО "Цифровая Трансформация"',
  'ООО "Смарт Солюшнс"',
]

const RUSSIAN_INNS = [
  '7743013902',
  '7707083893',
  '5004002123',
  '7728563182',
  '7736207543',
  '5029102597',
  '7702070139',
  '7725114488',
]

const RUSSIAN_GIG_TITLES = [
  'Разработка REST API для мобильного приложения',
  'Настройка CI/CD pipeline на GitLab',
  'Рефакторинг legacy кода на TypeScript',
  'Интеграция платежной системы',
  'Оптимизация производительности базы данных',
  'Разработка административной панели',
  'Настройка мониторинга и логирования',
  'Миграция с MongoDB на PostgreSQL',
  'Разработка микросервиса авторизации',
  'Настройка Docker контейнеризации',
  'Разработка системы уведомлений',
  'Интеграция с внешним API',
  'Разработка дашборда аналитики',
  'Настройка Kubernetes кластера',
  'Разработка чат-бота для Telegram',
  'Оптимизация фронтенд производительности',
  'Разработка системы кэширования',
  'Настройка автоматического тестирования',
  'Разработка модуля отчетности',
  'Интеграция с CRM системой',
  'Разработка API для мобильного приложения',
  'Настройка системы резервного копирования',
]

const RUSSIAN_GIG_DESCRIPTIONS = [
  'Необходимо разработать REST API с полной документацией. Требуется поддержка аутентификации через JWT и валидация входных данных.',
  'Проект требует настройки автоматического деплоя на production сервер. Нужна интеграция с GitLab CI и Docker.',
  'Имеется legacy код на JavaScript, который необходимо перевести на TypeScript с сохранением всей функциональности.',
  'Требуется интегрировать платежную систему для приема онлайн платежей. Необходима поддержка различных способов оплаты.',
  'База данных работает медленно при больших объемах данных. Нужна оптимизация запросов и индексов.',
  'Необходима разработка административной панели для управления пользователями и контентом сайта.',
  'Требуется настроить систему мониторинга приложения и централизованное логирование для отслеживания ошибок.',
  'Проект использует MongoDB, но требуется миграция на PostgreSQL с сохранением всех данных.',
  'Необходимо выделить функционал авторизации в отдельный микросервис с REST API.',
  'Требуется контейнеризация приложения с помощью Docker для упрощения деплоя.',
  'Нужна система push-уведомлений для веб и мобильных приложений с поддержкой различных каналов.',
  'Требуется интеграция с внешним API для получения данных. Необходима обработка ошибок и retry логика.',
  'Необходима разработка дашборда с графиками и таблицами для визуализации бизнес-метрик.',
  'Требуется настройка Kubernetes для оркестрации контейнеров и автоматического масштабирования.',
  'Нужен Telegram бот для автоматизации рутинных задач с интеграцией в существующую систему.',
]

const RUSSIAN_MESSAGES = [
  'Добрый день! Уточните, пожалуйста, требования к производительности API.',
  'Работа завершена, результаты в ветке feature/api-refactor.',
  'Есть вопрос по архитектуре: какую базу данных планируете использовать?',
  'Отправил pull request на ревью. Жду обратной связи.',
  'Нужна дополнительная информация по интеграции с внешним сервисом.',
  'Готов приступить к работе. Когда можем обсудить детали?',
  'Обнаружил проблему с текущей реализацией. Предлагаю альтернативный подход.',
  'Тесты написаны и проходят успешно. Можно деплоить на staging.',
  'Уточните, пожалуйста, дедлайн по проекту.',
  'Документация обновлена согласно внесенным изменениям.',
  'Требуется доступ к production серверу для настройки.',
  'Провел код ревью, есть несколько замечаний.',
  'Миграция базы данных прошла успешно, данные сохранены.',
  'Настроил CI/CD pipeline, автоматический деплой работает.',
  'Есть предложение по оптимизации текущего решения.',
]

const RUSSIAN_APPROACHES = [
  'Буду использовать архитектуру REST с валидацией через Zod. Для аутентификации применю JWT токены с refresh механизмом. База данных PostgreSQL с Prisma ORM.',
  'Планирую настроить GitLab CI с multi-stage pipeline. Использую Docker для контейнеризации и Nginx для reverse proxy. Автоматические тесты на каждом коммите.',
  'Начну с анализа существующего кода и создания типов TypeScript. Постепенная миграция модуль за модулем с сохранением обратной совместимости.',
  'Интеграция через официальный SDK платежной системы. Реализую webhook для обработки callback уведомлений. Логирование всех транзакций.',
  'Проведу анализ медленных запросов через EXPLAIN. Добавлю необходимые индексы и оптимизирую N+1 проблемы. Настрою connection pooling.',
  'Использую React Admin для быстрой разработки. Реализую RBAC для разграничения прав доступа. REST API для всех операций CRUD.',
  'Настрою Prometheus для метрик и Grafana для визуализации. Централизованное логирование через ELK stack. Алерты в Telegram при критических ошибках.',
  'Создам скрипты миграции данных с валидацией. Сначала тестовый прогон на копии базы. Минимизирую downtime через blue-green deployment.',
  'Выделю авторизацию в отдельный сервис на Node.js. REST API с документацией OpenAPI. Redis для хранения сессий.',
  'Создам Dockerfile с multi-stage build для оптимизации размера образа. Docker Compose для локальной разработки. Настрою health checks.',
  'Реализую через WebSocket для real-time уведомлений. Fallback на polling для старых браузеров. Queue система для надежной доставки.',
  'Использую axios с retry логикой и exponential backoff. Кэширование ответов через Redis. Обработка rate limits и таймаутов.',
]

const RUSSIAN_QUESTIONS = [
  'Какие требования к производительности API? Ожидаемая нагрузка в RPS?',
  'Нужна ли документация API в формате OpenAPI или Swagger?',
  'Какая версия Node.js используется в проекте? Есть ли ограничения?',
  'Есть ли требования к покрытию кода тестами? Какой процент?',
  'Какой бюджет на инфраструктуру (сервера, облачные сервисы)?',
  'Нужна ли поддержка мобильных приложений для iOS и Android?',
  'Какие метрики важны для мониторинга? Что нужно отслеживать?',
  'Есть ли существующая CI/CD инфраструктура? Какие инструменты?',
  'Требуется ли поддержка нескольких языков интерфейса (i18n)?',
  'Какой уровень доступности требуется (99.9%, 99.99% или выше)?',
  'Нужна ли интеграция с системой аналитики? Какие метрики собирать?',
  'Какие требования к безопасности данных? Нужно ли шифрование?',
  'Есть ли ограничения по используемым технологиям и библиотекам?',
  'Требуется ли миграция существующих данных? Какой объем данных?',
  'Какой процесс code review принят в команде? Кто будет проверять?',
]

const RUSSIAN_EFFORTS = [
  '2 недели',
  '40 часов',
  '1 неделя',
  '3-4 дня',
  '80 часов',
  '10 рабочих дней',
  '1 месяц',
  '5-7 дней',
  '60 часов',
  '2-3 недели',
  '100 часов',
  '3 недели',
]

// ============================================================================
// Russian Data Generator Functions
// ============================================================================

/**
 * Generate random Russian person name
 */
export function generateRussianName(): string {
  return RUSSIAN_NAMES[Math.floor(Math.random() * RUSSIAN_NAMES.length)]
}

/**
 * Generate random Russian company name
 */
export function generateRussianCompany(): string {
  return RUSSIAN_COMPANIES[Math.floor(Math.random() * RUSSIAN_COMPANIES.length)]
}

/**
 * Generate random realistic INN (Individual Taxpayer Number)
 */
export function generateRussianINN(): string {
  return RUSSIAN_INNS[Math.floor(Math.random() * RUSSIAN_INNS.length)]
}

/**
 * Generate random Russian gig title
 */
export function generateRussianGigTitle(): string {
  return RUSSIAN_GIG_TITLES[Math.floor(Math.random() * RUSSIAN_GIG_TITLES.length)]
}

/**
 * Generate random Russian gig description
 */
export function generateRussianGigDescription(): string {
  return RUSSIAN_GIG_DESCRIPTIONS[Math.floor(Math.random() * RUSSIAN_GIG_DESCRIPTIONS.length)]
}

/**
 * Generate random Russian message content
 */
export function generateRussianMessage(): string {
  return RUSSIAN_MESSAGES[Math.floor(Math.random() * RUSSIAN_MESSAGES.length)]
}

/**
 * Generate random Russian technical approach
 */
export function generateRussianApproach(): string {
  return RUSSIAN_APPROACHES[Math.floor(Math.random() * RUSSIAN_APPROACHES.length)]
}

/**
 * Generate random Russian clarifying questions
 */
export function generateRussianQuestions(): string {
  return RUSSIAN_QUESTIONS[Math.floor(Math.random() * RUSSIAN_QUESTIONS.length)]
}

/**
 * Generate random Russian effort estimate
 */
export function generateRussianEffort(): string {
  return RUSSIAN_EFFORTS[Math.floor(Math.random() * RUSSIAN_EFFORTS.length)]
}

// ============================================================================
// Helper Functions
// ============================================================================

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
  }
) {
  const role = overrides?.role || 'CLIENT'
  const email = overrides?.email || generateUniqueEmail()
  const password = overrides?.password || 'TestPass123'
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
        companyName: overrides?.companyName || generateRussianCompany(),
        inn: overrides?.inn || generateRussianINN(),
        kpp: overrides?.kpp || '',
        contactPerson: overrides?.contactPerson || '',
        phoneNumber: overrides?.phoneNumber || ''
      }
    }
  } else if (role === 'SPECIALIST') {
    userData.specialistProfile = {
      create: {
        displayName: overrides?.displayName || generateRussianName(),
        techStack: overrides?.techStack || 'React, TypeScript',
        experienceLevel: overrides?.experienceLevel || 'SENIOR',
        bio: overrides?.bio || ''
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

  const budget = overrides?.budget || 150000
  const serviceFee = overrides?.serviceFee || 15000
  const totalAmount = overrides?.totalAmount || 165000

  const gig = await tx.gig.create({
    data: {
      title: overrides?.title || generateRussianGigTitle(),
      description: overrides?.description || generateRussianGigDescription(),
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
      approach: overrides?.approach || generateRussianApproach(),
      questions: overrides?.questions || generateRussianQuestions(),
      estimatedEffort: overrides?.estimatedEffort || generateRussianEffort(),
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

/**
 * Create test message with sensible defaults
 * Automatically creates gig and sender if not provided
 */
export async function createTestMessage(
  tx: PrismaClient,
  overrides?: {
    gigId?: string
    senderId?: string
    content?: string
  }
) {
  // Create gig if not provided
  let gigId = overrides?.gigId
  if (!gigId) {
    const gig = await createTestGig(tx)
    gigId = gig.id
  }

  // Create sender if not provided
  let senderId = overrides?.senderId
  if (!senderId) {
    const sender = await createTestUser(tx, { role: 'CLIENT' })
    senderId = sender.id
  }

  const message = await tx.message.create({
    data: {
      gigId,
      senderId,
      content: overrides?.content || generateRussianMessage()
    },
    include: {
      gig: true,
      sender: true
    }
  })

  return message
}
