/**
 * Production seed — the MINIMAL dataset a public deployment should start with.
 *
 * Only what the product genuinely needs before real users generate their own data:
 *   - the 5 canonical categories,
 *   - one clearly-labelled demo owner account,
 *   - the 5 "example" gigs (isExample) that the create-gig screen links to,
 *   - an admin account (password from ADMIN_PASSWORD env, else the shared demo hash).
 *
 * NO fake companies, specialists, applications, messages, disputes — those live only in the full
 * dev seed (prisma/seed.ts), which this file deliberately does not touch. The container entrypoint
 * runs THIS file by default and only runs the full seed when SEED_DEMO=true.
 *
 * Idempotent: every write is an upsert keyed by a stable id/slug/email, so re-running is safe.
 */
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';

// Same precomputed bcrypt hash for "TestPass123" used by the dev seed — the demo owner is loginable
// for showcasing, but owns nothing sensitive (a CLIENT can only manage its own gigs).
const DEFAULT_PASSWORD_HASH = '$2b$10$NitKVLl3OVhiFXU0UGhMWuU0ruyHM0PwObvjqEwZblQ4/TftsOAgm';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter: adapter as any });

const CATEGORIES = [
  { slug: 'marketing', name: 'Маркетинг', order: 0, color: 'blue' },
  { slug: 'design', name: 'Дизайн', order: 1, color: 'rose' },
  { slug: 'programming', name: 'Программирование', order: 2, color: 'green' },
  { slug: 'development', name: 'Разработка', order: 3, color: 'teal' },
  { slug: 'coding', name: 'Кодинг', order: 4, color: 'orange' },
];

