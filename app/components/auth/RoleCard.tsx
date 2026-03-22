interface RoleCardProps {
  role: 'SPECIALIST' | 'CLIENT';
  selected: boolean;
  onClick: () => void;
}

export default function RoleCard({ role, selected, onClick }: RoleCardProps) {
  const isSpecialist = role === 'SPECIALIST';

  return (
    <button
      onClick={onClick}
      className={`
        bg-[#10121c] rounded-[20px] px-[20px] py-[20px]
        flex items-center gap-[24px]
        w-full transition-all
        hover:opacity-90
        focus:outline-none focus:ring-2 focus:ring-[#0265dc] focus:ring-offset-2 focus:ring-offset-[#060813]
        ${selected ? 'border-2 border-[#0265dc]' : 'border-2 border-transparent'}
      `}
      type="button"
      aria-pressed={selected}
    >
      {/* Icon */}
      <div className="shrink-0 w-[32px] h-[32px]">
        {isSpecialist ? (
          // User icon for Specialist
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="10" r="5" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M6 26C6 21.5817 9.58172 18 14 18H18C22.4183 18 26 21.5817 26 26" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
        ) : (
          // Briefcase icon for Client
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="11" width="24" height="15" rx="2" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M11 11V8C11 6.89543 11.8954 6 13 6H19C20.1046 6 21 6.89543 21 8V11" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M4 16H28" stroke="white" strokeWidth="2"/>
          </svg>
        )}
      </div>

      {/* Text */}
      <p className="text-[17px] text-white leading-[32px] whitespace-nowrap">
        {isSpecialist ? 'Профиль специалиста' : 'Профиль Компании'}
      </p>
    </button>
  );
}
