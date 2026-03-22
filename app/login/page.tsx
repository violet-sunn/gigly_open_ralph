'use client'

import { useActionState, Suspense } from 'react'
import { useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loginUser } from '@/app/actions/auth'
import { Logo } from '@/lib/assets'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-[50px] rounded-[10px] bg-[#0088ff] text-white text-[16px] font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0088ff] focus:ring-offset-2 focus:ring-offset-[#060813]"
    >
      {pending ? 'Signing in...' : 'Войти'}
    </button>
  )
}

function RoleCardDisplay({ role, selected }: { role: 'SPECIALIST' | 'CLIENT'; selected: boolean }) {
  const isSpecialist = role === 'SPECIALIST';

  return (
    <div
      className={`
        bg-[#10121c] rounded-[20px] px-[20px] py-[20px]
        flex items-center gap-[24px]
        w-full
        ${selected ? 'border-2 border-[#0265dc]' : 'border-2 border-transparent'}
      `}
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
            <path d="M11 11V8C11 6.89543 11.8954 6 13 6H19C20.1046 6 21 8V11" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M4 16H28" stroke="white" strokeWidth="2"/>
          </svg>
        )}
      </div>

      {/* Text */}
      <p className="text-[17px] text-white leading-[32px] whitespace-nowrap">
        {isSpecialist ? 'Профиль специалиста' : 'Профиль Компании'}
      </p>
    </div>
  );
}

function LoginForm() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') as 'SPECIALIST' | 'CLIENT' | null
  const [state, formAction] = useActionState(loginUser, null)

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
            <div className="bg-[rgba(49,54,67,0.5)] px-[7px] py-[9px] rounded-[10px]">
              <Logo className="h-[29px]" />
            </div>

            <div className="flex flex-col gap-[30px] items-center w-full">
              {/* Heading */}
              <h1 className="text-[22px] font-semibold text-white text-center">
                Вход
              </h1>

              {/* Role Cards - only show if role parameter exists */}
              {role && (role === 'SPECIALIST' || role === 'CLIENT') && (
                <div className="flex flex-col gap-[17px] w-full">
                  <RoleCardDisplay role="SPECIALIST" selected={role === 'SPECIALIST'} />
                  <RoleCardDisplay role="CLIENT" selected={role === 'CLIENT'} />
                </div>
              )}
            </div>
          </div>

          {/* Login Form */}
          <form action={formAction} className="flex flex-col gap-[21px]">
            <div className="flex flex-col gap-[12px]">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email address
                </label>
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
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-[20px] py-[20px] bg-[#10121c] border border-[#242935] text-white rounded-[20px] placeholder:text-neutral-weak focus:outline-none focus:ring-2 focus:ring-[#0088ff] focus:border-[#0088ff]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {state?.error && (
              <p className="text-sm text-error-500">{state.error}</p>
            )}

            <div className="flex flex-col gap-[21px]">
              <SubmitButton />
              <Link
                href="/register"
                className="w-full h-[50px] rounded-[10px] bg-[rgba(0,136,255,0.24)] text-[#1379f3] text-[15px] font-medium flex items-center justify-center transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0088ff] focus:ring-offset-2 focus:ring-offset-[#060813]"
              >
                Зарегестрироватся
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#01030e] min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
