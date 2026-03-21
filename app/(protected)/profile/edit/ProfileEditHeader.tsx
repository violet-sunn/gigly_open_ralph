interface ProfileEditHeaderProps {
  displayName: string | null
  email: string
  role: 'CLIENT' | 'SPECIALIST'
}

export default function ProfileEditHeader({ displayName, email, role }: ProfileEditHeaderProps) {
  const initial = displayName ? displayName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()
  const name = displayName || email
  const roleLabel = role === 'SPECIALIST' ? 'Specialist' : 'Client'

  return (
    <div className="flex items-start gap-6 bg-surface-level-1 border border-neutral-weak rounded-lg p-6 mb-6 shadow-md">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
        {initial}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-white">{name}</h1>
        <p className="text-neutral-strong mt-1">{roleLabel}</p>
      </div>
    </div>
  )
}
