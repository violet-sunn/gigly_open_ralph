# Детальная карта приложения Gigly

**Дата создания:** 2026-02-22
**Версия:** 1.0
**Цель:** Техническая спецификация текущего состояния платформы для команды дизайна

---

## 1. Обзор платформы

### 1.1 Описание системы

Gigly — это платформа для размещения и выполнения технических заданий (gig), соединяющая клиентов с IT-специалистами. Платформа построена на Next.js 15 (App Router), использует SQLite через Prisma ORM и реализует полный жизненный цикл проекта от публикации задания до оплаты.

### 1.2 Роли пользователей

Система поддерживает три роли:

- **CLIENT** — заказчики, публикуют задания, нанимают специалистов, оплачивают работу
- **SPECIALIST** — исполнители, просматривают задания, подают заявки, выполняют работу
- **ADMIN** — администраторы, модерируют пользователей и задания

**Источник:** `prisma/schema.prisma` (модель User, поле role)

### 1.3 Архитектура маршрутов

Все маршруты защищены middleware, который проверяет JWT-токен из cookie `session`.

**Публичные маршруты:**
- `/` — главная страница
- `/login` — вход в систему
- `/register` — регистрация

**Защищённые маршруты (требуют аутентификации):**
- `/dashboard/*` — личный кабинет (доступен всем авторизованным)

**Административные маршруты (требуют роль ADMIN):**
- `/admin/*` — панель администратора

**Источник:** `middleware.ts`

---

## 2. Аутентификация и онбординг

### 2.1 Регистрация нового пользователя

**Маршрут:** `/register`
**Доступ:** Публичный (неавторизованные пользователи)
**Редирект:** Если пользователь уже авторизован → `/dashboard`

#### Поля формы регистрации

| Поле | Тип | Обязательное | Валидация | Источник |
|------|-----|--------------|-----------|----------|
| **email** | email | Да | Формат email, уникальность в БД | `app/register/page.tsx:62-69` |
| **password** | password | Да | См. правила валидации пароля ниже | `app/register/page.tsx:71-83` |
| **role** | radio | Да | Только CLIENT или SPECIALIST | `app/register/page.tsx:41-56` |

#### Правила валидации пароля

**Источник:** `lib/password.ts`

1. **Минимальная длина:** 8 символов
2. **Максимальная длина:** 72 символа (ограничение bcrypt)
3. **Обязательные символы:**
   - Минимум 1 заглавная латинская буква (A-Z)
   - Минимум 1 строчная латинская буква (a-z)
   - Минимум 1 цифра (0-9)
4. **Разрешённые символы:** Только латинские буквы, цифры и спецсимволы `!@#$%^&*()_+-=[]{};':"\\|,.<>/?`
5. **Запрещено:** Кириллица и Unicode-символы

**Сообщения об ошибках:**
- "Password must be at least 8 characters long."
- "Password must not exceed 72 characters."
- "Password must contain at least one uppercase letter."
- "Password must contain at least one lowercase letter."
- "Password must contain at least one number."
- "Password can only contain Latin letters, numbers, and special characters."

#### Rate Limiting для регистрации

**Лимит:** 3 попытки регистрации за 1 час (на IP-адрес)
**Источник:** `lib/ratelimit.ts:18-23`
**Сообщение об ошибке:** "Too many registration attempts. Please try again in X minutes."

#### Поведение после успешной регистрации

1. Пароль хешируется с помощью bcrypt (10 раундов)
2. Создаётся запись User в БД
3. Создаётся JWT-сессия (cookie `session`)
4. Редирект на `/dashboard`

**Источник:** `app/actions/auth.ts:11-57`

---

### 2.2 Вход в систему

**Маршрут:** `/login`
**Доступ:** Публичный (неавторизованные пользователи)
**Редирект:** Если пользователь уже авторизован → `/dashboard`

#### Поля формы входа

| Поле | Тип | Обязательное | Источник |
|------|-----|--------------|----------|
| **email** | email | Да | `app/login/page.tsx:38-48` |
| **password** | password | Да | `app/login/page.tsx:50-61` |

#### Rate Limiting для входа

**Лимит:** 15 попыток входа за 15 минут (на IP-адрес)
**Источник:** `lib/ratelimit.ts:11-16`
**Сообщение об ошибке:** "Too many login attempts. Please try again in X minutes/seconds."

#### Проверки при входе

1. Проверка rate limit (до валидации пароля)
2. Поиск пользователя по email
3. Проверка пароля через bcrypt.compare
4. Проверка статуса suspended

**Сообщения об ошибках:**
- "Invalid email or password." (если пользователь не найден или пароль неверный)
- "Your account has been suspended. Please contact support." (если suspended = true)

#### Поведение после успешного входа

1. Создаётся JWT-сессия (cookie `session`)
2. Редирект на `/dashboard`

**Источник:** `app/actions/auth.ts:59-94`

---

### 2.3 Настройка профиля CLIENT

