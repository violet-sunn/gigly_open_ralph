import Link from 'next/link';

interface ClientProfile {
  companyName: string;
  inn: string;
  kpp?: string;
  contactPerson?: string;
  phoneNumber?: string;
}

interface SpecialistProfile {
  displayName?: string;
  techStack?: string;
  experienceLevel?: string;
  bio?: string;
  hourlyRate?: number;
}

interface ProfileCompletionCardProps {
  role: 'CLIENT' | 'SPECIALIST';
  profile: ClientProfile | SpecialistProfile | null;
}

export default function ProfileCompletionCard({
  role,
  profile,
}: ProfileCompletionCardProps) {
  // Calculate completion percentage based on role
  let percentage = 0;

  if (role === 'CLIENT') {
    const clientProfile = profile as ClientProfile | null;
    let filledFields = 0;
    const totalFields = 2;

    if (clientProfile?.companyName?.trim()) filledFields++;
    if (clientProfile?.inn?.trim()) filledFields++;

    percentage = Math.round((filledFields / totalFields) * 100);
  } else {
    const specialistProfile = profile as SpecialistProfile | null;
    let filledFields = 0;
    const totalFields = 4;

    if (specialistProfile?.displayName?.trim()) filledFields++;
    if (specialistProfile?.techStack?.trim()) filledFields++;
    if (specialistProfile?.experienceLevel?.trim()) filledFields++;
    if (specialistProfile?.bio?.trim()) filledFields++;

    percentage = Math.round((filledFields / totalFields) * 100);
  }

  // Hide card when profile is complete
  if (percentage === 100) {
    return null;
  }

  // Determine progress bar color based on percentage
  let barColor = 'bg-error-500';
  if (percentage >= 67) {
    barColor = 'bg-blue-500';
  } else if (percentage >= 34) {
    barColor = 'bg-warning-500';
  }

  return (
    <div className="border border-neutral-weak rounded-lg p-6 bg-surface-level-1 shadow-sm mb-6">
      <h3 className="text-lg font-semibold text-white mb-3">
        Complete Your Profile
      </h3>

      <div className="mb-3">
        <div className="w-full bg-surface-level-2 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-neutral-default mb-4">{percentage}% complete</p>

      <Link
        href="/profile/edit"
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors text-sm"
      >
        Complete Profile
      </Link>
    </div>
  );
}
