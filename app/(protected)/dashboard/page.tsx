import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { getClientDashboard, getSpecialistDashboard } from '@/lib/view-models'
import { DashboardDesign, type DashboardVM } from './DashboardDesign'

// Role-gating redirect notices, Russianized (the dashboard is rebuilt on the gigly_full_design prototype).
const ERROR_MESSAGES: Record<string, string> = {
  'browse-gigs-specialists-only':
    'Поиск гигов доступен только специалистам. Как заказчик, вы публикуете гиги и управляете откликами.',
  'gigs-specialists-only': 'Поиск гигов доступен только специалистам.',
  'gig-creation-clients-only': 'Создание гигов доступно только заказчикам.',
  'admin-access-required': 'Требуется доступ администратора.',
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  const params = await searchParams
  const errorParam = typeof params.error === 'string' ? params.error : undefined
  const errorMessage = errorParam ? ERROR_MESSAGES[errorParam] : null

  let vm: DashboardVM | null = null
  if (session.role === 'CLIENT') {
    const d = await getClientDashboard(session.userId)
    vm = {
      role: 'CLIENT',
      completion: d.completion,
      onboarding: d.onboarding,
      // Client tab filter: rawStatus (PAID folds into the «Завершённые» / COMPLETED tab).
      gigCards: d.gigCards.map((g) => ({ ...g, filterKey: g.rawStatus === 'PAID' ? 'COMPLETED' : g.rawStatus })),
      tabs: d.tabs,
      attention: [],
      messages: d.messages.conversations,
    }
  } else if (session.role === 'SPECIALIST') {
    const d = await getSpecialistDashboard(session.userId)
    vm = {
      role: 'SPECIALIST',
      completion: d.completion,
      onboarding: d.onboarding,
      gigCards: d.gigCards.map((g) => ({ ...g, filterKey: g.tabKey })),
      tabs: d.tabs,
      attention: d.attention,
      messages: d.messages.conversations,
    }
  }

  if (!vm) {
    return (
      <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-8 text-center shadow-md">
        <h2 className="text-2xl font-bold text-white">Личный кабинет</h2>
        <p className="mt-2 text-sm text-neutral-strong">Вы вошли как {session.email}</p>
        <p className="mt-4 text-sm text-warning-400">Роль аккаунта не распознана. Обратитесь в поддержку.</p>
      </div>
    )
  }

  return (
    <>
      {errorMessage && (
        <div
          style={{
            marginBottom: 16,
            borderRadius: 8,
            background: 'rgba(245,158,11,0.1)',
            boxShadow: 'inset 0 0 0 1px rgba(245,158,11,0.3)',
            padding: 14,
          }}
        >
          <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: '#f59e0b' }}>{errorMessage}</span>
        </div>
      )}
      <DashboardDesign vm={vm} />
    </>
  )
}