**Маршрут:** `/dashboard/profile/edit`
**Доступ:** Только авторизованные пользователи с ролью CLIENT
**Server Action:** `updateProfile` из `app/actions/profile.ts`

#### Поля профиля CLIENT

| Поле | Тип | Обязательное | Валидация | Источник |
|------|-----|--------------|-----------|----------|
| **companyName** | text | Да | Не пустое после trim | `app/dashboard/profile/edit/ProfileEditForm.tsx:136-147` |
| **inn** | text | Да | Не пустое после trim | `app/dashboard/profile/edit/ProfileEditForm.tsx:150-162` |
| **kpp** | text | Нет | — | `app/dashboard/profile/edit/ProfileEditForm.tsx:164-174` |
| **contactPerson** | text | Нет | — | `app/dashboard/profile/edit/ProfileEditForm.tsx:176-187` |
| **phoneNumber** | text | Нет | — | `app/dashboard/profile/edit/ProfileEditForm.tsx:189-200` |

**Бизнес-логика:**
- Все текстовые поля проходят через `sanitizeInput()` для защиты от XSS
- Используется `upsert` — создаёт или обновляет ClientProfile
- После успешного сохранения → редирект на `/dashboard/profile`

**Источник:** `app/actions/profile.ts:60-94`

---

### 2.4 Настройка профиля SPECIALIST

**Маршрут:** `/dashboard/profile/edit`
**Доступ:** Только авторизованные пользователи с ролью SPECIALIST
**Server Action:** `updateProfile` из `app/actions/profile.ts`

#### Поля профиля SPECIALIST

| Поле | Тип | Обязательное | Валидация | Источник |
|------|-----|--------------|-----------|----------|
| **displayName** | text | Нет | — | `app/dashboard/profile/edit/ProfileEditForm.tsx:42-52` |
| **techStack** | text | Нет | — | `app/dashboard/profile/edit/ProfileEditForm.tsx:55-66` |
| **experienceLevel** | select | Нет | Только MIDDLE или SENIOR | `app/dashboard/profile/edit/ProfileEditForm.tsx:69-83` |
| **bio** | textarea | Нет | — | `app/dashboard/profile/edit/ProfileEditForm.tsx:85-96` |
| **hourlyRate** | number | Нет | Положительное число, конвертируется в копейки | `app/dashboard/profile/edit/ProfileEditForm.tsx:98-111` |

**Опции experienceLevel:**
- "" (не указано)
- "MIDDLE"
- "SENIOR"

**Конвертация hourlyRate:**
- Пользователь вводит рубли (например, 5000)
- Сохраняется в копейках: `Math.floor(rate * 100)` → 500000
- При отображении конвертируется обратно: `hourlyRate / 100`

**Источник:** `app/actions/profile.ts:18-59`

---

## 3. Путь клиента (CLIENT Journey)

### 3.1 Создание задания (Gig)

**Маршрут:** `/dashboard/gigs/new`
**Доступ:** Только CLIENT
**Редирект:** Если роль не CLIENT → `/dashboard`
**Server Action:** `createGig` из `app/actions/gig.ts`

#### Поля формы создания задания

**Секция 1: Базовая информация**

| Поле | Тип | Обязательное | Валидация | Источник |
|------|-----|--------------|-----------|----------|
| **title** | text | Да | Не пустое после trim | `app/dashboard/gigs/new/gig-form.tsx:58-70` |
| **description** | textarea | Да | Не пустое после trim | `app/dashboard/gigs/new/gig-form.tsx:72-84` |

**Секция 2: Требования и критерии успеха**

| Поле | Тип | Обязательное | Валидация | Источник |
|------|-----|--------------|-----------|----------|
| **acceptanceCriteria** | textarea | Да | Минимум 50 символов | `app/dashboard/gigs/new/gig-form.tsx:106-138` |
| **goal** | textarea | Нет | Максимум 1000 символов | `app/dashboard/gigs/new/gig-form.tsx:140-162` |
| **deliverables** | textarea | Нет | Максимум 1000 символов | `app/dashboard/gigs/new/gig-form.tsx:164-186` |
| **constraints** | textarea | Нет | Максимум 1000 символов | `app/dashboard/gigs/new/gig-form.tsx:188-210` |

**Секция 3: Бюджет и детали**

| Поле | Тип | Обязательное | Валидация | Источник |
|------|-----|--------------|-----------|----------|
| **budget** | number | Да | Положительное число | `app/dashboard/gigs/new/gig-form.tsx:222-238` |
| **tags** | text | Нет | Разделённые запятыми | `app/dashboard/gigs/new/gig-form.tsx:257-267` |

#### Расчёт бюджета

**Формула:**
1. Пользователь вводит бюджет в рублях (например, 100000)
2. Конвертация в копейки: `budgetKopecks = Math.round(budgetRoubles * 100)` → 10000000
3. Расчёт комиссии платформы (10%): `serviceFee = Math.floor(budgetKopecks * 0.10)` → 1000000
4. Итоговая сумма: `totalAmount = budgetKopecks + serviceFee` → 11000000