// The 5 example gigs — copied verbatim from the dev seed so the "примеры оформления" links resolve
// to identically-worded, well-formed gigs. All owned by the single demo account below.
const EXAMPLE_GIGS = [
  {
    id: 'example-gig-backend-api',
    title: 'REST API для системы управления пользователями',
    description: 'Требуется разработать RESTful API для управления пользователями в корпоративном приложении. API должен поддерживать CRUD операции (создание, чтение, обновление, удаление пользователей), аутентификацию через JWT токены, и ролевую модель доступа с тремя уровнями: admin, manager, user. Каждая роль имеет свой набор разрешений. Ожидается чистый, хорошо структурированный код с использованием современных практик разработки. Обязательно покрытие тестами не менее 80% для всех критических путей. API должен быть готов к продакшену: с обработкой ошибок, валидацией входных данных, логированием запросов.',
    goal: 'Создать надежный и масштабируемый API для управления пользователями с поддержкой аутентификации и авторизации.',
    deliverables: '1. REST API с эндпоинтами для CRUD операций над пользователями\n2. JWT-аутентификация с access и refresh tokens\n3. Middleware для проверки ролей и разрешений\n4. OpenAPI/Swagger документация\n5. Unit и integration тесты (покрытие 80%+)\n6. README с инструкциями по запуску и развертыванию',
    constraints: 'Стек: Node.js + Express или Fastify, PostgreSQL, TypeScript. Срок: 2-3 недели. Код должен следовать ESLint правилам проекта. Использовать Prisma ORM для работы с БД.',
    acceptanceCriteria: 'API успешно проходит все автоматические тесты. Swagger документация доступна по /api-docs и полностью описывает все эндпоинты. Все эндпоинты возвращают корректные HTTP статусы (200, 201, 400, 401, 403, 404, 500) и JSON в едином формате. JWT токены работают корректно: access token истекает через 15 минут, refresh token через 7 дней. Middleware проверяет роли и блокирует неавторизованный доступ. Код проходит code review без критических замечаний.',
    budget: 18000000,
    tags: 'Node.js,TypeScript,PostgreSQL,REST API,JWT',
  },
  {
    id: 'example-gig-frontend-dashboard',
    title: 'React дашборд с визуализацией данных',
    description: 'Необходимо разработать интерактивный дашборд для отображения бизнес-метрик и аналитики. Дашборд должен включать несколько типов графиков (линейные, столбчатые, круговые), таблицы с сортировкой и фильтрацией, карточки с ключевыми показателями. Данные загружаются через REST API. Требуется адаптивная верстка для работы на десктопах и планшетах. Важна производительность: дашборд должен плавно работать с датасетами до 10,000 записей. Использовать современные библиотеки для визуализации данных.',
    goal: 'Создать удобный и производительный дашборд для визуализации бизнес-метрик с интуитивным интерфейсом.',
    deliverables: '1. React компоненты дашборда с переиспользуемой архитектурой\n2. Интеграция с 2-3 библиотеками визуализации (Chart.js, Recharts или аналоги)\n3. Адаптивная верстка (desktop, tablet)\n4. Фильтры и сортировка данных\n5. Storybook с примерами компонентов\n6. Unit тесты для бизнес-логики',
    constraints: 'Стек: React 18+, TypeScript, Tailwind CSS. Можно использовать Recharts или Chart.js для графиков. Срок: 2 недели. Код должен быть типизирован, без any.',
    acceptanceCriteria: 'Дашборд корректно отображает все типы графиков с реальными данными из API. Фильтры и сортировка работают без багов. Верстка адаптивная и не ломается на экранах от 768px до 1920px. Производительность: рендеринг 5000 записей занимает не более 2 секунд. Все компоненты задокументированы в Storybook. Код проходит TypeScript проверку без ошибок. Покрытие тестами критической логики не менее 70%.',
    budget: 15000000,
    tags: 'React,TypeScript,Tailwind CSS,Data Visualization',
  },
  {
    id: 'example-gig-devops-cicd',
    title: 'CI/CD pipeline для Node.js приложения',
    description: 'Требуется настроить полноценный CI/CD pipeline для Node.js приложения с автоматическим тестированием, сборкой и деплоем. Pipeline должен запускаться при каждом push в main ветку и при создании pull request. Включает: запуск линтеров, unit и integration тестов, сборку Docker образа, деплой на staging окружение, и опционально на production после ручного подтверждения. Нужна настройка мониторинга деплоев и уведомлений в Telegram при успехе/ошибке. Документация по процессу деплоя обязательна.',
    goal: 'Автоматизировать процесс тестирования, сборки и деплоя приложения для ускорения релизов и снижения человеческих ошибок.',
    deliverables: '1. GitHub Actions workflow файлы для CI/CD\n2. Dockerfile и docker-compose.yml для приложения\n3. Скрипты деплоя на staging и production\n4. Настройка уведомлений в Telegram\n5. Документация по процессу деплоя и rollback\n6. Secrets management через GitHub Secrets',
    constraints: 'Платформа: GitHub Actions. Хостинг: VPS с Docker. Срок: 1.5-2 недели. Использовать существующую инфраструктуру (доступы будут предоставлены).',
    acceptanceCriteria: 'Pipeline успешно запускается при push в main и при создании PR. Все этапы (lint, test, build, deploy) выполняются последовательно. При ошибке на любом этапе pipeline останавливается и отправляет уведомление. Docker образ собирается и пушится в registry. Деплой на staging происходит автоматически, на production - после manual approval. Время выполнения полного pipeline не более 10 минут. Документация содержит инструкции по rollback и troubleshooting.',
    budget: 17000000,
    tags: 'DevOps,CI/CD,Docker,GitHub Actions,Node.js',
  },
  {
    id: 'example-gig-db-optimization',
    title: 'Оптимизация производительности PostgreSQL',
    description: 'Наше приложение испытывает проблемы с производительностью базы данных PostgreSQL. Некоторые запросы выполняются более 5 секунд, что критично для пользовательского опыта. Требуется провести аудит текущей схемы БД, найти узкие места, оптимизировать медленные запросы, добавить необходимые индексы, и при необходимости предложить рефакторинг схемы. База содержит около 2 млн записей в основных таблицах. Нужен детальный отчет с результатами до и после оптимизации, включая EXPLAIN ANALYZE для ключевых запросов.',
    goal: 'Улучшить производительность базы данных минимум в 3 раза для критичных запросов и снизить нагрузку на сервер.',
    deliverables: '1. Аудит текущей схемы БД с выявлением проблем\n2. Оптимизированные SQL запросы\n3. Новые индексы (с обоснованием)\n4. Рекомендации по рефакторингу схемы (если нужно)\n5. Отчет с метриками до/после (время выполнения, EXPLAIN ANALYZE)\n6. Скрипты миграций для применения изменений',
    constraints: 'СУБД: PostgreSQL 14+. Срок: 1-2 недели. Нельзя менять API приложения. Миграции должны быть обратимыми (rollback). Доступ к staging БД будет предоставлен.',
    acceptanceCriteria: 'Медленные запросы (>5 сек) ускорены минимум в 3 раза. Все новые индексы обоснованы через EXPLAIN ANALYZE. Миграции протестированы на staging и не вызывают downtime. Отчет содержит конкретные цифры: время выполнения до/после, использование индексов, план запросов. Нет регрессий: существующие быстрые запросы не замедлились. Документация включает рекомендации по мониторингу производительности в будущем.',
    budget: 16000000,
    tags: 'PostgreSQL,Database,Performance,SQL,Optimization',
  },
  {
    id: 'example-gig-e2e-testing',
    title: 'E2E тесты с Playwright для веб-приложения',
    description: 'Необходимо создать инфраструктуру для end-to-end тестирования веб-приложения с использованием Playwright. Требуется покрыть тестами основные пользовательские сценарии: регистрация, авторизация, создание и редактирование сущностей, работа с формами, навигация по приложению. Тесты должны быть стабильными (не flaky), запускаться в CI/CD pipeline, и генерировать отчеты с скриншотами при падении. Нужна документация по написанию новых тестов и best practices. Настроить запуск тестов в headless режиме и с UI для локальной разработки.',
    goal: 'Создать надежную систему E2E тестирования для автоматической проверки критичных пользовательских сценариев.',
    deliverables: '1. Playwright конфигурация и setup\n2. 15-20 E2E тестов для основных сценариев\n3. Page Object Model для переиспользования кода\n4. Интеграция с CI/CD (GitHub Actions)\n5. HTML отчеты с скриншотами и видео при ошибках\n6. Документация по написанию и запуску тестов',
    constraints: 'Фреймворк: Playwright. Язык: TypeScript. Срок: 2-3 недели. Тесты должны работать в Chrome, Firefox, Safari. Время выполнения всех тестов не более 15 минут.',
    acceptanceCriteria: 'Все 15-20 тестов успешно проходят на staging окружении. Тесты стабильны: 3 последовательных запуска без падений. Page Object Model реализован для всех основных страниц. Тесты интегрированы в CI/CD и запускаются автоматически. При падении теста генерируется скриншот и видео. HTML отчет содержит детальную информацию о каждом тесте. Документация включает примеры написания новых тестов и troubleshooting guide. Код тестов проходит линтер без ошибок.',
    budget: 19000000,
    tags: 'Playwright,E2E Testing,TypeScript,QA,Automation',
  },
];

