import { ReactNode } from 'react';

interface AuthButtonProps {
  variant: 'primary' | 'secondary';
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export default function AuthButton({ variant, children, onClick, disabled = false }: AuthButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full h-[50px] rounded-[10px]
        flex items-center justify-center
        font-medium transition-all
        ${isPrimary
          ? 'bg-[#0088ff] text-white text-[16px]'
          : 'bg-[rgba(0,136,255,0.24)] text-[#1379f3] text-[15px]'
        }
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:opacity-90 cursor-pointer'
        }
        focus:outline-none focus:ring-2 focus:ring-[#0088ff] focus:ring-offset-2 focus:ring-offset-[#060813]
      `}
      type="button"
    >
      {children}
    </button>
  );
}
