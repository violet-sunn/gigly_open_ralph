import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

// Pre-computed bcrypt hash for "TestPass123" (rounds: 10)
// Generated with: await bcrypt.hash('TestPass123', 10)
const DEFAULT_PASSWORD_HASH = '$2b$10$NitKVLl3OVhiFXU0UGhMWuU0ruyHM0PwObvjqEwZblQ4/TftsOAgm';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});

const prisma = new PrismaClient({
  adapter: adapter as any,
});

async function main() {
  console.log('Starting seed...\n');

  // ========================================
  // Foundation CLIENT Users
  // ========================================

  const client1 = await prisma.user.upsert({
    where: { email: 'ivan.petrov@techcorp.ru' },
    update: {
      clientProfile: {
        upsert: {
          create: {
            companyName: 'ТехКорп',
            inn: '7701234567',
            kpp: '770101001',
            contactPerson: 'Иван Петров',
            phoneNumber: '+7 (495) 123-45-67',
          },
          update: {
            companyName: 'ТехКорп',
            inn: '7701234567',
            kpp: '770101001',
            contactPerson: 'Иван Петров',
            phoneNumber: '+7 (495) 123-45-67',
          },
        },
      },
    },
    create: {
      email: 'ivan.petrov@techcorp.ru',
      password: DEFAULT_PASSWORD_HASH,
      role: 'CLIENT',
      clientProfile: {
        create: {
          companyName: 'ТехКорп',
          inn: '7701234567',
          kpp: '770101001',
          contactPerson: 'Иван Петров',
          phoneNumber: '+7 (495) 123-45-67',
        },
      },
    },
  });
  console.log('Created CLIENT user: ivan.petrov@techcorp.ru');

  const client2 = await prisma.user.upsert({
    where: { email: 'maria.sokolova@digitalpro.ru' },
    update: {
      clientProfile: {
        upsert: {
          create: {
            companyName: 'ДиджиталПро',
            inn: '7702345678',
            kpp: '770201001',
            contactPerson: 'Мария Соколова',
            phoneNumber: '+7 (495) 234-56-78',
          },
          update: {
            companyName: 'ДиджиталПро',
            inn: '7702345678',
            kpp: '770201001',
            contactPerson: 'Мария Соколова',
            phoneNumber: '+7 (495) 234-56-78',
          },
        },
      },
    },
    create: {
      email: 'maria.sokolova@digitalpro.ru',
      password: DEFAULT_PASSWORD_HASH,
      role: 'CLIENT',
      clientProfile: {
        create: {
          companyName: 'ДиджиталПро',
          inn: '7702345678',
          kpp: '770201001',
          contactPerson: 'Мария Соколова',
          phoneNumber: '+7 (495) 234-56-78',
        },
      },
    },
  });
  console.log('Created CLIENT user: maria.sokolova@digitalpro.ru');

  // ========================================
  // Foundation SPECIALIST Users
  // ========================================

  const alexey = await prisma.user.upsert({
    where: { email: 'alexey.ivanov@mail.ru' },
    update: {
      specialistProfile: {
        upsert: {
          create: {
            displayName: 'Алексей Иванов',
            techStack: 'React, TypeScript, Next.js, Tailwind CSS',
            experienceLevel: 'SENIOR',
            bio: 'Senior фронтенд-разработчик с 8 годами опыта. Специализируюсь на React и TypeScript.',
            hourlyRate: 600000,
          },
          update: {
            displayName: 'Алексей Иванов',
            techStack: 'React, TypeScript, Next.js, Tailwind CSS',
            experienceLevel: 'SENIOR',
            bio: 'Senior фронтенд-разработчик с 8 годами опыта. Специализируюсь на React и TypeScript.',
            hourlyRate: 600000,
          },
        },
      },
    },
    create: {
      email: 'alexey.ivanov@mail.ru',
      password: DEFAULT_PASSWORD_HASH,
      role: 'SPECIALIST',
      specialistProfile: {
        create: {
          displayName: 'Алексей Иванов',
          techStack: 'React, TypeScript, Next.js, Tailwind CSS',
          experienceLevel: 'SENIOR',
          bio: 'Senior фронтенд-разработчик с 8 годами опыта. Специализируюсь на React и TypeScript.',
          hourlyRate: 600000,
        },
      },
    },
  });
  console.log('Created SPECIALIST user: alexey.ivanov@mail.ru');

  const dmitry = await prisma.user.upsert({
    where: { email: 'dmitry.volkov@yandex.ru' },
    update: {
      specialistProfile: {
        upsert: {
          create: {
            displayName: 'Дмитрий Волков',
            techStack: 'Python, Django, PostgreSQL, Redis',
            experienceLevel: 'MIDDLE',
            bio: 'Middle бэкенд-разработчик. Работаю с Python и Django более 5 лет.',
            hourlyRate: 450000,
          },
          update: {
            displayName: 'Дмитрий Волков',
            techStack: 'Python, Django, PostgreSQL, Redis',
            experienceLevel: 'MIDDLE',
            bio: 'Middle бэкенд-разработчик. Работаю с Python и Django более 5 лет.',
            hourlyRate: 450000,
          },
        },
      },
    },
    create: {
      email: 'dmitry.volkov@yandex.ru',
      password: DEFAULT_PASSWORD_HASH,
      role: 'SPECIALIST',
      specialistProfile: {
        create: {
          displayName: 'Дмитрий Волков',
          techStack: 'Python, Django, PostgreSQL, Redis',
          experienceLevel: 'MIDDLE',
          bio: 'Middle бэкенд-разработчик. Работаю с Python и Django более 5 лет.',
          hourlyRate: 450000,
        },
      },
    },
  });
  console.log('Created SPECIALIST user: dmitry.volkov@yandex.ru');

  const sergey = await prisma.user.upsert({
    where: { email: 'sergey.morozov@gmail.com' },
    update: {
      specialistProfile: {
        upsert: {
          create: {
            displayName: 'Сергей Морозов',
            techStack: 'Go, Docker, Kubernetes, CI/CD, AWS',
            experienceLevel: 'SENIOR',
            bio: 'Senior DevOps инженер. Специализируюсь на контейнеризации и автоматизации.',
            hourlyRate: 700000,
          },
          update: {
            displayName: 'Сергей Морозов',
            techStack: 'Go, Docker, Kubernetes, CI/CD, AWS',
            experienceLevel: 'SENIOR',
            bio: 'Senior DevOps инженер. Специализируюсь на контейнеризации и автоматизации.',
            hourlyRate: 700000,
          },
        },
      },
    },
    create: {
      email: 'sergey.morozov@gmail.com',
      password: DEFAULT_PASSWORD_HASH,
      role: 'SPECIALIST',
      specialistProfile: {
        create: {
          displayName: 'Сергей Морозов',
          techStack: 'Go, Docker, Kubernetes, CI/CD, AWS',
          experienceLevel: 'SENIOR',
          bio: 'Senior DevOps инженер. Специализируюсь на контейнеризации и автоматизации.',
          hourlyRate: 700000,
        },
      },
    },
  });
  console.log('Created SPECIALIST user: sergey.morozov@gmail.com');

  // ========================================
  // Foundation ADMIN User
  // ========================================

  await prisma.user.upsert({
    where: { email: 'admin@gigly.ru' },
    update: {},
    create: {
      email: 'admin@gigly.ru',
      password: DEFAULT_PASSWORD_HASH,
      role: 'ADMIN',
    },
  });
  console.log('Created ADMIN user: admin@gigly.ru');

  console.log('');

  // ========================================
  // Example Gigs
  // ========================================

  // Example Gig 1: Backend API Development (Client 1)
  const gig1Budget = 18000000; // 180,000 RUB
  const gig1ServiceFee = Math.floor(gig1Budget * 0.10);
  const gig1Total = gig1Budget + gig1ServiceFee;

  await prisma.gig.upsert({
    where: { id: 'example-gig-backend-api' },
    update: {
      clientId: client1.id,
      serviceFee: gig1ServiceFee,
      totalAmount: gig1Total,
    },
    create: {
      id: 'example-gig-backend-api',
      title: 'REST API для системы управления пользователями',
      description: 'Требуется разработать RESTful API для управления пользователями в корпоративном приложении. API должен поддерживать CRUD операции (создание, чтение, обновление, удаление пользователей), аутентификацию через JWT токены, и ролевую модель доступа с тремя уровнями: admin, manager, user. Каждая роль имеет свой набор разрешений. Ожидается чистый, хорошо структурированный код с использованием современных практик разработки. Обязательно покрытие тестами не менее 80% для всех критических путей. API должен быть готов к продакшену: с обработкой ошибок, валидацией входных данных, логированием запросов.',
      goal: 'Создать надежный и масштабируемый API для управления пользователями с поддержкой аутентификации и авторизации.',
      deliverables: '1. REST API с эндпоинтами для CRUD операций над пользователями\n2. JWT-аутентификация с access и refresh tokens\n3. Middleware для проверки ролей и разрешений\n4. OpenAPI/Swagger документация\n5. Unit и integration тесты (покрытие 80%+)\n6. README с инструкциями по запуску и развертыванию',
      constraints: 'Стек: Node.js + Express или Fastify, PostgreSQL, TypeScript. Срок: 2-3 недели. Код должен следовать ESLint правилам проекта. Использовать Prisma ORM для работы с БД.',
      acceptanceCriteria: 'API успешно проходит все автоматические тесты. Swagger документация доступна по /api-docs и полностью описывает все эндпоинты. Все эндпоинты возвращают корректные HTTP статусы (200, 201, 400, 401, 403, 404, 500) и JSON в едином формате. JWT токены работают корректно: access token истекает через 15 минут, refresh token через 7 дней. Middleware проверяет роли и блокирует неавторизованный доступ. Код проходит code review без критических замечаний.',
      budget: gig1Budget,
      serviceFee: gig1ServiceFee,
      totalAmount: gig1Total,
      tags: 'Node.js,TypeScript,PostgreSQL,REST API,JWT',
      status: 'OPEN',
      isExample: true,
      clientId: client1.id,
    },
  });
  console.log('Created/updated example gig: Backend API');

  // Example Gig 2: Frontend Component (Client 1)
  const gig2Budget = 15000000; // 150,000 RUB
  const gig2ServiceFee = Math.floor(gig2Budget * 0.10);
  const gig2Total = gig2Budget + gig2ServiceFee;

  await prisma.gig.upsert({
    where: { id: 'example-gig-frontend-dashboard' },
    update: {
      clientId: client1.id,
      serviceFee: gig2ServiceFee,
      totalAmount: gig2Total,
    },
    create: {
      id: 'example-gig-frontend-dashboard',
      title: 'React дашборд с визуализацией данных',
      description: 'Необходимо разработать интерактивный дашборд для отображения бизнес-метрик и аналитики. Дашборд должен включать несколько типов графиков (линейные, столбчатые, круговые), таблицы с сортировкой и фильтрацией, карточки с ключевыми показателями. Данные загружаются через REST API. Требуется адаптивная верстка для работы на десктопах и планшетах. Важна производительность: дашборд должен плавно работать с датасетами до 10,000 записей. Использовать современные библиотеки для визуализации данных.',
      goal: 'Создать удобный и производительный дашборд для визуализации бизнес-метрик с интуитивным интерфейсом.',
      deliverables: '1. React компоненты дашборда с переиспользуемой архитектурой\n2. Интеграция с 2-3 библиотеками визуализации (Chart.js, Recharts или аналоги)\n3. Адаптивная верстка (desktop, tablet)\n4. Фильтры и сортировка данных\n5. Storybook с примерами компонентов\n6. Unit тесты для бизнес-логики',
      constraints: 'Стек: React 18+, TypeScript, Tailwind CSS. Можно использовать Recharts или Chart.js для графиков. Срок: 2 недели. Код должен быть типизирован, без any.',
      acceptanceCriteria: 'Дашборд корректно отображает все типы графиков с реальными данными из API. Фильтры и сортировка работают без багов. Верстка адаптивная и не ломается на экранах от 768px до 1920px. Производительность: рендеринг 5000 записей занимает не более 2 секунд. Все компоненты задокументированы в Storybook. Код проходит TypeScript проверку без ошибок. Покрытие тестами критической логики не менее 70%.',
      budget: gig2Budget,
      serviceFee: gig2ServiceFee,
      totalAmount: gig2Total,
      tags: 'React,TypeScript,Tailwind CSS,Data Visualization',
      status: 'OPEN',
      isExample: true,
      clientId: client1.id,
    },
  });
  console.log('Created/updated example gig: Frontend Dashboard');

  // Example Gig 3: DevOps Automation (Client 1)
  const gig3Budget = 17000000; // 170,000 RUB
  const gig3ServiceFee = Math.floor(gig3Budget * 0.10);
  const gig3Total = gig3Budget + gig3ServiceFee;

  await prisma.gig.upsert({
    where: { id: 'example-gig-devops-cicd' },
    update: {
      clientId: client1.id,
      serviceFee: gig3ServiceFee,
      totalAmount: gig3Total,
    },
    create: {
      id: 'example-gig-devops-cicd',
      title: 'CI/CD pipeline для Node.js приложения',
      description: 'Требуется настроить полноценный CI/CD pipeline для Node.js приложения с автоматическим тестированием, сборкой и деплоем. Pipeline должен запускаться при каждом push в main ветку и при создании pull request. Включает: запуск линтеров, unit и integration тестов, сборку Docker образа, деплой на staging окружение, и опционально на production после ручного подтверждения. Нужна настройка мониторинга деплоев и уведомлений в Telegram при успехе/ошибке. Документация по процессу деплоя обязательна.',
      goal: 'Автоматизировать процесс тестирования, сборки и деплоя приложения для ускорения релизов и снижения человеческих ошибок.',
      deliverables: '1. GitHub Actions workflow файлы для CI/CD\n2. Dockerfile и docker-compose.yml для приложения\n3. Скрипты деплоя на staging и production\n4. Настройка уведомлений в Telegram\n5. Документация по процессу деплоя и rollback\n6. Secrets management через GitHub Secrets',
      constraints: 'Платформа: GitHub Actions. Хостинг: VPS с Docker. Срок: 1.5-2 недели. Использовать существующую инфраструктуру (доступы будут предоставлены).',
      acceptanceCriteria: 'Pipeline успешно запускается при push в main и при создании PR. Все этапы (lint, test, build, deploy) выполняются последовательно. При ошибке на любом этапе pipeline останавливается и отправляет уведомление. Docker образ собирается и пушится в registry. Деплой на staging происходит автоматически, на production - после manual approval. Время выполнения полного pipeline не более 10 минут. Документация содержит инструкции по rollback и troubleshooting.',
      budget: gig3Budget,
      serviceFee: gig3ServiceFee,
      totalAmount: gig3Total,
      tags: 'DevOps,CI/CD,Docker,GitHub Actions,Node.js',
      status: 'OPEN',
      isExample: true,
      clientId: client1.id,
    },
  });
  console.log('Created/updated example gig: DevOps CI/CD');

  // Example Gig 4: Database Optimization (Client 2)
  const gig4Budget = 16000000; // 160,000 RUB
  const gig4ServiceFee = Math.floor(gig4Budget * 0.10);
  const gig4Total = gig4Budget + gig4ServiceFee;

  await prisma.gig.upsert({
    where: { id: 'example-gig-db-optimization' },
    update: {
      clientId: client2.id,
      serviceFee: gig4ServiceFee,
      totalAmount: gig4Total,
    },
    create: {
      id: 'example-gig-db-optimization',
      title: 'Оптимизация производительности PostgreSQL',
      description: 'Наше приложение испытывает проблемы с производительностью базы данных PostgreSQL. Некоторые запросы выполняются более 5 секунд, что критично для пользовательского опыта. Требуется провести аудит текущей схемы БД, найти узкие места, оптимизировать медленные запросы, добавить необходимые индексы, и при необходимости предложить рефакторинг схемы. База содержит около 2 млн записей в основных таблицах. Нужен детальный отчет с результатами до и после оптимизации, включая EXPLAIN ANALYZE для ключевых запросов.',
      goal: 'Улучшить производительность базы данных минимум в 3 раза для критичных запросов и снизить нагрузку на сервер.',
      deliverables: '1. Аудит текущей схемы БД с выявлением проблем\n2. Оптимизированные SQL запросы\n3. Новые индексы (с обоснованием)\n4. Рекомендации по рефакторингу схемы (если нужно)\n5. Отчет с метриками до/после (время выполнения, EXPLAIN ANALYZE)\n6. Скрипты миграций для применения изменений',
      constraints: 'СУБД: PostgreSQL 14+. Срок: 1-2 недели. Нельзя менять API приложения. Миграции должны быть обратимыми (rollback). Доступ к staging БД будет предоставлен.',
      acceptanceCriteria: 'Медленные запросы (>5 сек) ускорены минимум в 3 раза. Все новые индексы обоснованы через EXPLAIN ANALYZE. Миграции протестированы на staging и не вызывают downtime. Отчет содержит конкретные цифры: время выполнения до/после, использование индексов, план запросов. Нет регрессий: существующие быстрые запросы не замедлились. Документация включает рекомендации по мониторингу производительности в будущем.',
      budget: gig4Budget,
      serviceFee: gig4ServiceFee,
      totalAmount: gig4Total,
      tags: 'PostgreSQL,Database,Performance,SQL,Optimization',
      status: 'OPEN',
      isExample: true,
      clientId: client2.id,
    },
  });
  console.log('Created/updated example gig: Database Optimization');

  // Example Gig 5: Testing Infrastructure (Client 2)
  const gig5Budget = 19000000; // 190,000 RUB
  const gig5ServiceFee = Math.floor(gig5Budget * 0.10);
  const gig5Total = gig5Budget + gig5ServiceFee;

  await prisma.gig.upsert({
    where: { id: 'example-gig-e2e-testing' },
    update: {
      clientId: client2.id,
      serviceFee: gig5ServiceFee,
      totalAmount: gig5Total,
    },
    create: {
      id: 'example-gig-e2e-testing',
      title: 'E2E тесты с Playwright для веб-приложения',
      description: 'Необходимо создать инфраструктуру для end-to-end тестирования веб-приложения с использованием Playwright. Требуется покрыть тестами основные пользовательские сценарии: регистрация, авторизация, создание и редактирование сущностей, работа с формами, навигация по приложению. Тесты должны быть стабильными (не flaky), запускаться в CI/CD pipeline, и генерировать отчеты с скриншотами при падении. Нужна документация по написанию новых тестов и best practices. Настроить запуск тестов в headless режиме и с UI для локальной разработки.',
      goal: 'Создать надежную систему E2E тестирования для автоматической проверки критичных пользовательских сценариев.',
      deliverables: '1. Playwright конфигурация и setup\n2. 15-20 E2E тестов для основных сценариев\n3. Page Object Model для переиспользования кода\n4. Интеграция с CI/CD (GitHub Actions)\n5. HTML отчеты с скриншотами и видео при ошибках\n6. Документация по написанию и запуску тестов',
      constraints: 'Фреймворк: Playwright. Язык: TypeScript. Срок: 2-3 недели. Тесты должны работать в Chrome, Firefox, Safari. Время выполнения всех тестов не более 15 минут.',
      acceptanceCriteria: 'Все 15-20 тестов успешно проходят на staging окружении. Тесты стабильны: 3 последовательных запуска без падений. Page Object Model реализован для всех основных страниц. Тесты интегрированы в CI/CD и запускаются автоматически. При падении теста генерируется скриншот и видео. HTML отчет содержит детальную информацию о каждом тесте. Документация включает примеры написания новых тестов и troubleshooting guide. Код тестов проходит линтер без ошибок.',
      budget: gig5Budget,
      serviceFee: gig5ServiceFee,
      totalAmount: gig5Total,
      tags: 'Playwright,E2E Testing,TypeScript,QA,Automation',
      status: 'OPEN',
      isExample: true,
      clientId: client2.id,
    },
  });
  console.log('Created/updated example gig: E2E Testing');

  // ========================================
  // Applications for OPEN Example Gigs
  // ========================================

  console.log('');

  // Applications for Backend API Gig
  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-backend-api',
        specialistId: dmitry.id,
      },
    },
    update: {},
    create: {
      gigId: 'example-gig-backend-api',
      specialistId: dmitry.id,
      approach: 'Предлагаю следующий подход: использую Fastify для высокой производительности, Prisma ORM для типобезопасной работы с PostgreSQL. JWT реализую через библиотеку jsonwebtoken с refresh token rotation для безопасности. Для ролевой модели создам middleware с декораторами @RequireRole() для проверки прав доступа. Архитектура: слой контроллеров → сервисы → репозитории для разделения ответственности. Тесты: Jest для unit тестов, Supertest для integration тестов критических путей. Swagger генерирую автоматически из TypeScript типов через tsoa или swagger-jsdoc. Обработка ошибок через централизованный error handler с логированием через Winston.',
      questions: 'Какие конкретно роли и разрешения нужны в системе? Есть ли требования к rate limiting для API? Нужна ли поддержка OAuth провайдеров (Google, GitHub)? Какая стратегия для refresh токенов (rotation или fixed expiry)? Есть ли существующая база пользователей для миграции?',
      estimatedEffort: '2-3 недели (80-120 часов)',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  });

  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-backend-api',
        specialistId: sergey.id,
      },
    },
    update: {},
    create: {
      gigId: 'example-gig-backend-api',
      specialistId: sergey.id,
      approach: 'Имею опыт разработки REST API, хотя моя основная специализация - DevOps. Могу реализовать базовую структуру с Express и JWT аутентификацией. Знаком с Docker и CI/CD, что поможет с деплоем.',
      questions: 'Какой стек предпочитаете? Нужна ли помощь с настройкой инфраструктуры и деплоем?',
      estimatedEffort: '3-4 недели',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  });

  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-backend-api',
        specialistId: alexey.id,
      },
    },
    update: {},
    create: {
      gigId: 'example-gig-backend-api',
      specialistId: alexey.id,
      approach: 'Хотя моя основная специализация - frontend разработка, имею опыт работы с Node.js и TypeScript. Могу реализовать API используя Express, добавить JWT аутентификацию и базовую ролевую модель. Понимаю принципы REST и могу написать качественный TypeScript код с типизацией.',
      questions: 'Будет ли frontend команда, с которой нужно координировать API контракты? Какие требования к документации API?',
      estimatedEffort: '3 недели',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  });

  console.log('Created applications for Backend API gig');

  // Applications for Frontend Dashboard Gig
  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-frontend-dashboard',
        specialistId: alexey.id,
      },
    },
    update: {},
    create: {
      gigId: 'example-gig-frontend-dashboard',
      specialistId: alexey.id,
      approach: 'Использую React 18 с TypeScript и Recharts для визуализации данных. Архитектура: компонентный подход с переиспользуемыми chart компонентами, custom hooks для работы с данными, React Query для кэширования API запросов. Для производительности применю виртуализацию больших списков через react-window, мемоизацию через useMemo/useCallback. Адаптивная верстка на Tailwind CSS с breakpoints для desktop/tablet. Storybook для документации компонентов. Тесты: React Testing Library для компонентов, Vitest для бизнес-логики.',
      questions: 'Какие конкретно метрики нужно визуализировать? Есть ли дизайн-макеты или нужно предложить свой вариант? Какая частота обновления данных (real-time или по запросу)? Нужна ли поддержка экспорта графиков в PDF/PNG? Есть ли требования к accessibility (WCAG)?',
      estimatedEffort: '2 недели (80 часов)',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-frontend-dashboard',
        specialistId: dmitry.id,
      },
    },
    update: {},
    create: {
      gigId: 'example-gig-frontend-dashboard',
      specialistId: dmitry.id,
      approach: 'Моя основная специализация - backend, но имею базовые знания React. Могу реализовать простой дашборд с использованием готовых библиотек для графиков. Понимаю основы компонентного подхода.',
      questions: 'Есть ли готовый API для данных? Какие библиотеки предпочитаете для графиков?',
      estimatedEffort: '3 недели',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-frontend-dashboard',
        specialistId: sergey.id,
      },
    },
    update: {},
    create: {
      gigId: 'example-gig-frontend-dashboard',
      specialistId: sergey.id,
      approach: 'Имею опыт с frontend разработкой в рамках DevOps задач. Могу настроить React проект с Docker для разработки, помочь с CI/CD. По самой разработке компонентов опыт ограничен, но могу реализовать базовую функциональность.',
      questions: 'Нужна ли помощь с настройкой dev окружения и деплоем? Какие требования к производительности?',
      estimatedEffort: '2-3 недели',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('Created applications for Frontend Dashboard gig');

  // Applications for DevOps CI/CD Gig
  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-devops-cicd',
        specialistId: sergey.id,
      },
    },
    update: {},
    create: {
      gigId: 'example-gig-devops-cicd',
      specialistId: sergey.id,
      approach: 'Настрою GitHub Actions с тремя workflow: CI (lint + test), Build (Docker image), Deploy (staging/prod). Использую multi-stage Dockerfile для оптимизации размера образа (builder stage + production stage). Secrets через GitHub Secrets + HashiCorp Vault для production credentials. Деплой на VPS через SSH с использованием docker-compose, zero-downtime deployment через blue-green strategy. Rollback через тегирование образов (git SHA + semantic version) и быстрый откат на предыдущую версию. Мониторинг деплоев через Sentry для ошибок + уведомления в Telegram через webhook. Документация в README с диаграммами pipeline и runbook для типичных проблем.',
      questions: 'Какой текущий процесс деплоя? Есть ли staging окружение? Какие требования к rollback времени? Используется ли container registry (Docker Hub, GitHub Registry)? Нужна ли интеграция с Slack/Telegram для уведомлений?',
      estimatedEffort: '1.5-2 недели (60-80 часов)',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-devops-cicd',
        specialistId: dmitry.id,
      },
    },
    update: {},
    create: {
      gigId: 'example-gig-devops-cicd',
      specialistId: dmitry.id,
      approach: 'Имею опыт настройки CI/CD для Python проектов. Могу настроить GitHub Actions для Node.js приложения, добавить тесты и линтеры. С Docker работал, могу создать Dockerfile и настроить базовый деплой.',
      questions: 'Какие тесты уже есть в проекте? Нужна ли помощь с написанием тестов? Какой хостинг используется?',
      estimatedEffort: '2-3 недели',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-devops-cicd',
        specialistId: alexey.id,
      },
    },
    update: {},
    create: {
      gigId: 'example-gig-devops-cicd',
      specialistId: alexey.id,
      approach: 'Как frontend разработчик, имею базовый опыт с GitHub Actions для деплоя статических сайтов. Могу настроить простой CI pipeline с тестами и линтерами, но с Docker и серверным деплоем опыт ограничен.',
      questions: 'Есть ли DevOps команда для консультаций? Какие требования к мониторингу?',
      estimatedEffort: '3 недели',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('Created applications for DevOps CI/CD gig');

  // Applications for Database Optimization Gig
  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-db-optimization',
        specialistId: dmitry.id,
      },
    },
    update: {},
    create: {
      gigId: 'example-gig-db-optimization',
      specialistId: dmitry.id,
      approach: 'Начну с полного аудита: EXPLAIN ANALYZE для всех медленных запросов, анализ текущих индексов через pg_stat_user_indexes, проверка table bloat. Оптимизация запросов: переписывание N+1 queries, использование JOIN вместо подзапросов где возможно, добавление covering indexes. Стратегия индексов: B-tree для equality/range queries, GiST для геоданных, GIN для full-text search и JSONB. Проверю необходимость партиционирования больших таблиц. Настройка PostgreSQL: shared_buffers, work_mem, effective_cache_size под нагрузку. Connection pooling через PgBouncer если еще не используется. Отчет с метриками до/после, EXPLAIN ANALYZE планы, рекомендации по мониторингу.',
      questions: 'Какой текущий размер базы и темп роста? Есть ли проблемы с конкретными таблицами или запросами? Используется ли connection pooling (PgBouncer)? Какие индексы уже существуют? Можно ли получить доступ к staging БД для анализа? Есть ли ограничения на downtime для применения миграций?',
      estimatedEffort: '1-2 недели (40-80 часов)',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-db-optimization',
        specialistId: sergey.id,
      },
    },
    update: {},
    create: {
      gigId: 'example-gig-db-optimization',
      specialistId: sergey.id,
      approach: 'С точки зрения DevOps могу помочь с инфраструктурной оптимизацией: настройка connection pooling, мониторинг через Prometheus + Grafana, настройка репликации для read queries. По SQL оптимизации опыт есть, но не на уровне DBA.',
      questions: 'Какая текущая инфраструктура БД? Используется ли репликация? Нужна ли помощь с мониторингом?',
      estimatedEffort: '2 недели',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-db-optimization',
        specialistId: alexey.id,
      },
    },
    update: {},
    create: {
      gigId: 'example-gig-db-optimization',
      specialistId: alexey.id,
      approach: 'Имею базовые знания SQL и PostgreSQL из frontend разработки. Могу помочь с оптимизацией запросов на уровне приложения, но глубокая оптимизация БД не моя специализация.',
      questions: 'Есть ли проблемы на уровне приложения (N+1 queries)? Нужна ли помощь с frontend оптимизацией?',
      estimatedEffort: '2-3 недели',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('Created applications for Database Optimization gig');

  // Applications for E2E Testing Gig
  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-e2e-testing',
        specialistId: alexey.id,
      },
    },
    update: {},
    create: {
      gigId: 'example-gig-e2e-testing',
      specialistId: alexey.id,
      approach: 'Использую Playwright с TypeScript и Page Object Model для переиспользования кода. Структура проекта: tests/ (тестовые сценарии), pages/ (POM классы), fixtures/ (тестовые данные и setup). Для стабильности тестов: auto-waiting механизмы Playwright, retry logic для flaky элементов, изоляция тестов через beforeEach hooks с очисткой состояния. Настрою параллельный запуск в 3 браузерах (Chromium, Firefox, WebKit). CI интеграция через GitHub Actions с артефактами: screenshots при падении, videos для failed tests, HTML report с трендами. Добавлю visual regression testing через Playwright screenshots с pixel-perfect сравнением. Документация: contributing guide для написания новых тестов, troubleshooting guide для flaky tests, best practices.',
      questions: 'Какие критичные user flows нужно покрыть в первую очередь? Есть ли staging окружение для тестов? Нужна ли интеграция с test management системой? Какие браузеры приоритетны? Есть ли требования к accessibility testing?',
      estimatedEffort: '2-3 недели (80-120 часов)',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-e2e-testing',
        specialistId: sergey.id,
      },
    },
    update: {},
    create: {
      gigId: 'example-gig-e2e-testing',
      specialistId: sergey.id,
      approach: 'Могу помочь с DevOps частью: настройка Playwright в CI/CD, параллельный запуск тестов, хранение артефактов, интеграция с уведомлениями. По написанию самих тестов опыт есть, но не на уровне QA специалиста.',
      questions: 'Нужна ли помощь с инфраструктурой для тестов? Какие требования к скорости выполнения тестов?',
      estimatedEffort: '2-3 недели',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-e2e-testing',
        specialistId: dmitry.id,
      },
    },
    update: {},
    create: {
      gigId: 'example-gig-e2e-testing',
      specialistId: dmitry.id,
      approach: 'Имею опыт с pytest для backend тестирования. Playwright изучаю, понимаю концепции E2E тестирования. Могу написать базовые тесты для критичных сценариев, но Page Object Model и продвинутые паттерны требуют времени на изучение.',
      questions: 'Есть ли существующие тесты для reference? Какой уровень покрытия ожидается? Нужны ли API тесты помимо E2E?',
      estimatedEffort: '3 недели',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('Created applications for E2E Testing gig');

  // ========================================
  // Workflow Gigs (Demonstrating Full Lifecycle)
  // ========================================

  console.log('');

  // Workflow Gig 1: Mobile App UI/UX Design (IN_PROGRESS)
  const mobileUiBudget = 12000000; // 120,000 RUB
  const mobileUiServiceFee = Math.floor(mobileUiBudget * 0.10);
  const mobileUiTotal = mobileUiBudget + mobileUiServiceFee;

  const mobileUiGig = await prisma.gig.upsert({
    where: { id: 'workflow-gig-mobile-ui' },
    update: {
      clientId: client1.id,
      assignedSpecialistId: alexey.id,
      serviceFee: mobileUiServiceFee,
      totalAmount: mobileUiTotal,
    },
    create: {
      id: 'workflow-gig-mobile-ui',
      title: 'Дизайн мобильного приложения UI/UX',
      description: 'Требуется разработать современный и интуитивный дизайн для мобильного приложения iOS/Android. Приложение предназначено для управления задачами и проектами. Необходимо создать полный UI kit с компонентами, экранами основных сценариев (онбординг, авторизация, главный экран, список задач, детали задачи, профиль пользователя). Дизайн должен следовать современным трендам, быть адаптивным для разных размеров экранов, учитывать guidelines iOS и Android. Ожидается работа в Figma с передачей исходников и экспорта ассетов для разработки.',
      goal: 'Создать привлекательный и функциональный дизайн мобильного приложения, который повысит вовлеченность пользователей и упростит работу с задачами.',
      deliverables: '1. UI Kit с переиспользуемыми компонентами\n2. Дизайн 8-10 ключевых экранов в Figma\n3. Интерактивный прототип с переходами\n4. Экспорт ассетов для iOS и Android\n5. Design System документация\n6. Адаптация под светлую и темную темы',
      constraints: 'Инструмент: Figma. Стиль: современный, минималистичный. Цветовая схема: корпоративные цвета (будут предоставлены). Срок: 2 недели. Соответствие iOS Human Interface Guidelines и Material Design.',
      acceptanceCriteria: 'Все экраны отрисованы в Figma с pixel-perfect качеством. UI Kit содержит все необходимые компоненты (кнопки, поля ввода, карточки, иконки). Прототип демонстрирует основные пользовательские сценарии. Дизайн адаптирован под iPhone (375px, 414px) и Android (360px, 412px). Темная тема реализована корректно. Все ассеты экспортированы в нужных разрешениях (@1x, @2x, @3x).',
      budget: mobileUiBudget,
      serviceFee: mobileUiServiceFee,
      totalAmount: mobileUiTotal,
      tags: 'React,TypeScript,UI/UX,Figma',
      status: 'IN_PROGRESS',
      assignedSpecialistId: alexey.id,
      clientId: client1.id,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  });

  // Create applications for Mobile UI gig
  const mobileUiAppAccepted = await prisma.application.findFirst({
    where: { gigId: mobileUiGig.id, specialistId: alexey.id },
  });
  if (!mobileUiAppAccepted) {
    await prisma.application.create({
      data: {
        gigId: mobileUiGig.id,
        specialistId: alexey.id,
        approach: 'Начну с анализа целевой аудитории и конкурентов, затем создам wireframes для основных сценариев. После согласования перейду к детальной отрисовке UI с фокусом на удобство использования. Использую атомарный дизайн для создания масштабируемого UI Kit. Все компоненты будут переиспользуемыми и документированными. Прототип создам в Figma с реалистичными переходами и анимациями.',
        questions: 'Есть ли у вас брендбук или корпоративные цвета? Какие конкуренты вам нравятся по дизайну? Планируется ли поддержка планшетов? Нужна ли анимация и микроинтеракции?',
        estimatedEffort: '2 недели (80 часов)',
        status: 'ACCEPTED',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      },
    });
  }

  // Create rejected application for Mobile UI gig
  const mobileUiAppRejected = await prisma.application.findFirst({
    where: { gigId: mobileUiGig.id, specialistId: dmitry.id },
  });
  if (!mobileUiAppRejected) {
    await prisma.application.create({
      data: {
        gigId: mobileUiGig.id,
        specialistId: dmitry.id,
        approach: 'Могу помочь с дизайном, хотя моя основная специализация - backend разработка. Имею опыт работы с Figma и понимание UX принципов.',
        questions: 'Какие технические требования к экспорту? Нужна ли интеграция с API?',
        estimatedEffort: '3 недели',
        status: 'REJECTED',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      },
    });
  }

  // Create messages for Mobile UI gig
  await prisma.message.upsert({
    where: { id: 'msg-mobile-ui-1' },
    update: {},
    create: {
      id: 'msg-mobile-ui-1',
      gigId: mobileUiGig.id,
      senderId: alexey.id,
      content: 'Здравствуйте! Начал работу над дизайном. Изучил ваши требования и подготовил несколько вопросов по брендингу. Можем созвониться для уточнения деталей?',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-mobile-ui-2' },
    update: {},
    create: {
      id: 'msg-mobile-ui-2',
      gigId: mobileUiGig.id,
      senderId: client1.id,
      content: 'Отлично! Да, давайте созвонимся завтра. Отправлю вам брендбук и примеры дизайнов, которые нам нравятся.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-mobile-ui-3' },
    update: {},
    create: {
      id: 'msg-mobile-ui-3',
      gigId: mobileUiGig.id,
      senderId: alexey.id,
      content: 'Подготовил первые wireframes в Figma. Проработал основные экраны: онбординг, авторизация, главный экран с задачами, детали задачи. Использовал ваши корпоративные цвета из брендбука. Прошу посмотреть и дать обратную связь по структуре и навигации. После согласования перейду к детальной отрисовке UI компонентов и темной теме.',
      createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), // 1.5 days ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-mobile-ui-4' },
    update: {},
    create: {
      id: 'msg-mobile-ui-4',
      gigId: mobileUiGig.id,
      senderId: client1.id,
      content: 'Wireframes выглядят отлично! Структура понятная, навигация логичная. Есть пара правок: на главном экране хотелось бы видеть фильтры задач более заметными, и добавить быстрое действие для создания задачи. В остальном всё супер, можете переходить к детальной отрисовке.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-mobile-ui-5' },
    update: {},
    create: {
      id: 'msg-mobile-ui-5',
      gigId: mobileUiGig.id,
      senderId: alexey.id,
      content: 'Отлично, учту правки! Фильтры сделаю более заметными, добавлю FAB кнопку для быстрого создания задачи. Начинаю детальную отрисовку, планирую закончить светлую тему к концу недели, затем адаптирую под темную. Экспорт ассетов и финальный прототип будут готовы через 3-4 дня.',
      createdAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000), // 12 hours ago
    },
  });

  console.log('Created/updated workflow gig: Дизайн мобильного приложения UI/UX (IN_PROGRESS)');

  // Workflow Gig 2: Microservices Migration (IN_PROGRESS)
  const microservicesBudget = 25000000; // 250,000 RUB
  const microservicesServiceFee = Math.floor(microservicesBudget * 0.10);
  const microservicesTotal = microservicesBudget + microservicesServiceFee;

  const microservicesGig = await prisma.gig.upsert({
    where: { id: 'workflow-gig-microservices' },
    update: {
      clientId: client2.id,
      assignedSpecialistId: dmitry.id,
      serviceFee: microservicesServiceFee,
      totalAmount: microservicesTotal,
    },
    create: {
      id: 'workflow-gig-microservices',
      title: 'Миграция монолита на микросервисную архитектуру',
      description: 'Требуется провести миграцию существующего монолитного Django приложения на микросервисную архитектуру. Текущее приложение включает модули: аутентификация, управление пользователями, обработка заказов, платежи, уведомления. Необходимо выделить эти модули в отдельные сервисы, настроить межсервисное взаимодействие через REST API и message queue, организовать централизованное логирование и мониторинг. Важно обеспечить плавную миграцию без downtime для пользователей. Каждый сервис должен иметь свою базу данных и быть независимо деплоимым.',
      goal: 'Разделить монолитное приложение на независимые микросервисы для улучшения масштабируемости, упрощения разработки и деплоя отдельных компонентов.',
      deliverables: '1. Архитектурная схема микросервисов\n2. 4-5 независимых сервисов на Python/FastAPI\n3. API Gateway для маршрутизации запросов\n4. Message broker (RabbitMQ/Kafka) для асинхронной коммуникации\n5. Docker-compose для локальной разработки\n6. Документация по деплою и мониторингу\n7. Миграционный план с rollback стратегией',
      constraints: 'Стек: Python, FastAPI/Django, PostgreSQL, Redis, Docker. Message broker: RabbitMQ или Kafka. Срок: 4-5 недель. Миграция должна быть поэтапной с возможностью отката. Существующий API должен остаться совместимым.',
      acceptanceCriteria: 'Все модули выделены в отдельные сервисы с независимыми базами данных. API Gateway корректно маршрутизирует запросы. Асинхронная коммуникация через message broker работает стабильно. Каждый сервис имеет health check эндпоинт. Централизованное логирование настроено (ELK или аналог). Docker-compose позволяет запустить всю систему локально. Документация содержит инструкции по деплою каждого сервиса. Миграция протестирована на staging без потери данных.',
      budget: microservicesBudget,
      serviceFee: microservicesServiceFee,
      totalAmount: microservicesTotal,
      tags: 'Python,Docker,Microservices,PostgreSQL',
      status: 'IN_PROGRESS',
      assignedSpecialistId: dmitry.id,
      clientId: client2.id,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    },
  });

  // Create applications for Microservices gig
  const microservicesAppAccepted = await prisma.application.findFirst({
    where: { gigId: microservicesGig.id, specialistId: dmitry.id },
  });
  if (!microservicesAppAccepted) {
    await prisma.application.create({
      data: {
        gigId: microservicesGig.id,
        specialistId: dmitry.id,
        approach: 'Предлагаю поэтапную миграцию по принципу Strangler Fig Pattern. Начнем с выделения наименее связанных модулей (уведомления, затем платежи). Для каждого сервиса создам отдельный репозиторий с FastAPI, своей БД и CI/CD pipeline. Использую RabbitMQ для event-driven коммуникации между сервисами. API Gateway на Kong или Traefik для единой точки входа. Каждый этап будет тестироваться на staging перед продакшеном.',
        questions: 'Какой текущий RPS у приложения? Есть ли критичные модули, которые нельзя трогать в первую очередь? Какая инфраструктура используется для деплоя (Kubernetes, Docker Swarm, просто Docker)? Есть ли требования к backward compatibility API?',
        estimatedEffort: '4-5 недель (160-200 часов)',
        status: 'ACCEPTED',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
    });
  }

  // Create rejected application for Microservices gig
  const microservicesAppRejected = await prisma.application.findFirst({
    where: { gigId: microservicesGig.id, specialistId: sergey.id },
  });
  if (!microservicesAppRejected) {
    await prisma.application.create({
      data: {
        gigId: microservicesGig.id,
        specialistId: sergey.id,
        approach: 'Могу помочь с контейнеризацией и оркестрацией сервисов, настройкой CI/CD. Моя специализация - DevOps, но с архитектурой микросервисов на Python опыта меньше.',
        questions: 'Планируется ли использование Kubernetes? Нужна ли помощь с инфраструктурой?',
        estimatedEffort: '5-6 недель',
        status: 'REJECTED',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
    });
  }

  // Create messages for Microservices gig
  await prisma.message.upsert({
    where: { id: 'msg-microservices-1' },
    update: {},
    create: {
      id: 'msg-microservices-1',
      gigId: microservicesGig.id,
      senderId: dmitry.id,
      content: 'Добрый день! Начал работу над миграцией. Изучил текущую кодовую базу и подготовил архитектурную схему. Предлагаю начать с модуля уведомлений - он наименее связан с остальными. Отправлю схему на согласование.',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-microservices-2' },
    update: {},
    create: {
      id: 'msg-microservices-2',
      gigId: microservicesGig.id,
      senderId: client2.id,
      content: 'Схема выглядит хорошо! Согласен начать с уведомлений. Когда планируете первый деплой на staging?',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-microservices-3' },
    update: {},
    create: {
      id: 'msg-microservices-3',
      gigId: microservicesGig.id,
      senderId: dmitry.id,
      content: 'Сервис уведомлений готов и задеплоен на staging. Настроил RabbitMQ для event-driven коммуникации, добавил health checks и базовый мониторинг. Провел нагрузочное тестирование - сервис обрабатывает 1000 RPS без проблем. Следующий шаг - модуль платежей. Планирую закончить его к концу следующей недели.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-microservices-4' },
    update: {},
    create: {
      id: 'msg-microservices-4',
      gigId: microservicesGig.id,
      senderId: client2.id,
      content: 'Отлично! Протестировали сервис уведомлений на staging - работает стабильно. Есть вопрос по модулю платежей: как будете обеспечивать транзакционность при работе с внешним payment gateway?',
      createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), // 1.5 days ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-microservices-5' },
    update: {},
    create: {
      id: 'msg-microservices-5',
      gigId: microservicesGig.id,
      senderId: dmitry.id,
      content: 'Для транзакционности использую Saga pattern с компенсирующими транзакциями. Если payment gateway вернет ошибку, сервис автоматически откатит изменения в БД и отправит событие об ошибке. Также добавлю idempotency keys для защиты от дублирующих запросов. Детальную схему отправлю в документации.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  });

  console.log('Created/updated workflow gig: Миграция монолита на микросервисную архитектуру (IN_PROGRESS)');

  // Workflow Gig 3: Kubernetes Cluster Setup (REVIEW)
  const k8sBudget = 20000000; // 200,000 RUB
  const k8sServiceFee = Math.floor(k8sBudget * 0.10);
  const k8sTotal = k8sBudget + k8sServiceFee;

  const k8sGig = await prisma.gig.upsert({
    where: { id: 'workflow-gig-k8s-setup' },
    update: {
      clientId: client1.id,
      assignedSpecialistId: sergey.id,
      serviceFee: k8sServiceFee,
      totalAmount: k8sTotal,
    },
    create: {
      id: 'workflow-gig-k8s-setup',
      title: 'Настройка Kubernetes кластера для production',
      description: 'Требуется настроить production-ready Kubernetes кластер для деплоя микросервисов. Кластер должен включать: автоматическое масштабирование (HPA), мониторинг (Prometheus + Grafana), централизованное логирование (ELK stack), ingress controller для маршрутизации трафика, cert-manager для автоматического управления SSL сертификатами. Необходимо настроить CI/CD pipeline для автоматического деплоя через GitLab CI или GitHub Actions. Важна высокая доступность и отказоустойчивость. Кластер будет размещен на облачной инфраструктуре (AWS, GCP или Yandex Cloud).',
      goal: 'Создать надежный и масштабируемый Kubernetes кластер для production окружения с полным набором инструментов для мониторинга и управления.',
      deliverables: '1. Настроенный K8s кластер (3+ ноды)\n2. Helm charts для всех компонентов\n3. Prometheus + Grafana для мониторинга\n4. ELK stack для логирования\n5. Ingress controller с SSL\n6. CI/CD pipeline для автодеплоя\n7. Документация по управлению кластером\n8. Runbook для типичных проблем',
      constraints: 'Платформа: Kubernetes 1.28+. Облако: Yandex Cloud или AWS. Инструменты: Helm, Prometheus, Grafana, ELK. Срок: 3 недели. Кластер должен поддерживать минимум 20 микросервисов. Требуется настройка backup и disaster recovery.',
      acceptanceCriteria: 'Кластер развернут и работает стабильно. HPA автоматически масштабирует поды при нагрузке. Prometheus собирает метрики со всех сервисов. Grafana содержит дашборды для мониторинга. Логи централизованно собираются в Elasticsearch. Ingress корректно маршрутизирует трафик с SSL. CI/CD pipeline деплоит приложения автоматически при push в main. Документация содержит инструкции по добавлению новых сервисов. Backup настроен и протестирован.',
      budget: k8sBudget,
      serviceFee: k8sServiceFee,
      totalAmount: k8sTotal,
      tags: 'Kubernetes,Docker,DevOps,CI/CD',
      status: 'REVIEW',
      assignedSpecialistId: sergey.id,
      clientId: client1.id,
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    },
  });

  // Create application for K8s gig
  const k8sApp = await prisma.application.findFirst({
    where: { gigId: k8sGig.id, specialistId: sergey.id },
  });
  if (!k8sApp) {
    await prisma.application.create({
      data: {
        gigId: k8sGig.id,
        specialistId: sergey.id,
        approach: 'Использую Infrastructure as Code подход с Terraform для создания кластера и Helm для управления приложениями. Начну с базовой настройки кластера на 3 нодах с автоскейлингом. Затем установлю monitoring stack (Prometheus Operator + Grafana). Для логирования использую Fluent Bit + Elasticsearch + Kibana. Ingress на базе Nginx с автоматическим получением Let\'s Encrypt сертификатов через cert-manager. CI/CD настрою через GitLab CI с использованием Helm для деплоя.',
        questions: 'Какой облачный провайдер предпочитаете? Какой бюджет на инфраструктуру в месяц? Есть ли требования к географии размещения? Нужна ли multi-region настройка?',
        estimatedEffort: '3 недели (120 часов)',
        status: 'ACCEPTED',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      },
    });
  }

  // Create messages for K8s gig
  await prisma.message.upsert({
    where: { id: 'msg-k8s-1' },
    update: {},
    create: {
      id: 'msg-k8s-1',
      gigId: k8sGig.id,
      senderId: sergey.id,
      content: 'Здравствуйте! Кластер настроен и работает. Все компоненты развернуты: мониторинг, логирование, ingress. CI/CD pipeline протестирован на тестовом приложении. Отправил документацию и доступы к Grafana.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-k8s-2' },
    update: {},
    create: {
      id: 'msg-k8s-2',
      gigId: k8sGig.id,
      senderId: client1.id,
      content: 'Спасибо! Изучаю документацию. Grafana дашборды выглядят отлично. Есть пара вопросов по backup стратегии.',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-k8s-3' },
    update: {},
    create: {
      id: 'msg-k8s-3',
      gigId: k8sGig.id,
      senderId: sergey.id,
      content: 'Работа завершена, отправил на проверку. Все требования выполнены. Backup настроен через Velero с ежедневным расписанием. Добавил раздел в документацию по восстановлению из backup.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  });

  console.log('Created/updated workflow gig: Настройка Kubernetes кластера для production (REVIEW)');

  // Workflow Gig 4: API Documentation with Swagger (COMPLETED)
  const apiDocsBudget = 8000000; // 80,000 RUB
  const apiDocsServiceFee = Math.floor(apiDocsBudget * 0.10);
  const apiDocsTotal = apiDocsBudget + apiDocsServiceFee;

  const apiDocsGig = await prisma.gig.upsert({
    where: { id: 'workflow-gig-api-docs' },
    update: {
      clientId: client2.id,
      assignedSpecialistId: alexey.id,
      serviceFee: apiDocsServiceFee,
      totalAmount: apiDocsTotal,
    },
    create: {
      id: 'workflow-gig-api-docs',
      title: 'Документация API с использованием Swagger/OpenAPI',
      description: 'Требуется создать полную документацию для существующего REST API с использованием OpenAPI 3.0 спецификации. API включает около 30 эндпоинтов для работы с пользователями, заказами, продуктами и платежами. Необходимо описать все эндпоинты с примерами запросов и ответов, схемами данных, кодами ошибок. Документация должна быть интерактивной (Swagger UI) и позволять тестировать API прямо из браузера. Важно добавить описание аутентификации (JWT), rate limiting, и общие концепции API. Документация должна быть понятна как разработчикам, так и не-техническим специалистам.',
      goal: 'Создать исчерпывающую и удобную документацию API, которая ускорит интеграцию для внешних разработчиков и снизит количество вопросов в поддержку.',
      deliverables: '1. OpenAPI 3.0 спецификация (YAML/JSON)\n2. Swagger UI для интерактивного просмотра\n3. Описание всех 30+ эндпоинтов\n4. Примеры запросов и ответов\n5. Схемы данных для всех моделей\n6. Описание аутентификации и авторизации\n7. Postman коллекция для тестирования',
      constraints: 'Формат: OpenAPI 3.0. Инструменты: Swagger UI, Redoc (опционально). Язык: английский для технических терминов, русский для описаний. Срок: 1.5 недели. Документация должна автоматически обновляться при изменении API.',
      acceptanceCriteria: 'Все эндпоинты задокументированы с полным описанием параметров, тел запросов и ответов. Swagger UI доступен по /api-docs и корректно отображает всю документацию. Примеры запросов можно выполнить прямо из Swagger UI. Все модели данных описаны с типами полей и валидацией. Коды ошибок (400, 401, 403, 404, 500) документированы для каждого эндпоинта. Описание аутентификации содержит примеры получения и использования JWT токенов. Postman коллекция импортируется без ошибок.',
      budget: apiDocsBudget,
      serviceFee: apiDocsServiceFee,
      totalAmount: apiDocsTotal,
      tags: 'REST API,Swagger,Documentation,OpenAPI',
      status: 'COMPLETED',
      assignedSpecialistId: alexey.id,
      clientId: client2.id,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
  });

  // Create application for API Docs gig
  const apiDocsApp = await prisma.application.findFirst({
    where: { gigId: apiDocsGig.id, specialistId: alexey.id },
  });
  if (!apiDocsApp) {
    await prisma.application.create({
      data: {
        gigId: apiDocsGig.id,
        specialistId: alexey.id,
        approach: 'Начну с анализа существующего API кода для автоматической генерации базовой OpenAPI спецификации. Затем вручную дополню описания, примеры и edge cases. Использую Swagger Editor для валидации спецификации. Swagger UI настрою с кастомным брендингом. Для каждого эндпоинта добавлю реалистичные примеры запросов/ответов. Создам Postman коллекцию с pre-request скриптами для аутентификации. Документацию интегрирую в CI/CD для автоматической публикации.',
        questions: 'Есть ли у API версионирование? Какие эндпоинты наиболее критичны для документирования в первую очередь? Нужна ли документация на английском языке? Есть ли существующая документация, которую можно использовать как основу?',
        estimatedEffort: '1.5 недели (60 часов)',
        status: 'ACCEPTED',
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
      },
    });
  }

  // Create messages for API Docs gig
  await prisma.message.upsert({
    where: { id: 'msg-api-docs-1' },
    update: {},
    create: {
      id: 'msg-api-docs-1',
      gigId: apiDocsGig.id,
      senderId: alexey.id,
      content: 'Добрый день! Завершил документирование всех эндпоинтов. Swagger UI доступен по адресу, который отправил в личку. Postman коллекция также готова. Прошу проверить.',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-api-docs-2' },
    update: {},
    create: {
      id: 'msg-api-docs-2',
      gigId: apiDocsGig.id,
      senderId: client2.id,
      content: 'Проверили документацию с командой. Выглядит отлично! Есть пара мелких правок по описаниям эндпоинтов платежей.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-api-docs-3' },
    update: {},
    create: {
      id: 'msg-api-docs-3',
      gigId: apiDocsGig.id,
      senderId: client2.id,
      content: 'Отлично, работа принята! Документация полностью соответствует требованиям. Спасибо за качественную работу!',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  });

  console.log('Created/updated workflow gig: Документация API с использованием Swagger/OpenAPI (COMPLETED)');

  // Workflow Gig 5: Redis Caching Implementation (PAID)
  const redisBudget = 11000000; // 110,000 RUB
  const redisServiceFee = Math.floor(redisBudget * 0.10);
  const redisTotal = redisBudget + redisServiceFee;

  const redisGig = await prisma.gig.upsert({
    where: { id: 'workflow-gig-redis-caching' },
    update: {
      clientId: client1.id,
      assignedSpecialistId: dmitry.id,
      serviceFee: redisServiceFee,
      totalAmount: redisTotal,
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    create: {
      id: 'workflow-gig-redis-caching',
      title: 'Внедрение Redis кэширования для оптимизации производительности',
      description: 'Требуется внедрить Redis кэширование в существующее Node.js приложение для улучшения производительности и снижения нагрузки на базу данных. Приложение испытывает проблемы с производительностью при высоких нагрузках - некоторые запросы выполняются более 2 секунд. Необходимо проанализировать узкие места, внедрить многоуровневое кэширование (in-memory + Redis), настроить стратегии инвалидации кэша, добавить мониторинг hit rate. Важно не сломать существующую функциональность и обеспечить консистентность данных. Кэш должен автоматически инвалидироваться при изменении данных.',
      goal: 'Ускорить работу приложения минимум в 3 раза для часто запрашиваемых данных и снизить нагрузку на PostgreSQL на 50%.',
      deliverables: '1. Redis интеграция с Node.js приложением\n2. Кэширование для 10+ критичных эндпоинтов\n3. Стратегии инвалидации кэша (TTL, event-based)\n4. Мониторинг hit rate и performance метрик\n5. Graceful degradation при недоступности Redis\n6. Документация по работе с кэшем\n7. Load testing результаты до/после',
      constraints: 'Стек: Node.js, Redis 7+, ioredis клиент. Срок: 2 недели. Нельзя менять существующие API контракты. Кэш должен быть прозрачным для клиентов. Требуется поддержка Redis Cluster для production.',
      acceptanceCriteria: 'Redis успешно интегрирован и работает стабильно. Критичные эндпоинты ускорены минимум в 3 раза (подтверждено load testing). Hit rate кэша составляет 70%+. Инвалидация работает корректно - нет stale данных. При падении Redis приложение продолжает работать (fallback на БД). Мониторинг показывает метрики кэша в реальном времени. Документация содержит примеры использования и troubleshooting. Load testing показывает снижение нагрузки на БД на 50%+.',
      budget: redisBudget,
      serviceFee: redisServiceFee,
      totalAmount: redisTotal,
      tags: 'Redis,Node.js,Caching,Performance',
      status: 'PAID',
      assignedSpecialistId: dmitry.id,
      clientId: client1.id,
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    },
  });

  // Create application for Redis gig
  const redisApp = await prisma.application.findFirst({
    where: { gigId: redisGig.id, specialistId: dmitry.id },
  });
  if (!redisApp) {
    await prisma.application.create({
      data: {
        gigId: redisGig.id,
        specialistId: dmitry.id,
        approach: 'Начну с профилирования приложения для выявления самых медленных запросов. Внедрю Redis через ioredis с connection pooling. Использую многоуровневую стратегию: L1 кэш (in-memory LRU) для горячих данных, L2 кэш (Redis) для остальных. Для инвалидации применю комбинацию TTL и event-driven подхода через Redis Pub/Sub. Добавлю middleware для автоматического кэширования GET запросов. Настрою мониторинг через Prometheus метрики. Проведу load testing с помощью k6 для замера улучшений.',
        questions: 'Какой текущий RPS у приложения? Есть ли уже развернутый Redis или нужно настроить с нуля? Какие данные наиболее критичны для кэширования? Есть ли требования к консистентности (eventual vs strong)?',
        estimatedEffort: '2 недели (80 часов)',
        status: 'ACCEPTED',
        createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), // 11 days ago
      },
    });
  }

  // Create messages for Redis gig
  await prisma.message.upsert({
    where: { id: 'msg-redis-1' },
    update: {},
    create: {
      id: 'msg-redis-1',
      gigId: redisGig.id,
      senderId: dmitry.id,
      content: 'Здравствуйте! Начал работу над кэшированием. Провел профилирование и выявил 12 самых медленных эндпоинтов. Redis настроен и интегрирован. Начинаю внедрение кэширования.',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-redis-2' },
    update: {},
    create: {
      id: 'msg-redis-2',
      gigId: redisGig.id,
      senderId: client1.id,
      content: 'Отлично! Уже заметили улучшение производительности на staging. Продолжайте в том же духе.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-redis-3' },
    update: {},
    create: {
      id: 'msg-redis-3',
      gigId: redisGig.id,
      senderId: dmitry.id,
      content: 'Работа завершена! Load testing показывает ускорение в 4 раза для кэшируемых запросов. Hit rate 75%. Нагрузка на БД снизилась на 60%. Отправил отчет и документацию.',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-redis-4' },
    update: {},
    create: {
      id: 'msg-redis-4',
      gigId: redisGig.id,
      senderId: client1.id,
      content: 'Отличная работа! Результаты впечатляют. Протестировали на production - всё работает стабильно. Работа принята, оплату обработаем сегодня. Спасибо за качественное выполнение!',
      createdAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000), // 2.5 days ago
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-redis-5' },
    update: {},
    create: {
      id: 'msg-redis-5',
      gigId: redisGig.id,
      senderId: dmitry.id,
      content: 'Благодарю за сотрудничество! Было приятно работать над проектом. Если возникнут вопросы по кэшированию или понадобится помощь с дальнейшей оптимизацией - обращайтесь. Всегда готов помочь!',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (aligns with paidAt)
    },
  });

  console.log('Created/updated workflow gig: Внедрение Redis кэширования для оптимизации производительности (PAID)');

  // ========================================
  // Summary
  // ========================================

  console.log('\n=== SEED COMPLETED ===\n');
  console.log('Foundation Users Created:');
  console.log('');
  console.log('CLIENTs:');
  console.log('  • ivan.petrov@techcorp.ru (ТехКорп)');
  console.log('  • maria.sokolova@digitalpro.ru (ДиджиталПро)');
  console.log('');
  console.log('SPECIALISTs:');
  console.log('  • alexey.ivanov@mail.ru (Frontend/React)');
  console.log('  • dmitry.volkov@yandex.ru (Backend/Python)');
  console.log('  • sergey.morozov@gmail.com (DevOps/Go)');
  console.log('');
  console.log('ADMIN:');
  console.log('  • admin@gigly.ru');
  console.log('');
  console.log('Example Gigs (OPEN): 5 gigs');
  console.log('Workflow Gigs:');
  console.log('  • IN_PROGRESS: 2 gigs');
  console.log('  • REVIEW: 1 gig');
  console.log('  • COMPLETED: 1 gig');
  console.log('  • PAID: 1 gig');
  console.log('');
  console.log('Total Gigs: 10');
  console.log('');
  console.log('Password for all users: TestPass123');
  console.log('');
  console.log('Login at http://localhost:3000/login');
  console.log('');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
