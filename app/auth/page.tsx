'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RoleCard from '@/app/components/auth/RoleCard';
import AuthButton from '@/app/components/auth/AuthButton';

export default function AuthPage() {
  const [selectedRole, setSelectedRole] = useState<'SPECIALIST' | 'CLIENT' | null>(null);
  const router = useRouter();

  const handleLogin = () => {
    if (selectedRole) {
      router.push(`/login?role=${selectedRole}`);
    }
  };

  const handleRegister = () => {
    if (selectedRole) {
      router.push(`/register?role=${selectedRole}`);
    }
  };

  return (
    <div className="bg-[#01030e] min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none">
        <svg width="100%" height="327" viewBox="0 0 1909 327" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <pattern id="checkerboard" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="20" height="20" fill="#0088ff" opacity="0.3"/>
            <rect x="20" y="20" width="20" height="20" fill="#0088ff" opacity="0.3"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#checkerboard)"/>
        </svg>
      </div>

      {/* Main card */}
      <div className="bg-[#060813] border border-[#242935] rounded-[25px] w-[90vw] md:w-[418px] p-[40px] z-10 relative">
        <div className="flex flex-col gap-[47px]">
          {/* Logo header */}
          <div className="flex justify-center">
            <div className="bg-[rgba(49,54,67,0.5)] px-[7px] py-[9px] rounded-[10px]">
              <svg width="146" height="29" viewBox="0 0 146 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="10" y="22" fill="white" fontSize="24" fontWeight="600" fontFamily="monospace">GIGLY</text>
              </svg>
            </div>
          </div>

          {/* Content section */}
          <div className="flex flex-col gap-[30px]">
            {/* Title */}
            <h1 className="text-[22px] font-semibold text-white text-center">
              Вход
            </h1>

            {/* Role cards */}
            <div className="flex flex-col gap-[17px]">
              <RoleCard
                role="SPECIALIST"
                selected={selectedRole === 'SPECIALIST'}
                onClick={() => setSelectedRole('SPECIALIST')}
                data-testid="role-specialist"
              />
              <RoleCard
                role="CLIENT"
                selected={selectedRole === 'CLIENT'}
                onClick={() => setSelectedRole('CLIENT')}
                data-testid="role-client"
              />
            </div>
          </div>

          {/* Buttons section */}
          <div className="flex flex-col gap-[21px]">
            <AuthButton
              variant="primary"
              disabled={!selectedRole}
              onClick={handleLogin}
            >
              Войти
            </AuthButton>
            <AuthButton
              variant="secondary"
              disabled={!selectedRole}
              onClick={handleRegister}
            >
              Зарегестрироватся
            </AuthButton>
          </div>
        </div>
      </div>
    </div>
  );
}
