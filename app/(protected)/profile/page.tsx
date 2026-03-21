import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  if (session.role === 'SPECIALIST') {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { specialistProfile: true },
    })

    if (!user) {
      redirect('/login')
    }

    if (!user.specialistProfile) {
      return (
        <div className="min-h-screen bg-[var(--bg-surface-level-0)] py-8">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-white mb-8 leading-tight">My Profile</h1>
            <div className="bg-warning-500/10 border border-warning-500/20 rounded-lg p-4 mb-6">
              <p className="text-warning-400">Profile not set up yet</p>
              <Link
                href="/profile/edit"
                className="text-blue-500 hover:text-blue-400 underline"
              >
                Set up your profile
              </Link>
            </div>
          </div>
        </div>
      )
    }

    const profile = user.specialistProfile

    const completedTasks = await prisma.gig.count({
      where: {
        assignedSpecialistId: session.userId,
        status: 'COMPLETED',
      },
    })

    const repeatOrders = await prisma.gig.groupBy({
      by: ['clientId'],
      where: {
        assignedSpecialistId: session.userId,
        status: 'COMPLETED',
      },
      _count: { _all: true },
    })

    const repeatClients = repeatOrders.filter((c) => c._count._all >= 2).length
    const repeatRate = repeatOrders.length > 0 ? Math.round((repeatClients / repeatOrders.length) * 100) : 0

    return (
      <div className="min-h-screen bg-[var(--bg-surface-level-0)] py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Profile hero */}
          <section
            className="flex items-start gap-5 border rounded-[20px] mb-10"
            style={{
              borderColor: 'var(--border-brand-default)',
              backgroundImage: 'var(--gradient-brand)',
            }}
          >
            <div className="bg-white/5 p-5 rounded-l-[20px]">
              <div className="h-[205px] w-[201px] rounded-[15px] border-2 border-white/10 bg-white/5 flex items-center justify-center text-[var(--text-neutral-strong)] text-5xl font-semibold">
                {profile.displayName
                  ? profile.displayName.charAt(0).toUpperCase()
                  : session.email.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="flex-1 px-5 py-8">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <h1 className="text-[35px] leading-[42px] text-[var(--text-neutral-strong)] truncate">
                    {profile.displayName || session.email}
                  </h1>

                  <div className="mt-3 inline-flex items-center justify-center rounded-[40px] bg-[#0367e0] px-5 py-0.5">
                    <p className="text-[21px] font-semibold text-[var(--text-neutral-strong)]">
                      {profile.techStack || profile.experienceLevel || 'Specialist'}
                    </p>
                  </div>
                </div>

                <Link
                  href="/profile/edit"
                  className="shrink-0 rounded-[10px] bg-white px-5 py-2.5 text-[18px] font-semibold text-[var(--text-neutral-inverted)]"
                >
                  Редактировать профиль
                </Link>
              </div>

              {/* Stats pill */}
              <div className="mt-6 flex flex-wrap items-center gap-6 rounded-[30px] bg-black/10 px-5 py-2.5">
                <div className="flex items-center gap-2 text-[21px] text-white/80">
                  <span className="font-medium">5.0</span>
                  <span aria-hidden>★</span>
                </div>

                <div className="flex items-center gap-4 text-[20px] leading-7 text-[var(--text-neutral-strong)]">
                  <span>Завершено задач</span>
                  <span className="text-right">{completedTasks}</span>
                </div>

                <div className="flex items-center gap-4 text-[20px] leading-7 text-[var(--text-neutral-strong)]">
                  <span>повторных заказов</span>
                  <span className="text-right">{repeatRate}%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-[var(--bg-surface-level-1)] border border-[var(--border-neutral-weak)] rounded-[20px] shadow-md">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-[22px] font-medium text-[var(--text-neutral-strong)]">Опыт работы</h2>
                  <Link
                    href="/profile/edit"
                    className="text-[16px] font-medium text-[var(--text-brand-default)]"
                  >
                    Редактировать
                  </Link>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="bg-[var(--bg-surface-level-2)] border border-[var(--border-neutral-strong)] rounded-[10px] p-5">
                    {profile.bio ? (
                      <p className="text-[16px] font-medium text-[var(--text-neutral-weak)] whitespace-pre-wrap">
                        {profile.bio}
                      </p>
                    ) : (
                      <p className="text-[16px] font-medium text-[var(--text-neutral-weak)]">
                        Добавьте опыт работы, чтобы повысить доверие
                      </p>
                    )}
                  </div>

                  {profile.techStack && (
                    <div className="bg-[var(--bg-surface-level-2)] border border-[var(--border-neutral-strong)] rounded-[10px] p-5">
                      <p className="text-[16px] font-medium text-[var(--text-neutral-weak)]">{profile.techStack}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-[var(--bg-surface-level-1)] border border-[var(--border-neutral-weak)] rounded-[20px] shadow-md">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-[22px] font-medium text-[var(--text-neutral-strong)]">Избранные проекты</h2>
                  <Link
                    href="/profile/edit"
                    className="text-[16px] font-medium text-[var(--text-brand-default)]"
                  >
                    Редактировать
                  </Link>
                </div>

                <div className="mt-5 rounded-[10px] bg-[var(--bg-surface-level-2)] border border-[var(--border-neutral-strong)] p-5">
                  <p className="text-[16px] font-medium text-[var(--text-neutral-weak)]">
                    Добавьте проекты, чтобы повысить доверие
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  } else if (session.role === 'CLIENT') {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { clientProfile: true },
    })

    if (!user) {
      redirect('/login')
    }

    if (!user.clientProfile) {
      return (
        <div className="min-h-screen bg-[var(--bg-surface-level-0)] py-8">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-white mb-8 leading-tight">My Profile</h1>
            <div className="bg-warning-500/10 border border-warning-500/20 rounded-lg p-4 mb-6">
              <p className="text-warning-400">Profile not set up yet</p>
              <Link
                href="/profile/edit"
                className="text-blue-500 hover:text-blue-400 underline"
              >
                Set up your profile
              </Link>
            </div>
          </div>
        </div>
      )
    }

    const profile = user.clientProfile

    return (
      <div className="min-h-screen bg-[var(--bg-surface-level-0)] py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Card with Avatar and Stats */}
          <div className="flex items-start gap-6 bg-surface-level-1 border border-neutral-weak rounded-lg p-6 mb-6 shadow-md">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {profile.companyName ? profile.companyName.charAt(0).toUpperCase() : session.email.charAt(0).toUpperCase()}
            </div>

            {/* Info and Stats */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{profile.companyName || session.email}</h1>
              <p className="text-neutral-strong mt-1">Client</p>

              {/* Stats Row */}
              <div className="flex gap-8 mt-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">5.0 ⭐</span>
                  <span className="text-sm text-neutral-weak">Rating</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">0</span>
                  <span className="text-sm text-neutral-weak">Опубликовано заказов</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">0</span>
                  <span className="text-sm text-neutral-weak">Завершено</span>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href="/profile/edit"
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-surface-level-0"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Company Information */}
            <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Информация о компании</h2>
                <Link href="/profile/edit" className="text-sm text-blue-500 hover:text-blue-400">
                  Редактировать
                </Link>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-weak">INN</label>
                  <p className="mt-1 text-white">{profile.inn}</p>
                </div>
                {profile.kpp && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-weak">KPP</label>
                    <p className="mt-1 text-white">{profile.kpp}</p>
                  </div>
                )}
                {profile.contactPerson && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-weak">Contact Person</label>
                    <p className="mt-1 text-white">{profile.contactPerson}</p>
                  </div>
                )}
                {profile.phoneNumber && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-weak">Phone Number</label>
                    <p className="mt-1 text-white">{profile.phoneNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Active Projects */}
            <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Активные проекты</h2>
                <Link href="/gigs/new" className="text-sm text-blue-500 hover:text-blue-400">
                  Создать заказ
                </Link>
              </div>
              <div className="text-center py-8">
                <p className="text-neutral-weak text-sm">У вас пока нет активных проектов</p>
                <div className="mt-4 text-gray-600">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-surface-level-0)] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <p className="text-white">Unknown role</p>
      </div>
    </div>
  )
}