const inferCategory = (tags: string): string => {
  const t = (tags || '').toLowerCase();
  if (/design|ui|ux|figma|дизайн/.test(t)) return 'design';
  if (/docker|kubernet|devops|ci\/cd|playwright|test|automation/.test(t)) return 'coding';
  if (/react|vue|angular|frontend|tailwind|next|flutter|mobile|swift|android/.test(t)) return 'development';
  if (/python|go|node|java|backend|api|postgres|database|sql|rust|kotlin|php/.test(t)) return 'programming';
  return 'marketing';
};

async function main() {
  console.log('Starting PRODUCTION seed (minimal: categories + examples)...\n');

  // --- Categories ---
  for (const c of CATEGORIES) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: { name: c.name, order: c.order, color: c.color }, create: c });
  }
  console.log(`  ✓ Categories: ${CATEGORIES.length}`);

  // --- Admin (password from ADMIN_PASSWORD env, else the shared demo hash) ---
  const adminHash = process.env.ADMIN_PASSWORD ? await bcrypt.hash(process.env.ADMIN_PASSWORD, 10) : DEFAULT_PASSWORD_HASH;
  await prisma.user.upsert({
    where: { email: 'admin@gigly.ru' },
    update: {},
    create: { email: 'admin@gigly.ru', password: adminHash, role: 'ADMIN' },
  });
  console.log(`  ✓ Admin: admin@gigly.ru${process.env.ADMIN_PASSWORD ? ' (password from ADMIN_PASSWORD)' : ' (default demo password — see DEPLOY.md)'}`);

  // --- Single labelled demo owner for the example gigs ---
  const demoOwner = await prisma.user.upsert({
    where: { email: 'demo@gigly.ru' },
    update: {
      clientProfile: {
        upsert: {
          create: { companyName: 'Gigly · Демонстрация', contactPerson: 'Демо-аккаунт', phoneNumber: '+7 (495) 000-00-00' },
          update: { companyName: 'Gigly · Демонстрация', contactPerson: 'Демо-аккаунт', phoneNumber: '+7 (495) 000-00-00' },
        },
      },
    },
    create: {
      email: 'demo@gigly.ru',
      password: DEFAULT_PASSWORD_HASH,
      role: 'CLIENT',
      clientProfile: {
        create: { companyName: 'Gigly · Демонстрация', contactPerson: 'Демо-аккаунт', phoneNumber: '+7 (495) 000-00-00' },
      },
    },
  });
  console.log('  ✓ Demo owner: demo@gigly.ru (Gigly · Демонстрация)');

  // --- Example gigs (owned by the demo account) ---
  for (const g of EXAMPLE_GIGS) {
    const serviceFee = Math.floor(g.budget * 0.1);
    const totalAmount = g.budget + serviceFee;
    await prisma.gig.upsert({
      where: { id: g.id },
      update: { clientId: demoOwner.id, serviceFee, totalAmount },
      create: {
        id: g.id,
        title: g.title,
        description: g.description,
        goal: g.goal,
        deliverables: g.deliverables,
        constraints: g.constraints,
        acceptanceCriteria: g.acceptanceCriteria,
        budget: g.budget,
        serviceFee,
        totalAmount,
        tags: g.tags,
        status: 'OPEN',
        isExample: true,
        clientId: demoOwner.id,
      },
    });
  }
  console.log(`  ✓ Example gigs: ${EXAMPLE_GIGS.length}`);

  // --- Assign category + deadline/stages to any gig still missing them (idempotent) ---
  const uncategorized = await prisma.gig.findMany({ where: { categorySlug: null }, select: { id: true, tags: true } });
  for (const g of uncategorized) {
    await prisma.gig.update({ where: { id: g.id }, data: { categorySlug: inferCategory(g.tags) } });
  }
  const noDeadline = await prisma.gig.findMany({ where: { deadlineDays: 0 }, select: { id: true } });
  let i = 0;
  for (const g of noDeadline) {
    await prisma.gig.update({ where: { id: g.id }, data: { deadlineDays: 7 + (i % 24), stageCount: 1 + (i % 4) } });
    i++;
  }
  console.log(`  ✓ Categorised ${uncategorized.length} gigs, set deadlines on ${noDeadline.length} gigs`);

  console.log('\n=== PRODUCTION SEED COMPLETED ===');
}

main()
  .catch((e) => {
    console.error('Error during production seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
