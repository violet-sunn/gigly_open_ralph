'use client'

import { useActionState, useState, useRef, useEffect, Suspense } from 'react'
import { useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import { registerUser } from '@/app/actions/auth'
import { SpecialistIcon, ClientIcon } from '@/lib/assets'
import { AuthContainer, LogoHeader, RoleCard, AuthButton } from '@/components/auth'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <AuthButton
      type="submit"
      variant="primary"
      disabled={pending}
    >
      {pending ? 'Signing up...' : 'Зарегестрироватся'}
    </AuthButton>
  )
}

function RegisterForm() {
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role')
  const [state, formAction] = useActionState(registerUser, null)
  const [selectedRole, setSelectedRole] = useState<'CLIENT' | 'SPECIALIST' | null>(null)
  const clientRadioRef = useRef<HTMLInputElement>(null)
  const specialistRadioRef = useRef<HTMLInputElement>(null)

  const handleRoleClick = (role: 'CLIENT' | 'SPECIALIST') => {
    setSelectedRole(role)
    if (role === 'CLIENT' && clientRadioRef.current) {
      clientRadioRef.current.checked = true
    } else if (role === 'SPECIALIST' && specialistRadioRef.current) {
      specialistRadioRef.current.checked = true
    }
  }

  useEffect(() => {
    if (roleParam === 'SPECIALIST' || roleParam === 'CLIENT') {
      handleRoleClick(roleParam)
    }
  }, [roleParam])

  return (
    <div className="bg-[#01030e] min-h-screen flex items-center justify-center relative overflow-hidden px-4">
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

      {/* Auth Container */}
      <div className="bg-[#060813] border border-[#242935] rounded-[25px] w-[90vw] md:w-[418px] min-h-[540px] p-[20px] md:p-[40px] z-10 relative">
        <div className="flex flex-col gap-[47px]">
          {/* Logo Header */}
          <div className="flex flex-col gap-[30px] items-center">
            <LogoHeader />

            <div className="flex flex-col gap-[30px] items-center w-full">
              {/* Heading */}
              <h2 className="text-[22px] font-semibold text-white text-center">
                Регистрация
              </h2>

              {/* Registration Form */}
              <form action={formAction} className="w-full flex flex-col gap-[21px]">
                <div className="w-full flex flex-col gap-[17px]" role="radiogroup" aria-label="Select your role">
                  <input
                    ref={clientRadioRef}
                    type="radio"
                    name="role"
                    value="CLIENT"
                    required
                    className="sr-only"
                  />
                  <div
                    onClick={() => handleRoleClick('CLIENT')}
                    data-testid="role-client"
                    className={`
                      cursor-pointer
                      w-full
                      flex items-center gap-[24px]
                      px-[20px] py-[20px]
                      rounded-[20px]
                      bg-[#10121c]
                      transition-all duration-200
                      ${selectedRole === 'CLIENT' ? 'border-2 border-[#0265dc]' : 'border-2 border-transparent'}
                      ${selectedRole !== 'CLIENT' ? 'hover:border-[#242935]' : ''}
                    `}
                  >
                    <div className="w-[32px] h-[32px] flex-shrink-0 flex items-center justify-center">
                      <ClientIcon className="w-[32px] h-[32px]" />
                    </div>
                    <span className="text-[17px] leading-[32px] text-white whitespace-nowrap">
                      Профиль Компании
                    </span>
                  </div>

                  <input
                    ref={specialistRadioRef}
                    type="radio"
                    name="role"
                    value="SPECIALIST"
                    required
                    className="sr-only"
                  />
                  <div
                    onClick={() => handleRoleClick('SPECIALIST')}
                    data-testid="role-specialist"
                    className={`
                      cursor-pointer
                      w-full
                      flex items-center gap-[24px]
                      px-[20px] py-[20px]
                      rounded-[20px]
                      bg-[#10121c]
                      transition-all duration-200
                      ${selectedRole === 'SPECIALIST' ? 'border-2 border-[#0265dc]' : 'border-2 border-transparent'}
                      ${selectedRole !== 'SPECIALIST' ? 'hover:border-[#242935]' : ''}
                    `}
                  >
                    <div className="w-[32px] h-[32px] flex-shrink-0 flex items-center justify-center">
                      <SpecialistIcon className="w-[32px] h-[32px]" />
                    </div>
                    <span className="text-[17px] leading-[32px] text-white whitespace-nowrap">
                      Профиль специалиста
                    </span>
                  </div>
                </div>

                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-[20px] py-[20px] bg-[#10121c] border border-[#242935] text-white rounded-[20px] placeholder:text-neutral-weak focus:outline-none focus:ring-2 focus:ring-[#0088ff] focus:border-[#0088ff]"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-[20px] py-[20px] bg-[#10121c] border border-[#242935] text-white rounded-[20px] placeholder:text-neutral-weak focus:outline-none focus:ring-2 focus:ring-[#0088ff] focus:border-[#0088ff]"
                    placeholder="••••••••"
                  />
                </div>

                {state?.error && (
                  <p className="text-sm text-danger-default">{state.error}</p>
                )}

                <div className="w-full flex flex-col gap-[21px]">
                  <SubmitButton />

                  <AuthButton
                    type="button"
                    variant="secondary"
                    onClick={() => window.location.href = '/login'}
                  >
                    Войти
                  </AuthButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#01030e] min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