**Отображение в форме:**
- Budget: 100,000 ₽
- Service fee (10%): 10,000 ₽
- Total: 110,000 ₽

**Источник:** `app/actions/gig.ts:42-49`

#### Поведение после создания

1. Все текстовые поля проходят через `sanitizeInput()`
2. Создаётся запись Gig со статусом OPEN
3. Редирект на `/dashboard`

**Источник:** `app/actions/gig.ts:9-68`

---

### 3.2 Просмотр заявок на задание

**Маршрут:** `/dashboard/gigs/[id]`
**Доступ:** Авторизованные пользователи
**Видимость заявок:** Только владелец задания (CLIENT) видит все заявки

#### Отображаемые данные заявки

Для каждой заявки (Application) отображается:

**Информация о специалисте:**
- Email специалиста
- Display name (если заполнен)
- Experience level (MIDDLE/SENIOR) — бейдж
- Tech stack — список тегов

**Содержание заявки (новый формат):**
- **🔧 Technical Approach** — поле `approach` (100-2000 символов)
- **❓ Clarifying Questions** — поле `questions` (50-1000 символов)
- **⏱️ Estimated Effort** — поле `estimatedEffort` (опционально, макс 200 символов)

**Статус заявки:**
- PENDING — жёлтый бейдж "Pending"
- ACCEPTED — зелёный бейдж "Accepted"
- REJECTED — красный бейдж "Rejected"

**Источник:** `app/dashboard/gigs/[id]/page.tsx:278-348`

#### Действия с заявками

**Доступные действия для владельца задания:**

1. **Accept** — принять заявку
   - Доступно только для заявок со статусом PENDING
   - Доступно только если статус задания OPEN
   - Server Action: `acceptApplication`

2. **Reject** — отклонить заявку
   - Доступно только для заявок со статусом PENDING
   - Server Action: `rejectApplication`

**Источник:** `app/dashboard/gigs/[id]/page.tsx:342-344`

---

### 3.3 Принятие заявки (переход в IN_PROGRESS)

**Server Action:** `acceptApplication` из `app/actions/gig.ts`

#### Проверки перед принятием

1. Только CLIENT может принимать заявки
2. Заявка должна существовать
3. Пользователь должен быть владельцем задания
4. Статус задания должен быть OPEN
5. Статус заявки должен быть PENDING

#### Изменения в БД (транзакция)

1. **Application:** статус PENDING → ACCEPTED
2. **Gig:**
   - статус OPEN → IN_PROGRESS
   - assignedSpecialistId = specialistId из заявки
3. **Все остальные заявки на это задание:** статус PENDING → REJECTED (автоматически)

**Источник:** `app/actions/gig.ts:159-216`

#### Переход состояния

```
Gig: OPEN → IN_PROGRESS
Application (принятая): PENDING → ACCEPTED
Application (остальные): PENDING → REJECTED
```

---

### 3.4 Проверка выполненной работы (REVIEW → COMPLETED)

**Маршрут:** `/dashboard/gigs/[id]` (секция "Review Submitted Work")
**Доступ:** Только владелец задания, только если статус REVIEW
**Server Action:** `approveWork` из `app/actions/gig.ts`

#### Условия отображения формы

- Пользователь — владелец задания (CLIENT)
- Статус задания — REVIEW
- Отображается информация о специалисте, который сдал работу

**Источник:** `app/dashboard/gigs/[id]/page.tsx:236-250`

#### Проверки при одобрении

1. Только CLIENT может одобрять работу
2. Статус задания должен быть REVIEW
3. Пользователь должен быть владельцем задания

#### Изменение состояния

```
Gig: REVIEW → COMPLETED
```

**Источник:** `app/actions/gig.ts:291-324`

---

### 3.5 Отметка об оплате (COMPLETED → PAID)

**Маршрут:** `/dashboard/gigs/[id]` (секция "Mark as Paid")
**Доступ:** Только владелец задания, только если статус COMPLETED
**Server Action:** `markAsPaid` из `app/actions/gig.ts`

#### Условия отображения кнопки

- Пользователь — владелец задания (CLIENT)
- Статус задания — COMPLETED

**Источник:** `app/dashboard/gigs/[id]/page.tsx:253-261`

#### Проверки при отметке об оплате

1. Только CLIENT может отмечать оплату
2. Пользователь должен быть владельцем задания
3. Статус задания должен быть COMPLETED
4. Задание не должно быть уже оплачено (status !== PAID)

#### Изменения в БД

```
Gig:
  status: COMPLETED → PAID
  paidAt: текущая дата/время
```

**Источник:** `app/actions/gig.ts:326-366`

---

## 4. Путь специалиста (SPECIALIST Journey)

### 4.1 Просмотр открытых заданий

**Маршрут:** `/dashboard/gigs`
**Доступ:** Авторизованные пользователи
**Пагинация:** 25 заданий на страницу

#### Фильтры поиска

