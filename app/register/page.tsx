'use client'

import { useActionState, useState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
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
      {pending ? 'Signing up...' : 'Sign up'}
    </AuthButton>
  )
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, null)
  const [selectedRole, setSelectedRole] = useState<'CLIENT' | 'SPECIALIST' | null>(null)
  const clientRadioRef = useRef<HTMLInputElement>(null)
  const specialistRadioRef = useRef<HTMLInputElement>(null)

  const handleRoleClick = (role: 'CLIENT' | 'SPECIALIST') => {
    setSelectedRole(role)
    // Programmatically check the radio input
    if (role === 'CLIENT' && clientRadioRef.current) {
      clientRadioRef.current.checked = true
    } else if (role === 'SPECIALIST' && specialistRadioRef.current) {
      specialistRadioRef.current.checked = true
    }
  }

  return (
    <AuthContainer>
      <div className="w-full h-full flex flex-col gap-[47px] items-start p-[40px]">
        <div className="w-full flex flex-col gap-[30px] items-center justify-center">
          <LogoHeader />

          <div className="w-full flex flex-col gap-[30px] items-center">
            <h2 className="text-[22px] font-semibold text-white text-center">
              Create your account
            </h2>

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
                    bg-surface-level-2
                    transition-all duration-200
                    ${selectedRole === 'CLIENT' ? 'border-2 border-border-brand-default' : 'border-2 border-transparent'}
                    ${selectedRole !== 'CLIENT' ? 'hover:border-border-neutral-weak' : ''}
                  `}
                >
                  <div className="w-[32px] h-[32px] flex-shrink-0 flex items-center justify-center">
                    <ClientIcon className="w-[32px] h-[32px]" />
                  </div>
                  <span className="text-[17px] leading-[32px] text-neutral-strong whitespace-nowrap">
                    Client
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
                    bg-surface-level-2
                    transition-all duration-200
                    ${selectedRole === 'SPECIALIST' ? 'border-2 border-border-brand-default' : 'border-2 border-transparent'}
                    ${selectedRole !== 'SPECIALIST' ? 'hover:border-border-neutral-weak' : ''}
                  `}
                >
                  <div className="w-[32px] h-[32px] flex-shrink-0 flex items-center justify-center">
                    <SpecialistIcon className="w-[32px] h-[32px]" />
                  </div>
                  <span className="text-[17px] leading-[32px] text-neutral-strong whitespace-nowrap">
                    Specialist
                  </span>
                </div>
              </div>

              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-surface-level-2 border border-border-neutral-weak text-white rounded-[10px] placeholder:text-neutral-weak focus:outline-none focus:ring-2 focus:ring-border-brand-default focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-surface-level-2 border border-border-neutral-weak text-white rounded-[10px] placeholder:text-neutral-weak focus:outline-none focus:ring-2 focus:ring-border-brand-default focus:border-transparent"
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
                  Already have an account? Sign in
                </AuthButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthContainer>
  )
}
