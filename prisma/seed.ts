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

  await prisma.user.upsert({
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

  await prisma.user.upsert({
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

  await prisma.user.upsert({
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