| Параметр | Тип | Описание | Источник |
|----------|-----|----------|----------|
| **search** | text | Поиск по title ИЛИ description | `app/dashboard/gigs/page.tsx:56-63` |
| **tags** | text | Фильтр по тегам (через запятую, логика OR) | `app/dashboard/gigs/page.tsx:66-70` |
| **minBudget** | number | Минимальный бюджет в рублях (конвертируется в копейки) | `app/dashboard/gigs/page.tsx:74-76` |
| **maxBudget** | number | Максимальный бюджет в рублях (конвертируется в копейки) | `app/dashboard/gigs/page.tsx:77-79` |
| **sort** | select | Сортировка | `app/dashboard/gigs/page.tsx:33, 87-89` |

#### Опции сортировки

- **newest** (по умолчанию) — по дате создания (новые первыми)
- **budget-desc** — по бюджету (от большего к меньшему)
- **budget-asc** — по бюджету (от меньшего к большему)

#### Логика фильтрации

**Базовое условие:** Отображаются только задания со статусом OPEN

**Текстовый поиск:**
```
WHERE (title CONTAINS search) OR (description CONTAINS search)
```

**Фильтр по тегам:**
```
WHERE (tags CONTAINS tag1) OR (tags CONTAINS tag2) OR ...
```

**Фильтр по бюджету:**
```
WHERE budget >= minBudget*100 AND budget <= maxBudget*100
```

**Источник:** `app/dashboard/gigs/page.tsx:52-84`

#### Отображаемая информация о задании

- Заголовок (title)
- Бюджет (в рублях, форматированный)
- Описание (первые 2 строки)
- Теги (список бейджей)
- Дата создания
- Бейдж "✨ Example" (если isExample = true)

**Источник:** `app/dashboard/gigs/page.tsx:160-189`

---

### 4.2 Подача заявки на задание

**Маршрут:** `/dashboard/gigs/[id]` (секция "Apply to this Gig")
**Доступ:** Только SPECIALIST
**Server Action:** `applyToGig` из `app/actions/gig.ts`

#### Условия отображения формы

- Пользователь — SPECIALIST
- Задание не является примером (isExample = false)
- Пользователь ещё не подавал заявку на это задание
- Статус задания — OPEN

**Источник:** `app/dashboard/gigs/[id]/page.tsx:198-223`

#### Поля формы заявки

| Поле | Тип | Обязательное | Валидация | Источник |
|------|-----|--------------|-----------|----------|
| **approach** | textarea | Да | 100-2000 символов | `app/actions/gig.ts:90, 103-105, 111-113` |
| **questions** | textarea | Да | 50-1000 символов | `app/actions/gig.ts:91, 106-108, 114-116` |
| **estimatedEffort** | textarea | Нет | Максимум 200 символов | `app/actions/gig.ts:92, 117-119` |
| **gigId** | hidden | Да | — | — |

**Сообщения об ошибках:**
- "Technical approach is required."
- "Clarifying questions are required."
- "Technical approach must be at least 100 characters. Please provide more detail about your methodology."
- "Clarifying questions must be at least 50 characters. What do you need to know about the requirements?"
- "Technical approach is too long. Maximum 2000 characters allowed."
- "Clarifying questions are too long. Maximum 1000 characters allowed."
- "Estimated effort is too long. Maximum 200 characters allowed."

#### Rate Limiting для заявок

**Лимит:** 10 заявок за 1 час (на userId)
**Источник:** `lib/ratelimit.ts:25-30`
**Сообщение об ошибке:** "Too many applications. Please try again in X minutes."

#### Проверки перед созданием заявки

1. Только SPECIALIST может подавать заявки
2. Rate limit не превышен
3. Задание существует
4. Задание не является примером (isExample = false)
5. Задание не закрыто администратором (closedByAdmin = false)
6. Статус задания — OPEN
7. Пользователь ещё не подавал заявку (проверка по уникальному индексу gigId_specialistId)

**Источник:** `app/actions/gig.ts:70-157`

#### Поведение после подачи заявки

1. Создаётся запись Application со статусом PENDING
2. Редирект на `/dashboard/gigs/[gigId]`

---

### 4.3 Сдача выполненной работы (IN_PROGRESS → REVIEW)

**Маршрут:** `/dashboard/gigs/[id]` (секция "Submit Your Work")
**Доступ:** Только назначенный специалист, только если статус IN_PROGRESS
**Server Action:** `submitWork` из `app/actions/gig.ts`

#### Условия отображения формы

- Пользователь — назначенный специалист (assignedSpecialistId = userId)
- Статус задания — IN_PROGRESS

**Источник:** `app/dashboard/gigs/[id]/page.tsx:226-234`

#### Проверки при сдаче работы

1. Только SPECIALIST может сдавать работу
2. Задание существует
3. Статус задания — IN_PROGRESS
4. Пользователь — назначенный специалист

#### Изменение состояния

```
Gig: IN_PROGRESS → REVIEW
```

**Источник:** `app/actions/gig.ts:256-289`

---

## 5. Путь администратора (ADMIN Journey)

### 5.1 Управление пользователями

