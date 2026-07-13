// «Как это работает» — the platform guide reached from the dashboard onboarding tile «Смотреть». Role-aware
// (Компания vs Специалист): intro, the deal lifecycle strip, numbered steps, and a closing CTA. Server-rendered,
// token-styled to match the other (protected) screens; the shell header supplies the «КАК ЭТО РАБОТАЕТ» title.

import Link from "next/link";
import "@/app/_design/tokens.css";

type Role = "CLIENT" | "SPECIALIST";
type Step = { title: string; body: string };

const MONO = "'Handjet',monospace";
const GROTESK = "'Manrope',sans-serif";

const LIFECYCLE = ["Открыт", "В работе", "На проверке", "Завершён", "Оплачен"];

const INTRO: Record<Role, string> = {
  CLIENT:
    "Gigly — это площадка, где компании находят проверенных Middle+/Senior специалистов под конкретные IT-задачи. Вы описываете задачу с чёткими требованиями, получаете структурированные отклики и ведёте сделку от постановки до оплаты — прозрачно и в одном месте.",
  SPECIALIST:
    "Gigly — это площадка, где вы находите оплачиваемые IT-задачи от компаний и монетизируете свою экспертизу. Вы откликаетесь с описанием подхода, ведёте работу и получаете оплату — прозрачно и в одном месте.",
};

const STEPS: Record<Role, Step[]> = {
  CLIENT: [
    { title: "Заполните профиль компании", body: "Укажите название, сферу и контактное лицо. Специалисты охотнее откликаются на понятного заказчика." },
    { title: "Создайте гиг", body: "Опишите задачу, требования и критерии готовности (Definition of Done), укажите бюджет и нужный стек. Чем чётче ТЗ — тем точнее отклики." },
    { title: "Соберите отклики", body: "Специалисты присылают свой подход к задаче, уточняющие вопросы и оценку сроков. Все отклики — в разделе «Отклики» гига." },
    { title: "Выберите исполнителя", body: "Примите лучший отклик. Гиг переходит «В работу», а специалист закрепляется за задачей." },
    { title: "Обсуждайте в чате", body: "Держите связь и уточняйте детали прямо на платформе — в разделе «Чаты»." },
    { title: "Примите работу", body: "Специалист отправляет результат «На проверку». Вы принимаете его или запрашиваете доработку." },
    { title: "Оплата", body: "После приёмки отмечаете оплату. Комиссия Gigly — 10%. В текущей версии расчёты учётные, реальные платежи в разработке." },
    { title: "Спорные ситуации", body: "Если что-то пошло не так — откройте спор в разделе «Споры», и мы поможем разобраться." },
  ],
  SPECIALIST: [
    { title: "Заполните профиль", body: "Укажите стек, уровень (Middle+/Senior) и опыт. Полный профиль — это больше приглашений." },
    { title: "Найдите задачи", body: "В разделе «Поиск» отфильтруйте гиги по стеку, бюджету и рейтингу заказчика." },
    { title: "Откликнитесь", body: "Опишите свой подход к задаче, задайте уточняющие вопросы и оцените сроки. Сильный отклик выделяет вас среди других." },
    { title: "Вас выбрали", body: "Когда заказчик принимает ваш отклик, гиг переходит «В работу» и закрепляется за вами." },
    { title: "Обсуждайте в чате", body: "Уточняйте детали и держите заказчика в курсе — в разделе «Чаты»." },
    { title: "Сдайте работу", body: "Отправьте результат «На проверку». Заказчик принимает его или просит доработку." },
    { title: "Получите оплату", body: "После приёмки задача переходит в «Оплачен». В текущей версии расчёты учётные, реальные выплаты в разработке." },
    { title: "Спорные ситуации", body: "Если возникли разногласия — откройте спор, и платформа поможет их урегулировать." },
  ],
};

const CTA: Record<Role, { label: string; href: string }> = {
  CLIENT: { label: "Создать первый гиг →", href: "/gigs/new" },
  SPECIALIST: { label: "Найти первую задачу →", href: "/gigs" },
};

export function GuideDesign({ role }: { role: Role }) {
  const steps = STEPS[role];
  const cta = CTA[role];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 860 }}>
      {/* intro */}
      <div style={{ borderRadius: 12, background: "var(--surface-sunken)", padding: 24 }}>
        <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 20, color: "var(--om-accent, #0088ff)" }}>Добро пожаловать в Gigly</span>
        <p style={{ margin: "10px 0 0", fontFamily: GROTESK, fontSize: 15, lineHeight: 1.7, color: "var(--text-2, var(--text-1))" }}>{INTRO[role]}</p>
      </div>

      {/* lifecycle strip */}
      <div style={{ borderRadius: 12, background: "var(--surface-sunken)", padding: "20px 24px" }}>
        <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 16, color: "var(--text-1)" }}>Жизненный цикл сделки</span>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          {LIFECYCLE.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 30,
                  padding: "0 14px",
                  borderRadius: 999,
                  background: "var(--surface-card)",
                  boxShadow: "inset 0 0 0 1px var(--hairline-08)",
                  fontFamily: MONO,
                  fontSize: 14,
                  color: "var(--text-1)",
                }}
              >
                {s}
              </span>
              {i < LIFECYCLE.length - 1 && <span style={{ color: "var(--text-4)", fontSize: 15 }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 16, borderRadius: 12, background: "var(--surface-sunken)", padding: 20, boxShadow: "inset 0 0 0 1px var(--hairline-06)" }}>
            <span
              style={{
                flex: "none",
                width: 34,
                height: 34,
                borderRadius: 999,
                background: "var(--om-accent, #0088ff)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 17,
              }}
            >
              {i + 1}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
              <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 18, color: "var(--text-1)" }}>{step.title}</span>
              <span style={{ fontFamily: GROTESK, fontSize: 14, lineHeight: 1.6, color: "var(--text-3)" }}>{step.body}</span>
            </div>
          </div>
        ))}
      </div>

      {/* closing CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, borderRadius: 12, background: "var(--surface-sunken)", padding: 24 }}>
        <span style={{ flex: 1, fontFamily: MONO, fontWeight: 600, fontSize: 18, color: "var(--text-1)" }}>Готовы начать?</span>
        <Link
          href={cta.href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            height: 44,
            padding: "0 22px",
            borderRadius: 8,
            background: "var(--om-accent, #0088ff)",
            color: "#fff",
            fontFamily: GROTESK,
            fontSize: 15,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          {cta.label}
        </Link>
      </div>
    </div>
  );
}
