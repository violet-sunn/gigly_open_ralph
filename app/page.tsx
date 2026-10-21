// Public landing page. Art direction: «colour chapters» (taste-skill, seed 1498868290, see .taste-skill/direction.json):
// the page performs the gig lifecycle as a row of flat colour posters, each holding one real interface fragment.
// Palette and type are the brand's (gigly_full_design); every figure comes from lib/pricing.ts.

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutUser } from "@/app/actions/auth";
import { SERVICE_FEE_PCT_LABEL } from "@/lib/pricing";
import { LandingFee } from "./_design/LandingFee";
import { LandingMotion } from "./_design/LandingMotion";
import { CriteriaFragment, ApplyFragment, ApplicantsFragment, GigCardFragment } from "./_design/LandingFragments";
import "./_design/tokens.css";
import "./_design/landing.css";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

function Block({ title, frag, items }: { title: string; frag: ReactNode; items: string[] }) {
  return (
    <div className="lp-block" data-reveal>
      <h3 data-i style={i(0)}>{title}</h3>
      <div className="row" data-i style={i(1)}>
        <div className="frag">{frag}</div>
        <ul>
          {items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default async function Home() {
  const session = await getSession();
  const signedIn = Boolean(session);
  const primaryHref = signedIn ? "/dashboard" : "/register";
  const primaryLabel = signedIn ? "В дашборд" : "Создать аккаунт";

  const headline = (
    <>
      <span className="line">
        <span data-line style={i(0)}>
          IT-задачи
        </span>
      </span>
      <span className="line">
        <span data-line style={i(1)}>
          сеньорам
        </span>
      </span>
    </>
  );

  return (
    <div className="lp" id="top">
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      <LandingMotion />

      {/* ---- hero: waterline ---- */}
      <header className="lp-hero">
        <nav className="lp-nav" aria-label="Главное меню">
          <Link href="/" className="mark">
            GIGLY
          </Link>
          <div className="right">
            {session ? (
              <>
                <form action={logoutUser}>
                  <button type="submit" className="plain link">
                    Выйти
                  </button>
                </form>
                <Link href="/dashboard" className="lp-btn small">
                  В дашборд
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="link">
                  Войти
                </Link>
                <Link href="/register" className="lp-btn small">
                  Создать аккаунт
                </Link>
              </>
            )}
          </div>
        </nav>
        <div className="field field-a" />
        <h1 className="head display lines">{headline}</h1>
        <div className="field field-b">
          <p className="lead" data-load>
            Gigly: компания ставит задачу с критериями приёмки, Middle+ или Senior специалист берёт её и сдаёт. Оплата после приёмки.
          </p>
        </div>
      </header>

      {/* ---- chapter: clarity before the start (paper) ---- */}
      <section className="lp-features on-paper" aria-labelledby="lp-f">
        <div className="wrap grid">
          <h2 id="lp-f" className="display">
            Ясно до старта
          </h2>
          <div className="blocks">
            <Block
              title="Критерии приёмки"
              frag={<CriteriaFragment />}
              items={[
                "Обязательное поле при создании гига",
                "Каждый пункт можно проверить",
                "Специалист видит их до отклика",
                "По ним же принимается работа",
              ]}
            />
            <Block
              title="Отклик по делу"
              frag={<ApplyFragment />}
              items={[
                "Подход к задаче вместо сопроводительного письма",
                "Вопросы к постановке, пока не поздно",
                "Оценка срока в днях",
                "Один отклик на гиг от специалиста",
              ]}
            />
            <Block
              title="Один исполнитель"
              frag={<ApplicantsFragment />}
              items={[
                "Заказчик принимает один отклик",
                "Остальные закрываются автоматически",
                "Гиг переходит в статус «В работе»",
                "Чат открывается прямо на гиге",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ---- chapter: the gig's path, one card in four fields ---- */}
      <section className="lp-strip" aria-labelledby="lp-s">
        <div className="f f1" data-reveal>
          <h2 id="lp-s" data-i style={i(0)}>
            Путь гига
          </h2>
          <div className="slot" data-i style={i(1)}>
            <GigCardFragment stage="open" />
          </div>
          <p className="clause" data-i style={i(2)}>
            Сначала гиг открыт: идут отклики.
          </p>
        </div>
        <div className="f f2" data-reveal>
          <div className="slot" data-i style={i(0)}>
            <GigCardFragment stage="in-progress" />
          </div>
          <p className="clause" data-i style={i(1)}>
            Потом его берёт один специалист.
          </p>
        </div>
        <div className="f f3" data-reveal>
          <div className="slot" data-i style={i(0)}>
            <GigCardFragment stage="verification" />
          </div>
          <p className="clause" data-i style={i(1)}>
            Затем работа уходит на проверку.
          </p>
        </div>
        <div className="f f4" data-reveal>
          <div className="slot" data-i style={i(0)}>
            <GigCardFragment stage="paid" />
          </div>
          <p className="clause" data-i style={i(1)}>
            Наконец заказчик принимает и платит.
          </p>
        </div>
      </section>

      {/* ---- chapter: the fee, very large, with the live figure ---- */}
      <section className="lp-fee" aria-labelledby="lp-p">
        <div className="wrap grid">
          <div className="intro" data-reveal>
            <h2 id="lp-p" data-i style={i(0)}>
              Сервисный сбор
            </h2>
            <p data-i style={i(1)}>
              Заказчик платит бюджет гига и сервисный сбор {SERVICE_FEE_PCT_LABEL} сверх него. Специалист получает бюджет целиком, без вычетов. Оплата отмечается на гиге после приёмки работы.
            </p>
          </div>
          <LandingFee session={signedIn} />
        </div>
      </section>

      {/* ---- chapter: who it is for (paper) ---- */}
      <section className="lp-about on-paper" aria-labelledby="lp-a">
        <div className="wrap">
          <div className="row" data-reveal>
            <div data-i style={i(0)}>
              <h2 id="lp-a">Для кого</h2>
              <p className="story">
                Для команд, у которых работы больше, чем рук: продуктовых компаний и стартапов, где задачу нужно было сдать вчера, а сильного сеньора в штате нет.
              </p>
              <p className="story">
                И для специалистов с основной работой, которые упёрлись в потолок зарплаты и хотят брать ограниченные, хорошо оплаченные задачи без увольнения и выгорания.
              </p>
            </div>
            <dl className="facts" data-i style={i(1)}>
              <div>
                <dt>Заказчики</dt>
                <dd>Компании и ИП, команды 10–100 человек</dd>
              </div>
              <div>
                <dt>Специалисты</dt>
                <dd>Middle+ и Senior, от 5 лет опыта</dd>
              </div>
              <div>
                <dt>Бюджет гига</dt>
                <dd>От 10 000 ₽, обычно 150–200 тысяч</dd>
              </div>
              <div>
                <dt>Рынок</dt>
                <dd>Россия, расчёты в рублях</dd>
              </div>
            </dl>
          </div>
          <div className="row" data-reveal>
            <span className="word" data-i style={i(0)}>
              Правила
            </span>
            <ul className="rules" data-i style={i(1)}>
              <li>Один отклик на гиг от специалиста</li>
              <li>Отклики только на открытые гиги</li>
              <li>Принят один отклик, остальные закрываются</li>
              <li>Сдать работу может только исполнитель</li>
              <li>Принять работу может только заказчик</li>
              <li>Спор разбирает администратор</li>
              <li>Оплата отмечается вручную: платёжного шлюза нет</li>
              <li>Гиг от 10 000 ₽, крупный проект делится на несколько</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---- close: the idea again, on the hero's blue ---- */}
      <section className="lp-cta" aria-labelledby="lp-c" data-reveal>
        <h2 id="lp-c" className="display" data-i style={i(0)}>
          Поставьте задачу
          <br />
          или возьмите её
        </h2>
        <div className="foot">
          <p data-i style={i(1)}>
            Регистрация занимает минуту: роль, профиль, и первый гиг можно создать или взять сразу.
          </p>
          <div className="act" data-i style={i(2)}>
            <Link href={primaryHref} className="lp-btn dark">
              {primaryLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* ---- footer: the name first ---- */}
      <footer className="lp-footer" data-reveal>
        <svg className="name" viewBox="0 0 1000 190" role="img" aria-label="Gigly" data-i style={i(0)}>
          <text x="0" y="178" textLength="1000" lengthAdjust="spacingAndGlyphs" fontFamily="Handjet, monospace" fontWeight="700" fontSize="240" fill="#ffffff">
            GIGLY
          </text>
        </svg>
        <div className="rows" data-i style={i(1)}>
          <div className="big">
            <Link className="link" href="/help">
              Помощь
            </Link>
            <Link className="link" href="/terms">
              Условия пользования
            </Link>
            <Link className="link" href="/privacy">
              Политика конфиденциальности
            </Link>
          </div>
          <div className="small">
            {session ? (
              <>
                <Link className="link" href="/dashboard">
                  Дашборд
                </Link>
                <Link className="link" href="/gigs/new">
                  Создать гиг
                </Link>
              </>
            ) : (
              <>
                <Link className="link" href="/login">
                  Войти
                </Link>
                <Link className="link" href="/register">
                  Создать аккаунт
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="legal" data-i style={i(2)}>
          <span>© 2026 Gigly</span>
          <a href="#top" className="link">
            Наверх
          </a>
        </div>
      </footer>
    </div>
  );
}