**Маршрут:** `/admin/users`
**Доступ:** Только ADMIN
**Редирект:** Если роль не ADMIN → `/dashboard`
**Пагинация:** 30 пользователей на страницу

#### Отображаемые колонки таблицы

| Колонка | Данные | Источник |
|---------|--------|----------|
| **Email** | user.email | `app/admin/users/page.tsx:119-121` |
| **Role** | user.role (бейдж) | `app/admin/users/page.tsx:122-126` |
| **Status** | "Suspended" (красный) или "Active" (зелёный) | `app/admin/users/page.tsx:127-137` |
| **Registered** | user.createdAt (форматированная дата) | `app/admin/users/page.tsx:138-140` |
| **Actions** | Кнопки Suspend/Unsuspend | `app/admin/users/page.tsx:141-147` |

#### Фильтры

| Параметр | Опции | Источник |
|----------|-------|----------|
| **role** | CLIENT, SPECIALIST, ADMIN | `app/admin/users/page.tsx:40-42` |
| **status** | active, suspended | `app/admin/users/page.tsx:43-47` |

**Источник:** `app/admin/users/page.tsx:15-180`

---

### 5.2 Блокировка пользователя (Suspend)

**Server Action:** `suspendUser` из `app/actions/moderation.ts`

#### Поля формы

| Поле | Тип | Обязательное | Валидация | Источник |
|------|-----|--------------|-----------|----------|
| **userId** | hidden | Да | — | — |
| **reason** | text/textarea | Да | Не пустое после trim | `app/actions/moderation.ts:22-26` |

#### Проверки перед блокировкой

1. Только ADMIN может блокировать
2. Пользователь существует
3. Пользователь ещё не заблокирован (suspended = false)
4. Причина указана

#### Изменения в БД (транзакция)

1. **User:** suspended = false → true
2. **ModerationLog:** создаётся запись с action = "SUSPEND_USER"

**Источник:** `app/actions/moderation.ts:8-59`

---

### 5.3 Разблокировка пользователя (Unsuspend)

**Server Action:** `unsuspendUser` из `app/actions/moderation.ts`

#### Поля формы

| Поле | Тип | Обязательное | Валидация | Источник |
|------|-----|--------------|-----------|----------|
| **userId** | hidden | Да | — | — |
| **reason** | text/textarea | Да | Не пустое после trim | `app/actions/moderation.ts:76-79` |

#### Проверки перед разблокировкой

1. Только ADMIN может разблокировать
2. Пользователь существует
3. Пользователь заблокирован (suspended = true)
4. Причина указана

#### Изменения в БД (транзакция)

1. **User:** suspended = true → false
2. **ModerationLog:** создаётся запись с action = "UNSUSPEND_USER"

**Источник:** `app/actions/moderation.ts:61-112`

---

### 5.4 Закрытие задания администратором

**Server Action:** `closeGig` из `app/actions/moderation.ts`

#### Поля формы

| Поле | Тип | Обязательное | Валидация | Источник |
|------|-----|--------------|-----------|----------|
| **gigId** | hidden | Да | — | — |
| **reason** | text/textarea | Да | Не пустое после trim | `app/actions/moderation.ts:128-132` |

#### Проверки перед закрытием

1. Только ADMIN может закрывать задания
2. Задание существует
3. Задание ещё не закрыто (closedByAdmin = false)
4. Причина указана

#### Изменения в БД (транзакция)

1. **Gig:**
   - closedByAdmin = false → true
   - closedAt = текущая дата/время
2. **ModerationLog:** создаётся запись с action = "CLOSE_GIG"

**Последствия закрытия:**
- Задание больше не принимает заявки
- Обмен сообщениями по заданию блокируется

**Источник:** `app/actions/moderation.ts:114-168`

---

## 6. Общие компоненты

### 6.1 Система обмена сообщениями

**Маршрут:** `/dashboard/gigs/[id]` (секция "Messages")
**Доступ:** Владелец задания (CLIENT) или назначенный специалист (SPECIALIST)
**Server Action:** `sendMessage` из `app/actions/gig.ts`

#### Условия доступа к сообщениям

- Пользователь — владелец задания ИЛИ назначенный специалист
- Специалист назначен (assignedSpecialistId !== null)

**Если специалист не назначен:**
Отображается информационное сообщение: "Messaging will be available once a specialist is assigned to this gig."

**Источник:** `app/dashboard/gigs/[id]/page.tsx:352-378`

#### Поля формы отправки сообщения

| Поле | Тип | Обязательное | Валидация | Источник |
|------|-----|--------------|-----------|----------|
| **content** | textarea | Да | Не пустое после trim, макс 2000 символов | `app/actions/gig.ts:382-396` |
| **gigId** | hidden | Да | — | — |

#### Rate Limiting для сообщений

**Лимит:** 30 сообщений за 1 час (на userId)
**Источник:** `lib/ratelimit.ts:32-37`
**Сообщение об ошибке:** "Too many messages. Please try again in X minutes."

#### Проверки перед отправкой

