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
        <div className="min-h-screen bg-navy-900 py-8">
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

    return (
      <div className="min-h-screen bg-navy-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Card with Avatar and Stats */}
          <div className="flex items-start gap-6 bg-navy-800 border border-gray-700 rounded-lg p-6 mb-6 shadow-md">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : session.email.charAt(0).toUpperCase()}
            </div>

            {/* Info and Stats */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{profile.displayName || session.email}</h1>
              <p className="text-gray-300 mt-1">{profile.experienceLevel || 'Specialist'}</p>

              {/* Stats Row */}
              <div className="flex gap-8 mt-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">5.0 ⭐</span>
                  <span className="text-sm text-gray-400">Rating</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">0</span>
                  <span className="text-sm text-gray-400">Завершено задач</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">0%</span>
                  <span className="text-sm text-gray-400">повторных заказов</span>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href="/profile/edit"
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Experience */}
            <div className="bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Опыт работы</h2>
                <Link href="/profile/edit" className="text-sm text-blue-500 hover:text-blue-400">
                  Добавить
                </Link>
              </div>
              <div className="space-y-4">
                {profile.bio ? (
                  <div className="border-l-2 border-blue-500 pl-4">
                    <h3 className="font-medium text-white">Bio</h3>
                    <p className="text-gray-300 text-sm mt-1 whitespace-pre-wrap">{profile.bio}</p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Добавьте опыт работы, чтобы повысить доверие</p>
                )}
                {profile.techStack && (
                  <div className="border-l-2 border-blue-500 pl-4">
                    <h3 className="font-medium text-white">Tech Stack</h3>
                    <p className="text-gray-300 text-sm mt-1">{profile.techStack}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Featured Projects */}
            <div className="bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Избранные проекты</h2>
                <Link href="/profile/edit" className="text-sm text-blue-500 hover:text-blue-400">
                  Добавить
                </Link>
              </div>
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">Добавьте опыт работы, чтобы повысить доверие</p>
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
        <div className="min-h-screen bg-navy-900 py-8">
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
      <div className="min-h-screen bg-navy-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Card with Avatar and Stats */}
          <div className="flex items-start gap-6 bg-navy-800 border border-gray-700 rounded-lg p-6 mb-6 shadow-md">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {profile.companyName ? profile.companyName.charAt(0).toUpperCase() : session.email.charAt(0).toUpperCase()}
            </div>

            {/* Info and Stats */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{profile.companyName || session.email}</h1>
              <p className="text-gray-300 mt-1">Client</p>

              {/* Stats Row */}
              <div className="flex gap-8 mt-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">5.0 ⭐</span>
                  <span className="text-sm text-gray-400">Rating</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">0</span>
                  <span className="text-sm text-gray-400">Опубликовано заказов</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">0</span>
                  <span className="text-sm text-gray-400">Завершено</span>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href="/profile/edit"
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Company Information */}
            <div className="bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Информация о компании</h2>
                <Link href="/profile/edit" className="text-sm text-blue-500 hover:text-blue-400">
                  Редактировать
                </Link>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">INN</label>
                  <p className="mt-1 text-white">{profile.inn}</p>
                </div>
                {profile.kpp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400">KPP</label>
                    <p className="mt-1 text-white">{profile.kpp}</p>
                  </div>
                )}
                {profile.contactPerson && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Contact Person</label>
                    <p className="mt-1 text-white">{profile.contactPerson}</p>
                  </div>
                )}
                {profile.phoneNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Phone Number</label>
                    <p className="mt-1 text-white">{profile.phoneNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Active Projects */}
            <div className="bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Активные проекты</h2>
                <Link href="/gigs/new" className="text-sm text-blue-500 hover:text-blue-400">
                  Создать заказ
                </Link>
              </div>
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">У вас пока нет активных проектов</p>
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
    <div className="min-h-screen bg-navy-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <p className="text-white">Unknown role</p>
      </div>
    </div>
  )
}
