import Link from 'next/link'
import { getSession } from '@/lib/session'
import { logoutUser } from '@/app/actions/auth'
import './_design/tokens.css'

const MONO = "'Handjet',monospace"
const GROTESK = "'Manrope',sans-serif"

const FEATURES = [
  { t: 'Чёткие задачи', d: 'Заказчики описывают задачу с критериями приёмки — специалисты откликаются по делу.' },
  { t: 'Прозрачная сделка', d: 'Весь путь от отклика до оплаты в одном месте: статусы, чат, приёмка работы.' },
  { t: 'Проверенные специалисты', d: 'Middle+ и Senior разработчики с профилями, стеком и отзывами.' },
]

export default async function Home() {
  const session = await getSession()

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--surface-app)', color: 'var(--text-1)', fontFamily: GROTESK }}>
      {/* top bar */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 40px', boxSizing: 'border-box' }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 2 }}>GIGLY</span>
        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{session.email}</span>
            <form action={logoutUser}>
              <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--om-accent)', fontSize: 14, cursor: 'pointer', fontFamily: GROTESK }}>Выйти</button>
            </form>
          </div>
        ) : (
          <Link href="/login" style={{ color: 'var(--om-accent)', textDecoration: 'none', fontSize: 15 }}>Войти</Link>
        )}
      </header>

      {/* hero */}
      <main style={{ maxWidth: 920, margin: '0 auto', padding: '64px 24px 40px', boxSizing: 'border-box', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', width: 72, height: 72, borderRadius: 18, background: 'var(--om-accent)', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 46, color: '#fff', marginBottom: 28 }}>G</div>
        <h1 style={{ margin: 0, fontFamily: MONO, fontWeight: 600, fontSize: 52, letterSpacing: 1, lineHeight: 1.05 }}>
          Площадка для IT-задач<br />и специалистов
        </h1>
        <p style={{ margin: '20px auto 0', maxWidth: 620, fontSize: 17, lineHeight: 1.6, color: 'var(--text-3)' }}>
          Gigly соединяет компании и IT-специалистов: понятные задачи, структурированные отклики и прозрачная сделка от постановки до оплаты.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
          {session ? (
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', height: 50, padding: '0 30px', borderRadius: 10, background: 'var(--om-accent)', color: '#fff', fontSize: 16, fontWeight: 500, textDecoration: 'none' }}>
              Перейти в дашборд
            </Link>
          ) : (
            <>
              <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', height: 50, padding: '0 30px', borderRadius: 10, background: 'var(--om-accent)', color: '#fff', fontSize: 16, fontWeight: 500, textDecoration: 'none' }}>
                Создать аккаунт
              </Link>
              <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', height: 50, padding: '0 30px', borderRadius: 10, background: 'var(--surface-sunken)', boxShadow: 'inset 0 0 0 1px var(--hairline-10)', color: 'var(--text-1)', fontSize: 16, fontWeight: 500, textDecoration: 'none' }}>
                Войти
              </Link>
            </>
          )}
        </div>

        {/* feature row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 72, textAlign: 'left' }}>
          {FEATURES.map((f) => (
            <div key={f.t} style={{ borderRadius: 12, background: 'var(--surface-sunken)', padding: 22 }}>
              <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 18 }}>{f.t}</span>
              <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.6, color: 'var(--text-3)' }}>{f.d}</p>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ display: 'flex', justifyContent: 'center', gap: 28, padding: '32px 24px', fontFamily: MONO, fontSize: 13 }}>
        <Link href="/privacy" style={{ color: 'var(--text-3)', textDecoration: 'underline' }}>Политика конфиденциальности</Link>
        <Link href="/terms" style={{ color: 'var(--text-3)', textDecoration: 'underline' }}>Условия пользования</Link>
        <Link href="/help" style={{ color: 'var(--text-3)', textDecoration: 'underline' }}>Помощь</Link>
      </footer>
    </div>
  )
}