1. Rate limit не превышен
2. Задание существует
3. Задание не закрыто администратором (closedByAdmin = false)
4. Специалист назначен (assignedSpecialistId !== null)
5. Пользователь — владелец задания ИЛИ назначенный специалист

**Источник:** `app/actions/gig.ts:368-436`

#### Отображение сообщений

Каждое сообщение показывает:
- Имя отправителя (displayName или companyName, или email)
- Содержание сообщения
- Дату/время отправки
- Визуальное выделение для сообщений текущего пользователя

**Источник:** `app/dashboard/gigs/[id]/page.tsx:363`

---


## 7. Машины состояний

### 7.1 Жизненный цикл задания (Gig Lifecycle)

#### Состояния задания

| Состояние | Описание | Источник |
|-----------|----------|----------|
| **OPEN** | Задание опубликовано, принимает заявки | `prisma/schema.prisma:43` |
| **IN_PROGRESS** | Специалист назначен, работа выполняется | — |
| **REVIEW** | Работа сдана, ожидает проверки клиентом | — |
| **COMPLETED** | Работа принята, ожидает оплаты | — |
| **PAID** | Работа оплачена, задание завершено | — |

#### Диаграмма переходов состояний

```
OPEN
  │
  │ acceptApplication (CLIENT)
  │ → assignedSpecialistId устанавливается
  │ → все остальные заявки отклоняются
  ↓
IN_PROGRESS
  │
  │ submitWork (SPECIALIST)
  ↓
REVIEW
  │
  │ approveWork (CLIENT)
  ↓
COMPLETED
  │
  │ markAsPaid (CLIENT)
  ↓
PAID
```

#### Таблица переходов

| Из состояния | Действие | Кто может | В состояние | Побочные эффекты | Источник |
|--------------|----------|-----------|-------------|------------------|----------|
| OPEN | acceptApplication | CLIENT (владелец) | IN_PROGRESS | assignedSpecialistId устанавливается; все остальные заявки PENDING → REJECTED | `app/actions/gig.ts:193-213` |
| IN_PROGRESS | submitWork | SPECIALIST (назначенный) | REVIEW | — | `app/actions/gig.ts:283-286` |
| REVIEW | approveWork | CLIENT (владелец) | COMPLETED | — | `app/actions/gig.ts:318-321` |
| COMPLETED | markAsPaid | CLIENT (владелец) | PAID | paidAt устанавливается | `app/actions/gig.ts:357-362` |

#### Специальные случаи

**Закрытие администратором:**
- Администратор может закрыть задание на любом этапе
- Устанавливается флаг `closedByAdmin = true`
- Задание больше не принимает заявки
- Обмен сообщениями блокируется
- Статус задания НЕ меняется

**Источник:** `app/actions/moderation.ts:144-150`

---

### 7.2 Жизненный цикл заявки (Application Lifecycle)

#### Состояния заявки

| Состояние | Описание | Источник |
|-----------|----------|----------|
| **PENDING** | Заявка подана, ожидает решения клиента | `prisma/schema.prisma:72` |
| **ACCEPTED** | Заявка принята, специалист назначен на задание | — |
| **REJECTED** | Заявка отклонена клиентом или автоматически | — |

#### Диаграмма переходов состояний

```
PENDING
  │
  ├─→ acceptApplication (CLIENT) → ACCEPTED
  │
  └─→ rejectApplication (CLIENT) → REJECTED
      или
      автоматически при принятии другой заявки → REJECTED
```

#### Таблица переходов

| Из состояния | Действие | Кто может | В состояние | Побочные эффекты | Источник |
|--------------|----------|-----------|-------------|------------------|----------|
| PENDING | acceptApplication | CLIENT (владелец задания) | ACCEPTED | Gig: OPEN → IN_PROGRESS; все остальные заявки → REJECTED | `app/actions/gig.ts:193-213` |
| PENDING | rejectApplication | CLIENT (владелец задания) | REJECTED | — | `app/actions/gig.ts:248-251` |
| PENDING | acceptApplication (другой заявки) | CLIENT (владелец задания) | REJECTED | Автоматическое отклонение | `app/actions/gig.ts:205-212` |

#### Ограничения

- Переходы возможны только из состояния PENDING
- Состояния ACCEPTED и REJECTED финальные (нет обратных переходов)
- Специалист может подать только одну заявку на задание (уникальный индекс gigId_specialistId)

**Источник:** `prisma/schema.prisma:76`

---

## 8. Приложение

### 8.1 Матрица прав доступа

#### Доступ к маршрутам

| Маршрут | PUBLIC | CLIENT | SPECIALIST | ADMIN | Источник |
|---------|--------|--------|------------|-------|----------|
| `/` | ✅ | ✅ | ✅ | ✅ | — |
| `/login` | ✅ | ❌ (→ /dashboard) | ❌ (→ /dashboard) | ❌ (→ /dashboard) | `middleware.ts:38-43` |
| `/register` | ✅ | ❌ (→ /dashboard) | ❌ (→ /dashboard) | ❌ (→ /dashboard) | `middleware.ts:38-43` |
| `/dashboard/*` | ❌ (→ /login) | ✅ | ✅ | ✅ | `middleware.ts:32-36` |
| `/dashboard/gigs/new` | ❌ | ✅ | ❌ (→ /dashboard) | ❌ | `app/dashboard/gigs/new/page.tsx:8` |
| `/admin/*` | ❌ (→ /login) | ❌ (→ /dashboard) | ❌ (→ /dashboard) | ✅ | `middleware.ts:22-29` |

