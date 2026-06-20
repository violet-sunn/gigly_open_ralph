# GIGLY — модель данных

Схема под интеграцию с БД. Названия статусов на русском — как в UI; в скобках предлагаемые enum-ключи для бэкенда. Данные в прототипе захардкожены в `Gigly App.dc.html` (массивы `MARKET`, `GIGS`, `APPLICATIONS`, `CONVERSATIONS`, `DISPUTES`, `ADMIN_USERS`) — заменяются выборками из БД один-к-одному.

## User
```
id            string
role          "specialist" | "company" | "admin"
name          string                 // ФИО или название компании
avatarUrl     string?
title         string?                // "Senior", должность
verified      boolean                // галочка-патч
online        boolean
ratingStars   number (0..5)
ratingCount   number
```
**Специалист** дополнительно: `stack: Tag[]`, `bio: string`, `categories: Category[]`, `completedProjects`.
**Компания (Клиент)**: `companyName`, `inn` (ИНН), `kpp` (КПП), `about`. Проверка ИНН/КПП — пострелиз.

## Gig (задача)
```
id            string
clientId      string                 // автор (компания)
specialistId  string?                // назначенный исполнитель
title         string
description    string
category      Category               // см. ниже
tags          Tag[]                  // стек/навыки
price         number                 // фикс-цена, ₽ (специалист получает полностью)
durationDays  string                 // срок ("14 дней")
status        GigStatus
goal          string?                // Definition of Done: цель
deliverable   string?                // ожидаемый результат
constraints   string?                // ограничения
criteria      string[]               // критерии приёмки ("Готово, когда…")
startDate     date?
endDate       date?
postedAt      datetime
```

### GigStatus (перечисление, порядок = жизненный цикл)
| UI | key | переход делает |
|---|---|---|
| Открыт | `open` | — (создан клиентом) |
| На рассмотрении | `under_review` | система (есть отклики) |
| В работе | `in_progress` | клиент (назначил исполнителя) |
| На проверке | `review` | специалист («Сдать работу») |
| Завершён | `completed` | клиент («Принять работу») |
| Оплачен | `paid` | клиент («Отметить как оплаченный») — терминальный |
| Отклонён | `rejected` | клиент/модератор — терминальный |

Комиссия платформы: **10%** сверх бюджета платит клиент (специалист получает 100% бюджета).

## Application (отклик)
```
id            string
gigId         string
specialistId  string
approach      string                 // как буду решать (обязательно, ≥20 симв.)
questions     string                 // уточняющие вопросы (обязательно)
estimate      string?                // оценка трудозатрат
state         "pending" | "accepted" | "rejected"
createdAt     datetime
```
Принятие одного отклика → его `accepted`, остальные по гигу → `rejected`, гиг → `in_progress`.
Специалист может отозвать свой `pending` отклик (withdraw).

## Dispute (спор)
```
id            string
gigId         string
openerRole    "specialist" | "company"
reason        DisputeReason
status        "open" | "under_review" | "resolved"
resolution    string?                // вердикт при resolved
amount        number                 // сумма по гигу (заморожена до решения)
timeline      DisputeEntry[]
evidence      string[]               // имена файлов-доказательств
createdAt     datetime
```
`DisputeEntry { authorRole: "specialist"|"company"|"moderator", authorName, text, createdAt }`
**DisputeReason**: Оплата не поступила · Результат не соответствует ТЗ · Заказчик не выходит на связь · Исполнитель не выходит на связь · Просрочен срок выполнения · Другое.
**Решение модератора**: в пользу специалиста / в пользу заказчика / частичный возврат 50% → `resolved` + запись в журнал модерации.

## Message / Chat
```
chatId        string
gigId         string?                // чат привязан к гигу
fromUserId    string
text          string
sentAt        datetime
read          boolean
```
Чат gig-scoped; в списке — статус гига и счётчик непрочитанных. Edge-кейсы: спец ещё не назначен / гиг закрыт.

## Notification
```
id            string
userId        string
type          "application" | "status" | "message" | "payment"
gigId         string?
text          string
createdAt     datetime
read          boolean
```
Клик ведёт в соответствующий раздел (отклики / мои гиги / чаты / финансы).

## Transaction (финансы)
Производное от гигов со статусом `review`/`completed`/`paid`. Для специалиста — заработок (бюджет), для клиента — расход (бюджет + 10%). Реальных платежей нет (MVP) — `paid` это логический статус.

## Category (фикс. набор, цвет = бренд-токен)
| Категория | цвет |
|---|---|
| Маркетинг | blue |
| Дизайн | rose |
| Программирование | green |
| Разработка | teal |
| Кодинг | orange |

## Tag
Свободный справочник навыков/стека (React, Node.js, Python, WebSocket, …).