#### Доступ к Server Actions

| Action | CLIENT | SPECIALIST | ADMIN | Проверка | Источник |
|--------|--------|------------|-------|----------|----------|
| **createGig** | ✅ | ❌ | ❌ | `session.role !== 'CLIENT'` | `app/actions/gig.ts:16-18` |
| **applyToGig** | ❌ | ✅ | ❌ | `session.role !== 'SPECIALIST'` | `app/actions/gig.ts:77-79` |
| **acceptApplication** | ✅ (владелец) | ❌ | ❌ | `session.role !== 'CLIENT'` + владелец задания | `app/actions/gig.ts:166-168, 181-183` |
| **rejectApplication** | ✅ (владелец) | ❌ | ❌ | `session.role !== 'CLIENT'` + владелец задания | `app/actions/gig.ts:225-227, 240-242` |
| **submitWork** | ❌ | ✅ (назначенный) | ❌ | `session.role !== 'SPECIALIST'` + назначенный специалист | `app/actions/gig.ts:263-265, 279-281` |
| **approveWork** | ✅ (владелец) | ❌ | ❌ | `session.role !== 'CLIENT'` + владелец задания | `app/actions/gig.ts:298-300, 314-316` |
| **markAsPaid** | ✅ (владелец) | ❌ | ❌ | `session.role !== 'CLIENT'` + владелец задания | `app/actions/gig.ts:333-335, 345-347` |
| **sendMessage** | ✅ (владелец или назначенный) | ✅ (владелец или назначенный) | ❌ | Владелец задания ИЛИ назначенный специалист | `app/actions/gig.ts:420-425` |
| **suspendUser** | ❌ | ❌ | ✅ | `session.role !== 'ADMIN'` | `app/actions/moderation.ts:17-19` |
| **unsuspendUser** | ❌ | ❌ | ✅ | `session.role !== 'ADMIN'` | `app/actions/moderation.ts:70-72` |
| **closeGig** | ❌ | ❌ | ✅ | `session.role !== 'ADMIN'` | `app/actions/moderation.ts:123-125` |

---

### 8.2 Сводная таблица валидации полей

#### Регистрация и аутентификация

| Поле | Мин. длина | Макс. длина | Формат | Дополнительно |
|------|------------|-------------|--------|---------------|
| email | — | — | Email | Уникальность в БД |
| password | 8 | 72 | Латиница + цифры + спецсимволы | Мин. 1 заглавная, 1 строчная, 1 цифра |
| role | — | — | Enum | CLIENT или SPECIALIST |

#### Профиль CLIENT

| Поле | Обязательное | Валидация |
|------|--------------|-----------|
| companyName | Да | Не пустое после trim |
| inn | Да | Не пустое после trim |
| kpp | Нет | — |
| contactPerson | Нет | — |
| phoneNumber | Нет | — |

#### Профиль SPECIALIST

| Поле | Обязательное | Валидация |
|------|--------------|-----------|
| displayName | Нет | — |
| techStack | Нет | — |
| experienceLevel | Нет | MIDDLE или SENIOR |
| bio | Нет | — |
| hourlyRate | Нет | Положительное число, конвертируется в копейки |

#### Создание задания

| Поле | Обязательное | Мин. длина | Макс. длина | Дополнительно |
|------|--------------|------------|-------------|---------------|
| title | Да | — | — | Не пустое после trim |
| description | Да | — | — | Не пустое после trim |
| acceptanceCriteria | Да | 50 | — | Не пустое после trim |
| goal | Нет | — | 1000 | — |
| deliverables | Нет | — | 1000 | — |
| constraints | Нет | — | 1000 | — |
| budget | Да | — | — | Положительное число |
| tags | Нет | — | — | Разделённые запятыми |

#### Подача заявки

| Поле | Обязательное | Мин. длина | Макс. длина |
|------|--------------|------------|-------------|
| approach | Да | 100 | 2000 |
| questions | Да | 50 | 1000 |
| estimatedEffort | Нет | — | 200 |

#### Обмен сообщениями

| Поле | Обязательное | Мин. длина | Макс. длина |
|------|--------------|------------|-------------|
| content | Да | — | 2000 |

#### Модерация

| Поле | Обязательное | Валидация |
|------|--------------|-----------|
| reason (suspend/unsuspend/closeGig) | Да | Не пустое после trim |

---

### 8.3 Rate Limiting

| Действие | Лимит | Окно | Идентификатор | Источник |
|----------|-------|------|---------------|----------|
| Вход (login) | 15 попыток | 15 минут | IP-адрес | `lib/ratelimit.ts:11-16` |
| Регистрация (register) | 3 попытки | 1 час | IP-адрес | `lib/ratelimit.ts:18-23` |
| Подача заявки (application) | 10 заявок | 1 час | userId | `lib/ratelimit.ts:25-30` |
| Отправка сообщения (message) | 30 сообщений | 1 час | userId | `lib/ratelimit.ts:32-37` |

**Технология:** Upstash Redis с алгоритмом sliding window

---

### 8.4 Конвертация валюты

Все денежные суммы хранятся в копейках (1 рубль = 100 копеек).

#### Бюджет задания

**Ввод пользователя:** Рубли (например, 100000)
**Хранение в БД:** Копейки (10000000)
**Формула:** `budgetKopecks = Math.round(budgetRoubles * 100)`

**Источник:** `app/actions/gig.ts:47`

#### Комиссия платформы

**Процент:** 10% от бюджета
**Формула:** `serviceFee = Math.floor(budgetKopecks * 0.10)`

**Источник:** `app/actions/gig.ts:48`

#### Итоговая сумма

**Формула:** `totalAmount = budgetKopecks + serviceFee`

**Источник:** `app/actions/gig.ts:49`

#### Почасовая ставка специалиста

**Ввод пользователя:** Рубли (например, 5000)
**Хранение в БД:** Копейки (500000)
**Формула:** `hourlyRate = Math.floor(rate * 100)`

**Источник:** `app/actions/profile.ts:38`

#### Отображение

**Формула:** `roubles = kopecks / 100`
**Форматирование:** `new Intl.NumberFormat('ru-RU').format(roubles)` → "100 000"

**Источник:** `app/dashboard/gigs/page.tsx:11-13`

---

### 8.5 Особенности реализации

#### Примеры заданий (Example Gigs)

Задания с флагом `isExample = true` имеют особое поведение:

- Отображаются с бейджем "✨ Example"
- Показывают информационный блок с пояснением
- **Нельзя подать заявку** (блокировка на уровне UI и Server Action)
- Используются как образцы для клиентов

**Источник:** `app/dashboard/gigs/[id]/page.tsx:106-121, 200-208`; `app/actions/gig.ts:126-128`

#### Закрытие задания администратором

Когда администратор закрывает задание (`closedByAdmin = true`):

- Задание больше не принимает заявки
- Обмен сообщениями блокируется
- Отображается красный баннер с информацией о закрытии
- История модерации видна администраторам

**Источник:** `app/dashboard/gigs/[id]/page.tsx:404-415`; `app/actions/gig.ts:130-132`; `app/actions/gig.ts:412-414`

#### Блокировка пользователя (Suspended)

Когда пользователь заблокирован (`suspended = true`):

- Вход в систему блокируется с сообщением "Your account has been suspended. Please contact support."
- Все существующие сессии остаются активными до истечения JWT
- Администратор видит статус "Suspended" в таблице пользователей

**Источник:** `app/actions/auth.ts:88-90`

#### Санитизация ввода

Все текстовые поля проходят через функцию `sanitizeInput()` для защиты от XSS-атак перед сохранением в БД.

**Применяется к:**
- Все поля профиля (CLIENT и SPECIALIST)
- Все поля создания задания
- Поля заявки (approach, questions, estimatedEffort)
- Содержание сообщений

**Источник:** `app/actions/profile.ts`, `app/actions/gig.ts`

---

## 9. Заключение

### 9.1 Покрытие документации

Данная карта приложения документирует:

✅ Все маршруты в директории `app/`
✅ Все Server Actions в `app/actions/`
✅ Все поля форм с точными именами и валидацией
✅ Все переходы состояний для Gig и Application
✅ Все правила авторизации и rate limiting
✅ Все конвертации данных (рубли ↔ копейки)

### 9.2 Источники данных

Документация основана на анализе следующих файлов:

**Маршруты:**
- `app/login/page.tsx`
- `app/register/page.tsx`
- `app/dashboard/profile/edit/page.tsx`
- `app/dashboard/gigs/page.tsx`
- `app/dashboard/gigs/new/page.tsx`
- `app/dashboard/gigs/[id]/page.tsx`
- `app/admin/users/page.tsx`

**Server Actions:**
- `app/actions/auth.ts`
- `app/actions/profile.ts`
- `app/actions/gig.ts`
- `app/actions/moderation.ts`

**Компоненты:**
- `app/dashboard/profile/edit/ProfileEditForm.tsx`
- `app/dashboard/gigs/new/gig-form.tsx`

**Инфраструктура:**
- `middleware.ts`
- `lib/password.ts`
- `lib/ratelimit.ts`
- `prisma/schema.prisma`

### 9.3 Использование документации

Эта карта приложения предназначена для:

- **Команды дизайна:** Понимание текущих ограничений и возможностей системы
- **Команды разработки:** Референс текущей функциональности при рефакторинге
- **Продуктовой команды:** Базовая линия для планирования улучшений
- **QA-команды:** Спецификация для тестирования

---

**Конец документа**
